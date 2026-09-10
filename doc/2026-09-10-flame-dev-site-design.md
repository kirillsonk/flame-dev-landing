# Flame Dev — сайт-визитка. Дизайн-спека (код без макетов)

Дата: 2026-09-10. Основание: `doc/flame-dev-spec.md` (ТЗ), вайрфрейм
Figma `aeSryItOTNYW6bQM6dx7IX` (страница Wireframe, десктоп `1:2`,
мобайл `21:2`), презентация «MW Team — Projects showcase», репозиторий
`FlameAi/landingv2` как источник бренда Flame AI, конвенции из vault
`LLM Dev Setup` (Next.js-архетип, fluid rem, плоский BEM, Formik + Yup,
три уровня анимации).

## 1. Цель и границы

Собрать сайт Flame Dev в коде прямо по вайрфрейму и этой спеке, без
промежуточных макетов в Figma. Сайт должен читаться как часть семьи
Flame (тёмная база, TTFirsNeue, радиусы, свечение), но с синим акцентом
вместо красного. Дизайн-решения принимаются в браузере на живой вёрстке.

В первую версию входит: десктоп 1440 и мобайл 390, все секции 00–08,
преследующий CTA (шапка, плавающая кнопка с мини-формой, липкая панель
на мобайле), форма заявки, ленивые видео с постерами, живые фрагменты в
услугах, pinned-скролл процесса.

Не входит: EN-версия (закладываем структуру текстов, но не роутинг),
финальные тексты и цифры, реальные видеобаннеры (плейсхолдеры в цветах
брендов), мягкий exit-intent баннер (опционален по ТЗ, откладываем),
аналитика, деплой.

## 2. Принятые решения

| Вопрос | Решение |
|---|---|
| Тема | Полностью тёмная, как Flame AI и Flame CGI |
| Акцент | Кобальт `#3B78FF`, ховер `#6394FF`, текст на акценте тёмный |
| Логотип | FLAME из фирменного SVG Flame AI + DEV надстрочным блоком в той же угловатой пластике, собирается как React-компонент `Logo` с inline SVG |
| Макеты | Нет. Источник истины: вайрфрейм + эта спека, итерации в браузере |
| Стек | Next.js App Router (актуальная стабильная версия), React, TypeScript, SCSS Modules без Tailwind, `next/font/local` для TTFirsNeue, npm |
| Ширины макетов | Десктоп 1440, мобайл 390. Fluid rem: `html { font-size: 10px }`, до 1440 `10/1440*100vw`, до 768 portrait `10/390*100vw` |
| Типографика | Три размера по ТЗ, без промежуточных |
| Процесс | Простой план superpowers в `doc/`, выполнение по задачам с коммитами |

## 3. Токены

Живут в `:root` в `app/globals.scss` как CSS custom properties.

### 3.1 Цвета

| Переменная | Значение | Роль |
|---|---|---|
| `--color-bg` | `#262525` | фон страницы |
| `--color-surface` | `#2D2C2C` | карточки, панели |
| `--color-elevated` | `#3D3D3E` | постеры-заглушки, ховер chrome-кнопки |
| `--color-border` | `#3D3D3E` | все бордеры 1px |
| `--color-border-strong` | `#9D9C9E` | нижняя линия инпутов |
| `--color-text` | `#FCFBFB` | основной текст |
| `--color-text-dim` | `#9D9C9E` | вторичный текст, описания |
| `--color-text-cold` | `#B4BBC4` | подписи под шагами, мелкие строки |
| `--color-action-primary` | `#3B78FF` | кнопка primary, ссылки, активный шаг, заливка таймлайна |
| `--color-action-primary-hover` | `#6394FF` | ховер акцента |
| `--color-on-action` | `#262525` | текст на акцентной заливке |
| `--color-glow` | `rgba(59,120,255,.26)` | свечение за hero и вокруг CTA, `.42` на ховере |
| `--color-success` | `#31D269` | успешная отправка формы |
| `--color-error` | `#F70E3D` | ошибка поля |

