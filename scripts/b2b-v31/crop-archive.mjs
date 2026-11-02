/**
 * Partner Portal V3.1 — archival cart crop for 01 Diagnosis.
 *   node scripts/b2b-v31/crop-archive.mjs <product-root>
 *
 * Source: the product repo's `pages-default/Корзина.png` (original DSSL portal,
 * owner-supplied evidence). V3 cut `left 97, top 214, 2160 × 604`, which ran
 * 5 px past the cart panel's right edge (x 2251 anti-aliased, 2252+ is the
 * page's grey gutter) and 1 px past its left and top edges. This crop is the
 * same cart line and its "best alternative" block, bounded by the panel's own
 * white interior, clear of its rounded corners: x 99–2250, y 220–817. No
 * retouching, no resampling; every edge pixel is asserted to be panel white so
 * no gutter can return.
 */
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readFile, stat, writeFile } from 'node:fs/promises';

const root = process.argv[2] ?? 'D:/Claude-projects/sp-b2b-product-v31';
const SOURCE = `${root}/pages-default/Корзина.png`;
const OUT = 'public/media/rebuild/partner-portal/v3/legacy-cart-alternative.webp';
const CROP = { left: 99, top: 220, width: 2152, height: 598 };

const source = await readFile(SOURCE);
const sha = buffer => createHash('sha256').update(buffer).digest('hex');
const region = sharp(source).extract(CROP).removeAlpha();
const { data, info } = await region.clone().raw().toBuffer({ resolveWithObject: true });
const at = (x, y) => data.subarray((y * info.width + x) * 3, (y * info.width + x) * 3 + 3);
const edge = [];
for (let x = 0; x < info.width; x++) edge.push([x, 0], [x, info.height - 1]);
for (let y = 0; y < info.height; y++) edge.push([0, y], [info.width - 1, y]);
const dark = edge.filter(([x, y]) => Math.min(...at(x, y)) < 244);
if (dark.length) throw new Error(`crop edge leaves the panel at ${dark.slice(0, 5).join(' ')}`);

await region.webp({ quality: 92, effort: 6 }).toFile(OUT);
const manifest = {
  source: 'b2b-partner-portal pages-default/Корзина.png', sourceSha256: sha(source), crop: CROP,
  output: OUT, outputSha256: sha(await readFile(OUT)), bytes: (await stat(OUT)).size,
  css: { width: CROP.width / 2, height: CROP.height / 2 },
};
await writeFile('audit/b2b-portfolio-case-premium-v3/v3.1/archive-crop.json', `${JSON.stringify(manifest, null, 2)}\n`);
console.log(manifest);
