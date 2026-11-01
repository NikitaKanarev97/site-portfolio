import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const {chromium}=createRequire(`${process.env.PLAYWRIGHT_REPO??'D:/Claude-projects/b2b-dssl'}/package.json`)('playwright');
const root='audit/trassir-learn-home-cover-v1/v1',phase=process.argv[2]??'after';
const origin=process.env.PORTFOLIO_ORIGIN??'http://127.0.0.1:4406';
const candidate=phase==='B',out=candidate?'comparisons/candidates':phase;
await mkdir(`${root}/${out}`,{recursive:true});
const browser=await chromium.launch(),results=[];
try {
for(const locale of ['en','ru'])for(const width of candidate?[1440,390]:[1440,1024,768,390,360]) {
 const context=await browser.newContext({viewport:{width,height:width<768?844:900},deviceScaleFactor:1,reducedMotion:'reduce'}),page=await context.newPage(),errors=[],failures=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failures.push(`${r.status()} ${r.url()}`)});
 await page.goto(`${origin}/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'});
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>!i.closest('dialog')).map(async i=>{i.loading='eager';await i.decode().catch(()=>{})}));for(let y=0;y<document.documentElement.scrollHeight;y+=innerHeight*.75){scrollTo(0,y);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))}scrollTo(0,0)});
 const prefix=`${root}/${out}/${locale}-${width}${candidate?'-B':''}`;
 await page.screenshot({path:`${prefix}-full.png`,fullPage:true});
 await page.locator('#work-learn').screenshot({path:`${prefix}-cover.png`});await page.locator('.learn-home').screenshot({path:`${prefix}-stage.png`});
 const m=await page.evaluate(()=>{let c=document.querySelector('#work-learn');const rect=e=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y+scrollY,width:r.width,height:r.height}};return {width:innerWidth,scrollHeight:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth-innerWidth,cover:rect(c),stage:rect(c.querySelector('.learn-home')),images:[...c.querySelectorAll('img')].map(i=>({src:i.currentSrc.replace(location.origin,''),width:i.getBoundingClientRect().width,height:i.getBoundingClientRect().height,loaded:!!i.naturalWidth})),brokenImages:[...document.images].filter(i=>!i.closest('dialog')&&(!i.complete||!i.naturalWidth)).map(i=>i.src),protected:Object.fromEntries(['.hero','#work-agent-ops-console','#work-partner-portal','#work-vet-clinic','#work-pawly'].map(s=>[s,document.querySelector(s).outerHTML])),links:[...c.querySelectorAll('a')].map(a=>({href:a.getAttribute('href'),label:a.getAttribute('aria-label')||a.textContent.trim()}))}});
 m.protected=Object.fromEntries(Object.entries(m.protected).map(([k,v])=>[k,createHash('sha256').update(v).digest('hex')]));results.push({locale,...m,errors,failures});await context.close();
}
}finally{await browser.close();await writeFile(`${root}/logs/${phase}.json`,JSON.stringify({origin,browser:browser.version(),dpr:1,reducedMotion:'reduce',results},null,2)+'\n')}
console.log(results.map(({locale,width,cover,overflow,errors,failures})=>({locale,width,height:cover.height,overflow,errors,failures})));
