import { createRequire } from 'node:module';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { ruCaptureStrings } from '../../../scripts/agent-ops-v2/ru-capture-strings.mjs';
const require = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const { chromium } = require('playwright');
const root = 'audit/home-cover-polish';
const out = 'public/media/home-cover-polish';
const fixture = JSON.parse(await readFile('D:/Claude-projects/b2b-dssl/audit/dashboard-v3/baseline-state.json','utf8'));
const fix = await readFile(`${root}/tools/portal-source-fix.css`,'utf8');
const browser = await chromium.launch();
const portalOnly = process.argv.includes('--portal-only');
const entries = portalOnly
  ? JSON.parse(await readFile(`${root}/sources/manifest.json`, 'utf8')).entries.filter(e => e.product !== 'b2b-dssl')
  : [];
await mkdir(out,{recursive:true});
await mkdir(`${root}/sources`,{recursive:true});
async function save(locator,key,context,extra={},pad=0) {
  let png = await locator.screenshot({animations:'disabled',omitBackground:true});
  if(pad) png=await sharp(png).extend({top:pad*2,bottom:pad*2,left:pad*2,right:pad*2,background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer();
  const info = await sharp(png).metadata();
  await writeFile(`${root}/sources/${key}.png`,png);
  await sharp(png).webp({lossless:true,effort:6}).toFile(`${out}/${key}.webp`);
  entries.push({key,src:`/media/home-cover-polish/${key}.webp`,width:info.width,height:info.height,cssWidth:info.width/2,cssHeight:info.height/2,sha256:createHash('sha256').update(png).digest('hex'),...context,...extra});
}
try {
  const sample = await browser.newPage();
  await sample.goto('http://127.0.0.1:4417/');
  const stage = await sample.evaluate(()=>{const s=getComputedStyle(document.documentElement);return {text:s.getPropertyValue('--text-subtle').trim(),surface:s.getPropertyValue('--surface-subtle').trim()};});
  await sample.close();
  for(const locale of ['en','ru']) for(const width of [1280,390]) {
    const context=await browser.newContext({viewport:{width,height:2000},deviceScaleFactor:2,reducedMotion:'reduce'});
    await context.addInitScript(seed=>sessionStorage.setItem('b2b-dssl.state.v1',JSON.stringify(seed)),fixture);
    const page=await context.newPage();
    await page.clock.setFixedTime(new Date('2026-10-30T09:00:00Z'));
    await page.goto(`http://127.0.0.1:5196/b2b/${locale==='ru'?'ru/':''}resolution-center`,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    const row=page.locator('[data-slot="resolution-row"]').filter({hasText:locale==='ru'?'Строка 19':'Row 19'});
    await row.getByRole('button').first().click();
    await page.locator('#decision-panel-19').getByRole('radio').first().click();
    await page.addStyleTag({content:fix});
    await row.evaluate(el=>{const shell=document.createElement('div');shell.className='home-decision-capture';el.before(shell);shell.append(el,document.querySelector('#decision-panel-19'));});
    // Export the rounded source shell against alpha, rather than the white
    // queue/page beneath it. Keep the shell's own background and 1px border.
    await page.addStyleTag({content:'body * {visibility:hidden} .home-decision-capture, .home-decision-capture * {visibility:visible}'});
    await page.locator('.home-decision-capture').evaluate(el=>{
      let ancestor=el.parentElement;
      while(ancestor){ancestor.style.background='transparent';ancestor.style.boxShadow='none';ancestor=ancestor.parentElement;}
    });
    await page.mouse.move(0,0);
    await page.evaluate(async()=>{for(const i of document.images){i.loading='eager';await i.decode().catch(()=>{});}});
    const shell=page.locator('.home-decision-capture');
    const text=await shell.innerText();
    if(!text.includes('KX-7608NXI-K2')||!text.includes('KX-7608NI-K2')) throw new Error('Missing candidate');
    const borders=await shell.evaluate(el=>[el,...el.querySelectorAll('.candidate-comparison-row')].map(e=>{const s=getComputedStyle(e);return [s.borderTopWidth,s.borderRightWidth,s.borderBottomWidth,s.borderLeftWidth];}));
    await save(shell,`portal-${locale}-${width}`,{product:'b2b-dssl',sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:'D:/Claude-projects/b2b-dssl',encoding:'utf8'}).trim(),route:'resolution-center',locale,viewport:width,sourceCorrection:'tools/portal-source-fix.css',text,borders,export:'Rounded native shell on transparent external canvas; shell background and 1px borders preserved'});
    await context.close();
  }
  if (!portalOnly) for(const locale of ['en','ru']) for(const width of [1440,390]) {
    const context=await browser.newContext({viewport:{width,height:2200},deviceScaleFactor:2,reducedMotion:'reduce'});
    await context.addInitScript(()=>sessionStorage.setItem('agent-ops.role','shift-lead'));
    const page=await context.newPage();
    await page.clock.setFixedTime(new Date('2026-08-25T07:12:00Z'));
    await page.goto(`http://127.0.0.1:5296/${locale==='ru'?'ru/':''}screens/action-approvals?approval=ap-5`,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    if(locale==='ru') await page.evaluate(dictionary=>{const walker=document.createTreeWalker(document.querySelector('#root'),NodeFilter.SHOW_TEXT);while(walker.nextNode()){const n=walker.currentNode;const t=dictionary[n.textContent.trim()];if(t)n.textContent=n.textContent.replace(n.textContent.trim(),t);}},ruCaptureStrings);
    const panel=page.locator('[data-consequence]');
    await panel.waitFor();
    const text=await panel.innerText();
    if(!text.includes('$120')) throw new Error('Missing credit');
    await page.addStyleTag({content:'body * {visibility:hidden} [data-consequence], [data-consequence] * {visibility:visible}'});
    // Real UI export: make only its outer canvas transparent. The header takes
    // the portfolio's neutral-stage text role; the native dark panels are intact.
    await panel.evaluate((el,stage)=>{
      let ancestor=el;while(ancestor){ancestor.style.background='transparent';ancestor.style.boxShadow='none';ancestor=ancestor.parentElement;}
      el.firstElementChild.style.color=stage.text;
      for(const span of el.firstElementChild.children)span.style.color=stage.text;
    },stage);
    await save(panel,`agent-neutral-${locale}-${width}`,{product:'sp-agent-ops-source',sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:'D:/Claude-projects/sp-agent-ops-source',encoding:'utf8'}).trim(),route:'screens/action-approvals?approval=ap-5',locale,viewport:width,text,stage,export:'Transparent outer canvas with 24 CSS px alpha padding; neutral header; native panel content unchanged'},{},24);
    await context.close();
  }
} finally {
  await browser.close();
  await writeFile(`${root}/sources/manifest.json`,JSON.stringify({browser:browser.version(),dpr:2,entries},null,2)+'\n');
}
console.log(entries.map(({key,width,height})=>({key,width,height})));
