/**
 * Движение продукта — Site-portfolio
 *
 * Единственный JS-бандл сайта. Подключается один раз в базовом layout
 * (ds/CONTRACT.md, §Стек: «GSAP подключается одним общим скриптом
 * базового layout. Это единственная JS-зависимость продукта»).
 *
 * Словарь движений закрыт пятью позициями — ds/motion-concept.md §3.
 * Компоненты не пишут анимаций: они объявляют разметкой, какое движение
 * на элементе, а хореографию ведёт этот файл.
 *
 *   data-motion="reveal-text"    Набор     — SplitText по строкам под маской
 *   data-motion="reveal-media"   Раскрытие — маска снизу вверх + контр-масштаб
 *   data-motion="fade"           opacity целым блоком, duration-base
 *   data-motion="rise"           opacity + y 12 to 0 (строки WorksList)
 *
 *   data-motion-intro            контейнер над сгибом: играет по fonts.ready
 *   data-motion-at="0.4"         явная позиция элемента во вступительном такте
 *   data-motion-group            общий ScrollTrigger на детей
 *   data-motion-stagger="tight"  каскад группы: tight | base | loose
 *   data-motion-counter="none"   отключить контр-масштаб у Раскрытия
 *
 * Строка и Состояние (motion-hover, motion-state) живут в CSS-переходах
 * компонентов: это ровно те два смысла, которые CSS исполняет сам
 * (комментарий в ds/tokens.css). Здесь их нет намеренно.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { motion, duration, stagger, withMotionPreference } from './motion.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

/** Потолок ожидания шрифтов: не наступил — стартуем всё равно (§4.1). */
const FONTS_TIMEOUT = 800;
/** Окно, в котором любой жест пользователя дожимает вступление (§4.4). */
const SKIP_WINDOW = 900;
/** Порог появления под сгибом (§4.2). */
const TRIGGER_START = 'top 85%';
/** Сдвиг строк перечня: не токен движения, а геометрия карты §7. */
const RISE_DISTANCE = 12;

const STAGGER = {
  tight: stagger.tight,
  base: stagger.base,
  loose: stagger.loose,
};

/** Контекст текущей страницы. Полностью сбрасывается на astro:before-swap. */
let pageMedia = null;
let splits = [];
let introTimeline = null;
let skipListenersOff = null;

/** Переходы между страницами: включены только вне prefers-reduced-motion. */
let transitionsEnabled = false;
/**
 * Возврат к уже виденной странице — не играем ничего (§4.3, правило 2).
 * Два источника: bfcache (pageshow persisted) и навигация по истории
 * внутри клиентского роутера (navigationType === 'traverse').
 */
let restoredView = false;

/* ------------------------------------------------------------------ */
/* Утилиты                                                             */
/* ------------------------------------------------------------------ */

const toArray = (value) => gsap.utils.toArray(value);

/**
 * will-change ставится в onStart и снимается в onComplete (§9).
 * Постоянного will-change в стилях нет ни у одного элемента.
 */
function lift(targets) {
  return {
    onStart: () => gsap.set(targets, { willChange: 'transform, opacity' }),
    onComplete: () => gsap.set(targets, { willChange: 'auto' }),
  };
}

function staggerFor(el) {
  return STAGGER[el.dataset.motionStagger] ?? stagger.base;
}

/** Элементы страницы с движением, кроме вступительных и детей групп. */
function scrollTargets(root) {
  return toArray(root.querySelectorAll('[data-motion-group], [data-motion]')).filter((el) => {
    if (el.closest('[data-motion-intro]')) return false;
    if (el.hasAttribute('data-motion') && el.parentElement?.closest('[data-motion-group]')) return false;
    return true;
  });
}

/* ------------------------------------------------------------------ */
/* Пять движений                                                       */
/* ------------------------------------------------------------------ */

/** Набор. Строка — смысловая единица; абзацы этим движением не набираются. */
function revealText(el, tl, position) {
  const split = SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'ds-split-line',
    autoSplit: false,
  });
  splits.push(split);

  gsap.set(el, { opacity: 1 });
  tl.from(
    split.lines,
    {
      yPercent: 100,
      duration: motion.revealText.duration,
      ease: motion.revealText.ease,
      stagger: motion.revealText.stagger,
      ...lift(split.lines),
    },
    position,
  );
}

