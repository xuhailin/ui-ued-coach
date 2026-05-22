(function () {
  const TOKEN_ROLES = [
    { key: "primary", idx: "01", role: "主色", en: "PRIMARY", char: "主" },
    { key: "secondary", idx: "02", role: "辅助色", en: "SECONDARY", char: "辅" },
    { key: "accent", idx: "03", role: "点亮色", en: "HIGHLIGHT", char: "亮" },
    { key: "background", idx: "04", role: "背景色", en: "BACKGROUND", char: "底" },
    { key: "surface", idx: "05", role: "表面色", en: "SURFACE", char: "面" },
    { key: "line", idx: "06", role: "边线", en: "LINE", char: "线" },
    { key: "text", idx: "07", role: "正文", en: "TEXT", char: "文" },
    { key: "muted", idx: "08", role: "弱化文本", en: "MUTED", char: "弱" },
  ];

  const CATEGORIES = [
    { id: "all", idx: "00", name: "全部", en: "All", desc: "查看所有抽出来的动态色卡。" },
    { id: "model-list", idx: "04", name: "模型列表", en: "Model List", desc: "来自参考 HTML 的 04 模型列表，适合产品控制台、市场列表和价格卡。" },
    { id: "community", idx: "11-16", name: "社区场景", en: "Community", desc: "阅读社区、聊天社区和热闹型社区。" },
    { id: "console", idx: "07-18", name: "控制台", en: "Console", desc: "AI 基础设施、实验台、开发者工具和暗色操作台。" },
    { id: "editorial", idx: "01-12", name: "阅读内容", en: "Editorial", desc: "长文、课程、笔记和低刺激阅读界面。" },
    { id: "commerce", idx: "13-16", name: "交易促活", en: "Commerce", desc: "钱包、计费、会员、活动和强 CTA 场景。" },
  ];

  const PALETTES = [
    {
      id: "model-list-gold",
      category: "model-list",
      name: "模型列表 · 金色修正版",
      en: "Model List Gold",
      idx: "04",
      mode: "light",
      fit: "AI 模型市场、计费列表、开发者控制台",
      notes: "参考 HTML 里 04 章节的主调。金色负责选中和 CTA，棕金负责层级，米白表面保持工具感。",
      tags: ["model-list", "dashboard", "pricing", "gold", "light"],
      tokens: {
        primary: "#FFBB00",
        secondary: "#C68700",
        accent: "#F5B200",
        background: "#F4F1E8",
        surface: "#FFFFFF",
        line: "#E9E7E2",
        text: "#27211B",
        muted: "#7E7468",
      },
    },
    {
      id: "deep-console",
      category: "console",
      name: "深空控制台",
      en: "Deep Space Console",
      idx: "18",
      mode: "dark",
      fit: "AI 基础设施、指标监控、夜间开发工具",
      notes: "从 DEEPSPACE 暗色变体抽出。宝蓝黑做背景，金色成为唯一热焦点。",
      tags: ["console", "infra", "dark", "gold", "blue"],
      tokens: {
        primary: "#FFC033",
        secondary: "#7A88B8",
        accent: "#FFD060",
        background: "#0A0D14",
        surface: "#131724",
        line: "#2A2F40",
        text: "#E8E4D6",
        muted: "#8E8B7C",
      },
    },
    {
      id: "cold-flame",
      category: "console",
      name: "冷焰实验台",
      en: "Cold Flame",
      idx: "07",
      mode: "light",
      fit: "实验模块、动效库、需要强识别的工具页面",
      notes: "钴蓝拉满饱和，洋红做冲突高亮，适合状态明显的工具面板。",
      tags: ["console", "lab", "blue", "pink", "light"],
      tokens: {
        primary: "#2E54FF",
        secondary: "#1B3A8C",
        accent: "#EC3984",
        background: "#F4F6FB",
        surface: "#FFFFFF",
        line: "#D4DCED",
        text: "#0F1B30",
        muted: "#5A6585",
      },
    },
    {
      id: "moss-reading",
      category: "editorial",
      name: "苔野阅读",
      en: "Mossfield Reading",
      idx: "11",
      mode: "light",
      fit: "长文社区、读书会、创作者主页、课程笔记",
      notes: "低饱和鼠尾草绿和麦胚底，给阅读留出呼吸，CTA 不抢正文。",
      tags: ["community", "reading", "editorial", "green", "light"],
      tokens: {
        primary: "#5C7A4A",
        secondary: "#C97C4D",
        accent: "#D9C46A",
        background: "#F6F4EC",
        surface: "#FFFFFF",
        line: "#DDD7C2",
        text: "#1F2419",
        muted: "#6A6855",
      },
    },
    {
      id: "moss-night",
      category: "editorial",
      name: "夜苔读后灯",
      en: "Mossfield Dark",
      idx: "12",
      mode: "dark",
      fit: "夜间阅读、沉浸笔记、低亮度社区",
      notes: "不是纯黑，而是带绿调的深夜森林。亮绿只做引导，不做大面积铺色。",
      tags: ["community", "reading", "dark", "green"],
      tokens: {
        primary: "#94B575",
        secondary: "#E59E6E",
        accent: "#E6D278",
        background: "#161814",
        surface: "#1C1F19",
        line: "#2F352A",
        text: "#E3E2D6",
        muted: "#999780",
      },
    },
    {
      id: "bazaar-chat",
      category: "community",
      name: "集市聊天",
      en: "Bazaar Chat",
      idx: "13",
      mode: "light",
      fit: "评论、动态流、UGC 社区、活动页",
      notes: "珊瑚橙和莓紫拉开色域，适合头像、互动和热闹但不尖锐的社区。",
      tags: ["community", "chat", "commerce", "orange", "light"],
      tokens: {
        primary: "#FF6F3C",
        secondary: "#8B3A6E",
        accent: "#FFC83D",
        background: "#FFF7F0",
        surface: "#FFFFFF",
        line: "#F2D9C8",
        text: "#2A1825",
        muted: "#7A5A6B",
      },
    },
    {
      id: "beehive-growth",
      category: "commerce",
      name: "蜂巢促活",
      en: "Beehive Growth",
      idx: "15",
      mode: "light",
      fit: "会员、钱包、邀请奖励、热榜、活动运营",
      notes: "蜂蜜黄比警戒黄更柔，葡萄紫负责抗单调，适合热闹型产品入口。",
      tags: ["commerce", "community", "yellow", "purple", "light"],
      tokens: {
        primary: "#FFB200",
        secondary: "#6B3FA0",
        accent: "#FF8855",
        background: "#FFFAEC",
        surface: "#FFFFFF",
        line: "#F0E2B4",
        text: "#2A1F0E",
        muted: "#7A6940",
      },
    },
    {
      id: "warm-terracotta",
      category: "community",
      name: "暖陶亲和",
      en: "Warm Terracotta",
      idx: "05",
      mode: "light",
      fit: "课程页、轻社区、个人知识库、反馈页",
      notes: "赤陶主色把金色体系转成更有人味的暖调，适合低压力的学习产品。",
      tags: ["community", "learning", "warm", "light"],
      tokens: {
        primary: "#D97757",
        secondary: "#A04E33",
        accent: "#ECA354",
        background: "#FBF6EE",
        surface: "#FFFFFF",
        line: "#E6D6B8",
        text: "#2B201A",
        muted: "#6F5E4A",
      },
    },
    {
      id: "searing-alert",
      category: "console",
      name: "灼黄警戒",
      en: "Searing Alert",
      idx: "09",
      mode: "light",
      fit: "安全面板、告警中心、工业工具、重点行动入口",
      notes: "黄色只做油门，冷钢底负责秩序。不要把黄色铺满，否则会变成单色噪音。",
      tags: ["console", "alert", "yellow", "light"],
      tokens: {
        primary: "#FFD500",
        secondary: "#1F2933",
        accent: "#FFE040",
        background: "#F0F3F4",
        surface: "#FFFFFF",
        line: "#CDD5DB",
        text: "#0E1417",
        muted: "#4B5560",
      },
    },
  ];

  const state = {
    category: "all",
    tag: "all",
    selected: "model-list-gold",
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    renderStats();
    renderCategories();
    renderTags();
    renderPalettes();
  }

  function renderStats() {
    const root = document.getElementById("palette-stats");
    const tags = collectTags();
    root.innerHTML = [
      ["Palettes", String(PALETTES.length).padStart(2, "0")],
      ["Categories", String(CATEGORIES.length - 1).padStart(2, "0")],
      ["Tags", String(tags.length).padStart(2, "0")],
    ].map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("");
  }

  function renderCategories() {
    const root = document.getElementById("palette-category-list");
    root.innerHTML = CATEGORIES.map((category) => {
      const count = category.id === "all" ? PALETTES.length : PALETTES.filter((palette) => palette.category === category.id || palette.tags.includes(category.id)).length;
      return `
        <button class="palette-category-btn${state.category === category.id ? " is-active" : ""}" type="button" data-category="${category.id}">
          <span>${category.idx} · ${category.en}</span>
          <strong>${category.name}</strong>
          <em>${category.desc}</em>
          <i>${count}</i>
        </button>
      `;
    }).join("");

    root.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        state.category = button.dataset.category;
        state.selected = firstVisiblePalette()?.id || PALETTES[0].id;
        renderCategories();
        renderTags();
        renderPalettes();
      });
    });
  }

  function renderTags() {
    const root = document.getElementById("palette-tag-list");
    const tags = ["all", ...collectTags()];
    root.innerHTML = tags.map((tag) => {
      const active = state.tag === tag;
      return `<button class="palette-tag${active ? " is-active" : ""}" type="button" data-tag="${tag}">${tag}</button>`;
    }).join("");

    root.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        state.tag = button.dataset.tag;
        state.selected = firstVisiblePalette()?.id || PALETTES[0].id;
        renderTags();
        renderPalettes();
      });
    });
  }

  function renderPalettes() {
    const visible = filteredPalettes();
    const selected = visible.find((palette) => palette.id === state.selected) || visible[0] || PALETTES[0];
    state.selected = selected.id;

    const category = CATEGORIES.find((item) => item.id === state.category) || CATEGORIES[0];
    document.getElementById("active-category-kicker").textContent = `${category.idx} · ${category.en}`;
    document.getElementById("active-category-title").textContent = state.tag === "all" ? category.name : `${category.name} / ${state.tag}`;

    const grid = document.getElementById("palette-grid");
    grid.innerHTML = visible.map((palette) => renderPaletteCard(palette, palette.id === state.selected)).join("");
    grid.querySelectorAll(".palette-card").forEach((card) => {
      card.addEventListener("click", () => {
        state.selected = card.dataset.palette;
        renderPalettes();
      });
    });
    grid.querySelectorAll("[data-copy-token]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        copyText(button.dataset.copyValue, button);
      });
    });

    document.getElementById("reset-filters").onclick = () => {
      state.category = "all";
      state.tag = "all";
      state.selected = "model-list-gold";
      renderCategories();
      renderTags();
      renderPalettes();
    };
    document.getElementById("copy-palette").onclick = (event) => copyText(toCss(selected), event.currentTarget);
  }

  function renderPaletteCard(palette, isSelected) {
    const tokens = TOKEN_ROLES.map((role) => ({ ...role, hex: palette.tokens[role.key] }));
    const bg = palette.tokens.background;
    const surface = palette.tokens.surface;
    const ink = palette.tokens.text;
    const muted = palette.tokens.muted;
    const line = palette.tokens.line;
    const primary = palette.tokens.primary;
    const secondary = palette.tokens.secondary;
    const accent = palette.tokens.accent;
    return `
      <article class="palette-card${isSelected ? " is-selected" : ""} is-${palette.mode}" data-palette="${palette.id}" style="--p-bg:${bg};--p-surface:${surface};--p-text:${ink};--p-muted:${muted};--p-line:${line};--p-primary:${primary};--p-secondary:${secondary};--p-accent:${accent};">
        <div class="palette-card-head">
          <div class="palette-card-num">${palette.idx}</div>
          <div>
            <span>${palette.idx} · ${palette.en}</span>
            <h3>${palette.name}</h3>
            <p>${palette.fit}</p>
          </div>
          <i>${palette.mode}</i>
        </div>
        <div class="palette-hero-strip">
          ${tokens.slice(0, 4).map(renderHeroToken).join("")}
        </div>
        <div class="palette-card-body">
          <div class="palette-notes">
            <div class="palette-note-lead">调色思路</div>
            <p>${palette.notes}</p>
            <div class="palette-tags">
              ${palette.tags.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
          </div>
          <div class="palette-preview">
            <div class="preview-chrome">
              <span></span><span></span><span></span>
              <strong>${palette.en}</strong>
            </div>
            <div class="preview-app">
              <div class="preview-sidebar">
                <b></b><span></span><span></span><span></span>
              </div>
              <div class="preview-content">
                <div class="preview-title"></div>
                <div class="preview-row">
                  <b></b><b></b><b></b>
                </div>
                <div class="preview-list">
                  <span></span><span></span><span></span>
                </div>
                <button type="button">Action</button>
              </div>
            </div>
          </div>
        </div>
        <div class="palette-token-grid">
          ${tokens.map(renderTokenCell).join("")}
        </div>
        <div class="palette-css-row">
          <pre class="css-snippet"><code>${escapeHtml(toCss(palette))}</code></pre>
        </div>
      </article>
    `;
  }

  function renderHeroToken(token) {
    const contrastClass = luminance(token.hex) > 0.58 ? "is-light" : "is-dark";
    return `
      <div class="palette-hero-token ${contrastClass}" style="background:${token.hex}">
        <span>${token.idx}</span>
        <strong>${token.char}</strong>
        <em>${token.hex}</em>
      </div>
    `;
  }

  function renderTokenCell(token) {
    return `
      <button class="palette-token" type="button" data-copy-token="${token.key}" data-copy-value="${token.hex}" title="复制 ${token.hex}">
        <span style="background:${token.hex}"></span>
        <strong>--${token.key}</strong>
        <em>${token.hex}</em>
      </button>
    `;
  }

  function filteredPalettes() {
    return PALETTES.filter((palette) => {
      const categoryMatch = state.category === "all" || palette.category === state.category || palette.tags.includes(state.category);
      const tagMatch = state.tag === "all" || palette.tags.includes(state.tag);
      return categoryMatch && tagMatch;
    });
  }

  function firstVisiblePalette() {
    return filteredPalettes()[0];
  }

  function collectTags() {
    return Array.from(new Set(PALETTES.flatMap((palette) => palette.tags))).sort();
  }

  function toCss(palette) {
    const selector = `.theme-${palette.id}`;
    return `${selector} {
  --primary: ${palette.tokens.primary};
  --secondary: ${palette.tokens.secondary};
  --accent: ${palette.tokens.accent};
  --background: ${palette.tokens.background};
  --surface: ${palette.tokens.surface};
  --line: ${palette.tokens.line};
  --text: ${palette.tokens.text};
  --muted: ${palette.tokens.muted};
}`;
  }

  function luminance(hex) {
    const value = hex.replace("#", "");
    const r = parseInt(value.slice(0, 2), 16) / 255;
    const g = parseInt(value.slice(2, 4), 16) / 255;
    const b = parseInt(value.slice(4, 6), 16) / 255;
    const linear = (channel) => channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
  }

  function copyText(text, trigger) {
    navigator.clipboard?.writeText(text);
    trigger.classList.add("is-copied");
    setTimeout(() => trigger.classList.remove("is-copied"), 800);
  }

  function escapeHtml(text) {
    return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  }
})();
