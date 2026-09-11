/**
 * Производство кадров кейса B2B Partner Portal — обе локали, одна норма.
 *
 * Заменяет два прежних скрипта: `shoot-case-frames.mjs` (английская обложка и
 * рельс) и `shoot-dssl-ru-frames.mjs` (русская пересъёмка, подгонявшая каждый
 * кадр под геометрию английского через `fit: contain`). Английские кадры
 * индекса, корзины и каталога ни одним скриптом не снимались вовсе — их
 * пересъёмка шла руками. Теперь весь набор идёт одним скриптом, как у Agent
 * Ops: `FRAME_LOCALE=ru` снимает ту же норму русской веткой прототипа.
 *
 * **Норма пересчитана 11.09.2026, после продуктовой доводки прототипа**
 * (прогон `audit/product-polish/` в b2b-dssl, этапы 06–08Б и три прохода
 * после них). Было `1440×900`: ровно 16:10, и на прежнем продукте экраны
 * стопки в него помещались. Доводка добавила нижнюю панель итога на разбор
 * спецификации (`D027`), итог плана под таблицей отгрузки и подняла строки:
 * замер `scrollHeight` на 1440 — dashboard 987, resolution-center 1028 (ru
 * 1046), fulfillment 1080 (ru 1100). На 900 все три теряли низ: разбор —
 * панель следующего шага, план — строку итога с переходом к оформлению.
 *
 * Прокрутка у портала документная, внутренней нет, и высота экрана от ширины
 * не зависит (замер на 1440, 1600, 1680, 1760, 1920 — числа те же). Поэтому
 * артборд — `1760×1100`: 1100 — самый высокий экран стопки (русский план
 * отгрузки), 1760 — ширина, при которой та же высота даёт 16:10. Три экрана
 * идут в стопку обложки и обязаны держать общую пропорцию, поэтому ширина
 * поднята вместе с высотой, а не отдельно. Контент на 1760 растягивается
 * (`D028`), пустых полей по краям нет.
 *
 * Остальное — прежняя норма: `deviceScaleFactor` 1.5, выход `2000×1250` WebP
 * q82, обработка только даунскейл и кодирование. Ни рамок, ни скруглений,
 * ни теней, ни цветокоррекции (`CASE-20`).
 *
 * Четыре рода кадров:
 *
 *   screen   Экран целиком, 16:10. Стопка обложки и корзина решения 2.
 *   element  Фрагмент по селектору, обрезанный по содержимому: рельс.
 *   page     Индекс экранов прототипа — шапка со счётчиками и первая группа
 *            целиком, не `fullPage` (разбор — у `PAGES`).
 *   story    Ячейка `CaseSystemGrid` и матрица кнопки из каталога.
 *
 * Запуск:
 *   1. в d:\Claude-projects\b2b-dssl        — npm run dev -- --port 5199
 *   2. там же, в storybook-static (собранный из текущего кода, `npm run
 *      build-storybook`) — python -m http.server 6009
 *   3. здесь — node scripts/shoot-dssl-frames.mjs
 *              FRAME_LOCALE=ru node scripts/shoot-dssl-frames.mjs
 *   4. здесь — node scripts/crop-artifacts.mjs dssl
 *
 * **Скрипт стирает каталог своей локали первым действием.** Кадр диапазона
 * (`shoot-range-frames.mjs`), ролики (`shoot-clips.mjs`), кропы
 * (`crop-artifacts.mjs`) и архивный кадр старого портала живут в том же
 * каталоге и снимаются другими скриптами — после полного прогона их надо
 * переснять. Порядок — в `ds/screens/case-dssl.md` §Пересъёмка 11.09.2026.
 *
 * Playwright берётся из b2b-dssl: продукт этого сайта держит одну
 * JS-зависимость (ds/CONTRACT.md §Стек), браузер для съёмки в неё не входит.
 */
import { createRequire } from 'node:module';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import sharp from 'sharp';

