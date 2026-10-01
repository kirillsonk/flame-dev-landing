import type { Metadata } from 'next';
import Home from '@/components/sections/Home/Home';

export const metadata: Metadata = { alternates: { canonical: '/' } };

const HomePage = () => {
  return (
    <main>
      <Home />
    </main>
  );
};

export default HomePage;
