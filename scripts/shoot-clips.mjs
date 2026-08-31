/**
 * Клипы взаимодействия — `CASE-20` в части «видео реального взаимодействия».
 *
 * Ролик снимается с **живого прототипа**, а не собирается из макетов: Playwright
 * по-настоящему водит мышь и нажимает, прототип по-настоящему отвечает. Это
 * ровно то доказательство, ради которого требование заведено, и одновременно —
 * причина, по которой запись автоматизирована, а не сделана рукой: пересъёмка
 * стоит одну команду, обе локали идут одним прогоном, и кадр не «получился», а
 * воспроизводится.
 *
 * **`CASE-20` не нарушается.** Ни рамки устройства, ни перспективы, ни наклона,
 * ни обработки: в кадре окно продукта 1:1. Единственное, что дописано поверх
 * страницы, — указатель мыши (см. §Указатель): системный курсор в запись
 * не попадает физически, и без него интерфейс отвечал бы сам себе.
 *
 * ## Указатель
 *
 * Chrome отдаёт кадры без курсора — его рисует не страница, а композитор ОС.
 * Поэтому указатель здесь свой, DOM-узел поверх страницы, и ведёт его не
 * скрипт, а сама страница: узел подписан на `mousemove`. Двигается настоящая
 * мышь Playwright — значит, наведение, фокус и нажатие срабатывают в продукте
 * по-настоящему, а нарисованная стрелка физически не может разойтись с тем,
 * что происходит в интерфейсе. Рассинхрон «курсор здесь, а подсветка там»
 * этой схемой исключён, а не выверен на глаз.
 *
 * ## Почему движение выглядит человеческим
 *
 * Линейный проезд из точки в точку читается машинным мгновенно. Здесь рука
 * моделируется тремя вещами, и все три — из моторики, а не из вкуса:
 *
 * 1. **Две фазы по Фиттсу.** Баллистический бросок покрывает ~96 % расстояния
 *    с торможением, дальше — короткая корректирующая доводка. Так работает
 *    рука: сначала грубо и быстро, потом точно и медленно.
 * 2. **Дуга.** Прямая линия — признак машины. Траектория выгибается
 *    перпендикуляром, амплитуда от длины броска, на концах ноль.
 * 3. **Микродрожь и паузы.** Дрожание гаснет к цели; перед нажатием рука
 *    замирает на 90–160 мс, после нажатия — держит.
 *
 * Длительность броска берётся законом Фиттса от расстояния, а не константой:
 * короткий подвод обязан быть быстрым, длинный — заметным.
 *
 * ## Запись
 *
 * `Page.startScreencast` через CDP, а не `recordVideo` Playwright: последний
 * даёт VP8 фиксированного качества без управления битрейтом и без честных
 * таймстемпов. Скринкаст присылает кадры с временем съёмки, поэтому тайминг
 * ролика — настоящий, а не «примерно 25 fps». Съёмка идёт при
 * `deviceScaleFactor` 2 с даунскейлом до ширины артборда: текст интерфейса
 * получается суперсэмплингом, а не растягиванием.
 *
 * Кодирование — ffmpeg: WebM/VP9 основным и MP4/H.264 фолбэком (Safari),
 * без звука, плюс постер-кадр webp. Постер обязателен: `MediaFrame` резервирует
 * им место до загрузки и показывает его же при `prefers-reduced-motion`.
 *
 * ## Сценарий возвращается в начало
 *
 * Ролик идёт петлёй, поэтому последний кадр обязан сходиться с первым: сценарий
 * заканчивается возвратом на тот экран, с которого начался. Иначе петля даёт
 * рывок на стыке — единственное место, где склейка была бы заметна.
 *
 * Запуск:
 *   1. поднять стенд кейса: Agent-ops-console — 5300 (npm run dev -- --port 5300)
 *   2. здесь — node scripts/shoot-clips.mjs agent-ops
 *
 * Playwright берётся из репозитория прототипа: у этого сайта одна JS-зависимость.
 */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import os from 'node:os';

import sharp from 'sharp';

/** Съёмка с запасом по плотности, выдача — в ширину артборда. */
const DEVICE_SCALE_FACTOR = 2;
/** Качество кадров скринкаста. Промежуточный формат, не выдача. */
const FRAME_QUALITY = 92;
/** Частота выдачи. Скринкаст присылает кадры по изменению, здесь — CFR. */
const FPS = 30;

