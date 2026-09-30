'use client';

import { useLocale } from './LocaleProvider';

const LocalizedText = ({ children }: { children: string }) => {
  const { t } = useLocale();
  return <>{t(children)}</>;
};

export default LocalizedText;
