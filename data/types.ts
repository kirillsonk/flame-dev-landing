export interface ICaseVideo {
  mp4: string;
  webm?: string;
  poster?: string;
}

/** Страница кейса: заголовок, суть проекта и что сделали */
export interface ICaseStory {
  /** Короткий заголовок блока, несколько слов */
  title: string;
  summary: string;
  done: string[];
}

export interface ICaseLogo {
  src: string;
  alt: string;
}

export interface ICase {
  slug: string;
  title: string;
  colors: [string, string];
  description: string;
  /** Первый тег — категория, её показывают карточка и hero-лента. */
  tags: string[];
  /** Логотип клиента в тайле на постере; без него тайл не рендерится. */
  logo?: ICaseLogo;
  /** 9:16 для hero-ленты. */
  video?: ICaseVideo;
  /** 16:9 для карточки кейса; без него карточка кадрирует `video`. */
  videoWide?: ICaseVideo;
  /** Статичный постер 16:9, когда ролика нет (скриншот живого проекта). */
  poster?: string;
  /** Живой проект или демо-зеркало: ссылка «Открыть проект» на странице кейса. */
  live?: string;
}

export type ServiceVisualKind = 'tibia' | 'match3' | 'rosatom' | 'prompt';

export interface IService {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  visual: ServiceVisualKind;
}

export interface IProcessStep {
  title: string;
  /** Срок шага, если он известен заранее: выводится перед описанием. */
  duration?: string;
  description: string;
}

/** Полоса шага на диаграмме Ганта, в неделях проекта. */
export interface IProcessGanttBar {
  start: number;
  end: number;
  /** Недели демо — ромбы на полосе. */
  demos?: number[];
  /** Полоса без правого края: шаг продолжается после графика. */
  open?: boolean;
}

export interface IProcessLogLine {
  kind: 'cmd' | 'step' | 'out';
  text: string;
  status?: string;
  /** Статус «в работе» с точкой вместо галочки. */
  live?: boolean;
  /** Индекс шага, который закрывает эта строка. */
  done?: number;
}

/** Отсечка секундомера: день проекта, на котором шаг закончен, и подпись в таблице. */
export interface IProcessLap {
  day: number;
  split: string;
}

export interface IWhyCard {
  title: string;
  description: string;
  featured?: boolean;
}

export interface IEcosystemCard {
  title: string;
  description: string;
  href: string;
  label: string;
  /** Логотип продукта в ленте «Flame — это еще и» */
  logo?: 'cgi' | 'ai';
}

/** Строка титров: роль и имя, либо роль и карточка продукта (индекс в ECOSYSTEM_CARDS). */
export interface IEcosystemCredit {
  role: string;
  name?: string;
  card?: number;
}

export interface INavItem {
  label: string;
  href: string;
}

/** Куда ведёт якорь запиненной секции: к началу пина, к концу её анимации или к доле пина 0…1. */
export type AnchorStop = 'start' | 'end' | number;

export interface IAnchor {
  /** Где блок открывается перед анимацией; по умолчанию старт пина. */
  open?: AnchorStop;
  /** Где анимация останавливается; по умолчанию старт пина. */
  stop?: AnchorStop;
  /** Прыжок без плавной прокрутки: к началу страницы через все пины ехать долго. */
  instant?: boolean;
}

export interface ILang {
  code: string;
  label: string;
  /** Пока переключатель только визуальный: подсказка объясняет, что версии ещё нет. */
  hint?: string;
}

export type IconName = 'telegram' | 'mail' | 'deck' | 'arrow' | 'arrowUp' | 'sliders' | 'check';

export interface IFooterColumn {
  title: string;
  links: INavItem[];
}

export interface IContactLink {
  /** Подпись живёт в aria-label и тултипе: в вёрстке ссылка — иконка. */
  label: string;
  href: string;
  icon: IconName;
}

export interface IHeroSlide {
  id: string;
  /** Подпись на кнопке переключателя. */
  label: string;
  /** Полное название кейса: открывает подпись кадра. */
  title: string;
  /** Строка под заголовком: что именно в кадре. */
  caption: string;
  /** Страница кейса: переход с активного кадра. */
  href: string;
  video: ICaseVideo;
}

export type HeroChipKind = 'design' | 'dev' | 'video';

/** Пилюля надзаголовка первого экрана: ведет к услуге, ховер по смыслу услуги. */
export interface IHeroPill {
  label: string;
  /** slug услуги из data/services.ts. */
  service: string;
  effect: 'frame' | 'roll' | 'game' | 'spark';
  /** Слова, сквозь которые прокручивается пилюля с effect: 'roll'. */
  stack?: string[];
}

export interface IHeroTitlePart {
  text: string;
  /** Фрагмент рендерится чипом-ссылкой с уникальным ховером. */
  /** meta — текст бейджа до первого измерения; stack — слова, сквозь которые прокручивается чип «разработка». */
  chip?: { kind: HeroChipKind; href: string; meta?: string; stack?: string[]; video?: ICaseVideo };
  /** Короткое слово перед чипом: живёт внутри неразрывной обёртки, поэтому не остаётся висеть. */
  prefix?: string;
  /** Знак препинания, который не должен отрываться от чипа переносом. */
  suffix?: string;
}

export interface ICtaDayStep {
  time: string;
  text: string;
}

export interface IVariantOption {
  value: string;
  label: string;
}

export interface IVariantGroup {
  /** Ключ группы в сохранённом выборе (useVariants). */
  id: string;
  title: string;
  /** Вариант по умолчанию: при выборе ключ убирается из сохранённого выбора. */
  fallback: string;
  options: IVariantOption[];
}

/** Раздел юридического документа: абзацы или список */
export interface ILegalSection {
  /** Якорь раздела, например cookies для ссылки из плашки */
  id?: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export interface ILegalDocument {
  title: string;
  intro: string[];
  sections: ILegalSection[];
}
