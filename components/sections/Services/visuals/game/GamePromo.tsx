'use client';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { GAME_PROMO as copy } from '@/data/demosGame';
import ui from '@/components/sections/Services/visuals/Demo.module.scss';
import { copyText } from './promo';
import styles from './GamePromo.module.scss';

export interface GamePromoProps {
  label: string;
  prize: string;
  code: string;
  note: string;
  again: string;
  onAgain: () => void;
}

// Карточка награды поверх поля: промокод, копирование и повтор игры.
const GamePromo = ({ label, prize, code, note, again, onAgain }: GamePromoProps) => {
  const copyRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    copyRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className={styles.gamePromo}>
      <div className={styles.gamePromo__card} role="dialog" aria-label={copy.dialog}>
        <p className={styles.gamePromo__dim}>{label}</p>
        <p className={styles.gamePromo__prize}>{prize}</p>
        <p className={styles.gamePromo__code}>{code}</p>
        <p className={styles.gamePromo__dim}>{note}</p>
        <div className={styles.gamePromo__row}>
          <button
            ref={copyRef}
            type="button"
            className={clsx(ui.button, ui['button--primary'])}
            onClick={() => {
              copyText(code);
              setCopied(true);
            }}
          >
            {copied ? copy.copied : copy.copy}
          </button>
          <button type="button" className={ui.button} onClick={onAgain}>
            {again}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePromo;
