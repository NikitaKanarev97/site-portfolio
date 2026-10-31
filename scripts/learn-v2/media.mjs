/** Documentary crops only. Coordinates refer to the unmodified prepared PNGs.
 * No repainting, translated overlays, colour correction or invented UI.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
const source = 'audit/trassir-learn-case-v2/evidence';
const dest = 'public/media/case-learn-v2';
await mkdir(dest, { recursive: true });
// Whole semantic regions, with source canvas included where available.
const crops = {
  'home-wide': ['01-home-setup-desktop.png', 32, 104, 1376, 435],
  'home-mobile': ['03-home-setup-mobile.png', 16, 142, 358, 256],
  'answer-detail': ['04-material-onvif-desktop.png', 144, 144, 768, 254],
  'path-progress': ['08-trajectory-started-desktop.png', 1016, 480, 272, 208],
  'reference': ['04-material-onvif-desktop.png', 144, 88, 1152, 596],
  'reference-mobile': ['06-material-onvif-mobile.png', 0, 184, 390, 660],
  'player': ['10-player-current-desktop.png', 144, 80, 1152, 538],
  'player-mobile': ['11-player-current-mobile.png', 0, 176, 390, 493],
  'path': ['08-trajectory-started-desktop.png', 104, 88, 848, 746],
  'path-mobile': ['09-trajectory-started-mobile.png', 0, 184, 390, 568],
  'learner': ['13-my-learning-marina-desktop.png', 16, 218, 1040, 310],
  'learner-records': ['13-my-learning-marina-desktop.png', 32, 572, 1008, 116],
  'learner-mobile': ['14-my-learning-marina-mobile.png', 0, 264, 390, 580],
  'reader': ['15-my-learning-reader-desktop.png', 16, 218, 1040, 682],
  // The complete score panel, excluding the document area below it.
  // Document disclaimer in original 20/21 is forbidden by CONTENT-RULES.
  'failed': ['18-result-failed-desktop.png', 16, 176, 1040, 548],
  'failed-mobile': ['19-result-failed-mobile.png', 0, 240, 390, 560],
  'passed-score': ['20-result-passed-desktop.png', 16, 176, 1040, 388],
  'passed-score-mobile': ['21-result-passed-mobile.png', 0, 240, 390, 328],
  'review': ['22-result-wrong-review-desktop.png', 16, 88, 1040, 612],
  'review-detail': ['22-result-wrong-review-desktop.png', 88, 238, 446, 68],
};
const manifest = {};
for (const [key, [file, left, top, width, height]] of Object.entries(crops)) {
  const { data, info } = await sharp(`${source}/${file}`).extract({ left, top, width, height }).webp({ lossless: true, effort: 6 }).toBuffer({ resolveWithObject: true });
  await writeFile(`${dest}/${key}.webp`, data);
  manifest[key] = { src: `/media/case-learn-v2/${key}.webp`, width, height, source: file, crop: { left, top, width, height }, bytes: info.size };
}
// A small mobile detail from the desktop reader state, kept at native scale.
// The two complete progress cards are vertically composed, not a fake screen.
for (const [key, rect] of Object.entries({ 'reader-history': [32, 550, 496, 338], 'reader-programme': [544, 550, 496, 338] })) {
  const [left, top, width, height] = rect;
  const { data, info } = await sharp(`${source}/15-my-learning-reader-desktop.png`).extract({ left, top, width, height }).webp({ lossless: true }).toBuffer({ resolveWithObject: true });
  await writeFile(`${dest}/${key}.webp`, data);
  manifest[key] = { src: `/media/case-learn-v2/${key}.webp`, width, height, source: '15-my-learning-reader-desktop.png', crop: { left, top, width, height }, bytes: info.size };
}
await writeFile('src/data/learn-v2-media.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`${Object.keys(manifest).length} lossless documentary crops; ${Object.values(manifest).reduce((sum, m) => sum + m.bytes, 0)} bytes total`);
