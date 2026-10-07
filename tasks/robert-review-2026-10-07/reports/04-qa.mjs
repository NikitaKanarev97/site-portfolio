import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const require = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const { chromium } = require('playwright');
const output = fileURLToPath(new URL('./04-evidence/', import.meta.url));
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const records = [];
const base = 'http://127.0.0.1:4404';
const cases = { agent: 'agent-ops-console', portal: 'partner-portal', pawly: 'pawly' };
const themes = Object.keys(cases);
try {
  for (const locale of ['en', 'ru']) for (const width of [360, 1440]) {
    const prefix = locale === 'ru' ? '/ru' : '';
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    for (const route of [`${prefix}/`, ...themes.map(theme => `${prefix}/work/${cases[theme]}`)]) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
      await page.evaluate(() => document.fonts.ready);
      const home = route === `${prefix}/`;
      const inspected = home ? themes : [themes.find(theme => route.endsWith(cases[theme]))];
      const record = { locale, width, route, reducedMotion: true, scenes: [], errors: [] };
      record.overflow = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
      for (const theme of inspected) {
        const root = page.locator(home ? `.featured-case--${theme} .work-stage` : theme === 'agent' ? '.case-opening__panels' : `.work-stage--${theme}`).first();
        await root.scrollIntoViewIfNeeded();
        await page.waitForTimeout(150);
        const scene = await root.evaluate((node, theme) => {
          const box = element => { const r = element.getBoundingClientRect(); return { x:r.x, y:r.y, width:r.width, height:r.height }; };
          const styles = getComputedStyle(node);
          const result = { theme, box:box(node), background:styles.backgroundColor, gap:styles.gap, text:node.innerText,
            panels:[...node.querySelectorAll('[data-cover-panel]')].map(element => ({ opacity:getComputedStyle(element).opacity, transform:getComputedStyle(element).transform })),
            images:[...node.querySelectorAll('img')].map(image => ({ loaded:image.complete && image.naturalWidth > 0, source:new URL(image.currentSrc).pathname, box:box(image) })),
            links:[...node.querySelectorAll('a')].map(link => ({href:link.getAttribute('href'), label:link.getAttribute('aria-label')})) };
          if (theme === 'agent') { const gate = node.querySelector('[data-cover-gate]'); result.gate = {text:gate?.innerText, svg:!!gate?.querySelector('svg'), opacity:gate && getComputedStyle(gate).opacity}; }
          if (theme === 'portal') result.example = { number:node.querySelector('.work-stage__figure')?.textContent, detail:node.querySelector('.work-stage__detail')?.textContent, oldSourceRow:!!node.innerText.match(/SOURCE ROW|ИСХОДНАЯ СТРОКА/i) };
          if (theme === 'pawly') { const photo=node.querySelector('.work-stage__photo img'), report=node.querySelector('.work-stage__panel'); result.pair = {photo:box(photo), report:box(report), topDifference:box(photo).y-box(report).y, horizontalGap:box(report).x-box(photo).x-box(photo).width}; }
          return result;
        }, theme);
        scene.screenshot = `${home ? 'home' : 'cover'}-${theme}-${locale}-${width}.png`;
        await root.screenshot({ path: `${output}/${scene.screenshot}` });
        const link = root.locator('a').first();
        await link.focus();
        await page.keyboard.press('Tab');
        await page.keyboard.press('Shift+Tab');
        scene.keyboardFocus = await link.evaluate(element => ({focused:document.activeElement === element, outline:getComputedStyle(element).outlineStyle}));
        if (!home) {
          const source = await link.locator('img').evaluate(image => image.currentSrc);
          await page.keyboard.press('Enter');
          const dialog = page.locator('[data-media-zoom]');
          await dialog.waitFor({ state: 'visible' });
          scene.zoom = await dialog.evaluate((element, source) => ({ open:element.open, sameSource:element.querySelector('[data-media-zoom-image]').src === source }), source);
          await page.keyboard.press('Escape');
          await dialog.waitFor({ state: 'hidden' });
          scene.zoom.focusReturned = await link.evaluate(element => document.activeElement === element);
        }
        record.scenes.push(scene);
      }
      record.errors = errors.splice(0);
      records.push(record);
      console.log(`${locale} ${width} ${route}: overflow ${record.overflow.document}/${width}, scenes ${record.scenes.length}, errors ${record.errors.length}`);
    }
    await page.close();
  }
  for (const locale of ['en', 'ru']) for (const width of [360,1440]) {
    const prefix = locale === 'ru' ? '/ru' : '';
    const page = await browser.newPage({viewport:{width,height:1000},reducedMotion:'no-preference'});
    await page.goto(`${base}${prefix}/work/agent-ops-console`, {waitUntil:'networkidle'});
    await page.addStyleTag({content:'astro-dev-toolbar {display:none !important;}'});
    await page.locator('.case-opening__panels').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1700);
    const settled = await page.locator('.case-opening').evaluate(node => ({ panels:[...node.querySelectorAll('[data-cover-panel]')].map(panel => ({opacity:getComputedStyle(panel).opacity,transform:getComputedStyle(panel).transform})), gateOpacity:getComputedStyle(node.querySelector('[data-cover-gate]')).opacity }));
    await page.locator('.case-opening__panels').screenshot({path:`${output}/cover-agent-${locale}-${width}-motion.png`});
    await page.emulateMedia({reducedMotion:'reduce'});
    const reduced = await page.locator('.case-opening').evaluate(node => ({panels:[...node.querySelectorAll('[data-cover-panel]')].map(panel => ({opacity:getComputedStyle(panel).opacity,transform:getComputedStyle(panel).transform})),gateOpacity:getComputedStyle(node.querySelector('[data-cover-gate]')).opacity}));
    await page.goto(`${base}${prefix}/`, {waitUntil:'networkidle'});
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.locator('.work-stage__gate').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    const home = await page.locator('.work-stage--agent').evaluate(node => ({panelCount:node.querySelectorAll('[data-cover-panel]').length,gateOpacity:getComputedStyle(node.querySelector('[data-cover-gate]')).opacity,svg:!!node.querySelector('.work-stage__gate svg')}));
    records.push({locale,width,motion:{settled,reduced,home}});
    await page.close();
  }
} finally {
  await writeFile(`${output}/verification.json`, JSON.stringify({date:'2026-10-07',base,records},null,2));
  await browser.close();
}
