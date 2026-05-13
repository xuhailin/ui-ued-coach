// ============ DATA ============
const CATEGORIES = {
  particles:  { label: 'Particles',  zh: '粒子',     color: 'var(--c-particles)' },
  fluid:      { label: 'Fluid',      zh: '流体',     color: 'var(--c-fluid)' },
  morph:      { label: 'Morph',      zh: '形变',     color: 'var(--c-morph)' },
  typo:       { label: 'Typography', zh: '文字',     color: 'var(--c-typo)' },
  '3d':       { label: '3D',         zh: '三维',     color: 'var(--c-3d)' },
  transition: { label: 'Transition', zh: '转场',     color: 'var(--c-transition)' },
  glitch:     { label: 'Glitch',     zh: '故障',     color: 'var(--c-glitch)' },
  loader:     { label: 'Loader',     zh: '加载',     color: 'var(--c-loader)' },
  hover:      { label: 'Hover',      zh: '交互',     color: 'var(--c-hover)' },
  bg:         { label: 'Background', zh: '背景',     color: 'var(--c-bg)' },
  input:      { label: 'Input',      zh: '输入',     color: 'var(--c-input)' },
  feedback:   { label: 'Feedback',   zh: '反馈',     color: 'var(--c-feedback)' },
  data:       { label: 'Data',       zh: '数据',     color: 'var(--c-data)' },
  ai:         { label: 'AI',         zh: '智能',     color: 'var(--c-ai)' }
};

