/**
 * harmony-check — машинная часть приёмки кейса и главной.
 *
 * Правила — research/portfolio-benchmark/harmony-checklist.md §4, карта
 * разметки — ds/screens/case.md §10. Скрипт читает только атрибуты data-h,
 * которые ставят модули кейса, поэтому не зависит от классов вёрстки.
 *
 *   plate    поля верх/низ и лево/право — разница ≤ 2 px (правило 5);
 *            ни один потомок не выходит за плашку без класса *-bleed (3).
 *            Содержимое прокручиваемых областей не считается: оно и так
 *            внутри своей области.
 *   img      одинаковые картинки (SHA-1 файла) не стоят подряд внутри
 *            data-h="case" (правило 13)
 *   caption  ≤ 12 слов (10) · para ≤ 35 слов · case ≤ 450 слов
 *   thesis   нет строк из одного слова (9)
 *   page     нет горизонтальной прокрутки страницы (мобильный — раскладка)
 *
 * Запуск: npm run build && npm run check:harmony [-- /kit /work/x]
 *   --base=http://host:port  проверять уже поднятый сервер; без него скрипт
 *                            сам поднимает astro preview на свободном порту
 *   --widths=1440,1024,390,360   ширины окна
 *   --height=600             короткое окно; default 900
 * Editorial limits are ceilings, never minimum words or fixed section counts.
 *
 * Код выхода 1 при любом нарушении.
 */
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import process from 'node:process';

const LIMITS = { caption: 12, para: 35, case: 450, plateDelta: 2, overflow: 1 };

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const paths = args.filter((a) => !a.startsWith('--'));
if (paths.length === 0) paths.push('/kit');
const widths = opt('widths', '1440,1024,390').split(',').map(Number);
const height = Number(opt('height', '900'));
let base = opt('base', '');

/* ---------- Playwright ---------- */

/**
 * В проекте Playwright не стоит зависимостью: съёмочные скрипты берут его
 * из соседнего репозитория прототипа (scripts/build-home-covers.mjs).
 * Сначала — свой node_modules, затем тот же соседний путь.
 */
async function loadChromium() {
  try {
    return (await import('playwright')).chromium;
  } catch {
    const require = createRequire('d:/Claude-projects/Agent-ops-console/package.json');
    return require('playwright').chromium;
  }
}

async function launch(chromium) {
  try {
    return await chromium.launch();
  } catch {
    const fallback =
      process.env.HARMONY_CHROME ??
      'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
    return chromium.launch({ executablePath: fallback });
  }
}

/* ---------- сервер ---------- */

