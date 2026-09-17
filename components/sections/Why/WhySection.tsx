import Why from './Why';
import WhyChord from './WhyChord';
import WhyDrops from './WhyDrops';
import WhyEquation from './WhyEquation';
import WhyLayers from './WhyLayers';
import WhyOrbits from './WhyOrbits';
import WhyPuzzle from './WhyPuzzle';
import WhySpotlights from './WhySpotlights';
import WhyVenn from './WhyVenn';
import type { WhyVariant } from './variants';

export interface WhySectionProps {
  variant: WhyVariant;
}

const VARIANTS: Record<WhyVariant, () => React.JSX.Element> = {
  venn: WhyVenn,
  equation: WhyEquation,
  puzzle: WhyPuzzle,
  spotlights: WhySpotlights,
  drops: WhyDrops,
  chord: WhyChord,
  orbits: WhyOrbits,
  layers: WhyLayers,
  current: Why,
};

// Блок «Один подрядчик вместо трёх»; вариант выбирается меню вариантов в углу экрана (data/variants.ts).
const WhySection = ({ variant }: WhySectionProps) => {
  const Variant = VARIANTS[variant];
  return <Variant />;
};

export default WhySection;
