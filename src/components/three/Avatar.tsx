'use client';
import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { DoubleSide, MathUtils, MeshToonMaterial, Quaternion, SphereGeometry, Vector3, type BufferGeometry, type Group, type Object3D } from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { toonGradient } from './toon';
import type { Palette } from '@/lib/themes';
import type { Outfit, PoseName } from '@/lib/stages';

const PI = Math.PI;
const TAU = PI * 2;

// Racket head is at the contact point (top of the overhead swing, in front) when 2π·HZ·t ≡ HIT_PHASE
export const BADMINTON_HZ = 0.8;
export const BADMINTON_HIT_PHASE = PI / 6;
const HIT = BADMINTON_HIT_PHASE;

const JOINTS = ['hips', 'spine', 'neck', 'head', 'lShoulder', 'rShoulder', 'lUpperArm', 'rUpperArm', 'lForeArm', 'rForeArm', 'lHand', 'rHand', 'lThigh', 'rThigh', 'lShin', 'rShin', 'lFoot', 'rFoot'] as const;
type Joint = (typeof JOINTS)[number];
type V3 = [number, number, number];
type Kind = 'sin' | 'abs' | 'spin';
type Cycle = [ch: string, amp: number, hz: number, phase: number, kind?: Kind];
type PoseDef = { root?: { y?: number; z?: number; rx?: number }; rot: Partial<Record<Joint, V3>>; cycles: Cycle[] };

// Channels: xyz rotation per joint, then root position y/z and root rotation x
const AX = ['x', 'y', 'z'];
const CH = [...JOINTS.flatMap((j) => AX.map((a) => `${j}.${a}`)), 'root.y', 'root.z', 'root.rx'];
const ci = (c: string) => {
  const i = CH.indexOf(c);
  if (i < 0) throw new Error(`Unknown channel ${c}`);
  return i;
};
const RY = ci('root.y');
const RZ = ci('root.z');
const RX = ci('root.rx');

const BREATH: Cycle = ['spine.x', 0.015, 0.25, 0];
const REST: PoseDef['rot'] = { lUpperArm: [0.05, 0, 0.06], rUpperArm: [0.05, 0, -0.06], lForeArm: [-0.15, 0, 0], rForeArm: [-0.15, 0, 0] };
const SIT_ROOT = { y: -0.24 };
const SIT: PoseDef['rot'] = { lThigh: [-1.57, 0, 0.06], rThigh: [-1.57, 0, -0.06], lShin: [1.57, 0, 0], rShin: [1.57, 0, 0] };

