# Common requests · D

Frozen base 58002c3; schema/renderer/motion owned by G. No shared files edited.

## D-G-01 · group labels are not rendered · non-blocking adaptation

Repro: origin http://127.0.0.1:4366, `/preview/vet-clinic-rebuild/en/`, #role-boundaries, 1440/390 reduce. Graph nodes vet-zone/admin-zone/owner-zone each have type group and localized label. DiagramCanvas.astro renders only their rects (lines 133–135), then excludes groups from the text loop (line 188). Expected: a label above/inside each role zone, preserving mobile geometry. Source contract permits label on DiagramNode but does not promise group headings, so this is an extension request, not a runtime regression.

D uses existing task labels inside the zones — “Vet · open Marsik”, “Reception · invoice”, “Owner · snapshot” — to keep roles visible without a second notation/renderer. No fake header nodes added. Group heading data already supplied; G can add one reusable group-label presentation if desired. Required handoff meaning is readable now; separate frame headings remain an optional integration improvement. Screens: shots/{en,ru}-{1440,390}-role-boundaries.png.
