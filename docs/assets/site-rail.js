/* SITE RAIL — 全站统一 64px 左侧导航
   - 主题不再用户控制，由 body[data-page] 决定
   - rail 通过 CSS 自动跟随 body[data-page] 切换 accent
   - 风格图谱使用独立 emphasised item，方便从左侧 rail 直接联动进入
*/
(function () {
  const NAV_ITEMS = [
    {
      page: 'home',
      href: './index.html',
      label: '灵感图录',
      sub: '图录',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l2.6 5.4 5.9.9-4.3 4.2 1 5.9-5.2-2.7-5.2 2.7 1-5.9-4.3-4.2 5.9-.9z"/></svg>'
    },
    {
      page: 'viewer',
      href: './viewer.html?file=plans/14-day-outline.md',
      label: '学习地图',
      sub: '学习',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4 5l8 1.5L20 5v14l-8 1.5L4 19z"/><path d="M12 6.5v14"/></svg>'
    },
    {
      page: 'motion-lab',
      href: './motion-lab.html',
      label: '动效实验',
      sub: '动效',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="2.5" fill="currentColor"/><circle cx="12" cy="12" r="9" stroke-dasharray="2 3"/><circle cx="21" cy="12" r="1.4" fill="currentColor"/></svg>'
    },
    {
      page: 'style-atlas',
      href: './style-atlas.html',
      label: '风格图谱',
      sub: '图谱',
      featured: true,
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4 5h7v6H4zM13 3h7v8h-7zM4 13h7v6H4zM13 13h7v6h-7z"/><path d="M7.5 11v2M16.5 11v2M11 8h2"/></svg>'
    },
    {
      page: 'docs',
      href: './docs.html',
      label: '文档库',
      sub: '文档',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/></svg>'
    },
    {
      page: 'agent-memory',
      href: './agent-learning-memory.html',
      label: 'Agent 记忆',
      sub: '记忆',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v7a3.5 3.5 0 0 1-3.5 3.5H9l-4 4v-4.8A3.5 3.5 0 0 1 5 13.5z"/><path d="M8.5 8h7M8.5 11h4M15.5 15.5l2 2"/></svg>'
    },
    {
      page: 'ui',
      href: './ui.html',
      label: 'UI 组件',
      sub: '组件',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="3.5"/></svg>'
    },
    {
      page: 'templates',
      href: './templates.html',
      label: 'HTML 模板',
      sub: '模板',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg>'
    }
  ];

  function injectRail() {
    if (document.getElementById('site-rail')) return;
    if (!document.body) return;

    const currentPage = document.body.dataset.page || '';
    const navHtml = NAV_ITEMS.map(function (item) {
      const isCurrent = currentPage === item.page;
      return (
        '<a class="rail-btn ' + (isCurrent ? 'rail-btn-current' : '') + '"' +
        (item.featured ? ' data-featured="true"' : '') +
        ' href="' + item.href + '"' +
        ' data-page="' + item.page + '"' +
        (isCurrent ? ' aria-current="page"' : '') +
        '>' +
        item.icon +
        '<span class="rail-tooltip">' + item.label + '<small>' + item.sub + '</small></span>' +
        '</a>'
      );
    }).join('');

    const railHtml =
      '<aside id="site-rail" class="site-rail" aria-label="站点导航">' +
        '<a class="rail-logo" href="./index.html" aria-label="UI/UED Coach 首页"></a>' +
        navHtml +
        '<div class="rail-spacer"></div>' +
      '</aside>';

    document.body.insertAdjacentHTML('afterbegin', railHtml);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectRail);
  } else {
    injectRail();
  }
})();
