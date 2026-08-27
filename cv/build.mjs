/**
 * CV bundle builder.
 *
 * Canonical content: cv/resume-data.json
 * Layouts: cv/styles-branded.css and cv/styles-ats.css
 *
 * Outputs:
 * - cv/cv.html
 * - cv/ats.html
 * - cv/Nikita_Kanarev_Product_Designer_Master.md
 * - output/pdf/Nikita_Kanarev_Product_Designer_CV.pdf
 * - output/pdf/Nikita_Kanarev_Product_Designer_ATS.pdf
 * - output/pdf/Nikita_Kanarev_Product_Designer_Resume.txt
 * - public/cv.pdf
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const data = JSON.parse(readFileSync(join(here, 'resume-data.json'), 'utf8'));

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);

if (!CHROME) throw new Error('Chrome or Edge was not found');

const outputDir = join(root, 'output', 'pdf');
mkdirSync(outputDir, { recursive: true });

const fontSans = `data:font/woff2;base64,${readFileSync(
  join(root, 'public/fonts/manrope-latin-wght-normal.woff2'),
).toString('base64')}`;
const fontMono = `data:font/woff2;base64,${readFileSync(
  join(root, 'public/fonts/jetbrains-mono-latin-wght-normal.woff2'),
).toString('base64')}`;

function inlineCss(name) {
  return readFileSync(join(here, name), 'utf8')
    .replaceAll('__FONT_SANS__', fontSans)
    .replaceAll('__FONT_MONO__', fontMono);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function anchor(item, text = item.label, className = '') {
  return `<a${className ? ` class="${className}"` : ''} href="${escapeHtml(item.href)}">${escapeHtml(text)}</a>`;
}

function documentShell(title, css, body) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>${css}</style>
</head>
<body>${body}</body>
</html>`;
}

function brandedExperience() {
  return data.experience
    .map(
      (entry) => `<article class="entry">
  <div class="entry-head">
    <h3 class="entry-title">${escapeHtml(entry.role)} <span>${entry.selfEmployed ? '/' : 'at'} ${escapeHtml(entry.company)}</span></h3>
    <p class="entry-date">${escapeHtml(entry.dates.replaceAll(' - ', ' to '))} <span aria-hidden="true">/</span> ${escapeHtml(entry.location)}</p>
  </div>
  <p class="entry-sub">${escapeHtml(entry.description)}</p>
  <ul class="bullets">${entry.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>
</article>`,
    )
    .join('');
}

function atsExperience() {
  return data.experience
    .map(
      (entry) => `<article class="entry">
  <div class="entry-head">
    <h3 class="entry-title">${escapeHtml(entry.role)} - ${escapeHtml(entry.company)}</h3>
    <p class="entry-date">${escapeHtml(entry.dates)} - ${escapeHtml(entry.location)}</p>
  </div>
  <p class="entry-sub">${escapeHtml(entry.description)}</p>
  <ul>${entry.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>
</article>`,
    )
    .join('');
}

function workItems(mode) {
  return data.selectedWork
    .map((work) => {
      const meta = mode === 'branded' ? work.meta.replaceAll(' - ', ' / ') : work.meta;
      const titleSuffix = mode === 'ats' ? ':' : '';
      return `<article class="work">
  <h3>${anchor({ label: work.title, href: work.href }, work.title)}${titleSuffix}</h3>
  <p class="work-meta">${escapeHtml(meta)}</p>
  <p class="work-desc">${escapeHtml(work.description)}</p>
  ${mode === 'ats' ? `<a class="work-link" href="${escapeHtml(work.href)}">${escapeHtml(work.href)}</a>` : ''}
</article>`;
    })
    .join('');
}

function skillItems() {
  return data.skills
    .map(
      (skill) => `<div class="skill"><dt>${escapeHtml(skill.group)}</dt><dd>${escapeHtml(skill.items.join(', '))}</dd></div>`,
    )
    .join('');
}

function educationItems(mode) {
  const separator = mode === 'branded' ? ' / ' : ' - ';
  return data.education
    .map(
      (education) => `<div class="edu">
  <p class="edu-copy"><strong>${escapeHtml(education.credential)}</strong>${separator}${escapeHtml(education.institution)}</p>
  <p class="edu-year">${escapeHtml(education.year)}</p>
</div>`,
    )
    .join('');
}

function brandedHtml() {
  const contacts = data.contacts;
  const body = `
<section class="sheet">
  <header class="header">
    <div>
      <h1 class="name">${escapeHtml(data.name)}</h1>
      <p class="headline"><strong>${escapeHtml(data.title)}</strong><span>${escapeHtml(data.headline.replace(`${data.title} - `, ''))}</span></p>
      <p class="location">${escapeHtml(data.location.replaceAll(' - ', ' / '))}</p>
    </div>
    <dl class="contacts">
      <div class="contact contact--primary"><dt>Portfolio</dt><dd>${anchor(contacts.portfolio)}</dd></div>
      <div class="contact"><dt>LinkedIn</dt><dd>${anchor(contacts.linkedin)}</dd></div>
      <div class="contact contact--wide"><dt>Email</dt><dd>${anchor(contacts.email)}</dd></div>
    </dl>
  </header>
  <div class="top-rule"></div>

  <p class="summary">${escapeHtml(data.summary)}</p>

  <section class="section">
    <h2 class="section-title">Experience</h2>
    <div>${brandedExperience()}</div>
  </section>

  <section class="section">
    <h2 class="section-title">Selected work</h2>
    <div class="work-list">${workItems('branded')}</div>
  </section>

  <div class="lower-grid">
    <section class="section section--stacked">
      <h2 class="section-title">Skills</h2>
      <dl class="skill-list">${skillItems()}</dl>
    </section>

    <div>
      <section class="section section--stacked">
        <h2 class="section-title">Education</h2>
        <div class="education">${educationItems('branded')}</div>
      </section>

      <section class="section section--stacked section--details">
        <h2 class="section-title">Details</h2>
        <div class="compact-grid">
          <div class="compact"><h3>Languages</h3><p>${escapeHtml(data.languages.join(' / '))}</p></div>
          <div class="compact"><h3>Availability</h3><p>${escapeHtml(data.availability.replaceAll(' - ', ' / '))}</p></div>
        </div>
      </section>
    </div>
  </div>

  <div class="cta"><strong>Portfolio evidence, decisions and trade-offs</strong>${anchor(contacts.portfolio, data.portfolioCta)}</div>

  <footer class="footer">
    <span>${escapeHtml(contacts.email.label)}</span>
    <span class="page-number">${escapeHtml(data.name)} / ${escapeHtml(data.title)}</span>
  </footer>
</section>`;

  return documentShell(
    `${data.name} - Product Designer - CV`,
    inlineCss('styles-branded.css'),
    body,
  );
}

function atsHtml() {
  const contacts = data.contacts;
  const body = `
<section class="sheet">
  <header>
    <h1>${escapeHtml(data.name)}</h1>
    <p class="headline">${escapeHtml(data.headline)}</p>
    <p class="location">${escapeHtml(data.location)}</p>
    <div class="contact-lines">
      <div><strong>Portfolio:</strong> ${anchor(contacts.portfolio, contacts.portfolio.href)}</div>
      <div><strong>LinkedIn:</strong> ${anchor(contacts.linkedin, contacts.linkedin.href)}</div>
      <div><strong>Email:</strong> ${anchor(contacts.email, contacts.email.label)}</div>
    </div>
  </header>

  <section class="section"><h2>Professional Summary</h2><p class="summary">${escapeHtml(data.summary)}</p></section>
  <section class="section"><h2>Experience</h2>${atsExperience()}</section>
  <section class="section"><h2>Selected Work</h2>${workItems('ats')}</section>
  <section class="section"><h2>Skills</h2><dl>${skillItems()}</dl></section>
  <section class="section"><h2>Education</h2>${educationItems('ats')}</section>
  <section class="section"><h2>Languages</h2><p class="plain">${escapeHtml(data.languages.join(' | '))}</p></section>
  <section class="section"><h2>Availability</h2><p class="plain">${escapeHtml(data.availability)}</p></section>
  <footer class="footer"><span>${escapeHtml(contacts.email.label)}</span><span>${escapeHtml(data.name)} - ${escapeHtml(data.title)}</span></footer>
</section>`;

  return documentShell(
    `${data.name} - Product Designer - ATS Resume`,
    inlineCss('styles-ats.css'),
    body,
  );
}

function plainText() {
  const contacts = data.contacts;
  const lines = [
    data.name,
    data.headline,
    data.location,
    '',
    `Portfolio: ${contacts.portfolio.href}`,
    `LinkedIn: ${contacts.linkedin.href}`,
    `Email: ${contacts.email.label}`,
    '',
    'PROFESSIONAL SUMMARY',
    data.summary,
    '',
    'EXPERIENCE',
  ];

  for (const entry of data.experience) {
    lines.push(
      '',
      `${entry.role} - ${entry.company}`,
      `${entry.dates} - ${entry.location}`,
      entry.description,
      ...entry.bullets.map((bullet) => `- ${bullet}`),
    );
  }

  lines.push('', 'SELECTED WORK');
  for (const work of data.selectedWork) {
    lines.push('', work.title, work.meta, work.description, `View case: ${work.href}`);
  }

  lines.push('', 'SKILLS');
  for (const skill of data.skills) lines.push(`${skill.group}: ${skill.items.join(', ')}`);

  lines.push('', 'EDUCATION');
  for (const education of data.education) {
    lines.push(`${education.credential} - ${education.institution} - ${education.year}`);
  }

  lines.push(
    '',
    'LANGUAGES',
    data.languages.join(' | '),
    '',
    'AVAILABILITY',
    data.availability,
    '',
    `Full case studies: ${contacts.portfolio.href}`,
    '',
  );

  return lines.join('\n');
}

function masterMarkdown() {
  const contacts = data.contacts;
  const lines = [
    `# ${data.name}`,
    '',
    data.headline,
    '',
    `[Portfolio](${contacts.portfolio.href}) | [LinkedIn](${contacts.linkedin.href}) | [Email](${contacts.email.href})`,
    '',
    data.location,
    '',
    '## Professional Summary',
    '',
    data.summary,
    '',
    '## Experience',
  ];

  for (const entry of data.experience) {
    lines.push(
      '',
      `### ${entry.role} - ${entry.company}`,
      '',
      `${entry.dates} - ${entry.location}`,
      '',
      entry.description,
      '',
      ...entry.bullets.map((bullet) => `- ${bullet}`),
    );
  }

  lines.push('', '## Selected Work');
  for (const work of data.selectedWork) {
    lines.push('', `### [${work.title}](${work.href})`, '', work.meta, '', work.description);
  }

  lines.push('', '## Skills');
  for (const skill of data.skills) lines.push('', `- **${skill.group}:** ${skill.items.join(', ')}`);

  lines.push('', '## Education');
  for (const education of data.education) {
    lines.push('', `- ${education.credential} - ${education.institution} - ${education.year}`);
  }

  lines.push(
    '',
    '## Languages',
    '',
    data.languages.join(' | '),
    '',
    '## Availability',
    '',
    data.availability,
    '',
  );

  return lines.join('\n');
}

function printPdf(htmlPath, pdfPath) {
  execFileSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--run-all-compositor-stages-before-draw',
      '--virtual-time-budget=4000',
      '--no-pdf-header-footer',
      `--print-to-pdf=${pdfPath}`,
      `file:///${htmlPath.replaceAll('\\', '/')}`,
    ],
    { stdio: 'inherit' },
  );
}

const brandedSource = join(here, 'cv.html');
const atsSource = join(here, 'ats.html');
const masterSource = join(here, 'Nikita_Kanarev_Product_Designer_Master.md');
const brandedPdf = join(outputDir, 'Nikita_Kanarev_Product_Designer_CV.pdf');
const atsPdf = join(outputDir, 'Nikita_Kanarev_Product_Designer_ATS.pdf');
const textResume = join(outputDir, 'Nikita_Kanarev_Product_Designer_Resume.txt');

writeFileSync(brandedSource, brandedHtml(), 'utf8');
writeFileSync(atsSource, atsHtml(), 'utf8');
writeFileSync(masterSource, `${masterMarkdown()}\n`, 'utf8');
writeFileSync(textResume, plainText(), 'utf8');

printPdf(brandedSource, brandedPdf);
printPdf(atsSource, atsPdf);
copyFileSync(brandedPdf, join(root, 'public', 'cv.pdf'));

console.log(`Branded PDF: ${brandedPdf}`);
console.log(`ATS PDF: ${atsPdf}`);
console.log(`Plain text: ${textResume}`);
console.log(`Master source: ${masterSource}`);
console.log(`Site copy: ${join(root, 'public', 'cv.pdf')}`);
