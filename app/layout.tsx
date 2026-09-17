import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import Header from '@/components/layout/Header/Header';
import FooterSection from '@/components/layout/Footer/FooterSection';
import { SHOW_VARIANT_PANEL } from '@/components/layout/VariantPanel/variantStore';
import RevealController from '@/components/layout/RevealController/RevealController';
import AnchorScroll from '@/components/layout/AnchorScroll/AnchorScroll';
import MobileCtaBar from '@/components/cta/MobileCtaBar/MobileCtaBar';
import './globals.scss';

const firsNeue = localFont({
  variable: '--font',
  display: 'swap',
  src: [
    { path: '../public/fonts/TTFirsNeue/TTFirsNeue-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/TTFirsNeue/TTFirsNeue-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/TTFirsNeue/TTFirsNeue-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/TTFirsNeue/TTFirsNeue-BoldItalic.woff2', weight: '700', style: 'italic' },
  ],
});

export const metadata: Metadata = {
  title: 'Flame Dev — сложные системы и спецпроекты для брендов',
  description: 'Разработка, дизайн и видеопродакшн в одной команде. Coca-Cola, Росатом, AliExpress, Purina, VK.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Flame Dev',
    description: 'Сложные системы и спецпроекты для брендов.',
    siteName: 'Flame Dev',
    locale: 'ru_RU',
    type: 'website',
  },
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html
      lang="ru"
      className={firsNeue.variable}
      data-scroll-behavior="smooth"
      data-variant-panel={SHOW_VARIANT_PANEL ? '' : undefined}
    >
      <head>
        <noscript>
          <style>{'[data-reveal]{opacity:1;translate:none}'}</style>
        </noscript>
      </head>
      <body>
        <div id="top" />
        <Header />
        {children}
        <FooterSection />
        {/* Плавающая кнопка «Обсудить проект» в правом нижнем углу отключена (2026-09-16): CTA в шапке и в секциях. */}
        <MobileCtaBar />
        <RevealController />
        <AnchorScroll />
      </body>
    </html>
  );
};

export default RootLayout;
