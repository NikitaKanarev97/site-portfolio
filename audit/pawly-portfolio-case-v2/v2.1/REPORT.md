# Pawly Portfolio Case V2.1 — media spacing: report for independent review

This report does not approve itself. Nothing was merged or deployed. Figma, the Pawly product repository, the Home cover, the other cases and the shared DS components (`CasePlate`, `CaseShot`, `MediaZoom`, tokens) were not touched.

| | |
|---|---|
| Branch | `redesign/pawly-portfolio-case-v2-2026-11-02` |
| Reviewed HEAD (BEFORE) | `e943da1677eeef53e1c538ed7a36b5df40fae1a8` |
| Implementation | `85b4f9b` (renderer, copy, media, crop tool) · evidence `5315b2c` · this report in the commit after it |
| Routes | `/work/pawly`, `/ru/work/pawly` |
| Files changed | `src/components/pawly/PawlyShot.astro`, `PawlyCase.astro`; `src/copy/cases/pawly-v2.ts`, `src/copy/ru/cases/pawly-v2.ts` (alt text + action slices only); `src/data/pawly-case-v2-media.json`; `public/media/pawly-case-v2/` (2 changed, 4 new); `audit/.../v2/tools/crops.py` |

## 1. What the review found, measured

The review's finding was right, and it can be measured. In BEFORE, **144 of 162** product-image placements have less than 12 px of their own surface above or below them. Nearly all have 0: a 1 px border sits directly on the crop edge, and labels and captions sit 12–14 px away ([FIELDS.md](FIELDS.md), [before/media-fields.json](before/media-fields.json)).

`tools/measure.py` reads this from the pixels of the full-page captures, not from CSS. BEFORE and AFTER are therefore measured the same way, whatever the DOM.

## 2. The media-spacing system

Every product screen sits on a **plate**. The plate's vertical field is larger than its side field: the slices lacked air above and below, and phones lack width.

| Width | Field top/bottom | Field sides | Plate |
|---|---|---|---|
| ≥ 1024 | 64 (`space-16`) | 24 (`space-6`) | `radius-lg` |
| 768–1023 | 48 (`space-12`) | 16, but the screen sits at native width, so effectively ≥ 140 | `radius-lg` |
| 360–767 | 40 (`space-8 + space-2`) | 16 | full-bleed to the screen edge, square |
| < 360 | 32 (`space-8`) | 12 | full-bleed, square |

**Surfaces.** No extra border, frame or shadow was added. The 1 px border V2 drew around every slice was **removed**; the screen reads as a panel by tone.

- **White sheet** (Choosing, Handoff, Exceptions, Settlement): `--surface-plate` (gray-100), the DS plate tone.
- **Sand band** (Return): the plate is `--surface-subtle` (gray-50). This is the product's own canvas, within 4/255 of the slices' `#FBF9F7`, so the crop edges dissolve and the cards float.
- **Cover:** the sand stage is the plate, so there is no plate inside it. The stage itself gets the same fields: 64 / 48 / 40 / 32.

**Rows.** At 1440, Choosing and Return put their three screens on **one shared stage**, the H1 `ha-phones` pattern:

- screens top-aligned 64 px below the stage edge;
- 48 px between screens and to the sides;
- labels and captions start where the screens start.

Pairs (Handoff, Exceptions, Settlement) keep one plate each. Plates in a row share height through subgrid, and each screen is centred in its own plate, so top and bottom fields are equal.

**No shrinking.**

- **Phones:** the plates run full-bleed, which makes screens *larger* than in V2.
- **768–1023:** one screen per row at native width. Two plates side by side would hold screens at 0.75 of native, which the V2 suite's 0.80 floor rejects; that floor was kept, not lowered.
- **1440 shared stages:** screens are 0.93 of native, down from 0.99. This is the price of 48 px side fields across three columns (§6.2).

## 3. Results per chapter (EN and RU measured; numbers identical unless noted)

All values are in CSS px: the screen's field top / bottom, then the rendered scale against native.

