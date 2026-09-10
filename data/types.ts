export type CaseSize = 'l' | 'm' | 's';

export interface ICaseVideo {
  mp4: string;
  webm?: string;
  poster?: string;
}

export interface ICase {
  slug: string;
  title: string;
  size: CaseSize;
  colors: [string, string];
  description: string;
  tags: string[];
  video?: ICaseVideo;
}

export type ServiceVisualKind = 'tibia' | 'match3' | 'rosatom' | 'prompt';

export interface IService {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  visual: ServiceVisualKind;
}

export interface IProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface IWhyCard {
  title: string;
  description: string;
  featured?: boolean;
}

export interface IEcosystemCard {
  title: string;
  description: string;
  href: string;
  label: string;
}

export interface INavItem {
  label: string;
  href: string;
}

export interface IContactLink {
  label: string;
  href: string;
}
