/**
 * Ролик по маршруту показа B2B Partner Portal — сценарий.
 *
 * Маршрут взят из приёмки прототипа (`b2b-dssl/audit/product-polish/report-08.md`
 * § 8): индекс → вход → выбор компании → дашборд → импорт XLS → результат
 * разбора → очередь разбора → корзина → план отгрузки → оформление →
 * созданный заказ → карточка заказа. Аргумент ролика — конвейер
 * спецификации, а не набор экранов. Каталог, карточка товара, быстрый заказ
 * и системные маршруты в него не входят намеренно, по тому же отчёту:
 * браузинг — вторая история, быстрый заказ дублирует импорт по смыслу.
 *
 * Сценарий живёт отдельным модулем, потому что им пользуются два исполнителя:
 * `shoot-clips.mjs` водит его рукой и пишет скринкаст, а отладочный прогон
 * (`FILM_DEBUG=1`) нажимает те же контролы без записи и снимает кадр на
 * каждом шаге. Разойтись им негде.
 *
 * **Всё — контролами самого продукта.** Ни одного `goto` на продвинутый
 * маршрут после входа на индекс: состояние живёт в `sessionStorage` вкладки,
 * и зритель видит ровно то, что получил бы, пройдя путь сам. Строки разбора
 * решаются по одной их собственными панелями — первая медленно, чтобы было
 * видно сравнение кандидатов, остальные быстрее: доказательство в том, что
 * путь проходится до конца, а не в том, что его показали целиком одинаково.
 *
 * Подписи ищутся парой EN/RU: локаль прототипа — наложение поверх DOM, и
 * оригинала в разметке не остаётся. Русские пары взяты из
 * `b2b-dssl/src/i18n/RussianLocalization.tsx`.
 */

/** Точная подпись контрола в обеих локалях. */
const label = (en, ru) => new RegExp(`^\\s*(?:${en}|${ru})\\s*$`);

export const LABELS = {
  walk: label('Walk the demo path', 'Пройти демонстрационный сценарий'),
  signIn: label('Sign in', 'Войти'),
  /* `\b` здесь не годится: в JS он знает границу слова только у латиницы. */
  continueAs: /^\s*(?:Continue as|Продолжить как)\s/,
  upload: label('Upload a file', 'Загрузить файл'),
  browse: label('Browse files', 'Выбрать файл'),
  openResolution: label('Open resolution center', 'Открыть разбор строк'),
  apply: /^\s*(?:Apply to line \d+|Применить к строке \d+|Confirm replacement|Подтвердить замену)\s*$/,
  toCart: label('Continue to cart', 'Перейти в корзину'),
  accept: label('Accept change', 'Принять изменение'),
  toFulfillment: label('Choose fulfillment', 'Выбрать план отгрузки'),
  choosePlan: label('Choose this plan', 'Выбрать этот план'),
  toCheckout: label('Continue to checkout', 'Перейти к оформлению'),
  fix: /^\s*(?:Fix \d+ blockers?|Устранить \d+ препятстви[ея]й?)\s*$/,
  create: label('Create order', 'Создать заказ'),
  openOrder: label('Open order', 'Открыть заказ'),
};

/** Значение поля оформления выбирается по его подписи, как в проходе приёмки 08. */
function valueFor(fieldLabel, locale) {
  const l = fieldLabel.toLowerCase();
  if (/phone|tel|телефон/.test(l)) return '+7 495 123 45 67';
  if (/e-?mail|почт/.test(l)) return 'a.kim@vectorintegration.example';
  if (/person|contact|name|лицо|контакт|имя/.test(l)) return locale === 'ru' ? 'Иван Петров' : 'Ivan Petrov';
  return locale === 'ru' ? 'Москва, Складочная 1, стр. 18' : 'Moscow, Skladochnaya 1, building 18';
}

/**
 * `act` — исполнитель: `click(locator)`, `hover(locator, hold)`,
 * `type(text)`, `pressKey(key)`, `pause(ms)`, `step(name)`,
 * `setFiles(trigger, file)` — нажать кнопку выбора файла и отдать файл
 * диалогу, — и `settle()`. Паузы — единственное место, где
 * задан ритм ролика: сумма по маршруту держит 60–90 секунд.
 *
 * Выдержки статичных экранов укорочены 11.09.2026 на 3,8 с: первая запись
 * дала 91,9 с при верхней границе 90. Ритм разбора и корзины не тронут —
 * там и есть содержание.
 */
