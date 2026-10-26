export type PoseName = 'wave' | 'mug' | 'walk' | 'type' | 'call' | 'present' | 'edit' | 'badminton' | 'swim' | 'water';
// Outfits the avatar changes into per stage (Avatar.tsx owns the looks)
export type Outfit = 'linen' | 'sweater' | 'tee' | 'jacket' | 'hoodie' | 'sport' | 'swim' | 'garden';
// mx/mr: phone-only x offset (fraction of width) and radius multiplier (default 0 / 1.8)
export type CamKey = { az: number; el: number; r: number; x: number; y: number; my: number; ty: number; mx?: number; mr?: number }; // az relative to stage ry
export type Stage = { id: string; pos: [x: number, z: number]; ry: number; pose: PoseName; outfit: Outfit; cam: CamKey };

const H = Math.PI / 2;

// One stage per [data-scene] element, in DOM order: hero, about, 4 jobs, 3 hobbies, contact
export const STAGES: Stage[] = [
  { id: 'hero', pos: [0, 0], ry: 0, pose: 'wave', outfit: 'linen', cam: { az: 0, el: 0.1, r: 3.65, x: 0.28, y: 0, my: 0.24, ty: 0.70 } },
  { id: 'about', pos: [0, 0], ry: 0, pose: 'mug', outfit: 'linen', cam: { az: -0.45, el: 0.16, r: 3.13, x: -0.27, y: 0, my: 0.18, ty: 0.75 } },
  { id: 'trippl', pos: [2.2, -1.5], ry: H, pose: 'type', outfit: 'sweater', cam: { az: 0.6, el: 0.38, r: 4.6, x: 0.26, y: 0, my: 0.18, ty: 0.75 } },
  { id: 'superdash', pos: [2.2, -1.5], ry: H, pose: 'call', outfit: 'tee', cam: { az: -0.9, el: 0.14, r: 3.9, x: -0.26, y: 0, my: 0.18, ty: 0.62 } },
  { id: 'useready', pos: [2.2, -0.3], ry: 0, pose: 'present', outfit: 'jacket', cam: { az: 0.35, el: 0.18, r: 5.4, x: 0.2, y: 0, my: 0.18, ty: 0.75 } },
  { id: 'fleapo', pos: [2.2, -1.5], ry: H, pose: 'edit', outfit: 'hoodie', cam: { az: -2.4, el: 0.3, r: 3.9, x: -0.26, y: 0, my: 0.18, ty: 0.62 } },
  { id: 'badminton', pos: [-2.2, -1.2], ry: 0, pose: 'badminton', outfit: 'sport', cam: { az: -1.0, el: 0.3, r: 6.4, x: -0.32, y: 0, my: 0.18, ty: 0.84, mx: -0.12, mr: 2.5 } },
  { id: 'swimming', pos: [-2.6, 3.0], ry: -H, pose: 'swim', outfit: 'swim', cam: { az: -0.9, el: 0.75, r: 7.8, x: 0.2, y: 0, my: 0.18, ty: 0.09 } },
  { id: 'gardening', pos: [1.0, 3.2], ry: -1.5, pose: 'water', outfit: 'garden', cam: { az: -0.5, el: 0.42, r: 4.0, x: -0.26, y: 0, my: 0.18, ty: 0.6 } },
  { id: 'contact', pos: [0, 0], ry: 0, pose: 'wave', outfit: 'linen', cam: { az: 0, el: 0.1, r: 6.96, x: 0, y: -0.34, my: -0.36, ty: 0.70 } },
];
