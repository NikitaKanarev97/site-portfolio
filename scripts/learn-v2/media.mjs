/** Compatibility entry point. Public media is captured from the current
 * integrated product DOM, not cropped from historical prepared PNGs.
 * Source version: public/prototypes/learn-manifest.json.
 */
await import('./capture-current.mjs');
await import('./capture-home-canvas.mjs');
