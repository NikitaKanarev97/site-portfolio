import fs from 'node:fs';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const require = createRequire(process.env.PLAYWRIGHT_PACKAGE_JSON ?? 'D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const browser = await chromium.launch();
const root = 'audit/vet-portfolio-case-v2/regressions'; fs.mkdirSync(root, { recursive: true });
const homeOnly = process.argv.includes('--home-only');
const previous = homeOnly ? JSON.parse(fs.readFileSync(`${root}/results.json`)) : undefined;
const results = previous ? previous.results.filter(r => !r.name.includes('-home-')) : [], homes = [], beforeFindings = previous?.beforeFindings ?? [];
const hash = data => createHash('sha256').update(data).digest('hex');
async function settle(page) {
  await page.evaluate(async () => { await document.fonts.ready; document.querySelectorAll('img').forEach(i => i.loading = 'eager'); await Promise.all([...document.images].filter(i => i.src).map(i => i.decode().catch(() => {}))); });
  for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 750) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(25); }
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(350);
  // Native media playback is variable across two servers. Compare the same
  // actual frame, without changing CSS, images or page contents.
  await page.evaluate(() => document.querySelectorAll('video').forEach(v => { v.pause(); v.currentTime = 0; }));
  await page.waitForTimeout(350);
}
for (const locale of ['en', 'ru']) for (const width of [1440, 390]) {
  const pair = {};
  for (const [phase, base] of [['before', 'http://127.0.0.1:5372'], ['after', 'http://127.0.0.1:5371']]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const prefix = locale === 'ru' ? '/ru' : '';
    for (const slug of homeOnly ? [] : ['learn', 'pawly', ...(locale === 'en' ? ['agent-ops-console', 'partner-portal'] : [])]) {
      await page.goto(base + prefix + '/work/' + slug, { waitUntil: 'networkidle' }); await settle(page);
      const data = await page.screenshot({ path: `${root}/${locale}-${width}-${slug}-${phase}.png`, fullPage: true });
      const measurements = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, height: document.documentElement.scrollHeight, title: document.title }));
      const key = `${locale}-${width}-${slug}`;
      (pair[key] ??= {})[phase] = { hash: hash(data), ...measurements };
    }
    await page.goto(base + prefix + '/', { waitUntil: 'networkidle' }); await settle(page);
    for (const slug of ['agent-ops-console', 'partner-portal', 'learn', 'pawly']) {
      const card = page.locator('#work-' + slug);
      await card.scrollIntoViewIfNeeded(); await page.waitForTimeout(250);
      await page.evaluate(() => document.querySelectorAll('video').forEach(v => { v.pause(); v.currentTime = 0; }));
      await page.waitForTimeout(200);
      const data = await card.screenshot({ path: `${root}/${locale}-${width}-home-${slug}-${phase}.png` });
      const key = `${locale}-${width}-home-${slug}`;
      (pair[key] ??= {})[phase] = { hash: hash(data) };
    }
    if (phase === 'after') {
      await page.locator('#work-vet-clinic').screenshot({ path: `${root}/${locale}-${width}-vet-home.png` });
      homes.push(await page.evaluate(() => ({ locale: document.documentElement.lang, width: innerWidth, overflow: document.documentElement.scrollWidth - innerWidth, vetImages: [...document.querySelectorAll('#work-vet-clinic img')].map(i => i.currentSrc), vetLink: document.querySelector('#work-vet-clinic h2 a').getAttribute('href') })));
    } else if (!homeOnly) {
      await page.goto(base + prefix + '/work/vet-clinic', { waitUntil: 'networkidle' }); await settle(page);
      await page.screenshot({ path: `${root}/${locale}-${width}-vet-before-viewport.png` });
      await page.screenshot({ path: `${root}/${locale}-${width}-vet-before-full.png`, fullPage: true });
      if (width === 1440) {
        await page.addScriptTag({ path: require.resolve('axe-core') });
        beforeFindings.push({ locale, width, violations: await page.evaluate(async () => (await window.axe.run('.case-story', { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa'] } })).violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))) });
      }
    }
    await page.close();
  }
  for (const [name, value] of Object.entries(pair)) results.push({ name, ...value, identical: value.before.hash === value.after.hash });
  fs.writeFileSync(`${root}/results.json`, JSON.stringify({ baseline: '561e6830392b6e9a25e61e30cafe394586df3ff4', results, homes, beforeFindings }, null, 2));
  console.log(locale, width, Object.keys(pair).length, 'comparisons');
}
await browser.close();
if (results.some(r => !r.identical) || homes.some(h => h.overflow !== 0)) process.exitCode = 1;
