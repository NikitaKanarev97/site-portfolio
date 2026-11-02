import { defineDiagram } from '../schema';
/** Editorial selection from the current model; entities have no invented screen numbers. */
export const learnContentModel = defineDiagram({
  kind: 'flow',
  title: { en: 'Two entrances to one material', ru: 'Два входа в один материал' },
  summary: {
    en: 'A question and an ordered programme reference the same material. Reading creates a history record. Completion requires an explicit action. Assessment has its own attempt; opening an article never counts as a pass.',
    ru: 'Рабочий вопрос и последовательная программа ссылаются на один материал. Чтение создаёт запись истории. Завершение требует явного действия. У зачёта отдельная попытка; открытие статьи не означает успешную сдачу.',
  },
  size: { w: 112, h: 60 },
  nodes: [
    { id: 'question', type: 'entry', at: [4, 1], w: 27, label: { en: 'A working question', ru: 'Рабочий вопрос' }, actions: [{ label: { en: 'find an answer', ru: 'найти ответ' } }] },
    { id: 'programme', type: 'entry', at: [80, 1], w: 27, label: { en: 'A programme', ru: 'Программа' }, actions: [{ label: { en: 'sequence and curriculum', ru: 'порядок и состав' } }] },
    { id: 'material', type: 'screen', at: [40, 21], w: 34, label: { en: 'Material', ru: 'Материал' }, actions: [{ label: { en: 'version and date', ru: 'версия и дата' } }, { label: { en: 'a complete answer', ru: 'полный ответ' } }] },
    { id: 'reading', type: 'screen', at: [4, 46], w: 27, label: { en: 'Reading', ru: 'Чтение' }, actions: [{ label: { en: 'saved in history', ru: 'запись в истории' } }] },
    { id: 'completion', type: 'screen', at: [40, 46], w: 34, label: { en: 'Completion', ru: 'Завершение' }, actions: [{ label: { en: 'an explicit action', ru: 'явное действие' } }] },
    { id: 'assessment', type: 'screen', at: [80, 46], w: 27, label: { en: 'Assessment', ru: 'Зачёт' }, actions: [{ label: { en: 'a separate attempt', ru: 'отдельная попытка' } }] },
  ],
  edges: [
    { id: 'question-material', from: 'question', to: 'material', exit: 'b', enter: 'l', via: [[17.5, 23.5]] },
    { id: 'programme-material', from: 'programme', to: 'material', exit: 'b', enter: 'r', via: [[93.5, 23.5]] },
    { id: 'material-reading', from: 'material', to: 'reading', exit: 'l', enter: 't', via: [[35, 23.5], [35, 38], [17.5, 38]] },
    { id: 'material-completion', from: 'material', to: 'completion', exit: 'b', enter: 't' },
    { id: 'completion-assessment', from: 'completion', to: 'assessment', exit: 'r', enter: 'l' },
  ],
  mobile: { size: { w: 28, h: 112 }, nodes: [
    { id: 'question', at: [2, 0], w: 24 }, { id: 'programme', at: [2, 18], w: 24 },
    { id: 'material', at: [2, 39], w: 24 }, { id: 'reading', at: [2, 64], w: 24 },
    { id: 'completion', at: [2, 83], w: 24 }, { id: 'assessment', at: [2, 102], w: 24 },
  ], edges: [
    { id: 'question-material', exit: 'l', enter: 'l', via: [[0, 2.5], [0, 41.5]] },
    { id: 'programme-material', exit: 'b', enter: 't' },
    { id: 'material-reading', exit: 'b', enter: 't' },
    { id: 'material-completion', exit: 'r', enter: 'r', via: [[28, 41.5], [28, 85.5]] },
    { id: 'completion-assessment', exit: 'b', enter: 't' },
  ] },
});