const DEFS: Record<PoseName, PoseDef> = {
  wave: {
    rot: { ...REST, rUpperArm: [0, 0, -1.75], rForeArm: [0, 0, -1.25], head: [-0.05, 0, 0.06], spine: [0, 0, 0.04] },
    cycles: [['rForeArm.z', 0.35, 1.6, 0], ['rHand.z', 0.2, 1.6, 0.6], ['head.y', 0.08, 0.3, 0], BREATH],
  },
  mug: {
    rot: { ...REST, rUpperArm: [-0.35, 0, -0.12], rForeArm: [-1.75, 0, 0], lUpperArm: [0.1, 0, 0.18], lForeArm: [-0.4, 0, 0], head: [0.06, 0.15, 0], hips: [0, 0, 0.04], spine: [0, 0, -0.04] },
    cycles: [['head.y', 0.12, 0.18, 0], ['rForeArm.x', 0.06, 0.25, 0], BREATH],
  },
  walk: {
    rot: { ...REST, lForeArm: [-0.3, 0, 0], rForeArm: [-0.3, 0, 0], lShin: [0.3, 0, 0], rShin: [0.3, 0, 0], head: [0.04, 0, 0] },
    cycles: [
      ['lThigh.x', 0.5, 1.8, 0], ['rThigh.x', 0.5, 1.8, PI], ['lShin.x', 0.3, 1.8, -PI / 2], ['rShin.x', 0.3, 1.8, PI / 2],
      ['lUpperArm.x', 0.45, 1.8, PI], ['rUpperArm.x', 0.45, 1.8, 0], ['hips.y', 0.08, 1.8, 0], ['spine.y', 0.08, 1.8, PI], ['root.y', 0.025, 3.6, 0, 'abs'],
    ],
  },
  type: {
    root: SIT_ROOT,
    rot: { ...SIT, spine: [0.15, 0, 0], head: [0.25, 0, 0], lUpperArm: [-0.55, 0, 0.12], rUpperArm: [-0.55, 0, -0.12], lForeArm: [-1.0, 0, -0.35], rForeArm: [-1.0, 0, 0.35], lHand: [0.5, 0, 0], rHand: [0.5, 0, 0] },
    cycles: [['lHand.x', 0.15, 5, 0], ['rHand.x', 0.15, 5, 1.7], ['lForeArm.x', 0.04, 2.5, 0], ['rForeArm.x', 0.04, 2.5, 1.3], ['head.y', 0.1, 0.2, 0], BREATH],
  },
  call: {
    root: SIT_ROOT,
    rot: { ...SIT, spine: [-0.1, 0, 0], head: [-0.05, 0, 0.06], lUpperArm: [-0.7, 0, 0.35], lForeArm: [-1.5, 0, -0.2], rUpperArm: [-0.45, 0, -0.15], rForeArm: [-0.9, 0, 0.3], rHand: [0.4, 0, 0] },
    cycles: [['lForeArm.x', 0.3, 0.9, 0], ['lUpperArm.z', 0.12, 0.45, 0], ['head.x', 0.05, 1.8, 0], ['head.y', 0.15, 0.3, 0], BREATH],
  },
  present: {
    rot: { ...REST, lUpperArm: [-0.4, 0, 1.75], lForeArm: [-0.2, 0, 0.1], rUpperArm: [-0.2, 0, -0.1], rForeArm: [-1.2, 0, 0.3], spine: [0, 0.25, 0], head: [0, 0.2, 0], hips: [0, 0, 0.03] },
    cycles: [['lUpperArm.z', 0.08, 0.5, 0], ['lForeArm.x', 0.12, 0.5, 0.4], ['head.y', 0.3, 0.25, 0], ['rForeArm.x', 0.15, 0.9, 0], BREATH],
  },
  edit: {
    root: SIT_ROOT,
    rot: { ...SIT, spine: [0.1, 0, 0], head: [0.12, 0.1, 0], lUpperArm: [-0.55, 0, 0.12], lForeArm: [-1.0, 0, -0.35], lHand: [0.5, 0, 0], rUpperArm: [-0.5, 0, -0.3], rForeArm: [-1.05, 0, 0.1], rHand: [0.6, 0, 0] },
    cycles: [['rUpperArm.z', 0.06, 0.7, 0], ['rHand.x', 0.12, 3, 0], ['lHand.x', 0.1, 4, 0], ['head.y', 0.18, 0.15, 0], BREATH],
  },
  // At HIT: forearm fully extended, upper arm rising through ~0.4 rad in front of vertical, torso square on
  badminton: {
    rot: { lThigh: [-0.25, 0, 0.12], rThigh: [0.15, 0, -0.12], lShin: [0.3, 0, 0], rShin: [0.3, 0, 0], spine: [-0.08, -0.35, 0], lUpperArm: [-2.3, 0, 0.3], lForeArm: [-0.2, 0, 0], rUpperArm: [-2.6, 0, -0.3], rForeArm: [-1.0, 0, 0] },
    cycles: [
      ['rUpperArm.x', 0.9, BADMINTON_HZ, -0.17 - HIT], ['rForeArm.x', 0.9, BADMINTON_HZ, PI / 2 - HIT], ['spine.y', 0.35, BADMINTON_HZ, PI / 2 - HIT],
      ['lUpperArm.x', 0.3, BADMINTON_HZ, PI / 2 - HIT + PI], ['root.y', 0.05, BADMINTON_HZ, PI / 2 - HIT / 2, 'abs'],
    ],
  },
  // Prone, face down, head toward local +z, centred on the anchor
  swim: {
    root: { y: 0.17, z: -0.8, rx: 1.5708 },
    rot: { lUpperArm: [0, 0, 0.15], rUpperArm: [0, 0, -0.15], lForeArm: [-0.2, 0, 0], rForeArm: [-0.2, 0, 0], head: [-0.5, 0, 0], lShin: [0.15, 0, 0], rShin: [0.15, 0, 0] },
    cycles: [
      ['lUpperArm.x', 0, 0.6, 0, 'spin'], ['rUpperArm.x', 0, 0.6, PI, 'spin'], ['lThigh.x', 0.22, 2.4, 0], ['rThigh.x', 0.22, 2.4, PI],
      ['lShin.x', 0.15, 2.4, 0.5], ['rShin.x', 0.15, 2.4, 0.5 + PI], ['spine.y', 0.25, 0.6, 0], ['head.y', 0.45, 0.3, 0], ['root.y', 0.02, 1.2, 0],
    ],
  },
  water: {
    rot: { ...REST, rUpperArm: [-0.9, 0, -0.15], rForeArm: [-0.2, 0, 0], lUpperArm: [0.1, 0, 0.15], lForeArm: [-1.3, 0, -0.3], spine: [0.12, 0, 0], head: [0.3, 0, 0] },
    cycles: [['spine.y', 0.2, 0.25, 0], ['head.y', 0.15, 0.25, 0.3], ['rForeArm.x', 0.06, 0.5, 0], BREATH],
  },
};

const NAMES = Object.keys(DEFS) as PoseName[];
const POSES = NAMES.map((n) => {
  const d = DEFS[n];
  const s = new Float32Array(CH.length);
  for (const [j, v] of Object.entries(d.rot)) v.forEach((x, a) => (s[ci(`${j}.${AX[a]}`)] = x));
  s[RY] = d.root?.y ?? 0;
  s[RZ] = d.root?.z ?? 0;
  s[RX] = d.root?.rx ?? 0;
  return { s, c: d.cycles.map(([ch, A, hz, ph, k = 'sin']) => ({ i: ci(ch), A, hz, ph, k })) };
});

