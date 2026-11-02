# Pawly Portfolio Case V2 — report for independent review

This report does not approve itself. Nothing was merged, deployed or pushed to `main`; Figma and the Pawly product repository were not touched.

| | |
|---|---|
| Branch | `redesign/pawly-portfolio-case-v2-2026-11-02` |
| Base | `3b4f9b530b39dd2445779cf37af412e80b81be36` (research branch HEAD; lineage contains accepted Pawly Home Cover V1 `b3249e6`) |
| Product source | `NikitaKanarev97/pawly` `main` `a327d73abb3e7872a6243301afc926de57dc868b`, read-only; local `vite build`, verified pixel-identical to `pawly-fawn.vercel.app` for six EN/RU states |
| Routes | `/work/pawly`, `/ru/work/pawly` |
| Maps | [SECTION_MAP.md](SECTION_MAP.md) · [ARTIFACT_MAP.md](ARTIFACT_MAP.md) · [../REFERENCES.md](../REFERENCES.md) |

## 1. Baseline (BEFORE, unchanged base build)

Captured with the same tool and settings as AFTER: [`before/`](before/), boards in [`comparisons/`](comparisons/).

- **Hero contradicts the product.** The cover photo carries a baked strip "HANDOVER COMPLETE · BAIKAL SAFE HOME · **14:51**"; the product records **14:52** ([viewport-en-1440](comparisons/viewport-en-1440.jpg)). The photo is drawn at 832 CSS px from an 800 px file (upscaled).
- **Stale product screens.** `active-service.webp` shows the old map-first hierarchy with Message/Call buttons; current `a327d73` is status-first with the received photo and no messaging ([media-active-service](comparisons/media-active-service.jpg)). `walker-profile.webp` and `order-details.webp` show older hierarchies ([media-walker-profile](comparisons/media-walker-profile.jpg), [media-order-details](comparisons/media-order-details.jpg)).
- **Legibility.** Screens rendered from 585 px files; the system section uses 347 px state slices that are illegible as evidence at 390.
- **Narrative.** Six generic modules (thesis, carousel, steps, specimen, shot, outcome); the walker exists only as an earnings screenshot; no failure path is shown.
- Mobile first viewport at RU 320 shows title, a four-line outcome sentence and the photo, but no product UI ([viewport-ru-320](comparisons/viewport-ru-320.jpg)).

## 2. What changed

One walk, told on its own clock, with both people in it: **13:20 Choosing → 14:05 Handoff → Exceptions → 14:52 Return → Settlement → Outcome** (map: [SECTION_MAP.md](SECTION_MAP.md)).

- **Cover.** The thesis ("Trust is not a badge. It's a sequence of confirmed actions.") sits beside the title. The sand stage opens on the *open question*: the uncropped 14:05 pickup photograph beside the owner's live screen ("Baikal is waiting for return confirmation · picked up 14:05 · estimated 14:50"). The Home cover's return photo and "Baikal is home" are held back for the 14:52 chapter, so the case pays off what the cover asks. The chapter index doubles as navigation.
- **Phones:** the live screen follows the thesis directly, in a full-bleed sand band; at 390 the status card and pickup photo are inside the first viewport ([viewport-en-390](comparisons/viewport-en-390.jpg)).
- **Choosing:** list → "why this walker fits" → conditions before confirmation, three native-width screens with the decision under each.
- **Handoff:** owner screen ‖ three questions (first question / evidence so far / kept out) ‖ walker screen.
- **Exceptions:** two alternative branches of the same 14:00 booking — no compatible reserve, nobody assigned; return photo failed to send, photo saved. Each states what the product refuses to do.
- **Return** (sand band): vocabulary Expected / Selected / Received / Confirmed, then selected → received 14:52 → owner report and timeline.
- **Settlement:** 950 − 171 = 779 ₽ beside the owner's payment and the walker's 3,895 ₽ (3,116 + 779), both produced by the UI-confirmed return, not seeded.
- **Outcome:** built / checked / simulated, CTA to the locale's prototype.
- Copy: EN prose 486 words (639 with labels and table cells), RU 429 (569). RU is edited separately; alt texts quote the product's RU strings.

## 3. Capture and crop integrity

