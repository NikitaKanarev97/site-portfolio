/**
 * Сборка CV в PDF — Site-portfolio
 *
 * Источник — cv/cv.html: чистая разметка с плейсхолдерами. Скрипт
 * подставляет контакты и инлайнит шрифты data-URI (file:// не отдаёт
 * woff2 в CSS без флагов, а флаги молча роняют шрифт в fallback),
 * затем печатает страницу headless-Chrome в A4.
 *
 * Шрифты — те же файлы, что грузит сайт: public/fonts. Палитра CV
 * повторяет ds/tokens.css. Правка типографики идёт в cv.html.
 *
 *   node cv/build.mjs
 *
 * Результат:
 *   cv/Nikita-Kanarev-Product-Designer-CV.pdf  — файл для отправки
 *   public/cv.pdf                              — то, что отдаёт сайт по /cv.pdf
 */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

/** Контакты — единственное место, где они заданы. */
const CONTACTS = {
  __EMAIL__: 'nikita.kanarev.dev@outlook.com',
  __LINKEDIN__: 'linkedin.com/in/nikita-kanarev',
  __LINKEDIN_URL__: 'https://www.linkedin.com/in/nikita-kanarev/',
  __TELEGRAM__: 't.me/nikitaknrv',
  __TELEGRAM_URL__: 'https://t.me/nikitaknrv',
};

const FONTS = {
  __FONT_SANS__: 'public/fonts/manrope-latin-wght-normal.woff2',
  __FONT_MONO__: 'public/fonts/jetbrains-mono-latin-wght-normal.woff2',
};

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);

if (!CHROME) throw new Error('Не найден Chrome или Edge для печати PDF');

let html = readFileSync(join(here, 'cv.html'), 'utf8');

for (const [key, value] of Object.entries(CONTACTS)) {
  html = html.replaceAll(key, value);
}
for (const [key, path] of Object.entries(FONTS)) {
  const b64 = readFileSync(join(root, path)).toString('base64');
  html = html.replaceAll(key, `data:font/woff2;base64,${b64}`);
}

const buildDir = join(root, '.tmp', 'cv');
mkdirSync(buildDir, { recursive: true });
const buildFile = join(buildDir, 'cv.build.html');
writeFileSync(buildFile, html);

const pdf = join(here, 'Nikita-Kanarev-Product-Designer-CV.pdf');

execFileSync(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--run-all-compositor-stages-before-draw',
  '--virtual-time-budget=4000',
  '--no-pdf-header-footer',
  `--print-to-pdf=${pdf}`,
  `file:///${buildFile.replaceAll('\\', '/')}`,
], { stdio: 'inherit' });

copyFileSync(pdf, join(root, 'public', 'cv.pdf'));

console.log(`PDF: ${pdf}`);
console.log(`Site: ${join(root, 'public', 'cv.pdf')}`);
