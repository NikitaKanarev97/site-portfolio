# CODEX TASK — TRASSIR Learn Portfolio Premium V3

Repository: https://github.com/NikitaKanarev97/site-portfolio
Read-only product source: https://github.com/NikitaKanarev97/learn
Research branch: `research/trassir-learn-portfolio-premium-v3-2026-11-02`
Research pack authored on top of portfolio main `561e6830392b6e9a25e61e30cafe394586df3ff4`; at execution, verify research branch HEAD and branch from that latest commit (not an older intermediate SHA).
Product source main SHA at research: `e9ac4b075c4c5251dc10891ad201ecbf5405b727`
Target implementation branch: `codex/trassir-learn-portfolio-premium-v3-2026-11-02` created FROM research branch HEAD.
Routes: `/work/learn`, `/ru/work/learn`.

## Mission
Execute a significant **third iteration of the TRASSIR Learn portfolio case**, not a superficial polish pass. Match the independently accepted Agent Ops Premium V3 in visual craftsmanship, design authorship, proof quality and recruiter scan speed; **do not copy its finance/console story or black-carbon design**. B2B case V3 is under separate parallel development. Restrict all implementation to the Learn portfolio case and scoped supporting copy/media. GitHub branches may move during the task; preserve isolation. **No changes to Learn application source**, no merge, production deploy, Figma changes or acceptance on your own authority.

## Mandatory research before design
Open and read, not just filenames:
- `audit/trassir-learn-portfolio-premium-v3/RESEARCH.md`
- `audit/trassir-learn-portfolio-premium-v3/REFERENCE-MAP.md`
- `audit/trassir-learn-portfolio-premium-v3/STORYBOARD.md`
- V2.3 audit `audit/trassir-learn-case-v2/REPORT.md` and `refresh-2026-10-31/MEDIA-REVIEW.md`
- actual current renderer `src/components/learn/{LearnCase,LearnShot}.astro`, `src/copy/cases/learn-v2.ts`, `src/copy/ru/cases/learn-v2.ts`, `src/data/learn-v2-media.json` and `src/data/diagrams/learn/content-model.ts`
- `CONTENT-RULES.md`, `CLAUDE.md`, `AGENTS.md`, site design-system tokens, motion and shared navigation rules
- read-only product `learn/PROJECT-CONTEXT.md`, `learn/CLAUDE.md`, `learn/ia/sitemap.md`, `learn/src/App.tsx`, relevant Home, Material, Trajectory, Player, My Learning and Result code and data rules.

**Visually OPEN actual image pixels**, not merely descriptions, for all section references R1–R7 and current V2 BEFORE B1–B9 from `REFERENCE-MAP.md`. These are committed actual captures from Garri Tonakanyan, Kudinov/Yandex Praktikum, HA Interactive and Ilya Dounar plus genuine Learn browser captures. Existing repo asset paths are the prepared screenshot pack. Do not spend resources re-searching Mobbin or creating unrelated LMS inspiration. If some image cannot open, record what could not be verified and use the remaining opened sources.

First capture fresh BEFORE, both EN/RU at 1440x900 and 390x844; preserve *identical* viewport, UI language, data and capture method for AFTER. Current V2.3 captures in the pack are also valid visual diagnosis references; don't mislabel a historical capture as a fresh BEFORE. Write the section benchmark and evidence plan **before** modifying the page.

## Product truth
This is a later 2026 rework of a real assignment the portfolio author did while working at DSSL / TRASSIR; the shown current screens are not the version shipped by that company. The designer owns the current UX framing, IA, UI system and interactive prototype work. Do not invent an exclusive role on the original employer team, launch, accreditation, impact metrics, interviews or customer validation. Keep public work framed confidently and accurately per `CONTENT-RULES.md`, without a degrading "concept/pet/only prototype" label. Product demo has local/session data, not a backend. Training document is not an official DSSL qualification.

Two user jobs: immediate technical reference versus structured preparation. One source material can be used independently and referenced by a programme; **reading history and explicit programme-unit completion are distinct data models**. Opening an article does not complete a unit or pass an assessment. Assessment outcomes are saved attempts; a failed attempt keeps review/source/retry rules, pass enables an associated document. Preserve true example states: 11-unit programme, 9 read/3 of 11 completed vs 3 read/no completion; failed 14/20 vs pass threshold 16/20 and actual retry conditions, successful 20/20. These are fixtures, **not** business performance.

Critical V2 nuance: the ONVIF Reference image and archive-retention Player image show **different** resources. Do NOT narrate them as screenshots of the same resource. Either source real identical context data or present them honestly as separate examples and use the grounded content model to illustrate reuse.

