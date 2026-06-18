import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const stage = document.getElementById("sun-cafe-scene");
const sceneEntry = document.getElementById("scene-entry");
const backButton = document.getElementById("scene-back");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#ffecc4");
scene.fog = new THREE.Fog("#ffecc4", 14, 38);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
stage.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
const homeCamera = new THREE.Vector3(9.5, 7.2, 10.5);
const homeTarget = new THREE.Vector3(0.25, 0.7, 0.1);
camera.position.copy(homeCamera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(homeTarget);
controls.enableDamping = true;
controls.dampingFactor = 0.075;
controls.enablePan = false;
controls.minDistance = 7.5;
controls.maxDistance = 18;
controls.minPolarAngle = Math.PI * 0.22;
controls.maxPolarAngle = Math.PI * 0.5;
controls.minAzimuthAngle = -Math.PI * 0.3;
controls.maxAzimuthAngle = Math.PI * 0.3;

const clock = new THREE.Clock();
const root = new THREE.Group();
root.position.set(0, -1.05, 0);
root.rotation.y = -0.18;
scene.add(root);
const borderEffects = [];

addLights();
addSandbox();
resize();
renderer.setAnimationLoop(tick);

window.addEventListener("resize", resize);

sceneEntry?.addEventListener("click", openScene);
sceneEntry?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openScene();
  }
});
document.addEventListener("pointerdown", handleBackPointer, true);
document.addEventListener("click", handleBackPointer, true);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.dataset.view === "scene") {
    closeScene();
  }
});

function openScene() {
  if (document.body.dataset.view === "scene") return;
  document.body.dataset.view = "scene";
  sceneEntry?.removeAttribute("role");
  sceneEntry?.removeAttribute("tabindex");
  requestAnimationFrame(resize);
}

function closeScene() {
  if (document.body.dataset.view !== "scene") return;
  document.body.dataset.view = "entry";
  sceneEntry?.setAttribute("role", "button");
  sceneEntry?.setAttribute("tabindex", "0");
  requestAnimationFrame(resize);
}

function handleBackPointer(event) {
  if (!backButton?.contains(event.target)) return;
  event.preventDefault();
  event.stopPropagation();
  if (event.type === "click") {
    closeScene();
  }
}

function tick() {
  const elapsed = clock.getElapsedTime();
  root.rotation.y = -0.18 + Math.sin(elapsed * 0.16) * 0.018;
  controls.update();
  renderer.render(scene, camera);
  borderEffects.forEach((effect) => effect.tick(elapsed));
}

