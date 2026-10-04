import {createRequire} from 'node:module';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe',headless:true});
const p=await browser.newPage({viewport:{width:1440,height:1000}});
await p.goto('http://127.0.0.1:4362/prototypes/learn/trajectory/puskonaladka?lang=en',{waitUntil:'networkidle'});
console.log(await p.locator('aside').first().evaluate(e=>({html:e.outerHTML.slice(0,1900),rect:e.getBoundingClientRect().toJSON(),bg:getComputedStyle(e).backgroundColor,radius:getComputedStyle(e).borderRadius,children:[...e.children].map(c=>({tag:c.tagName,class:c.className,bg:getComputedStyle(c).backgroundColor,radius:getComputedStyle(c).borderRadius,rect:c.getBoundingClientRect().toJSON()}))})));
await browser.close();
