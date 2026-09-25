import HeroOverlay from '@/components/sections/Hero/HeroOverlay';
import Cases from '@/components/sections/Cases/Cases';
import CtaChat from '@/components/sections/CtaBand/CtaChat';
import ServicesPlayer from '@/components/sections/Services/ServicesPlayer';
import ProcessTerminal from '@/components/sections/Process/ProcessTerminal';
import ContactChat from '@/components/sections/Contact/ContactChat';
import HomeTransition from '@/components/sections/HomeTransition/HomeTransition';

// Секции главной. Первый экран с промо-роликом во весь экран переходит в кейсы «зумом и размытием»
// (вариант 4, см. useHomeTransition).
const Home = () => {
  return (
    <>
      <HomeTransition variant={4}>
        <HeroOverlay />
        <Cases />
      </HomeTransition>
      <CtaChat />
      <ServicesPlayer />
      <ProcessTerminal />
      <ContactChat />
    </>
  );
};

export default Home;
