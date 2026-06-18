# WebGL 工作台沙盒背景卡

## 场景

- 一个原本偏工具型的工作台页面，想变得更有记忆点和情绪。
- 用户需要继续操作列表、按钮、任务卡片，但页面又希望拥有“可以玩的空间”。
- 容易误判成“加一张漂亮背景图”或“做一个独立 3D 展示页”，结果业务 UI 和 3D 场景互相抢注意力。

## 关键判断

WebGL 沙盒背景不是装饰贴图，而是页面的情绪底座。业务操作仍然在清晰、半透明的 UI 层完成；3D 场景负责空间感、陪伴感和轻互动。

## 原理

这个模式分三层：

- `WebGL scene`：全屏底层，负责场景、光照、低多边形模型和 OrbitControls。
- `Atmosphere overlay`：中间用 CSS 渐变、薄雾或柔光控制可读性，避免 UI 被场景吃掉。
- `Product UI layer`：最上层放真实业务控件，使用 semi-transparent surface、backdrop blur、稳定 z-index。

核心不是“3D 越多越好”，而是让用户产生“这个工作台有一个小世界”的感觉。

## 稳定解法

- WebGL 容器设为页面绝对定位底层：

```css
.scene-stage {
  position: absolute;
  inset: 0;
  z-index: 0;
  touch-action: none;
}
```

- UI 层显式浮在上方：

```css
.product-layer {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.52);
  backdrop-filter: blur(15px) saturate(1.1);
}
```

- `OrbitControls` 必须限制幅度：

```js
controls.enablePan = false;
controls.minDistance = 7.5;
controls.maxDistance = 18;
controls.minPolarAngle = Math.PI * 0.22;
controls.maxPolarAngle = Math.PI * 0.5;
controls.minAzimuthAngle = -Math.PI * 0.3;
controls.maxAzimuthAngle = Math.PI * 0.3;
```

- 低多边形风格优先使用简单几何体：`BoxGeometry`、`CylinderGeometry`、`ConeGeometry`、`DodecahedronGeometry`，材质开启 `flatShading`。
- 场景元素要和业务情绪一致。代办页适合咖啡店、书桌、露台、温室；监控台适合机房、天台、控制室。
- 3D 代码要独立成组件或独立脚本，不要混进业务数据流。

## 排查命令

```bash
# 静态 docs 站本地预览
python3 -m http.server 4173

# 检查页面是否真的有 canvas
open http://localhost:4173/docs/webgl-scenes.html
```

## 常见误区

- 误区 1：背景太亮或太复杂，任务卡片可读性下降。
- 误区 2：OrbitControls 不限角度，用户一转就把工作台转丢。
- 误区 3：所有鼠标事件都被 UI 层挡住，WebGL 只能看不能玩。
- 误区 4：把场景做成营销 hero，反而削弱工作台效率。

## 可复用样例

- 展示页：`docs/webgl-scenes.html`
- 场景脚本：`docs/assets/webgl-scenes.js`
- 场景样式：`docs/assets/webgl-scenes.css`

## 记忆句

WebGL 工作台背景的目标不是炫 3D，而是让工具页面拥有一个不抢操作的“小世界”。
