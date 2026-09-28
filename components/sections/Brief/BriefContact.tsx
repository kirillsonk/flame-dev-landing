'use client';

import { useState } from 'react';
import LeadForm from '@/components/sections/Contact/LeadForm';
import { STUDIO } from '@/data/studio';
import Brief from './Brief';
import styles from './Brief.module.scss';

const BriefContact = () => {
  const [mode, setMode] = useState('brief');
  return <section className={styles.contact} id="contact"><div className={styles.contact__intro}><p className={styles.hint}>{STUDIO.contact.eyebrow}</p><h2>{STUDIO.contact.title}</h2><a href={`mailto:${STUDIO.contact.link}`}>{STUDIO.contact.link} ↗</a></div><div className={styles.contact__form}><div hidden={mode !== 'brief'}><Brief /></div><div hidden={mode !== 'direct'} className={styles.direct}><LeadForm /></div><button type="button" className={styles.contact__switch} onClick={() => setMode(mode === 'brief' ? 'direct' : 'brief')}>{mode === 'brief' ? STUDIO.contact.direct : STUDIO.contact.brief}<span aria-hidden="true">↗</span></button></div></section>;
};
export default BriefContact;
