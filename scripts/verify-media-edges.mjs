/** EN/RU regression audit for screenshot seams, fields, corners and zoom.
 * Browser screenshots plus 3x corner/edge contact sheets are review evidence.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { browser } from '../tasks/portfolio-rebuild/partner-portal/source-runtime.mjs';

const origin = process.argv[2] ?? 'http://127.0.0.1:4481';
const widths = (process.argv[3] ?? '360,390,600,768,820,1024,1440,1920').split(',').map(Number);
const dir = process.argv[4] ?? 'outputs/media-edge-audit';
await mkdir(`${dir}/frames`, { recursive: true });
await mkdir(`${dir}/zoom`, { recursive: true });
const routes = ['/', '/about/', ...['agent-ops-console', 'partner-portal', 'learn', 'vet-clinic', 'pawly'].map(slug => `/work/${slug}/`)];
const report = { origin, checks: [], zoom: [], frames: [], failures: [], errors: [] };
const seen = new Set(), seenZoom = new Set();
const b = await browser();
try {
  for (const width of widths) {
    const page = await b.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(15000);
    page.on('pageerror', error => report.errors.push({ width, url: page.url(), message: error.message }));
    page.on('console', message => { if (message.type() === 'error') report.errors.push({ width, url: page.url(), message: message.text() }); });
    for (const lang of ['en', 'ru']) for (const route of routes) {
      const url = `${lang === 'ru' ? '/ru' : ''}${route}`;
      console.log(`Checking ${width}px ${url}`);
      const response = await page.goto(origin + url, { waitUntil: 'load' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].filter(img => img.getAttribute('src')).map(img => {
          img.loading = 'eager'; return img.decode().catch(() => {});
        }));
      });
      const result = await page.evaluate(() => {
        const failures = [], captures = [];
        const close = (a, b) => Math.abs(a - b) < 1;
        if (document.documentElement.scrollWidth > innerWidth + 1) failures.push('Page overflows horizontally');
        if (document.querySelector('vite-error-overlay')) failures.push('Vite error overlay');
        for (const image of document.images) {
          if (!image.getAttribute('src') || image.closest('dialog:not([open])')) continue;
          if (!image.naturalWidth) failures.push(`Broken image: ${image.currentSrc}`);
        }
        for (const [index, surface] of [...document.querySelectorAll('.screen-surface:not(.screen-surface--native)')].entries()) {
          if (surface.closest('dialog') || !surface.getBoundingClientRect().width) continue;
          const edge = surface.firstElementChild, css = getComputedStyle(edge), style = getComputedStyle(surface);
          if (style.visibility === 'hidden') continue;
          const image = edge.querySelector('img'), video = edge.querySelector('video');
          const media = image || video;
          if (!media) continue;
          const src = image?.currentSrc || video.poster;
          if (['Top', 'Right', 'Bottom', 'Left'].some(side => parseFloat(css[`padding${side}`]))) failures.push(`Added screenshot field: ${src}`);
          if (style.backgroundColor !== 'rgba(0, 0, 0, 0)') failures.push(`Painted screenshot extension: ${src}`);
          if (!close(parseFloat(style.borderTopLeftRadius), 16) || style.overflow !== 'hidden') failures.push(`Unclipped screenshot corners: ${src}`);
          if (parseFloat(getComputedStyle(media).borderTopLeftRadius)) failures.push(`Second rounded contour: ${src}`);
          const a = surface.getBoundingClientRect(), m = media.getBoundingClientRect();
          if (!close(a.width, m.width) || !close(a.height, m.height) || !close(a.left, m.left) || !close(a.top, m.top)) failures.push(`Media does not meet its container: ${src}`);
          const dimensions = getComputedStyle(media);
          if (image?.naturalWidth && !close(parseFloat(dimensions.height), parseFloat(dimensions.width) * image.naturalHeight / image.naturalWidth)) failures.push(`Distorted screenshot: ${src}`);
          captures.push({ index, src: new URL(src, location.href).pathname, width: a.width, height: a.height });
        }
        for (const pin of document.querySelectorAll('.case-callout__pin')) {
          if (getComputedStyle(pin).display === 'none') continue;
          const p = pin.getBoundingClientRect(), f = pin.closest('.case-screen').getBoundingClientRect();
          const m = pin.closest('.case-screen').querySelector('.case-screen__media').getBoundingClientRect();
          if (p.left < f.left + 15 || p.right > m.left - 1 || p.top < f.top - 1 || p.bottom > f.bottom + 1) failures.push('Callout marker overlaps screenshot');
        }
        return { captures, failures };
      });
      if (response.status() !== 200) result.failures.push(`HTTP ${response.status()}`);
      report.checks.push({ width, url, count: result.captures.length, failures: result.failures });
      for (const failure of result.failures) report.failures.push({ width, url, failure });
      if ([390, 1440].includes(width)) {
        for (const capture of result.captures) {
          const key = `${width}:${capture.src}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const file = `${dir}/frames/${width}-${capture.src.replaceAll('/', '-').replace(/\.[^.]+$/, '')}.png`;
          const surface = page.locator('.screen-surface:not(.screen-surface--native)').nth(capture.index);
          if (!await surface.isVisible()) continue;
          // Chromium's beyond-viewport element capture can paint an earlier
          // carousel position. Capture the visible viewport at the same width,
          // then extract the actual element bounds without another auto-scroll.
          await page.setViewportSize({ width, height: Math.max(1000, Math.ceil(capture.height) + 160) });
          await surface.scrollIntoViewIfNeeded();
          await surface.evaluate(node => window.scrollTo({top: scrollY + node.getBoundingClientRect().top - 80, behavior: 'instant'}));
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          const box = await surface.boundingBox();
          if (Math.abs(box.width - capture.width) > 1 || Math.abs(box.height - capture.height) > 1) {
            throw Error(`Viewport capture changed frame geometry: ${capture.src}`);
          }
          const viewport = await page.screenshot({ animations: 'disabled' });
          const viewportSize = await sharp(viewport).metadata();
          if (box.x < 0 || box.y < 0 || Math.round(box.x) + Math.round(box.width) > viewportSize.width || Math.round(box.y) + Math.round(box.height) > viewportSize.height) {
            throw Error(`Frame outside capture viewport: ${capture.src}, ${JSON.stringify({ box, viewport: viewportSize })}`);
          }
          await sharp(viewport).extract({ left: Math.round(box.x), top: Math.round(box.y),
            width: Math.round(box.width), height: Math.round(box.height) }).png().toFile(file);
          await page.setViewportSize({ width, height: 1000 });
          report.frames.push({ ...capture, widthClass: width, lang, url, file });
        }
        const triggers = page.locator('[data-zoom-trigger]');
        for (let i = 0; i < await triggers.count(); i++) {
          const trigger = triggers.nth(i);
          if (!await trigger.isVisible()) continue;
          const source = await trigger.evaluate(node => node.dataset.zoomFixed ? node.dataset.zoomSrc : node.querySelector('img')?.currentSrc || node.dataset.zoomSrc);
          const key = `${width}:${source}`;
          if (seenZoom.has(key)) continue;
          seenZoom.add(key);
          await trigger.click();
          await page.locator('[data-media-zoom-image]').evaluate(image => image.decode());
          const zoom = await page.locator('[data-media-zoom]').evaluate(dialog => {
            const image = dialog.querySelector('img'), surface = dialog.querySelector('.screen-surface');
            const viewport = dialog.querySelector('.media-zoom__viewport');
            const edge = surface.firstElementChild, css = getComputedStyle(image), rect = image.getBoundingClientRect();
            const native = surface.classList.contains('screen-surface--native');
            const failures = [];
            if (!dialog.open || !image.naturalWidth) failures.push('Zoom failed to load');
            if (rect.width > viewport.clientWidth + 1) failures.push('Zoom overflows horizontally');
            if (Math.abs(parseFloat(css.height) - parseFloat(css.width) * image.naturalHeight / image.naturalWidth) > 1) failures.push('Zoom image distorted');
            if (!native && (parseFloat(getComputedStyle(edge).paddingLeft) || getComputedStyle(surface).backgroundColor !== 'rgba(0, 0, 0, 0)')) failures.push('Zoom added an extension');
            if (!native && Math.abs(surface.getBoundingClientRect().width - rect.width) > 1) failures.push('Zoom does not fill its mask');
            return { src: new URL(image.currentSrc).pathname, native, width: rect.width, height: rect.height, failures };
          });
          report.zoom.push({ width, url, ...zoom });
          for (const failure of zoom.failures) report.failures.push({ width, url, failure, src: zoom.src });
          if (/payout|resolution-context|queue-(?:en|ru)\.webp|line-(?:open|confirmed|cart)/.test(zoom.src)) {
            await page.locator('[data-media-zoom]').screenshot({ path: `${dir}/zoom/${width}-${zoom.src.replaceAll('/', '-')}.png` });
          }
          await page.keyboard.press('Escape');
          if (await page.locator('dialog[open]').count()) report.failures.push({ width, url, failure: 'Zoom does not close' });
        }
      }
    }
    await page.close();
    console.log(`${width}px: 14 EN/RU routes checked`);
  }
} finally { await b.close(); }

// Browser-rendered full frames and eight magnified perimeter samples per frame.
const tileWidth = 520, tileHeight = 440, batch = 18, columns = 3;
for (let start = 0; start < report.frames.length; start += batch) {
  const group = report.frames.slice(start, start + batch), layers = [];
  for (const [i, frame] of group.entries()) {
    const x = (i % columns) * tileWidth, y = Math.floor(i / columns) * tileHeight;
    const { width, height } = await sharp(frame.file).metadata();
    const text = `${start + i + 1}. ${frame.widthClass}px ${frame.src.replace('/media/', '')}`.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
    layers.push({ input: Buffer.from(`<svg width="520" height="440"><rect width="520" height="440" fill="white"/><text x="8" y="18" font-family="Arial" font-size="11">${text}</text></svg>`), left: x, top: y });
    layers.push({ input: await sharp(frame.file).resize(500, 210, { fit: 'inside' }).png().toBuffer(), left: x + 8, top: y + 26 });
    const side = Math.min(32, width, height);
    const samples = [[0, 0], [width - side, 0], [0, height - side], [width - side, height - side],
      [Math.floor((width - side) / 2), 0], [width - side, Math.floor((height - side) / 2)],
      [Math.floor((width - side) / 2), height - side], [0, Math.floor((height - side) / 2)]];
    for (const [j, [left, top]] of samples.entries()) {
      layers.push({ input: await sharp(frame.file).extract({ left, top, width: side, height: side }).resize(96, 96, { kernel: 'nearest' }).png().toBuffer(),
        left: x + 8 + (j % 4) * 125, top: y + 240 + Math.floor(j / 4) * 100 });
    }
  }
  await sharp({ create: { width: columns * tileWidth, height: Math.ceil(group.length / columns) * tileHeight, channels: 3, background: '#eeeeee' } })
    .composite(layers).jpeg({ quality: 95 }).toFile(`${dir}/edges-${String(start / batch + 1).padStart(2, '0')}.jpg`);
}
await writeFile(`${dir}/verification.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pages: report.checks.length, frames: report.checks.reduce((sum, check) => sum + check.count, 0),
  uniqueRenderedFrames: report.frames.length, zoom: report.zoom.length, failures: report.failures, errors: report.errors }, null, 2));
if (report.failures.length || report.errors.length) process.exitCode = 1;
