import Contact from './Contact';
import ContactChat from './ContactChat';
import ContactGuides from './ContactGuides';
import ContactMarker from './ContactMarker';
import type { ContactVariant } from './variants';

export interface ContactSectionProps {
  variant: ContactVariant;
}

const VARIANTS: Record<ContactVariant, () => React.JSX.Element> = {
  marker: ContactMarker,
  guides: ContactGuides,
  chat: ContactChat,
  current: Contact,
};

// Блок «Расскажите о задаче»; вариант выбирается меню вариантов в углу экрана (data/variants.ts).
const ContactSection = ({ variant }: ContactSectionProps) => {
  const Variant = VARIANTS[variant];
  return <Variant />;
};

export default ContactSection;
