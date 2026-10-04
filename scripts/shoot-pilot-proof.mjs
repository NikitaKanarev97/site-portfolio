import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const out = 'public/media/pilot-agent-ops';
const sources = 'research/portfolio-benchmark/shots/pilot-stage1/sources';
mkdirSync(out, { recursive: true });
mkdirSync(sources, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
for (const width of [1440, 390]) {
  const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: width === 390 ? 3 : 2 });
  const page = await context.newPage();
  for (const [name, route, role] of [
    ['queue', '/screens/review-queue', 'Martin K.'],
    ['run', '/screens/run-detail?run=run-cl-promo-01', 'Martin K.'],
    ['approval', '/screens/consequence-preview', 'Priya S.'],
  ]) {
    await page.goto('http://127.0.0.1:5300/', { waitUntil: 'networkidle' });
    await page.locator('[data-track="shell:role-switch"]').first().click();
    await page.getByRole('menuitem', { name: new RegExp(role) }).first().click();
    await page.evaluate(to => { history.pushState(null, '', to); dispatchEvent(new PopStateEvent('popstate')); }, route);
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: '* { scrollbar-width: none !important; } *::-webkit-scrollbar { display: none !important; }' });
    await page.waitForTimeout(1800);
    if (name === 'queue') await page.getByText('Yesterday ·', { exact: false }).waitFor();
    await sharp(await page.screenshot()).webp({ quality: 94 }).toFile(`${sources}/${name}-${width}.webp`);
    const boxes = await page.locator('section, [class*="clusters"], [class*="clusterSection"], [class*="previewGrid"], [class*="evidence"], [class*="trace"]').evaluateAll(els => els.map(el => ({ tag: el.tagName, cls: el.className, label: el.getAttribute('aria-label'), text: el.textContent?.slice(0, 80), box: el.getBoundingClientRect().toJSON() })));
    writeFileSync(`${sources}/${name}-${width}-boxes.json`, JSON.stringify(boxes, null, 2));
    const save = async (selector, file) => {
      await page.evaluate(() => { document.querySelectorAll('*').forEach(el => { if (el.scrollTop) el.scrollTop = 0; }); window.scrollTo(0, 0); });
      // Screenshot scrolls tall nodes into view; sticky shell must not cover them.
      const style = '[class*="toolbar"], [class*="topStrip"], [class*="contextBar"], [class*="verdictBar"] { visibility: hidden !important; }' +
        (name === 'run' && width === 390 ? '* { overflow: visible !important; }' : '');
      await sharp(await page.locator(selector).first().screenshot({ style })).webp({ quality: 94 }).toFile(`${out}/${file}-${width}.webp`);
    };
    if (name === 'queue') await save('section:has-text("REASON CLUSTERS")', 'clusters');
    if (name === 'run') {
      await save('[class*="transcriptPane"]', 'transcript');
      await save('[class*="tracePane"]', 'evidence');
      if (width === 1440) {
        await page.setViewportSize({ width: 1440, height: 1200 });
        await sharp(await page.screenshot()).webp({ quality: 94 }).toFile(`${out}/run-context.webp`);
        await page.setViewportSize({ width: 1440, height: 900 });
      }
    }
    if (name === 'approval') {
      await save('[class*="previewGrid"]', 'consequences');
      await save('[aria-label="Approval consequence preview"] > [class*="root"]', 'approval-card');
    }
    console.log(name, width, 'captured');
  }
  await context.close();
}
await browser.close();
