# AI 3D 生成、3DGS 与 Three.js 关系卡

## 场景

- 看到 TripoSplat 这类网站：上传一张图，就能生成一个可旋转查看的 3D 物体。
- 容易把“AI 生成 3D”“3D Gaussian Splat”“Three.js”“建模软件里的 mesh”混成一件事。

## 关键判断

TripoSplat 这类工具不是简单在网页里放了一个 3D 模型，而是用 AI 从 2D 图片推断一个可从多角度渲染的 3D 表示。它更像“图片被补全成一个可看的空间资产”，而不是传统建模师手工做出的干净模型。

## 它们分别是什么

### TripoSplat

- 一个单图转 3D Gaussian Splat 的 AI 模型 / demo。
- 输入通常是一张物体图。
- 输出更接近 `.ply` / `.splat` 这类 3DGS 资产。
- 适合快速生成可旋转预览、概念资产、网页互动展示。

### 3D Gaussian Splatting

- 一种 3D 表示和渲染方式。
- 它不是用很多三角面片拼模型，而是用大量带位置、颜色、透明度、尺度的“高斯点”来组成视觉体积。
- 优点是视觉细节和视角渲染很强，尤其适合把图像感保留下来。
- 缺点是它不天然等于干净 mesh，做骨骼绑定、碰撞、3D 打印、精细拓扑编辑时不如传统模型顺手。

### Mesh / GLB / OBJ

- 传统 3D 模型通常是 mesh：点、边、面组成的几何体。
- `.glb` / `.gltf` / `.obj` 常见于网页 3D、游戏、建模软件。
- 优点是结构清楚，适合编辑、动画、碰撞、材质、工程落地。
- 缺点是从单张图自动生成高质量 mesh 很难，经常会糊、破面或背面猜错。

### Three.js

- Three.js 是网页里的 3D 渲染库。
- 它本身不是 AI 生成模型的工具，而是把 3D 内容显示到浏览器里的工具。
- 它可以加载 mesh，也可以配合特定 loader / renderer 显示 3DGS 资产。
- 可以理解为：AI 负责“生成资产”，Three.js 负责“在网页里把资产呈现和交互起来”。

## 稳定解法

以后看到“AI 一张图生成 3D”的 demo，先问四个问题：

1. 它生成的是 mesh，还是 3DGS / NeRF 这类视觉表示？
2. 能不能导出 `.glb` / `.obj` / `.ply` / `.splat`？
3. 目标是网页展示、游戏资产、3D 打印，还是建模工作流？
4. 有没有现成 viewer，比如 Three.js、SparkJS、SuperSplat、Babylon.js 或原生 App viewer？

## 对 UI/UED 的启发

- 这类 demo 的震撼点不只在模型能力，也在交互包装：上传、等待、生成、可旋转查看，整个过程让用户立刻感到“图活了”。
- 设计 AI 工具时，结果预览比解释模型原理更重要。
- 资源卡里可以把它归到 `AI / 3D / 生成`，作为“新型创作工具体验”的参考，而不是只当技术论文看。

## 相关资源

- TripoSplat: https://www.tripo3d.ai/research/triposplat
- Hugging Face Space: https://huggingface.co/spaces/VAST-AI/TripoSplat
- Hugging Face Model: https://huggingface.co/VAST-AI/TripoSplat
- Three.js: https://threejs.org/
