/** Fresh public-route checks. Product projects are read-only dependencies of the test runner. */
import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const out='tasks/portfolio-rebuild/integration/final';
const base=process.argv.find(v=>v.startsWith('--base='))?.slice(7)||'http://127.0.0.1:4390';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const browser=await require('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const slugs=['agent-ops-console','partner-portal','learn','vet-clinic','pawly'];
const profiles=[],failures=[],media=new Map(),metadata=[],lifecycle=[];
mkdirSync(out+'/shots',{recursive:true});
const check=(ok,data)=>{if(!ok)failures.push(data)};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
try {
  for(const locale of ['en','ru']) for(const [width,height] of [[1440,900],[1024,900],[390,844],[360,780],[1440,600],[1024,600],[390,600],[360,600]]) for(const mode of ['full','reduce','no-js']) {
    const context=await browser.newContext({viewport:{width,height},reducedMotion:mode==='full'?'no-preference':'reduce',javaScriptEnabled:mode!=='no-js'});
    const page=await context.newPage();
    for(const route of [locale==='ru'?'/ru/':'/',(locale==='ru'?'/ru':'')+'/about',...slugs.map(s=>(locale==='ru'?'/ru':'')+'/work/'+s)]) {
      const errors=[],bad=[];
      const onError=e=>errors.push(e.message), onResponse=r=>{if(r.status()>=400&&new URL(r.url()).origin===base)bad.push({url:r.url(),status:r.status()})};
      page.on('pageerror',onError);page.on('response',onResponse);
      const res=await page.goto(base+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
      await pause(mode==='full'?1200:100);
      // Native reading wakes lazy assets and reveals each block; no seek into GSAP state.
      const initialHeight=await page.evaluate(()=>document.documentElement.scrollHeight);
      for(let y=0;y<initialHeight;y+=height*.8){await page.evaluate(y=>scrollTo(0,y),y);await pause(mode==='full'?90:20);}
      await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await pause(250);
      const data=await page.evaluate(()=>({
        width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth-innerWidth,
        h1:document.querySelectorAll('main h1').length,title:document.querySelector('main h1')?.textContent.trim(),
        story:document.querySelector('[data-story-version]')?.getAttribute('data-story-version'),
        blocks:[...document.querySelectorAll('[data-block-type]')].map(e=>({id:e.id,type:e.dataset.blockType})),
        next:document.querySelector('.case-next a')?.getAttribute('href') ?? document.querySelector('a.case-next')?.getAttribute('href'),
        pins:document.querySelectorAll('.pin-spacer').length,
        images:[...document.querySelectorAll('main img')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({src:e.currentSrc||e.src,complete:e.complete,natural:e.naturalWidth})),
        works:[...document.querySelectorAll('.featured-case')].map(e=>e.getAttribute('href')),
        nested:[...document.querySelectorAll('.featured-case a,.featured-case button')].length,
        role:document.querySelector('.hero h1')?.textContent.trim(),
        mail:document.querySelector('a[href^="mailto:"]')?.getAttribute('href'),
        cv:[...document.querySelectorAll('a[href$=".pdf"]')].map(e=>e.getAttribute('href')),
        webflow:[...document.querySelectorAll('.dev__link')].map(e=>({tag:e.tagName,href:e.getAttribute('href')})),
      }));
      check(res.ok()&&data.h1===1&&data.overflow<=1&&!errors.length&&!bad.length,{route,locale,width,height,mode,reason:'route/layout',status:res.status(),data,errors,bad});
      check(data.images.every(i=>i.complete&&i.natural>0),{route,width,height,mode,reason:'images',images:data.images.filter(i=>!i.complete||!i.natural)});
      check(data.mail&&data.cv.includes(locale==='ru'?'/cv-ru.pdf':'/cv.pdf'),{route,reason:'contact/CV'});
      const slug=route.split('/').at(-1),isCase=slugs.includes(slug);
      if(isCase){check(data.story==='blocks-v1'&&data.blocks.length>0,{route,reason:'story'});const expected=(locale==='ru'?'/ru':'')+'/work/'+slugs[(slugs.indexOf(slug)+1)%5];check(data.next===expected,{route,reason:'Next',expected,actual:data.next});if(mode!=='full'||height<820||width<1024)check(data.pins===0,{route,width,height,mode,reason:'fallback pins',pins:data.pins});}
      else if(route.endsWith('/')){check(data.works.length===5&&data.nested===0&&data.role&&(locale==='ru'?/дизайнер/i:/Product Designer/).test(data.role),{route,reason:'Home registry',data});check(data.webflow.length===4&&data.webflow.every(v=>v.tag==='A'&&v.href?.startsWith('https:')),{route,reason:'Webflow fallback',data:data.webflow});}
      data.images.forEach(i=>media.set(new URL(i.src).pathname,true));
      profiles.push({route,locale,width,height,mode,...data,errors,bad});
      if(mode==='reduce'&&height!==600&&[1440,390].includes(width)){
        await page.evaluate(()=>scrollTo(0,0));await pause(100);
        await page.screenshot({path:`${out}/shots/${locale}-${slug||'home'}-${width}-full.png`,fullPage:true});
        if(isCase){await page.screenshot({path:`${out}/shots/${locale}-${slug}-${width}-opening.png`});await page.evaluate(h=>scrollTo(0,h),height);await pause(50);await page.screenshot({path:`${out}/shots/${locale}-${slug}-${width}-second.png`});}
        if(slug==='vet-clinic')await page.locator('#role-boundary').screenshot({path:`${out}/shots/${locale}-vet-role-flow-${width}.png`}).catch(()=>{});
      }
      page.off('pageerror',onError);page.off('response',onResponse);
    }
    await context.close();console.log(`${locale} ${width}x${height} ${mode}: ${profiles.length} routes`);
  }
  const context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage();
  for(const route of ['/', '/ru/', '/about', '/ru/about',...slugs.flatMap(s=>['/work/'+s,'/ru/work/'+s]),'/kit','/preview/common/','/404.html','/500.html']) {
    await page.goto(base+route,{waitUntil:'networkidle'});
    const row=await page.evaluate(()=>({lang:document.documentElement.lang,canonical:document.querySelector('link[rel="canonical"]')?.href,alternates:[...document.querySelectorAll('link[hreflang]')].map(e=>({lang:e.hreflang,href:e.href})),robots:document.querySelector('meta[name="robots"]')?.content,og:document.querySelector('meta[property="og:image"]')?.content,title:document.title}));
    const publicRoute=!route.startsWith('/preview')&&route!='/kit'&&!route.endsWith('.html');
    check(publicRoute?row.canonical==='https://kanarev.com'+route&&row.alternates.length===3:row.robots?.includes('noindex'),{route,reason:'SEO',row});
    if(row.og){const response=await fetch(base+new URL(row.og).pathname);check(response.ok,{route,reason:'OG'});}
    metadata.push({route,...row});
  }
  for(const locale of ['en','ru']) {
    const root=locale==='ru'?'/ru/':'/';await page.setViewportSize({width:390,height:844});await page.goto(base+root,{waitUntil:'networkidle'});
    await page.locator('[data-navbar-trigger]').click();check(await page.locator('[data-mobile-nav]').count()>0||await page.locator('dialog[open]').count()>0,{locale,reason:'mobile navigation open'});
    await page.keyboard.press('Escape');check(await page.locator('dialog[open]').count()===0,{locale,reason:'mobile navigation Escape'});
    const trigger=page.locator('.dev__link').first();await trigger.click();check(await page.locator('dialog[data-project-dialog][open]').count()===1,{locale,reason:'Webflow dialog'});await page.keyboard.press('Escape');check(await trigger.evaluate(e=>e===document.activeElement),{locale,reason:'dialog focus return'});
    await page.locator('.featured-case').first().click();await page.waitForURL('**/work/agent-ops-console');await page.goBack();await page.waitForURL(base+root);check(await page.locator('.featured-case').count()===5,{locale,reason:'Home Back'});lifecycle.push({locale,navigation:true,dialog:true,back:true});
  }
  const sitemap=await (await fetch(base+'/sitemap.xml')).text(), robots=await (await fetch(base+'/robots.txt')).text();
  check((sitemap.match(/<loc>/g)||[]).length===14&&!sitemap.includes('/preview/')&&!sitemap.includes('/kit'),{reason:'sitemap',sitemap});
  check(robots.includes('Disallow: /kit')&&robots.includes('Disallow: /preview'),{reason:'robots',robots});
  for(const path of ['/cv.pdf','/cv-ru.pdf']){const res=await fetch(base+path);check(res.ok&&Buffer.from(await res.arrayBuffer()).subarray(0,5).toString()==='%PDF-',{path,reason:'CV bytes'});}
  const mirrors=[['ds/tokens.css','src/styles/tokens.css'],['ds/motion.js','src/scripts/motion.js']].map(([source,mirror])=>({source,mirror,equal:readFileSync(source).equals(readFileSync(mirror))}));check(mirrors.every(v=>v.equal),{reason:'DS mirrors',mirrors});
  const served=[];for(const path of media.keys()){const bytes=Buffer.from(await (await fetch(base+path)).arrayBuffer()),local=readFileSync('public'+path);const equal=bytes.equals(local);check(equal,{path,reason:'served media bytes'});served.push({path,equal,sha256:createHash('sha256').update(bytes).digest('hex')});}
  const alpha=[];for(const {file} of JSON.parse(readFileSync('tasks/portfolio-rebuild/common/captures.json')).media){const {data,info}=await sharp('public'+file).ensureAlpha().raw().toBuffer({resolveWithObject:true});const corners=[0,info.width-1,(info.height-1)*info.width,info.height*info.width-1].map(i=>data[i*4+3]);check(corners.every(v=>v===0),{file,reason:'native alpha corners',corners});alpha.push({file,corners});}
  await page.goto(base+'/work/partner-portal/#domain-system',{waitUntil:'networkidle'});await page.locator('[data-specimen-set="availability"]').screenshot({path:out+'/shots/availability-clean.png'});
  await context.close();
  writeFileSync(out+'/site-verification.json',JSON.stringify({base,profiles,metadata,lifecycle,mirrors,served,alpha,failures},null,2));
} finally {await browser.close();}
console.log(JSON.stringify({profiles:profiles.length,metadata:metadata.length,media:media.size,failures:failures.length}));
if(failures.length)process.exitCode=1;
