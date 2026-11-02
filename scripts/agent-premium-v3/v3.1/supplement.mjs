import {launch,ready,save,root} from './matrix.mjs';
import {writeFile} from 'node:fs/promises';
const browser=await launch(),results=[];
try{for(const phase of ['before','after'])for(const locale of ['en','ru'])for(const width of [320,360,390,1440]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:width<768?800:900},reducedMotion:'reduce'});
 await page.goto(`http://127.0.0.1:${phase==='before'?4417:4416}${locale==='ru'?'/ru':''}/work/agent-ops-console/`);await ready(page);
 await save(page,`${root}/${phase}/${locale}-${width}-next`,page.locator('.case-next'));
 const amount=await page.locator('.agent-problem__cost .ds-display-6xl').evaluate(el=>{const range=document.createRange();range.selectNodeContents(el);return {text:el.textContent,lines:new Set([...range.getClientRects()].map(r=>Math.round(r.top))).size};});
 results.push({phase,locale,width,amount});await page.close();
}}finally{await browser.close();await writeFile(`${root}/currency-before-after.json`,JSON.stringify(results,null,2));}
