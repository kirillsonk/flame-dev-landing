import { useEffect, useRef, useState, useTransition } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VARIANT_GROUPS } from '@/data/variants';
import type { IVariantGroup } from '@/data/types';
import { VARIANTS_EVENT, VARIANTS_STORAGE_KEY } from '../variantStore';

/** Выбранные варианты по ключу группы; отсутствие ключа — вариант по умолчанию. */
export type VariantValues = Record<string, string | undefined>;

export interface IUseVariants {
  values: VariantValues;
  /** Страница собирается заново после выбора. */
  pending: boolean;
  select: (group: IVariantGroup, value: string) => void;
  reset: () => void;
}

// Из хранилища берутся только известные группы и только их значения: чужой мусор не пройдёт.
const readValues = (): VariantValues => {
  try {
    const raw: unknown = JSON.parse(window.localStorage.getItem(VARIANTS_STORAGE_KEY) ?? 'null');
    if (!raw || typeof raw !== 'object') return {};
    const stored = raw as Record<string, unknown>;
    const values: VariantValues = {};
    VARIANT_GROUPS.forEach((group) => {
      const value = stored[group.id];
      if (typeof value === 'string' && group.options.some((option) => option.value === value)) values[group.id] = value;
    });
    return values;
  } catch {
    return {};
  }
};

const saveValues = (values: VariantValues) => {
  try {
    if (Object.keys(values).length) window.localStorage.setItem(VARIANTS_STORAGE_KEY, JSON.stringify(values));
    else window.localStorage.removeItem(VARIANTS_STORAGE_KEY);
  } catch {
    // Хранилище недоступно (приватный режим): выбор живёт до перезагрузки.
  }
  window.dispatchEvent(new Event(VARIANTS_EVENT));
};

/**
 * Выбор вариантов блоков живёт в состоянии клиента и в localStorage, а не в адресе:
 * сервер всегда отдаёт варианты по умолчанию, сохранённый выбор применяется после гидрации.
 * Без меню (`enabled` = false) хранилище не читается — страница остаётся такой, как пришла.
 */
const useVariants = (enabled: boolean): IUseVariants => {
  const [values, setValues] = useState<VariantValues>({});
  const [pending, startTransition] = useTransition();
  // Позиция прокрутки до переключения: пока страница собирается заново, пинов ещё нет,
  // документ короче, и браузер прижимает прокрутку к новому низу.
  const restoreTo = useRef<number | null>(null);
  // Дерево пересобирается: после коммита отметки пинов нужно пересчитать.
  const rebuilt = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const saved = readValues();
    if (!Object.keys(saved).length) return;
    rebuilt.current = true;
    startTransition(() => setValues(saved));
  }, [enabled]);

  // Переход завершён — новое дерево смонтировано и завело свои пины. Все отметки пересчитываются
  // уже по готовой странице, затем возвращаем прокрутку туда, где был человек.
  useEffect(() => {
    if (pending || !rebuilt.current) return;
    rebuilt.current = false;
    const top = restoreTo.current;
    restoreTo.current = null;
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (top !== null) window.scrollTo({ top, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pending]);

  const apply = (next: VariantValues) => {
    saveValues(next);
    restoreTo.current = window.scrollY;
    rebuilt.current = true;
    startTransition(() => setValues(next));
  };

  const select = (group: IVariantGroup, value: string) => {
    const next = { ...values };
    if (value === group.fallback) delete next[group.id];
    else next[group.id] = value;
    apply(next);
  };

  const reset = () => apply({});

  return { values, pending, select, reset };
};

export default useVariants;
