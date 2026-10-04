import {browser,serve,source} from './source-runtime.mjs';
import {filmScenario} from '../../../scripts/lib/dssl-film.mjs';
import {writeFileSync} from 'node:fs';
const app=await serve(source+'/dist',true),b=await browser(),steps=[],errors=[];
const compact=state=>state?({specification:{fileName:state.specification.fileName,status:state.specification.status,lineCount:state.specification.lines.length,line38:state.specification.lines.find(l=>l.row===38)},cart:{lineCount:state.cart.lines.length,line38:state.cart.lines.find(l=>l.sourceRow===38)},latestOrder:{id:state.orders[0]?.id,lineCount:state.orders[0]?.lineCount,composition:state.orders[0]?.composition}}):null;
try{
 const c=await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
 await p.goto(app.base+'/b2b/',{waitUntil:'networkidle'});
 const act={
  step:async name=>{steps.push({name,url:p.url(),state:compact(await p.evaluate(()=>JSON.parse(sessionStorage.getItem('b2b-dssl.state.v1'))))});console.log(name);},
  pause:async()=>p.waitForTimeout(70),settle:async()=>p.waitForTimeout(200),
  click:async el=>{if((await el.innerText()).trim()==='Apply to line 38')await p.getByRole('radio').nth(1).click();await el.click();},type:async text=>p.keyboard.type(text),pressKey:async key=>p.keyboard.press(key),
  setFiles:async(trigger,file)=>{const chooser=p.waitForEvent('filechooser');await trigger.click();await(await chooser).setFiles(file);},
 };
 await filmScenario(p,act,{locale:'en'});
 const state=await p.evaluate(()=>JSON.parse(sessionStorage.getItem('b2b-dssl.state.v1')));
 const body=await p.locator('body').innerText();
 steps.push({name:'final-order',url:p.url(),state:compact(state),body});
 if(!p.url().includes('/orders/details')||state.specification.lines.length||state.cart.lines.length||state.orders[0].composition.some(l=>Object.keys(l).some(k=>!['sku','quantity'].includes(k))))throw Error('Order completion boundary differs');
 await c.close();
}finally{await b.close();await app.close();writeFileSync('tasks/portfolio-rebuild/partner-portal/order-verification.json',JSON.stringify({sourceVersion:'722b5c6d06a9ddcdc8bb813f84c60d0cac2e07e9',method:'native controls through existing filmScenario; pauses shortened, no storage writes',steps,errors},null,2));}
if(errors.length)throw Error('Product runtime errors');
