import {createRequire} from 'node:module';
const require=createRequire('D:/Claude-projects/b2b-dssl/package.json');
const browser=await require('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const page=await browser.newPage();page.on('console',e=>console.log(e.type(),e.text()));page.on('requestfailed',r=>console.log('FAILED',r.url(),r.failure()));page.on('response',r=>{if(r.status()>=400)console.log('HTTP',r.status(),r.url())});
await page.goto('http://127.0.0.1:4341/preview/common/en/agent-ops/',{waitUntil:'networkidle'});await page.waitForTimeout(3000);
console.log(await page.evaluate(()=>({boot:window.__dsMotionBooted, scripts:[...document.scripts].map(s=>({src:s.src,type:s.type,text:s.text.slice(0,120)}))})));await browser.close();