const MODULES = [
  {
    id: '01', en: 'particle_vortex', title: '粒子涡流', cat: 'particles', size: 'l', impl: true,
    prompt: '数百个发光粒子围绕一个隐形重力中心做螺旋运动，靠近中心时加速且变亮，远离时减速并淡出。鼠标移动可以扰动重力场，让粒子流动方向跟随光标偏移。',
    tags: ['canvas', 'gravity', 'glow', '#interactive'],
    stack: 'Canvas 2D · requestAnimationFrame'
  },
  {
    id: '02', en: 'liquid_blob', title: '液态变形', cat: 'fluid', size: 'w', impl: true,
    prompt: 'SVG 路径在三种有机形状之间持续平滑插值，配合 feGaussianBlur 制造液态融合感。色彩从靛蓝到品红做循环渐变，整体像一滴慢慢呼吸的水银。',
    tags: ['svg', 'morph', 'gooey', '#looping'],
    stack: 'SVG · CSS animation · feGaussianBlur'
  },
  {
    id: '03', en: 'glitch_title', title: '故障标题', cat: 'glitch', size: 't', impl: true,
    prompt: '主标题以红蓝双色通道分离的形式抖动，每隔 2-3 秒触发一次随机的水平切片错位，配合贯穿全屏的扫描线。整体观感像信号失真的 CRT 显示器。',
    tags: ['css', 'clip-path', 'rgb-split', '#aesthetic'],
    stack: 'CSS keyframes · clip-path · text-shadow'
  },
  {
    id: '04', en: 'holographic_card', title: '全息卡片', cat: '3d', size: 'm', impl: true,
    prompt: '鼠标移入时卡片随光标 3D 倾斜，表面叠加一层会随角度移动的彩虹色光泽（类似 Pokémon 闪卡），并在边缘渗出柔和光晕。',
    tags: ['3d-transform', 'gradient', 'mouse-tilt'],
    stack: 'CSS transform · conic-gradient'
  },
  {
    id: '05', en: 'aurora_flow', title: '极光流动', cat: 'bg', size: 'l', impl: true,
    prompt: '页面背景由 3-4 团巨大的彩色光晕组成，缓慢漂浮、相互渗透。整体节奏极慢、几乎察觉不到，但氛围浓郁，像北极极光。',
    tags: ['gradient', 'blur', 'ambient', '#background'],
    stack: 'CSS filter:blur · @keyframes · radial-gradient'
  },
  {
    id: '06', en: 'liquid_loader', title: '液态加载', cat: 'loader', size: 'm', impl: true,
    prompt: '一个圆形容器内部水位上下波动，水面有起伏的波浪和细小气泡。加载完成时水位升至顶部并溢出一滴。',
    tags: ['svg', 'wave', 'progress'],
    stack: 'SVG path · CSS animation'
  },
  {
    id: '07', en: 'reveal_curtain', title: '揭幕转场', cat: 'transition', size: 'm', impl: true,
    prompt: '页面切换时，黑色幕布以斜切角度从左下扫至右上覆盖整屏，再以错位时序揭开新页面。配合一个细长的高亮线沿着切口扫过。',
    tags: ['page-transition', 'mask', 'sweep'],
    stack: 'clip-path · transition'
  },
  {
    id: '08', en: 'cursor_aura', title: '光晕跟随', cat: 'hover', size: 'm', impl: true,
    prompt: '鼠标在页面上移动时，光标位置周围呈现一团缓慢扩散的柔光，悬停可交互元素时光晕变色并轻微吸附。',
    tags: ['mouse', 'glow', 'spring'],
    stack: 'JS · radial-gradient · lerp'
  },
  {
    id: '09', en: 'morphing_logo', title: 'LOGO 形变', cat: 'morph', size: 'm', impl: true,
    prompt: 'LOGO 由几何基本形（圆、方、三角）拼接，每隔几秒所有元素在保持构图平衡的前提下随机互换角色。',
    tags: ['svg-morph', 'logo', 'kinetic'],
    stack: 'SVG path morph · GSAP'
  },
  {
    id: '10', en: 'grain_noise', title: '噪点颗粒', cat: 'bg', size: 'm', impl: true,
    prompt: '整页叠加一层细颗粒噪点，每帧轻微抖动，模拟胶片质感。颗粒密度随滚动深度逐渐加重。',
    tags: ['noise', 'texture', 'overlay'],
    stack: 'SVG turbulence · mix-blend-mode'
  },
  {
    id: '11', en: 'smoke_trail', title: '烟雾轨迹', cat: 'fluid', size: 'w', impl: true,
    prompt: '鼠标移动时拖曳出一道淡彩色烟雾，烟雾边缘模糊、向上漂浮并缓慢消散。',
    tags: ['canvas', 'particles', 'fade'],
    stack: 'Canvas · trail · gaussian'
  },
  {
    id: '12', en: 'kinetic_type', title: '动态排版', cat: 'typo', size: 'm', impl: true,
    prompt: '一段标语中的每个字符独立做大小、字重、字距的连续插值，整体看起来像在呼吸或在说话。',
    tags: ['variable-font', 'kinetic', 'text'],
    stack: 'variable font axes · CSS animation'
  },
  {
    id: '13', en: 'tilt_card_3d', title: '3D 倾斜卡', cat: '3d', size: 't', impl: true,
    prompt: '卡片支持鼠标位置驱动的 3D 倾斜，内部多个图层（背景 / 主图 / 文字 / 高光）按不同视差深度移动，形成立体浮空感。',
    tags: ['parallax', 'tilt', 'layered'],
    stack: 'transform: perspective · matrix3d'
  },
  {
    id: '14', en: 'scramble_text', title: '字符乱码', cat: 'typo', size: 'm', impl: true,
    prompt: '文字在显示前会经历一段字符随机乱跳的过程，每个位置按时间差先后稳定下来，最终拼出目标文本。',
    tags: ['text-scramble', 'reveal'],
    stack: 'JS · setInterval · charset'
  },
  {
    id: '15', en: 'skeleton_pulse', title: '骨架脉冲', cat: 'loader', size: 'm', impl: true,
    prompt: '加载占位的骨架块从左到右掠过一道高光，相邻块的脉冲存在时间差，整体像水波依次拍过。',
    tags: ['skeleton', 'shimmer', 'placeholder'],
    stack: 'linear-gradient · background-position'
  },
  {
    id: '16', en: 'magnetic_cursor', title: '磁吸光标', cat: 'hover', size: 'm', impl: true,
    prompt: '按钮在光标靠近时被"吸"过去一小段距离，离开后弹性回位。文字标签做轻微延迟跟随，形成层级感。',
    tags: ['magnetic', 'spring', 'button'],
    stack: 'JS · lerp · transform'
  },
  {
    id: '17', en: 'shared_element_expand', title: '共享元素展开', cat: 'transition', size: 'w', impl: true,
    prompt: '卡片点击后封面、标题和状态标签连续过渡到详情抽屉，同一元素不闪断，关闭时沿原路径回到网格位置。适合作品卡、案例详情和管理后台记录详情。',
    tags: ['view-transition', 'detail', 'continuity'],
    stack: 'View Transitions API · transform · opacity'
  },
  {
    id: '18', en: 'command_palette', title: '命令面板', cat: 'input', size: 'm', impl: true,
    prompt: '按下快捷键后命令面板从视口中心轻微缩放淡入，背景内容降低对比度。搜索结果按输入节奏逐条进入，当前高亮项有柔和滑动指示。',
    tags: ['command-k', 'search', 'keyboard'],
    stack: 'Dialog · CSS transition · roving focus'
  },
  {
    id: '19', en: 'search_suggest_reveal', title: '搜索建议显现', cat: 'input', size: 'm', impl: true,
    prompt: '搜索输入时结果列表不整块刷新，而是逐条淡入并上移，匹配关键词做高亮扫光；无结果时过渡到空状态，不出现跳动。',
    tags: ['search', 'stagger', 'empty-state'],
    stack: 'CSS transition · DOM diff · aria-live'
  },
  {
    id: '20', en: 'filter_reflow', title: '筛选重排', cat: 'transition', size: 'm', impl: true,
    prompt: '切换筛选标签后，保留下来的卡片平滑移动到新位置，消失项缩小淡出，新增项错峰进入。适合不断扩容的模块看板。',
    tags: ['filter', 'layout', 'reorder'],
    stack: 'FLIP · transform · requestAnimationFrame'
  },
  {
    id: '21', en: 'drag_reorder_ghost', title: '拖拽排序反馈', cat: 'hover', size: 'm', impl: true,
    prompt: '拖拽列表或网格项时，原位置出现虚线占位，拖拽对象变成轻微浮起的 ghost，靠近插入点时其他项让位并吸附。',
    tags: ['drag', 'sort', 'ghost'],
    stack: 'Pointer Events · transform · collision'
  },
  {
    id: '22', en: 'form_validation_stack', title: '表单校验反馈', cat: 'feedback', size: 'm', impl: true,
    prompt: '输入框失焦后，错误文案从输入框下方展开，边框短促震动一次；修正成功后 checkmark 画线出现，整体不改变表单大布局。',
    tags: ['form', 'validation', 'state'],
    stack: 'CSS transition · constraint validation'
  },
  {
    id: '23', en: 'password_strength_meter', title: '密码强度条', cat: 'input', size: 'm', impl: true,
    prompt: '密码输入时强度条分段点亮，颜色和提示文案逐步切换。变化节奏跟随输入，不用强闪烁，避免让用户感觉被警告轰炸。',
    tags: ['password', 'meter', 'security'],
    stack: 'Input event · CSS custom properties'
  },
  {
    id: '24', en: 'upload_dropzone', title: '上传拖放区', cat: 'feedback', size: 'w', impl: true,
    prompt: '文件拖入时上传区域边框吸附发光，内部图标上浮，释放后进入流动进度条。上传完成后文件名从进度条中折叠成列表项。',
    tags: ['upload', 'dropzone', 'progress'],
    stack: 'Drag events · progress · transform'
  },
  {
    id: '25', en: 'skeleton_to_content', title: '骨架转真实内容', cat: 'loader', size: 'w', impl: true,
    prompt: '骨架屏加载完成时不是直接消失，而是每个骨架块过渡成真实内容的位置、尺寸和透明度，减少页面突然跳变。',
    tags: ['skeleton', 'morph', 'loading'],
    stack: 'FLIP · opacity · content-visibility'
  },
  {
    id: '26', en: 'toast_stack', title: '通知堆叠', cat: 'feedback', size: 'm', impl: true,
    prompt: 'Toast 从右下角进入，多条通知自动堆叠。关闭某条时上方通知平滑补位，进度条表示自动消失时间。',
    tags: ['toast', 'stack', 'notification'],
    stack: 'CSS transition · queue · timer'
  },
  {
    id: '27', en: 'popover_anchor', title: '锚点浮层', cat: 'hover', size: 'm', impl: true,
    prompt: 'Tooltip 或 Popover 从触发元素的锚点附近展开，箭头始终指向来源；当空间不足时方向切换但动效仍保持来源感。',
    tags: ['tooltip', 'popover', 'anchor'],
    stack: 'Popover API · anchor positioning'
  },
  {
    id: '28', en: 'tab_indicator_glide', title: '标签指示滑动', cat: 'transition', size: 'm', impl: true,
    prompt: 'Tab 切换时 active 下划线沿 X 轴滑动到新标签，内容区域交叉淡入；快速连点时动画可被打断并接续到最新目标。',
    tags: ['tabs', 'indicator', 'interruptible'],
    stack: 'CSS transform · transition cancellation'
  },
  {
    id: '29', en: 'kpi_number_roll', title: '指标数字滚动', cat: 'data', size: 'm', impl: true,
    prompt: 'KPI 数字变化时按位滚动，上涨和下跌分别有短暂色彩提示，完成后回到中性色。适合数据看板和运营后台。',
    tags: ['kpi', 'number', 'dashboard'],
    stack: 'Intl.NumberFormat · transform · reduced-motion'
  },
  {
    id: '30', en: 'chart_data_transition', title: '图表数据过渡', cat: 'data', size: 'w', impl: true,
    prompt: '筛选图表数据时，柱状图高度和折线点位平滑变形，坐标轴刻度淡入更新。避免整张图闪一下重绘。',
    tags: ['chart', 'data', 'transition'],
    stack: 'SVG · scale interpolation · requestAnimationFrame'
  },
  {
    id: '31', en: 'ai_streaming_text', title: 'AI 流式文本', cat: 'ai', size: 'm', impl: true,
    prompt: 'AI 生成内容按 token 或短句流式出现，末尾有低干扰光标。暂停、继续、完成三个状态都有明确但克制的反馈。',
    tags: ['ai', 'streaming', 'typing'],
    stack: 'ReadableStream · text diff · aria-live'
  },
  {
    id: '32', en: 'save_sync_indicator', title: '保存同步状态', cat: 'feedback', size: 'm', impl: true,
    prompt: '编辑内容后状态从“未保存”过渡到“保存中”，随后变成“已保存”。离线时状态变成队列图标，并在恢复连接后自动回放同步进度。',
    tags: ['save', 'sync', 'offline'],
    stack: 'State machine · CSS transition · local queue'
  },
  {
    id: '33', en: 'button_ripple', title: '按钮水波', cat: 'hover', size: 'm', impl: true,
    prompt: '点击按钮时从点击位置向外扩散一圈半透明涟漪，叠加在按钮表面，结束时溢出按钮边缘并淡出。多次连点的涟漪可叠加但不卡顿，按钮本身做一次轻微下压回弹。',
    tags: ['ripple', 'click', 'material'],
    stack: 'pointer event · transform · keyframes'
  },
  {
    id: '34', en: 'floating_label', title: '浮动标签输入', cat: 'input', size: 'm', impl: true,
    prompt: '输入框未输入时标签居中显示在框内；focus 或已有值时标签向上缩进并缩小，由边框开口避开。整体过渡约 220ms，标签颜色随聚焦状态切换。',
    tags: ['label', 'input', 'material'],
    stack: 'CSS transform · :focus-within · transition'
  },
  {
    id: '35', en: 'otp_input', title: '验证码输入', cat: 'input', size: 'm', impl: true,
    prompt: '6 位独立方框，输入时自动跳到下一格，删除时回退；支持一次性粘贴拆分到所有格子。活动格底部光标呼吸、已填写格底部一条弱色横条。',
    tags: ['otp', 'verification', 'auto-advance'],
    stack: 'input composition · clipboard · transition'
  },
  {
    id: '36', en: 'toggle_switch', title: '开关切换', cat: 'input', size: 'm', impl: true,
    prompt: '圆形滑块在轨道两端切换，背景色从灰过渡到品牌色；滑块按下瞬间略微拉长（液态感），松开后弹性回圆。role=switch 可访问。',
    tags: ['toggle', 'switch', 'spring'],
    stack: 'CSS transform · transition · aria'
  },
  {
    id: '37', en: 'stepper_wizard', title: '分步引导', cat: 'transition', size: 'w', impl: true,
    prompt: '顶部进度条按步骤激活节点，节点切换时已完成节点画 ✓，当前节点轻微脉冲；内容区按方向左右滑动切换，上一步播放逆向。',
    tags: ['wizard', 'multi-step', 'progress'],
    stack: 'state machine · transform · CSS variables'
  },
  {
    id: '38', en: 'drawer_slide', title: '侧滑抽屉', cat: 'transition', size: 'm', impl: true,
    prompt: '点击触发后右侧抽屉从屏外滑入并带轻微弹性结束，主内容区被背景模糊+暗化遮罩覆盖；关闭时反向滑出，遮罩淡出延后一拍。',
    tags: ['drawer', 'side-panel', 'overlay'],
    stack: 'transform · backdrop-filter · pointer-events'
  },
  {
    id: '39', en: 'scroll_progress', title: '滚动进度条', cat: 'data', size: 'm', impl: true,
    prompt: '页面顶部一条细线表示阅读进度，宽度跟随 scrollY/scrollHeight 实时变化；进入新章节时颜色短暂提亮，到达底部时整条短暂闪一下表示完结。',
    tags: ['scroll', 'progress', 'reading'],
    stack: 'scroll event · transform: scaleX · CSS variable'
  },
  {
    id: '40', en: 'counter_on_view', title: '入场数字累加', cat: 'data', size: 'm', impl: true,
    prompt: 'KPI 数字在进入视口时从 0 累加到目标值，缓动曲线先快后慢；后缀（%/+/k）保持不动。多个 KPI 错峰开始，相邻间隔 80-120ms。',
    tags: ['counter', 'viewport', 'kpi'],
    stack: 'IntersectionObserver · requestAnimationFrame · easing'
  },
  {
    id: '41', en: 'confetti_burst', title: '撒花庆祝', cat: 'feedback', size: 'm', impl: true,
    prompt: '关键操作成功（结算 / 发布 / 完成里程碑）时从屏幕中下方喷出彩色纸片，受重力下落并自旋；颜色映射品牌色，最多持续 2.4s，结束后清理 DOM。',
    tags: ['celebration', 'particles', 'success'],
    stack: 'Canvas · physics · sprite'
  },
  {
    id: '42', en: 'copy_to_clipboard', title: '复制反馈', cat: 'feedback', size: 'm', impl: true,
    prompt: '点击复制按钮后图标在原位 morph 成 ✓，按钮短暂泛绿色高光，旁边文案从“复制”切换为“已复制”，1.6s 后整体恢复初始态。',
    tags: ['clipboard', 'success', 'icon-morph'],
    stack: 'Clipboard API · SVG path morph · transition'
  },
  {
    id: '43', en: 'like_heart_burst', title: '点赞粒子', cat: 'feedback', size: 'm', impl: true,
    prompt: '点击爱心从描边切换到填色，同时图标做一次弹性放大-回弹，周围射出 6-8 个小爱心粒子做发散+淡出。再次点击则反向播放收回。',
    tags: ['like', 'burst', 'micro-interaction'],
    stack: 'SVG · transform · particles'
  },
  {
    id: '44', en: 'marquee_ticker', title: '滚动跑马灯', cat: 'typo', size: 'w', impl: true,
    prompt: '一行文字以恒定速度循环水平滚动，两端用 mask-image 做柔和淡出避免硬边；hover 时减速到原速 20% 但不停止，离开后平滑加速回原速。',
    tags: ['marquee', 'ticker', 'infinite'],
    stack: 'CSS animation · mask-image · animation-play-state'
  },
  {
    id: '45', en: 'bubble_cta', title: '气泡 CTA', cat: 'hover', size: 'm', impl: true,
    prompt: '按钮表面持续从底部冒出 3-5 颗气泡，缓慢上升并在中部淡出，像一杯香槟。Hover 时气泡密度和速度提升、轻微受光标引力偏移、边缘描边发光；点击瞬间所有气泡爆开成扇形粒子（pop），按钮做一次 depress 弹回，0.4s 后回归 idle 节奏。',
    tags: ['cta', 'bubble', 'effervescent', '#guide'],
    stack: 'Canvas 2D · requestAnimationFrame · pointer events'
  },
  {
    id: '46', en: 'eye_follow_avatar', title: '眼球追踪', cat: 'hover', size: 'm', impl: true,
    prompt: '一个圆形头像，里面有两颗眼睛，瞳孔（iris）始终朝向光标方向偏移，受眼眶半径约束不会跑出眼眶；空闲时（光标不在 stage 内）瞳孔随机扫视，并每 4-6 秒眨一次眼（用 scaleY 压扁 90ms 再回弹）。光标越靠近脸，眼眶可微微眯起或张大表示注视感。整体可爱、有 mascot 气质。',
    tags: ['eye-tracking', 'mascot', 'character', '#interactive'],
    stack: 'pointer event · transform · requestAnimationFrame'
  },
  {
    id: '47', en: 'magnetic_blob_morph', title: '磁吸 blob 形变', cat: 'morph', size: 'm', impl: true,
    prompt: '中心一个 SVG 有机形（blob），多个控制点构成平滑闭合路径。光标进入后最近光标的控制点被"吸"出去一段，形成朝向光标的凸包；其他控制点保持原位并平滑过渡，远离时回归原形。整体像一团黏液被磁铁吸引。配合柔和的 drop-shadow。',
    tags: ['blob', 'svg-morph', 'magnetic', '#abstract'],
    stack: 'SVG path · cubic-bezier · pointer event'
  },
  {
    id: '49', en: 'antenna_creature', title: '触角小生物', cat: 'hover', size: 'm', impl: true,
    prompt: '中心一个圆形小生物头部，顶上伸出两根触角（贝塞尔曲线）。触角末端始终朝向光标方向弯曲，根部不动；hover 在 stage 内时触角末端有小光点闪烁。光标离开 stage 后触角抖动 1-2 次再弹性回归直立。整体像一只好奇的小怪物。',
    tags: ['creature', 'antenna', 'cute', '#interactive'],
    stack: 'SVG path · pointer event · transform'
  }
];

