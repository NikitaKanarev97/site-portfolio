import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const root = 'audit/b2b-case-refresh/page-review';
await mkdir(root, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
for (const locale of ['en', 'ru']) {
  for (const width of [1440, 390]) {
    const viewport = { width, height: width === 1440 ? 900 : 844 };
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const path = locale === 'ru' ? '/ru/work/partner-portal' : '/work/partner-portal';
    await page.goto('http://127.0.0.1:4321' + path, { waitUntil: 'networkidle' });
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += Math.max(250, Math.floor(viewport.height * 0.75))) {
      await page.evaluate(y => window.scrollTo(0, y), y);
      await page.waitForTimeout(75);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(700);
    const checks = await page.evaluate(() => {
      const allImgs = [...document.images];
      return {
        viewportWidth: window.innerWidth, scrollWidth: document.documentElement.scrollWidth,
        missingImages: allImgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.getAttribute('src')).slice(0, 25),
        lazyImages: allImgs.filter(i => i.loading === 'lazy' && i.naturalWidth === 0).length,
        outcomeWidth: document.querySelector('.case-story__finale-body')?.getBoundingClientRect().width,
        outcomeOverflow: (() => {
          const el = document.querySelector('.case-story__finale-body');
          if (!el) return false;
          return [...el.querySelectorAll('h2,p,dd')].some(t => t.getBoundingClientRect().right > el.getBoundingClientRect().right + 1);
        })(),
      };
    });
    await page.screenshot({ path: root + '/' + locale + '-' + width + '-full.png', fullPage: true, animations: 'disabled' });
    results.push({ locale, width, ...checks });
    console.log(JSON.stringify(results[results.length - 1]));
    await page.close();
  }
}
await writeFile(root + '/checks.json', JSON.stringify(results, null, 2) + '\n');
await browser.close();
if (results.some(r => r.scrollWidth > r.viewportWidth + 1 || r.outcomeOverflow || r.missingImages.length)) {
  console.error('Visual QA checks failed');
  process.exitCode = 1;
}
