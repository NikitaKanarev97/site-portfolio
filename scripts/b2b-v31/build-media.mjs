/**
 * Partner Portal V3.1 — re-encode only the frames recaptured from the corrected
 * product build, in place, and update only their registry entries.
 *   node scripts/b2b-v31/build-media.mjs
 *
 * Inputs (all from b2b-partner-portal @ the commit in each manifest):
 *   v3.1/captures/line-manifest.json        source line + ResolutionRow rows (capture-line.mjs)
 *   v3.1/captures/specimens/manifest.json   Storybook; only FulfillmentPlan Selected changed
 *   v3.1/captures/fulfillment-manifest.json Fulfillment screen, V2 clip
 * Encoder settings are the ones V3 and V2 used for the same files. No cropping,
 * no pixel edits. Every other registry entry is left byte-for-byte as it was.
 */
import sharp from 'sharp';
import { readFile, stat, writeFile } from 'node:fs/promises';

const AUDIT = 'audit/b2b-portfolio-case-premium-v3/v3.1';
const REGISTRY = 'src/data/partner-portal-v2-media.json';
const media = JSON.parse(await readFile(REGISTRY, 'utf8'));
const before = structuredClone(media);
const line = JSON.parse(await readFile(`${AUDIT}/captures/line-manifest.json`, 'utf8'));
const specimens = JSON.parse(await readFile(`${AUDIT}/captures/specimens/manifest.json`, 'utf8'));
const fulfillment = JSON.parse(await readFile(`${AUDIT}/captures/fulfillment-manifest.json`, 'utf8'));
const lossless = { lossless: true, effort: 6 };

async function encode(source, dst) {
  const info = await sharp(source).webp(lossless).toFile(dst);
  return { width: Math.round(info.width / 2), height: Math.round(info.height / 2), bytes: (await stat(dst)).size };
}
const changed = [];

for (const entry of line.entries) {
  const [locale, width, kind, stage] = entry.name.split('-');
  const key = `${locale}/${kind}-${stage}-${width}`;
  const dst = `public${media[key].src}`;
  media[key] = {
    src: media[key].src,
    ...(await encode(`${AUDIT}/captures/${entry.name}.png`, dst)),
    source: `${AUDIT}/captures/${entry.name}.png`,
    route: entry.route, commit: line.product, stage: entry.stage,
    clip: entry.radius ? `element box + 8 px product surface (radius ${entry.radius} px)` : 'element',
    note: kind === 'row' ? 'Untouched baseline queue row' : 'One session: row 19 resolved through real controls; other open rows pre-resolved in the seed',
  };
  changed.push(key);
}

const selected = specimens.entries.find(e => e.name === 'fulfillmentplan-selected');
for (const locale of ['en', 'ru']) {
  const key = `${locale}/spec-fulfillmentplan-selected`;
  const dst = `public${media[key].src}`;
  media[key] = {
    src: media[key].src, ...(await encode(`${AUDIT}/captures/specimens/${selected.name}.png`, dst)),
    source: `${AUDIT}/captures/specimens/${selected.name}.png`, route: `storybook ${selected.story}`, commit: specimens.product,
  };
  changed.push(key);
}

for (const [key, entry] of Object.entries(fulfillment.captures)) {
  const dst = `public${media[key].src}`;
  media[key] = {
    src: media[key].src, ...(await encode(entry.file, dst)),
    source: entry.file, route: entry.route, commit: entry.commit, clip: entry.clip,
  };
  changed.push(key);
}

const untouched = Object.keys(before).filter(k => !changed.includes(k));
if (untouched.some(k => JSON.stringify(before[k]) !== JSON.stringify(media[k]))) throw new Error('an unrelated registry entry changed');
await writeFile(REGISTRY, `${JSON.stringify(media, null, 2)}\n`);
console.log(changed.length, 'entries updated;', untouched.length, 'unchanged');
