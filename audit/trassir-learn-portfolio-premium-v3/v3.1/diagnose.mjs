import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PW ?? 'playwright');
const root = 'audit/trassir-learn-portfolio-premium-v3/v3.1';
await mkdir(`${root}/logs`, { recursive: true });
const browser = await chromium.launch();
const results = [];
for (const concurrent of [false, true]) {
  const run = async locale => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__samples = [];
      const start = performance.now();
      function sample() {
        const intro = document.querySelector('[data-motion-intro]');
        if (intro) window.__samples.push({ ms: Math.round(performance.now() - start), visibility: document.visibilityState,
          elements: [...intro.querySelectorAll('[data-motion]')].map(e => ({ motion: e.dataset.motion, opacity: getComputedStyle(e).opacity, transform: getComputedStyle(e).transform, willChange: getComputedStyle(e).willChange })) });
        if (performance.now() - start < 6500) setTimeout(sample, 100);
      }
      sample();
    });
    await page.goto(`http://127.0.0.1:4429/${locale === 'ru' ? 'ru/' : ''}work/learn/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2200);
    const legacy = await page.evaluate(() => ({ ms: performance.now(), last: window.__samples.at(-1), missing: [...document.images].filter(i => i.src && !i.naturalWidth).map(i => ({ src: i.getAttribute('src'), currentSrc: i.currentSrc, html: i.outerHTML, dialogOpen: i.closest('dialog')?.open })) }));
    await page.screenshot({ path: `${root}/logs/legacy-${concurrent ? 'concurrent' : 'single'}-${locale}.png` });
    await page.waitForTimeout(4200);
    const samples = await page.evaluate(() => window.__samples);
    results.push({ concurrent, locale, legacy, samples });
    console.log(JSON.stringify({ concurrent, locale, legacy }));
    await context.close();
  };
  if (concurrent) await Promise.all(['en', 'ru'].map(run));
  else for (const locale of ['en', 'ru']) await run(locale);
}
await writeFile(`${root}/logs/lifecycle-diagnostic.json`, JSON.stringify(results, null, 2));
await browser.close();
