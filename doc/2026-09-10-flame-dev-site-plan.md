# Flame Dev Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Flame Dev one-page studio site in code, straight from the wireframe and `doc/2026-09-10-flame-dev-site-design.md`, with dark Flame base, cobalt accent, three font sizes, lazy video posters, live service demos, pinned process section and a pursuing CTA.

**Architecture:** Next.js App Router, one static page assembled from section components; all content lives in `data/*.ts`; design tokens are CSS custom properties in `:root`, sizes in rem on a fluid `html { font-size }`; animation escalates IntersectionObserver → GSAP ScrollTrigger (process only) → vanilla Three.js class (Rosatom object only).

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, SCSS Modules (`sass`), `next/font/local` (TTFirsNeue), `clsx`, Formik + Yup, GSAP 3 + ScrollTrigger, Three.js 0.186, ESLint (`eslint-config-next`). No Tailwind, no tests (landing-archetype convention), no analytics.

**Conventions (from vault `LLM Dev Setup`, apply in every task):**
- Component = filename, PascalCase, arrow function, `export default X;` on its own last line. Props interface `{Name}Props`; other interfaces `I{Name}`.
- `import styles from './{Name}.module.scss'`. Flat BEM classes (`.caseCard__poster`), never `&__`. `&` only for pseudo-classes/states.
- All sizes in `rem` (design px / 10). Only `1px` borders and `blur()` px allowed.
- SCSS modules live at depth 3 (`components/<group>/<Name>/`), so mixins are imported as `@use '../../../styles/typography' as *;` and `@use '../../../styles/mixins' as *;`.
- Content never inline in JSX: it comes from `data/`.
- Verify each task with `npm run build` (type check + lint + compile) and a look at `http://localhost:3000` in the dev server; commit after every task.

---

## File map

