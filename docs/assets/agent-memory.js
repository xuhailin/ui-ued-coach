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
    example: "xiaoqing 使用陪伴型定位，不做强伴侣化",
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
    example: "用户把 xiaoqing 当作日常陪伴助手",
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
    warnings: ["不建议作为 xiaoqing 主定位，责任和实现成本会明显升高。", "必须有清晰的 AI 身份提示、反操控设计和一键清除。"],
  },
};

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
  initMemoryFilter();
  initScenarioTabs();
  initImplementationTabs();
  initScrollSpy();
  initPrint();
});
