import {browser} from 'file:///C:/Users/kanar/.codex/worktrees/partner-portal-rebuild/Site-portfolio/tasks/portfolio-rebuild/partner-portal/source-runtime.mjs';
import {mkdirSync,writeFileSync} from 'node:fs';
const out='D:/Claude-projects/Site-portfolio/tasks/portfolio-rebuild/orchestration/review';
mkdirSync(out,{recursive:true});
const b=await browser(),results=[];
try {
  for(const mode of ['normal','reduce','no-js']) {
    const c=await b.newContext({viewport:{width:390,height:844},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='normal'?'no-preference':'reduce'});
    const p=await c.newPage();
    await p.goto('http://127.0.0.1:4354/preview/partner-portal-rebuild/ru/',{waitUntil:'networkidle'});
    await p.waitForTimeout(1500);
    const e=p.locator('#shipped-redesign');
    await e.scrollIntoViewIfNeeded();
    await p.waitForTimeout(700);
    const info=await e.evaluate(el=>({text:el.innerText,rect:el.getBoundingClientRect().toJSON(),nodes:[el,...el.querySelectorAll('*')].map(n=>{const s=getComputedStyle(n);return {tag:n.tagName,class:n.className,opacity:s.opacity,visibility:s.visibility,display:s.display,contentVisibility:s.contentVisibility,transform:s.transform,height:n.getBoundingClientRect().height};}).filter(n=>n.opacity!=='1'||n.visibility!=='visible'||n.display==='none'||n.contentVisibility==='auto'),ancestors:(()=>{const a=[];for(let n=el.parentElement;n;n=n.parentElement){const s=getComputedStyle(n);a.push({tag:n.tagName,class:n.className,opacity:s.opacity,visibility:s.visibility,display:s.display,contentVisibility:s.contentVisibility});}return a;})()}));
    await e.screenshot({path:`${out}/b-${mode}-outcome.png`});
    await p.screenshot({path:`${out}/b-${mode}-viewport.png`});
    results.push({mode,...info});
    await c.close();
  }
} finally {await b.close();}
writeFileSync(`${out}/b-outcome-review.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
