import { useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { TIBIA_PASSPORT as copy } from '@/data/demosTibia';
import type { ITibiaPassportPipe } from '@/data/demosTibia';

export interface IUseTibiaPassport {
  query: string;
  needle: string;
  matches: ITibiaPassportPipe[];
  pipe: ITibiaPassportPipe;
  active: number;
  /** Растёт при смене трубы: этапы цепочки загораются по очереди только тогда. */
  generation: number;
  qr: boolean[];
  setQuery: (value: string) => void;
  select: (pipe: ITibiaPassportPipe) => void;
  setActive: (index: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

const QR_SIZE = 21;
const FINDER = 8;

// Кириллические двойники латиницы в маркировке: люди печатают «4Х8» русской «Х».
const LOOKALIKES: Record<string, string> = { Х: 'X', А: 'A', В: 'B', У: 'Y' };

export const normalizeMark = (value: string) =>
  value
    .toUpperCase()
    .replace(/НКТ\s*[–-]?/g, '')
    .replace(/[ХАВУ]/g, (char) => LOOKALIKES[char])
    .trim();

// Узор QR детерминирован маркировкой: одинаков на сервере и клиенте, без гидрационных расхождений.
const makeQr = (id: string): boolean[] => {
  let seed = [...id].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);
  const random = () => {
    seed = (Math.imul(seed, 1103515245) + 12345) >>> 0;
    return seed / 4294967296;
  };
  return Array.from({ length: QR_SIZE * QR_SIZE }, (_, index) => {
    const x = index % QR_SIZE;
    const y = Math.floor(index / QR_SIZE);
    const finder = (x < FINDER && y < FINDER) || (x > QR_SIZE - FINDER - 1 && y < FINDER) || (x < FINDER && y > QR_SIZE - FINDER - 1);
    return !finder && random() > 0.5;
  });
};

const useTibiaPassport = (): IUseTibiaPassport => {
  const [query, setQuery] = useState('');
  const [pipe, setPipe] = useState(copy.pipes[0]);
  const [active, setActive] = useState(copy.pipes[0].done);
  const [generation, setGeneration] = useState(0);
  const needle = normalizeMark(query);
  const matches = useMemo(() => copy.pipes.filter((item) => item.id.includes(needle)), [needle]);
  const qr = useMemo(() => makeQr(pipe.id), [pipe.id]);

  const select = (next: ITibiaPassportPipe) => {
    setPipe(next);
    setActive(next.done);
    if (next !== pipe) setGeneration((value) => value + 1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!matches.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const current = matches.indexOf(pipe);
      const step = event.key === 'ArrowDown' ? 1 : -1;
      select(matches[(current + step + matches.length) % matches.length]);
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      select(matches.includes(pipe) ? pipe : matches[0]);
    }
  };

  return { query, needle, matches, pipe, active, generation, qr, setQuery, select, setActive, onKeyDown };
};

export default useTibiaPassport;
