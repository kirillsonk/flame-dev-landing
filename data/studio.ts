export const STUDIO = {
  eyebrow: 'Сайты · Сервисы · Спецпроекты · AI',
  title: ['Разработка', 'под задачи', 'бизнеса'],
  text: 'Разрабатываем сайты, сервисы и AI-продукты',
  feature: { select: 'Показать проект' },
  cases: { eyebrow: 'Портфолио', title: 'Наши проекты', text: 'Спецпроекты, цифровые платформы и инструменты для бизнеса', all: 'Все проекты' },
  services: { eyebrow: 'Примеры решений', title: 'Что можем разработать', link: 'Обсудить задачу' },
  process: { eyebrow: 'Подход', title: 'Этапы работы' },
  contact: { eyebrow: 'Начнем с задачи', title: 'Расскажите\nо задаче', brief: 'Вернуться к вопросам', direct: 'У меня уже есть ТЗ', link: 'hello@flame.dev' },
};
export const HERO_CASES = ['rosatom', 'tibia', 'amatour', 'coca-cola-delivery-club', 'flame-ai', 'purina-vk'];
export const FEATURED_CASES = ['tibia', 'amatour', 'rosatom', 'coca-cola-delivery-club', 'flame-ai', 'purina-vk'];
export const CASE_TYPES: Record<string, string> = {
  tibia: 'Система учета и логистики',
  amatour: 'Платформа теннисных турниров',
  rosatom: 'Интерактивный 3D-проект',
  'coca-cola-delivery-club': 'Мини-игры в приложении',
  'flame-ai': 'AI-платформа для создания видео',
  'purina-vk': 'Мини-приложение VK',
};
export const CASE_CAPTIONS: Record<string, string> = {
  tibia: 'Маркировка, логистика и работа со сканирующими терминалами',
  amatour: 'Турниры, рейтинги и личные кабинеты в одной платформе',
  rosatom: '3D и интерактив для проекта «Умный атом»',
  'coca-cola-delivery-club': 'Игровая механика внутри приложения Delivery Club',
  'flame-ai': 'Продукт для генерации рекламных видео с AI',
  'purina-vk': 'Сайт, мини-приложение и карта pet-friendly городов',
};

// Варианты первого экрана для ревью: переключатель виден в деве и в сборке с NEXT_PUBLIC_REVIEW=1
export const HERO_VARIANTS = [
  { value: 'portal', label: 'Портал' },
  { value: 'orbit', label: 'Созвездие' },
  { value: 'full', label: 'Во весь экран' },
] as const;
export const HERO_STAGE = {
  switchLabel: 'Первый экран',
  reelLabel: 'Шоурил проектов',
  open: 'Открыть проект',
};
