import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const stage = document.getElementById("solar-stage");
const dock = document.getElementById("planet-dock");
const orbitToggle = document.getElementById("orbit-toggle");
const homeButton = document.getElementById("home-button");
const readout = document.querySelector(".readout");
const telemetry = document.getElementById("telemetry");
const fields = {
  index: document.getElementById("planet-index"),
  title: document.getElementById("planet-title"),
  copy: document.getElementById("planet-copy"),
  type: document.getElementById("planet-type"),
  distance: document.getElementById("planet-distance"),
  diameter: document.getElementById("planet-diameter"),
};

const bodies = [
  {
    key: "sun",
    name: "太阳",
    en: "Sun",
    type: "G 型主序星",
    distance: "0 AU",
    diameter: "1,392,700 km",
    copy: "恒星作为整个系统的视觉锚点，所有轨道、光照与镜头运动都围绕它建立。",
    radius: 2.25,
    orbit: 0,
    color: "#f7b955",
    accent: "#fff1b2",
    speed: 0,
    rotation: 0.035,
    texture: "sun",
  },
  {
    key: "mercury",
    name: "水星",
    en: "Mercury",
    type: "岩质行星",
    distance: "0.39 AU",
    diameter: "4,879 km",
    copy: "最靠近太阳、尺度最小，表面用灰褐色撞击坑强调干冷与高反差。",
    radius: 0.26,
    orbit: 4.2,
    color: "#aaa29a",
    accent: "#dfd5c9",
    speed: 0.34,
    rotation: 0.18,
    phase: 0.8,
    texture: "crater",
  },
  {
    key: "venus",
    name: "金星",
    en: "Venus",
    type: "岩质行星",
    distance: "0.72 AU",
    diameter: "12,104 km",
    copy: "厚重大气把表面包成暖金色云层，镜头靠近时会看到柔和的雾面纹理。",
    radius: 0.46,
    orbit: 5.45,
    color: "#d6a45f",
    accent: "#ffe0a6",
    speed: 0.24,
    rotation: -0.06,
    phase: 1.9,
    texture: "cloud",
  },
  {
    key: "earth",
    name: "地球",
    en: "Earth",
    type: "岩质行星",
    distance: "1 AU",
    diameter: "12,742 km",
    copy: "蓝色海洋、白色云带和夜侧微光构成唯一明显有生命感的焦点。",
    radius: 0.5,
    orbit: 6.9,
    color: "#55a9ff",
    accent: "#b7f3ff",
    speed: 0.18,
    rotation: 0.44,
    phase: 2.7,
    texture: "earth",
    moon: true,
  },
  {
    key: "mars",
    name: "火星",
    en: "Mars",
    type: "岩质行星",
    distance: "1.52 AU",
    diameter: "6,779 km",
    copy: "铁锈红表面、暗色盆地与极地浅色斑让它在内太阳系里更锐利。",
    radius: 0.38,
    orbit: 8.25,
    color: "#c76742",
    accent: "#ffb190",
    speed: 0.145,
    rotation: 0.38,
    phase: 3.7,
    texture: "dust",
  },
  {
    key: "jupiter",
    name: "木星",
    en: "Jupiter",
    type: "气态巨行星",
    distance: "5.20 AU",
    diameter: "139,820 km",
    copy: "橙白云带和大红斑强化体量感，点击后镜头会拉到更高的掠过角度。",
    radius: 1.18,
    orbit: 11.05,
    color: "#d9a978",
    accent: "#f4d1a7",
    speed: 0.078,
    rotation: 0.72,
    phase: 4.4,
    texture: "bands",
  },
  {
    key: "saturn",
    name: "土星",
    en: "Saturn",
    type: "气态巨行星",
    distance: "9.58 AU",
    diameter: "116,460 km",
    copy: "低饱和金色球体和宽阔环带是视觉主角，近景会让环面切过画面。",
    radius: 1.02,
    orbit: 13.95,
    color: "#d8bf88",
    accent: "#fff0bd",
    speed: 0.056,
    rotation: 0.62,
    phase: 5.2,
    texture: "softBands",
    ring: { inner: 1.25, outer: 2.12, color: "#d9c89c", tilt: 0.46 },
  },
  {
    key: "uranus",
    name: "天王星",
    en: "Uranus",
    type: "冰巨行星",
    distance: "19.2 AU",
    diameter: "50,724 km",
    copy: "冷青色、低纹理和倾斜环带，让外太阳系的节奏突然变安静。",
    radius: 0.78,
    orbit: 16.65,
    color: "#92e0de",
    accent: "#d7ffff",
    speed: 0.039,
    rotation: 0.4,
    phase: 0.35,
    texture: "ice",
    ring: { inner: 1.08, outer: 1.34, color: "#9fe8e6", tilt: 1.35 },
  },
  {
    key: "neptune",
    name: "海王星",
    en: "Neptune",
    type: "冰巨行星",
    distance: "30.1 AU",
    diameter: "49,244 km",
    copy: "更深的蓝色与暗斑让最外侧轨道成为冷峻的终点。",
    radius: 0.76,
    orbit: 19.25,
    color: "#416dff",
    accent: "#9bb8ff",
    speed: 0.031,
    rotation: 0.42,
    phase: 1.15,
    texture: "storm",
  },
];

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2("#03050b", 0.012);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
stage.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 160);
const homePosition = new THREE.Vector3(0, 16.2, 28);
const homeTarget = new THREE.Vector3(0, 0, 0);
camera.position.copy(homePosition);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(homeTarget);
controls.enableDamping = true;
controls.dampingFactor = 0.065;
controls.enablePan = false;
controls.minDistance = 3.2;
controls.maxDistance = 44;
controls.maxPolarAngle = Math.PI * 0.72;
controls.minPolarAngle = Math.PI * 0.12;