- **One fixture, one clock.** All 13 product states use the seed's 14:00 slot and Playwright's clock at 22 Aug 2026 13:20 MSK (the app's `demoNow`). The 16:30 slot (16:35 / 17:22) is never used. Failed send, retry, earnings and report are reached through the UI in one session (`tools/product-capture.mjs`).
- **Slices, not miniatures.** Each image is a full-width slice of a 390 × DPR 2 capture, bounded by measured DOM boxes. The product's "All screens" viewer bar is excluded.
- **Clean edges are enforced, not eyeballed.** Product cards carry a 0 12 24 px shadow. My first crops ended inside it (bottom rows at RGB 233 vs a 250 page surface, and two slices began in a neighbour's shadow). `crops.py` now moves each edge outward until the whole row is page surface, and fails otherwise. This forced three composition changes:
  - hero = status + photo card;
  - report and timeline merged into one slice;
  - "Before you confirm" became an **interior** crop, 8 px inside the card. That point lies inside the 16 px corner arc, so the crop has no border, corner or shadow pixels.
- **Independent edge audit:** 26/26 pass, worst deviation 3/255 on any edge ([logs/edge-audit.txt](logs/edge-audit.txt)).
- **Nothing painted, masked or retouched.** The pickup photo is a byte copy shown whole: dog, lead and walker are never cropped.

## 4. Verification

| Check | Result |
|---|---|
| `astro build` | 37 pages ([logs/build.txt](logs/build.txt)) |
| `astro check` | 0 errors, 0 warnings ([logs/typecheck.txt](logs/typecheck.txt)) |
| `check:css` (dead scoped rules) | 0. Caught and fixed two rules on classes passed into `PawlyShot`, which were working only by auto-placement ([logs/css.txt](logs/css.txt)) |
| `check:content` (no "concept"/status labels) | 0 findings; the functional suite also scans rendered text, title and description ([logs/content.txt](logs/content.txt)) |
| Functional and accessibility | **66/66** ([logs/functional.txt](logs/functional.txt), [after/functional/functional.json](after/functional/functional.json)), covering: one h1 / chapter h2s / `lang`; index anchors resolve and scroll; all media load with alt; Tab reaches index, every screen link and the CTA with visible focus; targets ≥ 44 px; MediaZoom opens from keyboard, Escape closes, focus returns; contrast ≥ 4.5 on sand and white; CTA locale + `noopener`; no-JS leaves nothing hidden; motion-on settles fully visible; product screen inside the first phone viewport; screens never enlarged |
| Screen scale | 0.99 of native at 1440 and 1024; ≥ 0.83 at 768; ≥ 0.87 at 390; 0.79 at 360; **0.69 at 320** (the column itself is 272 px) |
| Overflow / console | 0 px horizontal overflow and 0 errors in all 12 locale × width captures ([after/facts.json](after/facts.json)) |
| Defects found and fixed during QA | RU 320 thesis overflowed by 27 px («подтверждённых» wider than the column): stepped to the heading floor below 360. Index numerals were 4.0:1: moved to the subtle tone. Hero screen was 0.63 at 320 and 0.75 at 768 inside the stage padding: stage goes full-bleed on phones, photo column flexes on tablets |
| Scope | Home (with the accepted Pawly cover) and every non-case page are byte-identical. The eight other case pages have **byte-identical markup**; their inline `<style>` gains 87 Pawly-scoped blocks (shared `[slug].astro` imports all case renderers, as with Portal/Agent/Learn) and removes or alters none. The one unscoped rule, `main:has(>.pawly-case)`, cannot match without `.pawly-case` ([logs/scope-dist-diff.txt](logs/scope-dist-diff.txt)). Source diff: one wiring edit plus new Pawly-only files |

## 5. Known limitations and open points

1. **SCRN references were not re-opened** in this session (the connector needs authorization). Their findings come from RESEARCH.md and are marked as such in REFERENCES.md. Mobbin was excluded.
2. **Mobile page length grew**: 9,657 → 14,153 px at EN 390, because every screen is now legible at native size instead of shrunk. This is a deliberate trade-off; a reviewer may prefer a stepped or scroller presentation for Choosing or Return on phones.
3. **The pickup photo appears twice on ≥768**: large in the stage and inside the owner's screen. This mirrors the Home cover's accepted cause-and-effect pairing; on phones only the screen is shown.
4. **320 px**: screens render at 0.69 of native (the site's 24 px margins leave a 272 px column). Product body text there is ≈9 px; MediaZoom opens each screen at full size.
5. **Product observations (not changed):**
   - RU earnings show «3,895 ₽» with an English thousands separator.
   - Post-pickup cancellation still has no contact/support path in the product; the case does not show or claim one.
   - Home-access gating is a client-side demo rule over mock data; the case says so.
6. **Demo photographs** are the product's own "Demo photo" assets (Figma image fills per `pawly/assets-manifest.json`). They are not documentary photos of real people, and no other photograph rights are claimed.
7. **Not validated with people.** The case states the checks were scripted and synthetic, and that the prototype has not yet been tested with owners or walkers.
8. **Housekeeping:**
   - Old `public/media/rebuild/pawly/` and `src/copy/cases/pawly.ts` remain; the copy file still feeds the registry, Home and next-case titles.
   - Figma is stale relative to code, as before.
   - The global MediaZoom placeholder `<img src="">` counts as one "broken" image on every page, BEFORE and AFTER alike.
   - The first product-capture run, whose seed booking was "already active", is not in the repo; `captures-partial.json` supersedes the seeded `order-details` / `walker-earnings` entries in `captures.json`.

## 6. Questions for the independent reviewer

**Q1.** Does every important Pawly section achieve premium consumer-product portfolio quality?

**Q2.** Is the design genuinely comparable to the specific opened SCRN and portfolio reference screenshots, while preserving Pawly's own product identity? Note that the SCRN screens were not re-opened in this session; see REFERENCES.md.

Verdict options: ACCEPTED · ACCEPTED WITH BACKLOG · REVISION REQUIRED.
