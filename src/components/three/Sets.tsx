'use client';
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode, type Ref, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { Color, ConeGeometry, DoubleSide, MathUtils, Object3D, Quaternion, Vector3 } from 'three';
import type { BufferAttribute, Group, InstancedMesh, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import { NPC_HAIR, NPC_SKIN, type Palette, type PropColors } from '@/lib/themes';
import { STAGES } from '@/lib/stages';
import { BADMINTON_HZ, BADMINTON_HIT_PHASE } from './Avatar';

type V3 = [number, number, number];
type Ctx = { g: RefObject<Group | null>; p: RefObject<number>; still: boolean; stage: RefObject<number> };
const SetCtx = createContext<Ctx>(null!);

const TAU = Math.PI * 2;
const fract = (x: number) => x - Math.floor(x);
const easeOutBack = (p: number) => 1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2;
const dummy = new Object3D();
const tmpC = new Color();
const tmpV = new Vector3();
const Z = new Vector3(0, 0, 1);

// Runs cb only while the set is on screen; t is frozen at 0 under reduced motion
function useSet(cb: (t: number, dt: number, pop: number, s: number) => void) {
  const { g, p, still, stage } = useContext(SetCtx);
  useFrame(({ clock }, dt) => {
    if (g.current?.visible) cb(still ? 0 : clock.elapsedTime, dt, p.current, stage.current);
  });
}

function Clay({ c, two }: { c: string; two?: boolean }) {
  return <meshStandardMaterial color={c} roughness={0.9} metalness={0} side={two ? DoubleSide : undefined} />;
}
function M({ p, r, s, c, ref, two, children }: { p?: V3; r?: V3; s?: V3; c: string; ref?: Ref<Mesh>; two?: boolean; children: ReactNode }) {
  return (
    <mesh ref={ref} position={p} rotation={r} scale={s}>
      {children}
      <Clay c={c} two={two} />
    </mesh>
  );
}
function B({ a, r, p, rot, c, ref }: { a: V3; r: number; p?: V3; rot?: V3; c: string; ref?: Ref<Mesh> }) {
  return (
    <RoundedBox ref={ref} args={a} radius={r} smoothness={4} position={p} rotation={rot}>
      <Clay c={c} />
    </RoundedBox>
  );
}
function Scr({ a, p, c }: { a: [number, number]; p: V3; c: string }) {
  return (
    <mesh position={p} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={a} />
      <meshStandardMaterial color={c} roughness={0.5} emissive={c} emissiveIntensity={0.3} />
    </mesh>
  );
}
const Cyl = ({ a, ...r }: { a: (number | boolean)[]; p?: V3; r?: V3; s?: V3; c: string; ref?: Ref<Mesh>; two?: boolean }) => (
  <M {...r}>
    <cylinderGeometry args={a as [number]} />
  </M>
);
const Sph = ({ a, ...r }: { a: number; p?: V3; r?: V3; s?: V3; c: string; ref?: Ref<Mesh> }) => (
  <M {...r}>
    <sphereGeometry args={[a, 24, 16]} />
  </M>
);

// --- Station: owns the pop in/out transition for one set ---
function Station({ frame, stages, stage, still, children }: { frame: number; stages: number[]; stage: RefObject<number>; still: boolean; children: ReactNode }) {
  const g = useRef<Group>(null);
  const p = useRef(0);
  const ctx = useMemo(() => ({ g, p, still, stage }), [still, stage]);
  const f = STAGES[frame];
  useFrame((_, dt) => {
    const act = stages.includes(Math.round(stage.current));
    p.current = still ? +act : act ? Math.min(1, p.current + dt / 0.5) : Math.max(0, p.current - dt / 0.25);
    const q = p.current;
    const gr = g.current;
    if (!gr) return;
    gr.visible = q > 0.001;
    gr.scale.setScalar(Math.max(act ? easeOutBack(q) : q * q, 1e-4));
  });
  return (
    <SetCtx.Provider value={ctx}>
      <group ref={g} visible={false} position={[f.pos[0], 0, f.pos[1]]} rotation={[0, f.ry, 0]}>
        {children}
      </group>
    </SetCtx.Provider>
  );
}

// --- NPC ---
type Anim = 'idle' | 'talk' | 'nod' | 'clap' | 'swing';
function NPC({ at, ry, tee, skin, anim, k, band, racket, headRef }: { at: [number, number]; ry: number; tee: string; skin: number; anim: Anim; k: PropColors; band?: boolean; racket?: boolean; headRef?: Ref<Mesh> }) {
  const body = useRef<Group>(null);
  const head = useRef<Group>(null);
  const la = useRef<Group>(null);
  const ra = useRef<Group>(null);
  const phi = skin * 1.3;
  useSet((t) => {
    const b = body.current;
    const h = head.current;
    const l = la.current;
    const r = ra.current;
    if (!b || !h || !l || !r) return;
    b.rotation.z = 0.03 * Math.sin(TAU * 0.4 * t + phi);
    h.rotation.x = anim === 'nod' ? 0.12 + 0.1 * Math.sin(TAU * 1.4 * t + phi) : 0.05 * Math.sin(TAU * 0.3 * t + phi);
    h.rotation.y = anim === 'talk' ? 0.2 * Math.sin(TAU * 0.4 * t + phi) : 0;
    r.rotation.x = anim === 'talk' ? -0.6 + 0.35 * Math.sin(TAU * 1.1 * t + phi) : anim === 'clap' ? -1.2 : anim === 'swing' ? -2.4 + 0.8 * Math.sin(TAU * BADMINTON_HZ * t - BADMINTON_HIT_PHASE - Math.PI) : 0; // contact (x = -2.4, swinging forward) half a rally after his hit
    l.rotation.x = anim === 'clap' ? -1.2 : 0;
    const cl = 0.15 + 0.15 * Math.sin(TAU * 3 * t);
    l.rotation.z = anim === 'clap' ? -cl : 0;
    r.rotation.z = anim === 'clap' ? cl : 0;
  });
  const sk = NPC_SKIN[skin];
  return (
    <group position={[at[0], 0, at[1]]} rotation={[0, ry, 0]}>
      <group ref={body}>
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.08, 0.5, 0]}>
            <M p={[0, -0.25, 0]} c={k.ink}>
              <capsuleGeometry args={[0.065, 0.37, 6, 16]} />
            </M>
          </group>
        ))}
        <B a={[0.34, 0.38, 0.22]} r={0.1} p={[0, 0.72, 0]} c={tee} />
        <group ref={la} position={[-0.21, 0.87, 0]}>
          <M p={[0, -0.16, 0]} c={sk}>
            <capsuleGeometry args={[0.05, 0.22, 6, 16]} />
          </M>
        </group>
        <group ref={ra} position={[0.21, 0.87, 0]}>
          <M p={[0, -0.16, 0]} c={sk}>
            <capsuleGeometry args={[0.05, 0.22, 6, 16]} />
          </M>
          {racket && (
            <>
              <Cyl a={[0.015, 0.015, 0.22, 8]} p={[0, -0.43, 0]} c={k.b} />
              <M p={[0, -0.65, 0]} c={k.a} ref={headRef}>
                <torusGeometry args={[0.11, 0.012, 8, 24]} />
              </M>
            </>
          )}
        </group>
        <group ref={head} position={[0, 1.12, 0]}>
          <Sph a={0.19} c={sk} />
          <M r={[-0.3, 0, 0]} c={NPC_HAIR[skin]}>
            <sphereGeometry args={[0.198, 24, 12, 0, TAU, 0, 1.2]} />
          </M>
          {band && (
            <M c={k.ink}>
              <torusGeometry args={[0.2, 0.015, 6, 16, Math.PI]} />
            </M>
          )}
        </group>
      </group>
    </group>
  );
}

