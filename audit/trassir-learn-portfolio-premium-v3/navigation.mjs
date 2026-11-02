const { chromium } = await import('file:///D:/Claude-projects/b2b-dssl/node_modules/playwright-core/index.mjs');
const b=await chromium.launch(),results=[];
for(const locale of ['en','ru']) for(const width of [390,1440]){
 const c=await b.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),p=await c.newPage();
 await p.goto(`http://127.0.0.1:4429/${locale==='ru'?'ru/':''}work/learn/`);
 await p.keyboard.press('Tab'); const firstFocus=await p.locator(':focus').getAttribute('href');
 if(firstFocus!=='#main') throw Error('Skip link must be first');
 await p.keyboard.press('Enter');
 const touches=await p.locator('.learn-index a').evaluateAll(a=>a.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})));
 if(touches.some(t=>t.h<44))throw Error('Anchor target too short');
 await p.locator('.case-next__link').focus(); await p.keyboard.press('Enter');
 await p.waitForURL(`**/${locale==='ru'?'ru/':''}work/vet-clinic/`);
 results.push({locale,width,skipLink:'first keyboard stop',touchAnchors:touches,next:'keyboard navigation to same-locale Vet'}); await c.close();
}
await (await import('node:fs/promises')).writeFile('audit/trassir-learn-portfolio-premium-v3/logs/navigation-extra.json',JSON.stringify(results,null,2));
await b.close(); console.log('4 skip-link / 48px anchor / keyboard Next-case checks passed');
