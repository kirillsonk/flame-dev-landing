import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Flame Dev — сложные системы и спецпроекты для брендов',
  description: 'Разработка, дизайн и видеопродакшн в одной команде.',
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
