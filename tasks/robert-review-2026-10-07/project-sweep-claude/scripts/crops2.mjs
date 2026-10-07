// Кропы из evidence/raw/<key>.png по координатам элемента в документе (то же состояние, scrollY=0).
// JOBS: [[id, rawKey, path, width, selector, index, pad, maxH]]
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire('d:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const sharp = require('d:/Claude-projects/Site-portfolio/node_modules/sharp');
const EV = join(dirname(fileURLToPath(import.meta.url)), '..', 'evidence');
const JOBS = JSON.parse(process.env.JOBS), SHEET = process.env.SHEET;
const browser = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const ctx = {}; const pages = {};
const out = [];
for (const [id, raw, path, w, sel, idx = 0, pad = 24, maxH = 1400] of JOBS) {
  const pk = w + path;
  if (!pages[pk]) {
    ctx[w] ||= await browser.newContext({ viewport: { width: w, height: w > 400 ? 900 : 780 } });
    const page = await ctx[w].newPage();
    await page.goto('http://127.0.0.1:4421' + path, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: 'astro-dev-toolbar{display:none!important}' });
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(3000);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(2000);
    pages[pk] = page;
  }
  const r = await pages[pk].evaluate(([sel, idx]) => { const e = document.querySelectorAll(sel)[idx]; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left, y: b.top + scrollY, w: b.width, h: b.height }; }, [sel, idx]);
  if (!r) { console.log('MISS', id, sel); continue; }
  const src = join(EV, 'raw', raw + '.png'); const m = await sharp(src).metadata();
  const left = Math.max(0, Math.round(r.x - pad)), top = Math.max(0, Math.round(r.y - pad));
  const width = Math.min(m.width - left, Math.round(r.w + 2 * pad)), height = Math.min(m.height - top, Math.round(Math.min(r.h + 2 * pad, maxH)));
  const f = join(EV, id + '.png');
  await sharp(src).extract({ left, top, width, height }).resize({ width: 900, height: 600, fit: 'inside', withoutEnlargement: true }).png().toFile(f);
  out.push({ id, f }); console.log('crop', id, Math.round(r.y), Math.round(r.h));
}
await browser.close();
const tiles = await Promise.all(out.map(async o => ({ ...o, m: await sharp(o.f).metadata() })));
const CW = 780, comps = []; let y = 0;
for (let i = 0; i < tiles.length; i += 2) {
  const row = tiles.slice(i, i + 2); let rh = 0;
  for (let j = 0; j < row.length; j++) {
    const t = row[j]; const s = Math.min(1, CW / t.m.width); const h = Math.round(t.m.height * s);
    comps.push({ input: Buffer.from(`<svg width="${CW}" height="30"><text x="2" y="22" font-size="20" font-family="Arial" fill="#c00">${t.id}</text></svg>`), left: j * (CW + 20), top: y });
    comps.push({ input: await sharp(t.f).resize({ width: Math.round(t.m.width * s) }).toBuffer(), left: j * (CW + 20), top: y + 30 }); rh = Math.max(rh, h + 40);
  }
  y += rh;
}
await sharp({ create: { width: 2 * CW + 20, height: y, channels: 3, background: '#999' } }).composite(comps).png().toFile(join(EV, SHEET));
console.log('sheet', SHEET, y);
