// Съёмка участков главной: old (kanarev.com) vs local (dev 4410), EN/RU, 1440/360.
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire('d:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');

const OUT = process.env.REVIEW_OUT || 'D:/Claude-projects/Site-portfolio/tasks/robert-review-2026-10-07/claude-review/results/evidence';
const SITES = { old: 'https://kanarev.com', local: process.env.REVIEW_BASE || 'http://127.0.0.1:4410' };
const only = process.argv[2]; // optional: old|local
const widths = (process.argv[3] || '1440,360').split(',').map(Number);
const reduced = process.argv[4] === 'reduced';
const SECTIONS = {
  nav: '.navbar', hero: '.hero',
  agent: '#work-agent-ops-console', portal: '#work-partner-portal', learn: '#work-learn',
  vet: '#work-vet-clinic', pawly: '#work-pawly',
  dev: '.dev', about: 'section.about', contact: '#contact', footer: '.footer',
};

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe',
});
const metrics = {};
for (const [site, base] of Object.entries(SITES)) {
  if (only && only !== site) continue;
  for (const loc of ['en', 'ru']) {
    for (const w of widths) {
      const ctx = await browser.newContext({ viewport: { width: w, height: w > 500 ? 900 : 780 }, deviceScaleFactor: 1, reducedMotion: reduced ? 'reduce' : 'no-preference' });
      const page = await ctx.newPage();
      const url = base + (loc === 'ru' ? '/ru/' : '/');
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.addStyleTag({ content: 'astro-dev-toolbar{display:none!important}' }).catch(()=>{}); await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(3000); // intro
      // прокрутить всю страницу, чтобы сработали scroll-анимации
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 300) { await page.evaluate((yy) => scrollTo(0, yy), y); await page.waitForTimeout(120); }
      await page.waitForTimeout(2500);
      const tag = `${site}-${loc}-${w}${reduced ? '-rm' : ''}`;
      for (const [name, sel] of Object.entries(SECTIONS)) {
        const el = page.locator(sel).first();
        if (!(await el.count())) continue;
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(900);
        await el.screenshot({ path: `${OUT}/${tag}-${name}.png`, animations: 'disabled' }).catch((e) => console.log('ERR', tag, name, e.message));
      }
      metrics[tag] = await page.evaluate((SECTIONS) => {
        const cs = (el) => el ? getComputedStyle(el) : null;
        const pick = (el) => { if (!el) return null; const s = cs(el); const r = el.getBoundingClientRect();
          return { text: el.innerText?.slice(0, 200), font: s.fontFamily.slice(0, 60), size: s.fontSize, weight: s.fontWeight, lh: s.lineHeight, td: s.textDecorationLine, w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x) }; };
        const out = { url: location.href, scrollW: document.documentElement.scrollWidth, innerW: innerWidth, sections: {} };
        for (const [n, sel] of Object.entries(SECTIONS)) {
          const el = document.querySelector(sel); if (!el) continue;
          const r = el.getBoundingClientRect();
          out.sections[n] = { top: Math.round(r.top + scrollY), h: Math.round(r.height), text: el.innerText.replace(/\s+/g, ' ').slice(0, 900) };
        }
        out.caseTitles = [...document.querySelectorAll('.featured-case h2, .featured-case h3')].map(pick);
        out.sectionHeads = [...document.querySelectorAll('.section-head h2, .contact h2')].map(pick);
        out.heroH1 = pick(document.querySelector('.hero h1'));
        out.footer = [...document.querySelectorAll('.footer *')].filter(e => e.children.length === 0 && e.innerText?.trim()).map(pick);
        out.monoEls = [...document.querySelectorAll('body *')].filter(e => e.children.length === 0 && e.innerText?.trim() && /mono/i.test(getComputedStyle(e).fontFamily)).map(e => e.innerText.trim().slice(0, 60)).slice(0, 60);
        out.links = [...document.querySelectorAll('.featured-case a, .contact a, .hero a, .hero button, .contact button')].map(a => { const s = getComputedStyle(a); return { text: a.innerText.replace(/\s+/g, ' ').trim().slice(0, 60), href: a.getAttribute('href'), td: s.textDecorationLine, color: s.color, bb: s.borderBottomWidth + ' ' + s.borderBottomStyle }; });
        out.emojiish = (document.body.innerText.match(/[\u2190-\u21FF\u2600-\u27BF\u{1F300}-\u{1FAFF}\uFE0F©]/gu) || []).join('');
        return out;
      }, SECTIONS);
      await ctx.close();
      console.log('done', tag);
    }
  }
}
await writeFile(process.env.REVIEW_METRICS || `${OUT}/../logs/metrics-${only || 'all'}${reduced ? '-rm' : ''}-${widths.join('_')}.json`, JSON.stringify(metrics, null, 1));
await browser.close();
