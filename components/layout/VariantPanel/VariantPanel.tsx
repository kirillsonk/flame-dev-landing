'use client';

import clsx from 'clsx';
import BaseIcon from '@/components/ui/BaseIcon/BaseIcon';
import { VARIANT_GROUPS, VARIANT_PANEL_RESET, VARIANT_PANEL_TITLE } from '@/data/variants';
import type { IVariantGroup } from '@/data/types';
import useVariantPanel from './hooks/useVariantPanel';
import type { VariantValues } from './hooks/useVariants';
import styles from './VariantPanel.module.scss';

export interface VariantPanelProps {
  /** Текущий выбор по ключам групп (см. useVariants). */
  values: VariantValues;
  /** Страница собирается заново: иконка крутится. */
  pending: boolean;
  onSelect: (group: IVariantGroup, value: string) => void;
  onReset: () => void;
}

// Меню вариантов блоков, как индикатор Next в деве: кружок раскрывается в панель, выбор
// пересобирает страницу без прокрутки наверх. Кружок и заголовок панели перетаскиваются (usePanelDrag).
const VariantPanel = ({ values, pending, onSelect, onReset }: VariantPanelProps) => {
  const { open, rootRef, toggle, onDragStart } = useVariantPanel();

  return (
    <div ref={rootRef} className={clsx(styles.panel, pending && styles['panel--pending'])}>
      {open && (
        <div id="variant-panel" className={styles.panel__sheet} role="dialog" aria-label={VARIANT_PANEL_TITLE}>
          <div className={styles.panel__head} onPointerDown={onDragStart}>
            <span className={styles.panel__title}>{VARIANT_PANEL_TITLE}</span>
            <button type="button" className={styles.panel__reset} onClick={onReset}>
              {VARIANT_PANEL_RESET}
            </button>
          </div>
          <div className={styles.panel__groups}>
            {VARIANT_GROUPS.map((group) => {
              const current = values[group.id] ?? group.fallback;
              return (
                <fieldset key={group.id} className={styles.panel__group}>
                  <legend className={styles.panel__legend}>{group.title}</legend>
                  <div className={styles.panel__options}>
                    {group.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={clsx(styles.panel__option, option.value === current && styles['panel__option--active'])}
                        aria-pressed={option.value === current}
                        onClick={() => onSelect(group, option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              );
            })}
          </div>
        </div>
      )}
      <button
        type="button"
        className={styles.panel__toggle}
        aria-expanded={open}
        aria-controls="variant-panel"
        aria-label={VARIANT_PANEL_TITLE}
        onClick={toggle}
        onPointerDown={onDragStart}
      >
        <BaseIcon name="sliders" className={styles.panel__icon} />
      </button>
    </div>
  );
};

export default VariantPanel;
