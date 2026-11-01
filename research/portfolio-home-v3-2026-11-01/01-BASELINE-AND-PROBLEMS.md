# 01 · Code + screenshot-grounded homepage audit

## Reviewed implementation

`src/pages/index.astro`: header in PageShell; Hero (identity row, giant two-line tagline, photo + inline index, specialization, EN availability, CV/email); Selected work list of 5 `FeaturedCase` components; four Webflow demos in `DevelopmentStrip` with `ProjectDialog`; How I work; Footer in PageShell.

`src/components/FeaturedCase.astro`: heading + short outcome, media stage, one evidence fact, Read the case CTA; responsive 3:2 headline ratio on large; hover only small stage lift. `WorkStage.astro` routes:
- Agent Ops → `agent/AgentHome.astro` on Home
- Partner Portal → `portal/PortalHome.astro`
- TRASSIR Learn → `learn/LearnHome.astro`
- Vet → `VetStage.astro`
- Pawly → separate existing photo/panel arrangement; **freeze**
`src/copy/featured-work.ts`: 5 cases; order Agent, Portal, Learn, Vet, Pawly; EN/RU mapping and honest evidence fields. `src/copy/home.ts` + `src/copy/ru/home.ts`: home positioning and Webflow builds. `src/styles/tokens.css`: warm neutral palette, one red accent, product-specific artwork surfaces. `ia/wireframes/mobile-home.md` contains OLD four-case/single-case wireframe information; do not blindly implement old content and geography. Code is the contemporary source of truth.

## Actually visible on prior committed captures

### Desktop Home / 1440x900 EN
[Source snapshot](../portfolio-premium-v3-2026-11-01/baseline/agent-ops/en-1440-home-viewport.webp).
- Strong black/red text hierarchy: 'Complex systems. / Clear decisions.'
- Identity role and portrait; right-hand links to all five cases.
- A reasonable 1440px editorial composition, but **not a single real product UI panel is visible** inside the first 900px. Below the photo and CTAs is unused space until fold.
- Visual message: 'I can write a strong positioning statement'; proof that the visitor should hire a product designer is delayed.
- Slogan is generic enough to fit many portfolios; paired artifact must give it specificity.

### Mobile Home / 390x844 EN
[Source snapshot](../portfolio-premium-v3-2026-11-01/baseline/agent-ops/en-390-home-viewport.webp).
- Name/role, heading, personal portrait and a vertical list of five cases consume most first fold; specialization and EN availability also compete for space.
- The user sees no product image before the fold, and visually the portfolio resembles a simple profile page.
- A big photo plus adjacent five links is informative but visually unbalanced; the strongest work is only a name in a list.
- Do not just halve font sizes: build a separate mobile composition.

### The first four work previews
- [Agent Ops home](../portfolio-premium-v3-2026-11-01/baseline/agent-ops/en-1440-case-viewport.webp) is its **case page**, not identical to the home tile. The real Home tile stage is `AgentHome`, currently a pale editorial plate + action approval screenshot.
- [B2B Home 1440](../portfolio-premium-v3-2026-11-01/baseline/b2b/en-1440-home.png), [B2B mobile](../portfolio-premium-v3-2026-11-01/baseline/b2b/en-390-home.png): 41/48 example is a product state with synthetic data, not success metric; desktop full UI is very small at casual reading scale, mobile native view is significantly better.
- [Learn cover](../portfolio-premium-v3-2026-11-01/baseline/learn/en-1440-learn-cover.png): reference vs guided learning is a useful narrative, but dense image grouping reduces hierarchy; [native mobile](../portfolio-premium-v3-2026-11-01/baseline/learn/en-390-learn-cover.png) gives a focused workflow.
- Vet source media has an early screenshot from September in [historical Vet](../portfolio-premium-v3-2026-11-01/baseline/historical/vet-hero-desktop.png). Recent vet product improvements are not captured by this file; selecting new Home media requires an approved recent source SHA and real browser capture.
- Pawly historical [mobile screenshot](../portfolio-premium-v3-2026-11-01/baseline/historical/pawly-mobile.png) is NOT a basis to update its home art. **No Pawly change at all.**

### Webflow / process (historical evidence)
[September Webflow screenshot](../../audit/case-presentation/more-desktop.png). Four real distinct demo previews in a compact row correctly subordinate to the product work. The grid currently offers a useful proof of design-to-build, but generic copy/spacing creates a drop in perceived editorial care near the bottom. Keep subordinate, improve typography/caption consistency only if actual current first/full-page capture agrees. Do not inflate four demos to large hero cards.

## Formal UX risks (not claiming empirically measured traffic outcomes)

P0. No real product visual inside first desktop/mobile viewport → delayed proof.  
P0. Five project-name links + visible portrait compete for visual priority on mobile.  
P0. Normal-size product UI (especially B2B desktop) may be too microscopic to see the decision; not fixed by decorative outer mockup.  
P1. Repeated sections can feel template-driven if all four eligible previews use same proportions despite different workflows.  
P1. Intro descriptions can restate generic 'complexity'; visitors need job, action, status and a decision.  
P1. EN availability contains location/visa detail while RU intentionally omits; this is an existing editorial/business policy, **do not silently change**.  
P2. Web builds and process need integrated sense of technical capability without overpowering B2B case studies.

## Scope decision

**Target the whole homepage's narrative and quality**, but implement only essential changes. Keep:
1. five-case order and all links,
2. Pawly cover **byte-identical in media and untouched in its own component/copy**,
3. component and content separation,
4. live Webflow demo truth and working dialog accessibility,
5. existing semantic footer/contact and EN/RU consistency,
6. existing case-page code unmodified.

## Unresolved evidence

No current live production screenshot; no direct fresh reference captures for all remote sites. See previous pack's matrix for verified vs historical. Source code audited at pinned SHA only. A Claude/Codex fresh baseline capture may reveal extra issues or override non-observed tentative risks.
