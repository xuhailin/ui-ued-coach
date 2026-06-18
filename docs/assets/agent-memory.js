const MEMORY_TYPES = [
  {
    key: "short_context",
    title: "短期上下文记忆",
    en: "short_context",
    what: "当前对话和任务状态",
    example: "用户刚说“这版先别改颜色”",
    value: "保持当前任务连贯",
    risk: "会话结束后丢失",
    band: "short",
    sensitive: false,
    color: "#4a4854",
  },
  {
    key: "profile",
    title: "长期用户画像记忆",
    en: "profile",
    what: "稳定偏好、身份、习惯",
    example: "用户偏好中文回答、喜欢简洁方案",
    value: "个性化体验",
    risk: "画像误判会冒犯用户",
    band: "long",
    sensitive: true,
    color: "#b65b2a",
  },
  {
    key: "project",
    title: "任务 / 项目记忆",
    en: "project",
    what: "项目规则、文件结构、业务目标",
    example: "当前项目使用结构化记忆，敏感项需确认后保存",
    value: "减少重复说明",
    risk: "过期规则污染新任务",
    band: "long",
    sensitive: false,
    color: "#2a4f8c",
  },
  {
    key: "event",
    title: "事件 / 情节记忆",
    en: "event",
    what: "发生过的互动、里程碑、承诺",
    example: "上周用户完成 Day 3 页面拆解",
    value: "陪伴感和连续性",
    risk: "容易变成无意义流水账",
    band: "long",
    sensitive: false,
    color: "#1d6a3a",
  },
  {
    key: "relation",
    title: "关系记忆",
    en: "relationship",
    what: "人、项目、物品、地点之间的关系",
    example: "用户、项目、团队成员和长期目标之间的关系",
    value: "支持复杂理解",
    risk: "需要时间、来源和冲突处理",
    band: "long",
    sensitive: true,
    color: "#6b3f8c",
  },
  {
    key: "emotion",
    title: "情绪 / 状态记忆",
    en: "emotional_state",
    what: "用户长期状态、压力、喜好氛围",
    example: "用户最近希望被温和提醒，不要催促",
    value: "提升情感贴合",
    risk: "敏感度高，必须谨慎",
    band: "long",
    sensitive: true,
    color: "#c45341",
  },
  {
    key: "procedural",
    title: "程序性记忆",
    en: "procedural",
    what: "怎么做某类事的步骤",
    example: "每次发版前先检查截图和本地预览",
    value: "提升执行质量",
    risk: "错误流程会被固化",
    band: "long",
    sensitive: false,
    color: "#4a4854",
  },
  {
    key: "reflection",
    title: "反思记忆",
    en: "reflection",
    what: "失败原因、用户纠正、经验总结",
    example: "之前过度展开理论，用户更想要可执行 MD",
    value: "让 Agent 越用越顺手",
    risk: "需要区分事实和推断",
    band: "meta",
    sensitive: false,
    color: "#2a6a6b",
  },
  {
    key: "safety",
    title: "安全边界记忆",
    en: "safety_boundary",
    what: "不能做什么、需要确认什么",
    example: "不自动提交敏感信息，不擅自强情感化",
    value: "控制风险",
    risk: "过严会影响体验",
    band: "meta",
    sensitive: true,
    color: "#16151c",
  },
];

