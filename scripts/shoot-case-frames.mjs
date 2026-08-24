/**
 * Производство кадров кейса — один viewport, один фон, одна обработка.
 *
 * Кадры снимаются скриптом, а не руками, ровно по той же причине, по которой
 * ячейки CaseSystemGrid снимаются с историй AllVariants (ds/patterns.md):
 * собранный вручную набор расходится с первой же пересъёмкой. Стопка
 * ScreenStack показывает три экрана рядом, и любое расхождение viewport,
 * фона или обработки видно на ней сразу — слои перестают читаться как
 * один продукт.
 *
 * Два рода кадров, и норма у них разная, потому что разное содержание.
 *
 *   viewport   Экран целиком, как его видит пользователь. 1440×900 CSS —
 *              ровно 16:10, то же соотношение, что держат слой ScreenStack
 *              и рамка MediaFrame framed. Кроп после съёмки не нужен вовсе:
 *              кадр рождается в целевой пропорции. Выход 2000×1250.
 *
 *   element    Фрагмент интерфейса: рельс навигации, панель, карточка.
 *              Снимается по селектору, а не окном, и обрезается по
 *              содержимому. Снятый окном фрагмент даёт кадр, где рельс
 *              занимает 19% ширины, а остальное — пустой фон; в рамке
 *              страницы такой кадр читается как ошибка вёрстки, а не как
 *              фрагмент. Соотношение у фрагмента своё, и подгонять его под
 *              общее нельзя — это и есть форма самого фрагмента.
 *
 * Общее у обоих: один и тот же viewport и deviceScaleFactor, собственный фон
 * приложения, обработка только даунскейл и кодирование. Ни рамок, ни
 * скруглений, ни теней, ни цветокоррекции (CASE-20).
 *
 * Скрипт водит прототип из соседнего репозитория: Playwright и Chromium
 * стоят там, а не здесь — продукт этого сайта держит одну JS-зависимость
 * (ds/CONTRACT.md §Стек), и браузер для съёмки в неё не входит.
 *
 * Запуск:
 *   1. в d:\Claude-projects\b2b-dssl — npm run dev -- --port 5199
 *   2. здесь                          — node scripts/shoot-case-frames.mjs
 *
 * Переменные окружения: PROTOTYPE_ORIGIN, PROTOTYPE_REPO.
 *
 * **Прод прототипа за логином Vercel.** Снимать с него нельзя: страница
 * отдаёт 200, но это форма входа, а не продукт. Источник кадров — локальная
 * сборка того же коммита.
 */
import { createRequire } from 'node:module';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import sharp from 'sharp';

const ORIGIN = process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5199/b2b';
const PROTOTYPE_REPO = process.env.PROTOTYPE_REPO ?? 'd:/Claude-projects/b2b-dssl';

/** Одна норма на все кадры. Меняется здесь и нигде больше. */
const VIEWPORT = { width: 1440, height: 900 };
const DEVICE_SCALE_FACTOR = 1.5;
const VIEWPORT_OUTPUT = { width: 2000, height: 1250 };
const WEBP_QUALITY = 82;

/** Поле вокруг содержимого у обрезанных кадров, в пикселях снимка. */
const TRIM_MARGIN = 24;
/** Потолок по длинной стороне у кадров, которые не идут в норму viewport. */
const ELEMENT_MAX = 2000;

const MEDIA_DIR = path.resolve('public/media/case-dssl');
const COVER_DIR = path.join(MEDIA_DIR, 'cover');

/**
 * Три экрана стопки, от переднего к дальнему. Порядок здесь — порядок
 * глубины на обложке, и он же порядок в src/copy/cases: передний экран
 * несёт alt, два дальних декоративны.
 */
const COVER_FRAMES = [
  { file: 'resolution-center.webp', route: '/resolution-center' },
  { file: 'fulfillment.webp', route: '/fulfillment' },
  { file: 'dashboard.webp', route: '/dashboard' },
];

/**
 * Фрагменты интерфейса. Снимаются по селектору и обрезаются по содержимому.
 *
 * Рельс идёт с /dashboard, а не с произвольного экрана: арендатор обязан
 * совпадать с остальными кадрами кейса. Прежний кадр рельса стоял на другом
 * синтетическом арендаторе (Northwind Supply вместо Vector Integration) —
 * читатель видел два разных аккаунта внутри одного продукта.
 */
const ELEMENT_FRAMES = [
  /*
   * Высота кадра выбирается, а не наследуется. Рельс во всю высоту окна —
   * это 390×1398, то есть на странице 471×1688: не кадр, а простыня, где
   * девять десятых занимает пустота между списком и подписью пользователя.
   * Кадр берёт верх рельса: марка, четыре пункта и пустое место под ними.
   * Пустота нужна — она и есть доказательство к подписи «четыре пункта, и
   * за каждым есть экран», — но её достаточно показать, а не отмерить всю.
   */
  { file: 'nav-rail.webp', route: '/dashboard', selector: 'nav', height: 320 },
];

/**
 * Полосы прокрутки в headless занимают место в раскладке и съедают ширину
 * неодинаково — на экране со скроллом и без него кадр вышел бы разной
 * ширины. Снимаются на всех кадрах одинаково.
 */
const HIDE_SCROLLBARS = `
  html { scrollbar-width: none; }
  *::-webkit-scrollbar { width: 0; height: 0; }
`;

const require = createRequire(path.join(PROTOTYPE_REPO, 'package.json'));
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

async function shoot() {
  await rm(COVER_DIR, { recursive: true, force: true });
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
  await context.route('**/b2b-api/**', (route) => route.abort());

  const page = await context.newPage();

  async function open(route) {
    await page.goto(`${ORIGIN}${route}`, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: HIDE_SCROLLBARS });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
  }

  for (const frame of COVER_FRAMES) {
    await open(frame.route);
    const shot = await page.screenshot({ type: 'png' });
    const out = path.join(COVER_DIR, frame.file);

    await sharp(shot)
      .resize(VIEWPORT_OUTPUT.width, VIEWPORT_OUTPUT.height, { fit: 'fill' })
      .webp({ quality: WEBP_QUALITY })
      .toFile(out);

    console.log(`${frame.route} → ${path.relative(process.cwd(), out)}`);
  }

  for (const frame of ELEMENT_FRAMES) {
    await open(frame.route);
    const node = await page.$(frame.selector);
    if (!node) throw new Error(`ScreenStack: селектор ${frame.selector} не найден на ${frame.route}`);

    let raw = await node.screenshot({ type: 'png' });

    if (frame.height) {
      const { width } = await sharp(raw).metadata();
      raw = await sharp(raw)
        .extract({ left: 0, top: 0, width, height: Math.round(frame.height * DEVICE_SCALE_FACTOR) })
        .toBuffer();
    }

    const shot = await trimToContent(raw);
    const out = path.join(MEDIA_DIR, frame.file);

    await sharp(shot)
      .resize({ width: ELEMENT_MAX, height: ELEMENT_MAX, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(out);

    const { width, height } = await sharp(out).metadata();
    console.log(`${frame.route} ${frame.selector} → ${path.relative(process.cwd(), out)} (${width}×${height})`);
  }

  await browser.close();
}

shoot().catch((error) => {
  console.error(error);
  process.exit(1);
});
