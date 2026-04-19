# 阅读 · 设计规范 (design.md)

> 生成时间：2026-04-19T16:28:04.793Z
> 基于模板：content-media v2
> StyleBrief：bold / b2c / 阅读 / comfortable
> 稳定性：experimental
> ⚠️ 色板生成经 3 轮尝试仍有部分未通过 WCAG，建议在 Studio 对话中调整后重新导出。

## ✅ 给 AI / Cursor 的使用指令

在修改或新建任何 UI 组件之前，**必须先完整阅读本文件**，并遵守以下规则：

1. **所有 token（颜色 / 字号 / 间距 / 圆角等）必须使用配套 tokens.css 中的 CSS 变量**，禁止硬编码。
2. 遇到 `MUST` 开头的规则：无条件遵守。
3. 遇到 `NEVER` 开头的规则：严禁违反，没有例外。
4. 修改 UI 前先 `grep` 配套 `tokens.css` 确认变量名，避免造成 token 污染。
5. 若需新增组件规范，必须先在设计 Studio 中迭代，再同步到本文件，**不得在代码中自造规则**。

## 资产与写作规则

- **图标体系**：lucide / 1.5px / 尺寸锚点 16 · 20 · 24
- **图标说明**：保持一套线性图标体系；导航、状态、空态图标使用同一 stroke 语言。
- **图像比例**：16:9 · 3:2 · 4:3
- **图像圆角**：图片圆角跟随容器，不另起一套视觉语言。
- **图像阴影**：媒体内容阴影弱于容器阴影，避免抢走信息层级。
- **文案语气**：formal
- **按钮文案**：按钮使用清晰动作动词，先事实后动作，不做情绪包装。
- **错误文案**：错误文案按“发生了什么 / 影响什么 / 你可以怎么做”三段式组织。

## 目录

- 01. 设计原则 *（已定制）* · `extensible`
- 02. Token 系统 *（已定制）* · `experimental`
- 03. 交互状态矩阵 *（已定制）* · `extensible`
- 04. 组件规范 *（已定制）* · `extensible`
- 04a. 表单规范 · `stable`
- 05. 核心模式 *（已定制）* · `extensible`
- 06. 页面模板 *（已定制）* · `extensible`
- 07. 响应式规则 *（已定制）* · `extensible`
- 08. 无障碍规范 *（已定制）* · `extensible`
- 09. 动效规则 *（已定制）* · `experimental`
- 10. 文案规范 *（已定制）* · `experimental`

## 01. 设计原则

> *此板块已基于项目 StyleBrief 定制。*
> 稳定性：`extensible`

### 核心理念
- **克制**：不过度装饰，避免营销页语气，保持专业工作台感。
- **稳定**：通过半透明表面、细边框和轻阴影建立层级。
- **现代**：允许玻璃态质感，但 blur 和渐变必须服务信息结构。
- **专业**：中高信息密度优先，界面要帮助用户更快进入动作。
- **阅读优先**：层级、留白和行长服务于阅读节奏，而不是密集堆料。
- **内容比装饰更重要**：视觉强调应帮助理解结构，不抢走正文注意力。

### ✅ MUST（Do）
- **MUST 透明边框分层**：用半透明表面、细亮边和轻阴影建立层级。
- **MUST 主色只点关键**：品牌蓝仅用于主动作、选中态与关键信息。
- **MUST 保持工作台密度**：压缩间距提屏效，避免营销页式大留白。
- **MUST 为阅读做节奏**：用清晰层级与合适行长让阅读更顺畅。

### ❌ NEVER（Don't）
- **NEVER 别做厚卡片墙**：避免多层实色套娃，破坏内容层次。
- **NEVER 别让 hover 像选中**：悬停只轻提示，选中态必须更明确稳定。
- **NEVER 别把标题当装饰**：标题要信息化，拒绝夸张口号与空洞形容。
- **NEVER 别只靠颜色示警**：状态需同时配合图标、文字或形状变化。

## 核心理念

小晴的界面定位是**长期陪伴型 AI 工作台**，视觉语言在"专业工具"与"温度陪伴"之间取平衡。四条核心原则：**克制、稳定、现代、专业**。

这四条同时成立——任何单独强调一条都会失衡。例如只强调"现代"会走向炫技浮夸；只强调"专业"会走向冷硬不友好。

## 使用边界

- 大部分视觉决策都可以通过"这样做是否更克制 / 更稳定 / 更现代 / 更专业"来自检
- 遇到冲突时，**稳定优先于现代**——宁可少一点装饰，不能牺牲可读性与一致性

## 02. Token 系统

> *此板块已基于项目 StyleBrief 定制。*
> 稳定性：`experimental`

### Typography 规则
- **MUST** 正文可适度放大，优先保证长文阅读舒适度
- **MUST** 标题层级不超过 4 档高强度，避免新闻站式噪音

### Spacing 规则
- **MUST** 阅读场景优先 comfortable / spacious density


本节的 token 值见 frontmatter。以下是使用规则的文字说明。

## Color 使用边界

- `brand` 色只用于关键操作与当前位置指示；频率 ≤ 15%
- `neutral` 承担界面 70%+ 面积，保证整体克制感
- `feedback` 色（success/warning/danger/info）**只出现在状态反馈**，不作品牌色

## Typography 使用边界

- 字号 6 档：`display / headline / title / body / label / caption`
- `body` 作为正文基准（15px），不得小于 14px
- 中英混排优先使用 `Inter` + `PingFang SC` 组合

## Spacing 与 Radius

- Spacing 基数 `4px`，阶梯 9 档（0/4/8/12/16/24/32/40/48）
- Radius 6 档 + pill + bubble；组件映射固定：`button→md`, `card→lg`, `dialog→xl`
- 禁止自造非阶梯值

## 03. 交互状态矩阵

> *此板块已基于项目 StyleBrief 定制。*
> 稳定性：`extensible`

| 状态 | 触发 | 视觉 | 适用组件 |
|------|------|------|----------|
| `default` | 组件静止可用时 | 干净稳重的基础面与常规阴影 | 阅读器内所有可交互控件的基态 |
| `hover` | 指针悬停时 | 轻提亮或轻描边并上浮1px但不抢眼 | 书籍卡片、目录项、按钮与导航项 |
| `pressed` | 按下并未释放时 | 背景略压深并回落以体现按压感 | 主要按钮、购买/加入书架、可点列表项 |
| `focus-visible` | 键盘导航获得焦点时 | 3px高对比focus ring清晰包裹不遮内容 | 搜索框、表单输入、按钮、目录与分页控件 |
| `selected` | 集合内被选中时 | 品牌色描边或胶囊底面突出但克制 | 分类筛选、tabs、分段控件、列表多选项 |
| `current` | 处于当前路由位置时 | 2px侧边指示条配轻品牌底面稳定标识 | 一级导航当前页仅允许出现一处 |
| `open` | 内容区展开或弹层打开时 | 标题不变仅用箭头旋转与内容区显隐表达 | 目录折叠、drawer、accordion、popover |
| `disabled` | 被禁用不可交互时 | 整体降至50%不透明并移除hover/pressed反馈 | 库存不足按钮、不可选选项、只读输入与开关 |
| `loading` | 请求处理中时 | 尺寸不变以骨架或spinner替代内容并降低对比 | 加载书单、翻页拉取、提交表单与购买动作 |
| `error` | 校验或请求失败时 | 危险色描边并配明确短文案提示原因 | 登录注册表单、支付信息、搜索与网络异常提示 |

- **MUST** hover强度必须低于selected且不改变信息层级。
- **MUST** selected只表示集合选中而current只表示路由当前位置且不可互换。
- **MUST** focus-visible必须始终可见且与品牌色有足够对比度。
- **MUST** disabled与loading禁止引起尺寸或布局变化并需阻断重复点击。
- **MUST** pressed只改变表面明暗与位移回落不得改变组件骨架与文案。

状态共 10 种：`default / hover / pressed / focus-visible / selected / current / open / disabled / loading / error`。见 frontmatter matrix。

## 关键区分

- **selected vs current**：selected 是集合语义（tabs、列表）；current 是路由语义（一级导航）。**不得互换**
- **hover vs selected**：hover 视觉强度必须弱于 selected，否则用户会把 hover 误认为已选中
- **focus-visible 必须存在**：3px ring 宽度是硬约束，不能为了"好看"而省略

## 04. 组件规范

> *此板块已基于项目 StyleBrief 定制。*
> 稳定性：`extensible`

### nav
> 一级导航（shell）或局部导航；不承担 selected 语义

- **variants**: `rail` · `tabs` · `breadcrumb`
- **sizes**: `md`
- **shape**: `radius-md`
- **states**: `default` · `hover` · `current` · `focus-visible` · `disabled`
- **slots**: `brand` · `item*` · `trailing`

| prop | type | required | description |
|------|------|----------|-------------|
| `variant` | `enum[rail|tabs|breadcrumb]` | yes |  |
| `items` | `Array<{ id: string; label: string; icon?: string; href?: string; disabled?: boolean }>` | yes |  |
| `currentId` | `string` | no | 当前项；rail/tabs 使用 aria-current="page"，breadcrumb 末项使用 aria-current="location" |
| `ariaLabel` | `string` | yes | 多导航并存时用于区分（"主导航" / "页内导航"） |

- ✅ **MUST** 使用 current 语义表达"当前位置"，且只在一级导航出现
- ✅ **MUST** current 同时用指示条（2px）+ 轻品牌面
- ✅ **MUST** 二级导航使用 selected（集合语义）而非 current
- ✅ **MUST** 外层用 <nav aria-label="…"> 包裹
- ✅ **MUST** 导航帮助定位栏目与阅读进度，不打断阅读

- ❌ **NEVER** hover 强度超过 current
- ❌ **NEVER** 二级导航使用 current
- ❌ **NEVER** 文案频繁随页面状态变义
- ❌ **NEVER** 把导航做得比正文更亮

