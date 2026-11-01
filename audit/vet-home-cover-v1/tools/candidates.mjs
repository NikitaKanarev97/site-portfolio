import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const {chromium}=createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const root='audit/vet-home-cover-v1';
await mkdir(`${root}/screenshots/candidates`,{recursive:true});
const browser=await chromium.launch();
try {
for(const width of [1440,390]) for(const key of ['A','B','C']) {
 const page=await browser.newPage({viewport:{width,height:width===1440?900:844},deviceScaleFactor:1,reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:4433/',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 const bytes=await readFile(`${root}/candidates/${key}-${width}.png`);
 await page.locator('#work-vet-clinic .featured-case__stage').evaluate((stage,url)=>{
  const plane=document.createElement('div');
  plane.style.cssText='padding:var(--stage-inset);background:var(--surface-cover-vet);border-radius:var(--radius-lg)';
  const img=document.createElement('img');img.src=url;img.style.cssText='display:block;width:100%;height:auto';
  plane.append(img);stage.replaceChildren(plane);
 },`data:image/png;base64,${bytes.toString('base64')}`);
 await page.locator('#work-vet-clinic img').evaluate(i=>i.decode());
 await page.locator('#work-vet-clinic').screenshot({path:`${root}/screenshots/candidates/${key}-${width}.png`});
 await page.close();
}
}finally{await browser.close();}
// Presentation board only; original browser captures above remain intact.
const columns=[];
for(const key of ['A','B','C']) {
 const desktop=await sharp(`${root}/screenshots/candidates/${key}-1440.png`).resize({width:600}).png().toBuffer();
 const mobile=await sharp(`${root}/screenshots/candidates/${key}-390.png`).resize({width:300}).png().toBuffer();
 const dm=await sharp(desktop).metadata(),mm=await sharp(mobile).metadata();
 const title=Buffer.from(`<svg width="640" height="70"><rect width="100%" height="100%" fill="white"/><text x="20" y="28" font-family="Arial" font-size="22">${key} · ${key==='A'?'Whole visit':key==='B'?'Focused clinical record':'Visit invoice'}</text><text x="20" y="54" font-family="Arial" font-size="14">1440 desktop / 390 native mobile · same Home card</text></svg>`);
 columns.push(await sharp({create:{width:640,height:Math.max(2200,dm.height+mm.height+130),channels:3,background:'white'}}).composite([{input:title,top:0,left:0},{input:desktop,top:80,left:20},{input:mobile,top:dm.height+110,left:20}]).png().toBuffer());
}
const heights=await Promise.all(columns.map(b=>sharp(b).metadata()));
await sharp({create:{width:1920,height:Math.max(...heights.map(m=>m.height)),channels:3,background:'white'}}).composite(columns.map((input,i)=>({input,left:i*640,top:0}))).jpeg({quality:92}).toFile(`${root}/comparison-board.jpg`);
await writeFile(`${root}/candidates/README.md`,'Candidate images are rectangular excerpts of accepted real product captures. Screenshots/candidates renders each in the identical BEFORE Home card at 1440 and 390. The labeled JPEG is a presentation board, not a raw browser screenshot.\n');
console.log('3 candidate directions captured at actual 1440/390 Home geometry.');
