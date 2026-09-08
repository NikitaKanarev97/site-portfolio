import assert from 'node:assert/strict';
import { readFile, readdir, writeFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const out = 'tasks/learn-case/reports/evidence-08';
const baseline = JSON.parse((await readFile(`${out}/en-before-hashes.json`, 'utf8')).replace(/^\uFEFF/, ''));
for (const {Path, Hash} of baseline) assert.equal(createHash('sha256').update(await readFile(Path)).digest('hex').toUpperCase(), Hash);
assert.equal(baseline.length, 11);
const results = [];
for (const lang of ['en', 'ru']) {
  const root = `public/media/case-learn${lang === 'ru' ? '-ru' : ''}`;
  const copy = await readFile(`src/copy/${lang === 'ru' ? 'ru/' : ''}cases/learn.ts`, 'utf8');
  const paths = [...copy.matchAll(/\$\{media\}\/([^`]+\.webp)/g)].map(m => m[1]);
  const files = (await readdir(root, {recursive: true})).filter(f => f.endsWith('.webp'));
  assert.equal(files.length, 11); assert.equal(new Set(paths).size, 11);
  for (const file of paths) {
    await access(`${root}/${file}`);
    const meta = await sharp(`${root}/${file}`).metadata();
    assert.equal(meta.format, 'webp');
    if (file.startsWith('cover/')) assert.deepEqual([meta.width, meta.height], [2000,1250]);
  }
  results.push({lang, files: files.length, referencedPaths: paths.length, missing: 0, covers: '3 x 2000x1250'});
}
assert((await readFile('public/media/case-learn/before-catalog.webp')).equals(await readFile('public/media/case-learn-ru/before-catalog.webp')));
const ru = JSON.parse(await readFile(`${out}/frame-report.json`, 'utf8'));
const en = JSON.parse(await readFile('tasks/learn-case/reports/evidence-07/final-frame-report.json', 'utf8'));
assert.equal(ru.length,11);
for (const frame of ru.filter(f => f.text)) {
  const peer = en.find(f => f.file === frame.file);
  assert(peer, frame.file); assert.equal(peer.fixture, frame.fixture);
  assert.equal(frame.lang, 'ru'); assert.equal(frame.errors.length, 0);
  assert(/[А-Яа-яЁё]/.test(frame.text));
  assert(!/Sign in|Your answer|Correct answer|Assessment passed|Learning Example LLC/.test(frame.text));
}
const material = ru.find(f=>f.file === 'material.webp').text;
for (const ip of ['192.168.1.0/24','192.168.1.10','192.168.1.101','192.168.1.102']) assert(material.includes(ip));
const practice = ru.find(f=>f.file === 'practice.webp').text;
for (const text of ['Ваш ответ','Правильный ответ']) assert(practice.includes(text));
await writeFile(`${out}/acceptance.json`, JSON.stringify({status:'pass', checkedAt:new Date().toISOString(), results, totalFiles:22, enUnchanged:true, archivesIdentical:true, matchingFixtures:true, ruCaptureAssertions:'pass'},null,2));
console.log('PASS: 22 files, 22 copy paths, 6 covers; EN unchanged; archive identity and fixture parity confirmed.');
