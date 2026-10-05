import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const vet=process.argv[2]??'http://127.0.0.1:5261';
const pawly=process.argv[3]??'http://127.0.0.1:5173';
const manifest=JSON.parse(await readFile('D:/Claude-projects/PETS-walking/audit/product-polish/evidence/06-case/media-manifest.json','utf8'));
const report={vet,pawly,checks:[],errors:[]};
await mkdir('tmp/ui-cleanup',{recursive:true});
try {
  for(const locale of ['en','ru']) for(const width of [360,390,768,820,1024,1440]) {
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    page.on('pageerror',error=>report.errors.push(error.message));
    const prefix=locale==='ru'?'/ru':'';
    for(const route of ['visit-record','invoice-draft']) {
      await page.goto(`${vet}${prefix}/app/${route}?patient=marsik`,{waitUntil:'networkidle'});
      const rules=await page.evaluate(route=>{
        const css=node=>getComputedStyle(node);
        const header=document.querySelector('[class*="_visitHeader_"]');
        const facts=document.querySelector('[class*="_traceFacts_"]');
        const rows=[...document.querySelectorAll('[class*="_invoiceItems_"] > [role="row"]')];
        return {route,headerBottom:header?css(header).borderBottomWidth:null,factsTop:facts?css(facts).borderTopWidth:null,lastFactBottom:facts?css(facts.lastElementChild).borderBottomWidth:null,lastInvoiceBottom:rows.length?css(rows.at(-1)).borderBottomWidth:null};
      },route);
      if(route==='visit-record'&&(rules.headerBottom!=='0px'||rules.factsTop!=='1px'||rules.lastFactBottom!=='0px')) throw Error(`Vet rules ${locale}@${width}: ${JSON.stringify(rules)}`);
      if(route==='invoice-draft'&&rules.lastInvoiceBottom!=='0px') throw Error(`Invoice ${locale}@${width}: ${JSON.stringify(rules)}`);
      report.checks.push({app:'vet',locale,width,...rules});
    }
    const fixture=structuredClone(manifest.fixture);
    const complete=manifest.records.find(record=>record.name==='order-details'&&record.locale===locale);
    fixture.booking=structuredClone(complete.booking);fixture.earnings=structuredClone(complete.earnings);
    await page.goto(`${pawly}${prefix}/app/order-details`,{waitUntil:'networkidle'});
    await page.evaluate(data=>localStorage.setItem('pawly-wire-data-v4',JSON.stringify(data)),fixture);
    await page.reload({waitUntil:'networkidle'});
    const geometry=await page.locator('article').first().evaluate(node=>{
      const footer=node.querySelector('footer');
      const section=footer.previousElementSibling;
      return {position:getComputedStyle(footer).position,border:getComputedStyle(footer).borderTopWidth,top:footer.getBoundingClientRect().top,bottom:section.getBoundingClientRect().bottom,text:section.textContent};
    });
    if(geometry.position!=='static'||geometry.border!=='0px'||geometry.top<geometry.bottom-1||!geometry.text.includes(locale==='ru'?'не подключены':'not live')) throw Error(`Pawly overlap ${locale}@${width}: ${JSON.stringify(geometry)}`);
    report.checks.push({app:'pawly',locale,width,...geometry});
    if(width===390) {
      await page.screenshot({path:`tmp/ui-cleanup/${vet.includes('127.0.0.1')?'local':'production'}-pawly-${locale}.png`,fullPage:true});
      // A button-only footer remains sticky.
      fixture.booking.dropoffComplete=false;fixture.booking.status='active';
      await page.evaluate(data=>localStorage.setItem('pawly-wire-data-v4',JSON.stringify(data)),fixture);
      await page.goto(`${pawly}${prefix}/app/active-service`,{waitUntil:'networkidle'});
      const footer=page.locator('article > footer').first();
      if(await footer.count()&&await footer.evaluate(node=>getComputedStyle(node).position)!=='sticky') throw Error('Action-only footer changed');
    }
    await page.close();
  }
}catch(error){report.errors.push(error.message);}
finally{await browser.close();}
await writeFile(`tmp/ui-cleanup/${vet.includes('127.0.0.1')?'local':'production'}-prototypes.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify({checks:report.checks.length,errors:report.errors},null,2));
if(report.errors.length)process.exitCode=1;
