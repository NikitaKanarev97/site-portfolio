import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile,copyFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
const require=createRequire('D:/Claude-projects/b2b-dssl/package.json');
const {chromium}=require('playwright');
const dir=path.resolve('public/media/rebuild/learn');
const task=path.resolve('tasks/portfolio-rebuild/learn');
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const captures=[];
const state=JSON.parse(await readFile('D:/Claude-projects/learn/audit/product-polish/evidence/07/state-marina-one.json','utf8'));
state.toasts=[];
const origin='http://127.0.0.1:4362';
async function page(width=1440, fixture){
 const ctx=await browser.newContext({viewport:{width,height:width<768?844:1000},deviceScaleFactor:2,reducedMotion:'reduce',locale:'en-GB'});
 if(fixture)await ctx.addInitScript(s=>sessionStorage.setItem('learn-prototype-v1',JSON.stringify(s)),fixture);
 return ctx.newPage();
}
async function go(p,url){await p.goto(origin+url,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);}
async function snap(p,name,{locator,clip,fixture='anonymous',source=p.url(),alpha=false}={}){
 const out=path.join(dir,name+'.webp');
 let buffer;
 if(locator){
  await locator.scrollIntoViewIfNeeded();
  const box=await locator.boundingBox();
  if(alpha){await p.addStyleTag({content:'html,body,#storybook-root,.sb-canvas{background:transparent!important;}'});}
  if(alpha && box){buffer=await p.screenshot({omitBackground:true,clip:{x:Math.max(0,box.x-2),y:Math.max(0,box.y-2),width:box.width+4,height:box.height+4}});}
  else buffer=await locator.screenshot();
 }else buffer=await p.screenshot({clip});
 const info=await sharp(buffer).webp({quality:94}).toFile(out);
 const bytes=await readFile(out);captures.push({id:name,file:path.relative(process.cwd(),out).replaceAll('\\','/'),source,locale:source.includes('storybook')?'ru':'en',fixture,viewport:p.viewportSize(),dpr:2,width:info.width,height:info.height,sha256:createHash('sha256').update(bytes).digest('hex'),alpha});
 console.log(name,info.width,info.height);
}
for(const width of [1440,390]){
 const variant=width===1440?'desktop':'mobile';
 const p=await page(width);
 await go(p,'/prototypes/learn/material/onvif-not-found?lang=en');
 await snap(p,'answer-'+variant);
 const trust=p.locator('div[class*="_root_"]').filter({has:p.locator('span[class*="_version_"]')}).last();
 await snap(p,'trust-'+variant,{locator:trust});
 const ctxPage=await page(width,state);
 await go(ctxPage,'/prototypes/learn/player/puskonaladka/2?lang=en');
 if(width<768){ await ctxPage.locator('h1').scrollIntoViewIfNeeded();await ctxPage.evaluate(()=>scrollBy(0,-130)); }
 await snap(ctxPage,'programme-'+variant,{fixture:'state-marina-one (authorized), same onvif-not-found unit'});
 const meter=ctxPage.locator('div[class*="_meter_"]').first();
 await snap(ctxPage,'progress-'+variant,{locator:meter,fixture:'position 3/11, not completion'});
 await ctxPage.getByRole('button',{name:'Complete and continue',exact:false}).scrollIntoViewIfNeeded();
 await snap(ctxPage,'completion-'+variant,{fixture:'same material end, explicit action before click'});
 await go(p,'/prototypes/learn/trajectory/puskonaladka?lang=en');
 const passport=p.locator('aside').first();
 await snap(p,'cover-programme-'+variant,{locator:passport});
 const ready=JSON.parse(await readFile('D:/Claude-projects/learn/audit/product-polish/evidence/07/state-marina-ready.json','utf8'));ready.toasts=[];
 const a=await page(width,ready);await go(a,'/prototypes/learn/assessment/intro?trajectoryId=proekt&lang=en');
 await snap(a,'assessment-'+variant,{fixture:'state-marina-ready; neutral assessment intro, no attempt result'});
 await go(p,'/prototypes/learn-landing/?lang=en');
 if(width<768){await snap(p,'landing-'+variant,{locator:p.locator('.ed-hero').first()});}
 else await snap(p,'landing-'+variant);
 await p.context().close();await ctxPage.context().close();await a.context().close();
}
// Card fixtures are captured by capture-cards.mjs at the final native widths.
await copyFile('public/media/case-learn/before-catalog.webp',path.join(dir,'archive-catalog.webp'));
await browser.close();
await writeFile(path.join(task,'captures.json'),JSON.stringify(captures,null,2));
const sourceFiles=['PROJECT-CONTEXT.md','outputs/prd.md','ia/sitemap.md','ia/flows/junction-two-scales.mmd','src/data/materials.ts','src/data/trajectories.ts','src/screens/materialpage/MaterialPage.tsx','src/screens/player/Player.tsx','src/components/Card/Card.tsx','src/components/TrustHeader/TrustHeader.tsx','src/components/ProgressMeter/ProgressMeter.tsx','src/tokens/content.css','src/tokens/primitives.css','audit/product-polish/07-final.md'];
const hashes=[];for(const f of sourceFiles){const b=await readFile('D:/Claude-projects/learn/'+f);hashes.push({file:f,sha256:createHash('sha256').update(b).digest('hex')});}
const builds=[];for(const name of ['learn','learn-landing'])for(const f of await readdir('public/prototypes/'+name+'/assets')){const b=await readFile('public/prototypes/'+name+'/assets/'+f);const original=await readFile('D:/Claude-projects/learn/'+(name==='learn'?'dist':'landing/app/dist')+'/assets/'+f);builds.push({file:name+'/assets/'+f,same:b.equals(original),sha256:createHash('sha256').update(b).digest('hex')});}
await writeFile(path.join(task,'source-verification.json'),JSON.stringify({date:'2026-10-04',sourceRoot:'D:/Claude-projects/learn',sourceFiles:hashes,builds},null,2));