const startedAt = performance.now();
let lastFrameAt = startedAt;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const solarPlane = new THREE.Group();
solarPlane.rotation.x = -0.08;
scene.add(solarPlane);

const bodyObjects = new Map();
const clickableMeshes = [];
const labels = new Map();
let focused = bodies[0];
let autoOrbit = true;
let cameraTween = null;

addEnvironment();
addLights();
createBodies();
createDock();
focusHome(false);
resize();

window.addEventListener("resize", resize);
stage.addEventListener("pointerdown", onPointerDown);
orbitToggle.addEventListener("click", toggleCruise);
homeButton.addEventListener("click", () => focusHome(true));
renderer.setAnimationLoop(tick);

function addEnvironment() {
  scene.add(createStarField(1400, 90, 1.0));
  scene.add(createStarField(420, 42, 1.9));

  const milkyWay = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({
      color: "#7898d8",
      size: 0.05,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  const positions = [];
  for (let i = 0; i < 900; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 22 + Math.random() * 58;
    positions.push(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 10 + Math.sin(angle * 2.0) * 2.4,
      Math.sin(angle) * radius,
    );
  }
  milkyWay.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  scene.add(milkyWay);
}

function createStarField(count, radius, size) {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const color = new THREE.Color();
  for (let i = 0; i < count; i += 1) {
    const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
    const theta = Math.random() * Math.PI * 2;
    const r = radius * (0.72 + Math.random() * 0.28);
    positions.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta),
    );
    color.setHSL(0.57 + Math.random() * 0.12, 0.34, 0.68 + Math.random() * 0.28);
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      sizeAttenuation: true,
      depthWrite: false,
    }),
  );
}

function addLights() {
  const ambient = new THREE.AmbientLight("#9db8ff", 0.35);
  scene.add(ambient);

  const sunLight = new THREE.PointLight("#ffd08a", 260, 80, 1.35);
  sunLight.position.set(0, 0, 0);
  solarPlane.add(sunLight);

  const rim = new THREE.DirectionalLight("#76aaff", 1.2);
  rim.position.set(-16, 12, -18);
  scene.add(rim);
}

