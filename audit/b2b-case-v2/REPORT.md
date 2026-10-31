# B2B Partner Portal case V2 — implementation report

**Branch:** `redesign/b2b-portfolio-case-v2` (from `portfolio/b2b-case-visual-v1` @ `cc3492b`). Not merged, not deployed.
**Product evidence:** `b2b-partner-portal` @ `6bbe1cd71a656414efcc90a98c61d1012c55be92` (accepted `redesign/cart-v2`), served from a clean worktree. Uncommitted WIP in the local product checkout was not used.
**Status:** handed over for independent visual acceptance. Not self-approved.

## What changed and why

| Brief problem | V2 answer |
|---|---|
| Cover: three near-identical cameras from old UI | Direction B, "specification → commercial decision". The dominant plate is the Resolution Center workspace: real app chrome, 41 of 48 lines confirmed, and the seven open lines marked Ambiguous, Missing or Changed. A separate card shows the real Cart change panel (row 19, ₽34,900 → ₽35,800, +2.6%, Accept change). Title and promise sit on clean colour. Direction A (Dashboard-led) was rejected because it spent the cover on a status page and duplicated module 01. |
| Arbitrary crops (Dashboard cut into Recent orders) | Every crop is a DOM element box plus padding, made at capture time (`scripts/b2b-v2/capture-product.mjs`). Dashboard ends 24px under "Start a specification", above Recent orders. Product Details now includes the top bar and breadcrumbs. Fulfillment uses 20px margins, which is the true gap to the next section. |
| Outdated resolution media / broken selection fill | All frames were recaptured from the accepted build. In that build, row 38 with the second candidate selected (`captures/en/decision38-1280.png`, inspection only) has a fill covering the full row. The defect existed only in the old screenshot, so the old `line-*` frames are not used on the route and no product fix was needed. |
| Weak whitespace / legibility | Desktop sources are shot at 1280 at DPR 2, so native width ≈ display width. A frame never renders wider than its capture (the page check counts 0 upscaled frames). Phones get authentic 390 captures through `<picture>`, never a shrunken desktop. Module rhythm is 96 / 128px. |
| Gallery without narrative | Seven modules, one idea each, in the story order: problem → system → human decision → verification → commercial review → fulfillment → outcome with costs and the prototype CTA. One dark band marks the commercial-review pattern. |

## Evidence

- References (captured before implementation): `audit/b2b-case-v2/references/REFERENCES.md`. Linear, Ramp Procurement, Stripe Billing, Attio; Mercury and SCRN rejected with reasons. Mobbin was not used.
- Source captures + crop manifest: `audit/b2b-case-v2/captures/{en,ru}/*.png`, `captures/manifest.json` (route, commit, viewport, DPR, clip, boundary note). Site media: `public/media/rebuild/partner-portal/v2/`, mapped in `src/data/partner-portal-v2-media.json`.
- BEFORE (starting commit `cc3492b`, real Chromium): `audit/b2b-case-v2/qa/before/{en,ru}-{1440,390}-{viewport,full}.png`.
- AFTER (production build via `astro preview`): `audit/b2b-case-v2/qa/after/{en,ru}-{1440,390}-{viewport,full}.png`, plus closeups `closeup-{locale}-{width}-{cover,decision,commerce,fulfillment}.png`.
- Page checks: `qa/after/checks.json`. Every page was scrolled end to end so that lazy images and once-only scenes finish before capture.

## QA results (AFTER, EN/RU × 1440/390)

- 0 runtime errors, 0 failed requests, 0 broken images, 0 upscaled frames, 0 horizontal overflow, 0 text left hidden by motion.
- Prototype links: EN → `https://b2b-partner-portal-five.vercel.app/`, RU → `…/ru` (facts row and CTA).
- `astro check`: 0 errors, 0 warnings. `astro build`: complete. `check:content`: 0 findings. `check:css` including `/work/partner-portal/` and `/ru/work/partner-portal/`: 0 dead rules.
- Page height at 1440: EN 11,268 → 8,585 px; RU 11,431 → 8,960 px.
- Word count on the case surface, including facts, labels, captions and steps: EN 649, RU 599. The main EN narrative (promise, theses, bodies, the decision note and the outcome costs) is 337 words, slightly under the 350–500 guide, because captions and labels carry the rest.
- First viewport (1440, about 1.2s after load): title, promise, workspace and change card are all visible. The cover uses the site's `data-motion-intro`, so it no longer waits for a scroll trigger.

## Scope kept

- Only the Partner Portal route changed. Shared `CaseStory`/`Case*.astro`, tokens and motion are untouched; the other four cases render as before. The route switch is in `src/pages/work/[slug].astro`.
- The old story data (`partnerPortalStory`) still feeds the noindex preview route `/preview/partner-portal-rebuild/`. Only its cover promise was updated, because the meta description reads it.
- The archived original dashboard (`/media/case-dssl/legacy-dashboard.webp`) is reused unchanged as the honest BEFORE.

## Open points for the reviewer

1. The legacy BEFORE image is a small, very wide crop (1426×440). It reads as a glance, not as detail. A taller archival crop would need new retouching of client data, which is out of scope.
2. The commercial-review strips sit at native width on the left of the dark band, leaving air on the right at 1440. This is intentional, to avoid upscaling, but it is a layout choice open to review.
3. The Vercel Preview for this branch could not be verified from this environment: `gh` is not authenticated. See the handoff message for the push result.
