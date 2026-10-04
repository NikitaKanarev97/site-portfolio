# G-final · конечная передача

**Статус: локальный сайт готов к просмотру.** Все пять принятых историй подключены в EN/RU; Home, Next, оболочка, SEO и общий слой согласованы. Открытых common-requests и legacy migrations нет. Приёмка B–F выполнена координатором по ночному поручению; художественная приёмка владельца не заявляется.

- Frozen code ref: 93b9f7f5a260636b878fd0d67f863c675e410065.
- Ветка: codex/portfolio-integration-g; последующая metadata добавляет только отчёт, текущий указатель и доказательства.
- Чистый checkout: D:/Claude-projects/Site-portfolio/tmp/portfolio-final-93b9f7f.
- Preview: [EN](http://127.0.0.1:4391/) / [RU](http://127.0.0.1:4391/ru/) / [Portal, красный контур](http://127.0.0.1:4391/work/partner-portal/#domain-system).
- [Итоговый отчёт](report.md), [точная база](base.md), [1270 canonical files](final/code-manifest.json), [воспроизведение](final/reproduction.json), [QA summary](final/qa-summary.json).
- [Порядок и причины](final/order-review.md), [обложки, первые два экрана и полные EN/RU кадры](final/visual-gallery.md).

Исходные refs A–F и соответствие собственных commits записаны в report.md и final-handoff.json. D/E/F: 632 собственных файла совпали с принятыми источниками. Готовый порядок — Agent Ops → Portal → Learn → Vet → Pawly; рекомендация оставить его, возможная альтернатива Portal first объяснена в сравнении.

Check/build/CSS: 0 errors/0 warnings, 101 существующий hint, 36 страниц/36 CSS routes без dead rules. 336 site profiles с закрытыми 26 ошибками harness; 51 final-delta, 112 Harmony, 36 native motion/96 switches, 11 control routes/48 switches. Film: 6 playback и 6 lifecycle/geometry observations; единственная initial URL-assertion ошибка закрыта отдельным retest. Все конечные проверки без failures, исходная failed history сохранена. Чистое воспроизведение: 1270 файлов / 245198805 bytes, npm ci/check/build/CSS exit 0, status clean; 28 launch profiles и 2 no-JS film playback без failures.

Ограничения: локальный Chromium, без физических устройств/других движков; hidden-tab branch проверен синтетически; внешние ссылки не открывались, сообщений не отправлялось, CPU benchmark не выполнялся. npm ci сообщает 11 унаследованных advisories, исправление зависимостей не входит в текущий этап. Push/deploy не выполнялись. Production требует отдельного явного поручения. CONTROL/STATE остаются у контроллера; G не создаёт/не запускает чаты и не меняет orchestration.

Для нового checkout использовать полный frozen ref, npm ci/check/build; verifier запускается из текущего root с --root=<fresh-checkout>. Preview 4391 обслуживает неизменённый frozen checkout; root preview 4390 относится к той же финальной source-сборке. Старые common origins и base refs исторические и не заменяют этот финальный адрес.
