import Match3 from '@/components/sections/Services/visuals/Match3';
import GameCatch from './GameCatch';
import GameCombo from './GameCombo';
import GameScratch from './GameScratch';
import type { GameDemoVariant } from './variants';

export interface GameDemoProps {
  variant: GameDemoVariant;
}

const VARIANTS: Record<GameDemoVariant, () => React.JSX.Element> = {
  current: Match3,
  combo: GameCombo,
  scratch: GameScratch,
  catch: GameCatch,
};

// Демо «Игра» в блоке «Что мы делаем»: промо-механики, вариант выбирается меню вариантов.
const GameDemo = ({ variant }: GameDemoProps) => {
  const Variant = VARIANTS[variant];
  return <Variant />;
};

export default GameDemo;
