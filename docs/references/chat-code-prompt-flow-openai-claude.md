# OpenAI / Claude Chat 与 Code Prompt 链路卡

## 场景

理解 ChatGPT、Claude Chat、Codex、Claude Code 这类产品时，容易把“用户输入的一句话”误认为完整 prompt，也容易看不清它最终为什么会输出文本、工具调用、文件修改或命令结果。

## 关键判断

真实进入模型的通常不是裸用户输入，而是一个 prompt pack：系统 / 开发者规则、用户消息、会话历史、文件或图片、工具定义、检索结果、记忆、仓库规则和执行轨迹会被按产品规则组装进上下文。Chat 产品更偏回复与工具结果，Code Agent 更偏读仓库、改文件、跑命令、验证和汇报。

## 稳定解法

看一条 prompt 链路时，用四段拆：

1. 输入：用户这次说了什么，包括文字、文件、截图、代码片段、选中文本。
2. 关联：系统额外注入了什么，包括 system / developer instructions、历史消息、工具 schema、记忆、仓库规则。
3. 行动：模型是直接回答，还是先输出 tool call / tool_use，或在代码环境里读文件、改文件、跑命令。
4. 输出：最终是自然语言、结构化 JSON、stream events、tool result、文件 diff、命令日志还是验证结论。

## 四类链路

| 产品形态 | Prompt 进入 | 关联上下文 | 输出形态 |
| --- | --- | --- | --- |
| OpenAI Chat / Responses API | user input + instructions + input items | conversation state、built-in tools、custom functions、remote MCP、structured output schema | output_text、output items、function_call、function_call_output、JSON、streaming delta |
| Claude Chat / Messages API | system prompt + messages 数组 + user message | history messages、files、images、tool schemas、tool descriptions、context window 管理 | content blocks、text、tool_use、tool_result loop、stop_reason、SSE streaming |
| OpenAI Codex / Code Agent | 用户任务 + 当前工作区 + 仓库规则 | AGENTS.md、repo 文件、终端输出、工具记录、MCP、skills、执行计划 | 文件补丁、命令结果、测试结论、浏览器检查、最终说明 |
| Claude Code | 用户任务 + 当前项目目录 + Claude Code 工具环境 | CLAUDE.md、rules、auto memory、代码库文件、命令输出、skills、hooks | 自然语言说明、文件修改、命令日志、工具调用结果、检查点、最终总结 |

## 容易混的点

- tool call / tool_use 是让外部系统做事；structured output 是让模型最终答案更好解析。
- Code Agent 的输出不是“生成一段代码”这么简单，而是“行动轨迹 + 文件变更 + 验证结论”。
- Claude Code 的 CLAUDE.md 是项目规则入口，但不等同于底层 system prompt。
- OpenAI Responses API 把对话状态、工具、内置工具和结构化输出统一在一个 agentic API 里。
