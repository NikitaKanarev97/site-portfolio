# Pawly freeze — source, DOM, style and real browser evidence

Pawly remains fifth/last. No Pawly-specific source, story, media mapping, public
asset, text, caption, alt, CTA, route, crop, renderer or image was edited.
The common hero five-name index was removed as explicitly required by Option A;
the Pawly card and its order in the real work list remain intact.

`FeaturedCase`'s new editorial variant is explicitly limited to indices 0–3.
Pawly receives the default false value and the original typography/spacing.
`WorkStage.astro`, `VetStage.astro`, `case-art.ts`, featured-work data and case stories
are unchanged. Home preview selectors do not match Pawly.

## Evidence

- Eight exact matching viewports/locales, with real unmodified page captures in
  `screenshots/{before,after}/{en,ru}-{1440,1024,390,360}-work-pawly.png`.
- [DOM and selected sources](logs/before-capture.json) / [AFTER](logs/after-capture.json):
  same entire specialized card DOM ignoring only compiler scope attributes;
  unchanged title, text, alt, route and links. Fifth position is checked from the
  actual five-item list, not inferred from a source filename.
- [Computed-style comparison](logs/pawly-computed-styles.json): **8/8 equal**,
  across every card descendant for 19 geometry/typography/color/crop properties.
  The exact card dimensions are equal. [Image source hashes](logs/home-image-sources.json)
  and an empty public-media diff establish unchanged file bytes.
- Real clicks through the Pawly case route pass in both languages at 1440/390/360.
  Its individual case document also passes the ten-route content comparison.

## Honest pixel result

Raw whole-card PNG comparisons are **not byte/pixel-identical**. Changed upstream
page heights place the same card on a different fractional document Y coordinate;
rounding and resampling affect raster pixels. The raw images are retained without
masks, replacement art or synthetic cropping. Raw diff PNGs are saved at
`screenshots/after/*-pawly-diff.png`; [measurements](logs/pawly-and-fold.json)
record this non-identity rather than claiming a false zero.

A separate diagnostic registers the card's outer Y to the nearest CSS pixel using
a temporary margin of less than 0.5px **in the capture browser only**. It does not
change source code or overwrite the raw page screenshots. See
[alignment protocol/data](logs/pawly-alignment.json) and
[the exact tool](tools/aligned-pawly.mjs).

After registration three pairs are exactly identical (EN/RU 1024 and RU 390).
The remaining five pairs have mean absolute channel differences below **0.0048 on
the 0–255 scale**. This is supporting raster-position evidence, not a claim that
the normal raw screenshots have no differences. Full DOM/style/media parity is
the primary freeze proof; independent visual review of the raw images remains open.

Case-page content parity excludes style tags because Astro emits Home preview CSS
through existing WorkStage imports, even on cases. All ten EN/RU case documents
have identical remaining HTML; no individual case layout/content was redesigned.