Нажатое состояние primary-кнопки: заливка `--color-text`, текст
`--color-action-primary` (инверсия, как в Flame AI).

### 3.2 Размеры (в rem, 1rem = 10px на ширине макета)

| Переменная | Desktop 1440 | Mobile 390 |
|---|---|---|
| `--type-display` | 4.8rem | 3.6rem |
| `--type-title` | 2.4rem | 2.4rem |
| `--type-body` | 1.6rem | 1.6rem |
| `--space-section` | 12rem | 8rem |
| `--space-gutter` | 12rem | 2rem |
| `--space-grid-gap` | 2.4rem | 1.6rem |
| `--size-button` | 4.8rem | 4.8rem |
| `--size-button-hero` | 5.6rem | 5.2rem |
| `--size-header` | 8rem | 6.4rem |

Мобильные значения переопределяются в `:root` одним медиа-запросом
`(max-width: 768px) and (orientation: portrait)`. Внутри компонентов
медиа-запросы только для структурных изменений. Шкала отступов внутри
компонентов: 0.4 / 0.8 / 1.2 / 1.6 / 2.4 / 3.2 / 4.8 / 6.4rem. Контейнер
120rem внутри 144rem.

### 3.3 Текстовые стили (миксины в `styles/_typography.scss`)

| Миксин | Размер | Вес | Трекинг | Интерлиньяж | Примечание |
|---|---|---|---|---|---|
| `text-display` | `--type-display` | 700 | −0.03em | 1.1 | hero курсивный, заголовки секций прямые |
| `text-title` | `--type-title` | 700 | −0.02em | 1.15 | названия карточек, шаги |
| `text-body` | `--type-body` | 400 | 0 | 1.5 | описания, теги, кнопки, навигация |

Шрифт: TTFirsNeue, файлы woff2 копируются из
`FlameAi/landingv2/public/fonts/TTFirsNeue/` (400, 500, 700, 700 italic)
и подключаются через `next/font/local` с переменной `--font`.

### 3.4 Форма

Радиусы: 0.8rem контролы и теги, 1.4rem карточки кейсов и услуг, 1.6rem
стеклянные панели (плавающий CTA), 99.9rem чипы. Бордеры 1px. Тени
только ореол CTA: `0 0 4.4rem var(--color-glow), 0 0.6rem 2rem
rgba(0,0,0,.38)`. Стекло: `--color-surface` 55% + `backdrop-filter:
blur(14px)`. Скрим постеров: `linear-gradient(180deg, rgba(0,0,0,.5) 0%,
transparent 25%, transparent 70%, rgba(0,0,0,.5) 100%)`.

## 4. Структура репозитория

```
app/
  layout.tsx            шрифт, метаданные, PageGlow, Header, Footer
  page.tsx              порядок секций 01–07
  globals.scss          reset, :root токены, fluid rem, reduced-motion
  api/lead/route.ts     приём формы (см. раздел 8)
components/
  ui/                   примитивы Base*
    BaseButton/         BaseButton.tsx + .module.scss
    BaseTag/
    BaseInput/          input и textarea одним компонентом (prop multiline)
    Logo/               Logo.tsx с inline SVG, prop variant header|footer
    Poster/             постер кейса: цветная плашка + видео + скрим
  layout/
    Header/             sticky, десктоп и мобайл с бургером
    Footer/
    PageGlow/           синее свечение, перенос из landingv2 с заменой цвета
  sections/
    Hero/               Hero.tsx, HeroReel.tsx (полосы), hooks/useReelRotation.ts
    Cases/              Cases.tsx, CaseCard.tsx
    CtaBand/
    Services/           Services.tsx, ServiceCard.tsx, visuals/ (4 живых фрагмента)
    Why/
    Process/            Process.tsx, ProcessStep.tsx, hooks/useProcessScroll.ts (GSAP)
    Ecosystem/
    Contact/            Contact.tsx, LeadForm.tsx, LeadForm.validationSchema.ts
  cta/
    FloatingCta/        кнопка + мини-форма, десктоп
    MobileCtaBar/       липкая панель, мобайл
    hooks/useCtaVisibility.ts   показ после hero, скрытие на секции 07
data/
  cases.ts              контент кейсов (раздел 7)
  services.ts
  process.ts
  site.ts               навигация, контакты, ссылки Flame CGI / Flame AI
hooks/
  useReveal.ts          IntersectionObserver + data-reveal (уровень 1)
  useInView.ts          общий хук для ленивых видео
styles/
  _typography.scss      миксины text-display / text-title / text-body
  _mixins.scss          container, glass, glow
public/
  fonts/TTFirsNeue/
  posters/              позже: реальные постеры и видео
```

