/**
 * Пакет портфолио для Webflow-сборки: обложка и кадры.
 *
 * Четыре сборки — Common, Synk, Scrib3, Bloomlex — до 2026-09-01 показывались
 * на бирже промо-рендерами: iMac на пастельном подиуме, слева ссылка и абзац
 * текста. Рендер подиума нарушает `CASE-20` (`src/copy/home.ts` §development):
 * «ни рамок устройства, ни перспективы, ни теней; сайт показывается как сайт».
 * Продуктовые кейсы этому правилу следуют, сборки — нет, и в одном портфолио
 * два разных визуальных языка читаются как два разных автора.
 *
 * Скрипт снимает пакет заново с живого прода. Родство с пакетами кейсов
 * (`scripts/build-upwork-card.mjs`) держится на трёх общих вещах: холст на тон
 * в сторону от фона продукта, то же скругление, та же волосяная обводка.
 * Отличие одно и намеренное — **на обложке один кадр, а не стопка**. Стопка
 * у кейса показывает продукт слоями экранов; у сайта экран один, и стопка из
 * трёх кусков одной страницы врала бы о предмете.
 *
 * ## Обложка — 1448×1086
 *
 * Ровно 4:3. Размер задан владельцем 2026-09-01 после примерки в форме.
 * Первая редакция была 1733×909 под LinkedIn Featured, и на бирже она не
 * встала: диалог `Thumbnail preview` отдаёт 1.333 и заполняет рамку по
 * высоте, поэтому кадр 1.91 при любом положении ползунка терял бока — у
 * Scrib3 срезало логотип до «CRIB3». Кадр героя 16:9 стоит внутри холста:
 * 1332×749, поле по бокам 58, сверху и снизу по 168.
 *
 * ## Кадры
 *
 * Шесть на сборку: первый экран, четыре узла страницы и мобильная ширина.
 * Десктопные — 2000×1125 (16:9, вариант `MediaFrame ratio=wide`, та же
 * пропорция, что у превью секции Development). Мобильный — 390 px в двойной
 * плотности, без масштабирования до 2000: растянутый мобильный кадр врёт о
 * размере шрифта.
 *
 * ## Движение
 *
 * Главное в этих сборках — анимация, и статикой она не показывается. Клипы
 * проезда по сценам здесь были и **сняты решением владельца 2026-09-01**:
 * ролик про анимацию вместо анимации — лишний слой, который всё равно нужно
 * смотреть отдельно, а живой сайт открывается по ссылке из первого блока
 * карточки. Что остаётся в пакете — кадры, снятые **внутри** сцен, а не по их
 * краям: `pinned` отключает перелёт с возвратом, и кадр берётся долей внутри
 * диапазона закрепления, где сцена в середине хода.
 *
 * Запуск:
 *   node scripts/build-webflow-card.mjs <ключ|all> [--cover-only]
 *
 * `--cover-only` пересобирает обложку из уже снятого `01.png`, не трогая
 * браузер. Нужен, когда меняется геометрия холста: пересъёмка шести кадров
 * ради нового кропа — это семь минут на пакет и риск, что сайт за это время
 * отдаст другой кадр.
 */
