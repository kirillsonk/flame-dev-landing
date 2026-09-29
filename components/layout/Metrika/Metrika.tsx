'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { METRIKA_HOSTS, METRIKA_ID } from './metrikaConfig';

// Официальный код счетчика, запуск только на боевом домене
const SNIPPET = `if (${JSON.stringify(METRIKA_HOSTS)}.indexOf(location.hostname) !== -1) {
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}', 'ym');
ym(${METRIKA_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
}`;

// Яндекс Метрика: счетчик и просмотры при переходах между страницами без перезагрузки
const Metrika = () => {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    window.ym?.(METRIKA_ID, 'hit', window.location.href);
  }, [pathname]);

  return <Script id="yandex-metrika" strategy="afterInteractive">{SNIPPET}</Script>;
};

export default Metrika;
