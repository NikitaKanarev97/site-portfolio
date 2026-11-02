# Learn Home cover V1 · 02.11.2026 · review pending

Scope: existing LearnHome only. Keep FeaturedCase heading, outcome, facts and CTA.
Composition A: existing ScreenSurface + linked picture and CaseScreen, reference → separate
programme continuation. Local copy in src/copy/learn-home.ts. No new DS entity.
Existing navy surface-cover-learn, text-on-inverse, surface-default; typography
heading-3xl/body-base/meta-sm; stage-inset, flow-node/text/pair, radius-media.
Desktop from bp-xl: 2:1 columns, full native reference plus capped programme
action. Phones: whole answer-detail mobile header then programme action. Tablet
bp-md to bp-lg: the same two mobile fragments side by side at readable widths.
Up to bp-xl the reference uses the whole mobile header; from bp-md the two
mobile fragments sit side by side. The local picture uses bp-xl from the DS
instead of extending the shared CaseScreen API. This avoids ~7px copy at 1024
and a 1253px stacked tablet card. Native image aspect ratios reserve the layout.
Native alpha details rest on surface-default so text retains its source contrast.
No overlapping frames, fake product controls, invented completion or new motion.
CaseScreen links enter the case, not the pictured product action. Global CTA
and focus remain; inverse focus hook belongs to the navy stage. No-JS static.
Alternative B: one existing task-led Home capture, same concise local story.
Actual A/B evidence and final selection: audit/trassir-learn-home-cover-v1/v1/.
Shared DS files and the case-page LearnShot/copy/media remain untouched.

## V1.1 · 02.11.2026 · independent acceptance pending

Keep the approved composition A from bp-md upwards. At 1440 both localized
cover screenshots are pixel-identical to reviewed V1 (eeda0dd). Below bp-md,
remove the repeated internal promise, use one body-base sentence about the shared
guide and independent progress, and set the two journey captions in body-base.
The copy-to-screens gap uses flow-pair; the reference-to-programme gap retains
flow-text. Both original reference pictures and all desktop copy stay unchanged.

Programme srcNarrow uses a Home-only, lossless rectangular crop of the accepted
path-progress image: x48/y48/w636/h408 source pixels, in both locales. It removes
the outer capture field and reading-history note, retaining the complete progress
count, current-step title and Continue. No painted/rearranged source pixels.
CaseScreen's existing md picture API selects it; all complete source images and
case-page manifest entries remain intact. The programme is about 15% larger at
the same mobile image width. Native proportions, 16px editorial labels, the case
links, 48px footer CTA, focus tone and no-JS/reduced-motion behavior are preserved.
Evidence and measured card heights: audit/trassir-learn-home-cover-v1/v1.1/REPORT.md.
