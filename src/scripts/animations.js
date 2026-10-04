/**
 * Движение продукта — Site-portfolio
 *
 * Единственный JS-бандл сайта. Подключается один раз в базовом layout
 * (ds/CONTRACT.md, §Стек: «GSAP подключается одним общим скриптом
 * базового layout. Это единственная JS-зависимость продукта»).
 *
 * Словарь v1 и расширение кейсов S2 — ds/motion-concept.md §3.
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
import { CustomEase } from 'gsap/CustomEase';
import { motion, duration, stagger, withMotionPreference } from './motion.js';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create(motion.lines.ease, motion.lines.curve);
if (import.meta.env.DEV) {
  window.__dsMotionDebug = () => ({ triggers: ScrollTrigger.getAll().length,
    reading: { scene: focusReadingSnapshot?.step?.dataset.scene, index: focusReadingSnapshot?.index,
      progress: focusReadingSnapshot?.progress, observing: Boolean(focusReadingObserver), y: focusReadingY },
    focusScenes: ScrollTrigger.getAll().filter(scene => scene.trigger?.matches('[data-motion="focus-stage"]'))
      .map(scene => ({ start: scene.start, end: scene.end, progress: scene.progress, active: scene.isActive })),
    pins: ScrollTrigger.getAll().filter(scene => scene.pin).length,
    marquees: Array.from(document.querySelectorAll('[data-motion="marquee"]')).map(track => ({
      triggers: ScrollTrigger.getAll().filter(scene => scene.trigger === track.parentElement).map(scene => ({ active: scene.isActive, start: scene.start, end: scene.end })),
      tweens: gsap.getTweensOf(track).map(tween => ({ paused: tween.paused(), active: tween.isActive(), time: tween.totalTime(), duration: tween.duration(), parent: Boolean(tween.parent) })),
    })),
    duplicateScenes: ScrollTrigger.getAll().filter((scene, index, all) => all.slice(0,index).some(previous =>
      previous.trigger === scene.trigger && Boolean(previous.pin) === Boolean(scene.pin) && previous.start === scene.start && previous.end === scene.end)).length });
}

/** Потолок ожидания шрифтов: не наступил — стартуем всё равно (§4.1). */
const FONTS_TIMEOUT = 800;
/** Окно, в котором любой жест пользователя дожимает вступление (§4.4). */
const SKIP_WINDOW = 900;
/** Порог появления под сгибом (§4.2). */
const TRIGGER_START = 'top 85%';