const fxRegistry = new WeakMap();
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const MOTION_STYLE_KEY = 'uiUedCoach.motionLabStyle';
const MOTION_STYLE_MODELS = ['console', 'dashboard', 'atlas', 'terminal', 'showcase'];
const MOTION_DEFAULT_STYLE = 'console';
const cardObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver(handleCardVisibility, { rootMargin: '180px 0px' })
  : null;

// ============ MOTION EFFECTS REGISTRY ============
// Each batch file calls window.MotionEffects.register(en, { card, modal, init }) at load time.
//   card({ module, cat })   -> HTML string used inside the .stage of a grid/showcase card
//   modal({ module, cat })  -> HTML string used inside the .stage of the modal preview
//                              (falls back to card() when omitted)
//   init(stageEl, ctx)      -> optional. Runs once after the stage is mounted.
//                              ctx = { module, cat, prefersReducedMotion, isModal }
//                              Return { start?, stop?, destroy? } to plug into the
//                              IntersectionObserver pause/resume + cleanup lifecycle.
window.MotionEffects = window.MotionEffects || {
  _entries: new Map(),
  register(name, def) { this._entries.set(name, def); },
  get(name) { return this._entries.get(name); },
  has(name) { return this._entries.has(name); }
};
const motionFxHandles = new WeakMap();