const wrapPi = (a: number) => a - TAU * Math.floor((a + PI) / TAU);

const HELD = [['mug', 'mug'], ['headset', 'call'], ['racket', 'badminton'], ['can', 'water']] as const;
type Held = (typeof HELD)[number][0];

const BOOM_A = new Vector3(0.25, 0, 0);
const BOOM_B = new Vector3(0.12, -0.12, 0.2);
const BOOM_POS = BOOM_A.clone().add(BOOM_B).multiplyScalar(0.5);
const BOOM_Q = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), BOOM_B.clone().sub(BOOM_A).normalize());

// Outfits: fixed colours (not themed). top = shirt/sweater/jacket, alt = second garment (collar, inner shirt)
type Bit = 'buttons' | 'watch' | 'drawstring' | 'lanyard' | 'apron' | 'hat' | 'band' | 'goggles' | 'pocket';
type Look = {
  top: string;
  alt?: string;
  pants: string;
  shoes?: string;
  sole?: string;
  acc?: string;
  acc2?: string;
  sleeve: 'none' | 'short' | 'rolled' | 'long';
  neck: 'crew' | 'shirt' | 'sweater' | 'hood' | 'jacket' | 'none';
  legs: 'long' | 'rolled' | 'shorts' | 'trunks';
  feet: 'shoes' | 'boots' | 'bare';
  hem?: boolean;
  bits: Bit[];
};
const LOOKS: Record<Outfit, Look> = {
  linen: { top: '#3A2A22', pants: '#E6E0D3', shoes: '#F2EEE7', sole: '#CFC5B8', acc: '#F4F1EA', acc2: '#C9CDD2', sleeve: 'rolled', neck: 'shirt', legs: 'long', feet: 'shoes', hem: true, bits: ['buttons', 'watch', 'drawstring'] },
  sweater: { top: '#7C8B6A', alt: '#F2EFE8', pants: '#C8B79A', shoes: '#6B4A35', sole: '#3A2C22', sleeve: 'long', neck: 'sweater', legs: 'long', feet: 'shoes', bits: [] },
  tee: { top: '#232325', pants: '#2F3A4F', shoes: '#F2EEE7', sole: '#CFC5B8', sleeve: 'short', neck: 'crew', legs: 'long', feet: 'shoes', bits: [] },
  jacket: { top: '#46566B', alt: '#ECE9E2', pants: '#3B3B40', shoes: '#2B2523', sole: '#1C1816', acc: '#B5532F', acc2: '#F6F3EC', sleeve: 'long', neck: 'jacket', legs: 'long', feet: 'shoes', bits: ['lanyard'] },
  hoodie: { top: '#5C6B7A', alt: '#4E5C6A', pants: '#3A3D44', shoes: '#F2EEE7', sole: '#CFC5B8', acc: '#F2EEE7', sleeve: 'long', neck: 'hood', legs: 'long', feet: 'shoes', bits: ['drawstring', 'pocket'] },
  sport: { top: '#3C82C4', pants: '#22262B', shoes: '#F4F4F2', sole: '#3C82C4', acc: '#F4F4F2', sleeve: 'short', neck: 'crew', legs: 'shorts', feet: 'shoes', bits: ['band'] },
  swim: { top: '#D9774F', pants: '#D9774F', acc: '#2F6B8F', acc2: '#26262A', sleeve: 'none', neck: 'none', legs: 'trunks', feet: 'bare', bits: ['goggles'] },
  garden: { top: '#7A8B5C', pants: '#5D6B7A', shoes: '#5A3F2E', sole: '#2E2420', acc: '#B08D63', acc2: '#D8C29A', sleeve: 'short', neck: 'crew', legs: 'rolled', feet: 'boots', bits: ['apron', 'hat'] },
};

const toon = (o = {}) => new MeshToonMaterial({ gradientMap: toonGradient, ...o });
const makeMats = () => ({
  skin: toon(),
  stubble: toon(),
  hair: toon(),
  beard: toon(),
  eyes: toon(),
  teeth: toon({ color: '#F4EFE8' }),
  mouth: toon(),
  top: toon(),
  alt: toon(),
  pants: toon(),
  shoes: toon(),
  sole: toon(),
  acc: toon(),
  acc2: toon(),
  a: toon(),
  b: toon(),
  c: toon(),
  ink: toon(),
  soft: toon({ transparent: true, opacity: 0.35, side: DoubleSide }),
});
type Mats = ReturnType<typeof makeMats>;
type RefFn = (n: Joint) => (g: Group | null) => void;

