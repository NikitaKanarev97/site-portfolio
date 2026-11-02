import {launch,ready,save,root} from './matrix.mjs';
import {mkdir,writeFile,readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const browser=await launch(),results=[];
await mkdir(`${root}/regression`,{recursive:true});
try {
 for(const locale of ['en','ru'])for(const width of [1440,390])for(const slug of ['home','partner-portal','learn','vet-clinic','pawly']) {
  const name=`${locale}-${width}-${slug}`,route=(locale==='ru'?'/ru':'')+(slug==='home'?'/':`/work/${slug}/`),states=[];
  for(const phase of ['before','after']) {
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
   const response=await page.goto(`http://127.0.0.1:${phase==='before'?4417:4416}${route}`,{waitUntil:'networkidle'});
   await ready(page);
   if(slug==='home')await page.locator('#work-agent-ops-console').scrollIntoViewIfNeeded();
   const file=await save(page,`${root}/regression/${name}-${phase}`,slug==='home'?page.locator('#work-agent-ops-console'):null);
   const dom=await page.evaluate(()=>{const b=document.body.cloneNode(true);b.querySelectorAll('style,script').forEach(el=>el.remove());return b.innerHTML;});
   states.push({phase,status:response.status(),file,domHash:createHash('sha256').update(dom).digest('hex')});
   await page.close();
  }
  const before=await sharp(states[0].file).raw().toBuffer({resolveWithObject:true}),after=await sharp(states[1].file).raw().toBuffer({resolveWithObject:true});
  results.push({locale,width,slug,states,pixelsIdentical:before.data.equals(after.data),sizeBefore:before.info,sizeAfter:after.info,domIdentical:states[0].domHash===states[1].domHash});
  console.log(name,results.at(-1).pixelsIdentical,results.at(-1).domIdentical);
 }
 // Inline Agent CSS is present on all case routes through the shared renderer.
 // Compare whole built HTML after removing only style blocks; no content exclusions.
 const documents=[];
 async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=`${dir}/${e.name}`;if(e.isDirectory())await walk(p);else if(e.name.endsWith('.html')&&!p.includes('/agent-ops-console/')){const rel=p.slice('dist/'.length),a=await readFile(p,'utf8'),b=await readFile(`.tmp/v31-baseline/dist/${rel}`,'utf8');documents.push({file:rel,identical:a===b,withoutStylesIdentical:a.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'')===b.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'')});}}}
 await walk('dist');
 await writeFile(`${root}/regression/documents.json`,JSON.stringify(documents,null,2));
}finally {await browser.close();await writeFile(`${root}/regression/checks.json`,JSON.stringify(results,null,2));}
if(results.some(r=>!r.domIdentical||!r.pixelsIdentical||r.states.some(s=>s.status!==200)))process.exitCode=1;
