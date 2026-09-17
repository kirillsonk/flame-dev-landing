export interface ProcessGradientProps {
  id: string;
  /** Где начинается переход из синего в голубой, 0…1. */
  from?: number;
}

// Градиент действия Flame для штрихов SVG: цвета берутся из токенов.
const ProcessGradient = ({ id, from = 0.55 }: ProcessGradientProps) => {
  return (
    <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
      <stop offset={from} style={{ stopColor: 'var(--color-action-primary)' }} />
      <stop offset="1" style={{ stopColor: 'var(--color-action-accent)' }} />
    </linearGradient>
  );
};

export default ProcessGradient;
