import Hero from '@/components/sections/Hero/Hero';
import Cases from '@/components/sections/Cases/Cases';
import CtaBand from '@/components/sections/CtaBand/CtaBand';
import Services from '@/components/sections/Services/Services';
import Why from '@/components/sections/Why/Why';
import Process from '@/components/sections/Process/Process';
import Ecosystem from '@/components/sections/Ecosystem/Ecosystem';
import Contact from '@/components/sections/Contact/Contact';

const HomePage = () => {
  return (
    <main>
      <Hero />
      <Cases />
      <CtaBand />
      <Services />
      <Why />
      <Process />
      <Ecosystem />
      <Contact />
    </main>
  );
};

export default HomePage;
