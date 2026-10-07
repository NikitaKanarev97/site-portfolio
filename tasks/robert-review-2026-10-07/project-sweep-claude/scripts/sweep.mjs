// Автосбор по классам SWEEP-PROMPT.md (параллельный прогон Claude).
// node sweep.mjs [port]  → logs/sweep.json, logs/text/*.md, logs/inventory.json
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire('d:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'logs');
mkdirSync(join(OUT, 'text'), { recursive: true });
const PORT = process.argv[2] || '4421';
const BASE = `http://127.0.0.1:${PORT}`;
const PATHS = ['/about/', '/work/agent-ops-console/', '/work/partner-portal/', '/work/learn/', '/work/vet-clinic/', '/work/pawly/', '/404', '/'];
const LOCS = ['en', 'ru'];
const VPS = [{ w: 1440, h: 900 }, { w: 360, h: 780 }];

const browser = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const results = [];

async function settle(page) {
  await page.addStyleTag({ content: 'astro-dev-toolbar{display:none!important}' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(3000);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(2000);
}

for (const vp of VPS) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    const copy = el => { if (el.nodeType !== 1) return; const f = el.getAttribute('data-astro-source-file'); if (f) { el.setAttribute('data-sf', f); el.setAttribute('data-sl', el.getAttribute('data-astro-source-loc') || ''); } };
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { copy(n); n.querySelectorAll && n.querySelectorAll('[data-astro-source-file]').forEach(copy); }))).observe(document, { childList: true, subtree: true });
  });
  for (const loc of LOCS) for (const p of PATHS) {
    const url = BASE + (loc === 'ru' ? '/ru' + (p === '/' ? '/' : p) : p);
    const resp = await page.goto(url, { waitUntil: 'networkidle' });
    await settle(page);
    const data = await page.evaluate(({ loc, full }) => {
      const R = {};
      const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.01; };
      const comp = el => { const c = el.closest('[data-sf]'); if (!c) return '?'; return c.getAttribute('data-sf').split('/').slice(-1)[0] + ':' + (c.getAttribute('data-sl') || ''); };
      const compName = el => comp(el).split(':')[0];
      const sel = el => { const parts = []; let e = el; for (let i = 0; i < 3 && e && e !== document.body; i++) { const cls = [...e.classList].filter(c => !c.startsWith('astro-')).slice(0, 2).join('.'); parts.unshift(e.tagName.toLowerCase() + (cls ? '.' + cls : '')); e = e.parentElement; } return parts.join('>'); };
      const box = el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
      const inMedia = el => !!el.closest('img,video,iframe,canvas,svg,picture');
      const ownText = el => [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').replace(/\s+/g, ' ').trim();
      const all = [...document.body.querySelectorAll('*')].filter(e => !e.closest('astro-dev-toolbar,script,style,noscript,template'));
      const textEls = all.filter(e => ownText(e) && vis(e) && !inMedia(e));
      const t = el => ownText(el).slice(0, 60);
      const main = document.querySelector('main') || document.body;

      // inventory
      const inv = {};
      document.querySelectorAll('[data-sf]').forEach(e => {
        const f = e.getAttribute('data-sf').split('/').slice(-1)[0];
        const parent = e.parentElement?.closest('[data-sf]');
        if (parent && parent.getAttribute('data-sf') === e.getAttribute('data-sf')) return;
        inv[f] = (inv[f] || 0) + 1;
      });
      R.inventory = inv;

      // T1
      R.T1 = [];
      for (const e of textEls) {
        const s = getComputedStyle(e), fs = parseFloat(s.fontSize), ls = s.letterSpacing === 'normal' ? 0 : parseFloat(s.letterSpacing) / fs;
        const txt = ownText(e); const why = [];
        if (/mono/i.test(s.fontFamily)) why.push('mono');
        if ((s.textTransform === 'uppercase' || (/[A-ZА-Я]{3}/.test(txt) && txt === txt.toUpperCase())) && ls > 0.04 && fs <= 13) why.push('caps-tracked');
        if (/^\d{2}\b/.test(txt)) why.push('num');
        if (txt.split('·').length >= 3) why.push('dot-chain');
        if (why.length) R.T1.push({ why, text: t(e), fs, ff: s.fontFamily.split(',')[0], comp: comp(e), sel: sel(e), ...box(e) });
      }
      // T2: small text per section
      R.T2 = [];
      const sections = [...main.querySelectorAll('section, [data-section], header, footer')].filter(vis);
      for (const sec of sections) {
        const small = textEls.filter(e => sec.contains(e) && parseFloat(getComputedStyle(e).fontSize) <= 14 && !e.closest('nav'));
        const sub = [...sec.querySelectorAll('section')].length;
        if (small.length > 6 && sub === 0) R.T2.push({ comp: comp(sec), sel: sel(sec), n: small.length, y: box(sec).y, texts: small.slice(0, 14).map(x => t(x)) });
      }
      // T2 duplicates caption vs heading
      R.T2dup = [];
      const norm = s => s.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').split(/\s+/).filter(Boolean);
      const sim = (a, b) => { const A = new Set(norm(a)), B = new Set(norm(b)); if (!A.size || !B.size) return 0; let i = 0; A.forEach(x => B.has(x) && i++); return i / Math.min(A.size, B.size); };
      const caps = textEls.filter(e => e.matches('figcaption, figcaption *, [class*=caption], [class*=caption] *, [class*=label], [class*=eyebrow]'));
      const heads = textEls.filter(e => e.matches('h1,h2,h3,h4,p'));
      for (const c of caps) {
        const ct = ownText(c); if (ct.split(' ').length < 2) continue;
        const near = heads.filter(h => h !== c && Math.abs(box(h).y - box(c).y) < 700);
        for (const h of near) { const s = sim(ct, ownText(h)); if (s >= 0.7) { R.T2dup.push({ cap: ct.slice(0, 60), other: ownText(h).slice(0, 60), sim: +s.toFixed(2), comp: comp(c) }); break; } }
      }
      // T3
      R.T3 = [];
      const GL = /[\u2190-\u21FF\u2300-\u23FF\u25A0-\u27BF\u{1F300}-\u{1FAFF}\uFE0F©®™‖✓✔]/u;
      for (const e of all) {
        if (inMedia(e) && !e.matches('img,svg')) continue;
        const srcs = [['text', ownText(e)], ['alt', e.getAttribute('alt')], ['aria', e.getAttribute('aria-label')], ['title', e.getAttribute('title')],
          ['before', getComputedStyle(e, '::before').content], ['after', getComputedStyle(e, '::after').content]];
        for (const [k, v] of srcs) if (v && v !== 'none' && v !== 'normal' && GL.test(v)) R.T3.push({ k, text: v.slice(0, 60), comp: comp(e), sel: sel(e), visible: vis(e) });
      }
      // T4: controls-like decor & hints
      R.T4 = [];
      for (const e of textEls) { const tx = ownText(e); if (/^(copy|copied|click|tap|play|pause|scroll|drag|swipe|нажмите|скопир|листайте|прокрут)/i.test(tx) || /click to|tap to|нажмите,? чтобы/i.test(tx)) R.T4.push({ text: tx.slice(0, 60), tag: e.tagName, comp: comp(e), sel: sel(e) }); }
      main.querySelectorAll('[class*=play],[class*=pause],[class*=dot],[class*=chevron],[class*=toggle]').forEach(e => { if (vis(e) && !e.closest('a,button')) R.T4.push({ text: '(decor) ' + e.className.toString().slice(0, 60), comp: comp(e), sel: sel(e) }); });
      // media
      const media = [...main.querySelectorAll('img,picture>img,video')].filter(vis).filter(m => box(m).w > 120);
      const parseC = c => { const m = c.match(/[\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 0]; };
      const opaque = c => { const v = parseC(c); return c.startsWith('rgb') && (v.length < 4 || v[3] > 0.9); };
      const bgOf = el => { let e = el; while (e) { const b = getComputedStyle(e).backgroundColor; if (opaque(b)) return { el: e, bg: b }; e = e.parentElement; } return { el: document.body, bg: 'rgb(255,255,255)' }; };
      const dE = (a, b) => { const x = parseC(a), y = parseC(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
      const bodyBg = getComputedStyle(document.body).backgroundColor;
      const deco = s => ({ bg: s.backgroundColor, bd: s.borderTopWidth !== '0px' ? s.borderTopWidth + ' ' + s.borderTopColor : '', rad: s.borderRadius, sh: s.boxShadow !== 'none' ? 'shadow' : '', pad: s.paddingTop });
      R.C1 = []; R.C2 = []; R.media = [];
      for (const m of media) {
        const mb = box(m), ms = getComputedStyle(m), wrap = m.parentElement.tagName === 'PICTURE' ? m.parentElement.parentElement : m.parentElement;
        const ws = getComputedStyle(wrap);
        const mediaFramed = ms.borderRadius !== '0px' || ms.borderTopWidth !== '0px' || ws.borderRadius !== '0px' || ws.borderTopWidth !== '0px' || ms.boxShadow !== 'none' || ws.boxShadow !== 'none';
        R.media.push({ src: (m.currentSrc || m.src || '').split('/').slice(-1)[0].slice(0, 60), comp: comp(m), ...mb });
        // C1: ancestor with bg/border and padding>=12 where media >=70% area
        let a = wrap, depth = 0;
        while (a && a !== main && depth < 6) {
          const s = getComputedStyle(a), ab = box(a);
          const pad = Math.max(...['Top', 'Right', 'Bottom', 'Left'].map(k => parseFloat(s['padding' + k])));
          const decorated = opaque(s.backgroundColor) || s.borderTopWidth !== '0px' || s.boxShadow !== 'none';
          if (decorated && pad >= 12 && (mb.w * mb.h) / (ab.w * ab.h) >= 0.7 && mediaFramed) {
            R.C1.push({ src: R.media.at(-1).src, comp: comp(a), sel: sel(a), container: deco(s), media: deco(ms), wrap: deco(ws), depth, ...ab }); break;
          }
          a = a.parentElement; depth++;
        }
        // C2
        const ob = bgOf(m.parentElement);
        const framed = ms.borderTopWidth !== '0px' || ms.boxShadow !== 'none' || ws.borderTopWidth !== '0px' || ws.boxShadow !== 'none';
        if (dE(ob.bg, bodyBg) < 3 && !framed) R.C2.push({ src: R.media.at(-1).src, comp: comp(m), bg: ob.bg, sel: sel(ob.el), ...mb });
      }
      // L1: grid/flex groups
      R.L1 = [];
      main.querySelectorAll('*').forEach(g => {
        const s = getComputedStyle(g); if (!/grid|flex/.test(s.display) || s.flexDirection === 'column') return;
        const kids = [...g.children].filter(vis).filter(k => k.querySelector('img,video,picture') || /card|shot|panel|tile/i.test(k.className));
        if (kids.length < 2) return;
        const rows = {}; kids.forEach(k => { const b = box(k); const key = Math.round(b.y / 200); (rows[key] ||= []).push(b); });
        const tops = kids.map(k => box(k).y), lefts = kids.map(k => box(k).x);
        if (new Set(lefts).size < kids.length) return; // stacked — not a row
        const spread = Math.max(...tops) - Math.min(...tops);
        if (spread > 8) R.L1.push({ comp: comp(g), sel: sel(g), spread, tops, n: kids.length });
      });
      // L2
      R.L2 = [];
      const hs = [...main.querySelectorAll('h1,h2,h3')].filter(vis);
      for (const h of hs) {
        const fs = parseFloat(getComputedStyle(h).fontSize); const hb = h.getBoundingClientRect();
        let nxt = null, best = 1e9;
        main.querySelectorAll('p,img,video,figure,ul,div,a').forEach(e => { if (h.contains(e) || e.contains(h) || !vis(e)) return; const r = e.getBoundingClientRect(); const d = r.top - hb.bottom; if (d >= -1 && d < best && r.left < hb.right && r.right > hb.left) { best = d; nxt = e; } });
        if (nxt) R.L2.push({ h: h.tagName, text: ownText(h).slice(0, 50) || h.innerText.slice(0, 50), fs, gap: Math.round(best), next: sel(nxt), comp: comp(h), flag: fs >= 48 && best < 32 });
      }
      const secs = [...main.children].flatMap(c => c.tagName === 'SECTION' || c.matches('[class*=section]') ? [c] : [...c.children]).filter(vis);
      R.sections = secs.map(s => ({ comp: comp(s), sel: sel(s), ...box(s), pt: getComputedStyle(s).paddingTop, pb: getComputedStyle(s).paddingBottom, mt: getComputedStyle(s).marginTop }));
      // L5
      R.L5 = [];
      main.parentElement.querySelectorAll('*').forEach(e => {
        if (!vis(e) || inMedia(e)) return; const s = getComputedStyle(e); const b = box(e);
        const pw = (e.parentElement?.getBoundingClientRect().width) || 1;
        const sides = []; if (parseFloat(s.borderTopWidth) >= 1 && s.borderTopStyle !== 'none') sides.push('top'); if (parseFloat(s.borderBottomWidth) >= 1 && s.borderBottomStyle !== 'none') sides.push('bottom');
        const boxed = parseFloat(s.borderLeftWidth) >= 1 && s.borderLeftStyle !== 'none';
        if ((e.tagName === 'HR' || (sides.length && !boxed)) && b.w / pw >= 0.5 && b.w > 200) R.L5.push({ tag: e.tagName, sides, comp: comp(e), sel: sel(e), color: s.borderTopColor, y: b.y, w: b.w });
      });
      // H1
      R.H = [...document.querySelectorAll('h1,h2,h3,h4,[class*=ds-heading]')].filter(vis).map(h => { const s = getComputedStyle(h); return { tag: h.tagName, cls: [...h.classList].filter(c => !c.startsWith('astro')).join(' ').slice(0, 60), text: h.innerText.replace(/\s+/g, ' ').slice(0, 50), fs: s.fontSize, fw: s.fontWeight, lh: s.lineHeight, comp: comp(h), y: box(h).y }; });
      // K1
      R.K1 = [...document.querySelectorAll('a,button')].filter(vis).map(a => {
        const s = getComputedStyle(a), lab = a.querySelector('.ds-link__label'), ls = lab ? getComputedStyle(lab) : null;
        const inPara = !!a.closest('p') && a.closest('p').innerText.length > a.innerText.length + 20;
        return { text: a.innerText.replace(/\s+/g, ' ').slice(0, 40), aria: a.getAttribute('aria-label'), href: a.getAttribute('href'), cls: [...a.classList].filter(c => !c.startsWith('astro')).join(' ').slice(0, 60), deco: s.textDecorationLine, bb: s.borderBottomWidth !== '0px' ? s.borderBottomWidth : '', bgimg: s.backgroundImage !== 'none' ? 'y' : '', labDeco: ls ? ls.textDecorationLine + (ls.backgroundImage !== 'none' ? '+bgimg' : '') + (ls.borderBottomWidth !== '0px' ? '+bb' : '') : '', svg: !!a.querySelector('svg'), color: s.color, inPara, comp: comp(a), h: Math.round(a.getBoundingClientRect().height), w: Math.round(a.getBoundingClientRect().width), y: box(a).y };
      });
      // X1
      R.X1 = [];
      for (const e of textEls) { const tx = ownText(e); if (loc === 'en' && /[А-Яа-яЁё]/.test(tx)) R.X1.push({ text: tx.slice(0, 60), comp: comp(e), sel: sel(e) }); if (loc === 'ru' && /[A-Za-z]+[ ,.-]+[A-Za-z]+[ ,.-]+[A-Za-z]+/.test(tx) && !/[А-Яа-я]/.test(tx)) R.X1.push({ text: tx.slice(0, 60), comp: comp(e), sel: sel(e) }); }
      for (const e of all) for (const k of ['alt', 'aria-label', 'title']) { const v = e.getAttribute(k); if (!v) continue; if (loc === 'en' && /[А-Яа-я]/.test(v)) R.X1.push({ attr: k, text: v.slice(0, 60), comp: comp(e) }); if (loc === 'ru' && v.length > 8 && !/[А-Яа-я]/.test(v)) R.X1.push({ attr: k, text: v.slice(0, 60), comp: comp(e) }); }
      if (loc === 'ru' && !/[А-Яа-я]/.test(document.title)) R.X1.push({ attr: 'document.title', text: document.title });
      // X2
      R.X2 = []; R.years = [];
      const ST = /concept|концепт|pet[- ]?project|пет-проект|учебн\S* проект|hypothes|гипотез|\bdemo|демо|demonstration|демонстрац|reconstruct|реконструкц|reinterpret|переосмысл|not live|not deployed|не внедр|лишь прототип|only a prototype|not a real|не настоящ|synthetic|синтетич|fictional|вымышл|mock data/i;
      const pool = [...textEls.map(e => ['text', ownText(e), comp(e)])];
      all.forEach(e => ['alt', 'aria-label', 'title'].forEach(k => e.getAttribute(k) && pool.push([k, e.getAttribute(k), comp(e)])));
      document.querySelectorAll('meta[content]').forEach(m => pool.push(['meta:' + (m.getAttribute('property') || m.getAttribute('name')), m.content, 'head']));
      document.querySelectorAll('script[type="application/ld+json"]').forEach(s => pool.push(['jsonld', s.textContent, 'head']));
      pool.push(['title', document.title, 'head']);
      for (const [k, v, c] of pool) {
        const m = v.match(ST); if (m) { const i = v.search(ST); R.X2.push({ k, hit: m[0], ctx: v.slice(Math.max(0, i - 50), i + 60).replace(/\s+/g, ' '), comp: c }); }
        for (const y of v.matchAll(/\b20\d\d\b/g)) R.years.push({ k, y: y[0], ctx: v.slice(Math.max(0, y.index - 40), y.index + 30).replace(/\s+/g, ' '), comp: c });
      }
      // R1
      R.R1 = { scrollW: document.documentElement.scrollWidth, innerW: innerWidth, over: [], small: [], clipped: [] };
      all.forEach(e => { if (!vis(e)) return; const r = e.getBoundingClientRect(); if (r.right > innerWidth + 1 && !e.closest('[class*=carousel],[class*=scroll],[style*=overflow]')) { let p = e.parentElement, clipped = false; while (p) { const o = getComputedStyle(p).overflowX; if (o !== 'visible') { clipped = true; break; } p = p.parentElement; } if (!clipped) R.R1.over.push({ sel: sel(e), comp: comp(e), right: Math.round(r.right) }); } });
      document.querySelectorAll('a,button').forEach(a => { if (!vis(a)) return; const r = a.getBoundingClientRect(); if (r.height < 44 && !(a.closest('p') && a.closest('p').innerText.length > a.innerText.length + 20)) R.R1.small.push({ text: a.innerText.replace(/\s+/g, ' ').slice(0, 30) || a.getAttribute('aria-label'), h: Math.round(r.height), w: Math.round(r.width), comp: comp(a) }); });
      textEls.forEach(e => { const s = getComputedStyle(e); if ((s.overflow === 'hidden' || s.textOverflow === 'ellipsis') && e.scrollWidth > e.clientWidth + 1) R.R1.clipped.push({ text: t(e), comp: comp(e) }); });

      // text dump
      if (full) {
        const lines = [];
        const walker = document.createTreeWalker(main, NodeFilter.SHOW_ELEMENT);
        let n; while ((n = walker.nextNode())) {
          if (n.matches('img') && n.alt) lines.push(`[alt] ${n.alt}`);
          if (n.closest('svg,script,style')) continue;
          const tx = ownText(n); if (!tx || !vis(n)) continue;
          const tag = n.tagName.toLowerCase();
          const pre = /^h[1-4]$/.test(tag) ? '#'.repeat(+tag[1]) + ' ' : n.closest('figcaption,[class*=caption],[class*=label],[class*=eyebrow],[class*=meta]') ? '[cap] ' : n.closest('a,button') ? '[link] ' : '';
          lines.push(pre + tx);
        }
        R.textDump = lines.join('\n');
        R.meta = { title: document.title, desc: document.querySelector('meta[name=description]')?.content, og: document.querySelector('meta[property="og:title"]')?.content, ogd: document.querySelector('meta[property="og:description"]')?.content, lang: document.documentElement.lang, h: document.body.scrollHeight, bodyFont: getComputedStyle(document.body).fontFamily };
      }
      return R;
    }, { loc, full: vp.w === 1440 });
    const key = `${p === '/' ? 'home' : p.replace(/\/work\//, '').replace(/\//g, '') || 'home'}-${loc}-${vp.w}`;
    if (data.textDump) { writeFileSync(join(OUT, 'text', key.replace('-1440', '') + '.md'), `<!-- ${url} -->\n` + JSON.stringify(data.meta, null, 1) + '\n\n' + data.textDump); delete data.textDump; }
    results.push({ key, url, status: resp.status(), ...data });
    console.log(key, resp.status(), 'T1', data.T1.length, 'T3', data.T3.length, 'C1', data.C1.length, 'C2', data.C2.length, 'L5', data.L5.length, 'X2', data.X2.length, 'R1', data.R1.scrollW > data.R1.innerW ? 'OVERFLOW' : 'ok');
  }
  await ctx.close();
}
await browser.close();
writeFileSync(join(OUT, 'sweep.json'), JSON.stringify(results, null, 1));
console.log('saved', results.length);
