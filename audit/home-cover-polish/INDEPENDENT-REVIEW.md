# Independent art-direction review · Home Cover Polish

**Date:** 2026-11-01  
**Reviewed SHA:** `d004daf2e63e16ec493bbfadab60b7005e3b17a8` on `codex/home-cover-polish-2026-11-01`  
**Delivery verdict:** **REVISION REQUIRED — one source-of-truth parity blocker**.  
**Visual verdict for current Homepage composition:** **APPROVED**. Do not restart homepage redesign or modify accepted Agent Ops and portrait.

## Evidence actually viewed

- [Portal EN1440 BEFORE/AFTER](comparisons/en-1440-portal.jpg), [Portal EN390](comparisons/en-390-portal.jpg), [Portal RU1440](comparisons/ru-1440-portal.jpg), [Portal RU390](comparisons/ru-390-portal.jpg).
- [Agent A vs B EN1440](comparisons/en-1440-variants.jpg), [Agent A vs B EN390](comparisons/en-390-variants.jpg); accepted source values and resulting images confirmed in [sources/manifest.json](sources/manifest.json).
- [Hero EN1440](comparisons/en-1440-hero.jpg), [EN1024](comparisons/en-1024-hero.jpg), [EN390](comparisons/en-390-hero.jpg), [RU768](comparisons/ru-768-hero.jpg), [EN1440 first viewport](comparisons/en-1440-first.jpg).
- Actual [REPORT](REPORT.md), [capture source script](tools/capture-sources.mjs), [capture CSS](tools/portal-source-fix.css), [source changes](logs/source-diff.patch), [verification](logs/verification.json), [protected file list](logs/protected-evidence.json). Verified the 2026-11-01 GitHub commit, not local Windows-only file links.

## Visual decisions

### 1 · Agent Ops — ACCEPT chosen A

Variant A is visibly stronger and calmer at 1440 and 390. Neutral editorial outer stage, dark native consequence panels, no redundant third dark enclosure. The paired credit and customer-message still explain the real human checkpoint, and the native header plus $120 remain intact and legible. B has rounded corners but is more massive and adds nesting without UX benefit. **Do not ask for further B experiments or a new design pass.**

### 2 · B2B Portal — VISUALLY ACCEPTED, source parity pending

The previously cut-off 1px blue edge and grey border conflict no longer appear in the opened EN/RU desktop shots. Source row, ambiguous status, two actual candidate items and 'Apply to line 19' read as one composed decision. Mobile replaces the weaker truncated workspace intro with a complete, scannable two-candidate choice and action. Corner transparency makes the real stage color visible. EN/RU translation and key actions are consistent.

**Important blocker:** This is a capture-time corrected composition, not an unchanged actual application screenshot. The script injects `tools/portal-source-fix.css`, creates `.home-decision-capture`, and moves the existing `.resolution-row` plus `#decision-panel-19` together for export. It changes grey/blue borders and candidate layout. The case's source application was *not updated*, as explicitly stated in REPORT. The user explicitly wanted these broken source-app lines fixed too. Despite the real content, the cover currently visualizes an editorially corrected state that may not exist in the actual runnable product.

**Required for closing this task:** Make the same border/radius/spacing/component-shell treatment in the actual B2B source project (local source identified in [capture-sources.mjs](tools/capture-sources.mjs): `D:/Claude-projects/b2b-dssl`; exact current remote repo must be identified by the implementer, not guessed), preserving all business logic and the existing match/compare/confirm behavior. Take genuine browser captures from the updated application *without* injecting corrective `portal-source-fix.css` or artificially joining DOM nodes solely for the screenshot. If an editorial crop is still used, disclose the crop and ensure visual fidelity of the UI components and state. Update the Home media from the source-accepted artifact and preserve EN/RU, desktop/mobile and transparent corners. Present the before/after of the product UI itself. Do not claim the product is patched until this evidence exists. Work in an isolated product source branch, no merge/deploy/Figma without owner's authorization. Minimal targeted change, not B2B redesign.

### 3 · Portrait — ACCEPT

At 1440/1024 the 112px image balances the huge H1 without becoming hero content; 80px tablet feels more present; 64px phone remains unchanged. The image crop, About link and identity hierarchy remain intact. Source screenshot indicates Agent first fold shifts down 21.33px at desktop; actual consequence still visible, so not a blocker. No further portrait changes.

### 4 · Regressions — submitted evidence adequate for this pass

Scoped browser captures: 40 EN/RU matched pairs across 1440/1024/768/390/360 first viewport, hero and two cards. Reported passes in Astro/build/CSS/content checks and browser no-overflow/resource errors; evidence inspected, not independently rerun. `logs/protected-evidence.json` records 244 unchanged Pawly/Vet and shared media/renderers, all ten protected-card DOM hashes matching. Case pages and media outside the target are unmodified. Physical devices and full cross-browser acceptance are not newly verified.

## Reference verdict

Actual saved Garri comparison images reviewed in the report, and the earlier archived Dounar/HA set provide the art-direction context. Agent variant A is a calmer, intentional focused consequence; Portal is a clear human-decision state without fake impact claims. The B2B source correction issue is **product honesty**, not a reason to seek more visual ornamentation. No claims of exact parity with all live reference websites.

## Exit gate (only one)

**Source B2B app matches the corrected decision cover** in real running UI, without capture-time CSS/DOM mutation, at 1280 and 390 EN/RU. Push product correction and corresponding updated portfolio capture in isolated branches and provide real screenshots, source SHA and passing smoke checks. Independently check only source parity, not the already approved Agent/portrait.

No merge into main, production deploy, Figma modifications, or automatic acceptance of product case pages. The site cover work can be treated as **visually accepted but not release-ready until source parity is established**.
