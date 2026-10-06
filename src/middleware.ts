import { defineMiddleware } from 'astro:middleware';

/**
 * Типограф: короткие служебные слова привязываются к следующему слову
 * неразрывным пробелом, тире — к предыдущему.
 *
 * Висячий предлог в русском наборе — ошибка, а не вкус; в английском
 * заголовке висящий артикль «a» читается так же. Через копирайт это не
 * закрыть: строка рвётся по-разному на 1440, 1024 и 390, и одна фраза
 * висит на одной ширине и стоит ровно на другой (замер 06.10.2026 —
 * больше сотни мест по EN+RU).
 *
 * Работает только по текстовым узлам готового HTML: теги, атрибуты,
 * <script>, <style>, <textarea>, <pre>, <code> и <svg> не трогаются.
 * Статическая сборка исполняет middleware при пререндере, поэтому в
 * dist/ уходит уже обработанный текст, а в браузер — ни строки JS.
 */

const RU = 'в|во|и|а|к|ко|с|со|у|о|об|на|не|ни|по|из|за|от|до|но|для|при|без|под|над|что|как|или|это';
const EN = 'a|an|the|I|of|to|in|on|at|by';
const SHORT = new RegExp(`(^|[\\s(«“"—])(${RU}|${EN})[ ](?=\\S)`, 'gi');
const DASH = /[ ](—|–)(?=\s)/g;

// Короткая фраза от пяти слов — лид, подпись: последнее слово не остаётся
// в строке одно. Длинные абзацы сюда не попадают, их держит text-wrap:
// pretty роли; узкая колонка в три строки — нет, balance там бессилен.
// Заголовки до четырёх слов правило не трогает: склейка «a stable
// document» в узкой колонке оставляла одним первое слово.
const LAST = /(\S)[ ](\S{1,12})(\s*)$/;
const PHRASE_MAX = 70;
const PHRASE_MIN_WORDS = 5;
const NBSP = String.fromCharCode(0xa0);

function typeset(text: string): string {
  // Два прохода: «в и с» подряд — второе слово открывается только
  // после того, как первое уже привязано.
  let out = text.replace(SHORT, `$1$2${NBSP}`).replace(SHORT, `$1$2${NBSP}`).replace(DASH, `${NBSP}$1`);
  const trimmed = out.trim();
  if (trimmed.length <= PHRASE_MAX && trimmed.split(/\s+/).length >= PHRASE_MIN_WORDS) out = out.replace(LAST, `$1${NBSP}$2$3`);
  return out;
}

function processHtml(html: string): string {
  const out: string[] = [];
  const re = /<(script|style|textarea|pre|code|svg)\b[\s\S]*?<\/\1>|<!--[\s\S]*?-->|<[^>]+>|[^<]+/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const chunk = m[0];
    if (chunk[0] === '<') out.push(chunk);
    else out.push(typeset(chunk));
  }
  return out.join('');
}

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  const type = response.headers.get('content-type') ?? '';
  if (!type.includes('text/html')) return response;
  const html = await response.text();
  return new Response(processHtml(html), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
});
