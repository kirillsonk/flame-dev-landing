import type { Metadata } from 'next';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { notFound } from 'next/navigation';
import CtaButton from '@/components/cta/CtaButton/CtaButton';
import BaseTag from '@/components/ui/BaseTag/BaseTag';
import Poster from '@/components/ui/Poster/Poster';
import { CASES } from '@/data/cases';
import { CASE_BACK_LABEL, CASE_LIVE_LABEL } from '@/data/site';
import BaseArrow from '@/components/ui/BaseArrow/BaseArrow';
import styles from './page.module.scss';

export interface CasePageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = () => CASES.map((item) => ({ slug: item.slug }));

export const generateMetadata = async ({ params }: CasePageProps): Promise<Metadata> => {
  const { slug } = await params;
  const item = CASES.find((entry) => entry.slug === slug);
  return item ? { title: `${item.title} — Flame dev`, description: item.description } : {};
};

// Заготовка страницы кейса: на неё ведёт активный кадр первого экрана.
// Тексты кейсов пока черновые — берём описание из общего списка.
const CasePage = async ({ params }: CasePageProps) => {
  const { slug } = await params;
  const item = CASES.find((entry) => entry.slug === slug);
  if (!item) notFound();

  return (
    <main className={styles.case}>
      <BaseButton href="/cases" variant="secondary" className={styles.case__back}>
        <BaseArrow direction="left" />{CASE_BACK_LABEL}
      </BaseButton>

      <h1 className={styles.case__title}>{item.title}</h1>
      <p className={styles.case__text}>{item.description}</p>

      <div className={styles.case__tags}>
        {item.tags.map((tag) => (
          <BaseTag key={tag}>{tag}</BaseTag>
        ))}
      </div>

      <Poster item={item} wide showTitle={false} className={styles.case__poster} />

      <div className={styles.case__foot}>
        <p className={styles.case__note}>Подробный разбор проекта готовим — тексты в работе.</p>
        <div className={styles.case__actions}>
          {item.live && (
            <BaseButton href={item.live} target="_blank" rel="noreferrer" variant="secondary">
              {CASE_LIVE_LABEL} <BaseArrow />
            </BaseButton>
          )}
          <CtaButton href="/#contact" />
        </div>
      </div>
    </main>
  );
};

export default CasePage;
