/** Two whole ConsequencePreview DOM panels, with transparent outer corners. */
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const browser = await require('playwright').chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: width === 390 ? 3 : 2 });
  await page.goto('http://127.0.0.1:5300/', { waitUntil: 'networkidle' });
  await page.locator('[data-track="shell:role-switch"]').first().click();
  await page.getByRole('menuitem', { name: /Priya S\./ }).first().click();
  await page.evaluate(() => { history.pushState(null, '', '/screens/consequence-preview'); dispatchEvent(new PopStateEvent('popstate')); });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  await page.evaluate(() => { document.querySelectorAll('aside').forEach(el => el.style.visibility = 'hidden'); });
  const panels = page.locator('[class*="previewGrid"] > *');
  for (const [i, name] of ['payout', 'message'].entries()) {
    const panel = panels.nth(i);
    const bounds = await panel.boundingBox();
    // Element screenshots include the ancestors behind rounded corners and
    // fractional bounding-box edges. Clear only those backdrops during capture;
    // the panel keeps its own background, border and native antialiasing.
    const backdrops = await panel.evaluate(el => {
      const saved = [];
      for (let ancestor = el.parentElement; ancestor; ancestor = ancestor.parentElement) {
        saved.push(ancestor.getAttribute('style'));
        ancestor.style.setProperty('background', 'transparent', 'important');
        ancestor.style.setProperty('box-shadow', 'none', 'important');
      }
      return saved;
    });
    let shot;
    try {
      shot = await panel.screenshot({ omitBackground: true });
    } finally {
      await panel.evaluate((el, saved) => {
        let ancestor = el.parentElement;
        for (const style of saved) {
          if (style === null) ancestor.removeAttribute('style');
          else ancestor.setAttribute('style', style);
          ancestor = ancestor.parentElement;
        }
      }, backdrops);
    }
    await sharp(shot).webp({ quality: 94, alphaQuality: 100 }).toFile(`public/media/pilot-agent-ops/${name}-${width}.webp`);
    writeFileSync(`research/portfolio-benchmark/shots/pilot-stage1/sources/${name}-${width}-bounds.json`, JSON.stringify(bounds,null,2));
  }
  await page.close();
}
await browser.close();
