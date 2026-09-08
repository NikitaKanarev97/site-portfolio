import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
export const dir = fileURLToPath(new URL('.', import.meta.url))
export const locale = process.argv[2] || 'en'
export const width = Number(process.argv[3] || 1440)
const cli = 'C:/Users/kanar/AppData/Local/npm-cache/_npx/6de2aa2fded2970c/node_modules/agent-browser/bin/agent-browser.js'
const suffix = process.argv[4] ? '-'+process.argv[4] : ''
const log = `${dir}${locale}-${width}${suffix}.log`
writeFileSync(log, '')
export function ab(...args) {
  const r = spawnSync(process.execPath, [cli, '--session', `learn05-${locale}-${width}`, ...args], {encoding:'utf8',timeout:30000})
  appendFileSync(log, `\n> ${args.join(' ')}\n${r.stdout || ''}${r.stderr || ''}`)
  if(r.status !== 0 || /✗/.test(r.stdout)) throw Error(r.stderr || r.stdout)
  return r.stdout.trim()
}
export const pick = (en,ru) => locale === 'en' ? en : ru
export const ev = code => JSON.parse(ab('eval', code))
export const state = () => ev('JSON.parse(sessionStorage.getItem("learn-prototype-v1"))')
export const open = path => ab('open',`http://127.0.0.1:5174${path}${path.includes('?')?'&':'?'}lang=${locale}`)
export function click(role,name) {
  const lines = ab('snapshot','-i').split('\n')
  const line = lines.find(l=>l.includes(`${role} "${name}"`)) ?? lines.find(l=>l.includes(`${role} "${name}`))
  if(!line) throw Error(`Missing ${role} ${name}`)
  ab('click','@'+line.match(/ref=(e\d+)/)[1])
}
export function fixture(name, path, modify = v=>v) {
  const data = modify(JSON.parse(readFileSync(`D:/Claude-projects/learn/audit/product-polish/evidence/07/state-${name}.json`,'utf8')))
  ev(`sessionStorage.clear();sessionStorage.setItem('learn-prototype-v1',${JSON.stringify(JSON.stringify(data))});true`)
  open(path)
  return data
}
export const checks=[]
export function check(name,allowCyrillic=[]) {
  const data=ev(`({url:location.href,lang:document.documentElement.lang,text:document.body.innerText,width:innerWidth,scroll:document.documentElement.scrollWidth,mode:document.querySelector('[data-content-mode]')?.getAttribute('data-content-mode')})`)
  const residual=allowCyrillic.reduce((t,s)=>t.replaceAll(s,''),data.text)
  const errors=ab('errors')
  checks.push({name,...data,cyrillic:residual.match(/[^\n]*[А-Яа-яЁё][^\n]*/g),errors})
  writeFileSync(`${dir}${locale}-${width}${suffix}.json`,JSON.stringify(checks,null,2))
  if(data.scroll>data.width || data.lang!==locale || errors || (locale==='en' && /[А-Яа-яЁё]/.test(residual))) throw Error(`Failed ${name}: ${JSON.stringify(checks.at(-1).cyrillic)}`)
  console.log(`PASS ${locale} ${width} ${name}`)
  return data
}
export function assert(value,message) { if(!value) throw Error(message) }
export const shot = name => ab('screenshot',`${dir}${locale}-${width}-${name}.png`)
open('/home')
ab('set','viewport',String(width),'1000')