| Chapter | 1440 | 1024 | 768 | 390 | 360 | 320 | BEFORE (all widths) |
|---|---|---|---|---|---|---|---|
| Hero (owner screen on sand) | 64 / 161¹ · 1.00 | 64 / 64 · 1.00 | 48 / 48 · 1.00 | 40 / 32² · 0.92 | 40 / 32² · 0.84 | 32 / 32 · 0.76 | 0 / 0 (border) · 0.69–0.99 |
| Choosing (3) | 64 top, shared stage · 0.93 / 1.00 | 64–89 · 0.95 | 48 · 1.00 | 40 / 40 · 0.92 | 40 / 40 · 0.84 | 32 / 32 · 0.76 | 0 / 0 |
| Handoff (2) | 64–76 · 1.00 | 64–75 · 0.95 | 48 · 1.00 | 40 / 40 · 0.92 | 40 / 40 · 0.84 | 32 / 32 · 0.76 | 0 / 0 |
| Exceptions (2 + actions) | 64–82 outer, 16 to the action bar · 1.00 | 64–81 · 0.95 | 48 · 1.00 | 40 outer · 0.92 | 40 · 0.84 | 32 · 0.76 | 0 / 0 |
| Return (3, sand) | 64 top, shared canvas stage · 0.93 | 64–84 · 0.95 | 48 · 1.00 | 40 / 40 · 0.92 | 40 / 40 · 0.84 | 32 / 32 · 0.76 | 0 / 0 |
| Settlement (2) | 64 / 124 (payment centred) · 1.00 | 64 / 121 · 0.95 | 48 · 1.00 | 40 / 40 · 0.92 | 40 / 40 · 0.84 | 32 / 32 · 0.76 | 0 / 0 |

¹ At 1440 the stage's height is set by the photo column, so the screen's bottom field runs to the stage edge.
² On phones the hero stage also holds the caption and chapter index. Below the screen are a 24 px row gap and then the caption; the stage's own bottom field, under the index, is 40.

Every value, per image, width and locale: [FIELDS.md](FIELDS.md).

- **Labels:** the label-to-screen distance went from 12–14 px to 48–140 px.
- **Captions:** caption-to-screen went from 12–14 px to 47–342 px. The upper end is the shorter screens on the shared 1440 stages. Both distances now include the plate's field: the label and caption stay attached to their plate (16 px), not to the bare image.
- **First mobile viewport:** the product screen starts at 322 px at 390 × 844 (522 px of it visible), 322 at 360 × 800 and 284 at 320 × 640. That is inside the upper 45% at every phone width (functional check).

## 4. Exceptions: real recovery actions

These are new slices from the **original V2 product captures**; nothing was re-shot, painted or composed into one bitmap.

**`branch-reserve` (extended).**

- **Change:** the slice now runs on through the real **Cancel booking — Refund 475 ₽ · retained 475 ₽** row, which the screen's own text calls "the refund shown below". It ends 12 px under the last line.
- **Method:** new `follow` mode in `crops.py`.

**`branch-reserve-action` and `branch-failed-action` (new).**

- **Content:** each screen's fixed bottom bar, cut from its recorded DOM box (`footer._checkout`, `footer._screenFooter`) below the bar's 1 px hairline, to the end of the document:
  - reserve: **Choose another time or walker**;
  - failed: **Retry confirmation**, **Retake**, "Local demo only · no photo is uploaded."
- **Method:** new `footer` mode.
- **Presentation:** shown under the main slice on the same plate, **16 px apart**. The empty canvas between content and bar (≈ 100–135 CSS px) is omitted, not hidden inside one image.
- **Alt text:** "Bottom bar of the same screen: …" (RU: «Нижняя панель того же экрана: …»).

**Provenance and checks.**

- **Manifest:** [captures/crops.json](captures/crops.json) gives source PNG + SHA-256 and the device-px rectangle for every slice ([logs/crops.txt](logs/crops.txt)).
- **Unchanged slices:** the other 22 are **byte-identical** to V2.
- **Edge audit:** 30/30 slices pass, worst edge 3/255 ([logs/edge-audit.txt](logs/edge-audit.txt)).

## 5. Verification

| Check | Result |
|---|---|
| `astro check` | 0 errors, 0 warnings, 163 hints, the same count as V2 ([logs/typecheck.txt](logs/typecheck.txt)) |
| `astro build` | 37 pages ([logs/build.txt](logs/build.txt)) |
| `check:content` (no "concept"/status labels) | 0 findings ([logs/content.txt](logs/content.txt)) |
| `check:css` (dead scoped rules) | 0 on all 29 pages ([logs/css.txt](logs/css.txt)) |
| Functional + accessibility (V2 suite, unchanged thresholds) | **66/66** ([logs/functional.txt](logs/functional.txt), [after/functional/](after/functional/)). It covers headings, `lang`, anchors, alt, media load, keyboard reach and visible focus on every screen link (including the new action links), MediaZoom open/Escape/focus return, contrast ≥ 4.5 on sand and white, 44 px targets, CTA, no-JS, motion settle, scale floor at 6 widths, and the screen in the first phone viewport. The suite first **failed twice** on this branch: at 768 (0.75 < 0.80) and at 320 (screen top 300 > 288). Both were fixed in the layout, not in the test |
| Overflow / console | 0 px horizontal overflow and 0 errors at all 12 locale × width captures ([after/facts.json](after/facts.json)). `broken 1` is the global MediaZoom `<img src="">` placeholder, present on every page in BEFORE as well |
| Scope ([logs/scope-dist-diff.txt](logs/scope-dist-diff.txt)) | Home and every non-case page are byte-identical. The other eight case pages have identical markup; their inline styles change only in Pawly-scoped blocks: 16 removed/altered, 26 added, **0 of either outside Pawly scope**. The V2.1 copy of the tool now also classifies removed blocks |

