import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const {chromium}=createRequire(`${process.env.PLAYWRIGHT_REPO??'D:/Claude-projects/b2b-dssl'}/package.json`)('playwright');
const b=await chromium.launch({headless:true});const rows=[];
const hash=s=>createHash('sha256').update(JSON.stringify(s)).digest('hex');
const props=['display','width','height','font-family','font-size','font-weight','line-height','letter-spacing','color','background-color','border-radius','border-width','padding','margin','gap','grid-template-columns','object-fit','object-position','transform'];
try {
 for(const locale of ['en','ru']) for(const [width,height] of [[1440,900],[1024,900],[390,844],[360,800]]) {
  const pair=[];
  for(const port of [4421,4422]) {
   const p=await b.newPage({viewport:{width,height},reducedMotion:'reduce'});
   await p.goto(`http://127.0.0.1:${port}/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'});
   await p.evaluate(()=>document.fonts.ready);const cards=[];
   for(const id of ['work-partner-portal','work-learn','work-vet-clinic','work-pawly']) {
    const card=p.locator(`#${id}`);await card.scrollIntoViewIfNeeded();await p.mouse.move(0,0);
    await card.evaluate(async e=>{await Promise.all([...e.querySelectorAll('img')].map(i=>i.decode()));});
    cards.push(await card.evaluate((e,props)=>({id:e.id,html:e.outerHTML,styles:[e,...e.querySelectorAll('*')].map(n=>Object.fromEntries(props.map(k=>[k,getComputedStyle(n).getPropertyValue(k)]))),images:[...e.querySelectorAll('img')].map(i=>({src:i.currentSrc.replace(location.origin,''),alt:i.alt})),links:[...e.querySelectorAll('a')].map(a=>a.getAttribute('href'))}),props));
   }
   pair.push(cards);await p.close();
  }
  for(let i=0;i<pair[0].length;i++) {
   const old=pair[0][i],now=pair[1][i];
   const row={locale,width,id:old.id,domEqual:old.html===now.html,computedStylesEqual:hash(old.styles)===hash(now.styles),mediaAndLinksEqual:hash([old.images,old.links])===hash([now.images,now.links]),beforeDOMSHA256:hash(old.html),afterDOMSHA256:hash(now.html),computedStylesSHA256:hash(now.styles)};
   rows.push(row);assert(row.domEqual&&row.computedStylesEqual&&row.mediaAndLinksEqual,JSON.stringify(row));
  }
 }
}finally{await b.close();await writeFile('audit/portfolio-home-v3/stage-01/v3.1/logs/protected-covers.json',JSON.stringify(rows,null,2));}
console.log(`${rows.length} protected cover comparisons: exact DOM, computed styles, media and links unchanged.`);
