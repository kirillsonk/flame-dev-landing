import Hero from '@/components/sections/Hero/Hero';
import Cases from '@/components/sections/Cases/Cases';
import CtaBand from '@/components/sections/CtaBand/CtaBand';
import Services from '@/components/sections/Services/Services';

const HomePage = () => {
  return (
    <main>
      <Hero />
      <Cases />
      <CtaBand />
      <Services />
    </main>
  );
};

export default HomePage;