function resize() {
  const width = Math.max(stage.clientWidth, 1);
  const height = Math.max(stage.clientHeight, 1);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function addLights() {
  scene.add(new THREE.HemisphereLight("#fff7de", "#8fc6b3", 2.25));

  const sun = new THREE.DirectionalLight("#ffd28a", 4.5);
  sun.position.set(-7, 10, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 35;
  sun.shadow.camera.left = -12;
  sun.shadow.camera.right = 12;
  sun.shadow.camera.top = 12;
  sun.shadow.camera.bottom = -12;
  scene.add(sun);

  const bounce = new THREE.DirectionalLight("#bcead9", 1.1);
  bounce.position.set(6, 3, -7);
  scene.add(bounce);
}

function addSandbox() {
  const base = mesh(new THREE.CylinderGeometry(6.25, 6.7, 0.42, 8), "#e7b879", { roughness: 0.92 });
  base.position.y = -0.22;
  base.rotation.y = Math.PI / 8;
  base.receiveShadow = true;
  root.add(base);

  const terrace = mesh(new THREE.BoxGeometry(7.1, 0.18, 4.75), "#f8d79d");
  terrace.position.set(-0.35, 0.02, 0.15);
  terrace.receiveShadow = true;
  root.add(terrace);

  addTileLines();
  addCafeFront();
  addTableSet(-0.35, 0.35);
  addPlanters();
  addPalmTree();
  addSunPatches();
}

function addCafeFront() {
  const wall = mesh(new THREE.BoxGeometry(4.6, 2.45, 0.32), "#ffe0aa");
  wall.position.set(-2.15, 1.28, -2.2);
  wall.receiveShadow = true;
  root.add(wall);

  const counter = mesh(new THREE.BoxGeometry(2.1, 0.72, 0.42), "#d9936a");
  counter.position.set(-2.15, 0.48, -1.86);
  counter.receiveShadow = true;
  root.add(counter);

  const windowFrame = mesh(new THREE.BoxGeometry(2.45, 1.05, 0.08), "#9ecfbd");
  windowFrame.position.set(-2.15, 1.48, -1.99);
  root.add(windowFrame);

  const glass = mesh(new THREE.BoxGeometry(2.08, 0.76, 0.1), "#dff8ee", { roughness: 0.28, metalness: 0.04 });
  glass.position.set(-2.15, 1.48, -1.92);
  root.add(glass);

  const awning = new THREE.Group();
  awning.position.set(-2.15, 2.48, -1.85);
  root.add(awning);
  for (let i = 0; i < 5; i += 1) {
    const stripe = mesh(new THREE.BoxGeometry(0.52, 0.18, 1.05), i % 2 === 0 ? "#ffb467" : "#fff3d2");
    stripe.position.x = (i - 2) * 0.52;
    stripe.rotation.x = -0.32;
    awning.add(stripe);
  }

  const sign = mesh(new THREE.BoxGeometry(1.55, 0.28, 0.08), "#65b8a3");
  sign.position.set(-2.15, 2.14, -1.94);
  root.add(sign);
}

function addTableSet(x, z) {
  const top = mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.12, 10), "#f9ead0");
  top.position.set(x, 0.72, z);
  top.receiveShadow = true;
  root.add(top);

  const leg = mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.72, 6), "#7f695a");
  leg.position.set(x, 0.36, z);
  root.add(leg);

  const cup = mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.2, 7), "#ffffff");
  cup.position.set(x - 0.16, 0.9, z + 0.1);
  root.add(cup);

  addChair(x - 1.02, z + 0.08, 0.42, "#ef9e76");
  addChair(x + 1, z - 0.08, -2.72, "#85cbb7");
}

function addChair(x, z, rotation, color) {
  const chair = new THREE.Group();
  chair.position.set(x, 0, z);
  chair.rotation.y = rotation;
  root.add(chair);

  const seat = mesh(new THREE.BoxGeometry(0.62, 0.12, 0.56), color);
  seat.position.y = 0.46;
  seat.receiveShadow = true;
  chair.add(seat);

  const back = mesh(new THREE.BoxGeometry(0.62, 0.64, 0.12), color);
  back.position.set(0, 0.78, -0.27);
  back.rotation.x = -0.08;
  chair.add(back);

  for (const [lx, lz] of [[-0.22, -0.18], [0.22, -0.18], [-0.22, 0.18], [0.22, 0.18]]) {
    const leg = mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.46, 5), "#7f695a");
    leg.position.set(lx, 0.23, lz);
    chair.add(leg);
  }
}

function addPlanters() {
  addCactus(2.6, 0.9, 0.82);
  addCactus(3.25, -1.15, 0.64);
  addCactus(-3.95, 1.45, 0.55);
}

function addCactus(x, z, scale) {
  const cactus = new THREE.Group();
  cactus.position.set(x, 0.12, z);
  cactus.scale.setScalar(scale);
  root.add(cactus);

  const pot = mesh(new THREE.CylinderGeometry(0.36, 0.28, 0.38, 7), "#c97855");
  pot.position.y = 0.19;
  pot.receiveShadow = true;
  cactus.add(pot);

  const body = mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.92, 7), "#4fa77d");
  body.position.y = 0.83;
  cactus.add(body);

  const armA = mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.42, 6), "#5ab886");
  armA.position.set(-0.2, 0.82, 0);
  armA.rotation.z = 0.85;
  cactus.add(armA);

  const armB = mesh(new THREE.CylinderGeometry(0.065, 0.08, 0.34, 6), "#5ab886");
  armB.position.set(0.2, 1.02, 0);
  armB.rotation.z = -0.72;
  cactus.add(armB);
}

