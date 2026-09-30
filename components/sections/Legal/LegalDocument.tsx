import Link from 'next/link';
import BaseArrow from '@/components/ui/BaseArrow/BaseArrow';
import { LEGAL_LINKS, LEGAL_UPDATED } from '@/data/legal';
import { CASES_BACK_LABEL } from '@/data/site';
import type { ILegalDocument } from '@/data/types';
import styles from './LegalDocument.module.scss';

export interface LegalDocumentProps {
  document: ILegalDocument;
}

// Страница юридического документа: одна читаемая колонка, разделы с якорями, ссылка на второй документ
const LegalDocument = ({ document }: LegalDocumentProps) => {
  const other = document.title.startsWith('Политика') ? LEGAL_LINKS.consent : LEGAL_LINKS.privacy;
  return (
    <main className={styles.legal}>
      <Link href="/" className={styles.legal__back}><BaseArrow direction="left" />{CASES_BACK_LABEL}</Link>
      <h1 className={styles.legal__title}>{document.title}</h1>
      <div className={styles.legal__intro}>
        {document.intro.map(text => <p key={text}>{text}</p>)}
      </div>
      {document.sections.map(section => (
        <section key={section.title} id={section.id} className={styles.legal__section}>
          <h2>{section.title}</h2>
          {section.paragraphs?.map(text => <p key={text}>{text}</p>)}
          {section.items && <ul>{section.items.map(text => <li key={text}>{text}</li>)}</ul>}
        </section>
      ))}
      <footer className={styles.legal__footer}>
        <p>Редакция от {LEGAL_UPDATED}</p>
        <Link href={other.href}>{other.label}<BaseArrow /></Link>
      </footer>
    </main>
  );
};

export default LegalDocument;
