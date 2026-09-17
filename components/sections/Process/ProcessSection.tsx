import Process from './Process';
import ProcessBezel from './ProcessBezel';
import ProcessConveyor from './ProcessConveyor';
import ProcessGantt from './ProcessGantt';
import ProcessOdometer from './ProcessOdometer';
import ProcessRoute from './ProcessRoute';
import ProcessStopwatch from './ProcessStopwatch';
import ProcessTerminal from './ProcessTerminal';
import ProcessTimeline from './ProcessTimeline';
import type { ProcessVariant } from './variants';

export interface ProcessSectionProps {
  variant: ProcessVariant;
}

const VARIANTS: Record<ProcessVariant, () => React.JSX.Element> = {
  route: ProcessRoute,
  odometer: ProcessOdometer,
  bezel: ProcessBezel,
  gantt: ProcessGantt,
  conveyor: ProcessConveyor,
  terminal: ProcessTerminal,
  stopwatch: ProcessStopwatch,
  timeline: ProcessTimeline,
  current: Process,
};

// Блок «Как проходит проект»; вариант выбирается меню вариантов в углу экрана (data/variants.ts).
const ProcessSection = ({ variant }: ProcessSectionProps) => {
  const Variant = VARIANTS[variant];
  return <Variant />;
};

export default ProcessSection;
