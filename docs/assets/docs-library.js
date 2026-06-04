const INDEX_URL = "./data/site-index.json";

const TYPE_META = {
  all: { label: "全部", short: "ALL", color: "var(--docs-text)" },
  plan: { label: "训练路线", short: "PLAN", color: "var(--docs-plan)" },
  journal: { label: "每日笔记", short: "JOURNAL", color: "var(--docs-journal)" },
  ref: { label: "知识卡", short: "REF", color: "var(--docs-ref)" },
  spec: { label: "设计规范", short: "SPEC", color: "var(--docs-spec)" },
};

const state = {
  docs: [],
  type: "all",
  tag: null,
  query: "",
  view: "list",
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
  init().catch(renderFatal);
});

async function init() {
  const response = await fetch(INDEX_URL);
  if (!response.ok) {
    throw new Error("无法加载文档索引，请先运行生成脚本。");
  }
  const data = await response.json();
  state.docs = normalizeDocs(data);
  bindControls();
  renderAll();
}

function normalizeDocs(data) {
  const docs = Array.isArray(data.documents) ? data.documents : [];
  return docs.map((doc, index) => ({
    title: doc.title || doc.file,
    file: doc.file,
    type: doc.type || "ref",
    seq: doc.seq || `D-${String(index + 1).padStart(3, "0")}`,
    summary: doc.summary || "",
    scenario: doc.scenario || "",
    judgment: doc.judgment || "",
    solution: doc.solution || "",
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    updated: Number(doc.updated || 0),
    status: doc.status || "live",
  })).filter((doc) => doc.file);
}

function bindControls() {
  $("#docs-search").addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    renderList();
    renderActiveFilters();
  });

  $("#view-list").addEventListener("click", () => setView("list"));
  $("#view-grid").addEventListener("click", () => setView("grid"));

  window.addEventListener("keydown", (event) => {
    const activeTag = document.activeElement?.tagName;
    if (event.key === "/" && activeTag !== "INPUT" && activeTag !== "TEXTAREA") {
      event.preventDefault();
      $("#docs-search").focus();
    }
  });
}

function setView(view) {
  state.view = view;
  $("#view-list").classList.toggle("is-selected", view === "list");
  $("#view-grid").classList.toggle("is-selected", view === "grid");
  renderList();
}

function renderAll() {
  renderStats();
  renderTabs();
  renderTags();
  renderRecent();
  renderList();
  renderActiveFilters();
}

function renderStats() {
  const refs = state.docs.filter((doc) => doc.type === "ref");
  const journal = state.docs.filter((doc) => doc.type === "journal");
  const latest = [...state.docs].sort((a, b) => b.updated - a.updated)[0];
  const latestRef = [...refs].sort((a, b) => b.updated - a.updated)[0];

  $("#stat-total").textContent = String(state.docs.length);
  $("#stat-ref").textContent = String(refs.length);
  $("#stat-journal").textContent = String(journal.length);
  $("#stat-last").textContent = latest ? formatDate(latest.updated) : "-";
  $("#stat-last-file").textContent = latest ? latest.file : "UPDATED";

  if (latestRef) {
    $("#latest-ref-link").href = viewerHref(latestRef.file);
  }
}

function renderTabs() {
  const counts = countBy(state.docs, "type");
  counts.all = state.docs.length;
  const tabs = ["all", "plan", "journal", "ref", "spec"].map((type) => {
    const meta = TYPE_META[type];
    return `
      <button class="docs-tab${state.type === type ? " is-selected" : ""}" type="button" role="tab" aria-selected="${state.type === type}" data-type="${type}">
        ${meta.label}<b>${counts[type] || 0}</b>
      </button>
    `;
  });
  $("#docs-tabs").innerHTML = tabs.join("");
  $$(".docs-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.type = tab.dataset.type;
      state.tag = null;
      renderAll();
    });
  });
}

function renderTags() {
  const pool = getTypedDocs();
  const counts = {};
  pool.forEach((doc) => {
    doc.tags.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh"));
  $("#tag-total").textContent = String(entries.length);
  if (!entries.length) {
    $("#tag-list").innerHTML = `<p class="docs-empty-small">暂无标签</p>`;
    return;
  }

  $("#tag-list").innerHTML = entries.map(([tag, count]) => `
    <button class="docs-tag${state.tag === tag ? " is-selected" : ""}" type="button" data-tag="${escapeAttribute(tag)}">
      ${escapeHtml(tag)}<b>${count}</b>
    </button>
  `).join("");

  $$(".docs-tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      state.tag = state.tag === tag.dataset.tag ? null : tag.dataset.tag;
      renderTags();
      renderList();
      renderActiveFilters();
    });
  });
}

function renderRecent() {
  const recent = [...state.docs].sort((a, b) => b.updated - a.updated).slice(0, 5);
  $("#recent-list").innerHTML = recent.map((doc) => `
    <a class="docs-recent-item" href="${viewerHref(doc.file)}">
      <span class="docs-recent-title">${escapeHtml(doc.title)}</span>
      <span class="docs-recent-meta">${escapeHtml(doc.seq)} · ${escapeHtml(typeLabel(doc.type))} · ${formatDate(doc.updated)}</span>
    </a>
  `).join("");
}