Правила: один компонент на файл, `{Name}Props` без `I`, стрелочные
функции с `export default` внизу, `import styles from
'./X.module.scss'`, плоский BEM в классах (`.caseCard__poster`, без
`&__`), контент в `data/`, а не в JSX, алиас `@/*`.

## 5. Компоненты

| Компонент | Варианты и пропсы | Спека |
|---|---|---|
| `BaseButton` | `variant: primary \| inverse \| chrome \| ghost`, `size: m \| l`, `as: button \| a` | высота `--size-button` / `--size-button-hero`, padding 0 2.4rem, радиус 0.8rem, body 500; primary с ореолом; inverse = заливка `--color-text`, текст `--color-action-primary`, только на синей CTA-полосе |
| `BaseTag` | `variant: outline \| accent` | высота 3.2rem, padding 0 1.2rem, радиус 0.8rem, body |
| `BaseInput` | `multiline`, `error`, Formik `field` | без рамки, нижняя линия 1px `--color-border-strong`, фокус акцентом, ошибка `--color-error`, высота 4.8rem, textarea 12rem |
| `Logo` | `variant: header \| footer` | FLAME из SVG + DEV блоком; высота 2.2rem / 1.8rem |
| `Poster` | `case`, `size`, `playing` | плашка `case.colors`, название, скрим, `<video preload="none">` с постером, play по `playing` |
| `HeroReel` | список 5 кейсов | полосы flex: раскрытая `flex: 2.4`, свёрнутые `flex: 1`, transition 0.6s; ховер раскрывает, без ховера авто-ротация каждые 4.5s; клик — якорь `#cases` |
| `CaseCard` | `size: l \| m \| s` | постер, title, body dim, теги; ховер: бордер акцент 55%, `translateY(-0.4rem)` |
| `ServiceCard` | `visual` (ReactNode) | 58.8×38.3rem, слот визуала 53.2×22rem, title, body, 3–4 тега стека |
| `ProcessStep` | `active` | номер display, title, body cold; active подсвечивает номер акцентом |
| `FloatingCta` | `expanded` | стекло 1.6rem, мини-форма имя + контакт + кнопка, тот же `LeadForm` в compact-режиме |
| `MobileCtaBar` | | полоса во всю ширину 6.4rem, primary-кнопка |
| `LeadForm` | `compact` | Formik + Yup, поля имя, контакт (Telegram или почта), о задаче (не в compact); статусы idle / sending / success / error |
| `Header` | | sticky `--size-header`, логотип, навигация Кейсы · Услуги · Процесс · Контакт, RU/EN (заглушка), primary «Обсудить проект»; на мобайле логотип, RU, бургер и оверлей-меню |
| `Footer` | | логотип, ссылки, Flame CGI / Flame AI, соцсети, RU/EN |

## 6. Секции

**00 Header.** Высота `--size-header`, sticky, фон `--color-bg` 85% +
blur 20px после скролла.

