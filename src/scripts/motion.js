/**
 * Motion-токены — Site-portfolio
 *
 * Зеркало motion-слоя из ds/foundation.md и ds/tokens.css для GSAP.
 * Существует отдельным файлом потому, что GSAP не читает CSS-переменные:
 * ему нужны секунды числом и имя кривой строкой.
 *
 * Правится вместе с tokens.css и foundation.md. Расхождение = баг.
 */

/** Длительности в секундах — GSAP не понимает миллисекунды. */
export const duration = {
  instant: 0.12,
  fast:    0.24,
  base:    0.4,
  page:    0.6,
  slow:    0.7,
  reveal:  0.9,
};

/** Кривые. Имена GSAP; CSS-эквиваленты лежат в tokens.css. */
export const ease = {
  standard:   'power2.out',
  entrance:   'power3.out',
  exit:       'power2.in',
  expressive: 'expo.out',
};

/** Задержки каскада в секундах. */
export const stagger = {
  tight: 0.04,
  base:  0.08,
  loose: 0.12,
};

/**
 * Смысловой слой. Компоненты обращаются только сюда — не к duration/ease
 * напрямую. Это тот же инвариант, что и в CSS: смыслы ссылаются на примитивы.
 */
export const motion = {
  hover:       { duration: duration.fast,    ease: ease.standard },
  state:       { duration: duration.instant, ease: ease.standard },
  revealText:  { duration: duration.reveal,  ease: ease.entrance, stagger: stagger.base },
  revealMedia: { duration: duration.slow,    ease: ease.expressive },
  pageOut:     { duration: duration.page,    ease: ease.exit },
  pageIn:      { duration: duration.page,    ease: ease.entrance },
};

/**
 * Единая точка отключения движения (MOT-01).
 *
 * Все анимации продукта регистрируются внутри этого хелпера, а не напрямую.
 * Ветка reduced получает управление, когда пользователь просит покой:
 * там ставится конечное состояние без твинов. Переходы между страницами
 * подчиняются тому же правилу — исключений нет.
 *
 * @param {import('gsap').GSAPContext} gsap
 * @param {(ctx: object) => void} full     — сценарий с движением
 * @param {(ctx: object) => void} [reduced] — конечное состояние без движения
 * @returns {ReturnType<import('gsap').GSAP['matchMedia']>}
 */
export function withMotionPreference(gsap, full, reduced) {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', full);
  if (reduced) mm.add('(prefers-reduced-motion: reduce)', reduced);
  return mm;
}