// Keep the current material across reduced-motion and responsive geometry changes.
let focusReadingSnapshot = null;
let focusReadingTimer = null;
let focusReadingFrame = null;
let focusReadingObserver = null;
let focusReadingTarget = null;
let focusReadingY = null;
let focusReadingSize = null;
let focusReadingEpoch = 0;
function cancelFocusReading() {
  focusReadingEpoch += 1;
  clearTimeout(focusReadingTimer);
  cancelAnimationFrame(focusReadingFrame);
  focusReadingTimer = focusReadingFrame = null;
  focusReadingObserver?.disconnect();
  focusReadingObserver = focusReadingTarget = focusReadingY = focusReadingSize = null;
}
function rememberFocusReading(list, scene, steps = Array.from(list.querySelectorAll('[data-focus-state]'))) {
  const cfg = motion.focusStage;
  const progress = scene.progress * (steps.length - 1);
  const index = Math.min(steps.length - 1, Math.floor(progress + 1 - cfg.hold));
  focusReadingSnapshot = { list, step: steps[index], index, progress, enhanced: true,
    y: scrollY, start: scene.start, end: scene.end,
    top: cfg.inset + list.querySelector('.case-steps__stage').getBoundingClientRect().top - list.getBoundingClientRect().top };
}
function restoreFocusReading(snapshot) {
  if (!snapshot?.list.isConnected) return;
  cancelFocusReading();
  const epoch = focusReadingEpoch;
  const apply = () => {
    if (epoch !== focusReadingEpoch) return;
    if (!snapshot.list.isConnected) { cancelFocusReading(); return; }
    if (focusReadingY != null && Math.abs(scrollY - focusReadingY) > 1) {
      const scene = ScrollTrigger.getAll().find(scene => scene.trigger === snapshot.list && scene.pin);
      const rect = focusReadingTarget.getBoundingClientRect();
      const leftMaterial = scene ? scrollY < scene.start || scrollY > scene.end
        : rect.bottom <= 0 || rect.top >= innerHeight;
      // A native/programmatic navigation can leave the stage before scroll is delivered.
      if (leftMaterial) { cancelFocusReading(); return; }
    }
    let material = snapshot.step;
    if (snapshot.index != null && getComputedStyle(material).display === 'none') {
      material = Array.from(snapshot.list.querySelectorAll('[data-focus-state]')).slice(0, snapshot.index).reverse()
        .find(el => getComputedStyle(el).display !== 'none') || material;
    }
    let y;
    if (snapshot.list.classList.contains('is-focused') && snapshot.index != null) {
      const base = (snapshot.list.closest('.pin-spacer') || snapshot.list).getBoundingClientRect().top + scrollY - motion.focusStage.inset;
      y = base + Math.max(0, snapshot.progress ?? snapshot.index) * motion.focusStage.distance;
    } else {
      y = material.getBoundingClientRect().top + scrollY - snapshot.top;
    }
    focusReadingTarget = material;
    const rect = material.getBoundingClientRect(), listRect = snapshot.list.getBoundingClientRect();
    focusReadingSize = [rect.width, rect.height, listRect.width, listRect.height];
    focusReadingY = Math.round(y);
    window.scrollTo(0, y);
    ScrollTrigger.update();
    if (snapshot.list.classList.contains('is-focused')) {
      const scene = ScrollTrigger.getAll().find(scene => scene.trigger === snapshot.list && scene.pin);
      focusReadingSnapshot = { ...snapshot, step: material, enhanced: true, y,
        progress: scene ? scene.progress * (snapshot.list.querySelectorAll('[data-focus-state]').length - 1) : snapshot.progress,
        start: scene?.start, end: scene?.end, top: material.getBoundingClientRect().top };
    } else {
      focusReadingSnapshot = { ...snapshot, step: material, progress: null, enhanced: false, y,
        top: material.getBoundingClientRect().top };
    }
  };
  // Reverted panels can change size after the fixed reflow wait. Keep this
  // material anchored until the reader moves; never capture an intermediate panel.
  focusReadingObserver = new ResizeObserver(apply);
  focusReadingObserver.observe(snapshot.list);
  focusReadingObserver.observe(snapshot.step);
  focusReadingFrame = requestAnimationFrame(() => {
    focusReadingFrame = null;
    apply();
    // Native panels settle after responsive/context styles have been reverted.
    focusReadingTimer = setTimeout(() => { focusReadingTimer = null; apply(); }, motion.focusStage.reflowWait * 1000);
  });
}
['wheel', 'touchmove', 'keydown', 'pointerdown'].forEach(type => window.addEventListener(type, cancelFocusReading, { passive: true }));
const focusPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
focusPreference.addEventListener('change', () => restoreFocusReading(focusReadingSnapshot));
window.addEventListener('resize', () => restoreFocusReading(focusReadingSnapshot), { passive: true });
window.addEventListener('scroll', () => {
  const list = document.querySelector('[data-motion="focus-stage"]');
  if (!list) return;
  if (focusReadingObserver) {
    if (focusReadingY == null || Math.abs(scrollY - focusReadingY) <= 1) return;
    const rect = focusReadingTarget.getBoundingClientRect(), listRect = list.getBoundingClientRect();
    const size = [rect.width, rect.height, listRect.width, listRect.height];
    if (size.some((value, i) => Math.abs(value - focusReadingSize[i]) > 0.5)) return;
    // A new scroll without a geometry change belongs to the reader/native navigation.
    cancelFocusReading();
  }
  if (list.classList.contains('is-focused')) {
    const scene = ScrollTrigger.getAll().find(scene => scene.trigger === list && scene.pin);
    if (scene?.isActive) { rememberFocusReading(list, scene); return; }
    const stable = Array.from(document.querySelectorAll('.case-sheet > section:not(:has([data-motion="focus-stage"])), .case-next, .contact')).find(el => {
      const r = el.getBoundingClientRect(); return r.top <= innerHeight / 2 && r.bottom > innerHeight / 2;
    });
    focusReadingSnapshot = stable ? { list, step: stable, index: null, progress: null, y: scrollY, top: stable.getBoundingClientRect().top } : null;
    return;
  }
  if (focusReadingSnapshot?.enhanced) return;
  const steps = Array.from(list.querySelectorAll('[data-focus-state]'));
  const step = steps.find(el => {
    const r = el.getBoundingClientRect();
    return getComputedStyle(el).display !== 'none' && r.top < innerHeight / 2 && r.bottom > innerHeight / 2;
  });
  const material = step || Array.from(document.querySelectorAll('.case-sheet > section:not(:has([data-motion="focus-stage"])), .case-next, .contact')).find(el => {
    const r = el.getBoundingClientRect(); return r.top <= innerHeight / 2 && r.bottom > innerHeight / 2;
  });
  focusReadingSnapshot = material ? { list, step: material, index: step ? steps.indexOf(step) : null, progress: null, y: scrollY,
    top: material.getBoundingClientRect().top } : null;
}, { passive: true });

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
let pageEpoch = 0;
let coverVideosOff = null;
let sharedTransition = false;
let sharedKey = 'case-portal';

