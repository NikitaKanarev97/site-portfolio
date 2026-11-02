/**
 * Partner Portal V3.1 — BEFORE | AFTER boards from the matched section shots.
 *   node scripts/b2b-v31/boards.mjs
 * Each board places the two element screenshots side by side at their own
 * pixel size on a neutral ground with a label strip; nothing is rescaled.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const ROOT = 'audit/b2b-portfolio-case-premium-v3/v3.1';
const OUT = `${ROOT}/comparisons`;
await mkdir(OUT, { recursive: true });
const boards = [
  ['01-hero-first-view', ['en-390-first-view', 'ru-390-first-view', 'en-360-first-view', 'ru-360-first-view', 'en-320-first-view', 'ru-320-first-view']],
  ['02-archive-cart', ['en-1440@2x-archive-cart', 'ru-1440@2x-archive-cart', 'en-390-archive-cart', 'en-320-archive-cart']],
  ['03-architecture', ['en-1440-architecture', 'ru-1440-architecture', 'en-390-architecture', 'ru-360-architecture', 'en-320-architecture']],
  ['04-source-line-stage-02', ['en-1440@2x-line-stage-02', 'ru-1440@2x-line-stage-02', 'en-390-line-stage-02', 'ru-390-line-stage-02', 'en-360-line-stage-02']],
  ['05-fulfillment', ['en-1440@2x-fulfillment', 'ru-1440@2x-fulfillment', 'en-390-fulfillment', 'ru-360-fulfillment']],
  ['06-phone-scrollers', ['en-390-family-upload', 'en-390-family-plans', 'ru-360-family-plans', 'en-320-family-plans']],
  ['07-process', ['en-1440-process', 'ru-1440-process', 'en-390-process', 'ru-320-process']],
];
const label = (text, width) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="40"><rect width="100%" height="100%" fill="#1b1b18"/><text x="12" y="27" font-family="Arial" font-size="18" fill="#fff">${text}</text></svg>`);

for (const [name, keys] of boards) {
  for (const key of keys) {
    const files = ['before', 'after'].map(phase => `${ROOT}/${phase}/sections/${key}.png`);
    if (!files.every(existsSync)) { console.log('skip', key); continue; }
    const metas = await Promise.all(files.map(f => sharp(f).metadata()));
    const gap = 32, pad = 24;
    const width = metas[0].width + metas[1].width + gap + pad * 2;
    const height = Math.max(metas[0].height, metas[1].height) + 40 + pad * 2;
    await sharp({ create: { width, height, channels: 3, background: '#d9d9d4' } })
      .composite([
        { input: label(`BEFORE · V3 · ${key}`, metas[0].width), left: pad, top: pad },
        { input: label(`AFTER · V3.1 · ${key}`, metas[1].width), left: pad + metas[0].width + gap, top: pad },
        { input: files[0], left: pad, top: pad + 40 },
        { input: files[1], left: pad + metas[0].width + gap, top: pad + 40 },
      ])
      .png({ compressionLevel: 9 }).toFile(`${OUT}/${name}--${key}.png`);
  }
  console.log(name);
}
