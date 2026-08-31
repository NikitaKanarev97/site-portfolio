/**
 * Кадры диапазона — доказательство внутри кейса, а не строка меты.
 *
 * У трёх десктопных кейсов диапазон идёт по ширинам: один экран продукта,
 * снятый на нескольких ширинах и собранный в один кадр. У мобильного Pawly
 * ширина одна, и диапазон там идёт по времени сервиса — три разных экрана
 * на 390 px. Механика композита у обоих случаев общая, поэтому колонка
 * описывается парой «ширина + маршрут», а не одной шириной.
 *
 * Кадр собирается в **один** файл. Композит, а не три файла в вёрстке, — решение ради двух вещей сразу:
 * на 360 px три отдельных кадра в ряд превратились бы в три нечитаемые
 * полоски, а в каталог ДС не добавляется компонент ради одной картинки.
 * Кадр идёт `MediaFrame ratio=natural zoom`, как остальные артефакты.
 *
 * **`CASE-20` не нарушается.** Ни рамок устройств, ни перспективы, ни наклона,
 * ни теней: снимки ставятся рядом в **едином масштабе**, каждый своей
 * настоящей ширины. Именно разница ширин и есть содержание кадра — телефон
 * обязан выглядеть узким. Волосяная обводка `--border-default` и подложка
 * `--surface-media` повторяют то, что `ScreenStack` и `MediaFrame` рисуют
 * средствами CSS вокруг обычного скриншота.
 *
 * Скрипт **ничего не удаляет** и Storybook не требует: он дописывает один
 * файл в существующий каталог кейса. Полная пересъёмка кейса — по-прежнему
 * `shoot-<case>-frames.mjs`.
 *
 * Запуск:
 *   1. поднять стенд кейса: Agent-ops-console — 5300, b2b-dssl — 5199,
 *      Vet Clinic OS — 5200, PETS-walking — 5201 (npm run dev -- --port N)
 *   2. здесь — node scripts/shoot-range-frames.mjs agent-ops
 *      (обе локали за один прогон; FRAME_LOCALE не нужен)
 *
 * Playwright берётся из репозитория прототипа: у этого сайта одна JS-зависимость.
 */
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import sharp from 'sharp';

const DEVICE_SCALE_FACTOR = 1.5;
const WEBP_QUALITY = 82;
/** Потолок по длинной стороне — та же норма, что у остальных кадров кейса. */
const NATURAL_MAX = 2000;

/** Подложка и обводка — значения токенов, не подобранные цвета. */
const SURFACE_MEDIA = '#EFEFEC';
const BORDER_DEFAULT = '#E1E1DC';

/** Поля и промежуток композита в CSS-пикселях, до умножения на DSF. */
const PAD = 48;
const GAP = 48;
const HAIRLINE = 2;

/**
 * Полосы прокрутки и оболочка прототипа. Селекторы панели взяты из
 * `shoot-vet-frames.mjs`: у Vet Clinic OS экран живёт внутри вьюера, и без
 * этого в кадр попала бы панель прототипа, а не продукт. На двух других
 * прототипах эти правила ни на что не попадают. Что не общее — доезжает
 * полем `css` самого кейса.
 */
const HIDE_CHROME = `
  html { scrollbar-width: none; }
  *::-webkit-scrollbar { width: 0; height: 0; }
  [class*="viewerBack"], [class*="protoToggle"], [class*="protoPanel"] { display: none !important; }
  [class*="viewer"] { padding-block-start: 0 !important; }
`;

/**
 * Ширины берутся не из головы: 1640 — артборд консоли (`shoot-agent-ops-frames.mjs`
 * §VIEWPORT), 390 — нижняя граница канонической QA-шкалы адаптива после 360.
 *
 * Планшет в диапазон Agent Ops не входит намеренно. Три колонки в одном
 * масштабе дают телефону 166 css px в колонке страницы, две — 234; средняя
 * ширина при этом ничего не доказывает сверх крайних. У Vet Clinic OS планшет
 * назван платформой, и там колонки будет три.
 */
