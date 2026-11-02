# Vet cover — prescription spacing and rounded contour

Owner correction, 2 November 2026. Base: `565a04598b4c7aba695f864f6cca5c903f3afcef`.

The requested image is the Visit Record cover on the Vet case, not the author's portrait on Home. No Home source was changed.

- `VetShot appearance=cover` restores a continuous 16px outer radius and clips the exposed square source corners.
- A 24px white presentation field below the image separates the complete Prescription card from the lower frame edge. This is layout around the original capture; the image pixels, dimensions, clinical content and source files remain unchanged.
- Only the case cover opts in. Other Vet shots, Home previews and shared TextLink retain their existing treatment. Captions remain outside the rounded boundary; full-source zoom is unchanged.
- The DS catalog and V3 screen map record the owner's exception to the previous native-edge treatment.

Verified in Chromium at 1440, 390 and 320px, EN/RU: six matched [before](before/) / [after](after/) captures. Measured radius 16px, new bottom field 24px, unchanged image dimensions/source/alt, no overflow or console errors. Keyboard focus, image zoom and Escape work in all six cases. See each directory's `metrics.json` and [logs](logs/).

`npm run check`: 0 errors, 0 warnings. `npm run check:css` and production build pass. Public media and all copy remain unchanged.

Preview: [Vet case RU](http://localhost:5391/ru/work/vet-clinic/). Visual acceptance remains with the owner/independent review.
