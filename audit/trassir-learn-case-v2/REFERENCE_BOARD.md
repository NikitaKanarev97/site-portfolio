# TRASSIR Learn — case V2 / art-direction and evidence board

Prepared by ChatGPT, 31 October 2026. **For Codex to implement** on the existing Astro portfolio. No code, public page or Figma changes have been made by this preparation.

## What is actually in this repo

- `main` at preparation: `c96340edd6acddd5e689b038648e5156680ec42a` contains **an existing Learn portfolio case** and the latest Agent Ops V2 / Portal V2 case-specific renderers. Do not create a second `learn` slug, discard the existing narrative, or modify `main` while working.
- The current case registry is in `src/copy/cases/index.ts` and `src/copy/ru/cases/index.ts`; existing case texts are `src/copy/cases/learn.ts`, `src/copy/ru/cases/learn.ts`. There are already `makeLearnStory` implementations, localized titles and media in `public/media/rebuild/learn*`, `public/media/case-learn*`.
- Product screen redesigns have been independently visually accepted one at a time. Current Learn `main` / published prototype has **not** been confirmed to include every accepted redesign. Evidence is sourced from different Learn commits and must never be represented as one already-merged release.
- Existing case reference for **site-specific craft**: `src/components/agent/AgentCase.astro`, `src/components/portal/PortalCase.astro`, and their shot components/copy. Shared `CaseStory.astro` is available; choose case-scoped renderer only if the desired composition genuinely needs it. Don't copy another product's color scheme.

## Selected image assets (committed original PNG captures)

All 23 files are in `audit/trassir-learn-case-v2/evidence/`. These are actual **previously captured browser screenshots** from reviewed Learn branches, transferred bit-for-bit. They have not been synthesized or re-shot here. Their purpose is to save Codex from having to find the right app states and screen coordinates.

Primary assets for the visible case (8–11 well-presented images, not all 23):

| Section | Preferred file(s) | Specific evidence | Proposed visual treatment |
|---|---|---|---|
| Hero | `01-home-setup-desktop.png`, `04-material-onvif-desktop.png`, `08-trajectory-started-desktop.png` | Home task entry, actual answer, named learning path | Large calm white/neutral device-free hero stage, strong UI surface and smaller offset detail; text outside screenshots, nothing clipped |
| Archive → task | Existing `public/media/case-learn/before-catalog.webp` and `01-home-setup-desktop.png` | A course-led archive entry vs task-oriented entry | Contextual BEFORE/AFTER comparison, archival original explicitly labelled; original Russian UI unchanged |
| Two ways in | `01-home-setup-desktop.png`, `02-home-project-desktop.png`, `03-home-setup-mobile.png` | Work-mode selection plus reference/learning discovery | Desktop large with one mobile inset; do not treat four homepage modes as four personas |
| Shared knowledge object | `04-material-onvif-desktop.png`, `10-player-current-desktop.png` | Same technical article used in reference and within program; neutral version metadata | Paired comparative plates with clear labels Reference / Learning. Use existing `learnContentModel` artifact for the relation diagram |
| Training path | `07-trajectory-anon-desktop.png`, `08-trajectory-started-desktop.png`, `09-trajectory-started-mobile.png` | Program purpose, 11 units, exam rules, real continue CTA; reference reading != completed | One wide UI plate + one proof crop of status. Avoid repeating page-level full-height screenshot |
| Reading workspace | `10-player-current-desktop.png`, `11-player-current-mobile.png`, `12-player-read-only-desktop.png` | Actual lesson, current row and explicit complete-and-next | Wide source article and readable navigation; mobile crop only if text legible |
| Two progress facts | `13-my-learning-marina-desktop.png`, `15-my-learning-reader-desktop.png`, `14-my-learning-marina-mobile.png` | Learning completion and reference history separate; reader without program has no fictional completion | Two real account states, focused on progress modules, not giant full pages |
| Assessment → next action | `18-result-failed-desktop.png`, `20-result-passed-desktop.png`, optional `19`/`21` mobile | 14/20 vs 16 threshold and cooldown/practice; 20/20 and document action | Strong pair of restrained outcome cards with green/warning semantics only as in product. **Check public-content restrictions in embedded screenshots** |
| Review and recovery | `22-result-wrong-review-desktop.png`, `23-result-sources-desktop.png` | Wrong/skip/correct filter; linked source materials, never fake grade improvement | Small lower proof strip; not a seventh or eighth competing section |

Secondary real captures remain available but should not be forced into the page: `05` full technical article, `06` mobile material, `16` finished My Learning, `17` active exam, etc. Each asset's exact Learn source commit/path is specified in `ASSET_MANIFEST.json`.