/** Переходы между страницами: включены только вне prefers-reduced-motion. */
let transitionsEnabled = false;
/**
 * Возврат к уже виденной странице — не играем ничего (§4.3, правило 2).
 * Два источника: bfcache (pageshow persisted) и навигация по истории
 * внутри клиентского роутера (navigationType === 'traverse').
 */
let restoredView = false;

// Native disclosure stays usable without this enhancement. Keep the open list
// when returning from a case, and restore it before Astro restores the scroll.
let moreCasesOpen = false;
try { moreCasesOpen = sessionStorage.getItem('portfolio:more-cases') === 'open'; } catch {}
function restoreMoreCases(root) {
  const details = root.querySelector('[data-more-cases]');
  if (details) details.open = moreCasesOpen;
}
document.addEventListener('toggle', (event) => {
  if (!(event.target instanceof HTMLDetailsElement) || !event.target.matches('[data-more-cases]')) return;
  moreCasesOpen = event.target.open;
  try { sessionStorage.setItem('portfolio:more-cases', moreCasesOpen ? 'open' : 'closed'); } catch {}
  ScrollTrigger.refresh();
}, true);

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

/** Structural scenes have their own timelines; never treat their root as a fade. */
const STRUCTURAL_MODES = new Set(['cover-proof', 'cover-interlock', 'focus-stage', 'sheet', 'pin-swap', 'marquee']);

/** Static blocks and the inactive responsive diagram do not create timelines. */
const motionAllowed = el => !el.closest('[data-story-motion="static"]') && el.getClientRects().length > 0;
const drawnDiagrams = new WeakSet();

/** Элементы страницы с движением, кроме вступительных и детей групп. */
function scrollTargets(root) {
  return toArray(root.querySelectorAll('[data-motion-group], [data-motion]')).filter((el) => {
    if (!motionAllowed(el)) return false;
    if (el.closest('[data-motion-intro]')) return false;
    // Whole sections own pin/cover/sheet/marquee scenes, not a generic fade.
    if (STRUCTURAL_MODES.has(el.dataset.motion)) return false;
    if (el.parentElement?.closest('[data-motion="cover-proof"], [data-motion="cover-interlock"], [data-motion="focus-stage"]')) return false;
    if (sharedTransition && el.closest(`[data-case-cover="${sharedKey}"]`)) return false;
    if (el.hasAttribute('data-motion') && el.parentElement?.closest('[data-motion-group]')) return false;
    return true;
  });
}

/* ------------------------------------------------------------------ */
/* Пять движений                                                       */
/* ------------------------------------------------------------------ */

