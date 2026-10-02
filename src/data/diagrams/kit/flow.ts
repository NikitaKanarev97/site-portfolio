/**
 * Образец user flow для /kit. Продукт-заглушка, в кейсы не переносится.
 * Начало сценария (запуск → вход) общее с другими флоу и стоит бледным;
 * новая часть — в полную силу. Есть ромбы с yes/no, параллелограммы ввода
 * и переход в другой флоу.
 */
import { defineDiagram } from '../schema';

export default defineDiagram({
  kind: 'flow',
  title: { en: 'User flow: change the plan', ru: 'User flow: смена тарифа' },
  summary: {
    en: 'After sign-in the client either picks a known plan in Services or gets help choosing one; with enough funds the plan changes after a code confirmation, otherwise the client goes to the top-up flow.',
    ru: 'После входа клиент либо сразу выбирает тариф в «Услугах», либо получает помощь с выбором; при достаточном балансе тариф меняется после подтверждения кодом, иначе клиент уходит во флоу пополнения.',
  },
  heading: { lead: { en: 'User flow', ru: 'User flow' }, name: { en: 'Change the plan', ru: 'Смена тарифа' } },
  size: { w: 136, h: 62 },
  nodes: [
    /* Общий префикс — бледный. */
    { id: 'start', type: 'start', at: [2, 6], label: { en: 'Launch the app', ru: 'Запуск' }, dim: true },
    { id: 'splash', type: 'screen', at: [24, 6], label: { en: 'Splash', ru: 'Заставка' }, dim: true },
    { id: 'loginScreen', type: 'screen', at: [42, 6], label: { en: 'Sign-in', ru: 'Экран входа' }, dim: true },
    { id: 'hasAccount', type: 'decision', at: [64, 0.5], label: { en: 'Already have an account', ru: 'Аккаунт уже есть' }, dim: true },
    { id: 'signup', type: 'screen', at: [88, 6], w: 16, label: { en: 'Sign up', ru: 'Регистрация' }, dim: true },
    { id: 'fill', type: 'input', at: [88, 16], w: 16, label: { en: 'Fill info', ru: 'Данные' }, dim: true },
    { id: 'login', type: 'screen', at: [64, 22], w: 16, label: { en: 'Log in', ru: 'Вход' }, dim: true },

    /* Новая часть сценария. */
    { id: 'home', type: 'screen', at: [2, 34], w: 14, label: { en: 'Home', ru: 'Главная' } },
    { id: 'knowPlan', type: 'decision', at: [22, 28.5], label: { en: 'Knows the plan they want', ru: 'Тариф уже выбран' } },
    { id: 'services', type: 'screen', at: [46, 34], w: 16, label: { en: 'Services', ru: 'Услуги' } },
    { id: 'manage', type: 'screen', at: [68, 34], w: 18, label: { en: 'Manage plan', ru: 'Управление' } },
    { id: 'funds', type: 'decision', at: [92, 28.5], label: { en: 'Enough funds on balance', ru: 'Баланса хватает' } },
    { id: 'change', type: 'screen', at: [116, 34], w: 18, label: { en: 'Change plan', ru: 'Смена тарифа' } },
    { id: 'confirm', type: 'input', at: [114, 44], w: 22, label: { en: 'Confirm with code', ru: 'Код из СМС' } },
    { id: 'done', type: 'screen', at: [119, 54], w: 12, label: { en: 'Done', ru: 'Готово' } },

    { id: 'assist', type: 'screen', at: [19, 50], w: 22, label: { en: 'Plan assistance', ru: 'Помощь с выбором' } },
    { id: 'choose', type: 'screen', at: [46, 50], w: 18, label: { en: 'Choose a plan', ru: 'Выбор тарифа' } },
    { id: 'topup', type: 'flowLink', at: [88, 50], w: 24, label: { en: 'Top up balance flow', ru: 'Флоу пополнения' } },
  ],
  edges: [
    { from: 'start', to: 'splash', dim: true },
    { from: 'splash', to: 'loginScreen', dim: true },
    { from: 'loginScreen', to: 'hasAccount', dim: true },
    { from: 'hasAccount', to: 'signup', answer: 'no', dim: true },
    { from: 'hasAccount', to: 'login', answer: 'yes', exit: 'b', enter: 't', dim: true },
    { from: 'signup', to: 'fill', dim: true },
    { from: 'fill', to: 'login', exit: 'b', enter: 'r', dim: true },
    { from: 'login', to: 'home', exit: 'l', enter: 't', dim: true },

    { from: 'home', to: 'knowPlan' },
    { from: 'knowPlan', to: 'services', answer: 'yes' },
    { from: 'knowPlan', to: 'assist', answer: 'no', exit: 'b', enter: 't' },
    { from: 'assist', to: 'choose' },
    { from: 'choose', to: 'manage', exit: 'r', enter: 'b' },
    { from: 'services', to: 'manage' },
    { from: 'manage', to: 'funds' },
    { from: 'funds', to: 'change', answer: 'yes' },
    { from: 'funds', to: 'topup', answer: 'no', exit: 'b', enter: 't' },
    { from: 'change', to: 'confirm', exit: 'b', enter: 't' },
    { from: 'confirm', to: 'done', exit: 'b', enter: 't' },
  ],
});