function addPalmTree() {
  const palm = new THREE.Group();
  palm.position.set(3.65, 0.03, 1.85);
  palm.rotation.z = -0.08;
  root.add(palm);

  const trunkMaterial = material("#b98255");
  for (let i = 0; i < 6; i += 1) {
    const segment = new THREE.Mesh(new THREE.CylinderGeometry(0.19 - i * 0.01, 0.23 - i * 0.01, 0.48, 6), trunkMaterial);
    segment.position.set(i * 0.035, 0.28 + i * 0.4, 0);
    segment.rotation.z = -0.08;
    segment.castShadow = true;
    palm.add(segment);
  }

  const crown = new THREE.Group();
  crown.position.set(0.22, 2.8, 0);
  palm.add(crown);
  for (let i = 0; i < 7; i += 1) {
    const leaf = mesh(new THREE.ConeGeometry(0.22, 1.35, 5), i % 2 ? "#43a66f" : "#56bc80");
    leaf.position.set(Math.cos(i) * 0.36, 0, Math.sin(i) * 0.36);
    leaf.rotation.z = Math.PI / 2;
    leaf.rotation.y = (Math.PI * 2 * i) / 7;
    crown.add(leaf);
  }

  for (let i = 0; i < 3; i += 1) {
    const coconut = mesh(new THREE.DodecahedronGeometry(0.16, 0), "#7b5741");
    coconut.position.set(-0.12 + i * 0.13, -0.18, 0.03 + i * 0.03);
    crown.add(coconut);
  }
}

function addTileLines() {
  const lineMaterial = material("#e3ad74");
  for (let i = -3; i <= 3; i += 1) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.012, 4.65), lineMaterial);
    line.position.set(i, 0.12, 0.15);
    root.add(line);
  }
  for (let i = -2; i <= 2; i += 1) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(7, 0.012, 0.018), lineMaterial);
    line.position.set(-0.35, 0.125, i * 0.9);
    root.add(line);
  }
}

function addSunPatches() {
  for (let i = 0; i < 5; i += 1) {
    const patch = mesh(new THREE.CircleGeometry(0.34 + i * 0.08, 5), "#ffe7a8", { roughness: 1 });
    patch.position.set(-3.2 + i * 1.35, 0.132, 1.75 - (i % 2) * 0.6);
    patch.rotation.x = -Math.PI / 2;
    patch.rotation.z = i * 0.4;
    root.add(patch);
  }
}

function mesh(geometry, color, options = {}) {
  const item = new THREE.Mesh(geometry, material(color, options));
  item.castShadow = true;
  item.receiveShadow = false;
  return item;
}

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.86,
    metalness: options.metalness ?? 0,
    flatShading: true,
  });
}

function createBorderLab() {
  const cards = [...document.querySelectorAll("[data-border-effect]")];
  if (!cards.length) return [];

  const effectMap = {
    micro: MicroParticleBorder,
    aurora: AuroraSmokeBorder,
    cyber: CyberRibbonBorder,
  };

  const effects = cards.map((card) => {
    const Effect = effectMap[card.dataset.borderEffect] || MicroParticleBorder;
    return new Effect(card);
  });

  const state = {
    speed: 0.82,
    density: 0.72,
    active: false,
  };

  const speedInput = document.getElementById("border-speed");
  const densityInput = document.getElementById("border-density");
  const toggle = document.getElementById("xiaoqing-state-toggle");

  const sync = () => {
    const boostedSpeed = state.active ? Math.max(state.speed, 1.65) : state.speed;
    const boostedDensity = state.active ? Math.max(state.density, 1.38) : state.density;
    effects.forEach((effect) => effect.setState({ speed: boostedSpeed, density: boostedDensity, active: state.active }));
    cards.forEach((card) => {
      card.dataset.state = state.active ? "running" : "idle";
    });
  };

  speedInput?.addEventListener("input", () => {
    state.speed = Number(speedInput.value);
    sync();
  });

  densityInput?.addEventListener("input", () => {
    state.density = Number(densityInput.value);
    sync();
  });

  toggle?.addEventListener("click", () => {
    state.active = !state.active;
    toggle.setAttribute("aria-pressed", String(state.active));
    if (state.active) {
      speedInput.value = String(Math.max(Number(speedInput.value), 1.65));
      densityInput.value = String(Math.max(Number(densityInput.value), 1.38));
      state.speed = Number(speedInput.value);
      state.density = Number(densityInput.value);
    } else {
      speedInput.value = "0.82";
      densityInput.value = "0.72";
      state.speed = 0.82;
      state.density = 0.72;
    }
    sync();
  });

  const api = {
    setSpeed(value) {
      state.speed = clamp(Number(value) || state.speed, 0.2, 3);
      if (speedInput) speedInput.value = String(clamp(state.speed, Number(speedInput.min), Number(speedInput.max)));
      sync();
    },
    setDensity(value) {
      state.density = clamp(Number(value) || state.density, 0.2, 2);
      if (densityInput) densityInput.value = String(clamp(state.density, Number(densityInput.min), Number(densityInput.max)));
      sync();
    },
    setPushing(isPushing) {
      state.active = Boolean(isPushing);
      toggle?.setAttribute("aria-pressed", String(state.active));
      sync();
    },
  };
  window.xiaoqingTodoBorderState = api;
  document.body.dataset.borderApi = "ready";
  window.addEventListener("xiaoqing:border-state", (event) => {
    const detail = event.detail || {};
    if (typeof detail.speed === "number") api.setSpeed(detail.speed);
    if (typeof detail.density === "number") api.setDensity(detail.density);
    if (typeof detail.pushing === "boolean") api.setPushing(detail.pushing);
  });

  sync();
  return effects;
}

