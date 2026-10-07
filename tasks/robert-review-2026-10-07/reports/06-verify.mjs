import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'file:///D:/Claude-projects/learn/landing/app/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';

const output = fileURLToPath(new URL('./06-evidence/', import.meta.url));
mkdirSync(output, { recursive: true });
const origin = 'http://127.0.0.1:4406';
const email = 'nikita.kanarev.dev@outlook.com';
const slugs = ['agent-ops-console', 'partner-portal', 'learn', 'vet-clinic', 'pawly'];
const observations = [], errors = [], controls = [];
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const context = browser.defaultBrowserContext();
await context.overridePermissions(origin, ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write']);
const page = await browser.newPage();
page.on('pageerror', error => errors.push({ url: page.url(), message: error.message }));
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const go = async path => {
  await page.goto(origin + path, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
};
async function readContact(path, width) {
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await delay(550);
  const data = await page.evaluate(() => {
    const contact = document.querySelector('#contact');
    const address = contact.querySelector('.copy-email__address');
    const heading = contact.querySelector('h2');
    const footer = document.querySelector('footer');
    const rect = element => {
      const r = element.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    };
    return {
      lang: document.documentElement.lang,
      overflow: document.documentElement.scrollWidth - innerWidth,
      heading: { text: heading.textContent.trim(), size: getComputedStyle(heading).fontSize, rect: rect(heading) },
      address: { text: address.textContent.trim(), href: address.getAttribute('href'), font: getComputedStyle(address).fontFamily, size: getComputedStyle(address).fontSize, selectable: getComputedStyle(address).userSelect, rect: rect(address) },
      lead: { rect: rect(contact.querySelector('.contact__lead')) },
      links: [...contact.querySelectorAll('.contact__links a')].map(a => ({
        href: a.getAttribute('href'), text: a.textContent.trim().replace(/\s+/g, ' '), target: a.target, rel: a.rel,
        icons: a.querySelectorAll('svg').length, ruleWidth: parseFloat(getComputedStyle(a.querySelector('.ds-link__rule')).width),
        labelWidth: a.querySelector('.ds-link__label').getBoundingClientRect().width, rect: rect(a),
      })),
      footer: { text: footer.textContent.trim().replace(/\s+/g, ' '), font: getComputedStyle(footer.querySelector('p')).fontFamily, size: getComputedStyle(footer.querySelector('p')).fontSize, clocks: footer.querySelectorAll('[data-local-time]').length },
      contactCopyControls: contact.querySelectorAll('[data-copy-trigger]').length,
      glyphs: /[↗→↓]/.test(contact.textContent),
    };
  });
  assert.equal(data.overflow, 0, path + ' overflow ' + data.overflow);
  assert.equal(data.address.href, 'mailto:' + email);
  assert.equal(data.address.text, email);
  assert.match(data.address.font, /Onest/);
  assert.match(data.footer.font, /Onest/);
  assert.equal(data.footer.clocks, 0);
  assert.equal(data.contactCopyControls, 0);
  assert.equal(data.glyphs, false);
  assert.equal(data.links.length, 2);
  assert.equal(data.heading.size, width === 360 ? '48px' : '128px');
  for (const link of data.links) {
    assert(link.rect.height >= 48, path + ' target height');
    assert.equal(link.icons, 1);
    assert(Math.abs(link.ruleWidth - link.labelWidth) < 1);
    assert(link.rect.x + link.rect.width <= width);
  }
  const cv = data.links.find(link => link.href.endsWith('.pdf'));
  assert.equal(cv.href, path.startsWith('/ru') ? '/cv-ru.pdf' : '/cv.pdf');
  const linkedIn = data.links.find(link => link.href.startsWith('https:'));
  assert.equal(linkedIn.target, '_blank');
  assert.match(linkedIn.rel, /noopener/);
  assert.match(linkedIn.text, path.startsWith('/ru') ? /новой вкладке/ : /new tab/);
  assert.equal(data.footer.text, path.startsWith('/ru') ? 'Авторские права 2026' : 'Copyright 2026');
  observations.push({ path, width, ...data });
  console.log('PASS contact/footer', path, width);
}
try {
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  for (const width of [1440, 360]) {
    await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
    const paths = ['/', '/ru/', '/about', '/ru/about', ...slugs.flatMap(slug => ['/work/' + slug, '/ru/work/' + slug]), '/404', '/500', '/kit'];
    for (const path of paths) {
      await go(path);
      // /kit uses BaseLayout and has an isolated Footer fixture, no shared ContactBlock.
      if (path === '/kit') {
        const footer = await page.$eval('footer.footer', node => node.textContent.trim().replace(/\s+/g, ' '));
        assert.equal(footer, 'Copyright 2026');
        observations.push({ path, width, footer });
        continue;
      }
      await readContact(path, width);
      if (['/', '/ru/', '/about', '/work/agent-ops-console', '/404'].includes(path)) {
        await page.screenshot({ path: output + path.replaceAll('/', '_') + '-' + width + '.png' });
      }
    }
  }
  for (const path of ['/', '/ru/']) {
    await page.setViewport({ width: 1440, height: 1000 });
    await go(path);
    const button = await page.$('[data-copy-trigger]');
    await button.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.querySelector('[data-copy-trigger]').dataset.state === 'copied');
    const result = await page.evaluate(async () => ({
      clipboard: await navigator.clipboard.readText(),
      announcement: document.querySelector('[data-copy-status]').textContent,
      live: document.querySelector('[data-copy-status]').getAttribute('aria-live'),
      hint: document.querySelector('[data-copy-hint]').textContent,
    }));
    assert.equal(result.clipboard, email);
    assert.equal(result.live, 'polite');
    assert.equal(result.hint, path.startsWith('/ru') ? 'Скопировано' : 'Copied');
    assert(result.announcement.length > 10);
    await page.waitForFunction(() => document.querySelector('[data-copy-trigger]').dataset.state === 'default');
    assert.equal(await page.$eval('[data-copy-hint]', node => node.textContent), email);
    controls.push({ path, test: 'keyboard copy/reset', ...result });
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('simulated permission denial')) } }));
    await button.focus();
    await page.keyboard.press('Space');
    await page.waitForFunction(() => !document.querySelector('[data-copy-failure]').hidden);
    const fallback = await page.evaluate(() => ({
      address: document.querySelector('[data-copy-hint]').textContent,
      selectable: getComputedStyle(document.querySelector('[data-copy-hint]')).userSelect,
      visible: !document.querySelector('[data-copy-failure]').hidden,
      announcement: document.querySelector('[data-copy-status]').textContent,
    }));
    assert.equal(fallback.address, email);
    assert.equal(fallback.selectable, 'all');
    assert.equal(fallback.visible, true);
    assert(fallback.announcement.length > 10);
    controls.push({ path, test: 'clipboard failure', ...fallback });
    await page.evaluate(() => document.querySelector('#contact .copy-email__address').focus());
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), path.startsWith('/ru') ? '/cv-ru.pdf' : '/cv.pdf');
    await page.keyboard.press('Tab');
    assert.match(await page.evaluate(() => document.activeElement.getAttribute('href')), /linkedin/);
    controls.push({ path, test: 'contact keyboard order', order: ['mailto', 'CV', 'LinkedIn'] });
  }
  for (const path of ['/cv.pdf', '/cv-ru.pdf']) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /pdf/);
    controls.push({ path, test: 'local CV', status: response.status });
  }
  await page.setJavaScriptEnabled(false);
  await go('/ru/');
  await page.$eval('#contact', node => node.scrollIntoView());
  assert.equal(await page.$eval('#contact a[href^="mailto:"]', node => node.textContent.trim()), email);
  controls.push({ test: 'no JavaScript', path: '/ru/', mailto: true });
  assert.equal(errors.length, 0, JSON.stringify(errors));
  console.log('PASS', observations.length, 'route/width observations;', controls.length, 'control checks');
} finally {
  writeFileSync(output + 'verification.json', JSON.stringify({ date: '2026-10-07', origin, observations, controls, errors }, null, 2));
  await browser.close();
}

