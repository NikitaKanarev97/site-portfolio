# Common A — media registry

04.10.2026. Паспорта — `artifact-plan.md`. Все материалы автора/проектов из предоставленного workspace; реальные пользовательские и коммерческие данные не используются.

| ID | Файл / источник | Version, capture | Fixture / locale | Purpose / status |
|---|---|---|---|---|
| agent-cover-message | `/media/pilot-agent-ops/message-{1440,390}.webp` | Accepted checkpoint, actual Agent Ops panel; desktop/narrow; исходный capture в benchmark | EN, invented customer message | Reuse; interlock cover; один реальный DOM кадр |
| agent-cover-payout | `/media/pilot-agent-ops/payout-{1440,390}.webp` | Accepted checkpoint | EN, $340 approval | Reuse; complete payout panel |
| agent-clusters | `/media/pilot-agent-ops/clusters-framed-{1440,390}.webp` | Current accepted pilot | EN, prototype cause clusters | Reuse; central scene |
| agent-workspace | `/media/pilot-agent-ops/run-context.webp`; `/media/pilot-agent-ops/transcript-framed-{1440,390}.webp` | Current accepted pilot, actual adaptive narrow | EN, $420 fixture | Reuse; workspace / full conversation |
| agent-approval | `/media/pilot-agent-ops/approval-card-{1440,390}.webp` | Current accepted pilot | EN, $340 fixture | Reuse; decision; distinct from workspace |
| agent-evidence | `/media/pilot-agent-ops/evidence-{1440,390}.webp` | Current accepted pilot | EN, missing trace/article | Reuse; callout. RU surrounding copy; underlying product remains EN |
| portal-application | `/media/case-dssl/polish-after-resolution.webp`; cover `/media/case-dssl/cover/resolution-center.webp` | Existing synthetic reconstruction, reused whole | Synthetic XLS/SKU; EN | Actual ResolutionCenter beside A-DS; current reconstruction, not archival shipment screen |
| portal-specimens-* | `/media/rebuild/common/portal/` | Actual accepted `storybook-static/iframe.html`; source story, element selector, viewport, DPR, SHA256 and dimensions in `captures.json` | Canonical source story fixture; EN UI; D001, D013 | Adaptive DOM 288 CSS px at DPR2 used in the composition; supplementary 480 CSS px frames retained. No drawn controls; A-DS |
| portal-inter | `/media/rebuild/common/portal/inter-latin.woff2` | Product @fontsource-variable/inter bundled asset, byte copy | Inter variable; SIL Open Font License 1.1, Inter Project Authors | Live foundation samples; license beside asset as `inter-OFL.txt` |
| ha-flow/map/ds/proto | `research/portfolio-rebuild-2026-10-03/references/*.png` | Local source archive, SHA256 in references README | Competitor reference | Local comparison/base only. Not copied into public site |

Generated `captures.json` is the detailed registry for every new state/frame. No-JS/reduce preserve the same selected states. Desktop overview and mobile specimen order use the same family/state IDs.

G-01, 04.10.2026: все 26 specimens пересняты без непрозрачного Storybook canvas. Inline chrome override нужен, поскольку body.sb-show-main !important перекрывает обычный selector. Для прозрачного component root исходная поверхность canvas сохранена внутри его собственного закруглённого контура; снаружи — alpha, без белого прямоугольника. Capture bleed 2 CSS px сохраняет полную обводку; поля и цвет продукта внутри не изменены. Данные компонента остаются 288/480 CSS px, viewport добавляет 4 px. В CaseSpecimen используется общий CaseScreen native. Alpha и вывод проверены в integration/corners-verification.json; новые крупные кадры — integration/shots/corners-*.png.
