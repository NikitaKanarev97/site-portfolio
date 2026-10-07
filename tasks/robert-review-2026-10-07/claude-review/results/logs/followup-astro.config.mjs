import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import base from '../../../../../astro.config.mjs';
export default defineConfig({
  ...base,
  root: fileURLToPath(new URL('../followup-build/', import.meta.url)),
  srcDir: fileURLToPath(new URL('../../../../../src/', import.meta.url)),
  publicDir: fileURLToPath(new URL('../../../../../public/', import.meta.url)),
  cacheDir: fileURLToPath(new URL('../followup-cache/astro/', import.meta.url)),
  outDir: fileURLToPath(new URL('../followup-build/dist/', import.meta.url)),
  vite: { ...base.vite, cacheDir: fileURLToPath(new URL('../followup-cache/vite/', import.meta.url)) },
});
