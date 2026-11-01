# B2B Portal Source UI Fix V1.1 · portfolio parity

2 November 2026. Prepared for independent ChatGPT source-parity review.
No self-approval, merge into main, production deployment or Figma change.

Portfolio base: `d004daf2e63e16ec493bbfadab60b7005e3b17a8`.
Portfolio branch: `codex/b2b-portal-source-parity-v1.1-2026-11-02`.
The containing commit identifies this exact report, source registry and images.

## Product source delivery

Repository was identified from the local origin, not guessed:
`NikitaKanarev97/b2b-partner-portal`.
Fixed product SHA: **`36be1d80277c536b94424ac49aa5ff82662d8ee7`**, pushed to
`codex/b2b-portal-source-ui-v1.1-2026-11-02`.

- [Product report](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/36be1d80277c536b94424ac49aa5ff82662d8ee7/audit/source-ui-v11/REPORT.md)
- [Native capture recipe](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/36be1d80277c536b94424ac49aa5ff82662d8ee7/audit/source-ui-v11/tools/capture.mjs)
- [Actual React composition](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/36be1d80277c536b94424ac49aa5ff82662d8ee7/src/screens/resolution-center/ResolutionCenter.tsx)
- [Product QA](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/36be1d80277c536b94424ac49aa5ff82662d8ee7/audit/source-ui-v11/logs/browser-qa.json)

The independent [audit](https://github.com/NikitaKanarev97/site-portfolio/blob/c8fa2fa5b866d5e6076b29fcd59be66477689aa2/audit/home-cover-polish/INDEPENDENT-REVIEW.md)
accepts the Home visual direction and leaves one blocker: source parity.
This revision implements the previously capture-only source treatment in the
actual application, rather than requesting another Home/Agent/portrait review.

## Real application change

The real source row and DecisionPanel now share one production `resolution-item`
shell with a neutral 1px border and the existing 8px radius. CandidateComparison
uses independent rounded 1px option borders, 8px gaps and an unframed header.
The selected blue border no longer stacks against an enclosing gray frame.
The panel's thick blue left edge and negative mobile joining margin are removed.
At tablet/desktop the shell is inset 12px from the queue, preventing doubled
enclosing strokes. Focus remains the distinct existing 2px indicator.

Only three application files changed. Business state, routing, localization,
product data, source provenance, both products, selected state, specification
comparison, Apply/Cancel, Undo and retry behavior are preserved. Native captures
are made from the production build through real controls, in EN/RU, at 1280 and
390. No corrective stylesheet, DOM relocation, capture-only shell or translation
replacement is injected. Raw native PNGs and full context screenshots are here
under [product/](product/) and in the product repository.

## Minimal portfolio update

Changed only four `public/media/home-cover-polish/portal-*.webp` files and their
four `home-decision-*` registry entries. The source SHA, native dimensions and
provenance now point to the fixed application. The Home composition, Portal copy,
component renderer and case-page media entries stay unchanged. The Portal-only
source paragraph in the Home map now points to native provenance.

The desktop source shell is naturally **990px** wide, compared with the accepted
historical editorial export's **1014px**, because it is inset 12px from the real
queue on each side. Mobile stays **358px**. Both retain the same stroke/radius,
spacing roles, two options, ambiguous source line and buyer confirmation. The
Home stage keeps its accepted layout and the 41/48 fixture; the small native
ratio change follows the genuine source rather than restyling it for capture.

## Transparent corners: format conversion only

Raw browser PNGs remain unmodified and show the real application's background.
For WebP presentation, pixels outside the shell's measured native rounded
silhouette are made transparent. The radius is read from the application,
not chosen during export. There is no new frame, UI padding, recoloring,
layout change, text replacement or artificial interface assembly.

The importer verifies each raw SHA-256 against the product manifest. After
lossless WebP conversion it verifies **every fully opaque RGB pixel is equal to
the raw screenshot**, and that all four external corner pixels have alpha 0.
This preserves the source border and prevents the old white corner artifact.
The cutout is disclosed as presentation formatting; raw PNGs are the capture
evidence, and are not described as having been natively captured with alpha.

[Importer and assertions](tools/import-native-captures.mjs) ·
[Exact source and pixel provenance](product/manifest.json).

## Matched comparisons

[Open the comparison gallery](index.html).

- **10 Home BEFORE/AFTER pairs:** EN/RU at 1440, 1024, 768, 390, 360. BEFORE is
  the accepted Home at d004daf, rebuilt in this isolated worktree. AFTER uses the
  actual corrected product exports. Same Chromium/DPR 1/reduced-motion profile.
- **Four product BEFORE/AFTER pairs:** actual original application versus V1.1,
  with no capture-time correction. Same 1280/390 export viewport and DPR 2.
- **Four accepted-cover/source comparisons:** the historical accepted editorial
  source beside the actual fixed production component, equally scaled.
- Raw source BEFORE/AFTER and context PNGs are under product/; raw Home PNGs
  are under before/ and after/. JPEG sheets only label and proportionally resize
  original evidence. No new premium/reference direction is being proposed.

[EN desktop Home](comparisons/en-1440-home.jpg) ·
[RU phone Home](comparisons/ru-390-home.jpg) ·
[Product BEFORE/AFTER](comparisons/en-1280-before-after.jpg) ·
[Accepted versus native source](comparisons/en-1280-accepted-parity.jpg).

## Verification and unchanged scope

Product: typecheck and build PASS; **24** EN/RU browser profiles cover 360–1440,
both radio choices, default/hover/focus, disabled Apply, Space/arrow navigation,
Apply, Cancel/Escape, confirmation, immutable source, Undo/reload, full motion,
missing/changed/mixed/three-candidate rows, quantity errors and save-failure retry.
No final page errors, failed resources or document overflow. **268** other product
source files match baseline Git blobs. Full evidence is pushed in the product
repository and key summaries are mirrored under product/ here.

Portfolio: build PASS (37 routes); Astro check **0 errors, 0 warnings**, 163
existing hints; CSS check **0 dead rules**; content check **0 findings**. All ten
Portal Home profiles have no overflow, failed resources, missing images or page
errors. Registry comparison asserts exactly the four Home entries changed.
**857** other source/media files match d004daf Git blobs. Hero (including portrait),
Agent Ops, Pawly and Vet have identical DOM hashes in all ten BEFORE/AFTER profiles.
No other public page content, renderer, token or media was changed.

[Home scope proof](logs/verification.json) · [before](logs/before-home.json) ·
[after](logs/after-home.json) · [mirrored product QA](product/browser-qa.json) ·
[product source scope](product/scope-proof.json).

No whole-site visual re-acceptance, physical-device or additional browser-engine
testing is claimed. The remaining gate is ChatGPT's independent source-parity
verdict. Local previews are review artifacts, not production deployments.