function renderActiveFilters() {
  const filters = [];
  if (state.type !== "all") {
    filters.push({ key: "type", label: typeLabel(state.type) });
  }
  if (state.tag) {
    filters.push({ key: "tag", label: `#${state.tag}` });
  }
  if (state.query) {
    filters.push({ key: "query", label: `"${state.query}"` });
  }

  if (!filters.length) {
    $("#active-filters").innerHTML = "";
    return;
  }

  $("#active-filters").innerHTML = `
    <span>筛选</span>
    ${filters.map((filter) => `<button class="docs-clear-filter" type="button" data-filter="${filter.key}">${escapeHtml(filter.label)} ×</button>`).join("")}
    <button class="docs-clear-filter" type="button" data-filter="all">清空全部</button>
  `;

  $$(".docs-clear-filter").forEach((button) => {
    button.addEventListener("click", () => {
      clearFilter(button.dataset.filter);
    });
  });
}

function clearFilter(filter) {
  if (filter === "type" || filter === "all") {
    state.type = "all";
  }
  if (filter === "tag" || filter === "all") {
    state.tag = null;
  }
  if (filter === "query" || filter === "all") {
    state.query = "";
    $("#docs-search").value = "";
  }
  renderAll();
}

function renderList() {
  const visible = getVisibleDocs();
  $("#result-count").textContent = String(visible.length);
  $("#result-total").textContent = String(getTypedDocs().length);
  $("#docs-result-title").textContent = state.type === "all" ? "全部文档" : typeLabel(state.type);

  const list = $("#docs-list");
  list.className = `docs-list${state.view === "grid" ? " is-grid" : ""}`;

  if (!visible.length) {
    list.innerHTML = `
      <div class="docs-empty">
        <b>没有命中的文档</b>
        <p>换一个关键词，或清空当前筛选。新增知识卡后运行生成脚本，列表会自动收录。</p>
      </div>
    `;
    return;
  }

  list.innerHTML = visible.map(renderCard).join("");
}

function renderCard(doc) {
  const meta = TYPE_META[doc.type] || TYPE_META.ref;
  const valueBlock = renderValueBlock(doc);
  const tags = doc.tags.length
    ? `<span class="docs-card-tags">${doc.tags.map((tag) => `<span class="docs-card-tag">#${escapeHtml(tag)}</span>`).join("")}</span>`
    : "";

  return `
    <a class="docs-card" style="--doc-color:${meta.color}" href="${viewerHref(doc.file)}">
      <div class="docs-card-top">
        <span class="docs-card-seq">${escapeHtml(doc.seq)}</span>
        <span class="docs-card-type">${escapeHtml(meta.label)} · ${escapeHtml(meta.short)}</span>
      </div>
      <h3>${highlight(doc.title)}</h3>
      <div class="docs-card-path">${highlight(doc.file)}</div>
      ${doc.summary ? `<p class="docs-card-summary">${highlight(doc.summary)}</p>` : ""}
      ${valueBlock}
      <div class="docs-card-foot">
        <span>${formatDate(doc.updated)}</span>
        <span>·</span>
        <span>${escapeHtml(doc.status)}</span>
        ${tags ? `<span>·</span>${tags}` : ""}
      </div>
    </a>
  `;
}

function renderValueBlock(doc) {
  const rows = [
    ["场景", doc.scenario],
    ["关键判断", doc.judgment],
    ["稳定解法", doc.solution],
  ].filter(([, value]) => value);

  if (!rows.length || (doc.type !== "ref" && doc.type !== "spec")) {
    return "";
  }

  return `
    <div class="docs-value">
      ${rows.map(([label, value]) => `
        <div class="docs-value-row">
          <span class="docs-value-label">${label}</span>
          <span class="docs-value-text">${highlight(value)}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function getTypedDocs() {
  if (state.type === "all") {
    return state.docs;
  }
  return state.docs.filter((doc) => doc.type === state.type);
}

function getVisibleDocs() {
  return getTypedDocs()
    .filter((doc) => !state.tag || doc.tags.includes(state.tag))
    .filter((doc) => matchesQuery(doc))
    .sort((a, b) => b.updated - a.updated || a.title.localeCompare(b.title, "zh"));
}

function matchesQuery(doc) {
  if (!state.query) {
    return true;
  }
  const query = state.query.toLowerCase();
  return [
    doc.title,
    doc.file,
    doc.summary,
    doc.scenario,
    doc.judgment,
    doc.solution,
    doc.seq,
    doc.tags.join(" "),
  ].join(" ").toLowerCase().includes(query);
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});
}

function typeLabel(type) {
  return (TYPE_META[type] || TYPE_META.ref).label;
}

function viewerHref(file) {
  return `./viewer.html?file=${encodeURIComponent(file)}&style=docs&from=docs`;
}

function formatDate(timestamp) {
  if (!timestamp) {
    return "-";
  }
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestamp * 1000));
}

function highlight(text) {
  const escaped = escapeHtml(text || "");
  if (!state.query) {
    return escaped;
  }
  const pattern = state.query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return escaped.replace(new RegExp(`(${pattern})`, "gi"), "<mark>$1</mark>");
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(text) {
  return escapeHtml(text);
}

function renderFatal(error) {
  $(".docs-main").innerHTML = `
    <div class="docs-empty">
      <b>文档库加载失败</b>
      <p>${escapeHtml(error.message)}</p>
    </div>
  `;
}
