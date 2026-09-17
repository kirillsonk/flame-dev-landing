import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { AI_THEMES as copy } from '@/data/demosAi';

export interface IAiThemeGroup {
  key: string;
  name: string;
  tone: (typeof copy.groups)[number]['tone'];
  count: number;
  percent: number;
  mood: string;
}

const GROUPS: IAiThemeGroup[] = copy.groups.map((group) => {
  const list = copy.reviews.filter((review) => review.group === group.key);
  const percent = Math.round((list.filter((review) => review.positive).length / list.length) * 100);
  return {
    ...group,
    count: list.length,
    percent,
    mood: percent >= 60 ? copy.positive : percent <= 40 ? copy.negative : copy.mixed,
  };
});

interface IBox {
  width: number;
  height: number;
  rem: number;
  tip: number;
}

// Раскладка карточек в пикселях: россыпь сеткой с лёгким поворотом или колонки по темам.
const layout = ({ width, height, rem, tip }: IBox, clustered: boolean) => {
  const mobile = width / rem < 50;
  const cols = mobile ? 2 : 4;
  const gap = (mobile ? 0.8 : 1.6) * rem;
  const cards: CSSProperties[] = [];
  const groups: CSSProperties[] = [];

  if (!clustered) {
    const rows = Math.ceil(copy.reviews.length / cols);
    const cellW = width / cols;
    const cellH = height / rows;
    copy.reviews.forEach((_, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const w = cellW - gap;
      const h = Math.min(cellH - gap, (mobile ? 9 : 8) * rem);
      const jitterX = mobile ? 0 : (((index * 37) % 11) - 5) * rem * 0.3;
      const jitterY = mobile ? 0 : (((index * 53) % 9) - 4) * rem * 0.3;
      const angle = mobile ? 0 : (((index * 29) % 7) - 3) * 0.5;
      cards.push({
        width: w,
        height: h,
        transform: `translate(${col * cellW + (cellW - w) / 2 + jitterX}px, ${row * cellH + (cellH - h) / 2 + jitterY}px) rotate(${angle}deg)`,
      });
    });
    return { cards, groups, tipTop: Math.max(0, height - tip), content: height };
  }

  const groupW = width / cols;
  const pill = (mobile ? 3.2 : 3.6) * rem;
  const step = pill + 0.6 * rem;
  const head = (mobile ? 8.4 : 7.2) * rem;
  const rows = Math.ceil(GROUPS.length / cols);
  const rowY = [0];
  for (let row = 0; row < rows - 1; row += 1) {
    const tallest = Math.max(...GROUPS.slice(row * cols, (row + 1) * cols).map((group) => group.count));
    rowY.push(rowY[row] + head + tallest * step + gap);
  }
  const lastTallest = Math.max(...GROUPS.slice((rows - 1) * cols).map((group) => group.count));
  const bottom = rowY[rows - 1] + head + lastTallest * step;

  GROUPS.forEach((group, groupIndex) => {
    const x = (groupIndex % cols) * groupW;
    const y = rowY[Math.floor(groupIndex / cols)];
    groups.push({ left: x, top: y, width: groupW - gap });
    let slot = 0;
    copy.reviews.forEach((review, index) => {
      if (review.group !== group.key) return;
      cards[index] = { width: groupW - gap, height: pill, transform: `translate(${x}px, ${y + head + slot * step}px)` };
      slot += 1;
    });
  });

  const tipTop = Math.max(bottom + gap, height - tip);
  return { cards, groups, tipTop, content: tipTop + tip };
};

const useAiThemes = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<IBox>({ width: 0, height: 0, rem: 10, tip: 0 });
  const [clustered, setClustered] = useState(false);
  const [hot, setHot] = useState<string | null>(null);

  useEffect(() => {
    const board = boardRef.current;
    const tip = tipRef.current;
    if (!board) return;
    const observer = new ResizeObserver(() =>
      setBox({
        width: board.clientWidth,
        height: board.clientHeight,
        rem: parseFloat(getComputedStyle(document.documentElement).fontSize) || 10,
        tip: tip?.offsetHeight ?? 0,
      }),
    );
    observer.observe(board);
    if (tip) observer.observe(tip);
    return () => observer.disconnect();
  }, []);

  return {
    boardRef,
    tipRef,
    measured: box.width > 0,
    clustered,
    groups: GROUPS,
    positions: layout(box, clustered),
    hot: clustered ? hot : null,
    setHot,
    toggle: () => {
      setClustered((value) => !value);
      boardRef.current?.scrollTo({ top: 0 });
    },
  };
};

export default useAiThemes;
