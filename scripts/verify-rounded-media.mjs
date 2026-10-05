/** Public EN/RU frame fields, original pixels, callout gutter and finale grid. */
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const origin = process.argv[2] ?? 'http://127.0.0.1:4476';
const widths = (process.argv[3] ?? '360,390,600,768,820,1024,1440,1920').split(',').map(Number);
const dir = 'tmp/rounded-media';
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const report = { origin, checks: [], failures: [], errors: [] };
const routes = ['/', '/about/', ...['agent-ops-console','partner-portal','learn','vet-clinic','pawly'].map(slug => `/work/${slug}/`)];
try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => report.errors.push({ width, message: error.message }));
    for (const lang of ['en', 'ru']) for (const route of routes) {
      const url = `${lang === 'ru' ? '/ru' : ''}${route}`;
      const response = await page.goto(origin + url, { waitUntil: 'load' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].filter(img => img.getAttribute('src')).map(img => { img.loading = 'eager'; return img.decode().catch(() => {}); }));
      });
      const result = await page.evaluate(() => {
        const failures = [];
        const rect = node => node.getBoundingClientRect();
        const close = (a,b) => Math.abs(a-b) <= 1;
        if (document.documentElement.scrollWidth > innerWidth + 1) failures.push('Page overflow');
        let frames = 0;
        for (const surface of document.querySelectorAll('.screen-surface:not(.screen-surface--native)')) {
          if (surface.closest('dialog:not([open])')) continue;
          if (rect(surface).width <= 0) continue;
          const edge = surface.firstElementChild, css = getComputedStyle(edge), radius = parseFloat(getComputedStyle(surface).borderTopLeftRadius);
          if (!close(radius, 16)) failures.push('Inconsistent media radius');
          if (['Top','Right','Bottom','Left'].some(side => parseFloat(css[`padding${side}`]) < radius)) failures.push('Original pixels enter rounded corners');
          const image = edge.querySelector('img');
          if (image) {
            const radius = parseFloat(getComputedStyle(image).borderTopLeftRadius);
            if (!image.closest('.media-frame') && !close(radius, 8)) failures.push('Inner screenshot has square corners');
            if (!image.naturalWidth) failures.push(`Broken image ${image.currentSrc}`);
            else {
              // Agent cover panels rotate as a whole; bounding boxes include that transform.
              const dimensions = getComputedStyle(image);
              if (!close(parseFloat(dimensions.height), parseFloat(dimensions.width) * image.naturalHeight / image.naturalWidth)) failures.push(`Image distorted ${image.currentSrc}`);
            }
          }
          frames++;
        }
        for (const pin of document.querySelectorAll('.case-callout__pin')) {
          if (getComputedStyle(pin).display === 'none') continue;
          const frame = pin.closest('.case-screen'), p = rect(pin), f = rect(frame), m = rect(frame.querySelector('.case-screen__media'));
          if (p.left < f.left + 15 || p.right > m.left - 1 || p.top < f.top - 1 || p.bottom > f.bottom + 1) failures.push('Callout marker outside its inner gutter');
        }
        for (const body of document.querySelectorAll('.case-story__finale-body')) {
          const container = body.parentElement, css = getComputedStyle(container);
          if (!close(rect(body).left, rect(container).left + parseFloat(css.paddingLeft)) || !close(rect(body).right, rect(container).right - parseFloat(css.paddingRight))) failures.push('Finale outside page columns');
          const heading = body.querySelector('.case-thesis'), cards = body.querySelector('.case-impact__cards'), notes = body.querySelector('.case-impact__statements');
          if (!close(rect(heading).left, rect(cards).left)) failures.push('Finale heading/metrics misaligned');
          if (innerWidth >= 1024 && (!close(rect(heading).top, rect(notes).top) || rect(cards).right > rect(notes).left)) failures.push('Finale columns misaligned');
          if (innerWidth < 1024 && rect(notes).top < rect(cards).bottom) failures.push('Mobile finale overlaps');
        }
        return { frames, failures };
      });
      report.checks.push({ width, url, status: response.status(), ...result });
      if (response.status() !== 200 || result.failures.length) report.failures.push({ width, url, ...result });
      if (lang === 'ru' && [390,820,1440].includes(width)) {
        if (route === '/work/agent-ops-console/') {
          await page.locator('.case-callout').screenshot({ path: `${dir}/callout-${width}.png` });
          await page.locator('.case-story__finale').screenshot({ path: `${dir}/finale-${width}.png` });
          await page.locator('.case-steps__shot').first().screenshot({ path: `${dir}/agent-screen-${width}.png` });
        }
        if (route === '/') for (const slug of ['partner-portal','learn']) {
          await page.locator(`#work-${slug}`).screenshot({ path: `${dir}/home-${slug}-${width}.png` });
        }
        if (route === '/work/learn/') await page.locator('.case-screen:has(img[src*="completion-"])').screenshot({ path: `${dir}/completion-${width}.png` });
      }
    }
    await page.close();
    console.log(`${width}px: EN/RU checked`);
  }
} finally { await browser.close(); }
await writeFile(`${dir}/geometry.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ checks: report.checks.length, frames: report.checks.reduce((sum, check) => sum + check.frames, 0), failures: report.failures, errors: report.errors }, null, 2));
if (report.failures.length || report.errors.length) process.exitCode = 1;
