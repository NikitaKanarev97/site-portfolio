# Security triage · npm audit on candidate `e434919b`

Commands (after `npm ci`, lockfile unchanged): `npm audit --json` →
[logs/npm-audit.json](logs/npm-audit.json); `npm audit --omit=dev --json` →
[logs/npm-audit-prod.json](logs/npm-audit-prod.json); per-advisory list
[logs/npm-audit-advisories.txt](logs/npm-audit-advisories.txt) (61 advisories across 15 packages).

| Scope | Critical | High | Moderate | Low | Total packages |
|---|---:|---:|---:|---:|---:|
| All | 1 | 10 | 3 | 1 | 15 |
| `--omit=dev` | 1 | 9 | 1 | 1 | 12 |

Identical counts to Final Quality V1. Nothing new was introduced by the release.

## Deployment facts used for exposure

- `astro.config.mjs`: `output: 'static'`, **no adapter**, no SSR, no server islands, no
  middleware, no API routes. Vercel serves prebuilt files from `dist/`.
- No `astro:assets` / `<Image>` / `getImage` — no image optimization pipeline at all;
  `dist/_astro` holds only JS (7 files). Media in `public/` are local, committed, trusted files.
- `define:vars`: 0 uses. `set:html`: 2 uses (`Navbar` logo SVG constant, `TextLink`
  label from repository copy) — no external input.
- `satori` renders OG PNGs at build time from repository copy only.
- `vite`, `esbuild`, `launch-editor`, `undici`, `devalue` etc. run only during
  `astro build` / `astro dev` on the owner's or Vercel's build machine.
- Inputs at build time are the repository itself (trusted: owner-authored).

## Classification

| Package (direct?) | Worst | Advisory theme | Runtime exposure on kanarev.com | Release-blocking? | Safe remediation |
|---|---|---|---|---|---|
| astro (direct) | **critical** GHSA-26w7-cxv4-gfx2 | RCE via AVIF image optimization; plus XSS in `define:vars`, spread attribute names, server-island replay | **None.** Requires processing attacker-supplied AVIF through Astro image optimization (absent), or SSR/server islands (absent), or untrusted data in `define:vars`/spread props (absent) | **No** | Major upgrade (astro 7.x) — separate, tested toolchain PR |
| sharp (direct) | high | libvips/libheif/librsvg CVEs | None at runtime; build-time only, trusted local images | No | Both copies are flagged: direct `sharp@0.35.3` (advisories `<0.35.4`, `<0.35.5`) and Astro's nested `sharp@0.34.5`. Direct copy: patch bump to ≥0.35.5 when released/stable; nested copy via astro major |
| zod / zod-to-ts | high | memory exhaustion validating oversized collections | None: build-time content validation of repository data | No | via astro major |
| vite / launch-editor | high | Windows command/path issues in dev editor launch | Dev server only, never deployed | No | `npm audit fix` (non-major) |
| devalue, undici, fast-uri, js-yaml, source-map-js, svgo, smol-toml, fflate | high–moderate | DoS / parser issues on untrusted input | Build toolchain only; inputs are repository files | No | `npm audit fix` (non-major) |
| satori (direct) | moderate | SVG escaping | Build-time OG rendering of own copy | No | 0.33.5 within existing `^0.33.4` range |
| esbuild | low | dev-server arbitrary file read on Windows | Dev server only, bound locally | No | via astro major |

## Verdict

**No finding is exploitable in this deployment; none is release-blocking.** This is an
exposure assessment based on the deployment model above, not a claim that the
dependencies are patched. It becomes invalid if the site adds SSR/an adapter, Astro
image optimization of uploaded media, server islands, or untrusted content in builds.

Not done in this release, deliberately: `npm audit fix` / `--force`. A lockfile change
would alter the exact build that was verified. Recommended follow-up (BACKLOG S1):
a separate PR running non-major `npm audit fix` plus full rebuild/check/matrix, then a
planned Astro major upgrade.

Additional repository checks: no credentials or tokens found in the tree; no `.env`;
`main` has no branch protection (procedural risk, recorded in BACKLOG, unchanged).
Preview deployments are protected by Vercel SSO and served `X-Robots-Tag: noindex`.
