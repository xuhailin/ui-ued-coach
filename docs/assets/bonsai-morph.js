import * as THREE from "https://unpkg.com/three@0.164.1/build/three.module.js";

const mount = document.getElementById("bonsai-scene");
const shapeButton = document.getElementById("shape-button");
const pauseButton = document.getElementById("pause-button");
const shapeLabel = document.getElementById("shape-label");
const particleLabel = document.getElementById("particle-label");

const LEAF_COUNT = 1320;
const TRUNK_COUNT = 360;
const PETAL_COUNT = 40;
const MORPH_MS = 1800;
const AUTO_MS = 4300;
const SHAPES = [
  { name: "Canopy", palette: ["#6f8d4f", "#9fc17b", "#d2d49c", "#4f713d"] },
  { name: "Windswept", palette: ["#55754a", "#8fb06d", "#c2c886", "#77965c"] },
  { name: "Blossom", palette: ["#d8a8b5", "#f0d4d6", "#b86f84", "#f3e5d8"] },
  { name: "Moss Garden", palette: ["#8fbf93", "#5e8b62", "#b8755d", "#87a9b5"] },
];

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.setSize(mount.clientWidth, mount.clientHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
mount.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x090a08, 0.028);

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 90);
camera.position.set(0, 7.2, 18);
camera.lookAt(0, 4.2, 0);

const root = new THREE.Group();
root.position.set(3.9, -2.4, 0);
root.rotation.y = -0.42;
scene.add(root);

const ambient = new THREE.HemisphereLight(0xdde7c8, 0x15100d, 0.95);
scene.add(ambient);

const key = new THREE.DirectionalLight(0xffdfb6, 3.1);
key.position.set(-5, 11, 7);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.left = -14;
key.shadow.camera.right = 14;
key.shadow.camera.top = 16;
key.shadow.camera.bottom = -8;
key.shadow.camera.near = 0.5;
key.shadow.camera.far = 40;
scene.add(key);

const rim = new THREE.PointLight(0x8fb7a6, 1.3, 28);
rim.position.set(5.5, 6.5, -6);
scene.add(rim);

const fill = new THREE.PointLight(0xbd745f, 0.85, 18);
fill.position.set(3.5, 2, 6);
scene.add(fill);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(13, 96),
  new THREE.MeshStandardMaterial({
    color: 0x10130f,
    roughness: 0.9,
    metalness: 0.02,
    transparent: true,
    opacity: 0.68,
  }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.08;
floor.receiveShadow = true;
root.add(floor);

const pot = new THREE.Group();
const potMat = new THREE.MeshStandardMaterial({ color: 0x8b5b4d, roughness: 0.78, metalness: 0.04 });
const potLipMat = new THREE.MeshStandardMaterial({ color: 0xb07a62, roughness: 0.7, metalness: 0.04 });
const potBody = new THREE.Mesh(new THREE.CylinderGeometry(2.15, 1.55, 1.55, 72, 1, true), potMat);
potBody.position.y = 0.78;
potBody.castShadow = true;
potBody.receiveShadow = true;
const potLip = new THREE.Mesh(new THREE.CylinderGeometry(2.35, 2.16, 0.26, 72), potLipMat);
potLip.position.y = 1.55;
potLip.castShadow = true;
potLip.receiveShadow = true;
const soil = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 1.95, 0.08, 72), new THREE.MeshStandardMaterial({ color: 0x1b1611, roughness: 1 }));
soil.position.y = 1.72;
soil.receiveShadow = true;
pot.add(potBody, potLip, soil);
root.add(pot);

const leafGeometry = new THREE.PlaneGeometry(0.42, 0.2, 1, 1);
leafGeometry.translate(0.08, 0, 0);
const leafMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  roughness: 0.86,
  metalness: 0,
  transparent: true,
  opacity: 0.96,
});
const leaves = new THREE.InstancedMesh(leafGeometry, leafMaterial, LEAF_COUNT);
leaves.castShadow = true;
leaves.receiveShadow = false;
leaves.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
root.add(leaves);

const trunkGeometry = new THREE.DodecahedronGeometry(0.16, 0);
const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.82, metalness: 0.02 });
const trunk = new THREE.InstancedMesh(trunkGeometry, trunkMaterial, TRUNK_COUNT);
trunk.castShadow = true;
trunk.receiveShadow = true;
trunk.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
root.add(trunk);

