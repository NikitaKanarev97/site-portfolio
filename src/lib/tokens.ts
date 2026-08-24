/**
 * Чтение токенов ДС на билде — Site-portfolio
 *
 * Главный потребитель — рендер OG-карточек (src/pages/og/[card].png.ts).
 * Satori не исполняет CSS и не знает `var(--text-default)` — ему нужны
 * числа и hex. Прибить их в рендере нельзя: ds/CONTRACT.md §«Что запрещено»
 * запрещает прибитые цвета и кегли на любой поверхности продукта,
 * а карточка соцсетей — поверхность.
 *
 * С 2026-08-24 добавились два потребителя брейкпоинтов: `MediaFrame`
 * собирает атрибут `media` у `<source>`, `Navbar` — запрос для `matchMedia`
 * в клиентском скрипте. Оба считают значение во фронтматтере, на сборке.
 * CSS-медиазапросы сюда не ходят: у них свой путь через `@custom-media`.
 *
 * Поэтому значения не дублируются, а читаются из зеркала `src/styles/
 * tokens.css` в момент сборки. Ребрендинг остаётся одной правкой в
 * `ds/tokens.css`: следующий билд пересоберёт карточки сам.
 *
 * Файл берётся импортом `?raw`, а не через `node:fs`: на билде модуль
 * уезжает в бандл, и путь от `import.meta.url` указывал бы на выходную
 * папку, где `tokens.css` нет. `?raw` разрешается сборщиком в исходниках
 * и содержимое подставляет строкой.
 *
 * Модуль исключительно билдовый. В браузер не импортируется ни из одного
 * компонента, и импортировать нельзя.
 */
import raw from '../styles/tokens.css?raw';

/**
 * Комментарии снимаются до любого разбора.
 *
 * Разборщик здесь намеренно наивный — регулярка и счёт скобок, не парсер
 * CSS. Наивность допустима ровно до тех пор, пока он не видит прозы:
 * `stripAtRules` ищет `@media` подстрокой, и фраза «@media не читает var()»
 * в комментарии `tokens.css` заставляла его срезать всё до ближайшей
 * закрывающей скобки вместе с объявлениями ролей. **Найдено сборкой
 * 2026-08-24**, при заведении брейкпоинтов: OG-карточки упали с «у роли
 * нет font-family». Комментарии — не данные, и до разбора не доживают.
 */
const css = raw.replace(/\/\*[\s\S]*?\*\//g, '');

/** Объявления кастомных свойств, как они записаны в файле. */
const declarations = new Map<string, string>();
for (const match of css.matchAll(/--([\w-]+)\s*:\s*([^;{}]+);/g)) {
  declarations.set(match[1], match[2].trim());
}

/**
 * Значение токена с раскрытием цепочки `var()`.
 *
 * Смысловой слой ссылается на примитивы (`--text-default: var(--gray-900)`),
 * и рендеру нужен конец цепочки. Глубина ограничена: циклическая ссылка
 * в токенах — ошибка ДС, и она должна падать на билде, а не молча отдавать
 * пустую строку.
 */
export function token(name: string): string {
  let value = declarations.get(name);
  if (value === undefined) throw new Error(`Токен --${name} не объявлен в src/styles/tokens.css`);

  for (let depth = 0; depth < 8; depth += 1) {
    const reference = value.match(/^var\(\s*--([\w-]+)\s*\)$/);
    if (!reference) return value;

    const next = declarations.get(reference[1]);
    if (next === undefined) {
      throw new Error(`Токен --${name} ссылается на несуществующий --${reference[1]}`);
    }
    value = next.trim();
  }

  throw new Error(`Цепочка var() у токена --${name} длиннее восьми ссылок — похоже на цикл`);
}

/** Число из токена-размера: `48px` → `48`. */
export function px(name: string): number {
  const value = token(name);
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) throw new Error(`Токен --${name} = "${value}" — не размер в px`);
  return parsed;
}

