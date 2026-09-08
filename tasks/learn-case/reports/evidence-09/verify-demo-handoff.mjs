import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { writeFile } from 'node:fs/promises';
const require = createRequire(path.resolve(process.env.PLAYWRIGHT_REPO ?? '../b2b-dssl', 'package.json'));
const { chromium } = require('playwright');
const origin = process.env.PORTFOLIO_ORIGIN ?? 'http://127.0.0.1:4322';
const browser = await chromium.launch({ headless: true });
const rows = [];
try {
  for (const lang of ['en', 'ru']) for (const width of [375, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(`${origin}/prototypes/learn-landing/?lang=${lang}`, { waitUntil: 'networkidle' });
    const links = await page.locator('a[href^="/prototypes/learn/"]').evaluateAll(nodes => [...new Set(nodes.filter(n => n.getBoundingClientRect().width > 0).map(n => n.getAttribute('href')))]);
    assert(links.length > 0, 'Landing must offer a product entry');
    for (const href of links) {
      await page.goto(`${origin}/prototypes/learn-landing/?lang=${lang}`, { waitUntil: 'networkidle' });
      await page.locator(`a[href="${href}"]:visible`).first().click();
      await page.waitForURL(url => url.pathname.startsWith('/prototypes/learn/'));
      assert.equal(new URL(page.url()).searchParams.get('lang'), lang);
      await page.waitForLoadState('networkidle');
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      // New browser storage proves deep entry does not depend on previous locale.
      const fresh = await browser.newContext({ viewport: { width, height: 1000 } });
      const direct = await fresh.newPage();
      const response = await direct.goto(page.url(), { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      assert.equal(await direct.locator('html').getAttribute('lang'), lang);
      assert((await direct.locator('body').innerText()).length > 100);
      rows.push({ lang, width, href, final: direct.url(), reload: true, freshContext: true });
      await fresh.close();
    }
    await context.close();
  }
  await writeFile('tasks/learn-case/reports/evidence-09/demo-handoff.json', JSON.stringify({ status: 'pass', rows }, null, 2));
  console.log(`${rows.length} landing CTA clicks with product locale, reload and fresh deep entry passed`);
} finally { await browser.close(); }
