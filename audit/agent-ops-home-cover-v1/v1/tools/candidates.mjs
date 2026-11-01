import {createRequire}from'node:module';
import {writeFile,mkdir,readFile}from'node:fs/promises';
import sharp from'sharp';
const {chromium}=createRequire(`${process.env.PLAYWRIGHT_REPO??'D:/Claude-projects/b2b-dssl'}/package.json`)('playwright');
const root='audit/agent-ops-home-cover-v1/v1/comparisons';await mkdir(`${root}/candidates`,{recursive:true});
const media=JSON.parse(await readFile('src/data/agent-ops-v2-media.json','utf8'));
const browser=await chromium.launch();const results=[];
try{for(const locale of['en','ru'])for(const width of[1440,390])for(const variant of['A','B']){
 const page=await browser.newPage({viewport:{width,height:width===1440?900:844},deviceScaleFactor:1,reducedMotion:'reduce'});
 await page.goto(`http://127.0.0.1:4404/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 const key=variant==='A'?'approval-task':'approval-consequences';
 const entry=media[`${locale}/${key}-${width===1440?'desktop':'mobile'}`];
 await page.locator('.agent-home').evaluate((el,{src,width,height,locale})=>{
  const story=el.querySelector('.agent-home__story');el.prepend(story);
  story.querySelector('.agent-home__label').textContent=locale==='ru'?'Решение человека':'Human review';
  story.querySelector('.ds-heading-3xl').textContent=locale==='ru'?'Агент запрашивает $120.':'The agent asks for $120.';
  story.querySelector('.agent-home__body').textContent=locale==='ru'?'Кредит за задержку доставки превышает лимит агента. До подтверждения человек проверяет зачёт в счёте и сообщение клиенту.':'A late-delivery credit exceeds the agent’s limit. A person checks the invoice credit and customer message before confirming.';
  const p=el.querySelector('picture');p.querySelector('source').remove();const img=p.querySelector('img');img.src=src;img.width=width;img.height=height;
 },{...entry,locale});
 await page.addStyleTag({content:`#work-agent-ops-console>.featured-case__outcome{display:none}.agent-home{padding:var(--space-4);gap:var(--flow-text)}.agent-home__story{gap:var(--flow-pair)}@media(min-width:1440px){.agent-home{padding:var(--space-6);grid-template-columns:minmax(0,2fr) minmax(0,5fr);gap:var(--space-12)}}@media(max-width:767px){.agent-home{padding:0;background:transparent}.agent-home__story{padding:0}.agent-home__scene{background:var(--surface-plate-dark);border-radius:var(--radius-media);overflow:hidden}.agent-home .agent-shot{max-inline-size:100%}}`});
 await page.locator('.agent-home img').evaluate(i=>i.decode());
 await page.locator('#work-agent-ops-console').screenshot({path:`${root}/candidates/${locale}-${width}-${variant}.png`});
 results.push({locale,width,variant,coverHeight:await page.locator('#work-agent-ops-console').evaluate(e=>e.getBoundingClientRect().height),imageWidth:await page.locator('.agent-home img').evaluate(e=>e.width),source:entry.src});await page.close();
}}finally{await browser.close();await writeFile('audit/agent-ops-home-cover-v1/v1/logs/candidates.json',JSON.stringify(results,null,2)+'\n');}
for(const locale of['en','ru'])for(const width of[1440,390]){
 const buffers=await Promise.all(['A','B'].map(v=>sharp(`${root}/candidates/${locale}-${width}-${v}.png`).resize({width:width===1440?900:390}).png().toBuffer()));
 const metas=await Promise.all(buffers.map(b=>sharp(b).metadata()));const w=metas[0].width;
 const label=Buffer.from(`<svg width="${w*2+48}" height="48"><rect width="100%" height="100%" fill="white"/><text x="8" y="30" font-size="20" font-family="Arial">A · Decision-first</text><text x="${w+32}" y="30" font-size="20" font-family="Arial">B · Consequences-first refined</text></svg>`);
 await sharp({create:{width:w*2+48,height:Math.max(...metas.map(m=>m.height))+64,channels:3,background:'white'}}).composite([{input:label,left:0,top:0},...buffers.map((input,i)=>({input,left:i*(w+24),top:56}))]).jpeg({quality:94}).toFile(`${root}/${locale}-${width}-A-B.jpg`);
}
console.log(results);