**01 Hero.** Заголовок display курсив «Сложные системы и спецпроекты
для брендов» в две строки, справа три строки body: `[N] лет`, `[N]
проектов`, «Полный цикл: дизайн · разработка · видео». Ниже `HeroReel`
высотой 62rem: Coca-Cola × Delivery Club раскрыта, Росатом, Flame AI,
Tibia, Amatour свёрнуты. Позади полос радиальное свечение
`--color-glow` с блюром 60px (`PageGlow`, следует за курсором). Высота
hero от контента, не от 100vh. Никаких логотипов клиентов.

**02 Кейсы** (`#cases`). Заголовок display. Ряд 1: L-карточки Coca-Cola
× Delivery Club и Росатом. Ряд 2: M-карточки Flame AI, Tibia /
Majorpack, Amatour. Ряд 3: S-карточки Purina × VK, AliExpress × ОК,
Majorpack, Фонд «Созидание». Под сеткой строка body: «Huawei — редизайн
главной, дизайн-проект → Behance». Без метрик.

**02b CTA-полоса.** Заливка `--color-action-primary` на всю ширину,
высота 16rem, текст title `--color-on-action` «Есть задача? Расскажите,
ответим в течение дня», справа `BaseButton variant="inverse"`.
Единственный сплошной синий блок на странице.

**03 Что мы делаем** (`#services`). Заголовок display, четыре
`ServiceCard` 2×2. Визуалы: таблица Tibia (строки дозаполняются при
наведении), мини-игра «три в ряд» 6×6 на React-стейте, 3D-объект
Росатома (Three.js, следует за курсором), промпт Flame AI (текст
печатается сам, ниже проявляется кадр).

**04 Один подрядчик вместо трёх.** Три карточки, третья про Flame AI с
бордером акцентом.

**05 Как проходит проект** (`#process`). Заголовок display. Секция
пинится, пять `ProcessStep` листаются горизонтально по скроллу колеса
(GSAP ScrollTrigger, `pin` + `scrub`), таймлайн 0.8rem заливается
акцентом синхронно, активный шаг подсвечивается. На мобайле без пина:
горизонтальный `scroll-snap` с таймлайном, заливка по `scrollLeft`. Под
шагами строка body cold: «Один менеджер на проект, демо каждые две
недели, без сюрпризов по срокам».

**06 Flame — это ещё и.** Две карточки со ссылками на flamecgi.com и
Flame AI.

**07 Расскажите о задаче** (`#contact`). Слева заголовок display, body
dim, три ссылки акцентом (Telegram, почта, PDF). Справа `LeadForm`.

**08 Footer.** Высота 9.6rem.

**Мобайл 390.** Один столбец, поля 2rem. Hero: display 3.6rem курсив,
три строки body столбиком, полосы как свайп-карусель (одна раскрыта
29×46rem, следующая выглядывает), пять точек, primary-кнопка во всю
ширину. Карусель на `scroll-snap`, без swiper, пока не понадобятся
жесты сложнее свайпа. Кейсы столбиком в порядке значимости, все
карточки во всю ширину, постер 16:10. Услуги и «почему» столбиком.
`MobileCtaBar` появляется после hero и скрывается на секции 07.

## 7. Контент кейсов (`data/cases.ts`)

Постер до появления видео = плашка в цветах бренда с названием кейса,
поверх скрим. Цвета из презентации «MW Team — Projects showcase»:

