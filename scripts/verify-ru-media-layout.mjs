/** Inspect every Russian portfolio route, responsive media and native specimens. */
import {createRequire} from 'node:module';
import {mkdir, writeFile} from 'node:fs/promises';
const {chromium} = createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const origin = process.argv[2] ?? 'http://127.0.0.1:4475';
const output = process.argv[3] ?? 'tmp/ru-media-layout';
const routes = ['/ru/', '/ru/about/', ...['agent-ops-console', 'partner-portal', 'learn', 'vet-clinic', 'pawly'].map(slug => `/ru/work/${slug}/`)];
const report = {origin, pages:[], failures:[]};
await mkdir(output, {recursive:true});
const browser = await chromium.launch({executablePath:process.env.HARMONY_CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try {
  for (const width of [1440, 820, 390, 360]) for (const route of routes) {
    const page = await browser.newPage({viewport:{width, height:1000}, reducedMotion:'reduce'});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(origin + route, {waitUntil:'load'});
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].filter(img => img.getAttribute('src')).map(img => {
        img.loading = 'eager'; return img.decode().catch(() => {});
      }));
    });
    const result = await page.evaluate(() => {
      const failures = [];
      if (document.documentElement.scrollWidth > innerWidth + 1) failures.push('Horizontal page overflow');
      if (document.documentElement.lang !== 'ru') failures.push('Incorrect page language');
      if (document.querySelector('vite-error-overlay')) failures.push('Error overlay');
      const images = [...document.images].filter(img => img.getAttribute('src') && img.getBoundingClientRect().width > 0);
      const media = images.map(img => {
        const rect = img.getBoundingClientRect();
        if (!img.naturalWidth) failures.push('Broken image: ' + img.currentSrc);
        // Natural UI captures must preserve their aspect ratio and complete edge.
        const frame = img.closest('.case-screen__media');
        const imageStyle = getComputedStyle(img);
        if (frame && img.naturalWidth && Math.abs(parseFloat(imageStyle.height) - parseFloat(imageStyle.width) * img.naturalHeight / img.naturalWidth) > 1) failures.push('Stretched capture: ' + img.currentSrc);
        if (frame && img.naturalWidth) {
          const box = frame.getBoundingClientRect();
          if (Math.abs(box.height - rect.height) > 1) failures.push('Capture frame has incorrect height: ' + img.currentSrc);
        }
        return {src:new URL(img.currentSrc).pathname, width:rect.width, height:rect.height, native:!!img.closest('.case-screen--native')};
      });
      const specimens = [...document.querySelectorAll('.case-specimen__set')].map(set => {
        const box = set.getBoundingClientRect();
        const style = getComputedStyle(set);
        const heading = getComputedStyle(set.querySelector('h5'));
        if (parseFloat(heading.marginTop) || parseFloat(heading.marginBottom)) failures.push('Default heading margins in specimen: ' + set.dataset.specimenSet);
        const content = [...set.querySelectorAll('h5, .case-specimen__state-label, .case-screen__media')].map(node => {
          const rect = node.getBoundingClientRect();
          if (rect.left < box.left - 1 || rect.right > box.right + 1) failures.push('Specimen outside its fields: ' + set.dataset.specimenSet);
          return {role:node.className || node.tagName, x:rect.left-box.left, y:rect.top-box.top, width:rect.width, height:rect.height};
        });
        for (const state of set.querySelectorAll('[data-specimen-state]')) {
          const label = state.querySelector('.case-specimen__state-label').getBoundingClientRect();
          const frame = state.querySelector('.case-screen__media').getBoundingClientRect();
          if (Math.abs(label.left - frame.left) > 1) failures.push('Specimen has inconsistent left fields: ' + set.dataset.specimenSet);
        }
        return {id:set.dataset.specimenSet, width:box.width, height:box.height, padding:style.padding, content};
      });
      for (const step of document.querySelectorAll('.case-steps--handoff .case-steps__step')) {
        const text = step.querySelector('.case-steps__text').getBoundingClientRect();
        const shot = step.querySelector('.case-steps__shot').getBoundingClientRect();
        if (Math.abs(text.left - shot.left) > 1) failures.push('Handoff frame is not aligned with its text');
        if (shot.top - text.bottom < 16) failures.push('Handoff frame lacks space below its text');
      }
      return {title:document.title, media, specimens, failures};
    });
    if (response.status() !== 200) result.failures.push('HTTP ' + response.status());
    result.failures.push(...errors);
    const key = `${route.split('/').filter(Boolean).slice(1).join('-') || 'home'}-${width}`;
    await page.screenshot({path:`${output}/${key}.png`, fullPage:true, animations:'disabled'});
    const specimen = page.locator('.case-specimen');
    if (await specimen.count()) await specimen.screenshot({path:`${output}/${key}-specimen.png`, animations:'disabled'});
    const zoom = page.locator('.case-specimen [data-zoom-trigger]').first();
    if (await zoom.count()) {
      await zoom.click();
      await page.locator('[data-media-zoom][open]').waitFor();
      const image = page.locator('[data-media-zoom-image]');
      await image.evaluate(img => img.decode());
      const zoomSize = await image.boundingBox();
      if (!zoomSize?.width || !zoomSize.height) result.failures.push('Empty enlarged specimen');
      await page.keyboard.press('Escape');
      if (await page.locator('[data-media-zoom][open]').count()) result.failures.push('Zoom did not close');
    }
    for (const trigger of await page.locator('[data-dialog-open]').all()) {
      const id = await trigger.getAttribute('data-dialog-open');
      await trigger.click();
      const dialog = page.locator(`dialog[id="${id}"][open]`);
      await dialog.waitFor();
      const overflow = await dialog.evaluate(node => node.scrollWidth > node.clientWidth + 1);
      if (overflow) result.failures.push('Project dialog overflows: ' + id);
      await page.keyboard.press('Escape');
    }
    report.pages.push({route, width, ...result});
    for (const issue of result.failures) report.failures.push({route, width, issue});
    await page.close();
    console.log(`${route} @ ${width}: ${result.media.length} images, ${result.specimens.length} sets, ${result.failures.length} issues`);
  }
} finally {await browser.close();}
await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({pages:report.pages.length, failures:report.failures}));
if (report.failures.length) process.exitCode = 1;