function ensureMotionFx(stageEl, module, isModal) {
  if (!stageEl || motionFxHandles.has(stageEl)) return;
  const def = window.MotionEffects.get(module.en);
  if (!def || typeof def.init !== 'function') return;
  try {
    const handle = def.init(stageEl, {
      module,
      cat: CATEGORIES[module.cat],
      prefersReducedMotion,
      isModal: !!isModal
    }) || {};
    motionFxHandles.set(stageEl, handle);
  } catch (err) {
    console.warn('[motion-lab] effect init failed:', module.en, err);
  }
}
function startMotionFx(stageEl) {
  try { motionFxHandles.get(stageEl)?.start?.(); } catch (err) { console.warn(err); }
}
function stopMotionFx(stageEl) {
  try { motionFxHandles.get(stageEl)?.stop?.(); } catch (err) { console.warn(err); }
}
function destroyMotionFx(stageEl) {
  const h = motionFxHandles.get(stageEl);
  if (!h) return;
  try { h.destroy?.(); } catch (err) { console.warn(err); }
  motionFxHandles.delete(stageEl);
}

// ============ RENDER CHIPS ============
const chipsEl = document.getElementById('chips');
let activeCat = 'all';
function renderChips() {
  const counts = { all: MODULES.length };
  Object.keys(CATEGORIES).forEach(k => counts[k] = MODULES.filter(m => m.cat === k).length);
  const items = [{ key: 'all', label: 'ALL', color: 'var(--text)' }]
    .concat(Object.entries(CATEGORIES).map(([k, v]) => ({ key: k, label: v.label + ' / ' + v.zh, color: v.color })));
  chipsEl.innerHTML = items.map(c => `
    <button class="chip ${c.key === activeCat ? 'active' : ''}" data-cat="${c.key}" style="--cc:${c.color}">
      ${c.key !== 'all' ? `<span class="swatch" style="--cc:${c.color}"></span>` : ''}
      ${c.label}
      <span class="count">${counts[c.key]}</span>
    </button>
  `).join('');
  chipsEl.querySelectorAll('.chip').forEach(b => {
    b.onclick = () => { activeCat = b.dataset.cat; renderChips(); renderGrid(); };
  });
}

// ============ RENDER LEGEND ============
const legendEl = document.getElementById('legend');
legendEl.innerHTML = Object.entries(CATEGORIES)
  .map(([k, v]) => `<span><i style="--c:${v.color}"></i>${v.label}</span>`)
  .join('');