| Path | Responsibility |
|---|---|
| `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `next-env.d.ts` | project scaffold |
| `app/layout.tsx` | font, metadata, PageGlow, RevealController, Header, Footer, CTAs |
| `app/page.tsx` | section order 01–07 |
| `app/globals.scss` | reset, `:root` tokens, fluid rem, reduced-motion, `[data-reveal]` |
| `app/api/lead/route.ts` | lead form endpoint → Telegram |
| `styles/_typography.scss` | `text-display`, `text-title`, `text-body` mixins |
| `styles/_mixins.scss` | `container`, `glass`, `glow`, `mobile` mixins |
| `data/types.ts` | `ICase`, `IService`, `IProcessStep`, `IWhyCard`, `IEcosystemCard` |
| `data/cases.ts`, `data/services.ts`, `data/process.ts`, `data/why.ts`, `data/site.ts` | content |
| `components/ui/BaseButton/*` | button/link primitive |
| `components/ui/BaseTag/*` | tag primitive |
| `components/ui/BaseInput/*` | input/textarea primitive with error |
| `components/ui/Logo/*` | inline SVG FLAME + DEV |
| `components/ui/Poster/*` | brand-colored poster with lazy video |
| `components/layout/Header/*`, `Footer/*`, `PageGlow/*`, `RevealController/*` | chrome |
| `components/sections/Hero/*` | hero text + `HeroReel` strips + `hooks/useReelRotation.ts` |
| `components/sections/Cases/*` | grid + `CaseCard` |
| `components/sections/CtaBand/*` | blue full-width band |
| `components/sections/Services/*` | 2×2 cards + `visuals/` (TibiaTable, Match3, RosatomObject + `RosatomScene.ts`, PromptDemo) |
| `components/sections/Why/*` | three cards |
| `components/sections/Process/*` | pinned horizontal steps + `hooks/useProcessScroll.ts` |
| `components/sections/Ecosystem/*` | two link cards |
| `components/sections/Contact/*` | heading, links, `LeadForm` + `LeadForm.validationSchema.ts` |
| `components/cta/FloatingCta/*`, `MobileCtaBar/*`, `hooks/useCtaVisibility.ts` | pursuing CTA |
| `hooks/useInView.ts` | IntersectionObserver hook |
| `public/fonts/TTFirsNeue/*.woff2` | 4 font faces |

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.scss`
- Modify: `.gitignore`

- [ ] **Step 1: Install dependencies**

Run from `/Users/vladislavpavlikov/projects/FlameAi/dev`:

```bash
npm init -y >/dev/null
npm install next@16 react@19 react-dom@19 clsx@2 formik@2 yup@1 gsap@3 three@0.186
npm install -D typescript@5 @types/node@22 @types/react@19 @types/react-dom@19 @types/three@0.186 sass@1 eslint@9 eslint-config-next@16
```

Expected: `package.json` lists the packages, `node_modules/` exists.

- [ ] **Step 2: Write `package.json` scripts and metadata**

Replace the generated `package.json` with:

```json
{
  "name": "flame-dev",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "formik": "^2.4.9",
    "gsap": "^3.15.0",
    "next": "^16.3.4",
    "react": "^19.3.0",
    "react-dom": "^19.3.0",
    "three": "^0.186.0",
    "yup": "^1.7.1"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/three": "^0.186.0",
    "eslint": "^9",
    "eslint-config-next": "^16.3.4",
    "sass": "^1.104.0",
    "typescript": "^5"
  }
}
```

Then run `npm install` again so the lockfile matches.

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Write `next.config.ts`**

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  async headers() {
    return [
      {
        source: '/:path*.(woff2|png|jpg|jpeg|webp|svg)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=31536000' }],
      },
      {
        source: '/:path*.(mp4|webm)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=2592000' }],
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 5: Write `eslint.config.mjs`**

```js
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default [
  ...nextVitals,
  ...nextTs,
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
];
```

- [ ] **Step 6: Write a minimal `app/globals.scss`, `app/layout.tsx`, `app/page.tsx`**

`app/globals.scss` (will be extended in Task 2):

```scss
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #262525;
  color: #fcfbfb;
}
```

`app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Flame Dev — сложные системы и спецпроекты для брендов',
  description: 'Разработка, дизайн и видеопродакшн в одной команде.',
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
```

`app/page.tsx`:

```tsx
const HomePage = () => {
  return <main>Flame Dev</main>;
};

export default HomePage;
```

- [ ] **Step 7: Extend `.gitignore`**

Append to `.gitignore`:

```
.next/
out/
*.tsbuildinfo
next-env.d.ts
.vercel
```

- [ ] **Step 8: Build to verify the scaffold**

Run: `npm run build`
Expected: `✓ Compiled successfully`, route `/` listed as static (`○`). Then `npm run lint` → no errors.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with SCSS and ESLint"
```

---

### Task 2: Fonts, tokens, fluid rem, typography mixins

**Files:**
- Create: `public/fonts/TTFirsNeue/TTFirsNeue-{Regular,Medium,Bold,BoldItalic}.woff2`, `styles/_typography.scss`, `styles/_mixins.scss`
- Modify: `app/globals.scss`, `app/layout.tsx`

- [ ] **Step 1: Copy the four font faces**

```bash
mkdir -p public/fonts/TTFirsNeue
for f in Regular Medium Bold BoldItalic; do
  cp "/Users/vladislavpavlikov/projects/FlameAi/landingv2/public/fonts/TTFirsNeue/TTFirsNeue-$f.woff2" public/fonts/TTFirsNeue/
done
ls -la public/fonts/TTFirsNeue
```

Expected: four files, ~31–34 KB each.

- [ ] **Step 2: Write `app/globals.scss` with tokens and fluid rem**

```scss
@use 'sass:math';

:root {
  --color-bg: #262525;
  --color-surface: #2d2c2c;
  --color-elevated: #3d3d3e;
  --color-border: #3d3d3e;
  --color-border-strong: #9d9c9e;
  --color-text: #fcfbfb;
  --color-text-dim: #9d9c9e;
  --color-text-cold: #b4bbc4;
  --color-action-primary: #3b78ff;
  --color-action-primary-hover: #6394ff;
  --color-on-action: #262525;
  --color-glow: rgba(59, 120, 255, 0.26);
  --color-glow-strong: rgba(59, 120, 255, 0.42);
  --color-success: #31d269;
  --color-error: #f70e3d;

  --type-display: 4.8rem;
  --type-title: 2.4rem;
  --type-body: 1.6rem;

  --space-section: 12rem;
  --space-gutter: 12rem;
  --space-grid-gap: 2.4rem;

  --size-button: 4.8rem;
  --size-button-hero: 5.6rem;
  --size-header: 8rem;

  --radius-control: 0.8rem;
  --radius-card: 1.4rem;
  --radius-panel: 1.6rem;
  --radius-pill: 99.9rem;

  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}

@media screen and (max-width: 768px) and (orientation: portrait) {
  :root {
    --type-display: 3.6rem;
    --space-section: 8rem;
    --space-gutter: 2rem;
    --space-grid-gap: 1.6rem;
    --size-button-hero: 5.2rem;
    --size-header: 6.4rem;
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 10px;
  scroll-behavior: smooth;

  @media screen and (max-width: 1440px) {
    font-size: math.div(10, 1440) * 100vw;
  }

  @media screen and (max-width: 768px) and (orientation: portrait) {
    font-size: math.div(10, 390) * 100vw;
  }
}

body {
  font-family: var(--font), sans-serif;
  font-size: var(--type-body);
  line-height: 1.5;
  background-color: var(--color-bg);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

img,
video {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea {
  font: inherit;
  color: inherit;
  border: none;
  background: none;
}

button {
  cursor: pointer;
}

[data-reveal] {
  opacity: 0;
  transform: translateY(1.2rem);
  transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
}

[data-reveal].is-revealed {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  html {
    scroll-behavior: auto;
  }

  [data-reveal] {
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 3: Write `styles/_typography.scss`**

```scss
@mixin text-display($italic: false) {
  font-size: var(--type-display);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
  @if $italic {
    font-style: italic;
  }
}

@mixin text-title {
  font-size: var(--type-title);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

@mixin text-body($weight: 400) {
  font-size: var(--type-body);
  font-weight: $weight;
  letter-spacing: 0;
  line-height: 1.5;
}
```

- [ ] **Step 4: Write `styles/_mixins.scss`**

```scss
@mixin mobile {
  @media screen and (max-width: 768px) and (orientation: portrait) {
    @content;
  }
}

@mixin hover {
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      @content;
    }
  }
}

@mixin container {
  width: 100%;
  max-width: 144rem;
  margin: 0 auto;
  padding-left: var(--space-gutter);
  padding-right: var(--space-gutter);
}

@mixin section {
  @include container;
  padding-top: var(--space-section);
  padding-bottom: var(--space-section);
}

@mixin glass {
  background: color-mix(in srgb, var(--color-surface) 55%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
  border-radius: var(--radius-panel);
}

@mixin glow($strength: var(--color-glow)) {
  box-shadow: 0 0 4.4rem $strength, 0 0.6rem 2rem rgba(0, 0, 0, 0.38);
}

@mixin scrim {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, transparent 25%, transparent 70%, rgba(0, 0, 0, 0.5) 100%);
}
```

- [ ] **Step 5: Load the font in `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import './globals.scss';

const firsNeue = localFont({
  variable: '--font',
  display: 'swap',
  src: [
    { path: '../public/fonts/TTFirsNeue/TTFirsNeue-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/TTFirsNeue/TTFirsNeue-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/TTFirsNeue/TTFirsNeue-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/TTFirsNeue/TTFirsNeue-BoldItalic.woff2', weight: '700', style: 'italic' },
  ],
});

export const metadata: Metadata = {
  title: 'Flame Dev — сложные системы и спецпроекты для брендов',
  description: 'Разработка, дизайн и видеопродакшн в одной команде.',
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ru" className={firsNeue.variable}>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
```

- [ ] **Step 6: Verify**

Run: `npm run build`
Expected: compiles. Then `npm run dev`, open `http://localhost:3000`, DevTools → computed font-family of `body` is `TTFirsNeue…` (the `next/font` generated family name), `html` font-size is `10px` at ≥1440 and scales below.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add TTFirsNeue, design tokens, fluid rem and typography mixins"
```

---

### Task 3: Content data and types

**Files:**
- Create: `data/types.ts`, `data/cases.ts`, `data/services.ts`, `data/process.ts`, `data/why.ts`, `data/site.ts`

- [ ] **Step 1: Write `data/types.ts`**

```ts
export type CaseSize = 'l' | 'm' | 's';

export interface ICaseVideo {
  mp4: string;
  webm?: string;
  poster?: string;
}

export interface ICase {
  slug: string;
  title: string;
  size: CaseSize;
  colors: [string, string];
  description: string;
  tags: string[];
  video?: ICaseVideo;
}

export type ServiceVisual = 'tibia' | 'match3' | 'rosatom' | 'prompt';

export interface IService {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  visual: ServiceVisual;
}

export interface IProcessStep {
  number: string;
  title: string;
  description: string;
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
}

export interface INavItem {
  label: string;
  href: string;
}
```

- [ ] **Step 2: Write `data/cases.ts`**

```ts
import type { ICase } from './types';

export const CASES: ICase[] = [
  {
    slug: 'coca-cola-delivery-club',
    title: 'Coca-Cola × Delivery Club',
    size: 'l',
    colors: ['#E4002B', '#1E5B3A'],
    description: 'Модуль «Задание дня» в приложении Delivery Club: мини-игры, промокоды, розыгрыши.',
    tags: ['спецпроект', 'мини-игры', 'API'],
  },
  {
    slug: 'rosatom',
    title: 'Росатом — «Умный атом»',
    size: 'l',
    colors: ['#1A1F4E', '#D7141A'],
    description: '3D-путешествие по космосу на Three.js с остановками у статей.',
    tags: ['3D / WebGL', 'спецпроект'],
  },
  {
    slug: 'flame-ai',
    title: 'Flame AI',
    size: 'm',
    colors: ['#262525', '#F13911'],
    description: 'AI-платформа генерации рекламных видео. Собственный продукт.',
    tags: ['AI', 'SaaS'],
  },
  {
    slug: 'tibia',
    title: 'Tibia / Majorpack',
    size: 'm',
    colors: ['#E8D400', '#F2F2F0'],
    description: 'Платформа маркировки и логистики труб НКТ, ПО для сканирующих терминалов.',
    tags: ['ERP', 'hardware'],
  },
  {
    slug: 'amatour',
    title: 'Amatour',
    size: 'm',
    colors: ['#E4141C', '#FFFFFF'],
    description: 'SaaS-платформа теннисных турниров: рейтинг, кабинеты, подписки.',
    tags: ['платформа', 'подписки'],
  },
  {
    slug: 'purina-vk',
    title: 'Purina × VK',
    size: 's',
    colors: ['#B5CC2E', '#E30613'],
    description: 'Голосование за pet-friendly города: сайт, мини-апп VK, карта.',
    tags: ['mini-app'],
  },
  {
    slug: 'alibox',
    title: 'AliExpress × ОК',
    size: 's',
    colors: ['#D9EEF9', '#FF4A1F'],
    description: 'Розыгрыш промокодов в мини-аппе Одноклассников.',
    tags: ['промо'],
  },
  {
    slug: 'majorpack',
    title: 'Majorpack',
    size: 's',
    colors: ['#2F3A44', '#FFFFFF'],
    description: 'Корпоративный сайт и калькулятор выбросов.',
    tags: ['сайт'],
  },
  {
    slug: 'sozidanie',
    title: 'Фонд «Созидание»',
    size: 's',
    colors: ['#F26B1D', '#1E4D2B'],
    description: 'Сайт с онлайн-пожертвованиями, CMS, CloudPayments.',
    tags: ['сайт'],
  },
];

export const HERO_REEL_SLUGS = ['coca-cola-delivery-club', 'rosatom', 'flame-ai', 'tibia', 'amatour'];

export const HERO_REEL = HERO_REEL_SLUGS.map((slug) => CASES.find((c) => c.slug === slug)!);

export const HUAWEI_NOTE = {
  text: 'Huawei — редизайн главной, дизайн-проект',
  href: 'https://www.behance.net/gallery/101023739/huawei-mainpage-redesign',
  label: 'Behance',
};
```

- [ ] **Step 3: Write `data/services.ts`**

```ts
import type { IService } from './types';

export const SERVICES: IService[] = [
  {
    slug: 'systems',
    title: 'Сложные системы и платформы',
    description: 'ERP, CRM, SaaS, внутренние инструменты, интеграции с оборудованием.',
    stack: ['Django', 'Go', 'интеграции'],
    visual: 'tibia',
  },
  {
    slug: 'special',
    title: 'Спецпроекты для брендов',
    description: 'Промо-механики, мини-игры, мини-аппы VK и ОК, розыгрыши.',
    stack: ['React', 'WebView', 'VK Mini Apps'],
    visual: 'match3',
  },
  {
    slug: 'web3d',
    title: 'Сайты, 3D и WebGL',
    description: 'Корпоративные сайты, лендинги, интерактивные 3D-сцены.',
    stack: ['Three.js', 'WebGL', 'Next.js'],
    visual: 'rosatom',
  },
  {
    slug: 'ai',
    title: 'AI-решения и автоматизация',
    description: 'Боты, интеграции LLM в процессы, AI-продукты.',
    stack: ['LLM', 'боты', 'автоматизация'],
    visual: 'prompt',
  },
];
```

- [ ] **Step 4: Write `data/process.ts`**

```ts
import type { IProcessStep } from './types';

export const PROCESS_STEPS: IProcessStep[] = [
  { number: '01', title: 'Бриф и оценка', description: '2–3 дня. Созвон, вопросы, письменная оценка сроков и бюджета.' },
  { number: '02', title: 'Проектирование', description: 'Структура, прототипы, ТЗ. Вы видите продукт до первой строки кода.' },
  { number: '03', title: 'Дизайн', description: 'По вашему брендбуку или с нуля. Согласование по экранам.' },
  { number: '04', title: 'Разработка', description: 'Спринты, демо каждые две недели, тестовый стенд с первой недели.' },
  { number: '05', title: 'Запуск и поддержка', description: 'Деплой, мониторинг, SLA на поддержку.' },
];

export const PROCESS_NOTE = 'Один менеджер на проект, демо каждые две недели, без сюрпризов по срокам.';
```

- [ ] **Step 5: Write `data/why.ts`**

```ts
import type { IEcosystemCard, IWhyCard } from './types';

export const WHY_TITLE = 'Один подрядчик вместо трёх';

export const WHY_CARDS: IWhyCard[] = [
  {
    title: 'Разработка, дизайн и видео вместе',
    description: 'Обычно сайт делает студия, ролик — продакшн, а склеивать это приходится вам. Здесь всё в одном месте, и результат выглядит цельно.',
  },
  {
    title: 'Опыт с брендами и корпорациями',
    description: 'Coca-Cola, Росатом, AliExpress, Purina, VK. Знаем, как работать с брендбуками, юристами и согласованиями, и не срываем даты запуска.',
  },
  {
    title: 'Flame AI — продукт, который мы построили сами',
    description: 'AI-платформа генерации рекламных видео: собственный фронтенд, пайплайн генерации и биллинг. Текст-питч финализируется отдельно.',
    featured: true,
  },
];

export const ECOSYSTEM_TITLE = 'Flame — это ещё и';

export const ECOSYSTEM_CARDS: IEcosystemCard[] = [
  { title: 'Flame CGI', description: 'Видеопродакшн и CGI для брендов', href: 'https://flamecgi.com', label: 'flamecgi.com →' },
  { title: 'Flame AI', description: 'AI-платформа для генерации видео', href: 'https://app.flame.ai', label: 'app.flame.ai →' },
];
```

- [ ] **Step 6: Write `data/site.ts`**

```ts
import type { INavItem } from './types';

export const NAV: INavItem[] = [
  { label: 'Кейсы', href: '#cases' },
  { label: 'Услуги', href: '#services' },
  { label: 'Процесс', href: '#process' },
  { label: 'Контакт', href: '#contact' },
];

export const CTA_LABEL = 'Обсудить проект';

export const HERO = {
  title: 'Сложные системы и спецпроекты для брендов',
  stats: ['[N] лет', '[N] проектов', 'Полный цикл: дизайн · разработка · видео'],
};

export const CTA_BAND = {
  text: 'Есть задача? Расскажите, ответим в течение дня.',
};

export const CONTACT = {
  title: 'Расскажите о задаче',
  text: 'Ответим в течение дня. Оценку сроков и бюджета дадим за 2–3 дня.',
  links: [
    { label: 'Написать в Telegram →', href: 'https://t.me/flamedev' },
    { label: 'hello@flame.dev →', href: 'mailto:hello@flame.dev' },
    { label: 'Скачать презентацию (PDF) →', href: '/flame-dev.pdf' },
  ],
};

export const FOOTER_LINKS: INavItem[] = [
  ...NAV,
  { label: 'Flame CGI', href: 'https://flamecgi.com' },
  { label: 'Flame AI', href: 'https://app.flame.ai' },
];
```

- [ ] **Step 7: Verify and commit**

Run: `npm run typecheck`
Expected: no errors.

```bash
git add data
git commit -m "feat: add site content data and types"
```

---

### Task 4: Base primitives — BaseButton, BaseTag, BaseInput

**Files:**
- Create: `components/ui/BaseButton/BaseButton.tsx`, `components/ui/BaseButton/BaseButton.module.scss`, `components/ui/BaseTag/BaseTag.tsx`, `components/ui/BaseTag/BaseTag.module.scss`, `components/ui/BaseInput/BaseInput.tsx`, `components/ui/BaseInput/BaseInput.module.scss`

- [ ] **Step 1: Write `BaseButton.tsx`**

```tsx
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './BaseButton.module.scss';

type ButtonVariant = 'primary' | 'inverse' | 'chrome' | 'ghost';
type ButtonSize = 'm' | 'l';

interface BaseButtonCommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = BaseButtonCommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = BaseButtonCommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type BaseButtonProps = ButtonAsButton | ButtonAsLink;

const BaseButton = ({ variant = 'primary', size = 'm', block = false, className, children, ...rest }: BaseButtonProps) => {
  const classes = clsx(styles.button, styles[`button--${variant}`], styles[`button--${size}`], block && styles['button--block'], className);

  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest as ButtonAsLink;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { type = 'button', ...buttonProps } = rest as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
};

export default BaseButton;
```

- [ ] **Step 2: Write `BaseButton.module.scss`**

```scss
@use '../../../styles/typography' as *;
@use '../../../styles/mixins' as *;

.button {
  @include text-body(500);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  min-height: var(--size-button);
  padding: 0 2.4rem;
  border: 1px solid transparent;
  border-radius: var(--radius-control);
  white-space: nowrap;
  transition: background-color 0.15s ease-out, color 0.15s ease-out, border-color 0.15s ease-out, box-shadow 0.15s ease-out;

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--color-action-primary) 60%, transparent);
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.button--l {
  min-height: var(--size-button-hero);
  padding: 0 4rem;
}

.button--block {
  width: 100%;
}

.button--primary {
  background: var(--color-action-primary);
  border-color: var(--color-action-primary);
  color: var(--color-on-action);
  @include glow;

  @include hover {
    background: var(--color-action-primary-hover);
    border-color: var(--color-action-primary-hover);
    @include glow(var(--color-glow-strong));
  }

  &:active {
    background: var(--color-text);
    border-color: var(--color-text);
    color: var(--color-action-primary);
  }
}

.button--inverse {
  background: var(--color-text);
  border-color: var(--color-text);
  color: var(--color-action-primary);

  @include hover {
    background: var(--color-bg);
    border-color: var(--color-bg);
    color: var(--color-text);
  }
}

.button--chrome {
  background: var(--color-surface);
  border-color: var(--color-border);
  color: var(--color-text);

  @include hover {
    background: var(--color-elevated);
  }
}

.button--ghost {
  background: transparent;
  color: var(--color-text-dim);
  padding: 0 1.2rem;

  @include hover {
    color: var(--color-text);
  }
}
```

- [ ] **Step 3: Write `BaseTag.tsx` and `BaseTag.module.scss`**

`BaseTag.tsx`:

```tsx
import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './BaseTag.module.scss';

export interface BaseTagProps {
  variant?: 'outline' | 'accent';
  className?: string;
  children: ReactNode;
}

const BaseTag = ({ variant = 'outline', className, children }: BaseTagProps) => {
  return <span className={clsx(styles.tag, styles[`tag--${variant}`], className)}>{children}</span>;
};

export default BaseTag;
```

`BaseTag.module.scss`:

```scss
@use '../../../styles/typography' as *;

.tag {
  @include text-body;
  display: inline-flex;
  align-items: center;
  min-height: 3.2rem;
  padding: 0 1.2rem;
  border: 1px solid var(--color-text);
  border-radius: var(--radius-control);
  line-height: 1.15;
  white-space: nowrap;
}

.tag--accent {
  background: var(--color-action-primary);
  border-color: var(--color-action-primary);
  color: var(--color-on-action);
}
```

- [ ] **Step 4: Write `BaseInput.tsx` and `BaseInput.module.scss`**

`BaseInput.tsx`:

```tsx
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './BaseInput.module.scss';

interface BaseInputCommonProps {
  label: string;
  error?: string;
  multiline?: boolean;
  className?: string;
}

type InputProps = BaseInputCommonProps & InputHTMLAttributes<HTMLInputElement> & { multiline?: false };
type TextareaProps = BaseInputCommonProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true };

export type BaseInputProps = InputProps | TextareaProps;

const BaseInput = (props: BaseInputProps) => {
  const { label, error, className, id } = props;
  const fieldId = id ?? props.name;
  const wrapperClass = clsx(styles.field, error && styles['field--error'], className);

  if (props.multiline) {
    const { label: _l, error: _e, multiline: _m, className: _c, ...textareaProps } = props;
    return (
      <label className={wrapperClass} htmlFor={fieldId}>
        <span className={styles.field__label}>{label}</span>
        <textarea id={fieldId} className={clsx(styles.field__control, styles['field__control--multiline'])} {...textareaProps} />
        {error && <span className={styles.field__error}>{error}</span>}
      </label>
    );
  }

  const { label: _l, error: _e, multiline: _m, className: _c, ...inputProps } = props;
  return (
    <label className={wrapperClass} htmlFor={fieldId}>
      <span className={styles.field__label}>{label}</span>
      <input id={fieldId} className={styles.field__control} {...inputProps} />
      {error && <span className={styles.field__error}>{error}</span>}
    </label>
  );
};

export default BaseInput;
```

`BaseInput.module.scss`:

```scss
@use '../../../styles/typography' as *;

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
}

.field__label {
  @include text-body;
  color: var(--color-text-dim);
}

.field__control {
  @include text-body;
  width: 100%;
  min-height: 4.8rem;
  padding: 0.8rem 0.4rem;
  border-bottom: 1px solid var(--color-border-strong);
  border-radius: 0;
  outline: none;
  transition: border-color 0.15s ease-out;

  &::placeholder {
    color: var(--color-text);
    opacity: 0.5;
  }

  &:focus {
    border-bottom-color: var(--color-action-primary);
  }
}

.field__control--multiline {
  min-height: 12rem;
  resize: vertical;
}

.field__error {
  @include text-body;
  color: var(--color-error);
}

.field--error .field__control {
  border-bottom-color: var(--color-error);
}
```

- [ ] **Step 5: Smoke-render the primitives on the page**

Temporarily replace `app/page.tsx`:

```tsx
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import BaseTag from '@/components/ui/BaseTag/BaseTag';
import BaseInput from '@/components/ui/BaseInput/BaseInput';

const HomePage = () => {
  return (
    <main style={{ padding: '4rem', display: 'grid', gap: '2.4rem', maxWidth: '60rem' }}>
      <BaseButton>Обсудить проект</BaseButton>
      <BaseButton variant="inverse">Inverse</BaseButton>
      <BaseButton variant="chrome">Кейсы</BaseButton>
      <BaseButton variant="ghost">Ghost</BaseButton>
      <BaseButton href="#" size="l">Ссылка L</BaseButton>
      <div style={{ display: 'flex', gap: '0.8rem' }}>
        <BaseTag variant="accent">спецпроект</BaseTag>
        <BaseTag>мини-игры</BaseTag>
      </div>
      <BaseInput name="name" label="Имя" placeholder="Иван" />
      <BaseInput name="message" label="Коротко о задаче" multiline error="Обязательное поле" />
    </main>
  );
};

export default HomePage;
```

Run `npm run dev`, open the page: primary button glows blue, hover brightens, inverse is light with blue text, tags 32px high, input has underline only and the textarea shows a red error line. Then `npm run build`.

- [ ] **Step 6: Commit**

```bash
git add components app/page.tsx
git commit -m "feat: add BaseButton, BaseTag and BaseInput primitives"
```

---

### Task 5: Logo (FLAME from brand SVG + DEV mark)

**Files:**
- Create: `components/ui/Logo/Logo.tsx`, `components/ui/Logo/Logo.module.scss`

- [ ] **Step 1: Write `Logo.tsx`**

The `FLAME` geometry is copied verbatim from `FlameAi/landingv2/public/logo/flame-ai.svg` (the first two shapes). The `AI` superscript is replaced by `DEV`: three straight letterforms drawn in an 18-unit-tall box and skewed by −12.22° (`tan` = 0.2166, the exact slant of the original `I`).

```tsx
import clsx from 'clsx';
import styles from './Logo.module.scss';

export interface LogoProps {
  variant?: 'header' | 'footer';
  className?: string;
}

const H = 17.91;
const S = 4.2;

const D_PATH = `M0 0 H9 L13 4 V${H - 4} L9 ${H} H0 Z M${S} ${S} V${H - S} H${9 - S * 0.4} L${13 - S} ${H - 4 - S * 0.4} V${4 + S * 0.4} L${9 - S * 0.4} ${S} Z`;
const E_PATH = `M0 0 H11 V${S} H${S} V${H / 2 - S / 2} H9.5 V${H / 2 + S / 2} H${S} V${H - S} H11 V${H} H0 Z`;
const V_PATH = `M0 0 H4.6 L7 ${H - 6} L9.4 0 H14 L9 ${H} H5 Z`;

const Logo = ({ variant = 'header', className }: LogoProps) => {
  return (
    <svg
      className={clsx(styles.logo, styles[`logo--${variant}`], className)}
      viewBox="0 0 376 72"
      fill="currentColor"
      role="img"
      aria-label="FLAME DEV"
    >
      <polygon points="253.83 72 310.98 72 314.74 54.03 280.75 54.03 282.66 45.01 307.82 45.01 311.55 27.04 286.47 27.04 288.39 18.02 322.37 18.02 326.13 0 269.1 0 253.83 72" />
      <path d="M240.75,0l-22.96,26.99L202.26,0h-19.53l-13.31,62.81L156.1,0h-22.68l-31.11,54.02h-20.81L92.98,0H15.26L0,72h22.86l5.72-26.99h26.74l3.82-17.96h-26.76l1.91-9.03h31.9l-11.44,53.98h60.76l5.16-8.96h26.78l1.9,8.96h41.08c.63-4.8,3.37-9.8,6.91-12.75.16-.21,1.63-1.82,1.8-2.04,2.74-3.59,3.78-6.94,4.26-10.39.32-2.63,0-5.16,0-5.16,11.13,10.91,10.55,23.69,10.55,23.69,0,0,5.06-3.66,7.02-10.23,3.28,4.6,5.69,11.01,6.2,16.88h21.52L263.92,0h-23.17ZM131.07,45.01l9.19-15.95,3.38,15.95h-12.57Z" />
      <g transform="translate(331.25 0) skewX(-12.22)">
        <path d={D_PATH} fillRule="evenodd" />
        <path d={E_PATH} transform="translate(16 0)" />
        <path d={V_PATH} transform="translate(30 0)" />
      </g>
    </svg>
  );
};

export default Logo;
```

- [ ] **Step 2: Write `Logo.module.scss`**

```scss
.logo {
  display: block;
  width: auto;
  color: var(--color-text);
}

.logo--header {
  height: 2.2rem;
}

.logo--footer {
  height: 1.8rem;
}
```

- [ ] **Step 3: Render and inspect**

Add to the top of the smoke page from Task 4: `<Logo />` and `<Logo variant="footer" />` (import from `@/components/ui/Logo/Logo`). Open the page at 1440: the wordmark reads FLAME with a small slanted DEV at the top-right, same height as the original AI mark, aligned to the top edge of FLAME. If the D counter looks closed, increase `S` to 4.6; if DEV looks wider than the AI mark, reduce the `translate` steps (16 → 15, 30 → 28).

- [ ] **Step 4: Commit**

```bash
git add components/ui/Logo app/page.tsx
git commit -m "feat: add Flame Dev logo built from the Flame AI wordmark"
```

---

### Task 6: Layout chrome — PageGlow, RevealController, Header, Footer

**Files:**
- Create: `components/layout/PageGlow/PageGlow.tsx`, `components/layout/PageGlow/PageGlow.module.scss`, `components/layout/RevealController/RevealController.tsx`, `components/layout/Header/Header.tsx`, `components/layout/Header/Header.module.scss`, `components/layout/Header/hooks/useHeaderState.ts`, `components/layout/Footer/Footer.tsx`, `components/layout/Footer/Footer.module.scss`
- Modify: `app/layout.tsx`, `app/page.tsx`

- [ ] **Step 1: Write `PageGlow.tsx` and its styles**

`PageGlow.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import styles from './PageGlow.module.scss';

const PageGlow = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * window.innerWidth * 0.45;
      targetY = (e.clientY / window.innerHeight - 0.5) * window.innerHeight * 0.35;
    };

    const tick = () => {
      frame = requestAnimationFrame(tick);
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      if (ref.current) {
        ref.current.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    tick();
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className={styles.glow} aria-hidden="true" />;
};

export default PageGlow;
```

`PageGlow.module.scss`:

```scss
@use '../../../styles/mixins' as *;

.glow {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 80vw;
  height: 60vw;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse 50% 50% at 50% 50%, var(--color-glow) 0%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
  z-index: -1;

  @include mobile {
    height: 50vh;
    opacity: 0.7;
  }
}
```

- [ ] **Step 2: Write `RevealController.tsx`**

```tsx
'use client';

import { useEffect } from 'react';

const RevealController = () => {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return null;
};

export default RevealController;
```

- [ ] **Step 3: Write `hooks/useHeaderState.ts`**

```ts
import { useEffect, useState } from 'react';

export interface IUseHeaderState {
  scrolled: boolean;
  menuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

const useHeaderState = (): IUseHeaderState => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return {
    scrolled,
    menuOpen,
    toggleMenu: () => setMenuOpen((v) => !v),
    closeMenu: () => setMenuOpen(false),
  };
};

export default useHeaderState;
```

- [ ] **Step 4: Write `Header.tsx`**

```tsx
'use client';

import clsx from 'clsx';
import Logo from '@/components/ui/Logo/Logo';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CTA_LABEL, NAV } from '@/data/site';
import useHeaderState from './hooks/useHeaderState';
import styles from './Header.module.scss';

const Header = () => {
  const { scrolled, menuOpen, toggleMenu, closeMenu } = useHeaderState();

  return (
    <header className={clsx(styles.header, scrolled && styles['header--scrolled'], menuOpen && styles['header--open'])}>
      <div className={styles.header__inner}>
        <a href="#top" className={styles.header__logo} aria-label="Flame Dev" onClick={closeMenu}>
          <Logo />
        </a>

        <nav className={styles.header__nav} aria-label="Разделы">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className={styles.header__link} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <span className={styles.header__lang} aria-label="Язык">RU / EN</span>
          <BaseButton href="#contact" className={styles.header__cta} onClick={closeMenu}>
            {CTA_LABEL}
          </BaseButton>
        </nav>

        <div className={styles.header__mobile}>
          <span className={styles.header__lang}>RU</span>
          <button type="button" className={styles.header__burger} aria-expanded={menuOpen} aria-label="Меню" onClick={toggleMenu}>
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

- [ ] **Step 5: Write `Header.module.scss`**

```scss
@use '../../../styles/typography' as *;
@use '../../../styles/mixins' as *;

.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--color-bg) 0%, transparent);
  transition: background-color 0.3s ease-out, backdrop-filter 0.3s ease-out;
}

.header--scrolled {
  background: color-mix(in srgb, var(--color-bg) 85%, transparent);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.header__inner {
  @include container;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--size-header);
}

.header__logo {
  display: block;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 3.2rem;

  @include mobile {
    position: fixed;
    inset: var(--size-header) 0 0 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 2.4rem;
    padding: 3.2rem var(--space-gutter);
    background: var(--color-bg);
    transform: translateX(100%);
    transition: transform 0.35s var(--ease);
  }
}

.header--open .header__nav {
  transform: translateX(0);
}

.header__link {
  @include text-body;
  color: var(--color-text-dim);
  transition: color 0.15s ease-out;

  @include hover {
    color: var(--color-text);
  }

  @include mobile {
    @include text-title;
    color: var(--color-text);
  }
}

.header__lang {
  @include text-body;
  color: var(--color-text-dim);
}

.header__cta {
  @include mobile {
    width: 100%;
    margin-top: auto;
  }
}

.header__mobile {
  display: none;

  @include mobile {
    display: flex;
    align-items: center;
    gap: 1.6rem;
  }
}

.header__burger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  width: 3.2rem;
  height: 3.2rem;

  span {
    display: block;
    height: 2px;
    background: var(--color-text);
    transition: transform 0.25s var(--ease);
  }
}

.header--open .header__burger span:first-child {
  transform: translateY(0.35rem) rotate(45deg);
}

.header--open .header__burger span:last-child {
  transform: translateY(-0.35rem) rotate(-45deg);
}
```

- [ ] **Step 6: Write `Footer.tsx` and `Footer.module.scss`**

`Footer.tsx`:

```tsx
import Logo from '@/components/ui/Logo/Logo';
import { FOOTER_LINKS } from '@/data/site';
import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__inner}>
        <a href="#top" aria-label="Flame Dev">
          <Logo variant="footer" />
        </a>
        <nav className={styles.footer__links} aria-label="Ссылки">
          {FOOTER_LINKS.map((item) => (
            <a key={item.href} href={item.href} className={styles.footer__link} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              {item.label}
            </a>
          ))}
          <span className={styles.footer__link}>RU / EN</span>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
```

`Footer.module.scss`:

```scss
@use '../../../styles/typography' as *;
@use '../../../styles/mixins' as *;

.footer {
  border-top: 1px solid var(--color-border);
}

.footer__inner {
  @include container;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.4rem;
  min-height: 9.6rem;
  padding-top: 2.4rem;
  padding-bottom: 2.4rem;

  @include mobile {
    flex-direction: column;
    align-items: flex-start;
  }
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 2.4rem;
}

.footer__link {
  @include text-body;
  color: var(--color-text-dim);
  transition: color 0.15s ease-out;

  @include hover {
    color: var(--color-text);
  }
}
```

- [ ] **Step 7: Wire the layout and reset the page**

`app/layout.tsx` body becomes:

```tsx
<html lang="ru" className={firsNeue.variable}>
  <body>
    <div id="top" />
    <PageGlow />
    <Header />
    {children}
    <Footer />
    <RevealController />
  </body>
</html>
```

with imports:

```tsx
import PageGlow from '@/components/layout/PageGlow/PageGlow';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import RevealController from '@/components/layout/RevealController/RevealController';
```

`app/page.tsx`:

```tsx
const HomePage = () => {
  return <main style={{ minHeight: '200vh' }} />;
};

export default HomePage;
```

- [ ] **Step 8: Verify**

`npm run dev`: at 1440 the header shows logo, four links, RU / EN and the blue CTA; scrolling adds the blurred background. At 390 (DevTools device toolbar, portrait) the burger opens a full-screen menu with title-size links and a full-width CTA. The blue glow drifts with the cursor. `npm run build` passes.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add header, footer, page glow and reveal controller"
```

---

### Task 7: `useInView` hook and `Poster` component

**Files:**
- Create: `hooks/useInView.ts`, `components/ui/Poster/Poster.tsx`, `components/ui/Poster/Poster.module.scss`

- [ ] **Step 1: Write `hooks/useInView.ts`**

```ts
import { useEffect, useRef, useState } from 'react';

export interface IUseInViewOptions {
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
}

export interface IUseInView<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  inView: boolean;
}

const useInView = <T extends HTMLElement>({ rootMargin = '200px 0px', threshold = 0.01, once = false }: IUseInViewOptions = {}): IUseInView<T> => {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return { ref, inView };
};

export default useInView;
```

- [ ] **Step 2: Write `Poster.tsx`**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import type { ICase } from '@/data/types';
import useInView from '@/hooks/useInView';
import styles from './Poster.module.scss';

export interface PosterProps {
  item: ICase;
  playing?: boolean;
  showTitle?: boolean;
  className?: string;
}

const Poster = ({ item, playing = true, showTitle = true, className }: PosterProps) => {
  const { ref, inView } = useInView<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [from, to] = item.colors;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView && playing) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [inView, playing]);

  return (
    <div
      ref={ref}
      className={clsx(styles.poster, className)}
      style={{ ['--poster-from' as string]: from, ['--poster-to' as string]: to }}
    >
      {item.video && (
        <video
          ref={videoRef}
          className={styles.poster__video}
          muted
          playsInline
          loop
          preload="none"
          poster={item.video.poster}
        >
          {item.video.webm && <source src={item.video.webm} type="video/webm" />}
          <source src={item.video.mp4} type="video/mp4" />
        </video>
      )}
      <div className={styles.poster__scrim} aria-hidden="true" />
      {showTitle && <span className={styles.poster__title}>{item.title}</span>}
    </div>
  );
};

export default Poster;
```

- [ ] **Step 3: Write `Poster.module.scss`**

```scss
@use '../../../styles/typography' as *;
@use '../../../styles/mixins' as *;

.poster {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--poster-from) 0%, color-mix(in srgb, var(--poster-from) 55%, var(--poster-to)) 60%, var(--poster-to) 100%);
  isolation: isolate;
}

.poster__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster__scrim {
  position: absolute;
  inset: 0;
  @include scrim;
  pointer-events: none;
}

.poster__title {
  @include text-title;
  position: absolute;
  left: 2rem;
  bottom: 2rem;
  right: 2rem;
  color: var(--color-text);
  text-shadow: 0 0.2rem 1.2rem rgba(0, 0, 0, 0.4);
}
```

- [ ] **Step 4: Verify**

Temporarily render in `app/page.tsx`:

```tsx
import Poster from '@/components/ui/Poster/Poster';
import { CASES } from '@/data/cases';

const HomePage = () => {
  return (
    <main style={{ padding: '4rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.4rem' }}>
      {CASES.map((c) => (
        <div key={c.slug} style={{ aspectRatio: '3 / 2' }}>
          <Poster item={c} />
        </div>
      ))}
    </main>
  );
};

export default HomePage;
```

Nine brand-colored posters with titles bottom-left and a dark scrim. `npm run build` passes.

- [ ] **Step 5: Commit**

```bash
git add hooks components/ui/Poster app/page.tsx
git commit -m "feat: add useInView hook and lazy video Poster"
```

---

### Task 8: Hero with hover-expand reel

**Files:**
- Create: `components/sections/Hero/Hero.tsx`, `components/sections/Hero/Hero.module.scss`, `components/sections/Hero/HeroReel.tsx`, `components/sections/Hero/HeroReel.module.scss`, `components/sections/Hero/hooks/useReelRotation.ts`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write `hooks/useReelRotation.ts`**

```ts
import { useCallback, useEffect, useRef, useState } from 'react';

export interface IUseReelRotation {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onHoverStart: (index: number) => void;
  onHoverEnd: () => void;
}

const useReelRotation = (count: number, intervalMs = 4500): IUseReelRotation => {
  const [activeIndex, setActiveIndex] = useState(0);
  const hoveredRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const id = window.setInterval(() => {
      if (hoveredRef.current) return;
      setActiveIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [count, intervalMs]);

  const onHoverStart = useCallback((index: number) => {
    hoveredRef.current = true;
    setActiveIndex(index);
  }, []);

  const onHoverEnd = useCallback(() => {
    hoveredRef.current = false;
  }, []);

  return { activeIndex, setActiveIndex, onHoverStart, onHoverEnd };
};

export default useReelRotation;
```

- [ ] **Step 2: Write `HeroReel.tsx`**

```tsx
'use client';

import type { UIEvent } from 'react';
import clsx from 'clsx';
import Poster from '@/components/ui/Poster/Poster';
import type { ICase } from '@/data/types';
import useReelRotation from './hooks/useReelRotation';
import styles from './HeroReel.module.scss';

export interface HeroReelProps {
  items: ICase[];
}

const HeroReel = ({ items }: HeroReelProps) => {
  const { activeIndex, setActiveIndex, onHoverStart, onHoverEnd } = useReelRotation(items.length);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return;
    const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0');
    setActiveIndex(Math.min(items.length - 1, Math.round(el.scrollLeft / step)));
  };

  return (
    <div className={styles.reel}>
      <div className={styles.reel__track} onScroll={onScroll} onMouseLeave={onHoverEnd}>
        {items.map((item, index) => (
          <a
            key={item.slug}
            href="#cases"
            className={clsx(styles.reel__strip, index === activeIndex && styles['reel__strip--active'])}
            onMouseEnter={() => onHoverStart(index)}
            onFocus={() => onHoverStart(index)}
            aria-label={item.title}
          >
            <Poster item={item} playing={index === activeIndex} showTitle={index === activeIndex} />
            <span className={styles.reel__label}>{item.title}</span>
          </a>
        ))}
      </div>
      <div className={styles.reel__dots} aria-hidden="true">
        {items.map((item, index) => (
          <span key={item.slug} className={clsx(styles.reel__dot, index === activeIndex && styles['reel__dot--active'])} />
        ))}
      </div>
    </div>
  );
};

export default HeroReel;
```

- [ ] **Step 3: Write `HeroReel.module.scss`**

```scss
@use '../../../styles/typography' as *;
@use '../../../styles/mixins' as *;

.reel {
  position: relative;
}

.reel__track {
  display: flex;
  gap: 0.8rem;
  height: 62rem;

  @include mobile {
    height: 46rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.reel__strip {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  border-radius: var(--radius-card);
  transition: flex-grow 0.6s var(--ease);

  @include mobile {
    flex: 0 0 29rem;
    scroll-snap-align: start;
  }
}

.reel__strip--active {
  flex-grow: 2.25;
}

.reel__label {
  @include text-title;
  position: absolute;
  left: 2rem;
  bottom: 2rem;
  color: var(--color-text);
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  transition: opacity 0.3s ease-out;

  @include mobile {
    display: none;
  }
}

.reel__strip--active .reel__label {
  opacity: 0;
}

.reel__dots {
  display: none;

  @include mobile {
    display: flex;
    gap: 1.2rem;
    margin-top: 2.4rem;
  }
}

.reel__dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: var(--radius-pill);
  background: var(--color-border-strong);
  transition: width 0.25s var(--ease), background-color 0.25s ease-out;
}

.reel__dot--active {
  width: 1.6rem;
  background: var(--color-action-primary);
}
```

- [ ] **Step 4: Write `Hero.tsx`**

```tsx
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { HERO_REEL } from '@/data/cases';
import { CTA_LABEL, HERO } from '@/data/site';
import HeroReel from './HeroReel';
import styles from './Hero.module.scss';

const Hero = () => {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.hero__top}>
        <h1 className={styles.hero__title}>{HERO.title}</h1>
        <ul className={styles.hero__stats}>
          {HERO.stats.map((stat) => (
            <li key={stat} className={styles.hero__stat}>{stat}</li>
          ))}
        </ul>
      </div>
      <HeroReel items={HERO_REEL} />
      <div className={styles.hero__mobileCta}>
        <BaseButton href="#contact" block>{CTA_LABEL}</BaseButton>
      </div>
    </section>
  );
};

export default Hero;
```

- [ ] **Step 5: Write `Hero.module.scss`**

```scss
@use '../../../styles/typography' as *;
@use '../../../styles/mixins' as *;

.hero {
  @include container;
  padding-top: 4.8rem;
  padding-bottom: var(--space-section);

  @include mobile {
    padding-top: 3.2rem;
  }
}

.hero__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 4rem;
  margin-bottom: 3.2rem;

  @include mobile {
    flex-direction: column;
    gap: 2.4rem;
  }
}

.hero__title {
  @include text-display(true);
  max-width: 70rem;
  text-wrap: balance;
}

.hero__stats {
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.6rem;
  flex: 0 0 41.5rem;

  @include mobile {
    flex: none;
    align-items: flex-start;
  }
}

.hero__stat {
  @include text-body;
  color: var(--color-text-dim);
}

.hero__mobileCta {
  display: none;

  @include mobile {
    display: block;
    margin-top: 2.4rem;
  }
}
```

- [ ] **Step 6: Assemble `app/page.tsx`**

```tsx
import Hero from '@/components/sections/Hero/Hero';

const HomePage = () => {
  return (
    <main>
      <Hero />
    </main>
  );
};

export default HomePage;
```

- [ ] **Step 7: Verify**

At 1440: italic headline left, three dim lines right, five strips 620px tall with the first expanded; hovering a strip expands it in 0.6s; leaving the reel resumes auto-rotation every 4.5s; the expanded strip shows its title at the bottom, collapsed strips show a vertical label. At 390: strips become a snap carousel with dots that follow the scroll, plus a full-width CTA. `npm run build` passes.

- [ ] **Step 8: Commit**

```bash
git add components/sections/Hero app/page.tsx
git commit -m "feat: add hero with hover-expand case reel"
```

---

### Task 9: Cases grid and CTA band

**Files:**
- Create: `components/sections/Cases/Cases.tsx`, `components/sections/Cases/Cases.module.scss`, `components/sections/Cases/CaseCard.tsx`, `components/sections/Cases/CaseCard.module.scss`, `components/sections/CtaBand/CtaBand.tsx`, `components/sections/CtaBand/CtaBand.module.scss`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write `CaseCard.tsx`**

```tsx
import clsx from 'clsx';
import Poster from '@/components/ui/Poster/Poster';
import BaseTag from '@/components/ui/BaseTag/BaseTag';
import type { ICase } from '@/data/types';
import styles from './CaseCard.module.scss';

export interface CaseCardProps {
  item: ICase;
}

const CaseCard = ({ item }: CaseCardProps) => {
  return (
    <article className={clsx(styles.caseCard, styles[`caseCard--${item.size}`])} data-reveal>
      <div className={styles.caseCard__poster}>
        <Poster item={item} showTitle={false} />
      </div>
      <div className={styles.caseCard__body}>
        <h3 className={styles.caseCard__title}>{item.title}</h3>
        <p className={styles.caseCard__text}>{item.description}</p>
        <div className={styles.caseCard__tags}>
          {item.tags.map((tag, index) => (
            <BaseTag key={tag} variant={index === 0 ? 'accent' : 'outline'}>{tag}</BaseTag>
          ))}
        </div>
      </div>
    </article>
  );
};

export default CaseCard;
```

- [ ] **Step 2: Write `CaseCard.module.scss`**

```scss
@use '../../../styles/typography' as *;
@use '../../../styles/mixins' as *;

.caseCard {
  --poster-ratio: 3 / 2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  transition: border-color 0.25s ease-out, transform 0.25s var(--ease), box-shadow 0.25s ease-out;

  @include hover {
    border-color: color-mix(in srgb, var(--color-action-primary-hover) 55%, transparent);
    transform: translateY(-0.4rem);
    box-shadow: 0 0.8rem 4rem rgba(0, 0, 0, 0.6), 0 0 4.8rem color-mix(in srgb, var(--color-action-primary-hover) 8%, transparent);
  }
}

.caseCard--l {
  --poster-ratio: 588 / 380;
  grid-column: span 6;
}

.caseCard--m {
  --poster-ratio: 384 / 260;
  grid-column: span 4;
}

.caseCard--s {
  --poster-ratio: 282 / 180;
  grid-column: span 3;
}

@include mobile {
  .caseCard--l,
  .caseCard--m,
  .caseCard--s {
    --poster-ratio: 16 / 10;
    grid-column: span 12;
  }
}

.caseCard__poster {
  aspect-ratio: var(--poster-ratio);
}

.caseCard__body {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.6rem 2rem 2rem;
}

.caseCard__title {
  @include text-title;
}

.caseCard__text {
  @include text-body;
  color: var(--color-text-dim);
}

.caseCard__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.8rem;
}
```

- [ ] **Step 3: Write `Cases.tsx` and `Cases.module.scss`**

`Cases.tsx`:

```tsx
import { CASES, HUAWEI_NOTE } from '@/data/cases';
import CaseCard from './CaseCard';
import styles from './Cases.module.scss';

const Cases = () => {
  return (
    <section className={styles.cases} id="cases">
      <h2 className={styles.cases__title} data-reveal>Кейсы</h2>
      <div className={styles.cases__grid}>
        {CASES.map((item) => (
          <CaseCard key={item.slug} item={item} />
        ))}
      </div>
      <p className={styles.cases__note} data-reveal>
        {HUAWEI_NOTE.text}{' '}
        <a href={HUAWEI_NOTE.href} target="_blank" rel="noreferrer" className={styles.cases__link}>
          → {HUAWEI_NOTE.label}
        </a>
      </p>
    </section>
  );
};

export default Cases;
```

`Cases.module.scss`:

```scss
@use '../../../styles/typography' as *;
@use '../../../styles/mixins' as *;

.cases {
  @include section;
}

.cases__title {
  @include text-display;
  margin-bottom: 4rem;
}

.cases__grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--space-grid-gap);
}

.cases__note {
  @include text-body;
  margin-top: 3.2rem;
  color: var(--color-text-dim);
}

.cases__link {
  color: var(--color-action-primary);
  transition: color 0.15s ease-out;

  @include hover {
    color: var(--color-action-primary-hover);
  }
}
```

- [ ] **Step 4: Write `CtaBand.tsx` and `CtaBand.module.scss`**

`CtaBand.tsx`:

```tsx
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CTA_BAND, CTA_LABEL } from '@/data/site';
import styles from './CtaBand.module.scss';

const CtaBand = () => {
  return (
    <section className={styles.band}>
      <div className={styles.band__inner}>
        <p className={styles.band__text}>{CTA_BAND.text}</p>
        <BaseButton href="#contact" variant="inverse">{CTA_LABEL}</BaseButton>
      </div>
    </section>
  );
};

export default CtaBand;
```

`CtaBand.module.scss`:

```scss
@use '../../../styles/typography' as *;
@use '../../../styles/mixins' as *;

.band {
  background: var(--color-action-primary);
  color: var(--color-on-action);
}

.band__inner {
  @include container;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.4rem;
  min-height: 16rem;
  padding-top: 3.2rem;
  padding-bottom: 3.2rem;

  @include mobile {
    flex-direction: column;
    align-items: flex-start;
  }
}

.band__text {
  @include text-title;
  max-width: 70rem;
  text-wrap: balance;
}
```

- [ ] **Step 5: Add to `app/page.tsx`**

```tsx
import Hero from '@/components/sections/Hero/Hero';
import Cases from '@/components/sections/Cases/Cases';
import CtaBand from '@/components/sections/CtaBand/CtaBand';

const HomePage = () => {
  return (
    <main>
      <Hero />
      <Cases />
      <CtaBand />
    </main>
  );
};

export default HomePage;
```

- [ ] **Step 6: Verify**

At 1440: rows of 2 / 3 / 4 cards on a 12-column grid, first tag accent, hover lifts and tints the border blue, the Huawei line with a blue Behance link, then a full-width blue band with an inverse button. At 390: single column. Cards fade in as they enter the viewport. `npm run build` passes.

- [ ] **Step 7: Commit**

```bash
git add components/sections/Cases components/sections/CtaBand app/page.tsx
git commit -m "feat: add cases grid and CTA band"
```

---

### Task 10: Services section with Tibia table and prompt demo visuals

**Files:**
- Create: `components/sections/Services/Services.tsx`, `components/sections/Services/Services.module.scss`, `components/sections/Services/ServiceCard.tsx`, `components/sections/Services/ServiceCard.module.scss`, `components/sections/Services/visuals/TibiaTable.tsx`, `components/sections/Services/visuals/TibiaTable.module.scss`, `components/sections/Services/visuals/PromptDemo.tsx`, `components/sections/Services/visuals/PromptDemo.module.scss`, `components/sections/Services/visuals/ServiceVisual.tsx`
- Modify: `app/page.tsx`

Note: visuals live at depth 4, so their SCSS imports use `../../../../styles/...`.

- [ ] **Step 1: Write `visuals/TibiaTable.tsx`**

```tsx
'use client';

import { useState } from 'react';
import clsx from 'clsx';
import styles from './TibiaTable.module.scss';

const ROWS = [
  ['НКТ', '4X8', '73×5.5', 'Р', 'НК'],
  ['НКТ', '4X9', '73×5.5', 'Р', 'НК'],
  ['НКТ', '5A1', '89×6.5', 'Р', 'НК'],
  ['НКТ', '5A2', '89×6.5', 'Р', 'НК'],
  ['НКТ', '5B0', '73×5.5', 'Р', 'НК'],
  ['НКТ', '5B1', '73×5.5', 'Р', 'НК'],
];

const TibiaTable = () => {
  const [visible, setVisible] = useState(2);

  return (
    <div className={styles.table} onMouseEnter={() => setVisible(ROWS.length)} onMouseLeave={() => setVisible(2)} onTouchStart={() => setVisible(ROWS.length)}>
      <div className={styles.table__head}>
        <span>Тип</span><span>Код</span><span>Размер</span><span>Кл.</span><span>Пакет</span>
      </div>
      {ROWS.map((row, index) => (
        <div key={row[1]} className={clsx(styles.table__row, index < visible && styles['table__row--visible'])} style={{ transitionDelay: `${index * 80}ms` }}>
          {row.map((cell, i) => (
            <span key={i}>{cell}</span>
          ))}
        </div>
      ))}
      <span className={styles.table__badge}>сканер подключён</span>
    </div>
  );
};

export default TibiaTable;
```

- [ ] **Step 2: Write `visuals/TibiaTable.module.scss`**

```scss
@use '../../../../styles/typography' as *;

.table {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  width: 100%;
  height: 100%;
  padding: 1.6rem;
  border-radius: var(--radius-control);
  background: var(--color-bg);
  overflow: hidden;
}

.table__head,
.table__row {
  @include text-body;
  display: grid;
  grid-template-columns: 1fr 1fr 1.4fr 0.8fr 1fr;
  gap: 1.2rem;
  padding: 0.6rem 0.8rem;
  border-radius: 0.4rem;
}

.table__head {
  color: var(--color-text-dim);
  border-bottom: 1px solid var(--color-border);
}

.table__row {
  opacity: 0;
  transform: translateX(-1rem);
  transition: opacity 0.3s ease-out, transform 0.3s var(--ease);
  background: var(--color-surface);
}

.table__row--visible {
  opacity: 1;
  transform: translateX(0);
}

.table__badge {
  @include text-body;
  position: absolute;
  right: 1.6rem;
  bottom: 1.6rem;
  padding: 0.4rem 1.2rem;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-success) 15%, transparent);
  color: var(--color-success);
}
```

- [ ] **Step 3: Write `visuals/PromptDemo.tsx` and its styles**

`PromptDemo.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import useInView from '@/hooks/useInView';
import styles from './PromptDemo.module.scss';

const PROMPT = 'Рекламный ролик крема для лица, студийный свет, 6 секунд';

const PromptDemo = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!inView || typed >= PROMPT.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(PROMPT.length);
      return;
    }
    const id = window.setTimeout(() => setTyped((n) => n + 1), 45);
    return () => window.clearTimeout(id);
  }, [inView, typed]);

  const done = typed >= PROMPT.length;

  return (
    <div ref={ref} className={styles.demo}>
      <div className={styles.demo__prompt}>
        <span className={styles.demo__label}>prompt</span>
        <span>
          {PROMPT.slice(0, typed)}
          {!done && <span className={styles.demo__caret} />}
        </span>
      </div>
      <div className={clsx(styles.demo__frame, done && styles['demo__frame--visible'])}>
        <span className={styles.demo__meta}>00:06 · 9:16 · готово</span>
      </div>
    </div>
  );
};

export default PromptDemo;
```

`PromptDemo.module.scss`:

```scss
@use '../../../../styles/typography' as *;

.demo {
  display: grid;
  grid-template-columns: 1fr 12rem;
  gap: 1.6rem;
  width: 100%;
  height: 100%;
  padding: 1.6rem;
  border-radius: var(--radius-control);
  background: var(--color-bg);
}

.demo__prompt {
  @include text-body;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  min-height: 9.6rem;
}

.demo__label {
  color: var(--color-text-dim);
}

.demo__caret {
  display: inline-block;
  width: 0.2rem;
  height: 1.6rem;
  margin-left: 0.2rem;
  vertical-align: text-bottom;
  background: var(--color-action-primary);
  animation: blink 0.8s steps(1) infinite;
}

.demo__frame {
  position: relative;
  border-radius: var(--radius-control);
  background: linear-gradient(160deg, #6394ff 0%, #1a1f4e 60%, #262525 100%);
  opacity: 0;
  transform: scale(0.96);
  transition: opacity 0.6s ease-out, transform 0.6s var(--ease);
}

.demo__frame--visible {
  opacity: 1;
  transform: scale(1);
}

.demo__meta {
  @include text-body;
  position: absolute;
  left: 1.2rem;
  bottom: 1.2rem;
  color: var(--color-text);
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
```

- [ ] **Step 4: Write `visuals/ServiceVisual.tsx` (switch; Match3 and Rosatom are stubs until Tasks 11–12)**

```tsx
import type { ServiceVisual as ServiceVisualKind } from '@/data/types';
import TibiaTable from './TibiaTable';
import PromptDemo from './PromptDemo';

export interface ServiceVisualProps {
  kind: ServiceVisualKind;
}

const ServiceVisual = ({ kind }: ServiceVisualProps) => {
  switch (kind) {
    case 'tibia':
      return <TibiaTable />;
    case 'prompt':
      return <PromptDemo />;
    default:
      return null;
  }
};

export default ServiceVisual;
```

- [ ] **Step 5: Write `ServiceCard.tsx` and `ServiceCard.module.scss`**

`ServiceCard.tsx`:

```tsx
import BaseTag from '@/components/ui/BaseTag/BaseTag';
import type { IService } from '@/data/types';
import ServiceVisual from './visuals/ServiceVisual';
import styles from './ServiceCard.module.scss';

export interface ServiceCardProps {
  item: IService;
}

const ServiceCard = ({ item }: ServiceCardProps) => {
  return (
    <article className={styles.serviceCard} data-reveal>
      <div className={styles.serviceCard__visual}>
        <ServiceVisual kind={item.visual} />
        <span className={styles.serviceCard__hint}>интерактив</span>
      </div>
      <h3 className={styles.serviceCard__title}>{item.title}</h3>
      <p className={styles.serviceCard__text}>{item.description}</p>
      <div className={styles.serviceCard__stack}>
        {item.stack.map((tech) => (
          <BaseTag key={tech}>{tech}</BaseTag>
        ))}
      </div>
    </article>
  );
};

export default ServiceCard;
```

`ServiceCard.module.scss`:

```scss
@use '../../../styles/typography' as *;
@use '../../../styles/mixins' as *;

.serviceCard {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 2.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);

  @include mobile {
    padding: 2rem;
  }
}

.serviceCard__visual {
  position: relative;
  height: 22rem;
  margin-bottom: 0.8rem;
  border-radius: var(--radius-control);
  overflow: hidden;
}

.serviceCard__hint {
  @include text-body;
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  padding: 0.2rem 1rem;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-action-primary) 15%, transparent);
  color: var(--color-action-primary);
  pointer-events: none;
}

.serviceCard__title {
  @include text-title;
}

.serviceCard__text {
  @include text-body;
  color: var(--color-text-dim);
}

.serviceCard__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.4rem;
}
```

- [ ] **Step 6: Write `Services.tsx` and `Services.module.scss`**

`Services.tsx`:

```tsx
import { SERVICES } from '@/data/services';
import ServiceCard from './ServiceCard';
import styles from './Services.module.scss';

const Services = () => {
  return (
    <section className={styles.services} id="services">
      <h2 className={styles.services__title} data-reveal>Что мы делаем</h2>
      <div className={styles.services__grid}>
        {SERVICES.map((item) => (
          <ServiceCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
};

export default Services;
```

`Services.module.scss`:

```scss
@use '../../../styles/typography' as *;
@use '../../../styles/mixins' as *;

.services {
  @include section;
}

.services__title {
  @include text-display;
  margin-bottom: 4rem;
}

.services__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-grid-gap);

  @include mobile {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 7: Add `<Services />` after `<CtaBand />` in `app/page.tsx`, verify**

Import `Services from '@/components/sections/Services/Services'`. At 1440: 2×2 cards; hovering the first fills the Tibia table row by row; scrolling the fourth into view types the prompt, then the frame fades in. Cards 2 and 3 show an empty visual for now. `npm run build` passes.

- [ ] **Step 8: Commit**

```bash
git add components/sections/Services app/page.tsx
git commit -m "feat: add services section with Tibia table and prompt demo"
```

---

### Task 11: Match-3 mini-game visual

**Files:**
- Create: `components/sections/Services/visuals/Match3.tsx`, `components/sections/Services/visuals/Match3.module.scss`, `components/sections/Services/visuals/hooks/useMatch3.ts`
- Modify: `components/sections/Services/visuals/ServiceVisual.tsx`

- [ ] **Step 1: Write `visuals/hooks/useMatch3.ts`**

```ts
import { useCallback, useState } from 'react';

export const GRID = 6;
export const KINDS = 5;

export interface IUseMatch3 {
  cells: number[];
  selected: number | null;
  score: number;
  onCellClick: (index: number) => void;
}

const randomKind = () => Math.floor(Math.random() * KINDS);

const findMatches = (cells: number[]): Set<number> => {
  const matched = new Set<number>();
  for (let r = 0; r < GRID; r += 1) {
    for (let c = 0; c < GRID; c += 1) {
      const i = r * GRID + c;
      if (c <= GRID - 3 && cells[i] === cells[i + 1] && cells[i] === cells[i + 2]) {
        matched.add(i).add(i + 1).add(i + 2);
      }
      if (r <= GRID - 3 && cells[i] === cells[i + GRID] && cells[i] === cells[i + 2 * GRID]) {
        matched.add(i).add(i + GRID).add(i + 2 * GRID);
      }
    }
  }
  return matched;
};

const collapse = (cells: number[], matched: Set<number>): number[] => {
  const next = [...cells];
  for (let c = 0; c < GRID; c += 1) {
    const column: number[] = [];
    for (let r = GRID - 1; r >= 0; r -= 1) {
      const i = r * GRID + c;
      if (!matched.has(i)) column.push(next[i]);
    }
    while (column.length < GRID) column.push(randomKind());
    for (let r = GRID - 1, k = 0; r >= 0; r -= 1, k += 1) {
      next[r * GRID + c] = column[k];
    }
  }
  return next;
};

const makeBoard = (): number[] => {
  let cells = Array.from({ length: GRID * GRID }, randomKind);
  let matched = findMatches(cells);
  while (matched.size > 0) {
    cells = collapse(cells, matched);
    matched = findMatches(cells);
  }
  return cells;
};

const isAdjacent = (a: number, b: number) => {
  const ra = Math.floor(a / GRID);
  const rb = Math.floor(b / GRID);
  return (ra === rb && Math.abs(a - b) === 1) || Math.abs(a - b) === GRID;
};

const useMatch3 = (): IUseMatch3 => {
  const [cells, setCells] = useState<number[]>(makeBoard);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const onCellClick = useCallback(
    (index: number) => {
      if (selected === null) {
        setSelected(index);
        return;
      }
      if (selected === index || !isAdjacent(selected, index)) {
        setSelected(index);
        return;
      }
      const swapped = [...cells];
      [swapped[selected], swapped[index]] = [swapped[index], swapped[selected]];
      let matched = findMatches(swapped);
      setSelected(null);
      if (matched.size === 0) return;
      let board = swapped;
      let gained = 0;
      while (matched.size > 0) {
        gained += matched.size;
        board = collapse(board, matched);
        matched = findMatches(board);
      }
      setCells(board);
      setScore((s) => s + gained * 10);
    },
    [cells, selected],
  );

  return { cells, selected, score, onCellClick };
};

export default useMatch3;
```

- [ ] **Step 2: Write `visuals/Match3.tsx`**

```tsx
'use client';

import clsx from 'clsx';
import useMatch3, { GRID } from './hooks/useMatch3';
import styles from './Match3.module.scss';

const Match3 = () => {
  const { cells, selected, score, onCellClick } = useMatch3();

  return (
    <div className={styles.game}>
      <div className={styles.game__board} style={{ ['--grid' as string]: GRID }} role="grid" aria-label="Три в ряд">
        {cells.map((kind, index) => (
          <button
            key={index}
            type="button"
            className={clsx(styles.game__cell, styles[`game__cell--${kind}`], selected === index && styles['game__cell--selected'])}
            onClick={() => onCellClick(index)}
            aria-label={`Ячейка ${index + 1}`}
          />
        ))}
      </div>
      <div className={styles.game__side}>
        <span className={styles.game__label}>очки</span>
        <span className={styles.game__score}>{score}</span>
        <span className={styles.game__hint}>меняйте соседние фишки местами</span>
      </div>
    </div>
  );
};

export default Match3;
```

- [ ] **Step 3: Write `visuals/Match3.module.scss`**

```scss
@use '../../../../styles/typography' as *;

.game {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.6rem;
  width: 100%;
  height: 100%;
  padding: 1.6rem;
  border-radius: var(--radius-control);
  background: var(--color-bg);
}

.game__board {
  display: grid;
  grid-template-columns: repeat(var(--grid), 2.8rem);
  gap: 0.4rem;
}

.game__cell {
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 0.6rem;
  border: 2px solid transparent;
  transition: transform 0.15s var(--ease), border-color 0.15s ease-out;

  &:hover {
    transform: scale(1.08);
  }
}

.game__cell--0 { background: #e4002b; }
.game__cell--1 { background: #1e5b3a; }
.game__cell--2 { background: #fcfbfb; }
.game__cell--3 { background: #3b78ff; }
.game__cell--4 { background: #f2b705; }

.game__cell--selected {
  border-color: var(--color-text);
  transform: scale(1.12);
}

.game__side {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.game__label,
.game__hint {
  @include text-body;
  color: var(--color-text-dim);
}

.game__score {
  @include text-title;
  color: var(--color-action-primary);
}

.game__hint {
  margin-top: auto;
}
```

- [ ] **Step 4: Register in `ServiceVisual.tsx`**

Add `import Match3 from './Match3';` and a case:

```tsx
case 'match3':
  return <Match3 />;
```

- [ ] **Step 5: Verify**

Card 2 shows a 6×6 board of five colors and a score; clicking two adjacent cells that form a line of three clears them, refills from the top and adds 30 points; a non-matching swap does nothing. Board never starts with a pre-made match. `npm run build` passes.

- [ ] **Step 6: Commit**

```bash
git add components/sections/Services/visuals
git commit -m "feat: add match-3 mini-game visual"
```

---

### Task 12: Rosatom 3D object (vanilla Three.js class)

**Files:**
- Create: `components/sections/Services/visuals/RosatomScene.ts`, `components/sections/Services/visuals/RosatomObject.tsx`, `components/sections/Services/visuals/RosatomObject.module.scss`, `components/sections/Services/visuals/RosatomLazy.tsx`
- Modify: `components/sections/Services/visuals/ServiceVisual.tsx`

- [ ] **Step 1: Write `RosatomScene.ts`**

```ts
import {
  AmbientLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  TorusGeometry,
  WebGLRenderer,
} from 'three';

export class RosatomScene {
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private group = new Group();
  private target = { x: 0, y: 0 };
  private frame = 0;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    const { clientWidth: w, clientHeight: h } = container;
    this.camera = new PerspectiveCamera(35, w / h, 0.1, 100);
    this.camera.position.z = 7;

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    container.appendChild(this.renderer.domElement);

    const core = new Mesh(new SphereGeometry(0.7, 48, 48), new MeshStandardMaterial({ color: 0x3b78ff, roughness: 0.3, metalness: 0.4 }));
    this.group.add(core);

    const ringMaterial = new MeshStandardMaterial({ color: 0xfcfbfb, roughness: 0.2, metalness: 0.8 });
    const tilts = [0, Math.PI / 3, -Math.PI / 3];
    tilts.forEach((tilt, i) => {
      const ring = new Mesh(new TorusGeometry(1.8, 0.05, 16, 120), ringMaterial);
      ring.rotation.x = Math.PI / 2 + tilt * 0.4;
      ring.rotation.y = tilt + i * 0.2;
      this.group.add(ring);
    });

    this.scene.add(this.group);
    this.scene.add(new AmbientLight(0xffffff, 0.6));
    const key = new PointLight(0x6394ff, 40);
    key.position.set(3, 3, 4);
    this.scene.add(key);
    const fill = new PointLight(0xd7141a, 12);
    fill.position.set(-3, -2, 3);
    this.scene.add(fill);

    window.addEventListener('pointermove', this.onPointer, { passive: true });
    window.addEventListener('resize', this.onResize);
    this.tick();
  }

  private onPointer = (e: PointerEvent) => {
    const rect = this.container.getBoundingClientRect();
    this.target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 1.2;
    this.target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 1.2;
  };

  private onResize = () => {
    const { clientWidth: w, clientHeight: h } = this.container;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private tick = () => {
    this.frame = requestAnimationFrame(this.tick);
    this.group.rotation.y += (this.target.x - this.group.rotation.y) * 0.05 + 0.003;
    this.group.rotation.x += (this.target.y - this.group.rotation.x) * 0.05;
    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    cancelAnimationFrame(this.frame);
    window.removeEventListener('pointermove', this.onPointer);
    window.removeEventListener('resize', this.onResize);
    this.group.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.geometry.dispose();
        (obj.material as MeshStandardMaterial).dispose();
      }
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
```

- [ ] **Step 2: Write `RosatomObject.tsx` (mount point) and styles**

`RosatomObject.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { RosatomScene } from './RosatomScene';
import styles from './RosatomObject.module.scss';

const RosatomObject = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const scene = new RosatomScene(ref.current);
    return () => scene.dispose();
  }, []);

  return <div ref={ref} className={styles.object} aria-hidden="true" />;
};

export default RosatomObject;
```

`RosatomObject.module.scss`:

```scss
.object {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-control);
  background: radial-gradient(ellipse 60% 60% at 50% 50%, #1a1f4e 0%, var(--color-bg) 100%);

  canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
}
```

- [ ] **Step 3: Write `RosatomLazy.tsx` (loads the chunk only when the card is near the viewport)**

```tsx
'use client';

import dynamic from 'next/dynamic';
import useInView from '@/hooks/useInView';

const RosatomObject = dynamic(() => import('./RosatomObject'), { ssr: false });

const RosatomLazy = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '300px 0px', once: true });
  return <div ref={ref} style={{ width: '100%', height: '100%' }}>{inView && <RosatomObject />}</div>;
};

export default RosatomLazy;
```

- [ ] **Step 4: Register in `ServiceVisual.tsx`**

Add `import RosatomLazy from './RosatomLazy';` and:

```tsx
case 'rosatom':
  return <RosatomLazy />;
```

- [ ] **Step 5: Verify**

Card 3 renders a blue core with three white rings on a navy gradient; the object tilts toward the cursor and slowly spins. In the Network tab the `three` chunk loads only when the services section approaches. `npm run build` passes and reports the chunk as lazy.

- [ ] **Step 6: Commit**

```bash
git add components/sections/Services/visuals
git commit -m "feat: add lazy Three.js Rosatom object visual"
```

---

### Task 13: Why and Ecosystem sections

**Files:**
- Create: `components/sections/Why/Why.tsx`, `components/sections/Why/Why.module.scss`, `components/sections/Ecosystem/Ecosystem.tsx`, `components/sections/Ecosystem/Ecosystem.module.scss`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write `Why.tsx`**

```tsx
import clsx from 'clsx';
import { WHY_CARDS, WHY_TITLE } from '@/data/why';
import styles from './Why.module.scss';

const Why = () => {
  return (
    <section className={styles.why}>
      <h2 className={styles.why__title} data-reveal>{WHY_TITLE}</h2>
      <div className={styles.why__grid}>
        {WHY_CARDS.map((card) => (
          <article key={card.title} className={clsx(styles.why__card, card.featured && styles['why__card--featured'])} data-reveal>
            <h3 className={styles.why__cardTitle}>{card.title}</h3>
            <p className={styles.why__cardText}>{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Why;
```

- [ ] **Step 2: Write `Why.module.scss`**

```scss
@use '../../../styles/typography' as *;
@use '../../../styles/mixins' as *;

.why {
  @include section;
}

.why__title {
  @include text-display;
  margin-bottom: 4rem;
}

.why__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-grid-gap);

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.why__card {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 2.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.why__card--featured {
  border-color: color-mix(in srgb, var(--color-action-primary) 60%, transparent);
  box-shadow: 0 0 4.8rem color-mix(in srgb, var(--color-action-primary) 10%, transparent);
}

.why__cardTitle {
  @include text-title;
}

.why__cardText {
  @include text-body;
  color: var(--color-text-dim);
}
```

- [ ] **Step 3: Write `Ecosystem.tsx` and `Ecosystem.module.scss`**

`Ecosystem.tsx`:

```tsx
import { ECOSYSTEM_CARDS, ECOSYSTEM_TITLE } from '@/data/why';
import styles from './Ecosystem.module.scss';

const Ecosystem = () => {
  return (
    <section className={styles.ecosystem}>
      <h2 className={styles.ecosystem__title} data-reveal>{ECOSYSTEM_TITLE}</h2>
      <div className={styles.ecosystem__grid}>
        {ECOSYSTEM_CARDS.map((card) => (
          <a key={card.href} href={card.href} target="_blank" rel="noreferrer" className={styles.ecosystem__card} data-reveal>
            <span className={styles.ecosystem__cardTitle}>{card.title}</span>
            <span className={styles.ecosystem__cardText}>{card.description}</span>
            <span className={styles.ecosystem__cardLink}>{card.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Ecosystem;
```

`Ecosystem.module.scss`:

```scss
@use '../../../styles/typography' as *;
@use '../../../styles/mixins' as *;

.ecosystem {
  @include section;
}

.ecosystem__title {
  @include text-display;
  margin-bottom: 4rem;
}

.ecosystem__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-grid-gap);

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.ecosystem__card {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 3.2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  transition: border-color 0.25s ease-out;

  @include hover {
    border-color: color-mix(in srgb, var(--color-action-primary-hover) 55%, transparent);
  }
}

.ecosystem__cardTitle {
  @include text-title;
}

.ecosystem__cardText {
  @include text-body;
  color: var(--color-text-dim);
}

.ecosystem__cardLink {
  @include text-body;
  margin-top: 0.8rem;
  color: var(--color-action-primary);
}
```

- [ ] **Step 4: Add `<Why />` after `<Services />` and `<Ecosystem />` after it in `app/page.tsx` (Process goes between them in Task 14), verify at both widths, `npm run build`.**

- [ ] **Step 5: Commit**

```bash
git add components/sections/Why components/sections/Ecosystem app/page.tsx
git commit -m "feat: add why and ecosystem sections"
```

---

### Task 14: Process section with pinned horizontal scroll (GSAP)

**Files:**
- Create: `components/sections/Process/Process.tsx`, `components/sections/Process/Process.module.scss`, `components/sections/Process/ProcessStep.tsx`, `components/sections/Process/ProcessStep.module.scss`, `components/sections/Process/hooks/useProcessScroll.ts`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write `hooks/useProcessScroll.ts`**

```ts
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface IUseProcessScroll {
  sectionRef: React.RefObject<HTMLElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  progress: number;
  onMobileScroll: () => void;
}

const useProcessScroll = (): IUseProcessScroll => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => track.scrollWidth - track.clientWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.5,
          start: 'top top',
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.revert().kill();
      };
    });

    return () => mm.revert();
  }, []);

  const onMobileScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setProgress(max > 0 ? track.scrollLeft / max : 0);
  };

  return { sectionRef, trackRef, progress, onMobileScroll };
};

export default useProcessScroll;
```

- [ ] **Step 2: Write `ProcessStep.tsx` and `ProcessStep.module.scss`**

`ProcessStep.tsx`:

```tsx
import clsx from 'clsx';
import type { IProcessStep } from '@/data/types';
import styles from './ProcessStep.module.scss';

export interface ProcessStepProps {
  step: IProcessStep;
  active: boolean;
}

const ProcessStep = ({ step, active }: ProcessStepProps) => {
  return (
    <article className={clsx(styles.step, active && styles['step--active'])}>
      <span className={styles.step__number}>{step.number}</span>
      <h3 className={styles.step__title}>{step.title}</h3>
      <p className={styles.step__text}>{step.description}</p>
    </article>
  );
};

export default ProcessStep;
```

`ProcessStep.module.scss`:

```scss
@use '../../../styles/typography' as *;
@use '../../../styles/mixins' as *;

.step {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  flex: 0 0 44rem;
  scroll-snap-align: start;

  @include mobile {
    flex-basis: 28rem;
  }
}

.step__number {
  @include text-display;
  color: var(--color-border);
  transition: color 0.3s ease-out;
}

.step--active .step__number {
  color: var(--color-action-primary);
}

.step__title {
  @include text-title;
  color: var(--color-text-dim);
  transition: color 0.3s ease-out;
}

.step--active .step__title {
  color: var(--color-text);
}

.step__text {
  @include text-body;
  color: var(--color-text-cold);
}
```

- [ ] **Step 3: Write `Process.tsx`**

```tsx
'use client';

import { PROCESS_NOTE, PROCESS_STEPS } from '@/data/process';
import ProcessStep from './ProcessStep';
import useProcessScroll from './hooks/useProcessScroll';
import styles from './Process.module.scss';

const Process = () => {
  const { sectionRef, trackRef, progress, onMobileScroll } = useProcessScroll();
  const activeIndex = Math.min(PROCESS_STEPS.length - 1, Math.floor(progress * PROCESS_STEPS.length + 0.0001));

  return (
    <section ref={sectionRef} className={styles.process} id="process">
      <div className={styles.process__inner}>
        <h2 className={styles.process__title}>Как проходит проект</h2>
        <div className={styles.process__timeline} aria-hidden="true">
          <span className={styles.process__timelineFill} style={{ transform: `scaleX(${Math.max(progress, 0.08)})` }} />
        </div>
        <div ref={trackRef} className={styles.process__track} onScroll={onMobileScroll}>
          {PROCESS_STEPS.map((step, index) => (
            <ProcessStep key={step.number} step={step} active={index <= activeIndex} />
          ))}
        </div>
        <p className={styles.process__note}>{PROCESS_NOTE}</p>
      </div>
    </section>
  );
};

export default Process;
```

- [ ] **Step 4: Write `Process.module.scss`**

```scss
@use '../../../styles/typography' as *;
@use '../../../styles/mixins' as *;

.process {
  overflow: hidden;
}

.process__inner {
  @include section;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;

  @include mobile {
    min-height: 0;
  }
}

.process__title {
  @include text-display;
  margin-bottom: 3.2rem;
}

.process__timeline {
  position: relative;
  height: 0.8rem;
  margin-bottom: 4rem;
  border-radius: var(--radius-pill);
  background: var(--color-border);
  overflow: hidden;
}

.process__timelineFill {
  position: absolute;
  inset: 0;
  transform-origin: left center;
  background: var(--color-action-primary);
  transition: transform 0.1s linear;
}

.process__track {
  display: flex;
  gap: 4.8rem;
  will-change: transform;

  @include mobile {
    gap: 2.4rem;
    margin: 0 calc(-1 * var(--space-gutter));
    padding: 0 var(--space-gutter);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.process__note {
  @include text-body;
  margin-top: 4.8rem;
  color: var(--color-text-cold);
}
```

- [ ] **Step 5: Add `<Process />` between `<Why />` and `<Ecosystem />` in `app/page.tsx`, verify**

At 1440: reaching the section pins it, the wheel moves the five 440px-wide steps horizontally, the timeline fills and steps light up in order, then the page continues. At 390: no pin, steps swipe with snap and the timeline follows. With reduced motion enabled the section is static. `npm run build` passes.

- [ ] **Step 6: Commit**

```bash
git add components/sections/Process app/page.tsx
git commit -m "feat: add pinned horizontal process section"
```

---

### Task 15: Contact section, lead form and API route

**Files:**
- Create: `components/sections/Contact/LeadForm.validationSchema.ts`, `components/sections/Contact/LeadForm.tsx`, `components/sections/Contact/LeadForm.module.scss`, `components/sections/Contact/hooks/useLeadSubmit.ts`, `components/sections/Contact/Contact.tsx`, `components/sections/Contact/Contact.module.scss`, `app/api/lead/route.ts`, `.env.example`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write `LeadForm.validationSchema.ts`**

```ts
import * as yup from 'yup';

export type LeadSource = 'form' | 'floating' | 'mobile-bar';

export interface ILeadValues {
  name: string;
  contact: string;
  message: string;
  source: LeadSource;
}

export const LEAD_INITIAL_VALUES: ILeadValues = { name: '', contact: '', message: '', source: 'form' };

export const leadValidationSchema = yup.object({
  name: yup.string().trim().min(2, 'Минимум 2 символа').required('Как к вам обращаться?'),
  contact: yup.string().trim().min(3, 'Минимум 3 символа').required('Telegram или почта, чтобы ответить'),
  message: yup.string().trim().max(2000, 'Слишком длинно, до 2000 символов'),
  source: yup.mixed<LeadSource>().oneOf(['form', 'floating', 'mobile-bar']).required(),
});
```

- [ ] **Step 2: Write `hooks/useLeadSubmit.ts`**

```ts
import { useState } from 'react';
import type { ILeadValues } from '../LeadForm.validationSchema';

export type LeadStatus = 'idle' | 'sending' | 'success' | 'error';

export interface IUseLeadSubmit {
  status: LeadStatus;
  submit: (values: ILeadValues) => Promise<void>;
}

const useLeadSubmit = (): IUseLeadSubmit => {
  const [status, setStatus] = useState<LeadStatus>('idle');

  const submit = async (values: ILeadValues) => {
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return { status, submit };
};

export default useLeadSubmit;
```

- [ ] **Step 3: Write `LeadForm.tsx`**

```tsx
'use client';

import { Formik, Form } from 'formik';
import clsx from 'clsx';
import BaseInput from '@/components/ui/BaseInput/BaseInput';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CONTACT } from '@/data/site';
import useLeadSubmit from './hooks/useLeadSubmit';
import { LEAD_INITIAL_VALUES, leadValidationSchema, type LeadSource } from './LeadForm.validationSchema';
import styles from './LeadForm.module.scss';

export interface LeadFormProps {
  source?: LeadSource;
  compact?: boolean;
  className?: string;
}

const LeadForm = ({ source = 'form', compact = false, className }: LeadFormProps) => {
  const { status, submit } = useLeadSubmit();
  const idPrefix = `lead-${source}`;

  if (status === 'success') {
    return (
      <div className={clsx(styles.form, styles['form--done'], className)} role="status">
        <p className={styles.form__success}>Спасибо, ответим в течение дня.</p>
      </div>
    );
  }

  return (
    <Formik initialValues={{ ...LEAD_INITIAL_VALUES, source }} validationSchema={leadValidationSchema} onSubmit={submit}>
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form className={clsx(styles.form, compact && styles['form--compact'], className)} noValidate>
          <BaseInput
            id={`${idPrefix}-name`}
            name="name"
            label="Имя"
            autoComplete="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name ? errors.name : undefined}
          />
          <BaseInput
            id={`${idPrefix}-contact`}
            name="contact"
            label="Telegram или почта"
            autoComplete="email"
            value={values.contact}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.contact ? errors.contact : undefined}
          />
          {!compact && (
            <BaseInput
              id={`${idPrefix}-message`}
              name="message"
              label="Коротко о задаче"
              multiline
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.message ? errors.message : undefined}
            />
          )}
          <BaseButton type="submit" disabled={status === 'sending'} block={compact}>
            {status === 'sending' ? 'Отправляем…' : 'Отправить'}
          </BaseButton>
          {status === 'error' && (
            <p className={styles.form__error} role="alert">
              Не отправилось. Напишите нам напрямую:{' '}
              <a href={CONTACT.links[0].href} target="_blank" rel="noreferrer">Telegram</a>
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default LeadForm;
```

- [ ] **Step 4: Write `LeadForm.module.scss`**

```scss
@use '../../../styles/typography' as *;

.form {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: 100%;
}

.form--compact {
  gap: 1.2rem;
}

.form--done {
  justify-content: center;
  min-height: 12rem;
}

.form__success {
  @include text-title;
  color: var(--color-success);
}

.form__error {
  @include text-body;
  color: var(--color-error);

  a {
    color: var(--color-action-primary);
  }
}
```

- [ ] **Step 5: Write `Contact.tsx` and `Contact.module.scss`**

`Contact.tsx`:

```tsx
import { CONTACT } from '@/data/site';
import LeadForm from './LeadForm';
import styles from './Contact.module.scss';

const Contact = () => {
  return (
    <section className={styles.contact} id="contact">
      <div className={styles.contact__info} data-reveal>
        <h2 className={styles.contact__title}>{CONTACT.title}</h2>
        <p className={styles.contact__text}>{CONTACT.text}</p>
        <ul className={styles.contact__links}>
          {CONTACT.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.contact__link} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.contact__form} data-reveal>
        <LeadForm />
      </div>
    </section>
  );
};

export default Contact;
```

`Contact.module.scss`:

```scss
@use '../../../styles/typography' as *;
@use '../../../styles/mixins' as *;

.contact {
  @include section;
  display: grid;
  grid-template-columns: 52rem 60rem;
  justify-content: space-between;
  gap: 4.8rem;

  @include mobile {
    grid-template-columns: 1fr;
    gap: 3.2rem;
  }
}

.contact__info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact__title {
  @include text-display;
}

.contact__text {
  @include text-body;
  color: var(--color-text-dim);
}

.contact__links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.2rem;
}

.contact__link {
  @include text-body(500);
  color: var(--color-action-primary);
  transition: color 0.15s ease-out;

  @include hover {
    color: var(--color-action-primary-hover);
  }
}

.contact__form {
  display: flex;
  align-items: flex-start;
}
```

- [ ] **Step 6: Write `app/api/lead/route.ts` and `.env.example`**

`route.ts`:

```ts
import { NextResponse } from 'next/server';
import { ValidationError } from 'yup';
import { leadValidationSchema } from '@/components/sections/Contact/LeadForm.validationSchema';

const escape = (s: string) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] ?? c);

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  let lead;
  try {
    lead = await leadValidationSchema.validate(payload, { abortEarly: false, stripUnknown: true });
  } catch (err) {
    const details = err instanceof ValidationError ? err.errors : ['invalid'];
    return NextResponse.json({ error: 'validation', details }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.info('[lead] (no telegram config)', lead);
    return NextResponse.json({ ok: true });
  }

  const text = [
    `<b>Заявка с flame dev</b> (${lead.source})`,
    `Имя: ${escape(lead.name)}`,
    `Контакт: ${escape(lead.contact)}`,
    lead.message ? `Задача: ${escape(lead.message)}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });

  if (!res.ok) {
    console.error('[lead] telegram failed', res.status, await res.text());
    return NextResponse.json({ error: 'delivery' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
```

`.env.example`:

```
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

- [ ] **Step 7: Add `<Contact />` after `<Ecosystem />` in `app/page.tsx`, verify**

Submit empty → two red messages under Имя and Контакт. Fill and submit → button says «Отправляем…», dev server logs `[lead] (no telegram config) {...}`, form is replaced by the green success line. Stop the dev server, run with a bogus token (`TELEGRAM_BOT_TOKEN=x TELEGRAM_CHAT_ID=1 npm run dev`) → the form shows the red error line with a Telegram link. `npm run build` passes and lists `/api/lead` as dynamic (`ƒ`).

- [ ] **Step 8: Commit**

```bash
git add components/sections/Contact app/api .env.example app/page.tsx
git commit -m "feat: add contact section, lead form and Telegram API route"
```

---

### Task 16: Pursuing CTA — floating button with mini-form and mobile bar

**Files:**
- Create: `components/cta/hooks/useCtaVisibility.ts`, `components/cta/FloatingCta/FloatingCta.tsx`, `components/cta/FloatingCta/FloatingCta.module.scss`, `components/cta/MobileCtaBar/MobileCtaBar.tsx`, `components/cta/MobileCtaBar/MobileCtaBar.module.scss`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write `hooks/useCtaVisibility.ts`**

```ts
import { useEffect, useState } from 'react';

const useCtaVisibility = (): boolean => {
  const [heroPassed, setHeroPassed] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    const contact = document.getElementById('contact');
    if (!hero || !contact) return;

    const heroObserver = new IntersectionObserver(([entry]) => setHeroPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 });
    const contactObserver = new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting), { threshold: 0.2 });

    heroObserver.observe(hero);
    contactObserver.observe(contact);
    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);

  return heroPassed && !contactVisible;
};

export default useCtaVisibility;
```

- [ ] **Step 2: Write `FloatingCta.tsx`**

```tsx
'use client';

import { useState } from 'react';
import clsx from 'clsx';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import LeadForm from '@/components/sections/Contact/LeadForm';
import { CTA_LABEL } from '@/data/site';
import useCtaVisibility from '../hooks/useCtaVisibility';
import styles from './FloatingCta.module.scss';

const FloatingCta = () => {
  const visible = useCtaVisibility();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={clsx(styles.cta, visible && styles['cta--visible'], expanded && styles['cta--expanded'])} aria-hidden={!visible}>
      {expanded ? (
        <div className={styles.cta__panel}>
          <div className={styles.cta__head}>
            <span className={styles.cta__title}>Расскажите о задаче</span>
            <button type="button" className={styles.cta__close} aria-label="Закрыть" onClick={() => setExpanded(false)}>
              ×
            </button>
          </div>
          <LeadForm source="floating" compact />
        </div>
      ) : (
        <BaseButton onClick={() => setExpanded(true)} tabIndex={visible ? 0 : -1}>
          {CTA_LABEL}
        </BaseButton>
      )}
    </div>
  );
};

export default FloatingCta;
```

- [ ] **Step 3: Write `FloatingCta.module.scss`**

```scss
@use '../../../styles/typography' as *;
@use '../../../styles/mixins' as *;

.cta {
  position: fixed;
  right: 3.2rem;
  bottom: 3.2rem;
  z-index: 40;
  opacity: 0;
  transform: translateY(1.6rem);
  pointer-events: none;
  transition: opacity 0.3s ease-out, transform 0.3s var(--ease);

  @include mobile {
    display: none;
  }
}

.cta--visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.cta__panel {
  @include glass;
  width: 36rem;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  box-shadow: 0 1.6rem 4.8rem rgba(0, 0, 0, 0.5);
}

.cta__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cta__title {
  @include text-title;
}

.cta__close {
  @include text-title;
  width: 3.2rem;
  height: 3.2rem;
  color: var(--color-text-dim);
  line-height: 1;

  @include hover {
    color: var(--color-text);
  }
}
```

- [ ] **Step 4: Write `MobileCtaBar.tsx` and `MobileCtaBar.module.scss`**

`MobileCtaBar.tsx`:

```tsx
'use client';

import clsx from 'clsx';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CTA_LABEL } from '@/data/site';
import useCtaVisibility from '../hooks/useCtaVisibility';
import styles from './MobileCtaBar.module.scss';

const MobileCtaBar = () => {
  const visible = useCtaVisibility();

  return (
    <div className={clsx(styles.bar, visible && styles['bar--visible'])} aria-hidden={!visible}>
      <BaseButton href="#contact" block tabIndex={visible ? 0 : -1}>
        {CTA_LABEL}
      </BaseButton>
    </div>
  );
};

export default MobileCtaBar;
```

`MobileCtaBar.module.scss`:

```scss
@use '../../../styles/mixins' as *;

.bar {
  display: none;

  @include mobile {
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 40;
    padding: 0.8rem var(--space-gutter) calc(0.8rem + env(safe-area-inset-bottom));
    background: color-mix(in srgb, var(--color-bg) 85%, transparent);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid var(--color-border);
    transform: translateY(100%);
    transition: transform 0.3s var(--ease);
  }
}

.bar--visible {
  transform: translateY(0);
}
```

- [ ] **Step 5: Mount both in `app/layout.tsx`**

After `<Footer />`:

```tsx
<FloatingCta />
<MobileCtaBar />
```

with imports `FloatingCta from '@/components/cta/FloatingCta/FloatingCta'` and `MobileCtaBar from '@/components/cta/MobileCtaBar/MobileCtaBar'`.

- [ ] **Step 6: Verify**

At 1440: no floating button on the hero; scrolling past it slides in the blue button bottom-right; clicking opens a glass panel with name + contact + Отправить; the panel hides when the contact section is on screen. At 390: the bottom bar appears after the hero, hides on the form, and taps scroll to `#contact`. `npm run build` passes.

- [ ] **Step 7: Commit**

```bash
git add components/cta app/layout.tsx
git commit -m "feat: add floating CTA with mini-form and mobile CTA bar"
```

---

### Task 17: Mobile pass and metadata polish

**Files:**
- Modify: `app/layout.tsx`, any `*.module.scss` that breaks at 390

- [ ] **Step 1: Walk the page at 390 portrait and fix layout issues**

Check each section in DevTools (iPhone 12 Pro preset, 390×844, portrait): header/burger, hero carousel and dots, case cards single column with 16:10 posters, blue band stacked, service cards with visuals 220px tall (the match-3 board must fit: if it overflows, set `.game__board { grid-template-columns: repeat(var(--grid), 2.4rem) }` and `.game__cell { width: 2.4rem; height: 2.4rem }` under `@include mobile`), why cards, process swipe, ecosystem, contact form, footer, mobile bar not covering the submit button (add `padding-bottom: 8rem` to `.contact` under `@include mobile`). Fix inside the corresponding module under `@include mobile` only.

- [ ] **Step 2: Add Open Graph metadata and favicon**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#262525"/><path d="M11 24 L14 8 H23 L22.2 11.6 H17.4 L16.8 14.4 H21.4 L20.6 18 H16.1 L14.9 24 Z" fill="#3B78FF"/></svg>
```

In `app/layout.tsx` extend `metadata`:

```ts
export const metadata: Metadata = {
  title: 'Flame Dev — сложные системы и спецпроекты для брендов',
  description: 'Разработка, дизайн и видеопродакшн в одной команде. Coca-Cola, Росатом, AliExpress, Purina, VK.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Flame Dev',
    description: 'Сложные системы и спецпроекты для брендов.',
    siteName: 'Flame Dev',
    locale: 'ru_RU',
    type: 'website',
  },
};
```

- [ ] **Step 3: Verify and commit**

`npm run build` passes; the tab shows the blue F icon.

```bash
git add -A
git commit -m "fix: mobile layout pass and site metadata"
```

---

### Task 18: Final verification against the spec's readiness criteria

**Files:**
- Create: `scripts/check-font-sizes.mjs`

- [ ] **Step 1: Write a font-size audit script**

```js
// Prints every font-size computed on the page. Run against the dev server with Chrome installed.
// Usage: node scripts/check-font-sizes.mjs http://localhost:3000
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:3000';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
const sizes = await page.evaluate(() => {
  const set = new Map();
  document.querySelectorAll('body *').forEach((el) => {
    if (!el.textContent?.trim() || el.children.length > 0) return;
    const size = getComputedStyle(el).fontSize;
    set.set(size, (set.get(size) ?? 0) + 1);
  });
  return [...set.entries()].sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
});
console.table(sizes);
await browser.close();
```

Run once with `npx -y playwright@latest install chromium` then `npx -y playwright@latest node scripts/check-font-sizes.mjs`; expected exactly three sizes: `16px`, `24px`, `48px` (plus nothing else). If a fourth size appears, find the element and switch it to one of the three mixins. Do not add playwright to `package.json`.

- [ ] **Step 2: Run the full check list**

```bash
npm run lint && npm run typecheck && npm run build
grep -rn "px" components --include="*.scss" | grep -v "1px" | grep -v "2px" | grep -v "blur(" || echo "no stray px"
```

Expected: build green; the grep prints nothing but `no stray px` (2px is allowed only for focus outlines and the burger lines).

- [ ] **Step 3: Lighthouse**

`npm run build && npm run start`, then in Chrome DevTools run Lighthouse (Mobile, Performance). Expected ≥ 90. If lower, the usual causes are the Three.js chunk loading early (check `RosatomLazy` rootMargin) or the reel posters being too large; there are no images yet, so the score should be high.

- [ ] **Step 4: Manual criteria walk-through**

- Header CTA visible at every scroll position (desktop and mobile).
- Floating CTA appears after hero, disappears on the contact section; mobile bar likewise.
- Form validates, submits, shows success and error states.
- Videos: none yet; with a test mp4 placed in `public/posters/test.mp4` and `video: { mp4: '/posters/test.mp4' }` on one case, the Network tab must show the file requested only when the card scrolls near the viewport.
- All content strings come from `data/`.

- [ ] **Step 5: Commit**

```bash
git add scripts
git commit -m "chore: add font-size audit script"
```

---

## Self-review

**Spec coverage:** tokens (T2), content (T3), primitives (T4), logo (T5), header/footer/glow/reveal (T6), poster + lazy video (T7), hero reel with hover-expand, auto-rotation and mobile carousel (T8), cases grid with sizes and Huawei line, CTA band with inverse button (T9), services with four live visuals (T10–T12), why + ecosystem (T13), pinned process with GSAP and mobile snap (T14), contact + form + Telegram route (T15), floating CTA and mobile bar (T16), mobile pass and metadata (T17), readiness criteria incl. three-font-size check (T18). Deferred by spec: EN routing, real videos, exit-intent banner, analytics, deploy.

**Type consistency:** `ICase.video` matches `Poster` usage; `LeadSource` is shared between the schema, `LeadForm`, `FloatingCta` (`'floating'`) and the route; `useInView` generic signature is used identically in `Poster`, `PromptDemo`, `RosatomLazy`; `BaseButton` accepts `onClick`/`tabIndex` via spread props for both anchor and button forms; `ServiceVisual` switch covers all four `ServiceVisual` kinds after Tasks 11–12.
