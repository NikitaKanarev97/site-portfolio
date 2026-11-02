import {launch,root,ready,save} from './capture.mjs';
import {writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const phase=process.argv[2]??'before',browser=await launch(),results=[];
try{for(const locale of ['en','ru'])for(const width of [1440,390]){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage();
 for(const slug of (process.env.SLUGS?.split(',')??['home','partner-portal','learn','vet-clinic','pawly'])){
  const route=(locale==='ru'?'/ru':'')+(slug==='home'?'/':`/work/${slug}/`);
  const response=await page.goto('http://127.0.0.1:4406'+route,{waitUntil:'networkidle'});await ready(page);
  const el=slug==='home'?page.locator('#work-agent-ops-console'):null;
  if(el)await el.scrollIntoViewIfNeeded();
  const file=await save(page,`${root}/${phase}/protected-${locale}-${width}-${slug}`,el);
  results.push({locale,width,route,status:response.status(),sha256:createHash('sha256').update(await readFile(file)).digest('hex'),file});
 }
 await context.close();
}}finally{await writeFile(`${root}/${phase}/protected${process.env.SLUGS?'-'+process.env.SLUGS:''}.json`,JSON.stringify(results,null,2));await browser.close();}