const SCRATCH = path.join(os.tmpdir(), 'site-portfolio-clips');

/* ------------------------------------------------------------------ *
 * Указатель
 * ------------------------------------------------------------------ */

/**
 * Стрелка ставится остриём в точку курсора: у элемента нулевые поля, а
 * вершина пути лежит в начале координат viewBox.
 *
 * Белая заливка с тёмной обводкой — не вкус, а единственный вариант,
 * читаемый и на светлом, и на тёмном интерфейсе; ровно так же устроены
 * системные указатели macOS и Windows. Консоль Agent Ops тёмная, кейсы
 * дальше по списку — светлые, и указатель обязан работать в обоих.
 *
 * Узел садится на `body`, а не на `documentElement`: инициализирующий
 * скрипт выполняется до разбора разметки, `body` в этот момент ещё нет, а
 * прямой ребёнок `<html>` в кадр не попадает. Отсюда же отложенный монтаж
 * по `DOMContentLoaded` и проверка на присутствие узла вместо флага: при
 * навигации внутри SPA узел может быть снят вместе с поддеревом, и тогда
 * повторный вызов обязан поставить его заново.
 */
const CURSOR_SCRIPT = `(() => {
  const mount = () => {
    if (document.getElementById('__cursor')) return;

    const style = document.createElement('style');
    style.id = '__cursorStyle';
    style.textContent = [
      '#__cursor{position:fixed;left:0;top:0;width:24px;height:24px;z-index:2147483647;',
      'pointer-events:none;transform:translate3d(-200px,-200px,0);will-change:transform}',
      '#__cursor svg{display:block;filter:drop-shadow(0 1.5px 2.5px rgba(0,0,0,.45))}',
      '#__cursor .g{transition:transform .09s ease-out;transform-origin:2px 2px}',
      '#__cursor.__down .g{transform:scale(.82)}',
      '#__ripple{position:fixed;left:0;top:0;width:32px;height:32px;margin:-16px 0 0 -16px;',
      'border-radius:50%;border:2px solid rgba(255,255,255,.85);z-index:2147483646;',
      'pointer-events:none;opacity:0;filter:drop-shadow(0 0 1.5px rgba(0,0,0,.6));',
      'transform:translate3d(-200px,-200px,0) scale(.3)}'
    ].join('');

    const wrap = document.createElement('div');
    wrap.id = '__cursor';
    wrap.innerHTML = '<svg width="24" height="24" viewBox="-1.2 -1.2 24 24">'
      + '<path class="g" d="M0 0 L0 17.2 L4.5 13.1 L7.4 19.8 L10.2 18.5 L7.3 12 L13.2 11.8 Z" '
      + 'fill="#ffffff" stroke="#111111" stroke-width="1.4" stroke-linejoin="round"/></svg>';

    const ripple = document.createElement('div');
    ripple.id = '__ripple';

    const host = document.body || document.documentElement;
    host.appendChild(style);
    host.appendChild(wrap);
    host.appendChild(ripple);
  };

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);

  if (window.__cursorBound) return;
  window.__cursorBound = true;

  let x = -200;
  let y = -200;
  // Ведёт страница, а не скрипт: указатель подписан на настоящую мышь.
  addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
    const wrap = document.getElementById('__cursor');
    if (wrap) wrap.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
  }, true);

  window.__press = (down) => {
    document.getElementById('__cursor')?.classList.toggle('__down', down);
    if (down) return;
    const at = 'translate3d(' + x + 'px,' + y + 'px,0)';
    document.getElementById('__ripple')?.animate(
      [
        { opacity: 0.75, transform: at + ' scale(.3)' },
        { opacity: 0, transform: at + ' scale(1.3)' },
      ],
      { duration: 420, easing: 'ease-out' },
    );
  };
})()`;

/* ------------------------------------------------------------------ *
 * Моторика
 * ------------------------------------------------------------------ */

const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * Траектория броска: две фазы по Фиттсу, дуга перпендикуляром и микродрожь,
 * гаснущая к цели. Разбор — в шапке файла.
 */
