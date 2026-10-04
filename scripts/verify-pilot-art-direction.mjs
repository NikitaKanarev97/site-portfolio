/** Visual evidence for the opt-in interlock/focus compositions. */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const browser = await require('playwright').chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
const out = process.env.PILOT_OUT || 'research/portfolio-benchmark/shots/pilot-art-direction';
const base = process.env.PILOT_BASE || 'http://127.0.0.1:4330';
mkdirSync(out, { recursive: true });
const results = [];
const assert = (test, message) => { if (!test) throw new Error(message); };
const geometry = page => page.evaluate(() => ({
  y: scrollY, height: document.documentElement.scrollHeight,
  overflow: document.documentElement.scrollWidth - innerWidth,
  focused: !!document.querySelector('.is-focused'), pins: document.querySelectorAll('.pin-spacer').length,
  field: document.querySelector('.case-steps__field-bleed')?.getBoundingClientRect().toJSON(),
  visible: [...document.querySelectorAll('[data-focus-state]')].filter(e => {
    const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > .99;
  }).map(e => ({ title: e.querySelector('h3').textContent.trim(), rect: e.getBoundingClientRect().toJSON(),
    image: e.querySelector('img').getBoundingClientRect().toJSON(), loaded: e.querySelector('img').complete && e.querySelector('img').naturalWidth > 0 })),
}));
try {
  for (const [width, height] of [[1440,900], [1024,900], [390,844], [360,780], [1440,600]]) {
    const viewport = { width, height };
    const key = height === 600 ? '1440-short' : String(width);
    const context = await browser.newContext({ viewport, recordVideo: { dir: out, size: viewport } });
    const page = await context.newPage(); const errors = [];
    const began = Date.now(); const phase = {};
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${base}/preview/agent-ops-pilot/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${out}/after-${key}.png` });
    phase.coverEnd = (Date.now() - began) / 1000;
    const start = await page.locator('.case-steps').evaluate(e => e.getBoundingClientRect().top + scrollY - 24);
    const entry = await geometry(page);
    assert(entry.focused === (width >= 1024 && height >= 820), `Wrong enhancement ${key}`);
    const stops = [];
    if (entry.focused) {
      // Native wheel brings the stage into view; no artificial scroll driver in the site.
      while (await page.evaluate(() => scrollY) < start - 90) {
        await page.mouse.wheel(0,100); await page.waitForTimeout(60);
      }
      await page.evaluate(y => scrollTo(0,y), start);
      phase.sceneStart = (Date.now() - began) / 1000;
      for (const d of [0,250,495,510,570,650,900,1145,1160,1220,1300,1550,1795,1810,1870,1950]) {
        await page.evaluate(y => scrollTo(0,y), start+d); await page.waitForTimeout(120);
        const sample = await geometry(page); stops.push({ d, ...sample });
        assert(sample.visible.length === 1 && sample.visible[0].loaded && sample.overflow <= 1, `Unclean frame ${key}/${d}`);
        assert(sample.visible[0].image.left >= 0 && sample.visible[0].image.right <= width+1, `Image outside viewport ${key}/${d}`);
        await page.screenshot({ path: `${out}/${key}-state-${d}.png` });
        assert(sample.visible[0].image.top >= 24 && sample.visible[0].image.bottom <= height-24, `Whole panel must fit ${key}/${d}`);
        if (d === 1950 && sample.field) assert(Math.abs(sample.field.left)<2 && Math.abs(sample.field.right-width)<2, `Decision field must open to viewport ${key}`);
        if ([0,650,1300,1950].includes(d)) await page.waitForTimeout(850);
      }
      phase.sceneEnd = (Date.now() - began) / 1000;
      // Intermediate stops and the same exchanges in the reverse direction.
      for (const d of [1810,1550,1160,900,510,250,0]) {
        await page.evaluate(y => scrollTo(0,y), start+d); await page.waitForTimeout(130);
        const sample = await geometry(page); assert(sample.visible.length === 1, `Reverse blend ${key}/${d}`);
      }
      for (const y of [start+1949, start-800, start+800, start+1950]) {
        await page.evaluate(v=>scrollTo(0,v),y); await page.waitForTimeout(150);
        assert((await geometry(page)).visible.length === 1, `Fast scroll blend ${key}`);
      }
    } else {
      phase.sceneStart = (Date.now() - began) / 1000;
      for (const [i, step] of (await page.locator('[data-focus-state]').all()).entries()) {
        if (!await step.isVisible()) continue;
        await step.scrollIntoViewIfNeeded(); await page.waitForTimeout(400);
        await page.screenshot({ path: `${out}/${key}-native-${i}.png` });
        const box = await step.boundingBox();
        if (box.height > height) { await page.mouse.wheel(0,box.height-height+120); await page.waitForTimeout(400); await page.screenshot({path:`${out}/${key}-native-${i}-bottom.png`}); }
      }
      phase.sceneEnd = (Date.now() - began) / 1000;
    }
    await page.getByRole('link', {name:'Next case: Partner Portal',exact:true}).scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const origin = await page.evaluate(()=>({y:scrollY,link:document.querySelector('[data-case-next]').getBoundingClientRect().top}));
    await page.getByRole('link', {name:'Next case: Partner Portal',exact:true}).click();
    await page.waitForURL('**/preview/partner-portal-pilot/'); await page.waitForTimeout(1200);
    await page.screenshot({path:`${out}/${key}-portal.png`});
    await page.goBack(); await page.waitForURL('**/preview/agent-ops-pilot/'); await page.waitForTimeout(1400);
    const back = await page.evaluate(()=>({y:scrollY,link:document.querySelector('[data-case-next]').getBoundingClientRect().top}));
    assert(Math.abs(origin.y-back.y)<=2 && Math.abs(origin.link-back.link)<32, `Back lost composition ${key}`);
    assert(errors.length===0 && (await geometry(page)).overflow<=1, `Browser failure ${key}`);
    await page.screenshot({path:`${out}/${key}-back.png`});
    results.push({key,entry,stops,origin,back,phase,errors});
    await context.close(); await page.video().saveAs(`${out}/${key}-showcase.webm`);
  }
  for (const width of [1440,1024,390]) for (const mode of ['reduce','nojs']) {
    const context = await browser.newContext({viewport:{width,height:width===390?844:900}, reducedMotion:'reduce', javaScriptEnabled:mode!=='nojs'});
    const page = await context.newPage();
    await page.goto(`${base}/preview/agent-ops-pilot/`, {waitUntil:'networkidle'});
    await page.screenshot({path:`${out}/${width}-${mode}-cover.png`});
    const fallback=await geometry(page);
    assert(!fallback.focused && fallback.pins===0 && fallback.overflow<=1, `Fallback failed ${width}/${mode}`);
    for(const img of await page.locator('.pilot img').all()) {
      if(!await img.isVisible())continue;
      await img.scrollIntoViewIfNeeded(); await img.evaluate(el=>el.decode());
    }
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:`${out}/${width}-${mode}-full.png`,fullPage:true});
    assert((await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'), 'Preview indexable');
    results.push({width,mode,fallback}); await context.close();
  }
  const liveContext = await browser.newContext({viewport:{width:1440,height:900}});
  const live = await liveContext.newPage(); const lifecycle=[];
  await live.goto(`${base}/preview/agent-ops-pilot/`,{waitUntil:'networkidle'}); await live.waitForTimeout(2300);
  await live.locator('.case-steps').evaluate(e=>scrollTo(0,(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24+1300));
  await live.waitForTimeout(200);
  const readingTop=(await live.locator('[data-focus-state]').nth(2).boundingBox()).y;
  for(let i=0;i<3;i++) {
    for(const preference of ['reduce','no-preference']) {
      await live.emulateMedia({reducedMotion:preference}); await live.waitForTimeout(500);
      const sample=await geometry(live); const r=await live.locator('[data-focus-state]').nth(2).boundingBox();
      assert(Math.abs(r.y-readingTop)<3 && sample.pins===(preference==='reduce'?0:1), `Live preference lost material ${i}/${preference}`);
      lifecycle.push({i,preference,y:sample.y,readingTop:r.y,pins:sample.pins});
    }
  }
  for(const [width,height] of [[1024,900],[390,844],[360,780],[1440,600],[1440,900]]) {
    await live.setViewportSize({width,height}); await live.waitForTimeout(700);
    const sample=await geometry(live);
    assert(sample.pins===((width>=1024&&height>=820)?1:0) && sample.overflow<=1, 'Live resize residue');
    if (!sample.focused) assert(!sample.field?.width, 'Field remains after native cleanup');
    const outside=await live.locator('.case-steps__screen').evaluateAll(es=>es.filter(e=>{
      const r=e.getBoundingClientRect(),p=e.parentElement.getBoundingClientRect();
      if (e.closest('[data-focus-state]') && getComputedStyle(e.closest('[data-focus-state]')).visibility === 'hidden') return false;
      return r.width>0&&(r.left<p.left-1||r.right>p.right+1);
    }).length);
    assert(outside===0,'Native panel retains focus transform');
    await live.screenshot({path:`${out}/reading-resize-${width}x${height}.png`});
    lifecycle.push({width,height,pins:sample.pins,y:sample.y,outside});
  }
  await live.getByRole('link',{name:'Next case: Partner Portal',exact:true}).scrollIntoViewIfNeeded(); await live.waitForTimeout(300);
  const linkTop=()=>live.locator('[data-case-next]').evaluate(e=>e.getBoundingClientRect().top);
  const beforePreference=await linkTop();
  await live.emulateMedia({reducedMotion:'reduce'});await live.waitForTimeout(500);
  const reducedTop=await linkTop();
  await live.emulateMedia({reducedMotion:'no-preference'});await live.waitForTimeout(500);
  const fullTop=await linkTop();
  assert(Math.abs(beforePreference-reducedTop)<32&&Math.abs(beforePreference-fullTop)<32,'Preference loses next case');
  results.push({mode:'live-lifecycle',lifecycle,nextPreference:{beforePreference,reducedTop,fullTop}});
  await liveContext.close();
} finally {
  writeFileSync(`${out}/verification.json`, JSON.stringify(results,null,2));
  await browser.close();
}
console.log(`Verified ${results.length} viewport/mode combinations; screenshots + four recordings in ${out}`);
