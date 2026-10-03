/** G-01: the real source outline survives alpha capture and the portfolio renderer. */
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
const out = 'tasks/portfolio-rebuild/integration';
mkdirSync(out + '/shots', { recursive: true });
const base = process.argv.find(v => v.startsWith('--base='))?.slice(7) || 'http://127.0.0.1:4352';
const captures = JSON.parse(readFileSync('tasks/portfolio-rebuild/common/captures.json'));
const failures = [], alpha = [], profiles = [];
for (const capture of captures.media) {
  const { data, info } = await sharp('public' + capture.file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const corners = [0, info.width - 1, (info.height - 1) * info.width, info.height * info.width - 1].map(i => data[i * 4 + 3]);
  const entry = { file: capture.file, corners, bleed: capture.bleed };
  alpha.push(entry);
  if (corners.some(v => v !== 0) || capture.bleed !== 2) failures.push(entry);
}
const require = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const browser = await require('playwright').chromium.launch({ executablePath: process.env.COMMON_CHROME || 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
try {
  for (const route of ['/kit/', '/preview/common/en/partner-portal/', '/preview/common/ru/partner-portal/']) {
    for (const width of [1440, 1024, 390, 360]) for (const mode of ['reduce', 'no-js']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', javaScriptEnabled: mode !== 'no-js' });
      const page = await context.newPage(), errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const sheet = page.locator('.case-specimen').last();
      for (const img of await sheet.locator('img').all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(e => e.decode()); }
      const state = await sheet.evaluate(el => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        states: [...el.querySelectorAll('[data-specimen-state]')].map(state => {
          const screen = state.querySelector('.case-screen'), css = getComputedStyle(screen), img = screen.querySelector('img');
          return { id: state.dataset.specimenState, radius: css.borderRadius, shadow: css.boxShadow, overflow: css.overflow, broken: !img.complete || !img.naturalWidth };
        }),
      }));
      const profile = { route, width, mode, errors, ...state }; profiles.push(profile);
      if (errors.length || state.overflow > 0 || state.states.length !== 13 || state.states.some(s => s.broken || s.radius !== '0px' || s.shadow !== 'none' || s.overflow !== 'visible')) failures.push(profile);
      if (mode === 'reduce' && route.includes('/en/') && [1440, 390].includes(width)) {
        for (const [set, state] of [['availability', 'stale'], ['upload', 'empty'], ['resolution', 'ambiguous']]) {
          const el = sheet.locator(`[data-specimen-set="${set}"] [data-specimen-state="${state}"]`);
          await el.scrollIntoViewIfNeeded();
          await el.screenshot({ path: `${out}/shots/corners-${set}-${width}.png` });
        }
      }
      await context.close();
    }
  }
} finally { await browser.close(); }
writeFileSync(out + '/corners-verification.json', JSON.stringify({ base, alpha, profiles, failures }, null, 2));
console.log(JSON.stringify({ captures: alpha.length, profiles: profiles.length, failures: failures.length }));
if (failures.length) process.exitCode = 1;
