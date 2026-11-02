import {launch,root,json,shot,sleep} from './common.mjs';
const sites=[['blinkov','https://antonblinkov.com/'],['malugin','https://malugin.me/'],['repponen','https://repponen.com/'],['ha','https://hainteractive.com/']];
const browser=await launch(),results=[];
for(const [id,url] of sites){
 const dir=`${root}/references/${id}`;await (await import('node:fs/promises')).mkdir(dir,{recursive:true});
 const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir,size:{width:1440,height:900}}});
 const page=await context.newPage(),start=Date.now();const result={id,url,viewport:{width:1440,height:900},frames:[],events:[],errors:[]};
 page.on('pageerror',e=>result.errors.push(e.message));
 try{
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:35000});result.status=response?.status();
  for(const ms of [0,180,500,1000,1800]){
   await sleep(ms===0?20:ms-(result.last??0));result.last=ms;
   const file=await shot(page,`${dir}/load-${ms}`);result.frames.push({file,t:Date.now()-start,phase:'entrance'});
  }
  result.title=await page.title();result.firstText=(await page.locator('body').innerText()).slice(0,900);
  result.motion=await page.evaluate(()=>({animations:document.getAnimations().map(a=>({type:a.constructor.name,state:a.playState,timing:a.effect?.getTiming(),frames:a.effect?.getKeyframes().slice(0,3)})).slice(0,12),scrollBehavior:getComputedStyle(document.documentElement).scrollBehavior}));
  const links=await page.locator('a').evaluateAll(es=>es.map(e=>({text:e.innerText.slice(0,80),href:e.href,rect:e.getBoundingClientRect().toJSON()})).filter(e=>e.rect.width>80&&e.rect.height>30));result.links=links.slice(0,12);
  await page.mouse.wheel(0,660);await page.waitForTimeout(350);result.frames.push({file:await shot(page,`${dir}/scroll-350`),t:Date.now()-start,phase:'scroll'});await page.waitForTimeout(900);result.frames.push({file:await shot(page,`${dir}/scroll-1250`),t:Date.now()-start,phase:'scroll'});
  const target=page.locator('a').filter({has:page.locator('img,video')}).first();
  if(await target.count()){
   await target.scrollIntoViewIfNeeded();await page.waitForTimeout(400);result.hoverTarget=await target.getAttribute('href');
   result.frames.push({file:await shot(page,`${dir}/card-rest`),t:Date.now()-start,phase:'hover'});await target.hover();await page.waitForTimeout(120);result.frames.push({file:await shot(page,`${dir}/card-hover-120`),t:Date.now()-start,phase:'hover'});await page.waitForTimeout(500);result.frames.push({file:await shot(page,`${dir}/card-hover-620`),t:Date.now()-start,phase:'hover'});
   await target.focus();await page.waitForTimeout(200);result.frames.push({file:await shot(page,`${dir}/card-focus`),t:Date.now()-start,phase:'focus'});
   const href=await target.getAttribute('href');
   if(href&&!href.startsWith('mailto:')&&!href.startsWith('#')){await target.click({timeout:7000,noWaitAfter:true});await page.waitForTimeout(220);result.frames.push({file:await shot(page,`${dir}/navigate-220`),t:Date.now()-start,phase:'navigation'});await page.waitForTimeout(1600);result.frames.push({file:await shot(page,`${dir}/navigate-1820`),t:Date.now()-start,phase:'navigation'});result.destination=page.url();}
  }
  await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForTimeout(1800);result.frames.push({file:await shot(page,`${dir}/mobile-reduce`),t:Date.now()-start,phase:'mobile reduce'});result.mobile={overflow:await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),motion:await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length)};
 }catch(e){result.limitation=e.message;}
 const video=page.video();await context.close();await video.saveAs(`${dir}/browser.webm`);result.video=`${dir}/browser.webm`;delete result.last;results.push(result);await json(`${root}/references/observations.json`,results);console.log(id,result.status,result.title,result.limitation??'captured');
}
await browser.close();