// --- Sets ---
function Home({ pal }: { pal: Palette }) {
  return <Cyl a={[0.8, 0.85, 0.06, 48]} p={[0, -0.03, 0]} c={pal.scene.plinth} />;
}

function Desk({ pal }: { pal: Palette }) {
  const k = pal.prop;
  return (
    <>
      <Cyl a={[1.75, 1.8, 0.06, 48]} p={[0, -0.03, 0.2]} c={pal.scene.plinth} />
      <B a={[1.1, 0.05, 0.5]} r={0.02} p={[0, 0.455, 0.55]} c={k.base} />
      <B a={[0.05, 0.43, 0.44]} r={0.02} p={[-0.5, 0.215, 0.55]} c={k.base} />
      <B a={[0.05, 0.43, 0.44]} r={0.02} p={[0.5, 0.215, 0.55]} c={k.base} />
      <B a={[0.36, 0.06, 0.34]} r={0.03} p={[0, 0.18, -0.02]} c={k.b} />
      <B a={[0.36, 0.36, 0.05]} r={0.025} p={[0, 0.4, -0.2]} c={k.b} />
      <Cyl a={[0.03, 0.03, 0.15]} p={[0, 0.075, -0.02]} c={k.soft} />
      <Cyl a={[0.2, 0.2, 0.03]} p={[0, 0.015, -0.02]} c={k.soft} />
    </>
  );
}

