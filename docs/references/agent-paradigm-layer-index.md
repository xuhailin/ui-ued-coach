# Agent 范式关键词分层索引卡

## 场景

看到 Agent 领域的新名词时，很容易把机制、单 Agent 控制流、多 Agent 协作、框架和选型视角混在一起比较。

## 关键判断

先问“它落在哪一层”，再讨论优劣。机制层回答能做什么，控制流范式层回答一个 Agent 怎么安排思考与行动，协作范式层回答多个 Agent 怎么分工；框架、workflow 选型视角和 Agentic RAG 这类组合体是横切概念。

## 稳定解法

1. 如果它描述具体能力，例如 tool use、RAG、Memory、Structured output，归入机制层。
2. 如果它描述单个 Agent 的行动组织，例如 ReAct、Plan-and-Execute、Reflection、ToT，归入控制流范式层。
3. 如果它描述多个 Agent 的分工，例如 Orchestrator-Worker、Role-playing、Debate、Blackboard，归入协作范式层。
4. 如果它是 LangGraph、AutoGen、CrewAI、LlamaIndex 这类工具，不和 ReAct 平级比较；它们是实现范式的框架。
5. 如果它是 Workflow vs Agent、Prompt chaining、Routing、Agentic RAG，先按横切视角或组合体处理。

## 关键词速查

| 层级 | 关键词 |
| --- | --- |
| 机制层 | tool use / function calling、MCP、RAG、Memory、Structured output、Code execution / Code as action、Streaming |
| 控制流范式层 | ReAct、ReWOO、Plan-and-Execute / Plan-and-Solve、LLM Compiler、Tree of Thoughts、Graph of Thoughts、Reflexion、Self-Refine / Reflection、Evaluator-Optimizer |
| 协作范式层 | Orchestrator-Worker、Hierarchical、Role-playing、Debate、Blackboard |
| 易混 / 横切 | Workflow vs Agent、Prompt chaining、Routing、LangGraph / AutoGen / CrewAI / LlamaIndex、Agentic RAG |
