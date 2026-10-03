/** Additional visual proofs and side-by-side references, original left/current right. */
import {createRequire} from 'node:module';import {writeFileSync} from 'node:fs';import sharp from 'sharp';
const require=createRequire('D:/Claude-projects/b2b-dssl/package.json');const browser=await require('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});const out='tasks/portfolio-rebuild/common/shots';
try{
for(const width of [1440,390,360])for(const slug of ['agent-ops','partner-portal']){
const p=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});await p.goto(`http://127.0.0.1:4340/preview/common/ru/${slug}/`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:`${out}/${slug}-ru-${width}-cover.png`});
for(const id of slug==='agent-ops'?['human-checkpoint','accepted-prototype']:['shared-specification','buyer-decision','domain-system','shipped-redesign']){const el=p.locator('#'+id);await el.scrollIntoViewIfNeeded();await p.waitForTimeout(200);await el.screenshot({path:`${out}/${slug}-ru-${width}-${id}.png`});}await p.close();}
const p=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});await p.goto('http://127.0.0.1:4340/preview/common/en/partner-portal/',{waitUntil:'networkidle'});
for(const [id,selector,ref] of [['map','#shared-specification .dg','ha-screen-map.png'],['flow','#buyer-decision .dg','ha-user-flow.png'],['specimen','.case-specimen__sheet','ha-component-library.png']]){
const el=p.locator(selector).first();await el.scrollIntoViewIfNeeded();await p.waitForTimeout(250);const shot=await el.screenshot();writeFileSync(`${out}/portal-${id}-1440.png`,shot);
const sources=await Promise.all([`research/portfolio-rebuild-2026-10-03/references/${ref}`,shot].map(v=>sharp(v).resize({width:900}).png().toBuffer()));const sizes=await Promise.all(sources.map(v=>sharp(v).metadata()));await sharp({create:{width:1800,height:Math.max(...sizes.map(v=>v.height)),channels:3,background:'#ffffff'}}).composite(sources.map((input,i)=>({input,left:i*900,top:0}))).png().toFile(`${out}/reference-portal-${id}.png`);
}await p.close();
}finally{await browser.close();}