function S0({ k }: { k: PropColors }) {
  const m = useRef<(Mesh | null)[]>([]);
  useSet((t) => {
    m.current.forEach((o, i) => {
      if (!o) return;
      const a = 0.35 * t + i * 2.094;
      o.position.set(1.5 * Math.cos(a), 1 + 0.25 * Math.sin(0.8 * t + i), 1.5 * Math.sin(a));
      o.rotation.set(0.5 * t, 0.5 * t, 0);
    });
  });
  const ref = (i: number) => (o: Mesh | null) => {
    m.current[i] = o;
  };
  return (
    <>
      <Sph a={0.12} c={k.a} ref={ref(0)} />
      <M c={k.b} ref={ref(1)}>
        <torusGeometry args={[0.1, 0.04, 12, 24]} />
      </M>
      <B a={[0.16, 0.16, 0.16]} r={0.05} c={k.c} ref={ref(2)} />
    </>
  );
}

function S1({ k }: { k: PropColors }) {
  return (
    <>
      <B a={[0.3, 0.06, 0.22]} r={0.02} p={[0.6, 0.03, 0.15]} c={k.a} />
      <B a={[0.27, 0.06, 0.2]} r={0.02} p={[0.6, 0.09, 0.15]} rot={[0, 0.2, 0]} c={k.b} />
      <B a={[0.24, 0.06, 0.18]} r={0.02} p={[0.6, 0.15, 0.15]} rot={[0, -0.15, 0]} c={k.c} />
      <group position={[-0.55, 0, 0.2]}>
        <Cyl a={[0.12, 0.09, 0.18, 24]} p={[0, 0.09, 0]} c={k.a} />
        <Cyl a={[0.11, 0.11, 0.02, 24]} p={[0, 0.175, 0]} c={k.ink} />
        <Cyl a={[0.012, 0.012, 0.18, 8]} p={[0, 0.27, 0]} c={k.leaf} />
        <Sph a={0.06} p={[-0.06, 0.33, 0]} r={[0, 0, 0.4]} s={[1.6, 0.35, 0.8]} c={k.leaf} />
        <Sph a={0.06} p={[0.06, 0.33, 0]} r={[0, 0, -0.4]} s={[1.6, 0.35, 0.8]} c={k.leaf} />
      </group>
    </>
  );
}

