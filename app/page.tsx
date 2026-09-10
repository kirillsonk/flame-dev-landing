import BaseButton from '@/components/ui/BaseButton/BaseButton';
import BaseTag from '@/components/ui/BaseTag/BaseTag';
import BaseInput from '@/components/ui/BaseInput/BaseInput';

const HomePage = () => {
  return (
    <main style={{ padding: '4rem', display: 'grid', gap: '2.4rem', maxWidth: '60rem' }}>
      <BaseButton>Обсудить проект</BaseButton>
      <BaseButton variant="inverse">Inverse</BaseButton>
      <BaseButton variant="chrome">Кейсы</BaseButton>
      <BaseButton variant="ghost">Ghost</BaseButton>
      <BaseButton href="#" size="l">Ссылка L</BaseButton>
      <div style={{ display: 'flex', gap: '0.8rem' }}>
        <BaseTag variant="accent">спецпроект</BaseTag>
        <BaseTag>мини-игры</BaseTag>
      </div>
      <BaseInput name="name" label="Имя" placeholder="Иван" />
      <BaseInput name="message" label="Коротко о задаче" multiline error="Обязательное поле" />
    </main>
  );
};

export default HomePage;
