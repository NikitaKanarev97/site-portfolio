/**
 * Полная сверка русских маршрутов на остаточную латиницу.
 *
 * Зачем отдельный скрипт вместо scan-ru-ui.mjs: тот читает только innerText
 * и только по короткому списку маршрутов. Три класса текста он не видит —
 * значения контролируемых полей (React держит их в value, не в текстовом
 * узле), подписи для скринридера и подписи Storybook-матриц. Именно они
 * дважды пролезали в принятые кадры.
 *
 * Маршруты совпадают со списками кадров в scripts/shoot-*-frames.mjs:
 * сканируется ровно то, что попадает в кейс, а не то, что похоже.
 */
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const require = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const { chromium } = require('playwright');

const STORY = (origin, id) => `${origin}/iframe.html?id=${id}&viewMode=story&globals=locale:ru`;

const TARGETS = [
  {
    name: 'agent-ops',
    app: 'http://localhost:5300/ru',
    routes: ['/', '/screens/review-queue', '/screens/run-detail?run=run-cl-promo-01', '/screens/action-approvals',
      '/screens/cluster-detail?cluster=cl-promo', '/screens/trace-gap-state', '/screens/consequence-preview',
      '/screens/correction?run=run-cl-promo-01', '/screens/autonomy', '/screens/quality-dashboard',
      '/screens/policy-version-diff', '/screens/decision-trail', '/screens/sign-in'],
    storybook: 'http://localhost:6100',
    stories: ['components-amountfigure--all-variants', 'components-verdictbar--all-variants',
      'components-metricrow--all-variants', 'components-emptystate--all-variants',
      'components-autonomyladder--all-variants', 'components-trailstep--all-variants',
      'components-button--all-variants'],
  },
  {
    name: 'dssl',
    app: 'http://localhost:5199/b2b/ru',
    routes: ['/', '/resolution-center', '/resolution-center/candidate-select', '/cart/change-review',
      '/fulfillment', '/dashboard'],
    storybook: 'http://localhost:6009',
    stories: ['components-domain-productrow--all-variants', 'components-domain-priceblock--all-variants',
      'components-domain-availability--all-variants', 'components-domain-resolutionrow--all-variants',
      'components-domain-fulfillmentplan--all-variants', 'components-domain-emptystate--all-variants',
      'components-actions-button--all-variants'],
  },
  {
    name: 'vet',
    app: 'http://localhost:5200/ru',
    routes: ['/', '/app/vet-day-queue', '/app/schedule', '/app/visit-quick-trace', '/app/dose-calculator',
      '/app/discharge-preview', '/app/patient-card'],
    storybook: 'http://localhost:6007',
    stories: ['components-atoms-savestatus--all-variants', 'components-atoms-statustag--all-variants',
      'components-domain-timeslot--all-variants', 'components-extended-weightreading--all-variants',
      'components-atoms-input--all-variants', 'components-atoms-choicechip--all-variants',
      'components-atoms-button--all-variants'],
  },
  {
    name: 'pawly',
    app: 'http://localhost:5201/ru',
    routes: ['/app', '/app/owner-home', '/app/address-input', '/app/walker-profile',
      '/app/handover-photo-review', '/app/replacement-offer'],
    storybook: 'http://localhost:6008',
    stories: ['components-button--all-variants', 'components-infonote--all-variants',
      'components-emptystate--all-variants', 'components-bottomsheet--all-variants',
      'components-photoproof--all-variants', 'components-timelinerow--all-variants',
      'components-iconbutton--all-variants'],
  },
];
/**
 * Латиница, которая остаётся латиницей осознанно. Список — решение, а не
 * фильтр удобства: каждая строка здесь означает «переводить нельзя».
 *
 * Технические маршруты (`/app/owner-home`) — адреса, а не текст. Значения
 * осей Storybook (`размер = md`) — идентификаторы пропа: русский каталог
 * пишет ключ по-русски, а значение оставляет как в API компонента.
 * Артикулы, имена файлов и исходные строки спецификации — данные: последние
 * закупщик печатает сам, и в живом портале они приходят вперемешку. Именно
 * на этой смеси построен кейс DSSL, поэтому «выровнять» их нельзя.
 */
const BRANDS = ['Nikita Kanarev', 'DSSL', 'Pawly', 'Storybook', 'Figma', 'React', 'Vercel',
  'LinkedIn', 'GitHub', 'Astro', 'Agent Ops', 'EMEA', 'SLA', 'XLS', 'ERP', 'NVR', 'PoE',
  'HDD', 'CET', 'UTC', 'CSAT', 'SKU', 'KB', 'INV', 'EU', 'US', 'PDF', 'CSV', 'ID', 'OS',
  'Excel', 'Korvex', 'Scale'];

