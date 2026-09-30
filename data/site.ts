import { HERO_REEL, HERO_REEL_LABELS } from './cases';
import type { IAnchor, ICaseVideo, IHeroPill, IContactLink, ICtaDayStep, IFooterColumn, IHeroSlide, IHeroTitlePart, ILang, INavItem } from './types';

// Полноэкранные кадры с переключателем — те же пять проектов, что в ленте-аккордеоне.
// У кейсов, кроме Coca-Cola, пока лежат демонстрационные ролики 9:16 — их заменят реальные 16:9.
// Промо-луп студии (`/videos/hero-overlay.*`) остаётся в проекте: его можно вернуть кадром.
export const HERO_SLIDES: IHeroSlide[] = HERO_REEL.map((item) => ({
  id: item.slug,
  label: HERO_REEL_LABELS[item.slug] ?? item.title,
  title: item.title,
  caption: item.description,
  href: `/cases/${item.slug}`,
  video: item.videoWide ?? item.video,
})).filter((slide): slide is IHeroSlide => Boolean(slide.video));

// Фон первого экрана — промо-луп студии, не конкретный кейс. Заменится спокойным фоновым видео.
export const HERO_PROMO: ICaseVideo = {
  mp4: '/videos/hero-overlay.mp4',
  webm: '/videos/hero-overlay.webm',
  poster: '/videos/hero-overlay.jpg',
};

export const HERO_SLIDE_LINK = 'Смотреть кейс';

// Первый экран по doc/FLAME_DEV_WEBSITE_COPY.md: надзаголовок обязателен, без него H1 читается
// как любая проектная услуга. Заголовок — две части: на десктопе перенос после «идеи».
export const HERO_INTRO = {
  // Надзаголовок пилюлями: каждая ведет к своей услуге в «Что разработаем для вас» (slug из data/services.ts).
  // effect — ховер пилюли по смыслу услуги: рамка Figma, прокрутка систем, игровой отскок, генерация.
  eyebrow: [
    { label: 'Сайты', service: 'web3d', effect: 'frame' },
    { label: 'Сервисы', service: 'systems', effect: 'roll', stack: ['CRM', 'ERP', 'API'] },
    { label: 'Спецпроекты', service: 'special', effect: 'game' },
    { label: 'AI', service: 'ai', effect: 'spark' },
  ] satisfies IHeroPill[],
  eyebrowLabel: 'Направления',
  title: ['От идеи', 'до работающего проекта'],
  text: 'Берем на себя проектирование, дизайн, разработку и запуск. Вы участвуете в ключевых решениях, мы организуем работу и доводим проект до результата',
  secondary: { label: 'Смотреть кейсы', href: '#cases' } satisfies INavItem,
};

export const LANGS: ILang[] = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN', hint: 'Английская версия готовится' },
];

export const NAV: INavItem[] = [
  { label: 'Кейсы', href: '/#cases' },
  { label: 'Услуги', href: '/#services' },
  { label: 'Подход', href: '/#process' },
  { label: 'Контакты', href: '/#contact' },
];

export const CTA_LABEL = 'Обсудить проект';

export const SCROLL_TOP_LABEL = 'Наверх';

// Якоря по id (AnchorScroll). Запиненная секция сразу открывается на старте своего пина, без
// прокрутки от соседей, и дальше анимация проигрывается до точки — доли пина 0…1: «контакт» —
// до конца, чтобы форма была раскрыта; «кейсы» и «услуги» — чуть дальше старта, примерно на
// полэкрана прокрутки, чтобы блок ожил (пины разной длины, доли подобраны под неё).
// К первому экрану и началу страницы (логотип, `#top`, `#hero`) — прыжок без анимации.
// Секции без пина и не перечисленные здесь — к началу с учётом scroll-padding-top.
export const ANCHORS: Record<string, IAnchor> = {
  top: { instant: true },
  hero: { instant: true },
  cases: { stop: 0.15 },
  services: { stop: 0.1 },
  contact: { stop: 'end' },
};