```html
<nav aria-label="主导航" class="app-nav app-nav--rail" data-rule-id="components.nav.rail">
  <ul>
    <li>
      <a href="/dashboard" aria-current="page" class="app-nav__item">
        <svg class="app-nav__icon" aria-hidden="true"><!-- … --></svg>
        <span>概览</span>
      </a>
    </li>
    <li><a href="/projects" class="app-nav__item">项目</a></li>
  </ul>
</nav>
```

### card
> 承载内容层级，不负责页面主语义；重点是 surface、边界和密度的一致性

- **variants**: `surface` · `subtle` · `soft` · `overlay`
- **sizes**: `padding-none` · `padding-sm` · `padding-md` · `padding-lg`
- **shape**: `radius-lg`
- **states**: `default` · `emphasized` · `selected-context`
- **slots**: `header` · `media` · `body*` · `footer`

| prop | type | required | description |
|------|------|----------|-------------|
| `variant` | `enum[surface|subtle|soft|overlay]` | no | 默认 surface；subtle/soft 用于列表式密排，overlay 用于弹层内部 |
| `padding` | `enum[none|sm|md|lg]` | no | 默认 md；列表项型卡片用 sm |
| `interactive` | `boolean` | no | 整卡可点击；true 时补 role=button + keyboard 支持 |

- ✅ **MUST** 同层列表只保留一种 panel 语言
- ✅ **MUST** interactive 卡片整体为一个可聚焦目标（单一 tab stop）
- ✅ **MUST** 内容卡片用标题+摘要+元信息建立清晰层级
- ✅ **MUST** B2C 阅读优先：摘要 2–3 行，支持展开/收起
- ✅ **MUST** 封面图与摘要主次稳定：图不抢标题，文字可先读

- ❌ **NEVER** card 嵌套 card（避免厚重卡片墙）
- ❌ **NEVER** 通过叠加实色背景制造层级（用透明度+边框）
- ❌ **NEVER** blur 牺牲对比度换取质感
- ❌ **NEVER** 用大面积品牌色背景覆盖正文区域
- ❌ **NEVER** 一张卡上出现多个主 CTA 造成竞争

```html
<article class="app-card app-card--surface" data-rule-id="components.card.surface">
  <header class="app-card__header">
    <h3 class="app-card__title">本周指标</h3>
    <span class="app-card__meta">周一 00:00 更新</span>
  </header>
  <div class="app-card__body">
    <!-- 主内容 -->
  </div>
</article>
```

### chip
> 筛选切换 / 标签选择，可带计数；不承担 shell 级导航

- **variants**: `plain` · `count` · `prominent`
- **sizes**: `sm` · `md`
- **shape**: `radius-pill`
- **states**: `default` · `hover` · `selected` · `focus-visible` · `disabled`

- ✅ **MUST** 使用 role="tablist" / role="tab" 或同等语义
- ✅ **MUST** aria-selected 标记当前筛选
- ✅ **MUST** 带计数时使用 tabular nums

- ❌ **NEVER** chip 当按钮用（触发不可逆动作）
- ❌ **NEVER** 数量过大显示完整数字（请用 99+）

### list
> 通用内容列表；适合消息、记录、资源卡和轻数据流

- **variants**: `plain` · `divided` · `inset`
- **sizes**: `sm` · `md`
- **shape**: `radius-lg`
- **states**: `default` · `hover` · `selected` · `loading` · `empty`

- ✅ **MUST** item 节奏、截断和 meta 对齐保持一致
- ✅ **MUST** 选中项与 hover 项使用不同语义信号

- ❌ **NEVER** 同一列表混用两种完全不同的 item 样式
- ❌ **NEVER** 列表空态与错误态混为一谈

```html
<app-list>
  <app-list-item title="设计规范已更新" meta="2 分钟前"></app-list-item>
</app-list>
```

### menu
> 下拉菜单 / 上下文菜单，用于收纳一组操作；不等同于导航，不承担页面路由职责

- **variants**: `dropdown` · `context`
- **sizes**: `sm` · `md`
- **shape**: `radius-md`
- **states**: `default` · `open` · `item-hover` · `item-focus` · `item-disabled` · `closing`
- **slots**: `trigger*` · `item*` · `separator` · `submenu`

| prop | type | required | description |
|------|------|----------|-------------|
| `items` | `Array<{ id: string; label: string; icon?: string; disabled?: boolean; danger?: boolean; shortcut?: string; submenu?: MenuItem[] }>` | yes | 菜单项数组；危险操作使用 danger=true 单独标色 |
| `open` | `boolean` | yes | 受控展开状态 |
| `placement` | `enum[bottom-start|bottom-end|top-start|top-end|right-start|left-start]` | no | 默认 bottom-start；根据视口空间自动翻转 |
| `onSelect` | `(id: string) => void` | yes | 用户选择某项后的回调；关闭菜单动作由父组件处理 |

- ✅ **MUST** Esc 键关闭菜单，焦点回落到 trigger
- ✅ **MUST** 上下箭头键在菜单项间循环导航
- ✅ **MUST** 分组通过 separator 明确区隔
- ✅ **MUST** 危险操作（删除/解除）必须通过视觉 + 文案强调，与普通操作明确区分

- ❌ **NEVER** 菜单套菜单超过 2 级（改用分步流程或独立页）
- ❌ **NEVER** 把菜单当导航组件使用（请用 nav）
- ❌ **NEVER** 菜单内放表单元素（请用 popover 或 drawer）

**A11y**：
- 外层容器使用 role="menu"
- 每个可操作项使用 role="menuitem"（选中型用 role="menuitemcheckbox"）
- 上下箭头键导航；Home/End 跳首尾；Enter/Space 执行
- trigger 必须有 aria-haspopup="menu" + aria-expanded

```html
<!-- dropdown 菜单 -->
<div class="app-menu" data-rule-id="components.menu.dropdown">
  <button
    type="button"
    class="app-button app-button--ghost"
    aria-haspopup="menu"
    aria-expanded="false"
    aria-controls="actions-menu"
  >
    更多操作
  </button>
  <ul id="actions-menu" role="menu" hidden>
    <li role="menuitem" tabindex="-1">重命名</li>
    <li role="menuitem" tabindex="-1">复制链接</li>
    <li role="separator" aria-orientation="horizontal"></li>
    <li role="menuitem" tabindex="-1" class="app-menu__item--danger">删除</li>
  </ul>
</div>
```

### badge
> 表达状态、分类和来源；不伪装成按钮或选中态控件

- **variants**: `neutral` · `info` · `success` · `warning` · `danger`
- **sizes**: `sm` · `md`
- **shape**: `radius-pill`
- **states**: `default`

- ✅ **MUST** 颜色 + 文字双信号
- ✅ **MUST** 标签文案尽量短（2-4 字）

- ❌ **NEVER** 作为可点击元素（若需交互请用 chip）
- ❌ **NEVER** 在正文中穿插（打断阅读节奏）
- ❌ **NEVER** 同一位置出现 ≥ 3 个

### input
> 用于输入文本、搜索与参数配置；错误和说明信息必须近邻呈现

- **variants**: `text` · `textarea` · `search`
- **sizes**: `sm` · `md`
- **shape**: `radius-md`
- **states**: `default` · `hover` · `focus-visible` · `disabled` · `error`
- **slots**: `label*` · `prefix` · `suffix` · `helper` · `error`

| prop | type | required | description |
|------|------|----------|-------------|
| `type` | `enum[text|email|password|number|search|tel|url]` | no | 原生 input type；非 text 时务必给合适的 inputmode |
| `value` | `string` | no | 受控值；未受控时由组件内部维护 |
| `placeholder` | `string` | no | 示例值；**不得**承担 label 语义 |
| `required` | `boolean` | no | 必填；必填标记不能只用颜色表达 |
| `disabled` | `boolean` | no |  |
| `invalid` | `boolean` | no | 与 error slot 同步；true 时渲染 error 外观与 aria-invalid |

- ✅ **MUST** label 与 field 明确关联（for 或 aria-labelledby）
- ✅ **MUST** error 文案说明问题与恢复路径
- ✅ **MUST** error 用 aria-describedby 关联到 field
- ✅ **MUST** B2C 文案直白友好，避免术语与缩写
- ✅ **MUST** comfortable：预留固定高度的 helper/error 区

- ❌ **NEVER** placeholder 代替 label
- ❌ **NEVER** 错误只靠边框颜色表达（无文字说明）
- ❌ **NEVER** 输入区高度随内容跳动
- ❌ **NEVER** 长段说明塞进 label，影响扫读
- ❌ **NEVER** 仅用红色提示错误，不提供图标/文本

**A11y**：
- focus ring 不依赖细微色差
- 必填标记不能只用颜色

```html
<div class="app-field" data-rule-id="components.input.text">
  <label for="email" class="app-field__label">邮箱 <span aria-hidden="true">*</span></label>
  <input
    id="email"
    type="email"
    required
    aria-required="true"
    aria-describedby="email-helper email-error"
    class="app-input"
  />
  <p id="email-helper" class="app-field__helper">用于登录与通知，不会对外展示</p>
  <p id="email-error" class="app-field__error" role="alert" aria-live="polite"></p>
</div>
```

### panel
> 工作台级信息容器；适合 inspector、settings section、tool block

- **variants**: `surface` · `bordered` · `overlay`
- **sizes**: `sm` · `md` · `lg`
- **shape**: `radius-lg`
- **states**: `default` · `hover`
- **slots**: `header` · `body*` · `footer`

- ✅ **MUST** header、body、footer 间距节奏固定
- ✅ **MUST** 同层 panel 只保留一套边界语言

- ❌ **NEVER** panel 内再套同等权重 panel
- ❌ **NEVER** 用 panel 代替页面级 layout

