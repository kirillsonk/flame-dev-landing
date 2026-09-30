import { AI_DEMO } from '@/data/demos';

// Тексты интерактивных демо «AI» в блоке «Что мы делаем».
// Сценарии, которые уже есть в основном демо (заявка, анонс для бегунов), берём из AI_DEMO.

const [LEAD, , LAUNCH] = AI_DEMO.scenarios;

/** Цветовая метка — модификатор из ai/AiTones.module.scss. */
export type AiTone = 'accent' | 'gold' | 'success' | 'fire' | 'primary';

export const AI_TONE_ORDER: AiTone[] = ['accent', 'gold', 'success', 'fire'];

/* ---------- 02 · Заявка с подсветкой полей ---------- */

export interface IAiLeadMark {
  key: string;
  phrase: string;
  value: string;
}

export interface IAiLeadSample {
  tab: string;
  text: string;
  marks: IAiLeadMark[];
}

export const AI_FIELDS = {
  hint: 'Наведите на фразу или поле - они связаны',
  samplesLabel: 'Примеры заявок',
  source: 'Входящее · Telegram',
  sourceLabel: 'Текст заявки',
  crm: 'CRM · новая сделка',
  crmLabel: 'Карточка в CRM',
  heuristic: 'демо-разметка',
  deal: (type: string) => `${type} · новая сделка`,
  noType: 'Заявка без типа',
  waiting: 'Клиент пишет…',
  parsing: 'Разбираем заявку…',
  empty: 'не указано - уточнить',
  completeness: 'Полнота брифа',
  count: (found: number, total: number) => `${found} из ${total} полей`,
  fields: [
    { key: 'type', name: 'Тип', tone: 'accent' },
    { key: 'scope', name: 'Объем', tone: 'gold' },
    { key: 'budget', name: 'Бюджет', tone: 'success' },
    { key: 'term', name: 'Срок', tone: 'fire' },
    { key: 'contact', name: 'Контакт', tone: 'primary' },
  ] as { key: string; name: string; tone: AiTone }[],
  samples: [
    {
      tab: 'Магазин',
      text: LEAD.prompt,
      marks: [
        { key: 'type', phrase: 'интернет-магазин', value: LEAD.fields[0][1] },
        { key: 'scope', phrase: '300 товаров', value: LEAD.fields[1][1] },
        { key: 'term', phrase: 'через 8 недель', value: LEAD.fields[2][1] },
        { key: 'contact', phrase: 'Telegram', value: LEAD.fields[3][1] },
      ],
    },
    {
      tab: 'Приложение',
      text: 'Здравствуйте! Хотим мобильное приложение для доставки, бюджет до 2 млн ₽. Первая версия к 15 декабря. Мой email: olga@bakery.ru',
      marks: [
        { key: 'type', phrase: 'мобильное приложение', value: 'Мобильное приложение' },
        { key: 'budget', phrase: 'до 2 млн ₽', value: 'до 2 млн ₽' },
        { key: 'term', phrase: 'к 15 декабря', value: 'до 15 декабря' },
        { key: 'contact', phrase: 'olga@bakery.ru', value: 'olga@bakery.ru' },
      ],
    },
    {
      tab: 'Бот',
      text: 'Нужен бот для записи клиентов в салон, 3 филиала. Сделать за месяц. Позвоните: +7 915 204-11-80',
      marks: [
        { key: 'type', phrase: 'бот', value: 'Чат-бот' },
        { key: 'scope', phrase: '3 филиала', value: '3 филиала' },
        { key: 'term', phrase: 'за месяц', value: 'месяц' },
        { key: 'contact', phrase: '+7 915 204-11-80', value: '+7 915 204-11-80' },
      ],
    },
  ] as IAiLeadSample[],
};

/* ---------- 06 · Отзывы → темы ---------- */

