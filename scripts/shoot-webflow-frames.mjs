/**
 * Производство кадров Webflow-сборок — одна норма на все четыре.
 *
 * Секция Development показывает четыре живых сайта. Кадры к ним снимаются
 * скриптом по той же причине, по которой снимаются кадры кейса
 * (scripts/shoot-case-frames.mjs): собранный вручную набор расходится с
 * первой же пересъёмкой, а четыре превью стоят в одном ряду — разошедшийся
 * viewport, фон или момент съёмки видно немедленно.
 *
 * **Пропорция кадра — 16:9, вариант MediaFrame ratio=wide.** Это та
 * пропорция, которую ДС и заводила под Webflow-сборки (ds/components.md
 * §MediaFrame). Кадры кейса стоят в 16:10 --ratio-screen, и расхождение
 * здесь намеренное: кейс показывается слоями ScreenStack в рамке продукта,
 * а сборка — окном браузера. Выход 2000×1125 webp.
 *
 * **Кадр — первый экран сборки, а не окно фиксированной высоты.**
 * До 2026-08-25 все четыре снимались окном 1440×900, и это было ошибкой:
 * первый экран каждой сборки имеет собственную высоту, и окно резало его
 * там, где придётся. У Common проектные карточки обрывались на 62 px ниже
 * края кадра — в ряду превью это читается как ошибка вёрстки, а не как
 * сайт. У Bloomlex в кадр попадали 65 px следующей секции светлой полосой
 * и бейдж Webflow поверх неё.
 *
 * Поэтому ширина окна подбирается под сборку. Правило одно: **нижний край
 * кадра не выходит за первый экран.** Скрипт меряет высоту первого экрана
 * и, если кадр её перерастает, расширяет окно — на большей ширине первый
 * экран ниже, и кадр целиком укладывается внутрь. Хвост первого экрана,
 * не влезший в 16:9, срезается, но допуск на срез мал (MAX_CROP): срезать
 * несколько процентов фона честнее, чем показывать край чужой секции.
 *
 * У Synk первый экран — 100vh, он совпадает с кадром на любой ширине.
 * У Scrib3 первый экран и есть окно: вступление собрано липкой секцией на
 * несколько экранов прокрутки, её высота к кадру отношения не имеет.
 * У Common высота первого экрана задана содержимым и от ширины почти не
 * зависит — подбор находит ширину, где 16:9 совпадает с ней. У Bloomlex
 * высота задана пропорцией иллюстрации, первый экран всегда чуть выше
 * 16:9, и кадр честно обрезает низ по допуску.
 *
 * **Бейдж Webflow снимается.** Это плашка бесплатного плана на домене
 * webflow.io, а не элемент сборки: на боевом домене клиента её нет.
 * Показывать её в превью — показывать хостинг вместо работы; что сборки
 * сделаны в Webflow, секция и так говорит заголовком.
 *
 * **Ни рамок устройства, ни перспективы, ни теней** (CASE-20). Сайт
 * показывается как сайт: снимок 1:1, обработка только даунскейл и
 * кодирование. Промо-рендеры с монитором на подиуме, которыми эти же
 * сборки показаны на бирже, сюда не идут — они подменяют доказательство
 * картинкой о доказательстве.
 *
 * **Съёмка идёт по живому проду, без reducedMotion.** Все четыре сборки
 * анимированы GSAP, и часть содержимого до анимации спрятана from-стейтом:
 * под prefers-reduced-motion такой кадр вышел бы с пустым первым экраном.
 * Скрипт вместо этого ждёт, пока вступление отыграет.
 *
 * Запуск: node scripts/shoot-webflow-frames.mjs
 */
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import sharp from 'sharp';

const PROTOTYPE_REPO = process.env.PROTOTYPE_REPO ?? 'd:/Claude-projects/b2b-dssl';

/** 16:9 — вариант MediaFrame ratio=wide. Одна пропорция на все четыре. */
const RATIO = 16 / 9;
/** Ширина первой примерки. Дальше её ведёт подбор. */
const BASE_WIDTH = 1440;
/** Границы десктопной раскладки: за них подбор не выходит. */
const WIDTH_RANGE = { min: 1280, max: 1760 };
/**
 * Допуск на срез хвоста первого экрана, долей от высоты кадра. Пять
 * процентов — это низ фона под последним элементом, а не сам элемент.
 */
const MAX_CROP = 0.05;
const MAX_PASSES = 4;

const DEVICE_SCALE_FACTOR = 1.5;
const VIEWPORT_OUTPUT = { width: 2000, height: 1125 };
const WEBP_QUALITY = 82;

/** Время на отыгрыш вступления. Ниже — кадры выходят с недоехавшим текстом. */
const INTRO_SETTLE_MS = 6000;

const MEDIA_DIR = path.resolve('public/media/development');

/**
 * Порядок здесь — порядок в src/copy/home.ts. Адреса те же, что в
 * home.development.items: список сборок один, и живёт он в текстах.
 *
 * `firstScreen` — селектор первого экрана сборки, по которому идёт подбор
 * ширины. `null` значит, что первый экран сборки и есть окно: у Scrib3
 * вступление собрано липкой секцией на несколько экранов прокрутки, и её
 * высота к кадру отношения не имеет.
 */
