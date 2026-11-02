# Pawly Portfolio Case V2.1.2 — composition revision: report for independent review

This report does not approve itself. Nothing was merged or deployed, and Figma was not touched.

## 1. SHAs and scope

| | |
|---|---|
| Branch | `redesign/pawly-portfolio-case-v2-2026-11-02` |
| Base (BEFORE) | `ba611baa4505248c5db51ee5dbf4ae224cda4e46` (V2.1.1) |
| Implementation | `21b9f0e0b352de7c786d9afcc9e639a63c7ad3f0`, which changes only `src/components/pawly/PawlyCase.astro` and `PawlyShot.astro` (+55 / −34 lines) |
| Evidence + this report | `4d78a6c349413bfda724551e86f1106cd80ee8b6`; branch head = the report-only commit after it (§13) |
| Routes | `/work/pawly`, `/ru/work/pawly` |

**Unchanged:**
- **Byte-identical to `ba611ba`:** the screenshot files, `src/data/pawly-case-v2-media.json`, both copy files, and every page outside the case pages.
- **Untouched:** other cases, Home, DS tokens, and the shared components `CasePlate`, `CaseShot` and `MediaZoom`.

## 2. Root cause

Three mechanisms combined:

1. **Shared tracks.** `.pawly-steps__item` / `.pawly-proof__item` spanned three grid rows (`grid-row: span 3`) with `grid-template-rows: subgrid`, and so did the `PawlyShot` figure inside them.
   - Label, plate and caption of all screens in one row lived on the same three tracks.
   - The plate track took the height of the **tallest** screen.
   - Because `PawlyShot`'s own plate track is `1fr`, every shorter plate stretched to that height, and every caption sat below the tallest plate.
2. **Shared stage at 1440.** `::before` on the Choosing and Return grids painted one surface across the plate track, so the stretched field became a visible surface.
   - Measured: **155–263 px** of unused plate under shorter screens.
   - Image-to-caption distances: **245 / 354 px** (EN) and **268 / 332 px** (RU).
3. **Auto-fit below 1440.**
   - `repeat(auto-fit, minmax(26rem, 1fr))` gave 2 + 1 at 1024–1439, leaving an orphaned third card at the left edge.
   - At 768–1023 it gave one screen per 672 px row, with ~140 px of empty plate on each side of a native 390 px screen.

## 3. Solution and rejected alternatives

**Principle:** rows align **tops**, never plates. Each plate is as tall as its own screen.

- **Base.** The rows get `align-items: start`, and the grid items no longer stretch. `PawlyShot`'s `1fr` plate track therefore collapses to content height, with no change to the component's API.
  - Pairs elsewhere on the page (Handoff, Exceptions, Settlement) still stretch and keep their equal plates, as accepted in V2.1.1.
- **Removed:**
  - subgrid on rows and figures;
  - the `::before` stage;
  - explicit placement;
  - the per-row `padding-inline` / plate background overrides;
  - the `row-gap: 0` and `padding-block-end` workaround;
  - the auto-fit 26rem track.

| Width | Shipped layout | Why |
|---|---|---|
| ≥ 1440 | Three independent plates in three columns, tops aligned, caption directly under each plate | The sequence reads from the shared top edge, the 01/02/03 numbering and one surface tone. A single stage could not stay unbroken without a hole under the shorter screens |
| 1024–1439 | Steps 1–2 side by side. Step 3 spans the row: its plate sits under step 1 (subgrid columns, so the edges align) and its label + caption form one block **centred on the screen** in the second column. That caption is set one step larger (`--size-base`) because it closes the chapter | The final step reads as a deliberate closing figure, not a leftover card |
| 768–1023 | Every step: screen at native scale with its label + caption centred beside it; even steps mirror (zig-zag). Handoff: owner screen with the comparison beside it, then walker screen with the note beside it | Uses the ~250–480 px that the plates used to leave empty, without shrinking any screen |
| < 768 | Unchanged (stacked) | Accepted in V2.1.1 |