function S2({ pal }: { pal: Palette }) {
  const k = pal.prop;
  const globe = useRef<Mesh>(null);
  const plane = useRef<Mesh>(null);
  const geo = useMemo(() => new ConeGeometry(0.07, 0.24, 3).rotateX(Math.PI / 2), []);
  useEffect(() => () => geo.dispose(), [geo]);
  useSet((t) => {
    if (globe.current) globe.current.rotation.y = 0.4 * t;
    const o = plane.current;
    if (!o) return;
    const a = 0.6 * t;
    o.position.set(1.3 * Math.cos(a), 1.35 + 0.12 * Math.sin(t), 0.2 + 1.3 * Math.sin(a));
    o.rotation.y = Math.atan2(-Math.sin(a), Math.cos(a));
  });
  return (
    <>
      <group position={[0, 0.48, 0.48]}>
        <B a={[0.36, 0.02, 0.24]} r={0.008} p={[0, 0.01, 0]} c={k.soft} />
        <group position={[0, 0.02, 0.12]} rotation={[0.3, 0, 0]}>
          <B a={[0.36, 0.24, 0.012]} r={0.006} p={[0, 0.12, 0]} c={k.soft} />
          <Scr a={[0.32, 0.2]} p={[0, 0.12, -0.007]} c={k.screen} />
        </group>
      </group>
      <group position={[-0.38, 0.48, 0.62]}>
        <Cyl a={[0.02, 0.05, 0.1, 12]} p={[0, 0.05, 0]} c={k.base} />
        <M p={[0, 0.21, 0]} c={k.b} ref={globe}>
          <sphereGeometry args={[0.11, 24, 16]} />
          <Sph a={0.06} p={[0, 0.03, 0.095]} s={[1, 0.7, 0.35]} c={k.leaf} />
        </M>
      </group>
      <B a={[0.3, 0.42, 0.15]} r={0.045} p={[0.8, 0.21, 0.15]} rot={[0, 0.3, 0]} c={k.a} />
      <M p={[0.8, 0.43, 0.15]} r={[0, 0.3, 0]} c={k.base}>
        <torusGeometry args={[0.05, 0.013, 6, 12, Math.PI]} />
      </M>
      <mesh ref={plane} scale={[1, 0.22, 1]} geometry={geo}>
        <Clay c={k.soft} />
      </mesh>
      <Cyl a={[0.03, 0.055, 1.8, 12]} p={[-1.1, 0.85, -1.4]} c={k.soft} />
      <Cyl a={[0.15, 0.11, 0.12, 20]} p={[-1.1, 1.45, -1.4]} c={k.c} />
      <Cyl a={[0.006, 0.02, 0.6, 8]} p={[-1.1, 2.05, -1.4]} c={k.soft} />
      <NPC at={[-1.3, 0.3]} ry={1.2} tee={k.c} skin={0} anim="talk" k={k} />
      <NPC at={[0.1, -1.3]} ry={-0.1} tee={k.a} skin={2} anim="nod" k={k} />
    </>
  );
}

function S3({ k }: { k: PropColors }) {
  const bars = useRef<(Mesh | null)[]>([]);
  const dots = useRef<(Mesh | null)[]>([]);
  useSet((t) => {
    bars.current.forEach((o, i) => {
      if (!o) return;
      const h = 0.08 + 0.22 * Math.abs(Math.sin(TAU * 1.3 * t + i * 0.9));
      o.scale.y = h;
      o.position.y = h / 2;
    });
    dots.current.forEach((o, i) => {
      if (o) o.position.y = 0.02 * Math.max(0, Math.sin(TAU * 1.5 * t - i * 0.8));
    });
  });
  return (
    <>
      <B a={[0.08, 0.015, 0.16]} r={0.006} p={[0.3, 0.49, 0.45]} rot={[0, -0.3, 0]} c={k.ink} />
      <Cyl a={[0.025, 0.05, 0.16]} p={[0, 0.56, 0.68]} c={k.base} />
      <B a={[0.5, 0.3, 0.025]} r={0.01} p={[0, 0.78, 0.68]} c={k.ink} />
      <group position={[0.1, 1.2, 0.6]} rotation={[0, -0.9, 0]}>
        {[-0.24, -0.12, 0, 0.12, 0.24].map((x, i) => (
          <Cyl key={x} a={[0.03, 0.03, 1, 12]} p={[x, 0, 0]} c={i % 2 ? k.c : k.a} ref={(o) => void (bars.current[i] = o)} />
        ))}
      </group>
      <group position={[0.35, 1.55, 0.35]} rotation={[0, -0.9, 0]}>
        <Sph a={0.16} s={[1.3, 1, 0.5]} c={k.soft} />
        {[-0.07, 0, 0.07].map((x, i) => (
          <Sph key={x} a={0.02} p={[x, 0, 0.085]} c={k.ink} ref={(o) => void (dots.current[i] = o)} />
        ))}
      </group>
      <NPC at={[1.2, -0.6]} ry={-2} tee={k.b} skin={1} anim="talk" k={k} band />
      <NPC at={[1.5, 0.3]} ry={-1.6} tee={k.a} skin={0} anim="nod" k={k} band />
    </>
  );
}

