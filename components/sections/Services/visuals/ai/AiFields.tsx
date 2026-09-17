'use client';

import clsx from 'clsx';
import { AI_FIELDS as copy } from '@/data/demosAi';
import AiCard from './AiCard';
import AiChips from './AiChips';
import AiField from './AiField';
import AiProgress from './AiProgress';
import useAiFields from './hooks/useAiFields';
import tones from './AiTones.module.scss';
import styles from './AiFields.module.scss';

// AI · заявка с подсветкой полей: заявка печатается, фразы подсвечиваются, справа заполняется карточка CRM.
const AiFields = () => {
  const { ref, selected, segments, fields, found, phase, percent, title, hot, select, hover } = useAiFields();

  return (
    <div ref={ref} className={styles.fields}>
      <div className={styles.fields__top}>
        <span className={styles.fields__hint}>{copy.hint}</span>
        <AiChips
          label={copy.samplesLabel}
          items={copy.samples.map((sample) => sample.tab)}
          selected={selected}
          onSelect={select}
        />
      </div>
      <AiCard label={copy.source} aside={copy.count(found, fields.length)} ariaLabel={copy.sourceLabel}>
        <p key={selected} className={clsx(styles.fields__text, phase === 'typing' && styles['fields__text--typing'])}>
          {segments.map(({ text, mark, tone }, index) =>
            mark ? (
              <span
                key={index}
                className={clsx(
                  styles.fields__mark,
                  tone && tones[`tone--${tone}`],
                  hot === mark.key && styles['fields__mark--hot'],
                )}
                tabIndex={0}
                onMouseEnter={() => hover(mark.key, true)}
                onMouseLeave={() => hover(mark.key, false)}
                onFocus={() => hover(mark.key, true)}
                onBlur={() => hover(mark.key, false)}
              >
                {text}
              </span>
            ) : (
              text
            ),
          )}
        </p>
      </AiCard>
      <AiCard label={copy.crm} aside={copy.heuristic} ariaLabel={copy.crmLabel}>
        <h4 className={styles.fields__title}>{title}</h4>
        <div className={styles.fields__list}>
          {fields.map((field) => (
            <AiField
              key={field.key}
              name={field.name}
              value={field.value ?? copy.empty}
              tone={field.tone}
              empty={!field.value}
              hidden={field.hidden}
              hot={hot === field.key}
              onHover={field.hidden ? undefined : (on) => hover(field.key, on)}
            />
          ))}
        </div>
        <AiProgress
          className={styles.fields__score}
          value={percent / 100}
          label={copy.completeness}
          meta={`${percent}%`}
        />
      </AiCard>
    </div>
  );
};

export default AiFields;
