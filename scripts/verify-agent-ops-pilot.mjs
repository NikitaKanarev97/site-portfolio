/** Visual capture of the preview and the changed shared modules. */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const out = process.env.PILOT_OUT || 'research/portfolio-benchmark/shots/pilot-stage1';
const base = process.env.PILOT_BASE || 'http://127.0.0.1:4321';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const report = [];
for (const width of (process.env.PILOT_WIDTHS || '1440,1024,390').split(',').map(Number)) {
  const context = await browser.newContext({ viewport: { width, height: Number(process.env.PILOT_HEIGHT) || (width < 768 ? 844 : 900) }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${base}/preview/agent-ops-pilot/`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${out}/${width}-cover.png` });
  // Read in natural order to trigger lazy media, then take the complete page.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 650) { await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(80); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${out}/${width}-full.png`, fullPage: true });
  for (const [name, selector] of [
    ['challenge', '[aria-label="Challenge"]'],
    ['cause', '.case-steps__step:nth-child(1)'],
    ['workspace', '.case-steps__step:nth-child(2)'],
    ['approval', '.case-steps__step:nth-child(3)'],
    ['detail', '[aria-label="Detail"]'],
    ['outcome', '[aria-label="Outcome"]'],
  ]) {
    await page.locator(selector).evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 32));
    await page.waitForTimeout(150);
    await page.screenshot({ path: `${out}/${width}-${name}.png` });
  }
  report.push({ width, errors, ...(await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth,
    brokenImages: Array.from(document.images).filter(i => !i.complete || !i.naturalWidth).map(i => i.currentSrc),
    noindex: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
    totalCaseWords: Array.from(document.querySelectorAll('.pilot > .case-opening, .pilot > .case-sheet')).map(el => el.textContent).join(' ').trim().split(/\s+/).length,
    images: Array.from(document.querySelectorAll('.pilot img')).map(i => ({ src: i.currentSrc, width: i.clientWidth, height: i.clientHeight })),
  }))) });
  await page.goto(`${base}/kit/`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
  for (const [name, selector] of [['proof', '.case-opening--proof'], ['steps', '.case-steps'], ['callout', '.case-callout']]) {
    await page.locator(selector).first().evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 32));
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}/kit-${width}-${name}.png` });
  }
  await context.close();
}
writeFileSync(`${out}/verification.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
