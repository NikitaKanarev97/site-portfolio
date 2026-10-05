/** Capture an isolated native component with its own rounded/transparent shape.
 * Keep the source theme and typography; only surrounding page paint is removed.
 * No CSS mask, pixel editing or replacement product controls.
 */
export async function captureNativeAlpha(page, target, {bleed = 0} = {}) {
  await page.evaluate(() => document.fonts.ready);
  const viewport = page.viewportSize();
  await page.mouse.move(viewport.width - 1, viewport.height - 1);
  await target.evaluate((node, bleed) => {
    const width = node.getBoundingClientRect().width;
    const frame = document.createElement('div');
    frame.dataset.nativeAlphaCapture = '';
    Object.assign(frame.style, {
      position:'fixed', left:'0px', top:'0px', zIndex:'2147483647',
      width:`${width + bleed * 2}px`, padding:`${bleed}px`, boxSizing:'border-box',
      background:'transparent',
    });
    const copy = node.cloneNode(true);
    Object.assign(copy.style, {position:'static', margin:'0px', width:'100%'});
    frame.append(copy);
    node.parentElement.append(frame);
    let kept = frame;
    for (let parent = frame.parentElement; parent; parent = parent.parentElement) {
      for (const child of parent.children) if (child !== kept) child.style.setProperty('display','none','important');
      parent.style.setProperty('background','transparent','important');
      parent.style.setProperty('box-shadow','none','important');
      parent.style.setProperty('border-color','transparent','important');
      kept = parent;
    }
  }, bleed);
  const frame = page.locator('[data-native-alpha-capture]');
  const bounds = await frame.boundingBox();
  if (bounds.x !== 0 || bounds.y !== 0) throw Error(`Capture origin must be integer 0,0: ${JSON.stringify(bounds)}`);
  return frame.screenshot({animations:'disabled',omitBackground:true});
}