function Arm({ side, r, m, look, children }: { side: 'l' | 'r'; r: RefFn; m: Mats; look: Look; children?: ReactNode }) {
  const s = side === 'l' ? 1 : -1;
  const { sleeve } = look;
  // Pivot overlaps the torso edge (half-width 0.165); the cap keeps raised arms joined to the body
  return (
    <group ref={r(`${side}Shoulder`)} position={[0.195 * s, 0.33, 0]}>
      <mesh material={sleeve === 'none' ? m.skin : m.top}>
        <sphereGeometry args={[sleeve === 'short' ? 0.064 : sleeve === 'none' ? 0.052 : 0.06, 20, 14]} />
      </mesh>
      <group ref={r(`${side}UpperArm`)}>
        {sleeve === 'short' && (
          <mesh position={[0, -0.045, 0]} material={m.top}>
            <capsuleGeometry args={[0.056, 0.06, 6, 16]} />
          </mesh>
        )}
        <mesh position={[0, -0.11, 0]} material={sleeve === 'rolled' || sleeve === 'long' ? m.top : m.skin}>
          <capsuleGeometry args={[sleeve === 'rolled' || sleeve === 'long' ? 0.052 : 0.045, 0.13, 6, 16]} />
        </mesh>
        <group ref={r(`${side}ForeArm`)} position={[0, -0.22, 0]}>
          <mesh position={[0, -0.1, 0]} material={sleeve === 'long' ? m.top : m.skin}>
            <capsuleGeometry args={[sleeve === 'long' ? 0.046 : 0.04, 0.12, 6, 16]} />
          </mesh>
          {sleeve === 'rolled' && (
            <mesh position={[0, -0.035, 0]} material={m.top}>
              <capsuleGeometry args={[0.052, 0.03, 6, 16]} />
            </mesh>
          )}
          {side === 'l' && look.bits.includes('watch') && (
            <group position={[0, -0.165, 0]}>
              <mesh rotation={[PI / 2, 0, 0]} material={m.acc2}>
                <torusGeometry args={[0.042, 0.01, 6, 20]} />
              </mesh>
              <mesh position={[0.04, 0, 0]} rotation={[0, 0, PI / 2]} material={m.acc2}>
                <cylinderGeometry args={[0.022, 0.022, 0.012, 16]} />
              </mesh>
            </group>
          )}
          <group ref={r(`${side}Hand`)} position={[0, -0.2, 0]}>
            <mesh position={[0, -0.05, 0]} scale={[0.85, 1.1, 0.75]} material={m.skin}>
              <sphereGeometry args={[0.05, 24, 16]} />
            </mesh>
            <mesh position={[0, -0.03, 0.04]} material={m.skin}>
              <sphereGeometry args={[0.02, 24, 16]} />
            </mesh>
            {children}
          </group>
        </group>
      </group>
    </group>
  );
}

function Leg({ side, r, m, look }: { side: 'l' | 'r'; r: RefFn; m: Mats; look: Look }) {
  const s = side === 'l' ? 1 : -1;
  const { legs, feet } = look;
  const bareThigh = legs === 'trunks';
  return (
    <group ref={r(`${side}Thigh`)} position={[0.085 * s, -0.04, 0]}>
      {/* Mesh sits a touch behind the bone so a seated thigh rests on the 0.21 seat */}
      <mesh position={[0, -0.12, -0.012]} material={bareThigh ? m.skin : m.pants}>
        <capsuleGeometry args={[legs === 'shorts' ? 0.072 : 0.066, 0.11, 6, 16]} />
      </mesh>
      {bareThigh && (
        <mesh position={[0, -0.04, -0.012]} material={m.pants}>
          <capsuleGeometry args={[0.072, 0.04, 6, 16]} />
        </mesh>
      )}
      <group ref={r(`${side}Shin`)} position={[0, -0.24, 0]}>
        <mesh position={[0, -0.11, 0]} material={legs === 'long' || legs === 'rolled' ? m.pants : m.skin}>
          <capsuleGeometry args={[legs === 'long' || legs === 'rolled' ? 0.056 : 0.045, 0.11, 6, 16]} />
        </mesh>
        {legs === 'rolled' && (
          <mesh position={[0, -0.13, 0]} material={m.pants}>
            <capsuleGeometry args={[0.064, 0.03, 6, 16]} />
          </mesh>
        )}
        <group ref={r(`${side}Foot`)} position={[0, -0.22, 0]}>
          {feet === 'bare' ? (
            <RoundedBox args={[0.085, 0.05, 0.19]} radius={0.022} smoothness={4} position={[0, -0.045, 0.04]} material={m.skin} />
          ) : (
            <>
              {feet === 'boots' ? (
                <RoundedBox args={[0.115, 0.13, 0.21]} radius={0.035} smoothness={4} position={[0, -0.005, 0.035]} material={m.shoes} />
              ) : (
                <RoundedBox args={[0.11, 0.075, 0.21]} radius={0.03} smoothness={4} position={[0, -0.03, 0.04]} material={m.shoes} />
              )}
              <RoundedBox args={[0.115, 0.022, 0.215]} radius={0.01} smoothness={4} position={[0, -0.06, 0.04]} material={m.sole} />
            </>
          )}
        </group>
      </group>
    </group>
  );
}

