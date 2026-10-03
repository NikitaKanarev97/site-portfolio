/** Whole real DOM panels + the source product's missing surrounding field.
 * Presentation-only capture: no changes to product files or panel content.
 */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, copyFileSync } from 'node:fs';
import sharp from 'sharp';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const browser = await require('playwright').chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const out = 'public/media/pilot-agent-ops';
const audit = 'research/portfolio-benchmark/shots/pilot-art-direction/panel-insets';
mkdirSync(audit, { recursive: true });
const measurements = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: width === 390 ? 3 : 2 });
    for (const [name, route, selector] of [
      ['clusters', '/screens/review-queue', 'section:has-text("REASON CLUSTERS")'],
      ['transcript', '/screens/run-detail?run=run-cl-promo-01', '[class*="transcriptPane"]'],
    ]) {
      await page.goto('http://127.0.0.1:5300/', { waitUntil: 'networkidle' });
      await page.locator('[data-track="shell:role-switch"]').first().click();
      await page.getByRole('menuitem', { name: /Martin K\./ }).first().click();
      await page.evaluate(to => { history.pushState(null, '', to); dispatchEvent(new PopStateEvent('popstate')); }, route);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1800);
      await page.addStyleTag({ content: '* { scrollbar-width: none !important; } *::-webkit-scrollbar { display: none !important; }' });
      if (width === 390 && name === 'transcript') await page.addStyleTag({ content: '* { overflow: visible !important; }' });
      const panel = page.locator(selector).first();
      const before = await panel.evaluate(el => ({ text: el.textContent, width: el.getBoundingClientRect().width }));
      const source = `${out}/${name}-${width}.webp`;
      // First capture is preserved once as the feedback comparison.
      const { existsSync } = await import('node:fs');
      if (!existsSync(`${audit}/before-${name}-${width}.webp`)) copyFileSync(source, `${audit}/before-${name}-${width}.webp`);
      const measured = await panel.evaluate((el, narrow) => {
        const original = el.getBoundingClientRect();
        const wrapper = document.createElement('div');
        wrapper.dataset.captureField = 'true';
        const token = narrow ? '--space-2xl' : '--space-3xl';
        const style = getComputedStyle(el);
        const inset = parseFloat(style.getPropertyValue(token));
        wrapper.style.cssText = `position:relative;flex:none;box-sizing:content-box;width:${original.width}px;padding:var(${token});background:var(--surface-page);`;
        el.before(wrapper); wrapper.append(el);
        el.style.width = `${original.width}px`;
        // Retain the product's cascade even if tokens are scoped to this node.
        wrapper.style.backgroundColor = style.getPropertyValue('--surface-page');
        const box = wrapper.getBoundingClientRect(), inner = el.getBoundingClientRect();
        return { token, inset, width: box.width, height: box.height, contentWidth: inner.width,
          left: inner.left - box.left, top: inner.top - box.top,
          right: box.right - inner.right, bottom: box.bottom - inner.bottom };
      }, width === 390);
      const after = await panel.evaluate(el => ({ text: el.textContent, width: el.getBoundingClientRect().width }));
      if (before.text !== after.text || Math.abs(before.width - after.width) > 0.1) throw new Error(`Panel changed: ${name}/${width}`);
      if (![measured.left, measured.top, measured.right, measured.bottom].every(n => Math.abs(n - measured.inset) < 0.1)) throw new Error(`Unequal insets: ${name}/${width}`);
      const style = '[class*="toolbar"], [class*="topStrip"], [class*="contextBar"], [class*="verdictBar"] { visibility: hidden !important; }';
      const encoded = await sharp(await page.locator('[data-capture-field]').screenshot({ style })).webp({ quality: 94 }).toBuffer();
      const framed = `${out}/${name}-framed-${width}.webp`;
      writeFileSync(framed, encoded);
      copyFileSync(framed, `${audit}/after-${name}-${width}.webp`);
      measurements.push({ name, viewport: width, unchangedText: true, unchangedContentWidth: true, ...measured });
      console.log(name, width, measured);
    }
    await page.close();
  }
  writeFileSync(`${audit}/measurements.json`, JSON.stringify(measurements, null, 2));
} finally { await browser.close(); }