const SCENARIOS = {
  assist: {
    title: "助手型",
    en: "Assistant",
    tagline: "工具 / 效率 / 任务导向",
    color: "#2a4f8c",
    goal: "更快完成工作、减少重复说明、自动化流程、提高决策质量。",
    axes: [
      ["产品定位", "工具型、效率型、任务导向"],
      ["典型场景", "编程助手、文档助手、日程助手、客服助手、研究助手"],
      ["记忆重点", "用户偏好、项目规则、任务流程、工具使用习惯、历史决策"],
      ["不应该强调", "情绪依恋、强人格关系、暧昧表达"],
      ["成功标准", "更准确、更省事、更可控、更少重复问"],
    ],
    memory: ["短期上下文 + 长期偏好", "项目 / 任务记忆", "程序性记忆", "轻量反思记忆"],
    warnings: [],
  },
  companion: {
    title: "陪伴型",
    en: "Companion",
    tagline: "关系弱于伴侣，能力强于普通助手",
    color: "#6b3f8c",
    goal: "有一个长期理解自己的 AI，同步生活 / 学习 / 项目状态，获得稳定陪伴与反馈。",
    axes: [
      ["产品定位", "日常同伴 + 成长教练 + 轻任务助手"],
      ["典型场景", "学习陪伴、情绪记录、习惯养成、个人成长、创作陪跑、日常助理"],
      ["记忆重点", "用户阶段、目标、情绪倾向、生活节奏、重要事件、互动习惯"],
      ["不应该强调", "排他关系、恋爱承诺、控制用户社交、替代真实关系"],
      ["成功标准", "用户感觉被理解、被持续跟进，但仍保有自主感和边界"],
    ],
    memory: ["长期用户画像", "事件 / 情节记忆", "情绪 / 状态记忆", "目标与习惯记忆", "可编辑、可删除、可回顾的记忆面板"],
    warnings: ["记忆面板必须可编辑、可删除，不能黑箱。"],
  },
  partner: {
    title: "伴侣型",
    en: "Partner",
    tagline: "强情绪 / 强关系连续性 / 高风险",
    color: "#c45341",
    goal: "获得持续亲密回应、情感确认、关系仪式感、专属感。",
    axes: [
      ["产品定位", "情感关系型、人格化、强陪伴"],
      ["典型场景", "AI 恋人、虚拟伴侣、长期人格角色互动"],
      ["记忆重点", "关系历史、称呼、纪念日、情绪触发点、偏好表达、关系规则"],
      ["必须控制", "依赖风险、心理健康误导、过度承诺、操控式表达、隐私暴露"],
      ["成功标准", "情感连续性强，但边界清晰，用户始终知道它是 AI"],
    ],
    memory: ["高细节关系记忆", "情绪状态与互动偏好", "纪念日与关系事件", "明确的安全边界记忆", "用户可控的记忆开关和删除机制"],
    warnings: ["强关系型产品的责任和实现成本会明显升高。", "必须有清晰的 AI 身份提示、反操控设计和一键清除。"],
  },
};

const PARADIGM_LAYERS = {
  mechanism: {
    label: "机制层",
    en: "Mechanism",
    color: "#2a4f8c",
    note: "具体能力。上层范式会复用它们。",
  },
  control: {
    label: "控制流范式层",
    en: "Control Flow",
    color: "#1d6a3a",
    note: "单个 Agent 如何安排思考、行动、观察和修正。",
  },
  collab: {
    label: "协作范式层",
    en: "Collaboration",
    color: "#6b3f8c",
    note: "多个 Agent 如何拆分职责、交换信息和合成结果。",
  },
  cross: {
    label: "易混 / 横切",
    en: "Cross-cutting",
    color: "#b65b2a",
    note: "框架、选型视角或机制与范式的组合体。",
  },
};

