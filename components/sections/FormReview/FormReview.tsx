'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContactSection from '@/components/sections/Contact/ContactSection';
import type { ContactVariant } from '@/components/sections/Contact/variants';
import BriefContact from '@/components/sections/Brief/BriefContact';
import { FORM_REVIEW } from '@/data/brief';
import styles from './FormReview.module.scss';

const FormReview = () => {
  const [selected, setSelected] = useState('brief');
  const variant = FORM_REVIEW.variants.find((item) => item.id === selected)!;
  return <main><div className={styles.review}><Link href="/">← {FORM_REVIEW.back}</Link><h1>{FORM_REVIEW.title}</h1><p>{FORM_REVIEW.text}</p><div className={styles.review__tabs} role="group" aria-label={FORM_REVIEW.title}>{FORM_REVIEW.variants.map((item) => <button key={item.id} type="button" aria-pressed={item.id === selected} onClick={() => setSelected(item.id)}>{item.label}</button>)}</div><p className={styles.review__note} role="status">{variant.note}</p></div><div key={selected}>{selected === 'brief' ? <BriefContact /> : <ContactSection variant={selected as ContactVariant} />}</div></main>;
};
export default FormReview;
