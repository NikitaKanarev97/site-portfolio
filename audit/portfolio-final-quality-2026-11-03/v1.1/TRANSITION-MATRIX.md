# Transition matrix · V1.1

Real production build at localhost:4415. Normal motion; expected group/old/new Agent #F7F7F5 and Portal #EDF2F8. Accepted Learn navy, Vet sage and Pawly sand navigation treatments remain unchanged; Learn hero is neutral and Pawly hero white.

| Engine | Locale / width | Paths captured | Assertions | Recording |
|---|---|---|---|---|
| chromium | en-1440 | Home→Agent, Home→Portal; Pawly→Agent→Portal→Learn→Vet→Pawly | 54/54 | [video](after/chromium/en-1440/browser.webm) |
| chromium | en-390 | Home→Agent, Home→Portal; Pawly→Agent→Portal→Learn→Vet→Pawly | 52/52 | [video](after/chromium/en-390/browser.webm) |
| chromium | en-360 | Home→Agent, Home→Portal; Pawly→Agent→Portal→Learn→Vet→Pawly | 52/52 | [video](after/chromium/en-360/browser.webm) |
| chromium | ru-1440 | Home→Agent, Home→Portal; Pawly→Agent→Portal→Learn→Vet→Pawly | 54/54 | [video](after/chromium/ru-1440/browser.webm) |
| chromium | ru-390 | Home→Agent, Home→Portal; Pawly→Agent→Portal→Learn→Vet→Pawly | 52/52 | [video](after/chromium/ru-390/browser.webm) |
| chromium | ru-360 | Home→Agent, Home→Portal; Pawly→Agent→Portal→Learn→Vet→Pawly | 52/52 | [video](after/chromium/ru-360/browser.webm) |
| webkit | en-1440 | Home→Agent, Home→Portal; Pawly→Agent→Portal→Learn→Vet→Pawly | 54/54 | [video](after/webkit/en-1440/browser.webm) |
| webkit | en-390 | Home→Agent, Home→Portal; Pawly→Agent→Portal→Learn→Vet→Pawly | 52/52 | [video](after/webkit/en-390/browser.webm) |
| webkit | en-360 | Home→Agent, Home→Portal; Pawly→Agent→Portal→Learn→Vet→Pawly | 52/52 | [video](after/webkit/en-360/browser.webm) |
| webkit | ru-1440 | Home→Agent, Home→Portal; Pawly→Agent→Portal→Learn→Vet→Pawly | 54/54 | [video](after/webkit/ru-1440/browser.webm) |
| webkit | ru-390 | Home→Agent, Home→Portal; Pawly→Agent→Portal→Learn→Vet→Pawly | 52/52 | [video](after/webkit/ru-390/browser.webm) |
| webkit | ru-360 | Home→Agent, Home→Portal; Pawly→Agent→Portal→Learn→Vet→Pawly | 52/52 | [video](after/webkit/ru-360/browser.webm) |

Every path includes source and 0/100/300/600/1000 ms requested captures. Actual acquisition windows, per-rAF computed pseudo-element colors, native duration and page opacity are in each engine’s results.json. [Browse all frames and matched before/after pairs](index.html).

The screenshot windows are real and unaltered. WebKit can lag substantially. This is an evidence timing limitation, not hidden by renaming frames. Continuous normal-motion recordings and per-rAF computed values supplement those captures.

| Engine | Requested offset | Actual acquisition starts (ms) | Actual acquisition ends (ms) |
|---|---|---|---|
| chromium | 0 | 11–26 | 46–154 |
| chromium | 100 | 101–245 | 128–332 |
| chromium | 300 | 301–416 | 328–498 |
| chromium | 600 | 600–622 | 642–740 |
| chromium | 1000 | 1000–1017 | 1041–1156 |
| webkit | 0 | 58–260 | 114–387 |
| webkit | 100 | 148–497 | 200–650 |
| webkit | 300 | 302–779 | 355–958 |
| webkit | 600 | 602–1100 | 654–1234 |
| webkit | 1000 | 1003–1360 | 1055–1547 |
