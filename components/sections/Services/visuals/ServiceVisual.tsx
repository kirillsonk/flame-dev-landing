import type { ServiceVisualKind } from '@/data/types';
import TibiaTable from './TibiaTable';
import PromptDemo from './PromptDemo';
import Match3 from './Match3';

export interface ServiceVisualProps {
  kind: ServiceVisualKind;
}

const ServiceVisual = ({ kind }: ServiceVisualProps) => {
  switch (kind) {
    case 'tibia':
      return <TibiaTable />;
    case 'prompt':
      return <PromptDemo />;
    case 'match3':
      return <Match3 />;
    case 'rosatom':
      return null;
  }
};

export default ServiceVisual;
