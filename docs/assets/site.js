const INDEX_URL = "./data/site-index.json";
const STATUS_LABELS = {
  completed: "已完成",
  in_progress: "进行中",
  needs_revision: "待修改",
  locked: "未开始",
  unknown: "未标记",
};
const VIEWER_STYLES = ["motion", "risograph", "terminal", "editorial"];
const DEFAULT_VIEWER_STYLE = "risograph";
const VIEWER_STYLE_STORAGE_KEY = "uiUedCoach.viewerStyle";
const VIEWER_STYLE_TO_MODEL = {
  motion: "console",
  risograph: "risograph",
  terminal: "terminal",
  editorial: "editorial",
};
const VIEWER_STYLE_PROMPTS = {
  motion: `我要一个 motion lab / experimental console 风格的阅读页面，内容使用当前阅读文档本身，不要替换成风格说明。

色板: 近黑底 #06060c，叠加三层柔光 radial（品红 #ff2bd6 8%、青 #00f0ff 7%、紫 #b46bff 6%）和 48px grid，边缘用 radial mask 渐隐。文字 #e8e8f0，二级 #8a8aa3，三级 #4d4d66。每个动效类别只使用自己的霓虹色，不混用。

字体: Space Grotesk 做中英标题，JetBrains Mono 写所有元数据 / 状态 / ID / 时间戳 / 进度数字 / section label，中文正文用 Noto Sans SC。绝不用 serif。

形态: 整页像 IDE / 监控面板。左侧 64px 极窄 sidebar，只放图标按钮、1px divider、hover tooltip；logo 是双层旋转环。section label 使用 // VIEW · IMPLEMENTED 这种斜杠注释大写 mono。卡片预览区必须放真实在跑的迷你动效（canvas 粒子、CSS glitch、SVG morph），不用 emoji 占位。状态标签为 ● DONE / ○ PENDING。数字 0-pad，例如 03 / 16，斜杠灰色 em。卡片 hover 上移 -4px，并使用当前类别色长投影 box-shadow: 0 24px 50px -20px <c>。顶部 brand 区保留 v0.1 — DRAFT 和 BUILD 2026.05.12。

文案语气: 工程师写给自己看的注释。// FEATURE COMING SOON、// 13 个待 Codex 实现、// PROMPT — 设计思路。中英混排，英文小写注释，中文短句陈述。不写营销话术，只标记。

不要: emoji、玻璃拟物、彩色 orb 单独悬浮、Hero 大标题套路、Surprise me 按钮、渐变文字、圆角大于 14px、阴影超过 0.6 黑度、serif、卡通插画。`,
  risograph: `我要一个 risograph 印刷风格的阅读页面，内容使用当前阅读文档本身，不要替换成风格说明。

色板: 米黄底 #f4f0e8 / 深紫主色 #2a1d4a / 番茄橘强调 #ff5b3e / 蛋黄黄 #ffd23f / 浅蓝点缀 #7ec5ff。所有彩色形状用 mix-blend-mode: multiply 叠印，故意错位 6-8px 模拟套印偏移。整页 10% 噪点 multiply。

字体: Space Grotesk Bold，中文 Noto Sans SC Bold。大标题 -0.04em 字距 + 0.92 行高。重点词用黄色块 padding 0 14px + rotate(-1deg) + box-shadow: 6px 6px 0 #2a1d4a。

形态: 阅读页顶部是风格 tab，主内容保持当前文档。阅读容器用 2px 深紫描边 + 5px 偏移实心阴影；状态/路径是矩形反相 badge。正文段落清晰，引用和代码块像独立志贴纸。hover 向左上 translate(-3px,-3px)，阴影变 8px 偏移橘色。

文案语气: 像独立杂志卷首，中文为主，英文只做小标签。

不要: 模糊阴影、glassmorphism、渐变、emoji、细线 1px outline、对称排版、AI hero 大字 + 副标题 + CTA 套路、Surprise me 按钮。`,
  terminal: `我要一个 brutal terminal 风格的阅读页面，内容使用当前阅读文档本身，不要替换成风格说明。

色板: 墨绿底 #0d0e0a / 米麻文字 #c8d4b8 / 荧光绿强调 #b3ff7a。整页叠加 2px 间距水平扫描线 0.025 alpha。所有文字纯色，绝不渐变。

字体: 全部 JetBrains Mono，中文用 Noto Sans SC 但维持 mono 节奏。标题前缀 ##，链接前缀 >，命令行前缀 $ + 7x13px 绿色闪烁光标。

形态: 顶部 titlebar 反相，带方形 dots 和文件路径。左侧 220px 文件树侧栏，主区是命令行 + 表格式阅读内容，不做卡片墙。状态用 [ DONE ] [ TODO ]。所有边框 1px，分隔用 1px dashed，没有圆角、阴影、渐变。

文案语气: 像 git commit message + 文档注释，用 // VIEWS、// COMPLETED 这类 section label。

不要: emoji、圆角、玻璃、渐变、彩色 orb、动画浮动、Hero 大字、装饰性 SVG。除了光标闪烁不要任何 motion。`,
  editorial: `我要一个 editorial 杂志风格的阅读页面，内容使用当前阅读文档本身，不要替换成风格说明。

色板: 奶白底 #f3ece1 / 墨黑文字 #1a1612 / 砖橙强调 #b65b2a。叠加 5% 噪点 multiply。不用渐变，不用玻璃，不用阴影。

字体: 大标题 Instrument Serif italic，正文 Noto Serif SC + Noto Sans SC，所有元信息 / 数字 / 状态 / 标签全部用 JetBrains Mono 加 0.15-0.2em 字距大写。

形态: 整页像一份独立杂志。顶部 masthead 有粗黑横线，正文用 3 栏 column-count 排，首字下沉 drop cap 用 italic + 橙色。列表做成表单式 DAY 行，左大号 italic 数字，右边小号 mono 状态标签，只有 1px dashed 分隔线。穿插全宽 q 引语区，上下双黑线包夹。

文案语气: 克制，像编辑卷首语。多用句号，少用感叹号。中英混排时英文写完整短句。

不要: emoji、彩色 orb、玻璃拟物、渐变文字、Surprise me 按钮、Hero 大号副标题、阴影、圆角大于 4px。`,
};

