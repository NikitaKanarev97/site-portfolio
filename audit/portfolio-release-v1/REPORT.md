# Portfolio Release V1 · preflight report

3 November 2026 · kanarev.com · Astro 5 static on Vercel.
Not self-approved. Production release requires the owner's explicit approval of the exact SHA.

| | SHA |
|---|---|
| Production / `main` (unchanged) | `561e6830392b6e9a25e61e30cafe394586df3ff4` |
| Verified application source | `e434919b60687f781eeb25d8f79ee995e42891b9` (Final Quality V1.1) |
| Release candidate | the branch commit that adds this folder; it changes **only** `audit/portfolio-release-v1/`. Its exact SHA is stated in the PR description and the handoff message |

Branch `codex/portfolio-final-quality-2026-11-03` → `main`.
Compare: `https://github.com/NikitaKanarev97/site-portfolio/compare/main...codex/portfolio-final-quality-2026-11-03`.

## A. Release integrity

**Yes — all five accepted case versions and the latest Home are present.** Verified by
file content, not only ancestry ([RELEASE-DIFF.md](RELEASE-DIFF.md)):

- Pawly V2.1.2, Learn Home, Vet Home, Pawly Home, `VetShot` cover correction, `TextLink`:
  byte-identical to their accepted sources.
- Agent V3.1, Portal V3.1, Learn V3.1, Vet V3.1, Agent/Portal Home, Home V3.1: identical at
  the integration commit; every later delta attributed to Final Quality V1 (`e9ebe3fb`,
  `c4192c42`) or V1.1 (`e434919b`) and matching those reports.
- Vet Home: the release correctly keeps the newer Home cover (`7991238a`, 2 Nov) over the
  Vet case branch copy (1 Nov). The "latest cover correction" is the case cover in
  `VetShot`, present byte-for-byte.
- All five dedicated renderers dispatch by slug and render on all 10 case routes.
- Diff `main…candidate`: 7,854 files, **0 deleted, 0 renamed**; no secrets, generated
  output or local artifacts; DS mirrors byte-identical; shared-file changes scoped to
  Agent/Portal transitions plus one history-scroll lifecycle fix.
- Only non-ancestors: two doc-only independent-acceptance commits on `review/*` branches.

No integration conflict or missing accepted change was found. **No correction was made.**

## B. Technical verification

All on the exact source, fresh `npm ci` + build ([RELEASE-CHECKLIST.md](RELEASE-CHECKLIST.md)):

- `check` 0 errors / 0 warnings · `build` 37 pages · `check:content` 0 · `check:css` 0 ·
  `check:harmony` 0 — all exit 0.
- Responsive Chromium 98/98 (7 widths) · WebKit 42/42 · short-height/reflow included.
- Interactions 1018/1018 · smoke Chromium 138/138, WebKit 128/128 ·
  transitions 316/316 per engine · states 290/290 per engine · supplemental 218/218 ·
  touch 32/32 · delayed bundle 0 regressions · axe 0 violations in 28 scans.
- SEO validator: 0 problems on 14 public routes; sitemap exact; 0 broken internal links
  across 183 HTML files.

Failures observed, reported as they happened:
1. First Chromium matrix: 18 cells failed at the screenshot step because the new output
   folder did not exist (harness). DOM checks had passed; re-run 28/28.
2. First chain attempt: every suite failed to start (harness copy could not resolve
   `sharp`). Fixed by linking `node_modules`; all suites re-run. Labelled in exit-codes.
3. WebKit smoke 127/128 once: intermittent unhandled `fetch` rejection from Astro prefetch
   (BACKLOG W1, pre-existing, console-only). 128/128 in two reruns.
4. WebKit transitions 315/316 once: rAF sampler starvation on one sample (W2). 316/316 in
   two reruns.

Not covered: Firefox (not installed), physical iOS/Android, screen readers, toolbar zoom,
`lifecycle.mjs` dev-debug run, live preview (Vercel SSO). Automated axe checks are not a
manual WCAG audit.

## C. Visual and motion consistency

No regression relative to the accepted designs. No product file changed in this pass,
so the accepted V1/V1.1 captures remain valid for this exact source. Measured: Agent
navigation `#F7F7F5`, Portal `#EDF2F8` in group/old/new snapshots in Chromium and WebKit;
no obsolete dark/yellow surface; native 1 s duration and `motion.js` unchanged; history
restoration, interruption, reduced motion, no-JS, unsupported View Transitions and delayed
bundle all pass.

## D. Content and recruiter experience

Coherent and ready to share internationally ([RECRUITER-JOURNEY.md](RECRUITER-JOURNEY.md)).
The English first screen answers who, what, which case and how to contact; credibility
comes from concrete decision cards with real UI and an evidence line per case. Contacts
and CVs are consistent across 14 routes and both PDFs; 0 status-label findings; no new
claims or metrics. RU omits the location line on purpose (pre-existing owner decision).

## E. Security and performance

- **Security:** 15 npm advisories (1 critical). Static output, no adapter, no image
  optimizer, no untrusted input → **none exploitable in this deployment; none blocks**.
  Fix in a separate dependency PR ([SECURITY-TRIAGE.md](SECURITY-TRIAGE.md)).
- **Performance:** Lighthouse mobile Home EN 95 / RU 94; LCP 2.59 s / 2.67 s
  (reproduces V1's 2.545/2.661 within ~50 ms), CLS 0.079, TBT 0; desktop 100.
  LCP is render delay from approved entrance motion on the hero text. Lab only; no field
  CWV/INP exists ([PERFORMANCE.md](PERFORMANCE.md)). Backlog, not a blocker.

Action now: none. Backlog: [BACKLOG.md](BACKLOG.md) (2 × P2, 14 × P3/info).

## F. Deployment readiness

- `main` is a strict ancestor of the candidate (0 behind): a fast-forward makes production
  build exactly the verified tree.
- Candidate preview deployment: Vercel `success`.
- Rollback target confirmed: production deployment of `561e6830`
  (`site-portfolio-4q0v1p603-nikita-fd80.vercel.app`). Procedure: [RUNBOOK.md](RUNBOOK.md).
- Risks the owner should know: `main` has no branch protection; LinkedIn needs one manual
  click-through; preview can only be checked when logged into Vercel.

**Safe to merge after owner approval.**

## G. Final verdict

## `GO — READY FOR OWNER APPROVAL`

Evidence: all accepted revisions present by content; all six baseline commands exit 0;
every browser suite passes on the exact source (two intermittent WebKit items did not
reproduce and are pre-existing or harness timing); 0 SEO problems on public routes;
0 axe violations; no exploitable security finding; performance matches the accepted
baseline. No P0/P1 blocker was found.

This is a recommendation, not acceptance. **Phase F has not been executed**: nothing
was merged into `main`, nothing was pushed to `main`, and no deployment, promotion or
rollback was triggered.
