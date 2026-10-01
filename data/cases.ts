import type { ICase } from './types';

// Общий реестр проектов: порядок публичного каталога задается отдельно в CATALOG_CASES.
// Первый тег — тип проекта (спецпроект, промо, платформа, сервис, сайт): по нему работают фильтры каталога, его показывают карточка и hero-лента.
// Следующие теги — технология или суть проекта. `logo` — файлы в public/logos/, пока нет.
// `video` — прежние вертикальные нарезки, `videoWide` — горизонтальные ролики для текущих карточек и hero.
// 27 широких роликов сверены с папкой Google Drive 30 сентября 2026 года, см. doc/MEDIA_AUDIT_2026-09-30.md.
// Flame AI и Purina × Mail используют отдельные исходники. Okamus — прежнее название Tibia, соответствие подтверждено владельцем.
// `?v=` — сброс кэша: файлы перезаписаны под теми же именами, а Cache-Control на неделю.
// Старые вертикальные лупы Amatour и Tibia разбавлены стоковыми кадрами с людьми (Mixkit, свободная лицензия).
export const CASES: ICase[] = [
  {
    slug: 'coca-cola-delivery-club',
    live: 'https://cola-dc.mw.team',
    video: { mp4: '/videos/coca-cola-delivery-club.mp4?v=20260916', webm: '/videos/coca-cola-delivery-club.webm?v=20260916', poster: '/videos/coca-cola-delivery-club.jpg?v=20260916' },
    videoWide: { mp4: '/videos/coca-cola-delivery-club-wide.mp4?v=20260930', poster: '/videos/coca-cola-delivery-club-wide.jpg?v=20260930' },
    title: 'Coca-Cola × Delivery Club',
    colors: ['#E4002B', '#1E5B3A'],
    description: 'Новогодний адвент-календарь в Delivery Club с мини-играми и подарками каждый день',
    tags: ['спецпроект', 'геймификация', 'интеграция в приложение'],
  },
  {
    slug: 'rosatom',
    live: 'https://rosatom3d.mw.team',
    video: { mp4: '/videos/rosatom.mp4?v=20260916', webm: '/videos/rosatom.webm?v=20260916', poster: '/videos/rosatom.jpg?v=20260916' },
    videoWide: { mp4: '/videos/rosatom-wide.mp4?v=20260930', poster: '/videos/rosatom-wide.jpg?v=20260930' },
    title: 'Росатом',
    colors: ['#1A1F4E', '#D7141A'],
    description: 'Спецпроект «Умный атом»: полет через микромир к технологиям будущего на Three.js',
    tags: ['спецпроект', 'Three.js', 'WebGL'],
  },
  {
    slug: 'flame-ai',
    live: 'https://app.flameai.studio/',
    video: { mp4: '/videos/flame-ai.mp4?v=20260916', webm: '/videos/flame-ai.webm?v=20260916', poster: '/videos/flame-ai.jpg?v=20260916' },
    videoWide: { mp4: '/videos/flame-ai-wide.mp4?v=20261001', poster: '/videos/flame-ai-wide.jpg?v=20261001' },
    title: 'Flame AI',
    colors: ['#262525', '#F13911'],
    description: 'Собственный SaaS: рекламный ролик из одной фотографии товара',
    tags: ['платформа', 'генеративный AI', 'SaaS'],
  },
  {
    slug: 'tibia',
    live: 'https://tibia.mw.team',
    video: { mp4: '/videos/tibia.mp4?v=20260916b', webm: '/videos/tibia.webm?v=20260916b', poster: '/videos/tibia.jpg?v=20260916b' },
    videoWide: { mp4: '/videos/tibia-wide.mp4?v=20260930', poster: '/videos/tibia-wide.jpg?v=20260930' },
    title: 'Tibia / Majorpack',
    colors: ['#E8D400', '#F2F2F0'],
    description: 'Платформа маркировки и учета труб НКТ от завода до скважины',
    tags: ['платформа', 'учетная система', 'QR-маркировка'],
  },
  {
    slug: 'amatour',
    live: 'https://amatour.ru/',
    video: { mp4: '/videos/amatour.mp4?v=20260916b', webm: '/videos/amatour.webm?v=20260916b', poster: '/videos/amatour.jpg?v=20260916b' },
    videoWide: { mp4: '/videos/amatour-wide.mp4?v=20261001', poster: '/videos/amatour-wide.jpg?v=20261001' },
    title: 'Amatour',
    colors: ['#E4141C', '#FFFFFF'],
    description: 'Платформа всероссийской серии любительских турниров по теннису',
    tags: ['платформа', 'личные кабинеты', 'онлайн-регистрация'],
  },
  {
    slug: 'purina-vk',
    live: 'https://purina-front-web.mw.team',
    poster: '/cases/purina-vk.jpg', videoWide: { mp4: '/videos/purina-vk-wide.mp4?v=20260930', poster: '/videos/purina-vk-wide.jpg?v=20260930' },
    video: { mp4: '/videos/purina-vk.mp4', webm: '/videos/purina-vk.webm', poster: '/videos/purina-vk.jpg' },
    title: 'Purina × VK',
    colors: ['#B5CC2E', '#E30613'],
    description: 'Всероссийское голосование за города, удобные для жизни с питомцами',
    tags: ['промо', 'мини-приложение VK', 'голосование'],
  },
  {
    slug: 'alibox',
    live: 'https://aliexpress.mw.team',
    poster: '/cases/aliexpress.jpg', videoWide: { mp4: '/videos/alibox-wide.mp4?v=20260930', poster: '/videos/alibox-wide.jpg?v=20260930' },
    video: { mp4: '/videos/alibox.mp4', webm: '/videos/alibox.webm', poster: '/videos/alibox.jpg' },
    title: 'AliExpress × ОК',
    colors: ['#D9EEF9', '#FF4A1F'],
    description: 'Новогодняя игра в мини-приложении Одноклассников: выбери коробку и получи промокод',
    tags: ['промо', 'мини-приложение ОК', 'геймификация'],
  },
  {
    slug: 'majorpack',
    live: 'https://www.majorpack.ru/',
    poster: '/cases/majorpack.jpg', videoWide: { mp4: '/videos/majorpack-wide.mp4?v=20260930', poster: '/videos/majorpack-wide.jpg?v=20260930' },
    video: { mp4: '/videos/majorpack.mp4', webm: '/videos/majorpack.webm', poster: '/videos/majorpack.jpg' },
    title: 'Majorpack',
    colors: ['#2F3A44', '#FFFFFF'],
    description: 'Корпоративный сайт производителя антикоррозионной защиты для нефтегазовой отрасли',
    tags: ['сайт', 'B2B', 'калькулятор'],
  },
  {
    slug: 'sozidanie',
    live: 'https://bf-sozidanie.ru/',
    poster: '/cases/sozidanie.jpg', videoWide: { mp4: '/videos/sozidanie-wide.mp4?v=20260930', poster: '/videos/sozidanie-wide.jpg?v=20260930' },
    video: { mp4: '/videos/sozidanie.mp4', webm: '/videos/sozidanie.webm', poster: '/videos/sozidanie.jpg' },
    title: 'Фонд «Созидание»',
    colors: ['#F26B1D', '#1E4D2B'],
    description: 'Сайт благотворительного фонда с онлайн-пожертвованиями',
    tags: ['сайт', 'онлайн-платежи', 'CMS'],
  },
];

