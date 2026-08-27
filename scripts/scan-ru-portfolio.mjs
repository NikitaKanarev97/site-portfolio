/**
 * Сверка русских маршрутов портфолио на остаточную латиницу.
 *
 * Зачем отдельно от verify-portfolio-locales.mjs: тот ищет короткий список
 * заранее известных английских фраз. Список ловит только то, о чём уже
 * знаешь, и пропустил «Copy email» — умолчание компонента `CopyEmail`,
 * которое ни один маршрут /ru/ не перекрывал. Здесь проверка обратная:
 * подозрительна любая латиница, кроме объявленной осознанной.
 *
 * Читаются текстовые узлы, а не innerText: подпись кнопки и её подсказка —
 * соседние узлы, и склеенная строка прячет, какой из них английский.
 */
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const require = createRequire('D:/Claude-projects/b2b-dssl/package.json');
const { chromium } = require('playwright');

const origin = process.env.PORTFOLIO_ORIGIN ?? 'http://127.0.0.1:4322';
const slugs = ['agent-ops-console', 'partner-portal', 'vet-clinic', 'pawly'];
const routes = ['/ru/', '/ru/about', ...slugs.map((slug) => `/ru/work/${slug}`)];

/**
 * Латиница, которая остаётся латиницей осознанно. Каждая запись — решение.
 *
 * Названия инструментов и компаний — имена собственные. Тип файла в подписи
 * ссылки (PDF) — обозначение формата. Адрес почты и домены — данные.
 * Названия ролей вроде B2B SaaS — принятые в отрасли термины, которые
 * русский текст кейса использует как есть.
 *
 * Чего здесь намеренно НЕТ: `Nikita Kanarev`, `Agent Ops Console`,
 * `Vet Clinic OS` и `B2B Partner Portal`. Имя владельца и три названия
 * кейсов переведены на русскую версию 28.08.2026 — оставить их в списке
 * значило бы разрешить сканеру молча пропустить откат к английскому.
 * `Pawly` и `DSSL` остаются: это марка и название компании, а не описание.
 */
const BRANDS = [
  'Pawly', 'DSSL', 'Veterinary SaaS', 'B2B SaaS', 'B2B', 'SaaS', 'NDA', 'PDF', 'UX', 'UI',
  'Figma', 'Storybook', 'Webflow', 'React', 'TypeScript', 'JavaScript', 'HTML', 'CSS',
  'Git', 'GitHub', 'LinkedIn', 'Claude Code', 'Google UX Design', 'Coursera', 'Pentaschool',
  'QA', 'IA', 'CMS', 'API', 'ERP', 'SKU', 'XLS', 'EMEA', 'SLA', 'UTC', 'CSAT', 'OS',
  'Yandex', 'Practicum', 'Vercel', 'Astro', 'Manrope', 'JetBrains Mono', 'Scale',
];

/**
 * Отраслевые термины, которые русский текст кейсов использует как есть.
 * Это решение автора, а не пропуск: «deflection», «happy path» и «edge case»
 * у русскоязычного продуктового читателя не имеют короткого эквивалента,
 * а имена методов и заголовков (sendBeacon, preflight, origin) переводу не
 * подлежат вовсе. Каждая запись здесь — сознательно оставленная латиница.
 */
const TERMS = ['deflection', 'happy path', 'edge case', 'edge cases', 'confidence score',
  'sendBeacon', 'preflight', 'origin', 'JSON', 'parity', 'Must-have', 'low-fi', 'high-fi',
  'PRD', 'MVP', 'GPS', 'iOS', 'Android', 'Uber', 'web3', 'frontend', 'backend', 'legacy',
  'disabled', 'custom code', 'Client-First', 'GSAP', 'Common', 'Synk', 'Scrib3', 'Bloomlex',
  'Google', 'Confluence', 'Excel'];

const ALLOWED = [
  /^[A-Z][a-zA-Z]+$/,                              // ProductRow, EmptyState — имя компонента
  /^[A-Z]{2,6}$/,                                   // PDF, UX, NDA
  /^v\d+(\.\d+)*$/i,
  /^[\d\s.,+×–—%$€₽()/-]+$/,                        // числа, суммы, диапазоны
  /^(EN|RU)$/,                                      // сам переключатель языка
];

function escape(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function onlyBrands(text) {
  const stripped = [...BRANDS, ...TERMS]
    .sort((a, b) => b.length - a.length)
    // Регистр не важен: «Parity-проверка» в начале предложения — тот же термин.
    .reduce((value, name) => value.replace(new RegExp(escape(name), 'gi'), ' '), text)
    .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, ' ')
    // Адрес почты CopyEmail разбивает на узлы: локальная часть приходит
    // отдельной строкой и адресом быть от этого не перестаёт.
    .replace(/\b[a-z0-9]+(?:[.-][a-z0-9]+)+\b/gi, ' ')
    .replace(/\b[a-z][a-z0-9]*(?:[-_/][a-z0-9]+)+\b/g, ' ');
  return !/[A-Za-z][A-Za-z'’-]{2,}/.test(stripped);
}

function suspicious(text) {
  const marker = text.match(/^\[[a-z-]+\]\s*/)?.[0] ?? '';
  const trimmed = text.slice(marker.length).trim();
  if (!trimmed) return null;
  if (!/[A-Za-z][A-Za-z'’-]{2,}/.test(trimmed)) return null;
  if (ALLOWED.some((rule) => rule.test(trimmed))) return null;
  if (onlyBrands(trimmed)) return null;
  return `${marker}${trimmed}`;
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const report = [];
let total = 0;

for (const route of routes) {
  await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // Меню на узкой ширине скрыто, но его подписи — тоже интерфейс.
  await page.waitForTimeout(300);
  const strings = await page.evaluate(() => {
    const out = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      // aria-hidden не читает никто: <desc> внутри декоративного логотипа —
      // не интерфейс. noscript отдаётся текстом с разметкой и ломает разбор.
      if (node.parentElement?.closest('script, style, noscript, [aria-hidden="true"]')) continue;
      out.add(node.textContent.trim());
    }
    for (const node of document.querySelectorAll('[aria-label]')) out.add(`[aria-label] ${node.getAttribute('aria-label')}`);
    for (const node of document.querySelectorAll('img[alt]')) out.add(`[alt] ${node.getAttribute('alt')}`);
    for (const node of document.querySelectorAll('[title]')) out.add(`[title] ${node.getAttribute('title')}`);
    for (const node of document.querySelectorAll('button, a')) {
      for (const key of ['data-hint', 'data-hint-copied', 'data-announce', 'data-announce-fallback']) {
        const value = node.getAttribute(key);
        if (value) out.add(`[${key}] ${value}`);
      }
    }
    return [...out];
  });
  const hits = [...new Set(strings.map(suspicious).filter(Boolean))];
  total += hits.length;
  report.push(`\n## ${route}`);
  for (const hit of hits) report.push(`  ${hit}`);
}

await browser.close();

mkdirSync(path.resolve('tmp', 'qa'), { recursive: true });
writeFileSync(path.resolve('tmp', 'qa', 'latin-portfolio.txt'), report.join('\n'), 'utf8');
console.log(report.join('\n'));
console.log(`\n---\nВсего находок: ${total}`);
process.exitCode = total ? 1 : 0;
