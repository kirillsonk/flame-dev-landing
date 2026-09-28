<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CLAUDE.md

These rules apply to Claude work in this repository.

## Project

Flame Dev — одностраничный сайт-визитка команды разработки внутри Flame.
Источники истины: `doc/flame-dev-spec.md` (ТЗ), `doc/2026-09-10-flame-dev-site-design.md`
(дизайн-спека: токены, компоненты, секции, контент), `doc/2026-09-10-flame-dev-site-plan.md`
(план сборки). Макетов в Figma нет — раскладка по вайрфрейму, решения принимаются в браузере.

Тексты и тон: `BRAND.md` (ядро бренда, ToV, правила письма — постоянный документ) и
`doc/FLAME_DEV_WEBSITE_COPY.md` (рабочий копирайт сайта; блоки «Комментарий для Влада» на сайт не выводятся).
Любой новый текст на сайте — по правилам `BRAND.md`: только «е» без «ё», без точки в конце абзаца,
пункта, заголовка, подписи и кнопки, без декоративных тире, минимум двоеточий.

## Stack

- Next.js App Router (16.x, Turbopack), React 19, TypeScript, npm.
- SCSS Modules (`sass`), без Tailwind. Шрифт TTFirsNeue через `next/font/local`, переменная `--font`.
- Состояние — `useState`/хуки, без MobX/Redux. Данные — нет бэкенда, только `app/api/lead` → Telegram.
- Формы — Formik + Yup, схема в соседнем `*.validationSchema.ts`.
- Анимация по уровням: 1) `IntersectionObserver` + CSS (`data-reveal`, ховеры, полосы hero);
  2) GSAP ScrollTrigger только для pinned-секций «Процесс», «Кейсы» (бегущие строки), первого экрана
  и смены визуалов в «Что мы делаем»; 3) vanilla Three.js в обычном классе
  только для 3D-объекта Росатома, чанк через `next/dynamic` с `ssr: false`.
- Не тащить framer-motion, swiper, react-hook-form, zod, react-three-fiber, аналитику.

## Structure

- `app/` — layout, page, `globals.scss` (reset, `:root` токены, fluid rem), `api/lead/route.ts`.
- `components/ui/Base*` — примитивы кита; `components/layout/` — Header, Footer, PageGlow,
  RevealController; `components/sections/` — секции страницы 01–07; `components/cta/` — преследующий CTA.
- `data/*.ts` — весь контент (кейсы, услуги, процесс, навигация). Строки не живут в JSX.
- `hooks/` — общие хуки (`useInView`); локальные хуки — в `hooks/` рядом с компонентом.
- `styles/_typography.scss`, `styles/_mixins.scss` — миксины; модули импортируют их относительным
  путём `@use '../../../styles/typography' as *;` (модули лежат на глубине 3).

## Naming & Component Structure (TS/TSX)

- Компонент = имя файла, PascalCase, стрелочная функция, `export default X;` отдельной строкой внизу.
- Интерфейс пропсов — `{ComponentName}Props` (без `I`). Любой другой интерфейс — `I{Name}`.
- Хук — `use{Name}` = имя файла, возвращает объект, `export default`.
- Импорт стилей — всегда `import styles from './{ComponentName}.module.scss'`.
- Алиас `@/*` обязателен, без `../../..` в TS.

## Styling / SCSS

- Базовый rem фиксирован через `html { font-size: 62.5% }`, основной текст 1.6rem
  Не уменьшать всю страницу пропорционально ширине окна, это делает текст нечитаемым на планшетах
  Адаптация структуры через миксин `mobile` до 900px, размеры через rem и токены
- Ровно три размера шрифта: миксины `text-display` (48/36), `text-title` (24), `text-body` (16).
  Промежуточных размеров не заводить.
- Цвета и размеры — только через `var(--…)` из `:root`. Локальные computed-значения — как
  `--size` внутри класса, не дублировать блок по вариантам.
- Плоский BEM: `.caseCard__poster`, `.button--primary` — каждый класс явно на верхнем уровне.
  Никаких `&__`/`&--`. `&` только для `&:hover`, `&::after`, `&:focus-visible`.
- Медиа-запросы внутри компонентов — только для структурных изменений, через миксин `mobile`.

## Dependencies

- Перед тем как писать утилиту руками, проверить `package.json` и npm. Второй пакет под ту же
  задачу не ставить (`clsx` уже есть для классов, `yup` для валидации).
- Новую зависимость — только если она дешевле кастомного кода и не раздувает бандл.

## Tests

- Тесты на лендинге не нужны. Не добавлять без явной просьбы. Проверка задачи —
  `npm run build && npm run lint && npm run typecheck` плюс просмотр в браузере на 1440 и 390.

## Output

At the end, report briefly:
- what changed
- why it changed
- files touched
- remaining risks or assumptions

## Current direction and shared workflow

Перед работой прочитать `BRAND.md`, `doc/FLAME_DEV_WEBSITE_COPY.md` и `doc/WORKFLOW.md`

Актуальный аудит и предложения следующей итерации находятся в `doc/SITE_AUDIT_2026-09-25.md`

Аудит задает направление следующих изменений, но не означает, что редизайн уже реализован

GitLab остается основным репозиторием, GitHub хранит ту же историю отдельным remote

Не выполнять force push и не перезаписывать работу другого агента

Для одновременной работы Codex и Claude использовать разные ветки и worktree

Тексты подчиняются `BRAND.md`, редакционные комментарии не выводятся на сайт

Сохраняем выразительный интерактивный характер Flame Dev, серую базу и синий акцент

Актуальное решение от 28 сентября: вернуть интерактивные демо и выразительную анимацию фона при прокрутке, сохранить новую сетку кейсов

Не превращать сайт в статичный шаблон и не переносить решения других брендов

Фон реагирует на прокрутку, останавливается в покое, учитывает prefers-reduced-motion

Новые pinned-секции не добавлять, упрощение существующих выполнять в рамках визуальной задачи

Целевой хостинг рабочей версии для просмотра выбран Sites на домене ChatGPT, Railway в этой итерации не подключаем
