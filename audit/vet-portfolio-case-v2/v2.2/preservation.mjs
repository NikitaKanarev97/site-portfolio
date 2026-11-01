import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import sharp from 'sharp';
const require = createRequire(process.env.PLAYWRIGHT_PACKAGE_JSON ?? 'D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const root = 'audit/vet-portfolio-case-v2/v2.2';
const baseline = '3e82e8acad9b40e2c2bf6aafbb7ad0586d82f2b4';
const old = file => execFileSync('git', ['show', `${baseline}:${file}`]);
const hash = data => createHash('sha256').update(data).digest('hex');
const media = JSON.parse(fs.readFileSync('src/data/vet-v2-media.json'));
const oldMedia = JSON.parse(old('src/data/vet-v2-media.json'));
for (const [key, value] of Object.entries(oldMedia)) {
  assert.deepEqual(media[key], value, key);
  assert.equal(hash(fs.readFileSync('public' + value.src)), value.sha256);
}
for (const item of Object.values(media).filter(item => item.src.includes('visit-workspace-desktop'))) {
  assert.ok((await sharp(item.captureSource).extract(item.sourcePixelCrop).raw().toBuffer()).equals(await sharp('public' + item.src).raw().toBuffer()));
  assert.equal(hash(fs.readFileSync('public' + item.src)), item.sha256);
}
const unchangedFiles = ['src/components/vet/VetShot.astro', 'src/components/vet/VetHome.astro', 'ds/tokens.css', 'src/styles/tokens.css'];
for (const file of unchangedFiles) assert.ok(old(file).equals(fs.readFileSync(file)), file);
for (const file of ['src/copy/cases/vet-v2.ts', 'src/copy/ru/cases/vet-v2.ts']) {
  const before = old(file).toString(), after = fs.readFileSync(file, 'utf8');
  assert.equal(before.slice(before.indexOf('  problem: {')), after.slice(after.indexOf('  problem: {')));
  for (const field of ['altFull', 'altMobile', 'caption']) assert.equal(before.match(new RegExp(`    ${field}: .*`))[0], after.match(new RegExp(`    ${field}: .*`))[0]);
}
const browser = await chromium.launch();
const results = [];
fs.mkdirSync(`${root}/regressions`, { recursive: true });
try {
  for (const locale of ['en', 'ru']) for (const width of [1440, 390]) {
    const entry = { name: `${locale}-${width}-home` };
    for (const [phase, base] of [['before', process.env.BEFORE_URL ?? 'http://127.0.0.1:5376'], ['after', process.env.AFTER_URL ?? 'http://127.0.0.1:5378']]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce', timezoneId: 'Europe/Moscow' });
      await page.goto(base + (locale === 'ru' ? '/ru/' : '/'), { waitUntil: 'networkidle' });
      await page.evaluate(async () => { await document.fonts.ready; document.querySelectorAll('img').forEach(i => i.loading = 'eager'); await Promise.all([...document.images].filter(i => i.getAttribute('src')).map(i => i.decode())); });
      for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 750) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(30); }
      await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(350);
      entry[phase] = hash(await page.screenshot({ path: `${root}/regressions/${entry.name}-${phase}.png`, fullPage: true }));
      await page.close();
    }
    assert.equal(entry.after, entry.before, entry.name);
    results.push({ ...entry, identicalPixels: true });
  }
} finally { await browser.close(); }
fs.writeFileSync(`${root}/preservation.json`, JSON.stringify({ baseline, originalMediaEntriesAndFilesUnchanged: Object.keys(oldMedia).length, newDocumentaryCrops: Object.keys(media).length - Object.keys(oldMedia).length, exactCropPixelEquality: true, unchangedFiles, bodyCopyAndMobileHeroCopyUnchanged: true, home: results }, null, 2) + '\n');
console.log('54 original media entries/files and accepted body/mobile copy preserved; 2 pixel-exact crops; 4/4 Home screenshot pairs identical.');
