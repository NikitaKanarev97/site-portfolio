/** Compact, real Chromium V2.1 comparison matrix. PW points to Playwright. */
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PW ?? 'playwright');
const [origin = 'http://127.0.0.1:4391', phase = 'before'] = process.argv.slice(2);
const out = `audit/b2b-case-v21/${phase}`;
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const checks = [];
for (const locale of ['en', 'ru']) for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 900 : 844 }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  for (const route of ['home', 'case']) {
    const path = (locale === 'ru' ? '/ru' : '') + (route === 'home' ? '/' : '/work/partner-portal');
    await page.goto(origin + path, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach(i => i.loading = 'eager');
      await document.fonts.ready;
      await Promise.all([...document.images].filter(i => i.getAttribute('src')).map(i => i.decode().catch(() => {})));
    });
    const name = `${locale}-${width}`;
    if (route === 'home') {
      await page.locator('#work-partner-portal').scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
      await page.locator('#work-partner-portal').screenshot({ path: `${out}/${name}-home.png` });
    } else {
      await page.screenshot({ path: `${out}/${name}-viewport.png` });
      await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
      for (const [key, sel] of [['hero', '.portal-cover'], ['commerce', '#commercial-review']]) {
        await page.locator(sel).screenshot({ path: `${out}/${name}-${key}.png` });
      }
    }
    checks.push({ locale, width, route, errors: [...errors], ...await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      broken: [...document.images].filter(i => i.getAttribute('src') && (!i.complete || !i.naturalWidth)).map(i => i.src),
      height: document.documentElement.scrollHeight,
      heroHeight: document.querySelector('.portal-cover')?.getBoundingClientRect().height,
      upscaled: [...document.querySelectorAll('.portal-shot img')].filter(i => i.clientWidth > i.naturalWidth / 2 + 1).map(i => i.src),
      cards: [...document.querySelectorAll('.featured-case')].map(e => ({ id:e.id, images:[...e.querySelectorAll('img')].map(i => i.currentSrc) })),
    })) });
  }
  await page.close();
}
await browser.close();
await writeFile(`${out}/checks.json`, JSON.stringify(checks, null, 2));
console.log(JSON.stringify(checks.map(({cards, ...c}) => c), null, 2));
if (checks.some(c => c.overflow || c.broken.length || c.errors.length || c.upscaled.length)) process.exitCode = 1;
