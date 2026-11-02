import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
export const pw=require('playwright');
export const root='audit/portfolio-final-quality-2026-11-03';
export const base=process.env.QA_BASE??'http://127.0.0.1:4414';
export const routes=['/','/about/','/work/agent-ops-console/','/work/partner-portal/','/work/learn/','/work/vet-clinic/','/work/pawly/'];
export const launch=(engine='chromium')=>pw[engine].launch(engine==='chromium'?{executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}:{});
export const json=async(path,data)=>{await mkdir(path.slice(0,path.lastIndexOf('/')),{recursive:true});await writeFile(path,JSON.stringify(data,null,2));};
export const sleep=ms=>new Promise(r=>setTimeout(r,ms));
export async function settled(page){
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
 await page.waitForFunction(()=>[...document.querySelectorAll('[data-motion-intro] [data-motion]')].filter(e=>e.getClientRects().length).every(e=>getComputedStyle(e).opacity==='1'&&!e.style.willChange.includes('opacity')),{},{timeout:20000});
 await page.waitForTimeout(350);
}
export async function sweep(page){
 const height=await page.evaluate(()=>document.documentElement.scrollHeight);
 for(let y=0;y<height;y+=650){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(45);}
 await page.waitForTimeout(1400);await page.evaluate(()=>scrollTo(0,0));await settled(page);
}
export async function shot(page,path,{fullPage=false,locator}={}){
 const data=locator?await locator.screenshot({timeout:30000}):await page.screenshot({fullPage,timeout:30000});
 const meta=await sharp(data).metadata();
 if(meta.height>16383){await writeFile(path+'.png',data);return path+'.png';}
 await sharp(data).webp({quality:85,effort:2}).toFile(path+'.webp');return path+'.webp';
}
export function watch(page){const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()});});return {errors,failed};}
