# 代码型 Agent 框架选型卡

## 场景

读 Datawhale Hello Agents 第 6 章时，要把 AutoGen、AgentScope、CAMEL、LangGraph 放到“框架 / 脚手架”这一层，而不是和 ReAct、RAG、Memory 平级比较。

框架的价值是把 Agent Loop、模型层、工具层、记忆层、状态管理、可观测性和多智能体通信标准化，让复杂 Agent 系统更可复用、可调试、可维护。

## 为什么需要框架

| 能力 | 说明 |
| --- | --- |
| 复用 Agent Loop | ReAct、Plan-and-Solve、Reflection 都可以基于统一执行器搭建 |
| 组件解耦 | 模型层、工具层、记忆层分开，方便替换模型、扩展工具、调整记忆策略 |
| 状态管理 | 长任务、多轮对话、上下文窗口、历史持久化和多 Agent 消息需要统一结构 |
| 可观测性 | callbacks、事件、运行轨迹和日志比手动 print 更适合复杂系统 |

## 四个框架定位

| 框架 | 核心思想 | 适合场景 | 主要局限 |
| --- | --- | --- | --- |
| AutoGen | 对话驱动协作，把多角色 Agent 组织成群聊 | 软件团队模拟、评审、人类在环、多角色协作 | 对话不确定，可能偏航或循环；调试要读长对话历史 |
| AgentScope | 消息驱动、工程化、分布式多 Agent 平台 | 大规模、高并发、生产级多 Agent 系统 | 学习成本高，简单场景可能过度工程化 |
| CAMEL | 角色扮演 + inception prompting，轻架构重提示 | 创作、研究、专家协作、双角色深度讨论 | 高度依赖提示词，大规模路由和冲突仲裁较弱 |
| LangGraph | 用状态图显式控制节点、边、循环和条件跳转 | 可审计工作流、Reflection、工具链、人类审核 | 前期代码量较多，开放式涌现协作较弱 |

## 设计轴

| 轴 | 偏左 | 偏右 |
| --- | --- | --- |
| 协作方式 | 涌现式对话：AutoGen、CAMEL | 显式流程：LangGraph |
| 工程化程度 | 原型 / 轻协作：CAMEL、AutoGen | 生产 / 分布式：AgentScope |
| 控制权 | 让角色根据目标互动 | 开发者定义状态、节点、边和条件 |

## 选型口诀

1. 想模拟团队协作：AutoGen。
2. 想做生产级多 Agent：AgentScope。
3. 想让专家角色互相启发：CAMEL。
4. 想要可靠、可审计、可循环的工作流：LangGraph。

## 不要归错类

- AutoGen、AgentScope、CAMEL、LangGraph 是框架。
- ReAct、Plan-and-Execute、Reflection 是控制流范式。
- RAG、tool use、memory、structured output 是机制层。
- 框架可以实现范式，也可以组合机制，但它本身不是“某一种 Agent 思维方式”。

## 来源

- Datawhale Hello Agents 第 6 章：框架开发实践
