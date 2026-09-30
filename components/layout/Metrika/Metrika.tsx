'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { METRIKA_HOSTS, METRIKA_ID, reachGoal, visitParams } from './metrikaConfig';

// Официальный код счетчика, запуск только на боевом домене
const SNIPPET = `if (${JSON.stringify(METRIKA_HOSTS)}.indexOf(location.hostname) !== -1) {
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}', 'ym');
ym(${METRIKA_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
}`;

// Где на странице нажали «Обсудить проект»
const placeOf = (link: Element) => {
  if (link.closest('header')) return 'header';
  if (link.closest('#hero')) return 'hero';
  if (link.closest('footer')) return 'footer';
  if (link.closest('#services')) return 'services';
  return link.closest('main') ? 'page' : 'mobile_bar';
};

// Цели по кликам определяются по самой ссылке: компоненты сайта о Метрике не знают
const trackClick = (event: MouseEvent) => {
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
  if (!link) return;
  const href = link.getAttribute('href') ?? '';
  if (href.startsWith('mailto:')) return reachGoal('email_click', { place: placeOf(link) });
  if (href.endsWith('#contact')) return reachGoal('cta_click', { place: placeOf(link) });
  if (link.closest('#ecosystem')) return reachGoal('ecosystem_click', { product: link.hostname });
  if (href === '/cases') return reachGoal('cases_all', { place: placeOf(link) });
  if (href.startsWith('/cases/')) return reachGoal('case_open', { slug: href.split('/')[2] });
  if (link.target === '_blank' && window.location.pathname.startsWith('/cases/')) reachGoal('project_live', { slug: window.location.pathname.split('/')[2], host: link.hostname });
};

// Яндекс Метрика: счетчик, просмотры при переходах без перезагрузки, цели по кликам и язык визита
const Metrika = () => {
  const pathname = usePathname();
  const { locale } = useLocale();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    window.ym?.(METRIKA_ID, 'hit', window.location.href);
  }, [pathname]);

  useEffect(() => {
    visitParams({ lang: locale });
  }, [locale]);

  useEffect(() => {
    document.addEventListener('click', trackClick, true);
    return () => document.removeEventListener('click', trackClick, true);
  }, []);

  return <Script id="yandex-metrika" strategy="afterInteractive">{SNIPPET}</Script>;
};

export default Metrika;
