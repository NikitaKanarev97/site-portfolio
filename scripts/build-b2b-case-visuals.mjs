/**
 * Curated B2B portfolio screen crops, from verified GitHub screenshot evidence.
 * Run: node scripts/build-b2b-case-visuals.mjs
 * Outputs are localized WebP assets for the CaseStory components; originals
 * stay in audit/b2b-case-refresh/sources so every crop is reproducible.
 */
import sharp from 'sharp';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const inputRoot = 'audit/b2b-case-refresh/sources';
const outputRoot = 'public/media/rebuild/partner-portal';
const specs = [
  { kind: 'dashboard', desktop: { left: 216, top: 70, width: 1224, height: 690 } },
  { kind: 'product', desktop: { left: 216, top: 82, width: 1224, height: 645 } },
  { kind: 'cart', desktop: { left: 216, top: 227, width: 1224, height: 662 } },
  { kind: 'fulfillment', desktop: { left: 64, top: 80, width: 1350, height: 750 } },
];

const manifest = [];
const create = async (src, dst, wanted) => {
  const meta = await sharp(src).metadata();
  if (!meta.width || !meta.height) throw new Error('Missing screenshot dimensions: ' + src);
  const region = wanted === 'mobile'
    ? { left: 0, top: 0, width: meta.width, height: Math.min(meta.height, Math.round(meta.width * 844 / 390)) }
    : wanted;
  if (region.left + region.width > meta.width || region.top + region.height > meta.height)
    throw new Error('Crop outside source: ' + src + ' ' + JSON.stringify({ region, meta: [meta.width, meta.height] }));
  await mkdir(path.dirname(dst), { recursive: true });
  await sharp(src).extract(region).webp({ quality: 84, effort: 5 }).toFile(dst);
  const out = await sharp(dst).metadata();
  const { size } = await stat(dst);
  manifest.push({ source: src, output: dst, crop: region, width: out.width, height: out.height, bytes: size });
  console.log(dst + ': ' + out.width + 'x' + out.height + ' · ' + Math.ceil(size / 1024) + ' KB');
};

for (const locale of ['en', 'ru']) {
  const folder = locale === 'ru' ? path.join(outputRoot, 'ru', '2026') : path.join(outputRoot, '2026');
  for (const spec of specs) {
    await create(path.join(inputRoot, spec.kind + '-' + locale + '-desktop.png'),
      path.join(folder, spec.kind + '-wide.webp'), spec.desktop);
    await create(path.join(inputRoot, spec.kind + '-' + locale + '-mobile.png'),
      path.join(folder, spec.kind + '-narrow.webp'), 'mobile');
  }
}

// Extra internal detail crop: line-level monetary decision for reviewers.
await create(path.join(inputRoot, 'cart-change-en-desktop.png'),
  path.join(outputRoot, '2026', 'cart-change-detail.webp'),
  { left: 240, top: 344, width: 1176, height: 335 });

await mkdir('audit/b2b-case-refresh', { recursive: true });
await writeFile('audit/b2b-case-refresh/crop-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('Wrote ' + manifest.length + ' verified crops.');
