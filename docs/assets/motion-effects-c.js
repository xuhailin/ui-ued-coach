/* =====================================================================
   motion-effects-c.js — Batch C (the heavy 9)
   Effects: shared_element_expand, search_suggest_reveal, filter_reflow,
            drag_reorder_ghost, form_validation_stack, upload_dropzone,
            skeleton_to_content, chart_data_transition, ai_streaming_text
   ===================================================================== */
(function () {
  'use strict';

  // Shim so load order vs motion-lab.js doesn't matter
  window.MotionEffects = window.MotionEffects || {
    _entries: new Map(),
    register(name, def) { this._entries.set(name, def); },
    get(name) { return this._entries.get(name); },
    has(name) { return this._entries.has(name); }
  };

  // ---------------------------------------------------------------------
  // shared helpers
  // ---------------------------------------------------------------------
  const ease = {
    out: t => 1 - Math.pow(1 - t, 3),
    inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    outElastic: t => {
      const c4 = (2 * Math.PI) / 3;
      return t === 0 ? 0 : t === 1 ? 1 :
        Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  // tracks running rAF loops per stage so destroy can cancel reliably
  function rafLoop(tick) {
    let id = 0, running = false;
    const loop = () => {
      if (!running) return;
      if (tick() === false) { running = false; return; }
      id = requestAnimationFrame(loop);
    };
    return {
      start() { if (running) return; running = true; id = requestAnimationFrame(loop); },
      stop() { running = false; if (id) cancelAnimationFrame(id); id = 0; },
      get running() { return running; }
    };
  }

  // =====================================================================
  // 17  shared_element_expand
  //   - render a 3-col grid of "case cards"
  //   - on auto-cycle, pick a card, do a FLIP-like expand of cover+title+status
  //     into a full-stage detail panel, hold, then reverse-collapse.
  // =====================================================================
  const SHARED_ITEMS = [
    { t: 'AURORA REPORT', s: 'LIVE' },
    { t: 'NEBULA DRAFT',  s: 'EDIT' },
    { t: 'KEPLER NOTES',  s: 'SYNC' },
    { t: 'ORBIT SPRINT',  s: 'NEW'  },
    { t: 'PULSE INDEX',   s: 'DONE' },
    { t: 'HALO BACKLOG',  s: 'WIP'  }
  ];
  window.MotionEffects.register('shared_element_expand', {
    card({ module, cat }) {
      const items = SHARED_ITEMS.map((it, i) => `
        <div class="mfx-shared-tile" data-idx="${i}">
          <div class="mfx-shared-cover"></div>
          <div class="mfx-shared-title">${it.t}</div>
          <div class="mfx-shared-status">${it.s}</div>
        </div>`).join('');
      return `
        <div class="mfx-shared" data-mfx="shared">
          <div class="mfx-shared-grid">${items}</div>
          <div class="mfx-shared-detail">
            <div class="mfx-shared-detail-cover"></div>
            <div class="mfx-shared-detail-title">—</div>
            <div class="mfx-shared-detail-status">—</div>
            <div class="mfx-shared-detail-body">
              Continuity preserved: cover, title and status all morph from
              their source position. Closing rewinds the exact path.
            </div>
            <div class="mfx-shared-detail-close">×</div>
          </div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('[data-mfx="shared"]');
      if (!root) return { destroy() {} };
      const grid = root.querySelector('.mfx-shared-grid');
      const detail = root.querySelector('.mfx-shared-detail');
      const dCover = detail.querySelector('.mfx-shared-detail-cover');
      const dTitle = detail.querySelector('.mfx-shared-detail-title');
      const dStatus = detail.querySelector('.mfx-shared-detail-status');
      const tiles = Array.from(grid.querySelectorAll('.mfx-shared-tile'));

      let timer = 0;
      let idx = 0;
      let isOpen = false;
      let animating = false;

      function rectIn(el, root) {
        const r = el.getBoundingClientRect();
        const rr = root.getBoundingClientRect();
        return { x: r.left - rr.left, y: r.top - rr.top, w: r.width, h: r.height };
      }

      function animateExpand(tile) {
        if (animating || isOpen) return;
        animating = true;
        const item = SHARED_ITEMS[+tile.dataset.idx] || SHARED_ITEMS[0];
        dTitle.textContent = item.t;
        dStatus.textContent = item.s + ' · DETAIL';
        tile.setAttribute('data-active', '1');

        // measure source positions inside root
        const fromCard = rectIn(tile, root);
        const fromCover = rectIn(tile.querySelector('.mfx-shared-cover'), root);
        const fromTitle = rectIn(tile.querySelector('.mfx-shared-title'), root);
        const fromStatus = rectIn(tile.querySelector('.mfx-shared-status'), root);

        // open detail offscreen-state to measure final
        detail.style.transition = 'none';
        detail.style.opacity = '0';
        detail.classList.add('is-open');
        // detail covers entire root inset 12
        const toCard = rectIn(detail, root);
        const toCover = rectIn(dCover, root);
        const toTitle = rectIn(dTitle, root);
        const toStatus = rectIn(dStatus, root);

        // animate via two ghost layers atop everything
        const ghostCover = document.createElement('div');
        ghostCover.className = 'mfx-shared-ghost';
        const ghostTitle = document.createElement('div');
        ghostTitle.className = 'mfx-shared-ghost';
        ghostTitle.style.background = 'transparent';
        ghostTitle.style.border = 'none';
        ghostTitle.style.display = 'flex';
        ghostTitle.style.alignItems = 'flex-end';
        ghostTitle.style.paddingLeft = '6px';
        ghostTitle.style.fontSize = '9px';
        ghostTitle.style.fontWeight = '600';
        ghostTitle.style.fontFamily = 'var(--mono)';
        ghostTitle.style.color = 'var(--text)';
        ghostTitle.textContent = item.t;
        root.appendChild(ghostCover); root.appendChild(ghostTitle);

        const place = (g, r) => {
          g.style.transform = `translate(${r.x}px, ${r.y}px)`;
          g.style.width = r.w + 'px'; g.style.height = r.h + 'px';
        };
        place(ghostCover, fromCover);
        place(ghostTitle, fromTitle);

        // hide source elements while ghosts animate
        tile.style.opacity = '.0';
        detail.style.opacity = '0';
        grid.style.opacity = '.35';

        const dur = prefersReducedMotion.matches ? 0 : 480;
        const start = performance.now();
        function frame(now) {
          if (!root.isConnected) return;
          const t = dur === 0 ? 1 : Math.min(1, (now - start) / dur);
          const k = ease.inOut(t);
          place(ghostCover, {
            x: lerp(fromCover.x, toCover.x, k),
            y: lerp(fromCover.y, toCover.y, k),
            w: lerp(fromCover.w, toCover.w, k),
            h: lerp(fromCover.h, toCover.h, k)
          });
          place(ghostTitle, {
            x: lerp(fromTitle.x, toTitle.x, k),
            y: lerp(fromTitle.y, toTitle.y, k),
            w: lerp(fromTitle.w, toTitle.w, k),
            h: lerp(fromTitle.h, toTitle.h, k)
          });
          ghostTitle.style.fontSize = lerp(9, 13, k) + 'px';
          detail.style.opacity = String(0.2 + 0.8 * k);
          if (t < 1) {
            rafA = requestAnimationFrame(frame);
          } else {
            ghostCover.remove(); ghostTitle.remove();
            detail.style.transition = '';
            isOpen = true;
            animating = false;
          }
        }
        let rafA = requestAnimationFrame(frame);
        cleanups.push(() => { try { cancelAnimationFrame(rafA); } catch (e) {} });
      }

      function animateCollapse() {
        if (animating || !isOpen) return;
        animating = true;
        // find active tile
        const tile = tiles.find(t => t.getAttribute('data-active') === '1') || tiles[0];
        const item = SHARED_ITEMS[+tile.dataset.idx] || SHARED_ITEMS[0];

        const toCover = rectIn(tile.querySelector('.mfx-shared-cover'), root);
        const toTitle = rectIn(tile.querySelector('.mfx-shared-title'), root);
        const fromCover = rectIn(dCover, root);
        const fromTitle = rectIn(dTitle, root);

        const ghostCover = document.createElement('div');
        ghostCover.className = 'mfx-shared-ghost';
        const ghostTitle = document.createElement('div');
        ghostTitle.className = 'mfx-shared-ghost';
        ghostTitle.style.background = 'transparent';
        ghostTitle.style.border = 'none';
        ghostTitle.style.display = 'flex';
        ghostTitle.style.alignItems = 'flex-end';
        ghostTitle.style.paddingLeft = '6px';
        ghostTitle.style.fontFamily = 'var(--mono)';
        ghostTitle.style.color = 'var(--text)';
        ghostTitle.style.fontWeight = '600';
        ghostTitle.textContent = item.t;
        root.appendChild(ghostCover); root.appendChild(ghostTitle);

        const place = (g, r) => {
          g.style.transform = `translate(${r.x}px, ${r.y}px)`;
          g.style.width = r.w + 'px'; g.style.height = r.h + 'px';
        };
        place(ghostCover, fromCover);
        place(ghostTitle, fromTitle);
        detail.style.transition = 'none';
        detail.style.opacity = '0';
        detail.classList.remove('is-open');

        const dur = prefersReducedMotion.matches ? 0 : 420;
        const start = performance.now();
        function frame(now) {
          if (!root.isConnected) return;
          const t = dur === 0 ? 1 : Math.min(1, (now - start) / dur);
          const k = ease.inOut(t);
          place(ghostCover, {
            x: lerp(fromCover.x, toCover.x, k),
            y: lerp(fromCover.y, toCover.y, k),
            w: lerp(fromCover.w, toCover.w, k),
            h: lerp(fromCover.h, toCover.h, k)
          });
          place(ghostTitle, {
            x: lerp(fromTitle.x, toTitle.x, k),
            y: lerp(fromTitle.y, toTitle.y, k),
            w: lerp(fromTitle.w, toTitle.w, k),
            h: lerp(fromTitle.h, toTitle.h, k)
          });
          ghostTitle.style.fontSize = lerp(13, 9, k) + 'px';
          grid.style.opacity = String(0.35 + 0.65 * k);
          if (t < 1) {
            rafA = requestAnimationFrame(frame);
          } else {
            ghostCover.remove(); ghostTitle.remove();
            tile.style.opacity = '';
            tile.removeAttribute('data-active');
            grid.style.opacity = '';
            detail.style.transition = '';
            isOpen = false;
            animating = false;
          }
        }
        let rafA = requestAnimationFrame(frame);
        cleanups.push(() => { try { cancelAnimationFrame(rafA); } catch (e) {} });
      }

      function cycleStep() {
        if (!isOpen) {
          idx = (idx + 1) % tiles.length;
          animateExpand(tiles[idx]);
          timer = setTimeout(cycleStep, 1900);
        } else {
          animateCollapse();
          timer = setTimeout(cycleStep, 1400);
        }
      }

      // manual click handlers
      function onClick(e) {
        const tile = e.target.closest('.mfx-shared-tile');
        const close = e.target.closest('.mfx-shared-detail-close');
        if (close && isOpen) {
          clearTimeout(timer); timer = 0;
          animateCollapse();
          timer = setTimeout(cycleStep, 2200);
          return;
        }
        if (tile && !isOpen) {
          clearTimeout(timer); timer = 0;
          idx = +tile.dataset.idx;
          animateExpand(tile);
          timer = setTimeout(cycleStep, 2200);
        }
      }
      root.addEventListener('click', onClick);

      const cleanups = [];
      return {
        start() {
          if (timer) return;
          if (prefersReducedMotion.matches) {
            // static preview: pick first card and open detail without animation
            dTitle.textContent = SHARED_ITEMS[0].t;
            dStatus.textContent = SHARED_ITEMS[0].s + ' · DETAIL';
            detail.classList.add('is-open');
            detail.style.opacity = '1';
            return;
          }
          timer = setTimeout(cycleStep, 900);
        },
        stop() {
          if (timer) { clearTimeout(timer); timer = 0; }
        },
        destroy() {
          if (timer) clearTimeout(timer);
          cleanups.forEach(fn => fn());
          root.removeEventListener('click', onClick);
        }
      };
    }
  });

  // =====================================================================
  // 19  search_suggest_reveal
  // =====================================================================
  const SEARCH_QUERIES = [
    { q: 'motion', results: [
      { i: '◇', t: 'Motion design principles', m: 'GUIDE · 12 min' },
      { i: '◇', t: 'Motion easing curves',     m: 'REF · cheatsheet' },
      { i: '◇', t: 'Motion budget audit',      m: 'TEMPLATE' },
      { i: '◇', t: 'Motion choreography 101',  m: 'COURSE · 04' }
    ]},
    { q: 'flip', results: [
      { i: '↺', t: 'FLIP technique deep dive', m: 'ARTICLE' },
      { i: '↺', t: 'FLIP reflow for filters',  m: 'PATTERN' },
      { i: '↺', t: 'FLIP vs WAAPI tradeoffs',  m: 'NOTES' }
    ]},
    { q: 'xyzzy', results: [] },
    { q: 'tokens', results: [
      { i: '◆', t: 'Tokens · color scales',  m: 'SYSTEM' },
      { i: '◆', t: 'Tokens · type ramp',     m: 'SYSTEM' },
      { i: '◆', t: 'Tokens · motion ramp',   m: 'NEW' },
      { i: '◆', t: 'Tokens · spacing 8pt',   m: 'BASE' },
      { i: '◆', t: 'Tokens · shadow elev',   m: 'SYSTEM' }
    ]}
  ];
  function searchHighlight(text, q) {
    if (!q) return escapeHtml(text);
    const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
    return escapeHtml(text).replace(re, '<mark>$1</mark>');
  }
  window.MotionEffects.register('search_suggest_reveal', {
    card({ module, cat }) {
      return `
        <div class="mfx-search" data-mfx="search">
          <div class="mfx-search-input">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
            <span class="mfx-search-query"></span><span class="mfx-search-caret"></span>
          </div>
          <div class="mfx-search-list"></div>
        </div>`;
    },
    modal(args) {
      // bigger version: same markup, just rendered into a larger stage
      return this.card(args);
    },
    init(stageEl, { prefersReducedMotion, isModal }) {
      const root = stageEl.querySelector('[data-mfx="search"]');
      if (!root) return { destroy() {} };
      const queryEl = root.querySelector('.mfx-search-query');
      const listEl = root.querySelector('.mfx-search-list');
      let timers = [];
      let cancelled = false;
      let cycleIdx = 0;

      function clearTimers() {
        timers.forEach(t => clearTimeout(t));
        timers = [];
      }

      function setQuery(text) { queryEl.textContent = text; }

      function showResults(query, results) {
        listEl.innerHTML = '';
        if (!results.length) {
          const empty = document.createElement('div');
          empty.className = 'mfx-search-empty';
          empty.innerHTML = `<div class="glyph">∅</div><div>No matches for "${escapeHtml(query)}"</div><div style="font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-faint)">Try fewer terms</div>`;
          listEl.appendChild(empty);
          requestAnimationFrame(() => empty.classList.add('is-in'));
          return;
        }
        const cap = isModal ? results.length : Math.min(results.length, 4);
        for (let i = 0; i < cap; i++) {
          const r = results[i];
          const row = document.createElement('div');
          row.className = 'mfx-search-row';
          row.innerHTML = `
            <span class="ico">${r.i}</span>
            <span class="text">${searchHighlight(r.t, query)}</span>
            <span class="meta">${escapeHtml(r.m)}</span>`;
          listEl.appendChild(row);
          if (prefersReducedMotion.matches) {
            row.classList.add('is-in');
          } else {
            timers.push(setTimeout(() => {
              if (!cancelled) row.classList.add('is-in');
            }, 60 + i * 70));
          }
        }
      }

      function typeQuery(text, done) {
        if (prefersReducedMotion.matches) { setQuery(text); done(); return; }
        let i = 0;
        setQuery('');
        function step() {
          if (cancelled) return;
          i++;
          setQuery(text.slice(0, i));
          if (i < text.length) timers.push(setTimeout(step, 70 + Math.random() * 50));
          else timers.push(setTimeout(done, 260));
        }
        step();
      }

      function deleteQuery(done) {
        if (prefersReducedMotion.matches) { setQuery(''); done(); return; }
        let cur = queryEl.textContent;
        function step() {
          if (cancelled) return;
          cur = cur.slice(0, -1);
          setQuery(cur);
          if (cur.length) timers.push(setTimeout(step, 35));
          else timers.push(setTimeout(done, 200));
        }
        step();
      }

      function cycle() {
        if (cancelled) return;
        const item = SEARCH_QUERIES[cycleIdx % SEARCH_QUERIES.length];
        cycleIdx++;
        typeQuery(item.q, () => {
          showResults(item.q, item.results);
          timers.push(setTimeout(() => {
            // fade rows out, then delete query
            Array.from(listEl.children).forEach(r => {
              r.classList.remove('is-in');
            });
            timers.push(setTimeout(() => deleteQuery(cycle), 280));
          }, 2400));
        });
      }

      return {
        start() {
          if (timers.length) return;
          cancelled = false;
          cycleIdx = 0;
          cycle();
        },
        stop() {
          cancelled = true;
          clearTimers();
        },
        destroy() {
          cancelled = true;
          clearTimers();
        }
      };
    }
  });

  // =====================================================================
  // 20  filter_reflow  — FLIP reflow over 3 fake filter sets
  // =====================================================================
  const REFLOW_FILTERS = [
    { label: 'ALL',    pick: i => true },
    { label: 'CORE',   pick: i => i % 2 === 0 },
    { label: 'EXTRA',  pick: i => i % 3 !== 0 }
  ];
  const REFLOW_ALL = ['A1','A2','B1','B2','C1','C2','D1','D2','E1','E2'];
  window.MotionEffects.register('filter_reflow', {
    card({ module, cat }) {
      const chips = REFLOW_FILTERS.map((f, i) => `
        <button class="mfx-reflow-chip ${i===0?'is-active':''}" data-i="${i}">${f.label}</button>`).join('');
      return `
        <div class="mfx-reflow" data-mfx="reflow">
          <div class="mfx-reflow-chips">${chips}</div>
          <div class="mfx-reflow-grid"></div>
        </div>`;
    },
    modal(args) { return this.card(args); },
    init(stageEl, { prefersReducedMotion, isModal }) {
      const root = stageEl.querySelector('[data-mfx="reflow"]');
      if (!root) return { destroy() {} };
      const gridEl = root.querySelector('.mfx-reflow-grid');
      const chipEls = Array.from(root.querySelectorAll('.mfx-reflow-chip'));
      let timer = 0;
      let cycleIdx = 0;
      // we maintain a stable element per label so FLIP can reuse nodes
      const labelToNode = new Map();

      function ensureNodes(labels) {
        labels.forEach(l => {
          if (!labelToNode.has(l)) {
            const el = document.createElement('div');
            el.className = 'mfx-reflow-tile';
            el.setAttribute('data-label', l);
            labelToNode.set(l, el);
          }
        });
      }

      function rectIn(el) {
        const r = el.getBoundingClientRect();
        const rr = gridEl.getBoundingClientRect();
        return { x: r.left - rr.left, y: r.top - rr.top, w: r.width, h: r.height };
      }

      function applyFilter(idx, animate) {
        const filter = REFLOW_FILTERS[idx % REFLOW_FILTERS.length];
        const wantedLabels = REFLOW_ALL.filter((_, i) => filter.pick(i));
        ensureNodes(wantedLabels);
        chipEls.forEach((c, i) => c.classList.toggle('is-active', i === idx));

        // capture FIRST positions for all currently mounted nodes
        const first = new Map();
        Array.from(gridEl.children).forEach(node => {
          first.set(node, rectIn(node));
        });

        // determine kept / leaving / entering
        const currentSet = new Set(Array.from(gridEl.children));
        const wantedNodes = wantedLabels.map(l => labelToNode.get(l));
        const wantedSet = new Set(wantedNodes);
        const leaving = Array.from(currentSet).filter(n => !wantedSet.has(n));
        const entering = wantedNodes.filter(n => !currentSet.has(n));

        // 1) leaving: fade+shrink then remove
        const leaveDur = animate && !prefersReducedMotion.matches ? 280 : 0;
        leaving.forEach((node, i) => {
          node.setAttribute('data-state', 'leaving');
          node.style.transition = `transform ${leaveDur}ms cubic-bezier(.4,0,.2,1), opacity ${leaveDur}ms ease`;
          node.style.transitionDelay = (i * 25) + 'ms';
          // queue removal
          requestAnimationFrame(() => {
            node.style.transform = 'scale(.4)';
            node.style.opacity = '0';
          });
          setTimeout(() => { try { node.remove(); } catch (e) {} }, leaveDur + i * 25 + 30);
        });

        // 2) rearrange DOM order to wanted order, append entering at end
        wantedNodes.forEach(n => gridEl.appendChild(n));

        // 3) measure LAST positions and FLIP kept nodes
        requestAnimationFrame(() => {
          wantedNodes.forEach((node, i) => {
            const last = rectIn(node);
            const isEntering = entering.includes(node);
            if (isEntering) {
              // entering: stagger fade-in from scale .7
              node.style.transition = 'none';
              node.style.opacity = '0';
              node.style.transform = 'scale(.7)';
              requestAnimationFrame(() => {
                node.style.transition = `transform 380ms cubic-bezier(.2,.8,.2,1), opacity 380ms ease`;
                node.style.transitionDelay = (180 + i * 45) + 'ms';
                node.style.opacity = '1';
                node.style.transform = 'scale(1)';
              });
            } else {
              const f = first.get(node);
              if (!f) return;
              const dx = f.x - last.x, dy = f.y - last.y;
              if ((Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) || prefersReducedMotion.matches) return;
              node.style.transition = 'none';
              node.style.transform = `translate(${dx}px, ${dy}px)`;
              requestAnimationFrame(() => {
                node.style.transition = `transform 480ms cubic-bezier(.2,.8,.2,1)`;
                node.style.transform = 'translate(0,0)';
              });
            }
          });
        });
      }

      function cycle() {
        cycleIdx = (cycleIdx + 1) % REFLOW_FILTERS.length;
        applyFilter(cycleIdx, true);
        timer = setTimeout(cycle, 3100);
      }

      function onChip(e) {
        const b = e.target.closest('.mfx-reflow-chip');
        if (!b) return;
        clearTimeout(timer);
        cycleIdx = +b.dataset.i;
        applyFilter(cycleIdx, true);
        timer = setTimeout(cycle, 3600);
      }
      root.addEventListener('click', onChip);

      // initial mount: all
      applyFilter(0, false);

      return {
        start() {
          if (timer) return;
          if (prefersReducedMotion.matches) return;
          timer = setTimeout(cycle, 1500);
        },
        stop() { if (timer) { clearTimeout(timer); timer = 0; } },
        destroy() {
          if (timer) clearTimeout(timer);
          root.removeEventListener('click', onChip);
        }
      };
    }
  });

  // =====================================================================
  // 21  drag_reorder_ghost
  // =====================================================================
  const DRAG_ROWS = [
    { t: 'Hero Banner',     m: 'HERO' },
    { t: 'Feature Grid',    m: 'FEAT' },
    { t: 'Logo Wall',       m: 'PROOF'},
    { t: 'Pricing Table',   m: 'PRICE'},
    { t: 'Footer CTA',      m: 'CTA'  }
  ];
  window.MotionEffects.register('drag_reorder_ghost', {
    card({ module, cat }) {
      const rows = DRAG_ROWS.map((r, i) => `
        <div class="mfx-drag-row" data-i="${i}">
          <span class="grip"><i></i><i></i><i></i></span>
          <span class="text">${r.t}</span>
          <span class="meta">${r.m}</span>
        </div>`).join('');
      return `
        <div class="mfx-drag" data-mfx="drag">
          <div class="mfx-drag-list">${rows}</div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('[data-mfx="drag"]');
      if (!root) return { destroy() {} };
      const listEl = root.querySelector('.mfx-drag-list');
      let rows = Array.from(listEl.children);
      let dragging = null;
      let placeholder = null;
      let ghostOffsetY = 0;
      let ghostStartY = 0;
      let pointerStartY = 0;
      let rowH = 30;
      let userInteracted = false;
      let autoTimer = 0;
      let isAutoRunning = false;

      function syncOrder() { rows = Array.from(listEl.children); }

      function startDrag(row, clientY) {
        if (dragging) return;
        userInteracted = true;
        if (autoTimer) { clearTimeout(autoTimer); autoTimer = 0; }
        const rect = row.getBoundingClientRect();
        rowH = rect.height + 4; // 4px gap from CSS
        dragging = row;
        placeholder = row.cloneNode(true);
        placeholder.setAttribute('data-state', 'placeholder');
        listEl.insertBefore(placeholder, row);
        row.setAttribute('data-state', 'ghost');
        row.setAttribute('data-no-transition', '1');
        ghostStartY = row.offsetTop;
        pointerStartY = clientY;
        ghostOffsetY = 0;
        row.style.position = 'absolute';
        row.style.left = '0'; row.style.right = '0';
        row.style.top = ghostStartY + 'px';
        row.style.transform = 'translateY(0) scale(1.02)';
      }

      function moveDrag(clientY) {
        if (!dragging) return;
        ghostOffsetY = clientY - pointerStartY;
        dragging.style.transform = `translateY(${ghostOffsetY}px) scale(1.02)`;

        // determine new index based on ghost center
        const ghostCenter = ghostStartY + ghostOffsetY + dragging.offsetHeight / 2;
        const siblings = Array.from(listEl.children).filter(n => n !== dragging && n !== placeholder);
        // include placeholder in layout calculation but compute via stable rows
        const targetIdx = (() => {
          let acc = 0;
          for (let i = 0; i < siblings.length; i++) {
            const s = siblings[i];
            const top = s.offsetTop;
            const mid = top + s.offsetHeight / 2;
            if (ghostCenter < mid) return i;
          }
          return siblings.length;
        })();
        // reinsert placeholder at targetIdx
        const refNode = siblings[targetIdx] || null;
        if (placeholder.nextSibling !== refNode && placeholder !== refNode) {
          listEl.insertBefore(placeholder, refNode);
        }
      }

      function endDrag() {
        if (!dragging) return;
        const target = dragging;
        const finalTop = placeholder.offsetTop;
        // animate to placeholder position
        target.style.transition = 'transform .25s cubic-bezier(.2,.8,.2,1)';
        target.style.transform = `translateY(${finalTop - ghostStartY}px) scale(1)`;
        setTimeout(() => {
          // swap target into placeholder slot
          listEl.insertBefore(target, placeholder);
          placeholder.remove();
          target.style.position = '';
          target.style.left = ''; target.style.right = '';
          target.style.top = '';
          target.style.transform = '';
          target.style.transition = '';
          target.removeAttribute('data-state');
          target.removeAttribute('data-no-transition');
          placeholder = null;
          dragging = null;
          syncOrder();
        }, prefersReducedMotion.matches ? 0 : 260);
      }

      function onPointerDown(e) {
        const row = e.target.closest('.mfx-drag-row');
        if (!row || row === placeholder) return;
        try { row.setPointerCapture(e.pointerId); } catch (err) {}
        startDrag(row, e.clientY);
        function onMove(ev) { moveDrag(ev.clientY); }
        function onUp() {
          try { row.releasePointerCapture(e.pointerId); } catch (err) {}
          root.removeEventListener('pointermove', onMove);
          root.removeEventListener('pointerup', onUp);
          root.removeEventListener('pointercancel', onUp);
          endDrag();
          // restart auto-demo timer
          autoTimer = setTimeout(runAutoDemo, 5000);
        }
        root.addEventListener('pointermove', onMove);
        root.addEventListener('pointerup', onUp);
        root.addEventListener('pointercancel', onUp);
      }

      function runAutoDemo() {
        if (prefersReducedMotion.matches) return;
        if (dragging) return;
        if (!root.isConnected) return;
        syncOrder();
        if (rows.length < 2) return;
        // virtually drag a row to a different position
        const srcIdx = Math.floor(Math.random() * rows.length);
        let dstIdx = Math.floor(Math.random() * rows.length);
        if (dstIdx === srcIdx) dstIdx = (srcIdx + 1) % rows.length;
        const row = rows[srcIdx];
        const rect = row.getBoundingClientRect();
        const startY = rect.top + rect.height / 2;
        startDrag(row, startY);
        const dstRow = rows[dstIdx];
        const dstRect = dstRow.getBoundingClientRect();
        const targetY = (dstIdx > srcIdx
          ? dstRect.top + dstRect.height
          : dstRect.top);
        const distance = targetY - startY;
        const dur = 700;
        const t0 = performance.now();
        function step(now) {
          if (!dragging || !root.isConnected) return;
          const t = Math.min(1, (now - t0) / dur);
          const k = ease.inOut(t);
          moveDrag(startY + distance * k);
          if (t < 1) {
            autoRaf = requestAnimationFrame(step);
          } else {
            endDrag();
            autoTimer = setTimeout(runAutoDemo, 2200);
          }
        }
        let autoRaf = requestAnimationFrame(step);
      }

      root.addEventListener('pointerdown', onPointerDown);

      return {
        start() {
          if (isAutoRunning) return;
          isAutoRunning = true;
          if (prefersReducedMotion.matches) return;
          autoTimer = setTimeout(runAutoDemo, 1100);
        },
        stop() {
          isAutoRunning = false;
          if (autoTimer) { clearTimeout(autoTimer); autoTimer = 0; }
        },
        destroy() {
          if (autoTimer) clearTimeout(autoTimer);
          root.removeEventListener('pointerdown', onPointerDown);
        }
      };
    }
  });

  // =====================================================================
  // 22  form_validation_stack
  // =====================================================================
  window.MotionEffects.register('form_validation_stack', {
    card({ module, cat }) {
      return `
        <div class="mfx-form" data-mfx="form">
          <div>
            <div class="mfx-form-label">EMAIL</div>
            <div class="mfx-form-field" data-state="idle">
              <span class="val"></span><span class="caret"></span>
              <span class="mfx-form-check">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8.5 L6.5 12 L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
            <div class="mfx-form-message">Looks invalid — missing @ domain</div>
          </div>
          <div class="mfx-form-hint">// VALIDATION · BLUR-TRIGGERED</div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('[data-mfx="form"]');
      if (!root) return { destroy() {} };
      const field = root.querySelector('.mfx-form-field');
      const valEl = field.querySelector('.val');
      const msgEl = root.querySelector('.mfx-form-message');
      let timers = [];
      let cancelled = false;

      function clearTimers() {
        timers.forEach(t => clearTimeout(t));
        timers = [];
      }

      function type(text, opts, done) {
        if (prefersReducedMotion.matches) {
          valEl.textContent = text; done && done(); return;
        }
        valEl.textContent = '';
        let i = 0;
        const step = () => {
          if (cancelled) return;
          i++;
          valEl.textContent = text.slice(0, i);
          if (i < text.length) timers.push(setTimeout(step, (opts && opts.speed) || 65));
          else done && timers.push(setTimeout(done, 260));
        };
        step();
      }

      function cycle() {
        if (cancelled) return;
        field.setAttribute('data-state', 'focus');
        msgEl.textContent = 'Looks invalid — missing @ domain';
        type('alex.designer', null, () => {
          // blur
          timers.push(setTimeout(() => {
            field.setAttribute('data-state', 'error');
            timers.push(setTimeout(() => {
              // refocus, correct
              field.setAttribute('data-state', 'focus');
              type('alex@motion.dev', { speed: 55 }, () => {
                timers.push(setTimeout(() => {
                  field.setAttribute('data-state', 'success');
                  timers.push(setTimeout(() => {
                    field.setAttribute('data-state', 'idle');
                    valEl.textContent = '';
                    timers.push(setTimeout(cycle, 800));
                  }, 1600));
                }, 320));
              });
            }, 1500));
          }, 220));
        });
      }

      return {
        start() {
          if (timers.length) return;
          cancelled = false;
          if (prefersReducedMotion.matches) {
            field.setAttribute('data-state', 'error');
            valEl.textContent = 'alex.designer';
            return;
          }
          timers.push(setTimeout(cycle, 600));
        },
        stop() { cancelled = true; clearTimers(); },
        destroy() { cancelled = true; clearTimers(); }
      };
    }
  });

  // =====================================================================
  // 24  upload_dropzone
  // =====================================================================
  window.MotionEffects.register('upload_dropzone', {
    card({ module, cat }) {
      return `
        <div class="mfx-upload" data-mfx="upload">
          <div class="mfx-upload-zone" data-state="idle">
            <div class="mfx-upload-icon">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 16V4M8 8l4-4 4 4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
              </svg>
            </div>
            <div class="mfx-upload-label">DROP TO UPLOAD</div>
            <div class="mfx-upload-progress"><i></i></div>
          </div>
          <div class="mfx-upload-row">
            <span class="glyph">◈</span>
            <span class="name">poster-final-v4.png</span>
            <span class="size">2.4 MB</span>
          </div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('[data-mfx="upload"]');
      if (!root) return { destroy() {} };
      const zone = root.querySelector('.mfx-upload-zone');
      const fill = root.querySelector('.mfx-upload-progress > i');
      const row = root.querySelector('.mfx-upload-row');
      const label = zone.querySelector('.mfx-upload-label');
      let timer = 0;
      let cancelled = false;
      let raf = 0;

      function setState(s) { zone.setAttribute('data-state', s); }

      function cycle() {
        if (cancelled) return;
        setState('idle'); fill.style.width = '0%'; row.classList.remove('is-in');
        label.textContent = 'DROP TO UPLOAD';
        timer = setTimeout(() => {
          setState('hover'); label.textContent = 'RELEASE TO START';
          timer = setTimeout(() => {
            setState('upload'); label.textContent = 'UPLOADING…';
            const dur = prefersReducedMotion.matches ? 0 : 1500;
            const t0 = performance.now();
            function step(now) {
              if (cancelled) return;
              const t = dur === 0 ? 1 : Math.min(1, (now - t0) / dur);
              fill.style.width = (ease.out(t) * 100).toFixed(2) + '%';
              if (t < 1) {
                raf = requestAnimationFrame(step);
              } else {
                setState('done'); label.textContent = 'COMPLETE';
                row.classList.add('is-in');
                timer = setTimeout(cycle, 1800);
              }
            }
            raf = requestAnimationFrame(step);
          }, 900);
        }, 900);
      }

      return {
        start() {
          if (timer) return;
          cancelled = false;
          if (prefersReducedMotion.matches) {
            setState('done'); fill.style.width = '100%'; row.classList.add('is-in');
            label.textContent = 'COMPLETE';
            return;
          }
          timer = setTimeout(cycle, 500);
        },
        stop() {
          cancelled = true;
          if (timer) { clearTimeout(timer); timer = 0; }
          if (raf) cancelAnimationFrame(raf);
        },
        destroy() {
          cancelled = true;
          if (timer) clearTimeout(timer);
          if (raf) cancelAnimationFrame(raf);
        }
      };
    }
  });

  // =====================================================================
  // 25  skeleton_to_content  — FLIP from skeleton rectangles into final blocks
  // =====================================================================
  // Real layout uses percent positions so it scales for card vs modal.
  // Skeleton positions are slight perturbations of real positions so the
  // morph reads as a snap-into-place.
  const SK_REAL = [
    { kind: 'avatar', x: 4,  y: 4,  w: 18, h: 22, text: 'A' },
    { kind: 'title', x: 26, y: 6,  w: 70, h: 9,  text: 'Project Constellation' },
    { kind: 'meta',  x: 26, y: 16, w: 50, h: 6,  text: 'UPDATED · 5 min ago' },
    { kind: 'line',  x: 4,  y: 32, w: 92, h: 7,  text: 'Skeleton blocks morph their position, size and opacity' },
    { kind: 'line',  x: 4,  y: 42, w: 86, h: 7,  text: 'directly into the real content layout — no flash, no jump.' },
    { kind: 'line',  x: 4,  y: 52, w: 78, h: 7,  text: 'FLIP technique: transform from cached rect to target.' },
    { kind: 'tag',   x: 4,  y: 78, w: 22, h: 14, text: 'FLIP' },
    { kind: 'tag',   x: 28, y: 78, w: 26, h: 14, text: 'LOADING' },
    { kind: 'tag',   x: 56, y: 78, w: 24, h: 14, text: 'MORPH' }
  ];
  const SK_SKELETON = [
    { shape: 'avatar', x: 4,  y: 4,  w: 18, h: 22 },
    { shape: 'bar',    x: 26, y: 7,  w: 60, h: 7 },
    { shape: 'bar',    x: 26, y: 17, w: 40, h: 5 },
    { shape: 'bar',    x: 4,  y: 32, w: 92, h: 6 },
    { shape: 'bar',    x: 4,  y: 42, w: 80, h: 6 },
    { shape: 'bar',    x: 4,  y: 52, w: 70, h: 6 },
    { shape: 'bar',    x: 4,  y: 78, w: 22, h: 12 },
    { shape: 'bar',    x: 28, y: 78, w: 26, h: 12 },
    { shape: 'bar',    x: 56, y: 78, w: 24, h: 12 }
  ];
  window.MotionEffects.register('skeleton_to_content', {
    card({ module, cat }) {
      const skeletons = SK_SKELETON.map((s, i) => `
        <div class="mfx-sk-block" data-shape="${s.shape}" data-i="${i}"
             style="left:${s.x}%;top:${s.y}%;width:${s.w}%;height:${s.h}%"></div>`).join('');
      const reals = SK_REAL.map((r, i) => `
        <div class="mfx-sk-real" data-kind="${r.kind}" data-i="${i}"
             style="left:${r.x}%;top:${r.y}%;width:${r.w}%;height:${r.h}%">${escapeHtml(r.text)}</div>`).join('');
      return `
        <div class="mfx-sk" data-mfx="sk">
          <div style="display:flex;gap:6px;align-items:center;font-size:9px;letter-spacing:.14em;color:var(--text-faint);text-transform:uppercase">
            <span style="width:6px;height:6px;border-radius:50%;background:var(--cc);box-shadow:0 0 8px var(--cc)"></span>
            <span class="mfx-sk-state">FETCHING…</span>
          </div>
          <div class="mfx-sk-stage">${skeletons}${reals}</div>
        </div>`;
    },
    modal(args) { return this.card(args); },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('[data-mfx="sk"]');
      if (!root) return { destroy() {} };
      const stage = root.querySelector('.mfx-sk-stage');
      const stateEl = root.querySelector('.mfx-sk-state');
      const skeletons = Array.from(root.querySelectorAll('.mfx-sk-block'));
      const reals = Array.from(root.querySelectorAll('.mfx-sk-real'));
      let timer = 0;
      let cancelled = false;
      let phase = 0; // 0: skeleton showing, 1: morphed to content

      function reset() {
        skeletons.forEach(s => {
          s.style.transition = 'none';
          s.style.opacity = '1';
          s.style.transform = '';
        });
        reals.forEach(r => {
          r.classList.remove('is-in');
        });
        stateEl.textContent = 'FETCHING…';
        phase = 0;
      }

      function rectIn(el) {
        const r = el.getBoundingClientRect();
        const sr = stage.getBoundingClientRect();
        return { x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height };
      }

      function morph() {
        if (cancelled) return;
        stateEl.textContent = 'RENDERING…';
        // pair each skeleton index with same-index real
        skeletons.forEach((sk, i) => {
          const real = reals[i];
          if (!real) return;
          const skR = rectIn(sk);
          const reR = rectIn(real);
          // animate sk from current rect to real rect
          const dx = reR.x - skR.x;
          const dy = reR.y - skR.y;
          const sx = reR.w / skR.w;
          const sy = reR.h / skR.h;
          const dur = prefersReducedMotion.matches ? 0 : 520 + (i % 4) * 60;
          sk.style.transformOrigin = 'top left';
          sk.style.transition = `transform ${dur}ms cubic-bezier(.2,.8,.2,1), opacity ${dur}ms ease`;
          sk.style.transitionDelay = (i * 35) + 'ms';
          sk.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
          sk.style.opacity = '0';
          // reveal real with a slight delay
          setTimeout(() => {
            if (!cancelled) real.classList.add('is-in');
          }, (dur * 0.55) + i * 35);
        });
        setTimeout(() => { if (!cancelled) stateEl.textContent = 'READY'; }, 900);
        phase = 1;
      }

      let cycleTimers = [];
      function cycle() {
        if (cancelled) return;
        cycleTimers.forEach(t => clearTimeout(t));
        cycleTimers = [];
        reset();
        // ensure layout settled
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            cycleTimers.push(setTimeout(morph, prefersReducedMotion.matches ? 0 : 1100));
            cycleTimers.push(setTimeout(() => {
              if (cancelled) return;
              cycle();
            }, 4200));
            timer = cycleTimers[0];
          });
        });
      }

      return {
        start() {
          if (timer) return;
          cancelled = false;
          if (prefersReducedMotion.matches) {
            // static: hide skeletons, show reals
            skeletons.forEach(s => s.style.opacity = '0');
            reals.forEach(r => r.classList.add('is-in'));
            stateEl.textContent = 'READY';
            return;
          }
          cycle();
        },
        stop() {
          cancelled = true;
          if (timer) { clearTimeout(timer); timer = 0; }
          cycleTimers.forEach(t => clearTimeout(t));
          cycleTimers = [];
        },
        destroy() {
          cancelled = true;
          if (timer) clearTimeout(timer);
          cycleTimers.forEach(t => clearTimeout(t));
          cycleTimers = [];
        }
      };
    }
  });

  // =====================================================================
  // 30  chart_data_transition
  // =====================================================================
  const CHART_SETS = [
    { label: 'Q1 — VELOCITY',
      bars: [22, 38, 30, 50, 44, 60, 72],
      line: [30, 45, 38, 58, 50, 66, 80] },
    { label: 'Q2 — RETENTION',
      bars: [60, 54, 42, 48, 36, 30, 28],
      line: [70, 64, 50, 58, 44, 38, 34] },
    { label: 'Q3 — DEMAND',
      bars: [12, 20, 34, 28, 56, 64, 70],
      line: [18, 26, 40, 36, 64, 72, 84] }
  ];
  window.MotionEffects.register('chart_data_transition', {
    card({ module, cat }) {
      return `
        <div class="mfx-chart" data-mfx="chart">
          <div class="mfx-chart-head">
            <span class="mfx-chart-title">DATA TRANSITION</span>
            <span class="mfx-chart-label">${CHART_SETS[0].label}</span>
          </div>
          <svg class="mfx-chart-svg" viewBox="0 0 200 100" preserveAspectRatio="none">
            <g class="mfx-chart-axis"></g>
            <g class="mfx-chart-bars"></g>
            <path class="mfx-chart-area" d=""/>
            <path class="mfx-chart-line" d=""/>
            <g class="mfx-chart-points"></g>
            <g class="mfx-chart-ticks"></g>
          </svg>
        </div>`;
    },
    modal(args) { return this.card(args); },
    init(stageEl, { prefersReducedMotion, isModal }) {
      const root = stageEl.querySelector('[data-mfx="chart"]');
      if (!root) return { destroy() {} };
      const svg = root.querySelector('.mfx-chart-svg');
      const axisG = root.querySelector('.mfx-chart-axis');
      const barsG = root.querySelector('.mfx-chart-bars');
      const pointsG = root.querySelector('.mfx-chart-points');
      const ticksG = root.querySelector('.mfx-chart-ticks');
      const linePath = root.querySelector('.mfx-chart-line');
      const areaPath = root.querySelector('.mfx-chart-area');
      const labelEl = root.querySelector('.mfx-chart-label');

      const W = 200, H = 100;
      const padL = 8, padR = 8, padT = 6, padB = 14;
      const innerW = W - padL - padR;
      const innerH = H - padT - padB;

      const N = CHART_SETS[0].bars.length;
      const barW = (innerW / N) * 0.55;
      const barStep = innerW / N;

      // build static axis
      axisG.innerHTML = `<line x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}"/>`;

      // create bar + point elements once
      const barEls = [];
      const pointEls = [];
      for (let i = 0; i < N; i++) {
        const b = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        b.classList.add('mfx-chart-bar');
        const cx = padL + barStep * i + (barStep - barW) / 2;
        b.setAttribute('x', cx);
        b.setAttribute('width', barW);
        b.setAttribute('rx', 1.5);
        barsG.appendChild(b);
        barEls.push(b);
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        p.classList.add('mfx-chart-point');
        p.setAttribute('r', 1.8);
        pointsG.appendChild(p);
        pointEls.push(p);
      }

      // initial draw
      let current = {
        bars: CHART_SETS[0].bars.slice(),
        line: CHART_SETS[0].line.slice()
      };
      let target = current;
      let cycleIdx = 0;
      let raf = 0;
      let cancelled = false;
      let cycleTimer = 0;
      let animStart = 0;
      const DUR = 700;

      function yFor(v) { return padT + innerH - (v / 100) * innerH; }
      function buildLinePath(values) {
        let d = '';
        for (let i = 0; i < N; i++) {
          const x = padL + barStep * i + barStep / 2;
          const y = yFor(values[i]);
          d += (i === 0 ? `M${x.toFixed(2)},${y.toFixed(2)}` : ` L${x.toFixed(2)},${y.toFixed(2)}`);
        }
        return d;
      }
      function buildAreaPath(values) {
        let d = '';
        for (let i = 0; i < N; i++) {
          const x = padL + barStep * i + barStep / 2;
          const y = yFor(values[i]);
          d += (i === 0 ? `M${x.toFixed(2)},${y.toFixed(2)}` : ` L${x.toFixed(2)},${y.toFixed(2)}`);
        }
        d += ` L${(padL + innerW - barStep / 2).toFixed(2)},${(H - padB).toFixed(2)} L${(padL + barStep / 2).toFixed(2)},${(H - padB).toFixed(2)} Z`;
        return d;
      }

      function render(values) {
        for (let i = 0; i < N; i++) {
          const y = yFor(values.bars[i]);
          barEls[i].setAttribute('y', y);
          barEls[i].setAttribute('height', H - padB - y);
          const lx = padL + barStep * i + barStep / 2;
          const ly = yFor(values.line[i]);
          pointEls[i].setAttribute('cx', lx);
          pointEls[i].setAttribute('cy', ly);
        }
        linePath.setAttribute('d', buildLinePath(values.line));
        areaPath.setAttribute('d', buildAreaPath(values.line));
      }
      render(current);

      function buildTicks(values) {
        ticksG.innerHTML = '';
        const max = Math.max(...values.bars, ...values.line);
        const steps = 3;
        for (let i = 0; i <= steps; i++) {
          const v = Math.round((max * i) / steps);
          const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          t.classList.add('mfx-chart-tick');
          t.setAttribute('x', padL - 2);
          t.setAttribute('y', yFor((100 * i) / steps) + 3);
          t.setAttribute('text-anchor', 'end');
          t.textContent = v;
          ticksG.appendChild(t);
          // fade in
          requestAnimationFrame(() => t.classList.add('is-in'));
        }
      }
      buildTicks(current);

      function transitionTo(next, dur) {
        const fromBars = current.bars.slice();
        const fromLine = current.line.slice();
        const t0 = performance.now();
        animStart = t0;
        function step(now) {
          if (cancelled) return;
          const t = dur === 0 ? 1 : Math.min(1, (now - t0) / dur);
          const k = ease.inOut(t);
          const vals = {
            bars: fromBars.map((v, i) => lerp(v, next.bars[i], k)),
            line: fromLine.map((v, i) => lerp(v, next.line[i], k))
          };
          render(vals);
          if (t < 1) {
            raf = requestAnimationFrame(step);
          } else {
            current = { bars: next.bars.slice(), line: next.line.slice() };
            buildTicks(current);
          }
        }
        raf = requestAnimationFrame(step);
      }

      function cycle() {
        if (cancelled) return;
        cycleIdx = (cycleIdx + 1) % CHART_SETS.length;
        const next = CHART_SETS[cycleIdx];
        // animate label flip
        labelEl.style.transition = 'opacity .25s ease, transform .25s ease';
        labelEl.style.opacity = '0';
        labelEl.style.transform = 'translateY(-4px)';
        setTimeout(() => {
          labelEl.textContent = next.label;
          labelEl.style.transform = 'translateY(4px)';
          requestAnimationFrame(() => {
            labelEl.style.opacity = '1';
            labelEl.style.transform = 'translateY(0)';
          });
        }, 220);
        transitionTo(next, prefersReducedMotion.matches ? 0 : DUR);
        cycleTimer = setTimeout(cycle, 3000);
      }

      return {
        start() {
          if (cycleTimer) return;
          cancelled = false;
          if (prefersReducedMotion.matches) {
            render(CHART_SETS[0]);
            return;
          }
          cycleTimer = setTimeout(cycle, 1100);
        },
        stop() {
          cancelled = true;
          if (raf) cancelAnimationFrame(raf);
          if (cycleTimer) { clearTimeout(cycleTimer); cycleTimer = 0; }
        },
        destroy() {
          cancelled = true;
          if (raf) cancelAnimationFrame(raf);
          if (cycleTimer) clearTimeout(cycleTimer);
        }
      };
    }
  });

  // =====================================================================
  // 31  ai_streaming_text
  // =====================================================================
  const AI_PASSAGES = [
    'Streaming token by token keeps the user oriented while the model decides what comes next — each fragment lands on a cadence the eye can follow.',
    'Pause is a real state, not absence. Show a steady caret, dim the pulse, and surface a clear way back to streaming.',
    'When generation finishes, swap the cursor for a check-equivalent: a quiet color shift on the indicator says the page is now stable.'
  ];
  window.MotionEffects.register('ai_streaming_text', {
    card({ module, cat }) {
      return `
        <div class="mfx-ai" data-mfx="ai" data-state="streaming">
          <div class="mfx-ai-head">
            <span class="mfx-ai-tag">AI · GENERATING</span>
            <span class="mfx-ai-state">STREAMING</span>
          </div>
          <div class="mfx-ai-body"><span class="mfx-ai-tokens"></span><span class="mfx-ai-caret"></span></div>
        </div>`;
    },
    modal(args) { return this.card(args); },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('[data-mfx="ai"]');
      if (!root) return { destroy() {} };
      const tokensEl = root.querySelector('.mfx-ai-tokens');
      const stateEl = root.querySelector('.mfx-ai-state');
      const tagEl = root.querySelector('.mfx-ai-tag');
      let timer = 0;
      let cancelled = false;
      let passageIdx = 0;

      function setState(s, label, tag) {
        root.setAttribute('data-state', s);
        stateEl.textContent = label;
        if (tag) tagEl.textContent = tag;
      }

      function streamPassage(text, done) {
        // tokenize on whitespace-keep
        const tokens = text.match(/\S+\s*/g) || [text];
        tokensEl.innerHTML = '';
        if (prefersReducedMotion.matches) {
          tokensEl.textContent = text;
          done && done();
          return;
        }
        let i = 0;
        let pausedAt = -1;
        const pauseAt = Math.floor(tokens.length * 0.45);

        function nextToken() {
          if (cancelled) return;
          if (i === pauseAt && pausedAt < 0) {
            pausedAt = i;
            setState('paused', 'PAUSED', 'AI · PAUSED');
            timer = setTimeout(() => {
              if (cancelled) return;
              setState('streaming', 'STREAMING', 'AI · GENERATING');
              pausedAt = -2;
              nextToken();
            }, 900);
            return;
          }
          if (i >= tokens.length) {
            setState('done', 'COMPLETE', 'AI · DONE');
            timer = setTimeout(() => done && done(), 1400);
            return;
          }
          const t = tokens[i];
          const span = document.createElement('span');
          span.className = 'tok';
          span.textContent = t;
          tokensEl.appendChild(span);
          requestAnimationFrame(() => span.classList.add('is-in'));
          i++;
          // longer pause after punctuation
          const last = t.trim().slice(-1);
          const cadence = ['.', ',', ';', ':', '?', '!'].includes(last)
            ? 160 + Math.random() * 90
            : 38 + Math.random() * 38;
          timer = setTimeout(nextToken, cadence);
        }
        setState('streaming', 'STREAMING', 'AI · GENERATING');
        nextToken();
      }

      function cycle() {
        if (cancelled) return;
        const passage = AI_PASSAGES[passageIdx % AI_PASSAGES.length];
        passageIdx++;
        streamPassage(passage, () => {
          timer = setTimeout(cycle, 600);
        });
      }

      return {
        start() {
          if (timer) return;
          cancelled = false;
          passageIdx = 0;
          if (prefersReducedMotion.matches) {
            tokensEl.textContent = AI_PASSAGES[0];
            setState('done', 'COMPLETE', 'AI · DONE');
            return;
          }
          cycle();
        },
        stop() {
          cancelled = true;
          if (timer) { clearTimeout(timer); timer = 0; }
        },
        destroy() {
          cancelled = true;
          if (timer) clearTimeout(timer);
        }
      };
    }
  });

})();
