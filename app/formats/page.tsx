import type { Metadata } from 'next';
import FormReview from '@/components/sections/FormReview/FormReview';
export const metadata: Metadata = { title: 'Варианты формы | Flame', robots: { index: false, follow: false } };
const FormatsPage = () => <FormReview />;
export default FormatsPage;