// ============ ICONS ============
function placeholderIcon(cat) {
  const icons = {
    particles: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="20" cy="20" r="1.5" fill="currentColor"/><circle cx="8" cy="12" r="1"/><circle cx="32" cy="14" r="1"/><circle cx="10" cy="28" r="1"/><circle cx="30" cy="30" r="1"/><circle cx="18" cy="6" r="0.8"/><circle cx="36" cy="22" r="0.8"/><circle cx="4" cy="20" r="0.8"/><circle cx="22" cy="34" r="0.8"/><path d="M20 20 L8 12 M20 20 L32 14 M20 20 L10 28 M20 20 L30 30" stroke-opacity="0.3"/></svg>`,
    fluid:     `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M6 20c0-8 7-14 14-14s14 6 14 14-7 14-14 14S6 28 6 20Z"/><path d="M10 22c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0" stroke-opacity="0.6"/></svg>`,
    morph:     `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="6" y="6" width="12" height="12"/><circle cx="28" cy="12" r="6"/><polygon points="20,34 14,24 26,24"/></svg>`,
    typo:      `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M8 30V12h10M8 21h8M22 30V12h6a4 4 0 0 1 0 8h-6"/></svg>`,
    '3d':      `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M20 6 L34 14 V28 L20 36 L6 28 V14 Z"/><path d="M20 6 V20 M20 20 L34 14 M20 20 L6 14 M20 20 V36" stroke-opacity="0.5"/></svg>`,
    transition:`<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M6 12 H22 M6 20 H30 M6 28 H18"/><path d="M28 8 L34 20 L28 32" stroke-linecap="round"/></svg>`,
    glitch:    `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M6 12 H20 M14 12 V20 M14 20 H30 M22 20 V28 M22 28 H8"/></svg>`,
    loader:    `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="20" cy="20" r="14" stroke-opacity="0.25"/><path d="M20 6 a14 14 0 0 1 14 14" stroke-linecap="round"/></svg>`,
    hover:     `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M14 8 L14 28 L19 24 L23 32 L26 30 L22 22 L28 22 Z"/></svg>`,
    bg:        `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="6" y="6" width="28" height="28"/><path d="M6 14 L34 14 M6 22 L34 22 M6 30 L34 30 M14 6 L14 34 M22 6 L22 34 M30 6 L30 34" stroke-opacity="0.3"/></svg>`,
    input:     `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="7" y="11" width="26" height="18" rx="2"/><path d="M12 20h10M26 20h2M12 25h16" stroke-opacity="0.55"/></svg>`,
    feedback:  `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M8 11h24v15H18l-6 5v-5H8z"/><path d="M14 18h12M14 22h7" stroke-opacity="0.55"/></svg>`,
    data:      `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M8 31h24"/><rect x="10" y="20" width="4" height="11"/><rect x="18" y="13" width="4" height="18"/><rect x="26" y="8" width="4" height="23"/></svg>`,
    ai:        `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M20 6l2.6 8.2L31 17l-8.4 2.8L20 34l-2.6-14.2L9 17l8.4-2.8z"/><path d="M9 8l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" stroke-opacity="0.55"/></svg>`
  };
  return icons[cat] || icons.bg;
}

// ============ RENDER GRID ============
const gridEl = document.getElementById('grid');
const searchEl = document.getElementById('search');
let searchQ = '';
let currentMotionStyle = normalizeMotionStyle(window.localStorage.getItem(MOTION_STYLE_KEY));

function normalizeMotionStyle(style) {
  return MOTION_STYLE_MODELS.includes(style) ? style : MOTION_DEFAULT_STYLE;
}

function setMotionStyle(style) {
  currentMotionStyle = normalizeMotionStyle(style);
  window.localStorage.setItem(MOTION_STYLE_KEY, currentMotionStyle);
  document.body.dataset.motionStyle = currentMotionStyle;
  renderMotionStyleJudgment();
  renderMotionDashboardSummary();
  renderGrid();
}

function renderMotionStyleJudgment() {
  window.StyleRegistry?.renderStyleJudgmentStrip('#motion-style-judgment', {
    page: 'motion-lab',
    contentId: 'lab',
    allowedStyleIds: MOTION_STYLE_MODELS,
    activeStyle: currentMotionStyle,
    onSelect: setMotionStyle,
  });
}

function renderMotionDashboardSummary() {
  const root = document.getElementById('motion-dashboard-summary');
  if (!root) return;
  const implemented = MODULES.filter(m => m.impl).length;
  const pending = MODULES.length - implemented;
  const completion = Math.round((implemented / MODULES.length) * 100);
  const topCategories = Object.entries(CATEGORIES)
    .map(([key, cat]) => ({ key, cat, count: MODULES.filter(m => m.cat === key).length }))
    .filter(item => item.count)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  root.innerHTML = `
    <div class="motion-kpi"><span>Completion</span><strong>${completion}%</strong><em>${implemented}/${MODULES.length} implemented</em></div>
    <div class="motion-kpi"><span>Queue</span><strong>${pending}</strong><em>awaiting Codex</em></div>
    <div class="motion-kpi motion-kpi-wide">
      <span>Category Distribution</span>
      <div class="motion-bars">
        ${topCategories.map(item => `<i style="--cc:${item.cat.color};--w:${Math.round((item.count / MODULES.length) * 100)}%"><b>${item.cat.label}</b><small>${item.count}</small></i>`).join('')}
      </div>
    </div>
  `;
}

function renderGrid() {
  cleanupFx(gridEl);
  const filtered = MODULES.filter(m => {
    if (activeCat !== 'all' && m.cat !== activeCat) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      return m.title.toLowerCase().includes(q) ||
             m.en.toLowerCase().includes(q) ||
             m.prompt.toLowerCase().includes(q) ||
             m.tags.join(' ').toLowerCase().includes(q);
    }
    return true;
  });

  if (!filtered.length) {
    gridEl.innerHTML = `<div class="empty">没有匹配的模块。试试 <b>清除筛选</b> 或换一个关键词。</div>`;
    return;
  }

  setGridMarkup(gridEl, filtered);
}

function setGridMarkup(target, list) {
  cleanupFx(target);
  target.innerHTML = list.map(cardMarkup).join('');
  hydrateCards(target);
}

