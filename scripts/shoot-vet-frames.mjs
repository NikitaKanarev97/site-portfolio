/**
 * Производство кадров кейса Vet Clinic OS — та же норма, что у DSSL.
 *
 * Норма съёмки не переизобретается: viewport 1440×900 (ровно 16:10, кроп
 * после съёмки не нужен), `deviceScaleFactor` 1.5, выход 2000×1250 webp,
 * обработка только даунскейл и кодирование. Ни рамок, ни скруглений, ни
 * теней, ни цветокоррекции (`CASE-20`). Обоснование каждой цифры — в шапке
 * scripts/shoot-case-frames.mjs, здесь оно не дублируется.
 *
 * Отличие от DSSL одно, и оно от устройства прототипа. Экран там открывается
 * не окном, а вьюером: `/app/<slug>` рисует шапку «← All screens», обёртку
 * `.device` шириной ровно в проектную ширину кадра (1440, 768 или 390) и
 * плавающую кнопку панели прототипа. Снимать окном значит снимать вьюер.
 * Поэтому кадр берётся по элементу `.device`: это и есть экран продукта в
 * своей проектной ширине, без чужой оболочки вокруг.
 *
 * Три рода кадров:
 *
 *   screen    Экран целиком в норме обложки. Снимается по `.device` и
 *             режется по верхним 900 CSS px — 16:10 приходит кропом, а не
 *             подгонкой: у экранов продукта высота от 823 до 1677 px, и
 *             растянуть их в одну пропорцию значит исказить кадр.
 *
 *   natural   Экран или страница целиком, своей высоты. Пропорция приходит
 *             из содержания; на странице такие кадры идут `MediaFrame
 *             ratio=natural`, рамка их не режет.
 *
 *   story     Ячейка `CaseSystemGrid`: история `AllVariants` из каталога,
 *             обрезанная по содержимому. Матрица состояний снимается с
 *             каталога, а не собирается руками, — расхождение с первой же
 *             пересъёмкой иначе неизбежно (`ds/patterns.md`).
 *
 * Запуск:
 *   1. в d:\Claude-projects\Veterinary-clinic — npm run dev -- --port 5200
 *   2. там же, в storybook-static           — python -m http.server 6007
 *   3. здесь                                 — node scripts/shoot-vet-frames.mjs
 *
 * Playwright берётся из d:\Claude-projects\b2b-dssl: в Veterinary-clinic его
 * нет, а продукт этого сайта держит одну JS-зависимость (ds/CONTRACT.md §Стек)
 * и браузер для съёмки в неё не входит.
 */
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import sharp from 'sharp';

const ORIGIN = process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5200';
const STORYBOOK_ORIGIN = process.env.STORYBOOK_ORIGIN ?? 'http://127.0.0.1:6007';
const PLAYWRIGHT_REPO = process.env.PLAYWRIGHT_REPO ?? 'd:/Claude-projects/b2b-dssl';
const LOCALE = process.env.FRAME_LOCALE === 'ru' ? 'ru' : 'en';
const ROUTE_PREFIX = LOCALE === 'ru' ? '/ru' : '';
const STORY_GLOBALS = LOCALE === 'ru' ? '&globals=locale:ru' : '';

/** Одна норма на все кадры. Меняется здесь и нигде больше. */
const VIEWPORT = { width: 1680, height: 1000 };
const DEVICE_SCALE_FACTOR = 1.5;
const COVER_CSS = { width: 1440, height: 900 };
const VIEWPORT_OUTPUT = { width: 2000, height: 1250 };
const WEBP_QUALITY = 82;

/** Поле вокруг содержимого у обрезанных кадров, в пикселях снимка. */
const TRIM_MARGIN = 24;
/** Потолок по длинной стороне у кадров, которые не идут в норму обложки. */
const NATURAL_MAX = 2000;

const MEDIA_DIR = path.resolve(`public/media/case-vet${LOCALE === 'ru' ? '-ru' : ''}`);
const COVER_DIR = path.join(MEDIA_DIR, 'cover');

