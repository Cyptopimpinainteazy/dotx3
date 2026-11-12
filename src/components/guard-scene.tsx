import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The home page hero: the .x3 story as a live scene.
 *
 * Agent payment proposals leave Base, Solana and NEAR and fly to Guard, a hex-lattice
 * shield. At the shield each proposal is decided: allowed ones turn cyan and continue to
 * the owner-approved recipient; refused ones flash the shield orange and break apart.
 * The outcome mix is illustrative (it is an animation, not a feed of real transactions),
 * and the caption under the canvas says so.
 *
 * Performance: one draw call for every packet, trail and spark (a single additive Points
 * buffer), a shader-drawn shield, no post-processing. Rendering pauses off-screen and in
 * background tabs. With prefers-reduced-motion it renders one settled frame and stops.
 */

const CYAN = new THREE.Color(0x2ec8ff);
const ORANGE = new THREE.Color(0xff6b1a);
const WHITE = new THREE.Color(0xe8eaef);

const FOV = 38;
const SCENE_WIDTH = 14.6; // world units that must stay in frame horizontally
const GATE_X = 0.5;
const GATE_RADIUS = 1.45;
const DEST = new THREE.Vector3(4.9, 0.15, 0);
const SOURCES = [
  { label: "BASE", pos: new THREE.Vector3(-4.7, 1.75, -0.6) },
  { label: "SOLANA", pos: new THREE.Vector3(-5.0, 0.05, 0.5) },
  { label: "NEAR", pos: new THREE.Vector3(-4.6, -1.7, -0.3) },
];
const ALLOW_RATE = 0.66;

const MAX_PACKETS = 48;
const TRAIL = 16;
const MAX_SPARKS = 520;
const STARS = 520;
const POINT_COUNT = MAX_PACKETS * TRAIL + MAX_SPARKS;

const pointsVertex = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  uniform float uScale;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uScale / max(-mv.z, 0.1);
    vColor = aColor;
    vAlpha = aAlpha;
  }
`;

const pointsFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float halo = pow(smoothstep(0.5, 0.0, d), 2.4);
    float core = smoothstep(0.16, 0.0, d);
    float a = (halo * 0.85 + core) * vAlpha;
    gl_FragColor = vec4(mix(vColor, vec3(1.0), core * 0.55) * a, a);
  }
`;