const CASES = {
  'agent-ops': {
    repo: 'd:/Claude-projects/Agent-ops-console',
    origin: process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5300',
    media: 'public/media/case-agent-ops',
    mediaRu: 'public/media/case-agent-ops-ru',
    out: 'range-review-queue.webp',
    /**
     * Высота у всех колонок одна и равна артборду консоли. Меняется только
     * ширина — она и есть содержание кадра. На 844 (высота телефона нормой
     * QA-шкалы) под правой колонкой оставалась пустая четверть подложки, и
     * композит читался как незаконченный, а не как узкий экран.
     */
    height: 1025,
    widths: [1640, 390],
    /** Роль ставится ссылкой на индексе, маршрут — pushState внутри SPA. */
    async open(page, { origin, locale }) {
      const prefix = locale === 'ru' ? '/ru' : '';
      await page.goto(`${origin}${prefix}/`, { waitUntil: 'networkidle' });
      await settle(page, locale);
      await page.getByRole('link', { name: /Martin K./ }).first().click();
      await page.waitForTimeout(200);
      await page.evaluate((to) => {
        window.history.pushState(null, '', to);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, `${prefix}/screens/review-queue`);
      await settle(page, locale);
    },
  },

  /**
   * Портал открывается прямым маршрутом, русская локаль — отдельной ветвью
   * `/ru` в самом прототипе (`shoot-dssl-ru-frames.mjs`). Колонки две:
   * каталог-разбор спецификации и есть тот экран, где таблица на 48 строк
   * превращается в карточки.
   */
  dssl: {
    repo: 'd:/Claude-projects/b2b-dssl',
    origin: process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5199/b2b',
    media: 'public/media/case-dssl',
    mediaRu: 'public/media/case-dssl-ru',
    out: 'range-resolution-center.webp',
    /* 1300, а не 900: на 900 телефонная колонка обрывалась на фильтрах, и
       превращение таблицы в карточки — главное, что кадр обязан показать, —
       в него не попадало. Высота у колонок общая, десктоп просто показывает
       больше строк. */
    height: 1300,
    widths: [1440, 390],
    route: '/resolution-center',
  },

  /**
   * Колонки три, а не две: планшет назван платформой прямо в мете кейса
   * («tablet in the room»), и диапазон обязан его показать. Десктоп берётся
   * 1440, а не артбордом съёмки 1680: кейс заявляет диапазон до 1440, и кадр
   * показывает его концы, а не ширину съёмочного стенда.
   */
  vet: {
    repo: 'd:/Claude-projects/b2b-dssl',
    origin: process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5200',
    media: 'public/media/case-vet',
    mediaRu: 'public/media/case-vet-ru',
    out: 'range-vet-day-queue.webp',
    height: 1000,
    widths: [1440, 768, 390],
    route: '/app/vet-day-queue',
    localePrefix: true,
  },

  /**
   * Единственный мобильный кейс, и диапазон здесь не по ширинам: 390 px —
   * это вся правда продукта, второй ширины у него нет. Диапазон идёт по
   * времени сервиса — три момента из лида кейса: что обещано до передачи
   * собаки, что видно во время прогулки и что осталось доказательством
   * после возврата.
   *
   * Экраны выбраны так, чтобы ни один не повторялся ниже по странице:
   * `walker-profile`, `handover-photo-review`, `address-input` и
   * `replacement-offer` уже стоят артефактами решений, а `screen-index`
   * — это верхняя часть кадра обложки.
   */
  pawly: {
    repo: 'd:/Claude-projects/PETS-walking',
    origin: process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5201',
    media: 'public/media/case-pawly',
    mediaRu: 'public/media/case-pawly-ru',
    out: 'range-evidence-chain.webp',
    /**
     * Ниже 540 px прототип сам снимает с экрана рамку вьюера, скругление и
     * тень (`AppGallery.module.css`, `.device`), поэтому кадру остаётся
     * убрать служебную шапку и верхний отступ. Обводку и подложку рисует
     * композит — теми же токенами, что у трёх других кейсов.
     */
    css: `
      [class*="viewerBar"] { display: none !important; }
      [class*="viewer"] { padding: 0 !important; min-height: 0 !important; }
    `,
    /**
     * Высота у колонок разная, и это единственный кейс, где так. У трёх
     * остальных колонка — один и тот же экран на разной ширине, и общая
     * высота там обязательна: иначе кадр сравнивал бы не то. Здесь экраны
     * разные, и `booking-review` просто короче двух других на треть.
     * Общие 1200 дорисовали бы под ним пустое белое поле — тот же дефект,
     * из-за которого у DSSL высота поднималась с 900 до 1300.
     */
    height: 1200,
    columns: [
      /* 980, а не 900: по-русски дисклеймеры выше, и на 900 обрезалась
         строка удержания средств под кнопкой оплаты. */
      { width: 390, route: '/app/booking-review', height: 980 },
      { width: 390, route: '/app/active-service' },
      { width: 390, route: '/app/order-details' },
    ],
  },
};

/**
 * Колонки кадра. Диапазон по ширинам описывается коротко — `widths` и общий
 * `route`; диапазон по экранам задаёт `columns` целиком. Внутри съёмки
 * разницы нет: колонка — это всегда ширина, высота и маршрут.
 */
function columnsOf(config) {
  if (config.columns) {
    return config.columns.map((column) => ({ height: config.height, route: config.route, ...column }));
  }
  return config.widths.map((width) => ({ width, height: config.height, route: config.route }));
}

/** Умолчание: прямой переход по маршруту. Своё `open` — только у Agent Ops. */
async function openRoute(page, config, column, locale) {
  const prefix = locale === 'ru' ? '/ru' : '';
  await page.goto(`${config.origin}${prefix}${column.route}`, { waitUntil: 'networkidle' });
  await settle(page, locale, config.css);
  if (locale === 'ru') {
    const lang = await page.evaluate(() => document.documentElement.lang);
    if (lang !== 'ru') throw new Error(`русская локаль не активна: ${column.route}`);
  }
}

async function settle(page, locale, css) {
  await page.addStyleTag({ content: HIDE_CHROME + (css ?? '') });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  if (locale === 'ru') {
    await page.evaluate(() => window.dispatchEvent(new Event('ru:localize')));
    await page.waitForTimeout(350);
  }
}

/** Единый масштаб: снимки ставятся рядом как есть, разница ширин сохраняется. */
async function compose(shots) {
  const framed = await Promise.all(
    shots.map((shot) =>
      sharp(shot)
        .extend({
          top: HAIRLINE,
          bottom: HAIRLINE,
          left: HAIRLINE,
          right: HAIRLINE,
          background: BORDER_DEFAULT,
        })
        .png()
        .toBuffer({ resolveWithObject: true }),
    ),
  );

  const pad = Math.round(PAD * DEVICE_SCALE_FACTOR);
  const gap = Math.round(GAP * DEVICE_SCALE_FACTOR);
  const width =
    pad * 2 + framed.reduce((sum, f) => sum + f.info.width, 0) + gap * (framed.length - 1);
  const height = pad * 2 + Math.max(...framed.map((f) => f.info.height));

  let left = pad;
  const layers = framed.map((f) => {
    const layer = { input: f.data, left, top: pad };
    left += f.info.width + gap;
    return layer;
  });

  return sharp({
    create: { width, height, channels: 4, background: SURFACE_MEDIA },
  })
    .composite(layers)
    .png()
    .toBuffer();
}

async function shootCase(name) {
  const config = CASES[name];
  if (!config) throw new Error(`кейс ${name} не описан в CASES`);

  const require = createRequire(path.join(config.repo, 'package.json'));
  const { chromium } = require('playwright');
  const browser = await chromium.launch();

  for (const [locale, dir] of [
    ['en', config.media],
    ['ru', config.mediaRu],
  ]) {
    const shots = [];

    for (const column of columnsOf(config)) {
      const context = await browser.newContext({
        viewport: { width: column.width, height: column.height },
        deviceScaleFactor: DEVICE_SCALE_FACTOR,
        reducedMotion: 'reduce',
        colorScheme: 'light',
      });
      const page = await context.newPage();
      if (config.open) await config.open(page, { origin: config.origin, locale });
      else await openRoute(page, config, column, locale);
      shots.push(await page.screenshot({ type: 'png' }));
      await context.close();
    }

    await mkdir(path.resolve(dir), { recursive: true });
    const out = path.resolve(dir, config.out);
    await sharp(await compose(shots))
      .resize({ width: NATURAL_MAX, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(out);

    const { width, height } = await sharp(out).metadata();
    console.log(`  → ${path.relative(process.cwd(), out)} (${width}×${height})`);
  }

  await browser.close();
}

const targets = process.argv.slice(2);
if (!targets.length) throw new Error('назови кейс: node scripts/shoot-range-frames.mjs agent-ops');

for (const name of targets) {
  console.log(name);
  await shootCase(name);
}
