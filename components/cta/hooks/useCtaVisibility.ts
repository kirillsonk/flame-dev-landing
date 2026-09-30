import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Не перекрывает интерактивные примеры, форму и футер.
const useCtaVisibility = (): boolean => {
  const pathname = usePathname();
  const [heroPassed, setHeroPassed] = useState(false);
  const [contactReached, setContactReached] = useState(false);
  const [demoVisible, setDemoVisible] = useState(false);

  useEffect(() => {
    if (pathname !== '/') return;
    const hero = document.getElementById('hero');
    const contact = document.getElementById('contact');
    const demo = document.querySelector('#services [data-part="visual"]');
    if (!hero || !contact) return;

    // Layout сохраняется при переходах Next Link, но секции главной создаются заново.
    const sync = () => {
      setHeroPassed(hero.getBoundingClientRect().bottom <= 0);
      setContactReached(contact.getBoundingClientRect().top <= window.innerHeight);
      const rect = demo?.getBoundingClientRect();
      setDemoVisible(Boolean(rect && rect.top < window.innerHeight && rect.bottom > 0));
    };
    sync();

    const heroObserver = new IntersectionObserver(
      ([entry]) => setHeroPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    const contactObserver = new IntersectionObserver(
      ([entry]) => setContactReached(entry.isIntersecting || entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    const demoObserver = new IntersectionObserver(([entry]) => setDemoVisible(entry.isIntersecting));

    heroObserver.observe(hero);
    contactObserver.observe(contact);
    if (demo) demoObserver.observe(demo);
    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
      demoObserver.disconnect();
    };
  }, [pathname]);

  return pathname === '/' && heroPassed && !contactReached && !demoVisible;
};

export default useCtaVisibility;
