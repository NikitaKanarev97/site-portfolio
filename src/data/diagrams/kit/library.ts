/**
 * Образец листа библиотеки для /kit. Продукт-заглушка, в кейсы не переносится.
 * Hex и кегли здесь — данные чужого продукта, а не токены ДС
 * (ds/patterns.md §Диаграммы, «Лист библиотеки»).
 */
import { defineDiagram } from '../schema';

export default defineDiagram({
  kind: 'library',
  title: { en: 'Components library: client account', ru: 'Библиотека компонентов: кабинет клиента' },
  summary: {
    en: 'Type scale of seven styles, the colour palette with tints, and component sets with their states.',
    ru: 'Шкала из семи стилей, палитра с оттенками и наборы компонентов с состояниями.',
  },
  heading: { en: 'Components library', ru: 'Библиотека компонентов' },
  fontFamily: 'Inter',
  type: [
    { style: 'H1', usage: { en: 'Titles', ru: 'Заголовки экранов' }, size: 28, lineHeight: 32, weight: 500, sample: { en: 'Services', ru: 'Услуги' } },
    { style: 'H2', usage: { en: 'Promo titles', ru: 'Промо' }, size: 22, lineHeight: 28, weight: 500, sample: { en: 'One plan, more bonuses', ru: 'Один тариф, больше бонусов' } },
    { style: 'H3', usage: { en: 'Card titles', ru: 'Карточки' }, size: 18, lineHeight: 26, weight: 500, sample: { en: 'Loyalty programme', ru: 'Программа лояльности' } },
    { style: 'H4', usage: { en: 'Subtitles, buttons', ru: 'Подзаголовки, кнопки' }, size: 16, lineHeight: 22, weight: 500, sample: { en: 'Bank', ru: 'Банк' } },
    { style: 'Text', usage: { en: 'Text in cards', ru: 'Текст в карточках' }, size: 16, lineHeight: 22, weight: 400, sample: { en: 'Paid until 29 May', ru: 'Оплачено до 29 мая' } },
    { style: 'Body', usage: { en: 'General text', ru: 'Основной текст' }, size: 14, lineHeight: 20, weight: 400, sample: { en: 'The balance must stay above the monthly fee to keep the plan active.', ru: 'Чтобы тариф оставался активным, баланс должен быть выше абонентской платы.' } },
    { style: 'Auxiliary', usage: { en: 'Pop-ups, descriptions', ru: 'Поп-апы, пояснения' }, size: 12, lineHeight: 16, weight: 500, sample: { en: 'Changes apply from the next billing day.', ru: 'Изменения вступят в силу со следующего расчётного дня.' } },
  ],
  colors: [
    { name: 'Primary', hex: '#2563EB', tints: [{ name: 'Primary 700', hex: '#1D4ED8' }, { name: 'Primary 100', hex: '#DBEAFE' }, { name: 'Primary', hex: '#2563EB', alpha: 15 }] },
    { name: 'Neutral 900', hex: '#111827', tints: [{ name: 'Neutral 700', hex: '#374151' }, { name: 'Neutral 500', hex: '#6B7280' }, { name: 'Neutral 200', hex: '#E5E7EB' }] },
    { name: 'Error', hex: '#DC2626', tints: [{ name: 'Error', hex: '#DC2626', alpha: 10 }] },
    { name: 'Success', hex: '#16A34A', tints: [{ name: 'Success 100', hex: '#DCFCE7' }] },
  ],
  palette: {
    primary: '#2563EB',
    primaryPressed: '#1D4ED8',
    primaryLight: '#DBEAFE',
    ink: '#111827',
    muted: '#6B7280',
    line: '#E5E7EB',
    surface: '#FFFFFF',
    error: '#DC2626',
  },
  radius: 8,
  sets: [
    {
      title: { en: 'Button', ru: 'Кнопка' },
      items: [
        { block: 'button', label: { en: 'Send a letter', ru: 'Отправить письмо' } },
        { block: 'button', state: 'pressed', label: { en: 'Send a letter', ru: 'Отправить письмо' } },
        { block: 'button', state: 'light', label: { en: 'Send a letter', ru: 'Отправить письмо' } },
        { block: 'button', state: 'disabled', label: { en: 'Send a letter', ru: 'Отправить письмо' } },
      ],
    },
    {
      title: { en: 'Text field', ru: 'Поле' },
      items: [
        { block: 'field', hint: { en: 'Name', ru: 'Имя' }, label: { en: '', ru: '' } },
        { block: 'field', state: 'filled', hint: { en: 'Name', ru: 'Имя' }, label: { en: 'John Smith', ru: 'Иван Петров' } },
        { block: 'field', state: 'focus', hint: { en: 'Name', ru: 'Имя' }, label: { en: 'John', ru: 'Иван' } },
        { block: 'field', state: 'disabled', hint: { en: 'Name', ru: 'Имя' }, label: { en: 'John Smith', ru: 'Иван Петров' } },
        { block: 'field', state: 'error', hint: { en: 'Name is required', ru: 'Укажите имя' }, label: { en: 'J', ru: 'И' } },
      ],
    },
    {
      title: { en: 'List row', ru: 'Строка списка' },
      items: [
        { block: 'row', label: { en: 'Change the plan', ru: 'Сменить тариф' } },
        { block: 'row', state: 'pressed', label: { en: 'Change the plan', ru: 'Сменить тариф' } },
        { block: 'row', state: 'disabled', label: { en: 'Suspend the service', ru: 'Приостановить услугу' } },
      ],
    },
    {
      title: { en: 'Controls', ru: 'Контролы' },
      items: [
        { block: 'checkbox', state: 'on', label: { en: 'I agree', ru: 'Согласен' } },
        { block: 'checkbox', label: { en: 'I agree', ru: 'Согласен' } },
        { block: 'checkbox', state: 'disabled', label: { en: 'I agree', ru: 'Согласен' } },
        { block: 'radio', state: 'on', label: { en: 'Call', ru: 'Звонок' } },
        { block: 'radio', label: { en: 'Email', ru: 'Почта' } },
        { block: 'toggle', state: 'on', label: { en: 'Autopay', ru: 'Автоплатёж' } },
        { block: 'toggle', label: { en: 'Autopay', ru: 'Автоплатёж' } },
      ],
    },
    {
      title: { en: 'Tabs and badge', ru: 'Вкладки и метка' },
      items: [
        { block: 'tab', state: 'on', label: { en: 'All', ru: 'Все' } },
        { block: 'tab', label: { en: 'Alerts', ru: 'Уведомления' } },
        { block: 'badge', label: { en: '+100 pts', ru: '+100 баллов' } },
      ],
    },
  ],
});