const petalGeometry = new THREE.PlaneGeometry(0.36, 0.2);
const petalMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  roughness: 0.88,
  transparent: true,
  opacity: 0.82,
});
const petals = new THREE.InstancedMesh(petalGeometry, petalMaterial, PETAL_COUNT);
petals.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
root.add(petals);

const dustGeometry = new THREE.BufferGeometry();
const dustPositions = new Float32Array(180 * 3);
for (let i = 0; i < 180; i += 1) {
  dustPositions[i * 3] = (rand(i, 3) - 0.5) * 17;
  dustPositions[i * 3 + 1] = rand(i, 9) * 12 + 1;
  dustPositions[i * 3 + 2] = (rand(i, 14) - 0.5) * 12;
}
dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
const dust = new THREE.Points(
  dustGeometry,
  new THREE.PointsMaterial({
    color: 0xf0e5d1,
    size: 0.035,
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
  }),
);
root.add(dust);

const leafTargets = SHAPES.map((_, index) => buildLeafTarget(index));
const trunkTargets = SHAPES.map((_, index) => buildTrunkTarget(index));

const leafState = createState(LEAF_COUNT, leafTargets[0]);
const trunkState = createState(TRUNK_COUNT, trunkTargets[0]);
const leafRandom = Float32Array.from({ length: LEAF_COUNT }, (_, i) => rand(i, 44));
const trunkRandom = Float32Array.from({ length: TRUNK_COUNT }, (_, i) => rand(i, 91));
const leafBase = new Float32Array(LEAF_COUNT * 3);
const trunkBase = new Float32Array(TRUNK_COUNT * 3);
const leafColorBase = new Float32Array(LEAF_COUNT * 3);
const trunkColorBase = new Float32Array(TRUNK_COUNT * 3);
const leafRot = Float32Array.from({ length: LEAF_COUNT * 3 }, (_, i) => (rand(i, 103) - 0.5) * Math.PI);
const trunkRot = Float32Array.from({ length: TRUNK_COUNT * 3 }, (_, i) => (rand(i, 208) - 0.5) * Math.PI);

let activeShape = 0;
let nextShape = 0;
let morphStart = performance.now();
let paused = false;
let lastAuto = performance.now();
let quietUntil = 0;

const pointer = {
  active: false,
  world: new THREE.Vector3(999, 999, 999),
  ndc: new THREE.Vector2(999, 999),
};
const raycaster = new THREE.Raycaster();
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const tempPoint = new THREE.Vector3();
const dummy = new THREE.Object3D();
const tempColor = new THREE.Color();
const fromColor = new THREE.Color();
const toColor = new THREE.Color();

setInitialInstances();
resize();
renderer.setAnimationLoop(tick);

shapeButton.addEventListener("click", () => {
  userNudge();
  morphTo((activeShape + 1) % SHAPES.length);
});

pauseButton.addEventListener("click", () => {
  paused = !paused;
  pauseButton.querySelector("span").textContent = paused ? "继续" : "暂停";
  pauseButton.querySelector("svg").innerHTML = paused
    ? '<path d="m8 5 11 7-11 7V5Z" />'
    : '<path d="M8 5v14" /><path d="M16 5v14" />';
});

window.addEventListener("pointermove", (event) => {
  const box = renderer.domElement.getBoundingClientRect();
  pointer.ndc.x = ((event.clientX - box.left) / box.width) * 2 - 1;
  pointer.ndc.y = -(((event.clientY - box.top) / box.height) * 2 - 1);
  raycaster.setFromCamera(pointer.ndc, camera);
  if (raycaster.ray.intersectPlane(plane, tempPoint)) {
    root.worldToLocal(pointer.world.copy(tempPoint));
    pointer.active = true;
  }
});

window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

window.addEventListener("resize", resize);

function setInitialInstances() {
  leafState.currentPos.set(leafTargets[0].pos);
  leafState.currentColor.set(leafTargets[0].color);
  trunkState.currentPos.set(trunkTargets[0].pos);
  trunkState.currentColor.set(trunkTargets[0].color);
  particleLabel.textContent = `${(LEAF_COUNT + TRUNK_COUNT + PETAL_COUNT + 260).toLocaleString()} instances`;
}

function createState(count, target) {
  return {
    fromPos: new Float32Array(target.pos),
    fromColor: new Float32Array(target.color),
    currentPos: new Float32Array(target.pos),
    currentColor: new Float32Array(target.color),
    count,
  };
}