/** Раскрытие. Маска снизу вверх, внутри изображение идёт встречным ходом. */
function revealMedia(el, tl, position) {
  const mask = el.querySelector('.ds-media-mask') ?? el;
  const inner = el.querySelector('.ds-media-inner');
  const counter = el.dataset.motionCounter !== 'none';

  tl.fromTo(
    mask,
    { clipPath: 'inset(100% 0 0 0)' },
    {
      clipPath: 'inset(0% 0 0 0)',
      duration: motion.revealMedia.duration,
      ease: motion.revealMedia.ease,
      ...lift(mask),
    },
    position,
  );

  if (counter && inner) {
    tl.fromTo(
      inner,
      { scale: 1.06 },
      {
        scale: 1,
        duration: motion.revealMedia.duration,
        ease: motion.revealMedia.ease,
        ...lift(inner),
      },
      position,
    );
  }
}

/** Тело блока — целиком, одной opacity. */
function fade(el, tl, position) {
  tl.to(el, { opacity: 1, duration: duration.base, ease: motion.revealText.ease, ...lift(el) }, position);
}

/** Строка перечня — opacity + короткий подъём. */
function rise(targets, tl, position, staggerValue) {
  tl.fromTo(
    targets,
    { opacity: 0, y: RISE_DISTANCE },
    {
      opacity: 1,
      y: 0,
      duration: duration.base,
      ease: motion.revealText.ease,
      stagger: staggerValue,
      ...lift(targets),
    },
    position,
  );
}

/** Разводка по имени движения. */
function play(el, tl, position, staggerValue = 0) {
  switch (el.dataset.motion) {
    case 'reveal-text':
      return revealText(el, tl, position);
    case 'reveal-media':
      return revealMedia(el, tl, position);
    case 'rise':
      return rise(el, tl, position, staggerValue);
    case 'fade':
    default:
      return fade(el, tl, position);
  }
}

/* ------------------------------------------------------------------ */
/* Конечное состояние без движения                                     */
/* ------------------------------------------------------------------ */

/**
 * Ветка покоя и все случаи «не играем»: прямой вход в прокрученную
 * страницу, bfcache, reduce. Раскладка не меняется ни на пиксель (§8).
 */
function settle(root) {
  gsap.set(root.querySelectorAll('[data-motion]'), { clearProps: 'transform', opacity: 1 });
  gsap.set(root.querySelectorAll('.ds-media-mask'), { clipPath: 'none' });
  gsap.set(root.querySelectorAll('.ds-media-inner'), { scale: 1 });
}

/* ------------------------------------------------------------------ */
/* Политика запуска                                                    */
/* ------------------------------------------------------------------ */

/** fonts.ready + один rAF, но не дольше 800 мс (§4.1). */
function fontsSettled() {
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  return Promise.race([fonts, new Promise((resolve) => setTimeout(resolve, FONTS_TIMEOUT))]).then(
    () => new Promise((resolve) => requestAnimationFrame(resolve)),
  );
}

/** Любой жест в первые 900 мс дожимает вступление мгновенно (§4.4). */
function armSkip(tl) {
  const events = ['wheel', 'touchmove', 'keydown', 'pointerdown'];
  const disarm = () => {
    events.forEach((type) => window.removeEventListener(type, finish));
    clearTimeout(timer);
  };
  const finish = () => {
    tl.progress(1);
    disarm();
  };
  const timer = setTimeout(disarm, SKIP_WINDOW);
  events.forEach((type) => window.addEventListener(type, finish, { passive: true }));
  return disarm;
}

/** Вступительный такт: всё, что видно без прокрутки. */
function buildIntro(root) {
  const intro = root.querySelector('[data-motion-intro]');
  if (!intro) return null;

  const tl = gsap.timeline({ paused: true });
  let step = 0;

  toArray(intro.querySelectorAll('[data-motion]')).forEach((el) => {
    const explicit = el.dataset.motionAt;
    const position = explicit === undefined ? step * motion.revealText.stagger : Number(explicit);
    if (explicit === undefined) step += 1;
    play(el, tl, position);
  });

  return tl;
}

