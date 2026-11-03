/** Agent Ops operating model: the flow enters part by part as each part reaches
 * the viewport. Owned by the shared page/motion lifecycle. Every text stays
 * readable without JS, in reduce and after the pass. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from './motion.js';

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

/** One part of the flow, paused until the queue in enter() reaches it. */
function part(build) {
  const cfg = motion.agentModel;
  const tl = gsap.timeline({ paused: true });
  const rise = (targets, at, vars = {}) => tl.from(targets,
    { opacity: 0, y: cfg.y, duration: cfg.duration, ease: cfg.ease, ...lift(targets), ...vars }, at);
  const drawDown = (el, at) => tl.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: cfg.duration, ease: cfg.ease, clearProps: CLEAR }, at);
  const span = (el, origin, at) => el.getClientRects().length > 0 && tl.from(el,
    { scaleX: 0, transformOrigin: origin, duration: cfg.duration, ease: cfg.ease, ...lift(el) }, at);
  build({ tl, rise, drawDown, span, beat: n => n * cfg.beat });
  return tl;
}

/** Each part has its own trigger, so it plays when the reader reaches it. Parts
 * that enter together (fast scroll, jump) still play top-down, overlapping by handoff. */
function queue(parts, start) {
  let wanted = -1;
  let next = 0;
  let busy = false;
  const pump = () => {
    if (busy || next > wanted) return;
    const { tl } = parts[next++];
    busy = true;
    tl.play();
    gsap.delayedCall(tl.duration() * motion.agentModel.handoff, () => { busy = false; pump(); });
  };
  parts.forEach(({ trigger }, i) => {
    const reach = () => { wanted = Math.max(wanted, i); pump(); };
    // onLeave covers a jump past the whole part in one scroll update.
    ScrollTrigger.create({ trigger, start, once: true, onEnter: reach, onLeave: reach });
  });
}

function enter(model, start) {
  const cfg = motion.agentModel;
  const node = name => model.querySelector(`[data-model-node="${name}"]`);
  const cleanups = [];
  const parts = [];
  const add = (trigger, tl) => parts.push({ trigger, tl });

  // 1. Load narrows: the daily volume runs up, then collapses into commitments.
  const total = model.querySelector('[data-model-count="from"]');
  const kept = model.querySelector('[data-model-count="to"]');
  const value = el => Number(el.textContent.replace(/[^\d]/g, ''));
  const high = value(total);
  const low = value(kept);
  // Reserve the final width so the arrow and the second figure never shift.
  gsap.set(total, { display: 'inline-block', minWidth: total.getBoundingClientRect().width, textAlign: 'end' });
  add(model.querySelector('.agent-model__sizing'), part(({ tl, rise }) => {
    rise(model.querySelectorAll('[data-model-step]:not(.agent-model__note)'), 0, { stagger: motion.revealText.stagger });
    cleanups.push(count(tl, total, 0, high, 0));
    tl.from([model.querySelector('[data-model-count-arrow]'), kept],
      { opacity: 0, duration: cfg.duration, ease: cfg.ease, stagger: motion.revealText.stagger, clearProps: CLEAR }, cfg.narrowAt);
    cleanups.push(count(tl, kept, high, low, cfg.narrowAt + cfg.beat));
    tl.eventCallback('onComplete', () => gsap.set(total, { clearProps: 'display,minWidth,textAlign' }));
  }));

  // 2. Fork: the consequential branch reads first, sampling settles in quietly.
  const fork = model.querySelector('.agent-model__fork');
  const sideBySide = getComputedStyle(fork).gridTemplateColumns.split(' ').length > 1;
  add(model.querySelector('.agent-model__intake'), part(({ tl, rise, drawDown, beat }) => {
    rise(node('input'), beat(0));
    drawDown(node('a1'), beat(1));
    rise(node('decision'), beat(1.5));
    rise(node('yes'), beat(2.5), sideBySide ? { x: cfg.x, y: 0 } : {});
    tl.from(node('no'), { opacity: 0, duration: cfg.quiet, ease: cfg.ease, clearProps: CLEAR }, beat(3.5));
  }));

  // 3. Review splits into two owners from the centre.
  add(model.querySelector('.agent-model__review'), part(({ rise, drawDown, span, beat }) => {
    drawDown(node('a2'), beat(0));
    rise(node('review'), beat(0.5));
    span(node('bracket'), 'center center', beat(1.5));
    rise([node('b1'), node('b2')], beat(2));
  }));

  // 4. The return line runs back against the reading direction.
  const close = node('close');
  add(close, part(({ rise, span, beat }) => {
    span(close.querySelector('.agent-model__return'), 'right center', beat(0));
    rise(close.querySelectorAll(':scope > p'), beat(0.5), { stagger: motion.revealText.stagger });
    rise(model.querySelector('.agent-model__note'), beat(1.5));
  }));
  queue(parts, start);

  return () => {
    cleanups.forEach(off => off());
    gsap.set(total, { clearProps: 'display,minWidth,textAlign' });
  };
}

/** start: ScrollTrigger start for the entrance, or null when the page is settled. */
export function buildAgentModel(root, start, allowed) {
  const models = [...root.querySelectorAll('[data-motion="agent-model"]')];
  const cleanups = start ? models.filter(allowed).map(model => enter(model, start)) : [];
  return () => cleanups.forEach(fn => fn());
}
