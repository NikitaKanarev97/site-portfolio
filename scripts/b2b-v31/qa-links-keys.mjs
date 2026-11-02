/**
 * Partner Portal V3.1 — links and the phone scroller keyboard path.
 *   node scripts/b2b-v31/qa-links-keys.mjs <origin>
 * Every <a href> on both locale pages is requested (internal: from <origin>;
 * external: the live URL, status recorded). On a 390 px phone each sideways
 * scroller is reached with Tab, must show a focus outline, must be described
 * by its visible state-count cue, and must scroll with ArrowRight.
 */
import { writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const { chromium } = require('playwright');
const [origin = 'http://127.0.0.1:4421'] = process.argv.slice(2);
const browser = await chromium.launch();
const result = { links: [], scrollers: [] };
try {
  for (const locale of ['en', 'ru']) {
    const path = `${locale === 'ru' ? '/ru' : ''}/work/partner-portal/`;
    const page = await (await browser.newContext()).newPage();
    await page.goto(origin + path, { waitUntil: 'networkidle' });
    const hrefs = await page.$$eval('a[href]', as => [...new Set(as.map(a => a.getAttribute('href')))]);
    for (const href of hrefs) {
      if (href.startsWith('#')) {
        const ok = await page.evaluate(id => !!document.getElementById(id), href.slice(1));
        result.links.push({ locale, href, status: ok ? 'anchor-ok' : 'anchor-missing' });
        continue;
      }
      if (/^(mailto|tel):/.test(href)) { result.links.push({ locale, href, status: 'skipped-scheme' }); continue; }
      const url = new URL(href, origin + path).href;
      const res = await page.request.get(url, { maxRedirects: 5, timeout: 20000 }).catch(e => ({ status: () => `error ${e.message.slice(0, 60)}` }));
      result.links.push({ locale, href, status: res.status() });
    }

    const phone = await (await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
    await phone.goto(origin + path, { waitUntil: 'networkidle' });
    const scrollers = phone.locator('#design-system ul.portal-family__states[tabindex="0"]');
    for (let i = 0; i < await scrollers.count(); i++) {
      const ul = scrollers.nth(i);
      await ul.scrollIntoViewIfNeeded();
      // Reach it from the previous focusable element with Tab, as a keyboard user would.
      await ul.evaluate(el => { const all = [...document.querySelectorAll('a[href], button, [tabindex="0"]')]; const prev = all[all.indexOf(el) - 1]; prev?.focus(); });
      await phone.keyboard.press('Tab');
      const focused = await ul.evaluate(el => document.activeElement === el);
      const outline = await ul.evaluate(el => `${getComputedStyle(el).outlineStyle} ${getComputedStyle(el).outlineWidth}`);
      const cue = await ul.evaluate(el => { const d = document.getElementById(el.getAttribute('aria-describedby')); return d ? { text: d.textContent.trim(), visible: getComputedStyle(d).display !== 'none' } : null; });
      const before = await ul.evaluate(el => el.scrollLeft);
      await phone.keyboard.press('ArrowRight');
      await phone.waitForTimeout(400);
      const after = await ul.evaluate(el => el.scrollLeft);
      result.scrollers.push({ locale, label: await ul.getAttribute('aria-label'), focused, outline, cue, scrolled: after > before });
    }
  }
} finally {
  await browser.close();
}
await writeFile('audit/b2b-portfolio-case-premium-v3/v3.1/logs/links-keys.json', `${JSON.stringify(result, null, 2)}\n`);
const bad = result.links.filter(l => !(l.status === 'anchor-ok' || l.status === 'skipped-scheme' || (l.status >= 200 && l.status < 400)));
console.log('links', result.links.length, 'bad', bad);
console.log(result.scrollers);