function makePath(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = -dy / dist;
  const ny = dx / dist;
  const bow = (Math.random() < 0.5 ? -1 : 1) * Math.min(dist * 0.075, 44);
  const seed = Math.random() * Math.PI * 2;

  return (t) => {
    const s = t < 0.72
      ? 0.96 * easeOutQuad(t / 0.72)
      : 0.96 + 0.04 * easeInOutSine((t - 0.72) / 0.28);
    const arc = Math.sin(Math.PI * s) * bow;
    const tremor = (1 - s) * 0.9;
    return {
      x: from.x + dx * s + nx * arc + Math.sin(seed + s * 11) * tremor,
      y: from.y + dy * s + ny * arc + Math.cos(seed * 1.7 + s * 13) * tremor,
    };
  };
}

/** Закон Фиттса вместо константы: длинный подвод обязан читаться дольше. */
const durationFor = (dist) => clamp(150 + 125 * Math.log2(1 + dist / 40), 240, 980);

class Hand {
  constructor(page) {
    this.page = page;
    this.at = { x: 40, y: 980 };
  }

  /** Шаг по времени, а не по счётчику: задержки CDP не растягивают движение. */
  async moveTo(to) {
    const dist = Math.hypot(to.x - this.at.x, to.y - this.at.y);
    if (dist < 1) return;
    const ms = durationFor(dist);
    const at = makePath(this.at, to);
    const t0 = Date.now();
    for (;;) {
      const t = Math.min(1, (Date.now() - t0) / ms);
      const p = at(t);
      await this.page.mouse.move(p.x, p.y);
      if (t >= 1) break;
    }
    this.at = to;
  }

  async click(locator) {
    const box = await locator.boundingBox();
    if (!box) throw new Error('цель нажатия не видна на экране');
    // Не в геометрический центр: рука не попадает в пиксель.
    await this.moveTo({
      x: box.x + box.width * (0.42 + Math.random() * 0.16),
      y: box.y + box.height * (0.42 + Math.random() * 0.16),
    });
    await this.page.waitForTimeout(90 + Math.random() * 70);
    await this.page.evaluate(() => window.__press?.(true));
    await this.page.mouse.down();
    await this.page.waitForTimeout(70);
    await this.page.mouse.up();
    await this.page.evaluate(() => window.__press?.(false));
  }

  /**
   * Набор с человеческим ритмом. Постоянная задержка между символами
   * читается машинной так же безошибочно, как прямая траектория курсора,
   * поэтому шаг плавает, пробел стоит чуть дольше буквы, а точка и тире
   * дают паузу — на знаках препинания рука действительно останавливается.
   */
  async type(text) {
    for (const ch of text) {
      await this.page.keyboard.type(ch);
      let pause = 38 + Math.random() * 55;
      if (ch === ' ') pause += 28;
      if ('.,—:'.includes(ch)) pause += 130;
      await this.page.waitForTimeout(pause);
    }
  }

  /** Наведение без нажатия: состояние hover — тоже доказательство. */
  async hover(locator, hold = 320) {
    const box = await locator.boundingBox();
    if (!box) throw new Error('цель наведения не видна на экране');
    await this.moveTo({ x: box.x + box.width * 0.35, y: box.y + box.height / 2 });
    await this.page.waitForTimeout(hold);
  }
}

/* ------------------------------------------------------------------ *
 * Кейсы
 * ------------------------------------------------------------------ */

/**
 * Полосы прокрутки и оболочка прототипа — те же правила, что у съёмки
 * кадров (`shoot-range-frames.mjs`). Указатель к оболочке не относится:
 * он добавляется отдельным скриптом и живёт на `documentElement`.
 */
const HIDE_CHROME = `
  html { scrollbar-width: none; }
  *::-webkit-scrollbar { width: 0; height: 0; }
  [class*="viewerBack"], [class*="protoToggle"], [class*="protoPanel"] { display: none !important; }
  [class*="viewer"] { padding-block-start: 0 !important; }
`;

