/** Agent-only reading state. Owned by the shared page/motion lifecycle.
 * No hidden content, pinning, scroll interception or screenshot mutation. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function buildAgentReading(root) {
  const scenes = [...root.querySelectorAll('[data-agent-reading]')];
  if (!scenes.length) return () => {};
  const responsive = gsap.matchMedia();
  const wide = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bp-lg'));
  // The existing semantic spacing determines the minimum useful sticky viewport.
  const room = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--measure-lead'));
  responsive.add(`(min-width: ${wide}px) and (min-height: ${room}px)`, () => {
    for (const scene of scenes) {
      const steps = [...scene.querySelectorAll('[data-agent-reading-step]')];
      const markers = [...scene.querySelectorAll('[data-agent-reading-marker]')];
      const set = index => [...steps, ...markers].forEach(el => {
        el.dataset.current = String(Number(el.dataset.agentReadingStep ?? el.dataset.agentReadingMarker) === index);
      });
      scene.classList.add('is-reading');
      const sync = () => {
        let index = 0;
        steps.forEach((step, i) => { if (step.getBoundingClientRect().top < innerHeight / 2) index = i; });
        set(index);
      };
      ScrollTrigger.create({trigger:scene,start:'top bottom',end:'bottom top',onUpdate:sync,onRefresh:sync});
      sync();
      gsap.context(() => () => {
        scene.classList.remove('is-reading');
        [...steps,...markers].forEach(el => delete el.dataset.current);
      });
    }
  });
  return () => responsive.revert();
}
