'use client';

import useStoredVariant from '@/components/layout/VariantPanel/hooks/useStoredVariant';
import Footer from './Footer';
import FooterCard from './FooterCard';
import FooterChips from './FooterChips';
import FooterColumns from './FooterColumns';
import FooterCurtain from './FooterCurtain';
import { parseFooter, type FooterVariant } from './variants';

const VARIANTS: Record<FooterVariant, () => React.JSX.Element> = {
  current: Footer,
  columns: FooterColumns,
  chips: FooterChips,
  curtain: FooterCurtain,
  card: FooterCard,
};

// Подвал; вариант выбирается меню вариантов в углу экрана (data/variants.ts).
const FooterSection = () => {
  const { value } = useStoredVariant('footer');
  const Variant = VARIANTS[parseFooter(value)];
  return <Variant />;
};

export default FooterSection;
