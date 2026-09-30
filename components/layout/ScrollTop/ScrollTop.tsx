'use client';

import clsx from 'clsx';
import BaseArrow from '@/components/ui/BaseArrow/BaseArrow';
import { SCROLL_TOP_LABEL } from '@/data/site';
import useScrollTop from './hooks/useScrollTop';
import styles from './ScrollTop.module.scss';

// Круглая кнопка «Наверх» в правом нижнем углу: появляется, когда первый экран далеко позади.
const ScrollTop = () => {
  const { visible, scrollTop } = useScrollTop();

  return (
    <button
      type="button"
      className={clsx(styles.scrollTop, visible && styles['scrollTop--visible'])}
      aria-label={SCROLL_TOP_LABEL}
      title={SCROLL_TOP_LABEL}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={scrollTop}
    >
      <BaseArrow direction="up" size="l" />
    </button>
  );
};

export default ScrollTop;
