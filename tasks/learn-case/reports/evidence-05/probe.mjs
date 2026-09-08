import {fixture,check,ab,ev,dir} from './browser.mjs'
import {writeFileSync} from 'node:fs'
const s=fixture('marina-passed','/my')
try { check('RU fixture in EN personal space',['ООО Учебный пример']) } catch(e) {console.log(e.message)}
ab('open',`http://127.0.0.1:5174/certificate?documentId=${s.certificates[0].id}&lang=en`)
try { check('RU fixture certificate',['ООО Учебный пример']) } catch(e) {console.log(e.message)}
const source={session:{name:'Материал',company:'Каталог',identifier:'test@example.test'}}
const result=ev(`(async()=>{const m=await import('/src/i18n/index.ts');return m.localizeSaved(${JSON.stringify(source)})})()`)
writeFileSync(`${dir}before-user-data.json`,JSON.stringify({source,result},null,2))
console.log(JSON.stringify(result))
ab('close')
