import { DataTexture, NearestFilter, RedFormat } from 'three';

// 3-step light ramp for MeshToonMaterial: flat illustration look (shadow, mid, lit)
export const toonGradient = new DataTexture(new Uint8Array([110, 190, 255]), 3, 1, RedFormat);
toonGradient.minFilter = NearestFilter;
toonGradient.magFilter = NearestFilter;
toonGradient.generateMipmaps = false;
toonGradient.needsUpdate = true;
