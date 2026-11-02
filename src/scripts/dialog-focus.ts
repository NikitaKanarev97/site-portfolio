/** Keep keyboard traversal inside a native modal, including its scroll region.
 * Native inertness prevents background activation, but Tab can still leave the
 * document at the last control. Share the boundary rule across both dialogs. */
export function containDialogFocus(dialog: HTMLDialogElement, signal: AbortSignal) {
  dialog.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !dialog.open) return;
    const items = [...dialog.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]',
    )].filter(el => el.tabIndex >= 0 && !el.matches(':disabled, [hidden], [inert]')
      && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden');
    const first = items[0], last = items.at(-1);
    if (!first || !last) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    // WebKit's platform Tab policy can skip anchors. Own this modal sequence
    // instead of relying on the browser to reach our last candidate first.
    event.preventDefault();
    const current = items.indexOf(document.activeElement as HTMLElement);
    const next = current < 0 ? (event.shiftKey ? items.length - 1 : 0)
      : (current + (event.shiftKey ? -1 : 1) + items.length) % items.length;
    items[next].focus();
  }, { signal });
}
