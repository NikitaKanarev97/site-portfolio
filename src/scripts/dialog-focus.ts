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
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !dialog.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }, { signal });
}