function morphTo(index) {
  if (index === nextShape && performance.now() - morphStart < MORPH_MS) return;
  snapshotState(leafState, leafBase, leafColorBase);
  snapshotState(trunkState, trunkBase, trunkColorBase);
  activeShape = index;
  nextShape = index;
  morphStart = performance.now();
  lastAuto = performance.now();
  shapeLabel.textContent = SHAPES[index].name;
}

function snapshotState(state, pos, color) {
  state.fromPos.set(pos);
  state.fromColor.set(color);
}

function tick(now) {
  const elapsed = now * 0.001;
  const dt = Math.min(0.05, renderer.info.render.frame ? renderer.info.render.frame * 0 + 0.016 : 0.016);

  if (!paused && !prefersReduced && now > quietUntil && now - lastAuto > AUTO_MS) {
    morphTo((activeShape + 1) % SHAPES.length);
  }

  root.rotation.y = -0.42 + Math.sin(elapsed * 0.16) * 0.06;
  pot.rotation.y += paused ? 0 : 0.0006;
  updateMorph(now);
  updateLeaves(elapsed);
  updateTrunk(elapsed);
  updatePetals(dt, elapsed);
  updateDust(elapsed);
  renderer.render(scene, camera);
}

function updateMorph(now) {
  const raw = prefersReduced ? 1 : Math.min(1, (now - morphStart) / MORPH_MS);
  const targetLeaves = leafTargets[nextShape];
  const targetTrunk = trunkTargets[nextShape];
  interpolateTarget(leafState, targetLeaves, leafRandom, raw, 0.36, leafBase, leafColorBase);
  interpolateTarget(trunkState, targetTrunk, trunkRandom, raw, 0.22, trunkBase, trunkColorBase);
}

function interpolateTarget(state, target, randoms, raw, maxDelay, outPos, outColor) {
  const { count, fromPos, fromColor, currentPos, currentColor } = state;
  for (let i = 0; i < count; i += 1) {
    const delayed = clamp((raw - randoms[i] * maxDelay) / (1 - maxDelay), 0, 1);
    const eased = easeInOutCubic(delayed);
    const p = i * 3;
    currentPos[p] = lerp(fromPos[p], target.pos[p], eased);
    currentPos[p + 1] = lerp(fromPos[p + 1], target.pos[p + 1], eased);
    currentPos[p + 2] = lerp(fromPos[p + 2], target.pos[p + 2], eased);
    currentColor[p] = lerp(fromColor[p], target.color[p], eased);
    currentColor[p + 1] = lerp(fromColor[p + 1], target.color[p + 1], eased);
    currentColor[p + 2] = lerp(fromColor[p + 2], target.color[p + 2], eased);
    outPos[p] = currentPos[p];
    outPos[p + 1] = currentPos[p + 1];
    outPos[p + 2] = currentPos[p + 2];
    outColor[p] = currentColor[p];
    outColor[p + 1] = currentColor[p + 1];
    outColor[p + 2] = currentColor[p + 2];
  }
}

function updateLeaves(time) {
  const radius = 2.65;
  for (let i = 0; i < LEAF_COUNT; i += 1) {
    const p = i * 3;
    let x = leafBase[p];
    let y = leafBase[p + 1];
    let z = leafBase[p + 2];

    const sway = Math.sin(time * 1.8 + i * 0.37) * 0.045;
    x += sway * (0.4 + leafRandom[i]);
    z += Math.cos(time * 1.4 + i * 0.21) * 0.025;

    if (pointer.active) {
      const dx = x - pointer.world.x;
      const dy = y - pointer.world.y;
      const dz = z - pointer.world.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < radius && dist > 0.001) {
        const power = (1 - dist / radius) ** 2 * 1.25;
        x += (dx / dist) * power;
        y += (dy / dist) * power * 0.56;
        z += (dz / dist) * power;
      }
    }

    const scale = leafTargets[nextShape].scale[i] * (0.86 + Math.sin(time * 2.2 + i) * 0.035);
    dummy.position.set(x, y, z);
    dummy.rotation.set(
      leafRot[p] + Math.sin(time + i) * 0.06,
      leafRot[p + 1] + time * 0.06,
      leafRot[p + 2] + Math.cos(time * 1.4 + i) * 0.05,
    );
    dummy.scale.set(scale * 1.14, scale * 0.92, scale);
    dummy.updateMatrix();
    leaves.setMatrixAt(i, dummy.matrix);
    tempColor.setRGB(leafColorBase[p], leafColorBase[p + 1], leafColorBase[p + 2]);
    leaves.setColorAt(i, tempColor);
  }
  leaves.instanceMatrix.needsUpdate = true;
  leaves.instanceColor.needsUpdate = true;
}

