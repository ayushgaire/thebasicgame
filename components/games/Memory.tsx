'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GameResult } from '@/components/ui/ResultScreen';

/* CYBER SYMBOLS */
const SYMBOLS = [
  '⚡',
  '✦',
  '☯',
  '⬢',
  '✧',
  '⌬',
  '◈',
  '⬡',
];

interface Props {
  onFinish: (r: GameResult) => void;
}

export function Memory({ onFinish }: Props) {
  const [deck] = useState<string[]>(() =>
    [...SYMBOLS, ...SYMBOLS].sort(
      () => Math.random() - 0.5
    )
  );

  const [flipped, setFlipped] = useState<number[]>(
    []
  );

  const [matched, setMatched] = useState<number[]>(
    []
  );

  const [moves, setMoves] = useState(0);

  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (matched.length === 16) {
      setTimeout(() => {
        onFinish({
          won: true,
          score: Math.max(
            150 - moves * 5,
            30
          ),
          xp: 60,
          message: `MEMORY MASTER — CLEARED IN ${moves} MOVES`,
        });
      }, 500);
    }
  }, [matched.length, moves, onFinish]);

  function flip(i: number) {
    if (
      locked ||
      flipped.includes(i) ||
      matched.includes(i) ||
      flipped.length >= 2
    )
      return;

    const next = [...flipped, i];

    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);

      if (
        deck[next[0]] === deck[next[1]]
      ) {
        setMatched((m) => [...m, ...next]);

        setFlipped([]);
      } else {
        setLocked(true);

        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 800);
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* HEADER */}
      <div className="mb-5 flex gap-8 rounded-2xl border border-cyan-500/20 bg-[#020617]/80 px-6 py-3 font-mono text-sm shadow-[0_0_30px_rgba(0,255,255,0.15)] backdrop-blur-xl">
        <span className="tracking-[0.2em] text-cyan-300">
          MOVES:{' '}
          <b className="text-white">
            {moves}
          </b>
        </span>

        <span className="tracking-[0.2em] text-pink-300">
          MATCHED:{' '}
          <b className="text-white">
            {matched.length / 2}/8
          </b>
        </span>
      </div>

      {/* BOARD */}
      <div
        className="grid gap-3 rounded-3xl border border-cyan-500/10 bg-[#020617]/70 p-4 shadow-[0_0_50px_rgba(0,255,255,0.08)] backdrop-blur-xl"
        style={{
          gridTemplateColumns:
            'repeat(4, 86px)',
        }}
      >
        {deck.map((s, i) => {
          const shown =
            flipped.includes(i) ||
            matched.includes(i);

          const done =
            matched.includes(i);

          return (
            <motion.div
              key={i}
              onClick={() => flip(i)}
              whileHover={{
                scale: shown ? 1 : 1.06,
              }}
              whileTap={{
                scale: 0.95,
              }}
              initial={{
                rotateY: 0,
              }}
              animate={{
                rotateY: shown ? 180 : 0,
              }}
              transition={{
                duration: 0.35,
              }}
              className="relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-2xl border text-4xl font-black transition-all duration-300"
              style={{
                background: done
                  ? 'linear-gradient(135deg,#00ffff,#0088ff)'
                  : shown
                    ? 'linear-gradient(135deg,#ffffff,#d1d5db)'
                    : 'linear-gradient(135deg,#0f172a,#020617)',

                color: done
                  ? '#ffffff'
                  : shown
                    ? '#000'
                    : '#334155',

                borderColor: shown
                  ? 'rgba(0,255,255,0.6)'
                  : 'rgba(255,255,255,0.08)',

                boxShadow: shown
                  ? '0 0 25px rgba(0,255,255,0.35)'
                  : '0 0 10px rgba(255,255,255,0.03)',

                opacity: done ? 0.85 : 1,
              }}
            >
              {/* GLOW */}
              {shown && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.2),transparent_70%)]" />
              )}

              <span
                style={{
                  transform: shown
                    ? 'rotateY(180deg)'
                    : 'rotateY(0deg)',
                }}
                className="relative z-10"
              >
                {shown ? s : '?'}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="mt-5 font-mono text-[10px] tracking-[0.25em] text-white/30">
        MATCH ALL SYMBOLS TO WIN
      </div>
    </div>
  );
}