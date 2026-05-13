const CATEGORIES = {
  web: { name: "网页", roman: "I" },
  app: { name: "移动应用", roman: "II" },
  folio: { name: "作品集", roman: "III" },
  resource: { name: "资源", roman: "IV" },
  motion: { name: "动效", roman: "V" },
  type: { name: "字体", roman: "VI" },
};

const SITES = [
  {
    id: "001",
    name: "Awwwards",
    url: "awwwards.com",
    href: "https://www.awwwards.com/",
    desc: "行业年度佳作的标尺目录。每周看一次，可以重新校准对网页表达、动效密度和完成度的判断。",
    tags: ["奖项", "网页", "案例"],
    group: "web",
    colorA: "#2d2d2d",
    colorB: "#0a0a0a",
    glyph: "Aw",
    rating: 5,
    focus: "每日更新",
  },
  {
    id: "002",
    name: "Siteinspire",
    url: "siteinspire.com",
    href: "https://www.siteinspire.com/",
    desc: "按类型、风格和主题筛选网站，适合带着明确版式问题去找参考。",
    tags: ["展示", "布局", "筛选"],
    group: "web",
    colorA: "#404040",
    colorB: "#1c1c1c",
    glyph: "Si",
    rating: 4,
    focus: "筛选强",
  },
  {
    id: "003",
    name: "CSS Design Awards",
    url: "cssdesignawards.com",
    href: "https://www.cssdesignawards.com/",
    desc: "更偏前端创新、动效与互动模块，适合挑一个局部回来做复刻练习。",
    tags: ["奖项", "动效", "前端"],
    group: "web",
    colorA: "#1e8c4d",
    colorB: "#0f5530",
    glyph: "◌",
    rating: 4,
    focus: "动效偏强",
  },
  {
    id: "004",
    name: "Mobbin",
    url: "mobbin.com",
    href: "https://mobbin.com/",
    desc: "移动端截图库。组件、状态、空态和完整流程都齐，是改稿时真正能打开用的工具。",
    tags: ["移动端", "流程", "模式"],
    group: "app",
    colorA: "#ff6b6b",
    colorB: "#c44569",
    glyph: "Mb",
    rating: 4,
    focus: "覆盖深",
  },
  {
    id: "005",
    name: "Land-book",
    url: "land-book.com",
    href: "https://land-book.com/",
    desc: "落地页与产品页灵感集合，适合看首屏叙事、转化区块和商业页面的视觉秩序。",
    tags: ["落地页", "产品", "转化"],
    group: "web",
    colorA: "#f0b429",
    colorB: "#7a3f20",
    glyph: "Lb",
    rating: 4,
    focus: "商业页",
  },
  {
    id: "006",
    name: "Landingfolio",
    url: "landingfolio.com",
    href: "https://www.landingfolio.com/",
    desc: "落地页灵感、模板和组件库集合。适合看 SaaS、产品、营销页如何组织首屏、证明、CTA 和转化路径。",
    tags: ["落地页", "组件", "SaaS"],
    group: "web",
    colorA: "#101828",
    colorB: "#7c3aed",
    glyph: "Lf",
    rating: 4,
    focus: "转化页",
  },
  {
    id: "007",
    name: "Godly",
    url: "godly.website",
    href: "https://godly.website/",
    desc: "近期感更强的网站图录，适合快速捕捉新鲜的字体、滚动、动效和视觉噪点处理。",
    tags: ["趋势", "网页", "精选"],
    group: "web",
    colorA: "#f04d3a",
    colorB: "#111111",
    glyph: "Gd",
    rating: 4,
    focus: "近期感",
  },
  {
    id: "008",
    name: "Behance",
    url: "behance.net",
    href: "https://www.behance.net/",
    desc: "适合深看 UI、品牌、插画和视觉系统项目，从概念到落地过程都比较完整。",
    tags: ["作品集", "品牌", "过程"],
    group: "folio",
    colorA: "#1769ff",
    colorB: "#0b1f54",
    glyph: "Be",
    rating: 4,
    focus: "项目完整",
  },
  {
    id: "009",
    name: "Dribbble",
    url: "dribbble.com",
    href: "https://dribbble.com/",
    desc: "界面片段、微交互和视觉趋势的快速雷达。适合捕捉小组件的表现手法。",
    tags: ["片段", "界面", "趋势"],
    group: "folio",
    colorA: "#ea4c89",
    colorB: "#6d2241",
    glyph: "Dr",
    rating: 3,
    focus: "快看",
  },
  {
    id: "010",
    name: "Bruno Simon",
    url: "bruno-simon.com",
    href: "https://bruno-simon.com/",
    desc: "可驾驶作品集的经典案例。如果只看一个沉浸式作品集，可以先看这个。",
    tags: ["三维", "WebGL", "作品集"],
    group: "folio",
    colorA: "#b46bff",
    colorB: "#00f0ff",
    glyph: "Br",
    rating: 5,
    focus: "标志性",
  },
  {
    id: "011",
    name: "Rauno Freiberg",
    url: "rauno.me",
    href: "https://rauno.me/",
    desc: "把细节动效、界面手感和设计工程写成了可学习的独立课题。",
    tags: ["动效", "细节", "写作"],
    group: "motion",
    colorA: "#ffd23f",
    colorB: "#ff8c42",
    glyph: "Ra",
    rating: 4,
    focus: "细节锐",
  },
  {
    id: "012",
    name: "LottieFiles",
    url: "lottiefiles.com",
    href: "https://lottiefiles.com/",
    desc: "动效素材、预览和轻量交付链路。适合理解产品动效如何从素材变成界面状态。",
    tags: ["动效", "素材", "交付"],
    group: "motion",
    colorA: "#00d1a0",
    colorB: "#0b4a6f",
    glyph: "Lf",
    rating: 3,
    focus: "素材链路",
  },
  {
    id: "013",
    name: "Uplabs",
    url: "uplabs.com",
    href: "https://www.uplabs.com/",
    desc: "组件、UI Kit 和模板资源集合。既能找结构，也能补充素材意识。",
    tags: ["资源", "组件", "模板"],
    group: "resource",
    colorA: "#fd6157",
    colorB: "#7d2522",
    glyph: "Up",
    rating: 3,
    focus: "组件多",
  },
  {
    id: "014",
    name: "Figma Community",
    url: "figma.com/community",
    href: "https://www.figma.com/community",
    desc: "组件、模板、插件和设计系统样例密集，适合拆解别人如何组织可复用资产。",
    tags: ["资源", "Figma", "组件"],
    group: "resource",
    colorA: "#a259ff",
    colorB: "#0acf83",
    glyph: "Fg",
    rating: 4,
    focus: "可复用",
  },
  {
    id: "015",
    name: "Pangram Pangram",
    url: "pangrampangram.com",
    href: "https://pangrampangram.com/",
    desc: "独立字体厂，字体展示页面本身也很值得看。挑字、看字重、看排版气质都顺手。",
    tags: ["字体", "字厂", "购买"],
    group: "type",
    colorA: "#e63946",
    colorB: "#1d3557",
    glyph: "Pp",
    rating: 4,
    focus: "字形稳",
  },
];

