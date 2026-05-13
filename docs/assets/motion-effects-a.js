/* ============================================================
 *  motion-effects-a.js — Batch A
 *  Implements 10 motion-lab effects (registry contract).
 *  All effects are CSS/SVG heavy with minimal JS.
 *  Each registered effect honors prefers-reduced-motion via init().
 *  Class names are prefixed mfx-<en>- to avoid collisions.
 * ============================================================ */

window.MotionEffects = window.MotionEffects || {
  _entries: new Map(),
  register(name, def) { this._entries.set(name, def); },
  get(name) { return this._entries.get(name); },
  has(name) { return this._entries.has(name); }
};

(function () {
  'use strict';

  // ---------- tiny shared helpers ----------
  function rafLoop(fn) {
    let id = 0;
    let running = false;
    function frame(t) {
      if (!running) return;
      fn(t);
      id = requestAnimationFrame(frame);
    }
    return {
      start() { if (running) return; running = true; id = requestAnimationFrame(frame); },
      stop() { running = false; if (id) cancelAnimationFrame(id); id = 0; },
    };
  }
  function intervalLoop(fn, delay) {
    let id = 0;
    return {
      start() { if (id) return; id = setInterval(fn, delay); fn(); },
      stop() { if (id) { clearInterval(id); id = 0; } },
    };
  }
  function timeoutChain() {
    const ids = new Set();
    return {
      set(fn, ms) { const id = setTimeout(() => { ids.delete(id); fn(); }, ms); ids.add(id); return id; },
      clear() { ids.forEach(clearTimeout); ids.clear(); },
    };
  }

  /* ============================================================
   *  05 · aurora_flow  — Background
   *  Slow ambient halos drifting & inter-penetrating
   * ============================================================ */
  window.MotionEffects.register('aurora_flow', {
    card() {
      return `
        <div class="mfx-aurora">
          <span class="mfx-aurora__halo mfx-aurora__halo--a"></span>
          <span class="mfx-aurora__halo mfx-aurora__halo--b"></span>
          <span class="mfx-aurora__halo mfx-aurora__halo--c"></span>
          <span class="mfx-aurora__halo mfx-aurora__halo--d"></span>
          <span class="mfx-aurora__grain"></span>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('.mfx-aurora');
      if (!root) return {};
      if (prefersReducedMotion.matches) root.classList.add('mfx-aurora--still');
      return {
        start() { root.style.animationPlayState = 'running'; root.classList.add('mfx-aurora--on'); },
        stop()  { root.classList.remove('mfx-aurora--on'); },
      };
    }
  });

  /* ============================================================
   *  10 · grain_noise  — Background
   *  Film grain with per-frame jitter
   * ============================================================ */
  window.MotionEffects.register('grain_noise', {
    card({ cat }) {
      // Build a small SVG turbulence pattern as a data URL.
      const noiseDataUrl =
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.65 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";
      return `
        <div class="mfx-grain">
          <div class="mfx-grain__scene">
            <div class="mfx-grain__sun"></div>
            <div class="mfx-grain__rule"></div>
            <div class="mfx-grain__rule mfx-grain__rule--2"></div>
            <div class="mfx-grain__label">35mm · ISO 1600</div>
          </div>
          <div class="mfx-grain__layer" style="background-image:${noiseDataUrl}"></div>
          <div class="mfx-grain__layer mfx-grain__layer--2" style="background-image:${noiseDataUrl}"></div>
          <div class="mfx-grain__vignette"></div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const layers = stageEl.querySelectorAll('.mfx-grain__layer');
      if (!layers.length) return {};
      if (prefersReducedMotion.matches) return {};
      let last = 0;
      const loop = rafLoop((t) => {
        // jitter ~24fps to feel film-like
        if (t - last < 42) return;
        last = t;
        const x = (Math.random() * 100 - 50).toFixed(1);
        const y = (Math.random() * 100 - 50).toFixed(1);
        const x2 = (Math.random() * 100 - 50).toFixed(1);
        const y2 = (Math.random() * 100 - 50).toFixed(1);
        layers[0].style.transform = `translate3d(${x}px,${y}px,0)`;
        if (layers[1]) layers[1].style.transform = `translate3d(${x2}px,${y2}px,0)`;
      });
      return loop;
    }
  });

  /* ============================================================
   *  12 · kinetic_type  — Typography
   *  Variable-font axes breathing per letter
   * ============================================================ */
  window.MotionEffects.register('kinetic_type', {
    card() {
      const word = 'BREATHE';
      const letters = word.split('').map((c, i) =>
        `<span class="mfx-kin__l" style="--mfx-kin-i:${i}">${c}</span>`).join('');
      return `
        <div class="mfx-kin">
          <div class="mfx-kin__row">${letters}</div>
          <div class="mfx-kin__meta">
            <span>wght</span><i></i>
            <span>wdth</span><i></i>
            <span>spc</span><i></i>
          </div>
        </div>`;
    },
    modal() {
      const word = 'KINETIC TYPE';
      const letters = word.split('').map((c, i) =>
        `<span class="mfx-kin__l mfx-kin__l--lg" style="--mfx-kin-i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
      return `
        <div class="mfx-kin mfx-kin--lg">
          <div class="mfx-kin__row">${letters}</div>
          <div class="mfx-kin__meta">
            <span>weight</span><i></i>
            <span>width</span><i></i>
            <span>tracking</span><i></i>
          </div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('.mfx-kin');
      if (!root) return {};
      if (prefersReducedMotion.matches) root.classList.add('mfx-kin--still');
      return {
        start() { root.classList.add('mfx-kin--on'); },
        stop()  { root.classList.remove('mfx-kin--on'); },
      };
    }
  });

  /* ============================================================
   *  14 · scramble_text  — Typography
   *  Characters cycle randomly then settle, staggered per index
   * ============================================================ */
  window.MotionEffects.register('scramble_text', {
    card() {
      return `
        <div class="mfx-scr">
          <div class="mfx-scr__crumb">// DECRYPTING</div>
          <div class="mfx-scr__line" data-target="MOTION LAB"></div>
          <div class="mfx-scr__sub" data-target="encoded · 32ms"></div>
          <div class="mfx-scr__bar"><i></i></div>
        </div>`;
    },
    modal() {
      return `
        <div class="mfx-scr mfx-scr--lg">
          <div class="mfx-scr__crumb">// DECRYPTING SEQUENCE</div>
          <div class="mfx-scr__line" data-target="SCRAMBLE TEXT"></div>
          <div class="mfx-scr__sub" data-target="reveal · staggered · 80ms step"></div>
          <div class="mfx-scr__bar"><i></i></div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const lines = Array.from(stageEl.querySelectorAll('[data-target]'));
      const bar = stageEl.querySelector('.mfx-scr__bar > i');
      if (!lines.length) return {};
      const CHARS = '!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let scrambleId = null;
      let cycleId = null;

      function scrambleOnce(line) {
        const target = line.dataset.target;
        const len = target.length;
        const settleAt = new Array(len).fill(0).map(() => 14 + Math.floor(Math.random() * 22));
        let tick = 0;
        function render() {
          let out = '';
          let done = 0;
          for (let i = 0; i < len; i++) {
            if (tick >= settleAt[i]) {
              out += target[i] === ' ' ? ' ' : target[i];
              done++;
            } else if (target[i] === ' ') {
              out += ' ';
              done++;
            } else {
              out += CHARS[Math.floor(Math.random() * CHARS.length)];
            }
          }
          line.textContent = out;
          if (bar) bar.style.transform = `scaleX(${done / len})`;
          tick++;
          return done === len;
        }
        return render;
      }

      function runCycle() {
        if (scrambleId) clearInterval(scrambleId);
        if (bar) bar.style.transform = 'scaleX(0)';
        const renders = lines.map(scrambleOnce);
        scrambleId = setInterval(() => {
          let allDone = true;
          for (const r of renders) if (!r()) allDone = false;
          if (allDone) { clearInterval(scrambleId); scrambleId = null; }
        }, 55);
      }

      if (prefersReducedMotion.matches) {
        lines.forEach(l => l.textContent = l.dataset.target);
        if (bar) bar.style.transform = 'scaleX(1)';
        return {};
      }

      return {
        start() {
          runCycle();
          // Auto-replay every ~5s so motion is visible without interaction.
          if (cycleId) clearInterval(cycleId);
          cycleId = setInterval(runCycle, 5200);
        },
        stop() {
          if (scrambleId) { clearInterval(scrambleId); scrambleId = null; }
          if (cycleId)    { clearInterval(cycleId);    cycleId = null; }
        },
        destroy() {
          if (scrambleId) clearInterval(scrambleId);
          if (cycleId)    clearInterval(cycleId);
        }
      };
    }
  });

  /* ============================================================
   *  15 · skeleton_pulse  — Loader
   *  Skeleton blocks with shimmer sweep, staggered start
   * ============================================================ */
  window.MotionEffects.register('skeleton_pulse', {
    card() {
      return `
        <div class="mfx-skel">
          <div class="mfx-skel__row">
            <div class="mfx-skel__avatar"></div>
            <div class="mfx-skel__col">
              <div class="mfx-skel__bar" style="--mfx-skel-i:0;width:64%"></div>
              <div class="mfx-skel__bar" style="--mfx-skel-i:1;width:42%"></div>
            </div>
          </div>
          <div class="mfx-skel__bar mfx-skel__bar--wide" style="--mfx-skel-i:2;width:92%"></div>
          <div class="mfx-skel__bar mfx-skel__bar--wide" style="--mfx-skel-i:3;width:78%"></div>
          <div class="mfx-skel__bar mfx-skel__bar--wide" style="--mfx-skel-i:4;width:56%"></div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('.mfx-skel');
      if (!root) return {};
      if (prefersReducedMotion.matches) root.classList.add('mfx-skel--still');
      return {
        start() { root.classList.add('mfx-skel--on'); },
        stop()  { root.classList.remove('mfx-skel--on'); },
      };
    }
  });

  /* ============================================================
   *  23 · password_strength_meter  — Input
   *  Cycles through a fake input over time
   * ============================================================ */
  window.MotionEffects.register('password_strength_meter', {
    card() {
      return `
        <div class="mfx-pwd">
          <div class="mfx-pwd__label">PASSWORD</div>
          <div class="mfx-pwd__field">
            <span class="mfx-pwd__dots"></span>
            <span class="mfx-pwd__caret"></span>
          </div>
          <div class="mfx-pwd__bars">
            <i></i><i></i><i></i><i></i>
          </div>
          <div class="mfx-pwd__hint">weak</div>
        </div>`;
    },
    modal() {
      return `
        <div class="mfx-pwd mfx-pwd--lg">
          <div class="mfx-pwd__label">CREATE PASSWORD</div>
          <div class="mfx-pwd__field">
            <span class="mfx-pwd__dots"></span>
            <span class="mfx-pwd__caret"></span>
          </div>
          <div class="mfx-pwd__bars">
            <i></i><i></i><i></i><i></i>
          </div>
          <div class="mfx-pwd__hint">weak</div>
          <div class="mfx-pwd__meta">cycling demo · auto-typed</div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const dots = stageEl.querySelector('.mfx-pwd__dots');
      const bars = stageEl.querySelectorAll('.mfx-pwd__bars > i');
      const hint = stageEl.querySelector('.mfx-pwd__hint');
      const root = stageEl.querySelector('.mfx-pwd');
      if (!dots || !bars.length || !hint) return {};
      const stages = [
        { len: 0,  level: 0, label: 'empty' },
        { len: 3,  level: 1, label: 'weak' },
        { len: 6,  level: 2, label: 'fair' },
        { len: 9,  level: 3, label: 'good' },
        { len: 13, level: 4, label: 'strong' },
      ];
      const labels = ['weak', 'fair', 'good', 'strong'];
      let i = 0;
      function apply(s) {
        dots.textContent = '•'.repeat(s.len);
        bars.forEach((b, idx) => b.classList.toggle('on', idx < s.level));
        bars.forEach((b, idx) => b.style.setProperty('--mfx-pwd-level', String(s.level)));
        root.dataset.level = String(s.level);
        hint.textContent = s.level === 0 ? 'empty' : labels[s.level - 1];
      }
      apply(stages[0]);
      if (prefersReducedMotion.matches) { apply(stages[3]); return {}; }
      // Auto-demo: cycles the typed-input simulation on a timer so the
      // motion plays without user interaction.
      const ticker = intervalLoop(() => {
        apply(stages[i % stages.length]);
        i++;
      }, 1200);
      return ticker;
    }
  });

  /* ============================================================
   *  26 · toast_stack  — Feedback
   *  Toasts appear bottom-right, stack, auto-dismiss
   * ============================================================ */
  window.MotionEffects.register('toast_stack', {
    card() {
      return `
        <div class="mfx-toast">
          <div class="mfx-toast__scene"></div>
          <div class="mfx-toast__stack" aria-hidden="true"></div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const stack = stageEl.querySelector('.mfx-toast__stack');
      if (!stack) return {};
      const MESSAGES = [
        { icon: '✓', tone: 'ok',   title: 'Saved',         body: 'Draft synced to cloud.' },
        { icon: '↑', tone: 'info', title: 'Uploaded',      body: '1 asset added to library.' },
        { icon: '!', tone: 'warn', title: 'Slow network',  body: 'Retrying in 3s…' },
        { icon: '★', tone: 'ok',   title: 'Pinned',        body: 'Module marked as favorite.' },
        { icon: '↻', tone: 'info', title: 'Refreshed',     body: 'Catalog up to date.' },
      ];
      let i = 0;
      let spawnId = null;

      function spawn(msg) {
        const el = document.createElement('div');
        el.className = `mfx-toast__item mfx-toast__item--${msg.tone}`;
        el.innerHTML = `
          <span class="mfx-toast__icon">${msg.icon}</span>
          <div class="mfx-toast__text">
            <strong>${msg.title}</strong>
            <em>${msg.body}</em>
          </div>
          <span class="mfx-toast__progress"></span>`;
        stack.appendChild(el);
        // enforce max 3 visible
        while (stack.children.length > 3) {
          stack.firstElementChild.classList.add('mfx-toast__item--leaving');
          const dead = stack.firstElementChild;
          setTimeout(() => dead.remove(), 320);
          break;
        }
        // request layout then animate in
        requestAnimationFrame(() => el.classList.add('mfx-toast__item--in'));
        // auto-dismiss after 3s
        setTimeout(() => {
          el.classList.add('mfx-toast__item--leaving');
          setTimeout(() => el.remove(), 320);
        }, 3000);
      }

      function tick() {
        spawn(MESSAGES[i % MESSAGES.length]);
        i++;
      }

      if (prefersReducedMotion.matches) { spawn(MESSAGES[0]); return {}; }

      return {
        start() {
          if (spawnId) return;
          tick();
          spawnId = setInterval(tick, 1400);
        },
        stop() {
          if (spawnId) { clearInterval(spawnId); spawnId = null; }
        },
        destroy() {
          if (spawnId) clearInterval(spawnId);
          stack.innerHTML = '';
        }
      };
    }
  });

  /* ============================================================
   *  27 · popover_anchor  — Hover
   *  Tooltip opens from anchor, direction-aware arrow
   * ============================================================ */
  window.MotionEffects.register('popover_anchor', {
    card() {
      return `
        <div class="mfx-pop">
          <div class="mfx-pop__grid">
            <button class="mfx-pop__anchor" data-pos="top">A</button>
            <button class="mfx-pop__anchor" data-pos="right">B</button>
            <button class="mfx-pop__anchor" data-pos="bottom">C</button>
            <button class="mfx-pop__anchor" data-pos="left">D</button>
          </div>
          <div class="mfx-pop__bubble" data-pos="top">
            <span class="mfx-pop__arrow"></span>
            <strong>Saved draft</strong>
            <em>⌘S keeps history.</em>
          </div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const bubble = stageEl.querySelector('.mfx-pop__bubble');
      const anchors = Array.from(stageEl.querySelectorAll('.mfx-pop__anchor'));
      if (!bubble || !anchors.length) return {};
      const COPY = {
        top:    ['Tooltip', 'Anchored above ↑'],
        right:  ['Right side', 'Flips when tight →'],
        bottom: ['Bottom rail', 'Direction-aware ↓'],
        left:   ['Left flank', 'Origin keeps source ←'],
      };
      let i = 0;
      let stepId = null;

      function step() {
        const a = anchors[i % anchors.length];
        anchors.forEach(x => x.classList.toggle('mfx-pop__anchor--on', x === a));
        const pos = a.dataset.pos;
        bubble.dataset.pos = pos;
        const c = COPY[pos];
        bubble.querySelector('strong').textContent = c[0];
        bubble.querySelector('em').textContent = c[1];
        // restart animation
        bubble.classList.remove('mfx-pop__bubble--open');
        // force reflow
        void bubble.offsetWidth;
        bubble.classList.add('mfx-pop__bubble--open');
        i++;
      }

      if (prefersReducedMotion.matches) { step(); return {}; }

      return {
        start() {
          if (stepId) return;
          step();
          stepId = setInterval(step, 1800);
        },
        stop() {
          if (stepId) { clearInterval(stepId); stepId = null; }
        }
      };
    }
  });

  /* ============================================================
   *  28 · tab_indicator_glide  — Transition
   *  Underline slides between tabs; demo is auto-interruptible
   * ============================================================ */
  window.MotionEffects.register('tab_indicator_glide', {
    card() {
      const TABS = ['Overview', 'Spec', 'Logs', 'Diff'];
      return `
        <div class="mfx-tab">
          <div class="mfx-tab__row">
            ${TABS.map((t, i) => `<button class="mfx-tab__btn${i === 0 ? ' is-active' : ''}" data-i="${i}">${t}</button>`).join('')}
            <span class="mfx-tab__bar"></span>
          </div>
          <div class="mfx-tab__panel">
            ${TABS.map((t, i) => `<div class="mfx-tab__pane${i === 0 ? ' is-active' : ''}" data-i="${i}"><span>// ${t.toLowerCase()}</span><b>${t}</b></div>`).join('')}
          </div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const row = stageEl.querySelector('.mfx-tab__row');
      const bar = stageEl.querySelector('.mfx-tab__bar');
      const btns = Array.from(stageEl.querySelectorAll('.mfx-tab__btn'));
      const panes = Array.from(stageEl.querySelectorAll('.mfx-tab__pane'));
      if (!row || !bar || !btns.length) return {};

      function place(i) {
        const btn = btns[i];
        if (!btn) return;
        const rowRect = row.getBoundingClientRect();
        const r = btn.getBoundingClientRect();
        bar.style.transform = `translateX(${r.left - rowRect.left}px)`;
        bar.style.width = r.width + 'px';
        btns.forEach((b, j) => b.classList.toggle('is-active', j === i));
        panes.forEach((p, j) => p.classList.toggle('is-active', j === i));
      }

      const ro = new ResizeObserver(() => {
        const active = btns.findIndex(b => b.classList.contains('is-active'));
        place(active < 0 ? 0 : active);
      });
      ro.observe(row);

      btns.forEach((b, i) => {
        b.addEventListener('click', (e) => { e.stopPropagation(); place(i); });
      });

      // Auto-demo: cycle through tabs, sometimes skipping to test interruptibility.
      let i = 0;
      const order = [0, 1, 2, 3, 1, 3, 2, 0];
      let tickId = null;
      function tick() { place(order[i % order.length]); i++; }

      // place initial bar after layout settles
      requestAnimationFrame(() => place(0));

      if (prefersReducedMotion.matches) return { destroy() { ro.disconnect(); } };

      return {
        start() {
          requestAnimationFrame(() => place(0));
          if (tickId) return;
          tickId = setInterval(tick, 1600);
        },
        stop() {
          if (tickId) { clearInterval(tickId); tickId = null; }
        },
        destroy() {
          if (tickId) clearInterval(tickId);
          ro.disconnect();
        }
      };
    }
  });

  /* ============================================================
   *  32 · save_sync_indicator  — Feedback
   *  Auto-cycles through states: unsaved → saving → saved → offline-queued
   * ============================================================ */
  window.MotionEffects.register('save_sync_indicator', {
    card() {
      return `
        <div class="mfx-sync">
          <div class="mfx-sync__doc">
            <div class="mfx-sync__title">Untitled.md</div>
            <div class="mfx-sync__lines">
              <i style="width:78%"></i><i style="width:62%"></i><i style="width:84%"></i><i style="width:48%"></i>
            </div>
            <div class="mfx-sync__caret"></div>
          </div>
          <div class="mfx-sync__pill" data-state="unsaved">
            <span class="mfx-sync__glyph">
              <svg viewBox="0 0 16 16" width="14" height="14">
                <circle class="mfx-sync__dot"     cx="8" cy="8" r="2.4"/>
                <circle class="mfx-sync__ring"    cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="36" stroke-dashoffset="36"/>
                <path    class="mfx-sync__check"  d="M4.5 8.2 L7 10.6 L11.6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="14" stroke-dashoffset="14"/>
                <path    class="mfx-sync__cloud"  d="M5 11 a3 3 0 0 1 0-5 3 3 0 0 1 5.5-1 3 3 0 0 1 1 6 z" fill="none" stroke="currentColor" stroke-width="1.4"/>
              </svg>
            </span>
            <span class="mfx-sync__label">Unsaved</span>
          </div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const pill = stageEl.querySelector('.mfx-sync__pill');
      const label = stageEl.querySelector('.mfx-sync__label');
      if (!pill || !label) return {};
      const STATES = [
        { key: 'unsaved',  text: 'Unsaved',           hold: 1400 },
        { key: 'saving',   text: 'Saving…',           hold: 1600 },
        { key: 'saved',    text: 'Saved',             hold: 1700 },
        { key: 'offline',  text: 'Queued · offline',  hold: 1700 },
        { key: 'syncing',  text: 'Syncing back…',     hold: 1700 },
        { key: 'saved',    text: 'All synced',        hold: 1700 },
      ];
      let i = 0;
      const chain = timeoutChain();
      function step() {
        const s = STATES[i % STATES.length];
        pill.dataset.state = s.key;
        label.textContent = s.text;
        i++;
        chain.set(step, s.hold);
      }

      if (prefersReducedMotion.matches) {
        pill.dataset.state = 'saved';
        label.textContent = 'Saved';
        return {};
      }

      return {
        start() { chain.clear(); i = 0; step(); },
        stop()  { chain.clear(); },
        destroy() { chain.clear(); },
      };
    }
  });

})();