**Do Not Compose**：
- 不要让 panel 同时承担页面导航与内容容器职责

```html
<app-panel>
  <header>成员权限</header>
  <div>在这里配置角色、范围与默认权限。</div>
</app-panel>
```

### radio
> 单选项集合；用于 2-5 个互斥选项的显式选择

- **variants**: `default` · `card`
- **sizes**: `sm` · `md`
- **shape**: `radius-md`
- **states**: `default` · `hover` · `selected` · `focus-visible` · `disabled`
- **slots**: `label*` · `description`

| prop | type | required | description |
|------|------|----------|-------------|
| `value` | `string` | yes |  |
| `checked` | `boolean` | yes |  |

- ✅ **MUST** 同组 radio 使用同一命名与排列方式
- ✅ **MUST** 默认选中项清晰可感知

- ❌ **NEVER** 选项超过 5 个仍坚持用 radio
- ❌ **NEVER** 把 radio 做成伪按钮但没有单选语义

**A11y**：
- 同组元素使用 fieldset/legend 或 role="radiogroup"

```html
<app-radio-group label="默认视图">
  <app-radio value="list">列表</app-radio>
  <app-radio value="board">看板</app-radio>
</app-radio-group>
```

### table
> 结构化数据展示；复杂筛选请抽出到顶部工具栏

- **variants**: `plain` · `striped` · `compact`
- **sizes**: `sm` · `md`
- **shape**: `radius-lg`
- **states**: `default` · `row-hover` · `row-selected` · `sort-active` · `loading` · `empty`
- **slots**: `toolbar` · `columnHeader*` · `row*` · `empty` · `pagination`

| prop | type | required | description |
|------|------|----------|-------------|
| `columns` | `Array<{ key: string; title: string; width?: string; sortable?: boolean; fixed?: 'left'|'right' }>` | yes |  |
| `rows` | `Array<Record<string, unknown>>` | yes |  |
| `rowKey` | `string | ((row) => string)` | yes | 每行稳定 key；禁止用 index |
| `sort` | `{ key: string; order: 'asc'|'desc' }` | no |  |
| `selection` | `enum[none|single|multiple]` | no |  |
| `loading` | `boolean` | no | loading 时保持行高骨架，不空白闪烁 |

- ✅ **MUST** 表头固定（sticky）当行数 > 10
- ✅ **MUST** 排序状态显式图标 + aria-sort
- ✅ **MUST** 空态三段式：这里是什么 / 为什么空 / 下一步
- ✅ **MUST** 批量选择必须显示"已选 N 条"统计

- ❌ **NEVER** 把操作列做得比数据列更显眼
- ❌ **NEVER** 列宽全部自适应（关键列必须固定宽度）
- ❌ **NEVER** 行内放多个主操作（请用 more-menu 收敛）

```html
<table class="app-table" data-rule-id="components.table.plain">
  <thead>
    <tr>
      <th scope="col" aria-sort="ascending">名称</th>
      <th scope="col">负责人</th>
      <th scope="col" style="width: 120px">更新时间</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>产品路线图</td><td>小晴</td><td>刚刚</td></tr>
  </tbody>
</table>
```

### toast
> 轻量结果反馈；适合保存成功、同步完成、轻量失败提醒

- **variants**: `info` · `success` · `warning` · `danger`
- **sizes**: `sm` · `md`
- **shape**: `radius-md`
- **states**: `default`
- **slots**: `title*` · `message`

| prop | type | required | description |
|------|------|----------|-------------|
| `duration` | `number` | no | 自动关闭时长（ms） |

- ✅ **MUST** 文案先说结果，再说补充影响
- ✅ **MUST** 可撤销操作必须提供 secondary action

- ❌ **NEVER** 把需要用户决策的信息做成自动消失 toast
- ❌ **NEVER** 同时堆叠超过 3 条 toast

**A11y**：
- 重要提示使用 aria-live="assertive"
- 成功提示使用 aria-live="polite"

```html
<app-toast variant="success" title="已保存设置">
  新规则会在下一次运行时生效
</app-toast>
```

### avatar
> 用户头像；展示用户身份标识，支持图片、fallback 字母和状态点，不承担按钮或链接语义

- **variants**: `circle` · `rounded` · `square`
- **sizes**: `xs` · `sm` · `md` · `lg`
- **shape**: `radius-full`
- **states**: `default` · `loading` · `fallback`
- **slots**: `image` · `fallback` · `statusIndicator`

| prop | type | required | description |
|------|------|----------|-------------|
| `src` | `string` | no | 头像图片 URL；不提供时直接显示 fallback |
| `alt` | `string` | yes | 图片描述；仅装饰用途时传 "" 并配合 role="presentation" |
| `fallbackText` | `string` | no | 图片失败时显示的字母缩写（如"晴"或"XQ"）；最多两个字符 |
| `shape` | `enum[circle|rounded|square]` | no | 默认 circle；产品 / 工具场景可用 rounded / square |
| `size` | `enum[xs|sm|md|lg]` | no | 默认 md；xs=24px, sm=32px, md=40px, lg=56px |
| `status` | `enum[online|offline|busy|away]` | no | 状态点语义；颜色必须同时配文字标签，不能只靠颜色区分 |

- ✅ **MUST** alt 必填；纯装饰场景传 "" 并加 role="presentation"
- ✅ **MUST** 图片加载失败时必须渲染 fallback，不能只显示断图 alt 文字
- ✅ **MUST** fallback 字母基于用户真实姓名生成，不写死默认值
- ✅ **MUST** status 点的颜色必须同时有文字标签（aria-label 或 visually-hidden）

- ❌ **NEVER** avatar 承担按钮语义（若需点击请用 button 包裹）
- ❌ **NEVER** 仅靠颜色区分不同 status（必须同时加文字标签）
- ❌ **NEVER** 在紧凑列表中使用 lg 尺寸

**A11y**：
- alt 属性必须正确填写或用空字符串 + role="presentation" 标记装饰性
- status 指示器需配 aria-label 描述状态含义
- 包裹为可点击元素时整体 button/a 必须有可访问标签

```html
<!-- 带 fallback 和状态点的圆形头像 -->
<span
  class="app-avatar app-avatar--circle app-avatar--md"
  data-rule-id="components.avatar.circle"
>
  <img
    src="/uploads/avatar/xq.png"
    alt="小晴"
    class="app-avatar__image"
    onerror="this.hidden=true; this.nextElementSibling.hidden=false"
  />
  <span class="app-avatar__fallback" hidden aria-hidden="true">晴</span>
  <span
    class="app-avatar__status app-avatar__status--online"
    aria-label="在线"
  ></span>
</span>
```

### banner
> 页面级通知 / 状态提示；不用于交互结果反馈（请用 toast）

- **variants**: `info` · `success` · `warning` · `danger`
- **sizes**: `md`
- **shape**: `radius-md`
- **states**: `default` · `dismissible`
- **slots**: `icon` · `title*` · `description` · `actions`

| prop | type | required | description |
|------|------|----------|-------------|
| `variant` | `enum[info|success|warning|danger]` | yes |  |
| `dismissible` | `boolean` | no | 为 true 时渲染关闭按钮（必带 aria-label） |
| `onDismiss` | `() => void` | no |  |
| `role` | `enum[status|alert]` | no | info/success 用 status；warning/danger 用 alert |

- ✅ **MUST** 颜色 + icon + 文字三重信号
- ✅ **MUST** danger/warning 使用 role="alert" 主动播报
- ✅ **MUST** 可关闭时提供明确关闭按钮（aria-label）
- ✅ **MUST** 标题简短有力，描述面向用户可读可执行
- ✅ **MUST** 行动按钮用动词短句，优先 1 个主操作

- ❌ **NEVER** banner 堆叠（同一区域 ≥ 2）
- ❌ **NEVER** 仅靠色彩区分 info/success/warning
- ❌ **NEVER** 用 banner 表达瞬时操作反馈（请用 toast）
- ❌ **NEVER** 文案含糊如“出错了”，不提供下一步
- ❌ **NEVER** 按钮过多造成阅读拥挤（>2）

**Do Not Compose**：
- toast
- modal

```html
<div role="alert" class="app-banner app-banner--danger" data-rule-id="components.banner.danger">
  <svg class="app-banner__icon" aria-hidden="true"><!-- … --></svg>
  <div class="app-banner__body">
    <strong class="app-banner__title">同步失败</strong>
    <p class="app-banner__description">12 分钟前同步失败，可能是凭证过期。</p>
  </div>
  <button type="button" class="app-button app-button--secondary">重新同步</button>
  <button type="button" class="app-banner__close" aria-label="关闭提示"><!-- … --></button>
</div>
```

### button
> 用于提交、确认和启动动作；不承担状态展示和导航职责

- **variants**: `primary` · `secondary` · `ghost` · `destructive`
- **sizes**: `xs` · `sm` · `md`
- **shape**: `radius-md`
- **states**: `default` · `hover` · `pressed` · `focus-visible` · `disabled` · `loading`
- **slots**: `leadingIcon` · `label*` · `trailingIcon`

| prop | type | required | description |
|------|------|----------|-------------|
| `variant` | `enum[primary|secondary|ghost|destructive]` | yes | 主次 / 幽灵 / 危险 四类，同屏 primary 只允许一个 |
| `size` | `enum[xs|sm|md]` | no | 默认 md；密集工具条可选 sm / xs |
| `type` | `enum[button|submit|reset]` | no | 原生 type；表单提交必须显式 submit |
| `loading` | `boolean` | no | 加载态；宽高保持不变，disable 交互 |
| `disabled` | `boolean` | no | 置灰并禁用；不得同时配合 loading 显示不一致状态 |

- ✅ **MUST** 所有 variant 定义 default/hover/focus-visible/pressed/disabled
- ✅ **MUST** 文案用动词开头（2-8 字），简短有力
- ✅ **MUST** loading 状态宽高稳定，不跳动
- ✅ **MUST** icon-only 必须补 aria-label 或 title

