import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const root = 'audit/trassir-learn-home-cover-v1/v1.1';
const before = JSON.parse(await readFile(`${root}/logs/before.json`));
const after = JSON.parse(await readFile(`${root}/logs/after.json`));
await mkdir(`${root}/comparisons`, { recursive: true });
const rows = [];
for (const a of after.results) {
  const b = before.results.find(b => b.locale === a.locale && b.width === a.width);
  rows.push({ locale: a.locale, width: a.width, before: b.cover.height, after: a.cover.height,
    reduction: b.cover.height - a.cover.height, percent: (1 - a.cover.height / b.cover.height) * 100 });
  const width = a.width === 1440 ? 800 : a.width;
  const buffers = await Promise.all(['before', 'after'].map(phase =>
    sharp(`${root}/${phase}/${a.locale}-${a.width}-cover.png`).resize({ width }).png().toBuffer()));
  const sizes = await Promise.all(buffers.map(b => sharp(b).metadata()));
  const w = width * 2 + 24, h = Math.max(...sizes.map(s => s.height)) + 56;
  const label = Buffer.from(`<svg width="${w}" height="48"><rect width="100%" height="100%" fill="white"/><g font-family="Arial" font-size="16"><text x="8" y="30">V1 BEFORE · ${b.cover.height.toFixed(1)}px</text><text x="${width + 32}" y="30">V1.1 AFTER · ${a.cover.height.toFixed(1)}px</text></g></svg>`);
  await sharp({ create: { width: w, height: h, channels: 3, background: 'white' } })
    .composite([{ input: label, top: 0, left: 0 }, ...buffers.map((input, i) => ({ input, top: 56, left: i * (width + 24) }))])
    .png().toFile(`${root}/comparisons/${a.locale}-${a.width}-before-after.png`);
}
await writeFile(`${root}/logs/heights.json`, JSON.stringify(rows, null, 2) + '\n');
await writeFile(`${root}/index.html`, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>TRASSIR Learn V1.1 · acceptance pending</title><style>body{font:16px/1.6 system-ui;max-width:1600px;margin:32px auto;padding:0 24px;color:#1b1b18}img{max-width:100%;height:auto}section{margin-block:48px}a{margin-right:12px}nav{display:flex;flex-wrap:wrap;gap:12px}</style><h1>TRASSIR Learn V1 → V1.1</h1><p>02 November 2026 · Independent acceptance pending. Raw browser screenshots are linked below; comparison boards are labelled derivatives.</p><a href="REPORT.md">Report</a><nav>${rows.map(r => `<a href="#${r.locale}-${r.width}">${r.locale.toUpperCase()} ${r.width}</a>`).join('')}</nav>${rows.map(r => `<section id="${r.locale}-${r.width}"><h2>${r.locale.toUpperCase()} ${r.width} · ${r.before.toFixed(1)} → ${r.after.toFixed(1)}px</h2>${['before', 'after'].map(phase => `<p>${phase.toUpperCase()}: ${['cover', 'stage', 'context', 'full'].map(type => `<a href="${phase}/${r.locale}-${r.width}-${type}.png">${type}</a>`).join('')}</p>`).join('')}<img src="comparisons/${r.locale}-${r.width}-before-after.png" alt="Before and after ${r.locale} ${r.width} cover comparison" loading="lazy"></section>`).join('')}</html>`);
console.log(rows);