| slug | Кейс | Размер | Цвета | Описание | Теги |
|---|---|---|---|---|---|
| `coca-cola-delivery-club` | Coca-Cola × Delivery Club | L | `#E4002B`, `#1E5B3A` | Модуль «Задание дня» в приложении Delivery Club: мини-игры, промокоды, розыгрыши | спецпроект, мини-игры, API |
| `rosatom` | Росатом — «Умный атом» | L | `#1A1F4E`, `#D7141A` | 3D-путешествие по космосу на Three.js с остановками у статей | 3D / WebGL, спецпроект |
| `flame-ai` | Flame AI | M | `#262525`, `#F13911` | AI-платформа генерации рекламных видео. Собственный продукт | AI, SaaS |
| `tibia` | Tibia / Majorpack | M | `#E8D400`, `#F2F2F0` | Платформа маркировки и логистики труб НКТ, ПО для сканирующих терминалов | ERP, hardware |
| `amatour` | Amatour | M | `#E4141C`, `#FFFFFF` | SaaS-платформа теннисных турниров: рейтинг, кабинеты, подписки | платформа, подписки |
| `purina-vk` | Purina × VK | S | `#B5CC2E`, `#E30613` | Голосование за pet-friendly города: сайт, мини-апп VK, карта | mini-app |
| `alibox` | AliExpress × ОК | S | `#D9EEF9`, `#FF4A1F` | Розыгрыш промокодов в мини-аппе Одноклассников | промо |
| `majorpack` | Majorpack | S | `#2F3A44`, `#FFFFFF` | Корпоративный сайт и калькулятор выбросов | сайт |
| `sozidanie` | Фонд «Созидание» | S | `#F26B1D`, `#1E4D2B` | Сайт с онлайн-пожертвованиями, CMS, CloudPayments | сайт |

Порядок полос hero: `coca-cola-delivery-club`, `rosatom`, `flame-ai`,
`tibia`, `amatour`. Теги стека в услугах: Django · Go · интеграции;
React · WebView · VK Mini Apps; Three.js · WebGL · Next.js; LLM · боты ·
автоматизация. Тексты услуг, «почему» и процесса берутся из ТЗ и
вайрфрейма как черновые.

## 8. Форма и данные

`LeadForm` отправляет `POST /api/lead` с `{ name, contact, message?,
source: 'form' | 'floating' | 'mobile-bar' }`. Route handler валидирует
теми же Yup-правилами и пересылает в Telegram через Bot API
(`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` из `.env`); без переменных в
dev просто логирует в консоль и отвечает 200. Ошибка сети показывается
под кнопкой с предложением написать в Telegram напрямую.

## 9. Анимация и производительность

По конвенции «три уровня эскалации»:

- Уровень 1, `useReveal` (IntersectionObserver + CSS): появление секций,
  полосы hero, ховеры карточек, таблица Tibia, промпт Flame AI, мини-игра.
- Уровень 2, GSAP ScrollTrigger: только секция 05 (pin + scrub).
- Уровень 3, vanilla Three.js в классе `RosatomScene`, монтируется через
  `useEffect`, чанк грузится через `next/dynamic` с `ssr: false` только
  когда карточка в вьюпорте. До появления реальной модели — процедурный
  «атом» (сфера + три орбиты).

Видео: `<video muted playsInline loop preload="none" poster>`, `load()`
и `play()` по входу в вьюпорт через `useInView`, `pause()` при выходе.
Лупы 3–6 с, mp4 + webm, единицы мегабайт. `prefers-reduced-motion`
отключает авто-ротацию, pin и автоплей. Никаких библиотек для reveal и
каруселей.

## 10. Критерии готовности

- `npm run build` и `npm run lint` проходят без ошибок.
- На странице ровно три размера шрифта (проверка по computed styles).
- Все цвета и размеры в компонентах через `var(--…)` и rem, без px в
  модулях (кроме 1px бордеров и blur).
- Секции 00–08 собраны на 1440 и 390, между брейкпоинтами масштабируются
  без ломки за счёт fluid rem.
- Преследующий CTA работает: кнопка в шапке всегда видна, плавающий CTA
  появляется после hero и исчезает на секции 07, липкая панель на
  мобайле ведёт себя так же.
- Форма валидируется, отправляется, показывает успех и ошибку.
- Видео не грузятся до входа в вьюпорт, постеры видны сразу.
- Lighthouse Performance на мобайле не ниже 90 с плейсхолдерами.
- Классы в SCSS плоские, контент в `data/`, компоненты именованы по
  конвенции.
