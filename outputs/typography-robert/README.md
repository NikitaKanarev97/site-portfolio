# Typography and palette · Robert 01 · 2026-10-07

Browser font: Onest from `@fontsource-variable/onest` 5.3.1, copied Latin/Cyrillic variable WOFF2, weight axis 100–900. Local `OFL-Onest.txt` matches package LICENSE. Official source and license: https://onest.md/en ; package source: https://github.com/google/fonts . The Notion font list supplied with the task could not be read through web retrieval; Onest was already selected by the owner.

OG fonts: static instances of `Onest-wght.ttf` at 400, 500 and 800 in `scripts/og-fonts`, with the same OFL attribution. `audit-fonts.py` confirms cmap EN/RU, weights, no fvar in static instances, copied asset hashes, licenses and byte equality of DS tokens. Run `python outputs/typography-robert/audit-fonts.py` to regenerate `font-audit.json`.

Tomato colors: #D43220 default, #B52B1B hover, #842014 pressed on white/paper; #FF8A75 inverse. Portal scene: lavender #DDD5FF. See `contrast.json` for 20 numeric checks and `../../tasks/robert-review-2026-10-07/reports/01-result.md` for route verification.

OG routes now publish `-onest.png` aliases to avoid prior immutable/social caches. Three EN case cards retain the exact right half of prior accepted artwork; typography on the left is rerendered in Onest. Vet's prohibited status badge and its alt were removed under CONTENT-RULES.md. Prior static LinkedIn source PNGs are not modified; their editorial cleanup belongs to package 07. Every page references the new generated URL; old /og/<id>.png endpoints remain compatible. Personal location data is omitted from RU as before.

Run `node outputs/typography-robert/audit-assets.mjs` for contrast, PNG dimensions, page URLs and exact documentary-half pixel comparisons. It also produces a copy of the existing scoped-CSS checker with paths pointing only at this package's build. Preview: `python -m http.server 4401 --bind 127.0.0.1 --directory outputs/typography-robert/dist`. The isolated build avoids overwriting shared dist; the final integrated build/content check remains with the coordinator.
