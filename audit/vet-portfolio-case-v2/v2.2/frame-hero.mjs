import fs from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';

// Contiguous top of the existing Visit Record: clinic/patient bars, visit
// identity/status, Quick Trace, navigation, Complaints/History/Examination
// and the complete prescription card. Stop in the native gap before the
// next Diagnosis/Services sections. No rearrangement, resizing or UI edits.
const manifestPath = 'src/data/vet-v2-media.json';
const media = JSON.parse(fs.readFileSync(manifestPath));
const derivatives = [];
for (const locale of ['en', 'ru']) {
  const parentKey = `${locale}/visit-full-desktop`;
  const parent = media[parentKey];
  // RU's complete warning wraps one line longer; preserve its card's bottom.
  const crop = { left: 0, top: 0, width: 2812, height: locale === 'ru' ? 1628 : 1600 };
  const src = `/media/case-vet-v2/${locale}/visit-workspace-desktop.webp`;
  await sharp(parent.captureSource).extract(crop).webp({ lossless: true, effort: 4 }).toFile(`public${src}`);
  assert.ok((await sharp(parent.captureSource).extract(crop).raw().toBuffer()).equals(await sharp(`public${src}`).raw().toBuffer()));
  const image = {
    ...parent, src, width: crop.width, height: crop.height,
    cssWidth: crop.width / 2, cssHeight: crop.height / 2,
    state: 'Initial saved clinical record; clinic/patient context, unpublished visit, Quick Trace, three complete clinical fields and complete prescription card',
    clip: { ...parent.clip, height: crop.height / 2 },
    selector: '[data-visit-record] top through Examination and complete #record-prescription; before Diagnosis/Services',
    appearsIn: 'V2.2 desktop hero only; original full record separately inspectable',
    derivedFrom: parentKey, sourcePixelCrop: crop,
    sha256: createHash('sha256').update(fs.readFileSync(`public${src}`)).digest('hex'),
  };
  media[`${locale}/visit-workspace-desktop`] = image;
  derivatives.push({ locale, parentKey, ...image, exactSourcePixelEquality: true });
}
fs.writeFileSync(manifestPath, JSON.stringify(media, null, 2) + '\n');
fs.writeFileSync('audit/vet-portfolio-case-v2/v2.2/hero-provenance.json', JSON.stringify(derivatives, null, 2) + '\n');
console.log('Two contiguous lossless workspace crops; exact source pixel equality verified.');