class BorderEffect {
  constructor(card) {
    this.card = card;
    this.frame = card.querySelector(".todo-glow-frame");
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(0, 1, 1, 0, -10, 10);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, premultipliedAlpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.frame.appendChild(this.renderer.domElement);
    this.width = 1;
    this.height = 1;
    this.cardWidth = 1;
    this.cardHeight = 1;
    this.padding = 12;
    this.speed = 0.82;
    this.density = 0.72;
    this.active = false;

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.frame);
    this.resize();
  }

  setState({ speed, density, active }) {
    this.speed = speed;
    this.density = density;
    this.active = active;
    if (this.material?.uniforms) {
      this.material.uniforms.uSpeed.value = speed;
      this.material.uniforms.uDensity.value = density;
      if (this.material.uniforms.uActive) this.material.uniforms.uActive.value = active ? 1 : 0;
    }
  }

  resize() {
    const rect = this.frame.getBoundingClientRect();
    this.width = Math.max(1, Math.round(rect.width));
    this.height = Math.max(1, Math.round(rect.height));
    const cardRect = this.card.getBoundingClientRect();
    this.cardWidth = Math.max(1, Math.round(cardRect.width));
    this.cardHeight = Math.max(1, Math.round(cardRect.height));
    this.padding = Math.max(0, Math.round((this.width - this.cardWidth) / 2));
    this.camera.left = 0;
    this.camera.right = this.width;
    this.camera.top = 0;
    this.camera.bottom = this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height, false);
    this.onResize();
  }

  onResize() {}

  tick(time) {
    if (this.material?.uniforms) {
      this.material.uniforms.uTime.value = time;
    }
    this.renderer.render(this.scene, this.camera);
  }
}

