'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { METRIKA_HOSTS, METRIKA_ID, reachGoal, visitParams } from './metrikaConfig';

// Код счетчика, запуск только на боевом домене. Очередь ym и init создаются сразу, цели и параметры
// копятся в ней. Сам tag.js грузится позже: его разбор и первый запуск занимают основной поток на сотни
// миллисекунд, и на телефоне первое нажатие после загрузки (например, на бургер) срабатывало с задержкой.
// Ждем полторы секунды без касаний и клавиш после загрузки страницы, но не дольше восьми секунд
const SNIPPET = `if (${JSON.stringify(METRIKA_HOSTS)}.indexOf(location.hostname) !== -1) {
(function(m,e,t,r,i){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();
var events=['pointerdown','touchstart','keydown','wheel'],last=0,since=0,done=false;
var mark=function(){last=Date.now()};
var load=function(){for(var j=0;j<e.scripts.length;j++){if(e.scripts[j].src===r){return}}
var k=e.createElement(t),a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)};
var check=function(){if(done){return}var now=Date.now();
if(now-last<1500&&now-since<8000){setTimeout(check,250);return}
done=true;events.forEach(function(n){m.removeEventListener(n,mark,true)});
(m.requestIdleCallback||function(f){setTimeout(f,1)})(load,{timeout:1000})};
var start=function(){since=last=Date.now();setTimeout(check,1500)};
events.forEach(function(n){m.addEventListener(n,mark,{capture:true,passive:true})});
if(e.readyState==='complete'){start()}else{m.addEventListener('load',start)}})
(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}','ym');
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