// Проекты из архива (../legacy): демо на *.mw.team (открываются из РФ) и реальные адреса, сверено с LINKS.md 2026-09-30. `videoWide` — скринкасты проектов,
// 15 секунд, 1280×720, только mp4 (2026-09-30).
const LEGACY_CASES: ICase[] = [
  { slug: 'mercedes', title: 'Mercedes-AMG', colors: ['#0B0B0B', '#B6B6B6'], description: 'Лонгрид «63 факта об AMG» с анимацией и удобной навигацией по темам', tags: ['спецпроект', 'лонгрид', 'GSAP'], poster: '/cases/mercedes.jpg', videoWide: { mp4: '/videos/mercedes-wide.mp4?v=20260930', poster: '/videos/mercedes-wide.jpg?v=20260930' }, live: 'https://mercedes.mw.team' },
  { slug: 'geely', title: 'Geely × Авто Mail', colors: ['#1C2A3F', '#00B4E6'], description: 'Автопрогулка по прогрессивной архитектуре Москвы вместе с Geely Tugella', tags: ['спецпроект', 'скролл-сторителлинг'], poster: '/cases/geely.jpg', videoWide: { mp4: '/videos/geely-wide.mp4?v=20260930', poster: '/videos/geely-wide.jpg?v=20260930' }, live: 'https://geely.mw.team' },
  { slug: 'sovcombank', title: 'Совкомбанк', colors: ['#0A2A5E', '#E8322F'], description: 'Интерактивный сериал «Финансовый ситком» о кредитах и рефинансировании', tags: ['спецпроект', 'интерактивное видео'], poster: '/cases/sovcombank.jpg', videoWide: { mp4: '/videos/sovcombank-wide.mp4?v=20260930', poster: '/videos/sovcombank-wide.jpg?v=20260930' }, live: 'https://sovcombank.mw.team' },
  { slug: 'halva', title: 'Карта «Халва»', colors: ['#E31E24', '#FFFFFF'], description: 'Тест «Ваш уровень в шопинге» с параллаксом и полезными статьями', tags: ['промо', 'тест', 'GSAP'], poster: '/cases/halva.jpg', videoWide: { mp4: '/videos/halva-wide.mp4?v=20260930', poster: '/videos/halva-wide.jpg?v=20260930' }, live: 'https://halva.mw.team' },
  { slug: 't-bank', title: 'Т-Банк', colors: ['#FFDD2D', '#1A1A1A'], description: 'Промосайт «Как сбалансировать жизнь» о пяти продуктах банка', tags: ['промо', 'лендинг', 'аналитика'], poster: '/cases/tinkoff.jpg', videoWide: { mp4: '/videos/tinkoff-wide.mp4?v=20260930', poster: '/videos/tinkoff-wide.jpg?v=20260930' }, live: 'https://tinkoff.mw.team' },
  { slug: 'vtb', title: 'ВТБ × VK', colors: ['#0A2896', '#FFFFFF'], description: 'Промо привилегий ВТБ для пользователей сервисов VK', tags: ['промо', 'лендинг', 'экосистема VK'], poster: '/cases/vtb.jpg', videoWide: { mp4: '/videos/vtb-wide.mp4?v=20260930', poster: '/videos/vtb-wide.jpg?v=20260930' }, live: 'https://vtb-landing.mw.team' },
  { slug: 'weleda', title: 'Weleda', colors: ['#F2D7D9', '#7A1F2B'], description: '«Искусство красоты»: путешествие по эпохам в 3D-сцене с тестом и витриной продукта', tags: ['спецпроект', 'Three.js', 'тест'], poster: '/cases/weleda.jpg', videoWide: { mp4: '/videos/weleda-wide.mp4?v=20260930', poster: '/videos/weleda-wide.jpg?v=20260930' }, live: 'https://weleda.mw.team' },
  { slug: 'camay', title: 'Camay', colors: ['#F7C8A8', '#C2185B'], description: 'Звуковые композиции ароматов со скидкой на Ozon', tags: ['промо', 'аудио', 'e-commerce'], poster: '/cases/camay.jpg', videoWide: { mp4: '/videos/camay-wide.mp4?v=20260930', poster: '/videos/camay-wide.jpg?v=20260930' }, live: 'https://camay.mw.team' },
  { slug: 'kotex', title: 'Kotex', colors: ['#F6E8EC', '#E5007D'], description: 'Кейс-лендинг «SOS-кнопка» со скролл-сторителлингом', tags: ['спецпроект', 'скролл-сторителлинг'], poster: '/cases/kotex.jpg', videoWide: { mp4: '/videos/kotex-wide.mp4?v=20260930', poster: '/videos/kotex-wide.jpg?v=20260930' }, live: 'https://kotex-case.mw.team' },
  { slug: 'buscopan', title: 'Buscopan', colors: ['#FFFFFF', '#1A1A1A'], description: '«Дело тела»: просветительский проект о синдроме раздраженного кишечника', tags: ['спецпроект', 'контент-платформа', 'аудио'], poster: '/cases/buscopan.jpg', videoWide: { mp4: '/videos/buscopan-wide.mp4?v=20260930', poster: '/videos/buscopan-wide.jpg?v=20260930' }, live: 'https://buscopan.mw.team' },
  { slug: 'no-spa', title: 'Но-Шпа', colors: ['#FFF3B0', '#D6001C'], description: '«Алло, мам»: сайт-шпаргалка о взрослении для девочек и их мам', tags: ['сайт', 'видео', 'интерактивная игра'], poster: '/cases/no-spa.jpg', videoWide: { mp4: '/videos/no-spa-wide.mp4?v=20260930', poster: '/videos/no-spa-wide.jpg?v=20260930' }, live: 'https://no-spa-2024.mw.team' },
  { slug: 'rostelecom', title: 'Ростелеком', colors: ['#FFFFFF', '#7700FF'], description: 'Лендинг о видеонаблюдении в узнаваемых жизненных историях', tags: ['промо', 'скролл-анимация', 'иллюстрации'], poster: '/cases/rostelecom.jpg', videoWide: { mp4: '/videos/rostelecom-wide.mp4?v=20260930', poster: '/videos/rostelecom-wide.jpg?v=20260930' }, live: 'https://rostelecom.mw.team' },
  { slug: 'mail-space', title: 'Mail Space', colors: ['#EAF2FF', '#005FF9'], description: 'Новогодняя загадка: соедините героев сказок с возможностями подписки Mail Space', tags: ['промо', 'drag-and-drop', 'геймификация'], poster: '/cases/mail-space.jpg', videoWide: { mp4: '/videos/mail-space-wide.mp4?v=20260930', poster: '/videos/mail-space-wide.jpg?v=20260930' }, live: 'https://mail-cloud-ny-2025.mw.team' },
  { slug: 'nonton', title: 'Нонтон', colors: ['#F4E3C1', '#2B2B2B'], description: 'Тест «Зона комфорта» для подбора мебели по комнатам', tags: ['промо', 'квиз'], poster: '/cases/nonton.jpg', videoWide: { mp4: '/videos/nonton-wide.mp4?v=20260930', poster: '/videos/nonton-wide.jpg?v=20260930' }, live: 'https://nonton.mw.team' },
  { slug: 'teboil', title: 'Teboil', colors: ['#003D8F', '#E30613'], description: 'Контентный проект о заботе о двигателе с чек-листом и картой АЗС', tags: ['сайт', 'контент-маркетинг'], poster: '/cases/teboil.jpg', videoWide: { mp4: '/videos/teboil-wide.mp4?v=20260930', poster: '/videos/teboil-wide.jpg?v=20260930' }, live: 'https://teboil.mw.team' },
  { slug: 'purina-nestle', title: 'Purina × Mail', colors: ['#EAF2FF', '#E30613'], description: '«Пушистая анкета»: карточка питомца, сбор контактов и розыгрыш', tags: ['промо', 'лидогенерация', 'UGC'], poster: '/cases/purina-nestle.jpg', videoWide: { mp4: '/videos/purina-nestle-wide.mp4?v=20260917', webm: '/videos/purina-nestle-wide.webm?v=20260917', poster: '/videos/purina-nestle-wide.jpg?v=20260917' }, live: 'https://purina-nestle.mw.team' },
  { slug: 'total', title: 'Total', colors: ['#E30613', '#1D3A8A'], description: '«Тотальная безопасность»: статьи, подбор масла и призы для водителей', tags: ['промо', 'медиапроект', 'квиз'], poster: '/cases/total.jpg', videoWide: { mp4: '/videos/total-wide.mp4?v=20260930', poster: '/videos/total-wide.jpg?v=20260930' }, live: 'https://total.mw.team' },
  { slug: 'total-2022', title: 'Total', colors: ['#E30613', '#FFFFFF'], description: 'Видеокурс о зимнем вождении с тестом и призами', tags: ['промо', 'видеокурс', 'квиз'], poster: '/cases/total-2022.jpg', videoWide: { mp4: '/videos/total-2022-wide.mp4?v=20260930', poster: '/videos/total-2022-wide.jpg?v=20260930' }, live: 'https://total-2022.mw.team' },
  { slug: 'teva', title: 'Teva', colors: ['#00A19A', '#FFFFFF'], description: 'Многошаговая регистрация врачей с подтверждением по коду', tags: ['сервис', 'многошаговая форма', 'OTP-верификация'], poster: '/cases/teva.jpg', videoWide: { mp4: '/videos/teva-wide.mp4?v=20260930', poster: '/videos/teva-wide.jpg?v=20260930' }, live: 'https://teva-form.mw.team' },
  { slug: 'huawei', title: 'Huawei × Hi-Tech', colors: ['#FFFFFF', '#CF0A2C'], description: 'Брендзона Huawei на Hi-Tech Mail с обзорами и новостями устройств', tags: ['спецпроект', 'брендзона'], poster: '/cases/huawei.jpg', videoWide: { mp4: '/videos/huawei-wide.mp4?v=20260930', poster: '/videos/huawei-wide.jpg?v=20260930' }, live: 'https://huawei.hi-tech.mail.ru/' },
];