// Upper body clothing on the spine joint
function Top({ m, look }: { m: Mats; look: Look }) {
  const { neck, bits } = look;
  const bare = neck === 'none';
  const flaps = (mat: MeshToonMaterial, z: number) =>
    [1, -1].map((s) => (
      <RoundedBox key={s} args={[0.075, 0.045, 0.014]} radius={0.006} smoothness={4} position={[0.04 * s, 0.405, z]} rotation={[-0.5, 0.35 * s, -0.55 * s]} material={mat} />
    ));
  return (
    <>
      <RoundedBox
        args={look.hem ? [0.33, 0.5, 0.2] : [0.33, 0.44, 0.2]}
        radius={0.09}
        smoothness={4}
        position={[0, look.hem ? 0.17 : 0.2, 0]}
        material={bare ? m.skin : m.top}
      />
      {(neck === 'crew' || neck === 'sweater') && (
        <mesh position={[0, 0.405, 0]} rotation={[PI / 2, 0, 0]} material={m.top}>
          <torusGeometry args={[0.052, 0.016, 8, 24]} />
        </mesh>
      )}
      {neck === 'sweater' && flaps(m.alt, 0.07)}
      {neck === 'shirt' && flaps(m.top, 0.075)}
      {neck === 'jacket' && (
        <>
          <RoundedBox args={[0.12, 0.42, 0.02]} radius={0.008} smoothness={4} position={[0, 0.2, 0.093]} material={m.alt} />
          {flaps(m.alt, 0.075)}
          {[1, -1].map((s) => (
            <RoundedBox key={s} args={[0.05, 0.2, 0.02]} radius={0.008} smoothness={4} position={[0.075 * s, 0.31, 0.1]} rotation={[0, 0, 0.25 * s]} material={m.top} />
          ))}
        </>
      )}
      {neck === 'hood' && (
        <mesh position={[0, 0.4, -0.06]} rotation={[PI / 2 - 0.5, 0, 0]} scale={[1, 1, 1.3]} material={m.top}>
          <torusGeometry args={[0.1, 0.045, 8, 24]} />
        </mesh>
      )}
      {bits.includes('buttons') &&
        [0.3, 0.19, 0.08].map((y) => (
          <mesh key={y} position={[0, y, 0.101]} material={m.acc}>
            <sphereGeometry args={[0.009, 12, 8]} />
          </mesh>
        ))}
      {neck === 'hood' &&
        [1, -1].map((s) => (
          <mesh key={s} position={[0.03 * s, 0.32, 0.103]} material={m.acc}>
            <capsuleGeometry args={[0.005, 0.08, 4, 8]} />
          </mesh>
        ))}
      {bits.includes('pocket') && <RoundedBox args={[0.2, 0.1, 0.02]} radius={0.008} smoothness={4} position={[0, 0.07, 0.097]} material={m.alt} />}
      {bits.includes('lanyard') && (
        <>
          <mesh position={[0, 0.37, 0.104]} rotation={[0, 0, PI]} scale={[0.8, 1.3, 1]} material={m.acc}>
            <torusGeometry args={[0.06, 0.005, 6, 20, PI]} />
          </mesh>
          <RoundedBox args={[0.06, 0.08, 0.008]} radius={0.004} smoothness={4} position={[0, 0.24, 0.108]} material={m.acc2} />
        </>
      )}
      {bits.includes('apron') && <RoundedBox args={[0.27, 0.5, 0.016]} radius={0.006} smoothness={4} position={[0, 0.1, 0.105]} material={m.acc} />}
    </>
  );
}

