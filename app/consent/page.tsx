import type { Metadata } from 'next';
import LegalDocument from '@/components/sections/Legal/LegalDocument';
import { CONSENT_DOCUMENT } from '@/data/legal';

export const metadata: Metadata = {
  title: 'Flame | Согласие на обработку персональных данных',
  description: 'Согласие на обработку персональных данных при отправке заявки на сайте flamedev.pro',
  alternates: { canonical: '/consent' },
};

const ConsentPage = () => <LegalDocument document={CONSENT_DOCUMENT} />;

export default ConsentPage;
