/**
 * Подача — появление и уход слоя поверх страницы: MediaZoom, ProjectDialog,
 * мобильное меню Navbar. ds/motion-concept.md §3.4, «Окно и меню».
 *
 * Компоненты вызывают present/dismiss, но таймингов не держат: всё берётся
 * из motion.present. Окно встаёт по центру из scale 0.97 и прозрачности —
 * не из нуля, и не от кнопки: модальное окно к триггеру не привязано.
 * Выход короче входа: решение уже принято, система только отвечает.
 * Escape закрывает без движения — это клавиатурное действие, и задержка
 * на нём читалась бы как непослушание.
 *
 * Подложка <dialog> анимируется через --layer-presence: ::backdrop
 * наследует переменную от окна, а GSAP до псевдоэлемента не достаёт.
 */

import { gsap } from 'gsap';
import { motion, withMotionPreference } from './motion.js';

let moving = false;
withMotionPreference(gsap, () => {
  moving = true;
  return () => { moving = false; };
});

const parts = (layer, surface, items) => [layer, surface, ...(items ?? [])].filter(Boolean);

// Таймлайн слоя убивается целиком: killTweensOf оставил бы пустой таймлайн,
// и его onComplete снял бы уже заново открытый слой.
const running = new WeakMap();
const stop = (layer) => { running.get(layer)?.kill(); running.delete(layer); };

/** Слой уже показан (showModal или hidden = false) — доигрываем вход. */
export function present(layer, { surface, items } = {}) {
  const targets = parts(layer, surface, items);
  stop(layer);
  delete layer.dataset.dismissing;
  if (!moving) {
    gsap.set(targets, { clearProps: 'opacity,transform,--layer-presence' });
    return;
  }
  const { in: time, ease, scale, y, stagger } = motion.present;
  const tl = gsap.timeline({ defaults: { duration: time, ease },
    onComplete: () => { running.delete(layer); gsap.set(targets, { clearProps: 'opacity,transform,--layer-presence' }); } });
  running.set(layer, tl);
  tl.fromTo(layer, { '--layer-presence': 0 }, { '--layer-presence': 1 }, 0);
  if (surface) tl.fromTo(surface, { opacity: 0, scale }, { opacity: 1, scale: 1 }, 0);
  else tl.fromTo(layer, { opacity: 0 }, { opacity: 1 }, 0);
  if (items?.length) tl.fromTo(items, { opacity: 0, y }, { opacity: 1, y: 0, stagger }, 0);
}

/** Уход слоя: done снимает его с экрана (close() или hidden = true). */
export function dismiss(layer, { surface, items } = {}, done) {
  if (layer.dataset.dismissing) return;
  const targets = parts(layer, surface, items);
  stop(layer);
  const finish = () => {
    running.delete(layer);
    delete layer.dataset.dismissing;
    done();
    gsap.set(targets, { clearProps: 'opacity,transform,--layer-presence' });
  };
  if (!moving) { finish(); return; }
  layer.dataset.dismissing = 'true';
  const { out: time, outEase: ease, scale } = motion.present;
  const tl = gsap.timeline({ defaults: { duration: time, ease }, onComplete: finish });
  running.set(layer, tl);
  tl.to(layer, { '--layer-presence': 0 }, 0);
  if (surface) tl.to(surface, { opacity: 0, scale }, 0);
  else tl.to(layer, { opacity: 0 }, 0);
}

/** Мгновенный снос без движения: Escape, уход со страницы, смена раскладки. */
export function settle(layer, { surface, items } = {}) {
  stop(layer);
  delete layer.dataset.dismissing;
  gsap.set(parts(layer, surface, items), { clearProps: 'opacity,transform,--layer-presence' });
}