export async function filmScenario(page, act, { locale }) {
  const button = (re) => page.locator('button, a').filter({ hasText: re }).locator('visible=true').first();

  /* 1. Индекс: собранный продукт, двадцать живых превью. */
  await act.step('index');
  await act.pause(2000);
  await act.click(button(LABELS.walk));
  await act.settle();

  /* 2–3. Вход: графитовая колонка называет продукт. */
  await act.step('login');
  await act.pause(1500);
  await act.click(button(LABELS.signIn));
  await page.waitForURL(/counterparty-select/, { timeout: 15000 });
  await act.settle();

  /* 4. Один логин, три юрлица, у каждого свой договор. */
  await act.step('counterparty');
  await act.pause(1100);
  const company = page.locator('[role="radio"], [role="option"], label').locator('visible=true').first();
  if (await company.count()) await act.click(company);
  await act.pause(500);
  await act.click(button(LABELS.continueAs));
  await page.waitForURL(/dashboard/, { timeout: 15000 });
  await act.settle();

  /* 5. Дашборд: что горит, потом — с чего начать. */
  await act.step('dashboard');
  await act.pause(2000);
  await act.click(button(LABELS.upload));
  await page.waitForURL(/xls-import/, { timeout: 15000 });
  await act.settle();

  /* 6. Интейк: требования к файлу и история импортов. */
  await act.step('xls-import');
  await act.pause(1300);
  await act.setFiles(button(LABELS.browse), {
    name: 'office_north_v8.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: Buffer.from('mock'),
  });
  await page.waitForURL(/parse-result/, { timeout: 20000 });
  await act.settle();

  /* 7. 48 прочитано, 41 точных, 7 на разбор, 0 потеряно. */
  await act.step('parse-result');
  await act.pause(2200);
  await act.click(button(LABELS.openResolution));
  await page.waitForURL(/resolution-center/, { timeout: 15000 });
  await act.settle();

  /* 8. Очередь разбора: клавиша ведёт по блокирующим, строка решается
     своей панелью. Первая — медленно, со сравнением кандидатов. */
  await act.step('resolution-center');
  await act.pause(1800);
  await act.pressKey('n');
  await act.pause(900);
  for (let i = 0; i < 12; i += 1) {
    /* Выход — по продукту, а не по счётчику: переход в корзину открывается,
       когда подтверждена последняя строка. Подтверждённая строка остаётся
       в списке с «Undo», и без этого условия цикл нажал бы её. */
    if (await button(LABELS.toCart).isEnabled().catch(() => false)) break;
    const trigger = page.locator('[data-slot="resolution-row"] button:not([role="radio"])').locator('visible=true').first();
    if (!(await trigger.count())) break;
    await act.click(trigger);
    await act.pause(i === 0 ? 1400 : 450);
    const radio = page.locator('[role="radio"]').locator('visible=true');
    if (await radio.count()) {
      await act.click(radio.nth(i === 0 && (await radio.count()) > 1 ? 1 : 0));
      await act.pause(i === 0 ? 1300 : 250);
    }
    /* Строка 46 — единственная, чьё количество разбор не прочитал: панель
       просит число, прежде чем применить. */
    const qty = page.locator('input[inputmode="numeric"], input[type="number"]').locator('visible=true').first();
    if ((await qty.count()) && !(await qty.inputValue().catch(() => 'x'))) {
      await act.click(qty);
      await act.type('4');
      await act.pause(200);
    }
    const apply = button(LABELS.apply);
    if (!(await apply.count()) || !(await apply.isEnabled().catch(() => false))) {
      throw new Error(`разбор: строка ${i + 1} не применяется — нет активного «Apply»`);
    }
    await act.click(apply);
    await act.pause(i === 0 ? 1100 : 420);
  }
  await act.pause(900);
  await act.click(button(LABELS.toCart));
  await page.waitForURL(/\/cart/, { timeout: 15000 });
  await act.settle();

  /* 9. Корзина: «было → стало» одним объектом, величина и направление. */
  await act.step('cart');
  await act.pause(1800);
  for (let i = 0; i < 3; i += 1) {
    const accept = button(LABELS.accept);
    if (!(await accept.count())) break;
    await accept.scrollIntoViewIfNeeded();
    await act.pause(i === 0 ? 1600 : 700);
    await act.click(accept);
    await act.pause(900);
  }
  await act.click(button(LABELS.toFulfillment));
  await page.waitForURL(/fulfillment/, { timeout: 15000 });
  await act.settle();

  /* 10. Три плана по пяти осям, деньги выровнены по разряду. */
  await act.step('fulfillment');
  await act.pause(1800);
  const plan = button(LABELS.choosePlan);
  if (await plan.count()) {
    await act.click(plan);
    await act.pause(1000);
  }
  await act.click(button(LABELS.toCheckout));
  await page.waitForURL(/checkout/, { timeout: 15000 });
  await act.settle();

  /* 11. Оформление: сводка называет, чего не хватает, поимённо. */
  await act.step('checkout');
  await act.pause(1800);
  for (let round = 0; round < 6; round += 1) {
    const fix = button(LABELS.fix);
    if (!(await fix.count())) break;
    await act.click(fix);
    await act.pause(500);
    const fields = page.locator(
      'main input[type="text"], main input:not([type]), main input[type="tel"], main input[type="email"]',
    );
    for (let i = 0; i < (await fields.count()); i += 1) {
      const field = fields.nth(i);
      if (!(await field.isVisible().catch(() => false))) continue;
      if (await field.isDisabled().catch(() => false)) continue;
      if (await field.inputValue().catch(() => 'x')) continue;
      const text = await field
        .evaluate((node) => node.closest('[data-slot="input-field"]')?.textContent ?? '')
        .catch(() => '');
      await act.click(field);
      await act.type(valueFor(text, locale));
      await act.pause(200);
    }
    const boxes = page.locator('main [role="checkbox"][aria-checked="false"]').locator('visible=true');
    for (let i = 0; i < (await boxes.count()); i += 1) {
      await act.click(boxes.first());
      await act.pause(250);
    }
    await act.pause(400);
  }
  await act.pause(900);
  const create = button(LABELS.create);
  if (!(await create.isEnabled().catch(() => false))) throw new Error('оформление: «Create order» не активна');
  await act.click(create);
  await page.waitForURL(/orders\/created/, { timeout: 15000 });
  await act.settle();

  /* 12. Номер заказа на верхней ступени шкалы. */
  await act.step('order-created');
  await act.pause(2000);
  await act.click(button(LABELS.openOrder));
  await page.waitForURL(/orders\/details/, { timeout: 15000 });
  await act.settle();

  /* 13. Четыре независимых трека, а не один статус. */
  await act.step('order-details');
  await act.pause(3000);
}
