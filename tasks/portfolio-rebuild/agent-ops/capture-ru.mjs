import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
const product='D:/Claude-projects/Agent-ops-console';
const require=createRequire(product+'/package.json');
const task='tasks/portfolio-rebuild/agent-ops',out='public/media/rebuild/agent-ops/ru';
mkdirSync(out,{recursive:true});mkdirSync(task+'/source-shots',{recursive:true});
const sha=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
const sourceFiles=['src/main.tsx','src/i18n/RussianLocalization.tsx','src/app/router.tsx','src/screens/review-queue/ReviewQueue.tsx','src/screens/run-detail/RunDetail.tsx','src/screens/consequence-preview/ConsequencePreviewScreen.tsx','src/tokens/primitives.css','src/tokens/semantics.css','outputs/case-study.md','audit/product-polish/STATE.md','dist/index.html','dist/assets/index-HokgVeLp.js','dist/assets/index-DzCK6lAg.css'];
const sources={product,ref:execFileSync('git',['rev-parse','HEAD'],{cwd:product,encoding:'utf8'}).trim(),statusBefore:execFileSync('git',['status','--porcelain'],{cwd:product,encoding:'utf8'}),bundle:'existing dist 25.09.2026; no build/install',files:sourceFiles.map(file=>({file,sha256:sha(product+'/'+file)}))};
const captures=[],errors=[];
const browser=await require('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
try {
for(const width of [1440,390]){
 const dpr=width===390?3:2,height=width===390?844:900;
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:dpr,reducedMotion:'reduce'});
 await page.route('https://fonts.googleapis.com/**',r=>r.abort());
 await page.route('https://fonts.gstatic.com/**',r=>r.abort());
 page.on('pageerror',e=>errors.push(e.message));
 for(const [kind,route,role] of [['queue','/screens/review-queue','Martin K.'],['run','/screens/run-detail?run=run-cl-promo-01','Martin K.'],['approval','/screens/consequence-preview','Priya S.']]){
  await page.goto('http://127.0.0.1:5391/ru/',{waitUntil:'networkidle'});
  console.log('Loaded RU',kind,width);
  await page.locator('[data-track="shell:role-switch"]').first().click();
  console.log('Role menu open');
  await page.getByRole('menuitem',{name:new RegExp(role.replace('.','\\.'))}).first().click();
  console.log('Role chosen',role);
  await page.evaluate(to=>{history.pushState(null,'','/ru'+to);dispatchEvent(new PopStateEvent('popstate'));},route);
  await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,5000))]));await page.waitForTimeout(1800);
  console.log('Settled real RU route',route,width);
  if(await page.locator('html').getAttribute('lang')!=='ru')throw new Error('RU source not active');
  await page.screenshot({path:`${task}/source-shots/${kind}-${width}.png`});
  const save=async(selector,name,{framed=false,alpha=false,workspace=false}={})=>{
   await page.evaluate(()=>{document.querySelectorAll('*').forEach(el=>{if(el.scrollTop)el.scrollTop=0});scrollTo(0,0)});
   const el=page.locator(selector).first();
   const before=await el.evaluate(e=>({text:e.textContent,width:e.getBoundingClientRect().width}));
   let target=el,field=null;
   if(framed){
    field=await el.evaluate((e,narrow)=>{
     const r=e.getBoundingClientRect(),cs=getComputedStyle(e),token=narrow?'--space-2xl':'--space-3xl';
     const wrap=document.createElement('div');wrap.dataset.fCapture='field';
     wrap.style.cssText=`position:relative;flex:none;box-sizing:content-box;width:${r.width}px;padding:var(${token});background:var(--surface-page);`;
     wrap.style.backgroundColor=cs.getPropertyValue('--surface-page');e.before(wrap);wrap.append(e);e.style.width=`${r.width}px`;
     const b=wrap.getBoundingClientRect(),i=e.getBoundingClientRect();
     return {token,inset:parseFloat(cs.getPropertyValue(token)),left:i.left-b.left,top:i.top-b.top,right:b.right-i.right,bottom:b.bottom-i.bottom};
    },width===390);target=page.locator('[data-f-capture="field"]');
   }
   const after=await el.evaluate(e=>({text:e.textContent,width:e.getBoundingClientRect().width}));
   if(before.text!==after.text||Math.abs(before.width-after.width)>.1)throw new Error('Changed source panel '+name);
   if(field&&![field.left,field.right,field.top,field.bottom].every(x=>Math.abs(x-field.inset)<.1))throw new Error('Unequal product field '+name);
   let styles=[];
   if(alpha)styles=await target.evaluate(e=>{const list=[];for(let a=e.parentElement;a;a=a.parentElement){list.push(a.getAttribute('style'));a.style.setProperty('background','transparent','important');a.style.setProperty('box-shadow','none','important')}return list});
   const chrome='[class*="toolbar"],[class*="topStrip"],[class*="contextBar"],[class*="verdictBar"]{visibility:hidden!important} *{scrollbar-width:none!important} *::-webkit-scrollbar{display:none!important}';
   const dimensions=await target.boundingBox();
   const file=`${out}/${name}${workspace?'':'-'+width}.webp`;
   const png=workspace?await page.screenshot():await target.screenshot({omitBackground:alpha,style:chrome+(kind==='run'&&width===390?' *{overflow:visible!important}':'')});
   await sharp(png).webp({quality:94,alphaQuality:100}).toFile(file);
   const meta=await sharp(file).metadata();
   captures.push({file,locale:'ru',productRef:sources.ref,route:'/ru'+route,role,fixture:kind==='approval'?'Helio Retail $340':kind==='run'?'Nordwind $420 / run-cl-promo-01':'four cause clusters',viewport:{width,height:workspace?1200:height},dpr,selector,dimensions,pixels:{width:meta.width,height:meta.height},sha256:sha(file),field,unchangedText:true,unchangedWidth:true,text:before.text});
   console.log('Captured',file,meta.width,meta.height);
   if(alpha)await target.evaluate((e,list)=>{let a=e.parentElement;for(const s of list){if(s===null)a.removeAttribute('style');else a.setAttribute('style',s);a=a.parentElement}},styles);
   if(framed)await target.evaluate(w=>{const e=w.firstElementChild;e.style.removeProperty('width');w.before(e);w.remove()});
  };
  if(kind==='queue')await save('section[aria-labelledby="reason-clusters-heading"]','clusters-framed',{framed:true});
  if(kind==='run'){
   if(width===1440){await page.setViewportSize({width,height:1200});await page.waitForTimeout(350);await save('body','run-context',{workspace:true});await page.setViewportSize({width,height});}
   if(width===390)await page.addStyleTag({content:'*{overflow:visible!important}'});
   await save('[class*="transcriptPane"]','transcript-framed',{framed:true});
   await save('[class*="tracePane"]','evidence');
  }
  if(kind==='approval'){
   await save('[class*="previewGrid"]','consequences');
   await save('[class*="previewGrid"] > :nth-child(1)','payout',{alpha:true});
   await save('[class*="previewGrid"] > :nth-child(2)','message',{alpha:true});
   await save('section[aria-label] > [class*="root"]','approval-card');
  }
 }
 await page.close();
}
}finally{await browser.close();}
sources.statusAfter=execFileSync('git',['status','--porcelain'],{cwd:product,encoding:'utf8'});
writeFileSync(task+'/sources.json',JSON.stringify(sources,null,2));writeFileSync(task+'/captures.json',JSON.stringify({captures,errors},null,2));
if(errors.length||sources.statusBefore!==sources.statusAfter)throw new Error('Source errors/change: '+errors.join(';'));
console.log(captures.length+' actual RU captures; source unchanged.');
