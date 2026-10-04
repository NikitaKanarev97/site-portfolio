import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const { chromium } = createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const browser = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const productionServer = process.argv.includes('--production') ? await (await import('../tasks/portfolio-rebuild/partner-portal/source-runtime.mjs')).serve(process.cwd() + '/dist') : null;
const origin = productionServer?.base || process.env.CASE_VERIFY_ORIGIN || 'http://127.0.0.1:4321';
const dir = 'outputs/case-media-repair';
await mkdir(dir, { recursive: true });
const findings = [];
const forbidden = /(?:вымышлен\S*\s+данн|данн\S*\s+вымышлен|синтетичес\S*\s+данн|демо-?данн|(?:synthetic|invented|fictional|mock|demo|demonstration)\s+(?:patient\s+|procurement\s+)?data)/i;
try {
  for (const locale of ['en', 'ru']) {
    const prefix = locale === 'ru' ? '/ru' : '';
    for (const slug of ['partner-portal', 'learn']) for (const width of [320, 390, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      const response = await page.goto(`${origin}${prefix}/work/${slug}/`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      // Load lower-page media before checking intrinsic dimensions.
      await page.locator('img').evaluateAll(es => es.forEach(e => e.loading = 'eager'));
      await page.waitForFunction(() => [...document.images].every(i => i.complete));
      const observation = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        broken: [...document.images].filter(i => !i.naturalWidth).map(i => i.currentSrc),
        h1: document.querySelector('h1')?.textContent,
        text: document.body.innerText,
        alts: [...document.images].map(i => i.alt).join('\n'),
        callouts: [...document.querySelectorAll('.case-callout')].map(el => {
          const img = el.querySelector('img').getBoundingClientRect();
          return {
            numbers: [...el.querySelectorAll('.case-callout__dot--list')].map(e => e.textContent.trim()),
            markerCount: el.querySelectorAll('.case-callout__dot').length,
            markersOutside: [...el.querySelectorAll('.case-callout__dot')].every(e => {
              const box = e.getBoundingClientRect();
              return box.left >= img.right - 0.5 || box.top >= img.bottom - 0.5;
            }),
            labelsDoNotOverlap: [...el.querySelectorAll('.case-callout__item')].every((e, i, es) => !i || e.getBoundingClientRect().top >= es[i - 1].getBoundingClientRect().bottom - 0.5),
          };
        }),
        plainFields: [...document.querySelectorAll('.case-plate--plain')].map(el => getComputedStyle(el).backgroundColor),
        heroWorkflow: Boolean(document.querySelector('.procurement-cover')),
      }));
      assert.equal(response.status(), 200);
      assert(observation.h1);
      assert(observation.overflow <= 1, `${locale}/${slug}/${width}: overflow ${observation.overflow}`);
      assert.equal(observation.broken.length, 0, observation.broken.join(', '));
      assert.equal(errors.length, 0, errors.join('\n'));
      assert(!forbidden.test(observation.text + observation.alts), `${locale}/${slug}: data disclaimer`);
      assert(observation.callouts.every(c => c.markersOutside && c.labelsDoNotOverlap && c.markerCount === 2 && c.numbers.join(',') === '1,2'));
      if (slug === 'partner-portal') {
        assert(observation.heroWorkflow);
        assert(observation.plainFields.length === 3);
        assert(observation.plainFields.every(c => c === 'rgba(0, 0, 0, 0)'));
      }
      if (width === 1440 || width === 390) {
        await page.screenshot({ path: `${dir}/${slug}-${locale}-${width}-cover.png`, animations: 'disabled' });
        await page.locator('#audit-direction .case-callout').scrollIntoViewIfNeeded();
        await page.waitForTimeout(450);
        assert(await page.locator('#audit-direction .case-callout img').evaluate(el => Number(getComputedStyle(el).opacity) > 0.9), 'Callout image stays hidden');
        await page.locator('#audit-direction .case-callout').screenshot({ path: `${dir}/${slug}-${locale}-${width}-callout.png`, animations: 'disabled' });
      }
      findings.push({ locale, slug, width, ...observation, text: undefined, alts: undefined, errors });
      await page.close();
    }
    // The copy request applies to every public page, including Home and About.
    for (const route of ['/', '/about/', ...['agent-ops-console', 'vet-clinic', 'pawly'].map(slug => '/work/' + slug + '/')]) {
      const page = await browser.newPage({ reducedMotion: 'reduce' });
      await page.goto(origin + prefix + route, { waitUntil: 'networkidle' });
      const text = await page.locator('body').innerText();
      const metadata = await page.locator('img,meta').evaluateAll(es => es.map(e => e.getAttribute('alt') || e.getAttribute('content') || '').join('\n'));
      assert(!forbidden.test(text + metadata), `${prefix}${route}: data disclaimer`);
      findings.push({ locale, route, dataDisclaimers: false });
      await page.close();
    }
  }
  // Verify the focus enhancement still yields a complete scene after resizing.
  for (const slug of ['partner-portal', 'learn']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(origin + '/ru/work/' + slug + '/', { waitUntil: 'networkidle' });
    const step = page.locator('.case-steps').first();
    await step.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(350);
    assert(await step.isVisible());
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    findings.push({ slug, normalMotionResize: 'passed' });
    await page.close();
  }
  console.log(`Passed ${findings.length} browser checks.`);
} finally {
  await browser.close();
  await productionServer?.close();
  await writeFile(dir + '/verification.json', JSON.stringify(findings, null, 2));
}
