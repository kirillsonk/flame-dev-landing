import { useEffect, useState } from 'react';
import { HERO_VARIANTS } from '@/data/studio';

export type HeroVariant = (typeof HERO_VARIANTS)[number]['value'];

export interface IUseHeroVariant {
  variant: HeroVariant;
  select: (value: HeroVariant) => void;
}

const STORAGE_KEY = 'flame-dev:hero-variant';
const CHANGE_EVENT = 'flame-dev:hero-variant-change';
const DEFAULT_VARIANT: HeroVariant = 'portal';

// Переключатель нужен только для ревью: в продакшене первый экран всегда вариант по умолчанию
export const SHOW_HERO_SWITCH = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_REVIEW === '1';

const read = (): HeroVariant => {
  if (!SHOW_HERO_SWITCH) return DEFAULT_VARIANT;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return HERO_VARIANTS.find(item => item.value === stored)?.value ?? DEFAULT_VARIANT;
  } catch {
    return DEFAULT_VARIANT;
  }
};

// Сервер отдает вариант по умолчанию, сохраненный выбор применяется после гидрации
const useHeroVariant = (): IUseHeroVariant => {
  const [variant, setVariant] = useState<HeroVariant>(DEFAULT_VARIANT);

  useEffect(() => {
    const sync = () => setVariant(read());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    return () => window.removeEventListener(CHANGE_EVENT, sync);
  }, []);

  const select = (value: HeroVariant) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Хранилище недоступно: выбор живет до перезагрузки
    }
    setVariant(value);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return { variant, select };
};

export default useHeroVariant;