// Одна фраза вместо «заголовок + подзаголовок» (uprock); три чипа-ссылки с разными ховерами.
//   — неразрывные пробелы: короткие предлоги и союзы не остаются висеть в конце строки.
// Перед «и» и «в» перенос разрешён, после — нет, поэтому они уезжают на строку вместе со словом.
export const HERO = {
  title: [
    { text: 'Сложные системы и спецпроекты для брендов: ' },
    { text: 'дизайн', chip: { kind: 'design', href: '#cases', meta: '— × —' }, suffix: ',' },
    { text: ' ' },
    { text: 'разработка', chip: { kind: 'dev', href: '#services', stack: ['Django', 'Go', 'React', 'Next.js'] } },
    { text: ' ' },
    // «и» стоит префиксом внутри обёртки чипа: неразрывного пробела мало — перенос всё равно
    // случается на границе соседних инлайн-элементов, и союз оставался висеть в конце строки.
    { text: 'видео', prefix: 'и ', chip: {
        kind: 'video',
        href: 'https://flamecgi.com',
        // Нарезка из семи роликов Flame AI (cdn.flameai.studio), по 1,1 с, 16:9. Играет внутри букв.
        video: { mp4: '/videos/hero-video-cut.mp4', webm: '/videos/hero-video-cut.webm' },
      }, },
    { text: ' в одной команде' },
  ] as IHeroTitlePart[],
};

// Срок ответа не пишем, пока его не подтвердила команда (doc/FLAME_DEV_WEBSITE_COPY.md).
export const CTA_BAND = {
  text: 'Что хотите запустить? Обсудим задачу и предложим следующий шаг',
  question: 'Что хотите запустить?',
  // Ответ делится на две части: у вариантов вторая выделена градиентом.
  answerLead: 'Обсудим задачу и ',
  answerAccent: 'предложим следующий шаг',
};

// Варианты блока «Есть задача?» (см. components/sections/CtaBand/variants.ts).
export const CTA_CHAT = {
  avatar: 'FD',
  placeholder: 'Опишите задачу…',
  draft: 'Нужен промо-сайт с игрой к запуску в ноябре',
};

export const CTA_DAY = {
  steps: [
    { time: '10:04', text: 'Вы пишете в форму или в Telegram' },
    { time: '10:30', text: 'Менеджер проекта читает задачу' },
    { time: '12:00', text: 'Смотрим вместе с разработчиком и дизайнером' },
    { time: '15:30', text: 'Задаем уточняющие вопросы, если они есть' },
    { time: '18:00', text: 'Отвечаем: подход, команда, следующий шаг' },
  ] as ICtaDayStep[],
  final: 'Оценку сроков и бюджета дадим за 2–3 дня',
  note: 'Пример одного дня, время условное',
};

export const CTA_REEL = {
  lead: 'Есть задача? Расскажите, ',
  middle: 'ответим в\u00A0течение',
  // Привычные сроки зачёркиваются и уезжают, барабан встаёт на последний.
  words: ['полугода', 'месяца', 'недели', 'трех дней'],
  final: 'дня.',
};

export const CTA_CURVE = ['Есть задача? Расскажите,', 'ответим в течение дня.'];

export const CTA_ROUTE = ['Ваша задача', 'Менеджер проекта', 'Дизайн и разработка', 'Ответ в течение дня'];

