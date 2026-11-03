# Release checklist · candidate `e434919b60687f781eeb25d8f79ee995e42891b9`

Every row was run on 3 Nov 2026 against this exact SHA (fresh `npm ci`, fresh build,
`astro preview` on 127.0.0.1:4471 with served HTML byte-matched to `dist/`). Exit codes:
[logs/exit-codes.txt](logs/exit-codes.txt) (invalid attempts are kept and labelled).
Harness = the V1/V1.1 scripts, unchanged. Browsers: Chromium 153.0.8010.12, WebKit 26.5.

## Baseline commands

| Command | Exit | Result | Log |
|---|---:|---|---|
| `npm ci` | 0 | lockfile install; sharp install script not in `allowScripts` (prebuilt binary used) | [npm-ci](logs/npm-ci.log) |
| `npm run check` (`astro check`) | 0 | 0 errors, 0 warnings, 163 hints (162 files) | [check](logs/check.log) |
| `npm run build` | 0 | 37 pages + 146 prototype HTML files | [build](logs/build.log) |
| `npm run check:content` | 0 | 0 findings | [content](logs/content.log) |
| `npm run check:css` | 0 | 0 dead scoped rules on all routes | [css](logs/css.log) |
| `npm run check:harmony` | 0 | no violations | [harmony](logs/harmony.log) |
| `npm audit` | 1 | 15 advisories, triaged | [SECURITY-TRIAGE](SECURITY-TRIAGE.md) |
| `node audit/portfolio-release-v1/seo-dist.mjs` | 1 | **0 problems on 14 public routes**; flags 142 pre-existing prototype pages without noindex (BACKLOG SEO1) | [seo-dist.json](logs/seo-dist.json) |

## Browser suites

| Suite | Scope | Result |
|---|---|---|
| Responsive matrix, Chromium | 14 routes × 1440/1280/1024/768/390/360/320 (98 cells): overflow, heading overflow, broken images, unnamed controls, console/HTTP errors, surfaces | 80/80 non-capture cells pass in the first pass; 18 cells at 1440/390 aborted at the screenshot step (missing output folder, harness issue); re-run of 1440/390 **28/28 PASS**. Net: **98/98** |
| Responsive matrix, WebKit | 14 routes × 1440/390/320 | **42/42** |
| Short height / 200% reflow | 14 routes at 1440×600 and 720×450 DPR2 | included in supplemental **218/218** |
| Interactions, Chromium | every visible MediaZoom source (246 × source/keyboard/restore), anchors, details, Next Case keeps locale, Back, mobile menu (open/contain/close/return), copy success + denied fallback, ProjectDialog trap/return, Home history restoration, locale navigation, no-JS, blocked JS | **1018/1018**, 0 exceptions |
| Browser smoke | menu, zoom trap, project dialog, next links, preference changes, runtime; Chromium includes axe on open menu/dialog | Chromium **138/138**; WebKit 127/128 then **128/128 ×2** (W1) |
| Transitions (V1.1) | EN/RU × 1440/390/360: Home→Agent, Home→Portal, full Pawly→Agent→Portal→Learn→Vet→Pawly cycle; computed group/old/new backgrounds per rAF, native durations, body opacity | Chromium **316/316**; WebKit 315/316 then **316/316 ×2** (W2) |
| States (V1.1) | direct entry, rest/hover/focus/pressed of Agent/Portal Next Case, keyboard arrival, history back/forward readability + surface + scroll, interrupted navigation, reduced motion, no-JS, unsupported View Transitions, delayed bundle, project dialog | Chromium **290/290**, WebKit **290/290** |
| Supplemental | 169 internal URLs, 404 status, CV PDF downloads, rapid/interrupted navigation, preference change during navigation, background tab return, 28 axe scans | **218/218**, axe **0 violations** in 28 scans |
| Touch | real emulated taps at 360/390 EN/RU: menu, copy, dialog, case entry, zoom/close, 48 px targets | **32/32** |
| Delayed bundle | Home, Agent, Learn with bundle held: fallback readable, no re-hiding after late JS | **0 regressions** on 3 routes |
| Lighthouse | Home EN/RU mobile ×3, desktop ×1 | see [PERFORMANCE](PERFORMANCE.md) |
| CDP performance | Home/Agent/Learn/Pawly, 4× CPU, 1.6 Mbps | see [PERFORMANCE](PERFORMANCE.md) |

Not run: `lifecycle.mjs` (needs a dev server with debug hooks; motion code unchanged
since V1.1 measured it, and transitions/states cover lifecycle behaviour in production
build) · Firefox (not installed) · physical devices · screen readers.

## Routes, SEO, assets

| Item | Result |
|---|---|
| 14 public EN/RU routes | 200, correct `<html lang>`, self-canonical on `https://kanarev.com`, `hreflang` en/ru/x-default, title, description, OG (title/description/image/url/locale/type), `twitter:card`; OG images exist in `dist/og/` |
| Dedicated renderers | each case route renders its own root (`agent-/portal-/learn-/vet-/pawly-case`), no `CaseStory` markup |
| `sitemap.xml` | exactly the 14 public URLs |
| `robots.txt` | allows all, disallows `/kit` and `/preview/`, canonical Sitemap line |
| noindex | `/404`, `/500`, `/ru/404/`, `/kit/`, all 19 `/preview/*` pages |
| Internal links / src / srcset | 0 broken across all 183 HTML files |
| 404 | local preview and live domain return HTTP 404 with the branded page |
| 500 | `dist/500.html` built, noindex; static hosting never emits it in normal operation |
| CV | `cv.pdf`, `cv-ru.pdf`: valid PDF 1.4, 1 page each, same email/LinkedIn, no status labels, byte-identical to production |
| Contacts | `nikita.kanarev.dev@outlook.com` and `linkedin.com/in/nikita-kanarev/` on every route; matches owner-confirmed contacts |
| External destinations | 21/22 → HTTP 200 (Webflow demos, case prototypes EN/RU); LinkedIn 999 to automation → **owner manual check requested** |
| Live domain today | `http→https`, `www→apex` 308; robots, sitemap, CVs 200; serves `main` |

## Motion regression (V1.1 focus)

| Requirement | Evidence | Result |
|---|---|---|
| Agent navigation light neutral surface | computed `rgb(247, 247, 245)` = `#F7F7F5` on source, destination, group, old, new | Pass, both engines |
| Portal navigation light blue-grey | `rgb(237, 242, 248)` = `#EDF2F8` | Pass, both engines |
| No obsolete dark/yellow backdrop | sampled per rAF over all 42 transitions per engine and run | Pass |
| Contrast / focus | light-tone CaseNext label/arrow/focus assertions in states suite | Pass |
| Duration / easing intact | native group 1 s; `motion.js` unchanged since `main`; tokens additive only | Pass |
| History scrolling Chromium + WebKit | Home history restoration (interactions) and history back/forward (states) | Pass |
| Interruption | interrupted back/forward/final in states suite | Pass, no hidden/duplicated content |
| Flashes / blank frames / double animation | late-bundle 0 regressions; body opacity 1 throughout native transitions | Pass (bounded observation; see V1.1 method limits) |

No product files were changed in this release pass, so no new UI screenshots were
produced. Visual evidence remains the immutable V1/V1.1 captures in
`audit/portfolio-final-quality-2026-11-03/` at this same application source.