function createBodies() {
  bodies.forEach((body, index) => {
    if (body.orbit > 0) {
      solarPlane.add(createOrbit(body.orbit, body.color));
    }

    const pivot = new THREE.Group();
    pivot.rotation.y = body.phase || 0;
    solarPlane.add(pivot);

    const holder = new THREE.Group();
    holder.position.x = body.orbit;
    pivot.add(holder);

    const material = createBodyMaterial(body);
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(body.radius, 72, 48), material);
    mesh.userData.bodyKey = body.key;
    holder.add(mesh);
    clickableMeshes.push(mesh);

    if (body.key === "sun") {
      const corona = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: createGlowTexture(),
          color: "#ffbc5c",
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      corona.scale.set(8.8, 8.8, 1);
      holder.add(corona);

      const outerCorona = corona.clone();
      outerCorona.material = corona.material.clone();
      outerCorona.material.color = new THREE.Color("#ff6f42");
      outerCorona.material.opacity = 0.34;
      outerCorona.scale.set(14, 14, 1);
      holder.add(outerCorona);
    }

    if (body.ring) {
      const ring = createRing(body);
      holder.add(ring);
    }

    if (body.moon) {
      const moonOrbit = createOrbit(0.96, "#b9c8d9", 0.24);
      moonOrbit.scale.y = 0.72;
      holder.add(moonOrbit);
      const moonPivot = new THREE.Group();
      holder.add(moonPivot);
      const moon = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 28, 18),
        new THREE.MeshStandardMaterial({
          map: createPlanetTexture({ base: "#aeb6bb", accent: "#707780", mode: "crater" }),
          roughness: 0.9,
        }),
      );
      moon.position.x = 0.96;
      moonPivot.add(moon);
      body.moonPivot = moonPivot;
    }

    const label = document.createElement("div");
    label.className = "planet-label";
    label.style.setProperty("--planet-color", body.color);
    label.innerHTML = `<span>${body.en}</span><small>${body.distance}</small>`;
    document.body.appendChild(label);
    labels.set(body.key, label);

    bodyObjects.set(body.key, { ...body, index, pivot, holder, mesh });
  });
}

function createBodyMaterial(body) {
  if (body.key === "sun") {
    return new THREE.MeshBasicMaterial({
      map: createPlanetTexture({ base: body.color, accent: body.accent, mode: body.texture }),
      color: "#ffffff",
    });
  }

  const material = new THREE.MeshStandardMaterial({
    map: createPlanetTexture({ base: body.color, accent: body.accent, mode: body.texture }),
    roughness: body.key === "earth" ? 0.62 : 0.86,
    metalness: 0.0,
  });

  if (body.key === "venus" || body.key === "uranus" || body.key === "neptune") {
    material.emissive = new THREE.Color(body.color);
    material.emissiveIntensity = 0.035;
  }

  return material;
}

function createOrbit(radius, color, opacity = 0.34) {
  const points = [];
  for (let i = 0; i <= 192; i += 1) {
    const angle = (i / 192) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.LineLoop(
    geometry,
    new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
    }),
  );
  line.scale.z = 0.92;
  return line;
}

function createRing(body) {
  const texture = createRingTexture(body.ring.color);
  const geometry = new THREE.RingGeometry(body.radius * body.ring.inner, body.radius * body.ring.outer, 128);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.82,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI / 2 + body.ring.tilt;
  ring.rotation.y = -0.2;
  return ring;
}

function createDock() {
  bodies.forEach((body, index) => {
    const button = document.createElement("button");
    button.className = "planet-button";
    button.type = "button";
    button.dataset.body = body.key;
    button.style.setProperty("--planet-color", body.color);
    button.innerHTML = `<span>${body.name}</span><small>${String(index).padStart(2, "0")} · ${body.en}</small>`;
    button.addEventListener("click", () => selectBody(body.key));
    dock.appendChild(button);
  });
}

function onPointerDown(event) {
  const bounds = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
  pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(clickableMeshes, false);
  if (hits[0]?.object?.userData.bodyKey) {
    selectBody(hits[0].object.userData.bodyKey);
  }
}

function toggleCruise() {
  autoOrbit = !autoOrbit;
  orbitToggle.classList.toggle("is-active", autoOrbit);
  orbitToggle.setAttribute("aria-pressed", String(autoOrbit));
  telemetry.textContent = autoOrbit ? "Camera locked · Heliocentric orbit plane" : "Manual inspection · Damped orbit controls";
}