function blobMarkup() {
  return `
    <div class="blob-wrap">
      <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bg-${Math.random().toString(36).slice(2,7)}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#4d7cff"/>
            <stop offset="100%" stop-color="#ff2bd6"/>
          </linearGradient>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6"/>
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"/>
          </filter>
        </defs>
        <g filter="url(#goo)">
          <circle cx="140" cy="100" r="46" fill="#4d7cff">
            <animate attributeName="cx" values="140;260;180;140" dur="6s" repeatCount="indefinite"/>
            <animate attributeName="cy" values="100;80;120;100" dur="5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="240" cy="110" r="50" fill="#b46bff">
            <animate attributeName="cx" values="240;160;220;240" dur="7s" repeatCount="indefinite"/>
            <animate attributeName="cy" values="110;130;90;110" dur="6.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="200" cy="100" r="36" fill="#ff2bd6">
            <animate attributeName="cx" values="200;230;170;200" dur="5.5s" repeatCount="indefinite"/>
            <animate attributeName="cy" values="100;90;115;100" dur="6s" repeatCount="indefinite"/>
          </circle>
        </g>
      </svg>
    </div>
  `;
}

// ============ PARTICLE VORTEX ============
function initLazyEffects(root) {
  // Vortex canvases still init eagerly (cheap, and the existing IO branch
  // below relies on the canvas being present). Registry-backed effects are
  // initialized lazily on first viewport entry — see handleCardVisibility.
  root.querySelectorAll('canvas[data-fx="vortex"]').forEach(initVortex);
  root.querySelectorAll('.card').forEach(card => {
    if (cardObserver) {
      cardObserver.observe(card);
    } else {
      card.classList.add('is-visible');
      card.querySelectorAll('canvas[data-fx="vortex"]').forEach(startFx);
      const stage = card.querySelector('.stage');
      if (stage) {
        if (card.dataset.fxName) {
          const module = MODULES.find(m => m.id === card.dataset.id);
          if (module) ensureMotionFx(stage, module, false);
        }
        startMotionFx(stage);
      }
    }
  });
}

function handleCardVisibility(entries) {
  entries.forEach(entry => {
    const card = entry.target;
    card.classList.toggle('is-visible', entry.isIntersecting);
    card.querySelectorAll('canvas[data-fx="vortex"]').forEach(entry.isIntersecting ? startFx : stopFx);
    const stage = card.querySelector('.stage');
    if (!stage) return;
    if (entry.isIntersecting) {
      // Lazy init on first viewport entry (idempotent via motionFxHandles).
      if (card.dataset.fxName) {
        const module = MODULES.find(m => m.id === card.dataset.id);
        if (module) ensureMotionFx(stage, module, false);
      }
      startMotionFx(stage);
    } else {
      stopMotionFx(stage);
    }
  });
}

function initVortex(canvas) {
  if (fxRegistry.has(canvas)) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0;
  let frame = 0;
  let running = false;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    w = Math.max(1, canvas.clientWidth);
    h = Math.max(1, canvas.clientHeight);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

  const N = prefersReducedMotion.matches ? 36 : 140;
  const parts = Array.from({ length: N }, () => ({
    a: Math.random() * Math.PI * 2,
    r: 20 + Math.random() * 120,
    s: 0.005 + Math.random() * 0.02,
    sz: 0.6 + Math.random() * 1.8,
    hue: 180 + Math.random() * 80
  }));

  let mx = 0, my = 0;
  canvas.parentElement.parentElement.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mx = (e.clientX - rect.left - rect.width / 2) * 0.15;
    my = (e.clientY - rect.top - rect.height / 2) * 0.15;
  });

  function tick() {
    if (!running || !canvas.isConnected) return;
    const styles = getComputedStyle(document.body);
    const fade = styles.getPropertyValue('--vortex-fade').trim() || 'rgba(6,6,12,0.18)';
    const blend = styles.getPropertyValue('--vortex-blend').trim() || 'lighter';
    const lightness = styles.getPropertyValue('--vortex-lightness').trim() || '65%';
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = blend;
    const cx = w / 2 + mx, cy = h / 2 + my;
    for (const p of parts) {
      p.a += p.s * (1 + (80 - p.r) / 200);
      p.r -= 0.12;
      if (p.r < 4) { p.r = 130 + Math.random() * 30; p.a = Math.random() * Math.PI * 2; }
      const x = cx + Math.cos(p.a) * p.r;
      const y = cy + Math.sin(p.a) * p.r * 0.55;
      const alpha = Math.max(0, 1 - p.r / 150);
      ctx.fillStyle = `hsla(${p.hue}, 100%, ${lightness}, ${alpha * 0.9})`;
      ctx.beginPath();
      ctx.arc(x, y, p.sz, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    frame = requestAnimationFrame(tick);
  }

  fxRegistry.set(canvas, {
    start() {
      if (running || prefersReducedMotion.matches) return;
      running = true;
      frame = requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    },
    destroy() {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      fxRegistry.delete(canvas);
    }
  });
}

function startFx(canvas) {
  const fx = fxRegistry.get(canvas);
  if (fx) fx.start();
}

function stopFx(canvas) {
  const fx = fxRegistry.get(canvas);
  if (fx) fx.stop();
}

function cleanupFx(root) {
  if (!root) return;
  root.querySelectorAll('.card').forEach(card => cardObserver?.unobserve(card));
  root.querySelectorAll('canvas[data-fx="vortex"]').forEach(canvas => fxRegistry.get(canvas)?.destroy());
  root.querySelectorAll('.stage').forEach(destroyMotionFx);
}

function hydrateCards(target) {
  target.querySelectorAll('.card').forEach(c => {
    c.onclick = () => openModal(c.dataset.id);
  });
  initLazyEffects(target);
}

// ============ MODAL ============
const modal = document.getElementById('modal');
const modalCard = document.getElementById('modal-card');
const previewEl = document.getElementById('modal-preview');
const sourceEl = document.getElementById('m-source');
const copyPromptBtn = document.getElementById('m-copy-prompt');
const codexEditBtn = document.getElementById('m-codex-edit');
const viewSourceBtn = document.getElementById('m-view-source');
let activeModalModule = null;

function motionSourceSummary(m) {
  if (!m) return '';
  const files = ['docs/assets/motion-lab.js'];
  if (m.impl && window.MotionEffects?.has(m.en)) {
    files.push('docs/assets/motion-effects-a.js', 'docs/assets/motion-effects-b.js', 'docs/assets/motion-effects-c.js');
  }

  return [
    `模块: ${m.title} / ${m.en}`,
    `状态: ${m.impl ? '已实现' : '等待实现'}`,
    `技术栈: ${m.stack}`,
    `分类: ${CATEGORIES[m.cat]?.zh || m.cat}`,
    `相关文件: ${files.join(' · ')}`,
    `Prompt: ${m.prompt}`,
  ].join('\n');
}

function codexEditPrompt(m) {
  if (!m) return '';
  return [
    `请继续编辑 Motion Lab 模块「${m.title}」(${m.en})。`,
    `目标: ${m.prompt}`,
    `技术栈: ${m.stack}`,
    `请优先修改 docs/assets/motion-lab.js 和必要的 motion-effects 文件，保持现有卡片/弹窗结构与性能预算。`,
  ].join('\n');
}

async function copyText(text, button, doneText) {
  if (!text) return;
  const original = button?.textContent;
  try {
    await navigator.clipboard.writeText(text);
    if (button) button.textContent = doneText;
  } catch (error) {
    window.prompt('复制失败，可以手动复制：', text);
    if (button) button.textContent = '手动复制';
  }
  if (button && original) {
    window.setTimeout(() => {
      button.textContent = original;
    }, 1200);
  }
}

function openModal(id) {
  const m = MODULES.find(x => x.id === id); if (!m) return;
  activeModalModule = m;
  const cat = CATEGORIES[m.cat];
  cleanupFx(previewEl);
  sourceEl.hidden = true;
  sourceEl.textContent = '';
  viewSourceBtn.textContent = '查看源码';
  modalCard.style.setProperty('--cc', cat.color);
  document.getElementById('m-cat').textContent = cat.label + ' / ' + cat.zh;
  document.getElementById('m-title').textContent = m.title;
  document.getElementById('m-en').textContent = m.en;
  document.getElementById('m-prompt').textContent = m.prompt;
  document.getElementById('m-tags').innerHTML = m.tags.map(t => `<span>${t}</span>`).join('');
  document.getElementById('m-id').textContent = '#' + m.id;
  document.getElementById('m-status').textContent = m.impl ? 'IMPLEMENTED' : 'AWAITING CODEX';
  document.getElementById('m-stack').textContent = m.stack;

  // Build a bigger preview
  let stage = '';
  let useRegistry = false;
  if (m.impl) {
    if (m.en === 'particle_vortex') stage = `<canvas class="fx" data-fx="vortex" style="width:100%;height:100%;display:block;"></canvas>`;
    else if (m.en === 'liquid_blob') stage = blobMarkup();
    else if (m.en === 'glitch_title') stage = `<div class="glitch-stage"><div class="glitch" data-text="ERR0R" style="font-size:80px">ERR0R</div><div class="scanline"></div></div>`;
    else if (window.MotionEffects?.has(m.en)) {
      stage = buildCardStage(m, cat, true);
      useRegistry = true;
    }
  }
  if (!stage) {
    stage = `
      <div class="placeholder" style="position:relative;width:100%;height:100%;">
        <div class="placeholder-icon" style="width:100px;height:100px;color:${cat.color};opacity:0.7;transform:scale(2)">${placeholderIcon(m.cat)}</div>
        <div class="placeholder-tag" style="transform:translate(-50%, calc(-50% + 90px))">// AWAITING CODEX IMPLEMENTATION</div>
      </div>`;
  }
  previewEl.innerHTML = `<div class="stage">${stage}</div>`;
  modal.classList.add('open');
  // Wait for modal open transition + layout so canvas/effect has non-zero size
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      previewEl.querySelectorAll('canvas[data-fx="vortex"]').forEach(initVortex);
      previewEl.querySelectorAll('canvas[data-fx="vortex"]').forEach(startFx);
      if (useRegistry) {
        const stageEl = previewEl.querySelector('.stage');
        if (stageEl) {
          ensureMotionFx(stageEl, m, true);
          startMotionFx(stageEl);
        }
      }
    });
  });
}
function closeModal() {
  modal.classList.remove('open');
  cleanupFx(previewEl);
  previewEl.innerHTML = '';
  activeModalModule = null;
}
document.getElementById('modal-close').onclick = closeModal;
modal.onclick = (e) => { if (e.target === modal) closeModal(); };
copyPromptBtn.addEventListener('click', () => {
  copyText(activeModalModule?.prompt, copyPromptBtn, '已复制');
});
codexEditBtn.addEventListener('click', () => {
  copyText(codexEditPrompt(activeModalModule), codexEditBtn, '已复制指令');
});
viewSourceBtn.addEventListener('click', () => {
  if (!activeModalModule) return;
  const showing = !sourceEl.hidden;
  sourceEl.hidden = showing;
  viewSourceBtn.textContent = showing ? '查看源码' : '收起源码';
  if (!showing) sourceEl.textContent = motionSourceSummary(activeModalModule);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchEl.focus(); }
});

