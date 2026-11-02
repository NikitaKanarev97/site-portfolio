# Pawly Home Cover Premium V1: report for independent review

Premium Portfolio V3, Stage 2, fifth of five covers. This report does not approve itself. Acceptance belongs to the independent reviewer. Nothing has been merged or deployed, and Figma was not touched.

| | |
|---|---|
| Branch | [`claude/pawly-home-cover-premium-v1-2026-11-02`](https://github.com/NikitaKanarev97/site-portfolio/tree/claude/pawly-home-cover-premium-v1-2026-11-02) |
| Base | research HEAD `b7096c9127e7d623c9d4412a2e66db8e42b11482` (its integration parent is `42baa85`, which carries the accepted B2B, Vet and Agent covers; no Learn V1.1 work) |
| Implementation | [`5d90468`](https://github.com/NikitaKanarev97/site-portfolio/commit/5d90468): component, copy, media, composition map |
| Report and evidence | the commit after `5d90468` on this branch (branch head) |
| Product source | `NikitaKanarev97/pawly` `main` `a327d73`, read-only |

## 1. Result

The Pawly card's stage now shows one completed walk, told twice in agreement:

- **left:** the product's own drop-off proof photo, with Baikal at the front door and the walker unclipping the lead
- **right:** the whole Order Details V1.1 hero card: *Return confirmed* · **Baikal is home** · *Back at 14:52, confirmed by the return photo* · Pickup 14:05 and Return 14:52 photos with checks · Marina K., *Your walker*
- **caption:** "The return photo at 14:52 — the proof behind 'Baikal is home'." (RU: «Фото возврата в 14:52 — основание для статуса «Байкал дома».»)

The title, outcome line ("A selected photo becomes proof after it is sent."), evidence line and CTA are unchanged.

| Card height (px) | BEFORE EN / RU | AFTER EN / RU |
|---|---|---|
| 1440 | 1116 / 1135 | **848 / 848** |
| 1024 | 864 / 878 | **696 / 696** |
| 768 | 2356 / 2401 | **1161 / 1187** |
| 390 | 1398 / 1430 | **926 / 948** |
| 360 | 1305 / 1362 | **871 / 920** |

Boards: [`comparisons/before-after-*.jpg`](comparisons/) (ten), [`viewport-*.jpg`](comparisons/viewport-en-390.jpg), [`context-*.jpg`](comparisons/context-en-1440.jpg), [`peers-*.jpg`](comparisons/peers-en-1440.jpg), [`ab-*.jpg`](comparisons/ab-en-1440.jpg) and [`benchmark-*.jpg`](comparisons/benchmark-external.jpg). Raw captures: [`before/`](before/) and [`after/`](after/) (`*-pawly.png` for the card, `*-pawly-viewport.png` for landing on the card, `*-context.jpg` for the Vet → Pawly → next section, and `*-full.jpg` / `*-first.jpg` for the whole page). All captures are Chromium at DPR 1 with reduced motion, unretouched.

## 2. Source status, checked rather than assumed

- **Order Details V1.1 is in production, but no independent acceptance is recorded.** `fb5c50a` (V1.1) → `9c88cec` / `9bdae2e` (report) is an ancestor of release merge `3242156`, which `main` `a327d73` redeployed to `pawly-fawn.vercel.app`. The V1.1 REPORT on `main` still reads "Not merged… for independent review", and the Pawly repo has no acceptance file. `src/screens/OrderDetails.tsx` is unchanged after V1.1. I treat the screen state as current but not independently accepted; the reviewer should weigh that.
- **I re-captured `main` myself** with the product's own fixture approach ([`tools/source-capture.mjs`](tools/source-capture.mjs)):
  - EN is **pixel-identical** to the supplied S1.
  - RU differs from S2 in one label: `main` says **«Возврат»**, because Active Service V1.1 changed the shared phrase. The cover uses current `main`, so S2 is one word stale.
  - S3's pickup 16:35 / estimate 17:20 came from a different clock. Under the harness clock the same walk reads 14:05 / 14:50, which is consistent with Order Details.
- **The old portfolio photo contradicted the record.** Its baked strip reads "BAIKAL SAFE HOME · **14:51**" against the product's **14:52**. The product's frame (`public/assets/proof/handover-dropoff.webp`, byte-identical to the git blob) has no strip, works for both locales, and is the very photo the record cites.

Full provenance, crop rectangles and hashes: [`assets/PROVENANCE.md`](assets/PROVENANCE.md).

## 3. A/B decision: A (completed return)

Both were built and captured under identical conditions ([`comparisons/candidates/`](comparisons/candidates/), [`ab-{en,ru}-{1440,1024,390,360}.jpg`](comparisons/ab-en-390.jpg)).

| | A: completed return | B: active walk |
|---|---|---|
| Truth pairing | Drop-off photo + "Return confirmed 14:52". The same event | Pickup photo + "out for a walk", estimate 14:50, Return step hollow. Chronologically correct; the drop-off photo was *not* used |
| Message in 5 s | "Baikal is home, and here is the dated photo" | "Baikal is out, return is not confirmed yet". True, but the outcome the product exists for is absent |
| Desktop | Record (454 × 542) sets the row; photo fills it; edges align | Status card is only ~390 px tall. B1 let the square photo inflate the card to 1035 px. B2 fixed it at 4:3 and still left ~130 px dead under the record |
| Photo crop | Dog's eyes and the walker's face are visible at every width | The pickup frame is portrait; any landscape crop **cuts the walker's head off** (B1/B2 at 390 and 1440) |
| Mobile 390 | 926 px, full card in one viewport | 838 px, shorter but with less evidence: one time, no photo inside the record |

**Rejected: B.** It is semantically weaker (no confirmed outcome) and photographically weaker (headless subject).

Within A, round one (A1) used a crop that included the product's "‹ Walk report" title row and 16 px of grey page. At 1024 that rendered the record at 0.75 of native, with body text ≈11 px. **The shipped A crops to the card's own edges** (716 × 854 device px; its 16 px corners equal `--radius-media`) and rebalances the columns, keeping the record at 0.80–1.27 of native at every width.

**Duplication.** The return frame appears large on the left and as a 140 px thumbnail inside the record. I kept both. The thumbnail is part of the genuine card (cutting it out would mean editing the screenshot), and the caption states the relationship ("the proof behind 'Baikal is home'"), so the repetition reads as cause and effect. A reviewer may still judge the repeat to be redundant (see §7).

## 4. What changed

| File | Change |
|---|---|
| `src/components/pawly/PawlyHome.astro` | **New**, Home-only. `figure` with photo, `CaseScreen` (record, `href` = case, `device: phone`) and `figcaption`. Tokens only: `--surface-cover-pawly`, `--stage-inset`, `--radius-lg` / `--radius-media` (16 px), `--space-*`, `ds-body-sm` |
| `src/components/WorkStage.astro` | +1 import and +1 branch (`theme === 'pawly' && usage === 'home'`). The old Pawly 2:1 grid is scoped `:not(.work-stage--home)`; the case-page cover's markup and CSS behaviour are unchanged |
| `src/copy/pawly-home.ts` | **New**: EN/RU alt texts and caption |
| `public/media/pawly-home-cover-v1/` | **New**: `return-photo.webp` (byte copy), `report-{en,ru}.webp` (whole-card crops) |
| `ds/screens/home.md` | Composition-map entry, following the Vet and Agent precedent |

**Not changed:** hero, navigation, the Agent, Portal, Learn and Vet covers, the Pawly case page, tokens, `featured-work.ts` (outcome, evidence, CTA), `case-art.ts`, the Pawly product repo and Figma.

## 5. Verification (outputs in [`logs/`](logs/))

| Check | Result |
|---|---|
| `npm run build` | 37 pages, complete ([build.txt](logs/build.txt)) |
| `npm run check` (typecheck) | **0 errors, 0 warnings**, 163 hints (repo-wide, none in changed files) ([typecheck.txt](logs/typecheck.txt)) |
| `check:content` | 0 findings, exit 0 ([content.txt](logs/content.txt)) |
| `check:css` (scoped/dead rules) | `/` and `/ru/`: 0 dead rules, exit 0 ([css.txt](logs/css.txt)) |
| `check:harmony` | no violations |
| Horizontal overflow | **0** at 1440 / 1024 / 768 / 390 / 360 × EN/RU ([after.json](logs/after.json)) |
| Page errors, 4xx/5xx, broken images | 0 / 0 / 0 in all 20 profiles |
| Hero, nav and four other covers | **Identical**: outerHTML SHA-256 BEFORE = AFTER (20 profiles, [before.json](logs/before.json) / [after.json](logs/after.json)), and every visible descendant's box plus 11 computed styles identical across 10 profiles ([qa.json](logs/qa.json) `protectedGeometry`) |
| Pawly case page | `main` pixel-identical BEFORE = AFTER at EN/RU 1440/390. Built HTML differs only in the shared CSS bundle. The one `<video controls>` is masked because its native control bar differs even BEFORE vs BEFORE (determinism test run) |
| Keyboard | Tab from the Vet CTA: Pawly title → record → CTA, all `href=/work/pawly`. Visible ring on title and record; the CTA rings the whole card. **Enter** on the record opens the case (one `h1`). Passes in no-JS, reduced-motion and normal modes × EN/RU × 1440/390 (12/12). Focus captures: [`after/states/`](after/states/) |
| No-JS | Both images load, labels and alt present, navigation works |
| Reduced motion | Stage hover-lift transition is 0.00001 s under `reduce`, 0.16 s otherwise |
| Pressed / hover | CTA `rgb(212,50,32)` → pressed `rgb(181,43,27)`. Hover lifts the stage by −4 px (shared FeaturedCase behaviour) |
| Image loading | Real lazy loading: 0 cover requests at page top, then exactly `return-photo.webp` + `report-{locale}.webp` after scrolling to the card. EN/RU never cross-load |
| Radius | Photo and record are clipped by 16 px wrappers (`.pawly-home__photo`, `ScreenSurface`); the stage is 16 px |
| Light/dark | The site has a single light theme (`tokens.css` §prefers-color-scheme), so there is nothing to test |

Reproduce:

```
T=audit/pawly-home-cover-premium-v1/v1/tools
node $T/source-capture.mjs && node $T/media.mjs
node $T/serve.mjs .tmp/before-dist 4433
node $T/serve.mjs .tmp/after-dist 4434
node $T/capture.mjs before 4433
node $T/capture.mjs after 4434
node $T/qa.mjs
node $T/peers.mjs
node $T/boards.mjs
```

Run these from the repo root. `.tmp/before-dist` is `npm run build` at `b7096c9`; `.tmp/after-dist` is the build at `5d90468`. Candidates: `node $T/capture.mjs cand-A1 <port>` and so on, against builds of the candidate states described in PROVENANCE.

## 6. Answers to the brief's questions

**1. Is the visual result genuinely comparable to the selected premium references?**
Partly. In hierarchy and clarity it is comparable to, and for this one question clearer than, R3 (Wag report card) and R5 (InDrive completed ride): one status, one time, two dated photos, one person, no badge noise. It is photo-led like R6 (Airbnb) and keeps the system's radii and rhythm. It is **not** at Airbnb's or Rover's level on image sharpness. The photo is an 800 px source and the record a 716 px source, shown at 682 and 454 CSS px, so both are soft on 2× displays. It also has no motion storytelling. R1 and R4–R6 could not be placed on a board in this session (see BENCHMARK).

**2. Does it communicate a recognizable consumer product rather than a decorative app mockup?**
Yes. It shows a real product screen (the genuine card, uncropped within itself, no bezel or fake device) next to the photo that product produced. Among the five covers it is the only one led by a dog and a person, on a warm surface ([peers board](comparisons/peers-en-390.jpg)).

**3. Is the photo-to-evidence relationship truthful and immediately understandable?**
Truthful: yes. The large photo *is* the product's drop-off proof frame. The time, label and state match exactly. The contradicting "14:51" strip is gone. Nothing claims payment, GPS, reviews, support, certification or guaranteed safety; the outcome line keeps "selected → proof only after it is sent". Immediately understandable: the caption does the linking, and the matching thumbnail makes it visible, but the viewer still has to read the caption or notice the thumbnail. There is no visual connector.

**4. Is mobile compact and readable?**
Compact: yes. 926 px at 390 (−34%) and 871 px at 360 (−33%), and the whole card fits one 390 × 844 viewport. Readable: at 390 the record is 0.89× native (body ≈13 px, headline ≈20 px). At **360 it is 0.80× (body ≈12 px, chip and time labels ≈11 px)**, which is readable but at the lower edge.

**5. What objectively remains below benchmark quality?**
See §7.

## 7. Known limitations and backlog (not fixed here)

1. **2× sharpness.** Photo source 800 × 597 shown at 682 CSS px (1440); record source 716 px shown at 454 CSS px. Both are soft on retina. BEFORE had the same photo limit. A sharper photo would need a higher-resolution original from the Pawly product; a sharper record would need a DSF 3 capture of the same state, which is a re-capture and not an edit.
2. **360 px label size** is about 11 px for the chip and times.
3. **Repeated return frame** (large photo plus thumbnail). It is explained, not removed (§3).
4. **"View photo" links inside the screenshot** look tappable; in the cover the whole record is one link to the case. That is honest, but a viewer might expect a photo viewer.
5. **Source acceptance.** Order Details V1.1 is deployed but has no independent acceptance on record (§2).
6. **Pre-existing and out of scope:** the Pawly title uses `ds-display-6xl` while the other four use `ds-heading-4xl` (`index.astro` passes `editorial={index < 4}`). The RU outcome wraps to three lines at 360. I left both alone because the brief protects shared typography and Home composition, but the reviewer may want them aligned in a later stage.
7. **Benchmark coverage.** R1 and R4–R6 are cited by URL, not shown side by side (§6.1, BENCHMARK).

No self-approval. Stage 3 (case page) and Stage 4 were not started.
