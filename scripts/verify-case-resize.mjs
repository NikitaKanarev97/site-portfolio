/** Short windows, 360px flow and responsive scene ownership on a single live page. */
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const browser = await require('playwright').chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = []; const samples = [];
page.on('pageerror', e => errors.push(e.message));
try {
  await page.goto('http://127.0.0.1:4321/preview/agent-ops-pilot/', { waitUntil: 'networkidle' });
  for (const [width, height] of [[1440,900], [1024,900], [390,844], [360,780], [1440,600], [1440,900]]) {
    await page.setViewportSize({ width, height }); await page.waitForTimeout(1600);
    samples.push(await page.evaluate(() => ({ width: innerWidth, height: innerHeight,
      ...window.__dsMotionDebug(), overflow: document.documentElement.scrollWidth > innerWidth,
      coverPosition: getComputedStyle(document.querySelector('.case-opening')).position,
      masks: document.querySelectorAll('.ds-split-line').length,
    })));
    if (width === 1440 && height === 600) {
      const step = page.locator('.case-steps__step').first();
      await step.evaluate(el => scrollTo(0, (el.closest('.pin-spacer') || el).getBoundingClientRect().top + scrollY));
      await page.waitForTimeout(400);
      const reading = await step.evaluate(el => ({ height: el.offsetHeight, position: getComputedStyle(el).position }));
      if (reading.height <= 600 || reading.position === 'fixed') throw new Error('Tall step pins before its bottom is read');
      await page.screenshot({ path: 'research/portfolio-benchmark/shots/pilot-stage3/1440-short-cause.png' });
      await page.evaluate(() => scrollTo(0,0));
    }
  }
  if (samples.some(s => s.overflow || s.duplicateScenes || s.pins !== (s.width >= 1440 ? 2 : 0))) throw new Error('Responsive acceptance failed');
  if (samples.at(-1).triggers > samples[0].triggers || errors.length) throw new Error('Scenes accumulated on resize');
} finally {
  writeFileSync('outputs/agent-ops-stage3-resize.json', JSON.stringify({ samples, errors }, null, 2));
  await browser.close();
}
console.log(samples);
