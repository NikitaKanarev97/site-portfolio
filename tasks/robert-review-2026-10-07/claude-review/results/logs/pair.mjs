// Склейка before|after: cmp-<loc>-<w>-<section>.png
import { createRequire } from 'node:module';
import { readdir } from 'node:fs/promises';
const require = createRequire('d:/Claude-projects/Site-portfolio/package.json');
const sharp = require('sharp');
const DIR = 'D:/Claude-projects/Site-portfolio/tasks/robert-review-2026-10-07/claude-review/results/evidence';
const files = await readdir(DIR);
const suffix = process.argv[2] || '';
for (const f of files.filter((f) => f.startsWith('old-') && f.endsWith(`${suffix}.png`))) {
  const rest = f.slice(4);
  if (!files.includes('local-' + rest)) continue;
  const [a, b] = [sharp(`${DIR}/${f}`), sharp(`${DIR}/local-${rest}`)];
  const [ma, mb] = await Promise.all([a.metadata(), b.metadata()]);
  const gap = 24, W = ma.width + mb.width + gap, H = Math.max(ma.height, mb.height);
  let img = sharp({ create: { width: W, height: H, channels: 3, background: '#ff00aa' } })
    .composite([{ input: `${DIR}/${f}`, left: 0, top: 0 }, { input: `${DIR}/local-${rest}`, left: ma.width + gap, top: 0 }]);
  const scale = W > 1800 ? 1800 / W : 1;
  const buf = await img.png().toBuffer();
  await sharp(buf).resize(Math.round(W * scale)).png().toFile(`${DIR}/cmp-${rest}`);
}
console.log('ok');
