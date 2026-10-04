# Общие запросы E

## E-G-01 · native film в ordered story · открыт

Frozen `ShotItem` не имеет film, а `CaseScreen` вызывает MediaFrame без film. Передача video создаёт autoplay loop и custom pause; это противоречит заданному return-proof.

Конкретный пример: `return-boundary`, средний шаг `handover-photo-review`, `/media/rebuild/pawly/en/clip-return-proof` и RU-пара. Ожидается optional `film?: boolean` у ShotItem → CaseScreen → существующий MediaFrame film, без нового motion-исполнителя. Native controls, explicit play, no loop/autoplay, poster и все static end states. Тогда companion из собственного preview можно перенести на штатное место вместо статичного local review, сохранив poster.

Обхода schema/renderer нет. В текущем preview полный story сохраняет static sequence, а фильм доступен ранней native ссылкой и отдельным MediaFrame film после рассказа. Production integration должен закрыть этот запрос до подключения фильма в story. B-G-01 не повторяется.

## E-G-02 · film codec без JS · открыт

Конкретный пример: оба `/preview/pawly-rebuild/{en,ru}/#return-proof`, Chromium 1243, JS disabled. WebM — первый source, readyState=0, duration=NaN, error=null после ожидания metadata. При JS включённом существующий MediaFrame выбирает MP4; full/reduce играют, full заканчивается на 10.966667 s. Исходные MP4/WebM и poster совпадают побайтово.

Ожидается native playback с безопасным начальным codec и без зависимости от JS fallback, например MP4 первым source **только для film**, сохранив WebM и ручные controls. Если codecs недоступны, постер и статичные конечные состояния должны оставаться читаемыми. Полная статичная no-JS версия уже работает; no-JS playback в проверенном Chromium не объявляется PASS. Данные: film-verification.json, два no-js профиля.

## E-G-03 · film при уходе из viewport · открыт

Конкретный пример: EN, 390×844, reduce; читатель вручную запускает `#return-proof video`, прокручивает к cover и возвращается. Уход/возврат сохраняют paused=false; film branch общего MediaFrame возвращается до visibility observer. Это расходится с resource release при уходе из data-and-motion §8.

Ожидается пауза при уходе фильма из окна/скрытии документа, сохранение ручного режима при возвращении и cleanup существующих наблюдателей в общем слое. Не запускать фильм автоматически и не перематывать его как looping clip. В фактическом тесте переход на Agent Ops отключает video (connected=false, paused=true), Back возвращает один film на паузе; эти части не объявляются сломанными. Данные: film-verification.json, leave-viewport и return-viewport. Изменение только общего исполнителя G, без отдельного E handler.