import { mkdirSync, existsSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";

import sharp from "sharp";

import { COVER, renderCover } from "./lib/upwork-cover.mjs";

/** Playwright живёт в репозитории прототипа — та же ссылка, что в shoot-webflow-frames.mjs. */
const PROTOTYPE_REPO =
  process.env.PROTOTYPE_REPO ?? "d:/Claude-projects/b2b-dssl";
const require = createRequire(path.join(PROTOTYPE_REPO, "package.json"));
const { chromium } = require("playwright");

/** Десктопный кадр. 16:9 — пропорция, заведённая ДС под Webflow-сборки. */
const SHOT = { width: 2000, height: 1125 };
/** Окно съёмки и плотность. 1440 — та же база, что у shoot-webflow-frames.mjs. */
const VIEWPORT = { width: 1440, height: 810 };
const SCALE = 1.5;
/** Мобильная ширина. 390 — iPhone 13/14/15, самая частая ширина в вебе. */
const MOBILE = { width: 390, height: 844, scale: 2 };

/**
 * Обложка. Геометрия — `scripts/lib/upwork-cover.mjs`, общая с пакетами
 * кейсов. Прежний холст 1448×1086 (4:3) снят 2026-09-01: кейсы шли 1.25, а
 * сборки 1.333, и в сетке Portfolio восемь работ кропились двумя разными
 * способами. Теперь все восемь идут 2000×1600.
 *
 * Здесь остаётся имя файла и выбор кадров: обложка собирается из первых трёх
 * снятых сцен, а не из отдельного снимка, — это те же кадры, что уходят в
 * блоки карточки, и второй съёмки под обложку не нужно.
 */
const COVER_FILE = "00-cover.png";

/** Пропорция кадров сборки. Та же, в которой они сняты, — `SHOT` выше. */
const COVER_RATIO = SHOT.width / SHOT.height;

/** Кадры обложки: первый экран героем, две следующие сцены спутниками. */
const COVER_FRAMES = ["01.png", "02.png", "03.png"];

/** Время на отыгрыш вступления. То же, что в shoot-webflow-frames.mjs. */
const INTRO_SETTLE_MS = 6000;

/**
 * Полосы прокрутки в headless занимают место в раскладке. Бейдж Webflow —
 * плашка бесплатного плана на домене webflow.io, а не элемент сборки: на
 * боевом домене клиента её нет, и показывать её значит показывать хостинг
 * вместо работы.
 */
const PAGE_STYLE = `
  html { scrollbar-width: none; }
  *::-webkit-scrollbar { width: 0; height: 0; }
  .w-webflow-badge { display: none !important; }
`;

/**
 * `badge` — ярлык формата на плашке обложки. Пишется короткой строкой и без
 * стрелки: «Figma → Webflow» уже стоит в заголовке карточки, а глифа U+2192
 * в `Manrope-800.ttf` нет — Pango подставил бы замену из системного шрифта,
 * и на плашке это видно сразу. Длина ярлыка здесь и есть его кегль: строка
 * вписывается в поле холста, поэтому каждое лишнее слово мельчит ярлык на
 * плитке (`scripts/lib/upwork-cover.mjs` §badge).
 *
 * Сборки. `canvas` — фон первого экрана, сдвинутый на шаг: у светлых сборок
 * темнее, у тёмных светлее. Правило то же, что у пакетов кейсов, следствия у
 * светлого и тёмного разные. Исходные тона сняты с готовых превью
 * `public/media/development/*.webp`:
 *   common 210,217,223 · synk 232,201,168 · scrib3 37,30,35 · bloomlex 34,28,23
 *
 * `stroke` — цвет волосяной обводки: тёмный на светлом холсте, белый на
 * тёмном, иначе обводка либо исчезает, либо режет глаз.
 *
 * Порядок кадров — порядок блоков в карточке, а не порядок съёмки.
 */
const CARDS = {
  common: {
    dir: "upwork/projects/common",
    url: "https://common---digital-design-studio.webflow.io/",
    badge: "WEBFLOW · GSAP · STUDIO SITE",
    canvas: { r: 196, g: 203, b: 209 },
    stroke: { r: 15, g: 23, b: 35 },
    /**
     * Три сцены Common закреплены (`ScrollTrigger pin`): services, `#agency`
     * и `#projects`. Кадр закреплённой сцены берётся не по её началу, а долей
     * внутри диапазона закрепления — на старте сцена ещё пустая.
     */
    frames: [
      { file: "01.png", at: 0, note: "первый экран" },
      {
        file: "02.png",
        at: 2100,
        pinned: true,
        note: "WHAT WE DO, закреплённая сцена в середине",
      },
      {
        file: "03.png",
        at: 5800,
        pinned: true,
        note: "AGENCY, закреплённая сцена",
      },
      { file: "04.png", at: 8600, note: "APPROACH, аккордеон процесса" },
      {
        file: "05.png",
        at: 10600,
        pinned: true,
        note: "PROJECTS, горизонтальная прокрутка карточек",
      },
      { file: "06.png", at: 0, mobile: true, note: "мобильная ветка ≤1300 px" },
    ],
  },

  synk: {
    dir: "upwork/projects/synk",
    url: "https://synk-battle-prod.webflow.io/",
    badge: "WEBFLOW · GSAP · PRE-ORDER",
    /** Окно подписки, выезжающее на первом экране. Разбор — в `open()`. */
    dismiss: ".pop-up-stay-container-close",
    canvas: { r: 218, g: 188, b: 157 },
    stroke: { r: 15, g: 23, b: 35 },
    frames: [
      { file: "01.png", at: 0, note: "первый экран" },
      { file: "02.png", at: 1600, note: "THE STUDIO" },
      { file: "03.png", at: 4100, note: "коллекция на главной" },
      {
        file: "04.png",
        at: 830,
        url: "https://synk-battle-prod.webflow.io/catalog",
        note: "страница каталога",
      },
      { file: "05.png", at: 7600, note: "предзаказ" },
      { file: "06.png", at: 0, mobile: true, note: "мобильная ширина" },
    ],
  },

  scrib3: {
    dir: "upwork/projects/scrib3",
    url: "https://scrib3-prod.webflow.io/",
    badge: "WEBFLOW · GSAP · ANIMATED",
    canvas: { r: 54, g: 46, b: 52 },
    stroke: { r: 255, g: 255, b: 255 },
    frames: [
      { file: "01.png", at: 0, note: "первый экран" },
      { file: "02.png", at: 2900, note: "бегущая строка работ" },
      { file: "03.png", at: 3400, note: "услуги" },
      { file: "04.png", at: 6100, note: "кейсы" },
      /*
       * Секция команды сюда не идёт, хотя она на сайте есть: портреты там
       * почти чёрные по замыслу, и в кадре 16:9 это читается как ошибка
       * рендера, а не как решение. Наведение их не проявляет — проверено
       * 2026-09-01. Вместо неё берётся липкая сцена «experience meets
       * passion»: второй визуальный регистр страницы и работающая
       * Lottie-иллюстрация в середине проезда.
       */
      { file: "05.png", at: 8400, note: "липкая сцена, второй регистр" },
      { file: "06.png", at: 0, mobile: true, note: "мобильная ширина" },
    ],
  },

  bloomlex: {
    dir: "upwork/projects/bloomlex",
    url: "https://bloomblex-prod.webflow.io/",
    badge: "WEBFLOW · CMS · LANDING + BLOG",
    canvas: { r: 50, g: 43, b: 37 },
    stroke: { r: 255, g: 255, b: 255 },
    frames: [
      { file: "01.png", at: 0, note: "первый экран" },
      { file: "02.png", at: 1200, note: "что генерирует сервис" },
      { file: "03.png", at: 2100, note: "почему выбирают" },
      {
        file: "04.png",
        at: 4094,
        click: ".faq_dropdown:first-child .faq_dropdown-toggle",
        note: "вопросы и ответы, первый раскрыт",
      },
      { file: "05.png", at: 4750, note: "блог на коллекции CMS" },
      { file: "06.png", at: 0, mobile: true, note: "мобильная ширина" },
    ],
  },
};

/*
 * Кадры и обложка кодируются палитрой в 256 цветов без дизеринга — то же, что
 * делает `scripts/build-upwork-card.mjs`. На снимке интерфейса цветов заведомо
 * меньше: сплошные заливки, типографика, две-три фотографии. Проверено на
 * самом тяжёлом кадре пакета (`scrib3/05.png`, тёмное фото с зерном): 660 КБ
 * против 397 КБ, разницы на глаз нет. Дизеринг выключен — на плоских заливках
 * он даёт заметную крупу.
 */
const png = (buf) =>
  sharp(buf).png({
    compressionLevel: 9,
    effort: 10,
    palette: true,
    quality: 90,
    dither: 0,
  });

/**
 * Прокрутка настоящим колесом. Программный `scrollTo` здесь не годится:
 * прокрутку Common ведёт Lenis, и скачок он гасит; закреплённые сцены
 * ScrollTrigger при скачке доезжают в конечное состояние, минуя промежуточные
 * кадры — то есть ровно то, ради чего эти кадры и снимаются.
 */
/**
 * Перелёт с возвратом. Реврилы секций у всех четырёх сборок висят на
 * `ScrollTrigger` без scrub: пока низ окна не дошёл до секции, её содержимое
 * стоит в `from`-стейте, и кадр выходит с пустой нижней половиной — так
 * первый прогон снял вопросы Bloomlex. Колесо проезжает на экран дальше и
 * возвращается: триггеры отыгрывают, кадр показывает страницу такой, какой
 * её видит читатель. Закреплённым сценам перелёт не нужен и вреден — они
 * помечены `pinned`.
 */
const OVERSHOOT = 620;

async function wheelTo(page, target, { step = 220, settle = 16 } = {}) {
  for (let guard = 0; guard < 900; guard += 1) {
    const y = await page.evaluate(() => window.scrollY);
    const gap = target - y;
    if (Math.abs(gap) < 24) break;
    await page.mouse.wheel(0, Math.sign(gap) * Math.min(step, Math.abs(gap)));
    await page.waitForTimeout(settle);
  }
  await page.waitForTimeout(900);
}

async function open(page, url, dismiss) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await page.addStyleTag({ content: PAGE_STYLE });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(INTRO_SETTLE_MS);

  /*
   * У Synk на первом экране через ~9 секунд выезжает окно подписки и закрывает
   * собой логотип с лампой — то есть ровно то, что показывает обложка. Окно
   * снимается не CSS-ом, а нажатием на его же крестик: так делает посетитель,
   * и элемент остаётся элементом сборки, а не вырезается из неё. Если окно не
   * появилось, ждать нечего и шаг пропускается.
   */
  if (dismiss) {
    try {
      await page.waitForSelector(dismiss, { state: "visible", timeout: 12000 });
      await page.click(dismiss);
      await page.waitForTimeout(800);
    } catch {
      /* окна нет — снимаем как есть */
    }
  }
}

