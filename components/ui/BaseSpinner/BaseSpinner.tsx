import clsx from 'clsx';
import styles from './BaseSpinner.module.scss';

export interface BaseSpinnerProps {
  className?: string;
}

// Небольшой индикатор ожидания для кнопок и подсказок: дуга с фирменным градиентом, размер задает родитель через font-size
const BaseSpinner = ({ className }: BaseSpinnerProps) => <span className={clsx(styles.spinner, className)} aria-hidden="true" />;

export default BaseSpinner;
