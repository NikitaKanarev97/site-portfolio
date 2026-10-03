/** Read-only server over accepted catalog; capture chrome may adapt, product UI does not. */
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, extname, relative } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const source = 'D:/Claude-projects/b2b-dssl';
const root = resolve(source, 'storybook-static');
const out = resolve('public/media/rebuild/common/portal');
mkdirSync(out, { recursive: true });
const mime = { '.html':'text/html', '.js':'text/javascript', '.json':'application/json', '.css':'text/css', '.woff2':'font/woff2', '.svg':'image/svg+xml', '.png':'image/png' };
const server = createServer((req, res) => {
  const path = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (relative(root, path).startsWith('..') || !existsSync(path)) { res.writeHead(404); res.end(); return; }
  try { res.setHeader('Content-Type', mime[extname(path)] || 'application/octet-stream'); res.end(readFileSync(path)); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const require = createRequire(source + '/package.json');
const browser = await require('playwright').chromium.launch({ executablePath: process.env.COMMON_CHROME || 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const selected = [
  ['fileupload', 'empty'], ['fileupload', 'complete'], ['fileupload', 'error'],
  ['resolutionrow', 'ambiguous'], ['resolutionrow', 'missing'], ['resolutionrow', 'error'], ['resolutionrow', 'confirmed-from-ambiguous'],
  ['availability', 'verified'], ['availability', 'stale'], ['availability', 'not-confirmed'],
  ['quantitystepper', 'default'], ['quantitystepper', 'at-minimum'], ['quantitystepper', 'disabled'],
];
const manifest = [];
const sha = data => createHash('sha256').update(data).digest('hex');
try {
  for (const [family, state] of (process.argv.includes('--inspect') ? [['availability','stale']] : selected)) for (const width of [480, 288]) {
    const id = `components-domain-${family}--${state}`;
    const bleed = 2; // Capture chrome only; keep the actual component at `width` CSS px.
    const context = await browser.newContext({ viewport: { width: width + bleed * 2, height: 1200 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${base}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelector('#storybook-root')?.children.length > 0);
    await page.evaluate(() => document.fonts.ready);
    const sourceCanvas = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    // Catalog canvas only. The source component's rules, fields, actions and tones stay intact.
    await page.addStyleTag({ content: `html, body, #storybook-root { margin:0!important; background:transparent!important; } html, #storybook-root { padding:0!important; } body { padding:${bleed}px!important; } #storybook-root > .flex { width:100%!important; }` });
    const node = page.locator('#storybook-root > *').first();
    // Storybook's body.sb-show-main !important rule beats a generic canvas selector.
    // Inline chrome styles remove it. A transparent product root keeps the same
    // inherited source surface *inside its own rounded contour*, never outside it.
    await node.evaluate((el, canvas) => {
      const component = el.hasAttribute('data-slot') ? el : el.querySelector('[data-slot]');
      if (!component) throw new Error('No actual component root');
      const background = getComputedStyle(component).backgroundColor;
      if (background === 'rgba(0, 0, 0, 0)' || background === 'transparent') component.style.backgroundColor = canvas;
      for (const chrome of [document.documentElement, document.body, document.querySelector('#storybook-root')]) {
        chrome.style.setProperty('background', 'transparent', 'important');
      }
      if (getComputedStyle(document.body).backgroundColor !== 'rgba(0, 0, 0, 0)') throw new Error('Source canvas is still opaque');
    }, sourceCanvas);
    const text = (await node.innerText()) || (await node.locator('input').count() ? `Quantity ${await node.locator('input').first().inputValue()}` : '');
    if (!text.trim() || /Oops|could not render|No Preview/.test(text) || errors.length) throw new Error(`${id}: ${errors.join(',')} ${text}`);
    const bounds = await node.boundingBox();
    if (!bounds) throw new Error(`${id}: no visible source bounds`);
    if(process.argv.includes('--inspect')) console.log(JSON.stringify(await node.evaluate(el=>({html:el.outerHTML,ancestors:[el,...(()=>{const a=[];let e=el.parentElement;while(e){a.push(e);e=e.parentElement;}return a;})()].map(e=>({tag:e.tagName,class:e.className,background:getComputedStyle(e).background,rect:e.getBoundingClientRect().toJSON()}))})),null,2));
    const buffer = await sharp(await page.screenshot({ omitBackground:true, clip:{
      x:bounds.x-bleed, y:bounds.y-bleed,
      width:bounds.width+bleed*2, height:bounds.height+bleed*2,
    }})).webp({ quality: 94 }).toBuffer();
    const name = `${family}-${state}-${width}.webp`;
    writeFileSync(resolve(out, name), buffer);
    const dimensions = await sharp(buffer).metadata();
    manifest.push({ mediaId: `portal-${family}-${state}`, file: `/media/rebuild/common/portal/${name}`, source: source + '/storybook-static/iframe.html', story: id,
      viewport: { width:width+bleed*2, height:1200 }, componentWidth:width, bleed, dpr:2, locale:'en', fixture:'canonical accepted CSF args', origin:'actual accepted domain component',
      selection: 'A-DS / HA-DS-01', captureChromeAdaptation:'inline transparent canvas overrides Storybook background; original inherited source surface retained only within the actual component contour; 2 CSS px alpha bleed; decorator constrained to component viewport',
      width:dimensions.width, height:dimensions.height, sha256:sha(buffer), visibleText:text, errors });
    await context.close();
    console.log(name, dimensions.width, dimensions.height);
  }
  const sourceFiles = ['src/tokens/primitives.css','src/tokens/semantics.css','src/tokens/typography.css',
    ...['ResolutionRow','FileUpload','Availability','QuantityStepper'].flatMap(f => [`src/components/${f}/${f}.tsx`,`src/components/${f}/${f}.stories.tsx`]), 'storybook-static/index.json'];
  if(!process.argv.includes('--inspect')) writeFileSync('tasks/portfolio-rebuild/common/captures.json', JSON.stringify({ generated:'2026-10-04', sources:sourceFiles.map(file => ({file:source+'/'+file,sha256:sha(readFileSync(source+'/'+file))})), media:manifest }, null, 2));
} finally { await browser.close(); await new Promise(r => server.close(r)); }
