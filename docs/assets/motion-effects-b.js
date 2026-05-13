/* ============================================================
   motion-effects-b.js  —  Batch B (10 effects)
   Effects: holographic_card, liquid_loader, reveal_curtain,
            cursor_aura, morphing_logo, smoke_trail, tilt_card_3d,
            magnetic_cursor, command_palette, kpi_number_roll
   ============================================================ */

(function () {
  // ---- Registry shim (safe whether motion-lab.js loads first or after) ----
  window.MotionEffects = window.MotionEffects || {
    _entries: new Map(),
    register(name, def) { this._entries.set(name, def); },
    get(name) { return this._entries.get(name); },
    has(name) { return this._entries.has(name); }
  };

  // ============================================================
  // Shared helpers
  // ============================================================
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  function makeRAF() {
    let raf = 0, running = false;
    return {
      start(fn) {
        if (running) return;
        running = true;
        const loop = (t) => {
          if (!running) return;
          fn(t);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      },
      stop() {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      },
      get running() { return running; }
    };
  }

  // ============================================================
  // 04 · holographic_card
  // ============================================================
  window.MotionEffects.register('holographic_card', {
    card() {
      return `
        <div class="mfx-holo">
          <div class="mfx-holo-glow"></div>
          <div class="mfx-holo-card">
            <div class="mfx-holo-grid"></div>
            <div class="mfx-holo-sheen"></div>
            <div class="mfx-holo-content">
              <div class="mfx-holo-tag">// HOLO · 04</div>
              <div class="mfx-holo-title">HOLOGRAPHIC<br>CARD</div>
              <div class="mfx-holo-num">SN · 2026·05·13</div>
            </div>
          </div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion, isModal }) {
      const root = stageEl.querySelector('.mfx-holo');
      const card = stageEl.querySelector('.mfx-holo-card');
      const glow = stageEl.querySelector('.mfx-holo-glow');
      if (!root || !card) return { destroy() {} };

      const state = { tx: 0, ty: 0, cx: 0, cy: 0, hover: false };
      const raf = makeRAF();
      let t = 0;

      function setPointer(e) {
        const r = root.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        state.tx = clamp(px, 0, 1);
        state.ty = clamp(py, 0, 1);
      }
      function onEnter() { state.hover = true; }
      function onLeave() { state.hover = false; }

      root.addEventListener('pointerenter', onEnter);
      root.addEventListener('pointerleave', onLeave);
      root.addEventListener('pointermove', setPointer);

      function frame(now) {
        t = now / 1000;
        if (!state.hover) {
          // Lissajous auto-orbit
          state.tx = 0.5 + 0.35 * Math.sin(t * 0.7);
          state.ty = 0.5 + 0.3  * Math.cos(t * 0.5);
        }
        state.cx = lerp(state.cx, state.tx, 0.12);
        state.cy = lerp(state.cy, state.ty, 0.12);
        const rotX = (0.5 - state.cy) * 22;
        const rotY = (state.cx - 0.5) * 26;
        card.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        const xPct = (state.cx * 100).toFixed(1);
        const yPct = (state.cy * 100).toFixed(1);
        card.style.setProperty('--mfx-holo-x', xPct + '%');
        card.style.setProperty('--mfx-holo-y', yPct + '%');
        card.style.setProperty('--mfx-holo-spin', (state.cx * 360 + state.cy * 90).toFixed(1) + 'deg');
        if (glow) {
          glow.style.setProperty('--mfx-holo-x', xPct + '%');
          glow.style.setProperty('--mfx-holo-y', yPct + '%');
        }
      }

      return {
        start() {
          if (prefersReducedMotion && prefersReducedMotion.matches) {
            card.style.transform = 'rotateX(-6deg) rotateY(8deg)';
            return;
          }
          raf.start(frame);
        },
        stop() { raf.stop(); },
        destroy() {
          raf.stop();
          root.removeEventListener('pointerenter', onEnter);
          root.removeEventListener('pointerleave', onLeave);
          root.removeEventListener('pointermove', setPointer);
        }
      };
    }
  });

  // ============================================================
  // 06 · liquid_loader
  // ============================================================
  window.MotionEffects.register('liquid_loader', {
    card({ module }) {
      const uid = (module?.id || Math.random().toString(36).slice(2,6)) + '-liq';
      return `
        <div class="mfx-liq" data-uid="${uid}">
          <div class="mfx-liq-vessel">
            <svg class="mfx-liq-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-${uid}" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stop-color="var(--cc)" stop-opacity="0.95"/>
                  <stop offset="100%" stop-color="var(--cc)" stop-opacity="0.65"/>
                </linearGradient>
                <clipPath id="clip-${uid}"><circle cx="50" cy="50" r="49"/></clipPath>
              </defs>
              <g clip-path="url(#clip-${uid})">
                <path class="mfx-liq-wave mfx-liq-wave-back" d="M0,60 Q25,55 50,60 T100,60 L100,100 L0,100 Z"
                      fill="url(#grad-${uid})" opacity="0.55"></path>
                <path class="mfx-liq-wave mfx-liq-wave-front" d="M0,62 Q25,57 50,62 T100,62 L100,100 L0,100 Z"
                      fill="url(#grad-${uid})"></path>
                <g class="mfx-liq-bubbles"></g>
              </g>
            </svg>
            <div class="mfx-liq-label" data-pct="0">0%</div>
            <div class="mfx-liq-drop"></div>
          </div>
          <div class="mfx-liq-ring"></div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('.mfx-liq');
      const back = stageEl.querySelector('.mfx-liq-wave-back');
      const front = stageEl.querySelector('.mfx-liq-wave-front');
      const bubbles = stageEl.querySelector('.mfx-liq-bubbles');
      const label = stageEl.querySelector('.mfx-liq-label');
      const drop = stageEl.querySelector('.mfx-liq-drop');
      if (!root || !back || !front) return { destroy() {} };

      const raf = makeRAF();
      let cycleStart = 0;
      const cycleDur = 5200;

      function buildWave(amp, len, phase, level) {
        // SVG path 0..100 wide
        const pts = [];
        for (let x = 0; x <= 100; x += 5) {
          const y = level + Math.sin((x / 100) * len * Math.PI * 2 + phase) * amp;
          pts.push(`${x},${y.toFixed(2)}`);
        }
        return `M${pts.join(' L')} L100,100 L0,100 Z`;
      }

      const liveBubbles = [];
      function spawnBubble(level) {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const x = 10 + Math.random() * 80;
        c.setAttribute('cx', x);
        c.setAttribute('cy', 98);
        c.setAttribute('r', (0.6 + Math.random() * 1.4).toFixed(2));
        c.setAttribute('fill', 'white');
        c.setAttribute('opacity', '0.55');
        bubbles.appendChild(c);
        liveBubbles.push({ el: c, x, y: 98, vy: 0.2 + Math.random() * 0.4, born: performance.now(), life: 1800 + Math.random() * 1200, level });
      }

      function frame(now) {
        if (!cycleStart) cycleStart = now;
        const t = ((now - cycleStart) % cycleDur) / cycleDur; // 0..1
        const fill = t < 0.85 ? (t / 0.85) : 1; // 0..1, then hold near top
        const pct = Math.round(fill * 100);
        const level = 100 - fill * 90 - 5; // water level (smaller = higher)
        const phase = now / 700;
        front.setAttribute('d', buildWave(2.4, 1.6, phase, level));
        back.setAttribute('d', buildWave(2.0, 2.1, phase * 0.7 + 1.4, level + 1.4));
        if (label) {
          label.textContent = pct + '%';
          label.setAttribute('data-pct', String(pct));
        }
        // bubbles
        if (now - (frame._lastBubble || 0) > 320 && fill > 0.05) {
          spawnBubble(level);
          frame._lastBubble = now;
        }
        for (let i = liveBubbles.length - 1; i >= 0; i--) {
          const b = liveBubbles[i];
          const age = now - b.born;
          b.y -= b.vy;
          if (b.y < level + 1 || age > b.life) {
            b.el.remove();
            liveBubbles.splice(i, 1);
          } else {
            b.el.setAttribute('cy', b.y.toFixed(2));
            b.el.setAttribute('opacity', String(Math.max(0, 0.55 - age / b.life * 0.55)));
          }
        }
        // overflow drop near top of cycle
        if (t > 0.86 && drop && !drop._anim) {
          drop._anim = true;
          drop.animate(
            [
              { transform: 'translate(-50%, 0) scale(0)',     opacity: 0 },
              { transform: 'translate(-50%, -4px) scale(1)',  opacity: 1, offset: 0.2 },
              { transform: 'translate(-50%, 28px) scale(1)',  opacity: 1, offset: 0.85 },
              { transform: 'translate(-50%, 36px) scale(0.6)',opacity: 0 }
            ],
            { duration: 700, easing: 'cubic-bezier(0.4,0.2,0.2,1)' }
          ).onfinish = () => { drop._anim = false; };
        }
      }

      return {
        start() {
          if (prefersReducedMotion && prefersReducedMotion.matches) {
            front.setAttribute('d', buildWave(0.5, 1.6, 0, 40));
            back.setAttribute('d', buildWave(0.5, 2.1, 0, 42));
            if (label) label.textContent = '60%';
            return;
          }
          cycleStart = 0;
          raf.start(frame);
        },
        stop() { raf.stop(); },
        destroy() {
          raf.stop();
          liveBubbles.forEach(b => b.el.remove());
          liveBubbles.length = 0;
        }
      };
    }
  });

  // ============================================================
  // 07 · reveal_curtain
  // ============================================================
  window.MotionEffects.register('reveal_curtain', {
    card() {
      return `
        <div class="mfx-rc">
          <div class="mfx-rc-old"><div class="mfx-rc-title">PAGE · A</div></div>
          <div class="mfx-rc-new"><div class="mfx-rc-title">PAGE · B</div></div>
          <div class="mfx-rc-curtain"></div>
          <div class="mfx-rc-slit"></div>
          <div class="mfx-rc-tick"><i></i><span>REVEAL</span><i></i></div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('.mfx-rc');
      const curtain = stageEl.querySelector('.mfx-rc-curtain');
      const slit = stageEl.querySelector('.mfx-rc-slit');
      const newPage = stageEl.querySelector('.mfx-rc-new');
      const oldPage = stageEl.querySelector('.mfx-rc-old');
      if (!root || !curtain || !slit) return { destroy() {} };

      const raf = makeRAF();
      let t0 = 0;
      // cycle: 0..1 sweep right, 1..2 hold, 2..3 sweep off, 3..5 hold new
      const cycleDur = 5000;
      const easeInOut = (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

      function frame(now) {
        if (!t0) t0 = now;
        const t = ((now - t0) % cycleDur) / cycleDur;
        let curtainP = 0;  // 0 = off-left, 0.5 = covering, 1 = off-right
        let slitP = 0;
        let labelSwap = false;

        if (t < 0.35) {
          const p = easeInOut(t / 0.35);
          curtainP = p * 0.5;
          slitP = p * 0.5 + 0.02;
        } else if (t < 0.50) {
          curtainP = 0.5;
          slitP = 0.5;
          labelSwap = true;
        } else if (t < 0.85) {
          const p = easeInOut((t - 0.50) / 0.35);
          curtainP = 0.5 + p * 0.5;
          slitP = 0.5 + p * 0.5 + 0.02;
          labelSwap = true;
        } else {
          curtainP = 1;
          slitP = 1.05;
          labelSwap = true;
        }
        // Map 0..1 to translateX -130%..130% diagonally
        const curtainX = lerp(-130, 130, curtainP);
        const slitX = lerp(-130, 130, slitP);
        curtain.style.transform = `translate(${curtainX}%, 0) rotate(20deg)`;
        slit.style.transform = `translate(${slitX}%, 0) rotate(20deg)`;
        slit.style.opacity = (curtainP > 0.02 && curtainP < 0.98) ? '1' : '0';
        // New page reveals along the slit
        const slitNorm = clamp(slitP, 0, 1);
        // diagonal clip-path mask
        const cx = slitNorm * 100;
        newPage.style.clipPath =
          `polygon(0% 0%, ${cx + 30}% 0%, ${cx - 30}% 100%, 0% 100%)`;
        if (labelSwap) {
          oldPage.style.opacity = curtainP > 0.5 ? '0' : '0.6';
        } else {
          oldPage.style.opacity = '1';
        }
      }

      return {
        start() {
          if (prefersReducedMotion && prefersReducedMotion.matches) {
            curtain.style.transform = 'translate(130%,0) rotate(20deg)';
            slit.style.opacity = '0';
            newPage.style.clipPath = 'polygon(0 0,100% 0,100% 100%,0 100%)';
            return;
          }
          t0 = 0;
          raf.start(frame);
        },
        stop() { raf.stop(); },
        destroy() { raf.stop(); }
      };
    }
  });

  // ============================================================
  // 08 · cursor_aura
  // ============================================================
  window.MotionEffects.register('cursor_aura', {
    card() {
      return `
        <div class="mfx-aura">
          <div class="mfx-aura-grid"></div>
          <div class="mfx-aura-hit" data-tone="action" data-snap="1" style="left:14%;top:30%">ACTION</div>
          <div class="mfx-aura-hit" data-tone="muted"  data-snap="1" style="right:12%;top:22%">LINK</div>
          <div class="mfx-aura-hit" data-tone="action" data-snap="1" style="left:22%;bottom:24%">SUBMIT</div>
          <div class="mfx-aura-hit" data-tone="muted"  data-snap="0" style="right:18%;bottom:30%">label</div>
          <div class="mfx-aura-glow"></div>
          <div class="mfx-aura-dot"></div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('.mfx-aura');
      const glow = stageEl.querySelector('.mfx-aura-glow');
      const dot  = stageEl.querySelector('.mfx-aura-dot');
      const hits = Array.from(stageEl.querySelectorAll('.mfx-aura-hit'));
      if (!root || !glow || !dot) return { destroy() {} };

      const raf = makeRAF();
      const state = { tx: 0.5, ty: 0.5, cx: 0.5, cy: 0.5, sx: 1, sy: 1, hover: false, hue: 0 };
      let snapTarget = null;
      let t0 = 0;

      function onMove(e) {
        const r = root.getBoundingClientRect();
        state.tx = (e.clientX - r.left) / r.width;
        state.ty = (e.clientY - r.top)  / r.height;
      }
      function onEnter() { state.hover = true; }
      function onLeave() { state.hover = false; }

      root.addEventListener('pointerenter', onEnter);
      root.addEventListener('pointerleave', onLeave);
      root.addEventListener('pointermove',  onMove);

      function frame(now) {
        if (!t0) t0 = now;
        const tt = (now - t0) / 1000;
        if (!state.hover) {
          // drift across the stage in a slow ellipse
          state.tx = 0.5 + 0.32 * Math.sin(tt * 0.55);
          state.ty = 0.5 + 0.28 * Math.cos(tt * 0.4);
        }
        state.cx = lerp(state.cx, state.tx, 0.13);
        state.cy = lerp(state.cy, state.ty, 0.13);

        const r = root.getBoundingClientRect();
        const px = state.cx * r.width;
        const py = state.cy * r.height;

        // detect snap target
        let nearest = null;
        let nearestDist = Infinity;
        for (const h of hits) {
          if (h.dataset.snap !== '1') continue;
          const hr = h.getBoundingClientRect();
          const hx = hr.left + hr.width / 2 - r.left;
          const hy = hr.top  + hr.height / 2 - r.top;
          const dx = hx - px, dy = hy - py;
          const d = Math.hypot(dx, dy);
          if (d < 46 && d < nearestDist) { nearest = { h, hx, hy, d }; nearestDist = d; }
        }
        if (nearest !== snapTarget) {
          snapTarget = nearest;
          hits.forEach(h => h.style.borderColor = '');
          if (snapTarget) snapTarget.h.style.borderColor = 'var(--cc)';
        }
        // ease toward snap point if any
        let ax = px, ay = py;
        if (snapTarget) {
          ax = lerp(px, snapTarget.hx, 0.35);
          ay = lerp(py, snapTarget.hy, 0.35);
        }
        const targetScale = snapTarget ? 1.35 : 1.0;
        state.sx = lerp(state.sx, targetScale, 0.1);
        // hue: pure cc when over an action; faint when not
        const isAction = snapTarget && snapTarget.h.dataset.tone === 'action';
        glow.style.opacity = snapTarget ? '1' : '0.55';
        glow.style.background = isAction
          ? `radial-gradient(circle, color-mix(in srgb, var(--cc) 70%, white) 0%, color-mix(in srgb, var(--cc) 45%, transparent) 35%, transparent 65%)`
          : `radial-gradient(circle, color-mix(in srgb, var(--cc) 50%, white) 0%, color-mix(in srgb, var(--cc) 35%, transparent) 40%, transparent 65%)`;
        glow.style.transform = `translate(${ax}px, ${ay}px) translate(-50%,-50%) scale(${state.sx.toFixed(3)})`;
        dot.style.transform = `translate(${ax}px, ${ay}px) translate(-50%,-50%)`;
      }

      return {
        start() {
          if (prefersReducedMotion && prefersReducedMotion.matches) {
            const r = root.getBoundingClientRect();
            glow.style.transform = `translate(${r.width/2}px, ${r.height/2}px) translate(-50%,-50%)`;
            dot.style.transform  = `translate(${r.width/2}px, ${r.height/2}px) translate(-50%,-50%)`;
            return;
          }
          t0 = 0;
          raf.start(frame);
        },
        stop() { raf.stop(); },
        destroy() {
          raf.stop();
          root.removeEventListener('pointerenter', onEnter);
          root.removeEventListener('pointerleave', onLeave);
          root.removeEventListener('pointermove',  onMove);
        }
      };
    }
  });

  // ============================================================
  // 09 · morphing_logo
  // ============================================================
  window.MotionEffects.register('morphing_logo', {
    card() {
      // Three slots holding three role-marked shapes (circle, square, triangle).
      return `
        <div class="mfx-morph">
          <svg class="mfx-morph-svg" viewBox="-50 -50 100 100">
            <g data-slot="0"></g>
            <g data-slot="1"></g>
            <g data-slot="2"></g>
          </svg>
          <div class="mfx-morph-baseline">// GEOMETRIC · SHUFFLE</div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const svg = stageEl.querySelector('.mfx-morph-svg');
      const slots = Array.from(stageEl.querySelectorAll('[data-slot]'));
      if (!svg || slots.length !== 3) return { destroy() {} };

      // Slot positions arranged as a balanced triangle composition
      const slotPos = [
        { x: -22, y: -10 },
        { x:  22, y: -10 },
        { x:   0, y:  22 }
      ];

      const NS = 'http://www.w3.org/2000/svg';
      function buildShape(kind) {
        if (kind === 'circle') {
          const c = document.createElementNS(NS, 'circle');
          c.setAttribute('r', 14);
          c.setAttribute('class', 'mfx-morph-shape is-circle');
          return c;
        }
        if (kind === 'square') {
          const r = document.createElementNS(NS, 'rect');
          r.setAttribute('x', -13); r.setAttribute('y', -13);
          r.setAttribute('width', 26); r.setAttribute('height', 26);
          r.setAttribute('class', 'mfx-morph-shape is-square');
          return r;
        }
        const p = document.createElementNS(NS, 'polygon');
        // equilateral triangle
        p.setAttribute('points', '0,-15 13,10 -13,10');
        p.setAttribute('class', 'mfx-morph-shape is-tri');
        return p;
      }

      // Start with one of each
      let assignment = ['circle', 'square', 'tri'];
      function paint() {
        assignment.forEach((kind, i) => {
          const slot = slots[i];
          slot.innerHTML = '';
          const shape = buildShape(kind);
          slot.appendChild(shape);
          const { x, y } = slotPos[i];
          slot.setAttribute('transform', `translate(${x} ${y})`);
        });
      }
      paint();

      let timer = 0;
      function shuffle() {
        // Permute the assignment (always a fresh non-identity)
        let next;
        do {
          next = assignment.slice().sort(() => Math.random() - 0.5);
        } while (next.every((v, i) => v === assignment[i]));
        // animate each slot: rotate + scale, then swap shape midway
        slots.forEach((slot, i) => {
          const { x, y } = slotPos[i];
          slot.style.transition = 'transform 0.45s cubic-bezier(0.7,0,0.3,1)';
          slot.style.transformBox = 'fill-box';
          slot.style.transformOrigin = 'center';
          slot.style.transform =
            `translate(${x}px, ${y}px) rotate(${Math.random() < 0.5 ? -180 : 180}deg) scale(0.3)`;
          setTimeout(() => {
            // swap content and revert
            const newKind = next[i];
            slot.innerHTML = '';
            slot.appendChild(buildShape(newKind));
            slot.setAttribute('transform', `translate(${x} ${y})`);
            slot.style.transform =
              `translate(${x}px, ${y}px) rotate(0deg) scale(1)`;
          }, 450);
        });
        assignment = next;
      }

      return {
        start() {
          if (prefersReducedMotion && prefersReducedMotion.matches) return;
          if (timer) return;
          timer = setInterval(shuffle, 2400);
        },
        stop() {
          if (timer) clearInterval(timer);
          timer = 0;
        },
        destroy() {
          if (timer) clearInterval(timer);
          timer = 0;
        }
      };
    }
  });

  // ============================================================
  // 11 · smoke_trail
  // ============================================================
  window.MotionEffects.register('smoke_trail', {
    card() {
      return `
        <div class="mfx-smoke">
          <canvas></canvas>
          <div class="mfx-smoke-hint">// SMOKE · TRAIL</div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion, cat }) {
      const root = stageEl.querySelector('.mfx-smoke');
      const canvas = stageEl.querySelector('canvas');
      if (!root || !canvas) return { destroy() {} };
      const ctx = canvas.getContext('2d');
      const raf = makeRAF();

      // Pastel palette derived from category color
      const palettes = [
        ['255,182,224', '180,200,255', '208,255,224'], // soft pink/blue/mint
        ['255,210,170', '200,180,255', '180,240,255'], // peach/lilac/cyan
        ['255,200,200', '210,220,255', '220,255,210']
      ];
      const palette = palettes[Math.floor(Math.random() * palettes.length)];

      let w = 0, h = 0, dpr = 1;
      function resize() {
        w = Math.max(1, root.clientWidth);
        h = Math.max(1, root.clientHeight);
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      const ro = new ResizeObserver(resize); ro.observe(root); resize();

      const parts = [];
      const state = { mx: w/2, my: h/2, lastEmit: 0, hover: false };

      function onMove(e) {
        const r = root.getBoundingClientRect();
        state.mx = e.clientX - r.left;
        state.my = e.clientY - r.top;
      }
      function onEnter() { state.hover = true; }
      function onLeave() { state.hover = false; }
      root.addEventListener('pointermove', onMove);
      root.addEventListener('pointerenter', onEnter);
      root.addEventListener('pointerleave', onLeave);

      let t0 = 0;
      function emit(x, y) {
        const N = 2;
        for (let i = 0; i < N; i++) {
          parts.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -0.35 - Math.random() * 0.5,
            r: 10 + Math.random() * 14,
            life: 0,
            ttl: 90 + Math.random() * 40,
            hue: palette[Math.floor(Math.random() * palette.length)]
          });
        }
      }

      function frame(now) {
        if (!t0) t0 = now;
        const tt = (now - t0) / 1000;
        // fake cursor when not hovering
        if (!state.hover) {
          state.mx = w * (0.5 + 0.34 * Math.sin(tt * 0.6));
          state.my = h * (0.5 + 0.26 * Math.cos(tt * 0.9));
        }
        // emit
        if (now - state.lastEmit > 22) {
          emit(state.mx, state.my);
          state.lastEmit = now;
        }
        // fade
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,0.08)';
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';

        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.vy -= 0.005;
          p.vx *= 0.99;
          p.r += 0.35;
          const k = p.life / p.ttl;
          if (k >= 1) { parts.splice(i, 1); continue; }
          const alpha = (1 - k) * 0.35;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, `rgba(${p.hue},${alpha.toFixed(3)})`);
          g.addColorStop(1, `rgba(${p.hue},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      return {
        start() {
          if (prefersReducedMotion && prefersReducedMotion.matches) {
            ctx.clearRect(0, 0, w, h);
            return;
          }
          t0 = 0;
          raf.start(frame);
        },
        stop() { raf.stop(); },
        destroy() {
          raf.stop();
          parts.length = 0;
          ro.disconnect();
          root.removeEventListener('pointermove', onMove);
          root.removeEventListener('pointerenter', onEnter);
          root.removeEventListener('pointerleave', onLeave);
        }
      };
    }
  });

  // ============================================================
  // 13 · tilt_card_3d
  // ============================================================
  window.MotionEffects.register('tilt_card_3d', {
    card() {
      return `
        <div class="mfx-tilt">
          <div class="mfx-tilt-card">
            <div class="mfx-tilt-layer mfx-tilt-bg" data-depth="0.4"></div>
            <div class="mfx-tilt-layer mfx-tilt-mid" data-depth="1.0">
              <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="30,6 54,20 54,44 30,58 6,44 6,20" />
                <path d="M30 6 V32 M30 32 L54 20 M30 32 L6 20 M30 32 V58" stroke-opacity="0.55"/>
              </svg>
            </div>
            <div class="mfx-tilt-layer mfx-tilt-text" data-depth="1.8">
              <strong>VISTA NODE 03</strong>
              <small>// PARALLAX · TILT</small>
            </div>
            <div class="mfx-tilt-layer mfx-tilt-shine" data-depth="0.2"></div>
          </div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('.mfx-tilt');
      const card = stageEl.querySelector('.mfx-tilt-card');
      const layers = Array.from(stageEl.querySelectorAll('.mfx-tilt-layer'));
      if (!root || !card) return { destroy() {} };

      const state = { tx: 0, ty: 0, cx: 0, cy: 0, hover: false };
      const raf = makeRAF();
      let t0 = 0;

      function onMove(e) {
        const r = root.getBoundingClientRect();
        state.tx = (e.clientX - r.left) / r.width  - 0.5;
        state.ty = (e.clientY - r.top)  / r.height - 0.5;
      }
      function onEnter() { state.hover = true; }
      function onLeave() { state.hover = false; }
      root.addEventListener('pointerenter', onEnter);
      root.addEventListener('pointerleave', onLeave);
      root.addEventListener('pointermove',  onMove);

      function frame(now) {
        if (!t0) t0 = now;
        const tt = (now - t0) / 1000;
        if (!state.hover) {
          state.tx = 0.35 * Math.sin(tt * 0.7);
          state.ty = 0.3  * Math.cos(tt * 0.5);
        }
        state.cx = lerp(state.cx, state.tx, 0.12);
        state.cy = lerp(state.cy, state.ty, 0.12);
        const rotY = state.cx * 24;
        const rotX = -state.cy * 20;
        card.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        // Parallax layers
        layers.forEach(l => {
          const d = parseFloat(l.dataset.depth || '1');
          const ox = -state.cx * d * 14;
          const oy = -state.cy * d * 12;
          const z = parseFloat(getComputedStyle(l).getPropertyValue('--mfx-tilt-z') || '0');
          // preserve translateZ from CSS by using matrix-friendly approach
          l.style.transform = `translateZ(${[10,40,70,90][layers.indexOf(l)] || 20}px) translate(${ox.toFixed(2)}px, ${oy.toFixed(2)}px)`;
        });
      }

      return {
        start() {
          if (prefersReducedMotion && prefersReducedMotion.matches) {
            card.style.transform = 'rotateX(-6deg) rotateY(10deg)';
            return;
          }
          raf.start(frame);
        },
        stop() { raf.stop(); },
        destroy() {
          raf.stop();
          root.removeEventListener('pointerenter', onEnter);
          root.removeEventListener('pointerleave', onLeave);
          root.removeEventListener('pointermove',  onMove);
        }
      };
    }
  });

  // ============================================================
  // 16 · magnetic_cursor
  // ============================================================
  window.MotionEffects.register('magnetic_cursor', {
    card() {
      return `
        <div class="mfx-mag">
          <div class="mfx-mag-btn">
            <span class="mfx-mag-arrow"></span>
            <span class="mfx-mag-label">ENGAGE</span>
          </div>
          <div class="mfx-mag-cursor"></div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('.mfx-mag');
      const btn = stageEl.querySelector('.mfx-mag-btn');
      const label = stageEl.querySelector('.mfx-mag-label');
      const cursor = stageEl.querySelector('.mfx-mag-cursor');
      if (!root || !btn) return { destroy() {} };

      const state = {
        mx: 0, my: 0,            // current pointer (in root coords)
        tmx: 0, tmy: 0,          // target pointer
        bvx: 0, bvy: 0,          // button spring velocity
        bx: 0, by: 0,            // button offset
        lx: 0, ly: 0,            // label offset (delayed)
        hover: false
      };
      const raf = makeRAF();
      let t0 = 0;

      function onMove(e) {
        const r = root.getBoundingClientRect();
        state.tmx = e.clientX - r.left;
        state.tmy = e.clientY - r.top;
      }
      function onEnter() { state.hover = true; }
      function onLeave() { state.hover = false; }
      root.addEventListener('pointermove',  onMove);
      root.addEventListener('pointerenter', onEnter);
      root.addEventListener('pointerleave', onLeave);

      function frame(now) {
        if (!t0) t0 = now;
        const tt = (now - t0) / 1000;
        const r = root.getBoundingClientRect();
        // fake cursor when not hovering — pulses in toward button periodically
        if (!state.hover) {
          const cx = r.width / 2;
          const cy = r.height / 2;
          // 4s period: drift out, pulse in
          const phase = (tt % 4) / 4;
          const orbit = Math.PI * 2 * phase;
          const orbitR = 70 + 28 * Math.sin(phase * Math.PI * 4);
          state.tmx = cx + Math.cos(orbit) * orbitR;
          state.tmy = cy + Math.sin(orbit) * orbitR * 0.55;
        }
        state.mx = lerp(state.mx, state.tmx, 0.25);
        state.my = lerp(state.my, state.tmy, 0.25);

        // Button magnetic pull (spring)
        const bRect = btn.getBoundingClientRect();
        const bcx = bRect.left + bRect.width / 2 - r.left;
        const bcy = bRect.top  + bRect.height / 2 - r.top;
        const dx = state.mx - bcx;
        const dy = state.my - bcy;
        const dist = Math.hypot(dx, dy);
        const range = 110;
        let pullX = 0, pullY = 0;
        if (dist < range) {
          const k = 1 - dist / range; // 0..1
          pullX = dx * k * 0.45;
          pullY = dy * k * 0.45;
        }
        const stiffness = 0.18;
        const damping = 0.7;
        const ax = (pullX - state.bx) * stiffness;
        const ay = (pullY - state.by) * stiffness;
        state.bvx = (state.bvx + ax) * damping;
        state.bvy = (state.bvy + ay) * damping;
        state.bx += state.bvx;
        state.by += state.bvy;

        // Label lags the button by ~80ms
        state.lx = lerp(state.lx, state.bx, 0.18);
        state.ly = lerp(state.ly, state.by, 0.18);

        btn.style.transform = `translate(${state.bx.toFixed(2)}px, ${state.by.toFixed(2)}px)`;
        label.style.transform = `translate(${(state.lx - state.bx).toFixed(2)}px, ${(state.ly - state.by).toFixed(2)}px)`;
        cursor.style.transform = `translate(${state.mx.toFixed(2)}px, ${state.my.toFixed(2)}px) translate(-50%,-50%) scale(${dist < range ? 1.4 : 1})`;
      }

      return {
        start() {
          if (prefersReducedMotion && prefersReducedMotion.matches) {
            btn.style.transform = 'translate(0,0)';
            cursor.style.opacity = '0';
            return;
          }
          t0 = 0;
          raf.start(frame);
        },
        stop() { raf.stop(); },
        destroy() {
          raf.stop();
          root.removeEventListener('pointermove',  onMove);
          root.removeEventListener('pointerenter', onEnter);
          root.removeEventListener('pointerleave', onLeave);
        }
      };
    }
  });

  // ============================================================
  // 18 · command_palette
  // ============================================================
  window.MotionEffects.register('command_palette', {
    card() {
      return `
        <div class="mfx-cmd">
          <div class="mfx-cmd-bg">
            <div class="mfx-cmd-fake-row mid"></div>
            <div class="mfx-cmd-fake-row short"></div>
            <div class="mfx-cmd-fake-row mid"></div>
            <div class="mfx-cmd-fake-row short"></div>
          </div>
          <div class="mfx-cmd-panel">
            <div class="mfx-cmd-input">
              <span class="mfx-cmd-prompt">⌘</span>
              <span class="mfx-cmd-query"></span>
              <span class="mfx-cmd-caret"></span>
              <span class="mfx-cmd-kbd">ESC</span>
            </div>
            <div class="mfx-cmd-results">
              <div class="mfx-cmd-highlight"></div>
              <div class="mfx-cmd-item"><span class="mfx-cmd-icon">→</span><span data-label>New module</span></div>
              <div class="mfx-cmd-item"><span class="mfx-cmd-icon">⊞</span><span data-label>Toggle grid</span></div>
              <div class="mfx-cmd-item"><span class="mfx-cmd-icon">⌕</span><span data-label>Search prompts</span></div>
              <div class="mfx-cmd-item"><span class="mfx-cmd-icon">⎙</span><span data-label>Export snippet</span></div>
            </div>
          </div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('.mfx-cmd');
      const panel = stageEl.querySelector('.mfx-cmd-panel');
      const query = stageEl.querySelector('.mfx-cmd-query');
      const items = Array.from(stageEl.querySelectorAll('.mfx-cmd-item'));
      const highlight = stageEl.querySelector('.mfx-cmd-highlight');
      if (!root || !panel || !query || !highlight) return { destroy() {} };

      const queries = ['new ', 'new module', 'export', 'search'];
      const itemHeight = 30; // matches CSS
      let raf = 0;
      let timeouts = [];
      let cancelled = false;

      function clearTimers() {
        timeouts.forEach(clearTimeout);
        timeouts = [];
      }

      function sleep(ms) {
        return new Promise(res => {
          const id = setTimeout(res, ms);
          timeouts.push(id);
        });
      }

      function setItemsVisible(visible) {
        items.forEach((el, i) => {
          el.style.transitionDelay = visible ? `${80 + i * 70}ms` : '0ms';
        });
      }

      function setActiveItem(i, animate) {
        items.forEach((el, j) => el.classList.toggle('is-active', j === i));
        const top = 6 + i * itemHeight; // 6 = .mfx-cmd-results padding-top
        highlight.style.transform = `translateY(${top}px)`;
        if (!animate) {
          // jump immediately
          const orig = highlight.style.transition;
          highlight.style.transition = 'none';
          // eslint-disable-next-line no-unused-expressions
          highlight.offsetWidth;
          highlight.style.transition = orig;
        }
      }

      async function runCycle() {
        if (cancelled) return;
        // closed → open
        root.classList.remove('is-open');
        query.textContent = '';
        setItemsVisible(false);
        await sleep(700);
        if (cancelled) return;
        root.classList.add('is-open');
        setItemsVisible(true);
        // type the query
        const q = queries[(runCycle._i = ((runCycle._i || 0) + 1)) % queries.length];
        for (let k = 0; k <= q.length; k++) {
          if (cancelled) return;
          query.textContent = q.slice(0, k);
          await sleep(95);
        }
        setActiveItem(0, false);
        await sleep(700);
        if (cancelled) return;
        setActiveItem(1, true);
        await sleep(500);
        if (cancelled) return;
        setActiveItem(2, true);
        await sleep(500);
        if (cancelled) return;
        setActiveItem(3, true);
        await sleep(900);
        if (cancelled) return;
        // close
        root.classList.remove('is-open');
        await sleep(900);
        if (cancelled) return;
        runCycle();
      }

      return {
        start() {
          cancelled = false;
          if (prefersReducedMotion && prefersReducedMotion.matches) {
            root.classList.add('is-open');
            query.textContent = 'search';
            setActiveItem(0, false);
            return;
          }
          runCycle();
        },
        stop() {
          cancelled = true;
          clearTimers();
        },
        destroy() {
          cancelled = true;
          clearTimers();
          if (raf) cancelAnimationFrame(raf);
        }
      };
    }
  });

  // ============================================================
  // 29 · kpi_number_roll
  // ============================================================
  window.MotionEffects.register('kpi_number_roll', {
    card() {
      return `
        <div class="mfx-kpi">
          <div class="mfx-kpi-head">
            <span><span class="mfx-kpi-dot"></span>WEEKLY REVENUE</span>
            <span class="mfx-kpi-meta">USD · LIVE</span>
          </div>
          <div class="mfx-kpi-main">
            <div class="mfx-kpi-num">
              <span class="mfx-kpi-prefix">$</span>
              <span class="mfx-kpi-digits"></span>
            </div>
            <div class="mfx-kpi-delta">— 0.0%</div>
          </div>
          <div class="mfx-kpi-foot">
            <div class="mfx-kpi-spark"></div>
            <span class="mfx-kpi-meta">7D</span>
          </div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const root = stageEl.querySelector('.mfx-kpi');
      const digitsEl = stageEl.querySelector('.mfx-kpi-digits');
      const deltaEl = stageEl.querySelector('.mfx-kpi-delta');
      const sparkEl = stageEl.querySelector('.mfx-kpi-spark');
      if (!root || !digitsEl || !deltaEl) return { destroy() {} };

      let current = 24380;
      const history = [];
      // Seed history
      for (let i = 0; i < 12; i++) {
        history.push(20000 + Math.random() * 8000);
      }
      let timer = 0;

      function format(n) {
        // 5-digit number with thousand separator (e.g. 24,380)
        return Math.round(n).toLocaleString('en-US');
      }

      function buildDigits(numStr) {
        // Build a digit roller for each numeric char; punctuation as static span.
        digitsEl.innerHTML = '';
        for (const ch of numStr) {
          if (/[0-9]/.test(ch)) {
            const d = document.createElement('span');
            d.className = 'mfx-kpi-digit';
            const roll = document.createElement('span');
            roll.className = 'mfx-kpi-roll';
            // 0..9 stacked, then top digit again for smooth loop (but we go directly)
            for (let i = 0; i <= 9; i++) {
              const s = document.createElement('span');
              s.textContent = String(i);
              roll.appendChild(s);
            }
            d.appendChild(roll);
            d.dataset.value = ch;
            // initial position
            roll.style.transition = 'none';
            roll.style.transform = `translateY(${-parseInt(ch, 10)}em)`;
            // reflow then restore transition
            // eslint-disable-next-line no-unused-expressions
            roll.offsetWidth;
            roll.style.transition = '';
            digitsEl.appendChild(d);
          } else {
            const s = document.createElement('span');
            s.className = 'mfx-kpi-static';
            s.textContent = ch;
            digitsEl.appendChild(s);
          }
        }
      }

      function rollTo(numStr) {
        const existing = Array.from(digitsEl.children);
        // If structure differs (digit count change), rebuild then re-roll from a sensible offset.
        const sameLayout = existing.length === numStr.length
          && existing.every((el, i) => {
            const ch = numStr[i];
            const isDigit = /[0-9]/.test(ch);
            return isDigit ? el.classList.contains('mfx-kpi-digit') : el.classList.contains('mfx-kpi-static');
          });
        if (!sameLayout) {
          buildDigits(numStr);
          return;
        }
        for (let i = 0; i < numStr.length; i++) {
          const ch = numStr[i];
          const el = existing[i];
          if (!/[0-9]/.test(ch)) {
            el.textContent = ch;
            continue;
          }
          const roll = el.querySelector('.mfx-kpi-roll');
          const target = parseInt(ch, 10);
          // Stagger right-to-left (units roll fastest, higher places lag)
          const delay = (numStr.length - 1 - i) * 50;
          roll.style.transitionDelay = delay + 'ms';
          roll.style.transform = `translateY(${-target}em)`;
          el.dataset.value = ch;
        }
      }

      function paintSpark() {
        sparkEl.innerHTML = '';
        const max = Math.max(...history);
        const min = Math.min(...history) * 0.9;
        history.forEach((v, i) => {
          const bar = document.createElement('i');
          const h = ((v - min) / (max - min || 1)) * 22;
          bar.style.height = Math.max(3, h).toFixed(1) + 'px';
          if (i === history.length - 1) bar.classList.add('is-current');
          sparkEl.appendChild(bar);
        });
      }

      function update() {
        const delta = (Math.random() - 0.4) * 2400; // bias slightly upward
        const next = Math.max(8000, Math.min(99999, current + delta));
        const dir = next > current ? 'up' : (next < current ? 'down' : 'flat');
        const pct = ((next - current) / current) * 100;
        current = next;
        history.push(next);
        if (history.length > 14) history.shift();

        rollTo(format(next));
        deltaEl.textContent = `${dir === 'up' ? '↑' : dir === 'down' ? '↓' : '—'} ${Math.abs(pct).toFixed(1)}%`;
        root.classList.remove('is-up', 'is-down');
        if (dir === 'up')   root.classList.add('is-up');
        if (dir === 'down') root.classList.add('is-down');
        paintSpark();
        // Fade tint back to neutral
        setTimeout(() => root.classList.remove('is-up', 'is-down'), 1000);
      }

      // Initial paint
      buildDigits(format(current));
      paintSpark();

      return {
        start() {
          if (prefersReducedMotion && prefersReducedMotion.matches) return;
          if (timer) return;
          timer = setInterval(update, 2500);
        },
        stop() {
          if (timer) clearInterval(timer);
          timer = 0;
        },
        destroy() {
          if (timer) clearInterval(timer);
          timer = 0;
        }
      };
    }
  });
})();
