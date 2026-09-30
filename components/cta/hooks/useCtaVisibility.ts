import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Нужна только между первым экраном и формой, ниже формы не перекрывает футер.
const useCtaVisibility = (): boolean => {
  const pathname = usePathname();
  const [heroPassed, setHeroPassed] = useState(false);
  const [contactReached, setContactReached] = useState(false);

  useEffect(() => {
    if (pathname !== '/') return;
    const hero = document.getElementById('hero');
    const contact = document.getElementById('contact');
    if (!hero || !contact) return;

    // Layout сохраняется при переходах Next Link, но секции главной создаются заново.
    const sync = () => {
      setHeroPassed(hero.getBoundingClientRect().bottom <= 0);
      setContactReached(contact.getBoundingClientRect().top <= window.innerHeight);
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

    heroObserver.observe(hero);
    contactObserver.observe(contact);
    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
    };
  }, [pathname]);

  return pathname === '/' && heroPassed && !contactReached;
};

export default useCtaVisibility;
