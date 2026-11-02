/** Case-only editorial layer. Product evidence: outputs/case-study.md §§ research/testing/result.
 * V2 home copy and accepted image pixels remain unchanged. */
export type AgentPremiumCopy = {
  scope: string; heroCaption: string; heroAlt: string;
  problemAside: string; problemCost: string;
  model: { label: string; estimate: string; sizingLabel: string; input: string; decision: string; yes: string; no: string; sample: string; commitment: string; cluster: string; review: string; branches: {role:string;title:string;text:string}[]; close: string; feedback: string; note: string };
  investigation: { title:string;body:string;cue:string }[];
  checkpoint: { label:string;stages:{title:string;body:string}[];caption:string };
  policy: { stages:{title:string;text:string}[];warning:string;captions:string[] };
  autonomy: { intro:string;states:{title:string;text:string}[];proof:string;inspect:string;specimenAlt:string;specimenCaption:string };
  process: { label:string;title:string;columns:string[];rows:{observation:string;decision:string;validation:string}[];result:{label:string;text:string}[];boundary:string };
};
export const agentPremiumEn: AgentPremiumCopy = {
  scope: 'Research → product architecture → UX/UI → design system → tested React / Storybook prototype.',
  heroCaption: 'A human checkpoint before an AI promise becomes a financial action.',
  heroAlt: 'Action Approvals: a $120 invoice credit and the customer message, held for explicit human confirmation. Desktop shows the complete selected task; mobile shows its genuine consequence panels.',
  problemAside: 'The vendor measured resolution. The team needed to see the commitments inside it.',
  problemCost: 'paid by the client after fourteen refund promises based on an expired promotion. The incident surfaced around nineteen days later.',
  model: {
    label: 'The operating model I designed', estimate: 'Design-time sizing · not a measured result', sizingLabel:'automated conversations → commitments per day',
    input: 'AI support conversations', decision: 'A consequential commitment?', yes: 'Yes · every commitment', no: 'No · risk-based sample',
    sample: 'Other conversations enter a ranked QA sample.', commitment: 'Refund · credit · plan change · consequential promise',
    cluster: 'Group repeated causes. Prioritize exposure.', review: 'Reviewer · inspect sources, trace and customer history',
    branches: [
      {role:'Shift Lead',title:'Authorize an action',text:'Check the consequence. Confirm, or reject with a reason.'},
      {role:'Shift Lead / Policy Owner',title:'Correct the source',text:'Bound and approve the change. Widening authority needs the Policy Owner; verify the version used.'},
    ],
    close: 'Quality evidence → capability boundary', feedback: 'A critical defect lowers the affected capability automatically.',
    note: 'Editorial reconstruction of documented logic. Sampled QA can also lead to investigation. These are related paths, not mandatory sequential screens.',
  },
  investigation: [
    {title:'Start with the repeated cause.',body:'One outdated article can create many promises. I put the cause cluster above individual runs and ranked it by exposure, so review starts where one correction can address repeated harm.',cue:'Read the cluster before its individual members.'},
    {title:'Then question the decision.',body:'The verdict sits beside the promise, the policy and the billing trace. A missing trace is explicitly different from an unused source: incomplete evidence must not become a confident verdict.',cue:'Separate fixture · Nordwind’s $1,120 run is not a member of the promotion cluster.'},
  ],
  checkpoint: {label:'Portfolio reading guide · outside the captured interface',stages:[
    {title:'What the AI requested',body:'A $120 service credit for Ferrum Logistics. The reviewer sees why the agent asks, its policy limit and the customer’s recent credit history.'},
    {title:'What will actually happen',body:'The amount is credited on the next invoice; no cash leaves the account. The exact customer-visible message is shown alongside the billing consequence.'},
    {title:'What the person decides',body:'Approve opens a final confirmation. Nothing is credited or sent before confirmation. Reject requires a reason, preserving a route back to the source of the error.'},
  ],caption:'One synthetic approval fixture throughout this reading guide. Native UI stays intact.'},
  policy: {stages:[
    {title:'Trace the cause',text:'Keep the originating cluster and reason.'},
    {title:'Bound the draft',text:'Make capability, region, limit and authority explicit.'},
    {title:'Approve & apply',text:'Track approval and application separately.'},
    {title:'Verify the agent',text:'In the rollout example, the agent still confirms v4.'},
  ],warning:'Rollout example unresolved · applied v5 ≠ agent-confirmed v4',captions:['Policy Editor · separate draft example, v5 → v6. Genuine mobile boundary panel; full screen available.','Version Diff · separate rollout example, v4 / v5. Approval and application are complete; agent confirmation is not.']},
  autonomy: {intro:'A design system for decisions, not just consistent screens.',states:[
    {title:'Evidence',text:'Quality signals open the underlying records. Date, scope and data coverage stay visible.'},
    {title:'Permission',text:'Each capability has its own boundary. Readiness still needs an explicit promotion decision.'},
    {title:'Reversal',text:'A severity-1 defect lowers the affected capability automatically. Clean evidence is needed to earn it back.'},
  ],proof:'Native capability states · synthetic product data',inspect:'Inspect the full quality dashboard',specimenAlt:'Three native capability states: pricing policy L3 is ready for L4; service credit L2 is ready for L3; refund was automatically lowered from L3 to L2.',specimenCaption:'Excerpt from the accepted screen · three complete states; inspect the full screen for context.'},
  process: {label:'Research → decision → validation',title:'The design changed when people used it.',columns:['Research revealed','I designed','Testing changed'],rows:[
    {observation:'The same source could create many costly promises.',decision:'Cause clusters became the top level of the queue.',validation:'Reviewers needed cluster membership and a way to exclude false matches before grouped correction.'},
    {observation:'A verdict could affect policies and reporting.',decision:'Evidence and the verdict share one investigation workspace.',validation:'A short undo window lets reviewers recover from an incorrect verdict.'},
    {observation:'A correction without a visible destination loses trust.',decision:'Structured reasons route an error toward its source owner.',validation:'Reviewers can follow the fate of their correction; missing traces explain why evidence is unavailable.'},
  ],result:[
    {label:'Delivered',text:'Interactive React / Storybook prototype and design system. I owned research, requirements, architecture and product UX/UI.'},
    {label:'Validated',text:'Tested with current and future users, then revised. Participant identities and counts remain under NDA.'},
    {label:'Confirmed',text:'The client accepted the prototype and continued implementation independently.'},
  ],boundary:'This case evidences the design and tested prototype. Production deployment and business uplift were not measured in this engagement.'},
};