function S4({ k }: { k: PropColors }) {
  const bars = useRef<(Group | null)[]>([]);
  const pie = useRef<Group>(null);
  const hs = [0.18, 0.28, 0.22, 0.38];
  const cs = [k.a, k.b, k.c, k.a];
  useSet((t, _, pop) => {
    const e = Math.max(0, easeOutBack(Math.min(pop, 1)));
    bars.current.forEach((o, i) => o && (o.scale.y = Math.max(e * (1 + 0.05 * Math.sin(TAU * t * 0.4 + i)), 1e-3)));
    if (pie.current) pie.current.rotation.z = 0.3 * t;
  });
  return (
    <>
      <group position={[0.9, 0, -0.25]} rotation={[0, -0.6, 0]}>
        <B a={[1, 0.65, 0.05]} r={0.03} p={[0, 1.15, 0]} c={k.soft} />
        <Cyl a={[0.02, 0.02, 0.84]} p={[-0.42, 0.42, -0.03]} c={k.base} />
        <Cyl a={[0.02, 0.02, 0.84]} p={[0.42, 0.42, -0.03]} c={k.base} />
        {hs.map((h, i) => (
          <group key={i} position={[-0.3 + i * 0.2, 0.92, 0.035]} ref={(o) => void (bars.current[i] = o)}>
            <B a={[0.1, h, 0.03]} r={0.015} p={[0, h / 2, 0]} c={cs[i]} />
          </group>
        ))}
      </group>
      <group position={[-0.6, 1.5, -0.9]} rotation={[0, 0.35, 0]}>
        <group ref={pie}>
          <Cyl a={[0.25, 0.25, 0.06, 32, 1, false, 0, 4.4]} r={[Math.PI / 2, 0, 0]} c={k.a} two />
          <Cyl a={[0.25, 0.25, 0.06, 32, 1, false, 4.4, 1.88]} r={[Math.PI / 2, 0, 0]} c={k.c} two />
        </group>
      </group>
      <NPC at={[-1, -0.2]} ry={0.9} tee={k.b} skin={2} anim="clap" k={k} />
      <NPC at={[-0.9, -0.9]} ry={0.6} tee={k.c} skin={0} anim="nod" k={k} />
      <NPC at={[1.5, -0.9]} ry={-0.8} tee={k.a} skin={1} anim="idle" k={k} />
    </>
  );
}

function S5({ k }: { k: PropColors }) {
  const head = useRef<Mesh>(null);
  const rec = useRef<Mesh>(null);
  useSet((t) => {
    if (head.current) head.current.position.x = 0.13 * Math.sin(0.8 * t);
    if (rec.current) rec.current.visible = Math.sin(TAU * t) > 0;
  });
  const mon = (x: number, ry: number, extra?: boolean) => (
    <group position={[x, 0.48, 0.7]} rotation={[0, ry, 0]}>
      <Cyl a={[0.02, 0.04, 0.14]} p={[0, 0.07, 0]} c={k.base} />
      <B a={[0.42, 0.26, 0.025]} r={0.01} p={[0, 0.28, 0]} c={k.ink} />
      <Scr a={[0.39, 0.23]} p={[0, 0.28, -0.014]} c={k.screen} />
      {extra && (
        <>
          <M p={[0, 0.2, -0.015]} r={[0, Math.PI, 0]} c={k.a}>
            <planeGeometry args={[0.3, 0.03]} />
          </M>
          <M p={[0, 0.2, -0.016]} r={[0, Math.PI, 0]} c={k.ink} ref={head}>
            <planeGeometry args={[0.006, 0.08]} />
          </M>
        </>
      )}
    </group>
  );
  return (
    <>
      {mon(-0.22, 0.2, true)}
      {mon(0.22, -0.2)}
      <B a={[0.09, 0.12, 0.06]} r={0.025} p={[0.42, 0.54, 0.42]} c={k.b} />
      <Cyl a={[0.022, 0.022, 0.04]} p={[0.42, 0.62, 0.42]} c={k.c} />
      <group position={[0.7, 0, 1.25]} rotation={[0, -2.6, 0]}>
        {[0, 1, 2].map((i) => (
          <group key={i} position={[0, 0.9, 0]} rotation={[0, (i * TAU) / 3, 0]}>
            <group rotation={[0.25, 0, 0]}>
              <Cyl a={[0.012, 0.012, 0.95]} p={[0, -0.475, 0]} c={k.ink} />
            </group>
          </group>
        ))}
        <B a={[0.18, 0.12, 0.24]} r={0.03} p={[0, 0.98, 0]} c={k.ink} />
        <Cyl a={[0.05, 0.06, 0.08]} p={[0, 0.98, 0.15]} r={[Math.PI / 2, 0, 0]} c={k.ink} />
        <Sph a={0.012} p={[0.06, 1.05, 0.1]} c={k.a} ref={rec} />
      </group>
      <NPC at={[0.85, 1.5]} ry={-2.6} tee={k.c} skin={1} anim="idle" k={k} />
      <NPC at={[1.2, -0.15]} ry={-1.57} tee={k.a} skin={0} anim="talk" k={k} />
    </>
  );
}