// ============ SEARCH ============
searchEl.addEventListener('input', e => { searchQ = e.target.value; renderGrid(); });

// ============ VIEW ROUTING ============
const views = ['dashboard', 'implemented', 'pending', 'categories', 'favorites', 'stats', 'settings'];
let currentView = 'dashboard';

function switchView(name) {
  if (!views.includes(name)) return;
  currentView = name;
  document.querySelectorAll('.grid').forEach(grid => {
    if (grid.id !== 'grid' || name !== 'dashboard') cleanupFx(grid);
  });
  views.forEach(v => {
    const el = document.getElementById('view-' + v);
    if (el) el.classList.toggle('active', v === name);
  });
  document.querySelectorAll('.view-nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.view === name);
  });
  // Hide top controls on non-dashboard views
  document.querySelector('.controls').style.display = (name === 'dashboard') ? '' : 'none';
  if (name === 'dashboard')   renderGrid();
  if (name === 'implemented') renderFilteredGrid('grid-impl', m => m.impl);
  if (name === 'pending')     renderFilteredGrid('grid-pend', m => !m.impl);
  if (name === 'categories')  renderCategoryGrid();
  if (name === 'stats')       renderStats();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderFilteredGrid(targetId, predicate) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const list = MODULES.filter(predicate);
  setGridMarkup(target, list);
}

function renderCategoryGrid() {
  const el = document.getElementById('cat-grid');
  el.innerHTML = Object.entries(CATEGORIES).map(([k, v]) => {
    const mods = MODULES.filter(m => m.cat === k);
    const done = mods.filter(m => m.impl).length;
    return `
      <div class="cat-card" data-cat="${k}" style="--cc:${v.color}">
        <div>
          <div class="cat-icon">${placeholderIcon(k)}</div>
          <h3>${v.label} <small>/ ${v.zh}</small></h3>
        </div>
        <div class="cat-meta">
          <span><b>${mods.length}</b> 模块</span>
          <span><b>${done}</b> 已实现</span>
        </div>
      </div>`;
  }).join('');
  el.querySelectorAll('.cat-card').forEach(c => {
    c.onclick = () => {
      activeCat = c.dataset.cat;
      renderChips(); renderGrid();
      switchView('dashboard');
    };
  });
}

