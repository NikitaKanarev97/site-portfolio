import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const root = 'tasks/robert-review-2026-10-07/fixes-execution';
const browser = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const results = [];
const failures = [];
const check = (condition, name, detail) => { results.push({ name, pass: Boolean(condition), detail }); if (!condition) failures.push(name); };
async function pageFor(width, reducedMotion = 'reduce') {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion });
  const page = await context.newPage();
  page.on('pageerror', error => failures.push('browser: ' + error.message));
  return page;
}
try {
  const mobile = await pageFor(360);
  await mobile.goto('http://127.0.0.1:4410/work/pawly/', { waitUntil: 'networkidle' });
  const next = mobile.locator('[data-carousel-next]').first();
  const before = await mobile.locator('[data-carousel-index]').first().textContent();
  await next.click();
  const after = await mobile.locator('[data-carousel-index]').first().textContent();
  const box = await next.boundingBox();
  check(after !== before, 'Pawly carousel advances with reduced motion', { before, after });
  check(box.width >= 44 && box.height >= 44, 'Carousel button touch target', box);
  const zoom = mobile.locator('.case-carousel__slide [data-zoom-trigger]').nth(1);
  await zoom.click();
  check(await mobile.locator('dialog[open]').count() === 1, 'Carousel zoom opens');
  await mobile.keyboard.press('Escape');
  check(await mobile.locator('dialog[open]').count() === 0, 'Zoom Escape closes');
  check(await zoom.evaluate(el => document.activeElement === el), 'Zoom returns keyboard focus');
  await mobile.goto('http://127.0.0.1:4410/work/learn/', { waitUntil: 'networkidle' });
  const visibleLearn = await mobile.locator('.learn-stage figure').evaluateAll(els => els.filter(el => getComputedStyle(el).display !== 'none').length);
  check(visibleLearn === 1, 'Learn mobile cover has one frame', visibleLearn);
  const details = mobile.locator('[data-specimen-disclosure]');
  check(!await details.evaluate(el => el.open), 'Mobile specimen starts collapsed');
  await details.locator('summary').focus();
  await mobile.keyboard.press('Enter');
  check(await details.evaluate(el => el.open), 'Specimen opens from keyboard');
  check(await mobile.locator('.case-specimen__foundation').count() === 0, 'Specimen omits typography and palette catalogue');
  const nativeZoom = details.locator('[data-zoom-trigger]').first();
  const nativeBox = await nativeZoom.boundingBox();
  check(nativeBox.height >= 44, 'Native specimen zoom touch target', nativeBox);
  for (const image of await mobile.locator('.case-routes details[open] img, .case-routes__completion img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(el => el.decode());
  }
  await mobile.locator('.case-routes').screenshot({ path: root + '/A-learn-routes-mobile.png' });
  await mobile.goto('http://127.0.0.1:4410/ru/work/vet-clinic/', { waitUntil: 'networkidle' });
  const visibleVet = await mobile.locator('.vet-stage figure').evaluateAll(els => els.filter(el => getComputedStyle(el).display !== 'none').length);
  check(visibleVet === 1, 'Vet RU mobile cover has one frame', visibleVet);
  const desktop = await pageFor(1440, 'no-preference');
  await desktop.goto('http://127.0.0.1:4410/work/agent-ops-console/', { waitUntil: 'networkidle' });
  const stepRoot = desktop.locator('.case-steps');
  check(await stepRoot.evaluate(el => el.classList.contains('is-focused')), 'Agent desktop focus stage initializes');
  await desktop.evaluate(() => {
    const root = document.querySelector('.case-steps');
    const spacer = root.parentElement;
    window.scrollTo(0, spacer.getBoundingClientRect().top + scrollY + spacer.offsetHeight - innerHeight);
  });
  await desktop.waitForTimeout(1500);
  const decision = desktop.locator('.case-steps__step[data-scene="decision"]');
  check(await decision.evaluate(el => getComputedStyle(el).visibility !== 'hidden'), 'Agent final decision visible after scroll');
  check(await decision.locator('.case-steps__stop-symbol svg').count() === 1, 'Human review uses person SVG');
  const person = decision.locator('.case-steps__stop-symbol');
  const personBox = await person.boundingBox();
  check(personBox.width <= 48 && personBox.height <= 48, 'Human review symbol is compact', personBox);
  await stepRoot.screenshot({ path: root + '/A-agent-focus-desktop.png' });
  check(await desktop.locator('.case-next__title').count() === 1, 'Next case shows one title');
  check(await desktop.locator('.case-next [data-motion="marquee"]').count() === 0, 'Next case has no marquee');
  await desktop.goto('http://127.0.0.1:4410/work/pawly/', { waitUntil: 'networkidle' });
  for (const image of await desktop.locator('#return-boundary img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(el => el.decode());
  }
  await desktop.locator('#return-boundary').screenshot({ path: root + '/A-pawly-steps-desktop.png' });
  const tops = await desktop.locator('#return-boundary .case-steps__shot').evaluateAll(els => els.map(el => el.getBoundingClientRect().top));
  check(Math.max(...tops) - Math.min(...tops) < 2, 'Pawly phone sequence shares a top axis', tops);
  const geometry = await desktop.locator('#return-boundary .case-steps__step').evaluateAll(els => els.map(el => {
    const text = el.querySelector('.case-steps__text').getBoundingClientRect();
    const shot = el.querySelector('.case-steps__shot').getBoundingClientRect();
    return { width: shot.width, textBottom: text.bottom, shotTop: shot.top };
  }));
  check(geometry.every(item => item.width > 200 && item.shotTop >= item.textBottom), 'Pawly phones stay readable below text', geometry);
} catch (error) { failures.push(error.stack); }
finally { await browser.close(); }
fs.writeFileSync(root + '/A-targeted.json', JSON.stringify({ results, failures }, null, 2));
console.log(results.length + ' targeted checks; ' + failures.length + ' failures.');
if (failures.length) console.log(failures.join('\n'));
process.exitCode = failures.length ? 1 : 0;