CASES.push(...LEGACY_CASES);

// Российские бренды открывают каталог в другом порядке, чем на главной.
// Затем идут платформы и проекты с более сложными пользовательскими сценариями.
const CATALOG_PRIORITY = [
  'rosatom', 'vtb', 'sovcombank', 'rostelecom', 't-bank', 'halva', 'sozidanie',
  'amatour', 'tibia', 'flame-ai', 'weleda', 'majorpack', 'teva', 'purina-vk', 'geely',
];
const catalogPrioritySlugs = new Set(CATALOG_PRIORITY);

// Второй ролик Total остается доступен по старой прямой ссылке, но не дублирует каталог.
const ARCHIVED_CASE_SLUGS = new Set(['total-2022']);

export const CATALOG_CASES: ICase[] = [
  ...CATALOG_PRIORITY.map((slug) => {
    const item = CASES.find((entry) => entry.slug === slug);
    if (!item) throw new Error(`Case catalog: unknown case slug "${slug}"`);
    return item;
  }),
  ...CASES.filter((item) => !catalogPrioritySlugs.has(item.slug) && !ARCHIVED_CASE_SLUGS.has(item.slug)),
];

// Две бегущие строки на главной: верхняя едет справа налево, нижняя слева направо.
export const CASES_MARQUEE: [string[], string[]] = [
  ['coca-cola-delivery-club', 'mercedes', 'rosatom', 'sovcombank', 'halva', 't-bank', 'camay', 'weleda'],
  ['flame-ai', 'vtb', 'tibia', 'buscopan', 'amatour', 'no-spa', 'kotex', 'rostelecom'],
];


