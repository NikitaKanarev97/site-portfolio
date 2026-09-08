import { spawnSync } from 'node:child_process'
import { writeFileSync, appendFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const dir = fileURLToPath(new URL('.', import.meta.url))
const [locale = 'en', width = '1440'] = process.argv.slice(2)
const historyOnly = process.argv[4] === 'history'
const suffix = historyOnly ? '-history' : ''
const cli = 'C:/Users/kanar/AppData/Local/npm-cache/_npx/6de2aa2fded2970c/node_modules/agent-browser/bin/agent-browser.js'
const session = `learn04-${locale}-${width}`
const log = `${dir}${locale}-${width}${suffix}.log`
writeFileSync(log, '')
function ab(...args) {
  const r = spawnSync(process.execPath, [cli, '--session', session, ...args], { encoding: 'utf8', timeout: 30000 })
  appendFileSync(log, `\n> ${args.join(' ')}\n${r.stdout || ''}${r.stderr || ''}`)
  if (r.status !== 0 || /✗/.test(r.stdout)) throw Error(`Command failed: ${args.join(' ')} ${r.stderr} ${r.stdout}`)
  return r.stdout.trim()
}
function ref(role, label, last = false) {
  const lines = ab('snapshot', '-i').split('\n').filter(l => l.includes(`${role} "${label}`))
  if (!lines.length) throw Error(`Missing ${role} ${label}`)
  return '@' + (last ? lines.at(-1) : lines[0]).match(/ref=(e\d+)/)[1]
}
const click = (role, label, last) => ab('click', ref(role, label, last))
const fill = (label, text) => ab('fill', ref('textbox', label), text)
const pick = (en, ru) => locale === 'en' ? en : ru
const checks = []
function check(name, expectedLocale = locale) {
  const result = JSON.parse(JSON.parse(ab('eval', 'JSON.stringify({url:location.href,lang:document.documentElement.lang,stored:sessionStorage.getItem("trassir-learn-locale"),width:innerWidth,scroll:document.documentElement.scrollWidth,text:document.body.innerText,cyrillic:document.body.innerText.match(/[^\\n]*[А-Яа-яЁё][^\\n]*/g)})')))
  const errors = ab('errors')
  checks.push({ name, ...result, errors })
  writeFileSync(`${dir}${locale}-${width}${suffix}.json`, JSON.stringify(checks, null, 2))
  if (result.lang !== expectedLocale || result.stored !== expectedLocale || new URL(result.url).searchParams.get('lang') !== expectedLocale) throw Error(`${name}: locale mismatch`)
  if (result.scroll > result.width) throw Error(`${name}: overflow ${result.scroll}`)
  if (expectedLocale === 'en' && result.cyrillic) throw Error(`${name}: Cyrillic ${result.cyrillic}`)
  if (errors) throw Error(`${name}: browser error ${errors}`)
  console.log(`PASS ${locale}/${width}: ${name}`)
  return result
}
try {
  ab('open', `http://127.0.0.1:5174/home?lang=${locale}`)
  ab('set', 'viewport', width, '1000')
  check('home')
  if (!historyOnly) {
  click('link', pick('All 14 resources', 'Все 14 материалов'))
  check('catalog task')
  if (width === '375') click('button', pick('Filters ·', 'Фильтры ·'))
  click('button', pick('Commissioning 9', 'Пусконаладка 9'))
  if (width === '375') {
    check('mobile filters selected')
    click('button', pick('Show results ·', 'Показать результаты ·'))
  }
  const filtered = check('canonical theme filter')
  if (new URL(filtered.url).searchParams.get('theme') !== 'Пусконаладка') throw Error('Filter value is not canonical')
  if (!filtered.text.includes(pick('Resources: 9', 'Материалы: 9'))) throw Error('Wrong filtered count')
  ab('back'); ab('reload'); check('back and reload')
  click('link', pick('Commissioning TRASSIR OS', 'Пусконаладка TRASSIR OS'))
  const program = check('program')
  click('button', pick('Sign in', 'Войти'))
  check('login target')
  click('button', pick('Continue', 'Продолжить'))
  let invalid = check('empty identifier validation')
  if (!invalid.text.includes(pick('Enter your work email', 'Введите рабочую почту'))) throw Error('No empty validation')
  fill(pick('Work email or phone', 'Рабочая почта или телефон'), 'invalid')
  click('button', pick('Continue', 'Продолжить'))
  invalid = check('invalid identifier validation')
  if (!invalid.text.includes(pick('name@company.com', 'name@company.ru'))) throw Error('No format validation')
  fill(pick('Work email or phone', 'Рабочая почта или телефон'), 'marina.k@integrator-nw.ru')
  click('button', pick('Continue', 'Продолжить')); ab('wait', '700')
  check('known account channels')
  click('radio', pick('Email to your personal address', 'Письмом на личную почту'))
  click('button', pick('Continue with selected channel', 'Продолжить с выбранным каналом')); ab('wait', '700')
  click('button', pick('Sign in', 'Войти'), true)
  invalid = check('short code validation')
  if (!invalid.text.includes(pick('six-digit', 'шесть цифр'))) throw Error('No short code validation')
  fill(pick('Message code', 'Код из сообщения'), '000000')
  click('button', pick('Sign in', 'Войти'), true)
  invalid = check('rejected demo code')
  if (!invalid.text.includes(pick('That code did not work', 'Код не подошёл'))) throw Error('No rejected-code validation')
  click('button', pick('Get demo code again', 'Получить демокод ещё раз'))
  check('resend demo code')
  fill(pick('Message code', 'Код из сообщения'), '123456')
  click('button', pick('Sign in', 'Войти'), true); ab('wait', '800')
  const returned = check('login return to program')
  if (returned.url !== program.url) throw Error('Wrong login return')
  ab('reload'); check('signed in reload')
  fill(pick('Search resources and learning paths', 'Поиск по материалам и программам'), pick('TRASSIR cannot discover an ONVIF camera', 'трассир не видит камеру по onvif'))
  ab('press', 'Enter'); ab('wait', '500')
  const search = check('search results')
  if (!search.text.includes(pick('diagnostic sequence', 'порядок проверки'))) throw Error('Missing ONVIF result')
  fill(pick('Search resources and learning paths', 'Поиск по материалам и программам'), 'zzzzxxx')
  ab('press', 'Enter'); ab('wait', '500'); check('search zero')
  click('button', pick('Open full catalog', 'Открыть весь каталог'))
  check('zero search recovery')
  if (width === '375') {
    click('button', pick('Menu', 'Меню')); check('mobile menu')
    click('button', pick('Home', 'Главная')); check('mobile menu home')
  }
  }
  const opposite = locale === 'en' ? 'ru' : 'en'
  ab('open', `http://127.0.0.1:5174/home?lang=${opposite}`); check('explicit overrides saved locale', opposite)
  ab('open', 'http://127.0.0.1:5174/home'); check('saved locale without query', opposite)
  ab('open', `http://127.0.0.1:5174/home?lang=${locale}`); check('explicit switches back')
  ab('back'); check('back across document locales', opposite)
  ab('reload'); check('reload opposite locale', opposite)
  ab('console')
  console.log(`COMPLETE ${locale}/${width}: ${checks.length} checks`)
} finally { ab('close') }