export const AI_THEMES = {
  title: '12 отзывов за неделю',
  subIdle: 'Разрозненные тексты. Наведите на карточку, чтобы прочитать',
  subDone: '4 темы · тональность по каждой · демо-разметка',
  find: 'Найти темы',
  back: 'Показать исходные',
  tipLead: 'Вывод:',
  tip: '5 из 8 жалоб - про доставку. Исправить сроки курьеров важнее, чем снижать цену',
  positive: 'позитив',
  negative: 'негатив',
  mixed: 'смешанно',
  satisfied: (percent: number) => `${percent}% довольны`,
  groups: [
    { key: 'delivery', name: 'Доставка', tone: 'fire' },
    { key: 'quality', name: 'Качество', tone: 'success' },
    { key: 'support', name: 'Поддержка', tone: 'accent' },
    { key: 'price', name: 'Цена', tone: 'gold' },
  ] as { key: string; name: string; tone: AiTone }[],
  reviews: [
    { group: 'delivery', positive: false, text: 'Заказ ехал 9 дней вместо обещанных трех', key: 'опоздание на 6 дней' },
    { group: 'quality', positive: true, text: 'Кроссовки сели идеально, материал плотный', key: 'точная посадка' },
    { group: 'support', positive: true, text: 'Оператор вернул деньги за 10 минут', key: 'быстрый возврат' },
    {
      group: 'delivery',
      positive: false,
      text: 'Курьер не позвонил и оставил коробку у двери',
      key: 'курьер без звонка',
    },
    { group: 'price', positive: false, text: 'Дороговато, у конкурентов на 15% дешевле', key: 'дороже на 15%' },
    { group: 'quality', positive: true, text: 'Цвет совпал с фото, приятно удивлен', key: 'цвет как на фото' },
    { group: 'delivery', positive: false, text: 'Трекинг не обновлялся четыре дня', key: 'трекинг молчит' },
    { group: 'support', positive: false, text: 'В чате ответили только на следующий день', key: 'ответ через сутки' },
    { group: 'quality', positive: false, text: 'Шов разошелся через две недели носки', key: 'разошелся шов' },
    { group: 'delivery', positive: false, text: 'Привезли не в тот пункт выдачи', key: 'не тот пункт выдачи' },
    { group: 'price', positive: true, text: 'За такое качество цена честная', key: 'цена оправдана' },
    { group: 'delivery', positive: true, text: 'В Москве привезли на следующий день', key: 'доставка за день' },
  ],
};

/* ---------- 07 · Генератор ролика ---------- */

export type AiVideoFormat = 'tall' | 'wide';
export type AiVideoStyle = 'cine' | 'neon' | 'mini';

export const AI_VIDEO = {
  brand: 'Flame AI',
  mode: 'демо-режим',
  promptLabel: 'О чем ролик',
  examplesLabel: 'Примеры промптов',
  examples: [
    { tab: 'Кроссовки', prompt: 'Беговые кроссовки для города: утренняя пробежка на рассвете, легкость и скорость' },
    { tab: 'Кофейня', prompt: 'Кофейня у метро: ночная смена, неон и капучино с собой' },
    { tab: 'Фестиваль', prompt: 'Летний фестиваль: солнце, музыка у воды и билеты со скидкой' },
  ],
  formatLabel: 'Формат',
  formats: [
    { value: 'tall', label: '9:16 · Reels', ratio: '9:16' },
    { value: 'wide', label: '16:9 · YouTube', ratio: '16:9' },
  ] as { value: AiVideoFormat; label: string; ratio: string }[],
  styleLabel: 'Стиль',
  styles: [
    { value: 'cine', label: 'Кино' },
    { value: 'neon', label: 'Неон' },
    { value: 'mini', label: 'Минимализм' },
  ] as { value: AiVideoStyle; label: string }[],
  go: 'Сгенерировать ролик ✦',
  busy: 'Генерируем…',
  again: 'Сгенерировать заново ✦',
  stages: ['Сценарий', 'Раскадровка', 'Озвучка', 'Рендер'],
  duration: '15 сек',
  changed: 'Промпт изменен',
  ready: (ratio: string) => `Готово · 15 сек · ${ratio}`,
  fallback: 'Ваш продукт',
  moods: [
    { test: /рассвет|утр/i, label: 'Рассвет над городом' },
    { test: /ноч|неон/i, label: 'Ночной город' },
    { test: /лет|солн/i, label: 'Летний полдень' },
  ],
  defaultMood: 'Город просыпается',
  motion: 'Движение и скорость',
  captions: {
    mood: (mood: string) => `${mood}. Тишина, первые шаги.`,
    closeUp: (title: string) => `Крупно: ${title}.`,
    tail: (tail: string) => `${tail}.`,
    ending: 'Логотип и призыв. 0:13–0:15',
  },
  buy: 'Купить',
  shot: (index: number) => `Кадр ${index}`,
  result: 'Раскадровка ролика',
};

