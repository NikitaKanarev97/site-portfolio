import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const browser = await chromium.launch();
const results = [];
for (const locale of ['en', 'ru']) for (const width of [1440, 390]) {
  const pair = [];
  for (const base of ['http://127.0.0.1:5372', 'http://127.0.0.1:5371']) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(base + (locale === 'ru' ? '/ru/' : '/'), { waitUntil: 'networkidle' });
    await page.evaluate(async () => { await document.fonts.ready; document.querySelectorAll('img').forEach(i => i.loading = 'eager'); await Promise.all([...document.images].filter(i => i.src).map(i => i.decode().catch(() => {}))); });
    await page.waitForTimeout(500);
    pair.push(await page.evaluate(() => ['agent-ops-console', 'partner-portal', 'learn', 'pawly'].map(slug => {
      const root = document.getElementById('work-' + slug), r = root.getBoundingClientRect();
      return { slug, text: root.textContent.replace(/\s+/g, ' ').trim(), width: r.width, height: r.height, parts: [...root.querySelectorAll('h2,.featured-case__outcome,.featured-case__facts,.featured-case__cta,img,.work-stage__photo figcaption')].map(e => { const b = e.getBoundingClientRect(), c = getComputedStyle(e); return { tag: e.tagName, src: e.tagName === 'IMG' ? new URL(e.currentSrc).pathname : undefined, x: b.x - r.x, y: b.y - r.y, width: b.width, height: b.height, font: c.font, color: c.color, display: c.display, background: c.backgroundColor }; }) };
    })));
    await page.close();
  }
  for (let i = 0; i < pair[0].length; i++) {
    const a = pair[0][i], b = pair[1][i];
    assert.equal(a.text, b.text); assert.equal(a.parts.length, b.parts.length);
    let maxGeometryDelta = Math.max(Math.abs(a.width - b.width), Math.abs(a.height - b.height));
    for (let j = 0; j < a.parts.length; j++) {
      for (const key of ['tag', 'src', 'font', 'color', 'display', 'background']) assert.equal(a.parts[j][key], b.parts[j][key], `${locale} ${width} ${a.slug} ${key}`);
      for (const key of ['x', 'y', 'width', 'height']) maxGeometryDelta = Math.max(maxGeometryDelta, Math.abs(a.parts[j][key] - b.parts[j][key]));
    }
    assert.ok(maxGeometryDelta <= 1, `${locale} ${width} ${a.slug}: ${maxGeometryDelta}`);
    results.push({ locale, width, slug: a.slug, maxGeometryDelta, before: a, after: b });
  }
}
await browser.close();
fs.writeFileSync('audit/vet-portfolio-case-v2/regressions/geometry.json', JSON.stringify({ policy: 'All unchanged homepage cards: same content, sources, typography, colours and element geometry within 1 CSS px. Absolute document Y changes naturally with the redesigned earlier Vet card; raster origins can differ.', results }, null, 2));
console.log(results.length, 'unchanged cards: content, sources, typography, colours and normalized geometry pass');