class MicroParticleBorder extends BorderEffect {
  constructor(card) {
    super(card);
    this.maxParticles = 900;
    const geometry = new THREE.BufferGeometry();
    const progress = new Float32Array(this.maxParticles);
    const seed = new Float32Array(this.maxParticles);
    const position = new Float32Array(this.maxParticles * 3);

    for (let i = 0; i < this.maxParticles; i += 1) {
      progress[i] = i / this.maxParticles;
      seed[i] = fract(Math.sin(i * 127.13) * 43758.5453);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
    geometry.setAttribute("aProgress", new THREE.BufferAttribute(progress, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: borderUniforms(),
      vertexShader: `
        uniform float uTime;
        uniform float uSpeed;
        uniform float uDensity;
        uniform vec2 uCardSize;
        uniform float uPadding;
        attribute float aProgress;
        attribute float aSeed;
        varying float vAlpha;

        float rand(float n) {
          return fract(sin(n) * 43758.5453123);
        }

        vec2 rectPoint(float t, vec2 size, float pad) {
          float perimeter = size.x * 2.0 + size.y * 2.0;
          float d = mod(t, 1.0) * perimeter;
          vec2 minP = vec2(pad);
          vec2 maxP = minP + size;
          if (d < size.x) return vec2(minP.x + d, minP.y);
          d -= size.x;
          if (d < size.y) return vec2(maxP.x, minP.y + d);
          d -= size.y;
          if (d < size.x) return vec2(maxP.x - d, maxP.y);
          d -= size.x;
          return vec2(minP.x, maxP.y - d);
        }

        void main() {
          float densityGate = smoothstep(aSeed - 0.08, aSeed + 0.08, uDensity * 0.58);
          float flow = aProgress + uTime * (0.035 + uSpeed * 0.025) + aSeed * 0.035;
          vec2 p = rectPoint(flow, uCardSize, uPadding);
          float wobble = sin(uTime * (0.7 + aSeed * 1.4) + aSeed * 41.0) * 1.8;
          vec2 center = uPadding + uCardSize * 0.5;
          vec2 normal = normalize(p - center + vec2(0.001));
          p += normal * wobble;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
          gl_PointSize = mix(2.0, 4.4, rand(aSeed * 91.0)) * (1.0 + uSpeed * 0.18);
          vAlpha = densityGate * (0.46 + rand(aSeed * 37.0) * 0.54);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying float vAlpha;

        void main() {
          vec2 p = gl_PointCoord - 0.5;
          float circle = smoothstep(0.5, 0.05, length(p));
          vec3 color = mix(vec3(0.42, 0.86, 1.0), vec3(1.0, 0.72, 0.42), gl_PointCoord.x);
          gl_FragColor = vec4(color, circle * vAlpha);
        }
      `,
    });

    this.points = new THREE.Points(geometry, this.material);
    this.scene.add(this.points);
    this.onResize();
  }

  onResize() {
    if (!this.material) return;
    this.material.uniforms.uResolution.value.set(this.width, this.height);
    this.material.uniforms.uCardSize.value.set(this.cardWidth, this.cardHeight);
    this.material.uniforms.uPadding.value = this.padding;
  }
}

class AuroraSmokeBorder extends BorderEffect {
  constructor(card) {
    super(card);
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: borderUniforms(),
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uDensity;
        uniform vec2 uResolution;
        uniform vec2 uCardSize;
        uniform float uPadding;
        varying vec2 vUv;

        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
          m = m * m;
          m = m * m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
          vec3 g;
          g.x = a0.x * x0.x + h.x * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        float fbm(vec2 p) {
          float f = 0.0;
          float amp = 0.5;
          for (int i = 0; i < 5; i++) {
            f += amp * snoise(p);
            p = mat2(1.62, -1.16, 1.16, 1.62) * p;
            amp *= 0.52;
          }
          return f;
        }

        void main() {
          vec2 px = vUv * uResolution;
          vec2 center = uPadding + uCardSize * 0.5;
          vec2 halfSize = uCardSize * 0.5;
          vec2 q = abs(px - center) - halfSize;
          float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
          float outerBand = smoothstep(10.0, 2.0, sd);
          float innerCut = smoothstep(0.4, 3.8, sd);
          float band = outerBand * innerCut;
          vec2 flow = px / max(uResolution.y, 1.0);
          float t = uTime * (0.14 + uSpeed * 0.08);
          float n = fbm(flow * 4.4 + vec2(t, -t * 0.7));
          float twist = fbm(flow * 8.0 + n + vec2(-t * 1.6, t));
          vec3 pinkBlue = mix(vec3(1.0, 0.48, 0.68), vec3(0.34, 0.78, 1.0), smoothstep(-0.35, 0.75, n));
          vec3 warmGold = vec3(1.0, 0.76, 0.36);
          vec3 color = mix(pinkBlue, warmGold, smoothstep(0.1, 0.88, twist));
          float alpha = band * (0.22 + uDensity * 0.22) * smoothstep(-0.65, 0.95, n + twist);
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.onResize();
  }

  onResize() {
    if (!this.mesh || !this.material) return;
    this.material.uniforms.uResolution.value.set(this.width, this.height);
    this.material.uniforms.uCardSize.value.set(this.cardWidth, this.cardHeight);
    this.material.uniforms.uPadding.value = this.padding;
    this.mesh.scale.set(this.width, this.height, 1);
    this.mesh.position.set(this.width / 2, this.height / 2, 0);
  }
}

class CyberRibbonBorder extends BorderEffect {
  constructor(card) {
    super(card);
    this.ribbonCount = 22;
    this.segments = 10;
    this.geometry = this.createGeometry();
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        ...borderUniforms(),
        uOffset: { value: 0 },
      },
      vertexShader: `
        uniform float uOffset;
        uniform vec2 uCardSize;
        uniform float uPadding;
        attribute float aStart;
        attribute float aLength;
        attribute float aSide;
        attribute float aAlong;
        varying float vAlong;
        varying float vPulse;

        vec2 rectPoint(float t, vec2 size, float pad) {
          float perimeter = size.x * 2.0 + size.y * 2.0;
          float d = mod(t, 1.0) * perimeter;
          vec2 minP = vec2(pad);
          vec2 maxP = minP + size;
          if (d < size.x) return vec2(minP.x + d, minP.y);
          d -= size.x;
          if (d < size.y) return vec2(maxP.x, minP.y + d);
          d -= size.y;
          if (d < size.x) return vec2(maxP.x - d, maxP.y);
          d -= size.x;
          return vec2(minP.x, maxP.y - d);
        }

        void main() {
          float t = aStart + uOffset + aAlong * aLength;
          vec2 p = rectPoint(t, uCardSize, uPadding);
          vec2 p2 = rectPoint(t + 0.002, uCardSize, uPadding);
          vec2 tangent = normalize(p2 - p + vec2(0.0001));
          vec2 normal = vec2(-tangent.y, tangent.x);
          p += normal * aSide * (1.8 + aLength * 22.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
          vAlong = aAlong;
          vPulse = fract(aStart * 17.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float uDensity;
        varying float vAlong;
        varying float vPulse;

        void main() {
          float head = smoothstep(0.0, 0.2, vAlong) * smoothstep(1.0, 0.62, vAlong);
          float lane = smoothstep(0.28, 0.9, uDensity + vPulse * 0.2);
          vec3 color = mix(vec3(0.32, 0.9, 1.0), vec3(1.0, 0.73, 0.34), vPulse);
          gl_FragColor = vec4(color, head * lane * 0.72);
        }
      `,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.path = null;
    this.onResize();
  }