/** Набор. Строка — смысловая единица; абзацы этим движением не набираются. */
function revealText(el, tl, position, params = motion.revealText) {
  const split = SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'ds-split-line',
    autoSplit: true,
    onSplit: (self) => {
      self.lines.forEach(line => {
        // Preserve glyph ascenders/descenders at display roles' tight leading.
        line.parentElement.style.paddingBlock = motion.lines.maskBleed;
        line.parentElement.style.marginBlock = `-${motion.lines.maskBleed}`;
      });
      // SplitText rebuilds its owned tween when line wrapping changes.
      return gsap.from(self.lines, { yPercent: 100, duration: params.duration,
        ease: params.ease, stagger: params.stagger, ...lift(self.lines) });
    },
  });
  splits.push(split);

  gsap.set(el, { opacity: 1 });
  if (split.animation) tl.add(split.animation.play(), position);
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
    case 'lines':
      return revealText(el, tl, position, motion.lines);
    case 'fade-image':
      return tl.from(el, { opacity: 0, y: motion.fadeImage.y, ...motion.fadeImage, ...lift(el) }, position);
    case 'count':
      return count(el, tl, position);
    case 'draw':
      return draw(el, tl, position);
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

function count(el, tl, position) {
  const original = el.textContent.trim();
  const match = original.match(/^([\d\s,.]+)(.*)$/);
  if (!match) return;
  const decimalComma = match[1].includes(',') && !/[,]\d{3}$/.test(match[1]);
  const numeric = match[1].replace(/\s/g, '').replace(decimalComma ? ',' : /,/g, decimalComma ? '.' : '');
  const value = Number(numeric);
  if (!Number.isFinite(value)) return;
  const decimals = (numeric.split('.')[1] || '').length;
  const counter = { value: 0 };
  const formatter = new Intl.NumberFormat(decimalComma ? 'ru-RU' : 'en-US', {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  });
  let painted = original;
  el.setAttribute('aria-label', original);
  tl.to(counter, { value, ...motion.count, onUpdate: () => {
    const text = formatter.format(counter.value) + match[2];
    if (text !== painted) { el.textContent = text; painted = text; }
  }, onComplete: () => { el.textContent = original; } }, position);
  // GSAP contexts do not revert textContent: explicitly restore for resize/reduce.
  gsap.context(() => () => { el.textContent = original; });
}

function draw(el, tl, position) {
  if (typeof el.getTotalLength === 'function') {
    const length = el.getTotalLength();
    tl.fromTo(el, { strokeDasharray: `${length} ${length}`, strokeDashoffset: length },
      { strokeDashoffset: 0, ...motion.draw }, position);
  } else {
    tl.from(el, { scaleX: 0, transformOrigin: 'left center', ...motion.draw }, position);
  }
}

