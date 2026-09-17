import TibiaTable from '@/components/sections/Services/visuals/TibiaTable';
import TibiaConveyor from './TibiaConveyor';
import TibiaPassport from './TibiaPassport';
import TibiaReport from './TibiaReport';
import TibiaScanner from './TibiaScanner';
import TibiaSearch from './TibiaSearch';
import type { TibiaDemoVariant } from './variants';

export interface TibiaDemoProps {
  variant: TibiaDemoVariant;
}

const VARIANTS: Record<TibiaDemoVariant, () => React.JSX.Element> = {
  scanner: TibiaScanner,
  passport: TibiaPassport,
  conveyor: TibiaConveyor,
  search: TibiaSearch,
  report: TibiaReport,
  current: TibiaTable,
};

// Демо «Учёт» (Tibia) в блоке «Что мы делаем»; вариант выбирается меню вариантов (data/variants.ts).
const TibiaDemo = ({ variant }: TibiaDemoProps) => {
  const Variant = VARIANTS[variant];
  return <Variant />;
};

export default TibiaDemo;
