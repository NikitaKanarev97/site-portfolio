/** Local built-page acceptance, with optional post-release HTTP origin.
 * Own headless Chromium only. Checks both locales and real demo links.
 */
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire('D:/Claude-projects/PETS-walking/package.json');
const { chromium } = require('playwright');
const origin = process.env.PORTFOLIO_ORIGIN ?? 'http://127.0.0.1:4321';
const appOrigin = process.env.PAWLY_ORIGIN ?? 'http://127.0.0.1:4173';
const output = 'D:/Claude-projects/PETS-walking/audit/product-polish/evidence/06-case';
const live = origin.startsWith('https:');
const browser = await chromium.launch({ headless: true });
const records = [], errors = [];
if (process.env.PAWLY_VERIFY_RESUME === '1') {
  const previous = JSON.parse(await fs.readFile(`${output}/${live?'live':'local'}-checks-failed.json`, 'utf8'));
  records.push(...previous.records);
}
try {
  for (const locale of ['en','ru']) {
    const prefix = locale === 'ru' ? '/ru' : '';
    for (const width of live ? [390] : [360,390,768,1440]) {
      if (records.some(r=>r.locale===locale && r.width===width && r.media200)) continue;
      const page = await browser.newPage({ viewport: { width, height: 960 }, reducedMotion: 'reduce' });
      page.on('pageerror', e => errors.push(`${locale} ${width}: ${e.message}`));
      await page.goto(`${origin}${prefix}/work/pawly/`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('html').getAttribute('lang'), locale);
      const text = await page.locator('main').innerText();
      assert(text.includes(locale === 'ru' ? 'без живой проверки' : 'no human validation'));
      assert(text.includes(locale === 'ru' ? 'сентябр' : 'September'));
      const links = await page.locator('a[href*="pawly-fawn.vercel.app"]').evaluateAll(nodes => nodes.map(n=>n.href));
      assert.equal(links.length, 2);
      assert(links.every(x => x === `https://pawly-fawn.vercel.app${prefix}/app`));
      const media = await page.locator('main img[src]:not([src=""])').evaluateAll(nodes => nodes.map(n=>({src:n.src,alt:n.alt})));
      for (const image of media) {
        const res = await page.request.get(image.src);
        assert.equal(res.status(), 200, image.src);
      }
      // Visit the long page so lazy images and scroll-reveal consumers render.
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y=0; y<height; y+=800) { await page.evaluate(y=>scrollTo(0,y), y); await page.waitForTimeout(40); }
      await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
      assert.equal(await page.locator('main img[src]:not([src=""])').evaluateAll(nodes => nodes.filter(n=>!n.complete || n.naturalWidth===0).length),0);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth+1);
      assert.equal(overflow,false,`overflow ${locale} ${width}`);
      const video = page.locator('main video');
      assert.equal(await video.count(),1);
      assert.equal(await video.getAttribute('data-clip'),'film');
      assert.equal(await video.evaluate(v=>v.loop),false);
      assert.equal(await video.evaluate(v=>v.paused),true);
      const sources = await video.locator('source').evaluateAll(nodes=>nodes.map(n=>n.src));
      for(const src of sources) assert.equal((await page.request.get(src)).status(),200,src);
      await video.scrollIntoViewIfNeeded();
      await video.evaluate(v=>v.play());
      await page.waitForTimeout(350);
      assert(await video.evaluate(v=>v.currentTime>0 && v.videoWidth>0));
      await video.evaluate(v=>v.pause());
      // Hero is a full image opened via the existing keyboard-accessible zoom.
      const zoom = page.locator('.case-cover__zoom');
      await zoom.scrollIntoViewIfNeeded();
      await zoom.focus(); await page.keyboard.press('Enter');
      const dialog=page.locator('dialog[open]');
      await dialog.waitFor();
      await page.keyboard.press('Escape');
      await dialog.waitFor({state:'hidden'});
      if (!live && [390,1440].includes(width)) {
        await page.locator('.case-cover').screenshot({ path: `${output}/case-hero-${locale}-${width}.png` });
        await page.locator('.case-decisions').first().screenshot({ path: `${output}/case-decisions-${locale}-${width}.png` }).catch(()=>{});
        await page.screenshot({ path: `${output}/case-page-${locale}-${width}.png`, fullPage:true });
      }
      records.push({locale,width,images:media.length,media200:true,videoDecoded:true,manualPlayback:true,overflow:false,zoomKeyboard:true,demoLinks:links});
      await page.close();
    }
    if (!records.some(r=>r.locale===locale && r.journey)) {
    const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
    p.on('pageerror',e=>errors.push(e.message));
    // Follow the actual case link in an isolated context. Locally, intercept only
    // the destination origin; production verification follows it unchanged.
    if(!live) await p.context().route('https://pawly-fawn.vercel.app/**',async route=>{
      const requestURL=new URL(route.request().url());
      const response=await route.fetch({url:appOrigin+requestURL.pathname+requestURL.search});
      await route.fulfill({response});
    });
    await p.goto(`${origin}${prefix}/work/pawly/`);
    const external=p.locator('a[href*="pawly-fawn.vercel.app"]').first();
    const [demo]=await Promise.all([p.context().waitForEvent('page'),external.click()]);
    await demo.waitForLoadState('networkidle');
    assert(demo.url().includes(`${prefix}/app`));
    assert(await demo.locator(`a[href="${prefix}/app/owner-home"]`).count()>0);
    await demo.locator(`a[href="${prefix}/app/owner-home"]`).first().click();
    await demo.locator('[data-track="open-active-booking"]').waitFor();
    await demo.locator('[data-track="open-active-booking"]').click();
    await demo.waitForURL(`**${prefix}/app/active-service`);
    await demo.reload();
    assert((await demo.locator('article').innerText()).includes('14:50'));
    records.push({locale,journey:'case→demo→owner-home→active-service→reload',pass:true});
    await p.context().close();
    }
    const home=await browser.newPage({viewport:{width:390,height:900},reducedMotion:'reduce'});
    await home.goto(`${origin}${prefix}/`);
    const homeLink = home.locator(`a[href="${prefix}/work/pawly"]`).first();
    if (!(await homeLink.isVisible())) await home.locator('details').filter({has:homeLink}).locator('summary').click();
    const homeText=await home.locator('main').innerText();
    assert(homeText.includes('Pawly'));
    assert.equal(await home.locator(`a[href="${prefix}/work/pawly"]`).count()>0,true);
    records.push({locale,homePreview:true});
    await home.close();
  }
  assert.equal(errors.length,0,JSON.stringify(errors));
  await fs.writeFile(`${output}/${live?'live':'local'}-checks.json`,JSON.stringify({date:new Date().toISOString(),origin,appOrigin,records,errors,pass:true},null,2));
  console.log(JSON.stringify({pass:true,checks:records.length,errors}));
} catch(e) {
  await fs.writeFile(`${output}/${live?'live':'local'}-checks-failed.json`,JSON.stringify({date:new Date().toISOString(),records,errors,error:e.stack},null,2));
  throw e;
} finally { await browser.close(); }