- ❌ **NEVER** 同一屏出现 ≥ 2 个 primary
- ❌ **NEVER** ghost 承载确认/支付/提交等关键操作
- ❌ **NEVER** 在 link 内嵌套 button
- ❌ **NEVER** 按钮文案使用长句/段落（影响阅读与密度）

**A11y**：
- focus-visible 清晰可见（3px ring）
- 最小触摸目标 36×36

```html
<button
  type="submit"
  class="app-button app-button--primary"
  data-rule-id="components.button.primary"
>
  保存变更
</button>
```

### dialog
> 打断主流程的关键操作确认；不用于辅助信息展示

- **variants**: `modal` · `confirmation`
- **sizes**: `sm` · `md` · `lg`
- **shape**: `radius-xl`
- **states**: `default` · `open` · `closing`
- **slots**: `title*` · `description` · `body` · `actions*`

| prop | type | required | description |
|------|------|----------|-------------|
| `open` | `boolean` | yes | 控制显示；open→true 时自动 focus trap 并 autoFocus 非危险按钮 |
| `size` | `enum[sm|md|lg]` | no | 默认 md；confirmation 用 sm |
| `dismissibleOnEsc` | `boolean` | no | 默认 true；允许 Esc 关闭 |
| `dismissibleOnMask` | `boolean` | no | 默认 false；避免误关导致已输入内容丢失 |
| `onClose` | `(reason: 'esc'|'mask'|'action') => void` | yes |  |

- ✅ **MUST** 标题用动词+对象，明确你正在做什么
- ✅ **MUST** 危险操作用 destructive，且不作为默认焦点
- ✅ **MUST** Esc 可关闭；遮罩点击默认不关闭防误触
- ✅ **MUST** 文案面向阅读：一句结论+一句后果/范围

- ❌ **NEVER** dialog 套 dialog
- ❌ **NEVER** 用 dialog 承载长表单（改用 drawer/独立页）
- ❌ **NEVER** 使用“确定/取消”等空词按钮
- ❌ **NEVER** 仅靠颜色传达风险或结果（需文字说明）

```html
<div role="dialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-desc">
  <h2 id="delete-title">删除“产品路线图 2026”？</h2>
  <p id="delete-desc">此操作不可撤销，关联的 12 条评论将一并删除。</p>
  <footer>
    <button type="button" class="app-button app-button--ghost" autofocus>保留草稿</button>
    <button type="button" class="app-button app-button--destructive">确认删除</button>
  </footer>
</div>
```

### drawer
> 侧边抽屉；用于不中断主上下文的编辑、详情查看与批注

- **variants**: `default` · `inspector`
- **sizes**: `sm` · `md` · `lg`
- **shape**: `radius-xl`
- **states**: `default` · `open` · `closing`
- **slots**: `header*` · `body*` · `footer`

- ✅ **MUST** 与主画布保持明确层级，不遮挡关键导航
- ✅ **MUST** 编辑型 drawer 使用固定 footer 承载主操作

- ❌ **NEVER** drawer 套 drawer
- ❌ **NEVER** 用 drawer 承载跨页面长流程

**A11y**：
- 开启时焦点进入 drawer，关闭后回到触发点

```html
<app-drawer title="编辑成员">
  <member-form></member-form>
</app-drawer>
```

### select
> 从预定义选项中选择；复杂筛选用 filter chip 或 menu

- **variants**: `default` · `searchable`
- **sizes**: `sm` · `md`
- **shape**: `radius-md`
- **states**: `default` · `hover` · `focus-visible` · `open` · `disabled`
- **slots**: `label*` · `trigger*` · `option*` · `empty`

| prop | type | required | description |
|------|------|----------|-------------|
| `options` | `Array<{ value: string; label: string; disabled?: boolean }>` | yes | 选项列表；超过 20 项必须启用 searchable |
| `value` | `string` | no | 当前选中值；closed 态必须可见 |
| `searchable` | `boolean` | no | 启用搜索过滤；选项 > 8 时推荐开启 |
| `placeholder` | `string` | no | 未选中时的占位文案 |
| `disabled` | `boolean` | no |  |

- ✅ **MUST** 选项数 > 8 必须支持搜索
- ✅ **MUST** 当前选中值在 closed 态可见
- ✅ **MUST** trigger 使用 role="combobox" + aria-expanded + aria-controls

- ❌ **NEVER** 用 select 承担多选（请用 checkbox group 或 multi-select）
- ❌ **NEVER** 选项数量超过 20 仍用单层 select（请用搜索或分组）

```html
<div class="app-field" data-rule-id="components.select.default">
  <label id="region-label" class="app-field__label">所在地区</label>
  <button
    type="button"
    role="combobox"
    aria-labelledby="region-label"
    aria-expanded="false"
    aria-controls="region-listbox"
    class="app-select__trigger"
  >
    请选择
  </button>
  <ul id="region-listbox" role="listbox" hidden>
    <li role="option">华东</li>
    <li role="option">华北</li>
  </ul>
</div>
```

### switch
> 立即生效的二元状态切换；适合轻量偏好设置

- **variants**: `default`
- **sizes**: `sm` · `md`
- **shape**: `radius-pill`
- **states**: `default` · `hover` · `selected` · `focus-visible` · `disabled`
- **slots**: `label*` · `helper`

| prop | type | required | description |
|------|------|----------|-------------|
| `checked` | `boolean` | yes |  |
| `loading` | `boolean` | no |  |

- ✅ **MUST** 适用于可即时回滚的轻量设置
- ✅ **MUST** 开关状态与说明文案同步更新

- ❌ **NEVER** 危险操作或不可逆操作使用 switch
- ❌ **NEVER** 无说明就让用户猜开启后影响

**A11y**：
- 使用 role="switch" 并同步 aria-checked

```html
<app-switch
  label="自动刷新日志"
  helper="开启后每 10 秒拉取一次最新状态"
></app-switch>
```

### tooltip
> 瞬时补充说明；只解释当前控件，不承载关键操作

- **variants**: `default`
- **sizes**: `sm`
- **shape**: `radius-sm`
- **states**: `default` · `open`

| prop | type | required | description |
|------|------|----------|-------------|
| `placement` | `enum[top|right|bottom|left]` | no |  |
| `trigger` | `enum[hover|focus]` | no |  |

- ✅ **MUST** tooltip 文案简短，只解释当前元素
- ✅ **MUST** hover 和 focus 都能触发同等信息

- ❌ **NEVER** 把关键说明藏进 tooltip
- ❌ **NEVER** tooltip 中放按钮或表单

**A11y**：
- 使用 aria-describedby 关联触发器与 tooltip

```html
<app-tooltip content="只会同步当前 workspace 下的规则文件">
  <app-icon name="info"></app-icon>
</app-tooltip>
```

### checkbox
> 多选型开关；用于独立选项勾选或列表批量选择

- **variants**: `default` · `indeterminate`
- **sizes**: `sm` · `md`
- **shape**: `radius-sm`
- **states**: `default` · `hover` · `selected` · `focus-visible` · `disabled`
- **slots**: `label*` · `description`

| prop | type | required | description |
|------|------|----------|-------------|
| `checked` | `boolean` | yes |  |
| `indeterminate` | `boolean` | no |  |

- ✅ **MUST** 点击热区覆盖 checkbox 与文案整体
- ✅ **MUST** 列表批量选择时支持 indeterminate

- ❌ **NEVER** 把 checkbox 当二元立即生效开关
- ❌ **NEVER** 单个互斥选择使用 checkbox

**A11y**：
- 使用原生 checkbox 语义或 role="checkbox"
- Space 键可切换

```html
<label class="app-checkbox">
  <input type="checkbox" />
  <span>仅显示未完成项</span>
</label>
```

### progress
> 进度反馈；用于上传、生成、迁移或多步执行过程

- **variants**: `linear` · `stepped`
- **sizes**: `sm` · `md`
- **shape**: `radius-pill`
- **states**: `default` · `loading`

| prop | type | required | description |
|------|------|----------|-------------|
| `value` | `number(0-100)` | yes |  |
| `label` | `string` | no |  |

- ✅ **MUST** 百分比与文案含义保持一致
- ✅ **MUST** 超过 5 秒的等待优先展示 progress 而不是 spinner

- ❌ **NEVER** 用伪进度误导用户
- ❌ **NEVER** 只显示动画条但没有当前阶段说明

**A11y**：
- 使用 role="progressbar" 并提供 aria-valuenow

```html
<app-progress value="64" label="正在生成 design.md"></app-progress>
```

### textarea
> 长文本输入；适合备注、说明和多段内容，不承担结构化表单布局

- **variants**: `default` · `autosize`
- **sizes**: `md` · `lg`
- **shape**: `radius-md`
- **states**: `default` · `hover` · `focus-visible` · `disabled` · `error`
- **slots**: `label*` · `helper`

| prop | type | required | description |
|------|------|----------|-------------|
| `rows` | `number` | no | 初始展示行数 |
| `resize` | `enum[none|vertical]` | no | 调整尺寸策略 |

- ✅ **MUST** 长文本输入默认保留 4-6 行初始高度
- ✅ **MUST** helper 与 error 文案紧邻输入框
- ✅ **MUST** 自动增高只向下扩，不回流主布局

- ❌ **NEVER** 把 textarea 当富文本编辑器
- ❌ **NEVER** 默认允许横向 resize

**Do Not Compose**：
- 不要把 textarea 放在高度不稳定的折叠容器内

**A11y**：
- label 与 field 必须显式关联
- 错误信息通过 aria-describedby 关联

```html
<app-textarea
  label="补充说明"
  rows="5"
  helper="告诉协作者当前上下文和限制条件"
></app-textarea>
```

### authorMeta
> 作者与来源信息块；用于说明作者、更新时间和阅读时长

