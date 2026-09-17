import Services from './Services';
import ServicesPlayer from './ServicesPlayer';
import type { ServicesVariant } from './variants';
import type { IServiceDemoVariants } from './visuals/ServiceVisual';

export interface ServicesSectionProps {
  variant: ServicesVariant;
  demos: IServiceDemoVariants;
}

const VARIANTS: Record<ServicesVariant, (props: { demos: IServiceDemoVariants }) => React.JSX.Element> = {
  player: ServicesPlayer,
  current: Services,
};

// Блок «Что мы делаем»; вариант выбирается меню вариантов в углу экрана (data/variants.ts).
const ServicesSection = ({ variant, demos }: ServicesSectionProps) => {
  const Variant = VARIANTS[variant];
  return <Variant demos={demos} />;
};

export default ServicesSection;
