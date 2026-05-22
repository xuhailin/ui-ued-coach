# Android 模拟器 DNS 与 Host 头排障卡

## 场景

- Mac 能访问内网域名，例如 `synyi-nurse-mobile-4828-develop.sy`。
- Android 模拟器里的 Flutter App 报错：

```text
SocketException: Failed host lookup: 'synyi-nurse-mobile-4828-develop.sy'
```

- 模拟器可以 ping 通服务 IP，例如 `172.16.127.100`，但不能解析域名。

## 关键判断

这个问题通常不是接口挂了，而是模拟器 DNS 和 macOS DNS 不是同一个环境。

要分三层看：

- DNS：域名解析成哪个 IP。
- TCP/IP：设备能不能连到这个 IP。
- HTTP Host：连到这个 IP 后，网关要把请求转给哪个服务。

## 为什么 IP 直连可能失败

HTTP 请求里除了目标 IP，还有 `Host` 请求头。

访问域名时，请求类似：

```http
GET /api/user/login HTTP/1.1
Host: synyi-nurse-mobile-4828-develop.sy
```

直接访问 IP 时，请求会变成：

```http
GET /api/user/login HTTP/1.1
Host: 172.16.127.100
```

很多内网网关、Ingress、反向代理会复用同一个 IP，并依赖 `Host` 判断要转发到哪个后端服务。IP 直连只到达了网关，没有告诉网关要找哪个服务，所以可能返回 404、502、登录失败或统一的网络错误。

## 稳定解法

当模拟器 DNS 不可靠，但已知域名解析结果时，可以：

- 网络连接层：直接连 IP，例如 `http://172.16.127.100`。
- HTTP 业务层：手动补原始域名的 `Host` 头。

```http
Host: synyi-nurse-mobile-4828-develop.sy
```

这样同时满足：

- 绕过模拟器 DNS。
- 保留后端网关按域名路由所需的信息。

Flutter debug Android 示例：

```dart
appConfig.serverUrl = kDebugMode && Platform.isAndroid
    ? 'http://172.16.127.100'
    : 'http://synyi-nurse-mobile-4828-develop.sy';

final headers = {
  ...?originalHeaders,
  HttpHeaders.hostHeader: 'synyi-nurse-mobile-4828-develop.sy',
};
```

## 排查命令

Mac 侧确认内网 DNS：

```bash
dig @10.0.0.1 synyi-nurse-mobile-4828-develop.sy +short
```

模拟器侧确认失败点：

```bash
adb shell ping -c 1 synyi-nurse-mobile-4828-develop.sy
adb shell ping -c 1 172.16.127.100
adb shell settings get global http_proxy
```

验证 IP + Host 是否可用：

```bash
curl -i \
  -H 'Host: synyi-nurse-mobile-4828-develop.sy' \
  'http://172.16.127.100/api/Version/check-mobile-version?currentVersion=1.1.68'
```

## 记忆句

DNS 负责“名字对应哪个地址”；Host 负责“到这个地址后我要找哪个服务”。
