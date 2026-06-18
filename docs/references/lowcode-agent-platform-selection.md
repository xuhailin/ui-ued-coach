# 低代码 Agent 平台选型卡

## 场景

学习 Agent 生态时，经常会把 Coze、Dify、FastGPT、n8n 和 ReAct、RAG、workflow 混在一起比较。正确看法是：这些是实现 Agent / LLM 应用的平台，不是单独的范式。

## 选型口诀

| 需求 | 优先平台 | 原因 |
| --- | --- | --- |
| 快速原型验证、非技术用户 | Coze | Bot / Agent 搭建快，插件、知识库、工作流和渠道发布门槛低 |
| 企业级应用、复杂业务逻辑、多模态生成 | Dify | 更像生产级 LLM 应用开发平台，适合 workflow、agent、RAG、评测和运维 |
| 私有知识库问答、智能客服 | FastGPT | 知识库、RAG 问答、可视化流程和客服场景是主线 |
| 深度业务集成、通用自动化流程 | n8n | 强在跨系统工作流、触发器、连接器和确定性流程编排 |

## 平台定位

| 平台 | 定位 | Agent 关联 |
| --- | --- | --- |
| Coze | 快速创建 Bot / Agent 的低代码平台 | 把 tool use、RAG、workflow、角色设定和发布渠道包装成可配置 Bot |
| Dify | LLM 应用开发平台 | 横跨机制层和控制流，可实现 Agentic RAG、workflow、Evaluator-Optimizer |
| FastGPT | AI 知识库和问答应用平台 | 以 RAG 为核心，叠加 workflow 和轻量 Agent 决策 |
| n8n | 通用工作流自动化平台 | 用 AI / Agent 节点增强工作流，让 LLM 做理解、抽取、判断 |

## 不要归错类

- Coze、Dify、FastGPT、n8n 是平台 / 框架 / 工具，不和 ReAct 平级比较。
- ReAct、Plan-and-Execute、Reflection 是控制流范式。
- RAG、tool use、memory、structured output 是机制层能力。
- workflow 是工程编排视角，常常比自由 Agent 更稳定。

## 落地判断

1. 用户是谁：非技术用户优先 Coze，工程团队可看 Dify / FastGPT / n8n。
2. 数据在哪里：知识库为主看 FastGPT / Dify，业务系统为主看 n8n。
3. 流程复杂度：简单 Bot 看 Coze，复杂分支和评估看 Dify，确定性自动化看 n8n。
4. 风险要求：企业场景要看权限、审计、私有化、日志、监控和评估。
5. Agent 自主性：能用固定 workflow 解决的，不要过早交给模型自由决策。

## 典型组合

- Coze：活动运营 Bot、客服原型、内容助手、面向业务方的快速 demo。
- Dify：企业内部 LLM 应用、多步骤生成、Agentic workflow、复杂 RAG 应用。
- FastGPT：产品文档问答、私有知识库助手、售前售后客服、FAQ 自动化。
- n8n：CRM 同步、工单流转、邮件摘要、数据报表、跨 SaaS 自动化。

## 参考入口

- Coze: https://www.coze.com
- Dify: https://dify.ai
- FastGPT: https://fastgpt.io
- n8n: https://n8n.io