const CASES = {
  'agent-ops': {
    repo: 'd:/Claude-projects/Agent-ops-console',
    origin: process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5300',
    media: 'public/media/case-agent-ops',
    mediaRu: 'public/media/case-agent-ops-ru',
    out: 'clip-review-decision',
    /** Артборд консоли — тот же, что у кадров кейса. Высота чётная: yuv420p. */
    width: 1640,
    height: 1024,
    /**
     * Фраза обоснования. Это публикуемый текст, а не тестовые данные:
     * она видна в кадре на обеих версиях сайта. Сказанное в ней —
     * ровно та находка, которую панель «почему агент ответил так»
     * показывает справа: обещание кредита без источника в базе знаний.
     * Решение владельца от 31.08.2026.
     */
    note: {
      en: 'Credit promised without a source.',
      ru: 'Кредит обещан без источника.',
    },
    /**
     * Сценарий — рабочий такт проверяющего целиком: навести строку очереди,
     * открыть прогон, вынести вердикт, написать обоснование, отправить и
     * вернуться в очередь.
     *
     * Вердикт взят «Correct, but risky» намеренно, хотя «Correct» отправился
     * бы одним нажатием. Консоль не пропускает оговорку без предложения — и
     * это её тезис, а не придирка формы: вердикт уходит дальше вместе с
     * фразой, по которой следующий человек поймёт, что было не так. Ролик,
     * обходящий это поле, показывал бы список задач, а не разбор.
     *
     * «[0] Don't know» отклонён по другой причине: он раскрывает поле
     * «что спросить у руководителя смены», то есть эскалацию — отдельный
     * сюжет, к такту разбора не относящийся.
     *
     * Возврат в очередь обязателен: ролик идёт петлёй, а очередь после
     * отправки не меняется — счётчик и строки те же, и стык не виден.
     */
    async scenario(page, hand, { localize, note }) {
      const row = page.locator('[class*="runTable"] [class*="row"]').nth(2);

      await page.waitForTimeout(300);
      await hand.hover(row, 300);
      await hand.click(row.locator('a').first());
      await page.waitForTimeout(560);
      await localize();

      // Вердикты — радиогруппа в футере разбора; во второй позиции всегда
      // «с оговоркой», в обеих локалях. Кнопка отправки — последняя в main,
      // возврат в очередь — первая.
      await page.waitForTimeout(420);
      await hand.click(page.locator('[role="radiogroup"] label').nth(1));

      // Поле раскрывается вердиктом, поэтому ждать его надо явно, а не паузой.
      const field = page.locator('main textarea');
      await field.waitFor({ state: 'visible' });
      await page.waitForTimeout(260);
      await hand.click(field);
      await page.waitForTimeout(180);
      await hand.type(note);

      await page.waitForTimeout(380);
      await hand.click(page.locator('main button').last());
      await page.waitForTimeout(950);
      await localize();
      await hand.click(page.locator('main button').first());
      await page.waitForTimeout(620);
    },
    /** Вход в очередь: роль ставится на индексе, маршрут — pushState в SPA. */
    async open(page, { origin, prefix, localize }) {
      await page.goto(`${origin}${prefix}/`, { waitUntil: 'networkidle' });
      await localize();
      await page.getByRole('link', { name: /Martin K./ }).first().click();
      await page.waitForTimeout(250);
      await page.evaluate((to) => {
        window.history.pushState(null, '', to);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, `${prefix}/screens/review-queue`);
      await page.waitForTimeout(650);
      await localize();
    },
  },
};

/* ------------------------------------------------------------------ *
 * Кодирование
 * ------------------------------------------------------------------ */

function run(bin, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    child.stderr.on('data', (d) => { err += d; });
    child.on('error', reject);
    child.on('close', (code) =>
      (code === 0 ? resolve() : reject(new Error(`${bin} → ${code}\n${err.slice(-1400)}`))));
  });
}

/**
 * Кадры лежат на диске, тайминг — в списке concat: длительность каждого
 * равна расстоянию до следующего по часам съёмки. Дальше ffmpeg приводит
 * это к постоянным 30 fps.
 */