const ORIGIN = process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5199/b2b';
const STORYBOOK_ORIGIN = process.env.STORYBOOK_ORIGIN ?? 'http://127.0.0.1:6009';
const PROTOTYPE_REPO = process.env.PROTOTYPE_REPO ?? 'd:/Claude-projects/b2b-dssl';
const LOCALE = process.env.FRAME_LOCALE === 'ru' ? 'ru' : 'en';
const ROUTE_PREFIX = LOCALE === 'ru' ? '/ru' : '';
const STORY_GLOBALS = LOCALE === 'ru' ? '&globals=locale:ru' : '';

/** Одна норма на все кадры портала. Меняется здесь и нигде больше. */
const VIEWPORT = { width: 1760, height: 1100 };
const DEVICE_SCALE_FACTOR = 1.5;
const VIEWPORT_OUTPUT = { width: 2000, height: 1250 };
const WEBP_QUALITY = 82;

/** Потолок по длинной стороне у кадров, которые не идут в норму обложки. */
const NATURAL_MAX = 2000;
/** Поле вокруг обрезанного фрагмента, в пикселях снимка. */
const TRIM_MARGIN = 24;

const MEDIA_DIR = path.resolve(`public/media/case-dssl${LOCALE === 'ru' ? '-ru' : ''}`);
const COVER_DIR = path.join(MEDIA_DIR, 'cover');

/**
 * Экраны стопки — одним контекстом и в этом порядке, как в прежней съёмке:
 * состояние прототипа живёт в `sessionStorage`, и дашборд, снятый после
 * плана отгрузки, показывает текущую закупку и удерживаемый резерв, а не
 * пустое рабочее место. Порядок — это и порядок глубины на обложке.
 */
const COVER = [
  { file: 'resolution-center.webp', route: '/resolution-center' },
  { file: 'fulfillment.webp', route: '/fulfillment' },
  { file: 'dashboard.webp', route: '/dashboard' },
];

/**
 * Рельс снимается с дашборда того же мира, что обложка: арендатор и счёт
 * корзины совпадают с кадрами стопки. Высота кадра выбирается, а не
 * наследуется: марка, четыре пункта и пустое место под ними — пустота и есть
 * доказательство к подписи «за каждым пунктом есть экран».
 */
const ELEMENTS = [{ file: 'nav-rail.webp', route: '/dashboard', selector: 'nav', height: 320 }];

/**
 * Артефакт решения 2. **Снимается во вкладке «Needs attention».** До доводки
 * у `/cart/change-review` наверху стояли две карточки изменения; после неё
 * (`D027`, `D029`) изменения живут в строках таблицы, и `CHANGED` стоит ровно
 * на той ячейке, которая сдвинулась: цена у одной строки, срок у другой.
 * Вкладка — действие самого продукта, а не подмена состояния. Отдельный
 * свежий контекст: мир обложки к этому кадру не относится, а в свежем
 * открытых изменений два, как в каноне `_conventions.md` §11.
 */
const CART_REVIEW = { file: 'cart-change-review.webp', route: '/cart/change-review' };

/**
 * Индекс экранов прототипа. `8a5b3d4` заменил подписи живыми превью, и
 * страница целиком — 4 657 px (ru 4 712): в колонке ряда `case-artifacts`
 * это кишка, где каждое превью — полоса шума. Поэтому кадр — шапка со
 * счётчиками «20 screens · 6 states» и первая группа целиком.
 *
 * 746 — замер, общий для обеих локалей: низ первой группы 721 (ru 734),
 * заголовок следующей группы в `en` начинается на 753. Выше 753 в кадр вошла
 * бы полоска следующего заголовка, ниже 734 — русская группа без низа.
 *
 * Превью монтируются по пересечению с областью просмотра, поэтому страница
 * проходится прокруткой целиком и возвращается наверх.
 */
const INDEX = { file: 'screen-index.webp', height: 746 };

