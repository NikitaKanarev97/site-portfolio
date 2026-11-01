# Homepage cover polish · 1 November 2026

Implemented for independent visual review. **No acceptance verdict, merge,
deploy or Figma edit.** Commit and push to the branch were explicitly requested
by the owner after the initial implementation handoff.

Baseline: `codex/homepage-premium-v3.1-2026-11-01` at
`43eb0b29372c50af616c71deed3139017adaf705` (see [provenance](logs/provenance.json)).
Working branch: `codex/home-cover-polish-2026-11-01`, isolated worktree
`D:/Claude-projects/sp-home-cover-polish`. Delivery is committed and pushed on
this branch; the containing Git commit identifies the reviewed artifact.
The original main checkout and V3.1 checkout were not edited.

[Open matched screenshot gallery](index.html).

## Portal

Recaptured the genuine row-19 decision from the accepted product source,
`b2b-dssl@6bbe1cd71a656414efcc90a98c61d1012c55be92`. The Home composition still
shows the **41/48 fixture**, ambiguous source row, both real recorder options,
selected product and the actual **Apply to line 19** action.

The [source correction](tools/portal-source-fix.css) is applied before capture,
using the product's tokens. It replaces the cropped table edge with a complete
neutral shell, removes the competing gray container directly behind the blue
selection, and gives each candidate its own separated, rounded 1px border.
The capture script groups the original row and its original decision panel;
text, product images, controls, selection and column layout are preserved.
The mobile panel's negative joining margin is removed so its heading has space.
All three shells (outer + two candidates) measure **1px on every side** in all
four EN/RU source captures. Each screenshot ends at the complete component edge.

**Owner follow-up, corner fix:** the initial export retained the source page's
white canvas outside the rounded shell. The final images were recaptured with
transparent ancestors and isolated shell visibility, using Chromium's transparent
background export. The shell's own background, native radius and 1px border
remain. All four outer corner pixels are alpha 0; all four border midpoints are
fully opaque. On Home, the corners reveal the actual blue-gray stage color rather
than a baked white rectangle. No border is painted over or clipped by a new mask.
The initial flawed Portal exports are preserved as browser screenshots under
[corner-fix-before](screenshots/corner-fix-before/); all AFTER evidence and gallery
comparisons were refreshed after this correction. Local preview on port 4422
serves the final built artifact.

This is a reproducible **capture-time source correction**, not painted pixels
or a claim that the product application itself was patched/released. No product
source files were edited. The recipe, raw PNGs and full captured text are in
[capture-sources.mjs](tools/capture-sources.mjs) and [manifest](sources/manifest.json).
Only Home selects the new entries; all existing case media entries remain.
The mobile cover now shows the full decision instead of stopping at the first
review card. EN/RU alt text was updated to match that content.

## Agent Ops · choose A

Both variants were rendered against the same V3.1 card, at the same UI scale,
in EN/RU at 1440, 1024 and 390px:

- **A: neutral stage.** Remove the external black canvas, preserve the actual
  dark financial/message panels and their native corners. The native header is
  legible in the existing neutral-stage text color. Both the native dimensions
  and 24 CSS px of external breathing room match the old source.
- **B: dark stage.** Keep the original native capture, its consistent 24px padding
  and product colors, with the existing 16px media radius on its outer container.
  It is much more deliberate than the original square slab.

**A is the implementation choice:** the two consequences remain high-contrast
objects, while a redundant enclosing dark rectangle disappears. It integrates
the decision with the existing editorial text without another nested container.
This directly follows the saved focused-action/neutral-stage direction. B remains
credible but carries more dark visual weight and another enclosing silhouette.
Readability and native scale are equal; no claim of increased font size is made.

Both variants retain **IF YOU APPROVE**, **$120**, recipient, no-cash/next-invoice
consequence, timing and the exact customer message. A is a fresh export from
`sp-agent-ops-source@030e5af7416ad52bd753271ad7147202b55cd41a`.
Only external canvas and header context change; dark panel styling/content stay
native. RU uses the existing documented capture translation completion.

