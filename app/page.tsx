import Poster from '@/components/ui/Poster/Poster';
import { CASES } from '@/data/cases';

const HomePage = () => {
  return (
    <main style={{ padding: '4rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.4rem' }}>
      {CASES.map((c) => (
        <div key={c.slug} style={{ aspectRatio: '3 / 2' }}>
          <Poster item={c} />
        </div>
      ))}
    </main>
  );
};

export default HomePage;