// Shuttle: projectile with gravity + linear drag, launched so it lands exactly on the next racket.
// His racket is at contact at phase BADMINTON_HIT_PHASE, the opponent's half a cycle later; the
// racket heads are sampled (in set space) around those moments and cached, since the swings repeat.
const G = 9.8;
const DRAG = 3;
const T_FLIGHT = 1 / BADMINTON_HZ / 2;
const E_T = 1 - Math.exp(-DRAG * T_FLIGHT);
function S6({ k, racketRef }: { k: PropColors; racketRef: RefObject<Object3D | null> }) {
  const { g: setG, still } = useContext(SetCtx);
  const sh = useRef<Group>(null);
  const opp = useRef<Mesh>(null);
  const q = useMemo(() => new Quaternion(), []);
  const c = useMemo(() => ({ h: new Vector3(-0.35, 1.85, 0.2), o: new Vector3(0.45, 1.6, 2.35), hd: 1, od: 1 }), []);
  useSet((t, _, __, s) => {
    const g = sh.current;
    const set = setG.current;
    if (!g || !set) return;
    // Sample both racket heads near their contact moments (closest frame wins), only once he has settled here
    const ph = BADMINTON_HZ * t - BADMINTON_HIT_PHASE / TAU;
    if (!still && Math.abs(s - 6) < 0.02) {
      const sample = (ref: Object3D | null, u: number, v: Vector3, key: 'hd' | 'od') => {
        const d = Math.min(fract(u), 1 - fract(u));
        if (d > 0.1) c[key] = 1;
        else if (ref && d < c[key]) {
          c[key] = d;
          ref.getWorldPosition(v);
          set.worldToLocal(v);
        }
      };
      sample(racketRef.current, ph, c.h, 'hd');
      sample(opp.current, ph - 0.5, c.o, 'od');
    }
    const cyc = Math.floor(ph);
    let tau = (ph - cyc) / BADMINTON_HZ;
    if (still) tau = T_FLIGHT / 2;
    const back = tau >= T_FLIGHT;
    const tt = back ? tau - T_FLIGHT : tau;
    const a = back ? c.o : c.h;
    const b = back ? c.h : c.o;
    const e = Math.exp(-DRAG * tt);
    const f = (1 - e) / E_T;
    const vy0 = ((b.y - a.y + (G * T_FLIGHT) / DRAG) * DRAG) / E_T - G / DRAG;
    g.position.set(a.x + (b.x - a.x) * f, a.y + ((vy0 + G / DRAG) * (1 - e)) / DRAG - (G * tt) / DRAG, a.z + (b.z - a.z) * f);
    const hv = (DRAG * e) / E_T;
    tmpV.set((b.x - a.x) * hv, (vy0 + G / DRAG) * e - G / DRAG, (b.z - a.z) * hv).normalize();
    g.quaternion.copy(q.setFromUnitVectors(Z, tmpV));
  });
  return (
    <>
      <B a={[2, 0.06, 3.6]} r={0.03} p={[0, -0.03, 1.2]} c={k.b} />
      {[-0.9, 0.9].map((x) => (
        <M key={x} p={[x, 0.002, 1.2]} r={[-Math.PI / 2, 0, 0]} c={k.soft}>
          <planeGeometry args={[0.03, 3.4]} />
        </M>
      ))}
      {[-0.95, 0.95].map((x) => (
        <Cyl key={x} a={[0.02, 0.02, 0.95]} p={[x, 0.475, 1.4]} c={k.ink} />
      ))}
      <mesh position={[0, 0.7, 1.4]}>
        <planeGeometry args={[1.9, 0.45, 24, 6]} />
        <meshBasicMaterial color={k.soft} wireframe />
      </mesh>
      <B a={[1.9, 0.04, 0.02]} r={0.01} p={[0, 0.93, 1.4]} c={k.soft} />
      <group ref={sh}>
        <Sph a={0.03} p={[0, 0, 0.01]} c={k.soft} />
        <M p={[0, 0, -0.04]} r={[Math.PI / 2, 0, 0]} c={k.soft} two>
          <coneGeometry args={[0.045, 0.08, 12, 1, true]} />
        </M>
      </group>
      <NPC at={[0.25, 2.4]} ry={Math.PI} tee={k.a} skin={2} anim="swing" k={k} racket headRef={opp} />
    </>
  );
}

