const INDEX_URL = "./data/site-index.json";

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

function renderInline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function makeChip(status) {
  const labelMap = {
    completed: "已完成",
    in_progress: "进行中",
    needs_revision: "待修改",
    locked: "未开始",
    unknown: "未标记",
  };
  const span = document.createElement("span");
  span.className = `chip chip-${status}`;
  span.textContent = labelMap[status] || status;
  return span;
}

function viewerHref(file) {
  return `./viewer.html?file=${encodeURIComponent(file)}`;
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
  const safeFile = normalizeFile(file);

  const response = await fetch(`./${safeFile}`);
  if (!response.ok) {
    throw new Error(`找不到文档：${safeFile}`);
  }

  const markdown = await response.text();
  const title = extractTitle(markdown, safeFile);
  document.title = `${title} · UI/UED Coach`;

  document.querySelector("#viewer-title").textContent = title;
  document.querySelector("#viewer-meta").textContent = safeFile;
  document.querySelector("#viewer-content").innerHTML = renderMarkdown(markdown);

  renderViewerNav(data, safeFile);
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

function renderViewerNav(data, currentFile) {
  const nav = document.querySelector("#viewer-nav");
  const docs = [data.outlineFile, ...data.journal.map((item) => item.file)];
  const currentIndex = docs.indexOf(currentFile);

  if (currentIndex > 0) {
    const prevLink = document.createElement("a");
    prevLink.className = "text-link";
    prevLink.href = viewerHref(docs[currentIndex - 1]);
    prevLink.textContent = "上一份";
    nav.append(prevLink);
  }

  if (currentIndex >= 0 && currentIndex < docs.length - 1) {
    const nextLink = document.createElement("a");
    nextLink.className = "text-link";
    nextLink.href = viewerHref(docs[currentIndex + 1]);
    nextLink.textContent = "下一份";
    nav.append(nextLink);
  }
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
  const root = document.querySelector(".viewer-content") || document.querySelector(".layout");
  if (!root) {
    return;
  }
  const message = document.createElement("div");
  message.className = "empty-state";
  message.textContent = error instanceof Error ? error.message : String(error);
  root.prepend(message);
}

