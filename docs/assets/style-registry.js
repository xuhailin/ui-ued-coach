(function () {
  const contentTypes = [
    {
      id: "article",
      name: "文稿阅读",
      en: "Article",
      desc: "长文、训练笔记、设计规范、复盘记录，需要稳定阅读节奏和清晰层级。",
      best: "杂志阅读",
      risk: "图像型风格会削弱正文连续性。",
    },
    {
      id: "gallery",
      name: "灵感图集",
      en: "Gallery",
      desc: "大量外部案例、截图、作品集入口，需要快速扫视、分类、比较和收藏。",
      best: "灵感墙 / 图录档案",
      risk: "终端风和长文风会压低图片信息权重。",
    },
    {
      id: "lab",
      name: "实验模块",
      en: "Lab",
      desc: "动效、组件、代码片段或互动实验，需要状态、预览、参数和实现进度共存。",
      best: "实验控制台",
      risk: "过度杂志化会让操作入口变弱。",
    },
    {
      id: "atlas",
      name: "风格图谱",
      en: "Atlas",
      desc: "风格模型、适配规则、内容类型和分数关系，需要可比较、可追踪、可复用。",
      best: "知识图谱",
      risk: "只做视觉展示会让判断依据变弱。",
    },
    {
      id: "dashboard",
      name: "数据概览",
      en: "Dashboard",
      desc: "指标、进度、统计、趋势和异常，需要高密度但可扫描的操作台结构。",
      best: "数据工作台",
      risk: "装饰型排版容易掩盖指标优先级。",
    },
    {
      id: "course",
      name: "学习路径",
      en: "Course",
      desc: "课程章节、练习、进度、提交和反馈，需要路径感、完成感和下一步动作。",
      best: "学习路径",
      risk: "纯图集风会让任务顺序变模糊。",
    },
    {
      id: "case",
      name: "案例拆解",
      en: "Case Study",
      desc: "设计过程、问题分析、参考图和结论，需要故事线与证据材料并排出现。",
      best: "专题编排",
      risk: "纯表格结构会损失叙事节奏。",
    },
    {
      id: "checklist",
      name: "训练清单",
      en: "Checklist",
      desc: "任务、规则、完成状态、复盘问题，需要极强的扫描和执行效率。",
      best: "知识图谱",
      risk: "大幅视觉展示会降低执行密度。",
    },
    {
      id: "reference",
      name: "参考文档",
      en: "Reference",
      desc: "规则、术语、链接和说明集合，需要稳定索引、局部跳转和可复制的信息块。",
      best: "文档工作区",
      risk: "强叙事风格会降低查询效率。",
    },
    {
      id: "component-library",
      name: "组件库",
      en: "Component Library",
      desc: "组件状态、属性、示例和使用限制，需要密集但明确的分类和状态对比。",
      best: "知识图谱",
      risk: "沉浸式故事会遮挡可操作信息。",
    },
    {
      id: "template-library",
      name: "模板库",
      en: "Template Library",
      desc: "可复用模板、场景、结构和复制入口，需要快速筛选与差异判断。",
      best: "实验控制台",
      risk: "长文阅读结构会让选择成本变高。",
    },
  ];

  const styleModels = [
    {
      id: "catalog",
      name: "图录档案",
      tone: "纸张收藏",
      layout: "顶栏 / 大标题 / 章节分隔 / 编号列表 / 估值标记",
      suited: "灵感图录、资源收藏、案例索引、设计参考清单",
      avoid: "高频表单、复杂数据操作、需要沉浸预览的单作品页",
      why: "用编号、章节和强分隔线制造翻阅感，适合把外部灵感整理成可复盘的收藏目录。",
    },
    {
      id: "editorial",
      name: "杂志阅读",
      tone: "杂志阅读",
      layout: "masthead / 多栏正文 / 跨栏引语 / 编号列表",
      suited: "文稿、案例、观点、训练复盘",
      avoid: "高频操作、密集指标、图片瀑布流",
      why: "把内容组织成可阅读的版面，适合观点和叙事。",
    },
    {
      id: "risograph",
      name: "孔版拼贴",
      tone: "印刷拼贴",
      layout: "套印色块 / 粗描边容器 / 偏移阴影 / 手作节奏",
      suited: "训练笔记、轻量复盘、带情绪的课程阅读",
      avoid: "严肃指标、复杂工具、可访问性要求很高的正文",
      why: "给训练文档增加记忆点，但适合做视觉变体而不是通用结构。",
    },
    {
      id: "moodboard",
      name: "灵感墙",
      tone: "灵感墙",
      layout: "瀑布流 / 大图优先 / 轻标签 / 快速收藏",
      suited: "灵感库、视觉参考、作品截图",
      avoid: "严肃长文、复杂表单、强流程任务",
      why: "让图像成为第一信息，适合快速比较灵感。",
    },
    {
      id: "console",
      name: "实验控制台",
      tone: "实验控制台",
      layout: "左侧 rail / 状态数字 / 模块卡 / mono 元信息",
      suited: "动效实验、开发工具、实验模块",
      avoid: "品牌展示、情绪化内容、纯阅读文章",
      why: "把状态、模块和实现信息放在同一操作台里。",
    },
    {
      id: "dashboard",
      name: "数据工作台",
      tone: "数据工作台",
      layout: "指标条 / 图表区 / 表格 / 筛选工具栏",
      suited: "进度、分析、运营、项目状态",
      avoid: "作品氛围展示、杂志式故事",
      why: "适合用指标、图表和筛选支持判断。",
    },
    {
      id: "atlas",
      name: "知识图谱",
      tone: "知识图谱",
      layout: "分类索引 / 卡片矩阵 / 对比表 / 关系标记",
      suited: "知识库、风格模型、组件集合、清单",
      avoid: "沉浸式单主题叙事",
      why: "适合分类、对比和建立知识关系。",
    },
    {
      id: "learning",
      name: "学习路径",
      tone: "课程路径",
      layout: "路径进度 / 章节卡 / 作业入口 / 反馈区",
      suited: "课程、训练营、练习计划",
      avoid: "无顺序的灵感集合",
      why: "适合表达顺序、进度和下一步任务。",
    },
    {
      id: "magazine",
      name: "专题编排",
      tone: "专题编排",
      layout: "大中小图混排 / 专题标题 / 证据栏 / 节奏分区",
      suited: "案例拆解、趋势报告、灵感精选",
      avoid: "强事务处理、密集表单",
      why: "适合用版面节奏包装案例和证据。",
    },
    {
      id: "terminal",
      name: "命令行文档",
      tone: "命令行文档",
      layout: "titlebar / 文件树 / 命令输出 / 状态行",
      suited: "技术笔记、任务日志、调试流程",
      avoid: "图片展示、消费级活动页",
      why: "适合技术语境和过程记录。",
    },
    {
      id: "showcase",
      name: "重点展示",
      tone: "重点展示",
      layout: "大预览 / 少量元信息 / 单模块聚焦 / 展示切换",
      suited: "完成模块、动效成果、单案例预览",
      avoid: "批量筛选、长列表、流程表单",
      why: "适合突出单个成果，但不适合作为默认管理视图。",
    },
    {
      id: "notion",
      name: "文档工作区",
      tone: "文档工作区",
      layout: "目录 / block / callout / 轻量数据库",
      suited: "参考资料、规则文档、知识整理",
      avoid: "视觉情绪页、强品牌落地页",
      why: "适合查阅和持续维护，弱化装饰，强化结构。",
    },
  ];

  const fit = {
    article: { editorial: 5, catalog: 3, risograph: 4, terminal: 4, notion: 4, atlas: 3, learning: 3, magazine: 4, dashboard: 2, console: 2, moodboard: 1, showcase: 2 },
    gallery: { catalog: 5, moodboard: 5, magazine: 4, atlas: 4, showcase: 3, editorial: 2, console: 2, dashboard: 2, learning: 1, terminal: 1, risograph: 2, notion: 2 },
    lab: { console: 5, dashboard: 4, atlas: 4, terminal: 3, showcase: 4, catalog: 2, magazine: 2, editorial: 2, learning: 2, moodboard: 2, risograph: 1, notion: 2 },
    atlas: { atlas: 5, dashboard: 4, catalog: 4, console: 3, notion: 4, terminal: 3, editorial: 3, magazine: 2, learning: 2, moodboard: 1, risograph: 2, showcase: 2 },
    dashboard: { dashboard: 5, console: 4, atlas: 3, terminal: 3, learning: 2, catalog: 1, editorial: 1, magazine: 1, moodboard: 1, risograph: 1, notion: 2, showcase: 2 },
    course: { learning: 5, atlas: 4, dashboard: 3, catalog: 3, editorial: 3, risograph: 3, notion: 3, console: 2, magazine: 2, moodboard: 1, terminal: 1, showcase: 2 },
    case: { magazine: 5, editorial: 4, moodboard: 4, catalog: 4, atlas: 3, showcase: 3, console: 2, dashboard: 2, learning: 2, terminal: 1, risograph: 3, notion: 2 },
    checklist: { atlas: 5, catalog: 4, dashboard: 4, terminal: 4, console: 3, learning: 3, notion: 3, editorial: 2, magazine: 1, moodboard: 1, risograph: 2, showcase: 1 },
    reference: { notion: 5, atlas: 4, catalog: 4, terminal: 4, editorial: 3, dashboard: 2, console: 2, learning: 2, risograph: 2, magazine: 1, moodboard: 1, showcase: 1 },
    "component-library": { atlas: 5, dashboard: 4, console: 4, catalog: 3, terminal: 3, notion: 3, learning: 2, editorial: 1, magazine: 1, moodboard: 1, risograph: 1, showcase: 2 },
    "template-library": { console: 5, atlas: 4, dashboard: 4, catalog: 4, terminal: 3, notion: 3, magazine: 2, editorial: 2, learning: 2, moodboard: 2, risograph: 1, showcase: 3 },
  };

  const pageContentMap = {
    home: ["gallery"],
    inspo: ["gallery"],
    viewer: ["article", "course"],
    "motion-lab": ["lab"],
    "style-atlas": ["atlas"],
    docs: ["article", "reference"],
    ui: ["component-library"],
    templates: ["template-library"],
  };

  const viewerStyleMap = {
    editorial: "editorial",
    terminal: "terminal",
    motion: "console",
    risograph: "risograph",
  };

  function getContentType(id) {
    return contentTypes.find((item) => item.id === id);
  }

  function getStyleModel(id) {
    return styleModels.find((item) => item.id === id);
  }

  function getScore(contentId, styleId) {
    return fit[contentId]?.[styleId] || 1;
  }

  function scoreLabel(score) {
    if (score >= 5) return "推荐";
    if (score >= 4) return "适合";
    if (score >= 3) return "可试";
    if (score >= 2) return "实验";
    return "谨慎";
  }

  function scoreGroup(score) {
    if (score >= 4) return "recommended";
    if (score >= 2) return "experimental";
    return "risky";
  }

  function getStylesForContent(contentId, allowedIds) {
    const allowed = allowedIds?.length ? allowedIds : styleModels.map((style) => style.id);
    return allowed
      .map((id) => {
        const style = getStyleModel(id);
        if (!style) return null;
        const score = getScore(contentId, id);
        return { ...style, score, label: scoreLabel(score), group: scoreGroup(score) };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  }

  function getPageContentTypes(page) {
    return (pageContentMap[page] || ["article"]).map(getContentType).filter(Boolean);
  }

  function renderStyleJudgmentStrip(target, options = {}) {
    const root = typeof target === "string" ? document.querySelector(target) : target;
    if (!root) return;

    const page = options.page || document.body.dataset.page || "viewer";
    const contentId = options.contentId || pageContentMap[page]?.[0] || "article";
    const content = getContentType(contentId);
    const styles = getStylesForContent(contentId, options.allowedStyleIds);
    const activeStyle = options.activeStyle || styles[0]?.id;
    const grouped = ["recommended", "experimental", "risky"]
      .map((group) => ({
        group,
        title: group === "recommended" ? "推荐" : group === "experimental" ? "可实验" : "谨慎",
        items: styles.filter((style) => style.group === group),
      }))
      .filter((bucket) => bucket.items.length);

    root.classList.add("style-judgment");
    root.innerHTML = `
      <div class="style-judgment-main">
        <span class="style-judgment-kicker">内容类型</span>
        <strong>${content?.name || contentId}</strong>
        <p>${content?.desc || ""}</p>
      </div>
      <div class="style-judgment-groups">
        ${grouped.map((bucket) => `
          <section class="style-judgment-group" data-group="${bucket.group}">
            <h2>${bucket.title}</h2>
            <div class="style-judgment-options">
              ${bucket.items.map((style) => `
                <button class="style-judgment-option${style.id === activeStyle ? " is-active" : ""}" type="button" data-style-model="${style.id}">
                  <span>${style.label} · ${style.score}.0</span>
                  <strong>${style.name}</strong>
                  <em>${style.why}</em>
                </button>
              `).join("")}
            </div>
          </section>
        `).join("")}
      </div>
    `;

    root.querySelectorAll("[data-style-model]").forEach((button) => {
      button.addEventListener("click", () => {
        options.onSelect?.(button.dataset.styleModel);
      });
    });
  }

  window.StyleRegistry = {
    contentTypes,
    styleModels,
    fit,
    pageContentMap,
    viewerStyleMap,
    getContentType,
    getStyleModel,
    getScore,
    scoreLabel,
    scoreGroup,
    getStylesForContent,
    getPageContentTypes,
    renderStyleJudgmentStrip,
  };
})();