const MOTION_READER_MODULES = [
  { id: "01", label: "particles", title: "粒子涡流", en: "particle_vortex", color: "#00f0ff", status: "done", fx: "particles" },
  { id: "02", label: "fluid", title: "液态变形", en: "liquid_blob", color: "#4d7cff", status: "done", fx: "morph" },
  { id: "03", label: "glitch", title: "故障标题", en: "glitch_title", color: "#ff3860", status: "done", fx: "glitch" },
  { id: "04", label: "loader", title: "液态加载", en: "liquid_loader", color: "#ff8c42", status: "pending", fx: "loader" },
];

const motionReaderFx = new WeakMap();

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "home") {
    initHome().catch(renderFatal);
  }
  if (page === "viewer") {
    initViewer().catch(renderFatal);
  }
});

async function fetchIndex() {
  const response = await fetch(INDEX_URL);
  if (!response.ok) {
    throw new Error("无法加载站点索引，请先运行生成脚本。");
  }
  return response.json();
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttribute(text) {
  return escapeHtml(text)
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderInline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function makeChip(status) {
  const span = document.createElement("span");
  span.className = `chip chip-${status}`;
  span.textContent = STATUS_LABELS[status] || status;
  return span;
}

function viewerHref(file) {
  return `./viewer.html?file=${encodeURIComponent(file)}`;
}

function viewerHrefWithCurrentStyle(file, extraParams = {}) {
  const href = viewerHref(file);
  const params = new URLSearchParams();
  const style = getCurrentViewerStyle();
  if (!VIEWER_STYLES.includes(style)) {
    return appendViewerParams(href, extraParams);
  }
  params.set("style", style);
  Object.entries(extraParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  return `${href}&${params.toString()}`;
}

function appendViewerParams(href, extraParams) {
  const params = new URLSearchParams();
  Object.entries(extraParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  const query = params.toString();
  return query ? `${href}&${query}` : href;
}

function getCurrentViewerStyle() {
  const params = new URLSearchParams(window.location.search);
  const requestedStyle = params.get("style");
  if (VIEWER_STYLES.includes(requestedStyle)) {
    return requestedStyle;
  }
  return document.body.dataset.viewerStyle;
}

function docHref(file) {
  return `./${encodeURIComponent(file).replaceAll("%2F", "/")}`;
}

function buildDocSequence(data) {
  return [data.outlineFile, ...data.journal.map((item) => item.file)];
}

async function loadDocument(file) {
  const safeFile = normalizeFile(file);
  const response = await fetch(`./${safeFile}`);
  if (!response.ok) {
    throw new Error(`找不到文档：${safeFile}`);
  }

  const markdown = await response.text();
  return {
    safeFile,
    markdown,
    title: extractTitle(markdown, safeFile),
  };
}

function getDocumentContext(data, safeFile) {
  if (safeFile === data.outlineFile) {
    return {
      summary: "14 天训练路线、完成顺序和推进节奏会集中显示在这里。",
      status: null,
      dayLabel: "Roadmap",
    };
  }

  const day = data.days.find((item) => item.journalFile === safeFile);
  const journal = data.journal.find((item) => item.file === safeFile);

  return {
    summary:
      day?.summary ||
      journal?.summary ||
      "当前文档已经载入，可以继续阅读练习要求、用户提交和教练反馈。",
    status: day?.status || journal?.status || "unknown",
    dayLabel: day?.day ? `Day ${String(day.day).padStart(2, "0")}` : "Journal",
  };
}

async function initHome() {
  const data = await fetchIndex();
  document.title = `${data.siteTitle} · 训练导航`;

  const daysGrid = document.querySelector("#days-grid");
  const journalList = document.querySelector("#journal-list");

  data.days.forEach((day) => {
    const card = document.createElement(day.journalFile ? "a" : "article");
    card.className = "day-card";
    if (day.journalFile) {
      card.href = viewerHref(day.journalFile);
    }

    const top = document.createElement("div");
    top.className = "card-top";

    const dayLabel = document.createElement("span");
    dayLabel.className = "card-day";
    dayLabel.textContent = `Day ${String(day.day).padStart(2, "0")}`;
    top.append(dayLabel, makeChip(day.status));

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = day.title;

    const summary = document.createElement("p");
    summary.className = "card-summary";
    summary.textContent = day.summary || "当天文档还没创建，先完成前一天再继续。";

    card.append(top, title, summary);
    daysGrid.append(card);
  });

  if (data.journal.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "还没有任何每日记录。";
    journalList.append(empty);
    return;
  }

  data.journal.forEach((entry) => {
    const card = document.createElement("a");
    card.className = "journal-card";
    card.href = viewerHref(entry.file);

    const top = document.createElement("div");
    top.className = "card-top";

    const title = document.createElement("div");
    title.className = "card-day";
    title.textContent = entry.day ? `Day ${String(entry.day).padStart(2, "0")}` : "Journal";
    top.append(title, makeChip(entry.status));

    const heading = document.createElement("h3");
    heading.className = "card-title";
    heading.textContent = entry.title;

    const summary = document.createElement("p");
    summary.className = "card-summary";
    summary.textContent = entry.summary || entry.file;

    card.append(top, heading, summary);
    journalList.append(card);
  });
}

async function initViewer() {
  const params = new URLSearchParams(window.location.search);
  initViewerStyleTabs(params);

  const data = await fetchIndex();
  const file = params.get("file") || data.outlineFile;
  const { safeFile, markdown, title } = await loadDocument(file);
  document.title = `${title} · UI/UED Coach`;

  renderViewerBackLink(data, safeFile, params);
  document.querySelector("#viewer-title").textContent = title;
  document.querySelector("#viewer-meta").textContent = safeFile;
  document.querySelector("#viewer-content").innerHTML = renderMarkdown(markdown, {
    days: data.days,
    currentFile: safeFile,
  });
  renderMotionReaderCards();

  renderViewerActions(document.querySelector("#viewer-nav"), safeFile);
}

function initViewerStyleTabs(params) {
  const tabs = [...document.querySelectorAll("[data-style]")];
  if (!tabs.length) {
    return;
  }

  const requestedStyle = params.get("style");
  const storedStyle = window.localStorage.getItem(VIEWER_STYLE_STORAGE_KEY);
  const initialStyle = VIEWER_STYLES.includes(requestedStyle)
    ? requestedStyle
    : VIEWER_STYLES.includes(storedStyle)
      ? storedStyle
      : DEFAULT_VIEWER_STYLE;

  const setStyle = (style, shouldPersist = true) => {
    document.body.dataset.viewerStyle = style;
    tabs.forEach((tab) => {
      const isActive = tab.dataset.style === style;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    if (shouldPersist) {
      window.localStorage.setItem(VIEWER_STYLE_STORAGE_KEY, style);
    }

    syncMotionReaderFx(style);
    renderViewerStyleJudgment(style);
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setStyle(tab.dataset.style);
    });
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      setStyle(tab.dataset.style);
    });
  });

  document.querySelectorAll("[data-copy-style]").forEach((copyControl) => {
    copyControl.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const style = copyControl.dataset.copyStyle;
      await copyViewerPrompt(style, copyControl);
    });
  });

  setStyle(initialStyle, false);
}

