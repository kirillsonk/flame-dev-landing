'use client';
import { useSyncExternalStore } from 'react';
import Match3Board from '@/components/sections/Services/visuals/Match3Board';
import ui from '@/components/sections/Services/visuals/Demo.module.scss';
const subscribe = () => () => undefined;
const Match3 = () => {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return <div className={ui.panel}>{mounted && <Match3Board />}</div>;
};
export default Match3;
