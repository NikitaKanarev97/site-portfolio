# Site rhythm, skip navigation and Russian Learn frames · 05.10.2026

The home Hero/portrait ended only 48 CSS px before Featured, while case and section boundaries used 96 px below 1024 and 128 px above it. Removed the page override: all main sections, Featured items and CaseSheet sections now share `section-gap`. The works label still owns its internal 32 px gap. Existing smaller flow roles and native UI fields remain intentional.

Audited public Home, About and five cases in EN/RU at 360, 390, 768, 820, 1024 and 1440 px. Geometry checks cover section boundaries, full-width frames, stage fields, image heights and overflow. Reviewed page screenshots at mobile/tablet/desktop and detailed Hero/Featured boundaries.

The skip link is the first keyboard destination, not an autofocus target. It revealed on Tab in Chromium, and Enter focused `main`. Pointer navigation, Back and reload kept it hidden. WebKit's default Tab setting visits controls; the same activation was checked after keyboard focus on the link. Removed its slide transition so focus changes have an immediate visual result. Random appearance during pointer navigation was not reproduced; the accessible keyboard destination remains available.

Learn had two independent locale defects: LearnStage hardcoded five English art-direction files, and `makeLearnStory` hardcoded its English rebuild media folder. Added native Russian captures and locale-specific selection in both places. Every active current-product Learn shot has a RU source. The historical Russian archive is shared. Card fixture properties use Storybook's real args channel because its URL sanitizer rejects Cyrillic. No screenshot text was painted or replaced.

Reproduction: `scripts/shoot-learn-stage.mjs`, `scripts/shoot-learn-story-ru.mjs` (requires read-only catalog source server), `scripts/verify-site-rhythm.mjs`, `scripts/verify-responsive-spacing.mjs`. Source capture records are adjacent `learn-stage-ru-captures.json` and `learn-story-ru-captures.json`.

Validation: Astro build/check, scoped CSS and harmony checks; public route geometry and focus checks in Chromium and WebKit. Existing Astro check reports 101 hints, zero errors and zero warnings. Reports and screenshots are under `tmp/site-rhythm`.
