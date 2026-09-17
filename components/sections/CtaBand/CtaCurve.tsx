'use client';

import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CTA_BAND, CTA_CURVE, CTA_LABEL } from '@/data/site';
import useCtaCurve from './hooks/useCtaCurve';
import styles from './CtaCurve.module.scss';

// Идентификаторы путей и градиента: блок на странице один.
const PATH_IDS = ['cta-curve-first', 'cta-curve-second'];
const GRADIENT_ID = 'cta-curve-gradient';

// Вариант «Кривая»: фраза втекает по волне, волна выпрямляется в ровную строку.
const CtaCurve = () => {
  const { sectionRef, svgRef, gradientRef, bindPath, bindText, bindOffset } = useCtaCurve();

  return (
    <section ref={sectionRef} className={styles.curve}>
      <div className={styles.curve__inner}>
        <h2 className={styles.curve__sr}>{CTA_BAND.text}</h2>
        <svg ref={svgRef} className={styles.curve__svg} aria-hidden="true">
          <defs>
            <linearGradient ref={gradientRef} id={GRADIENT_ID} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#5670ff" />
              <stop offset="1" stopColor="#00e1fd" />
            </linearGradient>
            {PATH_IDS.map((id, index) => (
              <path
                key={id}
                id={id}
                ref={bindPath(index)}
              />
            ))}
          </defs>
          {CTA_CURVE.map((line, index) => (
            <text
              key={line}
              ref={bindText(index)}
              className={styles.curve__text}
              fill={index === 0 ? 'currentColor' : `url(#${GRADIENT_ID})`}
            >
              <textPath
                href={`#${PATH_IDS[index]}`}
                startOffset="100%"
                ref={bindOffset(index)}
              >
                {line}
              </textPath>
            </text>
          ))}
        </svg>
        <BaseButton href="#contact" size="l" arrow>
          {CTA_LABEL}
        </BaseButton>
      </div>
    </section>
  );
};

export default CtaCurve;
