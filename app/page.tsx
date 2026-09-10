import Hero from '@/components/sections/Hero/Hero';
import Cases from '@/components/sections/Cases/Cases';
import CtaBand from '@/components/sections/CtaBand/CtaBand';
import Services from '@/components/sections/Services/Services';
import Why from '@/components/sections/Why/Why';
import Ecosystem from '@/components/sections/Ecosystem/Ecosystem';

const HomePage = () => {
  return (
    <main>
      <Hero />
      <Cases />
      <CtaBand />
      <Services />
      <Why />
      <Ecosystem />
    </main>
  );
};

export default HomePage;
