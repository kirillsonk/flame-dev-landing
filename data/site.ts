import { HERO_REEL, HERO_REEL_LABELS } from './cases';
import type { IAnchor, IContactLink, ICtaDayStep, IFooterColumn, IHeroSlide, IHeroTitlePart, ILang, INavItem } from './types';

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

export const HERO_SLIDE_LINK = 'Смотреть кейс';

export const LANGS: ILang[] = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN', hint: 'Английская версия готовится' },
];

export const NAV: INavItem[] = [
  { label: 'Кейсы', href: '#cases' },
  { label: 'Услуги', href: '#services' },
  { label: 'Процесс', href: '#process' },
  { label: 'Контакт', href: '#contact' },
];

export const CTA_LABEL = 'Обсудить проект';

// Якоря по id (AnchorScroll). Запиненная секция сразу открывается на старте своего пина, без
// прокрутки от соседей, и дальше анимация проигрывается до точки — доли пина 0…1: «контакт» —
// до конца, чтобы форма была раскрыта; «кейсы» и «услуги» — чуть дальше старта, примерно на
// полэкрана прокрутки, чтобы блок ожил (пины разной длины, доли подобраны под неё). «Процесс»
// наоборот: открывается на неделе 3 таймлайна (3 из 14) и едет назад к старту. К первому экрану и началу страницы (логотип, `#top`, `#hero`) — прыжок без анимации.
// Секции без пина и не перечисленные здесь — к началу с учётом scroll-padding-top.
export const ANCHORS: Record<string, IAnchor> = {
  top: { instant: true },
  hero: { instant: true },
  cases: { stop: 0.15 },
  services: { stop: 0.1 },
  process: { open: 0.21, stop: 'start' },
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

export const CTA_BAND = {
  text: 'Есть задача? Расскажите, ответим в течение дня.',
  question: 'Есть задача?',
  // Ответ делится на две части: у вариантов «в течение дня» выделено градиентом.
  answerLead: 'Расскажите, ответим ',
  answerAccent: 'в\u00A0течение дня.',
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
    { time: '15:30', text: 'Задаём уточняющие вопросы, если они есть' },
    { time: '18:00', text: 'Отвечаем: подход, команда, следующий шаг' },
  ] as ICtaDayStep[],
  final: 'Оценку сроков и бюджета дадим за 2–3 дня',
  note: 'Пример одного дня, время условное',
};

export const CTA_REEL = {
  lead: 'Есть задача? Расскажите, ',
  middle: 'ответим в\u00A0течение',
  // Привычные сроки зачёркиваются и уезжают, барабан встаёт на последний.
  words: ['полугода', 'месяца', 'недели', 'трёх дней'],
  final: 'дня.',
};

export const CTA_CURVE = ['Есть задача? Расскажите,', 'ответим в течение дня.'];

export const CTA_ROUTE = ['Ваша задача', 'Менеджер проекта', 'Дизайн и разработка', 'Ответ в течение дня'];

export const CONTACT = {
  title: 'Расскажите о задаче',
  text: 'Ответим в течение дня. Оценку сроков и бюджета дадим за 2–3 дня.',
  telegram: { label: 'Написать в Telegram', href: 'https://t.me/flamedev', icon: 'telegram' } satisfies IContactLink,
  links: [
    { label: 'Написать в Telegram', href: 'https://t.me/flamedev', icon: 'telegram' },
    { label: 'Написать на hello@flame.dev', href: 'mailto:hello@flame.dev', icon: 'mail' },
    { label: 'Скачать презентацию (PDF)', href: '/flame-dev.pdf', icon: 'deck' },
  ] as IContactLink[],
  // Вариант «Маркер»: тот же текст, обещания по срокам выделяются маркером по скроллу.
  textMarked: [
    { text: 'Ответим ' },
    { text: 'в течение дня', mark: true },
    { text: '. Оценку сроков и бюджета дадим ' },
    { text: 'за 2–3 дня', mark: true },
    { text: '.' },
  ] as { text: string; mark?: boolean }[],
  // Вариант «Чат»: подпись под пузырём с текстом, как время сообщения.
  chatTime: '12:04 · ответим в течение дня',
  form: {
    name: { label: 'Имя', placeholder: 'Как к вам обращаться' },
    contact: { label: 'Telegram или почта', placeholder: '@username или mail@company.ru' },
    message: { label: 'Коротко о задаче', placeholder: 'Что делаем, к какому сроку, есть ли бюджет' },
    optional: 'по желанию',
    submit: 'Отправить',
    sending: 'Отправляем…',
    hint: 'Ответим в течение дня. Без спама и рассылок.',
    error: 'Не отправилось. Напишите нам напрямую:',
    errorLink: 'Telegram',
    successTitle: 'Заявка у нас',
    successText: 'Ответим в течение дня — в Telegram или на почту, которую вы оставили.',
    again: 'Отправить ещё одну',
  },
};

export const FOOTER_EMAIL = 'hello@flame.dev';

export const FOOTER_COPYRIGHT = '© 2026 Flame Dev';

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
      { label: 'hello@flame.dev', href: 'mailto:hello@flame.dev' },
      { label: 'Презентация PDF', href: '/flame-dev.pdf' },
    ],
  },
];

// Подвал «Контакты-плашки»: те же ссылки, что в блоке контактов, но с видимыми подписями.
export const FOOTER_CHIPS: IContactLink[] = [
  { label: 'Telegram', href: 'https://t.me/flamedev', icon: 'telegram' },
  { label: 'hello@flame.dev', href: 'mailto:hello@flame.dev', icon: 'mail' },
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
export const CASES_TITLE = 'Проекты, которые работают';
export const CASES_ALL_LABEL = 'Все кейсы';
export const CASES_INDEX_TITLE = 'Кейсы';
export const CASE_LIVE_LABEL = 'Открыть проект';
export const SERVICES_TITLE = 'Что мы делаем';
