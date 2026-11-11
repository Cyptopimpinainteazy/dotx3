import { useEffect, useRef } from "react";
import * as THREE from "three";

function fit(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, el: HTMLElement) {
  const w = Math.max(el.clientWidth, 1);
  const h = Math.max(el.clientHeight, 1);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

export function HeroField() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = "h-full w-full";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
    camera.position.set(0, 0.2, 5.4);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.85, 1),
      new THREE.MeshBasicMaterial({ color: 0x2ec8ff, wireframe: true }),
    );
    scene.add(core);

    const inner = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.38, 0),
      new THREE.MeshBasicMaterial({ color: 0xff6b1a, wireframe: true }),
    );
    scene.add(inner);

    const group = new THREE.Group();
    const positions: number[] = [];
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xe8eaef });
    const nodeGeo = new THREE.SphereGeometry(0.045, 10, 10);
    for (let i = 0; i < 18; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 18);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.85;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi) * 0.72;
      const z = r * Math.sin(phi) * Math.sin(theta);
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(x, y, z);
      group.add(node);
      positions.push(0, 0, 0, x, y, z);
    }
    const lines = new THREE.LineSegments(
      new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(positions, 3)),
      new THREE.LineBasicMaterial({ color: 0x2ec8ff, transparent: true, opacity: 0.45 }),
    );
    group.add(lines);
    scene.add(group);

    let raf = 0;
    const clock = new THREE.Clock();
    const onResize = () => fit(renderer, camera, el);
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    const tick = () => {
      const t = reduced ? 0.6 : clock.getElapsedTime();
      group.rotation.y = t * 0.22;
      core.rotation.y = t * 0.35;
      core.rotation.x = t * 0.12;
      inner.rotation.y = -t * 0.5;
      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      nodeGeo.dispose();
      nodeMat.dispose();
      lines.geometry.dispose();
      (lines.material as THREE.Material).dispose();
      core.geometry.dispose();
      (core.material as THREE.Material).dispose();
      inner.geometry.dispose();
      (inner.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={wrapRef} className="mx-auto h-64 w-full max-w-xl" aria-hidden="true" />;
}

export function MeterScene({ progress }: { progress: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 30);
    camera.position.set(0, 0.55, 4.4);

    const track = new THREE.Mesh(
      new THREE.TorusGeometry(1.4, 0.035, 12, 80),
      new THREE.MeshBasicMaterial({ color: 0x262a36 }),
    );
    track.rotation.x = 1.05;
    scene.add(track);

    const arcMat = new THREE.MeshBasicMaterial({ color: 0x2ec8ff });
    const arc = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.07, 12, 96, 0.02), arcMat);
    arc.rotation.x = 1.05;
    arc.rotation.z = Math.PI / 2;
    scene.add(arc);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.46, 1),
      new THREE.MeshBasicMaterial({ color: 0xff6b1a, wireframe: true }),
    );
    scene.add(core);

    let last = -1;
    let raf = 0;
    const clock = new THREE.Clock();
    const onResize = () => fit(renderer, camera, el);
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    const tick = () => {
      const p = Math.min(1, Math.max(0, progressRef.current));
      if (Math.abs(p - last) > 0.004) {
        const theta = Math.max(0.02, p * Math.PI * 2);
        arc.geometry.dispose();
        arc.geometry = new THREE.TorusGeometry(1.4, 0.07, 12, 96, theta);
        last = p;
      }
      const t = reduced ? 0.4 : clock.getElapsedTime();
      core.rotation.y = t * 0.45;
      core.rotation.x = t * 0.18;
      core.scale.setScalar(0.85 + p * 0.35);
      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      track.geometry.dispose();
      (track.material as THREE.Material).dispose();
      arc.geometry.dispose();
      arcMat.dispose();
      core.geometry.dispose();
      (core.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="mx-auto h-72 w-full max-w-xl"
      role="img"
      aria-label="Three.js ring showing progress toward the $100,000,000,000 goal"
    />
  );
}