export const agentPremiumRu: AgentPremiumCopy = {
  scope: 'Исследование → архитектура → UX/UI → дизайн-система → проверенный прототип на React / Storybook.',
  heroCaption: 'Решение человека до того, как обещание ИИ станет финансовым действием.',
  heroAlt: 'Согласование действий: кредит $120 в следующем счёте и сообщение клиенту ждут явного подтверждения человека. На desktop — вся карточка, на mobile — родные панели последствий.',
  problemAside: 'Вендор измерял закрытые обращения. Команде нужно было видеть обязательства внутри них.',
  problemCost: 'заказчик выплатил по четырнадцати обещаниям возврата на основе истёкшей акции. Инцидент обнаружили примерно через девятнадцать дней.',
  model: {
    label: 'Спроектированная мной модель работы',estimate:'Проектная оценка нагрузки · не измеренный результат',sizingLabel:'автоматических диалогов → обязательств в день',
    input:'Диалоги ИИ-поддержки',decision:'Есть обязательство с последствиями?',yes:'Да · каждое обязательство',no:'Нет · выборка по риску',
    sample:'Остальные диалоги попадают в ранжированную QA-выборку.',commitment:'Возврат · кредит · смена тарифа · обещание с последствиями',
    cluster:'Объединить причины. Расставить приоритеты по риску.',review:'Reviewer · изучить источники, трейс и историю клиента',
    branches:[
      {role:'Shift Lead',title:'Согласовать действие',text:'Проверить последствие. Подтвердить или отклонить с причиной.'},
      {role:'Shift Lead / Policy Owner',title:'Исправить источник',text:'Ограничить и согласовать изменение. Расширение прав требует Policy Owner; версию у агента нужно проверить.'},
    ],close:'Доказательства качества → граница полномочий',feedback:'Критическая ошибка автоматически снижает уровень затронутого действия.',
    note:'Редакционная схема по документированной логике. Выборка тоже может привести к расследованию. Это связанные ветки, а не обязательная цепочка экранов.',
  },
  investigation:[
    {title:'Начать с повторяющейся причины.',body:'Одна устаревшая статья порождает много обещаний. Я поднял кластер причины над отдельными прогонами и добавил сортировку по риску: одна корректировка устраняет повторяющийся вред.',cue:'Сначала причина, затем состав кластера.'},
    {title:'Проверить конкретное решение.',body:'Обещание, политика и трейс биллинга находятся рядом с вердиктом. Отсутствие трейса явно отличается от неиспользованного источника: неполные данные не должны становиться уверенным выводом.',cue:'Отдельный пример · прогон Nordwind на $1 120 не входит в кластер акции.'},
  ],
  checkpoint:{label:'Редакционное пояснение · за пределами снимка интерфейса',stages:[
    {title:'Что запросил ИИ',body:'Сервисный кредит $120 для Ferrum Logistics. Проверяющий видит основание запроса, лимит политики и недавнюю историю кредитов клиента.'},
    {title:'Что произойдёт на самом деле',body:'Сумма зачтётся в следующем счёте; деньги со счёта компании не уходят. Точный текст сообщения клиенту стоит рядом с финансовым последствием.'},
    {title:'Что решает человек',body:'Согласование открывает финальную проверку. До подтверждения ничего не зачисляется и не отправляется. Отказ требует причины и сохраняет путь к исправлению источника ошибки.'},
  ],caption:'Во всём пояснении — один синтетический пример согласования. Родной интерфейс сохранён целиком.'},
  policy:{stages:[
    {title:'Найти причину',text:'Сохранить исходный кластер и основание.'},
    {title:'Ограничить черновик',text:'Указать действие, регион, лимит и полномочия.'},
    {title:'Согласовать и применить',text:'Отдельно отследить согласование и применение.'},
    {title:'Проверить агента',text:'В примере применения агент всё ещё подтверждает v4.'},
  ],warning:'Применение не закрыто · применённая v5 ≠ подтверждённая агентом v4',captions:['Редактор политик · отдельный пример черновика v5 → v6. Родная панель границ; полный экран доступен.','Сравнение версий · отдельный пример применения v4 / v5. Согласование и применение завершены, подтверждение агентом — нет.']},
  autonomy:{intro:'Дизайн-система для решений, а не только единообразных экранов.',states:[
    {title:'Доказательства',text:'Показатели раскрываются до исходных записей. Дата, область и полнота данных остаются видны.'},
    {title:'Полномочия',text:'У каждого действия своя граница. Готовность к повышению требует явного решения человека.'},
    {title:'Откат',text:'Ошибка первой серьёзности автоматически снижает уровень затронутого действия. Для возврата нужны чистые данные.'},
  ],proof:'Родные состояния полномочий · синтетические данные',inspect:'Рассмотреть полный дашборд качества',specimenAlt:'Родные состояния трёх действий: тарифная политика L3 готова к L4, кредит L2 готов к L3, возврат автоматически снижен с L3 до L2.',specimenCaption:'Фрагмент принятого экрана · три целых состояния; полный экран доступен в увеличении.'},
  process:{label:'Исследование → решение → проверка',title:'Дизайн изменился, когда им воспользовались люди.',columns:['Что показало исследование','Что я спроектировал','Что изменили тесты'],rows:[
    {observation:'Один источник порождал много дорогих обещаний.',decision:'Кластеры причин стали верхним уровнем очереди.',validation:'Для групповой корректировки понадобились состав кластера и исключение ложных совпадений.'},
    {observation:'Вердикт влиял на политики и отчётность.',decision:'Доказательства и вердикт собраны в одном рабочем пространстве.',validation:'Короткое окно отмены позволяет исправить ошибочный вердикт.'},
    {observation:'Коррекция без видимого адресата теряла доверие.',decision:'Структурированная причина направляет ошибку владельцу источника.',validation:'Reviewer видит судьбу коррекции; отсутствие трейса объясняется причиной недоступности данных.'},
  ],result:[
    {label:'Передано',text:'Интерактивный прототип на React / Storybook и дизайн-система. Я отвечал за исследование, требования, архитектуру и продуктовый UX/UI.'},
    {label:'Проверено',text:'Тестирование с действующими и будущими пользователями, затем доработка. Имена и количество участников закрыты NDA.'},
    {label:'Подтверждено',text:'Заказчик принял прототип и продолжил реализацию самостоятельно.'},
  ],boundary:'В кейсе показаны дизайн и проверенный прототип. В рамках этой работы запуск и коммерческий эффект не измерялись.'},
};
