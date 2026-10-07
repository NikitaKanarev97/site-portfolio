import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const {chromium}=require('playwright');
const folder=dirname(fileURLToPath(import.meta.url));
const verify=process.argv.includes('--verify')||process.argv.includes('--verify-last');
const last=process.argv.includes('--last')||process.argv.includes('--verify-last');
const choices={
  '/work/agent-ops-console/':{'Review the agent’s promises':['Review promises','Check each claim','Check agent promises']},
  '/ru/work/agent-ops-console/':{
    'Обещание требует подтверждения':['Нужны факты','Есть факт для проверки'],
    'Проверять обещания агента':['Проверка слов','Слова агента под контролем','Что агент обещал людям'],
    'Выплату одобряет человек':['Нужно одобрение','Деньги ждут','Решает человек'],
    'Прототип принят':['Клиент принял','Работа принята','Всё принято'],
  },
  '/work/partner-portal/':{'Import and manual entry feed a shared specification':['Import and entry share a list','A shared list','One working list']},
  '/ru/work/partner-portal/':{
    'Коммерческий редизайн выпущен':['Редизайн выпущен','Всё выпущено','Работа выпущена'],
    'Состояние подсказывает следующий шаг':['Следующий шаг','Статус и шаг','Статус ведёт к действию'],
  },
  '/work/learn/':{'Show the answer before asking for trust':['See the answer first','Read the answer first','An answer before sign-in']},
  '/ru/work/learn/':{
    'Справочник и программа связаны':['Общий контент','Ответ ведёт в программу','Оба пути к ответу'],
    'Справочник и программа используют общий материал':['Контент для двух задач','Один ответ для двух задач','Общий материал'],
    'Завершение нужно подтвердить':['Завершить урок','Завершить шаг','Урок готов'],
  },
  '/work/vet-clinic/':{
    'Publication preserves the owner’s copy':['Publish a stable copy','The owner keeps a copy','A saved copy for the owner'],
    'The visit connects all three roles':['The roles stay linked','A visit across three roles','The visit links three roles'],
  },
  '/ru/work/vet-clinic/':{
    'След за время паузы':['След в паузе','Запись в паузе','Запись за 30 секунд'],
    'Публикация сохраняет выписку владельца':['У семьи своя копия','У владельца своя копия'],
    'Результаты приёма доступны трём ролям':['Роли связаны','Итог для всех ролей','Три роли ведут приём'],
  },
  '/ru/work/pawly/':{
    'За прогулку начислено 779 рублей':['779 ₽ за выгул','За выгул 779 ₽','Одно начисление'],
    'Цепочка, которую можно проверить':['Факты видны','Всё видно','Все шаги видны'],
  },
};
if(last) {
  for(const route of Object.keys(choices)) delete choices[route];
  Object.assign(choices,{
    '/ru/work/agent-ops-console/':{'Клиент принял':['Работа принята']},
    '/ru/work/partner-portal/':{'Всё выпущено':['Редизайн сдан','Портал выпущен']},
    '/ru/work/learn/':{'Контент для двух задач':['Общий материал'],'Общий контент':['Два пути к ответу','Общий материал']},
    '/ru/work/vet-clinic/':{'У семьи своя копия':['Владелец видит копию','Копия для владельца','У владельца своя копия']},
  });
}
if(verify) {
  const selected=JSON.parse(readFileSync(join(folder,last?'B-wrap-last.json':'B-wrap.json'),'utf8'));
  for(const row of selected) choices[row.route]=Object.fromEntries(Object.values(row.headings).map(value=>[value.selected,[value.selected]]));
}
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const results=[];
try {
  for (const [route,headings] of Object.entries(choices)) {
    const row={route,headings:{}};
    for(const [old,candidates] of Object.entries(headings)) row.headings[old]={candidates,measurements:[]};
    for(const width of [1440,360]) {
      const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
      await page.goto('http://127.0.0.1:4410'+route,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      const measured=await page.evaluate(({headings,verify})=>{
        const output={};
        const typeset=text=>{
          const short=/(^|[\s(«“"—])(в|во|и|а|к|ко|с|со|у|о|об|на|не|ни|по|из|за|от|до|но|для|при|без|под|над|что|как|или|это|a|an|the|I|of|to|in|on|at|by)[ ](?=\S)/gi;
          let out=text.replace(short,'$1$2\u00a0').replace(short,'$1$2\u00a0').replace(/[ ](—|–)(?=\s)/g,'\u00a0$1');
          const trimmed=out.trim(),words=trimmed.split(/\s+/).length;
          if(trimmed.length<=70&&words>=4) out=out.replace(/((?:[^\s]+ )*[^\s]+)[ ]([^\s]{1,12})(\s*)$/,(all,before,end,tail)=>words>4||before.length+1+end.length<=14?before+'\u00a0'+end+tail:all);
          return out;
        };
        for(const [old,candidates] of Object.entries(headings)) {
          const normalize=text=>text.replace(/[\s\u00a0]+/g,' ').trim();
          const el=[...document.querySelectorAll('[data-h="thesis"]')].find(el=>normalize(el.textContent)===normalize(old));
          if(!el) throw new Error('Missing heading '+old);
          output[old]=candidates.map(candidate=>{
            if(!verify) el.textContent=typeset(candidate);
            const lines=new Map(),walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
            for(let node=walker.nextNode();node;node=walker.nextNode()) for(const m of node.data.matchAll(/\S+/g)) {
              const range=document.createRange(); range.setStart(node,m.index); range.setEnd(node,m.index+m[0].length);
              const rect=range.getClientRects()[0]; if(!rect) continue;
              const key=Math.round(rect.top/4);
              lines.set(key,[...(lines.get(key)||[]),m[0]]);
            }
            const all=[...lines.values()];
            return {candidate,lines:all,hidden:!all.length,pass:(all.length<=1||all.every(l=>l.length>1))&&el.scrollWidth<=el.clientWidth+1};
          });
          if(!verify) el.textContent=old;
        }
        return output;
      },{headings,verify});
      for(const [old,values] of Object.entries(measured)) row.headings[old].measurements.push({width,values});
      await page.close();
    }
    for(const value of Object.values(row.headings)) value.selected=value.candidates.find(candidate=>value.measurements.every(m=>m.values.find(v=>v.candidate===candidate).pass))??null;
    results.push(row);
  }
} finally {await browser.close();}
writeFileSync(join(folder,verify?(last?'B-wrap-last-final.json':'B-wrap-final.json'):last?'B-wrap-last.json':'B-wrap.json'),JSON.stringify(results,null,2));
if(verify) {
  const failures=results.flatMap(row=>Object.entries(row.headings).filter(([,value])=>!value.selected).map(([text])=>({route:row.route,text})));
  console.log(failures.length?JSON.stringify(failures):`PASS: ${results.reduce((n,row)=>n+Object.keys(row.headings).length,0)} changed headings on ${results.length} routes at 1440/360, including production typography. No solitary word lines or local text overflow.`);
  if(failures.length) process.exitCode=1;
} else for(const row of results) for(const [old,value] of Object.entries(row.headings)) console.log(`${row.route}: ${old} => ${value.selected??'NO FIT'}`);
