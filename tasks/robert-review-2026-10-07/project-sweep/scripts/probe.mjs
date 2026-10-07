import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
const require=createRequire('d:/Claude-projects/Agent-ops-console/package.json');
const {chromium}=require('playwright');
const b=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const p=await b.newPage(); await p.goto('http://127.0.0.1:4420/work/learn/',{waitUntil:'networkidle'});
console.log(JSON.stringify(await p.evaluate(()=>({attrs:[...document.querySelectorAll('[data-astro-source-file]')].slice(0,10).map(e=>({tag:e.tagName,src:e.getAttribute('data-astro-source-file')})),styles:[...document.querySelectorAll('style,link[rel=stylesheet]')].map(e=>({attrs:[...e.attributes].map(a=>[a.name,a.value]),text:e.textContent.slice(0,140)})).slice(0,15),html:document.querySelector('main')?.outerHTML.slice(0,1400)})),null,2));
await b.close();
