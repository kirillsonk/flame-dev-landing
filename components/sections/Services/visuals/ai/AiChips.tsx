import clsx from 'clsx';
import styles from './AiChips.module.scss';

export interface AiChipsProps {
  /** Подпись группы для скринридера. */
  label: string;
  /** Видимая подпись перед чипами («Например:»). */
  prefix?: string;
  items: string[];
  /** Выбранный чип; без него чипы работают как обычные кнопки-примеры. */
  selected?: number;
  variant?: 'outline' | 'solid';
  disabled?: boolean;
  className?: string;
  onSelect: (index: number) => void;
}

// Чипы готовых примеров и переключатели (формат, стиль) во всех AI-демо.
const AiChips = ({
  label,
  prefix,
  items,
  selected,
  variant = 'outline',
  disabled,
  className,
  onSelect,
}: AiChipsProps) => (
  <div className={clsx(styles.aiChips, className)} role="group" aria-label={label}>
    {prefix && <span className={styles.aiChips__prefix}>{prefix}</span>}
    {items.map((item, index) => (
      <button
        key={item}
        type="button"
        className={clsx(styles.aiChips__chip, styles[`aiChips__chip--${variant}`])}
        aria-pressed={selected === undefined ? undefined : selected === index}
        disabled={disabled}
        onClick={() => onSelect(index)}
      >
        {item}
      </button>
    ))}
  </div>
);

export default AiChips;