const INSP_STYLE_KEY = "uiUedCoach.inspirationStyle";
const INSP_STYLE_MODELS = ["catalog", "moodboard", "magazine", "atlas"];
const INSP_DEFAULT_STYLE = "catalog";
const INSP_STYLE_NAV = [
  { id: "catalog", label: "图录", href: "./index.html" },
  { id: "moodboard", label: "灵感墙", href: "./inspo-moodboard.html" },
  { id: "magazine", label: "专题", href: "./inspo-magazine.html" },
  { id: "atlas", label: "图谱", href: "./inspo-atlas.html" },
];

let currentGroup = "all";
let currentSeed = 1;
let currentSites = SITES.slice();
let currentStyle = normalizeInspStyle(
  new URLSearchParams(window.location.search).get("style") ||
  document.body.dataset.initialInspStyle ||
  window.localStorage.getItem(INSP_STYLE_KEY)
);
let currentSearch = "";
let currentView = "list";

function shuffleSeeded(items, seed) {
  const shuffled = items.slice();
  let nextSeed = seed || 1;

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    nextSeed = (nextSeed * 9301 + 49297) % 233280;
    const j = Math.floor((nextSeed / 233280) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function normalizeInspStyle(style) {
  return INSP_STYLE_MODELS.includes(style) ? style : INSP_DEFAULT_STYLE;
}

function setInspStyle(style) {
  currentStyle = normalizeInspStyle(style);
  window.localStorage.setItem(INSP_STYLE_KEY, currentStyle);
  syncStyleUrl(currentStyle);
  renderInspiration();
}

function syncStyleUrl(style) {
  const selected = INSP_STYLE_NAV.find((item) => item.id === style);
  if (selected) {
    window.history.replaceState({}, "", selected.href);
  }
}

function categoryEntries() {
  const counts = currentSites.reduce((acc, site) => {
    acc[site.group] = (acc[site.group] || 0) + 1;
    return acc;
  }, {});

  return [
    ["all", { name: "全部", roman: "ALL", count: currentSites.length }],
    ...Object.entries(CATEGORIES)
      .filter(([key]) => counts[key])
      .map(([key, value]) => [key, { ...value, count: counts[key] }]),
  ];
}

function filteredSites() {
  const q = currentSearch.trim().toLowerCase();
  return currentSites.filter((site) => {
    const inGroup = currentGroup === "all" || site.group === currentGroup;
    const inSearch = !q || [site.name, site.url, site.desc, site.focus, ...(site.tags || [])]
      .join(" ")
      .toLowerCase()
      .includes(q);
    return inGroup && inSearch;
  });
}

function groupSites(sites) {
  return sites.reduce((acc, site) => {
    (acc[site.group] = acc[site.group] || []).push(site);
    return acc;
  }, {});
}

function starMarkup(rating) {
  const filled = "★".repeat(rating);
  const empty = "☆".repeat(5 - rating);
  return `<span>${filled}</span>${empty}`;
}

function siteCardMarkup(site) {
  const category = CATEGORIES[site.group];
  const tags = site.tags.slice(0, 3).map((tag) => `<span class="insp-lot-tag">${tag}</span>`).join("");
  const secondaryTags = site.tags.slice(1, 3).map((tag) => `<span class="insp-lot-tag">${tag}</span>`).join("");

  return `
    <a class="insp-lot" href="${site.href}" target="_blank" rel="noopener noreferrer" data-lot="${site.id}" style="--pv: linear-gradient(135deg, ${site.colorA}, ${site.colorB});">
      <span class="insp-lot-num">编号 ${site.id}</span>
      <span class="insp-lot-preview" data-glyph="${site.glyph || "·"}"></span>
      <span class="insp-lot-body">
        <strong>${site.name}.</strong>
        <small>${site.url} ↗</small>
        <span>${site.desc}</span>
      </span>
      <span class="insp-lot-meta">
        <b>${site.tags[0] || category.name}</b>${secondaryTags}
        <em>${site.focus}</em>
        <i>估值 ${starMarkup(site.rating)}</i>
      </span>
    </a>
  `;
}

function renderGroupNav() {
  const nav = document.getElementById("insp-groups");
  nav.innerHTML = categoryEntries().map(([key, group]) => `
    <button class="insp-group-tab ${key === currentGroup ? "is-active" : ""}" type="button" data-group="${key}">
      ${group.name}<span>${String(group.count).padStart(2, "0")}</span>
    </button>
  `).join("");

  nav.querySelectorAll("[data-group]").forEach((button) => {
    button.addEventListener("click", () => {
      currentGroup = button.dataset.group;
      renderInspiration();
    });
  });
}

function renderGroups() {
  const root = document.getElementById("insp-sections");
  const sites = filteredSites();
  const groups = groupSites(sites);
  const order = currentGroup === "all"
    ? Object.keys(CATEGORIES).filter((key) => groups[key])
    : [currentGroup].filter((key) => groups[key]);

  document.getElementById("insp-total").textContent = String(currentSites.length).padStart(2, "0");
  document.getElementById("insp-category-total").textContent = String(Object.keys(groups).length).padStart(2, "0");

  if (!sites.length) {
    root.innerHTML = `<div class="insp-empty">没有找到匹配条目<small>换一个关键词或分类试试</small></div>`;
    return;
  }

  let page = 1;
  root.innerHTML = order.map((groupKey) => {
    const category = CATEGORIES[groupKey];
    const items = groups[groupKey];
    const first = items[0].id;
    const last = items[items.length - 1].id;
    const section = `
      <section class="insp-group-section" id="insp-sec-${groupKey}">
        <div class="insp-section-head">
          <span>§ ${category.roman}</span>
          <h2>${category.roman}. ${category.name}.</h2>
        <small>条目 ${first}${items.length > 1 ? ` - ${last}` : ""}</small>
        </div>
        <div class="insp-running-line"><span>章节 ${category.roman} · ${category.name}</span><span>第 ${String(page).padStart(3, "0")} 页</span></div>
        <div class="insp-lots ${currentView === "grid" ? "is-grid" : ""}">
          ${items.map(siteCardMarkup).join("")}
        </div>
      </section>
    `;
    page += Math.max(1, Math.ceil(items.length / 3));
    return section;
  }).join("");
}

function renderStyleJudgment() {
  window.StyleRegistry?.renderStyleJudgmentStrip("#insp-style-judgment", {
    page: "home",
    contentId: "gallery",
    allowedStyleIds: INSP_STYLE_MODELS,
    activeStyle: currentStyle,
    onSelect: setInspStyle,
  });
}

function renderStylePages() {
  const root = document.getElementById("insp-style-pages");
  if (!root) return;

  root.innerHTML = INSP_STYLE_NAV.map((style) => {
    return `
      <a class="insp-style-page ${style.id === currentStyle ? "is-active" : ""}" href="${style.href}#insp-sections" data-style-page="${style.id}">
        ${style.label}
      </a>
    `;
  }).join("");

  root.querySelectorAll("[data-style-page]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setInspStyle(link.dataset.stylePage);
    });
  });
}

function renderViewButtons() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === currentView);
  });
}

function renderInspiration() {
  document.body.dataset.inspStyle = currentStyle;
  renderStylePages();
  renderStyleJudgment();
  renderGroupNav();
  renderViewButtons();
  renderGroups();
}

document.getElementById("insp-shuffle").addEventListener("click", () => {
  currentSeed = Math.floor(Math.random() * 999999);
  currentSites = shuffleSeeded(SITES, currentSeed);
  renderInspiration();
});

document.getElementById("insp-search").addEventListener("input", (event) => {
  currentSearch = event.target.value;
  renderGroups();
});

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    currentView = button.dataset.view;
    renderViewButtons();
    renderGroups();
  });
});

renderInspiration();