function S7({ k }: { k: PropColors }) {
  const water = useRef<Mesh>(null);
  const ropes = useRef<InstancedMesh>(null);
  const rip = useRef<(Mesh | null)[]>([]);
  useEffect(() => {
    const m = ropes.current;
    if (!m) return;
    for (let i = 0; i < 48; i++) m.setColorAt(i, tmpC.set(Math.floor(i / 2) % 2 ? k.soft : k.a));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [k]);
  useSet((t) => {
    const geo = water.current?.geometry as PlaneGeometry | undefined;
    if (geo) {
      const pos = geo.attributes.position as BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        pos.setZ(i, 0.012 * Math.sin(3 * pos.getX(i) + 2 * t) + 0.01 * Math.sin(2.5 * -pos.getY(i) + 1.6 * t));
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    }
    const m = ropes.current;
    if (m) {
      for (let i = 0; i < 48; i++) {
        const j = i % 24;
        dummy.position.set(i < 24 ? -0.7 : 0.7, 0.18 + 0.01 * Math.sin(2 * t + j * 0.5), -1.65 + j * 0.15);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
      }
      m.instanceMatrix.needsUpdate = true;
    }
    rip.current.forEach((o, i) => {
      if (!o) return;
      const u = fract(0.6 * t + i * 0.5);
      o.scale.setScalar(1 + 2 * u);
      (o.material as MeshStandardMaterial).opacity = 1 - u;
    });
  });
  return (
    <>
      <B a={[2, 0.2, 3.8]} r={0.06} p={[0, 0.05, 0]} c={k.soft} />
      <mesh ref={water} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.175, 0]}>
        <planeGeometry args={[1.8, 3.6, 18, 36]} />
        <meshStandardMaterial color={k.water} roughness={0.25} metalness={0} transparent opacity={0.82} />
      </mesh>
      <instancedMesh ref={ropes} args={[undefined, undefined, 48]}>
        <sphereGeometry args={[0.035, 12, 8]} />
        <meshStandardMaterial roughness={0.9} metalness={0} />
      </instancedMesh>
      {[-0.2, 0.2].map((x, i) => (
        <mesh key={x} ref={(o) => void (rip.current[i] = o)} position={[x, 0.18, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.01, 6, 24]} />
          <meshStandardMaterial color={k.soft} roughness={0.9} metalness={0} transparent />
        </mesh>
      ))}
      <B a={[0.4, 0.35, 0.35]} r={0.05} p={[0, 0.125, -2.05]} c={k.c} />
      <Cyl a={[0.02, 0.02, 1.3]} p={[1.4, 0.6, -0.6]} c={k.base} />
      <Cyl a={[0, 0.55, 0.28, 10]} p={[1.4, 1.3, -0.6]} c={k.a} />
    </>
  );
}

