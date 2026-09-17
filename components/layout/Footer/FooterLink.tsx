import type { ReactNode } from 'react';
import type { INavItem } from '@/data/types';

export interface FooterLinkProps {
  item: INavItem;
  className?: string;
  children?: ReactNode;
}

// Ссылка подвала: внешние адреса открываются в новой вкладке.
const FooterLink = ({ item, className, children }: FooterLinkProps) => {
  const external = item.href.startsWith('http');
  return (
    <a href={item.href} className={className} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
      {children ?? item.label}
    </a>
  );
};

export default FooterLink;
