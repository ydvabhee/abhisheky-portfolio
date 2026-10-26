import { useSyncExternalStore } from 'react';

export type ThemeName = 'clay' | 'sage' | 'ink';
export type AvatarColors = { skin: string; skinGlow: string; hair: string; beard: string; eyes: string; mouth: string; tee: string; trousers: string; shoes: string; sole: string };
export type PropColors = { base: string; soft: string; ink: string; a: string; b: string; c: string; leaf: string; water: string; screen: string };
export type SceneColors = { bg: string; floor: string; plinth: string; sky: string; ground: string; hemi: number; key: number; keyColor: string; fill: number; fillColor: string; shadow: string; shadowOpacity: number };
export type Palette = { name: ThemeName; label: string; swatch: [bg: string, accent: string]; scene: SceneColors; avatar: AvatarColors; prop: PropColors };

// His real colours, same in every theme
const TRUE = { skin: '#D19C78', skinGlow: '#7A3418', hair: '#1D1A18', beard: '#664B3C', eyes: '#241A16', mouth: '#5E2C26', tee: '#2B2B2E' };

export const THEMES: Record<ThemeName, Palette> = {
  clay: {
    name: 'clay',
    label: 'Clay',
    swatch: ['#EDE6DC', '#B5532F'],
    scene: { bg: '#EDE6DC', floor: '#E3DACE', plinth: '#D8CBBB', sky: '#FFF6EA', ground: '#CDBFAE', hemi: 1.15, key: 1.6, keyColor: '#FFF1E0', fill: 0.45, fillColor: '#E3ECFF', shadow: '#5A4636', shadowOpacity: 0.38 },
    avatar: { ...TRUE, trousers: '#56657A', shoes: '#F2EEE7', sole: '#CFC5B8' },
    prop: { base: '#C59C74', soft: '#F6F1E9', ink: '#3B3632', a: '#D9774F', b: '#7EA69B', c: '#E5BC5C', leaf: '#74A05F', water: '#8EC3CC', screen: '#DCE8E4' },
  },
  sage: {
    name: 'sage',
    label: 'Sage',
    swatch: ['#E4EAE5', '#2F6B52'],
    scene: { bg: '#E4EAE5', floor: '#D8E0DA', plinth: '#C9D5CD', sky: '#F6FBF8', ground: '#BFCCC4', hemi: 1.1, key: 1.5, keyColor: '#FFF7EC', fill: 0.5, fillColor: '#DDE9FF', shadow: '#31453A', shadowOpacity: 0.36 },
    avatar: { ...TRUE, trousers: '#3F4A5C', shoes: '#F4F4F0', sole: '#C9CFCA' },
    prop: { base: '#BFA17E', soft: '#F5F7F4', ink: '#2F3532', a: '#E39673', b: '#6F8FB5', c: '#E9CC7A', leaf: '#5F9762', water: '#9CCAD6', screen: '#E4EEF2' },
  },
  ink: {
    name: 'ink',
    label: 'Ink',
    swatch: ['#121212', '#FFFFFF'],
    scene: { bg: '#121212', floor: '#1A1A1A', plinth: '#262626', sky: '#D8D8D8', ground: '#1A1A1A', hemi: 0.8, key: 1.9, keyColor: '#FFFFFF', fill: 1.0, fillColor: '#FFFFFF', shadow: '#000000', shadowOpacity: 0.6 },
    avatar: { ...TRUE, trousers: '#4B4B4B', shoes: '#EDEDED', sole: '#9A9A9A' },
    prop: { base: '#5A5A5A', soft: '#E6E6E6', ink: '#2C2C2C', a: '#BDBDBD', b: '#8A8A8A', c: '#F5F5F5', leaf: '#A3A3A3', water: '#CFCFCF', screen: '#F0F0F0' },
  },
};

export const DEFAULT_THEME: ThemeName = 'clay';
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