export const CONTACT = {
  title: 'Расскажите о задаче',
  text: 'Что хотите запустить, для кого и к какому сроку? Обсудим подход и предложим следующий шаг',
  telegram: { label: 'Написать в Telegram', href: 'https://t.me/flamedev', icon: 'telegram' } satisfies IContactLink,
  links: [
    { label: 'Написать в Telegram', href: 'https://t.me/flamedev', icon: 'telegram' },
    { label: 'Написать на почту', href: 'mailto:hello@flamedev.pro', icon: 'mail' },
    // «Скачать презентацию» вернуть, когда в public/ появится актуальный flame-dev.pdf.
  ] as IContactLink[],
  // Вариант «Маркер»: тот же текст, обещания по срокам выделяются маркером по скроллу.
  textMarked: [
    { text: 'Начнем с вашей задачи. ' },
    { text: 'Предложим подход', mark: true },
    { text: ' и согласуем следующий шаг' },
  ] as { text: string; mark?: boolean }[],
  // Вариант «Чат»: подпись под пузырём с текстом, как время сообщения.
  chatTime: '12:04',
  form: {
    name: { label: 'Имя', placeholder: 'Как к вам обращаться' },
    contact: { label: 'Telegram или почта', placeholder: '@username или mail@company.ru' },
    message: { label: 'Коротко о проекте', placeholder: 'Можно начать с нескольких предложений или ссылки на материалы' },
    optional: 'по желанию',
    submit: 'Отправить заявку',
    sending: 'Отправляем заявку',
    hint: 'Готовое ТЗ необязательно',
    error: 'Не удалось отправить заявку. Попробуйте еще раз или напишите нам напрямую в',
    errorLink: 'Telegram',
    successTitle: 'Спасибо, заявка отправлена',
    successText: 'Свяжемся с вами по указанному контакту',
    again: 'Отправить еще одну',
  },
};

export const FOOTER_EMAIL = 'hello@flamedev.pro';

export const FOOTER_COPYRIGHT = '© 2026 Flame dev';

export const FOOTER_TAGLINE = 'Разработка сайтов, сервисов и AI-решений';

// Подвал «Колонки»: кто мы одной фразой и ссылки по смыслу.
export const FOOTER_ABOUT = 'Команда разработки внутри Flame: платформы, спецпроекты, 3D и AI.';

export const FOOTER_COLUMNS: IFooterColumn[] = [
  { title: 'Разделы', links: NAV },
  {
    title: 'Экосистема',
    links: [
      { label: 'Flame CGI', href: 'https://flamecgi.com' },
      { label: 'Flame AI', href: 'https://app.flameai.studio' },
    ],
  },
  {
    title: 'Связаться',
    links: [
      { label: 'Telegram', href: 'https://t.me/flamedev' },
      { label: 'hello@flamedev.pro', href: 'mailto:hello@flamedev.pro' },
      { label: 'Презентация PDF', href: '/flame-dev.pdf' },
    ],
  },
];

// Подвал «Контакты-плашки»: те же ссылки, что в блоке контактов, но с видимыми подписями.
export const FOOTER_CHIPS: IContactLink[] = [
  { label: 'Telegram', href: 'https://t.me/flamedev', icon: 'telegram' },
  { label: 'hello@flamedev.pro', href: 'mailto:hello@flamedev.pro', icon: 'mail' },
  { label: 'Презентация PDF', href: '/flame-dev.pdf', icon: 'deck' },
];

// Шапка «Строка-обещание»: полоса над шапкой, уезжает вместе со страницей.
export const HEADER_STRIP = {
  text: 'Оценку сроков и бюджета дадим за 2–3 дня',
  link: 'Обсудить проект',
};

export const FOOTER_LINKS: INavItem[] = [
  ...NAV,
  { label: 'Flame CGI', href: 'https://flamecgi.com' },
  { label: 'Flame AI', href: 'https://app.flameai.studio' },
];
export const CASES_TITLE = 'Опыт в проектах';
export const CASES_TEXT = 'Сайты для брендов, цифровые платформы и системы для бизнеса. В каждом проекте показываем задачу, нашу работу и результат';
export const CASES_ALL_LABEL = 'Все кейсы';
export const CASES_INDEX_TITLE = 'Кейсы';
export const CASES_BACK_LABEL = 'На главную';
export const CASE_LIVE_LABEL = 'Открыть проект';
export const SERVICES_TITLE = 'Что разработаем для вас';