const PARADIGMS = [
  {
    key: "tool-use",
    name: "tool use / function calling",
    layer: "mechanism",
    group: "工具与数据",
    alias: "工具调用 / 函数调用",
    summary: "模型结构化输出“我要调哪个工具 + 参数”。所有需要外部行动的范式都会踩这一层。",
    use: "查实时信息、调用 API、写数据库、控制外部系统。",
    confusion: "tool use 管模型怎么调；MCP 管工具和数据源怎么标准化接进来。",
    example: "ReAct 的 Action: Search['...']，或 OpenAI tools/function call。",
  },
  {
    key: "mcp",
    name: "MCP",
    layer: "mechanism",
    group: "工具与数据",
    alias: "Model Context Protocol",
    summary: "把外部工具、资源和数据源用统一协议暴露给模型或 Agent。",
    use: "需要让不同工具、文件、系统能力以标准方式接入 Agent。",
    confusion: "MCP 不是 Agent 范式；工具暴露太宽时，问题通常是 MCP 接入治理 + tool use 选择治理叠在一起。",
    example: "把 GitHub、数据库、浏览器、内部系统作为 MCP server 暴露。",
  },
  {
    key: "rag",
    name: "RAG",
    layer: "mechanism",
    group: "知识与记忆",
    alias: "Retrieval-Augmented Generation",
    summary: "生成前先检索外部知识，把相关内容塞进上下文。",
    use: "知识库问答、文档助手、需要引用项目资料的 Agent。",
    confusion: "RAG 本质是取数据机制；Agentic RAG 才是让 Agent 自主决定检索什么、检索几次。",
    example: "先从产品文档里检索相关段落，再让模型回答。",
  },
  {
    key: "memory",
    name: "Memory",
    layer: "mechanism",
    group: "知识与记忆",
    alias: "长期记忆 / 短期记忆",
    summary: "让 Agent 跨轮次、跨会话保留事实、偏好、事件、关系和经验。",
    use: "个人助手、长期陪伴、项目上下文、反思经验库。",
    confusion: "Memory 是机制，不是范式。xiaoqing 的四轨记忆、graph vs narrative、decay / promotion 都在这一层。",
    example: "记住用户偏好中文、某项目的发版流程、一次失败后的经验。",
  },
  {
    key: "structured-output",
    name: "Structured output",
    layer: "mechanism",
    group: "输出约束",
    alias: "JSON Schema / 格式化输出",
    summary: "强制模型按固定结构输出，方便程序解析和后续执行。",
    use: "需要稳定抽取字段、生成配置、触发工具调用、返回可校验结果。",
    confusion: "function calling 可以看作结构化输出的一个特例。",
    example: "输出 { intent, confidence, next_action } 供路由器使用。",
  },
  {
    key: "code-execution",
    name: "Code execution / Code as action",
    layer: "mechanism",
    group: "行动机制",
    alias: "代码执行 / CodeAct",
    summary: "模型生成代码并真实运行，把代码当作可组合的行动。",
    use: "数据处理、批量文件操作、工具编排、需要逻辑控制的复杂任务。",
    confusion: "它比 function call 更灵活，但执行边界、权限和审计成本更高。",
    example: "生成一段 Python 脚本读 CSV、计算指标、画图并保存文件。",
  },
  {
    key: "streaming",
    name: "Streaming",
    layer: "mechanism",
    group: "工程机制",
    alias: "流式输出 / SSE",
    summary: "边生成边返回 token 或事件，改善等待体验。",
    use: "聊天 UI、长任务进度、DevAgent 执行日志、用户需要实时反馈的场景。",
    confusion: "这是工程机制，和 ReAct、Plan-and-Execute 这类范式不是一层。",
    example: "SSE 推送模型 token、工具执行状态和最终报告。",
  },
  {
    key: "react",
    name: "ReAct",
    layer: "control",
    group: "推理-行动循环",
    alias: "Reasoning + Acting",
    summary: "Thought -> Action -> Observation 循环：模型先想，再调用工具，再把观察结果回灌到下一轮。",
    use: "探索型任务、研究、排障、实时查询、计算、API 操作，以及需要根据工具反馈动态调整的任务。",
    confusion: "不是单纯 CoT。ReAct 的工程关键是 prompt 模板、输出解析、工具执行、history 回灌和停止条件共同构成闭环。",
    example: "Claude Code 一边读文件、一边修改、一边根据报错继续调整；搜索型 Agent 先 Search，再依据 Observation 换查询词或 Finish。",
  },
  {
    key: "rewoo",
    name: "ReWOO",
    layer: "control",
    group: "推理-行动循环",
    alias: "Reasoning without Observation",
    summary: "推理和执行解耦，先规划所有工具调用，再批量执行。",
    use: "工具调用链比较明确，希望减少 ReAct 每步反复调用模型的 token 成本。",
    confusion: "比 ReAct 省 token，但牺牲动态适应；中途观察结果不能及时改变计划。",
    example: "一次性列出需要查的资料和变量，再统一执行检索。",
  },
  {
    key: "plan-execute",
    name: "Plan-and-Execute / Plan-and-Solve",
    layer: "control",
    group: "规划类",
    alias: "先规划后执行",
    summary: "Planner 先拆完整计划，Executor 再按步骤执行。",
    use: "结构清晰、路径可预先拆解的任务；强模型规划 + 弱模型执行的成本优化。",
    confusion: "静态 plan 遇到执行失败需要额外 replan 机制，否则会僵。",
    example: "Opus 负责拆任务，Sonnet 或小模型逐步执行子任务。",
  },
  {
    key: "llm-compiler",
    name: "LLM Compiler",
    layer: "control",
    group: "规划类",
    alias: "任务编译 / DAG 执行",
    summary: "把任务编译成 DAG，识别可并行步骤同时跑。",
    use: "多工具、多依赖、需要降低串行 plan-execute 延迟的任务。",
    confusion: "它关注执行图和并行化，不只是把计划写得更详细。",
    example: "多个互不依赖的信息查询并行执行，再合成最终答案。",
  },
  {
    key: "tot",
    name: "Tree of Thoughts (ToT)",
    layer: "control",
    group: "规划类",
    alias: "思维树",
    summary: "把推理展开成树，多路径探索、评估、回溯后挑优。",
    use: "需要搜索解空间的难题，如复杂推理、谜题、策略选择。",
    confusion: "比普通 CoT 更重，因为它保留多个候选路径。",
    example: "同时探索几条解题思路，评估后继续扩展高分分支。",
  },
  {
    key: "got",
    name: "Graph of Thoughts",
    layer: "control",
    group: "规划类",
    alias: "思维图",
    summary: "ToT 的推广，思维节点组成图，允许合并和复用中间结果。",
    use: "多个推理分支之间可共享中间结论的复杂问题。",
    confusion: "不是简单“画成图”；关键是中间结果能被复用、聚合和改写。",
    example: "不同分析路径共享同一批证据节点，最后合成判断。",
  },
  {
    key: "reflexion",
    name: "Reflexion",
    layer: "control",
    group: "反思 / 自我改进",
    alias: "跨任务反思记忆",
    summary: "ReAct + 跨任务记忆：失败后把教训写进记忆，下次重试带上教训。",
    use: "同类任务会反复出现，且失败经验值得长期沉淀的 Agent。",
    confusion: "它强调跨任务积累，不只是单次回答里改一版。",
    example: "代码修复失败后记录“先跑测试定位具体报错”，下次类似任务自动使用。",
  },
  {
    key: "self-refine",
    name: "Self-Refine / Reflection",
    layer: "control",
    group: "反思 / 自我改进",
    alias: "生成-批判-修订",
    summary: "单次任务内生成初稿，再自我批判并修订。",
    use: "文案、代码、方案、表达质量需要打磨的任务。",
    confusion: "它通常不一定写长期记忆；ExpressionReview 这类更像单次任务内迭代。",
    example: "先生成设计点评，再检查是否太空泛，最后改成更可执行版本。",
  },
  {
    key: "evaluator-optimizer",
    name: "Evaluator-Optimizer",
    layer: "control",
    group: "反思 / 自我改进",
    alias: "评估器-优化器",
    summary: "一个生成结果，一个评估打分，反馈回去触发优化。",
    use: "需要质量门、自动评分、失败后 replan 的执行系统。",
    confusion: "关键看 evaluate 是否能回灌触发 replan；只打分不反馈就不是完整闭环。",
    example: "DevAgent plan -> execute -> evaluate -> replan/report。",
  },
  {
    key: "orchestrator-worker",
    name: "Orchestrator-Worker",
    layer: "collab",
    group: "中心编排",
    alias: "编排者-执行者",
    summary: "中心 Agent 拆任务、分发给专职 worker，再汇总。",
    use: "复杂任务需要多个专长分工，但仍希望有一个稳定总控。",
    confusion: "你现在的人肉架构师定位就是 orchestrator。",
    example: "主 Agent 派研究、实现、测试三个 worker 并合并结果。",
  },
  {
    key: "hierarchical",
    name: "Hierarchical",
    layer: "collab",
    group: "中心编排",
    alias: "层级式多 Agent",
    summary: "manager-agent 管 sub-agent，必要时递归向下分解。",
    use: "大型任务、组织结构明确、需要多层管理和汇报的场景。",
    confusion: "可以看作 Orchestrator-Worker 的多层版。",
    example: "总负责人下面有前端负责人、后端负责人，各自再分配子任务。",
  },
  {
    key: "role-playing",
    name: "Role-playing",
    layer: "collab",
    group: "角色协作",
    alias: "角色扮演协作",
    summary: "给每个 Agent 固定角色和职责，通过对话推进任务。",
    use: "模拟团队协作、产品/工程/测试互相补位的任务。",
    confusion: "CrewAI、AutoGen、MetaGPT 常实现这一类，但它们本身是框架。",
    example: "产品经理、架构师、工程师、审稿人围绕同一方案迭代。",
  },
  {
    key: "debate",
    name: "Debate",
    layer: "collab",
    group: "角色协作",
    alias: "多 Agent 辩论",
    summary: "多个 Agent 对同一问题给答案并互相质询，用分歧逼出更好结论。",
    use: "高风险判断、策略选择、需要暴露盲点的问题。",
    confusion: "不适合所有任务；成本高，且需要最后的裁决机制。",
    example: "两个方案分别被支持者和反对者攻击，再由 judge 汇总。",
  },
  {
    key: "blackboard",
    name: "Blackboard / 共享状态",
    layer: "collab",
    group: "共享状态",
    alias: "黑板架构",
    summary: "多个 Agent 读写同一块共享状态来协作，而不是只靠对话传递。",
    use: "长期项目、多步骤任务、需要共享事实、计划、文件状态的系统。",
    confusion: "共享状态需要版本、权限和冲突处理，否则会污染上下文。",
    example: "所有 worker 都读写同一个任务状态板和证据表。",
  },
  {
    key: "workflow-agent",
    name: "Workflow vs Agent",
    layer: "cross",
    group: "选型视角",
    alias: "工作流 vs 自主 Agent",
    summary: "Anthropic 常用的选型视角：控制流写死的是 workflow，模型自主决定路径的是 agent。",
    use: "决定一个任务该写固定流程，还是让模型自主规划和行动。",
    confusion: "这是凌驾在控制流范式之上的判断框架，不是具体范式。",
    example: "能用 prompt chaining / routing 稳定解决，就不一定要上 Agent。",
  },
  {
    key: "prompt-chaining",
    name: "Prompt chaining",
    layer: "cross",
    group: "Workflow",
    alias: "提示链",
    summary: "把任务拆成固定几步，上一步输出喂给下一步。",
    use: "流程稳定、每步职责清楚、需要可控产出的任务。",
    confusion: "属于 workflow，控制流写死，不是 Agent 自主决策。",
    example: "抽取需求 -> 生成摘要 -> 改写成发布说明。",
  },
  {
    key: "routing",
    name: "Routing",
    layer: "cross",
    group: "Workflow",
    alias: "路由 / 意图分发",
    summary: "先分类，再把请求分发到不同处理路径。",
    use: "多意图入口、客服、工具选择前置、低成本预筛。",
    confusion: "Quick Intent Router 属于 routing；它可以用规则预筛 + 轻量 LLM。",
    example: "判断用户是问天气、写代码还是查文档，再走不同链路。",
  },
  {
    key: "frameworks",
    name: "LangGraph / AutoGen / CrewAI / LlamaIndex",
    layer: "cross",
    group: "框架 / 工具",
    alias: "Agent 框架",
    summary: "这些是实现范式的脚手架，不是范式本身。",
    use: "需要状态图、多 Agent 对话、RAG 管线、工具集成等工程能力。",
    confusion: "不要拿 LangGraph 和 ReAct 平级比较；前者可以实现后者。",
    example: "用 LangGraph 实现 ReAct + Memory + Evaluator-Optimizer。",
  },
  {
    key: "agentic-rag",
    name: "Agentic RAG",
    layer: "cross",
    group: "组合体",
    alias: "Agent 驱动检索",
    summary: "RAG 机制 + Agent 自主决策，让模型决定检索什么、检索几次、是否改写查询。",
    use: "开放式研究、复杂知识问答、需要多轮检索和证据整合的任务。",
    confusion: "不是单独一层，而是机制和控制流范式的组合。",
    example: "Agent 先检索政策，再发现缺年份，改写 query 二次检索。",
  },
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function matchesBand(item, filter) {
  if (filter === "all") return true;
  if (filter === "sensitive") return item.sensitive;
  return item.band === filter;
}

function bandLabel(item) {
  if (item.band === "short") return "短期";
  if (item.band === "meta") return "元 / 边界";
  return "长期";
}

function renderMemory(filter = "all") {
  const grid = $("#memory-grid");
  if (!grid) return;

  grid.innerHTML = MEMORY_TYPES.filter((item) => matchesBand(item, filter))
    .map((item) => {
      const sensitiveTag = item.sensitive ? '<span class="am-tag danger">敏感</span>' : "";
      return `
        <article class="am-memory-card" style="--card-color: ${item.color}">
          <h3>${escapeHtml(item.title)} <small>${escapeHtml(item.en)}</small></h3>
          <div class="what">// ${escapeHtml(item.what)}</div>
          <p><b>EX</b><span>${escapeHtml(item.example)}</span></p>
          <p><b>VALUE</b><span>${escapeHtml(item.value)}</span></p>
          <p><b>RISK</b><span>${escapeHtml(item.risk)}</span></p>
          <div class="foot"><span class="am-tag">${bandLabel(item)}</span>${sensitiveTag}</div>
        </article>
      `;
    })
    .join("");
}

function renderScenario(key = "assist") {
  const scenario = SCENARIOS[key];
  const panel = $("#scenario-panel");
  if (!scenario || !panel) return;

  panel.style.setProperty("--scenario-color", scenario.color);
  panel.innerHTML = `
    <article class="am-scenario-main">
      <h3>${escapeHtml(scenario.title)} <em>${escapeHtml(scenario.en)}</em></h3>
      <div class="tagline">// ${escapeHtml(scenario.tagline)}</div>
      <p class="goal"><b>用户想实现什么：</b>${escapeHtml(scenario.goal)}</p>
      ${scenario.axes
        .map(([label, value]) => `
          <div class="am-axis">
            <b>${escapeHtml(label)}</b>
            <span>${escapeHtml(value)}</span>
          </div>
        `)
        .join("")}
    </article>
    <aside class="am-scenario-side">
      <h4>// 适合的记忆方案</h4>
      <ol>
        ${scenario.memory.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ol>
      ${
        scenario.warnings.length
          ? `<div class="am-warning">${scenario.warnings.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>`
          : ""
      }
    </aside>
  `;
}

function layerTag(item) {
  const layer = PARADIGM_LAYERS[item.layer];
  return `<span class="am-layer-tag" style="--layer-color: ${layer.color}">${escapeHtml(layer.label)}</span>`;
}

function renderParadigmList(filter = "all", activeKey = "react") {
  const list = $("#paradigm-list");
  if (!list) return;

  const items = PARADIGMS.filter((item) => filter === "all" || item.layer === filter);
  const visibleActive = items.some((item) => item.key === activeKey) ? activeKey : items[0]?.key;

  list.innerHTML = items
    .map((item) => {
      const layer = PARADIGM_LAYERS[item.layer];
      return `
        <button class="am-paradigm-row ${item.key === visibleActive ? "is-active" : ""}" type="button" data-key="${escapeHtml(item.key)}" style="--layer-color: ${layer.color}">
          <span class="am-row-main">
            <b>${escapeHtml(item.name)}</b>
            <small>${escapeHtml(item.group)}</small>
          </span>
          ${layerTag(item)}
        </button>
      `;
    })
    .join("");

  if (visibleActive) renderParadigmDetail(visibleActive);
}

function renderParadigmDetail(key = "react") {
  const detail = $("#paradigm-detail");
  const item = PARADIGMS.find((entry) => entry.key === key);
  if (!detail || !item) return;

  const layer = PARADIGM_LAYERS[item.layer];
  detail.style.setProperty("--detail-color", layer.color);
  detail.innerHTML = `
    <div class="am-detail-kicker">${escapeHtml(layer.en)} · ${escapeHtml(item.group)}</div>
    <h3>${escapeHtml(item.name)}</h3>
    <div class="am-detail-alias">${escapeHtml(item.alias)}</div>
    <p class="am-detail-summary">${escapeHtml(item.summary)}</p>
    <div class="am-detail-grid">
      <article>
        <b>适合什么时候用</b>
        <span>${escapeHtml(item.use)}</span>
      </article>
      <article>
        <b>容易混哪里</b>
        <span>${escapeHtml(item.confusion)}</span>
      </article>
      <article>
        <b>例子</b>
        <span>${escapeHtml(item.example)}</span>
      </article>
      <article>
        <b>层级判断</b>
        <span>${escapeHtml(layer.note)}</span>
      </article>
    </div>
  `;
}

function initParadigmIndex() {
  const filter = $("#paradigm-filter");
  const list = $("#paradigm-list");
  if (!filter || !list) return;

  let activeLayer = "all";
  let activeKey = "react";

  filter.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-layer]");
    if (!button) return;

    activeLayer = button.dataset.layer;
    $$("button[data-layer]", filter).forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    renderParadigmList(activeLayer, activeKey);
    const activeRow = $(".am-paradigm-row.is-active", list);
    activeKey = activeRow?.dataset.key || activeKey;
  });

  list.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-key]");
    if (!button) return;

    activeKey = button.dataset.key;
    $$(".am-paradigm-row", list).forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    renderParadigmDetail(activeKey);
  });

  renderParadigmList(activeLayer, activeKey);
}