/**
 * Синтетические имена клиентов кейса Agent Ops. Продукт работает по региону
 * EMEA, поэтому имена компаний и людей остаются латиницей — переведённые,
 * они противоречили бы самому сценарию.
 */
const COMPANIES = ['Nordwind GmbH', 'Helio Retail', 'Brightpath Media', 'Ferrum Logistics',
  'Caldera Foods', 'Vantor Systems', 'Vantage Print', 'Orsted Retail', 'Aster Mobility',
  'Cobalt Rail', 'Juniper Health', 'Kestrel Studio', 'Larkspur Health', 'Meridian Foods',
  'Nine Yards Ltd', 'Orbit Analytics', 'Pinewood Labs', 'Solstice Gear', 'Tannhill Group',
  'Vector Integration', 'Console', 'Confluence'];

/** Значения пропов в матрицах Storybook — API компонента, не текст. */
const VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'neutral',
  'default', 'disabled', 'focus', 'hover', 'loading', 'pressed', 'selected', 'error',
  'success', 'warning', 'info', 'added', 'attention', 'none', 'changed', 'exact',
  'free', 'booked', 'closed', 'clinic', 'owner', 'drug', 'search', 'multiline',
  'single', 'double', 'disclose', 'danger', 'sm', 'md', 'lg', 'base',
  'offline', 'saved', 'saving', 'unsaved', 'service', 'value', 'money', 'count',
  'kind', 'text', 'ghost-inverse', 'inverse', 'compact', 'wide', 'empty',
  'current', 'locked', 'nodata', 'readytopromote', 'horizontal', 'vertical',
  'done', 'failed', 'pending', 'nothing', 'resolved', 'askhead', 'asklead',
  'risky', 'undo', 'verdict', 'high', 'med', 'low', '2xl', '4xl', 'xl', 'xs'];

/** Имена полей и значения данных в трассировке — код, а не текст. */
const TECHNICAL = ['amount', 'eligible', 'invoice', 'null', 'true', 'false', 'currency'];

/** Исходные строки спецификации: их печатает закупщик, а не интерфейс. */
const RAW_SPEC = [
  'Korvex bullet cam 4mp object detect outdoor',
  'nvr 8ch poe', 'wall bracket', 'switch poe 8p',
];

const ALLOWED = [
  /^\/[a-z0-9/-]*$/,                               // /app/, /screens/review-queue
  /^(verification|dashboard|fulfillment|checkout|catalog|cart|orders|search|login)$/,
  /^[A-Z]{2,5}$/,                                  // EMEA, PDF, SKU, CSV, API
  /^[a-z][a-z0-9]*(?:[-_][a-z0-9]+)+$/,            // owner-home, promo_id, run-cl-promo-01
  /^[A-Za-z]{1,4}[-–][A-Za-z0-9-]+$/,              // KX-3E4510P, KB-2019-promo-refund
  /^[a-z0-9_]+\.(xlsx|xls|csv|pdf|png|webp|json)$/i, // office_north_v8.xlsx
  /^v\d+(\.\d+)*$/i,                               // v4, v5.1
  /^\d+([.,]\d+)?\s*(px|ms|s|kg|mg|ml|мл|мг|кг)$/i,
  /^[A-Z][a-zA-Z]+$/,                              // PatientCard, VetDayQueue — имя компонента
  /^[A-Z][a-z]+ [A-Z]\.$/,                         // Martin K. — имя человека
];

/**
 * Пара «русский ключ = идентификатор», в том числе цепочкой через «·».
 * Проверка разбором, а не регулярным выражением: собранное из VARIANTS
 * выражение приходится экранировать дважды, и одна потерянная косая черта
 * молча превращает `\s` в букву s — ошибка, которую не видно в коде.
 */
function isAxisLabel(text) {
  return text.split('·').every((part) => {
    const [key, value, ...rest] = part.split('=').map((piece) => piece.trim());
    if (!value || rest.length) return false;
    if (!/^[А-ЯЁа-яё]+$/.test(key)) return false;
    return VARIANTS.includes(value.toLowerCase());
  });
}