const shieldVertex = /* glsl */ `
  varying vec2 vP;
  void main() {
    vP = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const shieldFragment = /* glsl */ `
  uniform float uTime;
  uniform float uRadius;
  uniform vec2 uHit;
  uniform float uHitAge;
  uniform float uHitStrength;
  uniform vec3 uHitColor;
  uniform vec3 uBase;
  varying vec2 vP;

  float hexDist(vec2 p) {
    p = abs(p);
    return max(dot(p, normalize(vec2(1.0, 1.7320508))), p.x);
  }

  void main() {
    float r = length(vP) / uRadius;
    if (r > 1.0) discard;

    vec2 uv = vP * 3.4;
    vec2 s = vec2(1.0, 1.7320508);
    vec2 a = mod(uv, s) - s * 0.5;
    vec2 b = mod(uv - s * 0.5, s) - s * 0.5;
    vec2 gv = dot(a, a) < dot(b, b) ? a : b;
    float edge = 1.0 - smoothstep(0.0, 0.07, 0.5 - hexDist(gv));

    float rim = smoothstep(0.72, 1.0, r) * (1.0 - smoothstep(0.965, 1.0, r));
    float sweepY = sin(uTime * 0.55) * uRadius;
    float sweep = exp(-pow((vP.y - sweepY) * 4.0, 2.0));
    float breathe = 0.85 + 0.15 * sin(uTime * 1.7);

    float d = distance(vP, uHit);
    float wave = exp(-pow((d - uHitAge * 3.2) * 4.5, 2.0)) * exp(-uHitAge * 2.2) * uHitStrength;
    float flash = exp(-uHitAge * 4.0) * uHitStrength;

    float alpha = edge * (0.17 + sweep * 0.32) * breathe + rim * 0.42 + wave * (0.55 + edge) + flash * 0.16;
    float hot = clamp(wave * 1.6 + flash, 0.0, 1.0);
    vec3 color = mix(uBase, uHitColor, hot);
    alpha *= 1.0 - smoothstep(0.985, 1.0, r);
    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

type Packet = {
  active: boolean;
  phase: 0 | 1; // 0: source to Guard, 1: Guard to recipient
  t: number;
  duration: number;
  allow: boolean;
  p0: THREE.Vector3;
  p1: THREE.Vector3;
  p2: THREE.Vector3;
  hitLocal: THREE.Vector2;
  pos: THREE.Vector3;
  trail: THREE.Vector3[];
  color: THREE.Color;
};

type Spark = {
  life: number;
  max: number;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  color: THREE.Color;
  size: number;
};

function bezier(
  out: THREE.Vector3,
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  t: number,
) {
  const u = 1 - t;
  return out.set(
    u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
    u * u * p0.z + 2 * u * t * p1.z + t * t * p2.z,
  );
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function drawLabel(text: string, color: string) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const font = "700 64px Syne, 'IBM Plex Sans', system-ui, sans-serif";
  const spacing = 10;
  ctx.font = font;
  let width = 40;
  for (const ch of text) width += ctx.measureText(ch).width + spacing;
  canvas.width = Math.ceil(width);
  canvas.height = 112;
  ctx.font = font;
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  let x = 20;
  for (const ch of text) {
    ctx.fillText(ch, x, 58);
    x += ctx.measureText(ch).width + spacing;
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** A camera-facing text label. redraw() re-renders it, e.g. once webfonts have loaded. */
function labelSprite(text: string, color: string, height = 0.32) {
  const material = new THREE.SpriteMaterial({ transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  let scale = 1;
  const applyScale = () => {
    const img = material.map?.image as HTMLCanvasElement | undefined;
    if (img) sprite.scale.set((height * scale * img.width) / img.height, height * scale, 1);
  };
  const redraw = () => {
    const next = drawLabel(text, color);
    material.map?.dispose();
    material.map = next;
    material.needsUpdate = true;
    applyScale();
  };
  redraw();
  return {
    sprite,
    redraw,
    /** Narrow viewports pull the camera back; enlarge labels so they stay legible. */
    setScale: (next: number) => {
      scale = next;
      applyScale();
    },
    dispose: () => {
      material.map?.dispose();
      material.dispose();
    },
  };
}

export function GuardScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const allowedRef = useRef<HTMLSpanElement>(null);
  const refusedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      el.dataset.webgl = "unavailable";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = "absolute inset-0 h-full w-full";
    el.prepend(renderer.domElement);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07080c, 0.045);
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 80);
    const world = new THREE.Group();
    world.rotation.y = 0.36;
    scene.add(world);

    // Floor grid, fading into the fog.
    const grid = new THREE.GridHelper(40, 40, 0x2ec8ff, 0x1b2a3a);
    const gridMat = grid.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.16;
    gridMat.depthWrite = false;
    grid.position.y = -2.7;
    world.add(grid);
    track(grid.geometry);
    track(gridMat);

    // Stars: slow drift in a wide box behind the action.
    const starGeo = track(new THREE.BufferGeometry());
    const starPos = new Float32Array(STARS * 3);
    const starSize = new Float32Array(STARS);
    const starAlpha = new Float32Array(STARS);
    const starColor = new Float32Array(STARS * 3);
    for (let i = 0; i < STARS; i++) {
      starPos.set([rand(-18, 18), rand(-6, 9), rand(-22, 2)], i * 3);
      starSize[i] = rand(0.03, 0.09);
      starAlpha[i] = rand(0.15, 0.6);
      (Math.random() < 0.18 ? ORANGE : Math.random() < 0.5 ? CYAN : WHITE).toArray(
        starColor,
        i * 3,
      );
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("aSize", new THREE.BufferAttribute(starSize, 1));
    starGeo.setAttribute("aAlpha", new THREE.BufferAttribute(starAlpha, 1));
    starGeo.setAttribute("aColor", new THREE.BufferAttribute(starColor, 3));

    const pointUniforms = { uScale: { value: 1 } };
    const pointsMaterial = track(
      new THREE.ShaderMaterial({
        uniforms: pointUniforms,
        vertexShader: pointsVertex,
        fragmentShader: pointsFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    const stars = new THREE.Points(starGeo, pointsMaterial);
    scene.add(stars);

    // Guard: hex shield, rim, counter-rotating arcs, label.
    const gate = new THREE.Group();
    gate.position.set(GATE_X, 0, 0);
    // Angled about 45 degrees off the flow so the lattice reads face-on to the camera.
    gate.rotation.y = Math.PI / 2 + 0.5;
    world.add(gate);
    gate.updateMatrix();

    const shieldUniforms = {
      uTime: { value: 0 },
      uRadius: { value: GATE_RADIUS },
      uHit: { value: new THREE.Vector2() },
      uHitAge: { value: 10 },
      uHitStrength: { value: 0 },
      uHitColor: { value: ORANGE.clone() },
      uBase: { value: CYAN.clone() },
    };
    const shield = new THREE.Mesh(
      track(new THREE.CircleGeometry(GATE_RADIUS, 96)),
      track(
        new THREE.ShaderMaterial({
          uniforms: shieldUniforms,
          vertexShader: shieldVertex,
          fragmentShader: shieldFragment,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        }),
      ),
    );
    gate.add(shield);

    const rimMat = track(
      new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.9 }),
    );
    gate.add(new THREE.Mesh(track(new THREE.TorusGeometry(GATE_RADIUS, 0.028, 10, 128)), rimMat));

    const arcs: THREE.Mesh[] = [];
    const arcMat = track(
      new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.55 }),
    );
    const arcMatHot = track(
      new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0.8 }),
    );
    for (let i = 0; i < 3; i++) {
      const arc = new THREE.Mesh(
        track(new THREE.TorusGeometry(GATE_RADIUS + 0.18 + i * 0.11, 0.012, 6, 64, rand(0.7, 1.4))),
        i === 1 ? arcMatHot : arcMat,
      );
      arc.rotation.z = rand(0, Math.PI * 2);
      gate.add(arc);
      arcs.push(arc);
    }

    const labels: ReturnType<typeof labelSprite>[] = [];
    const addLabel = (text: string, color: string, pos: THREE.Vector3, h?: number) => {
      const l = labelSprite(text, color, h);
      l.sprite.position.copy(pos);
      world.add(l.sprite);
      labels.push(l);
      return l;
    };
    addLabel("GUARD", "#2ec8ff", new THREE.Vector3(GATE_X, -GATE_RADIUS - 0.55, 0), 0.34);
    addLabel(".x3 MANDATE", "#8b919e", new THREE.Vector3(GATE_X, GATE_RADIUS + 0.5, 0), 0.24);

    // Sources and recipient: wireframe nodes with a glow.
    const nodeGeo = track(new THREE.OctahedronGeometry(0.2, 0));
    const nodeMat = track(new THREE.MeshBasicMaterial({ color: WHITE, wireframe: true }));
    const nodes: THREE.Mesh[] = [];
    for (const s of SOURCES) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.copy(s.pos);
      world.add(node);
      nodes.push(node);
      addLabel(s.label, "#e8eaef", s.pos.clone().add(new THREE.Vector3(0, -0.5, 0)), 0.28);
    }
    const destGeo = track(new THREE.IcosahedronGeometry(0.32, 0));
    const destMat = track(new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true }));
    const dest = new THREE.Mesh(destGeo, destMat);
    dest.position.copy(DEST);
    world.add(dest);
    addLabel(
      "ALLOWED RECIPIENT",
      "#2ec8ff",
      DEST.clone().add(new THREE.Vector3(0, -0.66, 0)),
      0.26,
    );

    // Faint guide curves for each route.
    const guideMat = track(
      new THREE.LineBasicMaterial({ color: 0x2ec8ff, transparent: true, opacity: 0.12 }),
    );
    const gateCenter = new THREE.Vector3(GATE_X, 0, 0);
    for (const s of SOURCES) {
      const ctrl = s.pos
        .clone()
        .lerp(gateCenter, 0.5)
        .add(new THREE.Vector3(0, s.pos.y * 0.25, 0));
      const curve = new THREE.QuadraticBezierCurve3(s.pos, ctrl, gateCenter);
      world.add(
        new THREE.Line(
          track(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48))),
          guideMat,
        ),
      );
    }
    world.add(
      new THREE.Line(track(new THREE.BufferGeometry().setFromPoints([gateCenter, DEST])), guideMat),
    );

    // Dynamic points: packet heads + trails, then sparks. One draw call.
    const dynGeo = track(new THREE.BufferGeometry());
    const dPos = new Float32Array(POINT_COUNT * 3);
    const dSize = new Float32Array(POINT_COUNT);
    const dAlpha = new Float32Array(POINT_COUNT);
    const dColor = new Float32Array(POINT_COUNT * 3);
    const posAttr = new THREE.BufferAttribute(dPos, 3).setUsage(THREE.DynamicDrawUsage);
    const sizeAttr = new THREE.BufferAttribute(dSize, 1).setUsage(THREE.DynamicDrawUsage);
    const alphaAttr = new THREE.BufferAttribute(dAlpha, 1).setUsage(THREE.DynamicDrawUsage);
    const colorAttr = new THREE.BufferAttribute(dColor, 3).setUsage(THREE.DynamicDrawUsage);
    dynGeo.setAttribute("position", posAttr);
    dynGeo.setAttribute("aSize", sizeAttr);
    dynGeo.setAttribute("aAlpha", alphaAttr);
    dynGeo.setAttribute("aColor", colorAttr);
    const dynamic = new THREE.Points(dynGeo, pointsMaterial);
    dynamic.frustumCulled = false;
    world.add(dynamic);

    const packets: Packet[] = Array.from({ length: MAX_PACKETS }, () => ({
      active: false,
      phase: 0,
      t: 0,
      duration: 1,
      allow: true,
      p0: new THREE.Vector3(),
      p1: new THREE.Vector3(),
      p2: new THREE.Vector3(),
      hitLocal: new THREE.Vector2(),
      pos: new THREE.Vector3(),
      trail: Array.from({ length: TRAIL }, () => new THREE.Vector3()),
      color: WHITE.clone(),
    }));
    const sparks: Spark[] = Array.from({ length: MAX_SPARKS }, () => ({
      life: 0,
      max: 1,
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      color: CYAN.clone(),
      size: 0.1,
    }));
    let sparkCursor = 0;
    const nodePulse = SOURCES.map(() => 0);
    let destPulse = 0;
    let allowed = 0;
    let refused = 0;

    const burst = (
      at: THREE.Vector3,
      color: THREE.Color,
      count: number,
      speed: number,
      backward: boolean,
    ) => {
      for (let i = 0; i < count; i++) {
        const s = sparks[sparkCursor];
        sparkCursor = (sparkCursor + 1) % MAX_SPARKS;
        s.pos.copy(at);
        const dir = new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize();
        if (backward) dir.x = -Math.abs(dir.x) * 1.4;
        s.vel.copy(dir).multiplyScalar(rand(0.4, 1) * speed);
        s.max = s.life = rand(0.5, 1.15);
        s.color.copy(color);
        s.size = rand(0.05, 0.13);
      }
    };

    const hit = (local: THREE.Vector2, allow: boolean) => {
      shieldUniforms.uHit.value.copy(local);
      shieldUniforms.uHitAge.value = 0;
      shieldUniforms.uHitStrength.value = allow ? 0.45 : 1;
      shieldUniforms.uHitColor.value.copy(allow ? CYAN : ORANGE);
    };

    const spawn = () => {
      const p = packets.find((x) => !x.active);
      if (!p) return;
      const si = Math.floor(Math.random() * SOURCES.length);
      const src = SOURCES[si].pos;
      nodePulse[si] = 1;
      const ang = rand(0, Math.PI * 2);
      const rr = Math.sqrt(Math.random()) * GATE_RADIUS * 0.72;
      p.hitLocal.set(Math.cos(ang) * rr, Math.sin(ang) * rr);
      p.p0.copy(src);
      p.p2.set(p.hitLocal.x, p.hitLocal.y, 0).applyMatrix4(gate.matrix);
      p.p1
        .copy(p.p0)
        .lerp(p.p2, 0.5)
        .add(new THREE.Vector3(0, rand(-0.7, 0.9), rand(-0.9, 0.9)));
      p.phase = 0;
      p.t = 0;
      p.duration = rand(2.1, 3.0);
      p.allow = Math.random() < ALLOW_RATE;
      p.color.copy(WHITE);
      p.pos.copy(src);
      for (const v of p.trail) v.copy(src);
      p.active = true;
    };

    const tmp = new THREE.Vector3();
    let spawnIn = 0.2;
    let time = 0;

    const step = (dt: number) => {
      time += dt;
      spawnIn -= dt;
      if (spawnIn <= 0) {
        spawn();
        spawnIn = rand(0.32, 0.72);
      }

      for (const p of packets) {
        if (!p.active) continue;
        p.t += dt / p.duration;
        if (p.phase === 0 && p.t >= 1) {
          bezier(tmp, p.p0, p.p1, p.p2, 1);
          hit(p.hitLocal, p.allow);
          if (p.allow) {
            allowed++;
            p.color.copy(CYAN);
            burst(tmp, CYAN, 6, 0.9, false);
            p.phase = 1;
            p.t = 0;
            p.duration = rand(1.5, 2.0);
            p.p0.copy(tmp);
            p.p2.copy(DEST);
            p.p1
              .copy(tmp)
              .lerp(DEST, 0.5)
              .add(new THREE.Vector3(0, rand(-0.4, 0.4), rand(-0.5, 0.5)));
          } else {
            refused++;
            p.active = false;
            burst(tmp, ORANGE, 30, 2.6, true);
            burst(tmp, WHITE, 6, 1.4, true);
          }
          continue;
        }
        if (p.phase === 1 && p.t >= 1) {
          p.active = false;
          destPulse = 1;
          burst(DEST, CYAN, 12, 1.1, false);
          continue;
        }
        bezier(p.pos, p.p0, p.p1, p.p2, easeInOut(Math.min(p.t, 1)));
        // Refused proposals warm toward orange as they near the shield.
        if (p.phase === 0 && !p.allow && p.t > 0.7)
          p.color.copy(WHITE).lerp(ORANGE, (p.t - 0.7) / 0.3);
        for (let k = TRAIL - 1; k > 0; k--) p.trail[k].copy(p.trail[k - 1]);
        p.trail[0].copy(p.pos);
      }

      for (const s of sparks) {
        if (s.life <= 0) continue;
        s.life -= dt;
        s.vel.multiplyScalar(Math.exp(-2.4 * dt));
        s.vel.y -= 0.9 * dt;
        s.pos.addScaledVector(s.vel, dt);
      }

      shieldUniforms.uHitAge.value += dt;
      shieldUniforms.uTime.value = time;
      destPulse = Math.max(0, destPulse - dt * 2.2);
      for (let i = 0; i < nodePulse.length; i++)
        nodePulse[i] = Math.max(0, nodePulse[i] - dt * 2.5);
    };

    const writeBuffers = () => {
      let i = 0;
      for (const p of packets) {
        for (let k = 0; k < TRAIL; k++, i++) {
          if (!p.active) {
            dAlpha[i] = 0;
            continue;
          }
          const fade = 1 - k / TRAIL;
          p.trail[k].toArray(dPos, i * 3);
          dSize[i] = k === 0 ? 0.5 : 0.22 * fade + 0.04;
          dAlpha[i] = k === 0 ? 1 : fade * fade * 0.7;
          p.color.toArray(dColor, i * 3);
        }
      }
      for (const s of sparks) {
        if (s.life <= 0) {
          dAlpha[i] = 0;
        } else {
          s.pos.toArray(dPos, i * 3);
          dSize[i] = s.size;
          dAlpha[i] = s.life / s.max;
          s.color.toArray(dColor, i * 3);
        }
        i++;
      }
      posAttr.needsUpdate =
        sizeAttr.needsUpdate =
        alphaAttr.needsUpdate =
        colorAttr.needsUpdate =
          true;
      if (allowedRef.current) allowedRef.current.textContent = String(allowed);
      if (refusedRef.current) refusedRef.current.textContent = String(refused);
    };

    // Mouse parallax (fine pointers only).
    const look = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      look.tx = (e.clientX / window.innerWidth) * 2 - 1;
      look.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const fit = () => {
      const w = Math.max(el.clientWidth, 1);
      const h = Math.max(el.clientHeight, 1);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const halfTan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      const dist = Math.max(9.5, SCENE_WIDTH / 2 / (halfTan * camera.aspect));
      camera.position.set(0, 0.9, dist);
      camera.lookAt(0, -0.1, 0);
      camera.updateProjectionMatrix();
      pointUniforms.uScale.value = (h * renderer.getPixelRatio()) / (2 * halfTan);
      const labelScale = THREE.MathUtils.clamp(dist / 9.5, 1, 1.9);
      for (const l of labels) l.setScale(labelScale);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);

    const render = (dt: number) => {
      look.x += (look.tx - look.x) * Math.min(1, dt * 3);
      look.y += (look.ty - look.y) * Math.min(1, dt * 3);
      world.rotation.y = 0.36 + look.x * 0.14;
      world.rotation.x = look.y * 0.05;
      arcs.forEach((a, k) => (a.rotation.z += dt * (k % 2 ? -0.6 : 0.4) * (1 + k * 0.3)));
      nodes.forEach((n, k) => {
        n.rotation.y += dt * 0.8;
        n.rotation.x += dt * 0.3;
        n.scale.setScalar(1 + nodePulse[k] * 0.6);
      });
      dest.rotation.y -= dt * 0.5;
      dest.scale.setScalar(1 + destPulse * 0.5);
      stars.position.x = Math.sin(time * 0.05) * 0.6;
      writeBuffers();
      renderer.render(scene, camera);
    };

    let raf = 0;
    let running = false;
    let last = 0;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      step(dt);
      render(dt);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduced) {
      // Settle a few seconds of simulation, then hold one representative frame.
      for (let k = 0; k < 330; k++) step(1 / 60);
      render(0);
    } else {
      start();
    }

    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && !document.hidden) start();
      else stop();
    });
    io.observe(el);
    const onVisibility = () => (document.hidden || !onScreen ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    // Canvas labels are drawn with whatever font is ready; redraw once Syne has loaded.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      for (const l of labels) l.redraw();
      if (reduced) render(0);
    });

    return () => {
      cancelled = true;
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      for (const l of labels) l.dispose();
      for (const d of disposables) d.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <figure className="w-full">
      <div
        ref={wrapRef}
        className="relative h-72 w-full overflow-hidden bg-[radial-gradient(ellipse_62%_58%_at_50%_48%,rgb(7_8_12/0.82),rgb(7_8_12/0.35)_62%,transparent_80%)] sm:h-80 md:h-[26rem]"
        role="img"
        aria-label="Animation: payment proposals from Base, Solana and NEAR fly to Guard. Allowed payments turn cyan and continue to the owner-approved recipient; refused payments hit the shield, flash orange and break apart."
      />
      <figcaption className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-fg" aria-hidden="true" /> Proposed
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-primary" aria-hidden="true" /> Allowed{" "}
          <span ref={allowedRef} className="font-mono text-primary tabular-nums">
            0
          </span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-accent" aria-hidden="true" /> Refused{" "}
          <span ref={refusedRef} className="font-mono text-accent tabular-nums">
            0
          </span>
        </span>
        <span>Illustration, not live transactions</span>
      </figcaption>
    </figure>
  );
}
