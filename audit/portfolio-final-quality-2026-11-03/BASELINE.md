# Reproducible integration baseline · 3 November 2026

Branch: `codex/portfolio-final-quality-2026-11-03`.
Worktree: `D:/Claude-projects/sp-final-quality-2026-11-03`.
Integrated BEFORE commit: **`949255834395046e7681fefa5a97ed6e7ae50a04`**.
This is the source of BEFORE captures, not the older main or the public deployment.

## Source revisions

| Surface | Intended revision / branch tip | Provenance |
|---|---|---|
| Original local main | `49d2fb05c56925a69342612a94e0e4ecfebd9aa9` | Four uncommitted Learn report/state files were left untouched in the original checkout |
| Remote main after fetch | `561e6830392b6e9a25e61e30cafe394586df3ff4` | Older Learn V2.3; insufficient as a final site baseline |
| Home V3.1 | `43eb0b29372c50af616c71deed3139017adaf705` | Subsequent independent Home verdict `5572d96`; ancestor of cover revisions |
| General cover refinement | `d004daf2e63e16ec493bbfadab60b7005e3b17a8` | Home cover polish report; source parity refinement `04ae075`, review `317e3b7` |
| Agent Home | `42baa852a12302d5f89c3776ea83a16b6e0e9aad` | `audit/agent-ops-home-cover-v1/v1/REPORT.md` |
| Vet Home | `7991238ac3cad8865eaa24200024cfa764da387c` | `audit/vet-home-cover-v1/`; includes latest screenshot/caption gap |
| Learn Home | `bb7a0881f78cc1b5118a70d026863b55298a5262` | `audit/trassir-learn-home-cover-v1/` |
| Pawly Home | `b3249e642a7143d5d5251a412e79c9481532a2a1` | `audit/pawly-home-cover-premium-v1/` |
| Pawly V2.1.2 | `2abf6710e0c2026f75a62dff2718e3417b71e0e1` | Isolated branch starting point; implementation `21b9f0e0b352de7c786d9afcc9e639a63c7ad3f0`; evidence `4d78a6c` |
| Partner Portal V3.1 | `085e7e07b09fb1e4f6d1e18b48cdca4e07bab0ab` | V3 `b396a60`, V3.1 correction `d5e9c303ac859b1be96ccab0831d1f64d3d1abbd`; `audit/b2b-portfolio-case-premium-v3/v3.1/REPORT.md` |
| Agent Ops V3.1 | `dd717b0548dbd33d6ca21008dcb8fd796171b12d` | V3 `eb7b9e7`, typography correction at tip; `audit/agent-ops-portfolio-premium-v3/v3.1/REPORT.md` |
| Learn V3.1 | `cbd12eb7ba8345f3d6a3db1d4c93c59b3a7a4498` | V3 implementation `a1ae443`; V3.1 corrects capture synchronization, not product code; `audit/trassir-learn-portfolio-premium-v3/v3.1/REPORT.md` |
| Vet V3.1 plus latest cover fix | `c53eb042cef82c918bcbcd6b0f570ab19122b38c` | V3 `29065c6`, shared TextLink correction `f0a8731`, explicit cover correction at tip; `audit/vet-portfolio-premium-v3/v3.1/REPORT.md` |

These are the revisions requested as the intended accepted work. Their individual
reports often say “for independent review”; this integration does not manufacture
an independent acceptance that those reports do not contain.

## Integration

Started an isolated worktree at Pawly `2abf671`, which already contains Home V3.1,
cover polish and Agent/Vet/Pawly cover revisions. Merged Portal `085e7e0` (including
Learn Home), Agent `dd717b0`, Learn `cbd12eb`, then Vet `c53eb04`, preserving history.
No cherry-pick of a whole old main. No main merge, deploy, Figma edit or product-repo edit.

Conflicts resolved by combining DS appendices; dispatching all five dedicated case
renderers; keeping Learn V3 copy and Pawly V2 copy; keeping the newer native Vet
Home cover instead of Vet case branch's older Home. WorkStage retains PawlyHome
and the VetStage → latest VetHome path. Logs: `logs/merge-*.log`.

Before QA, byte comparisons found no differences from the selected sources for:
AgentCase/AgentShot/agent-reading; PortalCase; LearnCase/learn-v3; VetCase/VetShot/
TextLink; all Pawly components; and latest Home/FeaturedCase/AgentHome/VetHome/
PawlyHome/LearnHome. Route/DS glue is the documented integration delta.

The first preview requested busy port 4413 and bound **4414**. Preliminary probes
against 4413 were discarded. The matrix now refuses to run unless served HTML
matches this worktree's `dist` byte-for-byte for Home, Agent, Learn and Pawly.
All delivered BEFORE/AFTER captures use 4414 and the verified integrated build.

## Skills and sources

Read project CLAUDE.md, CONTENT-RULES.md, DS contract/foundation/catalog/patterns,
motion concept/registry, mirrored tokens, orchestration, global CSS, media components
and harmony checker. Historical ownership packages were respected through isolation.
Used installed `emil-design-eng`, `gsap-performance`, `gsap-scrolltrigger`.
Searched project `.claude/skills`, user `.claude/skills`, `.agents/skills`,
`.codex/skills`: **no Lenis skill or Lenis instructions found**. No claim of using it.

`npm ci` supplies the lockfile build; browser tooling reuses the existing neighboring
Playwright and axe-core packages without editing that repository. Browser cache has
Chromium and WebKit; Firefox availability is recorded in the final logs.