function focusHome(animate = true) {
  const sun = bodyObjects.get("sun");
  if (!sun) return;
  focused = sun;
  updateReadout(sun);
  updateDock(sun.key);

  if (!animate) {
    camera.position.copy(homePosition);
    controls.target.copy(homeTarget);
    controls.update();
    return;
  }

  cameraTween = {
    startTime: elapsedSeconds(),
    duration: 1.35,
    fromPosition: camera.position.clone(),
    fromTarget: controls.target.clone(),
    toPosition: homePosition.clone(),
    toTarget: homeTarget.clone(),
  };
}

function selectBody(key, animate = true) {
  const body = bodyObjects.get(key);
  if (!body) return;

  focused = body;
  updateReadout(body);
  updateDock(body.key);

  const world = new THREE.Vector3();
  body.holder.getWorldPosition(world);

  const direction = world.clone().normalize();
  if (direction.lengthSq() < 0.1) {
    direction.set(0.85, 0.42, 0.92).normalize();
  }
  const side = new THREE.Vector3(-direction.z, 0.26, direction.x).normalize();
  const distance = THREE.MathUtils.clamp(body.radius * 6.2 + body.orbit * 0.07, 4.1, 9.2);
  const height = body.key === "sun" ? 5.6 : body.radius * 1.8 + 1.15;
  const targetPosition = world
    .clone()
    .add(direction.multiplyScalar(distance))
    .add(side.multiplyScalar(body.key === "saturn" ? 2.4 : 1.35))
    .add(new THREE.Vector3(0, height, 0));
  const targetLook = world.clone();

  if (!animate) {
    camera.position.copy(targetPosition);
    controls.target.copy(targetLook);
    controls.update();
    return;
  }

  cameraTween = {
    startTime: elapsedSeconds(),
    duration: 1.45,
    fromPosition: camera.position.clone(),
    fromTarget: controls.target.clone(),
    toPosition: targetPosition,
    toTarget: targetLook,
  };
}

function updateReadout(body) {
  readout.classList.add("is-switching");
  window.setTimeout(() => readout.classList.remove("is-switching"), 280);
  fields.index.textContent = `${String(body.index).padStart(2, "0")} / ${body.en}`;
  fields.title.textContent = body.name;
  fields.copy.textContent = body.copy;
  fields.type.textContent = body.type;
  fields.distance.textContent = body.distance;
  fields.diameter.textContent = body.diameter;
  telemetry.textContent = `${body.en} selected · ${body.type} · ${body.distance}`;
}

function updateDock(key) {
  dock.querySelectorAll(".planet-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.body === key);
  });
}

function tick() {
  const now = performance.now();
  const delta = Math.min((now - lastFrameAt) / 1000, 0.08);
  const elapsed = (now - startedAt) / 1000;
  lastFrameAt = now;

  bodyObjects.forEach((body) => {
    if (autoOrbit && body.key !== "sun") {
      body.pivot.rotation.y += body.speed * delta;
    }
    body.mesh.rotation.y += body.rotation * delta;
    if (body.moonPivot) {
      body.moonPivot.rotation.y += 0.92 * delta;
    }
  });

  const sun = bodyObjects.get("sun");
  if (sun) {
    const pulse = 1 + Math.sin(elapsed * 1.1) * 0.018;
    sun.mesh.scale.setScalar(pulse);
  }

  if (cameraTween) {
    const t = THREE.MathUtils.clamp((elapsed - cameraTween.startTime) / cameraTween.duration, 0, 1);
    const eased = easeInOutCubic(t);
    camera.position.lerpVectors(cameraTween.fromPosition, cameraTween.toPosition, eased);
    controls.target.lerpVectors(cameraTween.fromTarget, cameraTween.toTarget, eased);
    if (t >= 1) cameraTween = null;
  } else if (autoOrbit && focused?.key === "sun") {
    const orbitAngle = elapsed * 0.035;
    camera.position.x = Math.sin(orbitAngle) * 28;
    camera.position.z = Math.cos(orbitAngle) * 28;
    camera.position.y = 16.2 + Math.sin(elapsed * 0.22) * 1.1;
    controls.target.lerp(homeTarget, 0.04);
  }

  controls.update();
  updateLabels();
  renderer.render(scene, camera);
}