  createGeometry() {
    const positions = [];
    const starts = [];
    const lengths = [];
    const sides = [];
    const alongs = [];
    const indices = [];
    let index = 0;

    for (let ribbon = 0; ribbon < this.ribbonCount; ribbon += 1) {
      const start = ribbon / this.ribbonCount + fract(Math.sin(ribbon * 9.17) * 17.13) * 0.04;
      const length = 0.035 + fract(Math.sin(ribbon * 23.71) * 39.31) * 0.075;
      for (let i = 0; i <= this.segments; i += 1) {
        const along = i / this.segments;
        for (const side of [-1, 1]) {
          positions.push(0, 0, 0);
          starts.push(start);
          lengths.push(length);
          sides.push(side);
          alongs.push(along);
        }
      }
      for (let i = 0; i < this.segments; i += 1) {
        const a = index + i * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
      index += (this.segments + 1) * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("aStart", new THREE.Float32BufferAttribute(starts, 1));
    geometry.setAttribute("aLength", new THREE.Float32BufferAttribute(lengths, 1));
    geometry.setAttribute("aSide", new THREE.Float32BufferAttribute(sides, 1));
    geometry.setAttribute("aAlong", new THREE.Float32BufferAttribute(alongs, 1));
    geometry.setIndex(indices);
    return geometry;
  }

  onResize() {
    if (!this.material) return;
    const min = new THREE.Vector3(this.padding, this.padding, 0);
    const max = new THREE.Vector3(this.padding + this.cardWidth, this.padding + this.cardHeight, 0);
    this.path = new THREE.CatmullRomCurve3([
      min.clone(),
      new THREE.Vector3(max.x, min.y, 0),
      max.clone(),
      new THREE.Vector3(min.x, max.y, 0),
    ], true, "catmullrom", 0);
    this.material.uniforms.uResolution.value.set(this.width, this.height);
    this.material.uniforms.uCardSize.value.set(this.cardWidth, this.cardHeight);
    this.material.uniforms.uPadding.value = this.padding;
  }

  tick(time) {
    this.material.uniforms.uTime.value = time;
    this.material.uniforms.uOffset.value = time * (0.12 + this.speed * 0.105);
    this.renderer.render(this.scene, this.camera);
  }
}

function borderUniforms() {
  return {
    uTime: { value: 0 },
    uSpeed: { value: 0.82 },
    uDensity: { value: 0.72 },
    uActive: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uCardSize: { value: new THREE.Vector2(1, 1) },
    uPadding: { value: 12 },
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function fract(value) {
  return value - Math.floor(value);
}

borderEffects.push(...createBorderLab());
