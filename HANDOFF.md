# HANDOFF
updated: 2026-10-07 15:30 МСК | agent: Claude Code | branch: dev

## Сейчас
- Production flamedev.pro = `main` = `8146377`, в `dev` сверху только этот HANDOFF. Незавершенной работы нет
- `dev` для правок, `main` деплоится в production и обновляется только по «пушим в main» от владельца
- Remote `github` основной, `origin` (GitLab) не используется. На github есть старая ветка `codex/workflow-and-site-audit`

## Последняя сессия
- Тема без ручного выбора: темная при темной теме устройства, иначе по восходу и закату (`lib/theme.ts`, `AutoTheme`)
- SEO: robots, sitemap, canonical, www → flamedev.pro, `public/og.png`, schema.org, «ИИ» и «нейросети» в метаданных, хуки кодов Вебмастера и Search Console. Детали в `doc/SEO_2026-10-01.md`
- Кейсы: у 29 страниц заголовок, пара строк и «Что сделали» (`data/caseStories.ts`), первый тег задает фильтр каталога
- Метрика грузит tag.js после затишья, «Тинькофф» → «Т-Банк» с редиректом, новые ролики Amatour и Flame AI
- Стекло в Chrome: не писать `-webkit-backdrop-filter` вручную. Автодеплой ретранслятора выключен

## Дальше
- Владелец: Яндекс Вебмастер и Search Console, sitemap, Яндекс Бизнес, цели Метрики в интерфейсе
- SEO-рост: страницы услуг (сайты, веб-сервисы, спецпроекты, ИИ-решения) со своими кейсами
- Общий ретранслятор для Flame dev и «Сборки» делает другой агент в репозитории `ai-relay`. После переезда (смена `RELAY_URL`) удалить `relay/` и обновить правило о ретрансляторе в CLAUDE.md, AGENTS.md, doc/WORKFLOW.md
- Реквизиты оператора в `data/legal.ts` (`LEGAL_OPERATOR`), уведомление в РКН
- Рассылка клиентам готовится в отдельном чате

## Известные проблемы
- Из-за рубежа сайт открывается с перебоями (сеть до МСК, сервер здоров). Риск для индексации Google, лечится CDN с зарубежными узлами, ждет решения владельца
- Timeweb: открытая авария 757 по дискам в МСК
- В логах сканеры шлют `Server Reference ID ... "x"`, на работу не влияет
- Ретранслятор не обрывает запрос к OpenAI, если сайт перестал ждать
- Локально /api/brief отвечает 503 без ключей, бриф работает черновиком, это ожидаемо
- В скрытой панели браузера агента rAF, IntersectionObserver и видео на паузе

## Деплой
- Сайт: Timeweb App Platform `flamedev-site` (262653, ru-3), Dockerfile, автодеплой из `main` за 2–5 минут. Переменные: `RELAY_URL`, `RELAY_SECRET`, `OPENAI_MODEL`, опционально `YANDEX_VERIFICATION`, `GOOGLE_SITE_VERIFICATION`
- Ретранслятор: `flamedev-relay` (262633, nl-1), папка `relay/`, деплой вручную. Переменные: `RELAY_SECRET`, `OPENAI_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- Домен у Porkbun, почта start@flamedev.pro пересылается на Яндекс
- Перед передачей: `npm run check`, просмотр на 1440 и 390, локально `http://localhost:3101/`
- Статус и логи через Timeweb MCP. Заявки на проде проверять только когда нужный деплой уже работает

## Журнал
- 2026-10-07 | Claude Code | dev | HANDOFF.md и правило AI-Sync
- 2026-10-01 | Claude Code | main | тема по устройству и солнцу
- 2026-10-01 | Claude Code | main | SEO: ключевые слова, og.png, schema.org
- 2026-10-01 | Claude Code | main | «Что сделали», теги, cookie над мобильной кнопкой
- 2026-10-01 | Claude Code | main | заголовки кейсов, robots, sitemap, редирект www
- 2026-10-01 | Claude Code | main | «Flame | проект» во вкладке, ручной деплой ретранслятора
- 2026-10-01 | Claude Code | main | описания для 29 кейсов
- 2026-10-01 | Claude Code | main | ролики Amatour и Flame AI
- 2026-09-30 | Claude Code | main | «Т-Банк» с редиректом
- 2026-09-30 | Claude Code | main | отложенная Метрика, бургер без задержки
- 2026-09-30 | Claude Code | main | стекло в Chrome, документы в подвале
- 2026-09-30 | Claude Code | main | названия проектов на орбите
- 2026-09-30 | Claude Code | main | видео в галерее, быстрый AI-бриф
- 2026-09-30 | Claude Code | main | юридические документы, тема по времени
- 2026-09-30 | Claude Code | main | плашка cookie, стекло шапки
