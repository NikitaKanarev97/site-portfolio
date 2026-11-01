import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const require = createRequire(`${process.env.PLAYWRIGHT_REPO ?? 'D:/Claude-projects/b2b-dssl'}/package.json`);
const { chromium } = require('playwright');
const phase = process.argv[2] ?? 'before';
const origin = process.env.PORTFOLIO_ORIGIN ?? 'http://127.0.0.1:4412';
const root = `audit/portfolio-home-v3/stage-01/v3.1`;
await mkdir(`${root}/screenshots/${phase}`, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = { phase, origin, sha: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), browser: browser.version(), captured: new Date().toISOString(), dpr: 1, reducedMotion: 'reduce', results: [] };
try {
  for (const locale of ['en', 'ru']) for (const [width, height] of [[1440, 900], [390, 844], [360, 800], [1024, 900]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce', locale: locale === 'ru' ? 'ru-RU' : 'en-GB' });
    const page = await context.newPage();
    const errors = [], failures = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) failures.push({ url: r.url(), status: r.status() }); });
    await page.goto(`${origin}${locale === 'ru' ? '/ru/' : '/'}`, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.querySelectorAll('img[loading="eager"]')].filter(i=>!i.closest('dialog')).map(i=>i.decode().catch(()=>{})));
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    });
    const prefix = `${root}/screenshots/${phase}/${locale}-${width}`;
    await page.screenshot({ path: `${prefix}-first.png` });
    // Decode all lazy images and settle scroll-triggered content before full-page evidence.
    await page.evaluate(async () => { for (const i of document.querySelectorAll('img')) { if (!i.closest('dialog')) { i.loading = 'eager'; await i.decode().catch(() => {}); } } });
    for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += height) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(30); }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${prefix}-full.png`, fullPage: true });
    const cards = [];
    for (const card of await page.locator('#work-agent-ops-console, #work-pawly').all()) {
      const id = await card.getAttribute('id');
      await card.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      await card.screenshot({ path: `${prefix}-${id}.png` });
      cards.push(await card.evaluate(el => ({ id: el.id, text: el.innerText, html: el.outerHTML, images: [...el.querySelectorAll('img')].map(i => ({ src: i.currentSrc.replace(location.origin, ''), alt: i.alt, width: i.width, height: i.height })), links: [...el.querySelectorAll('a')].map(a => a.getAttribute('href')) })));
    }
    for (const selector of []) if (await page.locator(selector).count()) { await page.locator(selector).first().screenshot({ path: `${prefix}-${selector.replace('.', '')}.png` }); }
    await page.evaluate(() => scrollTo(0, 0));
    const metrics = await page.evaluate(() => {
      const image = document.querySelector('.agent-home img');
      const r = image.getBoundingClientRect();
      return { scrollWidth: document.documentElement.scrollWidth, viewport: innerWidth, pageHeight: document.body.scrollHeight, productTop: r.top, productVisible: Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(0, r.top)), productWidth: r.width, missing: [...document.querySelectorAll('img')].filter(i => !i.closest('dialog') && (!i.complete || !i.naturalWidth)).map(i => i.src), h1: document.querySelectorAll('h1').length };
    });
    const pawly = cards.find(c => c.id === 'work-pawly');
    report.results.push({ locale, width, height, metrics, errors, failures, cards: cards.map(c => ({ ...c, html: c.id === 'work-pawly' ? c.html : undefined })), pawlyHash: createHash('sha256').update(pawly.html).digest('hex') });
    await context.close();
  }
} finally { await browser.close(); await writeFile(`${root}/logs/${phase}-capture.json`, JSON.stringify(report, null, 2)); }
console.log(JSON.stringify(report.results.map(({locale,width,metrics,errors,failures}) => ({locale,width,...metrics,errors,failures})), null, 2));

