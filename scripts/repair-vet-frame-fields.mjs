/** Preserve real clinical page fields around selected source DOM fragments.
 * Never remove the source header padding or crop text into rounded corners.
 * Run before Astro: Windows image readers can hold open public assets.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { browser, serve } from '../tasks/portfolio-rebuild/partner-portal/source-runtime.mjs';
import { captureNativeAlpha } from './lib/native-alpha-capture.mjs';

const dir = 'outputs/media-edge-audit', root = 'public/media/rebuild/vet-clinic';
await mkdir(`${dir}/originals`, { recursive: true });
const source = await serve('D:/Claude-projects/Veterinary-clinic/dist', true), b = await browser(), report = [];
async function capture(page, name, selectors, header = false) {
  const fields = await page.evaluate(({ selectors, header }) => {
    document.querySelector('[data-clinical-capture]')?.remove();
    const nodes = selectors.map(selector => document.querySelector(selector));
    if (nodes.some(node => !node)) throw Error(`Missing clinical source: ${selectors}`);
    const boxes = nodes.map(node => node.getBoundingClientRect());
    let fieldParent = nodes[0].parentElement;
    while (fieldParent && !['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].some(side => parseFloat(getComputedStyle(fieldParent)[side]))) fieldParent = fieldParent.parentElement;
    const css = fieldParent ? getComputedStyle(fieldParent) : getComputedStyle(nodes[0]);
    const padding = header ? [0, 0, 0, 0] : ['Top', 'Right', 'Bottom', 'Left'].map(side => parseFloat(css[`padding${side}`]) || 0);
    const origin = Math.min(...boxes.map(box => box.left));
    const contentWidth = Math.max(...boxes.map(box => box.right)) - origin;
    let background = nodes[0];
    while (background && getComputedStyle(background).backgroundColor === 'rgba(0, 0, 0, 0)') background = background.parentElement;
    const frame = document.createElement('div');
    frame.dataset.clinicalCapture = '';
    Object.assign(frame.style, { position: 'absolute', left: '0px', top: '0px', zIndex: '2147483647', display: 'flex',
      flexDirection: 'column', gap: 'var(--space-3)', boxSizing: 'border-box',
      width: `${contentWidth + padding[1] + padding[3]}px`, padding: padding.map(value => `${value}px`).join(' '),
      background: background ? getComputedStyle(background).backgroundColor : 'transparent' });
    for (const [i, node] of nodes.entries()) {
      const copy = node.cloneNode(true);
      Object.assign(copy.style, { position: 'static', flex: 'none', margin: '0',
        marginLeft: `${boxes[i].left - origin}px`, width: `${boxes[i].width}px` });
      frame.append(copy);
    }
    document.body.append(frame);
    return { sourceParent: fieldParent?.className, sourcePadding: css.padding, capturedPadding: padding,
      sourceHeaderPadding: header ? getComputedStyle(nodes[0]).padding : undefined,
      widths: boxes.map(box => box.width), contentWidth };
  }, { selectors, header });
  const file = `${root}/${name}.webp`;
  try { await writeFile(`${dir}/originals/${file.replaceAll('/', '-')}`, await readFile(file), { flag: 'wx' }); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
  const target = page.locator('[data-clinical-capture]'), text = await target.innerText();
  const bytes = await captureNativeAlpha(page, target);
  await writeFile(file, await sharp(bytes).webp({ quality: 94, alphaQuality: 100 }).toBuffer());
  const { width, height } = await sharp(bytes).metadata();
  report.push({ file, source: page.url(), viewport: page.viewportSize(), fields, selectors, width, height, text,
    sha256: createHash('sha256').update(await readFile(file)).digest('hex') });
  console.log(name, width, height, 'native fields:', fields.sourceHeaderPadding || fields.sourcePadding);
}
try {
  for (const lang of ['en', 'ru']) for (const width of [1440, 390]) {
    const variant = width === 390 ? 'narrow' : 'wide';
    const page = await b.newPage({ viewport: { width: width === 1440 ? 768 : width, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    const fixture = async name => JSON.parse(await readFile(`tasks/portfolio-rebuild/vet-clinic/fixture-${name}${lang === 'ru' ? '-ru' : ''}.json`, 'utf8'));
    const go = async route => { await page.goto(`${source.base}/${lang === 'ru' ? 'ru/' : ''}app/${route}?patient=marsik`, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); };
    const state = async name => page.evaluate(data => localStorage.setItem('vet-clinic-wire-data-v6', JSON.stringify(data)), await fixture(name));
    const header = '[class*="_visitHeader_"]', step = '[class*="_quickTraceStep_"]', actions = '[class*="_quickTraceActions_"]';
    await go('visit-quick-trace');
    await page.getByLabel(lang === 'ru' ? 'Вес, кг' : 'Weight, kg').first().fill('4.9');
    await capture(page, `draft-${lang}-${variant}`, [header, step, actions], true);
    await state('saved'); await go('visit-quick-trace');
    await capture(page, `saved-${lang}-${variant}`, [header, step, actions], true);
    if (width === 1440) await page.setViewportSize({ width: 1024, height: 900 });
    await go('visit-record');
    await capture(page, `trace-${lang}-${variant}`, [header, '[class*="_traceFacts_"]'], true);
    if (width === 1440) await page.setViewportSize({ width, height: 900 });
    await go('invoice-draft');
    await capture(page, `invoice-${lang}-${variant}`, ['[class*="_invoiceDoc_"]']);
    await state('behind'); await go('discharge-preview');
    await capture(page, `publication-${lang}-${variant}`, width === 390 ? ['[class*="_publishPanel_"]'] : [
      '[class*="_publishPanel_"] > [class*="_publishState_"]',
      '[class*="_publishPanel_"] > [role="status"]',
      '[class*="_publishPanel_"] > [data-layout="stacked"]',
    ]);
    if (width === 390) {
      await state('published'); await go('owner-home');
      await capture(page, `owner-detail-${lang}`, ['[class*="_ownerPet_"]', '[class*="_ownerStatus_"]', '[aria-labelledby="owner-prescription"]', '[data-track="owner-discharge-open"]']);
      await page.evaluate(() => localStorage.clear()); await go('vet-day-queue');
      await capture(page, `queue-${lang}-narrow`, ['[class*="_dayBlock_"]', '[class*="_queueSection_"]']);
    }
    await page.close();
  }
} finally {
  await b.close(); await source.close();
  await writeFile(`${dir}/vet-fields.json`, JSON.stringify(report, null, 2));
}
