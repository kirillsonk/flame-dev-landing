import clsx from 'clsx';
import type { AiTone } from '@/data/demosAi';
import tones from './AiTones.module.scss';
import styles from './AiField.module.scss';

export interface AiFieldProps {
  name: string;
  value: string;
  tone?: AiTone;
  /** Поле связано с подсвеченной фразой или рамкой. */
  hot?: boolean;
  /** Поле не найдено — значение-заглушка приглушено. */
  empty?: boolean;
  /** Поле ещё не извлечено: скрыто и проявится анимацией. */
  hidden?: boolean;
  onHover?: (on: boolean) => void;
}

// Строка извлечённого поля (CRM, реквизиты документа) с цветной меткой слева.
const AiField = ({ name, value, tone, hot, empty, hidden, onHover }: AiFieldProps) => (
  <div
    className={clsx(
      styles.aiField,
      tone && !empty && tones[`tone--${tone}`],
      hot && styles['aiField--hot'],
      empty && styles['aiField--empty'],
      hidden && styles['aiField--hidden'],
    )}
    tabIndex={onHover && !empty ? 0 : undefined}
    onMouseEnter={onHover && (() => onHover(true))}
    onMouseLeave={onHover && (() => onHover(false))}
    onFocus={onHover && (() => onHover(true))}
    onBlur={onHover && (() => onHover(false))}
  >
    <span className={styles.aiField__name}>{name}</span>
    <b className={clsx(styles.aiField__value, empty && styles['aiField__value--empty'])}>{value}</b>
  </div>
);

export default AiField;
