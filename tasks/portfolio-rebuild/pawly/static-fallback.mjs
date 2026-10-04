import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/PETS-walking/package.json')('playwright');
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
await mkdir('tasks/portfolio-rebuild/pawly/shots/inline',{recursive:true});
try{
  for(const locale of ['en','ru'])for(const width of [1440,390]){
    const p=await browser.newPage({viewport:{width,height:900},javaScriptEnabled:false});
    await p.goto(`http://127.0.0.1:4370/preview/pawly-rebuild/${locale}/`);
    for(const [id,suffix] of [['#return-boundary','sequence'],['#return-boundary .case-steps__step:nth-child(2)','poster']]){
      const e=p.locator(id);await e.scrollIntoViewIfNeeded();await p.waitForTimeout(250);
      await e.screenshot({path:`tasks/portfolio-rebuild/pawly/shots/inline/${locale}-${width}-no-js-${suffix}.png`});
    }
    await p.close();
  }
}finally{await browser.close();}
console.log('8 actual inline no-JS fallback screenshots saved.');
