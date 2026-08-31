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
 * страницы, — указатель (см. §Указатель): системный курсор в запись не
 * попадает физически, и без него интерфейс отвечал бы сам себе.
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
 * Вид указателя задаёт кейс, а не скрипт:
 *
 *   arrow  Стрелка macOS/Windows. Десктопные продукты: DSSL, Agent Ops.
 *   touch  Полупрозрачный круг под палец. Pawly — мобильный продукт, и
 *          стрелка на экране телефона показывала бы взаимодействие,
 *          которого у него не бывает.
 *   none   Указателя нет вовсе: в кадре никто ничего не нажимает
 *          (`mode: 'reflow'`, см. ниже).
 *
 * ## Перестроение ширин — `mode: 'reflow'`
 *
 * У Vet Clinic OS прототип собран галереей экранов: продуктовых обработчиков
 * в нём нет, и снимать «взаимодействие» там было бы инсценировкой. Что у
 * него есть по-настоящему — адаптив, заявленный строкой `Platform` прямо в
 * шапке кейса. Ролик показывает именно его: одно окно, ширина едет от 1440
 * к 390 и обратно, вёрстка перестраивается сама.
 *
 * Технически кадр постоянного размера, а меняется ширина `<iframe>` внутри
 * него: экран продукта живёт в настоящем окне своей ширины, вокруг —
 * подложка `--surface-media` и волосяная обводка `--border-default`, ровно
 * как у композита `shoot-range-frames.mjs`. Иначе кадры скринкаста меняли бы
 * размер посреди записи, и ffmpeg не собрал бы из них ролик.
 *
 * Хост-страница отдаётся перехватом маршрута `/__stage` на origin самого
 * прототипа — тогда рамка и её содержимое одного происхождения, и тайминг
 * анимации ведёт сама страница, а не скрипт снаружи.
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
 * заканчивается возвратом на тот экран, с которого начался, **и в том же
 * состоянии**. Иначе петля даёт рывок на стыке — единственное место, где
 * склейка была бы заметна.
 *
 * Это правило и выбирает сюжеты. Необратимый шаг — применить кандидата к
 * строке, оплатить заказ, подтвердить замену — в петлю не ложится: счётчик
 * после него другой, и стык видно. Поэтому каждый ролик заканчивается тем,
 * чем продукт умеет вернуться сам: «Очистить всё» после разбора вставки,
 * «Отмена» после сравнения кандидатов, закрытие шторки, возврат по «назад».
 * Продукт от этого не показан беднее: во всех сюжетах доказательство — то,
 * что видно **до** нажатия, а не подтверждение после него.
 *
 * Запуск:
 *   1. поднять стенд кейса: Agent-ops-console — 5300, b2b-dssl — 5199,
 *      Vet Clinic OS — 5200, PETS-walking — 5201 (npm run dev -- --port N)
 *   2. здесь — node scripts/shoot-clips.mjs dssl
 *      кейс целиком; один ролик — node scripts/shoot-clips.mjs dssl:clip-line-identity
 *      одну локаль — CLIP_LOCALE=ru node scripts/shoot-clips.mjs pawly
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
/**
 * Плотность выдачи — во сколько раз пикселей в кадре больше, чем CSS-пикселей
 * артборда.
 *
 * Зачем. `src/lib/media.ts` делит пиксели файла на плотность съёмки кадров
 * (1.5) и получает потолок ширины в раскладке. То есть плотность файла и
 * решает, каким ролик встанет на странице. Десктопным клипам своя не нужна:
 * артборд 1440–1680 px и так шире колонки кейса, деление на 1.5 просто
 * приводит его к ней — и заодно даёт те самые полторы плотности.
 *
 * Мобильному Pawly нужна. Экран продукта — 375 CSS px, и клип на 375 пикселей
 * встал бы в колонку шириной 250: телефон получился бы мельче собственных
 * снимков на той же странице, а в слоте `fill` ещё и растянулся бы вдвое
 * против исходника.
 *
 * **Как она берётся — важнее самого числа.** `Page.screencast` отдаёт кадр
 * размером с окно в CSS-пикселях: `deviceScaleFactor` разрешения записи не
 * добавляет, а `maxWidth` умеет только уменьшать (проверено 31.08.2026 —
 * запрос 562 при окне 375 вернул 375). Поэтому пикселей добавляет не
 * настройка записи, а само окно: viewport берётся в `density` раз больше, и
 * страница масштабируется `zoom` на ту же величину. Раскладка от этого не
 * меняется — `zoom` уменьшает область просмотра в CSS-пикселях ровно во
 * столько же раз, и продукт по-прежнему верстается под 375 px (замер:
 * `innerWidth` 562, `body.scrollWidth` 375). Меняется только плотность
 * пикселей в кадре.
 */
