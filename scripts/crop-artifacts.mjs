/**
 * Кропы артефактов решений — находка `L2-5`, 2026-08-28.
 *
 * Зачем. Артефакт внутри `DecisionBlock` стоит в колонке `0.6fr`
 * (`src/components/DecisionBlock.astro`): при контейнере 1232 px и жёлобе 24
 * это ~453 px. Полный экран продукта шириной 2000 px показывается там в
 * масштабе 0,23 — подпись под кадром называет сумму и строку, а увидеть их
 * нельзя. Кроп поднимает масштаб до 0,4–0,5, то есть вдвое.
 *
 * Что рассматривалось вместо кропа. Отдать артефакту всю ширину колонки
 * кейса: тогда масштаб 0,62 и резать нечего. Отклонено — четыре решения в
 * каждом из четырёх кейсов добавили бы порядка 2 800 px к странице, которая
 * и так идёт около 11 000. Кроп сохраняет плотность, а полный экран никуда
 * не девается: он открывается в зуме через `zoomSrc` у `MediaFrame`.
 *
 * Правило кропа. Область берётся ровно та, о которой говорит подпись. Если
 * подпись говорит о двух вещах, а влезает одна, правится подпись, а не
 * кроп: кадр, который «показывает всё» и не читается, не показывает ничего.
 *
 * Исходники не перезаписываются: кроп кладётся рядом с суффиксом `-crop`,
 * оригинал остаётся целью зума.
 *
 * Запуск: node scripts/crop-artifacts.mjs
 * Один кейс: node scripts/crop-artifacts.mjs vet
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Координаты в системе исходного файла. Выбраны по кадру, а не по формуле:
 * граница слева — там, где кончается навигационная колонка продукта, она в
 * доводе не участвует ни на одном из кадров.
 */
/**
 * Русские кадры режутся теми же координатами: `scripts/lock-ru-frame-geometry.mjs`
 * фиксирует их геометрию по английским оригиналам, размеры совпадают
 * побайтово по ширине и высоте. Но совпадение размеров не значит совпадения
 * содержимого — русские подписи длиннее, — поэтому каждый русский кроп
 * проверяется глазами отдельно, а не считается копией английского.
 *
 * Пропустить русскую пару нельзя: `withRussianMedia` переписывает путь
 * `/media/case-agent-ops` в `/media/case-agent-ops-ru`, и кроп без пары
 * даёт на русской локали битую картинку.
 */
