# Responsive spacing correction · 05.10.2026

Owner request: audit inner/outer spacing across the portfolio, repair mobile
width discrepancies shown in Learn, Vet and Pawly, check tablet, publish.

The Learn passport had a separate 320px cap. Vet and Pawly combined wrapper
caps with nativeWidth in shot data; these persisted after changing the wrapper.
CaseShot also rendered mobile phones at half width or several side by side.
Learn's 3:1 layout started at 768px, leaving its sidebar too narrow.

Shared frame-inset is 16px below 768, 24px above. Shared stage-inset is
16/24/48px at mobile/tablet/desktop. NativeWidth is retained for documentary
components but omitted from editorial covers. Mobile frames fill their column.
Learn uses narrow material/passport sources through 1023px, then a 3:2 layout.
Portal and Pawly switch to columns from 1024px. Page gutters and vertical flow
tokens remain the common source. Original screenshot UI is preserved.

Validation:

- Build: 36 pages. Astro check: zero errors/warnings. Scoped CSS: zero dead rules.
- Token source and mirror have identical SHA-256.
- Chromium geometry: 154 route/width combinations, zero failures/runtime errors.
  EN/RU Home, About, all five cases; 360, 390, 430, 600, 767, 768, 820, 1023,
  1024, 1280, 1440px. Checks include equal fields, mobile column edges, tablet
  sources, image height reservation, image/action alignment, page overflow.
- WebKit geometry: the same 14 routes at 390, 767, 768, 820 and 1024px;
  70 combinations, zero failures/runtime errors.
- Harmony: all 14 routes at 360, 390, 768, 820, 1024 and 1440px; zero violations.
- Reviewed actual Learn/Vet/Pawly screenshots at mobile/tablet/desktop.
- Live motion resize: five routes through 390→820→1440→1024→768→390,
  30 samples; no overflow, duplicate scenes or runtime errors. Zoom opens
  and closes with Escape. Evidence: tmp/responsive-spacing/resize.json.

Reproducible geometry check: scripts/verify-responsive-spacing.mjs.
Local evidence: tmp/responsive-spacing, tmp/spacing-{build,check,css,harmony}.log.