## Real external case-study references: context, not copied visual assets

1. **Local portfolio is the primary art-direction source.** Agent Ops V2: large editorial hierarchy, purposeful outcome stages, restrained enterprise screens and a clear case ending. Portal V2: art-directed quiet cover, image plates of different scales, readable decision progression and a considered mobile crop. Do not use their product-specific warm/carbons or brand accents verbatim.
2. [O'Reilly — Designing a scalable content experience](https://salomono.com/portfolio/optimized-in-content-views/) — strongest **storytelling reference**: what changed in the in-content learning experience, supported by relevant UI. Use the problem→decision→proof relationship, not analytics claims.
3. [Fruto — This is School](https://fruto.design/case-studies/ux-design-for-a-digital-learning-platform-in-education) — meaningful **lesson and course** modules, product problem described before interface images. Do not claim Fruto's impact as ours.
4. [Alicja Kozłowska — English Atelier platform](https://www.alicjakozlowska.com/work/english-atelier-platform-design) — screen-by-screen coherent media and mobile framing. Avoid games, badges, serif branding and decorative course tiles.
5. [Folioas — UX case-study structure](https://folioas.com/ux-portfolio-example) and [UXfolio case-study examples](https://blog.uxfol.io/ux-case-study-structure/) — keep the recruiter skim layer concise. These are editorial references, not aesthetic templates.

Other sites / Mobbin / SCRN need not be searched again. The approved Learn screens and the two V2 portfolio cases are more relevant than a generic LMS UI hunt.

## Editorial art direction

- **Concept:** “One knowledge system. Two ways to learn.” RU: “Одна база знаний. Два пути к результату.”
- **Portfolio frame:** cool editorial off-white/light neutral, deep-navy typography, existing site fonts/grid/motion tokens. Product screens retain their own authentic light surfaces / cobalt/neutral status colours. Let original screenshot imagery supply accents.
- **Hero:** H1 and one-line outcome in a clean text zone. Stage of 1 large real UI window + 1–2 supporting surfaces with native aspect, deliberate stacking, gentle corner radius and offset. No gigantic blurred interface as background, no fabricated devices/mock-ups, no repeated decorative dots, no giant 3D objects or artificial gradients.
- **Rhythm:** alternating full-width proof, readable close-up, paired decision, compact diagram. Screens never become tiny illegible billboards; use genuine details with legible text. Mobile frames are their own intentional crops.
- **Motion:** existing registered GSAP/transition hooks only (subtle fade/reveal/line); reduced motion no hidden content, no heavy parallax/scrolljack.
- **External copy:** EN/RU real localized prose. The old case already contains much of the factual backbone; preserve actual employer relationship without inventing a client brief, launch, conversion, interviews or business KPIs.
- **Content policy in repo:** read `CONTENT-RULES.md` before any public copy or screenshot is published. The owner explicitly prohibits publicly labelling authored portfolio work with “concept”/“pet”/“only prototype” tags, including embedded public image text. At the same time **never claim official TRASSIR accreditation**. A truthful “training document”/“demonstration data” description can be used without devaluing the author’s work. Verify the exact rendered page and raster assets for prohibited copy; choose a suitable natural crop if an older screenshot includes such copy. Do not manipulate screenshots in a way that fabricates product behavior.
- **Before/after integrity:** the archive screenshot is the starting course catalogue, not necessarily an exact identical route at two time points. Label the comparison as **archival entry point → redesigned task entry** and don't imply measured improvement or controlled A/B test.
- **Localization:** all 23 current accepted screenshots are RU UI. They cannot be relabelled as English screenshots. If a fully integrated EN Learn build is accessible, capture new authentic EN screenshots after verifying screens correspond to the accepted design. Otherwise use the RU images with an explicit, subtle caption that these are original RU interface captures in the English case. Never overlay fake translated UI text.
- **Versions:** before production verify that the actual linked Learn prototype includes the six accepted screens. If not, do not imply the linked demo demonstrates them; coordinate the separate integration of Learn branches without making this case task consume an unbounded source-app merge.
- **QA proof ≠ UX impact:** scores (14/20, 20/20, 11 units) describe rules/test fixtures. Automated routes/tests are engineering checks, not user outcome metrics. No invented “faster by 60%”, conversions, interviews or employee productivity.

## Final acceptance target

One polished existing `learn` portfolio case, same quality bar as accepted Agent/Portal V2: **desktop EN/RU × 1440 and mobile EN/RU × 390**, first viewport and full page, hero crop and major evidence screenshots inspectable, case coherent by headings alone, links and EN/RU navigation honest, no fake visual claims. Codex pushes a review branch; ChatGPT independently accepts or requests only specific corrections. No merge or production deployment.
