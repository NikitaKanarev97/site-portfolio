import sharp from 'sharp';
import assert from 'node:assert/strict';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = 'public/media/case-learn-ru';
const out = 'tasks/learn-case/reports/evidence-08';
const files = (await readdir(root, { recursive: true })).filter(f => f.endsWith('.webp')).sort();
assert.equal(files.length, 11);
const report = [], tiles = [];
for (const [index, file] of files.entries()) {
  const bytes = await readFile(`${root}/${file}`);
  const meta = await sharp(bytes).metadata();
  assert.equal(meta.format, 'webp');
  if (file.startsWith('cover')) assert.deepEqual([meta.width, meta.height], [2000, 1250]);
  else if (file !== 'before-catalog.webp') assert.equal(meta.width, 2000);
  report.push({ file, width: meta.width, height: meta.height, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
  const thumb = await sharp(bytes).resize(480, 510, { fit: 'contain', background: '#e5e7eb' }).png().toBuffer();
  const label = Buffer.from(`<svg width="500" height="40"><rect width="500" height="40" fill="white"/><text x="12" y="27" font-size="20" font-family="Arial">${file.replaceAll('\\', '/')}</text></svg>`);
  const left = (index % 4) * 500, top = Math.floor(index / 4) * 560;
  tiles.push({ input: label, left, top }, { input: thumb, left: left + 10, top: top + 40 });
}
const archived = await sharp('../learn/images/default-pages/3.png').webp({ quality: 90 }).toBuffer();
assert(archived.equals(await readFile(`${root}/before-catalog.webp`)), 'Archive is only converted, without cropping or overlays');
await sharp({ create: { width: 2000, height: 1680, channels: 3, background: '#e5e7eb' } }).composite(tiles).png().toFile(`${out}/overview.png`);
await writeFile(`${out}/images.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.map(({file,width,height})=>({file,width,height})), null, 2));