- **variants**: `inline` · `stacked`
- **sizes**: `sm` · `md`
- **shape**: `radius-pill`
- **states**: `default`

- ✅ **MUST** 来源、作者、更新时间三类信息清晰分组

- ❌ **NEVER** 元信息比正文更亮

### datepicker
> 日期选择器（不含时间），支持单日和日期区间两种模式

- **variants**: `single` · `range`
- **sizes**: `sm` · `md`
- **shape**: `radius-md`
- **states**: `default` · `open` · `date-hover` · `date-selected` · `date-in-range` · `date-disabled` · `focus-visible`
- **slots**: `trigger*` · `calendar*` · `footer`

| prop | type | required | description |
|------|------|----------|-------------|
| `value` | `string | [string, string] | null` | no | 受控值；single 传 ISO 日期字符串，range 传 [start, end] |
| `onChange` | `(value: string | [string, string]) => void` | yes |  |
| `min` | `string` | no | 最早可选日期（ISO 格式）；早于此日期的格子禁用 |
| `max` | `string` | no | 最晚可选日期（ISO 格式） |
| `disabledDates` | `(date: string) => boolean` | no | 自定义禁用日期函数；返回 true 表示禁用该日期 |
| `format` | `string` | no | 显示格式；默认 "YYYY-MM-DD" |
| `locale` | `string` | no | 区域设置；影响周起始日和月份/星期显示语言 |

- ✅ **MUST** 键盘左右方向键切换日、上下方向键切换周
- ✅ **MUST** PageUp / PageDown 切换月份、Shift+PageUp / Shift+PageDown 切换年份
- ✅ **MUST** 提供直接文本输入选项（trigger 既是 combobox 又接受 ISO 格式直接输入）
- ✅ **MUST** 禁用日期必须同时加 aria-disabled="true"（不能只靠颜色灰化）

- ❌ **NEVER** 仅用颜色区分周末和工作日（必须同时加文字标签或 aria 标注）
- ❌ **NEVER** 禁用日期只靠灰色视觉不加 aria-disabled
- ❌ **NEVER** 浮层超出视口未自动翻转方向

**A11y**：
- trigger 使用 role="combobox" aria-haspopup="listbox"；日历面板使用 role="dialog"
- 日期格使用 role="gridcell" + tabindex；当前焦点日期有 tabindex="0"
- 月份标题对屏幕阅读器可见（aria-live="polite"）
- Enter / Space 选中当前聚焦日期；Esc 关闭并回到 trigger

```html
<!-- 单日期选择器 -->
<div class="app-datepicker" data-rule-id="components.datepicker.single">
  <label id="start-date-label">开始日期</label>
  <input
    type="text"
    role="combobox"
    aria-labelledby="start-date-label"
    aria-haspopup="dialog"
    aria-expanded="false"
    aria-controls="start-date-calendar"
    placeholder="YYYY-MM-DD"
    class="app-datepicker__trigger"
  />
  <div
    id="start-date-calendar"
    role="dialog"
    aria-modal="true"
    aria-label="选择日期"
    hidden
  >
    <div role="grid" aria-labelledby="calendar-month-title">
      <p id="calendar-month-title" aria-live="polite">2026年4月</p>
      <div role="row">
        <span role="columnheader" aria-label="周日">日</span>
        <!-- ... -->
      </div>
      <div role="row">
        <button
          type="button"
          role="gridcell"
          tabindex="0"
          aria-selected="false"
          class="app-datepicker__day"
        >1</button>
        <!-- ... -->
      </div>
    </div>
  </div>
</div>
```

### emptyState
> 空态页必须同时回答三问：这里是什么 / 为什么现在为空 / 下一步能做什么

- **variants**: `default` · `illustration`
- **sizes**: `md` · `lg`
- **shape**: `radius-lg`
- **states**: `default`

- ✅ **MUST** 三段式文案（标题 + 描述 + CTA 或下一步提示）
- ✅ **MUST** 保留基础容器尺寸（避免闪烁）

- ❌ **NEVER** 只显示一行"暂无数据"
- ❌ **NEVER** 空态用 error 语气

### errorState
> 错误态容器；用于明确说明失败原因、影响范围和恢复动作

- **variants**: `inline` · `page`
- **sizes**: `md` · `lg`
- **shape**: `radius-lg`
- **states**: `default`

- ✅ **MUST** 至少说明发生了什么、影响什么、下一步可做什么
- ✅ **MUST** 危险语气只用于真实失败，不滥用

- ❌ **NEVER** 只显示错误码不给恢复建议
- ❌ **NEVER** 用 errorState 承载空态

**A11y**：
- 重要错误使用 role="alert"

```html
<app-error-state
  title="无法加载规则书"
  description="网络中断，稍后重试或检查后端服务状态。"
></app-error-state>
```

### pagination
> 分页控件；用于长列表的分页浏览和跳转，不用于步骤流程导航

- **variants**: `standard` · `simple` · `loadMore`
- **sizes**: `sm` · `md`
- **shape**: `radius-md`
- **states**: `default` · `page-hover` · `page-current` · `page-disabled` · `loading`
- **slots**: `pageButton` · `ellipsis` · `jumpInput`

| prop | type | required | description |
|------|------|----------|-------------|
| `current` | `number` | yes | 当前页码，从 1 开始 |
| `total` | `number` | yes | 数据总条数 |
| `pageSize` | `number` | no | 每页条数；默认 20 |
| `onChange` | `(page: number, pageSize: number) => void` | yes |  |
| `showJumper` | `boolean` | no | 是否展示跳页输入框 |
| `showSizeChanger` | `boolean` | no | 是否展示每页条数切换器；数据量大时推荐开启 |

- ✅ **MUST** 当前页用 aria-current="page" 标记
- ✅ **MUST** 总页数 > 7 时用 ellipsis 折叠，避免过多按钮
- ✅ **MUST** 必须同时提供"上一页"和"下一页"控件，不能只显示数字
- ✅ **MUST** 首页和末页处于边界时对应控件禁用（disabled）

- ❌ **NEVER** 只显示页码数字没有方向控件
- ❌ **NEVER** 在分页按钮的 href 中嵌入完整 URL 查询参数（请用 onChange 回调）
- ❌ **NEVER** 在不需要分页的极少数据（< 1 页）时仍渲染分页控件

**A11y**：
- 外层容器使用 role="navigation" aria-label="分页"
- 当前页按钮加 aria-current="page"
- 禁用按钮使用 disabled 属性，不只是视觉置灰

```html
<nav
  role="navigation"
  aria-label="分页"
  class="app-pagination"
  data-rule-id="components.pagination.standard"
>
  <button type="button" class="app-pagination__prev" aria-label="上一页">‹</button>
  <button type="button" class="app-pagination__page">1</button>
  <button type="button" class="app-pagination__page">2</button>
  <button
    type="button"
    class="app-pagination__page app-pagination__page--current"
    aria-current="page"
  >3</button>
  <span class="app-pagination__ellipsis" aria-hidden="true">…</span>
  <button type="button" class="app-pagination__page">10</button>
  <button type="button" class="app-pagination__next" aria-label="下一页">›</button>
</nav>
```

### articleHero
> 文章头图与标题区；承载标题、摘要、作者和发布时间

- **variants**: `cover` · `minimal`
- **sizes**: `lg`
- **shape**: `radius-lg`
- **states**: `default`

- ✅ **MUST** 标题、摘要、作者与发布时间结构稳定
- ✅ **MUST** 头图强调不得盖过标题信息

- ❌ **NEVER** 在 hero 中堆叠过多营销标签

### loadingState
> 加载中状态：保持骨架稳定，显示占位或 spinner

- **variants**: `inline` · `skeleton` · `full-panel`
- **sizes**: `sm` · `md` · `lg`
- **shape**: `inherit`
- **states**: `default`

- ✅ **MUST** 保持容器尺寸不跳动
- ✅ **MUST** 使用 aria-busy 标记
- ✅ **MUST** 超过 3 秒应显示进度或安慰文案

- ❌ **NEVER** 加载中隐藏内容区（造成空白闪烁）
- ❌ **NEVER** 使用大范围转圈动画（请用轻 skeleton）

### segmentedControl
> 局部上下文切换；适合 tab-like 视图切换与轻量过滤

- **variants**: `default` · `count`
- **sizes**: `sm` · `md`
- **shape**: `radius-pill`
- **states**: `default` · `hover` · `selected` · `focus-visible` · `disabled`
- **slots**: `label*` · `count`

| prop | type | required | description |
|------|------|----------|-------------|
| `value` | `string` | yes |  |
| `options` | `Array<{value:string,label:string}>` | yes |  |

- ✅ **MUST** selected 语义只表达当前集合视图，不表达路由 current
- ✅ **MUST** 轨道与分段胶囊的层级保持稳定

- ❌ **NEVER** 用 segmented-control 替代一级导航
- ❌ **NEVER** 每个 segment 宽度差异过大

**A11y**：
- 使用 role="tablist" 或等价集合语义

```html
<app-segmented-control
  [options]="viewOptions"
  value="overview"
></app-segmented-control>
```


本节 frontmatter 定义了 12 个核心组件的 MUST / NEVER 规则。下面补充通用原则。

## 组件选型原则

- **不要造平行语义的组件**：不要同时存在 `Button` 和 `ActionBar`；不要同时存在 `Card` 和 `Surface`
- **变体 ≤ 5 个**：超过 5 个说明组件职责过杂，应拆分
- **state 覆盖完整**：任何 interactive 组件都必须显式处理 default/hover/focus-visible/disabled 四项

## 组合规则

- Button 不嵌套 Link，Link 不嵌套 Button
- Card 不嵌套 Card
- Dialog 不嵌套 Dialog
- Badge 不作为可点击元素，若需交互请使用 Chip

## 04a. 表单规范

