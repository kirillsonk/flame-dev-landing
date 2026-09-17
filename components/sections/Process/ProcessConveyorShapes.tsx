import ProcessGradient from './ProcessGradient';
import styles from './ProcessConveyor.module.scss';

const GRADIENT_ID = 'process-conveyor-gradient';

export interface ProcessConveyorShapesProps {
  /** Какая форма заготовки видна: 0 — пустая, дальше по одной на каждый пресс. */
  active: number;
}

// Формы заготовки после каждого пресса: пусто → бриф → вайрфрейм → макет → код → ракета.
const ProcessConveyorShapes = ({ active }: ProcessConveyorShapesProps) => {
  const on = (index: number) => ({ 'data-part': 'shape', 'data-on': index === active || undefined });

  return (
    <>
      <svg className={styles.conveyor__shape} viewBox="0 0 120 90" {...on(0)}>
        <rect x="6" y="4" width="108" height="82" rx="6" className={styles.conveyor__line} strokeDasharray="5 5" />
      </svg>
      <svg className={styles.conveyor__shape} viewBox="0 0 120 90" {...on(1)}>
        <rect x="22" y="2" width="76" height="86" rx="4" className={styles.conveyor__paper} />
        <rect x="32" y="14" width="40" height="5" rx="2" className={styles.conveyor__ink} />
        <rect x="32" y="28" width="56" height="3" rx="1.5" className={styles.conveyor__dim} />
        <rect x="32" y="36" width="50" height="3" rx="1.5" className={styles.conveyor__dim} />
        <rect x="32" y="44" width="54" height="3" rx="1.5" className={styles.conveyor__dim} />
        <rect x="32" y="58" width="6" height="6" rx="1" className={styles.conveyor__blue} />
        <rect x="42" y="60" width="30" height="3" rx="1.5" className={styles.conveyor__dim} />
        <rect x="32" y="70" width="6" height="6" rx="1" className={styles.conveyor__blue} />
        <rect x="42" y="72" width="24" height="3" rx="1.5" className={styles.conveyor__dim} />
      </svg>
      <svg className={styles.conveyor__shape} viewBox="0 0 120 90" {...on(2)}>
        <rect x="4" y="4" width="112" height="82" rx="5" className={styles.conveyor__wire} />
        <rect x="12" y="11" width="96" height="8" rx="2" className={styles.conveyor__wire} />
        <rect x="12" y="25" width="96" height="32" rx="2" className={styles.conveyor__wire} />
        <path d="M12 25L108 57M108 25L12 57" className={styles.conveyor__wire} opacity=".5" />
        <rect x="12" y="63" width="29" height="16" rx="2" className={styles.conveyor__wire} />
        <rect x="45.5" y="63" width="29" height="16" rx="2" className={styles.conveyor__wire} />
        <rect x="79" y="63" width="29" height="16" rx="2" className={styles.conveyor__wire} />
      </svg>
      <svg className={styles.conveyor__shape} viewBox="0 0 120 90" {...on(3)}>
        <defs>
          <ProcessGradient id={GRADIENT_ID} from={0.3} />
        </defs>
        <rect x="4" y="4" width="112" height="82" rx="5" className={styles.conveyor__surface} />
        <rect x="12" y="11" width="18" height="6" rx="2" className={styles.conveyor__paper} />
        <rect x="80" y="11" width="28" height="6" rx="3" className={styles.conveyor__blue} />
        <rect x="12" y="25" width="96" height="32" rx="3" fill={`url(#${GRADIENT_ID})`} />
        <rect x="18" y="33" width="44" height="6" rx="2" className={styles.conveyor__paper} />
        <rect x="18" y="43" width="28" height="4" rx="2" className={styles.conveyor__paper} opacity=".6" />
        <rect x="12" y="63" width="29" height="16" rx="3" className={styles.conveyor__dim} opacity=".5" />
        <rect x="45.5" y="63" width="29" height="16" rx="3" className={styles.conveyor__dim} opacity=".5" />
        <rect x="79" y="63" width="29" height="16" rx="3" className={styles.conveyor__dim} opacity=".5" />
      </svg>
      <svg className={styles.conveyor__shape} viewBox="0 0 120 90" {...on(4)}>
        <rect x="4" y="4" width="112" height="82" rx="5" className={styles.conveyor__screen} />
        <circle cx="13" cy="12" r="2.5" className={styles.conveyor__fire} />
        <circle cx="21" cy="12" r="2.5" className={styles.conveyor__dim} />
        <circle cx="29" cy="12" r="2.5" className={styles.conveyor__dim} />
        <path d="M26 34l-10 11 10 11M94 34l10 11-10 11M66 30L54 60" className={styles.conveyor__code} />
        <rect x="16" y="70" width="30" height="3" rx="1.5" className={styles.conveyor__blue} />
        <rect x="50" y="70" width="46" height="3" rx="1.5" className={styles.conveyor__dim} />
      </svg>
      <svg className={styles.conveyor__shape} viewBox="0 0 120 90" {...on(5)}>
        <path d="M60 4c14 10 20 26 18 46l-6 14H48l-6-14C40 30 46 14 60 4z" className={styles.conveyor__paper} />
        <circle cx="60" cy="32" r="7" className={styles.conveyor__blue} />
        <path d="M42 48L30 62l14 2zM78 48l12 14-14 2z" className={styles.conveyor__cyan} />
        <path d="M50 66h20l-4 10-6 12-6-12z" className={styles.conveyor__fire} />
      </svg>
    </>
  );
};

export default ProcessConveyorShapes;
