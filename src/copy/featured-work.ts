import type { CaseStory, CaseTheme } from './cases/story';

/** Home and Next share the accepted registry order and the actual story cover. */
export function featuredWork(entries: { slug: string; story: CaseStory; theme: CaseTheme }[], locale: 'en' | 'ru') {
  const ru = locale === 'ru';
  const facts: Record<string, [string, string, string]> = ru ? {
    'agent-ops-console': ['2026', 'Платный заказ · прототип проверен и принят', 'Человек проверяет обещание и выплату перед одобрением.'],
    'partner-portal': ['2024–2026', 'Коммерческий редизайн · показана реконструкция', 'Сначала подобрать товар по исходной строке, затем оформить заказ.'],
    learn: ['2026', 'Рабочий проект · нынешнее переосмысление', 'Один материал — быстрый ответ и часть учебной программы.'],
    'vet-clinic': ['2026', 'Концепт · разговоры с одним врачом', 'Один визит связывает врача, регистратуру и владельца.'],
    pawly: ['2026', 'Концепт · проверяемая гипотеза доверия', 'Выбранное фото становится подтверждением после отправки.'],
  } : {
    'agent-ops-console': ['2026', 'Paid client · user-tested, accepted prototype', 'Human review before a promise becomes a payout.'],
    'partner-portal': ['2024–2026', 'Commercial redesign · reconstruction shown', 'Match a product to the source row, then place the order.'],
    learn: ['2026', 'Work project · current reinterpretation', 'One material serves an answer and a learning path.'],
    'vet-clinic': ['2026', 'Concept · input from one practising vet', 'One visit connects the vet, reception and owner.'],
    pawly: ['2026', 'Concept · a trust hypothesis to test', 'A selected photo becomes proof after it is sent.'],
  };
  return entries.map(({ slug, story, theme }) => {
    const [year, evidence, outcome] = facts[slug];
    const media = story.cover.media;
    const shots = media.variant === 'proof' ? media.panels ?? [media.shot] : media.variant === 'screen' ? media.items : [];
    return {
      href: `${ru ? '/ru' : ''}/work/${slug}`, title: story.cover.title, outcome,
      meta: [{ term: ru ? 'Проект' : 'Project', value: story.cover.title }, { term: ru ? 'Версия' : 'Version', value: year }, { term: ru ? 'Основание' : 'Evidence', value: evidence }],
      cta: ru ? 'Читать кейс' : 'Read the case', theme, media,
      cover: shots.map(shot => shot.src), coverAlt: shots.map(shot => shot.alt).join('; '),
    };
  });
}