// Наклонные строки (основной вариант): те же шестнадцать кейсов без дублей. Кейсы первого
// экрана стоят там, где видны в стартовом кадре: верхний ряд показывает начало,
// нижний — конец, туда и летит карточка при переходе (useHomeTransition, вариант 3).
export const CASES_TILT: string[][] = [
  ['coca-cola-delivery-club', 'rosatom', 'mercedes', 'sovcombank', 'halva', 't-bank', 'camay', 'weleda'],
  ['vtb', 'buscopan', 'no-spa', 'kotex', 'rostelecom', 'flame-ai', 'tibia', 'amatour'],
];

const bySlugs = (rows: string[][]): ICase[][] =>
  rows.map((row) =>
    row.map((slug) => {
      const item = CASES.find((c) => c.slug === slug);
      if (!item) throw new Error(`Cases rows: unknown case slug "${slug}"`);
      return item;
    }),
  );

export const CASES_TILT_ROWS: ICase[][] = bySlugs(CASES_TILT);

export const CASES_MARQUEE_ROWS: [ICase[], ICase[]] = CASES_MARQUEE.map((row) =>
  row.map((slug) => {
    const item = CASES.find((c) => c.slug === slug);
    if (!item) throw new Error(`CASES_MARQUEE: unknown case slug "${slug}"`);
    return item;
  }),
) as [ICase[], ICase[]];

