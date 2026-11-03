# Production release runbook · Phase F (NOT AUTHORIZED YET)

This is a prepared procedure. Nothing below runs until the owner explicitly approves the
**exact** candidate SHA named in REPORT.md. Approval of another SHA does not carry over.

## 0. Preconditions (re-check immediately before acting)

```sh
git fetch origin --prune
git rev-parse origin/main                                     # must still be 561e6830392b6e9a25e61e30cafe394586df3ff4
git rev-parse origin/codex/portfolio-final-quality-2026-11-03 # must equal the APPROVED SHA
git merge-base --is-ancestor origin/main <APPROVED_SHA> && echo fast-forward-possible
```

If `main` moved or the branch tip differs from the approved SHA: **stop** and report.
Confirm on GitHub that the PR's head SHA equals the approved SHA and Vercel's preview
status for it is `success`.

## 1. Integration method (owner chooses one)

- **Recommended: fast-forward** — `main` is a strict ancestor, so `main` becomes exactly
  the approved SHA and the production build equals the verified preview build:
  `git push origin <APPROVED_SHA>:refs/heads/main` (no force; fails safely if `main` moved).
- Alternative: GitHub "Create a merge commit" on the PR. This produces a new SHA whose
  tree equals the approved tree; verify `git diff <APPROVED_SHA> origin/main --stat` is empty.
- Do not squash: it would discard the provenance of the five accepted case histories.

## 2. Observe deployment

Vercel creates a Production deployment for the new `main` commit. Watch until `READY`
(Vercel dashboard, or GitHub API `deployments?environment=Production` → latest status
`success` for the new SHA). Record deployment URL and id.

## 3. Live verification (public domain, not localhost)

```sh
for r in / /ru/ /about/ /ru/about/ /work/{agent-ops-console,partner-portal,learn,vet-clinic,pawly}/ /ru/work/{agent-ops-console,partner-portal,learn,vet-clinic,pawly}/; do
  curl -s -o /dev/null -w "%{http_code} $r\n" https://kanarev.com$r; done
curl -sI http://kanarev.com/ https://www.kanarev.com/            # 308 → https://kanarev.com/
curl -s https://kanarev.com/robots.txt; curl -s https://kanarev.com/sitemap.xml | grep -c '<loc>'   # 14
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" https://kanarev.com/cv.pdf https://kanarev.com/cv-ru.pdf
curl -s -o /dev/null -w "%{http_code}\n" https://kanarev.com/does-not-exist   # 404
```

- Release identity: rebuild the approved SHA locally and compare HTML of `/`, `/work/pawly/`,
  `/ru/work/vet-clinic/` with live bytes (`cmp`). Live `/work/pawly/` must contain
  `class="pawly-case"` (production today still renders legacy `CaseStory`).
- SEO: `node audit/portfolio-release-v1/seo-dist.mjs` validates the build; on live HTML,
  spot-check canonical/hreflang/OG on Home and one case per locale.
- Browser smoke on the live domain: `QA_BASE=https://kanarev.com` with
  `browser-smoke.mjs chromium|webkit` and `v1.1/states.mjs` (history scroll, motion
  lifecycle, Next Case cycle, menu, dialogs, copy email). The matrix's local-dist identity
  guard must be skipped or pointed at a matching build.
- Record console and network errors. LinkedIn returns 999 to automation; owner checks it by hand.

## 4. Rollback

Rollback target (current production, verified 3 Nov 2026):
`561e6830392b6e9a25e61e30cafe394586df3ff4` →
`https://site-portfolio-4q0v1p603-nikita-fd80.vercel.app` (Production, status success).

Trigger: any P0/P1 regression on the live domain (route 5xx/404, missing case renderer,
broken navigation/history, contacts/CV broken, blank or hidden content).

Fastest, no git change (requires owner authorization): Vercel dashboard → Deployments →
the `561e6830` production deployment → **Promote to Production** (Instant Rollback).
Then fix forward on the branch. Note that Vercel instant rollback disables auto-promotion
of new `main` pushes until a deployment is promoted again.

Git-level rollback (only with authorization, never force-push): revert on a branch via PR,
or — if fast-forwarded and nothing else landed — the owner decides on the method.

Never mark the release accepted while live verification is incomplete or failing.
