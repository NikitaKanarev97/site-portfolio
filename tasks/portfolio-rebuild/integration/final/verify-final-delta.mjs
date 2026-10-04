/** After the full matrix: focused checks of the final Home copy/phone selection and D-G-01. */
import{createRequire}from'node:module';import{mkdirSync,writeFileSync}from'node:fs';
const base=process.argv.find(a=>a.startsWith('--base='))?.slice(7)||'http://127.0.0.1:4390';
const out='tasks/portfolio-rebuild/integration/final';mkdirSync(out+'/shots',{recursive:true});
const browser=await createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const profiles=[],failures=[];
try{
 for(const lang of ['en','ru'])for(const width of [1440,1024,390,360])for(const mode of ['full','reduce','no-js']){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:mode==='full'?'no-preference':'reduce',javaScriptEnabled:mode!=='no-js'}),page=await context.newPage();
  for(const route of [lang==='ru'?'/ru/':'/',`${lang==='ru'?'/ru':''}/work/vet-clinic/`]){
   const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(mode==='full'?1500:100);
   const home=route.endsWith('/ru/')||route==='/';
   if(home){for(const card of await page.locator('.featured-case').all())await card.scrollIntoViewIfNeeded();}
   else await page.locator('#role-boundaries').scrollIntoViewIfNeeded();
   await page.waitForTimeout(800);
   const data=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,
    labels:[...document.querySelectorAll('#role-boundaries .dg-group + text')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({text:e.textContent,box:e.getBBox().toJSON?.()||{x:e.getBBox().x,y:e.getBBox().y,width:e.getBBox().width,height:e.getBBox().height}})),
    frames:[...document.querySelectorAll('#role-boundaries .dg-group')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({x:+e.getAttribute('x'),y:+e.getAttribute('y'),width:+e.getAttribute('width'),height:+e.getAttribute('height')})),
    homeImages:[...document.querySelectorAll('.featured-case__canvas--pawly img')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({src:e.currentSrc,natural:e.naturalWidth})),
    cards:document.querySelectorAll('.featured-case').length,
   }));
   if(data.overflow>1||errors.length)failures.push({lang,width,mode,route,data,errors});
   if(home){if(data.cards!==5||(width<768&&(data.homeImages.length!==1||!data.homeImages[0].src.includes('order-details'))))failures.push({lang,width,mode,reason:'Home selected report',data});}
   else {if(data.labels.length!==3)failures.push({lang,width,mode,reason:'group labels',data});for(const [i,label]of data.labels.entries()){const f=data.frames[i],b=label.box;if(b.x<f.x||b.x+b.width>f.x+f.width||b.y<f.y||b.y+b.height>f.y+f.height)failures.push({lang,width,mode,reason:'group heading contour',label,f});}}
   profiles.push({lang,width,mode,route,...data,errors});
   if(mode==='reduce'&&[1440,390].includes(width)){
    if(home){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${out}/shots/${lang}-home-${width}-full.png`,fullPage:true});for(const [i,card]of(await page.locator('.featured-case').all()).entries())await card.screenshot({path:`${out}/shots/${lang}-home-cover-${i+1}-${width}.png`});}
    else {await page.locator('#role-boundaries').screenshot({path:`${out}/shots/${lang}-vet-role-flow-${width}.png`});await page.screenshot({path:`${out}/shots/${lang}-vet-clinic-${width}-full.png`,fullPage:true});}
   }
  }
  await context.close();
 }
 for(const route of ['/kit/','/work/partner-portal/','/ru/work/partner-portal/']){const page=await browser.newPage({reducedMotion:'reduce',viewport:{width:1440,height:900}});await page.goto(base+route,{waitUntil:'networkidle'});profiles.push({route,smoke:true,overflow:await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)});await page.close();}
}finally{await browser.close();writeFileSync(out+'/final-delta-verification.json',JSON.stringify({base,profiles,failures},null,2));}
console.log(JSON.stringify({profiles:profiles.length,failures:failures.length}));if(failures.length)process.exitCode=1;