**Rendered alternatives.** All are real Chromium renders of the built page with alternative CSS injected, never shipped ([tools/alternatives.py](tools/alternatives.py), [logs/alternatives.txt](logs/alternatives.txt)). Boards: [comparisons/alternatives-1024-*](comparisons/) and [comparisons/alternatives-768-*](comparisons/), in EN and RU.

| Alternative | Measured / seen | Verdict |
|---|---|---|
| 1024 **A-top**: words pinned to the top of the closing row (the first build of this revision) | A 3-line block, then ~600 px of empty column under it | Rejected: it still reads as a half-empty row |
| 1024 **A-centre** | Side caption centred on the screen; block centre 0 px from the panel centre in EN and RU | **Shipped** |
| 1024 **A-mirror-centre**: plate under step 2, words on the left | Balanced, but the eye returns right-to-left after step 2 | Rejected: weaker reading order |
| 1024 **B**: steps 1–2 stacked left, step 3 right | Visually reads 1 → 3 → 2 | Rejected: wrong order |
| 1024 **F**: centred third card | Still a lone card with empty sides | Rejected: looks like an orphan |
| 1024 **C**: three columns | Screens at **0.57** of native | Rejected: below the 0.80 floor |
| 768 **Alt 1**: paired at ≈0.8× (plate side field cut to 8 px) | Screens at **0.79**; plate fields of 8 px | Rejected: below the floor, and the fields are cramped |
| 768 **Alt 2**: screen + words, alternating | Native scale; section heights −12 to −17% | **Shipped** |
| 768 Alt 2 with all plates on the left | Same metrics; reads as a spec sheet | Rejected: monotonous |

## 4. Per chapter

- **Choosing.**
  - 1440: three content-height plates; captions 82–90 px from the image.
  - 1024–1439: the "Before you confirm" screen closes the row with its words beside it.
  - 768–1023: zig-zag.
  - The rule line is unchanged.
- **Return.**
  - Same grammar. At 1024–1439 the owner's report closes the row (the culmination), with its caption one step larger.
  - Canvas plates are now painted in the slices' own measured surface (`#FAF9F7`, from `pawly-case-v2-media.json`, exposed as `--shot-canvas`) instead of `--surface-subtle` (`#F7F7F5`). The crop rectangle disappears (§8).
- **Handoff.**
  - 768–1023: owner screen + comparison side by side, then walker screen + note. The comparison reads down one column, so each answer sits under its own role name; this fixes the pre-existing OWNER/WALKER misalignment.
  - 1024–1439 (scoped addition): the three-column table under the screens uses subgrid row tracks, so OWNER and WALKER sit on one line across the columns (asserted in the functional suite).
  - ≥ 1440: unchanged.

## 5. BEFORE / AFTER evidence

All captures are Chromium, DPR 1, reduced motion, images decoded, same tool for both builds ([tools/capture-page.mjs](tools/capture-page.mjs)). [before/](before/) is the `ba611ba` build; [after/](after/) is `21b9f0e`.

**Widths, EN and RU:** 1440, 1279, 1100, 1024, 900, 800, 768, 390, 360, 320, plus 200% zoom of 1440 / 1024 / 768.

**Section boards** in [comparisons/](comparisons/), BEFORE | AFTER, each for EN and RU:

| Board | Widths |
|---|---|
| `section-choosing-<loc>-desktop.jpg` | 1440 |
| `section-choosing-<loc>-tablet.jpg` | 1024 + 768 |
| `section-choosing-<loc>-between.jpg` | 1279 + 1100 + 900 + 800 |
| same three for `return` and `handoff` | as above |
| `section-return-<loc>-mobile.jpg` | 390 + 360 + 320 |

**Full pages:** `full-<loc>-{1440,1024,768}.jpg`. The raw `*-full.png` files are in before/ and after/.

**Seam:** `seam-return-zoom200-amplified.jpg`.

## 6. Image-to-caption distance

