import type { ReactElement } from 'react';
import type { ServiceVisualKind } from '@/data/types';
import TibiaDemo from './tibia/TibiaDemo';
import GameDemo from './game/GameDemo';
import Web3dDemo from './web3d/Web3dDemo';
import AiDemo from './ai/AiDemo';
import { DEFAULT_TIBIA_DEMO } from './tibia/variants';
import type { TibiaDemoVariant } from './tibia/variants';
import { DEFAULT_GAME_DEMO } from './game/variants';
import type { GameDemoVariant } from './game/variants';
import { DEFAULT_WEB3D_DEMO } from './web3d/variants';
import type { Web3dDemoVariant } from './web3d/variants';
import { DEFAULT_AI_DEMO } from './ai/variants';
import type { AiDemoVariant } from './ai/variants';

/** Выбранные варианты интерактивных демо (группы «Демо: …» в меню вариантов). */
export interface IServiceDemoVariants {
  tibia: TibiaDemoVariant;
  game: GameDemoVariant;
  web3d: Web3dDemoVariant;
  ai: AiDemoVariant;
}

export const DEFAULT_DEMO_VARIANTS: IServiceDemoVariants = {
  tibia: DEFAULT_TIBIA_DEMO,
  game: DEFAULT_GAME_DEMO,
  web3d: DEFAULT_WEB3D_DEMO,
  ai: DEFAULT_AI_DEMO,
};

export interface ServiceVisualProps {
  kind: ServiceVisualKind;
  demos?: IServiceDemoVariants;
}

const ServiceVisual = ({ kind, demos = DEFAULT_DEMO_VARIANTS }: ServiceVisualProps): ReactElement => {
  switch (kind) {
    case 'tibia':
      return <TibiaDemo variant={demos.tibia} />;
    case 'prompt':
      return <AiDemo variant={demos.ai} />;
    case 'match3':
      return <GameDemo variant={demos.game} />;
    case 'rosatom':
      return <Web3dDemo variant={demos.web3d} />;
  }
};

export default ServiceVisual;
