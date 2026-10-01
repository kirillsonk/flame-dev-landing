import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import RevealController from '@/components/layout/RevealController/RevealController';
import AnchorScroll from '@/components/layout/AnchorScroll/AnchorScroll';
import Metrika from '@/components/layout/Metrika/Metrika';
import CookieNotice from '@/components/layout/CookieNotice/CookieNotice';
import AutoTheme from '@/components/layout/AutoTheme/AutoTheme';
import { THEME_INIT_SCRIPT } from '@/lib/theme';
import { ORGANIZATION_LD } from '@/lib/seo';
import MobileCtaBar from '@/components/cta/MobileCtaBar/MobileCtaBar';
import ScrollTop from '@/components/layout/ScrollTop/ScrollTop';
import LocaleProvider from '@/components/i18n/LocaleProvider';
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
  metadataBase: new URL('https://flamedev.pro'),
  openGraph: {
    title: 'Flame dev',
    description: 'Разработка сайтов, сервисов и AI-решений',
    siteName: 'Flame dev',
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
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }} />
        <noscript>
          <style>{'[data-reveal]{opacity:1;translate:none}'}</style>
        </noscript>
      </head>
      <body>
        <LocaleProvider>
          <div id="top" />
          <Header />
          {children}
          <Footer />
          <MobileCtaBar />
          <ScrollTop />
          <RevealController />
          <AnchorScroll />
          <Metrika />
          <CookieNotice />
          <AutoTheme />
        </LocaleProvider>
      </body>
    </html>
  );
};

export default RootLayout;
