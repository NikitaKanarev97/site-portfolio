# Agent Ops Console — portfolio case V2 · Codex handoff

**Task:** Redesign the Agent Ops Console presentation in `NikitaKanarev97/site-portfolio` using the accepted product screens, following the editorial quality of Partner Portal V2.1. This is a portfolio case and homepage cover update, **not** another redesign of the Agent Ops application.

**Reference portfolio state:** `redesign/b2b-portfolio-case-v2` at `48d00e721524ce0648a952d21f80b5d6c332670d`. Inspect `audit/b2b-case-v21/README.md`, the actual AFTER captures and `src/components/portal/PortalCase.astro`, `src/copy/cases/partner-portal-v2.ts`, `src/copy/ru/cases/partner-portal-v2.ts` before implementing. This B2B version is a design reference, NOT an explicitly approved or merged release.

**Source product:** `NikitaKanarev97/Agent-ops-console`. Approved visual scope: Review Queue, Run Detail, Action Approvals V1.1, Autonomy V1.1, Quality Dashboard V1.2, Policy Editor V1, Policy Version Diff V1.1. These are the seven showcase screens, not seven new screens to design. Product is a client-accepted, user-tested prototype on synthetic data; there are no evidenced post-launch results.

**Authority rule:** do not trust the public Agent Ops deployment or the product `main` as the newest accepted visual. Approved versions may live on different branches/worktrees; build an explicit per-screen provenance map with source commit, route/state, EN/RU screenshot, and viewport. Never invent a merged product commit or silently replace missing accepted screens with old ones. If no accessible approved worktree/source exists for a screen, record the missing dependency rather than pretending it was captured.

## 1. Product narrative and art direction

Audience: international B2B SaaS hiring managers, design leads and recruiters. Aim for a 3–5 minute scannable story, with a clear second layer for detailed inspection. Follow the existing site's typographic system, grid, semantic colors, responsive behavior and motion. Preserve the global look of `site-portfolio`, and do NOT change the newly designed B2B card/case or other projects.

Core thesis: **An AI support agent can resolve conversations, but consequential decisions require traceable human oversight — and autonomy should be earned on evidence.**

On the homepage: a differentiated Agent Ops card in the same editorial family as B2B V2.1. Prefer an actual Action Approvals / Consequence Preview scene: the decision boundary, amount/policy and what the customer will read, with a modest editorial context line. The B2B case already uses a bright procurement-row comparison. Agent Ops should read as a very different dark, operational product. Use real screen imagery, not arbitrary generated dashboard imagery. No floating stacks of three unreadable miniature screenshots, giant dark rectangles or fake UI recreated in CSS.

On the case hero: one dominant *complete* accepted working screen, preferably Action Approvals, and at most one secondary native detail, if it remains legible. Keep the complete approval action context visible. The hero should establish: AI supervision, human checkpoint, and what is at stake. On mobile use a genuine 390px state with its own composition, not an illegibly scaled desktop screenshot or a pile of screenshots.

Visual language: white / very pale cool-gray editorial canvas; dark Soft Carbon product captures; restrained coral/red only for actual risk, teal only where it exists in product evidence; no oversized yellow or green decorative section. Product UI screenshots must have neutral framing, intact corners, meaningful negative space, and no fabricated pixels. Avoid persistent pin effects unless they demonstrably improve reading; respect reduced motion.

## 2. Proposed IA / sections

Hero (not counted as a numbered section): `Agent Ops Console` and one-sentence proposition, real approval screenshot, succinct role/year/status/prototype facts and explicit NDA/synthetic-data note.

**01 · Problem — Success metrics missed expensive promises.** The client operated B2B subscription billing for around 40,000 customers. An AI agent resolved 61% of contacts; CSAT was 4.4. Fourteen outdated-promotion refund promises later cost $23,000. Display these as *client-provided historical context*, not results caused by the project. Do not claim deployed ROI. Short text + carefully labelled evidence/metrics, no big stock diagram.

**02 · Operating model — Review commitments, not every conversation.** Show a simple, truthful editorial flow: AI conversations → detect high-consequence promises → group common causes / rank exposure → human review → corrected policy → quality evidence → autonomy boundaries. Approximately 1,770 automated conversations/day vs ~71 consequential commitments/day was a **designer's estimate**, not measured user impact. Optional use of this comparison only with an explicit `Estimate` qualifier. Keep the model digestible at mobile width.

**03 · Detect and investigate — Review Queue + Run Detail.** Two linked product moments. Queue prioritizes financial exposure and aggregates repeated-cause clusters; Run Detail brings message, trace/evidence, and verdict together. Show one dominant complete queue screenshot and a related actual run screen or complete meaningful native panel. Caption describes what each screen proves. Use a single trace-consistent fixture if available, but do not alter fixture numbers to fake continuity. Include the key design decision: a repeated cause should be fixed once, not reviewed 14 times.

