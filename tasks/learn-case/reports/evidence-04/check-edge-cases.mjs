import { spawnSync } from 'node:child_process'
import { writeFileSync, appendFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const locale = process.argv[2] || 'en'
const dir = fileURLToPath(new URL('.', import.meta.url))
const log = `${dir}${locale}-edges.log`
const cli = 'C:/Users/kanar/AppData/Local/npm-cache/_npx/6de2aa2fded2970c/node_modules/agent-browser/bin/agent-browser.js'
writeFileSync(log, '')
function ab(...args) {
  const r = spawnSync(process.execPath, [cli, '--session', `learn04-edge-${locale}`, ...args], { encoding: 'utf8', timeout: 30000 })
  appendFileSync(log, `\n> ${args.join(' ')}\n${r.stdout || ''}${r.stderr || ''}`)
  if (r.status !== 0 || /✗/.test(r.stdout)) throw Error(r.stderr || r.stdout)
  return r.stdout.trim()
}
const pick = (en, ru) => locale === 'en' ? en : ru
function ref(role, name, last = false) {
  const rows = ab('snapshot', '-i').split('\n').filter(l => l.includes(`${role} "${name}`))
  if (!rows.length) throw Error(`Missing ${name}`)
  return '@' + (last ? rows.at(-1) : rows[0]).match(/ref=(e\d+)/)[1]
}
const click = (role, name, last) => ab('click', ref(role, name, last))
const fill = (name, text) => ab('fill', ref('textbox', name), text)
const checks = []
function check(name) {
  const data = JSON.parse(JSON.parse(ab('eval', 'JSON.stringify({url:location.href,lang:document.documentElement.lang,text:document.body.innerText,width:innerWidth,scroll:document.documentElement.scrollWidth,cyrillic:document.body.innerText.match(/[^\\n]*[А-Яа-яЁё][^\\n]*/g),clippedControls:[...document.querySelectorAll("button,a")].filter(e=>e.getClientRects().length).filter(e=>{const r=e.getBoundingClientRect();return r.left<0||r.right>innerWidth+1||e.scrollWidth>e.clientWidth+2}).map(e=>e.textContent)})')))
  const errors = ab('errors')
  checks.push({name,...data,errors})
  writeFileSync(`${dir}${locale}-edges.json`, JSON.stringify(checks,null,2))
  if (data.lang !== locale || data.scroll > data.width || errors || (locale === 'en' && data.cyrillic) || data.clippedControls.length) throw Error(`Failed ${name}`)
  console.log(`PASS ${locale}: ${name}`)
  return data
}
try {
  ab('open', `http://127.0.0.1:5174/catalog?all=1&lang=${locale}`)
  ab('set','viewport','375','1000')
  for (let n=0;n<6;n++) click('button',pick('Show more:','Показать ещё '))
  const all = check('all 31 resources visible')
  if (!all.text.includes(pick('Resources shown: 31','Показано материалов: 31'))) throw Error('Not all resources shown')
  click('button',pick('Filters ·','Фильтры ·'))
  click('button',pick('Hardware','Оборудование'))
  click('button',pick('Show results ·','Показать результаты ·'))
  const hardware = check('canonical hardware product')
  if (new URL(hardware.url).searchParams.get('product') !== 'Оборудование') throw Error('Product not canonical')
  ab('open',`http://127.0.0.1:5174/catalog?theme=${encodeURIComponent('Аналитика')}&version=4.1&lang=${locale}`)
  const zero = check('zero filter intersection')
  if (!zero.text.includes(pick('Resources: 0','Материалы: 0'))) throw Error('Not zero')
  click('button',pick('Remove version: 4.1','Снять версию: 4.1'))
  const recovered = check('remove only conflicting filter')
  if (new URL(recovered.url).searchParams.get('theme') !== 'Аналитика' || new URL(recovered.url).searchParams.has('version')) throw Error('Recovery lost theme')
  ab('open',`http://127.0.0.1:5174/history?source=stage04&lang=${locale}`)
  const gated = check('protected history redirects to login')
  const target = new URL(gated.url).searchParams.get('returnTo')
  if (!target?.startsWith('/history?source=stage04')) throw Error('Gate lost return query')
  fill(pick('Work email or phone','Рабочая почта или телефон'),'navigation.demo@example.test')
  click('button',pick('Sign in with an SMS code','Войти по коду из SMS'))
  check('new demo account SMS path')
  fill(pick('Message code','Код из сообщения'),'123456')
  click('button',pick('Sign in','Войти'),true); ab('wait','800')
  const returned = check('new account returns to protected history')
  if (new URL(returned.url).pathname !== '/history' || new URL(returned.url).searchParams.get('source') !== 'stage04') throw Error('Return query lost')
  ab('console')
} finally { ab('close') }
