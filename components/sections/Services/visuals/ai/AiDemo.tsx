import PromptDemo from '@/components/sections/Services/visuals/PromptDemo';
import AiContent from './AiContent';
import AiDocuments from './AiDocuments';
import AiFields from './AiFields';
import AiInvoice from './AiInvoice';
import AiModeration from './AiModeration';
import AiRag from './AiRag';
import AiThemes from './AiThemes';
import AiVideo from './AiVideo';
import type { AiDemoVariant } from './variants';

export interface AiDemoProps {
  variant: AiDemoVariant;
}

const VARIANTS: Record<AiDemoVariant, () => React.JSX.Element> = {
  current: PromptDemo,
  fields: AiFields,
  themes: AiThemes,
  video: AiVideo,
  documents: AiDocuments,
  content: AiContent,
  rag: AiRag,
  moderation: AiModeration,
  invoice: AiInvoice,
};

// Демо «AI» в блоке «Что мы делаем»; вариант выбирается меню вариантов (data/variants.ts).
const AiDemo = ({ variant }: AiDemoProps) => {
  const Variant = VARIANTS[variant];
  return <Variant />;
};

export default AiDemo;
