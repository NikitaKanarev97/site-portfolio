# Benchmark decisions

The target is readable, deliberate navigation. No new decorative motion was added.
The relevant benchmark is how quickly real work becomes usable, not animation count.

| Before | After | Why / evidence |
|---|---|---|
| A delayed bundle can reveal the fallback at ~2.1s, then hide it again when entrance starts at ~6.5s | Once `.js` fallback is released, the late bundle uses the existing settled/history branch | Actual BEFORE video and sampled transforms show this regression on Home, Agent and Learn. Benchmark reading stays continuous; the reader should not lose material already shown |
| Native dialogs make the background inert but Chromium Tab traversal reaches body between cycles | Both dialog types wrap Tab/Shift+Tab through actual visible controls | Recorded sequence `BUTTON → viewport → BODY`; shared behavior preserves keyboard orientation |
| Agent's captured canvas corners are square beside comparable rounded media | One 16 px radius-media boundary on the captured outer canvas | Shared surface role, no invented frame or modified UI pixels |
| Two tablet RU headings receive an unbreakable typographic chain | Existing Agent word-boundary technique shared with those headings | No smaller type, arbitrary font change or copy rewrite |
| Native vertical scroll, normal Astro links, stable case reading, quiet short feedback | Preserved | Malugin, Repponen and Dounar support restraint. HA is useful as a limit, not a scroll-controller model |

## Lenis evaluation

**Decision: do not install.** No Lenis skill is installed and no Lenis A/B was run;
this report does not claim a demonstrated Lenis improvement or regression. Existing
native scroll was tested with the site's actual sticky guide, anchors, history,
dialogs, viewport changes and reduced-motion lifecycle. Current Agent V3 uses CSS
sticky plus ScrollTrigger state, without artificial pin distance.

Adding Lenis would require a second lifecycle, GSAP ticker synchronization,
anchor/history ownership, dialog/nested-scroll exceptions and mobile/reduced
verification. There is no measured user-facing failure here that it solves.
The primary [Lenis README](https://github.com/darkroomengineering/lenis) documents
the GSAP integration and anchor/nested-scroll considerations. Native scroll remains.

## Timing retained

CSS hover 160ms / entrance curve, press 120ms; state 120ms;
text reveal 600ms; editorial lines 640ms with 40ms steps;
media reveal 700ms; real image entrance 1s with 24px rise;
body navigation 300ms; shared case snapshot 1s. Tokens and their mirrors unchanged.
These durations are the existing system, not claimed measurements of competitors.

Normal-motion `motion-before/` and `motion-after/` videos cover Home, Agent and Learn,
entry, scrolling, reverse reading, zoom and preference changes. `late-*` videos use
the same 1440×900 normal-motion viewport and 3200ms delay on each built JS request.
Sample logs verify exposure and any subsequent hiding. No timeline is forced to its
end for evidence. Reduced-motion visual pairs are separately labelled in the matrix.