// Head: unit sphere reshaped into an oval with a defined jaw and a blunt, slightly forward chin (metres, head centre origin)
const HX = 0.1;
const HY = 0.14;
const HZ = 0.112;
const shapeHead = (v: Vector3) => {
  const t = v.y < 0 ? v.y * v.y : 0;
  const y = v.y < 0 ? -(Math.abs(v.y) ** 0.75) : v.y;
  return v.set(v.x * HX * (1 - 0.22 * t), y * HY, v.z * HZ * (1 - (v.z > 0 ? 0.06 : 0.3) * t) + 0.014 * t);
};
function headGeometry(src: BufferGeometry, grow: number) {
  const p = src.attributes.position;
  const v = new Vector3();
  for (let i = 0; i < p.count; i++) {
    shapeHead(v.fromBufferAttribute(p, i)).multiplyScalar(grow);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  src.deleteAttribute('normal');
  src.deleteAttribute('uv');
  const g = mergeVertices(src);
  g.computeVertexNormals();
  return g;
}
// Stubble: front wedge of the sphere below a plane tilted 0.49 rad (sideburns → jaw → under the lip), just off the skin
const STUBBLE_GEO = headGeometry(new SphereGeometry(1, 64, 24, PI / 2 - 1.6, 3.2, 1.75, PI - 1.75).rotateX(0.49), 1.006);
const HEAD_GEO = headGeometry(new SphereGeometry(1, 64, 48), 1);
// Short sides: cap tilted back so the hairline sits high at the temples and low at the nape
const HAIR_GEO = headGeometry(new SphereGeometry(1, 48, 24, 0, TAU, 0, 1.25).rotateX(-0.45), 1.05);

// Locks: flattened ellipsoids [x, y, z, sx, sy, sz, rx, ry, rz] whose front ends make the hairline,
// main swoop lifting up toward his left with a pointed tip, notch between the front two
const LOCKS: [number, number, number, number, number, number, number, number, number][] = [
  [0.022, 0.12, 0.05, 0.06, 0.024, 0.085, -0.35, 0.5, -0.2],
  [-0.035, 0.113, 0.055, 0.045, 0.021, 0.07, -0.25, 0.35, 0],
  [0, 0.136, -0.01, 0.085, 0.022, 0.095, -0.1, 0, 0],
];
// Accessories were authored around a 0.235 ball head; this maps them onto the new head
const ACC_SCALE: [number, number, number] = [0.404, 0.583, 0.468];

function Face({ m, look }: { m: Mats; look: Look }) {
  const hat = look.bits.includes('hat');
  return (
    <>
      <mesh geometry={HEAD_GEO} material={m.skin} />
      <mesh geometry={STUBBLE_GEO} material={m.stubble} />
      <mesh geometry={HAIR_GEO} material={m.hair} />
      {!hat &&
        LOCKS.map(([x, y, z, sx, sy, sz, rx, ry, rz], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[rx, ry, rz]} scale={[sx, sy, sz]} material={m.hair}>
            <sphereGeometry args={[1, 24, 16]} />
          </mesh>
        ))}
      {!hat && (
        <mesh position={[0.055, 0.138, 0.1]} rotation={[1.09, 0, -0.52]} scale={[1, 1, 0.5]} material={m.hair}>
          <coneGeometry args={[0.024, 0.07, 16]} />
        </mesh>
      )}
      {[1, -1].map((s) => (
        <group key={s}>
          <RoundedBox args={[0.01, 0.045, 0.022]} radius={0.004} smoothness={2} position={[0.09 * s, 0.022, 0.012]} material={m.hair} />
          <mesh position={[0.094 * s, -0.004, -0.008]} scale={[0.011, 0.028, 0.02]} material={m.skin}>
            <sphereGeometry args={[1, 16, 12]} />
          </mesh>
          {/* Eye: dark pupil under a heavy skin lid with a lash line */}
          <mesh position={[0.036 * s, 0.002, 0.101]} scale={[0.0105, 0.013, 0.005]} material={m.eyes}>
            <sphereGeometry args={[1, 16, 12]} />
          </mesh>
          <mesh position={[0.036 * s, 0.0105, 0.1035]} scale={[0.016, 0.0105, 0.0065]} material={m.skin}>
            <sphereGeometry args={[1, 16, 12]} />
          </mesh>
          <mesh position={[0.036 * s, 0.001, 0.109]} rotation={[0, 0, PI / 2 + 0.06 * s]} material={m.eyes}>
            <capsuleGeometry args={[0.0022, 0.016, 4, 8]} />
          </mesh>
          {/* Brow: chunky, tapered, outer end dipping */}
          <mesh position={[0.037 * s, 0.031, 0.103]} rotation={[-0.25, 0, (PI / 2 + 0.08) * s]} scale={[1, 1, 0.6]} material={m.hair}>
            <cylinderGeometry args={[0.0095, 0.0045, 0.048, 12]} />
          </mesh>
        </group>
      ))}
      {/* Nose: soft wedge with a single dark stroke */}
      <mesh position={[0, -0.022, 0.106]} rotation={[-0.25, 0, 0]} scale={[0.011, 0.026, 0.016]} material={m.skin}>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>
      <mesh position={[-0.01, -0.024, 0.115]} rotation={[0, 0, -0.15]} material={m.eyes}>
        <capsuleGeometry args={[0.0017, 0.022, 4, 8]} />
      </mesh>
      <mesh position={[-0.004, -0.039, 0.119]} rotation={[0, 0, PI / 2 - 0.2]} material={m.eyes}>
        <capsuleGeometry args={[0.0017, 0.008, 4, 8]} />
      </mesh>
      {/* Grin: dark rim, white teeth, thin mustache on top */}
      <group position={[0, -0.07, 0.1]} rotation={[-0.3, 0, 0]}>
        <mesh scale={[0.026, 0.015, 0.006]} material={m.mouth}>
          <sphereGeometry args={[1, 20, 10, 0, TAU, PI / 2, PI / 2]} />
        </mesh>
        <mesh position={[0, 0.001, 0.002]} scale={[0.0225, 0.011, 0.006]} material={m.teeth}>
          <sphereGeometry args={[1, 20, 10, 0, TAU, PI / 2, PI / 2]} />
        </mesh>
        <mesh position={[0, 0.005, 0.004]} rotation={[0, 0, PI / 2]} material={m.beard}>
          <capsuleGeometry args={[0.0058, 0.032, 4, 8]} />
        </mesh>
      </group>
      {look.bits.includes('goggles') && (
        <group position={[0, 0.05, 0.004]} rotation={[-0.15, 0, 0]}>
          <mesh rotation={[PI / 2, 0, 0]} scale={[1, 1.15, 1]} material={m.acc2}>
            <torusGeometry args={[0.1, 0.005, 6, 32]} />
          </mesh>
          {[1, -1].map((s) => (
            <mesh key={s} position={[0.033 * s, 0, 0.1]} rotation={[PI / 2, 0, 0]} material={m.acc}>
              <sphereGeometry args={[0.019, 16, 8, 0, TAU, 0, PI / 2]} />
            </mesh>
          ))}
        </group>
      )}
      <group scale={ACC_SCALE}>
      {hat && (
        <group position={[0, 0.2, 0]} rotation={[-0.08, 0, 0]}>
          <mesh material={m.acc2}>
            <cylinderGeometry args={[0.31, 0.31, 0.014, 32]} />
          </mesh>
          <mesh position={[0, 0.07, 0]} material={m.acc2}>
            <cylinderGeometry args={[0.19, 0.22, 0.14, 24]} />
          </mesh>
          <mesh position={[0, 0.02, 0]} material={m.acc}>
            <cylinderGeometry args={[0.222, 0.222, 0.03, 24]} />
          </mesh>
        </group>
      )}
      {look.bits.includes('band') && (
        <mesh position={[0, 0.15, 0]} rotation={[PI / 2 + 0.2, 0, 0]} material={m.acc}>
          <torusGeometry args={[0.2, 0.02, 8, 32]} />
        </mesh>
      )}
      </group>
    </>
  );
}

