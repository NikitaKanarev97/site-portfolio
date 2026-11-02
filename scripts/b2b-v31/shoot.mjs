/**
 * Partner Portal V3.1 — targeted section evidence, BEFORE and AFTER alike.
 *   node scripts/b2b-v31/shoot.mjs <origin> <phase> [widths]
 *
 * Per locale and width: the first viewport and element screenshots of the
 * sections the review named (architecture, source-line stage 02, archival
 * cart, fulfillment plate, the two phone scrollers, process). Desktop details
 * are also shot at DPR 2 for the 200 % edge inspection. Reduced motion, so
 * every node is in its final state; no CSS or DOM is changed.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const { chromium } = require('playwright');
const [origin, phase, list = '1440,390,360,320'] = process.argv.slice(2);
const out = `audit/b2b-portfolio-case-premium-v3/${phase}/sections`;
await mkdir(out, { recursive: true });

const targets = {
  architecture: '#architecture .portal-arch',
  'line-stage-02': '#decision .portal-line__stage:nth-child(2)',
  'archive-cart': '#diagnosis .portal-diagnosis__row:nth-child(2)',
  fulfillment: '#fulfillment .portal-plate',
  'family-upload': '#design-system .portal-family--across:not(.portal-family--compact) >> nth=0',
  'family-plans': '#design-system .portal-family--across:not(.portal-family--compact) >> nth=1',
  process: '#process',
};

const browser = await chromium.launch();
const report = [];
try {
  for (const locale of ['en', 'ru']) {
    for (const width of list.split(',').map(Number)) {
      const mobile = width < 768;
      for (const dpr of mobile ? [2] : [1, 2]) {
        const context = await browser.newContext({ viewport: { width, height: mobile ? 844 : 900 }, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(`${origin}${locale === 'ru' ? '/ru' : ''}/work/partner-portal/`, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        const key = `${locale}-${width}${dpr === 2 && !mobile ? '@2x' : ''}`;
        if (dpr === 1 || mobile) await page.screenshot({ path: `${out}/${key}-first-view.png` });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        for (const [name, selector] of Object.entries(targets)) {
          if (name.startsWith('family') && !mobile) continue;
          const el = page.locator(selector).first();
          await el.scrollIntoViewIfNeeded();
          await el.evaluate(async node => { for (const img of node.querySelectorAll('img')) { img.loading = 'eager'; await img.decode().catch(() => {}); } });
          await el.screenshot({ path: `${out}/${key}-${name}.png`, animations: 'disabled' });
        }
        // Where the cover's product frame starts and what of it is above the fold.
        const hero = await page.evaluate(() => {
          scrollTo(0, 0);
          const img = document.querySelector('.portal-cover__stage img');
          const r = img.getBoundingClientRect();
          return { imageTop: Math.round(r.top + scrollY), imageHeight: Math.round(r.height), visibleOfImage: Math.max(0, Math.min(innerHeight, r.bottom) - r.top) };
        });
        report.push({ key, locale, width, dpr, overflow, errors, hero });
        console.log(key, 'overflow', overflow, 'hero', JSON.stringify(hero), errors.length ? errors : '');
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
  await writeFile(`${out}/report.json`, `${JSON.stringify(report, null, 2)}\n`);
}
