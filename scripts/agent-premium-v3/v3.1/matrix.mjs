import {launch, ready, save} from '../capture.mjs';
import {mkdir, writeFile, readFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
export const root = 'audit/agent-ops-portfolio-premium-v3/v3.1';
export {launch, ready, save};
const phase = process.argv[2];
if (phase === 'before' || phase === 'after') {
 const origin = process.argv[3] ?? 'http://127.0.0.1:4416';
 const dir = `${root}/${phase}`;
 await mkdir(dir, {recursive:true});
 const checks = [], browser = await launch();
 try {
  for (const locale of ['en','ru']) for (const width of [360,390,1440,320]) {
   const height = width === 390 ? 844 : width < 768 ? 800 : 900;
   const context = await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
   const page = await context.newPage(), errors = [], failed = [];
   page.on('pageerror', e => errors.push(e.message));
   page.on('response', r => {if(r.status() >= 400) failed.push(r.url());});
   await page.goto(`${origin}${locale === 'ru' ? '/ru' : ''}/work/agent-ops-console/`, {waitUntil:'networkidle'});
   await ready(page);
   const name = `${locale}-${width}`;
   await save(page, `${dir}/${name}-viewport`);
   await save(page, `${dir}/${name}-full`, null, true);
   for (const id of ['problem','operating-model','investigation','checkpoint','policy','autonomy','outcome']) {
    const el = page.locator(`#${id}`);
    await el.scrollIntoViewIfNeeded();
    await save(page, `${dir}/${name}-${id}`, el);
   }
   // Every semantic heading, heading-role paragraph, definition heading and disclosure.
   const headings = page.locator('.agent-case :is(h1,h2,h3,p[class*="ds-heading"],dt[class*="ds-heading"],summary)');
   const inventory = await headings.evaluateAll(els => els.map(el => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), broken = [];
    while(walker.nextNode()) {
     const node = walker.currentNode;
     for(const match of node.textContent.matchAll(/[\p{L}\p{N}]+/gu)) {
      const range = document.createRange(); range.setStart(node,match.index);range.setEnd(node,match.index+match[0].length);
      const lines = new Set([...range.getClientRects()].filter(r=>r.width).map(r=>Math.round(r.top)));
      if(lines.size > 1) broken.push(match[0]);
     }
    }
    const r = el.getBoundingClientRect();
    return {text:el.textContent.trim(),tag:el.tagName,font:getComputedStyle(el).fontSize,broken,overflow:el.scrollWidth>el.clientWidth+1,outside:r.left<0||r.right>innerWidth+1};
   }));
   const crops = [];
   for(let i=0;i<await headings.count();i++) {
    const data = await headings.nth(i).screenshot();
    const meta = await sharp(data).metadata();
    crops.push({data,width:meta.width,height:meta.height});
   }
   // Actual browser pixels only; separated rows let reviewers inspect every heading.
   const sheetWidth = Math.max(...crops.map(c=>c.width)) + 32;
   let top = 16;
   const composite = crops.map(c=>{const item={input:c.data,left:16,top};top+=c.height+24;return item;});
   await sharp({create:{width:sheetWidth,height:top,channels:3,background:'#ffffff'}}).composite(composite).webp({lossless:true}).toFile(`${dir}/${name}-headings.webp`);
   checks.push({locale,width,height,errors,failed,headings:inventory,...await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth-innerWidth,
    sections:[...document.querySelectorAll('.agent-section')].map(e=>e.id),
    images:[...document.querySelectorAll('.agent-case img')].map(i=>({src:i.getAttribute('src'),current:i.currentSrc,broken:!i.naturalWidth})),
    words:document.querySelector('.agent-sheet').innerText.split(/\s+/).length,
    amounts:(()=>{
     const walker=document.createTreeWalker(document.querySelector('.agent-case'),NodeFilter.SHOW_TEXT), amounts=[];
     while(walker.nextNode())for(const match of walker.currentNode.textContent.matchAll(/[$€£]\s?\d+(?:[\s.,]\d{3})*(?:[.,]\d{1,2})?/g)) {
      const range=document.createRange();range.setStart(walker.currentNode,match.index);range.setEnd(walker.currentNode,match.index+match[0].length);
      const rects=[...range.getClientRects()].filter(r=>r.width);
      amounts.push({text:match[0],lines:new Set(rects.map(r=>Math.round(r.top))).size});
     }
     return amounts;
    })(),
   }))});
   await context.close(); console.log(`${phase}: ${name}, ${inventory.length} headings, ${inventory.flatMap(h=>h.broken).length} broken words`);
  }
  // All non-Agent built routes are protected, including full document content.
  const hashes = {};
  async function walk(path) {for(const e of await readdir(path,{withFileTypes:true})) {const p=`${path}/${e.name}`;if(e.isDirectory())await walk(p);else if(e.name.endsWith('.html')&&!p.includes('/agent-ops-console/'))hashes[p]=createHash('sha256').update(await readFile(p)).digest('hex');}}
  await walk('dist');
  await writeFile(`${dir}/protected-html.json`,JSON.stringify(hashes,null,2));
 } finally {
  await writeFile(`${dir}/checks.json`,JSON.stringify(checks,null,2)); await browser.close();
 }
}
