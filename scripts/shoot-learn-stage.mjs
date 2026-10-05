/** Capture complete native RU Learn fragments for the bilingual home/cover stage.
 * Does not translate or paint image pixels. lang=ru selects the source UI.
 * Usage: node scripts/shoot-learn-stage.mjs [portfolio-preview-origin]
 */
import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {captureNativeAlpha} from './lib/native-alpha-capture.mjs';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const origin=process.argv[2]??'http://127.0.0.1:4475';
const dir='public/media/art-direction/learn-ru';
const passportsOnly=process.argv.includes('--passports-only');
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.HARMONY_CHROME??'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const report=[];
async function shot(page,file,selector,expected,alpha=false){
 await page.evaluate(()=>document.fonts.ready);
 const node=page.locator(selector);const text=await node.innerText();
 assert.equal(await page.locator('html').getAttribute('lang'),'ru');
 assert(text.includes(expected),`${file}: expected Russian content`);
 assert(!/Path length|Assessment|Resource|Current unit|cannot discover|Start learning|Sign in/.test(text),`${file}: English UI`);
 const box=await node.boundingBox();assert(box.width>0&&box.height>0);
 const bytes=alpha?await captureNativeAlpha(page,node):await node.screenshot({animations:'disabled'});
 await writeFile(`${dir}/${file}.png`,bytes);
 report.push({file:`${dir}/${file}.png`,url:page.url(),text,width:box.width,height:box.height,alpha,sha256:createHash('sha256').update(bytes).digest('hex')});
}
try{
 for(const [kind,width] of [['desktop',1440],['mobile',390]]){
 const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:2,reducedMotion:'reduce'});
 if(!passportsOnly){
 await page.goto(`${origin}/prototypes/learn/material/onvif-not-found?lang=ru`);
 await page.evaluate(()=>document.fonts.ready);
 // The editorial excerpt contains real header nodes and the complete first
 // diagnostic step. Place it at an integer origin to avoid preceding-page rules.
 await page.evaluate(desktop=>{
 const header=document.querySelector('main header');
 const body=document.querySelector('[data-material-body="onvif-not-found"]');
 const rail=document.querySelector('main aside');
 const frame=document.createElement('div');frame.dataset.stageCapture='';
 frame.style.cssText=`position:absolute;left:0;top:0;z-index:2147483647;background:var(--surface-page);padding:${desktop?24:16}px;display:grid;gap:24px;width:${desktop?1152:390}px;box-sizing:border-box;`;
 const top=document.createElement('div');top.style.cssText='display:flex;flex-direction:column;align-items:flex-start;gap:24px;';
 [...header.children].filter(n=>n.tagName!=='NAV').forEach(n=>top.append(n));
 frame.append(top);
 const content=document.createElement('div');content.style.cssText=`display:grid;gap:48px;grid-template-columns:${desktop?'minmax(0,1fr) 320px':'minmax(0,1fr)'};align-items:start;`;
 [...body.children].slice(2).forEach(n=>n.remove());
 content.append(body);if(desktop){rail.style.position='static';content.append(rail);}
 frame.append(content);document.body.append(frame);
 },kind==='desktop');
 await shot(page,`material-${kind}`,'[data-stage-capture]','TRASSIR не видит камеру');
 }
 await page.goto(`${origin}/prototypes/learn/trajectory/puskonaladka?lang=ru`);
 await shot(page,`passport-${kind}`,'aside[class*="_passport_"]','Объём программы',true);
 await page.close();
 }
 if(!passportsOnly){
 // A saved demonstration cursor selects this real shared material as unit 03.
 const fixture=JSON.parse(await readFile('../learn/audit/product-polish/evidence/07/state-marina-one.json','utf8'));
 fixture.progress={puskonaladka:{trajectoryId:'puskonaladka',doneUnitIds:['puskonaladka#0','puskonaladka#1'],cursor:2,startedAt:'2026-09-07T18:07:54.081Z',lastActivityAt:'2026-09-07T18:07:54.787Z'}};fixture.toasts=[];
 const page=await browser.newPage({viewport:{width:600,height:1000},deviceScaleFactor:2,reducedMotion:'reduce'});
 await page.addInitScript(state=>{sessionStorage.setItem('learn-prototype-v1',JSON.stringify(state));sessionStorage.setItem('learn-account-v2:'+encodeURIComponent(state.session.identifier),JSON.stringify(state));},fixture);
 await page.goto(`${origin}/prototypes/learn/trajectory/puskonaladka?lang=ru`);
 await page.locator('[data-layout="curriculum"][data-step="current"]').evaluate(node=>{
 const frame=document.createElement('div');frame.style.cssText='position:absolute;left:0;top:0;width:400px;z-index:2147483647;';
 document.body.append(frame);frame.append(node);
 });
 await shot(page,'current-unit','[data-layout="curriculum"][data-step="current"]','TRASSIR не видит камеру');
 await page.close();
 }
}finally{await browser.close();}
const manifest='tasks/portfolio-rebuild/integration/learn-stage-ru-captures.json';
const entries=passportsOnly?JSON.parse(await readFile(manifest,'utf8')).map(old=>report.find(r=>r.file===old.file)??old):report;
await writeFile(manifest,JSON.stringify(entries,null,2));
console.log(`Captured ${report.length} native Russian fragments`);