const crops = [
  {
    file: 'public/media/case-agent-ops/cluster-detail.webp',
    // Заголовок кластера, экспозиция $4,200, число прогонов и общий источник
    // с меткой «expired 2024-11-30». Таблица участников в кроп не входит:
    // на 453 px её строки нечитаемы при любой границе.
    //
    // Правая граница — 1135, в промежутке между вторым и третьим столбцом
    // плашек. Первая версия резала на 1165 и вносила в кадр обрубок третьего
    // столбца: это читается как сломанный скриншот, а не как деталь.
    box: { left: 285, top: 70, width: 850, height: 370 },
  },
  {
    file: 'public/media/case-agent-ops-ru/cluster-detail.webp',
    box: { left: 285, top: 70, width: 850, height: 370 },
  },
  {
    file: 'public/media/case-agent-ops/consequence-preview.webp',
    // Обе панели последствия плюс ряд «Reject with reason / Approve» над
    // ними и строка о том, что кнопка взведена. Уже панелей резать нельзя:
    // довод в том, что обе стоят на экране одновременно.
    //
    // Верхняя граница — 710, ниже внутреннего разделителя карточки: на 700
    // в кадр попадала её обрезанная полоса. Правая — 1990, иначе подсказка
    // клавиш обрубается на «NEXT».
    box: { left: 870, top: 710, width: 1120, height: 540 },
  },
  {
    file: 'public/media/case-agent-ops-ru/consequence-preview.webp',
    box: { left: 870, top: 710, width: 1120, height: 540 },
  },

  // --- Остальные артефакты решений, находка `L2-5` ---
  //
  // Здесь ширина следует не из общего шаблона, а из обещания подписи. Если
  // экран раскладывает довод по всей ширине, подпись сужена до одной детали:
  // иначе кроп снова превращается в нечитаемый полный экран.
  {
    file: 'public/media/case-dssl/candidate-select.webp',
    // Одна строка и оба кандидата. Справа у карточек остаётся пустая
    // плоскость; граница проходит по ней, не разрезая ни слова и ни контрол.
    // Верхняя граница ниже строки статуса и исходного текста: русская подпись
    // сдвигает раскрытую область вниз, и более ранний кроп резал плашку
    // «Неоднозначно». В подписи остаётся только обещание двух кандидатов.
    box: { left: 365, top: 750, width: 1000, height: 395 },
  },
  {
    file: 'public/media/case-dssl-ru/candidate-select.webp',
    box: { left: 365, top: 750, width: 1000, height: 395 },
  },
  {
    file: 'public/media/case-dssl/cart-change-review.webp',
    // Только карточка изменения цены: левая карточка срока поставки стояла бы
    // рядом ценой масштаба 0,28. Граница слева — жёлоб между карточками.
    box: { left: 1175, top: 656, width: 790, height: 296 },
  },
  {
    file: 'public/media/case-dssl-ru/cart-change-review.webp',
    box: { left: 1175, top: 656, width: 790, height: 296 },
  },
  {
    file: 'public/media/case-vet/visit-quick-trace.webp',
    // После адаптивной переработки три шага стоят рядом. Кроп сохраняет их
    // вместе с приватной строкой и действиями, но снимает пустую нижнюю треть
    // артборда. На странице этот довод идёт во всю ширину DecisionBlock.
    box: { left: 0, top: 0, width: 2000, height: 1140 },
  },
  {
    file: 'public/media/case-vet-ru/visit-quick-trace.webp',
    box: { left: 0, top: 0, width: 2000, height: 1140 },
  },
  {
    file: 'public/media/case-vet/dose-calculator.webp',
    // Панель расчёта целиком от заголовка до итога курса. Старый кроп
    // начинался внутри WeightReading и отрезал контекст; после переработки
    // калькулятор стал правой колонкой рядом с полной записью визита.
    box: { left: 1225, top: 225, width: 745, height: 1395 },
  },
  {
    file: 'public/media/case-vet-ru/dose-calculator.webp',
    box: { left: 1225, top: 225, width: 745, height: 1395 },
  },
  {
    file: 'public/media/case-vet/patient-card-private.webp',
    // Весь зарезервированный цветом блок: название, граница аудитории и сама
    // заметка. Граница совпадает с краями карточки.
    box: { left: 370, top: 1470, width: 1595, height: 300 },
  },
  {
    file: 'public/media/case-vet-ru/patient-card-private.webp',
    box: { left: 370, top: 1490, width: 1595, height: 310 },
  },
  {
    file: 'public/media/case-vet/discharge-preview.webp',
    // После переработки слева стоит полный список исключений, справа — точный
    // документ владельца. Обе колонки обязательны; служебную шапку клиники и
    // внешний воздух снимаем. На странице кадр идёт во всю ширину решения.
    box: { left: 25, top: 100, width: 1950, height: 1240 },
  },
  {
    file: 'public/media/case-vet-ru/discharge-preview.webp',
    box: { left: 25, top: 100, width: 1950, height: 1240 },
  },
  {
    file: 'public/media/case-agent-ops/autonomy.webp',
    // Автоматическое понижение — один читаемый довод вместо всей лестницы.
    // Семь способностей, пять уровней и их доказательства разнесены по всей
    // ширине экрана; обещать их в подписи этого кропа нельзя.
    box: { left: 310, top: 90, width: 1010, height: 180 },
  },
  {
    file: 'public/media/case-agent-ops-ru/autonomy.webp',
    box: { left: 310, top: 90, width: 1010, height: 180 },
  },

  // --- Пара «было → стало» для DSSL, находка `L3-4` / вопрос ИА №12 ---
  //
  // Обе половины режутся под ПОЛНУЮ ширину колонки кейса (~1232 px), а не под
  // 0.6fr: сравнение работает, только если обе стороны читаются, и в узкой
  // колонке нечитаемы обе. Ширины кропов около 1400–1630, то есть масштаб
  // 0,76–0,88 — текст крупнее, чем на любом другом кадре страницы.
  {
    // Старый портал: рельса иконок без подписей, баннер обучения, три плитки
    // и промо-блок. Ровно то, что описывает `CaseContext`: рабочее место
    // профессионального закупщика открывалось маркетингом.
    //
    // Карточка заказа снизу в кроп НЕ входит, и это не эстетика: там живой
    // номер заказа, код ДП и сумма. Границей кропа снимается необходимость
    // ретуши — обрезать надёжнее, чем замазывать.
    // Исходник живёт в проекте портала, а не в `public/`: положить его рядом
    // с сайтом значило бы отдавать пользователям полный необрезанный кадр
    // старого продукта вместе со всем, что из него вырезано.
    file: '../b2b-dssl/pages-default/Главная.png',
    box: { left: 14, top: 78, width: 1426, height: 440 },
    out: 'public/media/case-dssl/legacy-dashboard.webp',
  },
  {
    // Новый дашборд, тот же вопрос «чем открывается рабочее место».
    file: 'public/media/case-dssl/cover/dashboard.webp',
    box: { left: 330, top: 100, width: 1630, height: 560 },
    out: 'public/media/case-dssl/new-dashboard.webp',
  },
  {
    // Русская пара. Старый кадр один и тот же — портал был русским, и
    // подменять его «английской версией» было бы выдумкой.
    // Исходник живёт в проекте портала, а не в `public/`: положить его рядом
    // с сайтом значило бы отдавать пользователям полный необрезанный кадр
    // старого продукта вместе со всем, что из него вырезано.
    file: '../b2b-dssl/pages-default/Главная.png',
    box: { left: 14, top: 78, width: 1426, height: 440 },
    out: 'public/media/case-dssl-ru/legacy-dashboard.webp',
  },
  {
    file: 'public/media/case-dssl-ru/cover/dashboard.webp',
    box: { left: 330, top: 100, width: 1630, height: 560 },
    out: 'public/media/case-dssl-ru/new-dashboard.webp',
  },
];

const targets = process.argv.slice(2);
const selectedCrops = targets.length
  ? crops.filter(({ file, out }) => targets.some((target) => (out ?? file).includes(`/case-${target}`)))
  : crops;

if (!selectedCrops.length) {
  throw new Error(`не найдены кропы для: ${targets.join(', ')}`);
}

for (const { file, box, out: outRel } of selectedCrops) {
  const src = path.join(root, file);
  const out = outRel ? path.join(root, outRel) : src.replace(/\.webp$/, '-crop.webp');
  const meta = await sharp(src).metadata();
  const right = box.left + box.width;
  const bottom = box.top + box.height;
  if (right > meta.width || bottom > meta.height) {
    throw new Error(
      `${file}: кроп выходит за кадр — ${right}×${bottom} против ${meta.width}×${meta.height}`,
    );
  }
  await sharp(src).extract(box).webp({ quality: 92 }).toFile(out);
  const scale = (453 / box.width).toFixed(2);
  console.log(
    `${path.basename(out)} — ${box.width}×${box.height}, масштаб в колонке решения ${scale}`,
  );
}