Measured from the image's **own** bottom edge, not the plate (DOM boxes; [tools/measure.py](tools/measure.py); every image and width in [FIELDS.md](FIELDS.md)). The visible screen panel ends 10–12 px below the image, so panel-to-caption is 80–81 px.

| Locale | Width | Chapter | BEFORE worst | AFTER worst | AFTER, captions beside |
|---|---|---|---|---|---|
| EN | 1440 | Choosing | 245 | 90 | 0 |
| EN | 1440 | Return | 354 | 93 | 0 |
| EN | 1024 | Choosing | 107 | 90 | 1 (closing step) |
| EN | 1024 | Return | 111 | 92 | 1 (closing step) |
| RU | 1440 | Choosing | 268 | 90 | 0 |
| RU | 1440 | Return | 332 | 93 | 0 |
| RU | 1024 | Choosing | 108 | 90 | 1 |
| RU | 1024 | Return | 101 | 92 | 1 |

**Other measurements:**
- **Unused plate height** (field below − field above): 120–263 px BEFORE at 1440 → **0** for every image at every width, EN and RU.
- **Side captions** (1024–1439 closing step; 768–1023 every step): 24 px from the plate, and the label + caption block is centred on the screen panel (offset 0).
- **Wider mirrored steps:** at 900 the mirrored steps sit 47 px away, the ragged right of a 36ch caption.

**Rendered scale** against native:

| Width | Scale |
|---|---|
| 1440 | 0.93 (unchanged; "Before you confirm" 1.00) |
| 1024 | 0.95 |
| 1279 / 1100 | 1.00 |
| 768–1023 | 1.00, up from V2's 0.75 |

## 7. Tablet height and readability

From `facts.json` ([logs/heights.md](logs/heights.md)):

| Page | BEFORE | AFTER | Change | Choosing | Return | Handoff |
|---|---|---|---|---|---|---|
| EN 768 | 15,691 | 14,671 | −6.5% | 2936 → 2584 | 2974 → 2667 | 2085 → 1724 |
| RU 768 | 16,044 | 15,001 | −6.5% | 3017 → 2665 | 3043 → 2713 | 2103 → 1742 |
| EN 900 | 15,640 | 14,646 | −6.4% | 2936 → 2584 | 2974 → 2667 | 2059 → 1724 |
| EN 1024 | 12,234 | 11,950 | −2.3% | 2153 → 2000 | 2271 → 2139 | 1254 → 1254 |
| EN 1440 | 10,266 | 10,202 | −0.6% | 1335 → 1303 | 1511 → 1479 | 971 → 971 |
| EN/RU 390, 360, 320 | | | **0.0%** | unchanged | unchanged | unchanged |

**What the numbers show:**
- The three target chapters are 12–17% shorter at 768–1023.
- No screen was shrunk: all are at 1.00 of native.
- 768 is still **+42%** against V2's 10,308 px. V2 reached that height with screens at 0.75, below the floor.
- The rest of the tablet length is:
  - the native-scale screens themselves;
  - Exceptions, Settlement and the hero, which are accepted V2.1.1 work and were not changed.

**Readability at 768:** the side column is 226 px, so captions wrap to 4–6 lines of 14 px text. This is narrow but readable; at 900 the column is ~360 px.

## 8. Return surface seams

[tools/seam.py](tools/seam.py) samples Return at every width and at 200% zoom ([logs/seams.txt](logs/seams.txt), `before|after/seams.json`). At each edge it compares three surfaces: the slice's edge pixels, the painted panel padding, and the plate. Values are worst channel difference, out of 255:

| | BEFORE | AFTER |
|---|---|---|
| Panel padding ↔ plate | **3** (gray-50 vs `#FAF9F7`) | **0** |
| Panel corner ↔ plate | 0 | 0 |
| Slice edge ↔ padding | 3–5 | 3–5 (unchanged) |