async function encode(frames, outBase) {
  const dir = path.join(SCRATCH, path.basename(outBase));
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  const name = (i) => path.join(dir, `f${String(i).padStart(5, '0')}.jpg`).replace(/\\/g, '/');
  const lines = [];
  for (let i = 0; i < frames.length; i += 1) {
    await writeFile(name(i), Buffer.from(frames[i].data, 'base64'));
    const next = frames[i + 1];
    const dur = next ? Math.max(1 / 120, next.t - frames[i].t) : 1 / FPS;
    lines.push(`file '${name(i)}'`, `duration ${dur.toFixed(4)}`);
  }
  // Демультиплексор concat теряет последний кадр без повтора имени.
  lines.push(`file '${name(frames.length - 1)}'`);

  const list = path.join(dir, 'list.txt');
  await writeFile(list, lines.join('\n'));

  const input = ['-y', '-f', 'concat', '-safe', '0', '-i', list];
  // Нечётная сторона несовместима с yuv420p — оба кодека упали бы на ней.
  const common = ['-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', '-r', String(FPS), '-an'];

  await run('ffmpeg', [...input, ...common,
    '-c:v', 'libvpx-vp9', '-crf', '33', '-b:v', '0', '-row-mt', '1',
    '-pix_fmt', 'yuv420p', `${outBase}.webm`]);

  await run('ffmpeg', [...input, ...common,
    '-c:v', 'libx264', '-crf', '23', '-preset', 'slow',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${outBase}.mp4`]);

  // Постер — первый кадр ролика: стыка при запуске не возникает.
  await sharp(Buffer.from(frames[0].data, 'base64'))
    .webp({ quality: 82 })
    .toFile(`${outBase}-poster.webp`);

  await rm(dir, { recursive: true, force: true });
}

/* ------------------------------------------------------------------ *
 * Съёмка
 * ------------------------------------------------------------------ */

async function shootLocale(browser, config, locale, dir) {
  const prefix = locale === 'ru' ? '/ru' : '';
  const context = await browser.newContext({
    viewport: { width: config.width, height: config.height },
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    colorScheme: 'light',
    // Движение продукта — содержание ролика, глушить его нечем.
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  await page.addInitScript(CURSOR_SCRIPT);

  /**
   * Приведение экрана в съёмочный вид после каждой навигации: оболочка
   * прототипа, шрифты, локаль — и указатель. Указатель здесь же, потому что
   * переход внутри SPA может снять его вместе с поддеревом, а проверять это
   * глазами на готовом ролике — самый дорогой способ узнать.
   */
  const localize = async () => {
    await page.addStyleTag({ content: HIDE_CHROME });
    await page.evaluate(CURSOR_SCRIPT);
    await page.evaluate(() => document.fonts.ready);
    if (locale !== 'ru') return;
    await page.evaluate(() => window.dispatchEvent(new Event('ru:localize')));
    await page.waitForTimeout(280);
  };

  await config.open(page, { origin: config.origin, prefix, localize });
  if (locale === 'ru') {
    const lang = await page.evaluate(() => document.documentElement.lang);
    if (lang !== 'ru') throw new Error('русская локаль не активна');
  }

  const hand = new Hand(page);
  // Указатель входит в кадр с края, а не возникает посреди экрана.
  await page.mouse.move(hand.at.x, hand.at.y);

  const client = await context.newCDPSession(page);
  const frames = [];
  client.on('Page.screencastFrame', (frame) => {
    frames.push({ data: frame.data, t: frame.metadata.timestamp });
    client.send('Page.screencastFrameAck', { sessionId: frame.sessionId }).catch(() => {});
  });
  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: FRAME_QUALITY,
    maxWidth: config.width,
    maxHeight: config.height,
    everyNthFrame: 1,
  });

  await config.scenario(page, hand, { prefix, localize, note: config.note?.[locale] });

  await client.send('Page.stopScreencast');
  await context.close();

  if (frames.length < 30) throw new Error(`кадров ${frames.length} — скринкаст не пошёл`);
  const seconds = frames.at(-1).t - frames[0].t;
  console.log(`  ${locale}: ${frames.length} кадров, ${seconds.toFixed(1)} с, `
    + `${(frames.length / seconds).toFixed(1)} fps`);

  await mkdir(path.resolve(dir), { recursive: true });
  const outBase = path.resolve(dir, config.out);
  await encode(frames, outBase);
  return outBase;
}

async function shootCase(name) {
  const config = CASES[name];
  if (!config) throw new Error(`кейс ${name} не описан в CASES`);

  const require = createRequire(path.join(config.repo, 'package.json'));
  const { chromium } = require('playwright');
  const browser = await chromium.launch();

  for (const [locale, dir] of [['en', config.media], ['ru', config.mediaRu]]) {
    const base = await shootLocale(browser, config, locale, dir);
    for (const suffix of ['.webm', '.mp4', '-poster.webp']) {
      const file = `${base}${suffix}`;
      const { size } = await stat(file);
      console.log(`  → ${path.relative(process.cwd(), file)} (${Math.round(size / 1024)} КБ)`);
    }
  }

  await browser.close();
}

const targets = process.argv.slice(2);
if (!targets.length) throw new Error('назови кейс: node scripts/shoot-clips.mjs agent-ops');

for (const name of targets) {
  console.log(name);
  await shootCase(name);
}
