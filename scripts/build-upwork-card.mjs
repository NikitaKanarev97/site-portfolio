/**
 * Сборка пакета карточки портфолио Upwork из кадров кейса.
 *
 * Делает две вещи и обе — механические:
 *
 * 1. **Кадры.** Берёт `.webp` из `public/media/case-*`, переводит в PNG,
 *    нумерует в порядке блоков карточки и сжимает. Правило размера — то же,
 *    что у собранного вручную пакета Agent Ops: **длинная сторона не больше
 *    2000**. Апскейл выше `MAX_UPSCALE` не делается вовсе: недостающая ширина
 *    добирается полем цвета обложки, потому что растянутый скриншот
 *    интерфейса видно сразу.
 *
 * 2. **Обложка** — `00-thumbnail-preview.png`, 2000×1600. Коллаж экранов на
 *    градиенте с плашкой формата снизу; вся геометрия и её обоснование — в
 *    `scripts/lib/upwork-cover.mjs`, общем с пакетом Webflow-сборок. Здесь
 *    остаётся выбор кадров: какие идут на обложку, в какой пропорции они
 *    сняты и какой раскладкой ложатся.
 *
 * Почему 5:4, а не рекомендованные площадкой 4:3 — `upwork/projects/
 * agent-ops-console/README.md` §4: плитка в сетке Portfolio отдаёт 1.25,
 * диалог `Thumbnail preview` — 1.333, и кадр, нарисованный в 4:3, теряет бока.
 *
 * Запуск: node scripts/build-upwork-card.mjs <ключ> [--cover-only]
 *
 * `--cover-only` пересобирает только обложку. Нужен, когда меняется её
 * геометрия: кадры пакета от этого не зависят.
 */
import { existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { renderCover } from "./lib/upwork-cover.mjs";

/** Длинная сторона готового кадра. Совпадает с пакетом Agent Ops. */
const MAX_EDGE = 2000;

/**
 * Предел растягивания. 1.45 пропускает `legacy-dashboard` (1.40) — архивный
 * кадр старого портала, другого источника у него нет и не будет, — и режет
 * всё, что растянуто сильнее. Кроп `cart-change-review-crop` (2.53) по этому
 * правилу в карточку не попал: на сайте его спасает зум, на Upwork зума нет.
 */
const MAX_UPSCALE = 1.45;

/**
 * Мобильный пакет — правило, заведённое картой Pawly 2026-09-01.
 *
 * У десктопных кейсов кадр приходит шириной 2000 и масштабируется сам по
 * себе. У мобильного кейса кадры сняты с телефона 375 px, и среди них два
 * рода: полный экран (564 px исходника) и образец компонента — вырезка
 * внутри того же экрана, 296–618 px. Если каждый кадр гнать к длинной
 * стороне 2000 по отдельности, масштаб гуляет от ×1.27 до ×1.45, а ширина
 * от 429 до 896 px: образец компонента оказывается крупнее экрана, внутри
 * которого он живёт, и карточка врёт о пропорциях продукта.
 *
 * Поэтому мобильные кадры собираются **одним масштабом на весь пакет** —
 * самый высокий кадр упирается в 2000, остальные считаются от того же
 * числа, — и раскладываются на подложке **одной ширины**, равной самому
 * широкому кадру пакета. Поле по бокам то же самое, что у десктопных
 * образцов: недостающая ширина добирается цветом холста, а не
 * интерполяцией.
 */
const MOBILE = "mobile";

/**
 * Пропорция кадров `cover/`. Совпадает с `--ratio-screen` ДС: все кадры
 * обложек сняты 2000×1250.
 */
const SCREEN = 16 / 10;

/** Пропорция телефонного кадра. 375:812 — та же база, что у съёмки Pawly. */
const PHONE = 375 / 812;

const CARDS = {
  "agent-ops-console": {
    dir: "upwork/projects/agent-ops-console",
    media: "public/media/case-agent-ops",
    /**
     * Единственный тёмный продукт из четырёх, и холст ему поднят выше всех
     * остальных. Причина видна на плитке биржи: фон интерфейса почти чёрный,
     * и при холсте 24,26,30 поле вокруг кадра пропадало — обложка читалась
     * тёмным прямоугольником во всю плитку, то есть ровно тем дефектом, из-за
     * которого поле и вводилось. Тон 44,48,54 разводит холст и продукт на
     * различимую ступень, оставаясь тёмным: градиент идут 69→29.
     */
    canvas: { r: 44, g: 48, b: 54 },
    stroke: { r: 255, g: 255, b: 255 },
    badge: "CASE STUDY + LIVE REACT BUILD",
    coverRatio: SCREEN,
    layout: "staircase",
    cover: [
      "cover/review-queue.webp",
      "cover/action-approvals.webp",
      "cover/run-detail.webp",
    ],
    /**
     * Пакет кадров Agent Ops собран вручную до появления скрипта и с тех пор
     * не пересобирался. Здесь он заведён ради обложки: `--cover-only`
     * перерисовывает её, не трогая тринадцать готовых файлов. Список кадров
     * пуст намеренно — полная пересборка пакета потребовала бы сверить
     * порядок блоков с `README.md`, а этого решения ещё не принимали.
     */
    frames: [],
  },

  "partner-portal": {
    dir: "upwork/projects/b2b-partner-portal",
    media: "public/media/case-dssl",
    /**
     * Холст на тон темнее фона продукта. У DSSL продукт светлый — кадры
     * приходят с фоном rgb(241,244,247), — поэтому холст светлый тоже, а
     * обводка тёмная. У Agent Ops ровно наоборот, и там обводка белая:
     * правило одно — «на тон темнее», следствия у светлого и тёмного
     * продукта разные.
     */
    canvas: { r: 222, g: 226, b: 231 },
    stroke: { r: 15, g: 23, b: 35 },
    badge: "CASE STUDY · B2B ORDERING UX",
    coverRatio: SCREEN,
    layout: "staircase",
    cover: [
      "cover/resolution-center.webp",
      "cover/fulfillment.webp",
      "cover/dashboard.webp",
    ],
    frames: [
      "legacy-dashboard.webp",
      "new-dashboard.webp",
      /**
       * Пересборка 11.09.2026, после доводки прототипа. Три кадра прежнего
       * плана пересъёмкой стёрты или сменили смысл; порядок и число (14)
       * сохранены, композиция карточки не менялась:
       * — `xls-parse-result` переснят `shoot-dssl-pairs.mjs` (SINGLES);
       * — постер петли `clip-line-identity` теперь её первый кадр (очередь без
       *   панели), а сравнение кандидатов — постер фильма;
       * — `fulfillment-plans` не снимается, план отгрузки — кадр стопки.
       */
      "xls-parse-result.webp",
      "film-pipeline-poster.webp",
      "range-resolution-center.webp",
      "cart-change-review.webp",
      "system-price-block.webp",
      "system-availability.webp",
      "cover/fulfillment.webp",
      /**
       * 🔴 На месте `system-fulfillment-plan` в плане стоял `storybook-matrix`.
       * Снят 2026-09-01: тогда этот файл был побайтовой копией
       * `system-product-row-v2.webp`. Пересъёмкой 11.09.2026 матрица снята
       * заново (кнопка каталога, 2000×669), дубля больше нет — но слот 10
       * остаётся за `FulfillmentPlan`: он парой к `09.png`.
       */
      "system-fulfillment-plan.webp",
      "system-product-row.webp",
      "system-resolution-row.webp",
      "system-empty-state.webp",
      "screen-index.webp",
    ],
  },

  "vet-clinic": {
    dir: "upwork/projects/vet-clinic-os",
    media: "public/media/case-vet",
    /**
     * Продукт светлый и нейтральный: страница приходит с фоном
     * rgb(243,243,243), карточки белые. Холст на тон темнее — 224, — и
     * обводка тёмная, как у DSSL. Оттенка у фона нет, поэтому холст серый
     * без подмеса: тёплый или холодный холст спорил бы с бирюзовым
     * акцентом продукта, единственным цветом на кадрах.
     */
    canvas: { r: 224, g: 224, b: 224 },
    stroke: { r: 15, g: 23, b: 35 },
    badge: "CASE STUDY + DESIGN SYSTEM",
    coverRatio: SCREEN,
    layout: "staircase",
    cover: [
      "cover/vet-day-queue.webp",
      "cover/patient-card.webp",
      "cover/schedule.webp",
    ],
    frames: [
      "range-vet-day-queue.webp",
      "visit-quick-trace-crop.webp",
      "dose-calculator-crop.webp",
      "patient-card-private.webp",
      "patient-card-private-crop.webp",
      "discharge-preview-crop.webp",
      "screen-index.webp",
      "storybook-matrix.webp",
      "system-save-status.webp",
      "system-input.webp",
      "system-choice-chip.webp",
      "system-weight-reading.webp",
      "system-time-slot.webp",
      "system-status-tag.webp",
    ],
  },

  pawly: {
    dir: "upwork/projects/pawly",
    media: "public/media/case-pawly",
    /**
     * Единственный тёплый холст из трёх. Фон продукта rgb(251,249,247) —
     * тёплый белый, — поэтому и холст тёплый: серый нейтральный рядом с ним
     * читается синим пятном. Правило то же, «на тон темнее продукта».
     */
    canvas: { r: 232, g: 228, b: 224 },
    stroke: { r: 15, g: 23, b: 35 },
    badge: "MOBILE CASE + DESIGN SYSTEM",
    coverRatio: PHONE,
    layout: "fan",
    /**
     * Единственная карточка, чья обложка не берёт кадры из `cover/`. Там
     * лежат десктопные композиты 2000×1250, снятые под страницу сайта:
     * галерея экранов и две сцены в браузерной ширине. Мобильный продукт,
     * показанный ими, читается веб-приложением — то есть врёт.
     *
     * Веер собирается из настоящих телефонных кадров. Четыре взяты не
     * произвольно: профиль выгульщика, адрес питомца, приёмка фото и сверка
     * брони — четыре разных типа экрана (профиль, форма, съёмка, чек), и
     * каждый узнаётся с миниатюры. `replacement-offer` в веер не идёт: кадр
     * 564×987 — лист поверх экрана без шапки, и в пропорции 375:812 его
     * пришлось бы растянуть. `clip-verification-poster` не идёт тоже: это
     * тот же экран профиля, что и `walker-profile`.
     */
    cover: [
      "walker-profile.webp",
      "address-input.webp",
      "handover-photo-review.webp",
      "clip-booking-disclosures-poster.webp",
    ],
    /**
     * Порядок — порядок блоков карточки, а не порядок съёмки: тот, кто
     * собирает форму, грузит файлы подряд по номерам и ничего не ищет.
     * Кадры, снятые с телефона, помечены MOBILE; композит диапазона,
     * галерея экранов и каталог сняты в других ширинах и идут общим
     * правилом.
     */
    frames: [
      "range-evidence-chain.webp",
      { file: "clip-booking-disclosures-poster.webp", pack: MOBILE },
      { file: "address-input.webp", pack: MOBILE },
      { file: "clip-verification-poster.webp", pack: MOBILE },
      { file: "handover-photo-review.webp", pack: MOBILE },
      { file: "system-photo-proof.webp", pack: MOBILE },
      { file: "clip-replacement-poster.webp", pack: MOBILE },
      "screen-index.webp",
      "storybook-matrix.webp",
      { file: "system-info-note.webp", pack: MOBILE },
      { file: "system-empty-state.webp", pack: MOBILE },
      { file: "system-bottom-sheet.webp", pack: MOBILE },
      { file: "system-timeline-row.webp", pack: MOBILE },
      /**
       * 🔴 `system-icon-button.webp` в карточку не идёт: 302×147, до 2000
       * это ×6.6 — вчетверо выше потолка. Правило растягивания снимает его
       * так же, как сняло `cart-change-review-crop` в пакете DSSL.
       */
    ],
  },
};

const png = (buf) =>
  sharp(buf).png({
    compressionLevel: 9,
    effort: 10,
    palette: true,
    quality: 92,
    dither: 0,
  });

/**
 * Обложка. Геометрия и правила — `scripts/lib/upwork-cover.mjs`; здесь только
 * подбор кадров: соотношение исходников и раскладка.
 *
 * `ratio-screen` 16:10 — та же пропорция, в которой сняты все кадры
 * `public/media/case-*` → `cover/`. Мобильный кейс идёт веером телефонов в
 * пропорции 375:812, и кадры ему берутся не из `cover/`: там лежат
 * десктопные композиты для страницы сайта, а не экраны продукта.
 */
async function buildCover(card, outDir) {
  const sources = card.cover.map((f) => path.join(card.media, f));
  const out = path.join(outDir, "00-thumbnail-preview.png");
  await renderCover(
    card,
    sources,
    { ratio: card.coverRatio, layout: card.layout },
    out,
  );
  return out;
}

/**
 * Масштаб и ширина подложки мобильного пакета. Считаются по всему пакету
 * сразу, а не по кадру: см. комментарий у MOBILE.
 */
async function mobilePack(card, frames) {
  const mobile = frames.filter((f) => f.pack === MOBILE);
  if (!mobile.length) return null;

  const metas = [];
  for (const f of mobile)
    metas.push(await sharp(path.join(card.media, f.file)).metadata());

  const scale = Math.min(MAX_UPSCALE, ...metas.map((m) => MAX_EDGE / m.height));
  const width = Math.max(...metas.map((m) => Math.round(m.width * scale)));
  return { scale, width };
}

async function buildFrames(card, outDir) {
  const frames = card.frames.map((f) =>
    typeof f === "string" ? { file: f } : f,
  );
  const pack = await mobilePack(card, frames);

  const rows = [];
  for (const [i, frame] of frames.entries()) {
    const name = frame.file;
    const src = path.join(card.media, name);
    const meta = await sharp(src).metadata();

    if (frame.pack === MOBILE) {
      const w = Math.round(meta.width * pack.scale);
      const h = Math.round(meta.height * pack.scale);
      const field = pack.width - w;

      const out = path.join(outDir, `${String(i + 1).padStart(2, "0")}.png`);
      await png(
        await sharp(src)
          .resize(w, h, { kernel: "lanczos3" })
          .extend({
            left: Math.floor(field / 2),
            right: Math.ceil(field / 2),
            background: { ...card.canvas, alpha: 1 },
          })
          .png()
          .toBuffer(),
      ).toFile(out);

      rows.push({
        file: path.basename(out),
        source: name,
        size: `${pack.width}x${h}`,
        scale: pack.scale.toFixed(2),
        pad: field > 0,
        kb: Math.round(statSync(out).size / 1024),
      });
      continue;
    }

    /**
     * Кадры образцов компонентов сняты мелко: `system-price-block` пришлось
     * бы растянуть вдвое. Растянутый образец врёт о качестве работы, поэтому
     * недостающая ширина добирается **полем, а не интерполяцией**: масштаб
     * упирается в `MAX_UPSCALE`, остаток холста заливается цветом обложки.
     * Образец читается смонтированным на подложку — чем он и является.
     * Вертикальные кадры не добираются: у них ограничение по высоте.
     */
    const scale = Math.min(
      MAX_EDGE / Math.max(meta.width, meta.height),
      MAX_UPSCALE,
    );
    const w = Math.round(meta.width * scale);
    const h = Math.round(meta.height * scale);
    const pad = meta.width >= meta.height && w < MAX_EDGE;

    let pipe = sharp(src).resize(w, h, { kernel: "lanczos3" });
    if (pad) {
      pipe = pipe.extend({
        left: Math.floor((MAX_EDGE - w) / 2),
        right: Math.ceil((MAX_EDGE - w) / 2),
        background: { ...card.canvas, alpha: 1 },
      });
    }

    const out = path.join(outDir, `${String(i + 1).padStart(2, "0")}.png`);
    await png(await pipe.png().toBuffer()).toFile(out);

    rows.push({
      file: path.basename(out),
      source: name,
      size: `${pad ? MAX_EDGE : w}x${h}`,
      scale: scale.toFixed(2),
      pad,
      kb: Math.round(statSync(out).size / 1024),
    });
  }
  return rows;
}

const key = process.argv[2];
const coverOnly = process.argv.includes("--cover-only");
const card = CARDS[key];
if (!card) {
  console.error(
    `Неизвестный ключ: ${key}. Есть: ${Object.keys(CARDS).join(", ")}`,
  );
  process.exit(1);
}

if (!existsSync(card.dir)) mkdirSync(card.dir, { recursive: true });

const cover = await buildCover(card, card.dir);
const coverKb = Math.round(statSync(cover).size / 1024);
console.log(
  `обложка  ${path.basename(cover)}  2000x1600  ${coverKb} KB  (${card.layout})`,
);

if (coverOnly) {
  console.log("");
  console.log("только обложка, кадры не тронуты");
  process.exit(0);
}

const rows = await buildFrames(card, card.dir);
let total = coverKb * 1024;
for (const r of rows) {
  total += r.kb * 1024;
  console.log(
    `${r.file}  ${r.size.padEnd(11)} x${r.scale.padStart(5)}  ${String(r.kb).padStart(4)} KB  <- ${r.source}${r.pad ? "   (поле по бокам, без растяжения)" : ""}`,
  );
}
console.log("");
console.log(
  `всего ${rows.length + 1} файлов, ${(total / 1024 / 1024).toFixed(1)} МБ`,
);