- **Slice edge ↔ padding:** this is the product card's own drop shadow and WebP noise inside the screenshot. No pixels were edited (edge audit: 30/30 slices pass).
- **Amplified board:** [comparisons/seam-return-zoom200-amplified.jpg](comparisons/seam-return-zoom200-amplified.jpg) at contrast ×12. BEFORE shows the plate rectangle around each panel; AFTER is one surface. A step of at most 1/255 is visible only after amplification.
- **Phones:** a pixel diff of full pages at 390/360/320, EN and RU ([logs/mobile-regression.txt](logs/mobile-regression.txt)), shows identical heights. The only differing rows are the three Return plates, max 3/255: the seam fix and nothing else.

## 9. Visual reference comparison

The reference images were opened in this session: `research/portfolio-benchmark/case-blueprint/img/ha-phones.jpg`, `gr-comp.jpg` and `tr-quote.jpg`. Boards: [comparisons/reference-choosing.jpg](comparisons/reference-choosing.jpg), [reference-return.jpg](comparisons/reference-return.jpg) and [reference-handoff.jpg](comparisons/reference-handoff.jpg), each showing the reference next to AFTER EN 1440 / 1024 / 768 / 390.

### Choosing vs `ha-phones` (H1)

- **What HA does:** three devices on one stage, tops aligned, labels above.
- **Why a single stage doesn't transfer:** HA's three devices are the **same height**. Pawly's three slices are 525 / 575 / 659 px, so one stage must leave a hole under the shorter two. That hole was the defect.
- **AFTER at 1440** keeps HA's grammar: the shared top line, labels above, equal scale and one tone. It gives each screen its own plate, so the bottoms are ragged by design, each with its caption 80 px under the panel.
- **What HA has that Pawly deliberately doesn't:** device bezels (not copied, per REFERENCES.md), and screens all at ~1.0 scale (Pawly: 0.93 at 1440).

### Return vs `tr-quote` (H7) + `ha-phones`

- The warm full-bleed band of the tr-quote reference is unchanged.
- **Now:** the cards float on one continuous canvas tone, with no inner rectangle (§8).
- **At 1024** the owner's report closes the band with its caption beside it. That is closer to tr-quote's single-statement editorial beat than the earlier orphan card was.

### Handoff vs `gr-comp` (H6)

- **What gr-comp does:** a statement, then a readable row of real UI.
- **Desktop:** unchanged.
- **At 768** the comparison now reads beside the owner screen rather than as a 3-column table under it.
- **At 1024–1439** the table rows align.

## 10. EN / RU

- Every measurement in §6 is EN and RU.
- **Labels:**
  - Row labels are one line at every width from 900 up, in both locales (measured label box height: 22 px, from `after/facts.json`).
  - In RU at 768–800, two labels wrap to two lines in the narrow side column: «Сначала «подходит», потом «проверен»» and, at 768, «Выгульщик · Выбрано, не отправлено». The label + caption block is centred on the screen, so nothing else moves.
  - At RU 320 one label wraps on the stacked phone layout, the same as BEFORE.
- **Captions:** RU captions are 10–20% longer and push only their own plate's caption block; nothing aligns to a neighbour's text.
- **Handoff:** the RU table alignment at 1024 / 1100 / 1279 is asserted (same tops for every WALKER line).

## 11. Verification (commands from the worktree root; outputs in [logs/](logs/))

| Command | Result |
|---|---|
| `npx astro check` | 0 errors, 0 warnings, 163 hints (same as V2.1) — [typecheck.txt](logs/typecheck.txt) |
| `npx astro build` | 37 pages |
| `npm run check:content` | `"findings": 0` — [content.txt](logs/content.txt) |
| `npm run check:css` | `/work/pawly: мёртвых правил 0`, all pages 0 — [css.txt](logs/css.txt) |
| `node .../tools/functional.mjs dist after/functional` | **128/128 pass** — [functional.txt](logs/functional.txt) |
| `node .../tools/capture-page.mjs <dist> <out>` | 0 px horizontal overflow and 0 console errors on all 26 runs per build, including 200% zoom — [after/facts.json](after/facts.json) |
| `python .../tools/edge-audit.py v2.1/captures/crops.json` | 30/30 pass — [edge-audit.txt](logs/edge-audit.txt) |
| `git diff --stat ba611ba -- public/ src/data/ src/copy/` | empty (no image, manifest or copy change) |
| `python .../tools/scope-diff.py <ba611ba dist> dist` | see below — [scope-dist-diff.txt](logs/scope-dist-diff.txt) |
| `python .../tools/regress.py` | phones: only the Return plate tone differs — [mobile-regression.txt](logs/mobile-regression.txt) |