function initMemoryFilter() {
  const filter = $("#memory-filter");
  if (!filter) return;

  filter.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;

    $$("button[data-filter]", filter).forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    renderMemory(button.dataset.filter);
  });
  renderMemory();
}

function initScenarioTabs() {
  const tabs = $("#scenario-tabs");
  if (!tabs) return;

  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-scenario]");
    if (!button) return;

    $$("button[data-scenario]", tabs).forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    renderScenario(button.dataset.scenario);
  });
  renderScenario();
}

function initImplementationTabs() {
  const tabs = $("#implementation-tabs");
  if (!tabs) return;

  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-panel]");
    if (!button) return;

    $$("button[data-panel]", tabs).forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    $$(".am-impl-panel").forEach((panel) => {
      panel.classList.toggle("is-active", panel.id === `impl-${button.dataset.panel}`);
    });
  });
}

function initScrollSpy() {
  const links = $$(".am-toc a[href^='#']");
  if (!links.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-32% 0px -58% 0px" },
  );

  links.forEach((link) => {
    const section = document.getElementById(link.getAttribute("href").slice(1));
    if (section) observer.observe(section);
  });
}

function initPrint() {
  $("#am-print")?.addEventListener("click", () => window.print());
}

document.addEventListener("DOMContentLoaded", () => {
  initParadigmIndex();
  initMemoryFilter();
  initScenarioTabs();
  initImplementationTabs();
  initScrollSpy();
  initPrint();
});