/** Case choreography improves the real DOM; there are no duplicate screen clones. */
function buildCaseScenes(root, settled = false) {
  const skipCovers = [];
  root.querySelectorAll('[data-motion="cover-interlock"]').forEach(cover => {
    if (settled) return;
    if (sharedTransition && cover.dataset.caseCover === sharedKey) return;
    const panels = toArray(cover.querySelectorAll('[data-cover-panel]'));
    const gate = cover.querySelector('[data-cover-gate]');
    const cfg = motion.coverInterlock;
    const narrow = innerWidth < parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bp-md'));
    const tl = gsap.timeline({ scrollTrigger: { trigger: cover, start: TRIGGER_START, once: true },
      onStart: () => skipCovers.push(armSkip(tl)) });
    revealText(cover.querySelector('[data-motion="lines"]'), tl, 0, motion.lines);
    tl.from(cover.querySelector('[data-cover-lead]'), { opacity: 0, duration: cfg.duration, ease: cfg.ease }, 0);
    panels.forEach((panel, i) => tl.from(panel, {
      opacity: 0, x: narrow ? 0 : (i ? cfg.x : -cfg.x), y: narrow ? motion.coverProof.y : 0,
      rotation: narrow ? 0 : (i ? cfg.rotation : -cfg.rotation),
      duration: cfg.duration, ease: cfg.ease, ...lift(panel),
    }, i ? cfg.payoutAt : 0));
    if (gate) tl.from(gate, { opacity: 0, duration: motion.lines.duration, ease: cfg.ease }, cfg.gateAt);
    tl.from(cover.querySelector('.case-opening__proof-caption'), { opacity: 0, duration: motion.lines.duration }, cfg.payoutAt);
  });
  root.querySelectorAll('[data-motion="cover-proof"]').forEach(cover => {
    if (settled) return;
    if (sharedTransition && cover.dataset.caseCover === sharedKey) return;
    const panels = toArray(cover.querySelectorAll('[data-cover-panel]'));
    const tl = gsap.timeline({ scrollTrigger: { trigger: cover, start: TRIGGER_START, once: true },
      onStart: () => skipCovers.push(armSkip(tl)) });
    revealText(cover.querySelector('[data-motion="lines"]'), tl, 0, motion.lines);
    tl.from(cover.querySelector('[data-cover-lead]'), { opacity: 0, ...motion.fadeImage }, stagger.base);
    tl.from(panels, { opacity: 0, y: motion.coverProof.y, duration: motion.coverProof.duration,
      ease: motion.coverProof.ease, stagger: motion.coverProof.stagger, ...lift(panels) }, stagger.loose);
    // One finite shift of attention; the payout is held, the message settles next.
    if (panels[1]) tl.from(panels[1], { x: motion.coverProof.accentX, duration: motion.coverProof.duration,
      ease: motion.coverProof.ease }, stagger.loose * 2);
    tl.from(cover.querySelector('.case-opening__proof-caption'), { opacity: 0, duration: motion.lines.duration, ease: motion.lines.ease }, stagger.loose * 3);
  });

  const responsive = gsap.matchMedia();
  responsive.add('(min-width: 1px)', () => {
    const covers = toArray(root.querySelectorAll('.case-opening'));
    const sheets = new Map();
    const updateCovers = () => {
      covers.forEach(cover => {
        const sheet = cover.nextElementSibling;
        const fits = sheet?.matches('[data-motion="sheet"]')
          && cover.offsetHeight <= innerHeight + motion.sheet.tolerance;
        cover.style.position = fits ? 'sticky' : 'relative';
        cover.style.top = '0px';
        // A tall cover is already in normal flow: it needs no scrub/reset per frame.
        if (Boolean(sheets.get(cover)) === Boolean(fits)) return;
        sheets.get(cover)?.revert();
        sheets.delete(cover);
        if (fits) sheets.set(cover, gsap.context(() => {
          gsap.to(cover.firstElementChild, { scale: motion.sheet.scale, opacity: motion.sheet.opacity, ease: 'none',
            scrollTrigger: { trigger: sheet, start: 'top bottom', end: 'top top', scrub: motion.sheet.scrub } });
          ScrollTrigger.create({ trigger: sheet, start: 'bottom top',
            onLeave: () => gsap.set(cover, { visibility: 'hidden' }),
            onEnterBack: () => gsap.set(cover, { visibility: 'visible' }) });
        }));
      });
    };
    updateCovers();
    window.addEventListener('resize', updateCovers, { passive: true });
    return () => {
      window.removeEventListener('resize', updateCovers);
      sheets.forEach(context => context.revert()); sheets.clear();
      covers.forEach(c => { c.style.removeProperty('position'); c.style.removeProperty('top'); });
    };
  });
  const breakpoint = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bp-xl'));
  const focusBreakpoint = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bp-lg'));
  responsive.add(`(min-width: ${focusBreakpoint}px) and (min-height: ${motion.focusStage.minHeight}px)`, () => {
    const stages = toArray(root.querySelectorAll('[data-motion="focus-stage"]')).filter(motionAllowed);
    const cfg = motion.focusStage;
    stages.forEach(list => {
      const steps = toArray(list.querySelectorAll('[data-focus-state]'));
      const checkpoint = list.dataset.composition === 'checkpoint';
      const art = motion.reviewStage;
      list.classList.add('is-focused');
      const measure = () => {
        const height = Math.min(cfg.maxHeight, innerHeight - cfg.inset * 3);
        list.style.setProperty('--focus-height', `${height}px`);
        list.style.setProperty('--focus-media-height', `${height - (checkpoint ? art.header : cfg.header)}px`);
      };
      measure();
      window.addEventListener('resize', measure, { passive: true });
      gsap.set(steps.slice(1), { autoAlpha: 0 });
      const tl = gsap.timeline({ defaults: { ease: cfg.ease }, scrollTrigger: {
        trigger: list, start: `top top+=${cfg.inset}`, pin: list, pinSpacing: true,
        // Recreated focus pins must contribute their spacing before later triggers refresh.
        refreshPriority: 1,
        end: () => `+=${cfg.distance * (steps.length - 1)}`, scrub: cfg.scrub, invalidateOnRefresh: true,
        onUpdate: self => {
          if (!self.isActive || focusReadingObserver) return;
          rememberFocusReading(list, self, steps);
        },
      } });
      if (checkpoint) tl.to(list.querySelector('.case-steps__field-bleed'), {
        scaleX: () => document.documentElement.clientWidth / list.offsetWidth,
        duration: art.fieldDuration, ease: art.ease,
      }, art.fieldAt);
      steps.slice(1).forEach((step, i) => {
        const at = i + cfg.hold;
        if (checkpoint && i < steps.length - 2) {
          tl.to(steps[i].querySelector('.case-steps__screen'), { scale: art.retreat,
            duration: cfg.hold - art.retreatAt, ease: art.ease }, i + art.retreatAt);
        }
        // Exchange at full contrast: no blended headings or ghost interfaces
        // at any stopped scroll position. Only the new whole panel travels.
        tl.set(steps[i], { autoAlpha: 0 }, at);
        tl.set(step, { autoAlpha: 1 }, at);
        const stop = checkpoint && step.querySelector('.case-steps__stop-symbol');
        if (stop) tl.fromTo(stop.children, { scaleY: art.stopFrom },
          { scaleY: 1, duration: art.stopDuration, ease: art.ease }, at);
        tl.fromTo(step.querySelector('.case-steps__screen'), { x: checkpoint ? art.x : cfg.x },
          { x: 0, duration: stop ? art.enter - art.cardDelay : cfg.exchange, ease: checkpoint ? art.ease : cfg.ease }, at + (stop ? art.cardDelay : 0));
      });
      gsap.context(() => () => {
        window.removeEventListener('resize', measure);
        list.classList.remove('is-focused');
        list.style.removeProperty('--focus-height');
        list.style.removeProperty('--focus-media-height');
        gsap.set(steps.map(step => step.querySelector('.case-steps__screen')), { clearProps: 'transform' });
        if (checkpoint) gsap.set(list.querySelectorAll('.case-steps__stop-symbol i'), { clearProps: 'transform' });
        if (checkpoint) gsap.set(list.querySelector('.case-steps__field-bleed'), { clearProps: 'transform' });
      });
    });
  });
  responsive.add(`(min-width: ${breakpoint}px)`, () => {
    root.querySelectorAll('[data-motion="pin-swap"]').forEach(list => {
      if (!motionAllowed(list)) return;
      const steps = toArray(list.querySelectorAll('.case-steps__step'));
      steps.forEach((step, index) => {
        gsap.set(step, { position: 'relative', zIndex: index + 1, backgroundColor: 'var(--surface-default)' });
        const next = steps[index + 1];
        if (!next) return;
        const pin = ScrollTrigger.create({ trigger: step, pin: step, pinSpacing: false, refreshPriority: 1,
          start: () => step.offsetHeight > innerHeight - motion.pinSwap.inset * 2
            ? `bottom bottom-=${motion.pinSwap.inset}` : `top top+=${motion.pinSwap.inset}`,
          endTrigger: next, end: `top top+=${motion.pinSwap.inset}`, invalidateOnRefresh: true });
        gsap.to([step.querySelector('.case-steps__text'), step.querySelector('.case-steps__shot')], {
          opacity: 0, y: motion.pinSwap.y, ease: 'none', scrollTrigger: {
            trigger: next, start: motion.pinSwap.start, end: motion.pinSwap.end,
            scrub: motion.pinSwap.scrub, invalidateOnRefresh: true,
          } });
        // Keep the pin owned by this responsive GSAP context.
        void pin;
      });
    });
  });
  root.querySelectorAll('[data-motion="marquee"]').forEach(track => {
    const child = track.firstElementChild;
    if (!child) return;
    const tween = gsap.to(track, { x: () => -(child.offsetWidth + parseFloat(getComputedStyle(track).gap)),
      duration: motion.marquee.duration, ease: motion.marquee.ease, repeat: -1, paused: true });
    const viewport = track.parentElement;
    const visible = () => {
      const rect = viewport.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < innerHeight;
    };
    let inView = visible();
    const sync = () => inView && !document.hidden ? tween.play() : tween.pause();
    // Visibility follows the painted viewport, including geometry changed by pins.
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(viewport);
    // Pins and reading-position restoration settle after the resize event.
    // Keep the observer's painted state until its next delivered intersection.
    const resize = () => { tween.invalidate(); sync(); };
    window.addEventListener('resize', resize, { passive: true });
    sync();
    document.addEventListener('visibilitychange', sync);
    gsap.context(() => () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', sync);
    });
  });
  return () => { skipCovers.forEach(off => off()); responsive.revert(); };
}

