/** Клонирует данные кейса и переводит только корневой каталог медиа. */
export function withRussianMedia<T>(value: T, source: string, target: string): T {
  if (typeof value === 'string') return value.replace(source, target) as T;
  if (Array.isArray(value)) {
    return value.map((item) => withRussianMedia(item, source, target)) as T;
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        withRussianMedia(item, source, target),
      ]),
    ) as T;
  }
  return value;
}