/**
 * Стопка обложки, от переднего кадра к дальнему. Порядок выбран на снятых
 * кадрах, как это было в кейсе DSSL: передним идёт очередь дня — единственный
 * экран, на котором проблема кейса видна до чтения текста («3 visits are
 * unfinished»), — за ним карта пациента и расписание администратора.
 *
 * В стопку идут только кадры одной проектной ширины. Планшетный след визита
 * рядом с десктопными перестал бы читаться как один продукт, поэтому он живёт
 * ниже, среди кадров своей высоты.
 */
const SCREEN_FRAMES = [
  { file: 'vet-day-queue.webp', route: '/app/vet-day-queue' },
  { file: 'schedule.webp', route: '/app/schedule' },
];

/** Кадры своей высоты: артефакты процесса и доказательства решений. */
const NATURAL_FRAMES = [
  { file: 'screen-index.webp', route: '/', selector: 'main' },
  { file: 'visit-quick-trace.webp', route: '/app/visit-quick-trace' },
  { file: 'dose-calculator.webp', route: '/app/dose-calculator' },
  { file: 'discharge-preview.webp', route: '/app/discharge-preview' },
  {
    file: 'patient-card-private.webp',
    route: '/app/patient-card',
    /** Обложка берёт верх того же полного кадра: второй независимый снимок
     * однажды поймал экран со сдвинутым viewport и отрезал навигацию слева. */
    cover: 'patient-card.webp',
  },
];

/**
 * Ячейки CaseSystemGrid. Шесть историй `AllVariants` из каталога.
 *
 * Широкие строки продукта — `QueueRow`, `PrescriptionLine`, `ScheduleRow` — в
 * ячейки не идут, и это ограничение каталога, а не выбор кадра: матрица там
 * `repeat(auto-fit, minmax(180px, 1fr))`, и строка на 600 px в колонке 190 px
 * обрезается посреди слова. Показывать обрезанный вариант как доказательство
 * матрицы состояний нельзя. Взяты компоненты, чьи варианты в эту колонку
 * помещаются целиком.
 *
 * `EmptyState` в ячейках тоже нет, и по другой причине: у него нет матрицы —
 * в Figma это standalone master, история `AllVariants` рисует один экземпляр.
 * Подпись ячейки обязана перечислять состояния (`CASE-10`), а перечислять
 * там нечего.
 */
const STORY_FRAMES = [
  { file: 'system-save-status.webp', id: 'components-atoms-savestatus--all-variants' },
  { file: 'system-status-tag.webp', id: 'components-atoms-statustag--all-variants' },
  { file: 'system-time-slot.webp', id: 'components-domain-timeslot--all-variants' },
  { file: 'system-weight-reading.webp', id: 'components-extended-weightreading--all-variants' },
  { file: 'system-input.webp', id: 'components-atoms-input--all-variants' },
  { file: 'system-choice-chip.webp', id: 'components-atoms-choicechip--all-variants' },
  { file: 'storybook-matrix.webp', id: 'components-atoms-button--all-variants' },
];

/**
 * Оболочка вьюера и панель прототипа к продукту не относятся: это леса
 * превью. Полосы прокрутки снимаются по той же причине, что в DSSL, — в
 * headless они занимают место в раскладке и съедают ширину неодинаково.
 */
/**
 * Ширина колонки каталога. Истории идут `layout: centered`, и корень истории
 * ужимается по содержимому: матрица `repeat(auto-fit, minmax(180px, 1fr))`
 * схлопывается в одну колонку, а ячейка кейса получается полосой 1:5. Ширина
 * задаётся здесь одним числом на все ячейки — четыре варианта в ряд, и все
 * шесть ячеек сетки приходят одной геометрии.
 */
const STORY_CSS = `
  #storybook-root { width: 760px !important; margin: 0 !important; }
`;

const HIDE_CHROME = `
  html { scrollbar-width: none; }
  *::-webkit-scrollbar { width: 0; height: 0; }
  [class*="viewerBack"], [class*="protoToggle"], [class*="protoPanel"] { display: none !important; }
  [class*="viewer"] { padding-block-start: 0 !important; }
`;

const require = createRequire(path.join(PLAYWRIGHT_REPO, 'package.json'));
const { chromium } = require('playwright');