const POP = 0.35;

export default function Avatar({ pose, outfit, palette, still, racketRef, spoutRef }: { pose: PoseName; outfit: Outfit; palette: Palette; still?: boolean; racketRef?: RefObject<Object3D | null>; spoutRef?: RefObject<Object3D | null> }) {
  const root = useRef<Group>(null);
  const joints = useRef<Group[]>([]);
  const held = useRef<Partial<Record<Held, Group>>>({});
  const r: RefFn = (n) => (g) => {
    if (g) joints.current[JOINTS.indexOf(n)] = g;
  };
  const h = (n: Held) => (g: Group | null) => {
    if (g) held.current[n] = g;
  };
  const [m] = useState(makeMats);
  const st = useRef<{ base: Float32Array; out: Float32Array; w: Float32Array } | null>(null);
  const pop = useRef({ outfit, t: POP });
  const look = LOOKS[outfit];

  useLayoutEffect(() => {
    const a = palette.avatar;
    const p = palette.prop;
    m.skin.color.set(a.skin);
    m.stubble.color.set(a.skin).multiplyScalar(0.55);
    m.hair.color.set(a.hair);
    m.beard.color.set(a.beard);
    m.eyes.color.set(a.eyes);
    m.mouth.color.set(a.mouth);
    m.a.color.set(p.a);
    m.b.color.set(p.b);
    m.c.color.set(p.c);
    m.ink.color.set(p.ink);
    m.soft.color.set(p.soft);
  }, [palette, m]);
  useLayoutEffect(() => {
    m.top.color.set(look.top);
    m.alt.color.set(look.alt ?? look.top);
    m.pants.color.set(look.pants);
    m.shoes.color.set(look.shoes ?? look.pants);
    m.sole.color.set(look.sole ?? look.pants);
    m.acc.color.set(look.acc ?? look.top);
    m.acc2.color.set(look.acc2 ?? look.top);
  }, [look, m]);
  useLayoutEffect(() => () => Object.values(m).forEach((x) => x.dispose()), [m]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.1);
    const active = NAMES.indexOf(pose);
    // First frame starts fully in the mount pose, no blend in from zero
    st.current ??= { base: Float32Array.from(POSES[active].s), out: new Float32Array(CH.length), w: Float32Array.from(NAMES, (_, i) => (i === active ? 1 : 0)) };
    const { base, out, w } = st.current;
    const target = POSES[active].s;
    for (let i = 0; i < base.length; i++) out[i] = base[i] = MathUtils.damp(base[i], target[i], 6, dt);
    for (let p = 0; p < NAMES.length; p++) {
      w[p] = MathUtils.damp(w[p], p === active ? 1 : 0, 6, dt);
      if (still || w[p] <= 0.001) continue;
      for (const c of POSES[p].c) {
        const v = c.k === 'spin' ? wrapPi(TAU * c.hz * t + c.ph) : c.k === 'abs' ? c.A * Math.abs(Math.sin(PI * c.hz * t + c.ph)) : c.A * Math.sin(TAU * c.hz * t + c.ph);
        out[c.i] += w[p] * v;
      }
    }
    const js = joints.current;
    for (let j = 0; j < js.length; j++) js[j].rotation.set(out[j * 3], out[j * 3 + 1], out[j * 3 + 2]);
    const g = root.current!;
    g.position.set(0, out[RY], out[RZ]);
    g.rotation.x = out[RX];
    for (const [n, p] of HELD) held.current[n]!.visible = w[NAMES.indexOf(p)] > 0.5;

    // Outfit swap squash-pop: 0.92 → 1.04 → 1
    const pp = pop.current;
    if (pp.outfit !== outfit) {
      pp.outfit = outfit;
      pp.t = still ? POP : 0;
    }
    pp.t = Math.min(pp.t + dt, POP);
    const k = pp.t / POP;
    g.scale.setScalar(k < 0.4 ? MathUtils.lerp(0.92, 1.04, MathUtils.smoothstep(k, 0, 0.4)) : MathUtils.lerp(1.04, 1, MathUtils.smoothstep(k, 0.4, 1)));
  });

  return (
    <group ref={root}>
      <group ref={r('hips')} position={[0, 0.57, 0]}>
        <RoundedBox args={[0.3, 0.18, 0.2]} radius={0.08} smoothness={4} position={[0, -0.01, 0]} material={m.pants} />
        {look.bits.includes('drawstring') && look.hem &&
          [1, -1].map((s) => (
            <mesh key={s} position={[0.02 * s, -0.1, 0.098]} material={m.acc}>
              <capsuleGeometry args={[0.005, 0.06, 4, 8]} />
            </mesh>
          ))}
        <group ref={r('spine')} position={[0, 0.06, 0]}>
          <Top m={m} look={look} />
          <group ref={r('neck')} position={[0, 0.4, 0]}>
            <mesh position={[0, 0.04, 0]} material={m.skin}>
              <cylinderGeometry args={[0.044, 0.05, 0.14, 16]} />
            </mesh>
            <group ref={r('head')} position={[0, 0.09, 0]}>
              {/* Head ≈ 1/5 of height */}
              <group position={[0, 0.115, 0.005]}>
                <Face m={m} look={look} />
                <group ref={h('headset')} scale={ACC_SCALE}>
                  {/* Stretched to clear the hair */}
                  <mesh position={[0, 0.02, 0]} scale={[1, 1.15, 1]} material={m.ink}>
                    <torusGeometry args={[0.25, 0.018, 8, 24, PI]} />
                  </mesh>
                  {[1, -1].map((s) => (
                    <mesh key={s} position={[0.25 * s, 0, 0]} rotation={[0, 0, PI / 2]} material={m.c}>
                      <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
                    </mesh>
                  ))}
                  <mesh position={BOOM_POS} quaternion={BOOM_Q} material={m.ink}>
                    <capsuleGeometry args={[0.01, 0.22, 6, 16]} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
          <Arm side="l" r={r} m={m} look={look} />
          <Arm side="r" r={r} m={m} look={look}>
            <group ref={h('mug')} position={[0, -0.06, 0.05]} rotation={[2.1, 0, 0]}>
              <mesh material={m.a}>
                <cylinderGeometry args={[0.05, 0.045, 0.11, 16]} />
              </mesh>
              <mesh position={[0.055, 0, 0]} material={m.a}>
                <torusGeometry args={[0.03, 0.01, 6, 12]} />
              </mesh>
            </group>
            <group ref={h('racket')}>
              <mesh position={[0, -0.12, 0]} material={m.b}>
                <cylinderGeometry args={[0.015, 0.015, 0.22, 8]} />
              </mesh>
              <mesh position={[0, -0.34, 0]} material={m.a}>
                <torusGeometry args={[0.11, 0.012, 8, 24]} />
              </mesh>
              <mesh position={[0, -0.34, 0]} material={m.soft}>
                <circleGeometry args={[0.105, 32]} />
              </mesh>
              <object3D ref={racketRef} position={[0, -0.34, 0]} />
            </group>
            <group ref={h('can')} position={[0, -0.06, 0]} rotation={[1.6, 0, 0]}>
              <mesh position={[0, -0.11, 0]} material={m.b}>
                <cylinderGeometry args={[0.085, 0.095, 0.16, 16]} />
              </mesh>
              <mesh position={[0, -0.07, 0.14]} rotation={[0.9, 0, 0]} material={m.b}>
                <cylinderGeometry args={[0.012, 0.022, 0.24, 8]} />
              </mesh>
              <mesh position={[0, -0.03, 0]} rotation={[0, PI / 2, 0]} material={m.ink}>
                <torusGeometry args={[0.07, 0.012, 6, 12, PI]} />
              </mesh>
              {/* spout tip: centre (0,-0.07,0.14) + half length 0.12 rotated 0.9 about x */}
              <object3D ref={spoutRef} position={[0, 0.005, 0.234]} />
            </group>
          </Arm>
        </group>
        <Leg side="l" r={r} m={m} look={look} />
        <Leg side="r" r={r} m={m} look={look} />
      </group>
    </group>
  );
}