> 稳定性：`stable`

- ✅ **MUST** 每个字段必须有明确的 label（不用 placeholder 代替 label）
- ✅ **MUST** 错误信息使用 aria-describedby 关联到对应字段
- ✅ **MUST** 提交后焦点移到第一个错误字段
- ✅ **MUST** 密码字段提供可见性切换（show/hide）
- ✅ **MUST** 必填字段标注 * 并在表单顶部说明 * 为必填

- ❌ **NEVER** 不用颜色作为唯一错误信号（需同时配合 icon 或文字）
- ❌ **NEVER** 不在 placeholder 中放校验规则（放在 helperText 或 label）
- ❌ **NEVER** 不在提交过程中清空已有输入
- ❌ **NEVER** 不把 section-banner 级错误降级为仅 inline 展示

### 错误提示分级
| 级别 | 触发场景 | 视觉表现 |
|------|----------|----------|
| `field-inline` | 单字段格式必填校验失败 | 边框变 sys.color.danger.border；inline 错误文案出现在字段下方；前缀 icon 提示 |
| `section-banner` | 跨字段联合校验失败（如密码不一致） | 表单顶部 banner 使用 sys.color.warning.surface；同时高亮相关字段 |
| `page-full` | 服务端错误或提交失败 | 页面级 toast + 可重试 CTA；使用 sys.color.danger.surface |

### 提交状态
- **loading**：提交按钮变 loading 态；spinner 替换文字；禁止重复提交
- **success**：跳转或显示 success banner；表单不重置，保留用户输入供确认
- **error**：按钮恢复可交互；错误信息就近展示
- **retry**：保留用户输入；重试不清空

### 预设表单
#### 简单登录表单
> 最小登录场景，2 个字段 + 提交按钮

- `email` [email] 邮箱 \* — 必须是合法邮箱格式
- `password` [password] 密码 \* — 至少 8 位

#### 多字段注册表单
> 标准注册场景，含确认密码与服务条款

- `username` [text] 用户名 \* — 仅允许字母、数字、下划线；3-20 位
- `email` [email] 邮箱 \* — 合法邮箱格式；服务端异步检查唯一性
- `password` [password] 密码 \* — 至少 8 位，包含大写字母和数字
- `confirmPassword` [password] 确认密码 \* — 必须与密码字段一致
- `agreeTerms` [checkbox] 我已阅读并同意《服务条款》 \*

#### 分组设置表单
> 多分组配置场景，使用 fieldset + legend 分区

**外观**
- `theme` [select] 主题 — 选项：light / dark / system
- `density` [select] 界面密度 — 选项：compact / comfortable / spacious

**通知**
- `emailNotifications` [checkbox] 启用邮件通知
- `pushNotifications` [checkbox] 启用推送通知

**个人资料**
- `bio` [textarea] 个人简介 — 最多 200 字


本节 frontmatter 定义了表单级别的全局约定与 3 套预设表单。

## 字段顺序与对齐

- **字段顺序**：按用户认知流排列（先标识性信息，再安全信息，再补充信息）；不按后端字段顺序排列
- **标签对齐**：默认使用顶部标签（`labelPlacement: top`），扫描效率最高；内联紧凑场景可用左侧标签，但同一表单内只保留一种对齐方式
- **字段宽度**：单列全宽为默认；两列布局仅用于视觉关联度高的字段对（如姓 / 名、开始 / 结束时间）

## 错误提示与校验

- **校验时机**：`blur` 触发单字段校验，`submit` 触发全表单校验；有异步校验时加 300ms debounce
- **错误展示位置**：field-inline（字段下方）→ section-banner（表单顶部）→ page-full（页面级），升级条件见 frontmatter errorSeverity
- **错误文案**：说明原因 + 给出修复建议；避免只说"格式不正确"
- **颜色不是唯一信号**：错误状态必须同时使用边框色变化 + icon + 文字说明

## 键盘行为

- `Tab` 顺序与视觉阅读顺序一致（上到下，左到右）
- `Enter` 在单行输入框中触发提交；多行 textarea 中 `Enter` 换行，`Cmd+Enter` 提交
- `Esc` 关闭关联 popover/下拉，不清空输入
- `Space` 切换 checkbox / radio
- 提交后焦点自动移到第一个错误字段

## 无障碍（A11y）

- 每个字段必须有 `<label>` 元素或 `aria-label`；不以 `placeholder` 代替 label
- 错误信息通过 `aria-describedby` 关联到对应字段
- 必填字段使用 `aria-required="true"` + 视觉 `*` 标记
- 分组使用 `<fieldset>` + `<legend>`；屏幕阅读器可感知分组语义
- focus ring 样式：3px solid `var(--sys-focus-ring)`，不得省略

## 预设表单使用指南

frontmatter `forms` 数组包含 3 套最小预设，Cursor 可直接参考生成表单骨架：

- **simple-login**：邮箱 + 密码，适合登录 / 快速验证场景
- **multi-field-registration**：注册全套字段，含联合校验（密码一致性）和条款同意
- **grouped-settings**：使用 fieldset 分组的配置页，适合设置 / 偏好场景

## 05. 核心模式

> *此板块已基于项目 StyleBrief 定制。*
> 稳定性：`extensible`

### Nav Rail / 一级导航
> 负责主模块切换，使用 current 语义，不和页面内部 selected 状态混用

**结构**：
- icon + label
- current indicator
- 可选 badge / counter
- 固定在 shell 左侧
**内容**：
- **MUST** 文案保持稳定，不随页面状态频繁变义
- **MUST** hover 轻于 current
- **MUST** 当前项组合使用轻品牌面与指示条
**状态**：
- default / hover / current / focus-visible / disabled
- current 只用于一级导航
- icon 与文本都需要同步当前态强调

### Segmented Control / 二级导航
> 用于当前模块内上下文切换，selected 是集合语义，不承担主路由 current

**结构**：
- track surface
- segment button
- icon
- label
- optional count
**内容**：
- **MUST** shell 级轨道使用 pill 语言
- **MUST** selected 胶囊面 + 反白文字
- **MUST** 未选中项只允许轻弱文本或极浅背景
**状态**：
- default / hover / selected / focus-visible / disabled
- selected 不再叠加第二套高亮信号
- hover 不得比 selected 更亮

### Page Header / 页面头
> 负责说明当前页面是什么、主操作在哪，不应该比主内容区更重

**结构**：
- title
- description
- actions
- 可选 top-level filters
**内容**：
- **MUST** 页面主标题只出现一次
- **MUST** 描述解释这里能做什么
- **MUST** header 到正文靠 spacing 过渡
**状态**：
- 强调方式始终轻于主内容
- 不额外包大卡片
- 不和 section header 打架

### List Item / 列表项
> 通用可选记录项，强调密度、截断和 selected 稳定性

**结构**：
- optional icon
- title
- summary
- meta
- optional actions
**内容**：
- **MUST** 标题 1 行，摘要 1-2 行
- **MUST** meta / badge 区域位置稳定
- **MUST** 同组列表只保留一种 item 语言
**状态**：
- default / hover / selected / focus-visible
- selected 最多两种强调信号
- error/disabled 只在必要场景出现

### Composer / 输入区
> 输入区是工具区，不应该成为页面主视觉，但要持续稳定可达

**结构**：
- textarea
- attachments area
- actions
- send button
**内容**：
- **MUST** 底部固定或稳定停留
- **MUST** 输入区增长不挤没消息流
- **MUST** 主 CTA 对齐稳定
**状态**：
- default / hover / focus-visible / disabled / error
- loading 不改变布局
- 错误信息近邻展示

### Empty / Loading / Error 三态
> 状态页必须同时回答：这里是什么、为什么现在如此、下一步能做什么

**结构**：
- icon / avatar
- title
- supporting text
- optional action
**内容**：
- **MUST** 空态三段式说明
- **MUST** loading 保持骨架稳定
- **MUST** error 提供恢复动作
**状态**：
- empty / loading / error
- 状态不只靠颜色或图标
- 全局失败优先就地展示

### Reading Column
> 适合文章页、专题页和知识文档的主阅读布局。

**结构**：
- 标题区
- 主阅读列
- 目录 / 推荐侧栏
**内容**：
- **MUST** 主阅读列控制在舒适行长
- **MUST** 目录和推荐侧栏应弱于正文
**状态**：
- reading-progress / paywall / excerpt


本节定义 6 个核心模式。它们是阅读类 B2C 产品里反复出现的页面骨架，用来统一信息分层与布局职责。

**使用原则**：新页面从这 6 个模式中选骨架并说明理由；禁止为单页发明新的栅格、间距体系或层级命名。允许在模式内增删模块，但不得改变主区域职责与信息优先级。

## 模式 1：内容详情（阅读页）
- 职责：承载「正文/听读/图文」的主阅读体验；顶部只放阅读相关控制（返回、标题、进度/目录入口），不混入营销块
- 分层：主内容区域 > 阅读控制（字号/主题/朗读/书签）> 辅助信息（作者、来源、章节信息）> 扩展动作（评论/分享）放在阅读流末端或底部固定区

## 模式 2：目录与导航（章节/合集）
- 职责：提供章节定位与跳转；列表项必须包含「序号/章节名/阅读状态」，可选「时长/字数/更新标记」
- 布局：上方固定筛选/排序（如：最新、已读、下载）；列表使用一致行高与触达区，长标题换行规则一致，避免在列表内塞多行运营文案

## 模式 3：内容列表（发现/分类/专题）
- 职责：做「挑选」而非「阅读」；卡片只承载 1 个主点击（进入详情），次动作（收藏/加入书架）以图标弱化并靠右
- 分层：页面标题与筛选条件 > 列表卡片（封面/标题/一句摘要/核心指标如评分或热度）> 分页/加载状态；同屏信息密度保持舒适，避免卡片内堆叠标签墙

