// Меню видно в деве; на стенде включается переменной окружения VARIANT_PANEL=1.
export const SHOW_VARIANT_PANEL = process.env.NODE_ENV !== 'production' || process.env.VARIANT_PANEL === '1';

export const VARIANTS_STORAGE_KEY = 'flame-dev:variants';

// Шапка, подвал и кнопки живут вне Home: о новом выборе они узнают по этому событию.
export const VARIANTS_EVENT = 'flame-dev:variants-change';
