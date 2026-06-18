# AI Companion 表情与贴纸素材库筛选卡

## 场景

- 给 AI companion、聊天产品、智能助手做“表情 / 贴纸 / 小动作”能力。
- 容易一上来就找网络梗图，导致风格散、人格不稳定。
- 也容易把 emoji、贴纸、徽章、动效素材混成同一种表达资产。

## 关键判断

表情素材先按角色分三类，不要只按“好不好看”挑：

- **主贴纸**：承担角色人格，例如小晴自己的表情、小动作、身体语言。
- **辅助徽章**：作为消息点缀，例如星星、爱心、彩虹、完成标记。
- **外部动图**：用户主动搜索的补充表达，例如 GIPHY sticker，不作为角色默认人格。

AI companion 最重要的是“稳定人格识别”，不是素材越多越好。

## 资源清单

### 适合直接挑素材

- [LottieFiles Emoji Animations](https://lottiefiles.com/free-animations/emoji)
  - 动效表情，适合找轻量动作、loading、情绪反馈。
  - 可关注 GIF / MP4 / Lottie JSON 形态。

- [IconScout Animated Stickers](https://iconscout.com/animated-stickers)
  - 贴纸数量多，适合找一整套风格。
  - 适合做候选池，不要混用太多画风。

- [Streamline Emojis](https://www.streamlinehq.com/elements/emojis)
  - 质量稳定，偏产品级。
  - 适合 UI 系统里的统一 emoji / sticker 视觉。

- [Emoji.gg Packs](https://emoji.gg/packs)
  - Discord / Telegram / WhatsApp 风格的表情包集合。
  - 适合淘可爱、小众、徽章类素材。

### 开源 emoji 包

- [OpenMoji](https://openmoji.org/library/)
  - 风格统一，扁平、清晰。
  - 适合标准 emoji 替换或基础图标化表达。

- [Noto Emoji](https://github.com/googlefonts/noto-emoji)
  - Google Noto，覆盖完整，偏标准 emoji。
  - 适合做系统级 emoji fallback。

- [Noto Color Emoji - Google Fonts](https://fonts.google.com/noto/specimen/Noto%2BColor%2BEmoji)
  - 适合快速看整体风格。

### 找灵感

- [Dribbble sticker pack 搜索](https://dribbble.com/search/sticker-pack)
  - 很适合判断角色贴纸包应该长什么样。
  - 重点看“角色一致性”和“动作覆盖”，不要只看单张图。

- [WonderPals Animated Emojis](https://www.wonderpals.com/emojis)
  - 可爱、亲和，适合作为 companion 风格参考。

- [GIPHY Stickers](https://giphy.com/stickers)
  - 适合外部搜索入口和关键词调研。
  - 不适合作为 AI companion 自动发送的主贴纸来源。

## 示例判断：Wooden Badges

资源：[Wooden Badges Emoji Pack](https://emoji.gg/pack/31510-wooden-badges)

基础信息：

- 名称：Wooden Badges
- 作者：emily ΘゝΘ
- 数量：9 个 emoji
- 标签：Heart / Star / Cat / Rainbow / Cute
- 风格：木质徽章、小装饰、偏可爱但不是人物表情

判断：

- 适合做 **辅助徽章 / 消息点缀**。
- 不适合作为 AI companion 的主贴纸包。
- 可用于鼓励、夸夸、轻松收尾、完成状态。

示例 catalog：

```ts
{
  id: 'wooden-heart',
  label: '木质爱心',
  emotionTags: ['warm', 'tender'],
  tags: ['喜欢', '暖暖的', '贴一下', '陪伴'],
  alt: '一个木质爱心徽章',
  placement: 'inline_after_text'
}
```

```ts
{
  id: 'wooden-star',
  label: '木质星星',
  emotionTags: ['happy', 'playful'],
  tags: ['夸夸', '完成', '灵光', '不错哦'],
  alt: '一个木质星星徽章',
  placement: 'inline_after_text'
}
```

```ts
{
  id: 'wooden-rainbow',
  label: '木质彩虹',
  emotionTags: ['happy', 'warm'],
  tags: ['变好了', '轻松', '好心情', '小希望'],
  alt: '一个木质彩虹徽章',
  placement: 'inline_after_text'
}
```

## 稳定解法

给 AI companion 选表情素材时，按这个流程筛：

1. 先确定“主贴纸”风格：角色形象、脸型、动作、线条、色彩要统一。
2. 再找“辅助徽章”：星星、爱心、彩虹、OK、完成等，作为消息尾巴的小印章。
3. 最后接外部搜索：GIPHY 这类只给用户主动搜索用，不让 AI 默认乱发。
4. 每个素材都落成结构化 catalog，而不是只存图片 URL。

最小 catalog 字段：

```ts
{
  id: string,
  label: string,
  emotionTags: Array<'calm' | 'happy' | 'warm' | 'playful' | 'sad' | 'worried' | 'serious' | 'tender'>,
  tags: string[],
  assetUrl: string,
  alt: string,
  placement: 'inline_after_text' | 'standalone'
}
```

## 记忆句

AI companion 的贴纸包先选“人格动作”，再选“消息徽章”，最后才接“外部动图”。
