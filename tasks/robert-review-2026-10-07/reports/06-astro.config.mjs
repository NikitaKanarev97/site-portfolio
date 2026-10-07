import base from '../../../astro.config.mjs';
import { defineConfig } from 'astro/config';

export default defineConfig({
  ...base,
  cacheDir: './.tmp/robert-06-cache/astro/',
  vite: {
    ...base.vite,
    cacheDir: './.tmp/robert-06-cache/vite/',
  },
});
