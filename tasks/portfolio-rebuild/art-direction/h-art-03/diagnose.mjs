import {createRequire} from 'node:module';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');const b=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const c=await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}),p=await c.newPage();
for(const slug of ['partner-portal','learn','pawly']){
 await p.goto('http://127.0.0.1:4394/work/'+slug+'/',{waitUntil:'networkidle'});for(const s of await p.locator('.case-screen').all())await s.scrollIntoViewIfNeeded();
 const result=await p.evaluate(()=>[...document.querySelectorAll('.case-screen')].filter(e=>e.getClientRects().length).map(e=>{const i=e.querySelector('img'),r=e.getBoundingClientRect(),b=i?.getBoundingClientRect(),s=getComputedStyle(e);return{src:i?.currentSrc,loaded:!i||i.complete&&i.naturalWidth>0,radius:s.borderRadius,padding:parseFloat(s.paddingLeft),overflow:s.overflow,fit:i&&getComputedStyle(i).objectFit,ratio:i&&Math.abs(i.clientWidth/i.clientHeight-i.naturalWidth/i.naturalHeight),left:b&&b.left-r.left,right:b&&r.right-b.right,masked:i&&getComputedStyle(i).borderRadius!=='0px',parent:e.parentElement.className};}).filter(s=>s.radius!=='16px'||s.padding<16||s.overflow!=='visible'||s.masked||!s.loaded||s.fit!=='contain'||s.ratio>.015||s.left<14||s.right<14));
 console.log(slug,JSON.stringify(result));
}
await b.close();
