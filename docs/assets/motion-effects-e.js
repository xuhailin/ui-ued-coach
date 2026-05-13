window.MotionEffects = window.MotionEffects || {
  _entries: new Map(),
  register(name, def) { this._entries.set(name, def); },
  get(name) { return this._entries.get(name); },
  has(name) { return this._entries.has(name); }
};

window.MotionEffects.register('bubble_cta', {
  card() {
    return `
      <div class="mfx-bub-stage">
        <button class="mfx-bub-btn" type="button">
          <canvas class="mfx-bub-canvas" aria-hidden="true"></canvas>
          <span class="mfx-bub-rim" aria-hidden="true"></span>
          <span class="mfx-bub-label">Generate</span>
        </button>
        <div class="mfx-bub-hint">// IDLE · HOVER · POP</div>
      </div>
    `;
  },
  modal() {
    return `
      <div class="mfx-bub-stage is-modal">
        <button class="mfx-bub-btn is-big" type="button">
          <canvas class="mfx-bub-canvas" aria-hidden="true"></canvas>
          <span class="mfx-bub-rim" aria-hidden="true"></span>
          <span class="mfx-bub-label">Subscribe</span>
        </button>
        <div class="mfx-bub-hint">// HOVER 加速 · CLICK 爆开 · 0.4S 后回归</div>
      </div>
    `;
  },
  init(stageEl, { prefersReducedMotion }) {
    const btn = stageEl.querySelector('.mfx-bub-btn');
    const canvas = stageEl.querySelector('.mfx-bub-canvas');
    const ctx = canvas.getContext('2d');

    let w = 1, h = 1;
    let bubbles = [];
    let sparks = [];
    let raf = 0;
    let running = false;
    let cancelled = false;
    let hoverFactor = 0;
    let isHover = false;
    let cursorX = 0.5;
    let lastSpawn = 0;
    let autoState = 'idle';
    let autoSwitchAt = 0;
    let userHoverUntil = 0;
    let userPressUntil = 0;

    const resize = () => {
      const rect = btn.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(btn);
    resize();

    const spawnBubble = () => {
      bubbles.push({
        x: 6 + Math.random() * (w - 12),
        y: h - 1,
        r: 2 + Math.random() * 3 + hoverFactor * 1.4,
        vy: -(0.3 + Math.random() * 0.4) * (1 + hoverFactor * 1.1),
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.018 + Math.random() * 0.025,
        opacity: 0
      });
    };

    const burstAll = () => {
      bubbles.forEach(b => {
        const n = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < n; i++) {
          const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
          const sp = 1.4 + Math.random() * 2;
          sparks.push({
            x: b.x, y: b.y,
            vx: Math.cos(ang) * sp,
            vy: Math.sin(ang) * sp,
            life: 1,
            r: 0.7 + Math.random() * 1.2
          });
        }
      });
      bubbles.length = 0;
      // Extra fan from button mid-bottom (champagne pop)
      const n = 14;
      for (let i = 0; i < n; i++) {
        const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
        const sp = 2 + Math.random() * 2.6;
        sparks.push({
          x: w / 2 + (Math.random() - 0.5) * 12,
          y: h * 0.72,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp,
          life: 1,
          r: 0.6 + Math.random() * 1.4
        });
      }
    };

    const tick = (now) => {
      if (cancelled || !running) return;

      const targetHover = isHover ? 1 : 0;
      hoverFactor += (targetHover - hoverFactor) * 0.09;

      const spawnInterval = isHover ? 180 : 620;
      if (now - lastSpawn > spawnInterval) {
        spawnBubble();
        lastSpawn = now;
      }

      ctx.clearRect(0, 0, w, h);

      const style = getComputedStyle(btn);
      const accent = style.getPropertyValue('--mfx-bub-color').trim() || '#7cf7ff';
      const accentLight = style.getPropertyValue('--mfx-bub-color-light').trim() || '#ffffff';

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.wobble += b.wobbleSpeed;
        b.y += b.vy * (1 + hoverFactor * 0.7);
        b.x += Math.sin(b.wobble) * 0.18;
        if (hoverFactor > 0.05) {
          const tx = cursorX * w;
          b.x += (tx - b.x) * 0.006 * hoverFactor;
        }

        const yp = 1 - (b.y / h);
        if (yp < 0.15) b.opacity = yp / 0.15;
        else if (yp > 0.6) b.opacity = Math.max(0, 1 - (yp - 0.6) / 0.35);
        else b.opacity = 1;

        if (yp > 0.97 || b.opacity <= 0.01) {
          bubbles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = b.opacity * 0.55;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = b.opacity * 0.75;
        ctx.strokeStyle = accentLight;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = b.opacity * 0.9;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.4, Math.max(0.4, b.r * 0.25), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.08;
        s.vx *= 0.98;
        s.life -= 0.028;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.fillStyle = accentLight;
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(0.4, s.r * s.life), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Auto-demo: idle dominates; occasionally simulate hover + press
      if (now > autoSwitchAt && now > userHoverUntil && now > userPressUntil) {
        if (autoState === 'idle') {
          autoState = 'hover';
          isHover = true;
          autoSwitchAt = now + 1500;
        } else if (autoState === 'hover') {
          autoState = 'press';
          burstAll();
          btn.classList.add('is-pressed');
          setTimeout(() => btn.classList.remove('is-pressed'), 240);
          autoSwitchAt = now + 260;
        } else if (autoState === 'press') {
          autoState = 'cooldown';
          isHover = false;
          autoSwitchAt = now + 700;
        } else {
          autoState = 'idle';
          autoSwitchAt = now + 5200;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      isHover = true;
      userHoverUntil = Number.MAX_SAFE_INTEGER;
      autoState = 'idle';
    };
    const onLeave = () => {
      isHover = false;
      userHoverUntil = performance.now() + 1200;
      autoSwitchAt = performance.now() + 5000;
      autoState = 'idle';
    };
    const onMove = (e) => {
      const rect = btn.getBoundingClientRect();
      cursorX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    };
    const onPress = () => {
      burstAll();
      btn.classList.add('is-pressed');
      setTimeout(() => btn.classList.remove('is-pressed'), 240);
      userPressUntil = performance.now() + 600;
      autoState = 'idle';
      autoSwitchAt = performance.now() + 5500;
    };

    btn.addEventListener('pointerenter', onEnter);
    btn.addEventListener('pointerleave', onLeave);
    btn.addEventListener('pointermove', onMove);
    btn.addEventListener('pointerdown', onPress);

    return {
      start() {
        if (running) return;
        running = true;
        cancelled = false;
        if (prefersReducedMotion.matches) {
          ctx.clearRect(0, 0, w, h);
          const style = getComputedStyle(btn);
          ctx.fillStyle = style.getPropertyValue('--mfx-bub-color').trim() || '#7cf7ff';
          ctx.globalAlpha = 0.55;
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(w * (0.25 + i * 0.25), h * 0.5, 3, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
          return;
        }
        lastSpawn = performance.now();
        autoSwitchAt = performance.now() + 5200;
        autoState = 'idle';
        raf = requestAnimationFrame(tick);
      },
      stop() {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      },
      destroy() {
        cancelled = true;
        running = false;
        if (raf) cancelAnimationFrame(raf);
        btn.removeEventListener('pointerenter', onEnter);
        btn.removeEventListener('pointerleave', onLeave);
        btn.removeEventListener('pointermove', onMove);
        btn.removeEventListener('pointerdown', onPress);
        ro.disconnect();
        bubbles.length = 0;
        sparks.length = 0;
      }
    };
  }
});
