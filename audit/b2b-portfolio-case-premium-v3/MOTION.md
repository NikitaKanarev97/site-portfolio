# Motion

No new runtime, library, pin or scroll-jacking. `src/scripts/animations.js` and
`src/scripts/motion.js` are unchanged; the route only declares registered names.

| Place | Declaration | What it does | Why |
|---|---|---|---|
| Hero | `data-motion-intro`: `lines` (title), `fade` (lead, note), `fade-image` (stage) | one coordinated entrance on fonts.ready | unchanged rhythm; the note joins the lead |
| 01 Diagnosis | `fade-image` per archival frame; findings `data-motion-group` → `rise` | evidence first, then the reading of it | no morph between old and new UI — that would imply an intermediate historical screen |
| 02 Architecture | one group: stages `rise`, connectors `draw` (scaleX) in document order | the path reveals left to right | diagram is complete without JS and under reduced motion |
| 03 Source line | one group, stagger `base`, each stage `rise` | four stages arrive in order with a readable pause | static sequence instead of a pinned scene: stages differ from 63 to 426 px in height |
| 05 Commerce | chain `rise`, modules `fade-image` | chain reads before the images | — |
| 07 Design system | none on specimens | the states are the evidence | — |
| 08 Process, Outcome | `rise` groups | — | — |

## Verified (logs/behaviour.json, real Chromium)

- Reduced motion (1440): 0 hidden elements before any scroll, 0 errors.
- No JavaScript (1440 and 390): all nine sections present, 0 hidden elements; archival
  frames are plain links to the image files. Full-page captures `after/en-{1440,390}-nojs-full.png`.
- Intermediate vs final: `after/motion/{architecture,decision}-{intermediate,final}.png`
  (180 ms and ~1.8 s after scrolling into view). Board: `comparisons/16-motion-1440.jpg`.
- Lifecycle (dev build, `__dsMotionDebug`): first load 24 ScrollTriggers, 0 pins, 0 duplicates;
  after Next case → Back the page is restored settled (0 triggers, 0 hidden), and reload gives
  24 again. The same 0-on-Back pattern was measured on the untouched Vet Clinic case
  (5 → 0 → 5), so it is the site's existing restored-view behaviour, not a regression.
- Anchor `#decision` lands at 0 px from the viewport top.
- MediaZoom: keyboard Enter on an archival frame opens the dialog with the full image and
  caption; Escape closes it and focus returns to the same link.
- Phone scrollers (FileUpload, FulfillmentPlan): focusable (`tabindex=0`, labelled),
  `overflow-x: auto`, native snap; document horizontal overflow 0.

Not tested: physical devices, Safari/WebKit, Firefox, hidden-tab throttling.
