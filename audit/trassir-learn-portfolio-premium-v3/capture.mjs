/** Actual Chromium evidence. Run from repo root; normal motion, no DOM styling. */
import { mkdir, writeFile } from 'node:fs/promises';
import { observeLifecycle, preparePage, waitForMotion, imageInventory } from './v3.1/settled.mjs';
const { chromium } = await import(process.env.PW ?? 'playwright');
const [phase, origin, extra] = process.argv.slice(2);
if (!['before', 'after'].includes(phase) || !origin) throw Error('capture.mjs before|after http://host [responsive]');
// Preserve the original reference pack; corrected evidence has its own versioned path.
const out = `audit/trassir-learn-portfolio-premium-v3/v3.1/${phase}`;
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const checks = [];
const widths = extra ? [320, 360] : [1440, 390];
for (const width of widths) for (const locale of ['en', 'ru']) {
  const viewport = { width, height: width < 768 ? 844 : 900 };
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });
  const page = await context.newPage(), errors = [], failed = [], consoleErrors = [];
  await observeLifecycle(page);
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  await page.goto(`${origin}${locale === 'ru' ? '/ru' : ''}/work/learn/`, { waitUntil: 'networkidle' });
  const lifecycle = await preparePage(page);
  const name = `${locale}-${width}`;
  await page.screenshot({ path: `${out}/${name}-viewport.png` });
  await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
  if (!extra) for (const id of ['learn-cover', 'problem', 'shared-material', 'reference-path', 'guided-path', 'completion', 'workspace', 'assessment', 'recovery', 'outcome']) {
    const el = page.locator(`#${id}`);
    if (!await el.count()) continue;
    await el.scrollIntoViewIfNeeded();
    await waitForMotion(page, '.learn-case');
    await el.screenshot({ path: `${out}/${name}-${id}.png` });
  }
  checks.push({ name, viewport, deviceScaleFactor: 1, reducedMotion: 'no-preference', errors, failed, consoleErrors, lifecycle,
    ...await page.evaluate(imageInventory),
    ...await page.evaluate(() => ({ language: document.documentElement.lang, height: document.documentElement.scrollHeight, scrollWidth: document.documentElement.scrollWidth,
      images: [...document.querySelectorAll('.learn-case img')].map(i => ({ source: new URL(i.currentSrc).pathname, renderedWidth: i.width, nativeWidth: i.naturalWidth })),
      headings: [...document.querySelectorAll('.learn-case h1, .learn-case h2')].map(h => h.textContent.trim())
    })) });
  console.log(`${name}: height=${checks.at(-1).height}, overflow=${checks.at(-1).scrollWidth - width}, errors=${errors.length}, HTTP failures=${failed.length}`);
  await context.close();
}
await writeFile(`${out}/${extra ? 'responsive-' : ''}checks.json`, JSON.stringify(checks, null, 2));
await browser.close();
if (checks.some(c => c.errors.length || c.failed.length || c.consoleErrors.length || c.missing.length || c.scrollWidth > c.viewport.width)) process.exitCode = 1;
