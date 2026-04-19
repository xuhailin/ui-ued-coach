const INDEX_URL = "./data/site-index.json";
const STATUS_LABELS = {
  completed: "已完成",
  in_progress: "进行中",
  needs_revision: "待修改",
  locked: "未开始",
  unknown: "未标记",
};

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "home") {
    initHome().catch(renderFatal);
  }
  if (page === "viewer") {
    initViewer().catch(renderFatal);
  }
  if (page === "reading") {
    initReading().catch(renderFatal);
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

function readingHref(file) {
  return `./reading.html?file=${encodeURIComponent(file)}`;
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
  const rulesList = document.querySelector("#rules-list");
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

  data.completionRules.forEach((rule) => {
    const item = document.createElement("li");
    item.textContent = rule;
    rulesList.append(item);
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
  const data = await fetchIndex();
  const params = new URLSearchParams(window.location.search);
  const file = params.get("file") || data.outlineFile;
  const { safeFile, markdown, title } = await loadDocument(file);
  document.title = `${title} · UI/UED Coach`;

  document.querySelector("#viewer-title").textContent = title;
  document.querySelector("#viewer-meta").textContent = safeFile;
  document.querySelector("#viewer-content").innerHTML = renderMarkdown(markdown);

  renderDocumentPager(document.querySelector("#viewer-nav"), data, safeFile, viewerHref, "text-link");
}

async function initReading() {
  const data = await fetchIndex();
  const params = new URLSearchParams(window.location.search);
  const file = params.get("file") || data.outlineFile;
  const documentData = await loadDocument(file);
  const context = getDocumentContext(data, documentData.safeFile);

  document.title = `${documentData.title} · UI/UED Coach 阅读工作台`;
  document.querySelector("#reading-current-title").textContent = documentData.title;
  document.querySelector("#reading-current-summary").textContent = context.summary;
  document.querySelector("#reading-meta-file").textContent = documentData.safeFile;
  document.querySelector("#reading-content").innerHTML = renderMarkdown(documentData.markdown);

  const statusRoot = document.querySelector("#reading-meta-status");
  statusRoot.replaceChildren();
  if (context.status) {
    statusRoot.append(makeChip(context.status));
  } else {
    const badge = document.createElement("span");
    badge.className = "reading-doc-label";
    badge.textContent = context.dayLabel;
    statusRoot.append(badge);
  }

  const sourceLink = document.querySelector("#reading-open-source");
  sourceLink.href = docHref(documentData.safeFile);

  const viewerLink = document.querySelector("#reading-open-viewer");
  viewerLink.href = viewerHref(documentData.safeFile);

  renderReadingStats(data, context);
  renderReadingRoadmap(data, documentData.safeFile);
  renderReadingJournal(data, documentData.safeFile);
  renderReadingRules(data);
  renderDocumentPager(document.querySelector("#reading-doc-nav"), data, documentData.safeFile, readingHref, "workbench-button workbench-button-secondary");
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

function renderDocumentPager(container, data, currentFile, hrefBuilder, linkClass) {
  if (!container) {
    return;
  }

  container.replaceChildren();
  const docs = buildDocSequence(data);
  const currentIndex = docs.indexOf(currentFile);

  if (currentIndex > 0) {
    const prevLink = document.createElement("a");
    prevLink.className = linkClass;
    prevLink.href = hrefBuilder(docs[currentIndex - 1]);
    prevLink.textContent = "上一份";
    container.append(prevLink);
  }

  if (currentIndex >= 0 && currentIndex < docs.length - 1) {
    const nextLink = document.createElement("a");
    nextLink.className = linkClass;
    nextLink.href = hrefBuilder(docs[currentIndex + 1]);
    nextLink.textContent = "下一份";
    container.append(nextLink);
  }
}

function renderReadingStats(data, context) {
  const root = document.querySelector("#reading-stats");
  root.replaceChildren();

  const stats = [
    {
      label: "已完成",
      value: `${data.days.filter((item) => item.status === "completed").length}/${data.days.length}`,
    },
    {
      label: "已记录",
      value: `${data.journal.length} 篇`,
    },
    {
      label: "当前阅读",
      value: context.dayLabel,
    },
  ];

  stats.forEach((stat) => {
    const item = document.createElement("article");
    item.className = "reading-stat";

    const label = document.createElement("p");
    label.className = "reading-stat-label";
    label.textContent = stat.label;

    const value = document.createElement("p");
    value.className = "reading-stat-value";
    value.textContent = stat.value;

    item.append(label, value);
    root.append(item);
  });
}

function renderReadingRoadmap(data, currentFile) {
  const root = document.querySelector("#reading-days");
  root.replaceChildren();

  root.append(
    createWorkbenchItem({
      href: readingHref(data.outlineFile),
      eyebrow: "Roadmap",
      title: "14 天路线总览",
      summary: "先看整体顺序，再回到当天笔记，不需要在页面之间来回跳转。",
      current: currentFile === data.outlineFile,
      chipStatus: null,
      meta: "训练总图",
    }),
  );

  data.days.forEach((day) => {
    root.append(
      createWorkbenchItem({
        href: day.journalFile ? readingHref(day.journalFile) : null,
        eyebrow: `Day ${String(day.day).padStart(2, "0")}`,
        title: day.title,
        summary: day.summary || "当天文档还没创建，先完成前一天再继续。",
        current: currentFile === day.journalFile,
        chipStatus: day.status,
        meta: day.journalFile ? "打开训练记录" : "尚未开放",
      }),
    );
  });
}

function renderReadingJournal(data, currentFile) {
  const root = document.querySelector("#reading-journal-list");
  root.replaceChildren();

  if (data.journal.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "还没有任何每日记录。";
    root.append(empty);
    return;
  }

  data.journal.forEach((entry) => {
    root.append(
      createWorkbenchItem({
        href: readingHref(entry.file),
        eyebrow: entry.day ? `Day ${String(entry.day).padStart(2, "0")}` : "Journal",
        title: entry.title,
        summary: entry.summary || entry.file,
        current: currentFile === entry.file,
        chipStatus: entry.status,
        meta: entry.file,
      }),
    );
  });
}

function renderReadingRules(data) {
  const root = document.querySelector("#reading-rules-list");
  root.replaceChildren();

  data.completionRules.forEach((rule) => {
    const item = document.createElement("li");
    item.textContent = rule;
    root.append(item);
  });
}

function createWorkbenchItem({ href, eyebrow, title, summary, current, chipStatus, meta }) {
  const item = document.createElement(href ? "a" : "article");
  item.className = "reading-list-item";

  if (current) {
    item.classList.add("is-current");
  }

  if (href) {
    item.href = href;
  } else {
    item.classList.add("is-disabled");
  }

  const top = document.createElement("div");
  top.className = "reading-item-top";

  const eyebrowNode = document.createElement("span");
  eyebrowNode.className = "reading-item-eyebrow";
  eyebrowNode.textContent = eyebrow;
  top.append(eyebrowNode);

  if (chipStatus) {
    top.append(makeChip(chipStatus));
  }

  const heading = document.createElement("h3");
  heading.className = "reading-item-title";
  heading.textContent = title;

  const text = document.createElement("p");
  text.className = "reading-item-summary";
  text.textContent = summary;

  const metaNode = document.createElement("p");
  metaNode.className = "reading-item-meta";
  metaNode.textContent = meta;

  item.append(top, heading, text, metaNode);
  return item;
}

function renderMarkdown(markdown) {
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
      html.push(`<li>${renderInline(orderedMatch[1])}</li>`);
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
      html.push(`<li>${renderInline(unorderedMatch[1])}</li>`);
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
    document.querySelector(".reading-content") ||
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
