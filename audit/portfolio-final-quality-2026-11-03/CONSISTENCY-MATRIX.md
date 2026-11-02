# Surface contract and exceptions

One surface role determines its shape; the five product UIs keep their native identity.
Existing semantic tokens remain unchanged. Radius-media / radius-lg = 16 px;
radius-md = 8 px. No sampled color fill, image repainting or additional UI frame.

| Component / surface | Radius | Padding | Border | Background | Overflow / clipping | Exceptions |
|---|---|---|---|---|---|---|
| FeaturedCase project scene | 16 | Owned by each accepted scene, stage-inset | None added | Existing theme-specific scene | Scene boundary only | Natural scene heights; distinct five compositions |
| CasePlate outer media plate | 16 | 16 / 48 from md / 64 from lg | None | surface-plate, dark only for dark product | Full content; no crop | Not a screenshot mask |
| CaseScreen edge / ScreenSurface | 16 | 0 | Existing 1px decorative outline | Transparent | Single boundary at actual capture | native=true uses original alpha contour without mask |
| CaseScreen frame | 16 | frame-inset 16 / 24 | 1px default | surface-default | Outer plate plus explicit screenshot boundary | Annotations need their accepted frame fields |
| AgentShot screenshot canvas | **16 after correction** | 0 added; captured native fields retained | None added | Original pixels | One clip on image link, surrounding canvas only | Full-source zoom remains native; internal panels unchanged |
| PortalShot full frame | 8 | 0 | 1px default | surface-default | Full-window border/mask | Source's own full-window contour; not a general media plate |
| PortalShot native | Original square/alpha | Native source fields | No added line | Transparent | Visible/native | Row/panel source boundaries remain square intentionally |
| PortalShot detail/panel | 8 outer | 16 | No additional line | portal-native or white | Existing component contract | Native DeltaRow fields preserved |
| LearnShot canvas | 16 via CaseScreen | Source canvas only | Existing edge outline | Captured source | One outside boundary | Home/Reference/Player/Programme keep source breathing room |
| LearnShot frame | 16 | frame-inset | Existing 1px | White | Shared CaseScreen | Archive and isolated details retain explicit fields |
| VetShot native | Original | Original | Original | Original | No added mask | Genuine product/device silhouette |
| VetShot cover | 16 | Accepted 24px below prescription | None added | White | Accepted cover-only boundary | Latest c53eb04 explicitly supersedes old no-mask cover rule |
| PawlyShot outer plate | 16 from md, natural below | V2.1.2 plate-x/y | None | surface-plate or source canvas | Content height; full screen | Independent top-aligned Choosing/Return plates; paired scenes retain equal plates |
| PawlyShot actual screen surface | 8 | Manifest's measured top/bottom/inline fields | Original | Manifest/source surface | Accepted screen boundary | **No normalization of accepted internal breathing room** |
| MediaFrame wide Webflow | 8 mobile / 16 from md | Existing | Existing | surface-media placeholder | Accepted preview crop | Documentary natural/device frames preserve native contour |
| MediaZoom panel | 16 | Header 12×16 / 24 inline from md | Header divider only | surface-default | Dialog panel boundary | Viewport scrolls complete image |
| MediaZoom image | 16 by ScreenSurface, native when requested | Viewport 16 / 24 | No new border | Original source | Native shots preserve original full contour | No source pixel change |

## Shared interaction and typography rules

TextLink remains the accepted f0a8731 treatment: stable SVG marker with final word,
48px targets where specified, global focus ring and semantic hover/pressed colors.
FeaturedCase keeps its existing -4px scene lift on fine-pointer hover, never reduced
motion. Copy success/failure feedback retains aria-live and selectable email fallback.

MediaZoom and ProjectDialog now wrap keyboard traversal with the same helper,
including scrollable image content. Escape/close and native focus return remain.

EditorialHeadingText shares the accepted Agent word-boundary treatment. It is also
applied to the two measured overflow locations: Learn completion rule at RU 768,
Vet clinical thesis at RU 1024. No font-size, global typographer or copy change.

Measured BEFORE/AFTER values and all actual computed surfaces are in
`logs/*-chromium-matrix.json`; specific matched sections are in `comparisons/`.
