import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'file:///D:/Claude-projects/learn/landing/app/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';

const output = fileURLToPath(new URL('./06-evidence/', import.meta.url));
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const states = [];
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
function contrast(fg, bg) {
  const luminance = rgb => {
    const parts = rgb.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => {
      v /= 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return parts[0] * 0.2126 + parts[1] * 0.7152 + parts[2] * 0.0722;
  };
  const a = luminance(fg), b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto('http://127.0.0.1:4406/about', { waitUntil: 'networkidle0' });
  const active = await page.$eval('.navbar a.is-active[aria-current="page"]', a => ({
    href: a.getAttribute('href'),
    transform: getComputedStyle(a.querySelector('.ds-link__rule')).transform,
  }));
  assert.equal(active.href, '/about');
  assert.equal(active.transform, 'matrix(1, 0, 0, 1, 0, 0)');
  states.push({ test: 'active nav', ...active });
  await page.goto('http://127.0.0.1:4406/kit', { waitUntil: 'networkidle0' });
  const inline = await page.$eval('.ds-link--inline .ds-link__label', node => getComputedStyle(node).textDecorationLine);
  assert.match(inline, /underline/);
  states.push({ test: 'prose inline underline', decoration: inline });
  await page.goto('http://127.0.0.1:4406/work/agent-ops-console', { waitUntil: 'networkidle0' });
  // Rendered TextLink copied to a test-only dark surface; class matches onInverse output.
  await page.evaluate(() => {
    const source = document.querySelector('#contact .ds-link--arrow');
    const fixture = document.createElement('div');
    fixture.id = 'inverse-test';
    fixture.style.cssText = 'position:fixed;inset:100px auto auto 100px;padding:var(--space-8);background:var(--surface-inverse);z-index:999';
    const link = source.cloneNode(true);
    link.id = 'inverse-link';
    link.classList.add('is-inverse');
    fixture.append(link);
    document.body.append(fixture);
  });
  const read = async state => {
    const values = await page.$eval('#inverse-link', link => ({
      color: getComputedStyle(link).color,
      background: getComputedStyle(link.parentElement).backgroundColor,
      outline: getComputedStyle(link).outlineStyle,
      outlineColor: getComputedStyle(link).outlineColor,
      underline: getComputedStyle(link.querySelector('.ds-link__rule')).transform,
      arrow: getComputedStyle(link.querySelector('svg')).transform,
      duration: getComputedStyle(link).transitionDuration,
    }));
    const ratio = contrast(values.color, values.background);
    assert(ratio >= 4.5, state + ' contrast ' + ratio);
    states.push({ test: 'inverse ' + state, ...values, contrast: ratio });
    return values;
  };
  const initial = await read('default');
  assert(parseFloat(initial.duration) < 0.001);
  await page.hover('#inverse-link');
  await wait(40);
  const hover = await read('hover');
  assert.equal(hover.underline, 'matrix(1, 0, 0, 1, 0, 0)');
  assert.equal(hover.color, initial.color);
  await page.mouse.move(0, 0);
  await page.$eval('#inverse-link', node => node.focus());
  await page.keyboard.press('Tab');
  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');
  const focus = await read('keyboard focus');
  assert.equal(focus.outline, 'solid');
  assert.equal(focus.outlineColor, focus.color);
  await page.hover('#inverse-link');
  await page.mouse.down();
  await wait(30);
  const pressed = await read('pressed');
  assert.equal(pressed.color, 'rgb(255, 255, 255)');
  await page.mouse.move(0, 0);
  await page.mouse.up();
  await page.screenshot({ path: output + 'inverse-keyboard-focus-1440.png' });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await page.goto('http://127.0.0.1:4406/#contact', { waitUntil: 'networkidle0' });
  await wait(600);
  const normal = await page.$eval('#contact', contact => ({
    opacity: getComputedStyle(contact).opacity,
    transition: getComputedStyle(contact.querySelector('.ds-link')).transitionDuration,
  }));
  assert.equal(normal.opacity, '1');
  assert(parseFloat(normal.transition) > 0);
  states.push({ test: 'normal motion contact', ...normal });
  console.log('PASS', states.length, 'state/contrast checks');
} finally {
  writeFileSync(output + 'states.json', JSON.stringify({ date: '2026-10-07', states }, null, 2));
  await browser.close();
}