## 模式 4：书架/收藏（个人内容入口）
- 职责：承载「继续读」与「管理」两类任务；默认优先继续读，管理能力（排序/批量/删除）放在显式入口或编辑态
- 布局：顶部为状态与过滤（全部/在读/已完结/下载）；列表项必须露出进度（% 或章节），操作区与主点击分离，避免误触

## 模式 5：搜索（找书/找章节/找作者）
- 职责：输入、建议、结果三段清晰分区；建议只服务于缩短输入（历史/热词/联想），不要混入与输入无关的推荐
- 分层：搜索框与取消 > 建议区（空态）/结果区（有输入）> 纠错与无结果引导（改写关键词、切换范围）；结果列表与「内容列表」同卡片规范

## 模式 6：转化页（订阅/购买/权益）
- 职责：清楚说明「买什么、为什么现在买、买了怎么用」；不与阅读正文同屏竞争，避免在阅读页中段插入整块转化模块
- 分层：权益摘要（3–5 条可核对要点）> 价格与套餐选择 > 主要行动按钮（单一主按钮）> 保障与条款入口（折叠/次级）；所有对外链接（协议、客服）作为次级信息放底部

## 06. 页面模板

> *此板块已基于项目 StyleBrief 定制。*
> 稳定性：`extensible`

### Conversation Stage / 对话页
> 以消息流为核心，chrome 轻，输入区和上下文提示稳定可达

**结构**：
- context bars（可选）
- message stream
- composer
- 左侧 conversation list
- **MUST** 不做外层大卡片 + 内层消息卡片
- **MUST** 消息流随主区伸缩，不锁死固定阅读轨道
- **MUST** composer 保持底部稳定
- **示例**：chat · 小晴对话 · agent 对话流

### Workbench Split / 工作台
> 左列选择、中列主工作区、右侧辅助抽屉三段职责明确

**结构**：
- left list / sidebar
- main stage
- drawer / aside
- **MUST** 右侧辅助区不压过主任务
- **MUST** selected 态不能比主区更重
- **MUST** 窄屏优先主区，详情改覆盖层
- **示例**：dev-agent · workspace · 复杂任务执行页

### List Detail / 列表详情
> 适合配置、对象管理、关系浏览这类"先选对象、再看详情"的页面

**结构**：
- top bar
- left list / filter
- detail / form / read-only content
- **MUST** 未选中态要明确提示下一步
- **MUST** 风险操作与主保存操作视觉分离
- **MUST** 详情区标题与 meta 放在上方集中表达
- **示例**：memory · settings · 数据管理类页面

### Doc / Spec Viewer / 规范页
> 章节目录负责定位，右侧滚动内容区负责阅读和比较

**结构**：
- left chapter nav
- right content stage
- section header + examples + do/don't
- **MUST** 目录 current 态清晰
- **MUST** 内容宽度受控避免超长行
- **MUST** 示例卡与规范说明配对出现
- **示例**：design-system · 审计报告 · 长文档规范页


### 页面模板总览（B2C 阅读｜Bold｜Comfortable）
- 提供 4 套页面模板：Conversation Stage / Workbench Split / List Detail / Spec Viewer，覆盖「发现内容—进入阅读—沉浸互动—收藏/管理」的主路径；外包实现时优先复用模板骨架，不要为单页单写布局系统。

### 模板 1：Conversation Stage（沉浸阅读 + 互动）
- 适用场景：正文阅读、章节连载、读后提问/讨论、重点段落标注后触发互动（评论/问答/分享）。
- 区块结构建议：顶部轻量导航（返回/书名/进度）→ 主内容区（大字号、明显层级、段落留白）→ 段内工具（高亮/笔记/复制）→ 底部动作区（继续阅读/加入书架/评论入口）。
- 约束：保持「内容优先」，互动入口可见但不抢主视觉；同屏动作不超过 2 个主按钮，避免阅读中断。

### 模板 2：Workbench Split（阅读工作台｜左右分栏）
- 适用场景：阅读 + 笔记并行、原文与译文/注释对照、目录与正文并行、搜索结果定位到正文。
- 区块结构建议：左栏（目录/检索/笔记列表）→ 右栏（正文/卡片内容）→ 分栏拖拽与折叠（默认给正文更多宽度）→ 右栏内锚点跳转（章节/命中词）。
- 约束：分栏在移动端必须自动降级为单栏（先正文后辅助面板抽屉）；任何辅助信息都不能遮挡正文超过 30% 高度。

### 模板 3：List Detail（列表-详情｜发现与转化）
- 适用场景：书城/专题/书单、搜索结果、书架与收藏、作者页内容列表进入详情（书籍/文章/专栏）。
- 区块结构建议：列表区（筛选/排序置顶、卡片信息克制）→ 详情区（封面/标题/核心卖点/评分等）→ 明确主行动（开始阅读/试读/加入书架）→ 次行动（分享/关注/下载）。
- 约束：B2C 场景主按钮要强对比、位置稳定；列表滚动时保留轻量筛选，不要固定过多控件导致密度变高。

### 模板 4：Spec Viewer（规范/说明查看器｜内容型说明页）
- 适用场景：阅读计划说明、会员/权益规则、活动规则、隐私与协议、帮助中心长文档。
- 区块结构建议：标题区（清晰层级）→ 目录锚点（可折叠）→ 正文分节（小标题强、段距舒适）→ 底部反馈入口（有用/无用/联系客服）。
- 约束：强调可读性与可检索性；不要堆叠视觉装饰，保持 bold 但不花哨（用粗体层级和留白实现气质）。

## 07. 响应式规则

> *此板块已基于项目 StyleBrief 定制。*
> 稳定性：`extensible`

### Mobile (< 640px)
- **MUST** 单列优先，主导航压缩或抽屉化
- **MUST** 会话列表 / 详情区优先改覆盖层
- **MUST** 底部输入与主动作保持稳定可达

### Compact Desktop (640px - 1024px)
- **MUST** 保留双栏或紧凑三栏
- **MUST** 收紧侧栏宽度和区块间距
- **MUST** 次级信息区优先折叠而非压扁主内容

### Desktop (> 1024px)
- **MUST** 完整工作台布局，允许 sidebar + main + drawer 并存
- **MUST** 主区自然伸缩，只保留阅读舒适上限
- **MUST** toolbar / segmented 允许换行或堆叠

### Large Desktop (> 1440px)
- **MUST** 内容居中但不继续放大组件
- **MUST** 左右留白服务阅读，不制造无意义空轨道
- **MUST** 辅助区展开后仍保留主区上下文可见性

### 阅读移动端 (< 768px)
- **MUST** 正文列宽优先，侧栏能力折叠到底部
- **MUST** 固定工具条不可压缩正文首屏


## 断点与响应式带（沿用 4 档）
- 仍采用 4 档 breakpoint：sm 640 / md 1024 / lg 1440 / xl 1920，并按既有 frontmatter 的 4 个 bands 执行；实现上优先保证断点切换时内容不丢、操作不变难用。  

## 信息保留策略（阅读行业优先级）
- 任何断点下必须保留：书籍/内容标题、作者/来源、核心行动（开始阅读/继续/加入书架/购买其一或其二）、进度或状态（在读/已购/试读）、价格与优惠若存在；这些不参与折叠。  
- 可降级但不得消失：评分/字数/完读时长/标签等“决策辅助信息”，在 sm 允许合并为一行摘要；md 起逐步展开为多行。  

## 折叠顺序（从“装饰”到“决策”）
- 折叠顺序固定：装饰性封面/背景强化 → 次要元信息（标签/榜单位次/热度）→ 解释性文案（简介、编辑推荐、书评节选）→ 推荐/关联模块；永远不要先折叠主行动与当前阅读状态。  
- 长文本（简介/评论）在 sm 默认折叠为 2–3 行并提供“展开/收起”；展开后需要保持锚点与滚动位置，避免用户读到一半跳回顶部。  

## 操作可达性（bold 但不牺牲可用）
- sm 下主行动保持单手可达：主 CTA 放在内容区首屏或底部固定区（二选一，按页面类型统一），次 CTA 允许收入口径一致的“更多”菜单；任何被收起的操作必须 ≤2 次点击可达。  
- 交互密度为 comfortable：断点变小时减少同屏按钮数量而不是缩小可点区域；所有可点击目标保持足够间距，避免把“收藏/加入书架/分享”挤成难点的小图标。

## 08. 无障碍规范

> *此板块已基于项目 StyleBrief 定制。*
> 稳定性：`extensible`

### 键盘导航
- **MUST** 所有交互元素支持 Tab 键导航
- **MUST** focus-visible 清晰可见，不能只靠细微色差
- **MUST** Enter / Space / Esc 行为与控件语义一致

### 语义化 HTML
- **MUST** 优先使用 button / nav / header / main / article 等语义标签
- **MUST** 标题层级清晰，不跳级
- **MUST** 列表、表单、说明关系通过语义结构表达

### ARIA 约束
- **MUST** icon-only button 提供 aria-label 或 title
- **MUST** error 使用 aria-describedby 关联
- **MUST** expanded / current / disabled 等状态需要语义化标注

### 对比度与反馈
- **MUST** 玻璃感不能牺牲正文可读性
- **MUST** 状态不能只靠颜色表达
- **MUST** loading / error / empty 必须有可读文案

### 点击热区
- **MUST** 最小点击热区建议不小于 36×36
- **MUST** 高频操作优先 40×40 以上
- **MUST** 列表项和 icon button 都要保证可点击余量

### 硬指标
- 正文对比度 ≥ 4.5
- 大文本对比度 ≥ 3
- 触摸目标 ≥ 36×36

## 硬指标（必须达标）

