import Home from '@/components/sections/Home/Home';
import { SHOW_VARIANT_PANEL } from '@/components/layout/VariantPanel/variantStore';

const HomePage = () => {
  return (
    <main>
      <Home variantPanel={SHOW_VARIANT_PANEL} />
    </main>
  );
};

export default HomePage;
