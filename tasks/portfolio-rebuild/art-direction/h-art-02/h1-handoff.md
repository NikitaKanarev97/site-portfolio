# H → H-art-review

**Готово к независимому художественному review.** Главная и пять публичных EN/RU кейсов доведены; итоговые сцены проверены и сохранены собственным source commit. Художественная приёмка контроллера pending. STATE/automation во владении контроллера; личная приёмка владельца не объявлена.

Checkout: `C:/Users/kanar/.codex/worktrees/portfolio-art-direction-h/Site-portfolio`.
Branch: `codex/portfolio-art-direction-h-2026-10-04`.
Accepted G base: `c0c69040801d60bcfc836f6728f2ae806911be1d`.
**H code/media/DS ref: `8a74ed3692d23d0d14014c038e0c5d6d5754238d`.**
Evidence/report commit следует за ним в той же ветке; точный hash: `git log -1 --format=%H -- tasks/portfolio-rebuild/art-direction`, также сообщается в финальном сообщении. Source ref указан отдельно, чтобы reports не требовали самоссылки на собственный commit.

- [Текущий EN](http://127.0.0.1:4394/) / [RU](http://127.0.0.1:4394/ru/).
- [Before / After / References + 12 native recordings](http://127.0.0.1:4396/art-review.html).
- [Portal: точный native край](http://127.0.0.1:4394/work/partner-portal/#domain-system), [Learn](http://127.0.0.1:4394/work/learn/#one-material), [Kit](http://127.0.0.1:4394/kit/#h-native-routes).
- Frozen [4392 EN](http://127.0.0.1:4392/) / [RU](http://127.0.0.1:4392/ru/); checkout `D:/Claude-projects/Site-portfolio/tmp/portfolio-final-f01` clean на c0c6904.

Ключевые кадры: `shots/scenes/work-{agent-ops-console,partner-portal,learn,vet-clinic,pawly}.png`, `domain-system.png`, `shared-material.png`, `shots/after/*-agent-ops-console-finale.png`. Сравнивать canonical `shots/before-corrected/` с `shots/after/`, а не ранний lazy baseline. EN/RU ×1440/390, вход/середина/финал доступны в gallery.

Записи всех шести маршрутов: `recordings/after/*-walkthrough.webm`, EN1440 и RU390. Home27.32/31.00s с остановками на пяти сценах; case записи — быстрые walkthrough, native Learn toggle и CaseNext/Back. Таймкоды/длительности — `recording-inspection.json` и report.md. Initial fast Home сохранён отдельно.

Последние проверки: build36 страниц; check116 файлов,0 errors/warnings; CSS35 маршрутов,0 dead. Последние24 visual profiles и60 focused Home/Learn/Kit full/reduce/no-JS —0 failures. Более ранние144+12 предшествуют окончательному Home interlock, его отдельно проверяет24+2 lifecycle retest. Не выдавать их за новый общий ретест144. Harmony456→trim→EN450/RU402, retest0. Native alpha/source/DS parity — JSON.

Факты, порядок, slugs и CaseNext соблюдены. Portal после создания demo заказа теряет исходный source snapshot; обещание не добавлено. Vet30 — ограничение задачи, Agent19/3 — scope, Pawly photo/demo явно обозначены. Product sources readonly, reference pixels только для private review.

Ответ исполнителя на обязательный вопрос — «Да», с доказательствами сценами и сравнением в report.md и Before/After/Why в review.md. Следующий шаг контроллера: независимо посмотреть production и recordings рядом с references. При расхождении художественной оценки вернуть конкретный кадр/таймкод в тот же checkout. Только после положительной H-art-review контроллер обновляет цепочку и heartbeat.

Reproduction: `npm ci`, `npm run build`, `npm run preview -- --host 127.0.0.1 --port 4394` в этом checkout; отдельно `python -m http.server 4396 --bind 127.0.0.1 --directory tasks/portfolio-rebuild/art-direction`. Полные проверки, версии и границы — report.md. Push/deploy не входят в пакет.
