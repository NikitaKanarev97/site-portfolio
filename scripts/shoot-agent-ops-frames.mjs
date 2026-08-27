/**
 * Производство кадров кейса Agent Ops Console.
 *
 * Норма съёмки здесь **отличается от трёх предыдущих кейсов одним числом**, и
 * отличие вынужденное. DSSL, Vet Clinic OS и Pawly снимались viewport
 * `1440×900`: ровно 16:10, кроп не нужен. Agent Ops спроектирован под
 * `1440×1024` с фиксированной высотой артборда — скролл живёт внутри колонок,
 * а нижние полосы действий (`VerdictBar`, `ActionBar`, футер таблицы кластера)
 * прибиты к нижнему краю через `position: sticky`. Снятый на 900 экран режет
 * последнюю строку таблицы пополам — проверено 2026-08-27 на `review-queue`.
 *
 * Поэтому viewport здесь `1640×1025`. Это те же 16:10 (1640/1025 = 1.6), но
 * высота вмещает артборд целиком: ни одна строка, полоса и кнопка не обрезана.
 * Ширина уходит в поля полосы контента — оболочка консоли текучая, и на 1640
 * она просто дышит свободнее. Ни один кадр этого кейса не кропается после
 * съёмки: то, что видно в кадре, — это весь экран.
 *
 * Остальное совпадает с прежней нормой (`scripts/shoot-case-frames.mjs`):
 * `deviceScaleFactor` 1.5, выход `2000×1250` WebP q82, обработка только
 * даунскейл и кодирование. Ни рамок, ни скруглений, ни теней, ни наклона,
 * ни цветокоррекции (`CASE-20`). Скругление и обводку даёт `ScreenStack`.
 *
 * Три рода кадров:
 *
 *   screen    Экран целиком, 16:10. Идёт и в стопку обложки, и в артефакты
 *             решений через `MediaFrame ratio=natural` — кадр один и тот же,
 *             второй раз не переснимается.
 *
 *   page      Страница своей высоты — только индекс экранов прототипа.
 *             Единственный кадр не из консоли, поэтому `fullPage`.
 *
 *   story     Ячейка `CaseSystemGrid`: история `AllVariants` из каталога.
 *             Обрезки по содержимому нет: `.storybook-canvas` уже несёт своё
 *             поле, и `trim()` на тёмном фоне съел бы его неравномерно.
 *             Ширина колонки задаётся у каждой истории своя — 760 не хватает
 *             `VerdictBar` и `AutonomyLadder`, и обе резались по правому краю
 *             (кнопка `Submit` и колонка уровня). Одно число на все ячейки
 *             стоило бы обрезанного варианта в доказательстве матрицы.
 *
 * Роль в `TopStrip` не декорация: очередь подтверждений принадлежит Shift Lead,
 * автономия и качество — Policy Owner. Роль переключается ссылкой на индексе,
 * дальше маршрут открывается **внутри SPA** (`pushState` + `popstate`), а не
 * `goto`: бэкенда нет, состояние живёт в памяти, и перезагрузка начала бы смену
 * заново — вместе с ролью.
 *
 * Запуск:
 *   1. в d:\Claude-projects\Agent-ops-console — npx vite --port 5300
 *   2. там же, в storybook-static             — python -m http.server 6100
 *   3. здесь                                   — node scripts/shoot-agent-ops-frames.mjs
 *
 * Playwright берётся из d:\Claude-projects\Agent-ops-console: продукт этого
 * сайта держит одну JS-зависимость (ds/CONTRACT.md §Стек), браузер для съёмки
 * в неё не входит.
 */
import { createRequire } from 'node:module';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import sharp from 'sharp';

const ORIGIN = process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5300';
const STORYBOOK_ORIGIN = process.env.STORYBOOK_ORIGIN ?? 'http://127.0.0.1:6100';
const PLAYWRIGHT_REPO = process.env.PLAYWRIGHT_REPO ?? 'd:/Claude-projects/Agent-ops-console';

/** Одна норма на все кадры консоли. Меняется здесь и нигде больше. */
const VIEWPORT = { width: 1640, height: 1025 };
const DEVICE_SCALE_FACTOR = 1.5;
const VIEWPORT_OUTPUT = { width: 2000, height: 1250 };
const WEBP_QUALITY = 82;

/** Потолок по длинной стороне у кадров, которые не идут в норму обложки. */
const NATURAL_MAX = 2000;

const MEDIA_DIR = path.resolve('public/media/case-agent-ops');
const COVER_DIR = path.join(MEDIA_DIR, 'cover');

/** Ссылки переключения роли на индексе прототипа. */
const ROLE_LINK = {
  reviewer: 'Martin K.',
  lead: 'Priya S.',
  owner: 'Alex R.',
};