function S8({ pal, stage }: { pal: Palette; stage: RefObject<number> }) {
  const k = pal.prop;
  const plants = useRef<(Group | null)[]>([]);
  const drops = useRef<InstancedMesh>(null);
  useSet((t) => {
    const grow = MathUtils.smoothstep(MathUtils.clamp(1 - Math.abs(stage.current - 8) * 2, 0, 1), 0, 1);
    plants.current.forEach((o, i) => o && (o.scale.y = Math.max(grow + 0.03 * Math.sin(t + i), 1e-3)));
    const m = drops.current;
    if (!m) return;
    for (let i = 0; i < 5; i++) {
      const u = fract(1.4 * t + i / 5);
      dummy.position.set(-0.25, 0.58 - 0.34 * u * u, 0.68 + 0.04 * u);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });
  const bloom = [k.a, k.c, k.a];
  return (
    <>
      <Cyl a={[1.3, 1.35, 0.06, 40]} p={[0, -0.03, 0.3]} c={pal.scene.plinth} />
      <B a={[1.1, 0.22, 0.4]} r={0.05} p={[0, 0.11, 0.65]} c={k.base} />
      <B a={[1.02, 0.04, 0.32]} r={0.015} p={[0, 0.22, 0.65]} c={k.ink} />
      {[-0.35, 0, 0.35].map((x, i) => (
        <group key={x} position={[x, 0.24, 0.65]} ref={(o) => void (plants.current[i] = o)}>
          <Cyl a={[0.012, 0.016, 0.3]} p={[0, 0.15, 0]} c={k.leaf} />
          <Sph a={0.09} p={[0, 0.3, 0]} s={[1.2, 0.8, 1]} c={k.leaf} />
          <Sph a={0.04} p={[0, 0.38, 0]} c={bloom[i]} />
        </group>
      ))}
      <group position={[0.7, 0, -0.5]}>
        <Cyl a={[0.02, 0.02, 1.1]} p={[0, 0.55, 0]} c={k.leaf} />
        <group position={[0, 1.1, 0]} rotation={[0, -0.5, 0]}>
          <Cyl a={[0.15, 0.15, 0.04, 24]} r={[Math.PI / 2, 0, 0]} c={k.c} />
          <Sph a={0.07} p={[0, 0, 0.03]} s={[1, 1, 0.5]} c={k.base} />
        </group>
      </group>
      <instancedMesh ref={drops} args={[undefined, undefined, 5]}>
        <sphereGeometry args={[0.014, 8, 6]} />
        <meshStandardMaterial color={k.water} roughness={0.25} metalness={0} />
      </instancedMesh>
    </>
  );
}

function S9({ k }: { k: PropColors }) {
  const flag = useRef<Mesh>(null);
  const env = useRef<Mesh>(null);
  useSet((t) => {
    if (flag.current) flag.current.rotation.z = -1.2 * (0.5 + 0.5 * Math.sin(TAU * 0.5 * t));
    const e = env.current;
    if (e) {
      e.position.y = 1.4 + 0.1 * Math.sin(1.2 * t);
      e.rotation.y = 0.4 * Math.sin(0.5 * t);
    }
  });
  return (
    <>
      <Cyl a={[0.03, 0.03, 0.7]} p={[0.75, 0.35, 0.1]} c={k.base} />
      <B a={[0.18, 0.16, 0.3]} r={0.07} p={[0.75, 0.76, 0.1]} c={k.a} />
      <B a={[0.02, 0.12, 0.06]} r={0.008} p={[0.85, 0.82, 0.18]} c={k.c} ref={flag} />
      <B a={[0.24, 0.16, 0.02]} r={0.01} p={[-0.6, 1.4, 0.3]} c={k.soft} ref={env} />
    </>
  );
}

export default function Sets({ stage, palette, still, racketRef }: { stage: RefObject<number>; palette: Palette; still?: boolean; racketRef: RefObject<Object3D | null> }) {
  const k = palette.prop;
  const st = !!still;
  const S = (frame: number, stages: number[], children: ReactNode) => (
    <Station frame={frame} stages={stages} stage={stage} still={st}>
      {children}
    </Station>
  );
  return (
    <>
      {S(0, [0, 1, 9], <Home pal={palette} />)}
      {S(2, [2, 3, 4, 5], <Desk pal={palette} />)}
      {S(0, [0], <S0 k={k} />)}
      {S(1, [1], <S1 k={k} />)}
      {S(2, [2], <S2 pal={palette} />)}
      {S(3, [3], <S3 k={k} />)}
      {S(4, [4], <S4 k={k} />)}
      {S(5, [5], <S5 k={k} />)}
      {S(6, [6], <S6 k={k} racketRef={racketRef} />)}
      {S(7, [7], <S7 k={k} />)}
      {S(8, [8], <S8 pal={palette} stage={stage} />)}
      {S(9, [9], <S9 k={k} />)}
    </>
  );
}
