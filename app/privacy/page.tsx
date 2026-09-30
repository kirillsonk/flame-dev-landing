import type { Metadata } from 'next';
import LegalDocument from '@/components/sections/Legal/LegalDocument';
import { PRIVACY_POLICY } from '@/data/legal';

export const metadata: Metadata = {
  title: 'Политика обработки персональных данных | Flame dev',
  description: 'Какие данные посетителей сайта flamedev.pro обрабатываются, зачем и как они защищены',
};

const PrivacyPage = () => <LegalDocument document={PRIVACY_POLICY} />;

export default PrivacyPage;
