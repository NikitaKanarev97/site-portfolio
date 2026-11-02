import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const root = 'audit/trassir-learn-home-cover-v1/v1.1';
const sha256 = b => createHash('sha256').update(b).digest('hex');
const rectangle = { left: 48, top: 48, width: 636, height: 408 };
const entries = [];
for (const locale of ['en', 'ru']) {
  const source = `public/media/case-learn-v2/current/${locale}/path-progress.webp`;
  const folder = `public/media/learn-home-cover-v11/${locale}`;
  await mkdir(folder, { recursive: true });
  const output = `${folder}/programme-mobile.webp`;
  await sharp(source).extract(rectangle).webp({ lossless: true }).toFile(output);
  const expected = await sharp(source).extract(rectangle).ensureAlpha().raw().toBuffer();
  const actual = await sharp(output).ensureAlpha().raw().toBuffer();
  assert.deepEqual(actual, expected, `${locale}: crop must preserve every decoded RGBA pixel`);
  entries.push({ locale, source, sourceSHA256: sha256(await readFile(source)), rectangle,
    output, outputSHA256: sha256(await readFile(output)), decodedRGBA_SHA256: sha256(actual),
    exactPixelEquality: true, productCommit: 'e9ac4b075c4c5251dc10891ad201ecbf5405b727' });
}
await writeFile(`${root}/logs/source-provenance.json`, JSON.stringify({
  operation: 'Single rectangular extraction, lossless WebP; no scaling, painting, compositing or UI rearrangement.',
  purpose: 'Mobile Home only: complete 3/11 progress, current step 04 and Continue; omit reading history and outer canvas field.',
  entries,
}, null, 2) + '\n');
console.log('PASS: both localized crops equal the accepted source rectangle pixel for pixel.');
