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
  fast:    0.16,
  page:    0.3,
  base:    0.4,
  reveal:  0.6,
  slow:    0.7,
  lines:   0.64,
  image:   1,
  cover:   1,
  marquee: 24,
};

/** Кривые. Имена GSAP; CSS-эквиваленты лежат в tokens.css. */
export const ease = {
  standard:   'power2.out',
  entrance:   'power3.out',
  exit:       'power2.in',
  expressive: 'expo.out',
  editorial:  'case-editorial', // CustomEase: .645,.05,.355,1
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
 *
 * Нажатия здесь нет намеренно: motion-press исполняет только CSS, и его
 * смысловой слой целиком лежит в tokens.css. Дублируются лишь те смыслы,
 * которые действительно играют в обоих носителях.
 */
export const motion = {
  hover:       { duration: duration.fast,    ease: ease.entrance },
  state:       { duration: duration.instant, ease: ease.standard },
  revealText:  { duration: duration.reveal,  ease: ease.entrance, stagger: stagger.base },
  revealMedia: { duration: duration.slow,    ease: ease.expressive },
  pageOut:     { duration: duration.page,    ease: ease.exit },
  pageIn:      { duration: duration.page,    ease: ease.entrance },
  lines:       { duration: duration.lines, ease: ease.editorial, stagger: stagger.tight, curve: '.645,.05,.355,1', maskBleed: '0.15em' },
  caseTransition: { duration: duration.image, out: duration.page, in: duration.slow, cssEase: 'cubic-bezier(.645,.05,.355,1)' },
  fadeImage:   { duration: duration.image, ease: ease.entrance, y: 24 },
  coverProof:  { duration: duration.cover, ease: ease.entrance, stagger: stagger.loose, y: 24, accentX: 12 },
  coverInterlock: { duration: 1.25, ease: ease.editorial, x: 96, rotation: 8, gateAt: 0.45, payoutAt: 0.65 },
  focusStage: { minHeight: 820, inset: 24, maxHeight: 780, header: 260, distance: 650, hold: 0.78, exchange: 0.22, x: 24, reflowWait: 0.18, scrub: true, ease: ease.editorial },
  reviewStage: { header: 250, retreatAt: 0.55, retreat: 0.96, fieldAt: 2.55, fieldDuration: 0.45, x: 32, enter: 0.22, stopFrom: 0.12, stopDuration: 0.18, cardDelay: 0.04, ease: ease.entrance },
  sheet:       { scrub: 0.3, scale: 0.98, opacity: 0.65, tolerance: 2 },
  pinSwap:     { scrub: 0.25, inset: 32, y: -24, start: 'top 90%', end: 'top 25%' },
  count:       { duration: duration.image, ease: ease.standard },
  draw:        { duration: duration.slow, ease: ease.standard },
  marquee:     { duration: duration.marquee, ease: 'none' },
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
