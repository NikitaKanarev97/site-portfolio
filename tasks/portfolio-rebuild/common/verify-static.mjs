/** --base=url; --widths=1440,1024,390,360; no capture during CPU profiling. */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import sharp from 'sharp';
const require = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const base = process.argv.find(v => v.startsWith('--base='))?.slice(7) || 'http://127.0.0.1:4340';
const out = 'tasks/portfolio-rebuild/common/shots'; mkdirSync(out,{recursive:true});
const browser = await require('playwright').chromium.launch({executablePath:process.env.COMMON_CHROME || 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const results=[]; const failures=[];
const profiles=[{width:1440,height:900},{width:1024,height:900},{width:390,height:844},{width:360,height:800},{width:1440,height:600}];
try {
  for (const locale of ['en','ru']) for (const slug of ['agent-ops','partner-portal']) for (const mode of ['reduce','no-js']) for (const viewport of profiles) {
    const context=await browser.newContext({viewport,reducedMotion:'reduce',javaScriptEnabled:mode!=='no-js'});
    const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    const route=`/preview/common/${locale}/${slug}/`;
    await page.goto(base+route,{waitUntil:'networkidle'}); await page.evaluate(()=>document.fonts.ready);
    // Load all lazy media before assertions; no animation starts in these profiles.
    const height=await page.evaluate(()=>document.documentElement.scrollHeight);
    for(let y=0;y<height;y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(25);}
    await page.evaluate(()=>scrollTo(0,0));
    await page.waitForTimeout(200);
    const state=await page.evaluate(()=>({
      overflow:document.documentElement.scrollWidth-innerWidth,
      noindex:document.querySelector('meta[name="robots"]')?.content,
      lang:document.documentElement.lang,
      canonical:document.querySelector('link[rel="canonical"]')?.href,
      localeHrefs:[...document.querySelectorAll('.navbar__locale a')].map(e=>e.getAttribute('href')),
      ids:[...document.querySelectorAll('[data-block-type]')].map(e=>({id:e.id,type:e.dataset.blockType,evidence:e.dataset.evidenceId,media:e.dataset.mediaId})),
      brokenImages:[...document.images].filter(i=>i.getClientRects().length && (!i.complete||!i.naturalWidth)).map(i=>i.currentSrc||i.src),
      pinSpacers:document.querySelectorAll('.pin-spacer').length,
      blankText:[...document.querySelectorAll('[data-h="thesis"],[data-h="para"]')].filter(e=>e.getClientRects().length && +getComputedStyle(e).opacity===0).map(e=>e.textContent),
      pauseTitle:[...document.querySelectorAll('.case-next button')].length,
      diagrams:[...document.querySelectorAll('[data-diagram-layout]')].filter(e=>getComputedStyle(e).display!=='none').map(e=>({layout:e.dataset.diagramLayout,width:e.querySelector('svg')?.getBoundingClientRect().width,container:e.clientWidth})),
      specimen:[...document.querySelectorAll('[data-specimen-set]')].map(e=>({id:e.dataset.specimenSet,states:e.querySelectorAll('[data-specimen-state]').length})),
      heading:document.querySelector('h1')?.textContent,
    }));
    const entry={route,mode,...viewport,...state,errors}; results.push(entry);
    if(errors.length||state.overflow>0||state.brokenImages.length||state.blankText.length||state.pauseTitle||state.pinSpacers||state.canonical||!state.noindex?.includes('noindex')||state.lang!==locale||state.localeHrefs.some(href=>!['en','ru'].some(l=>href===`/preview/common/${l}/${slug}/`))) failures.push(entry);
    if(!process.argv.includes('--no-capture')&&mode==='reduce'&&locale==='en'&&[1440,390].includes(viewport.width)&&viewport.height!==600){
      await page.screenshot({path:`${out}/${slug}-${viewport.width}-cover.png`});
      for(const id of (slug==='agent-ops'?['human-checkpoint','accepted-prototype']:['shared-specification','buyer-decision','domain-system','shipped-redesign'])) {
        const el=page.locator('#'+id); await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(120);
        await el.screenshot({path:`${out}/${slug}-${viewport.width}-${id}.png`});
      }
    }
    console.log(route,mode,viewport.width,viewport.height,'overflow',state.overflow,'errors',errors.length);
    await context.close();
  }
  const kit=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  await kit.goto(base+'/kit/',{waitUntil:'networkidle'}); await kit.evaluate(()=>document.fonts.ready);
  if(!process.argv.includes('--no-capture'))for(const [id,file] of [['map','ha-screen-map.png'],['flow','ha-user-flow.png'],['library','ha-component-library.png'],['prototype','ha-prototype-map.png']]){
    const node=kit.locator(`#diagram-${id} .dg`).first();
    await node.scrollIntoViewIfNeeded(); await kit.waitForTimeout(100);
    const shot=await node.screenshot(); writeFileSync(`${out}/kit-${id}-1440.png`,shot);
    const ref=await sharp(`research/portfolio-rebuild-2026-10-03/references/${file}`).resize({width:900}).png().toBuffer();
    const ours=await sharp(shot).resize({width:900}).png().toBuffer();
    const a=await sharp(ref).metadata();const b=await sharp(ours).metadata();
    await sharp({create:{width:1800,height:Math.max(a.height,b.height),channels:3,background:'#ffffff'}}).composite([{input:ref,left:0,top:0},{input:ours,left:900,top:0}]).png().toFile(`${out}/reference-kit-${id}.png`);
  }
  await kit.close();
  // Native legacy fallback and preview isolation in built static outputs.
  for(const route of ['/work/agent-ops-console/','/work/partner-portal/','/ru/work/agent-ops-console/','/ru/work/partner-portal/']) {
    const html=await (await fetch(base+route)).text();
    if(html.includes('data-story-version="blocks-v1"')||!html.includes('<h1')) failures.push({route,reason:'legacy fallback changed'});
  }
  const sitemap=await(await fetch(base+'/sitemap.xml')).text(); if(sitemap.includes('/preview/'))failures.push({reason:'preview in sitemap'});
  // Structure parity is also guarded at build time by assertStoryPair.
  for(const slug of ['agent-ops','partner-portal']) {
    const pair=results.filter(r=>r.route.includes('/'+slug+'/')&&r.mode==='reduce'&&r.width===1440&&r.height===900);
    if(JSON.stringify(pair[0].ids)!==JSON.stringify(pair[1].ids))failures.push({slug,reason:'locale structure mismatch'});
  }
} finally {await browser.close();}
writeFileSync('tasks/portfolio-rebuild/common/static-verification.json',JSON.stringify({base,results,failures},null,2));
if(failures.length)throw new Error(`Static verification: ${failures.length} failing profiles`);