/** Первое семейство из стека шрифтов: `"Manrope", system-ui, …` → `Manrope`. */
export function fontFamily(name: string): string {
  return token(name).split(',')[0].trim().replace(/^["']|["']$/g, '');
}

/**
 * Типографическая роль как набор свойств.
 *
 * Роли (`.ds-display-6xl`, `.ds-meta-xs`) объявлены в том же файле, что
 * и токены, и держат четыре свойства сразу: семейство, начертание,
 * интерлиньяж, трекинг. Рендер берёт роль целиком — так карточка
 * повторяет типографику страницы, а не приближает её на глаз.
 *
 * Медиазапросы намеренно вырезаются: полотно карточки 1200×630 —
 * десктопная ширина, и мобильные ступени к нему не относятся.
 */
const cssWithoutMedia = stripAtRules(css);

export interface RoleStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  textTransform?: 'uppercase';
}

export function role(className: string, size?: number): RoleStyle {
  const properties = new Map<string, string>();

  // Имена ролей — литералы вида `ds-display-6xl`, экранировать в них нечего.
  const rule = new RegExp(String.raw`([^{}]*\.${className}[^{}]*)\{([^{}]*)\}`, 'g');

  for (const match of cssWithoutMedia.matchAll(rule)) {
    const selectors = match[1].split(',').map((part) => part.trim());
    if (!selectors.some((part) => part === `.${className}`)) continue;

    for (const declaration of match[2].split(';')) {
      const [property, value] = declaration.split(':');
      if (!property || value === undefined) continue;
      properties.set(property.trim(), value.trim());
    }
  }

  if (properties.size === 0) throw new Error(`Роль .${className} не объявлена в tokens.css`);

  const fontSize = size ?? resolveSize(properties.get('font-size'));
  const tracking = properties.get('letter-spacing');

  return {
    fontFamily: resolveFamily(properties.get('font-family')),
    fontSize,
    fontWeight: Number.parseInt(resolveValue(properties.get('font-weight')) ?? '400', 10),
    lineHeight: Number.parseFloat(resolveValue(properties.get('line-height')) ?? '1'),
    // Трекинг в ролях задан в em, Satori понимает только px.
    letterSpacing: tracking ? Number.parseFloat(resolveValue(tracking) ?? '0') * fontSize : 0,
    ...(properties.get('text-transform') === 'uppercase' ? { textTransform: 'uppercase' as const } : {}),
  };
}

function resolveValue(raw: string | undefined): string | undefined {
  if (raw === undefined) return undefined;
  const reference = raw.match(/^var\(\s*--([\w-]+)\s*\)$/);
  return reference ? token(reference[1]) : raw;
}

function resolveSize(raw: string | undefined): number {
  const value = resolveValue(raw);
  if (value === undefined) throw new Error('У роли нет font-size');
  return Number.parseFloat(value);
}

function resolveFamily(raw: string | undefined): string {
  const value = resolveValue(raw);
  if (value === undefined) throw new Error('У роли нет font-family');
  return value.split(',')[0].trim().replace(/^["']|["']$/g, '');
}

/**
 * Вырезает блоки `@media { … }` вместе с содержимым, считая скобки.
 *
 * `@custom-media` под это не подпадает и подпадать не должен: подстрока
 * `@media` в нём не встречается («@custom-media» после `@` идёт `c`),
 * а сами объявления бесскобочные и до этой функции не доживают —
 * их снимает postcss на сборке.
 */
function stripAtRules(source: string): string {
  let result = '';
  let index = 0;

  while (index < source.length) {
    const start = source.indexOf('@media', index);
    if (start === -1) return result + source.slice(index);

    result += source.slice(index, start);

    let depth = 0;
    let cursor = source.indexOf('{', start);
    if (cursor === -1) return result;

    for (; cursor < source.length; cursor += 1) {
      if (source[cursor] === '{') depth += 1;
      else if (source[cursor] === '}') {
        depth -= 1;
        if (depth === 0) break;
      }
    }

    index = cursor + 1;
  }

  return result;
}