[1440 A/B](comparisons/en-1440-variants.jpg) ·
[390 A/B](comparisons/en-390-variants.jpg) ·
[Portal before/after](comparisons/en-1440-portal.jpg) ·
[Agent before/after](comparisons/en-1440-agent.jpg).

## Portrait and V3.1 structure

Portrait width: **96 → 112px from 1024**, **64 → 80px at 768–1023**, **64px on
phones**. Same photo, crop behavior and About link. The larger portrait gives the
support rail more presence while remaining subordinate to the headline and work.
Existing DS spacing tokens compose the sizes; there are no new tokens.

At 1440 the taller portrait moves the first native scene down **21.33px**
(717.44 → 738.77). The $120 action remains visible in the first 900px viewport.
At 1024 its top is unchanged because the copy determines row height; at 768 it
moves down 16px. Phone first-fold geometry is unchanged in both locales.

Editorial Bridge, hero actions, proofFirst sequence, five-work order, typography,
motion and other sections remain. No Pawly or Vet source/media was edited.
Their complete Home-card DOM hashes match BEFORE in all ten tested profiles.
No case component or shared renderer API was changed.

## Saved premium direction

Compared the actual archived Garri images with the new covers:

| Saved visual | Applied comparison | Limit |
| --- | --- | --- |
| [gr-comp.jpg](../../research/portfolio-premium-v3-2026-11-01/references/thumbs/gr-comp.jpg) | [Portal pair](comparisons/reference-portal.jpg): clear native alternatives, consistent object boundaries and surrounding space; our two options and confirmation form one complete decision. | The reference is a multi-phone case spread; this is dense desktop procurement UI, so hardware framing is not copied. |
| [gr-swap1.jpg](../../research/portfolio-premium-v3-2026-11-01/references/thumbs/gr-swap1.jpg) | [Agent pair](comparisons/reference-agent.jpg): one focused action on a calm neutral field. Variant A reduces nested containers while keeping genuine evidence. | Agent has two consequences of one approval, rather than one sparse consumer screen. |

These are saved historical visual references, not new live-site captures.
Independent assessment of the premium result remains pending.

## Verification

- Production builds BEFORE and AFTER: **37 routes, successful**. Screenshots use
  the built artifact, not the development toolbar/server.
- `npm run check`: **0 errors, 0 warnings** (163 existing hints).
- `npm run check:css`: successful; **0 dead scoped rules**.
- `npm run check:content`: **0 findings**.
- `git diff --check`: successful.
- Real Chromium, DPR 1, reduced motion: `/` and `/ru/` at **1440×900,
  1024×900, 768×1024, 390×844, 360×800**. No overflow, failed resources,
  missing cover images or page errors. Four matched subjects per profile:
  first viewport, hero, Agent card, Portal card — **40 BEFORE/AFTER pairs**.
- EN/RU at 1440 and 390: full-motion rendering, keyboard focus and Enter into
  both cases, then Back; no page errors. EN/RU at 390 with JS disabled:
  both native cover pictures remain visible.
- Pawly/Vet complete-card DOM hashes unchanged in all ten profiles; source
  changes contain no Pawly/Vet renderer/media edits.
- [Protected-source evidence](logs/protected-evidence.json) compares the baseline
  Git blobs with **244** Pawly/Vet source/media files and unchanged shared
  renderers, alongside all ten BEFORE/AFTER card DOM hashes.
- All four Portal source captures assert both products and confirmation text,
  equal 1px border widths on every side, fully transparent corners and intact
  opaque border midpoints.

[Verification summary](logs/verification.json) · [before metrics](logs/before.json) ·
[after metrics](logs/after.json) · [raw source provenance](sources/manifest.json).
Full check output is retained under logs/.

Raw browser PNGs are unmodified. Labeled JPEG comparison sheets resize both
columns proportionally at equal scale; images have their natural height.
The focused checks above cover this pass; no whole-site visual acceptance or
new physical-device testing is claimed.

Remaining request: independent visual review of the matched gallery, especially
Agent A vs B and the modest portrait increase. No further implementation blocker.
