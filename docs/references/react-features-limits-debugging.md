# ReAct 特点、局限性与调试技巧卡

## 场景

读 Datawhale Hello Agents 第 4 章时，不能只把 ReAct 记成“边想边做”。真正要记住的是它的工程闭环：

`Prompt 模板 -> LLM 输出 -> 解析 Thought / Action -> 执行工具 -> Observation 回灌 history -> 下一轮 prompt`

## 核心判断

ReAct 是控制流范式，不是工具机制。它把推理和行动交替组织起来，让 LLM 根据外部工具的观察结果动态调整下一步。

## 工作闭环

| 环节 | 作用 | 关键点 |
| --- | --- | --- |
| Prompt | 约束模型输出格式 | 注入工具清单、用户问题、历史记录，要求输出 Thought / Action |
| Parse | 把文本变成可执行指令 | 从原始输出提取 Thought 和 Action，再解析 `Tool[input]` 或 `Finish[answer]` |
| Act | 调用真实工具 | 查工具注册表，执行搜索、计算、API 等函数 |
| Observe | 把结果写回上下文 | 将 Action 和 Observation 追加到 history，供下一轮推理使用 |
| Stop | 防止无限循环 | 使用 `Finish[...]`、`max_steps`、错误计数、超时等停止条件 |

## 主要特点

| 特点 | 解释 |
| --- | --- |
| 高可解释性 | Thought 让人能看到每一步为什么选工具、为什么继续或结束 |
| 动态规划与纠错 | 每一步都根据 Observation 调整下一步，而不是一次性写死计划 |
| 工具协同能力 | LLM 负责判断和规划，工具负责搜索、计算、查库、API 调用 |

## 固有局限

| 局限 | 风险 |
| --- | --- |
| 依赖 LLM 能力 | 推理、指令遵循、格式输出不稳会导致 Action 错误 |
| 执行效率问题 | 多轮串行调用 LLM，延迟和 token 成本会累积 |
| 提示词脆弱 | 模板措辞、示例、工具描述变化会影响稳定性 |
| 可能局部最优 | 走一步看一步容易被当前观察带偏，甚至原地循环 |

## 调试清单

1. 打印每次调用前的完整 prompt，看工具清单、问题、history 是否正确。
2. 解析失败时保留 LLM 原始输出，先判断是模型没按格式还是 parser 有问题。
3. 检查 tool_input 是否符合工具函数预期。
4. 检查 observation 是否短、准、可被模型继续使用。
5. 在 prompt 里加入 1-2 个成功 few-shot 样例。
6. 降低 temperature，让 Action 输出更确定。
7. 设置 max_steps、超时、重复 Action 检测，防止无限循环。

## 什么时候适合

- 任务路径不确定，需要边查边决定。
- 需要实时知识、外部计算、数据库或 API。
- 排障、研究、代码修复这类需要观察反馈的任务。

## 什么时候不适合

- 步骤固定、控制流清楚的任务，用 workflow 或 prompt chaining 更省。
- 工具调用链可以提前确定且可并行，用 ReWOO、LLM Compiler 或 Plan-and-Execute 更合适。
- 对延迟极敏感、工具不稳定、模型格式遵循很差的场景，不宜裸用 ReAct。

## 来源

- Datawhale Hello Agents 第 4 章：智能体经典范式构建
