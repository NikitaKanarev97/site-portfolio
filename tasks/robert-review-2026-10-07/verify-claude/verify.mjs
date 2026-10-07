// Независимая приёмка FIXES.md M01–M46 по собранной версии (preview 4425).
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const out = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(out, 'text'), { recursive: true });
mkdirSync(join(out, 'shots'), { recursive: true });
const base = 'http://127.0.0.1:4425';
const paths = ['/about/', '/work/agent-ops-console/', '/work/partner-portal/', '/work/learn/', '/work/vet-clinic/', '/work/pawly/', '/404', '/'];
const routes = [];
for (const p of paths) for (const loc of ['en', 'ru']) {
  const u = loc === 'en' ? p : (p === '/404' ? '/ru/404' : '/ru' + p);
  routes.push({ key: (p.replace(/\//g, '-').replace(/^-|-$/g, '') || 'home') + '-' + loc, url: u });
}
const browser = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const res = [];
for (const w of [1440, 360]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  for (const r of routes) {
    const page = await ctx.newPage();
    const resp = await page.goto(base + r.url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(500);
    const d = await page.evaluate((w) => {
      const vis = el => { const s = getComputedStyle(el); const b = el.getBoundingClientRect(); return s.visibility !== 'hidden' && s.display !== 'none' && b.width > 1 && b.height > 1 && !el.closest('.ds-visually-hidden,[hidden],[aria-hidden="true"]'); };
      const own = el => [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
      const comp = el => { const c = el.closest('[class*="case-"],[class*="meta-"],[class*="navbar"],[class*="footer"],section'); return c ? (c.className.baseVal ?? c.className).toString().split(' ')[0] : '?'; };
      const all = [...document.querySelectorAll('body *')].filter(el => !['SCRIPT', 'STYLE', 'svg', 'SVG'].includes(el.tagName) && !el.closest('svg'));
      const caps = [], arrows = [], nums = [], hiddenArrows = [];
      for (const el of all) {
        const t = own(el); if (!t) continue;
        const s = getComputedStyle(el);
        if (!vis(el)) { if (/[→←↓↑]/.test(t)) hiddenArrows.push(t.slice(0, 60)); continue; }
        if (s.textTransform === 'uppercase' && /[a-zа-я]/i.test(t)) caps.push({ t: t.slice(0, 40), fs: s.fontSize, ls: s.letterSpacing, c: comp(el) });
        if (/[→←↓↑]/.test(t)) arrows.push({ t: t.slice(0, 60), c: comp(el), tag: el.tagName });
        if (/^\s*0\d(\s*[·.]|\s*$)/.test(t)) nums.push({ t: t.slice(0, 40), c: comp(el) });
      }
      const text = all.filter(el => vis(el) && own(el)).map(el => own(el)).join('\n');
      const hiddenText = [...document.querySelectorAll('.ds-visually-hidden')].map(e => e.textContent.trim()).join('\n');
      const alts = [...document.querySelectorAll('img[alt]')].map(i => i.alt).filter(Boolean);
      const sectionsAria = [...document.querySelectorAll('section[aria-label]')].map(s => s.getAttribute('aria-label'));
      const slugAria = sectionsAria.filter(a => /^[a-z0-9]+(-[a-z0-9]+)+$/.test(a));
      // links / targets
      const targets = [];
      for (const el of document.querySelectorAll('a[href],button')) {
        if (!vis(el)) continue; const b = el.getBoundingClientRect();
        const inPara = el.closest('p') && el.closest('p').textContent.trim().length > el.textContent.trim().length + 5;
        if (!inPara && (b.height < 44 || b.width < 24)) targets.push({ t: (el.textContent.trim() || el.getAttribute('aria-label') || '').slice(0, 40), h: Math.round(b.height), w: Math.round(b.width), c: comp(el) });
      }
      const underlined = [...document.querySelectorAll('a[href]')].filter(a => vis(a) && !(a.closest('p') && a.closest('p').textContent.trim().length > a.textContent.trim().length + 5)).filter(a => { const s = getComputedStyle(a); const cs = [...a.querySelectorAll('*')].map(x => getComputedStyle(x).textDecorationLine); return s.textDecorationLine.includes('underline') || cs.some(x => x.includes('underline')); }).map(a => ({ t: a.textContent.trim().slice(0, 40), c: comp(a) }));
      const q = sel => [...document.querySelectorAll(sel)].filter(vis);
      const sz = el => el ? getComputedStyle(el).fontSize + '/' + getComputedStyle(el).fontWeight : null;
      const cover = document.querySelector('.case-opening');
      const title = cover && cover.querySelector('.case-opening__title');
      const lead = cover && cover.querySelector('[data-h="lead"]');
      const tb = title && title.getBoundingClientRect(), lb = lead && lead.getBoundingClientRect();
      const firstP = [...document.querySelectorAll('main p')].find(p => vis(p) && p.textContent.trim().length > 80 && !p.closest('.case-opening'));
      const dashed = q('*').filter(el => getComputedStyle(el).borderTopStyle === 'dashed' && !el.closest('svg')).map(el => comp(el));
      const frames = q('.case-screen--frame').length;
      const nextCase = document.querySelector('[class*="case-next"]');
      const nextLinks = nextCase ? [...nextCase.querySelectorAll('a')].filter(vis).map(a => a.textContent.trim().slice(0, 40)) : [];
      const marquee = nextCase ? nextCase.querySelectorAll('[class*="marquee"]').length : 0;
      const nextTitleRepeat = nextCase ? (nextCase.textContent.match(/(Pawly|Agent Ops|Partner Portal|TRASSIR|Vet Clinic)/g) || []).length : 0;
      return {
        h: document.body.scrollHeight, overflow: document.documentElement.scrollWidth > innerWidth,
        caps, arrows, hiddenArrows: hiddenArrows.length, hiddenArrowSample: hiddenArrows.slice(0, 3), nums, slugAria, targets, underlined,
        stopSymbol: document.querySelectorAll('.case-steps__stop-symbol').length,
        stopText: [...document.querySelectorAll('[class*="stop"]')].map(e => e.textContent.trim()).filter(Boolean).slice(0, 3),
        frames, dashed: [...new Set(dashed)],
        coverTitle: sz(title), coverLead: sz(lead), leadRight: tb && lb ? lb.left > tb.right - 10 : null, leadBelow: tb && lb ? lb.top >= tb.bottom - 5 : null,
        firstParaTop: firstP ? Math.round(firstP.getBoundingClientRect().top + scrollY) : null,
        coverH: cover ? Math.round(cover.getBoundingClientRect().height) : null,
        h1: sz(document.querySelector('h1')), h2s: [...new Set(q('main h2').map(sz))], stepThesis: [...new Set(q('.case-steps__thesis').map(sz))],
        nextLinks, marquee, nextTitleRepeat,
        brandAria: document.querySelector('.navbar__brand')?.getAttribute('aria-label'),
        title: document.title, lang: document.documentElement.lang,
        firstH: q('main h1,main h2').slice(0, 3).map(e => e.textContent.trim().slice(0, 40)),
        specimenH: q('[class*="case-specimen"]').filter(e => e.className.toString().startsWith('case-specimen ')).map(e => Math.round(e.getBoundingClientRect().height)),
        sectionHeights: q('main > section, main section[id]').map(s => [s.id, Math.round(s.getBoundingClientRect().height)]).filter(x => x[0]),
        calloutLines: q('[class*="case-callout"] line, [class*="case-callout__leader"], [class*="case-callout__line"]').length,
        text, hiddenText, alts,
      };
    }, w);
    d.status = resp.status();
    writeFileSync(join(out, 'text', `${r.key}-${w}.txt`), `# ${r.url} ${w}\n\n${d.text}\n\n## hidden\n${d.hiddenText}\n\n## alt\n${d.alts.join('\n')}\n`);
    if (w === 1440 || r.key.startsWith('work') ) await page.screenshot({ path: join(out, 'shots', `${r.key}-${w}.jpg`), fullPage: true, type: 'jpeg', quality: 60 });
    delete d.text; delete d.hiddenText;
    res.push({ key: r.key, w, url: r.url, ...d });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
writeFileSync(join(out, 'verify.json'), JSON.stringify(res, null, 1));
console.log('done', res.length);
