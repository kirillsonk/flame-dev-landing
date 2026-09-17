import CtaBand from './CtaBand';
import CtaChat from './CtaChat';
import CtaCurve from './CtaCurve';
import CtaDay from './CtaDay';
import CtaInflate from './CtaInflate';
import CtaReel from './CtaReel';
import CtaRoute from './CtaRoute';
import CtaSplit from './CtaSplit';
import type { CtaVariant } from './variants';

export interface CtaSectionProps {
  variant: CtaVariant;
}

const VARIANTS: Record<CtaVariant, () => React.JSX.Element> = {
  band: CtaBand,
  chat: CtaChat,
  day: CtaDay,
  inflate: CtaInflate,
  reel: CtaReel,
  split: CtaSplit,
  curve: CtaCurve,
  route: CtaRoute,
};

// Блок «Есть задача?» после кейсов; вариант выбирается меню вариантов в углу экрана (data/variants.ts).
const CtaSection = ({ variant }: CtaSectionProps) => {
  const Variant = VARIANTS[variant];
  return <Variant />;
};

export default CtaSection;
