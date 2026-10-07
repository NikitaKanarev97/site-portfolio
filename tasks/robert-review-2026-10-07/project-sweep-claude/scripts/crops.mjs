// Кропы кандидатов: элементы ищутся в живой странице, кадр — скриншот элемента (≤900×600 после resize), склейка в листы.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire('d:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const sharp = require('d:/Claude-projects/Site-portfolio/node_modules/sharp');
const EV = join(dirname(fileURLToPath(import.meta.url)), '..', 'evidence');
const B = 'http://127.0.0.1:4421';
// [id, path, width, selector, index, pad, mode]
const JOBS = JSON.parse(process.env.JOBS);
const SHEET = process.env.SHEET;
const browser = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const out = [];
const ctxs = {};
for (const [id, path, w, sel, idx = 0, pad = 24, opts = {}] of JOBS) {
  const key = w + (opts.reduce ? 'r' : '');
  ctxs[key] ||= await browser.newContext({ viewport: { width: w, height: w > 400 ? 900 : 780 }, reducedMotion: opts.reduce ? 'reduce' : 'no-preference' });
  const page = await ctxs[key].newPage();
  await page.goto(B + path, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'astro-dev-toolbar{display:none!important}' });
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(3000);
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } });
  await page.waitForTimeout(2000);
  let buf;
  if (opts.scrollTo !== undefined) {
    await page.evaluate(y => window.scrollTo(0, y), opts.scrollTo); await page.waitForTimeout(1200);
    buf = await page.screenshot();
  } else if (opts.focus) {
    await page.evaluate(() => window.scrollTo(0, 0));
    const shots = [];
    for (let i = 0; i < 80; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(60); if (await page.evaluate(s => document.activeElement?.matches(s), opts.focus)) break; }
    await page.evaluate(() => document.activeElement.scrollIntoView({ block: 'center' })); await page.waitForTimeout(500);
    const r = await page.evaluate(() => { const b = document.activeElement.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height, t: document.activeElement.innerText?.slice(0, 30) }; });
    buf = await page.screenshot({ clip: { x: Math.max(0, r.x - 40), y: Math.max(0, r.y - 40), width: Math.min(w - Math.max(0, r.x - 40), r.w + 80), height: r.h + 80 } });
  } else {
    const el = page.locator(sel).nth(idx);
    try { await el.scrollIntoViewIfNeeded({ timeout: 5000 }); } catch { console.log("MISS", id); await page.close(); continue; } await page.waitForTimeout(800);
    const r = await el.boundingBox();
    if (!r) { console.log('MISS', id); await page.close(); continue; }
    const vh = w > 400 ? 900 : 780;
    buf = await page.screenshot({ clip: { x: Math.max(0, r.x - pad), y: Math.max(0, r.y - pad), width: Math.min(w, r.width + 2 * pad), height: Math.min(r.height + 2 * pad, vh * 3) }, fullPage: true });
  }
  await page.close();
  const f = join(EV, `${id}.png`);
  await sharp(buf).resize({ width: 900, height: 600, fit: 'inside', withoutEnlargement: true }).png().toFile(f);
  out.push({ id, f });
  console.log('crop', id);
}
await browser.close();
// склейка 2 колонки
const tiles = await Promise.all(out.map(async o => ({ ...o, m: await sharp(o.f).metadata() })));
const CW = 780, comps = []; let y = 0;
for (let i = 0; i < tiles.length; i += 2) {
  const row = tiles.slice(i, i + 2); let rh = 0;
  for (let j = 0; j < row.length; j++) {
    const t = row[j]; const s = Math.min(1, CW / t.m.width); const img = await sharp(t.f).resize({ width: Math.round(t.m.width * s) }).toBuffer(); const h = Math.round(t.m.height * s);
    comps.push({ input: Buffer.from(`<svg width="${CW}" height="30"><text x="2" y="22" font-size="20" font-family="Arial" fill="#c00">${t.id}</text></svg>`), left: j * (CW + 20), top: y });
    comps.push({ input: img, left: j * (CW + 20), top: y + 30 }); rh = Math.max(rh, h + 40);
  }
  y += rh;
}
await sharp({ create: { width: 2 * CW + 20, height: y, channels: 3, background: '#999' } }).composite(comps).png().toFile(join(EV, SHEET));
console.log('sheet', SHEET, y);
