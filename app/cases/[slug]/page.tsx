import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { notFound } from 'next/navigation';
import CtaButton from '@/components/cta/CtaButton/CtaButton';
import BaseTag from '@/components/ui/BaseTag/BaseTag';
import Poster from '@/components/ui/Poster/Poster';
import { CASES } from '@/data/cases';
import { CASE_STORIES, CASE_STORY_LABEL } from '@/data/caseStories';
import { CASE_BACK_LABEL, CASE_CTA_LABEL, CASE_LIVE_LABEL } from '@/data/site';
import LocalizedText from '@/components/i18n/LocalizedText';
import styles from './page.module.scss';

export interface CasePageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = () => CASES.map((item) => ({ slug: item.slug }));

// Страница кейса: описание из общего списка, ролик, суть проекта и механика из CASE_STORIES
const CasePage = async ({ params }: CasePageProps) => {
  const { slug } = await params;
  const item = CASES.find((entry) => entry.slug === slug);
  if (!item) notFound();
  const story = CASE_STORIES[item.slug];

  return (
    <main className={styles.case}>
      <BaseButton href="/cases" variant="secondary" className={styles.case__back}>
        <LocalizedText>{CASE_BACK_LABEL}</LocalizedText>
      </BaseButton>

      <h1 className={styles.case__title}><LocalizedText>{item.title}</LocalizedText></h1>
      <p className={styles.case__text}><LocalizedText>{item.description}</LocalizedText></p>

      <div className={styles.case__tags}>
        {item.tags.map((tag) => (
          <BaseTag key={tag}><LocalizedText>{tag}</LocalizedText></BaseTag>
        ))}
      </div>

      <Poster item={item} wide showTitle={false} className={styles.case__poster} />

      {story && (
        <section className={styles.case__story}>
          <p className={styles.case__summary}><LocalizedText>{story.summary}</LocalizedText></p>
          <div>
            <h2 className={styles.case__label}><LocalizedText>{CASE_STORY_LABEL}</LocalizedText></h2>
            <ul className={styles.case__list}>
              {story.mechanics.map((line) => <li key={line}><LocalizedText>{line}</LocalizedText></li>)}
            </ul>
          </div>
        </section>
      )}

      <div className={styles.case__foot}>
        <div className={styles.case__actions}>
          {item.live && (
            <BaseButton href={item.live} target="_blank" rel="noreferrer" variant="secondary">
              <LocalizedText>{CASE_LIVE_LABEL}</LocalizedText>
            </BaseButton>
          )}
          <CtaButton href="/#contact" label={CASE_CTA_LABEL} />
        </div>
      </div>
    </main>
  );
};

export default CasePage;