/* ---------- 10 · Классификатор документов ---------- */

export interface IAiDocument {
  name: string;
  meta: string;
  ext: string;
  tone: AiTone;
  type: string;
  confidence: string;
  route: string;
  /** Поле: подпись, значение и рамка на превью в процентах [left, top, width, height]. */
  fields: { label: string; value: string; box: [number, number, number, number] }[];
}

export const AI_DOCUMENTS = {
  filesLabel: 'Файлы',
  filesHint: 'Перетащите файл вправо или нажмите на него',
  zoneLabel: 'Зона разбора',
  idleTitle: 'Бросьте документ сюда',
  idleText: 'Определим тип, вытащим реквизиты и решим, куда отправить',
  detecting: 'Определяем тип…',
  confidence: (value: string) => `уверенность ${value}`,
  reset: 'Очистить зону',
  docs: [
    {
      name: 'scan_0412.pdf',
      meta: '1 стр · 184 КБ',
      ext: 'PDF',
      tone: 'fire',
      type: 'Счет на оплату',
      confidence: '98%',
      route: '→ Бухгалтерия · оплатить до 30.09',
      fields: [
        { label: 'Номер', value: '№ 412', box: [8, 8, 40, 6] },
        { label: 'Дата', value: '15.09.2026', box: [58, 8, 34, 6] },
        { label: 'Контрагент', value: 'ООО «Вектор»', box: [8, 22, 60, 6] },
        { label: 'Сумма', value: '184 500 ₽', box: [55, 76, 38, 8] },
      ],
    },
    {
      name: 'dogovor_final_v3.docx',
      meta: '7 стр · 92 КБ',
      ext: 'DOC',
      tone: 'accent',
      type: 'Договор поставки',
      confidence: '95%',
      route: '→ Юристы · проверить до подписи',
      fields: [
        { label: 'Стороны', value: 'Flame ↔ ИП Орлова', box: [8, 16, 80, 6] },
        { label: 'Срок', value: 'до 31.12.2026', box: [8, 44, 44, 6] },
        { label: 'Штраф', value: '0,1% в день', box: [8, 58, 50, 6] },
        { label: 'Подписи', value: 'нет второй', box: [50, 86, 42, 8] },
      ],
    },
    {
      name: 'IMG_20260914.jpg',
      meta: 'фото · 2,1 МБ',
      ext: 'JPG',
      tone: 'gold',
      type: 'Акт выполненных работ',
      confidence: '91%',
      route: '→ Проектный отдел · закрыть этап',
      fields: [
        { label: 'Номер', value: 'Акт № 37', box: [8, 8, 36, 6] },
        { label: 'Этап', value: 'Дизайн каталога', box: [8, 30, 64, 6] },
        { label: 'Сумма', value: '96 000 ₽', box: [55, 62, 38, 6] },
        { label: 'Печать', value: 'есть', box: [10, 82, 26, 12] },
      ],
    },
    {
      name: 'price_autumn.xlsx',
      meta: '1 лист · 48 КБ',
      ext: 'XLS',
      tone: 'success',
      type: 'Коммерческое предложение',
      confidence: '87%',
      route: '→ Отдел продаж · сравнить с текущим',
      fields: [
        { label: 'Поставщик', value: 'ТД «Север»', box: [8, 8, 50, 6] },
        { label: 'Позиций', value: '46', box: [8, 24, 20, 6] },
        { label: 'Скидка', value: '7% от 100 тыс', box: [50, 70, 42, 6] },
        { label: 'Действует', value: 'до 15.10', box: [8, 86, 34, 6] },
      ],
    },
  ] as IAiDocument[],
};

/* ---------- 12 · Контент-фабрика ---------- */

export type AiContentChannel = 'tg' | 'vk' | 'mail' | 'ban';