function updateTrunk(time) {
  for (let i = 0; i < TRUNK_COUNT; i += 1) {
    const p = i * 3;
    const scale = trunkTargets[nextShape].scale[i];
    dummy.position.set(trunkBase[p], trunkBase[p + 1], trunkBase[p + 2]);
    dummy.rotation.set(trunkRot[p] * 0.22, trunkRot[p + 1] + time * 0.015, trunkRot[p + 2] * 0.2);
    dummy.scale.set(scale * 0.74, scale * 1.04, scale * 0.8);
    dummy.updateMatrix();
    trunk.setMatrixAt(i, dummy.matrix);
    tempColor.setRGB(trunkColorBase[p], trunkColorBase[p + 1], trunkColorBase[p + 2]);
    trunk.setColorAt(i, tempColor);
  }
  trunk.instanceMatrix.needsUpdate = true;
  trunk.instanceColor.needsUpdate = true;
}

const petalData = Array.from({ length: PETAL_COUNT }, (_, i) => makePetal(i, true));

function updatePetals(dt, time) {
  const palette = SHAPES[nextShape].palette;
  for (let i = 0; i < PETAL_COUNT; i += 1) {
    const p = petalData[i];
    p.life += dt * (paused ? 0 : 1);
    p.y -= p.speed * dt;
    p.x += Math.sin(time * p.wobble + p.phase) * 0.014;
    p.z += Math.cos(time * p.wobble * 0.7 + p.phase) * 0.011;
    p.rx += p.spin * dt;
    p.ry += p.spin * 0.63 * dt;
    if (p.y < 0.3 || p.life > p.maxLife) Object.assign(p, makePetal(i));

    dummy.position.set(p.x, p.y, p.z);
    dummy.rotation.set(p.rx, p.ry, p.rz);
    dummy.scale.setScalar(p.scale);
    dummy.updateMatrix();
    petals.setMatrixAt(i, dummy.matrix);
    tempColor.set(palette[Math.floor(rand(i, nextShape + 300) * palette.length)]);
    petals.setColorAt(i, tempColor);
  }
  petals.instanceMatrix.needsUpdate = true;
  petals.instanceColor.needsUpdate = true;
}

function updateDust(time) {
  const arr = dustGeometry.attributes.position.array;
  for (let i = 0; i < arr.length / 3; i += 1) {
    arr[i * 3] += Math.sin(time * 0.33 + i) * 0.0018;
    arr[i * 3 + 1] += Math.cos(time * 0.27 + i * 0.4) * 0.0014;
  }
  dustGeometry.attributes.position.needsUpdate = true;
}

function buildLeafTarget(shape) {
  const pos = new Float32Array(LEAF_COUNT * 3);
  const color = new Float32Array(LEAF_COUNT * 3);
  const scale = new Float32Array(LEAF_COUNT);
  const palette = SHAPES[shape].palette.map((value) => new THREE.Color(value));

  for (let i = 0; i < LEAF_COUNT; i += 1) {
    const u = rand(i, 1);
    const v = rand(i, 2);
    const w = rand(i, 5);
    const angle = u * Math.PI * 2;
    const radius = Math.sqrt(v);
    let x = Math.cos(angle) * radius;
    let y = (w - 0.5) * 2;
    let z = Math.sin(angle) * radius;

    if (shape === 0) {
      x *= 3.5 * (0.8 + y * 0.08);
      z *= 2.2;
      y = 4.7 + y * 1.35 - radius * 0.28;
    } else if (shape === 1) {
      x = x * 3.2 + y * 1.35 + 0.8;
      z *= 1.6;
      y = 4.35 + y * 1.05 + Math.max(0, x) * 0.17;
    } else if (shape === 2) {
      x *= 3.15 + Math.sin(angle * 3) * 0.45;
      z *= 2.55;
      y = 4.85 + y * 1.42 + Math.cos(angle * 2) * 0.28;
    } else {
      x = x * 2.45 + Math.sin(y * 2.5) * 0.75;
      z = z * 2.65 + Math.cos(x) * 0.22;
      y = 3.85 + y * 1.0 + radius * 0.58;
      if (i % 7 === 0) y -= 1.3 * rand(i, 19);
    }

    const p = i * 3;
    pos[p] = x;
    pos[p + 1] = y;
    pos[p + 2] = z;

    const c = palette[Math.floor(rand(i, 8) * palette.length)];
    const lift = 0.88 + rand(i, shape + 31) * 0.22;
    color[p] = clamp(c.r * lift, 0, 1);
    color[p + 1] = clamp(c.g * lift, 0, 1);
    color[p + 2] = clamp(c.b * lift, 0, 1);
    scale[i] = 0.58 + rand(i, 13) * 0.72;
  }
  return { pos, color, scale };
}