async function startPreview() {
  if (!existsSync('dist')) throw new Error('Нет dist/: сначала npm run build');
  const port = 4300 + Math.floor(Math.random() * 300);
  const child = spawn('npx', ['astro', 'preview', '--port', String(port)], {
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const url = `http://localhost:${port}`;
  for (let i = 0; i < 100; i++) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return { url, child };
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  child.kill();
  throw new Error('astro preview не поднялся за 20 с');
}

function stopPreview(child) {
  if (!child) return;
  if (process.platform === 'win32') spawn('taskkill', ['/pid', String(child.pid), '/t', '/f']);
  else child.kill();
}

/* ---------- замер в странице ---------- */

/** Выполняется в браузере. Возвращает сырые замеры, решения — в Node. */
function measure(limits) {
  const words = (text) =>
    text
      .replace(/(\d)[\s\u00a0](?=\d{3}\b)/g, '$1')
      .split(/[\s\u00a0]+/)
      .filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

  const short = (el) => {
    const cls = typeof el.className === 'string' ? el.className.split(/\s+/)[0] : '';
    return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}`;
  };

  const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();

  const isBleed = (el, stop) => {
    for (let n = el; n && n !== stop; n = n.parentElement) {
      if ([...n.classList].some((c) => c === '-bleed' || c.endsWith('-bleed'))) return true;
    }
    return false;
  };

  const inScroller = (el, stop) => {
    for (let n = el.parentElement; n && n !== stop; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') return true;
    }
    return false;
  };

  const hidden = (el) => {
    for (let node = el; node; node = node.parentElement) {
      const cs = getComputedStyle(node);
      if (cs.display === 'none' || cs.visibility === 'hidden' || node.classList.contains('ds-visually-hidden') || node.getAttribute('aria-hidden') === 'true') return true;
    }
    return false;
  };

  const out = { plates: [], texts: [], theses: [], cases: [], pageOverflow: 0 };

  out.pageOverflow = document.documentElement.scrollWidth - window.innerWidth;

  document.querySelectorAll('[data-h="plate"]').forEach((plate, index) => {
    const box = plate.getBoundingClientRect();
    const kids = [...plate.children].filter((k) => !hidden(k) && !isBleed(k, plate));
    const rects = kids.map((k) => k.getBoundingClientRect()).filter((r) => r.width && r.height);
    const entry = { index, name: short(plate.parentElement ?? plate), pad: null, outside: [] };
    if (rects.length) {
      const u = {
        top: Math.min(...rects.map((r) => r.top)),
        left: Math.min(...rects.map((r) => r.left)),
        bottom: Math.max(...rects.map((r) => r.bottom)),
        right: Math.max(...rects.map((r) => r.right)),
      };
      entry.pad = {
        top: u.top - box.top,
        bottom: box.bottom - u.bottom,
        left: u.left - box.left,
        right: box.right - u.right,
      };
    }
    plate.querySelectorAll('*').forEach((el) => {
      if (hidden(el) || isBleed(el, plate) || inScroller(el, plate)) return;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const over = Math.max(box.left - r.left, r.right - box.right, box.top - r.top, r.bottom - box.bottom);
      if (over > 1) entry.outside.push(`${short(el)} на ${Math.round(over)} px`);
    });
    out.plates.push(entry);
  });

  document.querySelectorAll('[data-h="caption"], [data-h="para"]').forEach((el) => {
    if (hidden(el)) return;
    out.texts.push({ kind: el.dataset.h, words: words(text(el)), text: text(el) });
  });

  document.querySelectorAll('[data-h="thesis"]').forEach((el) => {
    if (hidden(el)) return;
    const lines = new Map();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const re = /\S+/g;
      let m;
      while ((m = re.exec(node.data))) {
        const range = document.createRange();
        range.setStart(node, m.index);
        range.setEnd(node, m.index + m[0].length);
        const rect = range.getClientRects()[0];
        if (!rect) continue;
        const key = Math.round(rect.top / 4);
        lines.set(key, [...(lines.get(key) ?? []), m[0]]);
      }
    }
    const all = [...lines.values()];
    const lonely = all.length > 1 ? all.filter((l) => l.length === 1).map((l) => l[0]) : [];
    out.theses.push({ text: text(el), lines: all.length, lonely });
  });

  document.querySelectorAll('[data-h="case"]').forEach((root, index) => {
    const nodes = [...root.querySelectorAll('[data-h="thesis"], [data-h="para"], [data-h="caption"], [data-h="lead"]')].filter(el => !hidden(el));
    let total = nodes.reduce((sum, el) => sum + words(text(el)), 0);
    if (root.dataset.storyVersion === 'blocks-v1') {
      // Count the complete editorial story, including facts, labels and outcome.
      // Documentary typography/specimens and navigation have their own content.
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const visibleCopy = [];
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const parent = node.parentElement;
        if (!parent || hidden(parent) || parent.closest('[data-story-document], [data-h-utility], .case-next, script, style, svg')) continue;
        visibleCopy.push(node.textContent);
      }
      total = words(visibleCopy.join(' '));
    }
    const images = [...root.querySelectorAll('img')]
      .filter((img) => !hidden(img))
      .map((img) => img.currentSrc || img.src);
    out.cases.push({ index, id: root.id || `case-${index}`, words: total, images, wordBudget: Number(root.dataset.wordBudget) || limits.case });
  });

  return out;
}

/* ---------- проверки ---------- */

const hashes = new Map();
async function hashOf(url) {
  if (!hashes.has(url)) {
    const res = await fetch(url);
    const buf = Buffer.from(await res.arrayBuffer());
    hashes.set(url, createHash('sha1').update(buf).digest('hex'));
  }
  return hashes.get(url);
}

const failures = [];
const fail = (where, rule, detail) => failures.push({ where, rule, detail });

const chromium = await loadChromium();
let preview = null;
if (!base) {
  preview = await startPreview();
  base = preview.url;
}
const browser = await launch(chromium);

try {
  for (const path of paths) {
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
      await page.goto(base + path, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const m = await page.evaluate(measure, LIMITS);
      await page.close();
      const where = `${path} @${width}`;

      if (m.pageOverflow > 0) fail(where, 'страница', `горизонтальная прокрутка ${m.pageOverflow} px`);

      for (const p of m.plates) {
        if (p.pad) {
          const dv = Math.abs(p.pad.top - p.pad.bottom);
          const dh = Math.abs(p.pad.left - p.pad.right);
          if (dv > LIMITS.plateDelta || dh > LIMITS.plateDelta) {
            const r = (n) => Math.round(n);
            fail(
              where,
              'поля плашки',
              `#${p.index} ${p.name}: верх ${r(p.pad.top)} / низ ${r(p.pad.bottom)}, лево ${r(p.pad.left)} / право ${r(p.pad.right)}`,
            );
          }
        }
        for (const o of p.outside) fail(where, 'выход за плашку', `#${p.index} ${p.name}: ${o}`);
      }

      // Слова и строки от ширины не зависят — кроме строк тезиса.
      if (width === widths[0]) {
        for (const t of m.texts) {
          const limit = LIMITS[t.kind];
          if (t.words > limit) fail(path, t.kind === 'caption' ? 'подпись' : 'абзац', `${t.words} > ${limit}: «${t.text}»`);
        }
        for (const c of m.cases) {
          if (c.words > c.wordBudget) fail(path, 'кейс', `${c.id}: ${c.words} > ${c.wordBudget} слов`);
          for (let i = 1; i < c.images.length; i++) {
            const [a, b] = [c.images[i - 1], c.images[i]];
            if ((await hashOf(a)) === (await hashOf(b))) fail(path, 'кадры подряд', `${c.id}: ${b}`);
          }
        }
      }

      for (const t of m.theses) {
        if (t.lonely.length) fail(where, 'тезис', `строка из одного слова «${t.lonely.join('», «')}»: «${t.text}»`);
      }

      const summary = m.cases.map((c) => `${c.id} ${c.words} слов, ${c.images.length} кадров`).join('; ');
      console.log(
        `${where}: плашек ${m.plates.length}, тезисов ${m.theses.length}, подписей и абзацев ${m.texts.length}` +
          (summary ? ` · ${summary}` : ''),
      );
    }
  }
} finally {
  await browser.close();
  stopPreview(preview?.child);
}

if (failures.length) {
  console.log(`\n✗ Нарушений: ${failures.length}`);
  for (const f of failures) console.log(`  [${f.rule}] ${f.where} — ${f.detail}`);
  process.exitCode = 1;
} else {
  console.log('\n✓ harmony-check: нарушений нет');
}
