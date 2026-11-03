# Release diff · `main 561e6830` → candidate `e434919b`

Command: `git diff --name-status -M --find-renames=50% 561e6830 e434919b` (local, complete —
no API truncation). Machine-readable inventory with class, deployed flag, size and
line counts: [RELEASE-FILES.json](RELEASE-FILES.json). Raw lists:
[name-status](logs/name-status.txt), [numstat](logs/numstat.txt),
[sizes of added files](logs/added-sizes.txt).

## Totals

98 commits, **7,854 files: 7,805 added, 49 modified, 0 deleted, 0 renamed.**

| Class | Added | Modified | Ships to `dist/`? |
|---|---:|---:|---|
| `src/` application source | 26 | 34 | Yes (compiled) |
| `public/` assets | 170 | 4 | Yes |
| `ds/` design-system docs + tokens | 3 | 11 | `tokens.css` via mirror only |
| `scripts/` capture/QA tooling | 29 | 0 | No |
| `research/` | 84 | 0 | No |
| `audit/` evidence | 7,493 | 0 | No |

- **No deletions** of any file, including media and screenshots. The 4 modified public
  files are the Portal `fulfillment-{1280,390}` captures (EN/RU), replaced by the accepted
  B2B source-parity V1.1 work.
- No `node_modules`, `dist`, `.astro`, `.vercel`, `.env`, keys or OS artifacts in the diff.
  Secret-pattern scan of the full tree (GitHub/OpenAI/Anthropic/AWS/Slack/Vercel/Google
  keys, private-key blocks): no matches except a base64 image inside a Lighthouse JSON.
  One local path (`D:/Claude-projects/learn`) is in a source **comment** of
  `src/copy/cases/learn.ts`, unchanged since `main` and not rendered.
- Added content is ~1.65 GB, ~99% audit evidence (largest single file 5.5 MB). Not a
  deploy risk (Vercel serves `dist/`, ~111 MB `public/`), but a repository-weight item → BACKLOG.
- 12 of the 174 added/modified `public/media` files are not referenced by any public
  page or bundle ([list](logs/unreferenced-media.txt)). They are accepted alternates
  (Vet v2, Agent cover-polish variants, Portal `line-open`); kept, cleanup → BACKLOG.

## Case and Home integrity — content, not ancestry

Each file compared with `git diff` against its accepted source tip at the integration
commit `94925583`, then every later change attributed to a V1/V1.1 commit.

| Area | Accepted source | Release state |
|---|---|---|
| Home V3.1 composition | `43eb0b29` | `index.astro` = cover-polish `d004daf2` (portrait sizing); `FeaturedCase` identical, V1.1 nav-surface edit only; `WorkStage` = Pawly-Home `b3249e64`, V1.1 edit only |
| Agent Home cover | `42baa852` | `AgentHome` identical at integration; V1.1 surface/focus edit only |
| Portal Home cover | `085e7e07` | identical at integration; V1.1 surface edit only |
| Learn Home cover | `bb7a0881` | `LearnHome`, `LearnStage` **byte-identical** |
| Vet Home cover | `7991238a` | `VetHome`, `VetStage` **byte-identical**. Newer than Vet case branch copy (2 Nov 01:29 vs 1 Nov 20:42) — correct choice |
| Pawly Home cover | `b3249e64` | `PawlyHome` **byte-identical** |
| Agent Ops V3.1 | `dd717b05` | `AgentCase/Shot/HeadingText` identical at integration; V1 (`e9ebe3fb`: canvas radius, heading helper) and V1.1 (`e434919b`: nav surface) only |
| Partner Portal V3.1 | `085e7e07` | `PortalCase/Shot` identical at integration; V1 contrast/caption + V1.1 surface only |
| TRASSIR Learn V3.1 | `cbd12eb7` | `LearnCase` identical at integration; V1 RU-768 heading helper only |
| Vet Clinic V3.1 + cover fix | `c53eb042` | `VetShot` (rounded cover + 24 px field) and `case-vet-v3.md` **byte-identical**; `VetCase` V1 RU-1024 heading helper only |
| Pawly V2.1.2 | `2abf6710` | entire `src/components/pawly/` **byte-identical** |
| Shared `TextLink` | `c53eb042` (`f0a8731`) | **byte-identical** |

## Renderer dispatch

`src/pages/work/[slug].astro` selects `VetCase`, `AgentCase`, `PortalCase`,
`LearnCase`, `PawlyCase` by slug; `CaseStory` is only the fallback. RU routes reuse the
same page with `locale="ru"`. Built HTML confirms each of the 14 public routes renders
its dedicated root (`.agent-case`, `.portal-case`, `.learn-case`, `.vet-case`,
`.pawly-case`) and no public route renders `CaseStory`.

## Shared DS / motion changes after integration

- `ds/tokens.css` ≡ `src/styles/tokens.css` and `ds/motion.js` ≡ `src/scripts/motion.js`
  byte-for-byte. `motion.js` is unchanged since `main`.
- Tokens: two **additive** aliases (`--surface-nav-agent`, `--surface-nav-portal`); no
  existing value changed.
- `global.css`: only the `case-agent` / `case-portal` view-transition selectors changed;
  Learn, Vet and Pawly transition rules untouched.
- `animations.js`: +12/−2 lines carrying Astro's saved history scroll coordinate (V1.1
  WebKit fix). No timing or easing change.

## EN/RU

Copy changes come in locale pairs (`*/ru/cases/*` alongside EN, or bilingual modules
`learn-v3.ts`, `*-home.ts` exporting both). Media come in `en/`·`ru/` pairs. Built
routes, harmony and content checks cover both locales (see RELEASE-CHECKLIST).

## Conflicts documented in V1 BASELINE — re-verified

DS appendices combined (present in `ds/components.md`); five dedicated renderers
dispatched; Learn V3 copy and Pawly V2 copy kept; newer native Vet Home kept;
`WorkStage` retains `PawlyHome` and the `VetStage → VetHome` path. No conflict or
missing accepted change was found. **No integration correction was needed.**
