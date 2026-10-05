/** Re-render real product DOM for portfolio presentation. No raster retouch.
 * Read-only source servers: Vet preview :5261, Pawly Vite :5173.
 * UI corrections live in the product repositories, not screenshot overrides.
 */
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const { chromium } = createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const dir = 'tmp/ui-cleanup';
await mkdir(dir, {recursive:true});
const report = { captures:[], checks:[], corrections: [
  'Vet: one divider between header and facts, consistent left edge, no trailing fact rule.',
  'Vet invoice: last service has no bottom rule; total owns the boundary.',
  'Pawly: natural document height and footer in flow; full demo explanation; no footer rule.',
]};
const vetCSS = `
  [data-clean-frame] { position:absolute; inset-block-start:0; inset-inline-start:0; z-index:2147483647; display:grid; gap:var(--space-3); background:var(--surface-default); }
  [data-clean-frame] > * { width:100%; min-width:0; margin:0; }
  /* Strip only the header's outer capture margin, aligning source crops. */
  [data-clean-frame] [class*="_visitHeader_"] { padding:0; }
  /* A complete document capture uses the action bar's natural flow position. */
  [data-clean-frame] [class*="_quickTraceActions_"] { position:static; }
`;
async function shoot(page,file,selector) {
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));});
  const node=page.locator(selector);
  const bytes=await node.screenshot();
  if(selector==='[data-clean-frame]') {
    const overlap=await node.evaluate(frame=>[...frame.children].some((child,i,nodes)=>i>0&&child.getBoundingClientRect().top<nodes[i-1].getBoundingClientRect().bottom-0.5));
    if(overlap) throw Error(`Overlapping capture panels: ${file}`);
    const {data,info}=await sharp(bytes).removeAlpha().raw().toBuffer({resolveWithObject:true});
    for(let y=0;y<2;y++) {
      let tinted=0;
      for(let x=0;x<info.width;x++) {
        const k=(y*info.width+x)*info.channels;
        if(Math.min(data[k],data[k+1],data[k+2])<252) tinted++;
      }
      if(tinted/info.width>0.9) throw Error(`Foreign line at capture edge: ${file}, row ${y}`);
    }
  }
  await copyFile(file, `${dir}/${file.replaceAll('/','-')}`);
  await sharp(bytes).webp({quality:94}).toFile(file);
  const metadata=await sharp(file).metadata();
  report.captures.push({file,route:page.url(),viewport:page.viewportSize(),width:metadata.width,height:metadata.height,sha256:createHash('sha256').update(await readFile(file)).digest('hex')});
  console.log(file,metadata.width,metadata.height);
}
async function compose(page,selectors) {
  await page.evaluate(selectors=>{
    document.querySelector('[data-clean-frame]')?.remove();
    const nodes=selectors.map(selector=>document.querySelector(selector));
    if(nodes.some(node=>!node)) throw new Error(`Missing source DOM: ${selectors}`);
    const wrapper=document.createElement('div');
    wrapper.dataset.cleanFrame='';
    wrapper.style.width=Math.min(...nodes.map(node=>node.getBoundingClientRect().width))+'px';
    for(const node of nodes) wrapper.append(node.cloneNode(true));
    document.body.append(wrapper);
  },selectors);
}
try {
  for(const locale of ['en','ru']) for(const width of [1024,390]) {
    const variant=width===390?'narrow':'wide';
    const root='public/media/rebuild/vet-clinic';
    const saved=JSON.parse(await readFile(`tasks/portfolio-rebuild/vet-clinic/fixture-saved${locale==='ru'?'-ru':''}.json`,'utf8'));
    const quick=await browser.newPage({viewport:{width:width===1024?1440:width,height:width===1024?816:844},deviceScaleFactor:2,reducedMotion:'reduce'});
    const quickURL=`http://127.0.0.1:5261/${locale==='ru'?'ru/':''}app/visit-quick-trace?patient=marsik`;
    await quick.goto(quickURL,{waitUntil:'networkidle'});
    await quick.addStyleTag({content:vetCSS});
    const header='[class*="_visitHeader_"]',step='[class*="_quickTraceStep_"]',actions='[class*="_quickTraceActions_"]';
    if(width===390) {
      await compose(quick,[header,step,'[class*="_traceDose_"]','[class*="_quickTraceNote_"]',actions]);
      await shoot(quick,`${root}/cover-${locale}-${variant}.webp`,'[data-clean-frame]');
    } else {
      await shoot(quick,`${root}/cover-${locale}-${variant}.webp`,'[class*="_quickTraceFrame_"]');
      await quick.setViewportSize({width:768,height:900});
    }
    // Fill the real form before cloning its selected source panels.
    await quick.getByLabel(locale==='ru'?'Вес, кг':'Weight, kg').first().fill('4.9');
    await compose(quick,[header,step,actions]);
    await shoot(quick,`${root}/draft-${locale}-${variant}.webp`,'[data-clean-frame]');
    await quick.evaluate(data=>localStorage.setItem('vet-clinic-wire-data-v6',JSON.stringify(data)),saved);
    await quick.goto(quickURL,{waitUntil:'networkidle'});
    await quick.addStyleTag({content:vetCSS});
    await compose(quick,[header,step,actions]);
    await shoot(quick,`${root}/saved-${locale}-${variant}.webp`,'[data-clean-frame]');
    await quick.close();
    const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:2,reducedMotion:'reduce'});
    await page.addInitScript(data=>localStorage.setItem('vet-clinic-wire-data-v6',JSON.stringify(data)),saved);
    const go=async route=>{await page.goto(`http://127.0.0.1:5261/${locale==='ru'?'ru/':''}app/${route}?patient=marsik`,{waitUntil:'networkidle'});await page.addStyleTag({content:vetCSS});};
    await go('visit-record');
    await compose(page,['[class*="_visitHeader_"]','[class*="_traceFacts_"]']);
    const checks=await page.locator('[data-clean-frame]').evaluate(node=>({
      headerRule:getComputedStyle(node.querySelector('[class*="_visitHeader_"]')).borderBottomWidth,
      factsRule:getComputedStyle(node.querySelector('[class*="_traceFacts_"]')).borderTopWidth,
      lastRule:getComputedStyle(node.querySelector('[class*="_traceFacts_"]').lastElementChild).borderBottomWidth,
    }));
    if(checks.headerRule!=='0px'||checks.factsRule!=='1px'||checks.lastRule!=='0px') throw Error(JSON.stringify(checks));
    report.checks.push({locale,width,type:'trace',...checks});
    await shoot(page,`${root}/trace-${locale}-${variant}.webp`,'[data-clean-frame]');
    if(width===1024) await page.setViewportSize({width:1440,height:900});
    await go('invoice-draft');
    const lastRow=page.locator('[class*="_invoiceItems_"] > [role="row"]').last();
    if(await lastRow.evaluate(node=>getComputedStyle(node).borderBottomWidth)!=='0px') throw Error('Invoice trailing rule');
    await shoot(page,`${root}/invoice-${locale}-${variant}.webp`,'[class*="_invoiceDoc_"]');
    await page.close();
  }
  const manifest=JSON.parse(await readFile('D:/Claude-projects/PETS-walking/audit/product-polish/evidence/06-case/media-manifest.json','utf8'));
  for(const locale of ['en','ru']) {
    const fixture=structuredClone(manifest.fixture);
    const completed=manifest.records.find(record=>record.name==='order-details'&&record.locale===locale);
    fixture.booking=completed.booking;fixture.earnings=completed.earnings;
    const page=await browser.newPage({viewport:{width:390,height:1200},deviceScaleFactor:1.5,reducedMotion:'reduce'});
    await page.route('**/*',async route=>{
      if(route.request().isNavigationRequest()) {
        const response=await route.fetch();
        return route.fulfill({response,body:(await response.text()).replace('/src/main.tsx','/audit/product-polish/evidence/02-pilot/harness.tsx')});
      }
      return route.continue();
    });
    await page.addInitScript(data=>localStorage.setItem('pawly-wire-data-v4',JSON.stringify(data)),fixture);
    await page.goto(`http://127.0.0.1:5173/${locale==='ru'?'ru/':''}app/order-details`,{waitUntil:'networkidle'});
    await page.addStyleTag({content:`#root > article {width:100%;height:auto;min-height:0;overflow:visible;}`});
    const text=await page.locator('#root > article').innerText();
    if(!text.includes('14:52')||!text.includes('950')) throw Error('Pawly fixture changed');
    const geometry=await page.locator('#root > article').evaluate(node=>{
      const footer=node.querySelector('footer');
      const previous=footer.previousElementSibling;
      return {contentBottom:previous.getBoundingClientRect().bottom,footerTop:footer.getBoundingClientRect().top,footerBorder:getComputedStyle(footer).borderTopWidth,explanation:previous.querySelector('p:last-of-type')?.textContent};
    });
    if(geometry.footerTop<geometry.contentBottom-1||geometry.footerBorder!=='0px') throw Error('Pawly footer overlap');
    report.checks.push({locale,type:'report',...geometry});
    // Preserve the full explanatory text and real controls; no clipped viewport.
    await shoot(page,`public/media/rebuild/pawly/${locale}/order-details.webp`,'#root > article');
    await page.close();
  }
} finally {await browser.close();await writeFile(`${dir}/captures.json`,JSON.stringify(report,null,2));}
