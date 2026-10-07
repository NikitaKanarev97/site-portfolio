import type { CaseStory, CaseTheme } from './cases/story';

/** Home and Next share the accepted registry order and the actual story cover. */
export function featuredWork(entries: { slug: string; story: CaseStory; theme: CaseTheme }[], locale: 'en' | 'ru') {
  const ru = locale === 'ru';
  const facts: Record<string, [string, string, string]> = ru ? {
    'agent-ops-console': ['2026', 'Платный заказ · прототип проверен и принят', 'Человек проверяет обещание и выплату перед одобрением.'],
    'partner-portal': ['2024–2026', 'Продуктовый дизайн · подбор товаров и оформление заказа', 'Сначала подобрать товар по исходной строке, затем оформить заказ.'],
    learn: ['2026', 'Продуктовый дизайн · справочник и учебные сценарии', 'Один материал — быстрый ответ и часть учебной программы.'],
    'vet-clinic': ['2026', 'Продуктовый дизайн · ролевые сценарии клиники', 'Один визит связывает врача, регистратуру и владельца.'],
    pawly: ['2026', 'Продуктовый дизайн · передача питомца и выплаты', 'Выбранное фото становится подтверждением после отправки.'],
  } : {
    'agent-ops-console': ['2026', 'Paid client · user-tested, accepted prototype', 'Human review before a promise becomes a payout.'],
    'partner-portal': ['2024–2026', 'Product design · product matching and ordering', 'Match a product to the source row, then place the order.'],
    learn: ['2026', 'Product design · reference and learning flows', 'One material serves an answer and a learning path.'],
    'vet-clinic': ['2026', 'Product design · clinic role flows', 'One visit connects the vet, reception and owner.'],
    pawly: ['2026', 'Product design · pet handover and earnings', 'A selected photo becomes proof after it is sent.'],
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