/** Кадр окна в файл пакета. Мобильный кадр не масштабируется до 2000. */
async function shoot(page, out, { mobile }) {
  const buf = await page.screenshot({ type: "png" });
  const pipe = mobile
    ? sharp(buf)
    : sharp(buf).resize(SHOT.width, SHOT.height, {
        fit: "fill",
        kernel: "lanczos3",
      });
  await png(await pipe.png().toBuffer()).toFile(out);
  return out;
}

/** Обложка: лестница из трёх снятых сцен. Правила — `lib/upwork-cover.mjs`. */
async function buildCover(card) {
  const sources = COVER_FRAMES.map((f) => path.join(card.dir, f));
  const out = path.join(card.dir, COVER_FILE);
  await renderCover(
    card,
    sources,
    { ratio: COVER_RATIO, layout: "staircase" },
    out,
  );
  return out;
}

async function build(key, { coverOnly = false } = {}) {
  const card = CARDS[key];
  if (!existsSync(card.dir)) mkdirSync(card.dir, { recursive: true });

  const made = [];

  if (coverOnly) {
    const cover = await buildCover(card);
    made.push({
      file: path.basename(cover),
      size: `${COVER.w}x${COVER.h}`,
      kb: Math.round(statSync(cover).size / 1024),
      note: "обложка 5:4, лестница",
    });
    console.log(`
=== ${key} → ${card.dir}`);
    for (const m of made) {
      console.log(
        `  ${m.file.padEnd(24)} ${m.size.padEnd(11)} ${String(m.kb).padStart(5)} KB  ${m.note}`,
      );
    }
    return made;
  }

  const browser = await chromium.launch();

  {
    const ctx = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: SCALE,
      colorScheme: "light",
    });
    const page = await ctx.newPage();
    const mobileCtx = await browser.newContext({
      viewport: { width: MOBILE.width, height: MOBILE.height },
      deviceScaleFactor: MOBILE.scale,
      isMobile: true,
      hasTouch: true,
      colorScheme: "light",
    });
    const mobilePage = await mobileCtx.newPage();

    let loaded = null;
    let mobileLoaded = null;
    for (const frame of card.frames) {
      const target = frame.mobile ? mobilePage : page;
      const url = frame.url ?? card.url;
      const seen = frame.mobile ? mobileLoaded : loaded;
      if (url !== seen) {
        await open(target, url, card.dismiss);
        if (frame.mobile) mobileLoaded = url;
        else loaded = url;
      }
      if (frame.pinned) {
        await wheelTo(target, frame.at);
      } else {
        await wheelTo(target, frame.at + OVERSHOOT);
        await wheelTo(target, frame.at);
      }
      /**
       * `click` — состояние, которого на нетронутой странице не увидеть.
       * Свёрнутый аккордеон Bloomlex в кадре 16:9 занимает четверть высоты и
       * читается как пустая секция; раскрытый показывает и содержание, и то,
       * что элемент работает.
       */
      if (frame.click) {
        await target.click(frame.click, { timeout: 15000 });
        await target.waitForTimeout(900);
      }
      /*
       * `hover` — то же самое для состояний, которые открывает наведение.
       * Портреты команды Scrib3 на нетронутой странице почти чёрные: цвет
       * проявляется под курсором. Кадр без наведения читается как ошибка
       * рендера, а не как решение.
       */
      if (frame.hover) {
        await target.hover(frame.hover, { timeout: 15000 });
        await target.waitForTimeout(900);
      }
      const out = await shoot(target, path.join(card.dir, frame.file), {
        mobile: !!frame.mobile,
      });
      const meta = await sharp(out).metadata();
      made.push({
        file: frame.file,
        size: `${meta.width}x${meta.height}`,
        kb: Math.round(statSync(out).size / 1024),
        note: frame.note,
      });
    }
    await mobileCtx.close();

    const cover = await buildCover(card);
    made.unshift({
      file: path.basename(cover),
      size: `${COVER.w}x${COVER.h}`,
      kb: Math.round(statSync(cover).size / 1024),
      note: "обложка 5:4, лестница",
    });
    await ctx.close();
  }

  await browser.close();

  console.log(`\n=== ${key} → ${card.dir}`);
  for (const m of made) {
    console.log(
      `  ${m.file.padEnd(24)} ${m.size.padEnd(11)} ${String(m.kb).padStart(5)} KB  ${m.note}`,
    );
  }
  return made;
}

const arg = process.argv[2];
const keys = arg === "all" ? Object.keys(CARDS) : [arg];
if (!keys.every((k) => CARDS[k])) {
  console.error(
    `Неизвестный ключ: ${arg}. Есть: ${Object.keys(CARDS).join(", ")}, all`,
  );
  process.exit(1);
}
const coverOnly = process.argv.includes("--cover-only");
for (const k of keys) await build(k, { coverOnly });
