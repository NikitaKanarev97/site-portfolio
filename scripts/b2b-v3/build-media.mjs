/**
 * Partner Portal V3 — site media from the V3 element captures.
 *   node scripts/b2b-v3/build-media.mjs
 *
 * No cropping, no pixel edits: each PNG already is one element screenshot
 * (capture-line.mjs, capture-specimens.mjs). This step only encodes WebP at the
 * capture's DPR 2 resolution and adds entries to the existing registry
 * src/data/partner-portal-v2-media.json (sizes in CSS px). Existing V2/V2.1 and
 * Home entries are left byte-for-byte as they were.
 */
import sharp from 'sharp';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';

const CAPTURES = 'audit/b2b-portfolio-case-premium-v3/captures';
const OUT = 'public/media/rebuild/partner-portal/v3';
const REGISTRY = 'src/data/partner-portal-v2-media.json';
const media = JSON.parse(await readFile(REGISTRY, 'utf8'));
const line = JSON.parse(await readFile(`${CAPTURES}/line-manifest.json`, 'utf8'));
const specimens = JSON.parse(await readFile(`${CAPTURES}/specimens/manifest.json`, 'utf8'));

async function encode(source, dst) {
  const info = await sharp(source).webp({ lossless: true, effort: 6 }).toFile(dst);
  return { width: Math.round(info.width / 2), height: Math.round(info.height / 2), bytes: (await stat(dst)).size };
}

for (const entry of line.entries) {
  const [locale, width, kind, stage] = entry.name.split('-');
  await mkdir(`${OUT}/${locale}`, { recursive: true });
  const name = `${kind}-${stage}-${width}`;
  const dst = `${OUT}/${locale}/${name}.webp`;
  media[`${locale}/${name}`] = {
    src: `/${dst.replace(/^public\//, '')}`,
    ...(await encode(`${CAPTURES}/${entry.name}.png`, dst)),
    source: `audit/b2b-portfolio-case-premium-v3/${entry.file}`,
    route: entry.route, commit: line.product, stage: entry.stage,
    note: kind === 'row' ? 'Element screenshot of an untouched baseline queue row' : 'Element screenshot from one session: row 19 resolved through real controls; other open rows pre-resolved in the seed',
  };
}

await mkdir(`${OUT}/spec`, { recursive: true });
for (const entry of specimens.entries) {
  const dst = `${OUT}/spec/${entry.name}.webp`;
  const encoded = await encode(`${CAPTURES}/specimens/${entry.name}.png`, dst);
  // Storybook renders the product's English catalogue; both locales share it.
  for (const locale of ['en', 'ru']) {
    media[`${locale}/spec-${entry.name}`] = {
      src: `/${dst.replace(/^public\//, '')}`, ...encoded,
      source: `audit/b2b-portfolio-case-premium-v3/captures/specimens/${entry.name}.png`,
      route: `storybook ${entry.story}`, commit: specimens.product,
    };
  }
}

await writeFile(REGISTRY, `${JSON.stringify(media, null, 2)}\n`);
await writeFile('src/data/partner-portal-v3-tokens.json', `${JSON.stringify({ commit: specimens.product, ...specimens.tokens }, null, 2)}\n`);
console.log(Object.keys(media).length, 'registry entries');
