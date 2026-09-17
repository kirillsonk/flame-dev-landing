import type { Ref } from 'react';
import clsx from 'clsx';
import BaseIcon from '@/components/ui/BaseIcon/BaseIcon';
import { CONTACT } from '@/data/site';
import styles from './ContactLinks.module.scss';

export interface ContactLinksProps {
  className?: string;
  ref?: Ref<HTMLUListElement>;
}

// Круглые иконки-ссылки для вариантов блока: подписи живут в aria-label и тултипе.
const ContactLinks = ({ className, ref }: ContactLinksProps) => {
  return (
    <ul ref={ref} className={clsx(styles.links, className)}>
      {CONTACT.links.map((link) => {
        const external = link.href.startsWith('http');
        return (
          <li key={link.href} className={styles.links__item}>
            <a
              href={link.href}
              className={styles.links__link}
              aria-label={link.label}
              title={link.label}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
            >
              <BaseIcon name={link.icon} />
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default ContactLinks;
