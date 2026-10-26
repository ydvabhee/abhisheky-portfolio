'use client';
import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { MathUtils, type Group, type Object3D, type PerspectiveCamera } from 'three';
import { THEMES, useThemeName, type Palette } from '@/lib/themes';
import { STAGES, type CamKey, type PoseName } from '@/lib/stages';
import Avatar from './Avatar';
import Sets from './Sets';

const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const LAST = STAGES.length - 1;
const wrapPi = (a: number) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
const CAM_KEYS: (keyof CamKey)[] = ['az', 'el', 'r', 'x', 'y', 'my', 'ty'];
const ah = (k: CamKey, ry: number) => k.az + ry;

function Rig({ pal }: { pal: Palette }) {
  const avatar = useRef<Group>(null);
  const shadow = useRef<Group>(null);
  const stage = useRef(0);
  const racket = useRef<Object3D>(null);
  const stops = useRef<number[]>([]);
  const [pose, setPose] = useState<PoseName>(STAGES[0].pose);
  const [outfitIdx, setOutfitIdx] = useState(0);
  const poseRef = useRef<PoseName>(STAGES[0].pose);
  const outfitRef = useRef(0);
  // cur.az is the world azimuth (stage ry already added)
  const cur = useRef<CamKey>(still ? { ...STAGES[0].cam } : { ...STAGES[0].cam, r: 9, el: 0.45 });
  const pos = useRef({ x: STAGES[0].pos[0], z: STAGES[0].pos[1], ry: STAGES[0].ry, walking: false });
  const mobileShadow = typeof window !== 'undefined' && window.innerWidth < 768;

  // Scroll offsets where each [data-scene] element is centred; recomputed on layout change
  useEffect(() => {
    const measure = () => {
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      stops.current = Array.from(document.querySelectorAll('[data-scene]'), (el) => {
        const r = el.getBoundingClientRect();
        // Phones: a tall card would cover the avatar, so park its top edge at mid-screen instead
        const card = el.querySelector('.glass')?.getBoundingClientRect();
        if (window.innerWidth < 768 && card && card.height > vh * 0.5) return MathUtils.clamp(card.top + window.scrollY - vh * 0.5, 0, max);
        return MathUtils.clamp(r.top + window.scrollY + r.height / 2 - vh / 2, 0, max);
      });
      console.assert(stops.current.length === STAGES.length, 'data-scene count != STAGES');
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useFrame(({ camera, size, pointer }, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const y = window.scrollY;
    const st = stops.current;
    let s = st.length - 1;
    for (let n = 0; n < st.length - 1; n++) {
      if (y < st[n + 1]) {
        s = n + MathUtils.clamp((y - st[n]) / (st[n + 1] - st[n] || 1), 0, 1);
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
      const target = k === 'az' ? MathUtils.lerp(ah(A.cam, A.ry), ah(B.cam, B.ry), t) : MathUtils.lerp(A.cam[k], B.cam[k], t);
      c[k] = MathUtils.damp(c[k], target, kd, dt);
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
    const np: PoseName = walking ? 'walk' : STAGES[n].pose;
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
    const R = c.r * (mobile ? 1.8 : 1);
    const az = c.az + pointer.x * 0.15;
    const el = c.el + pointer.y * 0.1;
    const ce = Math.cos(el);
    camera.position.set(p.x + R * Math.sin(az) * ce, c.ty + R * Math.sin(el), p.z + R * Math.cos(az) * ce);
    camera.lookAt(p.x, c.ty, p.z);
    (camera as PerspectiveCamera).setViewOffset(
      size.width,
      size.height,
      mobile ? 0 : -c.x * size.width,
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
        <Avatar pose={pose} outfit={STAGES[outfitIdx].outfit} palette={pal} still={still} racketRef={racket} />
      </group>
      <Sets stage={stage} palette={pal} still={still} racketRef={racket} />
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
