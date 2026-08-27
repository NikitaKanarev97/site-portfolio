/**
 * Builds the one-page Russian CV without changing the canonical English CV.
 * Content: cv/resume-data-ru.json
 * Outputs: cv/cv-ru.html, output/pdf/*_RU.pdf and public/cv-ru.pdf
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const data = JSON.parse(readFileSync(join(here, 'resume-data-ru.json'), 'utf8'));
const chrome = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);

if (!chrome) throw new Error('Chrome or Edge was not found');

const outputDir = join(root, 'output', 'pdf');
mkdirSync(outputDir, { recursive: true });

const font = (name) => `data:font/woff2;base64,${readFileSync(join(root, 'public', 'fonts', name)).toString('base64')}`;
const sansLatin = font('manrope-latin-wght-normal.woff2');
const sansCyrillic = font('manrope-cyrillic-wght-normal.woff2');
const monoLatin = font('jetbrains-mono-latin-wght-normal.woff2');
const monoCyrillic = font('jetbrains-mono-cyrillic-wght-normal.woff2');

function inlineCss() {
  const base = readFileSync(join(here, 'styles-branded.css'), 'utf8')
    .replaceAll('__FONT_SANS__', sansLatin)
    .replaceAll('__FONT_MONO__', monoLatin);
  return `
@font-face{font-family:"Manrope";src:url(${sansCyrillic}) format("woff2");font-weight:200 800;font-style:normal;font-display:block;unicode-range:U+0400-052F,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F}
@font-face{font-family:"JetBrains Mono";src:url(${monoCyrillic}) format("woff2");font-weight:100 800;font-style:normal;font-display:block;unicode-range:U+0400-052F,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F}
${base}
/* Фирменные шрифты, не системные. Здесь стояло --sans:"Segoe UI" — оно
   перебивало Manrope и JetBrains Mono, которые этот же скрипт встраивает
   выше кириллическими подмножествами, и русское CV печаталось Segoe UI,
   расходясь по гарнитуре с английским. Consolas и Arial остаются только
   запасным вариантом внутри стека. */
/* Только то, что действительно требует русская типографика.
   Размеры шрифтов здесь были уменьшены под Segoe UI — широкую гарнитуру, на
   которую страница сваливалась из-за подмены выше. С Manrope подгонка не
   нужна и вредна: она оставляла пустой нижнюю треть листа и разводила
   русское CV с английским по кеглю. Русский длиннее английского примерно
   на десятую часть, поэтому колонка контактов получает чуть больше места,
   а межстрочный интервал списков — чуть больше воздуха. */
.header{grid-template-columns:minmax(0,1fr) 76mm;gap:8mm}
.bullets li{line-height:1.4}
.skill dd{line-height:1.4}
`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function anchor(item, text = item.label) {
  return `<a href="${escapeHtml(item.href)}">${escapeHtml(text)}</a>`;
}

function experience() {
  return data.experience.map((entry) => `<article class="entry">
  <div class="entry-head">
    <h3 class="entry-title">${escapeHtml(entry.role)} <span>/ ${escapeHtml(entry.company)}</span></h3>
    <p class="entry-date">${escapeHtml(entry.dates.replaceAll(' - ', ' / '))} <span aria-hidden="true">/</span> ${escapeHtml(entry.location)}</p>
  </div>
  <p class="entry-sub">${escapeHtml(entry.description)}</p>
  <ul class="bullets">${entry.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>
</article>`).join('');
}

function selectedWork() {
  return data.selectedWork.map((work) => `<article class="work">
  <h3>${anchor({ label: work.title, href: work.href })}</h3>
  <p class="work-meta">${escapeHtml(work.meta)}</p>
  <p class="work-desc">${escapeHtml(work.description)}</p>
</article>`).join('');
}

function skills() {
  return data.skills.map((skill) => `<div class="skill"><dt>${escapeHtml(skill.group)}</dt><dd>${escapeHtml(skill.items.join(', '))}</dd></div>`).join('');
}

function education() {
  return data.education.map((item) => `<div class="edu">
  <p class="edu-copy"><strong>${escapeHtml(item.credential)}</strong> / ${escapeHtml(item.institution)}</p>
  <p class="edu-year">${escapeHtml(item.year)}</p>
</div>`).join('');
}

const contacts = data.contacts;
const html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(data.name)} - ${escapeHtml(data.title)} - резюме</title>
  <style>${inlineCss()}</style>
</head>
<body>
<section class="sheet">
  <header class="header">
    <div>
      <h1 class="name">${escapeHtml(data.name)}</h1>
      <p class="headline"><strong>${escapeHtml(data.title)}</strong><span>${escapeHtml(data.headlineDetail)}</span></p>
      <p class="location">${escapeHtml(data.location)}</p>
    </div>
    <dl class="contacts">
      <div class="contact contact--primary"><dt>Портфолио</dt><dd>${anchor(contacts.portfolio)}</dd></div>
      <div class="contact"><dt>LinkedIn</dt><dd>${anchor(contacts.linkedin)}</dd></div>
      <div class="contact contact--wide"><dt>Почта</dt><dd>${anchor(contacts.email)}</dd></div>
    </dl>
  </header>
  <div class="top-rule"></div>

  <p class="summary">${escapeHtml(data.summary)}</p>

  <section class="section">
    <h2 class="section-title">Опыт</h2>
    <div>${experience()}</div>
  </section>

  <section class="section">
    <h2 class="section-title">Избранные проекты</h2>
    <div class="work-list">${selectedWork()}</div>
  </section>

  <div class="lower-grid">
    <section class="section section--stacked">
      <h2 class="section-title">Навыки</h2>
      <dl class="skill-list">${skills()}</dl>
    </section>
    <div>
      <section class="section section--stacked">
        <h2 class="section-title">Образование</h2>
        <div class="education">${education()}</div>
      </section>
      <section class="section section--stacked section--details">
        <h2 class="section-title">Дополнительно</h2>
        <div class="compact-grid">
          <div class="compact"><h3>Языки</h3><p>${escapeHtml(data.languages.join(' / '))}</p></div>
          <div class="compact"><h3>Формат</h3><p>${escapeHtml(data.availability)}</p></div>
        </div>
      </section>
    </div>
  </div>

  <div class="cta"><strong>Кейсы с решениями и компромиссами</strong>${anchor(contacts.portfolio, data.portfolioCta)}</div>
  <footer class="footer">
    <span>${escapeHtml(contacts.email.label)}</span>
    <span class="page-number">${escapeHtml(data.name)} / ${escapeHtml(data.title)}</span>
  </footer>
</section>
</body>
</html>`;

const htmlPath = join(here, 'cv-ru.html');
const pdfPath = join(outputDir, 'Nikita_Kanarev_Product_Designer_CV_RU.pdf');
const publicPath = join(root, 'public', 'cv-ru.pdf');

writeFileSync(htmlPath, html, 'utf8');
execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--run-all-compositor-stages-before-draw',
  '--virtual-time-budget=4000',
  '--no-pdf-header-footer',
  `--print-to-pdf=${pdfPath}`,
  `file:///${htmlPath.replaceAll('\\', '/')}`,
], { stdio: 'inherit' });
copyFileSync(pdfPath, publicPath);

console.log(`Russian CV: ${pdfPath}`);
console.log(`Site copy: ${publicPath}`);
