import { useEffect, useRef } from "react";
import * as THREE from "three";

function fit(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, el: HTMLElement) {
  const w = Math.max(el.clientWidth, 1);
  const h = Math.max(el.clientHeight, 1);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
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
    let running = false;
    const t0 = performance.now();
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
      const t = reduced ? 0.4 : (performance.now() - t0) / 1000;
      core.rotation.y = t * 0.45;
      core.rotation.x = t * 0.18;
      core.scale.setScalar(0.85 + p * 0.35);
      renderer.render(scene, camera);
      if (running) raf = requestAnimationFrame(tick);
    };
    tick();

    // Only animate while the meter is on screen and the tab is visible.
    let onScreen = false;
    const sync = () => {
      const should = !reduced && onScreen && !document.hidden;
      if (should && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
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
      aria-label="Three.js ring showing how many milestone proofs are posted"
    />
  );
}
