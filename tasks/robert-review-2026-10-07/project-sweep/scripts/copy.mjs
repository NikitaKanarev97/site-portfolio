import {root,routes,urlFor,launch} from './sweep.mjs';
import fs from 'node:fs/promises';import path from 'node:path';
const raw=JSON.parse(await fs.readFile(path.join(root,'logs/sweep.json'),'utf8'));
const b=await launch(),p=await b.newPage({viewport:{width:1440,height:900}}),out=[];
for(const loc of ['en','ru'])for(const route of routes.filter(r=>r!=='404')){
 await p.goto(urlFor(route,loc),{waitUntil:'networkidle'});
 let c=await p.evaluate(()=>{const area=document.querySelector('.case-story')||document.querySelector('main');const clone=area.cloneNode(true);clone.querySelectorAll('svg,.ds-visually-hidden,[data-specimen-part],.case-screen__cue,astro-dev-toolbar,script,style').forEach(e=>e.remove());clone.querySelectorAll('details:not([open]) > :not(summary)').forEach(e=>e.remove());clone.querySelectorAll('dialog:not([open])').forEach(e=>e.remove());clone.style.position='absolute';clone.style.left='-99999px';clone.style.width='1440px';clone.setAttribute('aria-hidden','true');document.body.append(clone);const narrative=clone.innerText.replace(/\s+/g,' ').trim();clone.remove();const facts=area.querySelector('.meta-list')?.innerText||'';return{narrative,facts,count:(narrative.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)||[]).length};});
 let d=raw.find(x=>x.loc===loc&&x.route===route&&x.width===1440);let sections=d.copy.filter(s=>!s.selector.includes('case-specimen__')&&!s.selector.includes('case-routes__completion'));
 const file=`${route.replaceAll('/','-')}-${loc}`;
 await fs.writeFile(path.join(root,`logs/text/${file}-review.md`),`# ${loc}/${route}; narrative ${c.count} words, raw DOM ${d.wordCount}\n\nФакты вне секций: ${c.facts.replace(/\s+/g,' ')}\n\n`+sections.map(s=>`## ${s.selector}\n${s.text.replace(/\n+/g,' ').replace(/\s+/g,' ')}\n\nAlt: ${s.alt.join(' | ')}\n`).join('\n'));
 out.push({route,loc,...c,rawCount:d.wordCount});
}
await b.close();await fs.writeFile(path.join(root,'logs/copy-counts.json'),JSON.stringify(out,null,2));console.log(out.map(d=>`${d.loc}/${d.route}: ${d.count} narrative / ${d.rawCount} raw`).join('\n'));
