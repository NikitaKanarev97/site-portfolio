import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
const require = createRequire(process.env.PLAYWRIGHT_PACKAGE_JSON ?? 'D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const retest = process.argv.includes('--retest-buffered-media');
const root = 'audit/vet-portfolio-case-v2/v2.1/regressions' + (retest ? '/retest' : '');
fs.mkdirSync(root, { recursive: true });
const sha = '51e10a54624bc7796450bcac9f612494a1295cdf';
const hash = b => createHash('sha256').update(b).digest('hex');
const browser = await chromium.launch();
const results = [], failures = [];
async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.querySelectorAll('img').forEach(i => i.loading = 'eager');
    await Promise.all([...document.images].filter(i => i.getAttribute('src')).map(i => i.decode()));
  });
  for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 750) {
    await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(20);
  }
  await page.evaluate(async () => {
    await Promise.all([...document.querySelectorAll('video')].map(async v => {
      v.pause();
      // Native Chromium controls paint the buffered range. For the targeted
      // retest, wait for the real local file to finish loading on both builds.
      // No CSS, controls, screenshots or product pixels are replaced.
      if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); }
      await new Promise((resolve, reject) => {
        const started = performance.now();
        const timer = setInterval(() => {
          if (v.duration && v.buffered.length && v.buffered.end(v.buffered.length - 1) >= v.duration - 0.01) { clearInterval(timer); resolve(); }
          else if (performance.now() - started > 15000) { clearInterval(timer); reject(Error('Video did not fully buffer')); }
        }, 50);
      });
      if (v.readyState < 2) await new Promise(resolve => v.addEventListener('loadeddata', resolve, { once: true }));
      if (v.currentTime !== 0) { v.currentTime = 0; await new Promise(resolve => v.addEventListener('seeked', resolve, { once: true })); }
    }));
    scrollTo(0, 0);
  });
  await page.waitForTimeout(await page.locator('video').count() ? 2500 : 350);
}
try {
  for (const locale of ['en', 'ru']) for (const width of [1440, 1280, 768, 390, 360]) {
    const pages = ['home', ...([1440, 390].includes(width) ? ['agent-ops-console', 'partner-portal', 'learn', 'pawly'] : [])];
    for (const slug of pages) {
      if (retest && !(locale === 'ru' && [1440, 390].includes(width) && slug === 'pawly')) continue;
      const pair = { name: `${locale}-${width}-${slug}`, locale, width, slug };
      for (const [phase, base] of [['before', process.env.BEFORE_URL ?? 'http://127.0.0.1:5376'], ['after', process.env.AFTER_URL ?? 'http://127.0.0.1:5378']]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce', timezoneId: 'Europe/Moscow', deviceScaleFactor: 1 });
        const errors = []; page.on('pageerror', e => errors.push(e.message));
        await page.goto(base + (locale === 'ru' ? '/ru' : '') + (slug === 'home' ? '/' : '/work/' + slug), { waitUntil: 'networkidle' });
        await settle(page);
        const metrics = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - innerWidth,
          height: document.documentElement.scrollHeight,
          text: document.body.innerText,
          images: [...document.images].filter(i => i.currentSrc).map(i => ({ src: new URL(i.currentSrc).pathname, alt: i.alt, width: i.clientWidth, height: i.clientHeight })),
          links: [...document.querySelectorAll('a')].map(a => a.getAttribute('href')),
        }));
        const image = await page.screenshot({ path: `${root}/${pair.name}-${phase}.png`, fullPage: true });
        pair[phase] = { hash: hash(image), ...metrics, errors };
        await page.close();
      }
      pair.identicalPixels = pair.before.hash === pair.after.hash;
      pair.identicalGeometryContent = JSON.stringify({ ...pair.before, hash: '' }) === JSON.stringify({ ...pair.after, hash: '' });
      if (!pair.identicalPixels || !pair.identicalGeometryContent || pair.after.overflow || pair.after.errors.length) failures.push(pair.name);
      results.push(pair);
      fs.writeFileSync(`${root}/results.json`, JSON.stringify({ baseline: sha, results, failures }, null, 2) + '\n');
      console.log(pair.name, pair.identicalPixels ? 'pixels identical' : 'PIXEL DIFFERENCE', pair.identicalGeometryContent ? 'geometry/content identical' : 'CONTENT DIFFERENCE');
    }
  }
  // Every reviewed media entry and its actual bytes must survive unchanged.
  const beforeMedia = JSON.parse(execFileSync('git', ['show', `${sha}:src/data/vet-v2-media.json`]).toString());
  const afterMedia = JSON.parse(fs.readFileSync('src/data/vet-v2-media.json'));
  for (const [key, value] of Object.entries(beforeMedia)) {
    assert.deepEqual(afterMedia[key], value, key);
    assert.equal(hash(fs.readFileSync('public' + value.src)), value.sha256, key);
  }
  const preservation = { originalMediaEntriesAndFilesUnchanged: Object.keys(beforeMedia).length, newDocumentaryCrops: Object.keys(afterMedia).length - Object.keys(beforeMedia).length };
  fs.writeFileSync(`${root}/preservation.json`, JSON.stringify(preservation, null, 2) + '\n');
} finally { await browser.close(); }
if (failures.length) process.exitCode = 1;