**Functional suite.** It is the V2.1 suite, with nothing removed and no threshold changed. It covers:
- headings and `lang`;
- anchors and alt text;
- media load;
- keyboard reach and visible focus;
- **MediaZoom:** opens from Enter, Escape closes it, and focus returns to the trigger;
- contrast ≥ 4.5;
- 44 px targets;
- **no-JS:** nothing left hidden;
- **motion on:** everything settles visible;
- the 0.80 scale floor;
- the first-phone-viewport screen.

It gains four widths (1279 / 1100 / 900 / 800) and three new assertions per width:
- every row caption is beside its screen or ≤ 100 px below it;
- row plates are content height;
- Handoff WALKER lines align wherever the table is side by side.

**Broken images.** `broken 1` in the capture log is the global MediaZoom `<img src="">` placeholder, present in BEFORE too.

**Scope diff.** Out of 183 pages, home and every non-case page are byte-identical. The eight other case pages carry the case-scoped style blocks inline:
- 6 blocks removed or altered and 8 added, **0 of either outside Pawly scope**;
- markup outside `<style>` identical.

## 12. Known limitations

1. **Image-to-caption at ≥ 1024 is 90–93 px** (panel-to-caption 80), the upper end of the 64–96 target. It is the plate's 64 px field + 10–12 px of the slice's own surface + 16 px.
   - The 64 px field was kept so that these plates match every other plate on the page (Handoff, Exceptions, Settlement).
   - Reducing it only here would make the Choosing/Return plates a different object.
2. **Ragged bottoms at 1440** are deliberate. The Return report plate is ~280 px taller than the walker plates; below the shorter plates is the open band or sheet, not plate surface.
3. **768 page height** is still +42% over V2 (§7). Exceptions and Settlement still use one full-width plate per screen at 768–1023. Applying the side-caption grammar there would cut more, but those chapters were listed as accepted and were not touched.
4. **Labels in the 1024–1440 rows** no longer share a track. If a future label wrapped to two lines there, that row's plates would start at different heights. All current EN/RU labels are one line at ≥ 900 (measured, §10).
5. **Closing-step caption** at 1024–1439 uses `--size-base` instead of `--size-sm`, a case-scoped emphasis.
6. **Not re-opened:** the SCRN references (connector authorization, as in V2/V2.1). The prototype has not been tested with people.

## 13. Changes outside the narrow brief

- **Handoff table alignment at 1024–1439** (subgrid row tracks): the brief named 768–1023. The same defect existed one breakpoint up, and the fix is four declarations scoped to that range.
- **`PawlyShot.astro`** exposes `--shot-frame` (panel width) and `--shot-canvas` (measured surface) as figure-level custom properties. The component API and markup are unchanged, and it is used only by `PawlyCase`.
- **Tools** are copies of the V2.1 tools, extended (capture widths and zoom, DOM geometry in `measure.py`, functional assertions, boards). New: `explore.mjs`, `alternatives.py`, `seam.py`, `regress.py`.

**Final branch head:** evidence + report `4d78a6c349413bfda724551e86f1106cd80ee8b6`; the branch head is the report-only commit after it, which records this line.

## Questions for the independent reviewer

**Q1.** Does every important Pawly screenshot now have premium-level presentation, with balanced space and a clear screenshot / background / caption relationship?

**Q2.** Are Choosing and Return comparable to the saved HA and other premium references at 1440, 1024, 768 and mobile widths?

Verdict options: ACCEPTED · ACCEPTED WITH BACKLOG · REVISION REQUIRED.