function renderStats() {
  const el = document.getElementById('cat-progress');
  const total = MODULES.length;
  el.innerHTML = Object.entries(CATEGORIES).map(([k, v]) => {
    const n = MODULES.filter(m => m.cat === k).length;
    const pct = Math.round((n / total) * 100);
    return `
      <div class="row" style="--cc:${v.color}">
        <span>${v.label}</span>
        <div class="bar"><i style="width:${Math.max(pct*3, 8)}%"></i></div>
        <span class="v">${n}</span>
      </div>`;
  }).join('');
}

function updateGlobalStats() {
  const implemented = MODULES.filter(m => m.impl).length;
  const pending = MODULES.length - implemented;
  const completion = Math.round((implemented / MODULES.length) * 100);
  const categoryCount = Object.keys(CATEGORIES).length;

  document.querySelectorAll('[data-stat="total"]').forEach(el => el.textContent = MODULES.length);
  document.querySelectorAll('[data-stat="implemented"]').forEach(el => el.textContent = String(implemented).padStart(2, '0'));
  document.querySelectorAll('[data-stat="implemented-plain"]').forEach(el => el.textContent = implemented);
  document.querySelectorAll('[data-stat="pending"]').forEach(el => el.textContent = pending);
  document.querySelectorAll('[data-stat="categories"]').forEach(el => el.textContent = categoryCount);
  document.querySelectorAll('[data-stat="completion"]').forEach(el => el.textContent = `${completion}%`);
  document.querySelectorAll('[data-stat="pending-copy"]').forEach(el => el.textContent = `距离 v1.0 还有 ${pending} 个`);

  const sub = document.getElementById('module-summary');
  if (sub) {
    sub.innerHTML = `<span class="dot"></span>${MODULES.length} modules <b>· ${implemented} implemented</b> · ${pending} pending`;
  }
}

document.querySelectorAll('.view-nav-btn').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

// Extract card markup so we can reuse across grids
function buildCardStage(m, cat, isModal = false) {
  if (!m.impl) {
    return `<div class="placeholder"><div class="placeholder-icon">${placeholderIcon(m.cat)}</div><div class="placeholder-tag">// PLACEHOLDER</div></div>`;
  }
  if (m.en === 'particle_vortex') return `<canvas class="fx" data-fx="vortex"></canvas>`;
  if (m.en === 'liquid_blob') return blobMarkup();
  if (m.en === 'glitch_title') return `<div class="glitch-stage"><div class="glitch" data-text="ERR0R">ERR0R</div><div class="scanline"></div></div>`;
  const def = window.MotionEffects?.get(m.en);
  if (def) {
    const fn = isModal ? (def.modal || def.card) : def.card;
    if (typeof fn === 'function') {
      try { return fn({ module: m, cat }) || ''; }
      catch (err) { console.warn('[motion-lab] effect render failed:', m.en, err); }
    }
  }
  return `<div class="placeholder"><div class="placeholder-icon">${placeholderIcon(m.cat)}</div><div class="placeholder-tag">// PLACEHOLDER</div></div>`;
}

function cardMarkup(m) {
  const cat = CATEGORIES[m.cat];
  if (currentMotionStyle === 'atlas') return atlasCardMarkup(m, cat);
  if (currentMotionStyle === 'terminal') return terminalCardMarkup(m, cat);
  if (currentMotionStyle === 'showcase') return showcaseCardMarkup(m, cat);
  const stage = buildCardStage(m, cat, false);
  const fxAttr = (m.impl && window.MotionEffects?.has(m.en)) ? ` data-fx-name="${m.en}"` : '';
  return `
    <div class="card size-${m.size} ${m.impl ? 'implemented' : ''}" data-id="${m.id}" style="--cc: ${cat.color}"${fxAttr}>
      <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
      <div class="stage">${stage}</div>
      <div class="card-head">
        <div class="card-id">#${m.id}</div>
        <div class="card-cat">${cat.label}</div>
      </div>
      <div class="card-title"><h3>${m.title}</h3><div class="en">${m.en}</div></div>
      <div class="card-status">${m.impl ? 'LIVE' : 'PENDING'}</div>
      <div class="overlay">
        <div class="overlay-label"><span>↑ PROMPT</span><span class="hint">CLICK 查看详情</span></div>
        <div class="overlay-prompt">${m.prompt}</div>
        <div class="overlay-tags">${m.tags.slice(0,4).map(t => `<span>${t}</span>`).join('')}</div>
      </div>
    </div>`;
}

function atlasCardMarkup(m, cat) {
  return `
    <div class="card atlas-card ${m.impl ? 'implemented' : ''}" data-id="${m.id}" style="--cc: ${cat.color}">
      <div class="atlas-card-index">#${m.id}</div>
      <div class="atlas-card-icon">${placeholderIcon(m.cat)}</div>
      <div>
        <div class="card-cat">${cat.label} / ${cat.zh}</div>
        <h3>${m.title}</h3>
        <p>${m.prompt}</p>
      </div>
      <div class="overlay-tags">${m.tags.slice(0, 4).map(t => `<span>${t}</span>`).join('')}</div>
      <div class="card-status">${m.impl ? 'LIVE' : 'PENDING'}</div>
    </div>`;
}

function terminalCardMarkup(m, cat) {
  return `
    <div class="card terminal-card ${m.impl ? 'implemented' : ''}" data-id="${m.id}" style="--cc: ${cat.color}">
      <div class="terminal-line"><span>$ open module/${m.en}</span><b>${m.impl ? '[ DONE ]' : '[ TODO ]'}</b></div>
      <h3>${m.title}</h3>
      <p>${m.prompt}</p>
      <div class="terminal-meta">
        <span>cat=${cat.label}</span>
        <span>stack="${m.stack}"</span>
        <span>tags=${m.tags.join(',')}</span>
      </div>
    </div>`;
}

function showcaseCardMarkup(m, cat) {
  const stage = buildCardStage(m, cat, false);
  const fxAttr = (m.impl && window.MotionEffects?.has(m.en)) ? ` data-fx-name="${m.en}"` : '';
  return `
    <div class="card showcase-card ${m.impl ? 'implemented' : ''}" data-id="${m.id}" style="--cc: ${cat.color}"${fxAttr}>
      <div class="stage">${stage}</div>
      <div class="showcase-copy">
        <span>#${m.id} · ${cat.label}</span>
        <h3>${m.title}</h3>
        <p>${m.prompt}</p>
      </div>
      <div class="card-status">${m.impl ? 'LIVE' : 'PENDING'}</div>
    </div>`;
}

// 主题切换由全站 site-rail.js 负责（localStorage key: ui-coach-theme）

// ============ BOOT ============
document.body.dataset.motionStyle = currentMotionStyle;
updateGlobalStats();
renderMotionStyleJudgment();
renderMotionDashboardSummary();
renderChips();
renderGrid();