/**
 * Ячейки `CaseSystemGrid` и матрица кнопки для блока процесса. Ширина колонки
 * у каждой истории своя и подобрана замером по соседу в ряду: сетка идёт 3×2,
 * и портрет рядом с ландшафтом читался бы как ошибка вёрстки.
 *
 *   ряд 1 — ProductRow 1200 (0.75), PriceBlock 700 (0.79), Availability 700 (0.79)
 *   ряд 2 — ResolutionRow 1400 (1.16), FulfillmentPlan 1000 (1.13), EmptyState 1000 (1.18)
 *
 * `ResolutionRow` после `D026` — матрица `Type × State` на десять ячеек, на
 * 1000 это портрет 1.62. Матрица кнопки идёт рядом с индексом (0.42): на
 * 1000 она портрет 1.94, на 2400 раскладывается в три ряда и даёт 0.33.
 *
 * Обрезки по содержимому нет: у `#storybook-root` заданная ширина, и поле
 * справа — это колонка каталога, а не пустота кадра.
 */
const STORIES = [
  { file: 'system-product-row.webp', id: 'components-domain-productrow--all-variants', width: 1200 },
  { file: 'system-price-block.webp', id: 'components-domain-priceblock--all-variants', width: 700 },
  { file: 'system-availability.webp', id: 'components-domain-availability--all-variants', width: 700 },
  { file: 'system-resolution-row.webp', id: 'components-domain-resolutionrow--all-variants', width: 1400 },
  { file: 'system-fulfillment-plan.webp', id: 'components-domain-fulfillmentplan--all-variants', width: 1000 },
  { file: 'system-empty-state.webp', id: 'components-domain-emptystate--all-variants', width: 1000 },
  { file: 'storybook-matrix.webp', id: 'components-actions-button--all-variants', width: 2400 },
];

const HIDE_SCROLLBARS = `
  html { scrollbar-width: none; }
  *::-webkit-scrollbar { width: 0; height: 0; }
`;

/**
 * Кириллица в английском кадре — русский fixture, вернувшийся в английский
 * продукт. Исключение одно и оно — данные: исходный текст строки
 * спецификации интегратора пишется по-русски и не переводится, потому что
 * это провенанс (`D007`).
 */
const DATA_CYRILLIC = [/камера 4мп уличная/gi];

const require = createRequire(path.join(PROTOTYPE_REPO, 'package.json'));
const { chromium } = require('playwright');

async function report(file) {
  const { width, height } = await sharp(file).metadata();
  console.log(`  → ${path.relative(process.cwd(), file)} (${width}×${height})`);
}

async function assertLocale(page, where) {
  const text = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    body: document.body?.innerText ?? '',
  }));
  if (LOCALE === 'ru') {
    if (text.lang !== 'ru' || !/[А-Яа-яЁё]{3,}/.test(text.body)) {
      throw new Error(`Русская локаль не активна в ${where}`);
    }
    return;
  }
  const body = DATA_CYRILLIC.reduce((acc, re) => acc.replace(re, ''), text.body);
  const hit = body.match(/[А-Яа-яЁё][А-Яа-яЁё\s]{2,}/);
  if (hit) throw new Error(`Кириллица в кадре ${where}: «${hit[0].trim()}»`);
}

