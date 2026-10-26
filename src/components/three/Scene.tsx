'use client';
import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import Lenis from 'lenis';
import { MathUtils, type Group, type Object3D, type PerspectiveCamera } from 'three';
import { THEMES, useThemeName, type Palette } from '@/lib/themes';
import { STAGES, type CamKey, type PoseName } from '@/lib/stages';
import Avatar from './Avatar';
import Sets from './Sets';

const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const LAST = STAGES.length - 1;
const wrapPi = (a: number) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
const CAM_KEYS: (keyof CamKey)[] = ['az', 'el', 'r', 'x', 'y', 'my', 'ty', 'mx', 'mr'];
const CAM_DEF: Partial<CamKey> = { mx: 0, mr: 1.8 };
const camVal = (k: CamKey, key: keyof CamKey) => k[key] ?? CAM_DEF[key] ?? 0;
const ah = (k: CamKey, ry: number) => k.az + ry;

function Rig({ pal }: { pal: Palette }) {
  const avatar = useRef<Group>(null);
  const shadow = useRef<Group>(null);
  const stage = useRef(0);
  const racket = useRef<Object3D>(null);
  const spout = useRef<Object3D>(null);
  // Snap stops: a[i] = scroll offset of keyframe i, b[i] = end of its reading zone (card taller than the screen)
  const stops = useRef<{ a: number[]; b: number[] }>({ a: [], b: [] });
  const arrived = useRef(0);
  const [pose, setPose] = useState<PoseName>(STAGES[0].pose);
  const [outfitIdx, setOutfitIdx] = useState(0);
  const poseRef = useRef<PoseName>(STAGES[0].pose);
  const outfitRef = useRef(0);
  // cur.az is the world azimuth (stage ry already added)
  const cur = useRef<CamKey>(still ? { ...STAGES[0].cam } : { ...STAGES[0].cam, r: 9, el: 0.45 });
  const pos = useRef({ x: STAGES[0].pos[0], z: STAGES[0].pos[1], ry: STAGES[0].ry, walking: false });
  const mobileShadow = typeof window !== 'undefined' && window.innerWidth < 768;

  // Scroll stops; recomputed on layout change. Stops are also the snap points.
  useEffect(() => {
    const scenes = () => Array.from(document.querySelectorAll('[data-scene]'));
    const measure = () => {
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      const mobile = window.innerWidth < 768;
      const a: number[] = [];
      const b: number[] = [];
      scenes().forEach((el) => {
        const r = el.getBoundingClientRect();
        const card = el.querySelector('.glass')?.getBoundingClientRect();
        let top = r.top + window.scrollY + r.height / 2 - vh / 2;
        // Phones: a tall card would cover the avatar, so park its top edge at mid-screen instead of centring it
        if (mobile && card && card.height > vh * 0.5) top = card.top + window.scrollY - vh * 0.5;
        top = MathUtils.clamp(top, 0, max);
        const over = card ? card.bottom + window.scrollY - (top + vh - 24) : 0;
        a.push(top);
        b.push(Math.min(top + Math.max(0, over), max));
      });
      for (let i = 0; i < b.length - 1; i++) b[i] = Math.min(b[i], a[i + 1]);
      stops.current = { a, b };
      console.assert(a.length === STAGES.length, 'data-scene count != STAGES');
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('resize', measure);

    // Snap to the nearest stop once scrolling stops; reading zones are left alone
    let holding = false;
    let timer = 0;
    // Apple-style smoothed wheel via Lenis (touch stays native); reduced motion gets plain native scrolling
    const lenis = still ? null : new Lenis({ lerp: 0.09, smoothWheel: true, syncTouch: false });
    if (lenis) document.documentElement.style.scrollBehavior = 'auto';
    let raf = 0;
    const tick = (time: number) => {
      lenis?.raf(time);
      raf = requestAnimationFrame(tick);
    };
    if (lenis) raf = requestAnimationFrame(tick);
    const go = (y: number) =>
      lenis ? lenis.scrollTo(y, { duration: 1.1, easing: (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t)) }) : window.scrollTo({ top: y, behavior: still ? 'auto' : 'smooth' });
    const snap = () => {
      const { a, b } = stops.current;
      const y = window.scrollY;
      if (holding || !a.length || a.some((top, i) => y >= top - 2 && y <= b[i] + 2)) return;
      let best = a[0];
      for (let i = 0; i < a.length; i++) for (const e of [a[i], b[i]]) if (Math.abs(y - e) < Math.abs(y - best)) best = e;
      go(best);
    };
    const later = () => {
      clearTimeout(timer);
      timer = window.setTimeout(snap, lenis ? 120 : 160);
    };
    const native = !lenis && 'onscrollend' in window;
    const down = () => (holding = true);
    const up = () => {
      holding = false;
      if (!native) later();
    };
    window.addEventListener('touchstart', down, { passive: true });
    window.addEventListener('touchend', up, { passive: true });
    window.addEventListener('touchcancel', up, { passive: true });
    const onScroll = native ? snap : later;
    window.addEventListener(native ? 'scrollend' : 'scroll', onScroll, { passive: true });
    // (with Lenis the plain scroll listener above fires for its animated scroll too, debounced by `later`)

    // Nav anchors land on the first stop inside the section
    const click = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!link || link.pathname !== location.pathname) return;
      const sec = document.getElementById(link.hash.slice(1));
      const el = sec?.matches('[data-scene]') ? sec : sec?.querySelector('[data-scene]');
      const i = el ? scenes().indexOf(el) : -1;
      if (i < 0) return;
      e.preventDefault();
      go(stops.current.a[i]);
    };
    document.addEventListener('click', click);
    return () => {
      ro.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      lenis?.destroy();
      document.documentElement.style.scrollBehavior = '';
      window.removeEventListener('resize', measure);
      window.removeEventListener('touchstart', down);
      window.removeEventListener('touchend', up);
      window.removeEventListener('touchcancel', up);
      window.removeEventListener(native ? 'scrollend' : 'scroll', onScroll);
      document.removeEventListener('click', click);
    };
  }, []);

  useFrame(({ camera, size, pointer }, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const y = window.scrollY;
    const { a: sa, b: sb } = stops.current;
    let s = Math.max(sa.length - 1, 0);
    for (let n = 0; n < sa.length - 1; n++) {
      if (y <= sb[n]) {
        s = n;
        break;
      }
      if (y < sa[n + 1]) {
        s = n + MathUtils.clamp((y - sb[n]) / (sa[n + 1] - sb[n] || 1), 0, 1);
        break;
      }
    }
    s = MathUtils.clamp(s, 0, LAST);
    const i = Math.floor(s);
    const j = Math.min(i + 1, LAST);
    const t = MathUtils.smoothstep(s - i, 0, 1);
    const n = Math.round(s);
    stage.current = s;
    const A = STAGES[i];
    const B = STAGES[j];

    // Camera key
    const c = cur.current;
    const kd = still ? 1000 : 3;
    for (const k of CAM_KEYS) {
      const target = k === 'az' ? MathUtils.lerp(ah(A.cam, A.ry), ah(B.cam, B.ry), t) : MathUtils.lerp(camVal(A.cam, k), camVal(B.cam, k), t);
      c[k] = MathUtils.damp(c[k] ?? CAM_DEF[k] ?? 0, target, kd, dt);
    }

    // Avatar walk
    const p = pos.current;
    const tx = MathUtils.lerp(A.pos[0], B.pos[0], t);
    const tz = MathUtils.lerp(A.pos[1], B.pos[1], t);
    let walking = false;
    if (still) {
      p.x = tx;
      p.z = tz;
      p.ry = MathUtils.lerp(A.ry, B.ry, t);
    } else {
      const nx = MathUtils.damp(p.x, tx, 2.5, dt);
      const nz = MathUtils.damp(p.z, tz, 2.5, dt);
      const vx = (nx - p.x) / Math.max(dt, 1e-4);
      const vz = (nz - p.z) / Math.max(dt, 1e-4);
      const v = Math.hypot(vx, vz);
      p.walking = p.walking ? v > 0.12 : v > 0.3;
      walking = p.walking;
      p.x = nx;
      p.z = nz;
      const target = walking ? Math.atan2(vx, vz) : MathUtils.lerp(A.ry, B.ry, t);
      p.ry += wrapPi(target - p.ry) * (1 - Math.exp(-8 * dt));
    }
    const tgt = STAGES[n].pos;
    const here = still || (!walking && Math.hypot(p.x - tgt[0], p.z - tgt[1]) < 0.12);
    arrived.current = here ? arrived.current + dt : 0;
    const np: PoseName = here ? STAGES[n].pose : 'walk';
    if (np !== poseRef.current) {
      poseRef.current = np;
      setPose(np);
    }
    if (n !== outfitRef.current) {
      outfitRef.current = n;
      setOutfitIdx(n);
    }
    if (avatar.current) {
      avatar.current.position.set(p.x, 0, p.z);
      avatar.current.rotation.y = p.ry;
    }
    shadow.current?.position.set(p.x, 0.002, p.z);

    // Camera
    const mobile = size.width < 768;
    const R = c.r * (mobile ? (c.mr ?? 1.8) : 1);
    const az = c.az + pointer.x * 0.15;
    const el = c.el + pointer.y * 0.1;
    const ce = Math.cos(el);
    camera.position.set(p.x + R * Math.sin(az) * ce, c.ty + R * Math.sin(el), p.z + R * Math.cos(az) * ce);
    camera.lookAt(p.x, c.ty, p.z);
    (camera as PerspectiveCamera).setViewOffset(
      size.width,
      size.height,
      -(mobile ? (c.mx ?? 0) : c.x) * size.width,
      (mobile ? c.my : c.y) * size.height,
      size.width,
      size.height,
    );
  });

  const sc = pal.scene;
  return (
    <>
      <color attach="background" args={[sc.bg]} />
      <fog attach="fog" args={[sc.bg, 12, 30]} />
      <hemisphereLight args={[sc.sky, sc.ground, sc.hemi]} />
      <directionalLight position={[2.5, 5, 3.5]} intensity={sc.key} color={sc.keyColor} />
      <directionalLight position={[-4, 3, -3]} intensity={sc.fill} color={sc.fillColor} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[40, 64]} />
        <meshBasicMaterial color={sc.bg} toneMapped={false} />
      </mesh>
      <group ref={shadow}>
        <ContactShadows frames={Infinity} resolution={mobileShadow ? 128 : 256} scale={7} blur={2.5} far={1.6} color={sc.shadow} opacity={sc.shadowOpacity} />
      </group>
      <group ref={avatar}>
        <Avatar pose={pose} outfit={STAGES[outfitIdx].outfit} palette={pal} still={still} racketRef={racket} spoutRef={spout} />
      </group>
      <Sets stage={stage} palette={pal} still={still} racketRef={racket} spoutRef={spout} arrived={arrived} />
    </>
  );
}

export default function Scene() {
  const pal = THEMES[useThemeName()];
  return (
    <>
      <div className="fade-in pointer-events-none fixed inset-0 z-0" aria-hidden>
        <Canvas
          camera={{ position: [0, 1, 7], fov: 40 }}
          dpr={[1, window.innerWidth < 768 ? 1.5 : 1.75]}
          gl={{ antialias: true }}
          // Canvas ignores pointer events so the page stays interactive; track the cursor on body
          eventSource={document.body}
          eventPrefix="client"
        >
          <Rig pal={pal} />
        </Canvas>
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,color-mix(in_srgb,var(--bg)_70%,transparent)_100%)]"
        aria-hidden
      />
    </>
  );
}
