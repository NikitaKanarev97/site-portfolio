# Independent acceptance — B2B Portal source UI / portfolio parity V1.1

**Review date:** 2026-11-02  
**Verdict:** **ACCEPTED** for the precisely scoped source-UI correction and the matching Home cover.  
**B2B application:** [`36be1d80277c536b94424ac49aa5ff82662d8ee7`](https://github.com/NikitaKanarev97/b2b-partner-portal/commit/36be1d80277c536b94424ac49aa5ff82662d8ee7), `codex/b2b-portal-source-ui-v1.1-2026-11-02`.  
**Portfolio:** [`04ae0753342bfcd9289f5628d9ed814b2911a6df`](https://github.com/NikitaKanarev97/site-portfolio/commit/04ae0753342bfcd9289f5628d9ed814b2911a6df), `codex/b2b-portal-source-parity-v1.1-2026-11-02`.  
**Previously blocked review:** [home-cover-polish independent verdict](../../home-cover-polish/INDEPENDENT-REVIEW.md) — source-code parity only.

## Actual screenshot evidence examined

B2B native real application, **without capture-time CSS or DOM relocation**:
- [EN desktop before/after](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/36be1d80277c536b94424ac49aa5ff82662d8ee7/audit/source-ui-v11/comparisons/en-1280-before-after.jpg)
- [EN phone before/after](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/36be1d80277c536b94424ac49aa5ff82662d8ee7/audit/source-ui-v11/comparisons/en-390-before-after.jpg)
- [EN desktop accepted cover vs native source](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/36be1d80277c536b94424ac49aa5ff82662d8ee7/audit/source-ui-v11/comparisons/en-1280-accepted-parity.jpg)
- [EN phone accepted cover vs native source](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/36be1d80277c536b94424ac49aa5ff82662d8ee7/audit/source-ui-v11/comparisons/en-390-accepted-parity.jpg)
- [RU desktop accepted cover vs native source](https://github.com/NikitaKanarev97/b2b-partner-portal/blob/36be1d80277c536b94424ac49aa5ff82662d8ee7/audit/source-ui-v11/comparisons/ru-1280-accepted-parity.jpg)

Site Homepage media comparison:
- [EN 1440 Home](../comparisons/en-1440-home.jpg)
- [EN 390 Home](../comparisons/en-390-home.jpg)
- [RU 390 Home](../comparisons/ru-390-home.jpg)

## Independent findings

### 1. Source screenshot fidelity — PASS

In `src/screens/resolution-center/ResolutionCenter.tsx`, the real React list now renders a `div.resolution-item` for each source line and moves the existing row/panel under the same native shell. The expanded state is controlled by the existing `open === line.row && !line.resolved` rule. It is production UI, **not** a wrapper introduced by the screenshot tool.

`ResolutionCenter.css` has a single 1px neutral outer shell, native 8px radius, clipping, and one divider under the source row. The 2px/blue panel accent and negative mobile joining margin were removed. `CandidateComparison.css` independently frames the two options with 1px borders and 8px gap; blue selected border/fill belongs exclusively to the selected option; keyboard focus is a separate 2px focus ring.

Actual screenshot inspection: the prior cut-off blue edge, double gray/blue framing, partial table borders and stacked candidate outlines are fixed in both desktop and mobile. Parent/child alignment, spacing, selected radio, variant name and Apply action are coherent.

### 2. Accepted cover vs app — PASS

Opened actual 1280/390 source/native parity contact sheets. The original accepted edited capture and genuine application now show the same source row, ambiguity context, two catalog candidates, selected state and Apply/Cancel. Small desktop shell-width difference (1014px historical export vs 990px native, due 12px queue inset on each side) is truthful, deliberate, not a significant visual regression. Mobile remains 358px.

Portfolio's revised `partner-portal-v2-media.json` points to precisely the four source-native EN/RU 1280/390 image files. The raw PNGs/manifest preserve exact source SHA. `tools/import-native-captures.mjs` applies **only an alpha silhouette outside the measured existing 8px source radius** after SHA validation and lossless WebP conversion. It asserts all fully opaque RGB pixels match the original. This is disclosure of an asset-presentation treatment, NOT fake redesign of app UI or a capture-time CSS fix.

The Home EN/RU 1440/390 before/after comparison remains visually equivalent. The corrected stage appearance is clean at normal layout scale. Number `41 / 48` is demonstrably fixture progress state, not measured business impact.

### 3. Behavior / responsive checks — PASS on supplied reproducible evidence

The product `audit/source-ui-v11/tools/capture.mjs` only seeds a fixed documented fixture and clock, performs actual row-toggle and radio clicks, and screenshots native layout. No `addStyleTag`, node move, DOM text replacement or temporary style injection. Browser QA evidence covers 24 EN/RU profiles: 360,390,768,1024,1280,1440 + keyboard focus, both radios, initially disabled Apply, Apply, Cancel/Escape, Undo, reload, invalid quantity, error/retry and abnormal row states. No new overflow or failed resources in recorded runs. Code changes target exactly three application files; no matching data, state, store, route or translation changes.

Portfolio code/source regression proof: only four Portal Home images and four registry entries differ, with documentation/audit files. Report records 857 other source/media files unchanged and protected Hero/Agent/Pawly/Vet DOM identical across ten screenshot profiles. Reported build, typecheck, content and scoped CSS checks passed. Reviewer inspected code, logs and screenshots but **did not independently execute the local browser tests or physical-device/WebKit/Firefox runs**. Existing legacy packaging/bundle warning not introduced here.

### 4. Visual benchmark — PASS for this task, no new full-site audit

The new native composition is consistent with the accepted editorial B2B case-preview direction and its reference pack: one genuine source ambiguity, clear comparison alternatives and a responsible user decision. No need for decorative addition or re-opening accepted Agent/portrait/Pawly/Vet work. This review assesses **source parity**, not an unverified claim that the entire site or the entire B2B application exceeds every Garri/HA/Dounar reference.

## Final decision

**CLOSE THE BLOCKER: ACCEPTED.** The earlier Home Cover Polish visual approval is now source-faithful and can be considered accepted for that scope. No corrective V1.2 prompt is needed.

**Separate product/release limitations:** No production deploy, merge into `main`, Figma changes or acceptance of other B2B product screens. The owner authorizes those independently. The screenshot sequence shows the intended choice workflow; full exhaustive cross-product QA and physical-device confirmation remain outside this ticket.
