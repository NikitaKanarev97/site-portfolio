# Agent Ops Console — Home Cover Premium V1

Implementation for independent review · 02.11.2026 · **acceptance pending**.

- Branch: `codex/agent-ops-home-cover-v1-2026-11-02`.
- Exact integration base: `7991238ac3cad8865eaa24200024cfa764da387c`.
- Implementation commit: `f4a28265c8d370cff83fa533aebdcfdd6a7f6938`.
- Isolated worktree: `D:/Claude-projects/sp-agent-home-premium-v1`.
- Research: `8541f5a7c2de979481a585a64ff54b9f2aee56f3`; its RESEARCH.md is preserved at [../references/RESEARCH.md](../references/RESEARCH.md).
- [Evidence gallery](index.html) · [Benchmark](BENCHMARK.md) · [Browser verification](logs/verification.json).

## Base and protected work

The base retains V3.1 hero (`43eb0b2`), Home polish (`d004daf`), native B2B source parity (`04ae075`, subsequently accepted at `317e3b7`), and the latest Vet cover/caption spacing (`24e0a22`, `7991238`). The Vet branch carried the relevant cover integration beyond main. Main `49d2fb0` includes later embedded Learn updates; these were outside this cover branch and were not imported or overwritten. No existing worktree was reset, stashed or edited.

The baseline browser shots in `before/` are from this exact base, not from an assumed production URL. Compared with the four V3.1 shots linked in RESEARCH.md, structure and image-first mobile ordering match; the later `d004daf` uses the accepted transparent/neutral-header consequences export instead of V3.1's solid dark outer canvas. These are materially different BEFORE images. The supplied V3.1 captures remain in `audit/portfolio-home-v3/stage-01/v3.1/screenshots/after/`.

## Result

Selected **B — consequences-first, refined**. The cover now names the actual decision: a $120 late-delivery credit beyond the agent's limit, checked by a person before confirmation. The label discloses synthetic data. Mobile reads title → specific context → native mobile consequences → existing evidence and case CTA. The repeated general outcome below the image is hidden locally on phones. Desktop keeps the existing title/outcome rail and 2:5 editorial/product split.

The original accepted `approval-consequences-desktop/mobile` assets replace the older neutral-header Home exports. Their source pixels, invoice-credit meaning and message preview are unchanged. No new raster asset or fabricated UI was needed. The full image is displayed proportionally, with the existing 16px radius masking only its outer canvas corners at every width. The owner's follow-up about lost desktop rounding is included in the final captures.

On mobile, removing the outer stage padding increases the screenshot's width by 32px. Source UI retains its own internal padding. Copy remains outside the dark product scene; it does not impersonate a product control or approved state. All three existing case-entry links are retained.

Changed runtime files: `AgentHome.astro` and only the `home` object in each EN/RU Agent case copy file. AgentShot, media manifest, case page, shared FeaturedCase, hero, other covers, global tokens and product repository are unchanged. Local DS documentation records the composition and supersedes the earlier Agent-only image-first rule.

## Why B won

Both candidates were rendered in the actual Home card at 1440 and 390, in EN and RU, using the same short decision narrative. A uses the full contiguous accepted task. B uses the full contiguous accepted consequences state. Raw captures are in [comparisons/candidates/](comparisons/candidates/); the JPEGs are labeled comparison boards, not retouched screenshots.

| Locale / width | A: full task | B: focused consequences | Decision |
| --- | ---: | ---: | --- |
| EN 1440 | 950px | 549px | A explains policy/action best; B preserves the compact cover rhythm. |
| RU 1440 | 980px | 569px | Same semantic advantage and height cost for A. |
| EN 390 | 1443px | 886px | A needs about 557px more scrolling before the case CTA. |
| RU 390 | 1501px | 914px | A pushes consequences and confirmation far below the initial decision. |

[EN desktop A/B](comparisons/en-1440-A-B.jpg) · [RU desktop A/B](comparisons/ru-1440-A-B.jpg) · [EN mobile A/B](comparisons/en-390-A-B.jpg) · [RU mobile A/B](comparisons/ru-390-A-B.jpg).

A's larger composition did not make its dense UI more legible: its rendered image width remained the same as B. Cropping A enough to match B's height would omit policy, consequences or confirmation; stitching them together would misrepresent a real state. B preserves both complete consequence cards and uses editorial context to explain the human boundary. This is a justified smaller improvement, with an explicit loss of on-image policy evidence.

The final B polish differs from the lightweight comparison: synthetic-data label, actual stage fields, full mobile width and rounded outer image. Final dimensions below come from the final browser captures, not the A/B study.

## Matched final evidence

Chromium `151.0.7922.34`, DPR 1, identical viewport pairs, real built files served locally, fonts ready, all non-dialog images decoded. The browser scrolls through the full page before returning to the top, so off-screen reveal observers have run and adjacent cover images are actually visible. Raw PNGs are unretouched. JPEG boards only resize, label and juxtapose originals.

| Locale / width | BEFORE height | AFTER height | Image width before → after |
| --- | ---: | ---: | ---: |
| EN 1440 | 549px | 565px | 806 → 806px |
| EN 1024 | 727px | 724px | 806 → 806px |
| EN 768 | 701px | 691px | 640 → 624px |
| EN 390 | 991px | 869px | 310 → 342px |
| EN 360 | 945px | 849px | 280 → 312px |
| RU 1440 | 569px | 585px | 806 → 806px |
| RU 1024 | 770px | 766px | 806 → 806px |
| RU 768 | 769px | 732px | 640 → 624px |
| RU 390 | 1019px | 926px | 310 → 342px |
| RU 360 | 996px | 877px | 280 → 312px |