**04 · Human checkpoint — Action Approvals.** Hero-level second anchor. Actual approved screen should show request, policy, billing/history, time/priority, consequences, and approve/reject affordance, with the customer-visible message near the financial action. Show a complete real native panel; include the rejected/with-reason state only if it improves clarity, not as an extra gallery. State the cost: human intervention reduces the automation rate at the boundary of real financial consequences.

**05 · Fix the source — Policy Editor + Policy Version Diff.** Put the pair together as a coherent lifecycle rather than two unrelated screenshot blocks. The Policy Editor shows the origin of a change, its scope/limits, authority and approval chain. The Version Diff explicitly distinguishes approved, applied and confirmed by the agent; a mismatch must not appear as success. Real screenshot source: Policy Editor V1 and Diff V1.1. Keep the approved-vs-live semantic states intact and avoid claiming an unconfirmed policy is active.

**06 · Earn autonomy — Quality Dashboard + Autonomy Ladder.** Quality measures the operating signals, drill-down and coverage; autonomy is granted by capability according to evidence and safeguards. Show one genuine quality dashboard, then the autonomy ladder with ready/locked/downgraded states. A severity-1 defect automatically lowers the relevant level. Do not suggest that higher automation is itself the north-star metric; credible safety and reversibility are essential.

**07 · Outcome — Tested, reworked, accepted.** Client accepted a user-tested prototype. State the author's real scope: sole product designer, research, IA, product UX/UI, design system, interactive React/Storybook prototype and testing (verify exact wording against project files). Distinguish accepted prototype from the client's independent implementation. Include a compact trade-off, one genuine testing/design change, NDA/synthetic-data disclosure, and product link with version freshness checked. No post-launch growth, CSAT lift, savings or conversion numbers. If public prototype is outdated relative to captured screens, say 'Public prototype — earlier version' in EN/RU, or provide an authorised matching demo once available. Do not change product deployment as part of this task.

## 3. Capture/provenance plan — actual screens only

Generate optimized local portfolio media under `public/media/rebuild/agent-ops/v2/{en,ru}/`. Keep full-resolution originals / manifests in a deterministic non-public capture directory; do not commit redundant huge screenshot audits. Suggested shot keys:

- `review-queue-desktop`, `review-queue-mobile`
- `run-detail-desktop`, `run-detail-mobile`
- `action-approvals-desktop`, `action-approvals-mobile`
- `policy-editor-desktop`, `policy-editor-mobile`
- `policy-version-diff-desktop`, `policy-version-diff-mobile`
- `quality-dashboard-desktop`, `quality-dashboard-mobile`
- `autonomy-desktop`, `autonomy-mobile`

That is 7 product screen types × 2 locales × 2 viewport variants = 28 source states. The homepage and case hero MUST reuse compositions made from these real screen images, not introduce another invented state. If a complete mobile state is exceptionally tall, extract an actual meaningful DOM panel from the genuine 390px screen (preserve all meaningful controls/labels) and document its bounds. Cropping away evidence or stitching incompatible states is forbidden.

**Verified GitHub sources for accepted snapshots:**

- Action Approvals: branch `review/action-approvals-v1` at `b391a07ddbd18b638ab9b07c6f251232a9f3cf42`; example `audit/action-approvals/v1/screenshots/after/02_selected-waiting_1440x900_viewport.png` and `.../04_consequence_390x844_viewport.png`. Check whether the exact V1.1 approved code differs from this V1 audit before final captures.
- Autonomy V1.1: branch `review/autonomy-v1` at `8bb61ba1649501ffc7b82be4837addbe29ea2fba`; `audit/autonomy/v1.1/screenshots/after/01_ladder_1440x900_viewport.png`, also 390px and `04_auto-downgrade_*` row crops.
- Quality Dashboard V1.2: `impl/quality-dashboard-v1.2` at `00641af7706c0f941e5ee58f4da8ee9bf9bb94d6`. Capture its actual UI; prior `audit/quality-dashboard/v1.1` evidence is not by itself proof of V1.2.
- Policy Editor V1: `redesign/policy-editor-v1` at `6399f6a4a586783f4eb20df7a9d93cb6076b06ed`; `audit/policy-editor/v1/screenshots/after/desktop-1440-en.png`, `mobile-390-en.png`, and RU equivalents.
- Policy Version Diff V1.1: `redesign/policy-version-diff-v1` at `030e5af7416ad52bd753271ad7147202b55cd41a`; `audit/policy-version-diff/v1.1/desktop-1440-en.png`, `mobile-390-en.png`, `mobile-390-ru.png`.
- Review Queue and Run Detail: accepted as showcase screens in project review history, but an exact current source SHA and complete accepted screenshot set were NOT verified in this handoff. Inspect local worktrees and review records; verify visually before capturing. Do not use `artifacts/screen-smoke/review-queue.png` or old portfolio media by default as if they were the final design.

Capture deterministically with Playwright/Chromium at desktop 1440×900 and mobile 390×844 (device scale appropriate; use native responsive view, never CSS scaled desktop), EN and RU with matching seeded demo state and time. Hide cursors, dev overlays and transient loading; ensure fonts/images fully ready. Record shot key, source repo SHA, route, role, fixture, locale, viewport, capture date, DOM/crop bounds and image dimensions. Preserve real contrast and status color; optimize with sharp/WebP and check visual legibility.