## 6. Remaining limitations and deviations

1. **Page length.** The extra fields cost height:

   | Width | EN BEFORE | EN AFTER | Growth | RU AFTER | Growth |
   |---|---|---|---|---|---|
   | 390 | 14,153 | 15,809 | **+11.7%** | 16,421 | +11.1% |
   | 320 | 13,527 | 15,087 | +11.5% | — | — |
   | 1440 | 9,238 | 10,175 | +10.1% | — | — |
   | 768 | 10,308 | 15,420 | **+49.6%** | — | — |

   The 768 jump is the one-screen-per-row choice from §2. The alternative is pairs at 0.75 of native. A reviewer may prefer that, or a narrower plate side field at 768.
2. **1440 shared stages** render Choosing and Return screens at **0.93** of native (V2: 0.99). Product body text drops from about 14 to 13 px.
3. **DS deviations, case-scoped and documented in `PawlyShot.astro`:**
   - `ds/screens/case.md §5` asks for symmetric plate fields and a single light plate tone. Pawly plates have vertical > horizontal fields (this review's brief).
   - On sand they use `surface-subtle` (gray-50) rather than `surface-plate` (gray-100), which would read muddy on `sand-100`.
   - `CasePlate` itself is unchanged.
   - The `-bleed` rule is respected in spirit: phones bleed the plate, never the screen.
4. **Return canvas seam.** Gray-50 versus the slices' `#FBF9F7` differs by at most 4/255. At 100% zoom on some displays the slice rectangle is faintly visible on the Return stage.
5. **Exceptions:** the main slice and its action bar are two real slices of one screen, shown 16 px apart. The vertical gap between them in the product is not shown.
6. **Pre-existing, not changed:** at 768–1023 the Handoff comparison table uses V2's three-column layout. Its OWNER/WALKER sub-labels do not align across columns when answers wrap differently.
7. **Carried over from V2 unchanged:**
   - SCRN references were not re-opened (connector authorization).
   - The product observations remain (RU thousands separator, no post-pickup support path, client-side home-access rule).
   - The prototype has not been tested with people.

## 7. Evidence

**Raw captures.** [before/](before/) is the `e943da1` build; [after/](after/) is this branch.

- Per locale × width (1440, 1024, 768, 390, 360, 320): `-viewport.png`, `-full.png`, and `-section-{hero,choosing,handoff,exceptions,return,settlement}.png`.
- Both sets came from the same tool ([tools/capture-page.mjs](tools/capture-page.mjs): Chromium, DPR 1, reduced motion, images decoded).

**Section comparisons.** In [comparisons/](comparisons/): `section-<chapter>-<en|ru>-desktop.jpg` (1440), `-tablet.jpg` (1024 + 768) and `-mobile.jpg` (390 + 360 + 320), each BEFORE | AFTER. That is 36 boards.

**Reference comparisons.** `comparisons/reference-<chapter>.jpg` puts the saved reference images from [../REFERENCES.md](../REFERENCES.md) beside AFTER 1440 and 390:

| Chapter | Reference image(s) |
|---|---|
| Hero | `tr-quote` + `np-hand` |
| Choosing | `ha-phones` |
| Handoff | `gr-comp` |
| Exceptions | `dn-diag` |
| Return | `tr-quote` + `ha-phones` |
| Settlement | `ha-components` |

**Measurements.** [FIELDS.md](FIELDS.md), plus `before/` and `after/media-fields.json`.

**Tools.** Everything in [tools/](tools/) runs from the repository root:

- `capture-page.mjs`;
- `measure.py`;
- `boards.py`;
- `functional.mjs`, `edge-audit.py` and `scope-diff.py` (copies of the V2 tools; scope-diff extended);
- `serve.mjs`.

## 8. Questions for the independent reviewer

**Q1.** Does every major media presentation now have premium-level visual spacing and composition?

**Q2.** Is the quality demonstrably comparable to the saved portfolio reference screenshots at desktop and mobile sizes? See `comparisons/reference-*.jpg`.

Verdict options: ACCEPTED · ACCEPTED WITH BACKLOG · REVISION REQUIRED.
