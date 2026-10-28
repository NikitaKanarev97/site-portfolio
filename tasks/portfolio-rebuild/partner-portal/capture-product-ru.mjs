/* Russian twin of capture-product.mjs, 28.10.2026: the same states, rows and
   viewports, shot through the product's own Russian layer — `/b2b/ru/…` in the
   app and `globals=locale:ru` in the catalog. Output goes into `ru/` beside the
   English files, so the English case keeps its frames byte for byte. */
import {browser,serve,source} from './source-runtime.mjs';
import {writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const task='tasks/portfolio-rebuild/partner-portal';
const outs={portal:'public/media/rebuild/partner-portal/ru',common:'public/media/rebuild/common/portal/ru'};
for(const dir of Object.values(outs))mkdirSync(dir,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const app=await serve(source+'/dist',true),catalog=await serve(source+'/storybook-static');
const b=await browser();const captures=[];
// The overlay rewrites text after React commits; let it settle before a frame.
const settle=async p=>{await p.waitForTimeout(350);await p.evaluate(()=>document.fonts.ready);};
async function clearToasts(page){
 for(let i=0;i<20;i++){const close=page.getByRole('button',{name:'Закрыть уведомление'});if(!await close.count())return;await close.first().click().catch(()=>{});await page.waitForTimeout(250);}
 throw Error('toasts keep coming');
}
async function capture(page,node,dir,name,meta,alpha=false){
 // A toast repeats a fact already on screen and would cover the row; close it as a user would.
 await clearToasts(page);
 await node.evaluate(el=>el.scrollIntoView({block:'center',inline:'nearest'}));await settle(page);
 const bounds=await node.boundingBox();if(!bounds)throw Error(name+' absent');
 const bleed=alpha?2:0;
 const bytes=await sharp(await page.screenshot({omitBackground:alpha,clip:{x:Math.max(0,bounds.x-bleed),y:Math.max(0,bounds.y-bleed),width:bounds.width+2*bleed,height:bounds.height+2*bleed}})).webp({quality:94}).toBuffer();
 writeFileSync(outs[dir]+'/'+name+'.webp',bytes);const dims=await sharp(bytes).metadata();
 const text=await node.innerText();
 captures.push({file:'/'+outs[dir].replace(/^public\//,'')+'/'+name+'.webp',...meta,locale:'ru',width:dims.width,height:dims.height,sha256:sha(bytes),text});
 console.log(name,dims.width,dims.height);
 return text;
}
try{
 const specimens=[['common','resolutionrow','ambiguous'],['common','resolutionrow','confirmed-from-ambiguous'],['common','availability','verified'],['common','availability','not-confirmed'],
  ['portal','fulfillmentplan','selected'],['portal','fulfillmentplan','unavailable']];
 for(const [dir,family,state] of specimens){
  const c=await b.newContext({viewport:{width:292,height:1200},deviceScaleFactor:2,reducedMotion:'reduce'}),p=await c.newPage();
  const id=`components-domain-${family}--${state}`;await p.goto(catalog.base+'/iframe.html?id='+id+'&viewMode=story&globals=locale:ru',{waitUntil:'networkidle'});
  await p.waitForFunction(()=>document.querySelector('#storybook-root')?.children.length>0);
  const canvas=await p.evaluate(()=>getComputedStyle(document.body).backgroundColor);
  await p.addStyleTag({content:'html,body,#storybook-root{margin:0!important;background:transparent!important}html,#storybook-root{padding:0!important}body{padding:2px!important}#storybook-root>.flex{width:100%!important}'});
  const node=p.locator('#storybook-root > *').first();
  await node.evaluate((el,canvas)=>{const root=el.hasAttribute('data-slot')?el:el.querySelector('[data-slot]');if(!root)throw Error('Missing component');if(getComputedStyle(root).backgroundColor==='rgba(0, 0, 0, 0)')root.style.backgroundColor=canvas;for(const chrome of [document.documentElement,document.body,document.querySelector('#storybook-root')])chrome.style.setProperty('background','transparent','important');},canvas);
  const text=await capture(p,node,dir,family+'-'+state+'-288',{id:'portal-'+family+'-'+state,story:id,viewport:{width:292,height:1200},dpr:2,fixture:'canonical accepted CSF args',componentWidth:288,bleed:2},true);
  if(/[A-Za-z]{4,}/.test(text.replace(/KX-[\w-]+|Moscow DC|WMS|PoE|IP\d+|SKU|DC|MP/g,'')))console.warn('  latin left:',text.replace(/\n/g,' | '));
  await c.close();
 }
 for(const width of [1440,390]){
  const viewport={width,height:width===1440?1100:1400};
  const c=await b.newContext({viewport,deviceScaleFactor:2,reducedMotion:'reduce'}),p=await c.newPage();
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(app.base+'/b2b/ru/resolution-center',{waitUntil:'networkidle'});await settle(p);
  const search=p.getByPlaceholder('Поиск по исходной строке или товару');
  await search.fill('камера 4мп уличная');await settle(p);
  let row=p.locator('[data-flip]').filter({hasText:'Строка 38'}).first();
  await row.getByRole('button',{name:'Выбрать',exact:true}).click();
  await p.locator('[data-slot="decision-panel"]').waitFor();
  row=p.locator('[data-flip]').filter({has:p.locator('[role="radiogroup"]')}).first();
  const variant=width===1440?'wide':'narrow';
  await capture(p,row,'portal','line-open-'+variant,{id:'portal-line-open',route:'/b2b/ru/resolution-center',viewport,dpr:2,fixture:'office_north_v8.xlsx · row 38 · original 8 pcs'});
  await row.getByRole('radio').nth(1).click();
  await row.getByRole('button',{name:'Применить к строке 38',exact:true}).click();
  await p.getByRole('tab',{name:/Разобрано/}).click();
  row=p.locator('[data-flip]').filter({hasText:'Строка 38'}).first();
  await capture(p,row,'portal','line-confirmed-'+variant,{id:'portal-line-confirmed',route:'/b2b/ru/resolution-center',viewport,dpr:2,fixture:'same row 38, buyer chose second candidate'});
  await clearToasts(p);
  await p.evaluate(()=>window.scrollTo(0,0));await settle(p);
  const contextBytes=await sharp(await p.screenshot()).webp({quality:94}).toBuffer();
  writeFileSync(outs.portal+'/resolution-context-'+variant+'.webp',contextBytes);
  const contextDims=await sharp(contextBytes).metadata();
  captures.push({file:'/media/rebuild/partner-portal/ru/resolution-context-'+variant+'.webp',id:'portal-application',route:'/b2b/ru/resolution-center',viewport,dpr:2,locale:'ru',width:contextDims.width,height:contextDims.height,sha256:sha(contextBytes)});
  console.log('resolution-context-'+variant,contextDims.width,contextDims.height);
  await search.fill('');await p.getByRole('tab',{name:/Нужен разбор/}).click();await settle(p);
  for(let i=0;i<8;i++){
   const next=p.getByRole('button',{name:'Перейти в корзину',exact:true});if(await next.isEnabled())break;
   await p.locator('[data-slot="resolution-row"] button').first().click();
   const panel=p.locator('[data-slot="decision-panel"]');await panel.waitFor();await settle(p);
   const radios=panel.getByRole('radio');if(await radios.count())await radios.first().click();
   const qty=panel.locator('input[inputmode="numeric"]');if(await qty.count())await qty.fill('4');
   await panel.getByRole('button',{name:/Применить к строке|Подтвердить замену/}).click();await settle(p);
  }
  await p.getByRole('button',{name:'Перейти в корзину',exact:true}).click();await p.waitForURL(/\/cart/);await settle(p);
  const cartrow=p.locator('[data-slot="product-row"]').filter({hasText:'исходная строка 38'}).first();
  await capture(p,cartrow,'portal','line-cart-'+variant,{id:'portal-line-cart',route:'/b2b/ru/cart',viewport,dpr:2,fixture:'same row 38, chosen SKU, quantity 8'});
  if(errors.length)console.warn('page errors',errors);
  await c.close();
 }
}finally{await b.close();await app.close();await catalog.close();writeFileSync(task+'/captures-ru.json',JSON.stringify({generated:'2026-10-28',locale:'ru',captures},null,2));}
