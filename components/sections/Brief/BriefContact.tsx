'use client';

import { useState } from 'react';
import LeadForm from '@/components/sections/Contact/LeadForm';
import { STUDIO } from '@/data/studio';
import Brief from './Brief';
import styles from './Brief.module.scss';

const BriefContact = () => {
  const [mode, setMode] = useState('brief');
  return <section className={styles.contact} id="contact"><div className={styles.contact__intro}><p className={styles.hint}>{STUDIO.contact.eyebrow}</p><h2>{STUDIO.contact.title}</h2><p>{STUDIO.contact.text}</p><a href={`mailto:${STUDIO.contact.link}`}>{STUDIO.contact.link} ↗</a></div><div className={styles.contact__form}><div className={styles.tabs} role="group" aria-label={STUDIO.contact.title}><button type="button" aria-pressed={mode === 'brief'} onClick={() => setMode('brief')}>{STUDIO.contact.brief}</button><button type="button" aria-pressed={mode === 'direct'} onClick={() => setMode('direct')}>{STUDIO.contact.direct}</button></div><div hidden={mode !== 'brief'}><Brief /></div><div hidden={mode !== 'direct'} className={styles.direct}><LeadForm /></div></div></section>;
};
export default BriefContact;