export const HERO_REEL_SLUGS = ['coca-cola-delivery-club', 'rosatom', 'flame-ai', 'tibia', 'amatour'];

export const HERO_REEL_LABELS: Record<string, string> = {
  'coca-cola-delivery-club': 'Coca-Cola',
  rosatom: 'Росатом',
  'flame-ai': 'Flame AI',
  tibia: 'Tibia',
  amatour: 'Amatour',
};
export const HERO_REEL_CTA = 'Смотреть кейс';

export const HERO_REEL: ICase[] = HERO_REEL_SLUGS.map((slug) => {
  const item = CASES.find((c) => c.slug === slug);
  if (!item) throw new Error(`HERO_REEL: unknown case slug "${slug}"`);
  return item;
});

// Фильтры на странице /cases: группы по первому тегу кейса.
export interface ICaseFilter {
  id: string;
  label: string;
  /** Первые теги, которые попадают в группу; пустой список — все кейсы. */
  tags: string[];
}

export const CASE_FILTERS: ICaseFilter[] = [
  { id: 'all', label: 'Все', tags: [] },
  { id: 'special', label: 'Спецпроекты', tags: ['спецпроект'] },
  { id: 'promo', label: 'Промо', tags: ['промо'] },
  { id: 'platform', label: 'Платформы', tags: ['платформа', 'сервис'] },
  { id: 'site', label: 'Сайты', tags: ['сайт'] },
];

export const caseMatchesFilter = (item: ICase, filter: ICaseFilter): boolean =>
  filter.tags.length === 0 || filter.tags.includes(item.tags[0]);