function updateLabels() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const cameraDirection = new THREE.Vector3();
  camera.getWorldDirection(cameraDirection);

  bodyObjects.forEach((body) => {
    const label = labels.get(body.key);
    if (!label) return;
    const world = new THREE.Vector3();
    body.holder.getWorldPosition(world);
    const toBody = world.clone().sub(camera.position).normalize();
    const visible = cameraDirection.dot(toBody) > 0.25;
    const projected = world.clone().project(camera);
    const x = (projected.x * 0.5 + 0.5) * width;
    const y = (-projected.y * 0.5 + 0.5) * height;
    label.style.opacity = visible && projected.z < 1 ? "1" : "0";
    label.style.transform = `translate(${x + 12}px, ${y - 12}px)`;
  });
}

function resize() {
  const width = Math.max(stage.clientWidth, 1);
  const height = Math.max(stage.clientHeight, 1);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function elapsedSeconds() {
  return (performance.now() - startedAt) / 1000;
}

function createPlanetTexture({ base, accent, mode }) {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 384;
  const ctx = canvas.getContext("2d");
  const baseColor = new THREE.Color(base);
  const accentColor = new THREE.Color(accent);

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, colorStyle(baseColor, 1.12));
  gradient.addColorStop(0.52, colorStyle(baseColor, 0.88));
  gradient.addColorStop(1, colorStyle(accentColor, 0.74));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (mode === "bands" || mode === "softBands") drawBands(ctx, canvas, baseColor, accentColor, mode);
  if (mode === "earth") drawEarth(ctx, canvas);
  if (mode === "crater") drawCraters(ctx, canvas, baseColor);
  if (mode === "cloud") drawClouds(ctx, canvas, baseColor, accentColor);
  if (mode === "dust") drawDust(ctx, canvas, baseColor, accentColor);
  if (mode === "ice") drawIce(ctx, canvas, baseColor, accentColor);
  if (mode === "storm") drawStorm(ctx, canvas, baseColor, accentColor);
  if (mode === "sun") drawSun(ctx, canvas);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function drawBands(ctx, canvas, baseColor, accentColor, mode) {
  const rows = mode === "softBands" ? 18 : 26;
  for (let i = 0; i < rows; i += 1) {
    const y = (i / rows) * canvas.height;
    const height = 8 + Math.random() * (mode === "softBands" ? 16 : 24);
    const mix = i % 2 === 0 ? accentColor : baseColor;
    ctx.fillStyle = withAlpha(colorStyle(mix, 0.8 + Math.random() * 0.36), mode === "softBands" ? 0.26 : 0.38);
    waveBand(ctx, canvas.width, y, height, 12 + Math.random() * 24);
  }
  if (mode === "bands") {
    ctx.fillStyle = "rgba(155, 58, 42, 0.68)";
    ctx.beginPath();
    ctx.ellipse(canvas.width * 0.67, canvas.height * 0.58, 54, 24, -0.1, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawEarth(ctx, canvas) {
  ctx.fillStyle = "#2d72c7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(63, 161, 102, 0.86)";
  for (let i = 0; i < 11; i += 1) {
    const x = Math.random() * canvas.width;
    const y = canvas.height * (0.18 + Math.random() * 0.62);
    blob(ctx, x, y, 38 + Math.random() * 56, 16 + Math.random() * 34, 7);
  }
  ctx.fillStyle = "rgba(245, 252, 255, 0.78)";
  for (let i = 0; i < 18; i += 1) {
    waveBand(ctx, canvas.width, Math.random() * canvas.height, 4 + Math.random() * 7, 18 + Math.random() * 30);
  }
}

function drawCraters(ctx, canvas, baseColor) {
  for (let i = 0; i < 90; i += 1) {
    const r = 2 + Math.random() * 12;
    const shade = Math.random() > 0.5 ? 0.7 : 1.18;
    ctx.strokeStyle = withAlpha(colorStyle(baseColor, shade), 0.34);
    ctx.lineWidth = 1 + Math.random() * 1.6;
    ctx.beginPath();
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawClouds(ctx, canvas, baseColor, accentColor) {
  for (let i = 0; i < 34; i += 1) {
    ctx.fillStyle = withAlpha(colorStyle(i % 2 ? baseColor : accentColor, 1.05), 0.22);
    waveBand(ctx, canvas.width, Math.random() * canvas.height, 8 + Math.random() * 18, 18 + Math.random() * 34);
  }
}

function drawDust(ctx, canvas, baseColor, accentColor) {
  drawCraters(ctx, canvas, baseColor);
  ctx.fillStyle = withAlpha(colorStyle(accentColor, 1.15), 0.22);
  blob(ctx, canvas.width * 0.28, canvas.height * 0.42, 84, 32, 9);
  ctx.fillStyle = "rgba(255, 230, 205, 0.5)";
  ctx.fillRect(0, 18, canvas.width, 10);
  ctx.fillRect(0, canvas.height - 28, canvas.width, 12);
}

function drawIce(ctx, canvas, baseColor, accentColor) {
  for (let i = 0; i < 18; i += 1) {
    ctx.fillStyle = withAlpha(colorStyle(i % 2 ? baseColor : accentColor, 1.0), 0.16);
    waveBand(ctx, canvas.width, Math.random() * canvas.height, 5 + Math.random() * 10, 26);
  }
}

function drawStorm(ctx, canvas, baseColor, accentColor) {
  drawIce(ctx, canvas, baseColor, accentColor);
  ctx.fillStyle = "rgba(18, 35, 121, 0.42)";
  blob(ctx, canvas.width * 0.62, canvas.height * 0.48, 68, 24, 8);
  ctx.fillStyle = "rgba(177, 208, 255, 0.22)";
  waveBand(ctx, canvas.width, canvas.height * 0.38, 12, 30);
}

function drawSun(ctx, canvas) {
  for (let i = 0; i < 54; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const g = ctx.createRadialGradient(x, y, 0, x, y, 26 + Math.random() * 90);
    g.addColorStop(0, "rgba(255, 244, 174, 0.5)");
    g.addColorStop(1, "rgba(255, 91, 39, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function createRingTexture(color) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.18, withAlpha(color, 0.26));
  gradient.addColorStop(0.36, withAlpha(color, 0.72));
  gradient.addColorStop(0.52, "rgba(255,255,255,0.18)");
  gradient.addColorStop(0.7, withAlpha(color, 0.54));
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, "rgba(255,255,255,0.95)");
  gradient.addColorStop(0.18, "rgba(255,222,130,0.78)");
  gradient.addColorStop(0.42, "rgba(255,134,58,0.34)");
  gradient.addColorStop(1, "rgba(255,92,24,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function waveBand(ctx, width, y, height, amplitude) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  for (let x = 0; x <= width; x += 22) {
    ctx.lineTo(x, y + Math.sin(x * 0.018 + y * 0.04) * amplitude * 0.2 + Math.sin(x * 0.047) * amplitude * 0.08);
  }
  ctx.lineTo(width, y + height);
  for (let x = width; x >= 0; x -= 22) {
    ctx.lineTo(x, y + height + Math.sin(x * 0.02 + y * 0.03) * amplitude * 0.18);
  }
  ctx.closePath();
  ctx.fill();
}

function blob(ctx, x, y, width, height, points) {
  ctx.beginPath();
  for (let i = 0; i <= points; i += 1) {
    const angle = (i / points) * Math.PI * 2;
    const jitter = 0.72 + Math.random() * 0.44;
    const px = x + Math.cos(angle) * width * jitter;
    const py = y + Math.sin(angle) * height * jitter;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function colorStyle(color, scalar = 1) {
  const c = color.clone().multiplyScalar(scalar);
  return `rgb(${Math.round(THREE.MathUtils.clamp(c.r, 0, 1) * 255)}, ${Math.round(THREE.MathUtils.clamp(c.g, 0, 1) * 255)}, ${Math.round(THREE.MathUtils.clamp(c.b, 0, 1) * 255)})`;
}

function withAlpha(color, alpha) {
  if (color.startsWith("#")) {
    const c = new THREE.Color(color);
    return `rgba(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}, ${alpha})`;
  }
  return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
}
