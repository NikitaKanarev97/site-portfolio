import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PW ?? 'playwright');
const [phase = 'after', origin = 'http://127.0.0.1:4405'] = process.argv.slice(2);
const out = `audit/trassir-learn-case-v2/qa/${phase}`;
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const checks = [];
for (const locale of ['en', 'ru']) for (const width of [1440, 390]) {
  const viewport = { width, height: width === 1440 ? 900 : 844 };
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });
  const page = await context.newPage();
  const errors = [], failed = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  await page.goto(`${origin}${locale === 'ru' ? '/ru' : ''}/work/learn/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2800);
  const name = `${locale}-${width}`;
  await page.screenshot({ path: `${out}/${name}-viewport.png` });
  for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 550) {
    await page.evaluate(y => scrollTo(0, y), y);
    await page.waitForTimeout(170);
  }
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; });
    await Promise.race([Promise.all([...document.images].map(i => i.decode().catch(() => {}))), new Promise(r => setTimeout(r, 7000))]);
  });
  await page.waitForTimeout(1200);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
  if (phase === 'after') for (const id of ['learn-cover', 'shared-material', 'guided-path', 'workspace', 'assessment']) {
    const el = page.locator(`#${id}`);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await el.screenshot({ path: `${out}/${name}-${id}.png` });
  }
  checks.push({ name, errors, failed, ...await page.evaluate(() => ({
    path: location.pathname, viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight, language: document.documentElement.lang,
    brokenImages: [...document.images].filter(i => i.getAttribute('src') && (!i.complete || !i.naturalWidth)).map(i => i.currentSrc),
    fontsLoaded: document.fonts.check('500 20px Onest'),
    headings: [...document.querySelectorAll('main h1, main h2')].map(h => h.textContent.trim()),
    links: [...document.querySelectorAll('main a')].map(a => a.getAttribute('href')),
  })) });
  console.log(`${name}: ${checks.at(-1).height}px; errors=${errors.length}; failed=${failed.length}`);
  await context.close();
}
await writeFile(`${out}/checks.json`, JSON.stringify(checks, null, 2));
await browser.close();
