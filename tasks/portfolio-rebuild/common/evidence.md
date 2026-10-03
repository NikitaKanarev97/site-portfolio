# Common A — evidence registry

04.10.2026. Демо общего контракта. Числа UI — synthetic fixtures; геометрия/артефакты созданы для нынешнего рассказа.

| ID | Утверждение и тип | Версия / источник | Граница | EN / RU |
|---|---|---|---|---|
| agent-problem | 61%, 14 обещаний, $23,000 — контекст задачи, факт владельца | `src/copy/cases/agent-ops-console.ts`, принятая карта и pilot | Не результаты дизайна, не post-launch эффект | Read the promises, not the chats / Читать обещания, а не переписки |
| agent-estimates | 71 commitments, 2.4 h, 177 h, 25 reviewers — проектная оценка | `src/copy/pilot/agent-ops.ts`, исходные факты кейса | Не измеренная экономия | Design estimates, not measured savings / Проектные оценки, не измеренная экономия |
| agent-panels | Причина, разговор, evidence и человеческое одобрение существуют в прототипе — демо | `public/media/pilot-agent-ops/`, источник Agent-ops-console, принятый checkpoint | $420 workspace и $340 approval — разные fixtures; не одна транзакция | Prototype data / Данные прототипа |
| agent-acceptance | Прототип протестирован, доработан и принят — факт владельца | Публичный `src/copy/cases/agent-ops-console.ts`; `src/copy/pilot/agent-ops.ts` | 19 экранов/3 роли — scope. Внедрение у клиента, бизнес-эффект не измерен | Tested, reworked and accepted / Проверен, доработан и принят |
| portal-scope | Два intake, один resolver и неизменяемое происхождение строки — реализованное правило текущего прототипа | b2b-dssl `ds/DECISIONS.md` D007–D010, `ia/sitemap.md`, flow; актуальный каталог | Редакционная выборка 7 экранов, не полная IA и не историческое исследование | One specification, two ways in / Одна спецификация, два входа |
| portal-domain | Различие identity и commercial states — проверяемый UI, демо | b2b-dssl `src/components/{ResolutionRow,FileUpload,Availability,QuantityStepper}`, accepted каталог 14.09; closeout 11.09 | Выбранные состояния, не полная матрица; реальные поля на synthetic data | Selected domain states / Выбранные доменные состояния |
| portal-shipped | Исходный коммерческий редизайн отгружен полностью — факт владельца | `src/copy/cases/partner-portal.ts` header Evidence и комментарий о подтверждении 24.08.2026; `ds/screens/case-dssl.md` | Текущий frontend — самостоятельная пересборка. NDA, нет baseline или открытых business metrics | Commercial redesign shipped / Коммерческий редизайн отгружен |
| portal-tradeoff | Неоднозначные строки разрешает покупатель — правило решения | D007 и нынешний ResolutionRow | Нет данных, подтверждающих совместимость за покупателя. Нельзя заявлять процент снижения ошибок | The buyer resolves ambiguity / Неоднозначность разрешает покупатель |

Outcome ссылается на evidence ID. Отдельные evidence/tradeoff поля обязательны; QA-счётчики не подменяют результат. Полные EN/RU кейсы B–E дополняют собственные реестры.