/** Строка, вся латиница которой — бренды, коды и данные, считается переведённой. */
function onlyBrands(text) {
  const rest = [
    // Идентификатор в коде: promo-expiry, run-cl-promo-01, src/data
    /\b[a-z][a-z0-9]*(?:[-/][a-z0-9]+)+\b/g,
    // Имя человека капсом: MARTIN K.
    /\b[A-Z]{3,}\s[A-Z]\./g,
    // Регион капсом: EU/WEST
    /\bEU\/WEST\b/g,
    /\bnull\b|\btrue\b|\bfalse\b/g,
    // Имя компонента в CamelCase — идентификатор кода, не текст интерфейса.
    /\b[A-Z][a-z]+(?:[A-Z][a-z]+)+\b/g,
    /[^\s@]+@[^\s@]+\.[^\s@]+/g,
    // Артикул и код статьи: KX-3E4510P, KB-2019-promo-refund, RUN-4471
    /\b[A-Z]{1,4}[-–][A-Za-z0-9]+(?:[-–][A-Za-z0-9]+)*\b/g,
    /\b[a-z0-9_]+\.(?:xlsx|xls|csv|pdf|png|webp|json)\b/gi,
    // Тело запроса и путь API: POST /refunds { amount: 420, currency: EUR }
    /\b(?:GET|POST|PUT|PATCH|DELETE)\b/g,
    /\{[^}]*\}/g,
    /\[[^\]]*\]/g,
    /\/[a-z][a-z0-9/_-]*/g,
    // Имя человека инициалами: M. Adeyemi, P. Sharma, Martin K.
    /\b[A-Z]\.\s?[A-Z][a-z]+\b/g,
    /\b[A-Z][a-z]+\s[A-Z]\.(?![a-z])/g,
    // Код локали и региона: de-DE, EU/West
    /\b[a-z]{2}-[A-Z]{2}\b/g,
    /\bEU\/West\b/g,
    // Имя поля политики: refund_cap_eur, refund.window_days, policy@2.3
    /\b[a-z][a-z0-9_]*(?:[._][a-z0-9_]+)+\b/g,
  ].reduce((value, rule) => value.replace(rule, ' '), text);
  const stripped = [...COMPANIES, ...RAW_SPEC, ...BRANDS]
    .sort((a, b) => b.length - a.length)
    .reduce((value, name) => value.split(name).join(' '), rest);
  return !/[A-Za-z][A-Za-z'’-]{2,}/.test(stripped);
}

function suspicious(text) {
  // Адрес почты — данные, а не текст интерфейса.
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim())) return null;
  // Метка класса ([aria-label], [value]) — служебная, её латиница не в счёт.
  const marker = text.match(/^\[[a-z-]+\]\s*/)?.[0] ?? '';
  const trimmed = text.slice(marker.length).trim();
  if (!trimmed) return null;
  // Латинские слова длиной от трёх букв — короче обычно код или единица.
  const words = trimmed.match(/[A-Za-z][A-Za-z'’-]{2,}/g);
  if (!words) return null;
  if (ALLOWED.some((rule) => rule.test(trimmed))) return null;
  if (isAxisLabel(trimmed)) return null;
  if (VARIANTS.includes(trimmed.toLowerCase())) return null;
  if (TECHNICAL.includes(trimmed.toLowerCase())) return null;
  if (onlyBrands(trimmed)) return null;
  return `${marker}${trimmed}`;
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const report = [];

async function harvest(url, label) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
  } catch {
    report.push(`\n## ${label}\n  !! маршрут не открылся: ${url}`);
    return;
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  const strings = await page.evaluate(() => {
    const out = new Set();
    // Узлы, а не строки innerText: «Walk, » и «Pay · » живут отдельными
    // текстовыми узлами, и словарь, написанный по склеенной строке, по ним
    // не попадает. Правится ровно то, что есть в DOM.
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement?.closest('script, style')) continue;
      const box = node.parentElement?.getBoundingClientRect();
      if (!box || (box.width === 0 && box.height === 0)) continue;
      out.add(node.textContent.trim());
    }
    for (const field of document.querySelectorAll('input, textarea')) {
      if (field.value) out.add(`[value] ${field.value}`);
      if (field.placeholder) out.add(`[placeholder] ${field.placeholder}`);
    }
    for (const node of document.querySelectorAll('[aria-label]')) out.add(`[aria-label] ${node.getAttribute('aria-label')}`);
    for (const node of document.querySelectorAll('[title]')) out.add(`[title] ${node.getAttribute('title')}`);
    for (const node of document.querySelectorAll('img[alt]')) out.add(`[alt] ${node.getAttribute('alt')}`);
    for (const node of document.querySelectorAll('select option')) out.add(`[option] ${node.textContent.trim()}`);
    return [...out];
  });
  const hits = [...new Set(strings.map(suspicious).filter(Boolean))];
  if (hits.length) {
    report.push(`\n## ${label}`);
    for (const hit of hits) report.push(`  ${hit}`);
  }
}

const only = process.argv[2];
for (const target of TARGETS) {
  if (only && only !== target.name) continue;
  report.push(`\n\n# ${target.name.toUpperCase()}`);
  for (const route of target.routes) await harvest(`${target.app}${route}`, `${target.name} app ${route}`);
  for (const id of target.stories) await harvest(STORY(target.storybook, id), `${target.name} story ${id}`);
}

await browser.close();

mkdirSync(path.resolve('tmp', 'qa'), { recursive: true });
const file = path.resolve('tmp', 'qa', `latin-${only ?? 'all'}.txt`);
writeFileSync(file, report.join('\n'), 'utf8');
console.log(report.join('\n'));
console.log(`\n---\nОтчёт: ${file}`);
