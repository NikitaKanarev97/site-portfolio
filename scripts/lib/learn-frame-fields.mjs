/** Isolate whole native Learn regions, keeping the source page's fields.
 * Integer origins also prevent a neighbouring divider from leaking into a frame.
 * No product text, controls or component styles are rewritten.
 */
export async function isolateAssessment(page, rules) {
  await rules.evaluate(card => {
    const column = card.parentElement;
    const main = column.parentElement;
    const frame = main.cloneNode(false);
    const content = column.cloneNode(false);
    for (const child of column.children) {
      content.append(child.cloneNode(true));
      if (child === card) break;
    }
    frame.removeAttribute('id');
    frame.dataset.learnCapture = 'assessment';
    Object.assign(frame.style, {
      position: 'absolute', left: '0px', top: '0px',
      width: `${innerWidth}px`, boxSizing: 'border-box', flex: 'none',
      zIndex: '2147483647', background: getComputedStyle(main.parentElement).backgroundColor,
    });
    frame.append(content);
    main.parentElement.append(frame);
  });
  return page.locator('[data-learn-capture="assessment"]');
}

export async function isolateLanding(page) {
  await page.locator('.ed-hero').first().evaluate(hero => {
    const frame = document.createElement('div');
    frame.dataset.learnCapture = 'landing';
    Object.assign(frame.style, {
      position: 'absolute', left: '0px', top: '0px',
      width: `${innerWidth}px`, boxSizing: 'border-box', zIndex: '2147483647',
      background: getComputedStyle(document.body).backgroundColor,
      paddingBottom: getComputedStyle(hero.querySelector('.hero-bottom')).paddingBottom,
    });
    frame.append(hero.cloneNode(true));
    hero.parentElement.append(frame);
  });
  return page.locator('[data-learn-capture="landing"]');
}

export async function regionFields(frame, kind) {
  return frame.evaluate((node, kind) => {
    const rect = n => n.getBoundingClientRect();
    const outer = rect(node);
    const nodes = kind === 'assessment'
      ? [node.querySelector('h1'), node.querySelector('div[class*="_card_"]')]
      : [node.querySelector('.hero-copy'), node.querySelector('.hero-visual'), node.querySelector('.hero-bottom')];
    return nodes.map(n => {
      const r = rect(n);
      return {
        region: n.tagName === 'H1' ? 'heading' : n.className,
        left: r.left - outer.left, right: outer.right - r.right,
        top: r.top - outer.top, bottom: outer.bottom - r.bottom,
      };
    });
  }, kind);
}