function renderViewerStyleJudgment(viewerStyle = getCurrentViewerStyle()) {
  const registry = window.StyleRegistry;
  if (!registry) {
    return;
  }

  const modelId = VIEWER_STYLE_TO_MODEL[viewerStyle] || "editorial";
  const allowedStyleIds = VIEWER_STYLES.map((style) => VIEWER_STYLE_TO_MODEL[style]);
  registry.renderStyleJudgmentStrip("#viewer-style-judgment", {
    page: "viewer",
    contentId: "article",
    allowedStyleIds,
    activeStyle: modelId,
    onSelect(styleId) {
      const viewerStyleId = Object.entries(VIEWER_STYLE_TO_MODEL).find(([, id]) => id === styleId)?.[0];
      const tab = viewerStyleId ? document.querySelector(`[data-style="${viewerStyleId}"]`) : null;
      tab?.click();
    },
  });

  document.querySelectorAll("[data-style-fit]").forEach((label) => {
    const tabStyle = label.dataset.styleFit;
    const tabModel = VIEWER_STYLE_TO_MODEL[tabStyle];
    const score = registry.getScore("article", tabModel);
    label.textContent = `${registry.scoreLabel(score)} · ${score}.0`;
  });
}

async function copyViewerPrompt(style, control) {
  const prompt = VIEWER_STYLE_PROMPTS[style];
  if (!prompt) {
    return;
  }

  try {
    await navigator.clipboard.writeText(prompt);
    control.textContent = "已复制";
    window.setTimeout(() => {
      control.textContent = "复制";
    }, 1400);
  } catch {
    control.textContent = "复制失败";
    window.setTimeout(() => {
      control.textContent = "复制";
    }, 1400);
  }
}

