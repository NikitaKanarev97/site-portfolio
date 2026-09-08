/** Verify the user-approved order on both homepages and the entire next-case ring. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { verifyImages } from '../../../scripts/lib/verify-images.mjs';
const require = createRequire(path.resolve(process.env.PLAYWRIGHT_REPO ?? '../b2b-dssl', 'package.json'));
const { chromium } = require('playwright');
const origin = process.env.PORTFOLIO_ORIGIN ?? 'http://127.0.0.1:4322';
const slugs = ['agent-ops-console', 'partner-portal', 'learn', 'vet-clinic', 'pawly'];
const browser = await chromium.launch({ headless: true });
const rows = [];
try {
  for (const lang of ['en', 'ru']) {
    const prefix = lang === 'ru' ? '/ru' : '';
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const width of [1440, 375]) {
      await page.setViewportSize({ width, height: 1000 });
      const response = await page.goto(`${origin}${prefix}/`, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      assert.deepEqual(await page.locator('.featured__link').evaluateAll(links => links.map(a => a.getAttribute('href'))), slugs.map(slug => `${prefix}/work/${slug}`));
      const learn = page.locator('.featured__link').nth(2);
      assert.equal(await learn.locator('h2').innerText(), 'TRASSIR Learn');
      assert.deepEqual(await verifyImages(page), []);
      assert(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth <= 1));
      await learn.click();
      await page.waitForURL(/\/work\/learn\/?$/);
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      assert.equal(await page.locator('.case-outro a').getAttribute('href'), `${prefix}/work/vet-clinic`);
      rows.push({ lang, width, homeOrder: slugs, learnClick: true, learnNext: 'vet-clinic' });
    }
    for (let i = 0; i < slugs.length; i++) {
      await page.goto(`${origin}${prefix}/work/${slugs[i]}/`, { waitUntil: 'networkidle' });
      const next = slugs[(i + 1) % slugs.length];
      const link = page.locator('.case-outro a');
      assert.equal(await link.getAttribute('href'), `${prefix}/work/${next}`);
      await link.click();
      await page.waitForURL(url => url.pathname.replace(/\/$/, '') === `${prefix}/work/${next}`);
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      rows.push({ lang, from: slugs[i], next, clicked: true });
    }
    await context.close();
  }
  await mkdir('.tmp/learn-publish', { recursive: true });
  await writeFile('.tmp/learn-publish/order.json', JSON.stringify({ status: 'pass', checkedAt: new Date().toISOString(), rows }, null, 2));
  console.log('PASS: 4 home/viewport states, third-card clicks, 10 next-case transitions.');
} finally { await browser.close(); }
