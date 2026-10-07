// Native screenshot replacement, preserving the Learn frame production settings.
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const require=createRequire(path.resolve('../b2b-dssl/package.json'));
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
try {
  const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1.5,reducedMotion:'reduce',locale:'ru-RU'});
  await page.goto('http://127.0.0.1:4407/prototypes/learn/trajectory/proekt/?lang=ru',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  const text=await page.locator('body').innerText();
  if(/концепт|портфолио.верс/i.test(text))throw new Error('Forbidden text remains in capture');
  const info=await sharp(await page.screenshot({animations:'disabled',fullPage:true})).resize({width:2000,withoutEnlargement:true}).webp({quality:84}).toFile('public/media/case-learn-ru/trajectory.webp');
  await writeFile('tasks/robert-review-2026-10-07/reports/07-reshoot.json',JSON.stringify({url:page.url(),viewport:page.viewportSize(),scale:1.5,info,text},null,2));
  console.log(info);
}finally{await browser.close();}