const CLIP_DENSITY_DEFAULT = 1;
/** Качество кадров скринкаста. Промежуточный формат, не выдача. */
const FRAME_QUALITY = 92;
/** Частота выдачи. Скринкаст присылает кадры по изменению, здесь — CFR. */
const FPS = 30;

const SCRATCH = path.join(os.tmpdir(), 'site-portfolio-clips');

/** Значения токенов, не подобранные цвета. Те же, что у композита диапазона. */
const SURFACE_MEDIA = '#EFEFEC';
const BORDER_DEFAULT = '#E1E1DC';

/* ------------------------------------------------------------------ *
 * Указатель
 * ------------------------------------------------------------------ */

/**
 * Стрелка ставится остриём в точку курсора: у элемента нулевые поля, а
 * вершина пути лежит в начале координат viewBox. Круг касания, наоборот,
 * центрируется на точке — палец накрывает цель, а не указывает на неё.
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
function pointerScript(kind) {
  const arrowStyle = `
      '#__cursor{position:fixed;left:0;top:0;width:24px;height:24px;z-index:2147483647;',
      'pointer-events:none;transform:translate3d(-200px,-200px,0);will-change:transform}',
      '#__cursor svg{display:block;filter:drop-shadow(0 1.5px 2.5px rgba(0,0,0,.45))}',
      '#__cursor .g{transition:transform .09s ease-out;transform-origin:2px 2px}',
      '#__cursor.__down .g{transform:scale(.82)}',`;

  const touchStyle = `
      '#__cursor{position:fixed;left:0;top:0;width:30px;height:30px;margin:-15px 0 0 -15px;',
      'z-index:2147483647;pointer-events:none;transform:translate3d(-200px,-200px,0);',
      'will-change:transform}',
      '#__cursor svg{display:block;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))}',
      '#__cursor .g{transition:transform .09s ease-out;transform-origin:15px 15px}',
      '#__cursor.__down .g{transform:scale(.78)}',`;

  const arrowNode = `'<svg width="24" height="24" viewBox="-1.2 -1.2 24 24">'
      + '<path class="g" d="M0 0 L0 17.2 L4.5 13.1 L7.4 19.8 L10.2 18.5 L7.3 12 L13.2 11.8 Z" '
      + 'fill="#ffffff" stroke="#111111" stroke-width="1.4" stroke-linejoin="round"/></svg>'`;

  const touchNode = `'<svg width="30" height="30" viewBox="0 0 30 30">'
      + '<circle class="g" cx="15" cy="15" r="13" fill="rgba(17,17,17,.26)" '
      + 'stroke="rgba(255,255,255,.9)" stroke-width="2"/></svg>'`;

  return `(() => {
  const mount = () => {
    if (document.getElementById('__cursor')) return;

    const style = document.createElement('style');
    style.id = '__cursorStyle';
    style.textContent = [
${kind === 'touch' ? touchStyle : arrowStyle}
      '#__ripple{position:fixed;left:0;top:0;width:32px;height:32px;margin:-16px 0 0 -16px;',
      'border-radius:50%;border:2px solid rgba(255,255,255,.85);z-index:2147483646;',
      'pointer-events:none;opacity:0;filter:drop-shadow(0 0 1.5px rgba(0,0,0,.6));',
      'transform:translate3d(-200px,-200px,0) scale(.3)}'
    ].join('');

    const wrap = document.createElement('div');
    wrap.id = '__cursor';
    wrap.innerHTML = ${kind === 'touch' ? touchNode : arrowNode};

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
}

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
  constructor(page, start) {
    this.page = page;
    this.start = start;
    this.at = start;
  }

  /**
   * Указатель уходит за нижний край кадра. Обязателен в конце сценария:
   * первый кадр ролика рисуется без указателя (он ещё не вошёл), и
   * оставленная в кадре стрелка давала бы на стыке петли скачок — она
   * есть, и её тут же нет.
   */
  async exit() {
    await this.moveTo(this.start);
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

  /** Нажатие в точку. Цель уже выбрана вызывающим — здесь только моторика. */
  async pressAt(point) {
    await this.moveTo(point);
    await this.page.waitForTimeout(90 + Math.random() * 70);
    await this.page.evaluate(() => window.__press?.(true));
    await this.page.mouse.down();
    await this.page.waitForTimeout(70);
    await this.page.mouse.up();
    await this.page.evaluate(() => window.__press?.(false));
  }

  async click(locator) {
    const box = await locator.boundingBox();
    if (!box) throw new Error('цель нажатия не видна на экране');
    // Не в геометрический центр: рука не попадает в пиксель.
    await this.pressAt({
      x: box.x + box.width * (0.42 + Math.random() * 0.16),
      y: box.y + box.height * (0.42 + Math.random() * 0.16),
    });
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

  /**
   * Вставка из буфера. Экран быстрого заказа обещает не набор, а «paste
   * from Excel», и посимвольный набор показывал бы другое обещание.
   */
  async paste(text) {
    await this.page.keyboard.insertText(text);
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
 * Оболочка прототипов
 * ------------------------------------------------------------------ */

/**
 * Полосы прокрутки и оболочка прототипа — те же правила, что у съёмки
 * кадров (`shoot-range-frames.mjs`). Указатель к оболочке не относится:
 * он добавляется отдельным скриптом. Что не общее — доезжает полем `css`
 * самого кейса.
 */
const HIDE_CHROME = `
  html { scrollbar-width: none; }
  *::-webkit-scrollbar { width: 0; height: 0; }
  [class*="viewerBack"], [class*="protoToggle"], [class*="protoPanel"] { display: none !important; }
  [class*="viewer"] { padding-block-start: 0 !important; }
`;

/** У Pawly экран живёт во вьюере со своей шапкой — те же правила, что в композите. */
const PAWLY_CSS = `
  [class*="viewerBar"] { display: none !important; }
  [class*="viewer"] {
    width: 100% !important;
    padding: 0 !important;
    min-height: 0 !important;
  }
  [class*="device"] {
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
`;

/* ------------------------------------------------------------------ *
 * Кейсы
 * ------------------------------------------------------------------ */

/**
 * Четыре строки спецификации, которые закупщик копирует из своего файла.
 * Данные синтетические и взяты из каталога прототипа (D013 проекта
 * b2b-dssl): две строки матчатся точно, третья даёт одиннадцать кандидатов,
 * четвёртая не находится вовсе. Четвёртая написана по-русски намеренно —
 * так выглядит настоящая спецификация интегратора, и ровно на ней видно
 * обещание экрана: исходная строка сохраняется дословно.
 */
const SPEC_PASTE = 'KX-2CB4046F2-I, 12\nKX-7608NI-K2, 2\nnvr 8ch poe, 2\nкамера 4мп уличная, 8';

const CASES = {
  'agent-ops': {
    repo: 'd:/Claude-projects/Agent-ops-console',
    origin: process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5300',
    media: 'public/media/case-agent-ops',
    mediaRu: 'public/media/case-agent-ops-ru',
    pointer: 'arrow',
    clips: [
      {
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
        /** Вход в очередь: роль ставится на индексе, маршрут — pushState в SPA. */
        async open(page, { origin, prefix, settle }) {
          await page.goto(`${origin}${prefix}/`, { waitUntil: 'networkidle' });
          await settle();
          await page.getByRole('link', { name: /Martin K./ }).first().click();
          await page.waitForTimeout(250);
          await page.evaluate((to) => {
            window.history.pushState(null, '', to);
            window.dispatchEvent(new PopStateEvent('popstate'));
          }, `${prefix}/screens/review-queue`);
          await page.waitForTimeout(650);
          await settle();
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
        async scenario(page, hand, { settle, note }) {
          const row = page.locator('[class*="runTable"] [class*="row"]').nth(2);

          await page.waitForTimeout(300);
          await hand.hover(row, 300);
          await hand.click(row.locator('a').first());
          await page.waitForTimeout(560);
          await settle();

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
          await settle();
          await hand.click(page.locator('main button').first());
          await page.waitForTimeout(620);
        },
      },
    ],
  },

  /**
   * Partner Portal. Два ролика на разных экранах и с разными обещаниями:
   * первый — как спецификация попадает в систему, второй — как решается,
   * чем является одна её строка. Ширина 1680, а не 1440: таблица разбора
   * заявляет `tableMinWidth` 1016, и на 1440 колонка «Статус» уезжает под
   * горизонтальную прокрутку — в кадре это читалось бы обрезанным экраном,
   * а не плотной таблицей.
   */
  dssl: {
    repo: 'd:/Claude-projects/b2b-dssl',
    origin: process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5199/b2b',
    media: 'public/media/case-dssl',
    mediaRu: 'public/media/case-dssl-ru',
    pointer: 'arrow',
    clips: [
      {
        out: 'clip-paste-specification',
        width: 1680,
        height: 900,
        /**
         * Второй интакт спецификации целиком: вставка из Excel, разбор
         * колонок, четыре строки с их исходным текстом и итог готовности.
         *
         * Сюжет выбран тем, что он единственный показывает обещание кейса
         * в момент его исполнения: «11 possible matches» и «No catalog
         * match» — это не ошибки импорта, а строки, которые никуда не
         * делись. Полоса готовности проговаривает это словами продукта:
         * «nothing is dropped, provenance is kept».
         *
         * Петля закрывается «Очистить всё» — своей же кнопкой продукта,
         * возвращающей пустую поверхность вставки. Последний клик по пустому
         * месту снимает фокус с поля: иначе на стыке петли рамка фокуса
         * появлялась бы из ниоткуда.
         */
        async open(page, { origin, prefix, settle }) {
          await page.goto(`${origin}${prefix}/quick-order`, { waitUntil: 'networkidle' });
          await settle();
        },
        async scenario(page, hand) {
          const clearAll = page.getByRole('button', { name: /^(Clear all|Очистить всё)$/ });

          await page.waitForTimeout(420);
          await hand.click(page.locator('[data-track="quick-order-paste"]'));
          await page.waitForTimeout(300);
          await hand.paste(SPEC_PASTE);
          // Метка кнопки считает строки по мере ввода — это её и видно.
          await page.waitForTimeout(900);

          await hand.click(page.locator('[data-track="quick-order-parse"]'));
          await page.waitForTimeout(1500);

          // Исходный текст строки не переводится и не переписывается — по нему
          // же и наводимся: русская строка в английском интерфейсе и есть
          // доказательство сохранённой провенанс-записи.
          // `visible=true`: таблица рендерит две раскладки сразу — карточки
          // под bp-md и строки над ним, — и невидимая половина тоже совпадает
          // с текстом.
          await hand.hover(page.getByText('камера 4мп уличная').locator('visible=true').first(), 1100);
          await page.waitForTimeout(500);

          await hand.click(clearAll);
          await page.waitForTimeout(700);
          // Клик по пустой подложке справа: поле теряет фокус, кадр сходится
          // с первым. Координата — под карточкой «How this works», там нет
          // ни одного элемента управления.
          await hand.pressAt({ x: 1500, y: 800 });
          await page.waitForTimeout(300);
          await hand.exit();
          await page.waitForTimeout(600);
        },
      },
      {
        out: 'clip-line-identity',
        width: 1680,
        height: 900,
        /**
         * Одна неоднозначная строка, открытая и сравнённая. Панель печатает
         * исходный текст, количество и причину неоднозначности, а два
         * кандидата различаются не ценой, а признаком: «Object detection on
         * all channels» против «No object detection».
         *
         * Ролик заканчивается «Отменой», а не «Применить»: подпись артефакта
         * этого решения и раньше говорила «compared before the choice is
         * applied». Применение сдвинуло бы счётчик очереди, и стык петли
         * стал бы виден — а доказательство здесь в том, что видно **до**
         * нажатия: система не выбирает за закупщика.
         */
        async open(page, { origin, prefix, settle }) {
          await page.goto(`${origin}${prefix}/resolution-center`, { waitUntil: 'networkidle' });
          await settle();
        },
        async scenario(page, hand) {
          // Исходный текст строки — данные, а не интерфейс: он одинаков в
          // обеих локалях, и от него же берётся кнопка действия строки.
          // `visible=true` — по той же причине, что в ролике вставки: под
          // `bp-md` та же строка нарисована карточкой и в DOM присутствует.
          const source = page.getByText('nvr 8ch poe').locator('visible=true').first();
          const rowAction = source.locator('xpath=ancestor::div[.//button][1]//button');

          await page.waitForTimeout(420);
          await hand.hover(source, 500);
          await hand.click(rowAction);

          // `data-flip` несёт каждая строка очереди — панель отличается тем,
          // что внутри неё радиогруппа кандидатов, и только там она есть.
          const panel = page.locator('[data-flip]').filter({ has: page.locator('[role="radiogroup"]') });
          await panel.waitFor({ state: 'visible' });
          await page.waitForTimeout(1200);

          // Второй кандидат — тот, что дешевле и без распознавания объектов.
          await hand.click(panel.locator('label').nth(1));
          await page.waitForTimeout(1300);

          // Радиокнопки radix — тоже <button>; «Отмена» — последняя из тех,
          // что кнопками и являются.
          await hand.click(panel.locator('button:not([role="radio"])').last());
          await page.waitForTimeout(500);
          await hand.exit();
          await page.waitForTimeout(600);
        },
      },
    ],
  },

  /**
   * Vet Clinic OS. Прототип собран галереей экранов без продуктовых
   * обработчиков — «взаимодействие» там пришлось бы инсценировать, а
   * `CASE-20` заведён ради обратного. Что у продукта есть по-настоящему —
   * адаптив, и ролик показывает именно его.
   *
   * Экран выбран быстрым следом визита, а не очередью дня: очередь уже
   * стоит на странице композитом диапазона, а планшет назван платформой
   * прямо в шапке кейса — и вот он, тот самый экран, который врач держит
   * в руках в кабинете.
   *
   * Playwright берётся из b2b-dssl: в Veterinary-clinic его нет — та же
   * причина и та же ссылка, что в `shoot-vet-frames.mjs`.
   */
  vet: {
    repo: 'd:/Claude-projects/b2b-dssl',
    origin: process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5200',
    media: 'public/media/case-vet',
    mediaRu: 'public/media/case-vet-ru',
    pointer: 'none',
    clips: [
      {
        out: 'clip-widths-quick-trace',
        mode: 'reflow',
        width: 1440,
        height: 900,
        route: '/app/visit-quick-trace',
        /**
         * Концы диапазона и планшет между ними — те же три числа, что у
         * композита `range-vet-day-queue`. Выдержки длиннее переездов:
         * читатель должен успеть прочитать раскладку, а не только увидеть
         * движение.
         */
        steps: [
          { to: 1440, ms: 0, hold: 1500 },
          { to: 768, ms: 1000, hold: 1900 },
          { to: 390, ms: 1000, hold: 1900 },
          { to: 1440, ms: 1100, hold: 1500 },
        ],
      },
    ],
  },

  /**
   * Pawly. Единственный мобильный кейс: ширина 375 — вся правда продукта,
   * и высота у каждого ролика своя, равная высоте экрана в реестре
   * прототипа. Указатель — круг касания, а не стрелка.
   *
   * Три ролика по трём разным обещаниям кейса: что сказано до оплаты, что
   * стоит за словом «проверен» и что происходит, когда выгульщик отменился.
   */
  pawly: {
    repo: 'd:/Claude-projects/PETS-walking',
    origin: process.env.PROTOTYPE_ORIGIN ?? 'http://localhost:5201',
    media: 'public/media/case-pawly',
    mediaRu: 'public/media/case-pawly-ru',
    pointer: 'touch',
    density: 1.5,
    css: PAWLY_CSS,
    clips: [
      {
        out: 'clip-booking-disclosures',
        width: 375,
        height: 904,
        /**
         * Экран проверки заказа целиком: цена с итогом, три раскрытия —
         * страховки нет, правило отмены, доступ в дом — и кнопка оплаты,
         * до которой ролик намеренно не доходит.
         *
         * Первым открывается именно отсутствие страховки: тезис кейса в
         * том, что продукт называет то, чего не гарантирует, и называет
         * это **до** оплаты, а не мелким шрифтом после неё.
         */
        async open(page, { origin, prefix, settle }) {
          await page.goto(`${origin}${prefix}/app/booking-review`, { waitUntil: 'networkidle' });
          await settle();
        },
        async scenario(page, hand, { scale }) {
          const disclosures = page.locator('[data-action="disclose"]');
          const scrim = page.locator('[class*="sheetScrim"]');
          // Закрытие — касанием по затемнению над шторкой, как это делают
          // пальцем. Точка берётся от кадра, а не константой: при съёмке с
          // плотностью окно в полтора раза шире.
          const above = { x: 188 * scale, y: 90 * scale };

          await page.waitForTimeout(600);
          await hand.click(disclosures.nth(0));
          await page.waitForTimeout(1900);
          await hand.pressAt(above);
          await page.waitForTimeout(700);

          await hand.click(disclosures.nth(1));
          await page.waitForTimeout(1900);
          await hand.pressAt(above);
          await scrim.waitFor({ state: 'detached' });
          await page.waitForTimeout(400);
          await hand.exit();
          await page.waitForTimeout(700);
        },
      },
      {
        out: 'clip-verification',
        width: 375,
        height: 1046,
        /**
         * Семь этапов проверки с датами — и шторка, объясняющая, что за
         * каждым из них стоит. Значок «проверен» в кадре есть, но он здесь
         * не доказательство, а итог: ровно то, что утверждает решение.
         *
         * Петля закрывается кнопкой шторки: состояние экрана не меняется
         * ни на шаг, поэтому последний кадр равен первому.
         */
        async open(page, { origin, prefix, settle }) {
          await page.goto(`${origin}${prefix}/app/walker-profile`, { waitUntil: 'networkidle' });
          await settle();
        },
        async scenario(page, hand) {
          const sheet = page.locator('[class*="sheetLayer"]');

          await page.waitForTimeout(1400);
          await hand.click(page.locator('[class*="linkRow"]').first());
          await sheet.waitFor({ state: 'visible' });
          await page.waitForTimeout(2600);

          await hand.click(sheet.locator('button').last());
          await page.waitForTimeout(500);
          await hand.exit();
          await page.waitForTimeout(800);
        },
      },
      {
        out: 'clip-replacement',
        width: 375,
        height: 656,
        /**
         * Замена выгульщика: время и цена не меняются, совместимость уже
         * проверена, а на кнопке идёт настоящий обратный отсчёт — то
         * единственное в портфолио, чего снимок показать не может в
         * принципе.
         *
         * Уход по «выбрать другого» и возврат назад — не украшение, а
         * замыкание петли: отсчёт стартует заново с монтированием экрана,
         * и последний кадр сходится с первым. Заодно ролик показывает обе
         * ветки решения: автоматическое назначение по таймауту и право
         * владельца его не ждать.
         */
        async open(page, { origin, prefix, settle }) {
          await page.goto(`${origin}${prefix}/app/replacement-offer`, { waitUntil: 'networkidle' });
          await settle();
        },
        async scenario(page, hand, { settle }) {
          const footer = page.locator('[class*="screenFooter"] button');

          // Отсчёт идёт с 59; пауза здесь не пустая — она и есть кадр.
          await page.waitForTimeout(4200);
          await hand.click(footer.nth(1));
          await page.waitForTimeout(1400);
          await settle();

          await hand.click(page.locator('[class*="navbar"] button').first());
          await page.waitForTimeout(700);
          await hand.exit();
          await page.waitForTimeout(1100);
        },
      },
    ],
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

/**
 * Хост-страница режима `reflow`. Отдаётся перехватом на origin прототипа,
 * поэтому рамка и её содержимое одного происхождения. Подложка и обводка —
 * значения токенов, те же, что у композита диапазона.
 */
function stageHtml({ src, width, height }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    html, body { margin: 0; height: 100%; background: ${SURFACE_MEDIA}; overflow: hidden; }
    .stage { height: 100%; display: flex; justify-content: center; align-items: flex-start; }
    iframe {
      display: block; border: 0; height: ${height}px; width: ${width}px;
      background: #fff; box-shadow: 0 0 0 1px ${BORDER_DEFAULT};
    }
  </style></head><body><div class="stage"><iframe id="stage" src="${src}"></iframe></div></body></html>`;
}

async function openStage(page, clip, { origin, prefix, css }) {
  const src = `${origin}${prefix}${clip.route}`;
  await page.route('**/__stage', (route) => route.fulfill({
    contentType: 'text/html; charset=utf-8',
    body: stageHtml({ src, width: clip.steps[0].to, height: clip.height }),
  }));

  await page.goto(`${origin}/__stage`, { waitUntil: 'networkidle' });
  const handle = await page.waitForSelector('#stage');
  const frame = await handle.contentFrame();
  await frame.waitForLoadState('networkidle');
  await frame.addStyleTag({ content: HIDE_CHROME + (css ?? '') });
  await frame.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  return frame;
}

/** Тайминг переезда ведёт сама страница: rAF, а не шаги из скрипта. */
async function runReflow(page, steps) {
  await page.evaluate((plan) => new Promise((done) => {
    const el = document.getElementById('stage');
    // Плавный вход и выход: резкий старт читается рывком, а не переездом.
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2);
    let index = 0;
    const next = () => {
      if (index >= plan.length) return done();
      const step = plan[index];
      const from = parseFloat(el.style.width) || plan[0].to;
      index += 1;
      if (!step.ms) {
        el.style.width = `${step.to}px`;
        setTimeout(next, step.hold);
        return;
      }
      const t0 = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - t0) / step.ms);
        el.style.width = `${from + (step.to - from) * ease(t)}px`;
        if (t < 1) requestAnimationFrame(tick);
        else setTimeout(next, step.hold);
      };
      requestAnimationFrame(tick);
    };
    next();
  }), steps);
}

async function shootClip(browser, config, clip, locale, dir) {
  const prefix = locale === 'ru' ? '/ru' : '';
  const density = config.density ?? CLIP_DENSITY_DEFAULT;
  const frame = { width: Math.round(clip.width * density), height: Math.round(clip.height * density) };
  /** Масштаб страницы. Раскладку не меняет — см. §Плотность выдачи. */
  const zoom = density === 1 ? '' : `html { zoom: ${density}; }`;
  const context = await browser.newContext({
    viewport: frame,
    /*
     * Запас по плотности берётся с учётом `zoom`: страница, увеличенная в
     * полтора раза, уже рисуется полутора пикселями на CSS-пиксель, и
     * `deviceScaleFactor` 2 поверх неё дал бы втрое больше пикселей на кадр,
     * чем нужно. Дороже всего это стоит не месту, а частоте: скринкаст
     * кодирует каждый кадр, и на 1124×3136 частота падала до 10 fps —
     * движение указателя становилось рваным. Произведение density × DSF
     * держится равным `DEVICE_SCALE_FACTOR`.
     */
    deviceScaleFactor: DEVICE_SCALE_FACTOR / density,
    colorScheme: 'light',
    // Движение продукта — содержание ролика, глушить его нечем.
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  const cursor = config.pointer === 'none' ? null : pointerScript(config.pointer);
  if (cursor) await page.addInitScript(cursor);

  /**
   * Приведение экрана в съёмочный вид после каждой навигации: оболочка
   * прототипа, шрифты, локаль — и указатель. Указатель здесь же, потому что
   * переход внутри SPA может снять его вместе с поддеревом, а проверять это
   * глазами на готовом ролике — самый дорогой способ узнать.
   */
  const settle = async () => {
    await page.addStyleTag({ content: zoom + HIDE_CHROME + (config.css ?? '') });
    if (cursor) await page.evaluate(cursor);
    await page.evaluate(() => document.fonts.ready);
    if (locale !== 'ru') return;
    await page.evaluate(() => window.dispatchEvent(new Event('ru:localize')));
    await page.waitForTimeout(280);
  };

  const reflow = clip.mode === 'reflow';

  if (reflow) {
    const stage = await openStage(page, clip, { origin: config.origin, prefix, css: config.css });
    if (locale === 'ru') {
      const lang = await stage.evaluate(() => document.documentElement.lang);
      if (lang !== 'ru') throw new Error('русская локаль не активна');
    }
  } else {
    await clip.open(page, { origin: config.origin, prefix, settle });
    if (locale === 'ru') {
      const lang = await page.evaluate(() => document.documentElement.lang);
      if (lang !== 'ru') throw new Error('русская локаль не активна');
    }
  }

  const hand = new Hand(page, { x: frame.width * 0.18, y: frame.height + 80 });
  // Указатель входит в кадр с края, а не возникает посреди экрана.
  if (cursor) await page.mouse.move(hand.at.x, hand.at.y);

  const client = await context.newCDPSession(page);
  const frames = [];
  client.on('Page.screencastFrame', (f) => {
    frames.push({ data: f.data, t: f.metadata.timestamp });
    client.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: FRAME_QUALITY,
    maxWidth: frame.width,
    maxHeight: frame.height,
    everyNthFrame: 1,
  });

  if (reflow) await runReflow(page, clip.steps);
  else await clip.scenario(page, hand, { prefix, settle, scale: density, note: clip.note?.[locale] });

  await client.send('Page.stopScreencast');

  /*
   * Хвостовой кадр. Скринкаст присылает кадры по перерисовке, поэтому после
   * ухода указателя за край новых кадров не приходит вовсе: последним в
   * записи остаётся кадр, где указатель ещё виден у самой кромки. На стыке
   * петли это давало бы призрак курсора, которого в первом кадре нет.
   *
   * Поэтому устоявшееся состояние снимается отдельно и дописывается в конец
   * дважды — второй раз через 0,8 с, чтобы у ролика была выдержка перед
   * склейкой. Снимок берётся при том же `deviceScaleFactor` и приводится к
   * ширине артборда: кадры concat обязаны быть одного размера.
   */
  const settled = await sharp(await page.screenshot({ type: 'jpeg', quality: FRAME_QUALITY }))
    .resize(frame.width, frame.height)
    .jpeg({ quality: FRAME_QUALITY })
    .toBuffer();
  const tail = frames.at(-1).t;
  frames.push({ data: settled.toString('base64'), t: tail + 0.25 });
  frames.push({ data: settled.toString('base64'), t: tail + 1.05 });

  await context.close();

  if (frames.length < 30) throw new Error(`кадров ${frames.length} — скринкаст не пошёл`);
  const seconds = frames.at(-1).t - frames[0].t;
  console.log(`  ${clip.out} · ${locale}: ${frames.length} кадров, ${seconds.toFixed(1)} с, `
    + `${(frames.length / seconds).toFixed(1)} fps`);

  await mkdir(path.resolve(dir), { recursive: true });
  const outBase = path.resolve(dir, clip.out);
  await encode(frames, outBase);
  return outBase;
}

async function shootCase(name, only) {
  const config = CASES[name];
  if (!config) throw new Error(`кейс ${name} не описан в CASES`);
  const clips = only ? config.clips.filter((clip) => clip.out === only) : config.clips;
  if (!clips.length) throw new Error(`ролик ${only} не описан в кейсе ${name}`);

  const require = createRequire(path.join(config.repo, 'package.json'));
  const { chromium } = require('playwright');
  const browser = await chromium.launch();

  const locales = process.env.CLIP_LOCALE
    ? [[process.env.CLIP_LOCALE, process.env.CLIP_LOCALE === 'ru' ? config.mediaRu : config.media]]
    : [['en', config.media], ['ru', config.mediaRu]];

  for (const clip of clips) {
    for (const [locale, dir] of locales) {
      const base = await shootClip(browser, config, clip, locale, dir);
      for (const suffix of ['.webm', '.mp4', '-poster.webp']) {
        const file = `${base}${suffix}`;
        const { size } = await stat(file);
        console.log(`  → ${path.relative(process.cwd(), file)} (${Math.round(size / 1024)} КБ)`);
      }
    }
  }

  await browser.close();
}

const targets = process.argv.slice(2);
if (!targets.length) throw new Error('назови кейс: node scripts/shoot-clips.mjs dssl');

for (const target of targets) {
  const [name, only] = target.split(':');
  console.log(name);
  await shootCase(name, only);
}
