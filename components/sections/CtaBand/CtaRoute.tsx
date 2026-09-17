'use client';

import clsx from 'clsx';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CTA_BAND, CTA_LABEL, CTA_ROUTE } from '@/data/site';
import useCtaRoute from './hooks/useCtaRoute';
import styles from './CtaRoute.module.scss';

const GRADIENT_ID = 'cta-route-gradient';

// Вариант «Маршрут»: линия прокладывает путь заявки по команде, бегущая точка зажигает узлы.
const CtaRoute = () => {
  const { sectionRef, accentRef, graphRef, svgRef, bindTrack, bindLine, bindNode, runnerRef } = useCtaRoute();
  const segments = CTA_ROUTE.slice(1);

  return (
    <section ref={sectionRef} className={styles.route}>
      <div className={styles.route__inner}>
        <div className={styles.route__copy}>
          <h2 className={styles.route__title}>
            {CTA_BAND.question} {CTA_BAND.answerLead}
            <span ref={accentRef} className={styles.route__accent}>
              {CTA_BAND.answerAccent}
            </span>
          </h2>
          <BaseButton href="#contact" size="l" arrow>
            {CTA_LABEL}
          </BaseButton>
        </div>

        <div ref={graphRef} className={styles.route__graph} aria-hidden="true">
          <svg ref={svgRef} className={styles.route__svg}>
            <defs>
              <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#3a56ff" />
                <stop offset="1" stopColor="#00e1fd" />
              </linearGradient>
            </defs>
            {segments.map((label, index) => (
              <g key={label}>
                <path
                  ref={bindTrack(index)}
                  className={styles.route__track}
                />
                <path
                  ref={bindLine(index)}
                  className={styles.route__line}
                  stroke={`url(#${GRADIENT_ID})`}
                />
              </g>
            ))}
          </svg>
          {CTA_ROUTE.map((label, index) => (
            <div
              key={label}
              ref={bindNode(index)}
              className={clsx(styles.route__node, index === CTA_ROUTE.length - 1 && styles['route__node--last'])}
            >
              <i className={styles.route__dot} />
              <span className={styles.route__label}>{label}</span>
            </div>
          ))}
          <div ref={runnerRef} className={styles.route__runner} />
        </div>
      </div>
    </section>
  );
};

export default CtaRoute;
