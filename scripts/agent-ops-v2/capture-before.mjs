import { mkdir, writeFile } from 'node:fs/promises';

const { chromium } = await import(process.env.PW ?? 'playwright');

const origin = process.argv[2] ?? 'http://127.0.0.1:4395';
const out = 'audit/agent-ops-v2/before';
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const locale of ['en', 'ru']) {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({
        viewport: { width, height: width === 1440 ? 900 : 844 },
        deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768,
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const prefix = locale === 'ru' ? '/ru' : '';
      const name = `${locale}-${width}`;
      await page.goto(`${origin}${prefix}/work/agent-ops-console`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1800);
      await page.screenshot({ path: `${out}/${name}-viewport.png` });
      for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 600) {
        await page.evaluate(y => scrollTo(0, y), y);
        await page.waitForTimeout(180);
      }
      await page.waitForTimeout(1000);
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
      results.push({ name, errors, ...(await page.evaluate(() => ({
        path: location.pathname, scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: innerWidth,
        brokenImages: [...document.images].filter(i => i.getAttribute('src') && (!i.complete || !i.naturalWidth)).map(i => i.currentSrc),
      }))) });
      await page.goto(`${origin}${prefix}/`, { waitUntil: 'networkidle' });
      const card = page.locator('.featured-case').filter({ has: page.locator('a[href$="/work/agent-ops-console"]') }).first();
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1800);
      await card.screenshot({ path: `${out}/${name}-home.png` });
      await context.close();
      console.log(`${name}: captured case and home`);
    }
  }
  await writeFile(`${out}/checks.json`, JSON.stringify({ origin, baseline: 'b7a4051', results }, null, 2));
} finally {
  await browser.close();
}
