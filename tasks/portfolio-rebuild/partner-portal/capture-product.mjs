import {browser,serve,source} from './source-runtime.mjs';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const task='tasks/portfolio-rebuild/partner-portal';
const out='public/media/rebuild/partner-portal';mkdirSync(out,{recursive:true});mkdirSync(task+'/shots',{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const common=JSON.parse(readFileSync('tasks/portfolio-rebuild/common/captures.json'));
const verified=common.sources.map(s=>({...s,identical:sha(readFileSync(s.file))===s.sha256}));
if(verified.some(s=>!s.identical))throw Error('Accepted catalog sources drifted from A');
const sourceFiles=['ds/components.md','ds/DECISIONS.md','ia/sitemap.md','ia/flows/xls-to-order.mmd','src/data/types.ts','src/data/store.tsx','src/data/specification-lines.ts','src/screens/resolution-center/ResolutionCenter.tsx','src/screens/cart/Cart.tsx','src/screens/order-details/OrderDetails.tsx','src/tokens/primitives.css','src/tokens/semantics.css','src/tokens/typography.css','src/components/FulfillmentPlan/FulfillmentPlan.tsx','src/components/FulfillmentPlan/FulfillmentPlan.stories.tsx','dist/index.html','storybook-static/index.json'];
writeFileSync(task+'/sources.json',JSON.stringify({version:'722b5c6d06a9ddcdc8bb813f84c60d0cac2e07e9',commonVerification:verified,sources:sourceFiles.map(file=>({file:source+'/'+file,sha256:sha(readFileSync(source+'/'+file))}))},null,2));
const app=await serve(source+'/dist',true),catalog=await serve(source+'/storybook-static');
const b=await browser();const captures=[],trace=[];
async function capture(page,node,name,meta,alpha=false){
 await node.evaluate(el=>el.scrollIntoView({block:'center',inline:'nearest'}));await page.waitForTimeout(120);await page.evaluate(()=>document.fonts.ready);
 const bounds=await node.boundingBox();if(!bounds)throw Error(name+' absent');
 const bleed=alpha?2:0;
 const bytes=await sharp(await page.screenshot({omitBackground:alpha,clip:{x:Math.max(0,bounds.x-bleed),y:Math.max(0,bounds.y-bleed),width:bounds.width+2*bleed,height:bounds.height+2*bleed}})).webp({quality:94}).toBuffer();
 writeFileSync(out+'/'+name+'.webp',bytes);const dims=await sharp(bytes).metadata();
 const selector=meta.story?'#storybook-root > * (first)':meta.id==='portal-line-open'?'[data-flip] filtered by a descendant [role="radiogroup"] (first)':meta.id==='portal-line-confirmed'?'[data-flip] filtered by text Row 38 (first)':'[data-slot="product-row"] filtered by text source row 38 (first)';
 captures.push({file:'/media/rebuild/partner-portal/'+name+'.webp',...meta,selector,width:dims.width,height:dims.height,sha256:sha(bytes),text:await node.innerText()});console.log(name,dims.width,dims.height);
}
try{
 for(const [family,state] of [['resolutionrow','changed'],['fulfillmentplan','default'],['fulfillmentplan','selected'],['fulfillmentplan','unavailable']]){
  const c=await b.newContext({viewport:{width:292,height:1200},deviceScaleFactor:2,reducedMotion:'reduce'}),p=await c.newPage();
  const id=`components-domain-${family}--${state}`;await p.goto(catalog.base+'/iframe.html?id='+id+'&viewMode=story',{waitUntil:'networkidle'});
  await p.waitForFunction(()=>document.querySelector('#storybook-root')?.children.length>0);
  const canvas=await p.evaluate(()=>getComputedStyle(document.body).backgroundColor);
  await p.addStyleTag({content:'html,body,#storybook-root{margin:0!important;background:transparent!important}html,#storybook-root{padding:0!important}body{padding:2px!important}#storybook-root>.flex{width:100%!important}'});
  const node=p.locator('#storybook-root > *').first();
  await node.evaluate((el,canvas)=>{const root=el.hasAttribute('data-slot')?el:el.querySelector('[data-slot]');if(!root)throw Error('Missing component');if(getComputedStyle(root).backgroundColor==='rgba(0, 0, 0, 0)')root.style.backgroundColor=canvas;for(const chrome of [document.documentElement,document.body,document.querySelector('#storybook-root')])chrome.style.setProperty('background','transparent','important');},canvas);
  await capture(p,node,family+'-'+state+'-288',{id:'portal-'+family+'-'+state,story:id,viewport:{width:292,height:1200},dpr:2,locale:'en',fixture:'canonical accepted CSF args',componentWidth:288,bleed:2},true);await c.close();
 }
 for(const width of [1440,390]){
  const c=await b.newContext({viewport:{width,height:width===1440?1100:1400},deviceScaleFactor:2,reducedMotion:'reduce'}),p=await c.newPage();
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(app.base+'/b2b/resolution-center',{waitUntil:'networkidle'});
  if(process.argv.includes('--inspect')){writeFileSync(task+'/inspect.txt',await p.locator('body').innerText());await p.screenshot({path:task+'/shots/source-inspect-'+width+'.png',fullPage:true});console.log(await p.locator('body').innerText());break;}
  const search=p.getByPlaceholder('Search source or matched product');
  // Filtering the actual screen is a native product action, not fixture rewriting.
  console.log('placeholders',await p.locator('input').evaluateAll(es=>es.map(e=>e.placeholder)));
  await search.fill('камера 4мп уличная');
  let row=p.locator('[data-flip]').filter({hasText:'Row 38'}).first();
  await row.getByRole('button',{name:'Choose',exact:true}).click();
  await p.locator('[data-slot="decision-panel"]').waitFor();
  row=p.locator('[data-flip]').filter({has:p.locator('[role="radiogroup"]')}).first();
  const variant=width===1440?'wide':'narrow';
  await capture(p,row,'line-open-'+variant,{id:'portal-line-open',route:'/b2b/resolution-center',viewport:{width,height:width===1440?1100:1400},dpr:2,locale:'en',fixture:'office_north_v8.xlsx · row 38 · original 8 pcs'});
  await row.getByRole('radio').nth(1).click();
  console.log('panel buttons',await row.locator('[data-slot="decision-panel"] button').allTextContents());
  await row.getByRole('button',{name:'Apply to line 38',exact:true}).click();
  await p.getByRole('tab',{name:/Resolved/}).click();
  row=p.locator('[data-flip]').filter({hasText:'Row 38'}).first();
  await capture(p,row,'line-confirmed-'+variant,{id:'portal-line-confirmed',route:'/b2b/resolution-center',viewport:{width,height:width===1440?1100:1400},dpr:2,locale:'en',fixture:'same row 38, buyer chose second candidate'});
  const state=await p.evaluate(()=>JSON.parse(sessionStorage.getItem('b2b-dssl.state.v1')));
  trace.push({width,at:'after-native-choice',line:state.specification.lines.find(l=>l.row===38),errors});
  await p.evaluate(()=>window.scrollTo(0,0));
  const contextBytes=await sharp(await p.screenshot()).webp({quality:94}).toBuffer();
  const contextName='resolution-context-'+variant;
  writeFileSync(out+'/'+contextName+'.webp',contextBytes);
  const contextDims=await sharp(contextBytes).metadata();
  captures.push({file:'/media/rebuild/partner-portal/'+contextName+'.webp',id:'portal-application',route:'/b2b/resolution-center',viewport:{width,height:width===1440?1100:1400},dpr:2,locale:'en',fixture:'same row 38, filtered resolved view after buyer choice',selector:'viewport after same resolved-row filter',width:contextDims.width,height:contextDims.height,sha256:sha(contextBytes)});
  // Resolve the remaining six exceptions through their own product panels.
  await search.fill('');await p.getByRole('tab',{name:/Need review/}).click();
  for(let i=0;i<8;i++){
   const next=p.getByRole('button',{name:'Continue to cart',exact:true});if(await next.isEnabled())break;
   await p.locator('[data-slot="resolution-row"] button').first().click();
   const panel=p.locator('[data-slot="decision-panel"]');await panel.waitFor();
   const radios=panel.getByRole('radio');if(await radios.count())await radios.first().click();
   const qty=panel.locator('input[inputmode="numeric"]');if(await qty.count())await qty.fill('4');
   await panel.getByRole('button',{name:/Apply to line|Confirm replacement/}).click();
  }
  await p.getByRole('button',{name:'Continue to cart',exact:true}).click();await p.waitForURL(/\/cart/);
  console.log('cart inputs',await p.locator('input').evaluateAll(es=>es.map(e=>e.placeholder)));
  const cartrow=p.locator('[data-slot="product-row"]').filter({hasText:'source row 38'}).first();
  await capture(p,cartrow,'line-cart-'+variant,{id:'portal-line-cart',route:'/b2b/cart',viewport:{width,height:width===1440?1100:1400},dpr:2,locale:'en',fixture:'same row 38, chosen SKU, quantity 8'});
  trace.push({width,at:'cart',text:await cartrow.innerText(),errors});await c.close();
 }
}finally{await b.close();await app.close();await catalog.close();writeFileSync(task+'/captures.json',JSON.stringify({generated:'2026-10-04',sourceVersion:'722b5c6d06a9ddcdc8bb813f84c60d0cac2e07e9',sourceHashes:'sources.json',captures,trace},null,2));}
