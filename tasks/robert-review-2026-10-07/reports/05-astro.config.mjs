// Isolate this package's verification cache/output from the other five chats.
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import base from '../../../astro.config.mjs';

export default defineConfig({
  ...base,
  root: fileURLToPath(new URL('./05-build/', import.meta.url)),
  srcDir: fileURLToPath(new URL('../../../src/', import.meta.url)),
  publicDir: fileURLToPath(new URL('../../../public/', import.meta.url)),
  devToolbar: { enabled: false },
  cacheDir: fileURLToPath(new URL('./05-cache/', import.meta.url)),
  outDir: fileURLToPath(new URL('./05-build/dist/', import.meta.url)),
});
