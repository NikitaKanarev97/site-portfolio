/**
 * Partner Portal case V2 — site media from the element-bounded captures.
 * node scripts/b2b-v2/build-media.mjs
 *
 * No re-cropping happens here: the crop already is the component box made in
 * capture-product.mjs. This step only encodes WebP at the capture's DPR 2
 * resolution and writes src/data/partner-portal-v2-media.json (intrinsic
 * sizes in CSS px, for width/height attributes and aspect ratios).
 */
import sharp from 'sharp';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';

const SRC = 'audit/b2b-case-v2/captures';
const OUT = 'public/media/rebuild/partner-portal/v2';
const capture = JSON.parse(await readFile(`${SRC}/manifest.json`, 'utf8'));
const used = [
  'workspace-1280', 'workspace-top-390', 'change-390', 'dashboard-1280', 'dashboard-390',
  'decision-1280', 'decision-390', 'confirmed-1280', 'product-1280', 'product-390',
  'cartbar-1280', 'cartbar-390', 'unpriced-1280', 'unpriced-390', 'confirmed-390', 'fulfillment-1280', 'fulfillment-390',
];
// Preserve V2.1 entries captured by capture-v21.mjs when rebuilding V2 frames.
const media = JSON.parse(await readFile('src/data/partner-portal-v2-media.json', 'utf8'));
for (const locale of ['en', 'ru']) {
  await mkdir(`${OUT}/${locale}`, { recursive: true });
  for (const name of used) {
    const source = capture[`${locale}/${name}`];
    if (!source) throw new Error(`No capture ${locale}/${name}; run capture-product.mjs`);
    const dst = `${OUT}/${locale}/${name}.webp`;
    const info = await sharp(source.file).webp({ quality: 86, effort: 6, smartSubsample: true }).toFile(dst);
    media[`${locale}/${name}`] = {
      src: '/' + dst.replace(/^public\//, ''),
      width: Math.round(info.width / 2), height: Math.round(info.height / 2),
      bytes: (await stat(dst)).size, source: source.file, route: source.route, commit: source.commit, clip: source.clip,
    };
  }
}
await writeFile('src/data/partner-portal-v2-media.json', JSON.stringify(media, null, 2) + '\n');
const total = Object.values(media).reduce((sum, item) => sum + item.bytes, 0);
console.log(Object.keys(media).length, 'files,', Math.round(total / 1024), 'KB');
