/**
 * Real-browser review captures of the case page, BEFORE or AFTER.
 *   PW=<playwright> node scripts/b2b-v2/capture-page.mjs <origin> <before|after>
 * Scrolls the whole page first so lazy images load and once-only scroll
 * scenes finish, then waits for every image before the viewport and
 * full-page shots. Writes checks.json next to the PNGs.
 */
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PW ?? 'playwright');

const [origin = 'http://127.0.0.1:4391', phase = 'after'] = process.argv.slice(2);
const out = process.env.QA_OUT ?? `audit/b2b-case-v2/qa/${phase}`;
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const checks = [];
for (const locale of ['en', 'ru']) {
  for (const width of [1440, 390]) {
    const viewport = { width, height: width === 1440 ? 900 : 844 };
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const failed = [];
    page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });
    const path = (locale === 'ru' ? '/ru' : '') + '/work/partner-portal';
    await page.goto(origin + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    const name = `${locale}-${width}`;
    await page.screenshot({ path: `${out}/${name}-viewport.png` });
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += Math.floor(viewport.height * 0.6)) {
      await page.evaluate(y => window.scrollTo(0, y), y);
      await page.waitForTimeout(220);
    }
    await page.waitForTimeout(1500);
    await page.evaluate(async () => {
      await Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; })));
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
    // Closeups of the cover and three editorial modules (AFTER only).
    for (const [slug, selector] of [['cover', '.portal-cover'], ['decision', '#decision'], ['commerce', '#commercial-review'], ['fulfillment', '#fulfillment']]) {
      const el = page.locator(selector);
      if (!(await el.count())) continue;
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await el.screenshot({ path: `${out}/closeup-${name}-${slug}.png` });
    }
    checks.push({
      name, path, errors, failed,
      ...(await page.evaluate(() => {
        const imgs = [...document.images].filter(i => i.getAttribute('src'));
        const words = (document.querySelector('.portal-case')?.innerText ?? '').split(/\s+/).filter(Boolean).length;
        return {
          scrollWidth: document.documentElement.scrollWidth, innerWidth,
          height: document.documentElement.scrollHeight,
          brokenImages: imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.currentSrc || i.src),
          upscaled: imgs.filter(i => i.closest('.portal-shot') && i.clientWidth > i.naturalWidth / 2 + 1).map(i => `${i.currentSrc.split('/').slice(-2).join('/')} ${i.clientWidth}>${i.naturalWidth / 2}`),
          hiddenText: [...document.querySelectorAll('.portal-case h1, .portal-case h2, .portal-case p')].filter(el => getComputedStyle(el).opacity === '0').length,
          prototypeLinks: [...document.querySelectorAll('a[href*="b2b-partner-portal"]')].map(a => a.href),
          words,
        };
      })),
    });
    console.log(name, JSON.stringify(checks.at(-1)).slice(0, 300));
    await context.close();
  }
}
await writeFile(`${out}/checks.json`, JSON.stringify(checks, null, 2));
await browser.close();
