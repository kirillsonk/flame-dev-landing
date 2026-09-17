import { useSyncExternalStore } from 'react';
import { VARIANTS_EVENT, VARIANTS_STORAGE_KEY } from '../variantStore';

export interface IUseStoredVariant {
  /** Сохранённое значение группы; `undefined` — вариант по умолчанию. */
  value: string | undefined;
}

const subscribe = (onChange: () => void) => {
  window.addEventListener(VARIANTS_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(VARIANTS_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
};

// Хранилище читается, только если меню включено: layout помечает это атрибутом на <html>.
const readValue = (groupId: string): string | undefined => {
  if (!document.documentElement.hasAttribute('data-variant-panel')) return undefined;
  try {
    const raw: unknown = JSON.parse(window.localStorage.getItem(VARIANTS_STORAGE_KEY) ?? 'null');
    const value = raw && typeof raw === 'object' ? (raw as Record<string, unknown>)[groupId] : undefined;
    return typeof value === 'string' ? value : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Вариант блока для компонентов вне Home (шапка, подвал, кнопки CTA).
 * Сервер и первая гидрация отдают вариант по умолчанию, сохранённый выбор приходит следом.
 */
const useStoredVariant = (groupId: string): IUseStoredVariant => {
  const value = useSyncExternalStore(subscribe, () => readValue(groupId), () => undefined);
  return { value };
};

export default useStoredVariant;
