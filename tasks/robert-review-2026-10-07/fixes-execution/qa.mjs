// Targeted acceptance of changed behavior; full logs and evidence stay here.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const sharp = require('D:/Claude-projects/Site-portfolio/node_modules/sharp');
const out = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(out, 'shots'), { recursive: true });
const base = process.argv[2] || 'http://127.0.0.1:4425';
// A already checks changed interactions. Enable only for a new failure/risk.
const runInteractions = process.argv.includes('--interactions');
const slugs = ['agent-ops-console', 'partner-portal', 'learn', 'vet-clinic', 'pawly'];
const browser = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const results = [];
const failures = [];
const sheets = new Map();
const details = [];
function fail(route, width, text) { failures.push({ route, width, text }); }
async function capture(page, route, width, name, locator) {
  if (!(await locator.count())) return;
  await locator.first().evaluate(e => window.scrollTo({ top: e.getBoundingClientRect().top + scrollY, behavior: 'instant' }));
  await page.waitForTimeout(120);
  const box = await locator.first().boundingBox();
  const viewport = await page.screenshot();
  const x = Math.max(0, Math.floor(box.x));
  const y = Math.max(0, Math.floor(box.y));
  const image = await sharp(viewport).extract({ left: x, top: y,
    width: Math.max(1, Math.min(Math.floor(box.width), width - x)),
    height: Math.max(1, Math.min(Math.floor(box.height), 900 - y)),
  }).png().toBuffer();
  writeFileSync(join(out, 'shots', `${name}.png`), image);
  const thumb = await sharp(image).resize({ width: 300, height: 700, fit: 'inside' }).png().toBuffer();
  return { route, width, name, thumb, ...(await sharp(thumb).metadata()) };
}
try {
  for (const width of [1440, 360]) for (const locale of ['en', 'ru']) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const prefix = locale === 'ru' ? '/ru' : '';
    const paths = ['/', '/about/', ...slugs.map(s => `/work/${s}/`), '/404/'];
    for (const path of paths) {
      const route = prefix + path;
      const errors = [];
      const onError = error => errors.push(error.message);
      page.on('pageerror', onError);
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.evaluate(async () => { await document.fonts.ready; });
      await page.waitForTimeout(100);
      const row = await page.evaluate(() => {
        const visible = e => e.getBoundingClientRect().height > 0 && getComputedStyle(e).visibility !== 'hidden';
        const targets = [...document.querySelectorAll('.case-screen__open, .case-specimen [data-zoom-trigger], [data-carousel-prev], [data-carousel-next], .routes__item > a')].filter(visible)
          .map(e => ({ label: (e.textContent || e.getAttribute('aria-label') || '').trim(), height: Math.round(e.getBoundingClientRect().height), width: Math.round(e.getBoundingClientRect().width) }));
        return { lang: document.documentElement.lang, title: document.title,
          h1: [...document.querySelectorAll('h1')].map(e => e.textContent.trim()),
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          brand: document.querySelector('.navbar__brand')?.getAttribute('aria-label'),
          targets, brokenImages: [...document.images].filter(e => visible(e) && e.complete && e.currentSrc && e.naturalWidth === 0).map(e => e.currentSrc),
          technicalLabels: [...document.querySelectorAll('main section[aria-label]')].map(e => e.getAttribute('aria-label')).filter(t => /^[a-z]+(?:-[a-z]+)+$/.test(t)),
          coverHeight: Math.round(document.querySelector('.case-opening')?.getBoundingClientRect().height || 0),
          coverHeadings: [...document.querySelectorAll('.case-opening h1, .case-opening__outcome')].map(e => ({ text: e.textContent.trim(), font: getComputedStyle(e).fontSize })),
        };
      });
      Object.assign(row, { route, width, status: response?.status(), errors });
      if (row.h1.length !== 1) fail(route, width, `H1 count ${row.h1.length}`);
      if (row.overflow) fail(route, width, 'Horizontal overflow');
      if (row.lang !== locale) fail(route, width, `Language ${row.lang}`);
      if (row.brokenImages.length) fail(route, width, `Broken images ${row.brokenImages.length}`);
      if (row.technicalLabels.length) fail(route, width, `Technical region labels ${row.technicalLabels.join(', ')}`);
      if (locale === 'ru' && row.brand && !row.brand.includes('Никита')) fail(route, width, `Brand ${row.brand}`);
      for (const target of row.targets) if (target.height < 44) fail(route, width, `Touch height ${target.height}: ${target.label}`);
      if (errors.length) fail(route, width, `Page errors: ${errors.join('; ')}`);
      if (path.startsWith('/work/')) {
        const slug = path.split('/')[2];
        const cover = await capture(page, route, width, `${slug}-${locale}-${width}-cover`, page.locator('.case-opening'));
        if (cover) {
          const key = `${locale}-${width}`;
          if (!sheets.has(key)) sheets.set(key, []);
          sheets.get(key).push(cover);
        }
        // Representative changed compositions, avoiding repeat coverage of identical shared renderers.
        if (locale === 'en') {
          const selector = slug === 'agent-ops-console' ? '.case-callout' : slug === 'partner-portal' ? '.case-specimen' : slug === 'learn' ? '.case-routes' : slug === 'pawly' ? '.case-steps' : '.case-carousel';
          const detail = await capture(page, route, width, `${slug}-${width}-detail`, page.locator(selector));
          if (detail) details.push(detail);
        }
        const zoom = page.locator('[data-zoom-trigger]').filter({ visible: true }).first();
        if (runInteractions && await zoom.count()) {
          await zoom.scrollIntoViewIfNeeded();
          await zoom.focus();
          await page.keyboard.press('Enter');
          const dialog = page.locator('[data-media-zoom]');
          row.zoomOpened = await dialog.evaluate(e => e.open);
          if (!row.zoomOpened) fail(route, width, 'Zoom did not open with Enter');
          await page.keyboard.press('Escape');
          row.zoomClosed = !(await dialog.evaluate(e => e.open));
          row.zoomFocusReturned = await zoom.evaluate(e => document.activeElement === e);
          if (!row.zoomClosed || !row.zoomFocusReturned) fail(route, width, 'Zoom close/focus return');
        }
        const carousel = page.locator('[data-carousel]').first();
        if (runInteractions && await carousel.count()) {
          const next = carousel.locator('[data-carousel-next]');
          await carousel.scrollIntoViewIfNeeded();
          if (await next.isVisible()) {
            const slideCount = await carousel.locator('.case-carousel__slide').count();
            for (let n = 1; n < slideCount; n++) {
              if (await next.isEnabled()) await next.click();
              await page.waitForTimeout(120);
            }
            row.carouselLast = await carousel.locator('[data-carousel-index]').innerText();
            if (Number(row.carouselLast) !== slideCount) fail(route, width, `Carousel last ${row.carouselLast}/${slideCount}`);
            await carousel.locator('[data-carousel-prev]').click();
            await page.waitForTimeout(120);
            row.carouselPrevious = await carousel.locator('[data-carousel-index]').innerText();
            if (Number(row.carouselPrevious) === slideCount) fail(route, width, 'Carousel previous stayed at last');
          }
        }
        const disclosure = page.locator('.case-specimen details').first();
        if (runInteractions && width === 360 && await disclosure.count()) {
          row.specimenClosed = !(await disclosure.evaluate(e => e.open));
          await disclosure.locator('summary').click();
          row.specimenOpened = await disclosure.evaluate(e => e.open);
          if (!row.specimenClosed || !row.specimenOpened) fail(route, width, 'Specimen mobile disclosure');
        }
      } else if (locale === 'ru' || path === '/about/') {
        const detail = await capture(page, route, width, `${path === '/404/' ? '404' : path === '/about/' ? 'about' : 'home'}-${locale}-${width}`, page.locator(path === '/about/' ? '#evidence' : 'main > section').first());
        if (detail) details.push(detail);
      }
      results.push(row);
      page.off('pageerror', onError);
    }
    await context.close();
  }
  if (runInteractions) {
  // Normal motion: final human-review state and keyboard focus remain usable.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.goto(base + '/work/agent-ops-console/', { waitUntil: 'networkidle' });
  const checkpoint = page.locator('.case-steps[data-composition="checkpoint"]');
  if (await checkpoint.count()) {
    await checkpoint.evaluate(e => window.scrollTo({ top: e.getBoundingClientRect().top + scrollY + e.getBoundingClientRect().height - innerHeight * 1.1, behavior: 'instant' }));
    await page.waitForTimeout(450);
    const detail = await capture(page, '/work/agent-ops-console/', 1440, 'agent-normal-review', page.locator('.case-steps__stage').first());
    if (detail) details.push(detail);
  }
  await page.goto(base + '/ru/about/', { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 360, height: 900 });
  const trigger = page.locator('[data-navbar-trigger]');
  await trigger.click();
  const expanded = await trigger.getAttribute('aria-expanded');
  await page.keyboard.press('Escape');
  if (expanded !== 'true' || await trigger.getAttribute('aria-expanded') !== 'false') fail('/ru/about/', 360, 'Mobile menu toggle/Escape');
  await context.close();
  }
  async function sheet(items, file, columns = 5) {
    const rows = Math.ceil(items.length / columns);
    const height = Math.max(...items.map(i => i.height)) + 32;
    const label = text => Buffer.from(`<svg width="300" height="32"><rect width="100%" height="100%" fill="white"/><text x="5" y="21" font-family="Arial" font-size="12">${text.replaceAll('&', '&amp;')}</text></svg>`);
    const composite = items.flatMap((i, n) => [{ input: label(i.name), left: (n % columns) * 300, top: Math.floor(n / columns) * height }, { input: i.thumb, left: (n % columns) * 300, top: Math.floor(n / columns) * height + 32 }]);
    await sharp({ create: { width: 300 * columns, height: height * rows, channels: 3, background: '#eeeeee' } }).composite(composite).jpeg({ quality: 85 }).toFile(join(out, file));
  }
  for (const [key, values] of sheets) await sheet(values, `covers-${key}.jpg`);
  await sheet(details, 'details.jpg', 5);
} finally {
  await browser.close();
  writeFileSync(join(out, 'qa.json'), JSON.stringify({ results, failures }, null, 2));
}
console.log(JSON.stringify({ checked: results.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
