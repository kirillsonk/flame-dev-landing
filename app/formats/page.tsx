import type { Metadata } from 'next';
import FormReview from '@/components/sections/FormReview/FormReview';
export const metadata: Metadata = { title: 'Flame | Варианты формы', robots: { index: false, follow: false } };
const FormatsPage = () => <FormReview />;
export default FormatsPage;