function buildTrunkTarget(shape) {
  const pos = new Float32Array(TRUNK_COUNT * 3);
  const color = new Float32Array(TRUNK_COUNT * 3);
  const scale = new Float32Array(TRUNK_COUNT);
  const bark = [new THREE.Color("#6e4a3c"), new THREE.Color("#8c6653"), new THREE.Color("#3d2d25")];

  for (let i = 0; i < TRUNK_COUNT; i += 1) {
    const t = i / (TRUNK_COUNT - 1);
    const branch = i % 5;
    let x;
    let y;
    let z;

    if (i < 145) {
      const h = t * 2.45;
      const bend = shape === 1 ? h * 0.72 : shape === 3 ? Math.sin(h * 2.1) * 0.32 : Math.sin(h * 1.4) * 0.2;
      x = bend + (rand(i, 1) - 0.5) * 0.18;
      y = 1.64 + h * 1.6;
      z = Math.sin(h * 1.9) * 0.22 + (rand(i, 2) - 0.5) * 0.2;
    } else {
      const local = (i - 145) / (TRUNK_COUNT - 145);
      const side = branch - 2;
      const arm = Math.floor((i - 145) / 43);
      const spread = 0.9 + local * 2.25;
      const dir = (side * 0.52 + arm * 0.32 + (shape === 1 ? 0.58 : 0)) * Math.PI;
      x = Math.cos(dir) * spread * (0.55 + rand(i, 3) * 0.6) + (shape === 1 ? local * 1.8 : 0);
      z = Math.sin(dir) * spread * (0.45 + rand(i, 4) * 0.55);
      y = 3.2 + local * 3.15 + Math.sin(local * Math.PI) * 0.4;
    }

    const p = i * 3;
    pos[p] = x;
    pos[p + 1] = y;
    pos[p + 2] = z;
    const c = bark[Math.floor(rand(i, 9) * bark.length)];
    const lift = 0.75 + rand(i, shape + 41) * 0.18;
    color[p] = c.r * lift;
    color[p + 1] = c.g * lift;
    color[p + 2] = c.b * lift;
    scale[i] = i < 145 ? 0.95 - (i / 145) * 0.34 : 0.42 + rand(i, 12) * 0.24;
  }
  return { pos, color, scale };
}

function makePetal(i, scattered = false) {
  const angle = rand(i, 61) * Math.PI * 2;
  const ring = scattered ? rand(i, 62) * 6 : 2 + rand(i, 62) * 4.5;
  return {
    x: Math.cos(angle) * ring + 1.2,
    y: scattered ? 2 + rand(i, 63) * 8 : 8 + rand(i, 63) * 3.5,
    z: Math.sin(angle) * ring,
    rx: rand(i, 64) * Math.PI,
    ry: rand(i, 65) * Math.PI,
    rz: rand(i, 66) * Math.PI,
    speed: 0.55 + rand(i, 67) * 0.9,
    spin: 0.8 + rand(i, 68) * 1.2,
    scale: 0.32 + rand(i, 69) * 0.45,
    phase: rand(i, 70) * Math.PI * 2,
    wobble: 1.1 + rand(i, 71) * 2.4,
    life: scattered ? rand(i, 72) * 6 : 0,
    maxLife: 5 + rand(i, 73) * 4,
  };
}

function resize() {
  const width = mount.clientWidth;
  const height = mount.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 760 ? 1.35 : 1.75));
  root.position.x = width < 760 ? 0.2 : 3.9;
  root.position.y = width < 760 ? -2.2 : -2.4;
  root.scale.setScalar(width < 760 ? 0.82 : 1);
}

function userNudge() {
  quietUntil = performance.now() + 3600;
}

function rand(index, salt) {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}