/** Всё под сгибом: один триггер на элемент или на группу, once (§4.2). */
function buildScrollScenes(root) {
  scrollTargets(root).forEach((el) => {
    const isGroup = el.hasAttribute('data-motion-group');

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: TRIGGER_START, once: true },
    });

    if (!isGroup) {
      play(el, tl, 0);
      return;
    }

    const step = staggerFor(el);
    const children = toArray(el.querySelectorAll('[data-motion]'));
    const byMovement = children.reduce((acc, child) => {
      const name = child.dataset.motion ?? 'fade';
      (acc[name] ??= []).push(child);
      return acc;
    }, {});

    Object.entries(byMovement).forEach(([name, items]) => {
      if (name === 'rise') {
        rise(items, tl, 0, step);
        return;
      }
      items.forEach((child, index) => play(child, tl, index * step));
    });
  });
}

/* ------------------------------------------------------------------ */
/* Жизненный цикл страницы                                             */
/* ------------------------------------------------------------------ */

function initPage() {
  const root = document.body;

  pageMedia = withMotionPreference(
    gsap,
    () => {
      // Прямой вход в восстановленную позицию или возврат из bfcache:
      // триггеры не создаются, страница сразу в конечном состоянии (§4.3).
      if (window.scrollY > 0 || restoredView) {
        settle(root);
        return () => {};
      }

      introTimeline = buildIntro(root);
      buildScrollScenes(root);

      if (introTimeline) {
        fontsSettled().then(() => {
          if (!introTimeline) return;
          introTimeline.play();
          skipListenersOff = armSkip(introTimeline);
        });
      }

      return () => {
        skipListenersOff?.();
        skipListenersOff = null;
        introTimeline?.kill();
        introTimeline = null;
      };
    },
    () => {
      settle(root);
      return () => {};
    },
  );
}

/** Очистка при переходе: пережившие навигацию триггеры — источник дрожания (§9). */
function teardownPage() {
  skipListenersOff?.();
  skipListenersOff = null;
  introTimeline?.kill();
  introTimeline = null;
  splits.forEach((split) => split.revert());
  splits = [];
  ScrollTrigger.killAll();
  pageMedia?.revert();
  pageMedia = null;
}

/* ------------------------------------------------------------------ */
/* Переход между страницами                                            */
/* ------------------------------------------------------------------ */

/**
 * Такты не накладываются: сначала полный уход, потом приход (§3.5).
 * Хореографию ведёт GSAP; нативная анимация View Transitions отключена
 * через transition:animate="none" на <html> в базовом layout.
 */
function pageOut() {
  return gsap.to(document.body, {
    opacity: 0,
    y: -16,
    duration: motion.pageOut.duration,
    ease: motion.pageOut.ease,
    ...lift(document.body),
  });
}

function pageIn() {
  gsap.fromTo(
    document.body,
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: motion.pageIn.duration,
      ease: motion.pageIn.ease,
      ...lift(document.body),
    },
  );
}

// Единая точка отключения — та же, что у остальных движений (MOT-01).
// Переходы подчиняются правилу без исключений (§8).
withMotionPreference(
  gsap,
  () => {
    transitionsEnabled = true;
    return () => {
      transitionsEnabled = false;
    };
  },
  () => {
    transitionsEnabled = false;
    return () => {};
  },
);

document.addEventListener('astro:before-preparation', (event) => {
  // Кнопка «назад» и «вперёд»: позицию восстанавливает сам роутер, а
  // вступительный такт на уже виденной странице не играет (§4.3).
  restoredView = event.navigationType === 'traverse';
  if (!transitionsEnabled) return;
  const load = event.loader;
  event.loader = async () => {
    await pageOut();
    await load();
  };
});

document.addEventListener('astro:before-swap', teardownPage);

document.addEventListener('astro:after-swap', () => {
  // Скролл ставит сам роутер, до этого события и без анимации: переход
  // вперёд — в 0 (§3.5), возврат по истории — в сохранённую позицию.
  // Своего scrollTo(0, 0) здесь быть не должно: он затирал возврат, и
  // «назад» с кейса приводило на верх главной вместо места ухода.
  if (transitionsEnabled) pageIn();
  else gsap.set(document.body, { clearProps: 'opacity,transform' });
});

document.addEventListener('astro:page-load', () => {
  initPage();
  restoredView = false;
});

window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return;
  restoredView = true;
  settle(document.body);
});

// Снимает страховку из инлайн-скрипта <head>: бандл дошёл, начальные
// состояния под .js можно оставить (TECH-15).
window.__dsMotionBooted = true;