Existing site assets in `public/media/case-agent-ops{,-ru}` and `public/media/rebuild/agent-ops/{en,ru}` may be useful historical inventory, NOT definitive approved captures. Review and replace intentionally. Keep other case media untouched.

## 4. Content, copy and editorial system

Use short English as the primary editorial master and idiomatic Russian as a full parallel version. Do not machine-translate labels without checking native UI screens. Each section: overline, assertive meaningful thesis, 1 compact paragraph (generally 45–85 words) and 1–2 captions that explain the decision. The entire case should remain comfortably scannable rather than reverting to the current ~2,600-word Agent Ops case file. Prioritize what hiring managers need: problem, reasoning, decisions, trade-offs and evidence.

Suggested EN:
- Hero: `Agent Ops Console` / `Human oversight for AI decisions with real consequences.`
- 01: `The agent resolved conversations. It also made promises nobody could see.`
- 02: `Review the commitments, not every message.`
- 03: `Find the costly pattern. Verify the individual decision.`
- 04: `No financial consequence executes without the right human decision.`
- 05: `Correct the rule — and verify which version the agent actually runs.`
- 06: `Autonomy is earned per capability, and withdrawn when evidence fails.`
- 07: `A tested, client-accepted prototype — not an invented business lift.`

Suggested RU:
- Hero: `Agent Ops Console` / `Контроль решений ИИ, у которых есть реальные последствия.`
- 01: `Агент закрывал обращения — и незаметно давал финансовые обещания.`
- 02: `Проверять обязательства, а не каждое сообщение.`
- 03: `Найти повторяющуюся причину. Проверить конкретное решение.`
- 04: `Финансовое действие ждёт ответственного человека.`
- 05: `Исправить правило и убедиться, что агент работает на нужной версии.`
- 06: `Автономность повышается по доказательствам и снижается при сбое.`
- 07: `Прототип проверен с пользователями и принят заказчиком.`

These are starting lines, not immutable canonical copy. Check any figures against existing published case and product source. If metric type is a design estimate, label it. Keep prototype/demo numbers separate from historical client metrics. Avoid exposing names or IDs covered by NDA. No invented testimonials, external research validations or measured improvements.

## 5. Code / architecture

Branch from the exact checked portfolio reference `48d00e7` (or rebase safely onto the current working redesign branch without discarding changes). Use a new isolated branch such as `redesign/agent-ops-portfolio-case-v2`. Reuse the existing global tokens and shared case anatomy, but give Agent Ops its own case-specific Astro component and copy/media type if needed, analogous to `src/components/portal/PortalCase.astro`. Preserve `src/pages/work/[slug].astro` and its RU equivalent routing, `src/copy/cases/agent-ops-console.ts`, `src/copy/ru/cases/agent-ops-console.ts` or migrate intentionally to a new dedicated data module with no dead route. `src/copy/featured-work.ts` controls the homepage case cards: change only the Agent Ops media / copy, keeping B2B V2.1 media override and all other case cards unmodified. Use EN/RU parity assertions where possible.

No Figma changes; no edits to `Agent-ops-console` product beyond local noncommitted capture helpers when absolutely necessary. No merges, production deploys or product deployments. Reuse standard motion and accessibility primitives. Do not animate screenshot content as if it were the product itself; no invented CSS UI over images.

## 6. Definition of done — efficient and visual

- New homepage Agent Ops cover and `/work/agent-ops-console`, `/ru/work/agent-ops-console` tell one coherent story with 7 approved key screens and an honest outcome.
- 1440 desktop: screenshots feel as legible and well framed as B2B V2.1, but have a distinct dark operational personality. 390 mobile: readable native shots with no desktop shrink-to-fit, text overlap, cropping of decision buttons or overflow.
- Exact source provenance for each of the 28 requested localized, responsive captures. No old public prototype represented as current.
- Live preview of the new portfolio branch; link it to the exact commit. Verify EN/RU × 1440/390 for Homepage and Case, first-screen and full-page BEFORE/AFTER; take a concise comparison matrix and report.
- `npm run check`, `npm run build`, content/CSS checks and links/visual checks appropriate to the repo. No broken media, content mismatch, horizontal overflow or new console errors. Confirm visible keyboard focus, reduced-motion behavior and actual card navigation.
- Return only: branch/commit/preview, 8 key comparison links (home/case × EN/RU × desktop/mobile), image manifest, short report, and actual blockers. Do not produce an 84-image audit or lengthy QA essay; prioritize the visible portfolio upgrade.
- DO NOT self-approve. Leave ready for independent ChatGPT visual review, unmerged, no production deployment.

**First deliverable from Codex:** inspect the product worktrees and current portfolio, generate the screenshot provenance manifest, implement the design in a single focused pass, capture and push. Do not stop at a plan unless the source repos are inaccessible or an accepted version cannot be identified.
