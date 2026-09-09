# Case presentation acceptance · 2026-09-09

Local implementation and review at `http://127.0.0.1:4322/`. Production publication was not performed.

- Three full case cards in EN and RU, followed by two compact cases in native details/summary. Opening does not navigate to another page.
- Mouse, Enter and Space toggle the list. Closed case links are not visible to keyboard navigation. Back from Pawly restores the open list and the previous scroll position. State also survives a language change within the same tab.
- Case hero images use different compositions from the home cards. All ten case routes have a full-size image trigger. The existing MediaZoom opens the right source; Escape closes it and restores focus to the trigger.
- Visual review: desktop 1440 px; home EN at 360 px; RU disclosure and Pawly at 390 px; Agent Ops, Partner Portal, Learn and Vet hero images at 360 px. No horizontal document overflow in the inspected layouts; no broken artwork images. Screenshots are saved beside this file.
- Build: 17 pages. Astro check: 0 errors, 0 warnings, 101 hints. Scoped CSS check: 0 dead rules on its existing route set. Static acceptance: 158 image references resolve, both DS mirrors match, and both home pages contain exactly 3 featured cards and 2 additional case links.
- Native no-JS disclosure and reduced-motion fallbacks were reviewed in the code; these were not separately emulated in the browser. The disclosure has no height animation and the new hover effects use existing motion tokens.

The 101 hints come from the existing project check output, including the bundled prototype scripts. Only the result tail is retained to avoid adding the large minified source output to the repository.
