# Release V1 · reconciled baseline

3 November 2026. Release preflight of `codex/portfolio-final-quality-2026-11-03`.
Isolated worktree: `D:/Claude-projects/sp-release-v1` (detached at the candidate).
The original checkout (`D:/Claude-projects/Site-portfolio`, four uncommitted
`tasks/learn-case/*` files) and all ~45 other worktrees were left untouched.

## Live refs after `git fetch --all --prune`

| Ref | Expected (brief) | Observed | Changed? |
|---|---|---|---|
| `origin/main` | `561e6830392b6e9a25e61e30cafe394586df3ff4` | `561e6830392b6e9a25e61e30cafe394586df3ff4` | No |
| `origin/codex/portfolio-final-quality-2026-11-03` | `e434919b60687f781eeb25d8f79ee995e42891b9` | `e434919b60687f781eeb25d8f79ee995e42891b9` | No |

- Merge-base(main, candidate) = `561e6830` → `main` is a strict ancestor; **0 behind / 98 ahead**.
  A fast-forward integration is possible without a merge commit.
- No pull request existed for the branch (GitHub API, `state=all`).
- `main` has **no branch protection** (API: "Branch not protected"). The merge gate
  is procedural only; this report does not change that setting.

## Vercel state (via GitHub Deployments API; Vercel CLI not installed)

| Environment | SHA | Deployment URL | Status |
|---|---|---|---|
| Production (current) | `561e6830` (= `origin/main`) | `https://site-portfolio-4q0v1p603-nikita-fd80.vercel.app` | success, 2026-10-31T19:51Z |
| Production (previous) | `49d2fb05` | — | success, 2026-10-31T18:30Z |
| Preview (candidate) | `e434919b` | `https://site-portfolio-jg9rv8fm5-nikita-fd80.vercel.app` | success, 2026-11-03T13:15Z; commit status `Vercel=success` |

- Production deployments are created only for `main` commits → production branch is `main`.
- The candidate preview responds `302 → vercel.com/sso-api` with `X-Robots-Tag: noindex`
  (Vercel deployment protection). Automated content checks against the preview are
  therefore not possible; candidate QA ran on a local production build of the exact SHA
  (`astro preview`, served HTML byte-checked against `dist/`).
- `https://kanarev.com/` currently serves an older build (HTML differs from the candidate;
  `/work/pawly/` still renders the legacy `CaseStory`), consistent with production = `main`.
- `http://kanarev.com`, `https://www.kanarev.com` → `308` to `https://kanarev.com/`;
  `http://www.kanarev.com` → `308` to `https://www.kanarev.com/` (then 308 again).

## Accepted source revisions in the candidate

All implementation tips from the V1 baseline are ancestors of `e434919b`:
Home V3.1 `43eb0b29`, cover polish `d004daf2`, Portal parity `04ae0753`, Agent Home
`42baa852`, Vet Home `7991238a`, Learn Home `bb7a0881`, Pawly Home `b3249e64`,
Pawly V2.1.2 `2abf6710` (impl `21b9f0e0`), Portal V3.1 `085e7e07` (fix `d5e9c303`),
Agent V3.1 `dd717b05`, Learn V3.1 `cbd12eb7`, Vet V3.1 + cover `c53eb042`,
integration `94925583`, Final Quality V1 `c4192c42`, V1.1 baseline `69fa8986`.

Not ancestors (expected): `317e3b7` (B2B independent acceptance) and `5572d96`
(Home V3.1 independent acceptance). Each adds exactly one
`INDEPENDENT-ACCEPTANCE.md` on its own `review/*` branch — no source content.

Content-level parity is in [RELEASE-DIFF.md](RELEASE-DIFF.md).

## Environment

Windows 11 x64 · Node 24.18.0 · npm 11.16.0 · Astro 5.18.2 (lockfile) ·
Playwright 1.62.1 (reused from `D:/Claude-projects/Agent-ops-console`, not added to this repo) ·
Chromium 153.0.8010.12 / Playwright WebKit 26.5 from the local Playwright cache
([logs/browsers.json](logs/browsers.json)) · Lighthouse 12.8.2 (npx cache, headless
Chromium 153). Firefox is not installed (launch failure recorded).
Harness: the V1/V1.1 scripts copied **unchanged** (SHA-256 verified,
[logs/qa/harness-copies.sha256](logs/qa/harness-copies.sha256)) to the session scratchpad
so their output could not overwrite committed V1/V1.1 evidence. `gh` CLI is not authenticated;
GitHub API calls used the repository's existing git credential, never printed or stored.