/** Covers share the page lifecycle, including restored pages and live motion preferences. */
function setupCoverVideos(root) {
  const cleanups = toArray(root.querySelectorAll('[data-cover-video]')).map(video => {
    const cover = video.closest('.case-opening');
    const button = cover?.querySelector('[data-cover-pause]');
    if (!button) return () => {};
    let automatic = false;
    let manualPlay = false;
    let manualPause = false;
    let alive = true;
    let failed = false;
    let triedMp4 = false;
    const sheet = cover.nextElementSibling?.matches('[data-motion="sheet"]') ? cover.nextElementSibling : null;
    const shouldPlay = () => {
      const rect = cover.getBoundingClientRect();
      return alive && !failed && !document.hidden && rect.bottom > 0 && rect.top < innerHeight
        && (!sheet || sheet.getBoundingClientRect().top > 0)
        && !manualPause && (automatic || manualPlay);
    };
    const paint = () => {
      button.dataset.state = video.paused ? 'paused' : 'playing';
      button.setAttribute('aria-label', (video.paused ? button.dataset.labelPlay : button.dataset.labelPause) || '');
    };
    const sync = () => {
      if (shouldPlay()) {
        if (video.paused) video.play().then(() => { if (!shouldPlay()) video.pause(); }).catch(error => {
          if (error.name === 'NotSupportedError') fail(); else paint();
        });
      } else if (!video.paused) video.pause();
      paint();
    };
    const toggle = () => {
      manualPlay = video.paused;
      manualPause = !manualPlay;
      sync();
    };
    const fail = () => {
      if (failed || !alive) return;
      const mp4 = video.querySelector('source[type="video/mp4"]');
      if (!triedMp4 && mp4) {
        triedMp4 = true;
        video.src = mp4.src; video.load(); sync();
        return;
      }
      failed = true;
      video.pause();
      // No usable codec: reset to the real poster, without a dead play control.
      video.removeAttribute('src');
      video.querySelectorAll('source').forEach(source => source.remove());
      video.load(); button.hidden = true;
    };
    button.hidden = false;
    button.addEventListener('click', toggle);
    video.addEventListener('play', paint);
    video.addEventListener('pause', paint);
    video.addEventListener('error', fail, true);
    const observer = new IntersectionObserver(sync);
    observer.observe(cover);
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    document.addEventListener('visibilitychange', sync);
    const media = withMotionPreference(gsap,
      () => { automatic = true; sync(); },
      () => { automatic = false; manualPlay = false; sync(); });
    // Media can fail before the motion bundle or fonts have finished loading.
    if (video.error || video.networkState === 3) fail();
    paint();
    return () => {
      alive = false;
      media.revert(); observer.disconnect(); video.pause();
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
      document.removeEventListener('visibilitychange', sync);
      button.removeEventListener('click', toggle);
      video.removeEventListener('play', paint); video.removeEventListener('pause', paint);
      video.removeEventListener('error', fail, true);
      button.hidden = true;
    };
  });
  return () => cleanups.forEach(off => off());
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
  const build = (el) => {
    const isGroup = el.hasAttribute('data-motion-group');
    const responsiveGraph = el.closest('.dg-responsive');
    // Changing geometry after a completed explanation keeps its final state.
    if (responsiveGraph && drawnDiagrams.has(responsiveGraph)) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: TRIGGER_START, once: true },
      onComplete: () => { if (responsiveGraph) drawnDiagrams.add(responsiveGraph); },
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
  };
  scrollTargets(root).filter(el => !el.closest('[data-diagram-layout]')).forEach(build);
  const responsive = gsap.matchMedia();
  const breakpoint = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bp-md'));
  for (const [layout, query] of [['desktop', `(min-width: ${breakpoint}px)`], ['mobile', `(max-width: ${breakpoint - 1}px)`]]) {
    responsive.add(query, () => {
      toArray(root.querySelectorAll(`[data-diagram-layout="${layout}"] [data-motion-group]`)).filter(motionAllowed).forEach(build);
    });
  }
  return () => responsive.revert();
}