async function trimToContent(buffer) {
  const trimmed = await sharp(buffer).trim({ threshold: 8 }).toBuffer();
  return sharp(trimmed)
    .extend({
      top: TRIM_MARGIN,
      bottom: TRIM_MARGIN,
      left: TRIM_MARGIN,
      right: TRIM_MARGIN,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .toBuffer();
}

async function saveScreen(raw, out) {
  await sharp(raw)
    .resize(VIEWPORT_OUTPUT.width, VIEWPORT_OUTPUT.height, { fit: 'fill' })
    .webp({ quality: WEBP_QUALITY })
    .toFile(out);
  await report(out);
}

async function shoot() {
  await rm(MEDIA_DIR, { recursive: true, force: true });
  await mkdir(COVER_DIR, { recursive: true });

  const browser = await chromium.launch();

  async function freshPage() {
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: DEVICE_SCALE_FACTOR,
      reducedMotion: 'reduce',
      colorScheme: 'light',
    });
    /* Трекер юзер-тестов к кадру отношения не имеет и только добавляет
       ожидание сети. */
    await context.route('**/track.js', (route) => route.fulfill({ body: '' }));
    await context.route('**/b2b-api/**', (route) => route.abort());
    return { context, page: await context.newPage() };
  }

  /* `/b2b/` для корня, но `/b2b/ru` без косой черты: `/ru/` роутер
     переписывает сам, и оценка в середине перехода теряет контекст. */
  const url = (route) => `${ORIGIN}${ROUTE_PREFIX}${route === '/' && ROUTE_PREFIX ? '' : route}`;

  async function open(page, route) {
    await page.goto(url(route), { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: HIDE_SCROLLBARS });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    await assertLocale(page, route);
  }

  /* --- мир обложки: стопка и рельс --- */
  {
    const { context, page } = await freshPage();
    for (const frame of COVER) {
      await open(page, frame.route);
      console.log(frame.route);
      await saveScreen(await page.screenshot({ type: 'png' }), path.join(COVER_DIR, frame.file));
    }
    for (const frame of ELEMENTS) {
      await open(page, frame.route);
      const node = page.locator(frame.selector).first();
      let raw = await node.screenshot({ type: 'png' });
      const { width } = await sharp(raw).metadata();
      raw = await sharp(raw)
        .extract({ left: 0, top: 0, width, height: Math.round(frame.height * DEVICE_SCALE_FACTOR) })
        .toBuffer();
      const out = path.join(MEDIA_DIR, frame.file);
      await sharp(await trimToContent(raw))
        .resize({ width: NATURAL_MAX, height: NATURAL_MAX, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(out);
      console.log(`${frame.route} ${frame.selector}`);
      await report(out);
    }
    await context.close();
  }

  /* --- корзина: решение 2 --- */
  {
    const { context, page } = await freshPage();
    await open(page, CART_REVIEW.route);
    /* Вторая вкладка — «Needs attention» / «Требует внимания». Берётся по
       позиции, а не по подписи: подпись переводится. */
    await page.getByRole('tab').nth(1).click();
    await page.waitForTimeout(600);
    console.log(`${CART_REVIEW.route} · needs attention`);
    await saveScreen(await page.screenshot({ type: 'png' }), path.join(MEDIA_DIR, CART_REVIEW.file));
    await context.close();
  }

  /* --- индекс экранов --- */
  {
    const { context, page } = await freshPage();
    await page.setViewportSize({ ...VIEWPORT, height: INDEX.height });
    await open(page, '/');
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(900);
    const out = path.join(MEDIA_DIR, INDEX.file);
    await sharp(await page.screenshot({ type: 'png' }))
      .resize({ width: NATURAL_MAX, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(out);
    console.log('/ · index');
    await report(out);
    await context.close();
  }

  /* --- каталог --- */
  {
    const { context, page } = await freshPage();
    for (const frame of STORIES) {
      await page.goto(`${STORYBOOK_ORIGIN}/iframe.html?id=${frame.id}&viewMode=story${STORY_GLOBALS}`, {
        waitUntil: 'networkidle',
      });
      await page.addStyleTag({
        content: `${HIDE_SCROLLBARS}\n#storybook-root { width: ${frame.width}px !important; margin: 0 !important; }`,
      });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);
      await assertLocale(page, frame.id);
      const root = page.locator('#storybook-root');
      const out = path.join(MEDIA_DIR, frame.file);
      await sharp(await root.screenshot({ type: 'png' }))
        .resize({ width: NATURAL_MAX, height: NATURAL_MAX, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(out);
      console.log(frame.id);
      await report(out);
    }
    await context.close();
  }

  await browser.close();
}

shoot().catch((error) => {
  console.error(error);
  process.exit(1);
});
