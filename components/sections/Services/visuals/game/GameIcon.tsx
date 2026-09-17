import { GAME_ICON_PATHS } from './icons';
import type { GameIconKind } from './icons';

export interface GameIconProps {
  kind: GameIconKind;
  className?: string;
}

const GameIcon = ({ kind, className }: GameIconProps) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    {kind === 'dud' ? (
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="6" width="16" height="14" rx="2" strokeDasharray="3 2" />
        <path d="M9 11l6 6M15 11l-6 6" />
      </g>
    ) : (
      <path fill="currentColor" d={GAME_ICON_PATHS[kind]} />
    )}
  </svg>
);

export default GameIcon;
