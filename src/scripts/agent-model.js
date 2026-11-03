/** Agent Ops operating model: one entrance pass along the flow, then route
 * tracing under a fine pointer. Owned by the shared page/motion lifecycle.
 * Every text stays readable without JS, in reduce and after the pass. */
import { gsap } from 'gsap';
import { motion } from './motion.js';

// Each node lights its route from the intake; the rest of the flow steps back.
const INTAKE = ['input', 'a1', 'decision'];
const REVIEW = [...INTAKE, 'yes', 'a2', 'review'];
const PATHS = {
  input: ['input'],
  a1: INTAKE,
  decision: INTAKE,
  no: [...INTAKE, 'no'],
  yes: [...INTAKE, 'yes'],
  a2: REVIEW,
  review: REVIEW,
  bracket: [...REVIEW, 'bracket', 'b1', 'b2'],
  b1: [...REVIEW, 'bracket', 'b1'],
  b2: [...REVIEW, 'bracket', 'b2'],
  close: [...REVIEW, 'bracket', 'b1', 'b2', 'close'],
};
const CLEAR = 'opacity,transform,transformOrigin,clipPath,willChange';

function lift(targets) {
  return {
    onStart: () => gsap.set(targets, { willChange: 'transform, opacity' }),
    clearProps: CLEAR,
  };
}

/** Counts a "~1,770"-style figure between two values, then restores the source text. */
function count(tl, el, from, to, at) {
  const original = el.textContent;
  const prefix = original.match(/^\D*/)[0];
  const format = new Intl.NumberFormat('en-US');
  const paint = n => { el.textContent = prefix + format.format(Math.round(n)); };
  const value = { n: from };
  paint(from);
  tl.to(value, { n: to, ...motion.count, onUpdate: () => paint(value.n),
    onComplete: () => { el.textContent = original; } }, at);
  return () => { el.textContent = original; };
}

function enter(model, start) {
  const cfg = motion.agentModel;
  const node = name => model.querySelector(`[data-model-node="${name}"]`);
  const shown = el => el && el.getClientRects().length > 0;
  const beat = n => cfg.flowAt + n * cfg.beat;
  // Hover dimming eases with CSS; it must not chase GSAP frames during the pass.
  model.classList.add('is-entering');
  const tl = gsap.timeline({ scrollTrigger: { trigger: model, start, once: true } });
  const rise = (targets, at, vars = {}) => tl.from(targets,
    { opacity: 0, y: cfg.y, duration: cfg.duration, ease: cfg.ease, ...lift(targets), ...vars }, at);
  const drawDown = (el, at) => tl.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: cfg.duration, ease: cfg.ease, clearProps: CLEAR }, at);
  const span = (el, origin, at) => shown(el) && tl.from(el,
    { scaleX: 0, transformOrigin: origin, duration: cfg.duration, ease: cfg.ease, ...lift(el) }, at);

  // 1. Load narrows: the daily volume runs up, then collapses into commitments.
  const total = model.querySelector('[data-model-count="from"]');
  const kept = model.querySelector('[data-model-count="to"]');
  const value = el => Number(el.textContent.replace(/[^\d]/g, ''));
  const high = value(total);
  const low = value(kept);
  // Reserve the final width so the arrow and the second figure never shift.
  gsap.set(total, { display: 'inline-block', minWidth: total.getBoundingClientRect().width, textAlign: 'end' });
  rise(model.querySelectorAll('[data-model-step]:not(.agent-model__note)'), 0, { stagger: motion.revealText.stagger });
  const restore = [count(tl, total, 0, high, 0)];
  tl.from([model.querySelector('[data-model-count-arrow]'), kept],
    { opacity: 0, duration: cfg.duration, ease: cfg.ease, stagger: motion.revealText.stagger, clearProps: CLEAR }, beat(-1));
  restore.push(count(tl, kept, high, low, beat(-0.5)));

  // 2. Flow: the consequential branch reads first, sampling settles in quietly.
  const fork = model.querySelector('.agent-model__fork');
  const sideBySide = getComputedStyle(fork).gridTemplateColumns.split(' ').length > 1;
  rise(node('input'), beat(0));
  drawDown(node('a1'), beat(1));
  rise(node('decision'), beat(1.5));
  rise(node('yes'), beat(2.5), sideBySide ? { x: cfg.x, y: 0 } : {});
  tl.from(node('no'), { opacity: 0, duration: cfg.quiet, ease: cfg.ease, clearProps: CLEAR }, beat(3.5));
  drawDown(node('a2'), beat(4));
  rise(node('review'), beat(4.5));
  span(node('bracket'), 'center center', beat(5.5));
  rise([node('b1'), node('b2')], beat(6));

  // 3. The return line runs back against the reading direction.
  const close = node('close');
  span(close.querySelector('.agent-model__return'), 'right center', beat(7.5));
  rise(close.querySelectorAll(':scope > p'), beat(8), { stagger: motion.revealText.stagger });
  rise(model.querySelector('.agent-model__note'), beat(9));
  tl.eventCallback('onComplete', () => {
    gsap.set(total, { clearProps: 'display,minWidth,textAlign' });
    model.classList.remove('is-entering');
  });

  return () => {
    restore.forEach(off => off());
    model.classList.remove('is-entering');
    gsap.set(total, { clearProps: 'display,minWidth,textAlign' });
  };
}

function trace(model) {
  const nodes = [...model.querySelectorAll('[data-model-node]')];
  const light = name => {
    const path = PATHS[name];
    model.classList.toggle('is-tracing', Boolean(path));
    nodes.forEach(el => el.toggleAttribute('data-lit', Boolean(path?.includes(el.dataset.modelNode))));
  };
  const over = event => light(event.currentTarget.dataset.modelNode);
  const out = () => light(null);
  nodes.forEach(el => {
    el.addEventListener('pointerenter', over);
    el.addEventListener('pointerleave', out);
  });
  return () => {
    nodes.forEach(el => {
      el.removeEventListener('pointerenter', over);
      el.removeEventListener('pointerleave', out);
    });
    light(null);
  };
}

/** start: ScrollTrigger start for the entrance, or null when the page is settled. */
export function buildAgentModel(root, start, allowed) {
  const models = [...root.querySelectorAll('[data-motion="agent-model"]')];
  if (!models.length) return () => {};
  const cleanups = start ? models.filter(allowed).map(model => enter(model, start)) : [];
  const responsive = gsap.matchMedia();
  responsive.add('(hover: hover) and (pointer: fine)', () => {
    const off = models.map(trace);
    return () => off.forEach(fn => fn());
  });
  return () => {
    responsive.revert();
    cleanups.forEach(fn => fn());
  };
}
