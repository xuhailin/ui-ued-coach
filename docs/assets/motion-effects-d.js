/* ============================================================
 *  motion-effects-d.js — Batch D
 *  Implements modules 33-44 of the Motion Lab:
 *    33 button_ripple
 *    34 floating_label
 *    35 otp_input
 *    36 toggle_switch
 *    37 stepper_wizard
 *    38 drawer_slide
 *    39 scroll_progress
 *    40 counter_on_view
 *    41 confetti_burst
 *    42 copy_to_clipboard
 *    43 like_heart_burst
 *    44 marquee_ticker
 *
 *  All effects expose { start, stop, destroy } and pause when offscreen.
 *  Class names prefixed mfx-* to avoid collisions.
 *  Honors prefers-reduced-motion via fallback paths in start().
 * ============================================================ */

window.MotionEffects = window.MotionEffects || {
  _entries: new Map(),
  register(name, def) { this._entries.set(name, def); },
  get(name) { return this._entries.get(name); },
  has(name) { return this._entries.has(name); }
};

(function () {
  'use strict';

  // ---------- shared helpers ----------
  function rafLoop(fn) {
    let id = 0, running = false;
    function frame(t) {
      if (!running) return;
      fn(t);
      id = requestAnimationFrame(frame);
    }
    return {
      start() { if (running) return; running = true; id = requestAnimationFrame(frame); },
      stop() { running = false; if (id) cancelAnimationFrame(id); id = 0; },
      get running() { return running; }
    };
  }
  function timers() {
    const set = new Set();
    return {
      after(ms, fn) {
        const id = setTimeout(() => { set.delete(id); fn(); }, ms);
        set.add(id);
        return id;
      },
      every(ms, fn) {
        const id = setInterval(fn, ms);
        set.add(id);
        return { id, clear() { clearInterval(id); set.delete(id); } };
      },
      clearAll() {
        set.forEach(id => { clearTimeout(id); clearInterval(id); });
        set.clear();
      }
    };
  }
  // ease-out cubic
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeOutBack = (t, s = 1.7) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);

  /* ============================================================
   *  33 · button_ripple
   * ============================================================ */
  window.MotionEffects.register('button_ripple', {
    card() {
      return `
        <div class="mfx-ripple">
          <button type="button" class="mfx-ripple__btn" aria-label="Tap to ripple">
            <span class="mfx-ripple__label">TAP</span>
            <span class="mfx-ripple__layer"></span>
          </button>
          <div class="mfx-ripple__hint">// MATERIAL · POINTER</div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const btn = stageEl.querySelector('.mfx-ripple__btn');
      const layer = stageEl.querySelector('.mfx-ripple__layer');
      if (!btn || !layer) return { destroy() {} };
      const t = timers();
      let cancelled = false;
      let autoSuspendUntil = 0;

      function spawnRipple(x, y) {
        const rect = btn.getBoundingClientRect();
        const px = Math.max(x, rect.width - x);
        const py = Math.max(y, rect.height - y);
        const radius = Math.sqrt(px * px + py * py);
        const dot = document.createElement('span');
        dot.className = 'mfx-ripple__dot';
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        dot.style.setProperty('--r', (radius * 1.15) + 'px');
        layer.appendChild(dot);
        // press rebound
        btn.classList.add('is-press');
        t.after(120, () => btn.classList.remove('is-press'));
        // cleanup
        t.after(prefersReducedMotion.matches ? 200 : 720, () => {
          dot.remove();
        });
      }

      function onClick(e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spawnRipple(x, y);
        autoSuspendUntil = performance.now() + 3000;
      }
      btn.addEventListener('pointerdown', onClick);

      function autoTap() {
        if (cancelled) return;
        if (performance.now() < autoSuspendUntil) return;
        const rect = btn.getBoundingClientRect();
        const x = 12 + Math.random() * (rect.width - 24);
        const y = 8 + Math.random() * (rect.height - 16);
        spawnRipple(x, y);
        // occasional rapid double/triple
        if (Math.random() < 0.28) {
          t.after(160, () => {
            if (cancelled) return;
            const r2 = btn.getBoundingClientRect();
            spawnRipple(12 + Math.random() * (r2.width - 24), 8 + Math.random() * (r2.height - 16));
            if (Math.random() < 0.4) {
              t.after(150, () => {
                if (cancelled) return;
                const r3 = btn.getBoundingClientRect();
                spawnRipple(12 + Math.random() * (r3.width - 24), 8 + Math.random() * (r3.height - 16));
              });
            }
          });
        }
      }
      let tickHandle = null;
      return {
        start() {
          cancelled = false;
          if (prefersReducedMotion.matches) {
            // single static flash
            t.after(400, () => autoTap());
            return;
          }
          if (tickHandle) return;
          tickHandle = t.every(2500, autoTap);
        },
        stop() {
          cancelled = true;
          if (tickHandle) { tickHandle.clear(); tickHandle = null; }
        },
        destroy() {
          cancelled = true;
          btn.removeEventListener('pointerdown', onClick);
          if (tickHandle) { tickHandle.clear(); tickHandle = null; }
          t.clearAll();
          layer.innerHTML = '';
        }
      };
    }
  });

  /* ============================================================
   *  34 · floating_label
   * ============================================================ */
  window.MotionEffects.register('floating_label', {
    card() {
      return `
        <div class="mfx-fl">
          <div class="mfx-fl__field" data-state="empty">
            <fieldset class="mfx-fl__frame">
              <legend class="mfx-fl__legend"><span>EMAIL</span></legend>
            </fieldset>
            <label class="mfx-fl__label">EMAIL</label>
            <div class="mfx-fl__value"><span class="val"></span><span class="caret"></span></div>
          </div>
          <div class="mfx-fl__hint">// MATERIAL · OUTLINED</div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const field = stageEl.querySelector('.mfx-fl__field');
      const valEl = stageEl.querySelector('.mfx-fl__value .val');
      if (!field) return { destroy() {} };
      const t = timers();
      let cancelled = false;
      const samples = ['alex@motion.dev', 'designer@studio.io', 'hi@uiued.coach'];
      let i = 0;

      function setState(s) { field.setAttribute('data-state', s); }
      function typeText(text, done) {
        let n = 0;
        valEl.textContent = '';
        const step = () => {
          if (cancelled) return;
          n++;
          valEl.textContent = text.slice(0, n);
          if (n < text.length) t.after(prefersReducedMotion.matches ? 0 : 65, step);
          else t.after(prefersReducedMotion.matches ? 80 : 380, done);
        };
        step();
      }
      function cycle() {
        if (cancelled) return;
        // focus empty
        setState('focus-empty');
        t.after(prefersReducedMotion.matches ? 100 : 640, () => {
          if (cancelled) return;
          setState('focus-filled');
          typeText(samples[i % samples.length], () => {
            // blur but filled — label stays up
            setState('blur-filled');
            t.after(prefersReducedMotion.matches ? 100 : 1100, () => {
              if (cancelled) return;
              // clear
              valEl.textContent = '';
              setState('empty');
              i++;
              t.after(prefersReducedMotion.matches ? 100 : 820, cycle);
            });
          });
        });
      }
      return {
        start() {
          cancelled = false;
          if (prefersReducedMotion.matches) {
            setState('blur-filled');
            valEl.textContent = samples[0];
            return;
          }
          t.after(500, cycle);
        },
        stop() { cancelled = true; t.clearAll(); },
        destroy() { cancelled = true; t.clearAll(); }
      };
    }
  });

  /* ============================================================
   *  35 · otp_input
   * ============================================================ */
  window.MotionEffects.register('otp_input', {
    card() {
      const cells = Array.from({ length: 6 }, (_, i) =>
        `<span class="mfx-otp__cell" data-i="${i}" data-state="${i === 0 ? 'active' : 'idle'}"><b class="d"></b><i class="bar"></i><u class="caret"></u></span>`
      ).join('');
      return `
        <div class="mfx-otp" tabindex="0">
          <div class="mfx-otp__title">ENTER 6-DIGIT CODE</div>
          <div class="mfx-otp__row">${cells}</div>
          <div class="mfx-otp__hint">// PASTE TO DISTRIBUTE</div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('.mfx-otp');
      const cells = Array.from(stageEl.querySelectorAll('.mfx-otp__cell'));
      if (!root || cells.length !== 6) return { destroy() {} };
      const t = timers();
      let cancelled = false;
      let userActive = false;
      let suspendUntil = 0;
      const buf = ['', '', '', '', '', ''];

      function paint() {
        cells.forEach((c, idx) => {
          const v = buf[idx];
          c.querySelector('.d').textContent = v || '';
          let state = 'idle';
          if (v) state = 'filled';
          if (!v && idx === buf.findIndex(x => !x)) state = 'active';
          c.setAttribute('data-state', state);
        });
      }
      function clearAll() {
        for (let i = 0; i < 6; i++) buf[i] = '';
        paint();
      }
      function setDigit(idx, d) {
        if (idx < 0 || idx > 5) return;
        buf[idx] = d;
        // brief pop
        cells[idx].classList.add('is-pop');
        t.after(220, () => cells[idx].classList.remove('is-pop'));
        paint();
      }

      function typeSequence(code, perDigit, done) {
        let k = 0;
        const step = () => {
          if (cancelled) return;
          if (k >= 6) { done && done(); return; }
          setDigit(k, code[k]);
          k++;
          t.after(perDigit, step);
        };
        step();
      }
      function pasteAll(code, done) {
        for (let i = 0; i < 6; i++) {
          buf[i] = code[i] || '';
          cells[i].classList.add('is-pop');
        }
        paint();
        t.after(300, () => {
          cells.forEach(c => c.classList.remove('is-pop'));
          done && done();
        });
      }
      const codes = ['482917', '930142', '551208', '716304'];
      let ci = 0;

      function cycle() {
        if (cancelled) return;
        if (userActive || performance.now() < suspendUntil) {
          t.after(800, cycle);
          return;
        }
        // typing scene
        typeSequence(codes[ci++ % codes.length], 220, () => {
          t.after(900, () => {
            if (cancelled) return;
            clearAll();
            t.after(500, () => {
              if (cancelled) return;
              // paste scene
              pasteAll(codes[ci++ % codes.length], () => {
                t.after(1100, () => {
                  if (cancelled) return;
                  clearAll();
                  t.after(700, cycle);
                });
              });
            });
          });
        });
      }

      function onKey(e) {
        if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace') return;
        userActive = true;
        suspendUntil = performance.now() + 4000;
        if (e.key === 'Backspace') {
          let idx = buf.findIndex(x => !x);
          if (idx === -1) idx = 6;
          idx = Math.max(0, idx - 1);
          buf[idx] = '';
          paint();
        } else {
          const idx = buf.findIndex(x => !x);
          if (idx === -1) return;
          setDigit(idx, e.key);
        }
        e.preventDefault();
      }
      function onFocus() { suspendUntil = performance.now() + 2000; }
      function onBlur() { userActive = false; }

      root.addEventListener('keydown', onKey);
      root.addEventListener('focus', onFocus);
      root.addEventListener('blur', onBlur);

      paint();
      return {
        start() {
          cancelled = false;
          if (prefersReducedMotion.matches) {
            for (let i = 0; i < 6; i++) buf[i] = '482917'[i];
            paint();
            return;
          }
          t.after(700, cycle);
        },
        stop() { cancelled = true; t.clearAll(); },
        destroy() {
          cancelled = true;
          t.clearAll();
          root.removeEventListener('keydown', onKey);
          root.removeEventListener('focus', onFocus);
          root.removeEventListener('blur', onBlur);
        }
      };
    }
  });

  /* ============================================================
   *  36 · toggle_switch
   * ============================================================ */
  window.MotionEffects.register('toggle_switch', {
    card() {
      return `
        <div class="mfx-tog">
          <div class="mfx-tog__row">
            <span class="mfx-tog__label">NOTIFICATIONS</span>
            <button type="button" class="mfx-tog__switch" role="switch" aria-checked="false">
              <span class="mfx-tog__track"></span>
              <span class="mfx-tog__thumb"></span>
            </button>
          </div>
          <div class="mfx-tog__row">
            <span class="mfx-tog__label">REDUCED MOTION</span>
            <button type="button" class="mfx-tog__switch is-on" role="switch" aria-checked="true">
              <span class="mfx-tog__track"></span>
              <span class="mfx-tog__thumb"></span>
            </button>
          </div>
          <div class="mfx-tog__hint">// SPRING · LIQUID-STRETCH</div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const switches = Array.from(stageEl.querySelectorAll('.mfx-tog__switch'));
      if (!switches.length) return { destroy() {} };
      const t = timers();
      let cancelled = false;
      let userSuspendUntil = 0;

      function setOn(s, on) {
        s.classList.toggle('is-on', on);
        s.setAttribute('aria-checked', on ? 'true' : 'false');
        if (prefersReducedMotion.matches) return;
        // liquid stretch pulse
        s.classList.add('is-press');
        t.after(180, () => s.classList.remove('is-press'));
      }
      function toggle(s) { setOn(s, !s.classList.contains('is-on')); }

      function onPointer(e) {
        const s = e.currentTarget;
        userSuspendUntil = performance.now() + 3000;
        toggle(s);
      }
      switches.forEach(s => s.addEventListener('click', onPointer));

      let idx = 0;
      let tickHandle = null;
      function step() {
        if (cancelled) return;
        if (performance.now() < userSuspendUntil) return;
        toggle(switches[idx % switches.length]);
        idx++;
      }
      return {
        start() {
          cancelled = false;
          if (prefersReducedMotion.matches) return;
          if (tickHandle) return;
          tickHandle = t.every(2000, step);
        },
        stop() {
          cancelled = true;
          if (tickHandle) { tickHandle.clear(); tickHandle = null; }
        },
        destroy() {
          cancelled = true;
          if (tickHandle) { tickHandle.clear(); tickHandle = null; }
          t.clearAll();
          switches.forEach(s => s.removeEventListener('click', onPointer));
        }
      };
    }
  });

  /* ============================================================
   *  37 · stepper_wizard
   * ============================================================ */
  window.MotionEffects.register('stepper_wizard', {
    card() {
      const labels = ['ACCOUNT', 'PROFILE', 'BILLING', 'REVIEW'];
      const nodes = labels.map((l, i) =>
        `<div class="mfx-step__node" data-i="${i}">
           <span class="mfx-step__dot">
             <svg class="check" viewBox="0 0 16 16" width="14" height="14"><path d="M3 8.5 L6.5 12 L13 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
             <span class="num">${i + 1}</span>
           </span>
           <span class="mfx-step__caption">${l}</span>
         </div>`
      ).join('');
      const panels = labels.map((l, i) =>
        `<div class="mfx-step__panel" data-i="${i}">
           <div class="mfx-step__panel-title">STEP ${i + 1} · ${l}</div>
           <div class="mfx-step__panel-rows">
             <div class="row"></div>
             <div class="row short"></div>
             <div class="row mid"></div>
           </div>
         </div>`
      ).join('');
      return `
        <div class="mfx-step">
          <div class="mfx-step__bar">
            <div class="mfx-step__rail"><i style="--p:0"></i></div>
            <div class="mfx-step__nodes">${nodes}</div>
          </div>
          <div class="mfx-step__stage">${panels}</div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('.mfx-step');
      const nodes = Array.from(stageEl.querySelectorAll('.mfx-step__node'));
      const panels = Array.from(stageEl.querySelectorAll('.mfx-step__panel'));
      const rail = stageEl.querySelector('.mfx-step__rail i');
      if (!root || !nodes.length) return { destroy() {} };
      const N = nodes.length;
      const t = timers();
      let cancelled = false;
      let current = 0;
      let dir = 1;

      function paint(prev, idx) {
        nodes.forEach((n, i) => {
          n.classList.toggle('is-current', i === idx);
          n.classList.toggle('is-done', i < idx);
        });
        panels.forEach((p, i) => {
          p.classList.remove('enter-left', 'enter-right', 'exit-left', 'exit-right', 'is-current');
          if (i === idx) {
            p.classList.add('is-current');
            p.classList.add(dir > 0 ? 'enter-right' : 'enter-left');
          } else if (i === prev) {
            p.classList.add(dir > 0 ? 'exit-left' : 'exit-right');
          }
        });
        if (rail) rail.style.setProperty('--p', (idx / (N - 1)));
      }

      function advance() {
        if (cancelled) return;
        const prev = current;
        if (current >= N - 1) dir = -1;
        else if (current <= 0) dir = 1;
        current += dir;
        paint(prev, current);
      }
      let tickHandle = null;
      paint(-1, 0);
      return {
        start() {
          cancelled = false;
          if (prefersReducedMotion.matches) {
            current = N - 1;
            paint(-1, current);
            return;
          }
          if (tickHandle) return;
          tickHandle = t.every(1400, advance);
        },
        stop() {
          cancelled = true;
          if (tickHandle) { tickHandle.clear(); tickHandle = null; }
        },
        destroy() {
          cancelled = true;
          if (tickHandle) { tickHandle.clear(); tickHandle = null; }
          t.clearAll();
        }
      };
    }
  });

  /* ============================================================
   *  38 · drawer_slide
   * ============================================================ */
  window.MotionEffects.register('drawer_slide', {
    card() {
      return `
        <div class="mfx-drw">
          <div class="mfx-drw__page">
            <div class="mfx-drw__bar">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              <button type="button" class="mfx-drw__trigger">OPEN PANEL</button>
            </div>
            <div class="mfx-drw__lines"><i></i><i></i><i></i><i></i></div>
          </div>
          <div class="mfx-drw__backdrop"></div>
          <aside class="mfx-drw__panel" aria-hidden="true">
            <div class="mfx-drw__handle"></div>
            <div class="mfx-drw__title">SETTINGS</div>
            <div class="mfx-drw__group">
              <div class="row"><span>Theme</span><span class="pill">DARK</span></div>
              <div class="row"><span>Density</span><span class="pill alt">COSY</span></div>
              <div class="row"><span>Sync</span><span class="pill">ON</span></div>
            </div>
            <button class="mfx-drw__close" type="button">CLOSE</button>
          </aside>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('.mfx-drw');
      const trigger = stageEl.querySelector('.mfx-drw__trigger');
      const closeBtn = stageEl.querySelector('.mfx-drw__close');
      const backdrop = stageEl.querySelector('.mfx-drw__backdrop');
      const panel = stageEl.querySelector('.mfx-drw__panel');
      if (!root || !panel) return { destroy() {} };
      const t = timers();
      let cancelled = false;
      let isOpen = false;
      let userSuspendUntil = 0;

      function setOpen(open) {
        isOpen = open;
        root.classList.toggle('is-open', open);
        root.classList.toggle('is-closing', !open);
        panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      }
      function onTrigger() {
        userSuspendUntil = performance.now() + 5000;
        setOpen(!isOpen);
      }
      trigger && trigger.addEventListener('click', onTrigger);
      closeBtn && closeBtn.addEventListener('click', onTrigger);
      backdrop && backdrop.addEventListener('click', () => { if (isOpen) onTrigger(); });

      let cycleHandle = null;
      function cycle() {
        if (cancelled) return;
        if (performance.now() < userSuspendUntil) return;
        setOpen(true);
        t.after(2000, () => {
          if (cancelled) return;
          if (performance.now() < userSuspendUntil) return;
          setOpen(false);
        });
      }
      return {
        start() {
          cancelled = false;
          if (prefersReducedMotion.matches) {
            setOpen(true);
            return;
          }
          if (cycleHandle) return;
          cycleHandle = t.every(3500, cycle);
        },
        stop() {
          cancelled = true;
          if (cycleHandle) { cycleHandle.clear(); cycleHandle = null; }
        },
        destroy() {
          cancelled = true;
          if (cycleHandle) { cycleHandle.clear(); cycleHandle = null; }
          t.clearAll();
          trigger && trigger.removeEventListener('click', onTrigger);
          closeBtn && closeBtn.removeEventListener('click', onTrigger);
        }
      };
    }
  });

  /* ============================================================
   *  39 · scroll_progress
   * ============================================================ */
  window.MotionEffects.register('scroll_progress', {
    card() {
      return `
        <div class="mfx-prog">
          <div class="mfx-prog__top"><i class="mfx-prog__bar"></i></div>
          <div class="mfx-prog__pct">0%</div>
          <div class="mfx-prog__doc">
            <div class="mfx-prog__chap" data-c="0">CH · 01  THE OPEN GAMBIT</div>
            <div class="line"></div><div class="line"></div><div class="line short"></div>
            <div class="mfx-prog__chap" data-c="1">CH · 02  RESONANCE</div>
            <div class="line"></div><div class="line short"></div><div class="line"></div>
            <div class="mfx-prog__chap" data-c="2">CH · 03  THE BREAK</div>
            <div class="line"></div><div class="line"></div>
            <div class="mfx-prog__chap" data-c="3">CH · 04  CODA</div>
            <div class="line short"></div>
          </div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const bar = stageEl.querySelector('.mfx-prog__bar');
      const pct = stageEl.querySelector('.mfx-prog__pct');
      const top = stageEl.querySelector('.mfx-prog__top');
      const doc = stageEl.querySelector('.mfx-prog__doc');
      const chapters = Array.from(stageEl.querySelectorAll('.mfx-prog__chap'));
      if (!bar) return { destroy() {} };
      const duration = 5000;
      let cancelled = false;
      let last = -1;
      const t = timers();
      let startedAt = 0;
      let lastChap = -1;

      const loop = rafLoop((now) => {
        if (cancelled) return;
        const elapsed = (now - startedAt) % duration;
        const p = elapsed / duration;
        bar.style.transform = `scaleX(${p})`;
        if (pct) pct.textContent = Math.round(p * 100) + '%';
        // scroll the doc upward to simulate
        if (doc) doc.style.transform = `translateY(${-(p) * (doc.scrollHeight - 110)}px)`;
        // chapter flash
        const ci = Math.min(3, Math.floor(p * 4));
        if (ci !== lastChap) {
          lastChap = ci;
          chapters.forEach(c => c.classList.remove('is-flash'));
          const el = chapters[ci];
          if (el) {
            el.classList.add('is-flash');
            t.after(500, () => el.classList.remove('is-flash'));
          }
        }
        // hit-bottom flash
        if (p > 0.97 && last <= 0.97) {
          top.classList.add('is-complete');
          t.after(550, () => top.classList.remove('is-complete'));
        }
        last = p;
      });

      return {
        start() {
          cancelled = false;
          if (prefersReducedMotion.matches) {
            bar.style.transform = 'scaleX(0.62)';
            if (pct) pct.textContent = '62%';
            return;
          }
          startedAt = performance.now();
          loop.start();
        },
        stop() { cancelled = true; loop.stop(); },
        destroy() { cancelled = true; loop.stop(); t.clearAll(); }
      };
    }
  });

  /* ============================================================
   *  40 · counter_on_view
   * ============================================================ */
  window.MotionEffects.register('counter_on_view', {
    card() {
      return `
        <div class="mfx-cnt">
          <div class="mfx-cnt__kpi" data-i="0">
            <div class="mfx-cnt__label">REVENUE</div>
            <div class="mfx-cnt__val"><span class="num">0</span><span class="suf">k</span></div>
          </div>
          <div class="mfx-cnt__kpi" data-i="1">
            <div class="mfx-cnt__label">GROWTH</div>
            <div class="mfx-cnt__val"><span class="num">0</span><span class="suf">%</span></div>
          </div>
          <div class="mfx-cnt__kpi" data-i="2">
            <div class="mfx-cnt__label">USERS</div>
            <div class="mfx-cnt__val"><span class="num">0</span><span class="suf">+</span></div>
          </div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const kpis = Array.from(stageEl.querySelectorAll('.mfx-cnt__kpi'));
      if (!kpis.length) return { destroy() {} };
      const t = timers();
      let cancelled = false;
      const datasets = [
        [248, 36, 1284],
        [412, 58, 2096],
        [187, 21, 942]
      ];
      let di = 0;

      function countOne(kpi, target, dur) {
        const numEl = kpi.querySelector('.num');
        const startAt = performance.now();
        const fmt = target >= 1000 ? n => Math.round(n).toLocaleString() : n => Math.round(n);
        kpi.classList.add('is-counting');
        const step = (now) => {
          if (cancelled) return;
          const p = Math.min(1, (now - startAt) / dur);
          numEl.textContent = fmt(target * easeOut(p));
          if (p < 1) requestAnimationFrame(step);
          else {
            kpi.classList.remove('is-counting');
            kpi.classList.add('is-done');
            t.after(300, () => kpi.classList.remove('is-done'));
          }
        };
        requestAnimationFrame(step);
      }
      function runOnce() {
        if (cancelled) return;
        const set = datasets[di++ % datasets.length];
        kpis.forEach(k => { const n = k.querySelector('.num'); if (n) n.textContent = '0'; });
        kpis.forEach((k, i) => {
          t.after(80 + i * 110, () => countOne(k, set[i], prefersReducedMotion.matches ? 250 : 1100));
        });
      }
      let cycleHandle = null;
      return {
        start() {
          cancelled = false;
          runOnce();
          if (prefersReducedMotion.matches) return;
          if (cycleHandle) return;
          cycleHandle = t.every(2800, runOnce);
        },
        stop() {
          cancelled = true;
          if (cycleHandle) { cycleHandle.clear(); cycleHandle = null; }
        },
        destroy() {
          cancelled = true;
          if (cycleHandle) { cycleHandle.clear(); cycleHandle = null; }
          t.clearAll();
        }
      };
    }
  });

  /* ============================================================
   *  41 · confetti_burst
   * ============================================================ */
  window.MotionEffects.register('confetti_burst', {
    card() {
      return `
        <div class="mfx-conf">
          <canvas class="mfx-conf__canvas"></canvas>
          <button type="button" class="mfx-conf__btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5 L6.5 12 L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>PUBLISH</span>
          </button>
          <div class="mfx-conf__hint">// CANVAS · PHYSICS</div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion, cat }) {
      const root = stageEl.querySelector('.mfx-conf');
      const canvas = stageEl.querySelector('.mfx-conf__canvas');
      const btn = stageEl.querySelector('.mfx-conf__btn');
      if (!canvas) return { destroy() {} };
      const ctx = canvas.getContext('2d');
      const t = timers();
      let cancelled = false;
      let parts = [];
      let dpr = Math.min(2, window.devicePixelRatio || 1);
      let w = 0, h = 0;
      let burstAt = 0;

      function resize() {
        const r = canvas.getBoundingClientRect();
        w = r.width; h = r.height;
        canvas.width = Math.max(1, Math.floor(w * dpr));
        canvas.height = Math.max(1, Math.floor(h * dpr));
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      const ro = ('ResizeObserver' in window) ? new ResizeObserver(resize) : null;
      ro && ro.observe(canvas);
      resize();

      function palette() {
        const c = (cat && cat.color) || 'var(--c-feedback)';
        // resolve CSS variable
        const probe = document.createElement('span');
        probe.style.color = c;
        document.body.appendChild(probe);
        const cs = getComputedStyle(probe).color;
        probe.remove();
        const m = cs.match(/\d+(\.\d+)?/g);
        let base = [255, 112, 166];
        if (m && m.length >= 3) base = [parseInt(m[0]), parseInt(m[1]), parseInt(m[2])];
        // mixed palette around base + 3 accents
        return [
          `rgb(${base[0]},${base[1]},${base[2]})`,
          `rgb(${Math.min(255, base[0] + 40)},${Math.min(255, base[1] + 40)},${Math.min(255, base[2] + 40)})`,
          '#ffd23f',
          '#7cf7ff',
          '#9cff6a',
          '#ffffff'
        ];
      }
      const PAL = palette();

      function burst() {
        const cx = w / 2;
        const cy = h * 0.92;
        const count = prefersReducedMotion.matches ? 22 : 70;
        for (let i = 0; i < count; i++) {
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 0.55);
          const speed = 3.0 + Math.random() * 4.2;
          parts.push({
            x: cx + (Math.random() - 0.5) * 12,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            g: 0.13 + Math.random() * 0.05,
            rot: Math.random() * Math.PI * 2,
            vr: (Math.random() - 0.5) * 0.4,
            w: 4 + Math.random() * 3,
            h: 6 + Math.random() * 5,
            color: PAL[(Math.random() * PAL.length) | 0],
            life: 0,
            max: 2200 + Math.random() * 400,
            shape: Math.random() < 0.4 ? 'circle' : 'rect'
          });
        }
        burstAt = performance.now();
        btn && btn.classList.add('is-fire');
        t.after(220, () => btn && btn.classList.remove('is-fire'));
      }

      let lastT = 0;
      const loop = rafLoop((now) => {
        if (cancelled) return;
        const dt = Math.min(40, now - lastT);
        lastT = now;
        ctx.clearRect(0, 0, w, h);
        const dtF = dt / 16.67;
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          p.life += dt;
          p.vy += p.g * dtF;
          p.x += p.vx * dtF;
          p.y += p.vy * dtF;
          p.rot += p.vr * dtF;
          const alpha = Math.max(0, 1 - p.life / p.max);
          if (alpha <= 0 || p.y > h + 40) { parts.splice(i, 1); continue; }
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.w * 0.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            const sh = Math.abs(Math.cos(p.rot));
            ctx.fillRect(-p.w / 2, -p.h / 2 * sh, p.w, p.h * sh);
          }
          ctx.restore();
        }
      });

      function onClick() {
        burst();
      }
      btn && btn.addEventListener('click', onClick);

      let cycleHandle = null;
      function autoBurst() {
        if (cancelled) return;
        burst();
      }
      return {
        start() {
          cancelled = false;
          resize();
          if (prefersReducedMotion.matches) {
            burst();
            loop.start();
            t.after(900, () => loop.stop());
            return;
          }
          loop.start();
          burst();
          if (cycleHandle) return;
          cycleHandle = t.every(3200, autoBurst);
        },
        stop() {
          cancelled = true;
          loop.stop();
          if (cycleHandle) { cycleHandle.clear(); cycleHandle = null; }
        },
        destroy() {
          cancelled = true;
          loop.stop();
          if (cycleHandle) { cycleHandle.clear(); cycleHandle = null; }
          t.clearAll();
          parts = [];
          ro && ro.disconnect();
          btn && btn.removeEventListener('click', onClick);
          ctx.clearRect(0, 0, w, h);
        }
      };
    }
  });

  /* ============================================================
   *  42 · copy_to_clipboard
   * ============================================================ */
  window.MotionEffects.register('copy_to_clipboard', {
    card() {
      return `
        <div class="mfx-cp">
          <div class="mfx-cp__code">
            <span class="dim">$</span> npm i motion-lab<span class="caret">|</span>
          </div>
          <button type="button" class="mfx-cp__btn" aria-label="Copy">
            <span class="mfx-cp__icons">
              <svg class="ic copy" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="5" width="8" height="9" rx="1.2"/><path d="M3 11V3.5C3 2.95 3.45 2.5 4 2.5h6"/>
              </svg>
              <svg class="ic check" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 8.5 L6.5 12 L13 4"/>
              </svg>
            </span>
            <span class="mfx-cp__label">复制</span>
          </button>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('.mfx-cp');
      const btn = stageEl.querySelector('.mfx-cp__btn');
      const label = stageEl.querySelector('.mfx-cp__label');
      if (!root || !btn) return { destroy() {} };
      const t = timers();
      let cancelled = false;
      let suspendUntil = 0;
      let inFlight = false;

      function trigger() {
        if (inFlight) return;
        inFlight = true;
        btn.classList.add('is-press');
        t.after(140, () => btn.classList.remove('is-press'));
        btn.classList.add('is-done');
        if (label) label.textContent = '已复制';
        t.after(prefersReducedMotion.matches ? 600 : 1600, () => {
          btn.classList.remove('is-done');
          if (label) label.textContent = '复制';
          inFlight = false;
        });
      }
      function onClick() {
        suspendUntil = performance.now() + 4000;
        trigger();
      }
      btn.addEventListener('click', onClick);

      let cycleHandle = null;
      function autoTick() {
        if (cancelled) return;
        if (performance.now() < suspendUntil) return;
        trigger();
      }
      return {
        start() {
          cancelled = false;
          if (prefersReducedMotion.matches) {
            trigger();
            return;
          }
          if (cycleHandle) return;
          cycleHandle = t.every(2600, autoTick);
        },
        stop() {
          cancelled = true;
          if (cycleHandle) { cycleHandle.clear(); cycleHandle = null; }
        },
        destroy() {
          cancelled = true;
          if (cycleHandle) { cycleHandle.clear(); cycleHandle = null; }
          t.clearAll();
          btn.removeEventListener('click', onClick);
        }
      };
    }
  });

  /* ============================================================
   *  43 · like_heart_burst
   * ============================================================ */
  window.MotionEffects.register('like_heart_burst', {
    card() {
      return `
        <div class="mfx-heart">
          <button type="button" class="mfx-heart__btn" aria-pressed="false" aria-label="Like">
            <svg class="hg" viewBox="0 0 24 24" width="46" height="46" fill="none">
              <path class="stroke" d="M12 20.5s-7-4.4-9.2-9.2C1.2 7.5 3.7 4 7.2 4c2 0 3.6 1.2 4.8 2.7C13.2 5.2 14.8 4 16.8 4c3.5 0 6 3.5 4.4 7.3C19 16.1 12 20.5 12 20.5z" stroke="currentColor" stroke-width="1.6"/>
              <path class="fill" d="M12 20.5s-7-4.4-9.2-9.2C1.2 7.5 3.7 4 7.2 4c2 0 3.6 1.2 4.8 2.7C13.2 5.2 14.8 4 16.8 4c3.5 0 6 3.5 4.4 7.3C19 16.1 12 20.5 12 20.5z" fill="currentColor"/>
            </svg>
            <span class="mfx-heart__count">128</span>
          </button>
          <div class="mfx-heart__particles"></div>
          <div class="mfx-heart__hint">// MICRO · BURST</div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('.mfx-heart');
      const btn = stageEl.querySelector('.mfx-heart__btn');
      const particles = stageEl.querySelector('.mfx-heart__particles');
      const countEl = stageEl.querySelector('.mfx-heart__count');
      if (!root || !btn) return { destroy() {} };
      const t = timers();
      let cancelled = false;
      let liked = false;
      let count = 128;
      let suspendUntil = 0;

      const PARTICLE_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 20.5s-7-4.4-9.2-9.2C1.2 7.5 3.7 4 7.2 4c2 0 3.6 1.2 4.8 2.7C13.2 5.2 14.8 4 16.8 4c3.5 0 6 3.5 4.4 7.3C19 16.1 12 20.5 12 20.5z"/></svg>`;

      function setLiked(v) {
        liked = v;
        btn.setAttribute('aria-pressed', v ? 'true' : 'false');
        btn.classList.toggle('is-liked', v);
        if (countEl) {
          count = 128 + (v ? 1 : 0);
          countEl.textContent = count;
        }
        // pop
        btn.classList.add('is-pop');
        t.after(prefersReducedMotion.matches ? 80 : 420, () => btn.classList.remove('is-pop'));
        if (v && !prefersReducedMotion.matches) emitParticles();
      }
      function emitParticles() {
        const n = 7 + ((Math.random() * 2) | 0);
        for (let i = 0; i < n; i++) {
          const span = document.createElement('span');
          span.className = 'mfx-heart__p';
          const angle = -Math.PI / 2 + (i - (n - 1) / 2) * (Math.PI / (n + 1)) + (Math.random() - 0.5) * 0.3;
          const dist = 36 + Math.random() * 24;
          const dx = Math.cos(angle) * dist;
          const dy = Math.sin(angle) * dist;
          span.style.setProperty('--dx', dx.toFixed(1) + 'px');
          span.style.setProperty('--dy', dy.toFixed(1) + 'px');
          span.style.setProperty('--s', (0.55 + Math.random() * 0.45).toFixed(2));
          span.style.setProperty('--r', (((Math.random() * 60) - 30)) + 'deg');
          span.innerHTML = PARTICLE_SVG;
          particles.appendChild(span);
          t.after(900, () => span.remove());
        }
      }
      function onClick() {
        suspendUntil = performance.now() + 3500;
        setLiked(!liked);
      }
      btn.addEventListener('click', onClick);

      let cycleHandle = null;
      function autoToggle() {
        if (cancelled) return;
        if (performance.now() < suspendUntil) return;
        setLiked(!liked);
      }
      return {
        start() {
          cancelled = false;
          if (prefersReducedMotion.matches) {
            setLiked(true);
            return;
          }
          if (cycleHandle) return;
          cycleHandle = t.every(2400, autoToggle);
        },
        stop() {
          cancelled = true;
          if (cycleHandle) { cycleHandle.clear(); cycleHandle = null; }
        },
        destroy() {
          cancelled = true;
          if (cycleHandle) { cycleHandle.clear(); cycleHandle = null; }
          t.clearAll();
          btn.removeEventListener('click', onClick);
          particles.innerHTML = '';
        }
      };
    }
  });

  /* ============================================================
   *  44 · marquee_ticker
   * ============================================================ */
  window.MotionEffects.register('marquee_ticker', {
    card() {
      const items = [
        'ON AIR — Motion Lab', 'New Release · v0.44', 'Drops Tonight 21:00', 'Designing in Motion',
        'Coach · Talk · Ship', 'Variable Fonts Update', 'Spring Curves · 0.62', 'Pixel-Perfect Pulse',
        '~ no static interfaces ~'
      ];
      const seg = items.map(s => `<span class="mfx-mq__item">${s}</span><span class="mfx-mq__sep">◆</span>`).join('');
      return `
        <div class="mfx-mq">
          <div class="mfx-mq__row">
            <div class="mfx-mq__track">
              <div class="mfx-mq__seg">${seg}</div>
              <div class="mfx-mq__seg" aria-hidden="true">${seg}</div>
            </div>
          </div>
          <div class="mfx-mq__row mfx-mq__row--rev">
            <div class="mfx-mq__track">
              <div class="mfx-mq__seg">${seg}</div>
              <div class="mfx-mq__seg" aria-hidden="true">${seg}</div>
            </div>
          </div>
          <div class="mfx-mq__hint">// HOVER TO SLOW</div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('.mfx-mq');
      const tracks = Array.from(stageEl.querySelectorAll('.mfx-mq__track'));
      if (!root || !tracks.length) return { destroy() {} };
      let cancelled = false;
      let speedTarget = 1;
      let speed = 1;
      const offsets = tracks.map(() => 0);
      const widths = tracks.map(() => 0);
      const speeds = [40, 32]; // px/sec for each row
      let last = 0;

      function measure() {
        tracks.forEach((tr, i) => {
          const seg = tr.querySelector('.mfx-mq__seg');
          if (seg) widths[i] = seg.scrollWidth;
        });
      }
      const ro = ('ResizeObserver' in window) ? new ResizeObserver(measure) : null;
      ro && tracks.forEach(tr => ro.observe(tr));
      // initial measure
      measure();

      const loop = rafLoop((now) => {
        if (cancelled) return;
        const dt = Math.min(64, now - last);
        last = now;
        // lerp speed
        speed += (speedTarget - speed) * 0.08;
        tracks.forEach((tr, i) => {
          const dir = tr.parentElement.classList.contains('mfx-mq__row--rev') ? -1 : 1;
          offsets[i] -= dir * speeds[i] * (dt / 1000) * speed;
          if (widths[i] > 0) {
            if (dir > 0) {
              if (offsets[i] <= -widths[i]) offsets[i] += widths[i];
            } else {
              if (offsets[i] >= 0) offsets[i] -= widths[i];
            }
          }
          tr.style.transform = `translate3d(${offsets[i].toFixed(1)}px,0,0)`;
        });
      });

      function onEnter() { speedTarget = 0.2; }
      function onLeave() { speedTarget = 1; }
      root.addEventListener('mouseenter', onEnter);
      root.addEventListener('mouseleave', onLeave);

      return {
        start() {
          cancelled = false;
          measure();
          if (prefersReducedMotion.matches) {
            tracks.forEach(tr => tr.style.transform = 'translate3d(0,0,0)');
            return;
          }
          last = performance.now();
          loop.start();
        },
        stop() { cancelled = true; loop.stop(); },
        destroy() {
          cancelled = true;
          loop.stop();
          ro && ro.disconnect();
          root.removeEventListener('mouseenter', onEnter);
          root.removeEventListener('mouseleave', onLeave);
        }
      };
    }
  });

})();
