const registry = window.StyleRegistry;
const CONTENT_TYPES = registry.contentTypes;
const STYLE_MODELS = registry.styleModels;
const ATLAS_STYLE_KEY = "uiUedCoach.atlasStyle";
const ATLAS_STYLE_MODELS = ["atlas", "catalog", "dashboard", "console", "notion", "terminal"];
const ATLAS_DEFAULT_STYLE = "atlas";
const ATLAS_STYLE_NAV = [
  { id: "atlas", label: "图谱", href: "./style-atlas.html" },
  { id: "catalog", label: "图录", href: "./style-atlas-catalog.html" },
  { id: "dashboard", label: "数据", href: "./style-atlas-dashboard.html" },
  { id: "console", label: "控制台", href: "./style-atlas-console.html" },
  { id: "notion", label: "文档", href: "./style-atlas-notion.html" },
  { id: "terminal", label: "终端", href: "./style-atlas-terminal.html" },
];

let currentContentId = "gallery";
let currentAtlasStyle = normalizeAtlasStyle(
  new URLSearchParams(window.location.search).get("style") ||
  document.body.dataset.initialAtlasStyle ||
  window.localStorage.getItem(ATLAS_STYLE_KEY)
);

function normalizeAtlasStyle(style) {
  return ATLAS_STYLE_MODELS.includes(style) ? style : ATLAS_DEFAULT_STYLE;
}

function syncAtlasStyleUrl(style) {
  const selected = ATLAS_STYLE_NAV.find((item) => item.id === style);
  if (selected) {
    window.history.replaceState({}, "", selected.href);
  }
}

function setAtlasStyle(style) {
  currentAtlasStyle = normalizeAtlasStyle(style);
  window.localStorage.setItem(ATLAS_STYLE_KEY, currentAtlasStyle);
  syncAtlasStyleUrl(currentAtlasStyle);
  renderAll();
}

function renderAtlasStylePages() {
  const root = document.getElementById("atlas-style-pages");
  root.innerHTML = ATLAS_STYLE_NAV.map((style) => {
    return `<a class="atlas-style-page${style.id === currentAtlasStyle ? " is-active" : ""}" href="${style.href}" data-atlas-style="${style.id}">${style.label}</a>`;
  }).join("");

  root.querySelectorAll("[data-atlas-style]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setAtlasStyle(link.dataset.atlasStyle);
    });
  });
}

function renderContentTypes() {
  const root = document.getElementById("content-types");
  root.innerHTML = CONTENT_TYPES.map((type) => {
    const selected = type.id === currentContentId;
    return `
      <button class="content-type-btn${selected ? " is-active" : ""}" type="button" data-content-id="${type.id}">
        <span>${type.name}</span>
        <strong>${type.name}</strong>
      </button>
    `;
  }).join("");

  root.querySelectorAll("[data-content-id]").forEach((button) => {
    button.addEventListener("click", () => {
      currentContentId = button.dataset.contentId;
      renderAll();
    });
  });
}

function renderSelectedContent() {
  const content = registry.getContentType(currentContentId);
  document.getElementById("selected-content-title").textContent = content.name;
  document.getElementById("selected-content-desc").textContent = content.desc;
  document.getElementById("best-fit").textContent = content.best;
  document.getElementById("fit-risk").textContent = content.risk;

  const scores = registry.getStylesForContent(currentContentId);

  document.getElementById("style-fit-list").innerHTML = scores.map((style) => `
    <article class="style-fit-row" data-score="${style.score}">
      <div>
        <span class="style-fit-score">${style.score}.0</span>
        <strong>${style.name}</strong>
        <p>${style.why}</p>
      </div>
      <span>${style.label}</span>
    </article>
  `).join("");
}

function renderStyleModels() {
  document.getElementById("style-count").textContent = `${STYLE_MODELS.length} 个模型`;
  document.getElementById("style-models").innerHTML = STYLE_MODELS.map((style, index) => `
    <article class="style-model-card">
      <div class="style-model-top">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${style.tone}</strong>
      </div>
      <h3>${style.name}</h3>
      <dl>
        <div><dt>布局</dt><dd>${style.layout}</dd></div>
        <div><dt>适合</dt><dd>${style.suited}</dd></div>
        <div><dt>慎用</dt><dd>${style.avoid}</dd></div>
      </dl>
    </article>
  `).join("");
}

function renderMatrix() {
  const rows = CONTENT_TYPES.map((type) => {
    const cells = STYLE_MODELS.map((style) => {
      const score = registry.getScore(type.id, style.id);
      return `<td data-score="${score}"><span>${score}</span></td>`;
    }).join("");

    return `
      <tr class="${type.id === currentContentId ? "is-current" : ""}">
        <th scope="row">${type.name}</th>
        ${cells}
      </tr>
    `;
  }).join("");

  document.getElementById("fit-matrix").innerHTML = `
    <thead>
      <tr>
        <th scope="col">内容</th>
        ${STYLE_MODELS.map((style) => `<th scope="col">${style.name}</th>`).join("")}
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  `;
}

function renderSelfJudgment() {
  registry.renderStyleJudgmentStrip("#atlas-style-judgment", {
    page: "style-atlas",
    contentId: "atlas",
    allowedStyleIds: ["atlas", "catalog", "dashboard", "notion", "console", "terminal"],
    activeStyle: currentAtlasStyle,
    onSelect(styleId) {
      currentContentId = "atlas";
      setAtlasStyle(styleId);
    },
  });
}

function renderAll() {
  document.body.dataset.atlasStyle = currentAtlasStyle;
  renderAtlasStylePages();
  renderContentTypes();
  renderSelectedContent();
  renderStyleModels();
  renderMatrix();
  renderSelfJudgment();
}

renderAll();
