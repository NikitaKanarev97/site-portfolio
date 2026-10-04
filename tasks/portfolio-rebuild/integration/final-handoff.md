> **G-final-F01 закрыт.** Ниже технический G handoff; новые Home promises, 24 current profiles и точная идентичность 1269 неизменённых paths — [correction-f01/report.md](final/correction-f01/report.md). Root import 41c09115a34fb3c552557c7e7f8b01f87c02b51a. Новое обязательное H-art-direction/H-art-review по PLAN остаётся у контроллера; общая художественная цепочка не объявляется завершённой.

# G-final · конечная передача

**Статус: технический локальный сайт готов к просмотру и этапу H.** Все пять принятых историй подключены в EN/RU; Home, Next, оболочка, SEO и общий слой согласованы. Открытых common-requests и legacy migrations нет. Приёмка B–F выполнена координатором по ночному поручению; художественная приёмка владельца не заявляется.

- Frozen code ref: c0c69040801d60bcfc836f6728f2ae806911be1d.
- Ветка: codex/portfolio-integration-g; последующая metadata добавляет только отчёт, текущий указатель и доказательства.
- Чистый checkout: D:/Claude-projects/Site-portfolio/tmp/portfolio-final-f01.
- Preview: [EN](http://127.0.0.1:4392/) / [RU](http://127.0.0.1:4392/ru/) / [Portal, красный контур](http://127.0.0.1:4392/work/partner-portal/#domain-system).
- [Итоговый отчёт](report.md), [точная база](base.md), [1270 canonical files](final/code-manifest.json), [воспроизведение](final/reproduction.json), [QA summary](final/qa-summary.json).
- [Порядок и причины](final/order-review.md), [обложки, первые два экрана и полные EN/RU кадры](final/visual-gallery.md).

Исходные refs A–F и соответствие собственных commits записаны в report.md и final-handoff.json. D/E/F: 632 собственных файла совпали с принятыми источниками. Готовый порядок — Agent Ops → Portal → Learn → Vet → Pawly; рекомендация оставить его, возможная альтернатива Portal first объяснена в сравнении.

Check/build/CSS: 0 errors/0 warnings, 101 существующий hint, 36 страниц/36 CSS routes без dead rules. 336 site profiles с закрытыми 26 ошибками harness; 51 final-delta, 112 Harmony, 36 native motion/96 switches, 11 control routes/48 switches. Film: 6 playback и 6 lifecycle/geometry observations; единственная initial URL-assertion ошибка закрыта отдельным retest. Все конечные проверки без failures, исходная failed history сохранена. Чистое воспроизведение: 1270 файлов / 245198849 bytes, npm ci/check/build/CSS exit 0, status clean; 24 current Home profiles и 10 case URL checks без failures; прежние 28 launch/2 film launch — baseline до F01.

Ограничения: локальный Chromium, без физических устройств/других движков; hidden-tab branch проверен синтетически; внешние ссылки не открывались, сообщений не отправлялось, CPU benchmark не выполнялся. npm ci сообщает 11 унаследованных advisories, исправление зависимостей не входит в текущий этап. Push/deploy не выполнялись. Production требует отдельного явного поручения. CONTROL/STATE остаются у контроллера; G не создаёт/не запускает чаты и не меняет orchestration.

Для нового checkout использовать полный frozen ref, npm ci/check/build; verifier запускается из текущего root с --root=<fresh-checkout>. Preview 4392 обслуживает исправленный frozen checkout; root preview 4390 и прежний clean 4391 теперь исторические. Старые common origins и base refs исторические и не заменяют этот финальный адрес.