const FRAMES = [
  {
    file: 'common.webp',
    url: 'https://common---digital-design-studio.webflow.io/',
    firstScreen: '.common-home-rebuild > section:first-child',
  },
  {
    file: 'synk.webp',
    url: 'https://synk-battle-prod.webflow.io/',
    firstScreen: '.section_hero',
  },
  {
    file: 'scrib3.webp',
    url: 'https://scrib3-prod.webflow.io/',
    firstScreen: null,
  },
  {
    file: 'bloomlex.webp',
    url: 'https://bloomblex-prod.webflow.io/',
    firstScreen: '.section_hero',
  },
];

/**
 * Полосы прокрутки в headless занимают место в раскладке и режут ширину.
 * Бейдж Webflow — плашка хостинга, а не сборки, обоснование в шапке файла.
 */
const PAGE_STYLE = `
  html { scrollbar-width: none; }
  *::-webkit-scrollbar { width: 0; height: 0; }
  .w-webflow-badge { display: none !important; }
`;

const require = createRequire(path.join(PROTOTYPE_REPO, 'package.json'));
const { chromium } = require('playwright');

const clampWidth = (width) =>
  Math.min(WIDTH_RANGE.max, Math.max(WIDTH_RANGE.min, Math.round(width)));

const heightFor = (width) => Math.round(width / RATIO);

/**
 * Загрузка с отыгранным вступлением. Каждая примерка ширины идёт полной
 * перезагрузкой, а не resize окна: у сборок на GSAP ScrollTrigger размеры
 * посчитаны на старте, и после resize раскладка и замер разошлись бы.
 */
async function load(page, url, width) {
  await page.setViewportSize({ width, height: heightFor(width) });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.addStyleTag({ content: PAGE_STYLE });
  await page.evaluate(() => document.fonts.ready);

  /* Прелоадеры этих сборок стартуют по window.load, а часть вступлений —
     по первому кадру после него. Ждём отыгрыша, потом возвращаем скролл
     в нуль: networkidle к моменту вступления уже наступил. */
  await page.waitForTimeout(INTRO_SETTLE_MS);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
}

/** Высота первого экрана в CSS-пикселях; null — окно целиком. */
async function measure(page, selector) {
  if (!selector) return null;

  return page.evaluate((sel) => {
    const node = document.querySelector(sel);
    if (!node) throw new Error(`первый экран не найден: ${sel}`);
    return Math.round(node.getBoundingClientRect().height);
  }, selector);
}

/**
 * Подбор ширины окна, при которой кадр 16:9 укладывается в первый экран.
 * Возвращает ширину, на которой страница осталась загруженной.
 */
async function fit(page, frame) {
  let width = BASE_WIDTH;

  for (let pass = 0; pass < MAX_PASSES; pass += 1) {
    await load(page, frame.url, width);

    const height = await measure(page, frame.firstScreen);
    if (height === null) return width;

    const frameHeight = heightFor(width);
    const crop = height - frameHeight;
    console.log(
      `  ${frame.file}: окно ${width}×${frameHeight}, первый экран ${height} px, ` +
        `срез ${crop} px (${((crop / frameHeight) * 100).toFixed(1)}%)`,
    );

    /* Срез в допуске — кадр стоит внутри первого экрана и ниже него не
       уходит. Отрицательный срез значит, что кадр перерос первый экран и
       поймал бы чужую секцию: тогда окно расширяется, на большей ширине
       первый экран ниже кадра. */
    if (crop >= 0 && crop <= frameHeight * MAX_CROP) return width;

    const next = clampWidth(height * RATIO);
    if (next === width) return width;
    width = next;
  }

  console.warn(`  ${frame.file}: подбор не сошёлся за ${MAX_PASSES} примерок, берём ${width}`);
  return width;
}

async function shoot() {
  await mkdir(MEDIA_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: BASE_WIDTH, height: heightFor(BASE_WIDTH) },
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    colorScheme: 'light',
  });

  const page = await context.newPage();

  for (const frame of FRAMES) {
    const width = await fit(page, frame);

    /* Снимок идёт клипом от нуля, а не элементом: у первого экрана поверх
       часто висит фиксированная навигация, и снимок по элементу потерял бы
       её. Клип равен окну — высоту окну задал подбор. */
    const shot = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width, height: heightFor(width) },
    });

    const out = path.join(MEDIA_DIR, frame.file);

    await sharp(shot)
      .resize(VIEWPORT_OUTPUT.width, VIEWPORT_OUTPUT.height, { fit: 'fill' })
      .webp({ quality: WEBP_QUALITY })
      .toFile(out);

    console.log(`${frame.url} → ${path.relative(process.cwd(), out)} (${width}×${heightFor(width)})`);
  }

  await browser.close();
}

shoot().catch((error) => {
  console.error(error);
  process.exit(1);
});
