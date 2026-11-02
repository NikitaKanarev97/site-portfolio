import {launch,root,base,json,settled} from './common.mjs';
const b=await launch(),checks=[];
const check=(name,pass,data)=>{checks.push({name,pass:!!pass,data});if(!pass)console.log('FAIL',name,JSON.stringify(data));};
for(const locale of ['en','ru'])for(const width of [360,390]){
 const ctx=await b.newContext({viewport:{width,height:844},hasTouch:true,isMobile:true}),p=await ctx.newPage(),prefix=locale==='ru'?'/ru':'';
 await p.goto(base+prefix+'/');await settled(p);
 const menu=p.locator('[data-navbar-trigger]'),rect=await menu.boundingBox();check(`${locale}-${width} menu target48px`,rect.width>=48&&rect.height>=48,rect);
 await menu.tap();check(`${locale}-${width} tap opens menu`,await menu.getAttribute('aria-expanded')==='true');await menu.tap();check(`${locale}-${width} tap closes menu`,await menu.getAttribute('aria-expanded')==='false');
 await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{}}}));const copy=p.locator('[data-copy-trigger]').first();await copy.tap();check(`${locale}-${width} copy tap`,await copy.getAttribute('data-state')==='copied');
 const project=p.locator('[data-dialog-open]').first();await project.tap();const dialog=p.locator('[data-project-dialog][open]');await dialog.waitFor({state:'visible'});await dialog.locator('[data-project-dialog-close]').tap();check(`${locale}-${width} project tap/close`,await p.locator('[data-project-dialog][open]').count()===0);
 await p.locator('[data-case-card] a').first().tap();await settled(p);check(`${locale}-${width} case tap`,p.url().includes(prefix+'/work/agent-ops-console'));
 await p.locator('[data-zoom-trigger]').first().tap();const zoom=p.locator('[data-media-zoom]');await zoom.waitFor({state:'visible'});const close=zoom.locator('[data-media-zoom-close]');const closeRect=await close.boundingBox();check(`${locale}-${width} zoom close48px`,closeRect.height>=48&&closeRect.width>=48,closeRect);await close.tap();check(`${locale}-${width} tap releases scroll lock`,!await p.locator('body').evaluate(e=>e.classList.contains('ds-scroll-locked')));
 await ctx.close();
}
await b.close();await json(root+'/logs/touch.json',checks);console.log('TOTAL',checks.length,'FAIL',checks.filter(c=>!c.pass).length);if(checks.some(c=>!c.pass))process.exitCode=1;