export interface IAiContentPack {
  feats: string[];
  title: string;
  tg: string;
  vk: string;
  mailSubject: string;
  mail: string;
  ban: string;
  cta: string;
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const AI_CONTENT = {
  ideaLabel: 'Одна идея',
  examplesLabel: 'Примеры идей',
  examples: [
    { tab: 'Бег', idea: LAUNCH.prompt },
    { tab: 'Цветы', idea: 'Запуск сайта доставки цветов: каталог букетов, оплата онлайн и доставка за 2 часа' },
    { tab: 'Сервис', idea: 'Запуск сервиса онлайн-записи: расписание, напоминания и оплата картой' },
  ],
  featsLabel: 'AI выделил',
  go: 'Сделать 4 формата ✦',
  busy: 'Пишем…',
  again: 'Пересобрать ✦',
  channelsLabel: 'Форматы',
  channels: [
    { key: 'tg', name: 'Telegram', meta: 'пост · до 4096 символов' },
    { key: 'vk', name: 'VK', meta: 'пост + обложка 1:0,5' },
    { key: 'mail', name: 'E-mail', meta: 'рассылка · превью 90 символов' },
    { key: 'ban', name: 'Баннер', meta: 'баннер 1200×600' },
  ] as { key: AiContentChannel; name: string; meta: string }[],
  chars: (count: number) => `${count} симв.`,
  tgTime: '12:04 ✓✓',
  vkAuthor: 'Flame Run',
  vkTime: 'только что',
  mailSubject: 'Тема',
  fallbackIdea: 'Новый продукт',
  fallbackFeats: ['удобство', 'скорость'],
  /** Слова в начале идеи, которые не входят в название продукта. */
  lead: /^(напиши\s+)?(короткий\s+)?(анонс\s+)?(запуск[а]?\s+)?/i,
  lemmas: [
    [/^приложения(?=\s|$)/i, 'приложение'],
    [/^сервиса(?=\s|$)/i, 'сервис'],
    [/^магазина(?=\s|$)/i, 'магазин'],
    [/^сайта(?=\s|$)/i, 'сайт'],
  ] as [RegExp, string][],
  running: /бег|пробеж|км|марафон/i,
  pack: (subject: string, feats: string[], running: boolean): IAiContentPack => {
    const title = running ? LAUNCH.heading : `${capitalize(subject.split(' ').slice(0, 3).join(' '))} уже здесь.`;
    const cta = running ? 'Скачать бесплатно' : 'Попробовать';
    return {
      feats,
      title,
      tg: `${title}\n\nЗапускаем ${subject}. Внутри - ${feats.join(', ')}.\n\nСкачать → по ссылке в закрепе`,
      vk: `Мы запустились! ${capitalize(subject)} - это ${feats.join(', ')}.\nРасскажите в комментариях, что добавить первым.`,
      mailSubject: `${title} Запуск уже сегодня`,
      mail: `Здравствуйте!\n\nСегодня запускаем ${subject}. ${feats.map(capitalize).join('. ')}.\n${running ? LAUNCH.result : 'Попробуйте первыми'}`,
      ban: title,
      cta,
    };
  },
};

/* ---------- 15 · Поиск по базе знаний ---------- */

export interface IAiKnowledge {
  question: string;
  keys: string[];
  /** Источник: документ, раздел, релевантность, фрагмент (совпадения в [квадратных скобках]). */
  sources: { doc: string; section: string; score: number; fragment: string }[];
  /** Ответ; {1} — сноска на источник. */
  answer: string;
}

export const AI_RAG = {
  inputLabel: 'Вопрос к базе знаний',
  placeholder: 'Спросите о регламентах компании…',
  ask: 'Спросить',
  examplesLabel: 'Например:',
  foundLabel: 'Найдено в базе · 214 документов',
  sourcesLabel: 'Найденные фрагменты',
  time: '0,4 с',
  searching: 'Ищу по смыслу в 214 документах…',
  hover: 'Наведите на сноску - подсветится источник',
  noSources: 'Релевантных фрагментов не нашлось',
  noAnswer: 'В базе нет ответа на этот вопрос - ассистент не выдумывает, а предлагает переслать его ответственному',
  noteLimited: 'Демо: база ограничена тремя темами - возвраты, отпуск, поддержка',
  footnote: (index: number, doc: string) => `Источник ${index}: ${doc}`,
  base: [
    {
      question: 'Сколько дней на возврат товара?',
      keys: ['возврат', 'вернуть', 'возвращ', 'обмен', 'брак'],
      sources: [
        {
          doc: 'Политика возвратов.pdf',
          section: '§2.1',
          score: 0.94,
          fragment: 'Покупатель может [вернуть товар] надлежащего качества в течение [14 дней] с момента получения',
        },
        {
          doc: 'Политика возвратов.pdf',
          section: '§3.4',
          score: 0.88,
          fragment: 'При обнаружении [брака] срок возврата составляет [30 дней], доставку оплачивает магазин',
        },
        {
          doc: 'FAQ поддержки.docx',
          section: 'Возвраты',
          score: 0.71,
          fragment: 'Деньги возвращаются на карту за [3–5 рабочих дней] после проверки товара на складе',
        },
      ],
      answer:
        'Обычный товар можно вернуть в течение 14 дней{1}, товар с браком - в течение 30 дней, и доставку тогда оплачивает магазин{2}. Деньги приходят на карту за 3–5 рабочих дней после проверки{3}.',
    },
    {
      question: 'Как оформить отпуск?',
      keys: ['отпуск', 'отгул', 'выходн', 'заявлени'],
      sources: [
        {
          doc: 'Регламент HR v4.pdf',
          section: '§5.2',
          score: 0.92,
          fragment: 'Заявление на отпуск подается в [HR-боте] не позднее чем за [14 календарных дней]',
        },
        {
          doc: 'Регламент HR v4.pdf',
          section: '§5.5',
          score: 0.85,
          fragment: 'Отпуск согласует [руководитель направления]; при пересечении с релизом - еще и тимлид',
        },
        {
          doc: 'Онбординг.notion',
          section: 'Первые шаги',
          score: 0.64,
          fragment: 'Право на отпуск появляется [через 6 месяцев] работы, раньше - по согласованию',
        },
      ],
      answer:
        'Подайте заявление в HR-боте минимум за 14 дней{1}. Его согласует руководитель направления, а если отпуск пересекается с релизом - еще и тимлид{2}. Первые 6 месяцев работы отпуск берут по отдельному согласованию{3}.',
    },
    {
      question: 'За сколько отвечает поддержка?',
      keys: ['поддержк', 'ответ', 'sla', 'срок', 'обращени'],
      sources: [
        {
          doc: 'SLA клиентам.pdf',
          section: '§1.3',
          score: 0.96,
          fragment: 'Первый ответ на обращение - [до 15 минут] в рабочее время [с 9 до 21] по Москве',
        },
        {
          doc: 'SLA клиентам.pdf',
          section: '§1.6',
          score: 0.87,
          fragment: 'Критичные инциденты (сайт недоступен) - ответ [до 5 минут круглосуточно]',
        },
        {
          doc: 'Отчет поддержки, август.xlsx',
          section: 'Итоги',
          score: 0.58,
          fragment: 'Средний фактический первый ответ за август - [6 минут 40 секунд]',
        },
      ],
      answer:
        'По SLA первый ответ - до 15 минут с 9 до 21 по Москве{1}; критичные инциденты - до 5 минут круглосуточно{2}. На практике в августе поддержка отвечала в среднем за 6 минут 40 секунд{3}.',
    },
  ] as IAiKnowledge[],
};

/* ---------- 16 · Модерация комментариев ---------- */

export type AiModerationLabel = 'ok' | 'spam' | 'tox';

export const AI_MODERATION = {
  title: 'Комментарии',
  live: 'поток',
  paused: 'на паузе',
  ended: 'поток закончился',
  pause: 'Пауза',
  resume: 'Продолжить',
  replay: 'Повторить поток',
  checking: 'проверяю…',
  manual: 'вручную',
  review: 'проверьте',
  hide: 'Скрыть',
  restore: 'Вернуть',
  listLabel: 'Лента комментариев',
  statsLabel: 'Итоги модерации',
  labels: {
    ok: { name: 'Ок', stat: 'Опубликовано', tone: 'success' },
    spam: { name: 'Спам', stat: 'Спам', tone: 'gold' },
    tox: { name: 'Токсично', stat: 'Токсичность', tone: 'fire' },
  } as Record<AiModerationLabel, { name: string; stat: string; tone: AiTone }>,
  fixes: (count: number) => `Ручных правок: ${count}`,
  fixesHint: 'Не согласны с AI - нажмите «Вернуть» или «Скрыть». Правки уходят в примеры для дообучения',
  fixed: (text: string, label: string) => `«${text}» → ${label}. Пример сохранен для дообучения.`,
  /** Признаки спама для ручной правки «Скрыть». */
  spamHint: /ссылк|заработ|%/,
  stream: [
    {
      who: 'Ирина',
      text: 'Заказывала в пятницу, пришло в понедельник. Все целое, спасибо!',
      label: 'ok',
      confidence: 0.97,
    },
    {
      who: 'bestprice_24',
      text: 'Заработок от 5000 в день без вложений, пиши в директ',
      label: 'spam',
      confidence: 0.99,
    },
    { who: 'Олег', text: 'Цены поднялись, раньше было дешевле. Но качество норм', label: 'ok', confidence: 0.91 },
    { who: 'Гость 1182', text: 'Вы тут все идиоты, нормально сделать не можете?', label: 'tox', confidence: 0.94 },
    { who: 'Катя М', text: 'А будет размер 36? Очень хочу эти кроссовки', label: 'ok', confidence: 0.98 },
    { who: 'Денис', text: 'Курьер опять опоздал, это уже третий раз. Кошмар какой-то', label: 'ok', confidence: 0.72 },
    {
      who: 'promo.shop',
      text: 'Скидки -90% на все только сегодня → ссылка в профиле',
      label: 'spam',
      confidence: 0.96,
    },
    { who: 'Анна', text: 'Поддержка ответила за 5 минут и все решила', label: 'ok', confidence: 0.99 },
    { who: 'Макс', text: 'Руки бы оторвать тому, кто упаковывал', label: 'tox', confidence: 0.61 },
    { who: 'Светлана', text: 'Подскажите, есть ли доставка в Казань?', label: 'ok', confidence: 0.98 },
    { who: 'crypto_boss', text: 'Удвою твои деньги за сутки, гарантия 100%', label: 'spam', confidence: 0.98 },
    { who: 'Павел', text: 'Отличный магазин, беру уже пятый раз', label: 'ok', confidence: 0.96 },
  ] as { who: string; text: string; label: AiModerationLabel; confidence: number }[],
};

/* ---------- 18 · Накладная из скана ---------- */

export const AI_INVOICE = {
  paperLabel: 'Скан товарной накладной № 318',
  paperTitle: 'ТОРГ-12 № 318',
  paperDate: '12.09.2026',
  paperHeaders: ['Товар', 'Кол', 'Цена', 'Сумма'],
  totalLabel: 'Итого:',
  total: 272600,
  title: 'Накладная № 318',
  go: 'Распознать скан',
  busy: 'Распознаем…',
  again: 'Распознать заново',
  headers: ['Товар', 'Кол', 'Цена, ₽', 'Сумма, ₽'],
  placeholder: '· · ·',
  rows: [
    ['Кроссовки Run Pro', '24', '5 900', '141 600'],
    ['Носки спорт. 3 пары', '120', '450', '54 000'],
    ['Стельки гелевые', '40', '890', '35 600'],
    ['Бутылка 0,75 л', '60', '690', '41 400'],
  ],
  /** Размытая ячейка скана: строка, колонка, как её прочитал AI и варианты. */
  doubt: { row: 1, col: 1, read: '1?0', options: ['120', '100', '180'] },
  fixPrompt: 'Кол-во носков размыто · уверенность 62%. Вариант:',
  checkLabel: 'Проверка итога',
  waiting: 'ждет распознавания',
  sumTemplate: 'Сумма строк: {value} ₽',
  ok: '✓ сходится с итогом',
  bad: '≠ 272 600 - проверьте',
};