- [EN 1440 before/after](comparisons/en-1440-before-after.jpg), [RU 1440](comparisons/ru-1440-before-after.jpg).
- [EN 390 before/after](comparisons/en-390-before-after.jpg), [RU 390](comparisons/ru-390-before-after.jpg).
- [EN 360 before/after](comparisons/en-360-before-after.jpg), [RU 360](comparisons/ru-360-before-after.jpg).
- [Desktop source fidelity](comparisons/en-1440-source.jpg), [mobile source fidelity](comparisons/ru-390-source.jpg).
- [Desktop benchmarks](comparisons/desktop-benchmarks.jpg), [mobile benchmarks](comparisons/mobile-benchmarks.jpg).
- Raw cover, stage, contextual viewport and first viewport: `before/{locale}-{width}-*.png` and `after/{locale}-{width}-*.png` for all ten states.
- Full Home including adjacent covers: [EN BEFORE 1440](before/en-1440-full.png), [EN AFTER 1440](after/en-1440-full.png), [EN BEFORE 390](before/en-390-full.png), [EN AFTER 390](after/en-390-full.png), [RU BEFORE 1440](before/ru-1440-full.png), [RU AFTER 1440](after/ru-1440-full.png), [RU BEFORE 390](before/ru-390-full.png), [RU AFTER 390](after/ru-390-full.png).

The light B2B native choice surface and Vet clinical-record surface retain their different shapes, palettes and scale. Agent stays dark, restrained and analytical. Changed card height naturally shifts following sections; their markup and own geometry are not redesigned.

## Verification

| Check | Outcome / evidence |
| --- | --- |
| `npm run check` | 0 errors, 0 warnings; 163 existing hints. [Full log](logs/check.log). |
| `npm run build` | PASS, 37 routes. [Final build](logs/after-build.log). |
| `npm run check:css` | PASS after the final radius correction; no dead scoped rules. [Log](logs/check-css.log). |
| `npm run check:content` | 0 findings, including built HTML. [Log](logs/check-content.log). |
| EN/RU 1440/1024/768/390/360 | 10/10: zero horizontal overflow, page errors, failed HTTP requests or broken non-dialog images. [Capture data](logs/after.json). |
| Protected Home content | Hero and all four other cover DOM SHA256 values equal BEFORE in all ten states. [Verification](logs/verification.json). |
| Keyboard | Title → scene → CTA via actual Tab presses, visible focus, Enter opens localized case, Back restores Home. EN/RU × 1440/360 × reduce/full motion = 8 flows. Focus PNGs are in `after/`. |
| Reduced motion | No hover transform in reduce; all content visible. Standard-motion mode also tested. |
| No JavaScript | EN/RU × 1440/360: context, image and native case link remain visible; zero overflow. |
| Source integrity | No changes under `public/`, AgentShot, media manifest or product repository. Only the Home copy fields changed in case modules. |
| Whitespace | `git diff --check` PASS. |

The initial interaction harness tried to hover through the existing stretched CTA and timed out. It was corrected to hover the article, which is the actual interactive surface; the final eight flows pass. This was a harness targeting issue, not a product fix. Type/content checks preceded the CSS-only radius correction; build, CSS and browser captures/interaction verification were repeated after it.

An initial full-page recording left some off-screen reveal images invisible even after decoding. Those captures were replaced by real scrolled-page captures, using the exact base in the owned `.tmp/agent-home-before` worktree on port 4406 and the implementation on 4404. Final capture parity was checked again for all ten states. No product CSS or screenshot pixels were edited to force visibility.

Reproduce from this worktree: `npm ci`; `npm run build`; serve `dist` on port 4404 with `node audit/portfolio-home-v3/stage-01/v3.1/tools/serve.mjs dist 4404`; then run `node audit/agent-ops-home-cover-v1/v1/tools/capture.mjs after`, `verify.mjs` and `gallery.mjs` from the same tools directory path. Playwright is reused from `D:/Claude-projects/b2b-dssl`; set `PLAYWRIGHT_REPO` to another installed Playwright repository when needed. The exact BEFORE is retained; to recapture it, build the documented base in a separate checkout.

## Reference access and limitations

All P0 images and both exact SCRN screens were visually inspected. The exact Langfuse PNG was inspected. The old LangSmith image URL now redirects to a 404. The original article has migrated to [LangChain](https://www.langchain.com/blog/debugging-deep-agents-with-langsmith); its Trace View image link points to the same filename on the current CDN. That image was downloaded and visually inspected, with its resolved URL and SHA256 saved in [reference-provenance.json](logs/reference-provenance.json). It is not represented as a successful fetch from the dead URL.

This is local Chromium verification, not a production deployment or a cross-browser Safari/Firefox audit. No real user five-second test was conducted. The smaller secondary text inside the image is still preview-scale UI, particularly on 360px; the editorial explanation and alt text provide the essential meaning at normal text size. The full source task and exact policy are available on the case page. No financial result, live monitoring or completed approval is claimed.

## Answer for the independent reviewer

**Does this cover genuinely achieve the visual quality of the selected premium applications and accepted product screens? Partially, with a specific remaining gap.**

It matches the accepted product's Soft Carbon material and restrained consequence hierarchy because the UI is the actual accepted source. It improves on the baseline's mobile narrative order, width and duplicated wording. It offers a more explicit portfolio introduction than an unexplained full application screenshot.

It does **not** equal the complete contextual evidence of Approval Task or LangSmith Trace View: policy and the actual human action are absent from the selected image. B explains that boundary editorially. The dense mobile image also falls short of consumer references' native-size secondary text. No overall visual superiority or independent acceptance is claimed. This is the recommended B implementation for ChatGPT's independent ACCEPTED / ACCEPTED WITH BACKLOG / REVISION REQUIRED decision.

Push only this separate branch. No merge, deployment, Figma edit or next-cover work is included.