/**
 * Экраны консоли. `cover` — имя файла в `cover/`, если кадр идёт ещё и в
 * стопку обложки. Порядок стопки — от переднего кадра к дальнему: очередь,
 * разбор диалога, подтверждение денег. Передней идёт очередь: на ней задача
 * кейса читается до текста — $18,430 под риском, $0 покрыто.
 */
const SCREENS = [
  { file: 'review-queue.webp', route: '/screens/review-queue', role: 'reviewer', cover: 'review-queue.webp' },
  { file: 'run-detail.webp', route: '/screens/run-detail?run=run-cl-promo-01', role: 'reviewer', cover: 'run-detail.webp' },
  { file: 'action-approvals.webp', route: '/screens/action-approvals', role: 'lead', cover: 'action-approvals.webp' },
  { file: 'cluster-detail.webp', route: '/screens/cluster-detail?cluster=cl-promo', role: 'reviewer', height: 1060 },
  { file: 'trace-gap-state.webp', route: '/screens/trace-gap-state', role: 'reviewer', height: 1580 },
  { file: 'consequence-preview.webp', route: '/screens/consequence-preview', role: 'lead' },
  { file: 'correction.webp', route: '/screens/correction?run=run-cl-promo-01', role: 'reviewer' },
  { file: 'autonomy.webp', route: '/screens/autonomy', role: 'owner' },
  { file: 'quality-dashboard.webp', route: '/screens/quality-dashboard', role: 'owner' },
  { file: 'policy-version-diff.webp', route: '/screens/policy-version-diff', role: 'owner' },
];

/**
 * Индекс экранов прототипа — единственная страница вне оболочки консоли,
 * поэтому единственный `fullPage`.
 *
 * Ширина 1000, а не 1640, и это выведено из соседа по ряду, а не из вкуса.
 * Оба артефакта блока процесса стоят в одном ряду `case-artifacts` двумя
 * равными колонками с `ratio=natural`, то есть выравниваются по верху и
 * растут вниз каждый по своей пропорции. Матрица кнопки — 5 состояний на
 * 12 строк, её пропорция 0.74 и от ширины колонки каталога не зависит.
 * Индекс на 1640 раскладывается в шесть колонок и даёт 1.54: правая
 * картинка уходила вниз вдвое дальше левой, и ряд читался как ошибка
 * вёрстки. На 1000 индекс раскладывается в четыре колонки и даёт 0.68 —
 * пара сходится, как в кейсе Vet Clinic OS (0.71 против 0.69).
 */
const PAGES = [{ file: 'screen-index.webp', route: '/', width: 1000 }];

/**
 * Ячейки `CaseSystemGrid` плюс матрица кнопки для блока процесса.
 *
 * `width` — ширина колонки каталога. Истории идут `layout: centered`, корень
 * ужимается по содержимому, и матрица схлопывается в одну колонку без явной
 * ширины. 760 — общая; 1160 у двух компонентов, которым 760 мало (полоса
 * вердикта теряет `Submit`, лестница автономии — колонку уровня справа).
 */
const STORIES = [
  { file: 'system-amount-figure.webp', id: 'components-amountfigure--all-variants', width: 760 },
  { file: 'system-verdict-bar.webp', id: 'components-verdictbar--all-variants', width: 1160 },
  { file: 'system-metric-row.webp', id: 'components-metricrow--all-variants', width: 760 },
  { file: 'system-empty-state.webp', id: 'components-emptystate--all-variants', width: 760 },
  { file: 'system-autonomy-ladder.webp', id: 'components-autonomyladder--all-variants', width: 1160 },
  { file: 'system-trail-step.webp', id: 'components-trailstep--all-variants', width: 760 },
  { file: 'storybook-matrix.webp', id: 'components-button--all-variants', width: 1160 },
];

/**
 * Полосы прокрутки в headless занимают место в раскладке и съедают ширину
 * неодинаково от экрана к экрану. Больше здесь ничего не прячется: оболочка
 * консоли — это и есть продукт, в отличие от вьюера прототипа Pawly.
 */
const HIDE_CHROME = `
  html { scrollbar-width: none; }
  *::-webkit-scrollbar { width: 0; height: 0; }
`;

const require = createRequire(path.join(PLAYWRIGHT_REPO, 'package.json'));
const { chromium } = require('playwright');

async function report(file) {
  const { width, height } = await sharp(file).metadata();
  console.log(`  → ${path.relative(process.cwd(), file)} (${width}×${height})`);
}

/**
 * Кириллица в кадре опубликованного кейса — это русский fixture, незаметно
 * вернувшийся в английский продукт. Та же защита стоит в скрипте Pawly и по
 * той же причине: поймать это глазами на девятнадцати экранах нельзя.
 */