/* ------------------------------------------------------------------ */
/* Жизненный цикл страницы                                             */
/* ------------------------------------------------------------------ */

async function initPage() {
  teardownPage();
  const returning = restoredView;
  const epoch = ++pageEpoch;
  await fontsSettled();
  if (epoch !== pageEpoch) return;
  const root = document.body;
  restoreMoreCases(root);
  coverVideosOff = setupCoverVideos(root);

  pageMedia = withMotionPreference(
    gsap,
    () => {
      // Прямой вход в восстановленную позицию или возврат из bfcache:
      // триггеры не создаются, страница сразу в конечном состоянии (§4.3).
      if (window.scrollY > 0 || returning || focusReadingSnapshot?.y > 0) {
        settle(root);
        // Recreate structural geometry and visible loops on history traversal.
        // Entry reveals stay settled; a case without focus still owns CaseNext.
        const restoredScrollY = window.scrollY;
        const cleanupCases = buildCaseScenes(root, true);
        ScrollTrigger.refresh();
        window.scrollTo(0, restoredScrollY);
        ScrollTrigger.update();
        return cleanupCases;
      }

      const cleanupCases = buildCaseScenes(root);
      introTimeline = buildIntro(root);
      const cleanupScroll = buildScrollScenes(root);

      if (introTimeline) {
        fontsSettled().then(() => {
          if (!introTimeline) return;
          introTimeline.play();
          skipListenersOff = armSkip(introTimeline);
        });
      }

      return () => {
        cleanupScroll();
        cleanupCases();
        splits.forEach(split => split.revert());
        splits = [];
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
  cancelFocusReading();
  focusReadingSnapshot = null;
  pageEpoch += 1;
  coverVideosOff?.();
  coverVideosOff = null;
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
  const link = event.sourceElement?.closest('[data-case-next]');
  sharedTransition = Boolean(link)
    || (restoredView && location.pathname.startsWith('/preview/') && event.to.pathname.startsWith('/preview/'));
  // Named snapshots own this transition; body fades would erase their source.
  if (sharedTransition) {
    sharedKey = link?.dataset.caseNext || sharedKey;
    selectSnapshot(document);
    return;
  }
  if (!transitionsEnabled) return;
  const load = event.loader;
  event.loader = async () => {
    await pageOut();
    await load();
  };
});

document.addEventListener('astro:before-swap', teardownPage);
document.addEventListener('astro:before-swap', (event) => restoreMoreCases(event.newDocument));
function selectSnapshot(doc) {
  doc.querySelectorAll('[data-case-cover], [data-case-next]').forEach(el => {
    const key = el.dataset.caseCover || el.dataset.caseNext;
    el.style.viewTransitionName = key === sharedKey ? key : 'none';
  });
}
document.addEventListener('astro:before-swap', event => { if (sharedTransition) selectSnapshot(event.newDocument); });
function snapshotTiming(doc = document) {
  doc.documentElement.style.setProperty('--case-transition-duration', `${motion.caseTransition.duration}s`);
  doc.documentElement.style.setProperty('--case-transition-out', `${motion.caseTransition.out}s`);
  doc.documentElement.style.setProperty('--case-transition-in', `${motion.caseTransition.in}s`);
  doc.documentElement.style.setProperty('--case-transition-ease', motion.caseTransition.cssEase);
}
withMotionPreference(gsap, () => { snapshotTiming(); }, () => {});
document.addEventListener('astro:before-swap', event => { if (transitionsEnabled) snapshotTiming(event.newDocument); });

document.addEventListener('astro:after-swap', () => {
  // Скролл ставит сам роутер, до этого события и без анимации: переход
  // вперёд — в 0 (§3.5), возврат по истории — в сохранённую позицию.
  // Своего scrollTo(0, 0) здесь быть не должно: он затирал возврат, и
  // «назад» с кейса приводило на верх главной вместо места ухода.
  if (transitionsEnabled && !sharedTransition) pageIn();
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
