/** Geometry acceptance for shared frames, stage fields and breakpoint layouts.
 * Usage: node scripts/verify-responsive-spacing.mjs [origin] [widths]
 */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
let playwright;
try { playwright = await import('playwright'); }
catch { playwright = createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright'); }
const engine = process.env.SPACING_BROWSER ?? 'chromium';
const origin = process.argv[2] ?? 'http://127.0.0.1:4475';
const widths = (process.argv[3] ?? '360,390,430,600,767,768,820,1023,1024,1280,1440').split(',').map(Number);
const dir = 'tmp/responsive-spacing';
mkdirSync(dir, { recursive: true });
const paths = ['/', '/about/', ...['agent-ops-console', 'partner-portal', 'learn', 'vet-clinic', 'pawly'].map(slug => `/work/${slug}/`)];
const browser = await playwright[engine].launch(engine === 'chromium' ? { executablePath: process.env.HARMONY_CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe' } : {});
const report = { origin, engine, widths, checks: [], failures: [], runtimeErrors: [] };
try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => report.runtimeErrors.push({ width, message: error.message }));
    for (const locale of ['en', 'ru']) for (const path of paths) {
      const route = `${locale === 'ru' ? '/ru' : ''}${path}`;
      const response = await page.goto(`${origin}${route}`, { waitUntil: 'load' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map(image => { image.loading = 'eager'; return image.decode().catch(() => {}); }));
      });
      const geometry = await page.evaluate(() => {
        const failures = [];
        const rect = node => node.getBoundingClientRect();
        const close = (a, b) => Math.abs(a - b) <= 1;
        const frameInset = innerWidth >= 768 ? 24 : 16;
        const stageInset = innerWidth >= 1024 ? 48 : innerWidth >= 768 ? 24 : 16;
        if (document.documentElement.scrollWidth > innerWidth + 1) failures.push(`page overflow ${document.documentElement.scrollWidth}`);
        for (const node of document.querySelectorAll('.case-screen')) {
          const css = getComputedStyle(node);
          const paddings = ['Top', 'Right', 'Bottom', 'Left'].map(side => Number.parseFloat(css[`padding${side}`]));
          if (paddings.some(value => !close(value, frameInset))) failures.push(`frame fields ${paddings}`);
          const image = node.querySelector('img');
          const media = node.querySelector('.case-screen__media');
          if (image && media && !close(rect(image).height, rect(media).height)) failures.push(`reserved image height ${image.getAttribute('src')}`);
          const text = node.querySelector('.case-screen__text');
          // Local coordinates keep the check valid for rotated Agent cover panels.
          if (text && media && (!close(media.offsetLeft, text.offsetLeft) || !close(media.offsetWidth, text.offsetWidth))) failures.push('frame/action alignment');
        }
        for (const node of document.querySelectorAll('.featured-case--agent, .work-stage--home.work-stage--portal, .work-stage--home.work-stage--learn')) {
          const css = getComputedStyle(node);
          if (['Top', 'Right', 'Bottom', 'Left'].some(side => !close(parseFloat(css[`padding${side}`]), stageInset))) failures.push('stage fields');
        }
        const learn = document.querySelector('.learn-stage');
        if (learn && innerWidth < 1024) {
          const frames = [...learn.querySelectorAll('.case-screen')].map(rect);
          if (frames.some(frame => !close(frame.left, frames[0].left) || !close(frame.right, frames[0].right))) failures.push('Learn column widths');
          for (const selector of ['.learn-stage__material', '.learn-stage__passport']) {
            const image = learn.querySelector(`${selector} img`);
            if (!image.currentSrc.includes('mobile')) failures.push('Learn tablet source');
          }
        }
        if (innerWidth < 768) for (const selector of ['.vet-stage', '.work-stage--pawly', '.case-shot__row']) {
          for (const group of document.querySelectorAll(selector)) {
            const frames = [...group.querySelectorAll('.case-screen')].map(rect);
            if (frames.some(frame => !close(frame.left, frames[0].left) || !close(frame.right, frames[0].right))) failures.push(`mobile frame widths ${selector}`);
          }
        }
        if (innerWidth < 1024) for (const node of document.querySelectorAll('.work-stage--pawly .work-stage__panel')) {
          const frame = node.querySelector('.case-screen');
          if (!close(rect(frame).width, rect(node).width)) failures.push('Pawly tablet column width');
        }
        return { frameCount: document.querySelectorAll('.case-screen').length, failures };
      });
      report.checks.push({ route, width, status: response.status(), ...geometry });
      if (response.status() !== 200 || geometry.failures.length) report.failures.push({ route, width, status: response.status(), failures: geometry.failures });
      if (path === '/' && locale === 'ru' && [390, 820, 1440].includes(width)) {
        for (const slug of ['learn', 'vet-clinic', 'pawly']) await page.locator(`#work-${slug}`).screenshot({ path: `${dir}/${origin.includes('127.0.0.1') ? 'local' : 'production'}-${engine}-${slug}-${width}.png` });
      }
    }
    await page.close();
    console.log(`${width}px: completed EN/RU routes`);
  }
} finally { await browser.close(); }
writeFileSync(`${dir}/${origin.includes('127.0.0.1') ? 'local' : 'production'}-${engine}.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ checks: report.checks.length, failures: report.failures, runtimeErrors: report.runtimeErrors }, null, 2));
if (report.failures.length || report.runtimeErrors.length) process.exitCode = 1;
