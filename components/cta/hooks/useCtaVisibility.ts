import { useEffect, useState } from 'react';

// Visible after the hero has scrolled out above, hidden while the contact section is on screen.
const useCtaVisibility = (): boolean => {
  const [heroPassed, setHeroPassed] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    const contact = document.getElementById('contact');
    if (!hero || !contact) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setHeroPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    const contactObserver = new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting), { threshold: 0.2 });

    heroObserver.observe(hero);
    contactObserver.observe(contact);
    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);

  return heroPassed && !contactVisible;
};

export default useCtaVisibility;