## Composition brief (use STORYBOARD as content map)
0. **Hero:** Strong short authorial statement "One knowledge system. Two ways to learn." Scope/origin/role immediately visible, editorial typography. One complete legible native task-led Home capture dominant; one smaller native ONVIF answer proof. Avoid generic decorative collages. On mobile surface genuine product/author promise before burying it below prose.
1. **Problem:** Original course-first catalogue vs two real jobs (ONVIF diagnosis or installation readiness). Strong Garri-style argument; explicitly label authentic archival Russian source rather than implying a controlled A/B experiment.
2. **System decision:** Put existing verified content model VISIBLY on page, no collapsed-by-default details. HA-inspired branching structure: task/question or programme → material → reading record, or explicit completion → separate assessment. Clearly name the rules and personal rationale. Adapt to mobile sequential diagram without horizontal overflow.
3. **Two UX paths:** Technical answer's version/date and diagnostic outline; programme's stated workload, 11 ordered units, current step and explicit "Complete and continue" action. Shift the visual scale and composition between them; no repeated tiny full-screen rectangles.
4. **Honest progress:** One large real learner panel showing reading 9 and completion 3/11; one smaller legible reader no-programme state showing 3 read and no false credit. Use actual captures, not invented counters/components.
5. **Assessment and recovery:** Fail is an opportunity to return to practice and linked sources, not a dead-end. Show an actual 14/20 fail and one complete wrong-answer review; 20/20 pass as independently labelled alternate state. Prominent same 16/20 threshold and truthful retry logic. Don't turn outcomes into a fake time-lapse of a single attempt.
6. **Outcome and authorship:** Explain research framing → design decision → browser-check evidence, what was implemented, tradeoff (explicit completion / separate records), limits (no measured learner outcome) in a crisp editorial end. Working locale-correct demo/landing links and existing CaseNext.

Choose the final number of chapters and strongest image count based on actual readable evidence. A case should scan in under a minute by headings and art direction, with optional deeper inspection. Aim for **materially stronger visual rhythm than V2**: editorial thesis, meaningful diagram, wide source panel, focal action, true contrasting states, evidence-based close. Reuse existing native EN/RU media first; any new crop must be real, complete at semantic edges and logged with exact route/locale/source SHA. Screenshots must not be repainted, retranslated, deformed, or clipped. Keep screen frames coherent, typically native 16px radius/equal fields as already verified. Avoid one design treatment repeated on every block, empty "luxury whitespace", gimmicky stickers/badges and AI-template gradients.

## Motion and implementation
Only use site conventions and reduced-motion friendly subtle reveals. At most one purposeful staged/scroll-synced architectural reading sequence where it clearly adds meaning. All content must remain accessible and understandable with JS disabled and prefers-reduced-motion. Avoid fake interactive controls in case screenshots, scrolljacking or hidden text. On mobile preserve order and legibility, not stacked desktop screenshots at microscopic scale. Maintain native EN/RU alt, labels, meta, canonical routes, anchor links and zoom/keyboard behavior.

Do not edit Agent Ops or B2B case code, shared tokens/components, home case entries, product app or unrelated pending work unless a Learn-scoped technical necessity is documented and regression-tested. Separate worktree only, clean branch, no mutation of owner's checkout.

## Independent-review evidence and QA (mandatory)
Write under `audit/trassir-learn-portfolio-premium-v3/`:
- `BENCHMARK.md`: real R/B image seen, before issue, new design decision, visual AFTER, justified differences *for every major section*.
- `ASSET-PROVENANCE.md`: source repo/SHA, capture state/locale, screenshot path, crop boundaries/notes; editorial diagrams marked as newly prepared from source data.
- `REPORT.md`: every changed path, design decisions, known limitations, exact tests and direct clickable links to proof.
- `before/` and `after/`: matched actual-browser viewport AND full-page screenshots of EN/RU 1440x900 and 390x844; main section closeups, at least the hero and high-value architecture/progress/results. Additional 360/320 and 768/1024 to verify reflow.
- `comparisons/`: per-section side-by-side actual R reference vs AFTER, plus BEFORE vs AFTER same view, no hand-adjusted UI pixels.
- `logs/`: tool/check results and browser smoke assertion summary.

Run `npm run check`, `npm run check:content`, `npm run check:css`, `npm run build` (plus relevant existing site checks; document if commands differ). Browser verify locale switch, internal/external links, keyboard tab/focus, Enter/Escape zoom, mobile text contrast and touch regions, responsive images/source selection, anchors, no horizontal overflow, no missing assets/console errors, reduced motion/no-JS static content and unaffected neighboring cases. Validate source-screenshot accuracy and no prohibited public status copy on rendered HTML and published images. Re-check other projects' routes/rendering; do not imply full pixel parity unless measured.

**Push implementation + evidence commits on the Codex branch only**. Give SHA, branch, 1440/390 EN/RU review image links, BENCHMARK/REPORT links, changed files and exact known gaps. Never mark your own implementation ACCEPTED or Mobbin/SCRN-equivalent; leave final independent visual verdict to ChatGPT and the portfolio owner. No main merge, no deploy, no Figma modifications.