function normalizeFile(file) {
  const normalized = file.replace(/^\/+/, "");
  if (normalized.includes("..")) {
    throw new Error("不支持访问 docs 目录之外的文件。");
  }
  return normalized;
}

function extractTitle(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

function renderViewerBackLink(data, safeFile, params) {
  const backLink = document.querySelector("#viewer-back-link");
  if (!backLink) {
    return;
  }

  const fromFile = normalizeReturnFile(params.get("from"), data);
  if (fromFile && fromFile !== safeFile) {
    backLink.href = viewerHrefWithCurrentStyle(fromFile);
    backLink.textContent = fromFile === data.outlineFile ? "返回大纲" : "返回上一页";
    return;
  }

  if (safeFile !== data.outlineFile) {
    backLink.href = viewerHrefWithCurrentStyle(data.outlineFile);
    backLink.textContent = "返回大纲";
    return;
  }

  backLink.href = "./index.html";
  backLink.textContent = "返回首页";
}

function normalizeReturnFile(file, data) {
  if (!file) {
    return null;
  }
  const safeFile = normalizeFile(file);
  return buildDocSequence(data).includes(safeFile) ? safeFile : null;
}

function renderViewerActions(container) {
  if (!container) {
    return;
  }

  container.replaceChildren();

  const copyLink = document.createElement("button");
  copyLink.className = "text-link text-link-button";
  copyLink.type = "button";
  copyLink.textContent = "复制链接";
  copyLink.addEventListener("click", async () => {
    await copyViewerUrl(copyLink);
  });

  container.append(copyLink);
}

async function copyViewerUrl(control) {
  try {
    await navigator.clipboard.writeText(window.location.href);
    control.textContent = "已复制";
    window.setTimeout(() => {
      control.textContent = "复制链接";
    }, 1400);
  } catch {
    control.textContent = "复制失败";
    window.setTimeout(() => {
      control.textContent = "复制链接";
    }, 1400);
  }
}

function renderMotionReaderCards() {
  const container = document.querySelector("#motion-reader-cards");
  if (!container) {
    return;
  }

  cleanupMotionReaderFx(container);
  container.innerHTML = MOTION_READER_MODULES.map((module) => {
    const statusLabel = module.status === "done" ? "● DONE" : "○ PENDING";
    return `
      <article class="motion-reader-card" style="--cc: ${module.color}">
        <div class="motion-card-stage">${motionReaderStageMarkup(module)}</div>
        <div class="motion-card-chrome">
          <span>#${module.id}</span>
          <span>${module.label}</span>
        </div>
        <div class="motion-card-copy">
          <h3>${module.title}</h3>
          <p>${module.en}</p>
        </div>
        <div class="motion-card-status">${statusLabel}</div>
      </article>
    `;
  }).join("");

  initMotionReaderFx(container);
  syncMotionReaderFx(document.body.dataset.viewerStyle);
}

function motionReaderStageMarkup(module) {
  if (module.fx === "particles") {
    return `<canvas class="motion-fx-canvas" data-motion-fx="particles"></canvas>`;
  }

  if (module.fx === "morph") {
    return `
      <svg class="motion-fx-morph" viewBox="0 0 260 150" role="img" aria-label="liquid morph preview">
        <defs>
          <filter id="motion-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6"/>
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -11"/>
          </filter>
        </defs>
        <g filter="url(#motion-goo)">
          <circle cx="92" cy="72" r="34" fill="#4d7cff">
            <animate attributeName="cx" values="92;150;112;92" dur="5.8s" repeatCount="indefinite"/>
            <animate attributeName="r" values="34;42;30;34" dur="4.8s" repeatCount="indefinite"/>
          </circle>
          <circle cx="158" cy="82" r="42" fill="#4d7cff" opacity="0.7">
            <animate attributeName="cx" values="158;104;172;158" dur="6.4s" repeatCount="indefinite"/>
            <animate attributeName="cy" values="82;92;64;82" dur="5.4s" repeatCount="indefinite"/>
          </circle>
          <circle cx="130" cy="76" r="24" fill="#4d7cff" opacity="0.92">
            <animate attributeName="cy" values="76;54;92;76" dur="4.6s" repeatCount="indefinite"/>
          </circle>
        </g>
      </svg>
    `;
  }

  if (module.fx === "glitch") {
    return `<div class="motion-fx-glitch"><span data-text="ERR0R">ERR0R</span><i></i></div>`;
  }

  return `
    <div class="motion-fx-loader" aria-label="loader preview">
      <span></span><span></span><span></span>
    </div>
  `;
}

function initMotionReaderFx(root) {
  root.querySelectorAll('canvas[data-motion-fx="particles"]').forEach((canvas) => {
    if (motionReaderFx.has(canvas)) {
      return;
    }

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    const particles = Array.from({ length: 64 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 16 + Math.random() * 68,
      s: 0.006 + Math.random() * 0.018,
      size: 0.7 + Math.random() * 1.4,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, canvas.clientWidth);
      height = Math.max(1, canvas.clientHeight);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const tick = () => {
      if (!running || !canvas.isConnected) {
        return;
      }

      ctx.fillStyle = "rgba(6, 6, 12, 0.24)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      const cx = width / 2;
      const cy = height / 2;

      particles.forEach((particle) => {
        particle.a += particle.s;
        particle.r -= 0.08;
        if (particle.r < 6) {
          particle.r = 74 + Math.random() * 24;
          particle.a = Math.random() * Math.PI * 2;
        }
        const x = cx + Math.cos(particle.a) * particle.r;
        const y = cy + Math.sin(particle.a) * particle.r * 0.58;
        const alpha = Math.max(0.12, 1 - particle.r / 96);
        ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = "source-over";
      frame = requestAnimationFrame(tick);
    };

    motionReaderFx.set(canvas, {
      start() {
        if (running || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          return;
        }
        running = true;
        frame = requestAnimationFrame(tick);
      },
      stop() {
        running = false;
        if (frame) {
          cancelAnimationFrame(frame);
        }
        frame = 0;
      },
      destroy() {
        running = false;
        if (frame) {
          cancelAnimationFrame(frame);
        }
        ro.disconnect();
        motionReaderFx.delete(canvas);
      },
    });
  });
}

function syncMotionReaderFx(style) {
  const root = document.querySelector("#motion-reader-cards");
  if (!root) {
    return;
  }

  root.querySelectorAll('canvas[data-motion-fx="particles"]').forEach((canvas) => {
    const fx = motionReaderFx.get(canvas);
    if (!fx) {
      return;
    }
    if (style === "motion") {
      fx.start();
    } else {
      fx.stop();
    }
  });
}

function cleanupMotionReaderFx(root) {
  root.querySelectorAll('canvas[data-motion-fx="particles"]').forEach((canvas) => {
    motionReaderFx.get(canvas)?.destroy();
  });
}

function renderListContent(text, context) {
  const dayMatch = text.match(/^Day\s+(\d+)\s+-\s+(.+)$/i);
  if (!dayMatch || !context?.days?.length) {
    return renderInline(text);
  }

  const dayNumber = Number(dayMatch[1]);
  const day = context.days.find((item) => item.day === dayNumber);
  if (!day) {
    return renderInline(text);
  }

  const label = `Day ${dayNumber} - ${day.title}`;
  const status = STATUS_LABELS[day.status] || "未创建原文";
  const indexMarkup = `<span class="day-topic-index">${String(dayNumber).padStart(2, "0")}</span>`;
  const statusMarkup = `<span class="day-topic-status">${escapeHtml(status)}</span>`;
  const titleMarkup = `<span class="day-topic-title">${renderInline(label)}</span>`;

  if (!day.journalFile) {
    return `
      <span class="day-topic-link is-locked" aria-disabled="true">
        ${indexMarkup}
        ${titleMarkup}
        <span class="day-topic-status">未创建原文</span>
      </span>
    `;
  }

  const isCurrent = day.journalFile === context.currentFile;
    return `
    <a class="day-topic-link${isCurrent ? " is-current" : ""}"
      href="${escapeAttribute(viewerHrefWithCurrentStyle(day.journalFile, { from: context.currentFile }))}"
      ${isCurrent ? 'aria-current="page"' : ""}>
      ${indexMarkup}
      ${titleMarkup}
      ${statusMarkup}
    </a>
  `;
}

function renderMarkdown(markdown, context = {}) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let listType = null;
  let inCode = false;
  let codeLines = [];
  let quoteLines = [];

  const flushParagraph = () => {
    if (!paragraph.length) {
      return;
    }
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listType) {
      return;
    }
    html.push(`</${listType}>`);
    listType = null;
  };

  const flushQuote = () => {
    if (!quoteLines.length) {
      return;
    }
    html.push(`<blockquote>${quoteLines.map((line) => `<p>${renderInline(line)}</p>`).join("")}</blockquote>`);
    quoteLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith("```")) {
      flushParagraph();
      flushList();
      flushQuote();
      if (!inCode) {
        inCode = true;
        codeLines = [];
      } else {
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        inCode = false;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(rawLine);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushQuote();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${renderInline(headingMatch[2])}</h${level}>`);
      continue;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      quoteLines.push(line.slice(2));
      continue;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      flushQuote();
      if (listType !== "ol") {
        flushList();
        listType = "ol";
        html.push("<ol>");
      }
      html.push(`<li>${renderListContent(orderedMatch[1], context)}</li>`);
      continue;
    }

    const unorderedMatch = line.match(/^-\s+(.*)$/);
    if (unorderedMatch) {
      flushParagraph();
      flushQuote();
      if (listType !== "ul") {
        flushList();
        listType = "ul";
        html.push("<ul>");
      }
      html.push(`<li>${renderListContent(unorderedMatch[1], context)}</li>`);
      continue;
    }

    flushQuote();
    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushQuote();

  return html.join("\n");
}

function renderFatal(error) {
  const root =
    document.querySelector(".viewer-content") ||
    document.querySelector(".layout");
  if (!root) {
    return;
  }
  const message = document.createElement("div");
  message.className = "empty-state";
  message.textContent = error instanceof Error ? error.message : String(error);
  root.prepend(message);
}
