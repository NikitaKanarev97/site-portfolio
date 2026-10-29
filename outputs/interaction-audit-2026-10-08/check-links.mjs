import {readFile, stat, writeFile} from 'node:fs/promises';
import path from 'node:path';
const routes = ['/', '/about/', ...['agent-ops-console','partner-portal','learn','vet-clinic','pawly'].map(x=>`/work/${x}/`), '/ru/', '/ru/about/', ...['agent-ops-console','partner-portal','learn','vet-clinic','pawly'].map(x=>`/ru/work/${x}/`), '/404.html', '/500.html', '/ru/404/'];
const root = path.resolve('dist');
const findings=[]; let checked=0;
async function fileFor(url) {
  const file=path.join(root,decodeURIComponent(url.pathname));
  const info=await stat(file);
  return info.isDirectory()?path.join(file,'index.html'):file;
}
for (const route of routes) {
  const page=new URL(route,'https://kanarev.com');
  const html=await readFile(await fileFor(page),'utf8');
  for(const match of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)) {
    const href=match[1].replaceAll('&amp;','&');
    const url=new URL(href,page);
    if(url.origin!==page.origin)continue;
    checked++;
    try {
      const target=await fileFor(url);
      if(url.hash&&target.endsWith('.html')) {
        const body=await readFile(target,'utf8');
        const id=decodeURIComponent(url.hash.slice(1));
        if(!body.includes(`id="${id}"`))findings.push({route,href,reason:'missing hash target'});
      }
    }catch{findings.push({route,href,reason:'missing local target'});}
  }
}
const result={routes:routes.length,checked,findings};
await writeFile('outputs/interaction-audit-2026-10-08/links.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
process.exitCode=findings.length?1:0;
