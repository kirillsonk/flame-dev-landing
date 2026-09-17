import Ecosystem from './Ecosystem';
import EcosystemCredits from './EcosystemCredits';
import EcosystemMarquee from './EcosystemMarquee';
import EcosystemTokens from './EcosystemTokens';
import type { EcosystemVariant } from './variants';

export interface EcosystemSectionProps {
  variant: EcosystemVariant;
}

const VARIANTS: Record<EcosystemVariant, () => React.JSX.Element> = {
  marquee: EcosystemMarquee,
  credits: EcosystemCredits,
  tokens: EcosystemTokens,
  current: Ecosystem,
};

// Блок «Flame — это ещё и»; вариант выбирается меню вариантов в углу экрана (data/variants.ts).
const EcosystemSection = ({ variant }: EcosystemSectionProps) => {
  const Variant = VARIANTS[variant];
  return <Variant />;
};

export default EcosystemSection;
