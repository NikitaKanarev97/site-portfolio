/**
 * Real-Chromium review captures of the Partner Portal case, BEFORE or AFTER.
 *   node scripts/b2b-v3/capture-page.mjs <origin> <before|after>
 *
 * Same profile for both phases: DPR 1, reduced motion OFF (motion end states),
 * fonts settled, whole page scrolled first so lazy images and once-only scroll
 * scenes finish. Writes viewport, full-page and per-section PNGs plus
 * checks.json (errors, failed requests, broken/upscaled images, overflow,
 * hidden text, links, words) under audit/b2b-portfolio-case-premium-v3/<phase>/.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const { chromium } = require('playwright');

const [origin = 'http://127.0.0.1:4410', phase = 'before'] = process.argv.slice(2);
const out = `audit/b2b-portfolio-case-premium-v3/${phase}`;
await mkdir(out, { recursive: true });
const widths = (process.env.WIDTHS ?? '1440,1024,768,390,360').split(',').map(Number);
const browser = await chromium.launch();
const checks = [];

for (const locale of ['en', 'ru']) {
  for (const width of widths) {
    const viewport = { width, height: width >= 1024 ? 900 : width >= 768 ? 1024 : 844 };
    const mobile = width < 768;
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
    const page = await context.newPage();
    const errors = [];
    const failed = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => failed.push(`failed ${r.url()}`));
    page.on('response', r => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
    const path = `${locale === 'ru' ? '/ru' : ''}/work/partner-portal/`;
    await page.goto(origin + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1600);
    const name = `${locale}-${width}`;
    await page.screenshot({ path: `${out}/${name}-viewport.png` });
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += Math.floor(viewport.height * 0.5)) {
      await page.evaluate(top => window.scrollTo(0, top), y);
      await page.waitForTimeout(160);
    }
    await page.waitForTimeout(1400);
    await page.evaluate(async () => {
      await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
    });
    // Sections: every direct section of the case in document order.
    const ids = await page.evaluate(() => [...document.querySelectorAll('.portal-case section[id], .portal-case > section')].map((s, i) => s.id || `section-${i}`));
    if (widths.length === 1 || [1440, 390].includes(width)) {
      for (const id of ids) {
        const el = page.locator(id.startsWith('section-') ? `.portal-case section >> nth=${id.split('-')[1]}` : `#${id}`).first();
        if (!(await el.count())) continue;
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await el.screenshot({ path: `${out}/${name}-section-${id}.png` }).catch(e => errors.push(`shot ${id}: ${e.message}`));
      }
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
    checks.push({
      name, path, viewport, errors, failed, sections: ids,
      ...(await page.evaluate(() => {
        const imgs = [...document.images].filter(i => i.getAttribute('src'));
        const root = document.querySelector('.portal-case');
        const offenders = [...document.querySelectorAll('.portal-case *')].filter(el => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.right > innerWidth + 1 && !el.closest('[data-overflow-ok]');
        }).slice(0, 8).map(el => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`);
        return {
          scrollWidth: document.documentElement.scrollWidth, innerWidth,
          height: document.documentElement.scrollHeight,
          overflowOffenders: offenders,
          brokenImages: imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.currentSrc || i.src),
          upscaled: imgs.filter(i => i.closest('.portal-shot') && i.clientWidth > i.naturalWidth / 2 + 1).map(i => `${i.currentSrc.split('/').slice(-2).join('/')} ${i.clientWidth}>${i.naturalWidth / 2}`),
          hiddenText: [...document.querySelectorAll('.portal-case h1, .portal-case h2, .portal-case h3, .portal-case p, .portal-case li, .portal-case dd')]
            .filter(el => el.getClientRects().length && getComputedStyle(el).opacity === '0').length,
          links: [...root.querySelectorAll('a[href]')].map(a => a.getAttribute('href')),
          words: (root?.innerText ?? '').split(/\s+/).filter(Boolean).length,
          images: imgs.length,
        };
      })),
    });
    console.log(name, JSON.stringify({ ...checks.at(-1), links: undefined, sections: undefined }));
    await context.close();
  }
}
await writeFile(`${out}/checks.json`, `${JSON.stringify(checks, null, 2)}\n`);
await browser.close();
