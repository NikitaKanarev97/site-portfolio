import {launch,base,root,settled,sweep,shot,json} from './common.mjs';
import sharp from 'sharp';
const b=await launch(),p=await b.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),checks=[];
for(const locale of ['en','ru'])for(const width of [1440,390]){
 await p.setViewportSize({width,height:width===390?844:900});await p.goto(base+(locale==='ru'?'/ru/':'/'));await settled(p);await sweep(p);
 for(const slug of ['agent-ops-console','partner-portal','learn','vet-clinic','pawly']){const el=p.locator('#work-'+slug);await el.scrollIntoViewIfNeeded();await shot(p,`${root}/after/${locale}-${width}-home-cover-${slug}`,{locator:el});}
}
const tiles=[];for(const [i,page]of ['home','about','agent-ops-console','partner-portal','learn','vet-clinic','pawly'].entries())for(const [j,[locale,width]]of [['en',1440],['ru',1440],['en',390],['ru',390]].entries()){
 const data=await sharp(`${root}/after/${locale}-${width}-${page}-viewport.webp`).resize(400,300,{fit:'contain',background:'#eee'}).toBuffer();tiles.push({input:data,left:j*400,top:i*300});
}
await sharp({create:{width:1600,height:2100,channels:3,background:'#eee'}}).composite(tiles).png().toFile(root+'/after/viewport-overview.png');
const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('file:///D:/Claude-projects/sp-final-quality-2026-11-03/'+root+'/index.html');
await p.waitForFunction(()=>['before','after'].every(id=>{const i=document.getElementById(id);return i.complete&&i.naturalWidth>0;}));
await p.locator('#locale').selectOption('ru');await p.locator('#width').selectOption('390');await p.locator('#page').selectOption('pawly');await p.locator('#capture').selectOption('full');await p.waitForFunction(()=>['before','after'].every(id=>{const i=document.getElementById(id);return i.complete&&i.naturalWidth>0;}));
checks.push({name:'local gallery selectors and images',pass:errors.length===0,errors});await json(root+'/logs/gallery-verification.json',checks);await b.close();console.log('Final cover evidence and gallery verified');