async function assertLatin(page, where) {
  const cyrillic = await page.evaluate(() => {
    const text = document.body?.innerText ?? '';
    const hit = text.match(/[А-Яа-яЁё][А-Яа-яЁё\s]{2,}/);
    return hit ? hit[0] : null;
  });
  if (cyrillic) throw new Error(`Кириллица в кадре ${where}: «${cyrillic.trim()}»`);
}

async function shoot() {
  await rm(MEDIA_DIR, { recursive: true, force: true });
  await mkdir(COVER_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    reducedMotion: 'reduce',
    colorScheme: 'dark',
  });

  /* Трекер юзер-тестов к кадру отношения не имеет и только добавляет
     ожидание сети. Он и так грузится лишь по ссылке прогона, но кадр не
     должен зависеть от того, какая ссылка открыта. */
  await context.route('**/track.js', (route) => route.fulfill({ body: '' }));

  const page = await context.newPage();

  async function settle() {
    await page.addStyleTag({ content: HIDE_CHROME });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
  }

  /** Роль ставится ссылкой на индексе: перезагрузка начала бы смену заново. */
  async function useRole(role) {
    await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
    await settle();
    const link = page.getByRole('link', { name: new RegExp(ROLE_LINK[role]) }).first();
    await link.click();
    await page.waitForTimeout(200);
  }

  /** Переход внутри SPA: маршрут меняется, состояние смены остаётся. */
  async function enter(route) {
    await page.evaluate((to) => {
      window.history.pushState(null, '', to);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, route);
    await settle();
  }

  for (const frame of SCREENS) {
    /**
     * Два экрана снимаются выше нормы, и это не отступление от неё, а
     * следствие того же правила: ничего не резать. Таблица кластера на
     * семнадцать строк и сравнение четырёх весов пробела не помещаются в
     * артборд 1025 — на нижнем краю остаётся строка, разрезанная пополам
     * прилипшим футером, и половина второй пары карточек. Высоты 1060 и
     * 1580 сняты замером `scrollHeight` области контента: это минимум, при
     * котором прокрутки внутри экрана не остаётся вовсе. Оба кадра идут
     * `MediaFrame ratio=natural` и в стопку обложки не попадают, поэтому
     * 16:10 им не нужно.
     */
    if (frame.height) await page.setViewportSize({ ...VIEWPORT, height: frame.height });

    await useRole(frame.role);
    await enter(frame.route);
    await assertLatin(page, frame.route);

    const raw = await page.screenshot({ type: 'png' });
    const out = path.join(MEDIA_DIR, frame.file);

    await sharp(raw)
      .resize(
        frame.height
          ? { width: NATURAL_MAX, withoutEnlargement: true }
          : { width: VIEWPORT_OUTPUT.width, height: VIEWPORT_OUTPUT.height, fit: 'fill' },
      )
      .webp({ quality: WEBP_QUALITY })
      .toFile(out);

    if (frame.height) await page.setViewportSize(VIEWPORT);

    /* Обложка — тот же файл, а не второй независимый снимок: два прогона
       по одному маршруту однажды разошлись состоянием (кейс Vet Clinic OS). */
    if (frame.cover) {
      await sharp(out).webp({ quality: WEBP_QUALITY }).toFile(path.join(COVER_DIR, frame.cover));
    }

    console.log(frame.route);
    await report(out);
  }

  for (const frame of PAGES) {
    if (frame.width) await page.setViewportSize({ width: frame.width, height: VIEWPORT.height });

    /* Роль ставится и здесь, хотя индекс её не показывает содержанием: она
       стоит в строке переключателя, и без этого кадр унаследовал бы роль
       последнего снятого экрана — Policy Owner после policy-version-diff.
       Индекс — точка входа, и входят в неё Reviewer'ом, как на обложке. */
    await useRole('reviewer');
    await settle();
    await assertLatin(page, frame.route);

    const raw = await page.screenshot({ type: 'png', fullPage: true });
    const out = path.join(MEDIA_DIR, frame.file);

    await sharp(raw)
      .resize({ width: NATURAL_MAX, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(out);

    if (frame.width) await page.setViewportSize(VIEWPORT);

    console.log(frame.route);
    await report(out);
  }

  for (const frame of STORIES) {
    await page.goto(`${STORYBOOK_ORIGIN}/iframe.html?id=${frame.id}&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await page.addStyleTag({
      content: `${HIDE_CHROME}\n#storybook-root { width: ${frame.width}px !important; margin: 0 !important; }`,
    });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await assertLatin(page, frame.id);

    const node = await page.$('#storybook-root');
    if (!node) throw new Error(`#storybook-root не найден у ${frame.id}`);
    const raw = await node.screenshot({ type: 'png' });
    const out = path.join(MEDIA_DIR, frame.file);

    await sharp(raw)
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
