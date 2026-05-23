'use client';

import { useEffect, useState } from 'react';
import { GameResult } from '@/components/ui/ResultScreen';

// Monochrome symbols
const SYMBOLS = ['◆', '◇', '○', '●', '▲', '▼', '■', '□'];

interface Props { onFinish: (r: GameResult) => void; }

export function Memory({ onFinish }: Props) {
  const [deck] = useState<string[]>(() => [...SYMBOLS, ...SYMBOLS].sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (matched.length === 16) {
      setTimeout(() => onFinish({
        won: true,
        score: Math.max(100 - moves * 5, 20),
        xp: 50,
        message: `Cleared in ${moves} moves. Sharp memory!`,
      }), 400);
    }
  }, [matched.length, moves, onFinish]);

  function flip(i: number) {
    if (locked || flipped.includes(i) || matched.includes(i) || flipped.length >= 2) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      if (deck[next[0]] === deck[next[1]]) {
        setMatched((m) => [...m, ...next]);
        setFlipped([]);
      } else {
        setLocked(true);
        setTimeout(() => { setFlipped([]); setLocked(false); }, 800);
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex gap-6 font-mono text-sm">
        <span>Moves: <b>{moves}</b></span>
        <span>Matched: <b>{matched.length / 2}</b>/8</span>
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(4, 72px)' }}>
        {deck.map((s, i) => {
          const shown = flipped.includes(i) || matched.includes(i);
          const done = matched.includes(i);
          return (
            <div
              key={i}
              onClick={() => flip(i)}
              className="flex aspect-square cursor-pointer items-center justify-center rounded-xl text-3xl font-bold transition-all duration-300"
              style={{
                background: done ? 'rgba(255,255,255,0.95)' : shown ? '#fff' : '#1a1a1a',
                color: done ? '#000' : shown ? '#000' : '#444',
                border: '1px solid rgba(255,255,255,0.15)',
                opacity: done ? 0.5 : 1,
              }}
            >
              {shown ? s : '?'}
            </div>
          );
        })}
      </div>
    </div>
  );
}