/** Обрезка по содержимому: фон определяется по углу кадра. */
async function trimToContent(buffer) {
  const trimmed = await sharp(buffer)
    .trim({ threshold: 8 })
    .toBuffer({ resolveWithObject: true });

  return sharp(trimmed.data)
    .extend({
      top: TRIM_MARGIN,
      bottom: TRIM_MARGIN,
      left: TRIM_MARGIN,
      right: TRIM_MARGIN,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .toBuffer();
}

async function report(file) {
  const { width, height } = await sharp(file).metadata();
  console.log(`  → ${path.relative(process.cwd(), file)} (${width}×${height})`);
}

async function shoot() {
  /*
   * Пересъёмка обновляет только кадры из манифестов выше. Каталог целиком
   * не удаляем: рядом лежит range-композит, который собирается отдельным
   * скриптом, и прежняя очистка незаметно стирала его при каждом прогоне.
   * sharp безопасно перезапишет каждый заявленный output сам.
   */
  await mkdir(COVER_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });

  /* Трекер юзер-тестов прототипа к кадру отношения не имеет и в съёмке
     только добавляет ожидание сети. */
  await context.route('**/track.js', (route) => route.fulfill({ body: '' }));
  await context.route('**/vet-api/**', (route) => route.abort());

  const page = await context.newPage();

  async function open(url) {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: HIDE_CHROME });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    if (LOCALE === 'ru' && url.startsWith(ORIGIN)) {
      const lang = await page.evaluate(() => document.documentElement.lang);
      if (lang !== 'ru') throw new Error(`Русская локаль не активна: ${url}`);
    }
  }

  async function element(selector) {
    const node = await page.$(selector);
    if (!node) throw new Error(`селектор ${selector} не найден`);
    return node.screenshot({ type: 'png' });
  }

  for (const frame of SCREEN_FRAMES) {
    await open(`${ORIGIN}${ROUTE_PREFIX}${frame.route}`);
    const raw = await element('[class*="device"]');
    const out = path.join(COVER_DIR, frame.file);

    await sharp(raw)
      .extract({
        left: 0,
        top: 0,
        width: Math.round(COVER_CSS.width * DEVICE_SCALE_FACTOR),
        height: Math.round(COVER_CSS.height * DEVICE_SCALE_FACTOR),
      })
      .resize(VIEWPORT_OUTPUT.width, VIEWPORT_OUTPUT.height, { fit: 'fill' })
      .webp({ quality: WEBP_QUALITY })
      .toFile(out);

    console.log(frame.route);
    await report(out);
  }

  for (const frame of NATURAL_FRAMES) {
    await open(`${ORIGIN}${ROUTE_PREFIX}${frame.route}`);
    const raw = await element(frame.selector ?? '[class*="device"]');
    const out = path.join(MEDIA_DIR, frame.file);

    await sharp(raw)
      .resize({ width: NATURAL_MAX, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(out);

    if (frame.cover) {
      const { width, height } = await sharp(out).metadata();
      if (width !== VIEWPORT_OUTPUT.width || height < VIEWPORT_OUTPUT.height) {
        throw new Error(`Кадр ${frame.file} не покрывает обложку ${VIEWPORT_OUTPUT.width}×${VIEWPORT_OUTPUT.height}`);
      }
      await sharp(out)
        .extract({ left: 0, top: 0, width: VIEWPORT_OUTPUT.width, height: VIEWPORT_OUTPUT.height })
        .webp({ quality: WEBP_QUALITY })
        .toFile(path.join(COVER_DIR, frame.cover));
    }

    console.log(frame.route);
    await report(out);
  }

  for (const frame of STORY_FRAMES) {
    await open(`${STORYBOOK_ORIGIN}/iframe.html?id=${frame.id}&viewMode=story${STORY_GLOBALS}`);
    await page.addStyleTag({ content: STORY_CSS });
    await page.waitForTimeout(200);
    const raw = await element('#storybook-root');
    const out = path.join(MEDIA_DIR, frame.file);

    await sharp(await trimToContent(raw))
      .resize({ width: NATURAL_MAX, height: NATURAL_MAX, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(out);

    console.log(frame.id);
    await report(out);
  }

  await browser.close();
}

shoot().catch((error) => {
  console.error(error);
  process.exit(1);
});
