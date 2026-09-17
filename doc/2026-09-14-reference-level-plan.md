# Уровень референсов — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Подтянуть сайт до уровня референсов (cuberto, redcollar и др.) типографикой и доказательствами, без изменения структуры и зависимостей.

**Architecture:** Спека — раздел «Итерация „уровень референсов“» в `doc/2026-09-10-flame-dev-site-design.md`. Меняем токен display, переводим секционные заголовки на title, добавляем строку доказательств в hero, отрасль и hover-видео в кейсы, номера в «Подход», сжимаем экосистему, усиливаем футер. Тесты не пишем (CLAUDE.md); проверка — `npm run build && npm run lint && npm run typecheck` и скриншоты 1440/390.

**Tech Stack:** Next.js 16, React 19, SCSS Modules, CSS keyframes + IntersectionObserver.

---

### Task 1: Токен display и каскад hero

**Files:**
- Modify: `app/globals.scss` (`--type-display`, keyframes `hero-in`)
- Modify: `components/sections/Hero/Hero.module.scss`, `Hero.tsx`
- Modify: `data/site.ts` (`HERO`)

- [ ] `--type-display: 8rem` (desktop), `4.4rem` (mobile) в `:root`.
- [ ] `HERO = { title, tagline: 'Дизайн, разработка и видео в одной команде.', clients: ['Coca-Cola','Росатом','AliExpress','Purina','VK','Huawei'] }`.
- [ ] `Hero.tsx`: `hero__top` → заголовок на всю ширину, ниже `hero__proof` (tagline + clients через ` · `), классы `hero__enter` с `--enter-delay` 0 / 0.12s / 0.24s на заголовке, proof и ленте.
- [ ] `globals.scss`: `@keyframes hero-in { from { opacity: 0; translate: 0 1.6rem } to { opacity: 1; translate: 0 0 } }`; в `Hero.module.scss` `.hero__enter { animation: hero-in 0.7s var(--ease) both; animation-delay: var(--enter-delay, 0s) }`; reduced-motion уже глушит анимации глобально.
- [ ] Проверить, что лента остаётся ≥ 40rem на 1440×900 (grid row `minmax(0,1fr)`).

### Task 2: Секционные заголовки на title

**Files:**
- Modify: `styles/_mixins.scss` (новый миксин `section-head`)
- Modify: `Cases/Cases.tsx|.module.scss`, `Services/Services.*`, `Why/Why.*`, `Process/Process.*`, `Ecosystem/Ecosystem.*`

- [ ] Миксин `section-head`: `display:flex; align-items: baseline; gap: var(--space-card); padding-top: var(--space-card); margin-bottom: var(--space-heading); border-top: 1px solid var(--color-border)`; внутри `.x__label` body dim и `.x__title` title. На мобиле — колонкой.
- [ ] В каждой секции обернуть label + h2 в `<div className={styles.x__head}>`; h2 с `text-title`. Контакт остаётся на display.

### Task 3: Кейсы — отрасль, hover-видео, L-название display

**Files:**
- Modify: `data/types.ts` (`industry: string` в `ICase`), `data/cases.ts`
- Modify: `components/ui/Poster/Poster.tsx` (`playOnHover?: boolean`)
- Modify: `components/sections/Cases/CaseCard.tsx|.module.scss`

- [ ] `industry` для всех девяти кейсов.
- [ ] `Poster`: при `playOnHover` и `matchMedia('(hover: hover) and (pointer: fine)')` — играть только при `hovered` (state от `onMouseEnter/Leave` на корне постера), иначе прежняя логика `inView && playing`.
- [ ] `CaseCard`: `<p className={styles.caseCard__industry}>` над заголовком; `Poster playOnHover`; `.caseCard--l .caseCard__title { @include text-display }`; `.caseCard__poster video`-масштаб: `.caseCard__poster { transition: transform .6s var(--ease) } .caseCard:hover .caseCard__poster { transform: scale(1.04) }` (через `@include hover` на `.caseCard` невозможно вложить — использовать `.caseCard__poster` с `@include hover` на родителе: `.caseCard { @include hover { .caseCard__poster { transform: scale(1.04) } } }` нарушает плоский BEM → использовать `.caseCard__poster { @include hover {...} }` на самом постере).

### Task 4: Подход — номера

**Files:**
- Modify: `components/sections/Why/Why.tsx|.module.scss`

- [ ] Вывести `<span className={styles.why__number} aria-hidden>0{index+1}</span>` перед заголовком; `.why__number { @include text-display; color: var(--color-border-strong) }`, `.why__card--featured .why__number { color: var(--color-action-primary) }`; убрать градиентную заливку featured, оставить бордер акцентом.

### Task 5: Экосистема — одна строка

**Files:**
- Modify: `components/sections/Ecosystem/Ecosystem.tsx|.module.scss`

- [ ] Секция: `padding-block: var(--space-heading)`; `head` слева (label + title), справа `ecosystem__links` — две ссылки: название title + описание body dim, ховер цветом акцента. На мобиле — колонкой.

### Task 6: Футер — email в title

**Files:**
- Modify: `components/layout/Footer/Footer.tsx|.module.scss`, `data/site.ts` (`FOOTER_EMAIL`)

- [ ] Слева колонка: логотип, ниже `<a href="mailto:hello@flame.dev">hello@flame.dev</a>` в title; справа навигация. Высота от контента, `padding-block: var(--space-heading)`.

### Task 7: Проверка и коммит

- [ ] `npm run build && npm run lint && npm run typecheck`.
- [ ] Скриншоты 1440×900 и 390×844 через `scratchpad/shot.mjs`, просмотр hero, кейсов, процесса, экосистемы, футера.
- [ ] Коммит: `feat: reference-level typography, hero proof line, case industries and hover video`.
