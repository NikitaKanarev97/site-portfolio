/** Re-capture whole source regions; never end a portfolio frame inside text. */
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const { chromium } = createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const browser = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const origin = 'http://127.0.0.1:4362';
const dir = 'public/media/rebuild/learn/';
const report = [];
await mkdir('outputs/case-media-repair', { recursive: true });
async function go(page, route) {
  await page.goto(origin + route, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
}
async function save(page, id, locator, { alpha = false, selection = '' } = {}) {
  const data = await locator.screenshot({ omitBackground: alpha, animations: 'disabled' });
  const file = dir + id + '.webp';
  const info = await sharp(data).webp({ quality: 94 }).toFile(file);
  report.push({ id, file, source: page.url(), locale: 'en', selection, viewport: page.viewportSize(), dpr: 2,
    width: info.width, height: info.height, alpha, sha256: createHash('sha256').update(await readFile(file)).digest('hex') });
  console.log(id, info.width, info.height);
}
try {
  if (process.argv.includes('--inspect')) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
    for (const route of ['/prototypes/learn/material/onvif-not-found?lang=en', '/prototypes/learn/player/puskonaladka/2?lang=en', '/prototypes/learn/trajectory/puskonaladka?lang=en', '/prototypes/learn/assessment/intro?trajectoryId=proekt&lang=en', '/prototypes/learn-landing/?lang=en']) {
      await go(page, route);
      console.log(route, JSON.stringify(await page.locator('main').evaluate(el => [...el.querySelectorAll('header,aside,section,article,h1')].map(e => ({ tag: e.tagName, cls: e.className, text: (e.innerText||'').slice(0,70), box: [e.offsetWidth,e.offsetHeight], children: [...e.children].map(c=>[c.tagName,c.className,(c.innerText||'').slice(0,35)]) })))));
    }
  } else {
    const one = JSON.parse(await readFile('D:/Claude-projects/learn/audit/product-polish/evidence/07/state-marina-one.json', 'utf8'));
    const ready = JSON.parse(await readFile('D:/Claude-projects/learn/audit/product-polish/evidence/07/state-marina-ready.json', 'utf8'));
    one.toasts = []; ready.toasts = [];
    for (const width of [1440, 390]) {
      const variant = width === 1440 ? 'desktop' : 'mobile';
      const ctx = await browser.newContext({ viewport: { width, height: 1200 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      await go(page, '/prototypes/learn/material/onvif-not-found?lang=en');
      // Native page gutters plus the whole header, not a tight text bounding box.
      await page.locator('header[class*="pageHeader"]').evaluate(el => {
        el.style.padding = '32px'; el.style.borderRadius = '20px';
        el.style.background = getComputedStyle(document.body).backgroundColor;
        el.style.maxWidth = innerWidth > 768 ? '960px' : '100%';
        el.querySelector('nav')?.remove();
        let parent = el.parentElement;
        while (parent) { parent.style.background = 'transparent'; parent = parent.parentElement; }
      });
      await page.addStyleTag({ content: 'html,body,#root{background:transparent!important}' });
      await save(page, 'cover-answer-' + variant, page.locator('header[class*="pageHeader"]'), { alpha: true, selection: 'Whole material header with 32px breathing room on all sides.' });
      await go(page, '/prototypes/learn/material/onvif-not-found?lang=en');
      await page.locator('article').evaluate(el => [...el.children].slice(2).forEach(node => node.remove()));
      await page.locator('section[class*="related"]').evaluate(el => el.remove());
      await save(page, 'answer-' + variant, page.locator('main'), { selection: 'Whole header, first complete diagnostic section and learning-path rail.' });

      await page.evaluate(s => sessionStorage.setItem('learn-prototype-v1', JSON.stringify(s)), one);
      await go(page, '/prototypes/learn/player/puskonaladka/2?lang=en');
      await page.locator('aside div[class*="steps"]').evaluate(el => [...el.children].slice(3).forEach(node => node.remove()));
      await page.locator('article').evaluate(el => {
        [...el.children].slice(2).forEach(node => node.remove());
        let next = el.nextElementSibling;
        while (next) { const following = next.nextElementSibling; next.remove(); next = following; }
      });
      await save(page, 'programme-' + variant, page.locator('main').locator('..'), { selection: 'Whole progress bar, first three curriculum rows and first complete diagnostic section. Subsequent complete sections omitted.' });

      await go(page, '/prototypes/learn/player/puskonaladka/2?lang=en');
      await page.locator('aside').evaluate(el => el.remove());
      await page.locator('article').evaluate(el => [...el.children].slice(0, -1).forEach(node => node.remove()));
      const completion = page.locator('article').locator('..');
      await completion.evaluate(el => {
        const article = el.querySelector('article');
        let node = el.firstElementChild;
        while (node && node !== article) { const next = node.nextElementSibling; node.remove(); node = next; }
        el.style.padding = '32px';
      });
      await save(page, 'completion-' + variant, completion, { selection: 'Last complete material section, completion notice and the whole next action; 32px outer padding.' });

      await go(page, '/prototypes/learn/trajectory/puskonaladka?lang=en');
      await page.addStyleTag({ content: 'html,body,#root,main{background:transparent!important}' });
      await page.locator('aside').evaluate(el => {
        const nativeBackground = getComputedStyle(el).backgroundColor;
        el.querySelector('[class*="_facts_"]').style.background = nativeBackground;
        el.style.background = 'transparent';
        let parent = el.parentElement;
        while (parent) { parent.style.background = 'transparent'; parent = parent.parentElement; }
      });
      await save(page, 'cover-programme-' + variant, page.locator('aside'), { alpha: true, selection: 'Whole native programme passport, transparent surrounding field preserves the blue card radius.' });

      await page.evaluate(s => sessionStorage.setItem('learn-prototype-v1', JSON.stringify(s)), ready);
      await go(page, '/prototypes/learn/assessment/intro?trajectoryId=proekt&lang=en');
      await page.locator('main section').evaluateAll(es => es.forEach(el => el.remove()));
      // Start button is a separate action; this frame documents the rules only.
      const rules = page.locator('div[class*="_card_"]').filter({ has: page.getByText('Attempts remaining', { exact: true }) }).first();
      await rules.evaluate(el => { let next = el.nextElementSibling; while (next) { const n = next.nextElementSibling; next.remove(); next = n; } });
      await save(page, 'assessment-' + variant, page.locator('main'), { selection: 'Whole introduction and rules with the native page padding above and below.' });

      await go(page, '/prototypes/learn-landing/?lang=en');
      await page.locator('main > section').evaluateAll(es => es.slice(1).forEach(el => el.remove()));
      await page.locator('footer').evaluateAll(es => es.forEach(el => el.remove()));
      await page.addStyleTag({ content: '[data-reveal]{opacity:1!important;transform:none!important}.ed-hero{padding-bottom:48px!important}' });
      await save(page, 'landing-' + variant, page.locator('main').locator('..'), { selection: 'Whole landing introduction including navigation and bottom rule; ends before the next section.' });
      await ctx.close();
    }
    for (const variant of ['desktop', 'mobile']) {
      const answer = dir + 'cover-answer-' + variant + '.webp';
      const passport = dir + 'cover-programme-' + variant + '.webp';
      const a = await sharp(answer).metadata(), b = await sharp(passport).metadata();
      const mobile = variant === 'mobile', gap = mobile ? 64 : 96;
      const width = mobile ? Math.max(a.width, b.width) : a.width + b.width + gap;
      const height = mobile ? a.height + b.height + gap : Math.max(b.height, a.height + 120);
      const file = dir + 'cover-' + variant + '.webp';
      await sharp({ create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([
        { input: answer, left: 0, top: mobile ? 0 : 120 },
        { input: passport, left: mobile ? 0 : a.width + gap, top: mobile ? a.height + gap : 0 },
      ]).webp({ quality: 94 }).toFile(file);
      report.push({ id: 'cover-' + variant, file, source: 'Whole material header + whole native passport', width, height, alpha: true, sha256: createHash('sha256').update(await readFile(file)).digest('hex') });
    }
    // Archival catalogue: keep the first complete card row; exclude cut-off second row.
    const archive = 'public/media/case-learn/before-catalog.webp';
    await sharp(archive).extract({ left: 0, top: 0, width: 1413, height: 642 }).extend({ bottom: 24, top: 0, left: 0, right: 0, background: '#ffffff' }).webp({ quality: 94 }).toFile(dir + 'archive-catalog.webp');
    report.push({ id: 'archive-catalog', file: dir + 'archive-catalog.webp', source: archive, width: 1413, height: 666, dpr: 1, sha256: createHash('sha256').update(await readFile(dir + 'archive-catalog.webp')).digest('hex'), selection: 'First whole course row; second partial row excluded; white bottom breathing room.' });
    // Actual review queue: three distinct unresolved identities, no candidate cards.
    const { serve, source } = await import('../tasks/portfolio-rebuild/partner-portal/source-runtime.mjs');
    const app = await serve(source + '/dist', true);
    try {
      for (const width of [1440, 390]) {
        const page = await browser.newPage({ viewport: { width, height: 1200 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
        await page.goto(app.base + '/b2b/resolution-center', { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        const rows = page.locator('[data-flip]');
        // Select actual source rows, one of each observed exception category.
        await rows.evaluateAll(es => {
          const selected = new Set();
          for (const el of es) {
            const text = el.innerText;
            const category = text.includes('Ambiguous') && text.includes('Row 38') ? 'ambiguous' : text.includes('Missing') ? 'missing' : /Changed|Superseded/.test(text) ? 'changed' : null;
            if (!category || selected.has(category)) el.remove(); else selected.add(category);
          }
        });
        const queue = page.locator('[data-flip]').first().locator('..');
        const file = `public/media/rebuild/partner-portal/hero-review-${width === 1440 ? 'wide' : 'narrow'}.webp`;
        const info = await sharp(await queue.screenshot({ animations: 'disabled' })).webp({ quality: 94 }).toFile(file);
        report.push({ id: 'portal-hero-review-' + width, file, source: app.base + '/b2b/resolution-center', selection: 'One whole source row per unresolved identity; native queue header and row actions.', width: info.width, height: info.height, text: await queue.innerText() });
        await page.close();
      }
    } finally { await app.close(); }
    const previous = JSON.parse(await readFile('tasks/portfolio-rebuild/learn/captures.json', 'utf8'));
    const updated = previous.filter(e => !report.some(r => r.id === e.id));
    await writeFile('tasks/portfolio-rebuild/learn/captures.json', JSON.stringify([...updated, ...report.filter(r => !r.id.startsWith('portal-'))], null, 2));
    await writeFile('outputs/case-media-repair/captures.json', JSON.stringify(report, null, 2));
  }
} finally { await browser.close(); }
