import { useSyncExternalStore } from 'react';

export type ThemeName = 'sage' | 'olive' | 'apricot' | 'cream';
export type AvatarColors = { skin: string; skinGlow: string; hair: string; beard: string; eyes: string; mouth: string; tee: string; trousers: string; shoes: string; sole: string };
export type PropColors = { base: string; soft: string; ink: string; a: string; b: string; c: string; leaf: string; water: string; screen: string };
export type SceneColors = { bg: string; floor: string; plinth: string; sky: string; ground: string; hemi: number; key: number; keyColor: string; fill: number; fillColor: string; shadow: string; shadowOpacity: number };
export type Palette = { name: ThemeName; label: string; swatch: [bg: string, accent: string]; scene: SceneColors; avatar: AvatarColors; prop: PropColors };

// His real colours, same in every theme
const TRUE = { skin: '#D19C78', skinGlow: '#7A3418', hair: '#1D1A18', beard: '#3E2E26', eyes: '#241A16', mouth: '#5E2C26', tee: '#2B2B2E' };

export const THEMES: Record<ThemeName, Palette> = {
  sage: {
    name: 'sage',
    label: 'Sage',
    swatch: ['#E4EAE5', '#2F6B52'],
    scene: { bg: '#E4EAE5', floor: '#D8E0DA', plinth: '#C9D5CD', sky: '#F6FBF8', ground: '#BFCCC4', hemi: 1.1, key: 1.5, keyColor: '#FFF7EC', fill: 0.5, fillColor: '#DDE9FF', shadow: '#31453A', shadowOpacity: 0.36 },
    avatar: { ...TRUE, trousers: '#3F4A5C', shoes: '#F4F4F0', sole: '#C9CFCA' },
    prop: { base: '#BFA17E', soft: '#F5F7F4', ink: '#2F3532', a: '#E39673', b: '#6F8FB5', c: '#E9CC7A', leaf: '#5F9762', water: '#9CCAD6', screen: '#E4EEF2' },
  },
  olive: {
    name: 'olive',
    label: 'Olive',
    swatch: ['#2F3322', '#D9B46A'],
    scene: { bg: '#2F3322', floor: '#2A2E1E', plinth: '#3D4229', sky: '#F3EDD8', ground: '#2A2E1E', hemi: 0.95, key: 1.7, keyColor: '#FFF1D6', fill: 0.6, fillColor: '#DCE6C8', shadow: '#12140B', shadowOpacity: 0.55 },
    avatar: { ...TRUE, trousers: '#4A4E36', shoes: '#EDE7D6', sole: '#B8B09A' },
    prop: { base: '#A88A5C', soft: '#EFE9D6', ink: '#1E2115', a: '#D9B46A', b: '#8FA36A', c: '#E8D9A8', leaf: '#7C9A4A', water: '#9EC2B8', screen: '#E6EBD6' },
  },
  apricot: {
    name: 'apricot',
    label: 'Apricot',
    swatch: ['#F6E3D1', '#D9622B'],
    scene: { bg: '#F6E3D1', floor: '#EFD8C3', plinth: '#E6C7AC', sky: '#FFF4E8', ground: '#DDBFA4', hemi: 1.15, key: 1.55, keyColor: '#FFEBD6', fill: 0.45, fillColor: '#E3ECFF', shadow: '#6A3E22', shadowOpacity: 0.36 },
    avatar: { ...TRUE, trousers: '#5A4A3E', shoes: '#FBF3EA', sole: '#D8C3AE' },
    prop: { base: '#C98E5C', soft: '#FFF6EC', ink: '#3A2A20', a: '#D9622B', b: '#7FA5A0', c: '#F0B85A', leaf: '#7EA35A', water: '#8EC6CE', screen: '#F2E9DE' },
  },
  cream: {
    name: 'cream',
    label: 'Cream',
    swatch: ['#F4EFE4', '#24211B'],
    scene: { bg: '#F4EFE4', floor: '#ECE6D8', plinth: '#DFD7C5', sky: '#FFFBF2', ground: '#D6CDB9', hemi: 1.15, key: 1.5, keyColor: '#FFF6E6', fill: 0.45, fillColor: '#E6ECF5', shadow: '#4A4232', shadowOpacity: 0.34 },
    avatar: { ...TRUE, trousers: '#4E5560', shoes: '#FFFDF8', sole: '#D3CCBD' },
    prop: { base: '#B89A72', soft: '#FFFCF5', ink: '#2E2B25', a: '#C98A5A', b: '#8DA3A6', c: '#E3C77E', leaf: '#7A9A62', water: '#A3C9CC', screen: '#EEF0EA' },
  },
};

export const DEFAULT_THEME: ThemeName = 'sage';
export const NPC_SKIN = ['#E0B191', '#B47A58', '#8A5A40'] as const;
export const NPC_HAIR = ['#2A2220', '#5B3D2B', '#1D1A18'] as const;

const EVT = 'themechange';
const read = (): ThemeName => {
  const t = document.documentElement.dataset.theme;
  return t && t in THEMES ? (t as ThemeName) : DEFAULT_THEME;
};

export function setTheme(n: ThemeName) {
  document.documentElement.dataset.theme = n;
  try {
    localStorage.setItem('theme', n);
  } catch {}
  window.dispatchEvent(new Event(EVT));
}

export function useThemeName(): ThemeName {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener(EVT, cb);
      return () => window.removeEventListener(EVT, cb);
    },
    read,
    () => DEFAULT_THEME,
  );
}
