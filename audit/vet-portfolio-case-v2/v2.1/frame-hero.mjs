import fs from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';

// A documentary crop of the reviewed, unmodified Visit Record capture.
// Complete owner-facing Plan field and clinic-only Private note section.
// Measured product DOM bounds relative to [data-visit-record]: Plan at
// x95/y928.15625/w816/h97.5; Private note at x95/y1053.65625/w816/h188.6875.
// Outward-rounded bounds plus 16 CSS px of existing white canvas. No resampling.
const manifestPath = 'src/data/vet-v2-media.json';
const media = JSON.parse(fs.readFileSync(manifestPath));
const derivatives = [];
for (const locale of ['en', 'ru']) {
  const parentKey = `${locale}/visit-full-desktop`;
  const parent = media[parentKey];
  const input = parent.captureSource;
  const crop = { left: 158, top: 1824, width: 1696, height: 694 };
  const src = `/media/case-vet-v2/${locale}/visit-audience-desktop.webp`;
  await sharp(input).extract(crop).webp({ lossless: true, effort: 4 }).toFile(`public${src}`);
  const originalPixels = await sharp(input).extract(crop).raw().toBuffer();
  const outputPixels = await sharp(`public${src}`).raw().toBuffer();
  assert.ok(originalPixels.equals(outputPixels), 'Crop must retain every source pixel');
  const image = {
    ...parent, src, width: crop.width, height: crop.height,
    cssWidth: crop.width / 2, cssHeight: crop.height / 2,
    state: 'Initial saved owner-facing Plan and complete clinic-only Private note; unpublished',
    clip: { x: parent.clip.x + crop.left / 2, y: parent.clip.y + crop.top / 2, width: crop.width / 2, height: crop.height / 2 },
    selector: '#record-plan parent field + #record-private; 16 CSS px native canvas',
    appearsIn: 'Desktop hero only; full original remains available for inspection',
    derivedFrom: parentKey,
    sourcePixelCrop: crop,
    sha256: createHash('sha256').update(fs.readFileSync(`public${src}`)).digest('hex'),
  };
  delete media[`${locale}/visit-context-desktop`];
  media[`${locale}/visit-audience-desktop`] = image;
  derivatives.push({ locale, parentKey, ...image, exactSourcePixelEquality: true });
}
fs.writeFileSync(manifestPath, JSON.stringify(media, null, 2) + '\n');
fs.writeFileSync('audit/vet-portfolio-case-v2/v2.1/hero-provenance.json', JSON.stringify(derivatives, null, 2) + '\n');
console.log('Two lossless crops; source pixel equality verified; original entries preserved.');
