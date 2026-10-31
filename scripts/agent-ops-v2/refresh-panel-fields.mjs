/** Reframe original browser exports without repeating the source captures.
 * UI pixels stay byte-identical before WebP optimization; only native canvas
 * outside the complete original is added. */
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
const file = 'audit/agent-ops-v2/capture-manifest.json';
const manifest = JSON.parse(await readFile(file, 'utf8'));
const media = JSON.parse(await readFile('src/data/agent-ops-v2-media.json', 'utf8'));
const keys = ['run-evidence-mobile', 'policy-boundary-mobile', 'policy-rollout-mobile'];
const cssPadding = 24;
const color = manifest.entries.find(entry => entry.key === 'approval-task-mobile').nativeCanvas.color;
for (const entry of manifest.entries.filter(entry => keys.includes(entry.key))) {
  const target = `public${entry.src}`;
  await sharp(entry.original).extend({ top: cssPadding * 2, bottom: cssPadding * 2, left: cssPadding * 2, right: cssPadding * 2, background: color }).webp({ quality: 88, effort: 6 }).toFile(target);
  const info = await sharp(target).metadata();
  Object.assign(entry, { pixels: { width: info.width, height: info.height }, width: info.width, height: info.height, cssWidth: info.width / 2, cssHeight: info.height / 2,
    nativeCanvas: { cssPadding, color, purpose: 'Neutral context outside unchanged browser capture; no text or controls repainted' }, webpBytes: (await readFile(target)).length });
  media[`${entry.locale}/${entry.key}`] = { src: entry.src, width: entry.width, height: entry.height, cssWidth: entry.cssWidth, cssHeight: entry.cssHeight };
}
await writeFile(file, JSON.stringify(manifest, null, 2) + '\n');
await writeFile('src/data/agent-ops-v2-media.json', JSON.stringify(media, null, 2) + '\n');
