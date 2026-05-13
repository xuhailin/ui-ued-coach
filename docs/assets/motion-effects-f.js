/* ============================================================
   motion-effects-f.js  —  Batch F (4 cursor-tracking effects)
   Effects: eye_follow_avatar, magnetic_blob_morph,
            antenna_creature
   Theme: center-anchored, deforms based on cursor direction/proximity
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
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smoothstep = (e0, e1, x) => {
    const t = clamp((x - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  };
  // Critically damped spring step (for wobble/settle)
  const springStep = (cur, vel, target, stiffness, damping, dt) => {
    const f = (target - cur) * stiffness;
    vel = (vel + f * dt) * (1 - damping * dt);
    cur = cur + vel * dt;
    return { cur, vel };
  };

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

  // Shared pointer manager — produces a "virtual cursor" that follows real
  // pointer when present, and falls back to a slow Lissajous orbit.
  function makePointerSource(stageEl) {
    const state = {
      // real pointer position in [0,1] stage coords
      realX: 0.5, realY: 0.5,
      // active pointer presence weight (0=fake, 1=real)
      presence: 0,
      // smoothed cursor (effects read from these)
      x: 0.5, y: 0.5,
      // bounds
      w: 1, h: 1,
      bounds: null
    };

    const refreshBounds = () => {
      const r = stageEl.getBoundingClientRect();
      state.bounds = r;
      state.w = Math.max(1, r.width);
      state.h = Math.max(1, r.height);
    };

    const onEnter = () => { /* presence ramps up in tick */ state._wantPresence = 1; };
    const onLeave = () => { state._wantPresence = 0; };
    const onMove = (e) => {
      refreshBounds();
      state.realX = clamp((e.clientX - state.bounds.left) / state.w, 0, 1);
      state.realY = clamp((e.clientY - state.bounds.top) / state.h, 0, 1);
      state._wantPresence = 1;
    };
    stageEl.addEventListener('pointerenter', onEnter);
    stageEl.addEventListener('pointerleave', onLeave);
    stageEl.addEventListener('pointermove', onMove);

    const ro = ('ResizeObserver' in window) ? new ResizeObserver(refreshBounds) : null;
    if (ro) ro.observe(stageEl);
    refreshBounds();
    state._wantPresence = 0;

    // Update once per frame externally via `tick(now)`. Returns {x, y, presence}
    // x,y in [0,1] stage coords (smoothed)
    function tick(now) {
      // presence smoothing — 400ms fade in/out (~0.0025/ms)
      const target = state._wantPresence;
      state.presence = lerp(state.presence, target, 0.08);

      // Fake cursor: Lissajous orbit (~6s period), radius ~38% of min
      const t = now * 0.001;
      const fakeX = 0.5 + 0.38 * Math.sin(t * 1.05);
      const fakeY = 0.5 + 0.38 * Math.cos(t * 0.72);

      const tx = lerp(fakeX, state.realX, state.presence);
      const ty = lerp(fakeY, state.realY, state.presence);
      state.x = lerp(state.x, tx, 0.18);
      state.y = lerp(state.y, ty, 0.18);
      return { x: state.x, y: state.y, presence: state.presence, w: state.w, h: state.h };
    }

    function destroy() {
      stageEl.removeEventListener('pointerenter', onEnter);
      stageEl.removeEventListener('pointerleave', onLeave);
      stageEl.removeEventListener('pointermove', onMove);
      if (ro) ro.disconnect();
    }

    return { tick, destroy, refreshBounds, state };
  }

  // ============================================================
  // 46 · eye_follow_avatar  (mascot)
  // ============================================================
  function eyeAvatarSVG(variant) {
    // variant: { eyes: 1|2|3, mood: 'normal'|'cyclops'|'monster', tone: cssColor }
    const eyes = variant.eyes;
    let positions;
    if (eyes === 1) {
      positions = [{ cx: 50, cy: 48, r: 14, ir: 6.4 }];
    } else if (eyes === 2) {
      positions = [
        { cx: 36, cy: 46, r: 11, ir: 5.2 },
        { cx: 64, cy: 46, r: 11, ir: 5.2 }
      ];
    } else {
      positions = [
        { cx: 32, cy: 44, r: 9, ir: 4.2 },
        { cx: 50, cy: 36, r: 9, ir: 4.2 },
        { cx: 68, cy: 44, r: 9, ir: 4.2 }
      ];
    }
    const eyeMarkup = positions.map((p, i) => `
      <g class="mfx-eye-socket" data-i="${i}" style="--cx:${p.cx};--cy:${p.cy};--r:${p.r};--ir:${p.ir}">
        <ellipse class="mfx-eye-white" cx="${p.cx}" cy="${p.cy}" rx="${p.r}" ry="${p.r}" />
        <g class="mfx-eye-iris-wrap" style="transform-origin:${p.cx}px ${p.cy}px">
          <circle class="mfx-eye-iris" cx="${p.cx}" cy="${p.cy}" r="${p.ir}" />
          <circle class="mfx-eye-glint" cx="${p.cx - p.ir * 0.35}" cy="${p.cy - p.ir * 0.4}" r="${Math.max(0.6, p.ir * 0.22)}" />
        </g>
        <path class="mfx-eye-lid mfx-eye-lid-top"
              d="M ${p.cx - p.r - 0.5} ${p.cy} A ${p.r + 0.5} ${p.r + 0.5} 0 0 1 ${p.cx + p.r + 0.5} ${p.cy} L ${p.cx + p.r + 0.5} ${p.cy - p.r - 1} L ${p.cx - p.r - 0.5} ${p.cy - p.r - 1} Z" />
        <path class="mfx-eye-lid mfx-eye-lid-bot"
              d="M ${p.cx - p.r - 0.5} ${p.cy} A ${p.r + 0.5} ${p.r + 0.5} 0 0 0 ${p.cx + p.r + 0.5} ${p.cy} L ${p.cx + p.r + 0.5} ${p.cy + p.r + 1} L ${p.cx - p.r - 0.5} ${p.cy + p.r + 1} Z" />
      </g>`).join('');

    const cheekDots = `
      <circle class="mfx-eye-cheek" cx="22" cy="68" r="3.2" />
      <circle class="mfx-eye-cheek" cx="78" cy="68" r="3.2" />`;
    const mouth = `
      <path class="mfx-eye-mouth" d="M 42 78 Q 50 80 58 78" />`;

    return `
      <svg class="mfx-eye-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="mfx-eye-head-${variant.uid}" cx="40%" cy="35%" r="80%">
            <stop offset="0%"  stop-color="${variant.headHi}" />
            <stop offset="100%" stop-color="${variant.headLo}" />
          </radialGradient>
        </defs>
        <circle class="mfx-eye-head" cx="50" cy="50" r="44" fill="url(#mfx-eye-head-${variant.uid})" />
        <circle class="mfx-eye-shade" cx="50" cy="62" r="40" />
        ${eyeMarkup}
        ${cheekDots}
        ${mouth}
      </svg>`;
  }

  window.MotionEffects.register('eye_follow_avatar', {
    card({ module }) {
      const uid = (module?.id || 'x') + '-eye-c';
      const v = { uid, eyes: 2, headHi: 'color-mix(in srgb, var(--cc) 26%, var(--panel-solid))',
                  headLo: 'color-mix(in srgb, var(--cc) 12%, var(--panel-solid))' };
      return `
        <div class="mfx-eye-stage">
          ${eyeAvatarSVG(v)}
          <div class="mfx-eye-tag">// MASCOT · TRACK</div>
        </div>`;
    },
    modal({ module }) {
      const base = module?.id || 'x';
      const v1 = { uid: base + '-eye-1', eyes: 1,
                   headHi: 'color-mix(in srgb, var(--cc) 32%, var(--panel-solid))',
                   headLo: 'color-mix(in srgb, var(--cc) 14%, var(--panel-solid))' };
      const v2 = { uid: base + '-eye-2', eyes: 2,
                   headHi: 'color-mix(in srgb, var(--cc) 24%, var(--panel-solid))',
                   headLo: 'color-mix(in srgb, var(--cc) 8%, var(--panel-solid))' };
      const v3 = { uid: base + '-eye-3', eyes: 3,
                   headHi: 'color-mix(in srgb, var(--cc) 30%, var(--panel-solid))',
                   headLo: 'color-mix(in srgb, var(--cc) 18%, var(--panel-solid))' };
      return `
        <div class="mfx-eye-stage is-modal">
          <div class="mfx-eye-gallery">
            <div class="mfx-eye-cell" data-variant="cyclops">
              ${eyeAvatarSVG(v1)}
              <div class="mfx-eye-cap">CYCLOPS</div>
            </div>
            <div class="mfx-eye-cell" data-variant="normal">
              ${eyeAvatarSVG(v2)}
              <div class="mfx-eye-cap">NORMAL</div>
            </div>
            <div class="mfx-eye-cell" data-variant="monster">
              ${eyeAvatarSVG(v3)}
              <div class="mfx-eye-cap">3-EYE MONSTER</div>
            </div>
          </div>
          <div class="mfx-eye-tag">// MASCOT GALLERY · TRACK · BLINK · SQUINT</div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion, isModal }) {
      const pointer = makePointerSource(stageEl);
      const svgs = Array.from(stageEl.querySelectorAll('.mfx-eye-svg'));
      if (!svgs.length) return { destroy() { pointer.destroy(); } };

      // Per-SVG state — each contains a list of eyes, each with current iris offset + blink + idle drift
      const instances = svgs.map(svg => {
        const sockets = Array.from(svg.querySelectorAll('.mfx-eye-socket'));
        const eyes = sockets.map(socket => {
          const cx = parseFloat(socket.style.getPropertyValue('--cx'));
          const cy = parseFloat(socket.style.getPropertyValue('--cy'));
          const r = parseFloat(socket.style.getPropertyValue('--r'));
          const ir = parseFloat(socket.style.getPropertyValue('--ir'));
          return {
            socket,
            wrap: socket.querySelector('.mfx-eye-iris-wrap'),
            lidTop: socket.querySelector('.mfx-eye-lid-top'),
            lidBot: socket.querySelector('.mfx-eye-lid-bot'),
            cx, cy, r, ir,
            // current offset (svg units) from socket center
            ox: 0, oy: 0,
            // idle drift target
            driftX: 0, driftY: 0,
            nextDriftAt: 0,
            blinkUntil: 0,
            nextBlinkAt: 0
          };
        });
        const mouth = svg.querySelector('.mfx-eye-mouth');
        return { svg, eyes, mouth };
      });

      const raf = makeRAF();

      function frame(now) {
        const p = pointer.tick(now);
        // joy mouth lerp based on presence
        const joy = p.presence;
        instances.forEach(inst => {
          if (inst.mouth) {
            // Curl upward: control point Y from 80 (smile) to 76 (bigger smile)
            const cpy = lerp(80, 75, joy);
            inst.mouth.setAttribute('d', `M 42 78 Q 50 ${cpy.toFixed(2)} 58 78`);
          }

          const rect = inst.svg.getBoundingClientRect();
          if (rect.width < 2) return;
          // Cursor in svg's local 100x100 viewBox
          const stageRect = stageEl.getBoundingClientRect();
          const cursorPxX = stageRect.left + p.x * stageRect.width;
          const cursorPxY = stageRect.top + p.y * stageRect.height;
          // map to svg viewBox
          const svgX = ((cursorPxX - rect.left) / Math.max(1, rect.width)) * 100;
          const svgY = ((cursorPxY - rect.top) / Math.max(1, rect.height)) * 100;

          inst.eyes.forEach(eye => {
            // direction from eye center -> cursor
            let dx = svgX - eye.cx;
            let dy = svgY - eye.cy;
            const dist = Math.hypot(dx, dy) || 1;
            // max offset = socket radius - iris radius - margin
            const maxOff = Math.max(0, eye.r - eye.ir - 0.8);
            // For idle: drift toward random target
            if (now > eye.nextDriftAt) {
              const ang = Math.random() * Math.PI * 2;
              const mag = Math.random() * maxOff * 0.55;
              eye.driftX = Math.cos(ang) * mag;
              eye.driftY = Math.sin(ang) * mag;
              eye.nextDriftAt = now + 1100 + Math.random() * 900;
            }
            // proximity-based: shorter when far, full when near
            const reach = smoothstep(140, 20, dist);
            const targetTrackX = (dx / dist) * maxOff * (0.55 + 0.45 * reach);
            const targetTrackY = (dy / dist) * maxOff * (0.55 + 0.45 * reach);
            // Mix idle drift with tracking by presence
            const targetX = lerp(eye.driftX, targetTrackX, p.presence * 0.85 + 0.15 * smoothstep(180, 60, dist));
            const targetY = lerp(eye.driftY, targetTrackY, p.presence * 0.85 + 0.15 * smoothstep(180, 60, dist));
            // Clamp to circle
            const tlen = Math.hypot(targetX, targetY);
            let tx = targetX, ty = targetY;
            if (tlen > maxOff) { tx = (targetX / tlen) * maxOff; ty = (targetY / tlen) * maxOff; }
            eye.ox = lerp(eye.ox, tx, 0.18);
            eye.oy = lerp(eye.oy, ty, 0.18);

            // Blinks
            if (now > eye.nextBlinkAt && now > eye.blinkUntil) {
              eye.blinkUntil = now + 180;
              eye.nextBlinkAt = now + 4000 + Math.random() * 2000;
            }
            const blinking = now < eye.blinkUntil;
            let scaleY = 1;
            if (blinking) {
              const phase = (now - (eye.blinkUntil - 180)) / 180; // 0..1
              // 0..0.5 close, 0.5..1 open
              const k = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
              scaleY = lerp(1, 0.05, k);
            }

            // Eyelid squint based on proximity (closer = narrower)
            const squint = smoothstep(120, 30, dist) * p.presence * 0.45;
            if (eye.lidTop) eye.lidTop.style.transform = `translateY(${(squint * eye.r * 0.55).toFixed(2)}px)`;
            if (eye.lidBot) eye.lidBot.style.transform = `translateY(${(-squint * eye.r * 0.35).toFixed(2)}px)`;

            if (eye.wrap) {
              eye.wrap.style.transform = `translate(${eye.ox.toFixed(2)}px, ${eye.oy.toFixed(2)}px) scaleY(${scaleY.toFixed(3)})`;
            }
          });
        });
      }

      return {
        start() {
          if (prefersReducedMotion && prefersReducedMotion.matches) {
            // static centered eyes, slight squint
            instances.forEach(inst => inst.eyes.forEach(eye => {
              if (eye.wrap) eye.wrap.style.transform = 'translate(0,0)';
            }));
            return;
          }
          // initialize blink/drift timers
          const now = performance.now();
          instances.forEach(inst => inst.eyes.forEach(eye => {
            eye.nextBlinkAt = now + 2000 + Math.random() * 3000;
            eye.nextDriftAt = now + 600 + Math.random() * 800;
          }));
          raf.start(frame);
        },
        stop() { raf.stop(); },
        destroy() {
          raf.stop();
          pointer.destroy();
        }
      };
    }
  });

  // ============================================================
  // 47 · magnetic_blob_morph (abstract)
  // ============================================================
  // Catmull-Rom -> cubic bezier closed path
  function blobPath(points, tension) {
    if (!points.length) return '';
    const n = points.length;
    const t = tension ?? 0.5;
    let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
    for (let i = 0; i < n; i++) {
      const p0 = points[(i - 1 + n) % n];
      const p1 = points[i];
      const p2 = points[(i + 1) % n];
      const p3 = points[(i + 2) % n];
      const c1x = p1.x + (p2.x - p0.x) * (t / 3);
      const c1y = p1.y + (p2.y - p0.y) * (t / 3);
      const c2x = p2.x - (p3.x - p1.x) * (t / 3);
      const c2y = p2.y - (p3.y - p1.y) * (t / 3);
      d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }
    return d + ' Z';
  }

  function blobSVG(uid, points, restR, opts) {
    const size = opts?.size || 100;
    const stroke = opts?.stroke ?? true;
    return `
      <svg class="mfx-blob-svg" viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet"
           data-uid="${uid}" data-points="${points}" data-rest="${restR}" data-size="${size}">
        <defs>
          <radialGradient id="mfx-blob-grad-${uid}" cx="40%" cy="35%" r="70%">
            <stop offset="0%"  stop-color="color-mix(in srgb, var(--cc) 80%, white)" stop-opacity="0.65" />
            <stop offset="100%" stop-color="var(--cc)" stop-opacity="0.45" />
          </radialGradient>
          <filter id="mfx-blob-shadow-${uid}" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.6"/>
            <feOffset dy="1.5" result="off"/>
            <feComposite in="off" in2="SourceAlpha" operator="out" result="cut"/>
            <feColorMatrix in="cut" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/>
            <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path class="mfx-blob-path" filter="url(#mfx-blob-shadow-${uid})"
              fill="url(#mfx-blob-grad-${uid})"
              ${stroke ? `stroke="var(--cc)" stroke-opacity="0.55" stroke-width="0.6"` : ''}
              d="" />
      </svg>`;
  }

  window.MotionEffects.register('magnetic_blob_morph', {
    card({ module }) {
      const uid = (module?.id || 'x') + '-blob-c';
      return `
        <div class="mfx-blob-stage">
          ${blobSVG(uid, 10, 30)}
          <div class="mfx-blob-tag">// ABSTRACT · MAGNETIC</div>
        </div>`;
    },
    modal({ module }) {
      const base = module?.id || 'x';
      return `
        <div class="mfx-blob-stage is-modal">
          <div class="mfx-blob-gallery">
            <div class="mfx-blob-cell">
              ${blobSVG(base + '-blob-a', 8, 34)}
              <div class="mfx-blob-cap">8 · COARSE</div>
            </div>
            <div class="mfx-blob-cell">
              ${blobSVG(base + '-blob-b', 12, 34)}
              <div class="mfx-blob-cap">12 · SMOOTH</div>
            </div>
          </div>
          <div class="mfx-blob-tag">// ABSTRACT GALLERY · NEAREST POINT PULL · SHARED CURSOR</div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const pointer = makePointerSource(stageEl);
      const svgs = Array.from(stageEl.querySelectorAll('.mfx-blob-svg'));
      if (!svgs.length) return { destroy() { pointer.destroy(); } };

      const instances = svgs.map(svg => {
        const n = parseInt(svg.dataset.points, 10) || 10;
        const restR = parseFloat(svg.dataset.rest) || 30;
        const size = parseFloat(svg.dataset.size) || 100;
        const cx = size / 2, cy = size / 2;
        const points = [];
        for (let i = 0; i < n; i++) {
          const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
          points.push({
            ang,
            r: restR,
            // current displacement from rest (positive = outward)
            offset: 0,
            // velocity for spring back
            vel: 0,
            x: cx + Math.cos(ang) * restR,
            y: cy + Math.sin(ang) * restR
          });
        }
        return {
          svg,
          path: svg.querySelector('.mfx-blob-path'),
          n, restR, size, cx, cy, points
        };
      });

      const raf = makeRAF();
      let lastTime = 0;

      function frame(now) {
        const dt = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 0.016;
        lastTime = now;
        const p = pointer.tick(now);
        // Breathing: ±2 svg units on slow sine
        const breathe = Math.sin(now * 0.0009) * 2;

        instances.forEach(inst => {
          const rect = inst.svg.getBoundingClientRect();
          if (rect.width < 2) return;
          const stageRect = stageEl.getBoundingClientRect();
          // cursor in this svg's viewBox coords
          const cursorPxX = stageRect.left + p.x * stageRect.width;
          const cursorPxY = stageRect.top + p.y * stageRect.height;
          const svgX = ((cursorPxX - rect.left) / Math.max(1, rect.width)) * inst.size;
          const svgY = ((cursorPxY - rect.top) / Math.max(1, rect.height)) * inst.size;

          // Effective rest radius w/ breathing
          const effRest = inst.restR + breathe;

          // Find nearest control point (by point coordinate)
          let nearestIdx = 0;
          let nearestDist = Infinity;
          inst.points.forEach((pt, i) => {
            const d = Math.hypot(pt.x - svgX, pt.y - svgY);
            if (d < nearestDist) { nearestDist = d; nearestIdx = i; }
          });

          // Pull magnitude inverse-distance, clamped
          // distance from blob center to cursor
          const cd = Math.hypot(svgX - inst.cx, svgY - inst.cy);
          // pull strength rises as cursor is between effRest..effRest*2.6
          const proximity = smoothstep(effRest * 2.4, effRest * 0.6, cd) * p.presence;
          const maxPull = inst.restR * 0.55;
          // Spread to neighbors slightly (gauss-ish)
          inst.points.forEach((pt, i) => {
            // signed circular distance to nearest
            let dd = i - nearestIdx;
            if (dd > inst.n / 2) dd -= inst.n;
            if (dd < -inst.n / 2) dd += inst.n;
            const w = Math.exp(-(dd * dd) / 2.2);
            const targetOff = maxPull * proximity * w;
            // spring toward target
            const stiffness = 220;
            const damping = 16;
            const step = springStep(pt.offset, pt.vel, targetOff, stiffness, damping, dt);
            pt.offset = step.cur;
            pt.vel = step.vel;

            const r = effRest + pt.offset;
            // direction toward cursor for nearest cluster; default = radial
            // Use radial direction from center to keep blob coherent.
            pt.x = inst.cx + Math.cos(pt.ang) * r;
            pt.y = inst.cy + Math.sin(pt.ang) * r;
          });

          inst.path.setAttribute('d', blobPath(inst.points, 0.5));
        });
      }

      function staticRender() {
        instances.forEach(inst => {
          inst.points.forEach(pt => {
            pt.offset = 0; pt.vel = 0;
            pt.x = inst.cx + Math.cos(pt.ang) * inst.restR;
            pt.y = inst.cy + Math.sin(pt.ang) * inst.restR;
          });
          inst.path.setAttribute('d', blobPath(inst.points, 0.5));
        });
      }

      return {
        start() {
          staticRender();
          if (prefersReducedMotion && prefersReducedMotion.matches) return;
          lastTime = 0;
          raf.start(frame);
        },
        stop() { raf.stop(); },
        destroy() { raf.stop(); pointer.destroy(); }
      };
    }
  });

  // ============================================================
  // 49 · antenna_creature (creature)
  // ============================================================
  function creatureSVG(uid, opts) {
    const size = opts?.size || 100;
    const headR = opts?.headR || 22;
    const cx = size / 2, cy = size * 0.62;
    const antLen = opts?.antLen || 26;
    const antColor = opts?.antColor || 'var(--cc)';
    const bodyHi = opts?.bodyHi || 'color-mix(in srgb, var(--cc) 30%, var(--panel-solid))';
    const bodyLo = opts?.bodyLo || 'color-mix(in srgb, var(--cc) 14%, var(--panel-solid))';
    const tipColor = opts?.tipColor || 'color-mix(in srgb, var(--cc) 50%, white)';
    // antenna root points (top of head)
    const aRoots = [
      { x: cx - 7, y: cy - headR + 1, baseAng: -22 },
      { x: cx + 7, y: cy - headR + 1, baseAng: 22 }
    ];
    return `
      <svg class="mfx-ant-svg" viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet"
           data-uid="${uid}" data-size="${size}" data-headr="${headR}" data-cx="${cx}" data-cy="${cy}"
           data-antlen="${antLen}">
        <defs>
          <radialGradient id="mfx-ant-body-${uid}" cx="40%" cy="35%" r="80%">
            <stop offset="0%" stop-color="${bodyHi}" />
            <stop offset="100%" stop-color="${bodyLo}" />
          </radialGradient>
        </defs>
        <g class="mfx-ant-body-wrap" style="transform-origin:${cx}px ${cy}px">
          <!-- antennae (rendered behind head's outline but in front of bg) -->
          ${aRoots.map((r, i) => `
            <g class="mfx-ant-antenna" data-i="${i}" data-rx="${r.x}" data-ry="${r.y}" data-base="${r.baseAng}">
              <path class="mfx-ant-line" d="M ${r.x} ${r.y} Q ${r.x} ${r.y - antLen / 2} ${r.x} ${r.y - antLen}"
                    fill="none" stroke="${antColor}" stroke-width="1.6" stroke-linecap="round"
                    stroke-opacity="0.85" />
              <circle class="mfx-ant-tip" cx="${r.x}" cy="${r.y - antLen}" r="2.4" fill="${tipColor}" />
              <circle class="mfx-ant-tip-halo" cx="${r.x}" cy="${r.y - antLen}" r="4" fill="${tipColor}" fill-opacity="0.25" />
            </g>`).join('')}
          <!-- body -->
          <circle class="mfx-ant-head" cx="${cx}" cy="${cy}" r="${headR}" fill="url(#mfx-ant-body-${uid})"
                  stroke="var(--cc)" stroke-opacity="0.25" stroke-width="0.6" />
          <!-- face: decoration only, doesn't track -->
          <circle class="mfx-ant-eye" cx="${cx - 6}" cy="${cy - 2}" r="2" fill="var(--text)" />
          <circle class="mfx-ant-eye" cx="${cx + 6}" cy="${cy - 2}" r="2" fill="var(--text)" />
          <circle class="mfx-ant-eye-glint" cx="${cx - 6.6}" cy="${cy - 2.6}" r="0.6" fill="white" />
          <circle class="mfx-ant-eye-glint" cx="${cx + 5.4}" cy="${cy - 2.6}" r="0.6" fill="white" />
          <path class="mfx-ant-smile" d="M ${cx - 5} ${cy + 5} Q ${cx} ${cy + 8.5} ${cx + 5} ${cy + 5}"
                fill="none" stroke="var(--text)" stroke-width="1" stroke-linecap="round" stroke-opacity="0.75" />
          <!-- cheek dots -->
          <circle cx="${cx - 12}" cy="${cy + 3}" r="1.8" fill="color-mix(in srgb, var(--cc) 70%, white)" fill-opacity="0.55" />
          <circle cx="${cx + 12}" cy="${cy + 3}" r="1.8" fill="color-mix(in srgb, var(--cc) 70%, white)" fill-opacity="0.55" />
        </g>
      </svg>`;
  }

  window.MotionEffects.register('antenna_creature', {
    card({ module }) {
      const uid = (module?.id || 'x') + '-ant-c';
      return `
        <div class="mfx-ant-stage">
          ${creatureSVG(uid, {})}
          <div class="mfx-ant-tag">// CREATURE · CURIOUS</div>
        </div>`;
    },
    modal({ module }) {
      const base = module?.id || 'x';
      return `
        <div class="mfx-ant-stage is-modal">
          <div class="mfx-ant-gallery">
            <div class="mfx-ant-cell">
              ${creatureSVG(base + '-ant-a', { antLen: 22, headR: 22 })}
              <div class="mfx-ant-cap">SHORT · A</div>
            </div>
            <div class="mfx-ant-cell">
              ${creatureSVG(base + '-ant-b', {
                antLen: 34, headR: 24,
                antColor: 'color-mix(in srgb, var(--cc) 55%, white)',
                tipColor: 'color-mix(in srgb, var(--cc) 30%, white)'
              })}
              <div class="mfx-ant-cap">LONG · B</div>
            </div>
          </div>
          <div class="mfx-ant-tag">// CREATURE GALLERY · ANTENNAE BEND · WOBBLE ON LEAVE</div>
        </div>`;
    },
    init(stageEl, { prefersReducedMotion }) {
      const pointer = makePointerSource(stageEl);
      const svgs = Array.from(stageEl.querySelectorAll('.mfx-ant-svg'));
      if (!svgs.length) return { destroy() { pointer.destroy(); } };

      const instances = svgs.map(svg => {
        const size = parseFloat(svg.dataset.size) || 100;
        const cx = parseFloat(svg.dataset.cx);
        const cy = parseFloat(svg.dataset.cy);
        const antLen = parseFloat(svg.dataset.antlen) || 26;
        const headR = parseFloat(svg.dataset.headr) || 22;
        const antennae = Array.from(svg.querySelectorAll('.mfx-ant-antenna')).map(g => ({
          g,
          line: g.querySelector('.mfx-ant-line'),
          tip: g.querySelector('.mfx-ant-tip'),
          halo: g.querySelector('.mfx-ant-tip-halo'),
          rx: parseFloat(g.dataset.rx),
          ry: parseFloat(g.dataset.ry),
          baseAng: parseFloat(g.dataset.base),
          // current bend params: angle offset (deg) and bend (control point displacement)
          ang: 0, angVel: 0,
          bend: 0, bendVel: 0
        }));
        const bodyWrap = svg.querySelector('.mfx-ant-body-wrap');
        return { svg, size, cx, cy, antLen, headR, antennae, bodyWrap };
      });

      const raf = makeRAF();
      let lastTime = 0;
      // For "wobble on leave", track presence's downward edge: when presence drops, the spring naturally overshoots
      // because we use a springy stiffness/damping pair. No extra state needed.

      function frame(now) {
        const dt = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 0.016;
        lastTime = now;
        const p = pointer.tick(now);

        // Body breathing — scaleY 0.98..1.02 over 2.6s
        const breath = 1 + Math.sin(now * 0.0024) * 0.02;

        // Tip light pulse (only visible when presence high)
        const pulse = 0.7 + 0.3 * Math.sin(now * 0.006);

        instances.forEach(inst => {
          if (inst.bodyWrap) inst.bodyWrap.style.transform = `scaleY(${breath.toFixed(4)})`;

          const rect = inst.svg.getBoundingClientRect();
          if (rect.width < 2) return;
          const stageRect = stageEl.getBoundingClientRect();
          const cursorPxX = stageRect.left + p.x * stageRect.width;
          const cursorPxY = stageRect.top + p.y * stageRect.height;
          const svgX = ((cursorPxX - rect.left) / Math.max(1, rect.width)) * inst.size;
          const svgY = ((cursorPxY - rect.top) / Math.max(1, rect.height)) * inst.size;

          inst.antennae.forEach(a => {
            // direction from antenna root to cursor
            const dx = svgX - a.rx;
            const dy = svgY - a.ry;
            const angToCursor = Math.atan2(dx, -dy) * 180 / Math.PI; // 0 = straight up
            // target = lerp from base to cursor angle by presence
            // clamp the bend so antennas don't whip past horizontal
            const maxBendDeg = 55;
            const targetAng = clamp(lerp(a.baseAng, angToCursor, p.presence * 0.85), -maxBendDeg, maxBendDeg);
            // bend (control point sideways) target proportional to how far the angle differs from base
            const targetBend = (targetAng - a.baseAng) * 0.6;

            // springy update (lower damping -> wobble on leave)
            const stiffness = 110;
            const damping = 9;
            const angStep = springStep(a.ang, a.angVel, targetAng, stiffness, damping, dt);
            a.ang = angStep.cur; a.angVel = angStep.vel;
            const bendStep = springStep(a.bend, a.bendVel, targetBend, stiffness, damping, dt);
            a.bend = bendStep.cur; a.bendVel = bendStep.vel;

            // Compute tip + control point
            const rad = a.ang * Math.PI / 180;
            const tipX = a.rx + Math.sin(rad) * inst.antLen;
            const tipY = a.ry - Math.cos(rad) * inst.antLen;
            // control point sits along midpoint, offset perpendicular by bend
            const midX = (a.rx + tipX) / 2;
            const midY = (a.ry + tipY) / 2;
            // perpendicular direction in 2D: (-cos, -sin) of antenna direction
            const perpX = -Math.cos(rad);
            const perpY = -Math.sin(rad);
            const cpX = midX + perpX * a.bend * 0.15;
            const cpY = midY + perpY * a.bend * 0.15;

            if (a.line) a.line.setAttribute('d', `M ${a.rx.toFixed(2)} ${a.ry.toFixed(2)} Q ${cpX.toFixed(2)} ${cpY.toFixed(2)} ${tipX.toFixed(2)} ${tipY.toFixed(2)}`);
            if (a.tip) { a.tip.setAttribute('cx', tipX.toFixed(2)); a.tip.setAttribute('cy', tipY.toFixed(2)); }
            if (a.halo) {
              a.halo.setAttribute('cx', tipX.toFixed(2));
              a.halo.setAttribute('cy', tipY.toFixed(2));
              const haloR = 4 + 2 * pulse * p.presence;
              a.halo.setAttribute('r', haloR.toFixed(2));
              a.halo.setAttribute('fill-opacity', (0.18 + 0.25 * p.presence * pulse).toFixed(3));
            }
          });
        });
      }

      function staticRender() {
        instances.forEach(inst => inst.antennae.forEach(a => {
          a.ang = a.baseAng; a.angVel = 0; a.bend = 0; a.bendVel = 0;
          const rad = a.ang * Math.PI / 180;
          const tipX = a.rx + Math.sin(rad) * inst.antLen;
          const tipY = a.ry - Math.cos(rad) * inst.antLen;
          if (a.line) a.line.setAttribute('d', `M ${a.rx} ${a.ry} Q ${a.rx} ${(a.ry + tipY) / 2} ${tipX} ${tipY}`);
          if (a.tip) { a.tip.setAttribute('cx', tipX); a.tip.setAttribute('cy', tipY); }
          if (a.halo) { a.halo.setAttribute('cx', tipX); a.halo.setAttribute('cy', tipY); }
        }));
      }

      return {
        start() {
          staticRender();
          if (prefersReducedMotion && prefersReducedMotion.matches) return;
          lastTime = 0;
          // seed initial spring state at base angles
          instances.forEach(inst => inst.antennae.forEach(a => { a.ang = a.baseAng; }));
          raf.start(frame);
        },
        stop() { raf.stop(); },
        destroy() { raf.stop(); pointer.destroy(); }
      };
    }
  });

})();
