import { CASES, HUAWEI_NOTE } from '@/data/cases';
import CaseCard from './CaseCard';
import styles from './Cases.module.scss';

const Cases = () => {
  return (
    <section className={styles.cases} id="cases">
      <h2 className={styles.cases__title} data-reveal>Кейсы</h2>
      <div className={styles.cases__grid}>
        {CASES.map((item) => (
          <CaseCard key={item.slug} item={item} />
        ))}
      </div>
      <p className={styles.cases__note} data-reveal>
        {HUAWEI_NOTE.text}{' '}
        <a href={HUAWEI_NOTE.href} target="_blank" rel="noreferrer" className={styles.cases__link}>
          <span aria-hidden="true">→</span> {HUAWEI_NOTE.label}
        </a>
      </p>
    </section>
  );
};

export default Cases;