- 文本对比度：正文/长段阅读文本 ≥ 4.5:1；大字（≥ 18pt 或 ≥ 14pt bold）≥ 3:1；占位符/次要说明也按文本算，不得用“灰到看不见”
- 非文本对比度：图标、描边、分割线、焦点环、进度/标记等 UI 关键元素 ≥ 3:1（阅读行业常见的细线/小图标必须特别自检）
- 触摸目标：可点击/可触控区域不小于 36×36；行内图标、书签/收藏等小按钮必须补足热区，不要只放 16–20px 图标
- 焦点可见性：必须有清晰 focus-visible 样式，不能只靠颜色变浅/变深；在浅色与深色主题下都要保持可辨识（建议用描边+外发光/底色叠加的组合）

## 交互与输入（键盘/触摸一致）

- 键盘操作：Tab 顺序与视觉阅读顺序一致；Enter/Space 触发按钮与可点击卡片；Esc 关闭弹层/抽屉/对话框并回到触发点；不要做“Tab 进不去/出不来”的区域
- 焦点管理：弹层打开时焦点进入容器内的第一个可操作元素，关闭后回到触发按钮；避免自动把焦点跳到阅读正文导致用户迷失
- 触摸与滚动：翻页/展开/设置等手势不与系统返回、滚动手势冲突；可滑动区域必须提供可替代的按钮入口（键盘与读屏可达）

## 语义与提示（别让用户猜）

- 状态不靠颜色：选中/已读/错误/成功/禁用必须同时有形状/文案/图标或 aria 状态表达；仅用“变灰/变红”不合格
- 语义组件：用正确的按钮/链接语义（跳转用链接，触发行为用按钮）；可展开区域要有明确的“展开/收起”提示与状态同步
- icon-only：所有纯图标按钮必须有可读名称（aria-label 或同等方案）；名称要说动作与对象，如“加入书架”“打开阅读设置”，不要只写“按钮/更多”
- 表单与校验：输入框必须有关联标签；错误提示给出原因与修复建议，并在提交失败时把焦点带到首个错误处（阅读类注册/登录/订阅流程重点检查）

## 自检清单（必跑）

- [ ] 对比度：正文 ≥ 4.5:1；非文本 ≥ 3.0:1；浅/深主题都通过
- [ ] 键盘：Tab 顺序合理；Enter/Space/Esc 行为符合语义；弹层焦点可进可出且可回到触发点
- [ ] focus-visible 清晰可见，不靠轻微色差；焦点环/描边本身对比度达标
- [ ] 状态不仅靠颜色表达（选中/错误/禁用/已读等都有非颜色信号）
- [ ] 触摸目标 ≥ 36×36；行内小图标已补足热区且不误触
- [ ] icon-only 按钮有准确的 aria-label（动作明确，不用“更多/按钮”糊弄）

## 09. 动效规则

> *此板块已基于项目 StyleBrief 定制。*
> 稳定性：`experimental`

### 时长 / Duration
- **MUST** 100ms 用于 hover / focus / press
- **MUST** 180-240ms 用于 selected、drawer、panel 切换
- **MUST** 避免超过 400ms 的高注意力动画

### 缓动 / Easing
- **MUST** ease-out 用于进入
- **MUST** ease-in 用于退出
- **MUST** ease-in-out 用于状态切换
- **MUST** linear 留给加载和进度反馈

### 动画类型
- **MUST** 优先 opacity、轻位移、轻阴影变化
- **MUST** 允许短距离 slide / scale / rotate
- **MUST** 避免大范围 glow、重 blur 扩散和弹跳感

### 原则
- **MUST** 动效服务于反馈和层级，不服务于炫技
- **MUST** 大部分反馈短、轻、可预测
- **MUST** 尊重 prefers-reduced-motion，保留状态语义但弱化位移


## 动效边界（适用范围与克制）
- 动效只用于阅读场景的「状态变化与层级提示」：加载/刷新、收藏/点赞、加入书架、进度变化、弹层出现/消失；不做与内容无关的装饰性位移或循环动画。
- 单次交互最多触发 1 个主动效 + 1 个轻量辅助反馈（如按钮按压/高亮）；避免多元素同时大幅运动干扰阅读注意力。
- 页面滚动与排版重排时不做跟随式动画；长文内容区域优先保持稳定，动效集中在控件与浮层层级。

## 时长与缓动（bold 但不拖沓）
- 反馈型微动效：100ms（按压、选中态、icon 轻微缩放/填充变化）。
- 常规过渡：180–240ms（弹层/抽屉/底部操作条进入、列表项展开收起、轻提示出现）。
- 仅限复杂场景可到 ≤400ms（跨页主题切换、阅读模式切换等），并保证不影响连续翻页/滚动节奏。
- 缓动统一：进入用 ease-out、退出用 ease-in、状态切换用 ease-in-out；禁止弹跳、回弹等夸张曲线（除非明确用于错误提示且幅度受控）。

## reduced-motion（必须可用）
- 系统开启「减少动态效果」时：移除位移/缩放/视差，只保留不引起眩晕的淡入淡出与颜色/描边变化；时长减半但不低于 80ms，避免闪烁。
- 关键反馈不得因 reduced-motion 缺失：加载/提交/错误/成功需保留明确的状态文案或图标变化，不依赖动画本身传达结果。

## 反馈层级（阅读优先、结果明确）
- 三级反馈：即时（按下/hover）→ 进行中（loading/禁用态）→ 结果（成功/失败/撤销入口）；每次交互至少覆盖「即时 + 结果」。
- 成功反馈优先轻量（颜色/勾选/填充变化 + 轻淡入提示），失败反馈更明确（抖动幅度小、持续短，配合文案）；避免遮挡正文的强提示频繁出现。

## 10. 文案规范

> *此板块已基于项目 StyleBrief 定制。*
> 稳定性：`experimental`

### 语气和风格
- **MUST** 整体语气专业、简洁、友好
- **MUST** 不卖萌，不像营销页口播
- **MUST** 默认使用清楚、低噪音的表达

### 按钮文案
- **MUST** 优先动词开头
- **MUST** 2 到 8 个字为宜
- **MUST** 危险操作直接说明后果，避免"确定"这类空词

### 错误信息
- **MUST** 说明失败原因
- **MUST** 给出可恢复动作
- **MUST** 避免只暴露技术码或抽象报错

### 空态文案
- **MUST** 说明这里是什么
- **MUST** 解释为什么现在为空
- **MUST** 明确下一步能做什么

### 标点与格式
- **MUST** 按钮和 badge 不使用句号
- **MUST** 完整句子使用中文标点
- **MUST** 避免感叹号泛滥，省略号统一使用 ...

### 数字与单位
- **MUST** 数字和单位之间保留空格，如 32 MB
- **MUST** 百分号紧贴数字，如 85%
- **MUST** 大数字使用千分位，便于快速扫读

### 内容型文案
- **MUST** 标题优先准确、可检索，不追求夸张营销
- **MUST** 摘要负责说明价值，不复述标题


## 语气（Tone）
- 面向 B2C 读者与创作者，整体语气要大胆、直接、清晰；不装可爱、不卖弄文学腔，用短句给明确指令与结果
- 同一条用户路径里（按钮→加载→成功/错误→空态），措辞要统一口吻与称呼，不要一会儿“你”一会儿“用户”；默认用“你”
- “阅读”场景优先减少打扰：能用一句说清就别拆成两句；能让用户继续读就别逼用户思考规则

## 按钮文案（Buttons）
- 按钮用动词开头、表达可执行动作：优先“继续阅读 / 开始阅读 / 加入书架 / 去购买 / 去登录 / 保存进度 / 立即同步”
- 主按钮更果断，避免含糊词：不用“确定/好的/提交”这类泛词；需要确认语义时用“确认购买 / 确认删除”
- 同屏按钮保持并列结构一致：例如“加入书架 / 立即阅读 / 试读”；避免一个是动词短语、另一个是名词
- 危险操作按钮要点明后果：用“删除书籍 / 清空书架 / 取消订阅”，不要只写“删除/清空/取消”

## 错误文案（Errors）
- 错误信息按顺序写：发生了什么 → 为什么（如可判断）→ 用户下一步；不要只给技术原因或错误码
- 语气要硬朗但不责备：不用“你操作有误/你输入错误”，改为“信息不完整 / 账号或密码不匹配”
- 可恢复错误给可执行指引：例如“网络不稳定，稍后重试”配“重试”；“权限不足”配“去登录/去开通”
- 同类错误统一措辞与结构：登录、支付、同步、下载等模块不要各写各的风格；避免同一含义出现多种说法（如“失败/出错/异常”混用）

## 空态文案（Empty States）
- 空态要把“下一步”写出来，按钮与文案同口吻：例如“书架还没有内容，去挑一本开始读”+“去书城”
- 不做情绪化自嘲或营销式夸张；允许有轻微的 bold 鼓励，但要服务动作：例如“从一本开始，读下去”
- 空态与错误分清：空态不说“失败/错误”，只描述当前没有数据的事实与可选动作（搜索、添加、导入、同步）

## 标点与数字（Punctuation & Numbers）
- 中文界面默认用全角标点；提示类短句尽量不加感叹号，确需强调只用一个
- 数字与单位统一：阅读时长、章节、进度用阿拉伯数字；“3 分钟 / 12 章 / 45%”；数字与单位之间留空格（百分号除外）
- 书名、专有名词保持原样；中英文混排时注意可读性，避免连续三种括号/引号混用

---

## 附录：Token 速查表

> 完整值见同目录下的 `tokens.css`。

### Color（brand-500 / neutral-500 / feedback-500）
- brand-500: `#651ce3`
- neutral-500: `#787d87`
- success-500: `#3dc274`
- warning-500: `#edab12`
- danger-500: `#e0381f`
- info-500: `#2170de`

### Typography
- body: 15px / 1.6
- title: 20px / 1.4
- caption: 12px

### Spacing
- 基数：4px
- 阶梯：0 / 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48px

### Radius
- xs/sm/md/lg/xl/pill: 2/4/8/12/18/999px
