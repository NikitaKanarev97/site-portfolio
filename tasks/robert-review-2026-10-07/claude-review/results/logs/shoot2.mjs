// Полная главная (уменьшенная), cover полных кейсов, focus, reduced-motion.
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
const require = createRequire('d:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const sharp = createRequire('d:/Claude-projects/Site-portfolio/package.json')('sharp');
const OUT = 'D:/Claude-projects/Site-portfolio/tasks/robert-review-2026-10-07/claude-review/results/evidence';
const SITES = { old: 'https://kanarev.com', local: 'http://127.0.0.1:4410' };
const CASES = ['agent-ops-console', 'partner-portal', 'learn', 'vet-clinic', 'pawly'];
const b = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const log = {};

async function open(base, path, w, rm = false) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 500 ? 900 : 780 }, reducedMotion: rm ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage();
  await p.goto(base + path, { waitUntil: 'networkidle', timeout: 60000 });
  await p.addStyleTag({ content: 'astro-dev-toolbar{display:none!important}' }).catch(() => {});
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(2500);
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) { await p.evaluate((yy) => scrollTo(0, yy), y); await p.waitForTimeout(100); }
  await p.waitForTimeout(2000);
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(800);
  return { ctx, p };
}

// 1. Полная главная EN 1440 → уменьшенная склейка
for (const [site, base] of Object.entries(SITES)) {
  const { ctx, p } = await open(base, '/', 1440);
  const buf = await p.screenshot({ fullPage: true, animations: 'disabled' });
  await sharp(buf).resize(480).png().toFile(`${OUT}/${site}-en-1440-home-full-small.png`);
  log[`${site}-home-hr`] = await p.evaluate(() => [...document.querySelectorAll('.featured-case, .featured-case *')].filter(e => { const s = getComputedStyle(e); return (parseFloat(s.borderTopWidth) > 0 && s.borderTopStyle !== 'none' && e.getBoundingClientRect().height < 4) || e.tagName === 'HR'; }).length);
  log[`${site}-sections`] = await p.evaluate(() => [...document.querySelectorAll('main > section, .featured-case')].map(s => { const r = s.getBoundingClientRect(); const cs = getComputedStyle(s); return (s.id || s.className.split(' ').slice(-1)[0]) + ` top=${Math.round(r.top + scrollY)} h=${Math.round(r.height)} pt=${cs.paddingTop} mt=${cs.marginTop}`; }));
  await ctx.close();
}

// 2. Cover полных кейсов EN 1440 (первый экран) и Agent cover в reduced-motion
for (const [site, base] of Object.entries(SITES)) {
  for (const c of CASES) {
    const { ctx, p } = await open(base, `/work/${c}/`, 1440);
    await p.screenshot({ path: `${OUT}/${site}-en-1440-case-${c}-top.png` });
    log[`${site}-case-${c}`] = await p.evaluate(() => ({ title: document.title, desc: document.querySelector('meta[name=description]')?.content, og: document.querySelector('meta[property="og:image"]')?.content, ogd: document.querySelector('meta[property="og:description"]')?.content, scrollW: document.documentElement.scrollWidth, pauseGlyph: /‖|❚❚|\u23F8/.test(document.body.innerText) }));
    await ctx.close();
  }
}
for (const [site, base] of Object.entries(SITES)) {
  const { ctx, p } = await open(base, '/work/agent-ops-console/', 1440, true);
  await p.screenshot({ path: `${OUT}/${site}-en-1440-rm-case-agent-ops-console-top.png` });
  await ctx.close();
}
// 3. reduced-motion: Agent-превью на главной (локально и старое)
for (const [site, base] of Object.entries(SITES)) {
  const { ctx, p } = await open(base, '/', 1440, true);
  const el = p.locator('#work-agent-ops-console'); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
  await el.screenshot({ path: `${OUT}/${site}-en-1440-rm-agent.png` });
  await ctx.close();
}
// 4. Focus: Tab до Read the case (Agent, тёмный) и до email в контактах; hover Read the case Portal
{
  const { ctx, p } = await open(SITES.local, '/', 1440);
  const cta = p.locator('#work-agent-ops-console .featured-case__cta');
  await cta.focus(); await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab');
  await cta.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
  await p.locator('#work-agent-ops-console').screenshot({ path: `${OUT}/local-en-1440-focus-agent-cta.png` });
  const pc = p.locator('#work-partner-portal .featured-case__cta');
  await pc.scrollIntoViewIfNeeded(); await pc.hover(); await p.waitForTimeout(500);
  const box = await pc.boundingBox();
  await p.screenshot({ path: `${OUT}/local-en-1440-hover-portal-cta.png`, clip: { x: box.x - 40, y: box.y - 30, width: box.width + 80, height: box.height + 60 } });
  const mail = p.locator('#contact a[href^=mailto]');
  await mail.focus(); await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab'); await p.waitForTimeout(300);
  await p.locator('#contact').screenshot({ path: `${OUT}/local-en-1440-focus-contact.png` });
  const copy = p.locator('.hero .copy-email__button');
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: SITES.local });
  await copy.scrollIntoViewIfNeeded(); await copy.click(); await p.waitForTimeout(500);
  log.copy = { clip: await p.evaluate(() => navigator.clipboard.readText().catch(e => 'ERR ' + e.message)), state: await p.locator('.hero .copy-email').innerText() };
  const hb = await p.locator('.hero .copy-email').boundingBox();
  await p.screenshot({ path: `${OUT}/local-en-1440-hero-copy-clicked.png`, clip: { x: hb.x - 260, y: hb.y - 20, width: hb.width + 300, height: hb.height + 40 } });
  await ctx.close();
}
// 5. Mobile menu 360 local
{
  const { ctx, p } = await open(SITES.local, '/', 360);
  const btn = p.locator('.navbar button').first();
  log.menuBtn = await btn.evaluate(e => { const r = e.getBoundingClientRect(); return { w: r.width, h: r.height, text: e.innerText, expanded: e.getAttribute('aria-expanded') }; });
  await btn.click(); await p.waitForTimeout(800);
  log.menuAfter = await btn.getAttribute('aria-expanded');
  await p.screenshot({ path: `${OUT}/local-en-360-menu-open.png` });
  await ctx.close();
}
await writeFile(`${OUT}/../logs/shoot2.json`, JSON.stringify(log, null, 1));
await b.close();
console.log('ok');
