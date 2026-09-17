'use client';

import useAnchorScroll from './hooks/useAnchorScroll';

// Переход по якорям в точки пинов (см. хук). Ничего не рисует, живёт в layout.
const AnchorScroll = () => {
  useAnchorScroll();
  return null;
};

export default AnchorScroll;
