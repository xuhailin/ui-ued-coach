(function () {
  const SCENARIOS = [
    { id: "all", label: "全部" },
    { id: "brand", label: "品牌标题" },
    { id: "web", label: "网页界面" },
    { id: "poster", label: "海报封面" },
    { id: "editorial", label: "杂志编辑" },
    { id: "product", label: "产品 UI" },
    { id: "mono", label: "技术/数据" },
    { id: "playful", label: "趣味活动" },
  ];

  const FALLBACKS = {
    sans: '"Space Grotesk", "Noto Sans SC", sans-serif',
    serif: '"Instrument Serif", "Noto Serif SC", serif',
    mono: '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace',
    condensed: '"Archivo Narrow", "Noto Sans SC", sans-serif',
    decorative: '"Instrument Serif", "Noto Serif SC", serif',
  };

  const FONTS = [
    {
      name: "Geist by Vercel",
      kind: "sans",
      family: "Geist, Space Grotesk, Noto Sans SC, sans-serif",
      weight: 600,
      tags: ["web", "product", "brand"],
      source: "https://vercel.com/font#get",
      awwwards: "https://www.awwwards.com/inspiration/geist-by-vercel",
      image: "https://assets.awwwards.com/awards/element/2024/06/666ac01de80e6356323247.jpg",
      uses: ["SaaS 官网、开发者工具、AI 产品中大标题", "产品 UI 的导航、按钮、空状态与数据标签", "需要理性、现代、技术可信感的品牌系统"],
      risk: "气质克制，做强情绪活动页时容易显得过于工具化。",
      license: "来源为 Vercel 字体页，落地前确认最新开源许可。",
    },
    {
      name: "Satoshi Variable Font",
      kind: "sans",
      family: "Satoshi, Space Grotesk, Noto Sans SC, sans-serif",
      weight: 700,
      tags: ["web", "product", "brand"],
      source: "https://www.fontshare.com/fonts/satoshi",
      awwwards: "https://www.awwwards.com/inspiration/satoshi-variable-font",
      image: "https://assets.awwwards.com/awards/element/2022/07/62cc4440c6143735429115.jpg",
      uses: ["创业公司品牌页、作品集标题、产品官网", "仪表盘和 B 端界面的一级标题", "与 serif 搭配做现代编辑感"],
      risk: "非常通用，若缺少图像或版面节奏，容易变成默认 SaaS 气质。",
      license: "Awwwards 标注 Fontshare 字体可个人和商用。",
    },
    {
      name: "Clash Display Variable Font",
      kind: "sans",
      family: "Clash Display, Space Grotesk, Noto Sans SC, sans-serif",
      weight: 700,
      tags: ["brand", "poster", "web"],
      source: "https://www.fontshare.com/fonts/clash-display",
      awwwards: "https://www.awwwards.com/inspiration/clash-display",
      image: "https://assets.awwwards.com/awards/element/2022/07/62cc410ae48ab896699490.jpg",
      uses: ["品牌首屏大标题、作品集封面、视觉实验页", "活动海报和发布页的核心口号", "需要几何感但不想太冷的 display 标题"],
      risk: "小字号阅读不稳定，正文和复杂表单不建议使用。",
      license: "Awwwards 标注 Fontshare 字体可个人和商用。",
    },
    {
      name: "Cabinet Grotesk Variable Font",
      kind: "sans",
      family: "Cabinet Grotesk, Space Grotesk, Noto Sans SC, sans-serif",
      weight: 700,
      tags: ["brand", "web", "product"],
      source: "https://www.fontshare.com/fonts/cabinet-grotesk",
      awwwards: "https://www.awwwards.com/inspiration/cabinet-grotesk-variable-font",
      image: "https://assets.awwwards.com/awards/element/2022/07/62cc58e02925b705613666.jpg",
      uses: ["设计机构官网、创意工具、作品集导航", "卡片标题、功能区标题和导览标签", "希望有一点人格但仍保持清晰的品牌 UI"],
      risk: "字面较宽，移动端大标题需要控制行长。",
      license: "Awwwards 标注 Fontshare 字体可个人和商用。",
    },
    {
      name: "Chillax",
      kind: "sans",
      family: "Chillax, Space Grotesk, Noto Sans SC, sans-serif",
      weight: 600,
      tags: ["brand", "web", "playful"],
      source: "https://www.fontshare.com/fonts/chillax",
      awwwards: "https://www.awwwards.com/inspiration/chillax",
      image: "https://assets.awwwards.com/awards/element/2022/07/62cd2579be61b811446441.jpg",
      uses: ["生活方式品牌、年轻化产品、轻松的 landing page", "温和友好的标题和导航", "与高对比 serif 搭配，做轻奢但不严肃的版面"],
      risk: "过于圆润的语气不适合金融、法律、严肃企业工具。",
      license: "Awwwards 标注 Fontshare 字体可个人和商用。",
    },
    {
      name: "Ranade",
      kind: "sans",
      family: "Ranade, Space Grotesk, Noto Sans SC, sans-serif",
      weight: 500,
      tags: ["product", "web", "editorial"],
      source: "https://www.fontshare.com/fonts/ranade",
      awwwards: "https://www.awwwards.com/inspiration/ranade",
      image: "https://assets.awwwards.com/awards/element/2022/07/62cc57d252210232308073.jpg",
      uses: ["知识库、文档页、阅读型产品界面", "正文、说明文字、表单 label 与二级导航", "需要安静、清晰、长期阅读的系统"],
      risk: "做大字视觉冲击时存在感不够，需要版面或图片补强。",
      license: "Awwwards 标注 Fontshare 字体可个人和商用。",
    },
    {
      name: "Galgo Condensed",
      kind: "condensed",
      family: "Archivo Narrow, Space Grotesk, Noto Sans SC, sans-serif",
      weight: 700,
      tags: ["poster", "brand", "editorial"],
      source: "https://www.giuliaboggio.xyz/fonts/galgo-condensed",
      awwwards: "https://www.awwwards.com/inspiration/galgo-condensed",
      image: "https://assets.awwwards.com/awards/element/2024/06/666ab60e306ed872843610.jpg",
      uses: ["窄幅大标题、展览海报、社交媒体封面", "需要节省横向空间的 editorial 标题", "与宽松正文形成强烈层级对比"],
      risk: "长句和小字号会压缩阅读舒适度，慎用于正文。",
      license: "原页面未给明确授权摘要，需回源确认。",
    },
    {
      name: "NOHEMI Typeface",
      kind: "sans",
      family: "Space Grotesk, Noto Sans SC, sans-serif",
      weight: 700,
      tags: ["brand", "web", "poster"],
      source: "https://www.behance.net/gallery/168183377/NOHEMI-Typeface-Free-Variable-9-Styles",
      awwwards: "https://www.awwwards.com/inspiration/nohemi-typeface",
      image: "https://assets.awwwards.com/awards/element/2024/06/666ac59cee56d767069712.jpg",
      uses: ["新锐品牌识别、科技活动页、视觉专题标题", "大字号英文 slogan", "与中性 sans 正文配对做强个性首屏"],
      risk: "个性在标题层已经很强，界面正文中应降低使用比例。",
      license: "Behance 来源，需检查作者发布页的最新许可。",
    },
    {
      name: "PP Mori",
      kind: "sans",
      family: "Space Grotesk, Noto Sans SC, sans-serif",
      weight: 600,
      tags: ["brand", "web", "editorial"],
      source: "https://pangrampangram.com/products/mori",
      awwwards: "https://www.awwwards.com/inspiration/pp-mori",
      image: "https://assets.awwwards.com/awards/element/2022/07/62c75b552bd15329776065.jpg",
      uses: ["高级感产品官网、艺术机构、设计工作室", "标题和短段落混排", "需要干净但有微妙曲线变化的品牌系统"],
      risk: "Awwwards 标注为 trial 取向，商业项目尤其要确认授权。",
      license: "Awwwards 标注 free trial，偏个人项目、作品集、提案等场景。",
    },
    {
      name: "Bigilla Display Serif",
      kind: "serif",
      family: "Instrument Serif, Noto Serif SC, serif",
      weight: 400,
      tags: ["editorial", "poster", "brand"],
      source: "https://www.pixelsurplus.com/freebies/bigilla-free-display-serif-typeface",
      awwwards: "https://www.awwwards.com/inspiration/bigilla-display-serif-typeface",
      image: "https://assets.awwwards.com/awards/external/2021/02/602b9570b2f56460197730.jpg",
      uses: ["时尚、美妆、艺术展览的首屏标题", "杂志封面、人物访谈、编辑专题", "与几何 sans 组合做高反差层级"],
      risk: "高对比细节在小字号会脆弱，不适合表格和密集正文。",
      license: "来源为 Pixel Surplus，需回源确认下载包许可。",
    },
    {
      name: "Cotta Elegant Serif",
      kind: "serif",
      family: "Instrument Serif, Noto Serif SC, serif",
      weight: 400,
      tags: ["editorial", "brand", "poster"],
      source: "https://www.behance.net/gallery/144181203/Cotta-Free-Elegant-Serif-Font",
      awwwards: "https://www.awwwards.com/inspiration/cotta-free-elegant-serif-font",
      image: "https://assets.awwwards.com/awards/element/2022/07/62cd22960d9af951340738.jpg",
      uses: ["婚礼、香氛、精品酒店、美学类品牌", "低字数标题、引用语、封面字样", "需要优雅曲线和轻奢气质的版面"],
      risk: "Awwwards 标注个人使用，商用前不可直接采用。",
      license: "Awwwards 标注 free for personal use。",
    },
    {
      name: "Branch Modern Ligature",
      kind: "serif",
      family: "Instrument Serif, Noto Serif SC, serif",
      weight: 400,
      tags: ["brand", "editorial", "poster"],
      source: "https://www.behance.net/gallery/147598345/Branch-Modern-Ligature-Serif-FREE",
      awwwards: "https://www.awwwards.com/inspiration/branch-modern-ligature",
      image: "https://assets.awwwards.com/awards/element/2022/07/62c765d693d64507491030.jpg",
      uses: ["logo 草案、品牌标题、单词型海报", "强调 ligature 的英文品牌名展示", "餐饮、花艺、精品零售的视觉识别"],
      risk: "连字会影响可读性，不适合按钮、表单和多语言长文本。",
      license: "Awwwards 标注 free for personal use。",
    },
    {
      name: "Mango Grotesque Variable",
      kind: "condensed",
      family: "Archivo Narrow, Space Grotesk, Noto Sans SC, sans-serif",
      weight: 700,
      tags: ["poster", "brand", "web"],
      source: "https://rajputrajesh-448.gumroad.com/l/MangoGrotesque",
      awwwards: "https://www.awwwards.com/inspiration/mango-grotesque-variable-font",
      image: "https://assets.awwwards.com/awards/element/2022/07/62cfe0476d342787925507.jpg",
      uses: ["音乐、体育、潮流品牌的大字号标题", "超窄版面里的强冲击数字和栏目名", "滚动叙事页的章节标题"],
      risk: "横向压缩强，正文和中文混排时需要另配稳定字体。",
      license: "Gumroad 来源，需回源确认许可。",
    },
    {
      name: "Humane",
      kind: "condensed",
      family: "Archivo Narrow, Space Grotesk, Noto Sans SC, sans-serif",
      weight: 700,
      tags: ["poster", "brand"],
      source: "https://rajputrajesh-448.gumroad.com/l/HUMANE",
      awwwards: "https://www.awwwards.com/inspiration/humane",
      image: "https://assets.awwwards.com/awards/element/2022/07/62cfdeeb30c19642978573.jpg",
      uses: ["竖向海报、超大首屏、栏目封面", "短词、年份、编号、活动口号", "与留白和大图搭配制造强烈编辑感"],
      risk: "只适合非常短的文案，不要承担说明和导航。",
      license: "Gumroad 来源，需回源确认许可。",
    },
    {
      name: "Avenue Mono",
      kind: "mono",
      family: "JetBrains Mono, ui-monospace, Menlo, Consolas, monospace",
      weight: 600,
      tags: ["mono", "product", "web"],
      source: "https://boulevardlab.com/Avenue-Mono",
      awwwards: "https://www.awwwards.com/inspiration/avenue-mono",
      image: "https://assets.awwwards.com/awards/element/2022/07/62c75d3986e55570580255.jpg",
      uses: ["代码产品、数据看板、版本号、状态标签", "技术品牌的辅助标题和 metadata", "与 display serif 搭配做编辑化技术感"],
      risk: "整页使用会显得紧张，中文段落尤其不适合。",
      license: "Awwwards 标注 trial license。",
    },
    {
      name: "Disket Mono",
      kind: "mono",
      family: "JetBrains Mono, ui-monospace, Menlo, Consolas, monospace",
      weight: 700,
      tags: ["mono", "poster", "playful"],
      source: "http://rostype.com/disket/",
      awwwards: "https://www.awwwards.com/inspiration/disket-mono-display-monospaced-grid-based-typeface",
      image: "https://assets.awwwards.com/awards/external/2021/05/60ae094133979532706956.jpg",
      uses: ["复古科技海报、像素风活动、游戏标题", "编号系统、徽章、实验室栏目名", "需要网格感和机械感的视觉元素"],
      risk: "识别性强但阅读弱，不要用于正文或复杂 UI。",
      license: "原页面未给明确授权摘要，需回源确认。",
    },
    {
      name: "OffBit",
      kind: "decorative",
      family: "JetBrains Mono, ui-monospace, Menlo, Consolas, monospace",
      weight: 700,
      tags: ["poster", "playful", "mono"],
      source: "https://power-type.com/offbit/",
      awwwards: "https://www.awwwards.com/inspiration/offbit-free-font",
      image: "https://assets.awwwards.com/awards/element/2022/10/634005b55498b999358709.jpg",
      uses: ["像素风海报、电子音乐、实验网页标题", "小面积徽章、loading 状态、游戏 UI 装饰", "给严肃工具页增加少量反差记忆点"],
      risk: "装饰性很强，超过 1-2 个层级会干扰阅读。",
      license: "原页面未给明确授权摘要，需回源确认。",
    },
    {
      name: "Dirtyline 36Daysoftype",
      kind: "decorative",
      family: "Instrument Serif, Noto Serif SC, serif",
      weight: 700,
      tags: ["poster", "playful", "brand"],
      source: "https://dirtylinestudio.com/product/dirtyline-36daysoftype-2022/",
      awwwards: "https://www.awwwards.com/inspiration/dirtyline-36daysoftype-2022",
      image: "https://assets.awwwards.com/awards/element/2022/07/62c56430515d3949380759.jpg",
      uses: ["实验字母海报、潮流视觉、标题字样", "单个大字母作为图形资产", "品牌活动中的视觉记号而非正文"],
      risk: "更像图形字体，不能替代标准标题体系。",
      license: "Awwwards 标注 Desktop/Web license，commercial use allowed。",
    },
    {
      name: "Black Sansa Thin",
      kind: "decorative",
      family: "Instrument Serif, Noto Serif SC, serif",
      weight: 400,
      tags: ["poster", "editorial", "brand"],
      source: "https://www.behance.net/gallery/144906155/Black-Sansa-Thin-Free-Retro-Display-Font",
      awwwards: "https://www.awwwards.com/inspiration/black-sansa-thin-free-retro-display-font",
      image: "https://assets.awwwards.com/awards/element/2022/07/62cd1efce6318923190630.jpg",
      uses: ["复古封面、影像栏目、艺术活动标题", "高留白海报中的细线大字", "需要怀旧但不脏乱的 editorial 排版"],
      risk: "细线字重在低对比背景上容易丢失，移动端需加大字号。",
      license: "Awwwards 标注 free for personal and commercial use。",
    },
    {
      name: "Vercetti Regular",
      kind: "sans",
      family: "Space Grotesk, Noto Sans SC, sans-serif",
      weight: 500,
      tags: ["product", "web", "editorial"],
      source: "https://filipposfragkogiannis.com/fonts/vercetti-regular/",
      awwwards: "https://www.awwwards.com/inspiration/vercetti-regular-font",
      image: "https://assets.awwwards.com/awards/element/2022/09/632c2c80e0848063616350.jpg",
      uses: ["文化机构、设计系统、低调产品界面", "正文、导航、短标题都可承担", "适合需要国际化中性气质的网页"],
      risk: "个性不抢眼，大型 campaign 需要搭配更强 display 字体。",
      license: "原页面未给明确授权摘要，需回源确认。",
    },
    {
      name: "HK Grotesk Wide",
      kind: "sans",
      family: "Space Grotesk, Noto Sans SC, sans-serif",
      weight: 700,
      tags: ["brand", "product", "web"],
      source: "https://hanken.co/collections/free/products/hk-grotesk-wide",
      awwwards: "https://www.awwwards.com/inspiration/hk-grotesk-wide",
      image: "https://assets.awwwards.com/awards/element/2022/11/637e1ed2a8f37274403583.jpg",
      uses: ["科技品牌、硬件官网、宽屏首屏标题", "产品模块标题、导航和参数标签", "需要结实、宽阔、可信的视觉基调"],
      risk: "宽体消耗空间，移动端标题要减少字数。",
      license: "Hanken 来源，需回源确认许可。",
    },
    {
      name: "Archivo Narrow Regular",
      kind: "condensed",
      family: "Archivo Narrow, Noto Sans SC, sans-serif",
      weight: 600,
      tags: ["product", "web", "mono"],
      source: "https://open-foundry.com/fonts/archivo_narrow_regular",
      awwwards: "https://www.awwwards.com/inspiration/archivo-narrow-regular-free-font",
      image: "https://assets.awwwards.com/awards/external/2021/07/60f02b2ed700a517818276.jpg",
      uses: ["表格密集界面、新闻列表、数据标签", "窄栏说明、索引、目录和工具栏文字", "与宽体 display 标题形成节奏差"],
      risk: "不要把窄体当作主要长文正文字体。",
      license: "Open Foundry 来源，需回源确认许可。",
    },
    {
      name: "Migha",
      kind: "serif",
      family: "Instrument Serif, Noto Serif SC, serif",
      weight: 400,
      tags: ["poster", "editorial", "brand"],
      source: "https://themeui.net/migha-free-variable-font/",
      awwwards: "https://www.awwwards.com/inspiration/migha-free-font",
      image: "https://assets.awwwards.com/awards/external/2021/05/60ae189b8979e843629269.jpg",
      uses: ["高级感封面、时装 lookbook、品牌专题", "大字号英文标题与短引语", "需要优雅但带一点实验感的版面"],
      risk: "强 contrast 风格不适合密集产品 UI。",
      license: "Theme UI 来源，需回源确认许可。",
    },
    {
      name: "Newake",
      kind: "sans",
      family: "Space Grotesk, Noto Sans SC, sans-serif",
      weight: 700,
      tags: ["poster", "brand", "web"],
      source: "https://www.behance.net/gallery/118133975/Newake-Free-Font",
      awwwards: "https://www.awwwards.com/inspiration/newake-sans-serif-font",
      image: "https://assets.awwwards.com/awards/external/2021/07/60ed3cdb0993b698637755.jpg",
      uses: ["大胆品牌标题、活动海报、创意机构首页", "短促有力的英文 slogan", "需要厚重但不粗糙的 sans display"],
      risk: "字重和个性较强，正文、按钮和说明文字应另配 UI 字体。",
      license: "Behance 来源，需检查作者发布页许可。",
    },
    {
      name: "Neutral Face",
      kind: "sans",
      family: "Space Grotesk, Noto Sans SC, sans-serif",
      weight: 500,
      tags: ["product", "web", "brand"],
      source: "https://themeui.net/neutral-face-free-font/",
      awwwards: "https://www.awwwards.com/inspiration/neutral-face-sans-serif-free-font",
      image: "https://assets.awwwards.com/awards/external/2021/05/60ae0b70a08b6322815250.jpg",
      uses: ["极简作品集、建筑/室内设计官网、产品 UI", "需要中性、留白、冷静语气的标题", "与图片主导页面搭配，字体不抢画面"],
      risk: "过于中性时需要通过间距、图片和动效建立记忆点。",
      license: "Theme UI 来源，需回源确认许可。",
    },
    {
      name: "Intro Script",
      kind: "decorative",
      family: "Instrument Serif, Noto Serif SC, serif",
      weight: 400,
      tags: ["brand", "poster", "playful"],
      source: "https://www.fontfabric.com/fonts/intro-script/",
      awwwards: "https://www.awwwards.com/inspiration/intro-script-font",
      image: "https://assets.awwwards.com/awards/external/2021/05/60ae08883b49a500259742.jpg",
      uses: ["食品、节日、手作品牌的少量标题", "包装标签、签名字样、促销视觉", "搭配稳重 sans，负责情绪而非信息"],
      risk: "script 字体不适合全大段阅读，也不适合严肃 B 端界面。",
      license: "Fontfabric 来源，需回源确认许可。",
    },
    {
      name: "Comic Cat",
      kind: "decorative",
      family: "Space Grotesk, Noto Sans SC, sans-serif",
      weight: 700,
      tags: ["playful", "poster"],
      source: "https://www.behance.net/gallery/119157709/Comic-CAT-Free-Font-Cyrillic-and-Latin",
      awwwards: "https://www.awwwards.com/inspiration/comic-cat",
      image: "https://assets.awwwards.com/awards/element/2022/07/62cc9f29a63a9390532997.jpg",
      uses: ["儿童活动、漫画风页面、轻松的社交媒体封面", "小面积标签、贴纸式标题、趣味徽章", "需要主动显得不严肃的活动视觉"],
      risk: "不适合企业、金融、专业工具和长文阅读。",
      license: "Behance 来源，需检查作者发布页许可。",
    },
    {
      name: "Thunder Typeface",
      kind: "condensed",
      family: "Archivo Narrow, Space Grotesk, Noto Sans SC, sans-serif",
      weight: 700,
      tags: ["poster", "brand"],
      source: "https://www.behance.net/gallery/124582465/THUNDER-Free-Typeface-Variable-36-Styles",
      awwwards: "https://www.awwwards.com/inspiration/thunder-typeface",
      image: "https://assets.awwwards.com/awards/external/2021/08/61122282c32fa444131991.jpg",
      uses: ["体育、音乐、发布会的大标题", "超大数字、倒计时、章节编号", "需要高压缩高冲击的视觉系统"],
      risk: "中文混排和小字号需要谨慎，最好只做 display 层。",
      license: "Behance 来源，需检查作者发布页许可。",
    },
    {
      name: "Heming Variable Mono",
      kind: "mono",
      family: "JetBrains Mono, ui-monospace, Menlo, Consolas, monospace",
      weight: 600,
      tags: ["mono", "product", "web"],
      source: "https://pixelsurplus.com/products/heming-free-variable-font",
      awwwards: "https://www.awwwards.com/inspiration/heming-a-free-variable-monotype-font",
      image: "https://assets.awwwards.com/awards/element/2022/07/62cfe6a1d4abc386690776.jpg",
      uses: ["技术文档、代码片段、开发工具 landing page", "状态行、版本号、命令提示和数据表", "与中性 sans 正文搭配做工程气质"],
      risk: "整页 mono 容易显得硬，注意留白和行高。",
      license: "Awwwards 标注 free for personal & commercial use。",
    },
    {
      name: "Tropikal Typeface",
      kind: "serif",
      family: "Instrument Serif, Noto Serif SC, serif",
      weight: 400,
      tags: ["editorial", "brand", "poster"],
      source: "https://www.gabreyes.com/daily-posts/tropikal-typeface",
      awwwards: "https://www.awwwards.com/inspiration/tropikal-typeface-font",
      image: "https://assets.awwwards.com/awards/external/2020/10/5f96aa9e4bb97998197881.jpg",
      uses: ["旅行、美食、文化杂志与品牌故事页", "复古热带气质的标题和引用", "搭配低饱和图片做 editorial 风格"],
      risk: "情绪鲜明，通用产品 UI 中会显得不合语境。",
      license: "作者站来源，需回源确认许可。",
    },
    {
      name: "Casta",
      kind: "serif",
      family: "Instrument Serif, Noto Serif SC, serif",
      weight: 400,
      tags: ["brand", "editorial", "poster"],
      source: "https://dirtylinestudio.com/product/casta-free-font/",
      awwwards: "https://www.awwwards.com/inspiration/casta-font",
      image: "https://assets.awwwards.com/awards/external/2020/06/5ee8d474a92a7240937010.jpg",
      uses: ["高端品牌标题、文化展览、长图封面", "短标题和 logo 方向探索", "与极简网格搭配做克制奢华"],
      risk: "不要在按钮、菜单、正文里大量使用。",
      license: "Dirtyline 来源，需回源确认许可。",
    },
  ];

  const state = {
    activeTag: "all",
    query: "",
    previewText: "Shape the interface before it speaks.",
    size: 72,
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    renderFilters();
    bindControls();
    renderFonts();
  }

  function renderFilters() {
    const filters = document.querySelector("#font-filters");
    filters.innerHTML = SCENARIOS.map((item) => {
      return `<button type="button" data-tag="${item.id}" class="${item.id === state.activeTag ? "is-active" : ""}">${item.label}</button>`;
    }).join("");
    filters.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-tag]");
      if (!button) return;
      state.activeTag = button.dataset.tag;
      filters.querySelectorAll("button").forEach((item) => item.classList.toggle("is-active", item === button));
      renderFonts();
    });
  }

  function bindControls() {
    const search = document.querySelector("#font-search");
    const preview = document.querySelector("#font-preview-text");
    const size = document.querySelector("#font-size");

    search.addEventListener("input", () => {
      state.query = search.value.trim().toLowerCase();
      renderFonts();
    });

    preview.addEventListener("input", () => {
      state.previewText = preview.value || "Shape the interface before it speaks.";
      document.querySelectorAll(".font-specimen").forEach((item) => {
        item.textContent = state.previewText;
      });
    });

    size.addEventListener("input", () => {
      state.size = Number(size.value);
      document.documentElement.style.setProperty("--preview-size", `${state.size}px`);
    });

    document.documentElement.style.setProperty("--preview-size", `${state.size}px`);
  }

  function renderFonts() {
    const grid = document.querySelector("#font-grid");
    const template = document.querySelector("#font-card-template");
    const visible = FONTS.filter(matchesState);
    grid.innerHTML = "";

    document.querySelector("#font-total").textContent = FONTS.length;
    document.querySelector("#font-visible").textContent = visible.length;

    if (!visible.length) {
      grid.innerHTML = '<div class="font-empty">没有找到匹配的字体，换个关键词或场景试试。</div>';
      return;
    }

    visible.forEach((font, index) => {
      const card = template.content.firstElementChild.cloneNode(true);
      card.dataset.kind = font.kind;
      card.style.setProperty("--preview-family", font.family || FALLBACKS[font.kind] || FALLBACKS.sans);
      card.style.setProperty("--preview-weight", font.weight || 600);
      card.querySelector(".font-index").textContent = String(index + 1).padStart(2, "0");
      card.querySelector("h3").textContent = font.name;
      card.querySelector(".font-kind").textContent = kindLabel(font.kind);
      card.querySelector(".font-specimen").textContent = state.previewText;
      card.querySelector(".font-source-image img").src = font.image;
      card.querySelector(".font-source-image img").alt = `${font.name} 官方样张`;
      card.querySelector(".font-use-list").innerHTML = font.uses.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
      card.querySelector(".font-risk").textContent = `慎用：${font.risk}`;
      card.querySelector(".font-license").textContent = font.license;
      card.querySelector(".font-source-link").href = font.source;
      card.querySelector(".font-awwwards-link").href = font.awwwards;
      grid.appendChild(card);
    });
  }

  function matchesState(font) {
    const inTag = state.activeTag === "all" || font.tags.includes(state.activeTag);
    if (!inTag) return false;
    if (!state.query) return true;
    const haystack = [font.name, font.kind, font.source, font.uses.join(" "), font.risk, font.license, font.tags.join(" ")]
      .join(" ")
      .toLowerCase();
    return haystack.includes(state.query);
  }

  function kindLabel(kind) {
    return {
      sans: "Sans",
      serif: "Serif",
      mono: "Mono",
      condensed: "Condensed",
      decorative: "Display",
    }[kind] || kind;
  }

  function escapeHtml(text) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }
})();
