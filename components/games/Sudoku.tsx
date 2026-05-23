'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GameResult } from '@/components/ui/ResultScreen';
import {
  generate,
  formatTime,
  Grid,
} from '@/lib/sudoku';

interface Props {
  difficulty: 'easy' | 'medium' | 'hard';
  onFinish: (r: GameResult) => void;
}

const GIVENS = {
  easy: 45,
  medium: 35,
  hard: 28,
} as const;

export function Sudoku({
  difficulty,
  onFinish,
}: Props) {
  const [loading, setLoading] =
    useState(true);

  const [solution, setSolution] =
    useState<Grid>([]);

  const [userGrid, setUserGrid] =
    useState<Grid>([]);

  const [fixed, setFixed] =
    useState<boolean[][]>([]);

  const [sel, setSel] = useState<
    [number, number] | null
  >(null);

  const [mistakes, setMistakes] =
    useState(0);

  const [wrongCell, setWrongCell] =
    useState<[number, number] | null>(
      null
    );

  const [startTime] = useState(() =>
    Date.now()
  );

  const [elapsed, setElapsed] =
    useState(0);

  const [done, setDone] =
    useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const {
        puzzle,
        solution,
      } = generate(
        GIVENS[difficulty]
      );

      setSolution(solution);

      setUserGrid(
        puzzle.map((r) => [...r])
      );

      setFixed(
        puzzle.map((r) =>
          r.map((v) => v !== 0)
        )
      );

      setLoading(false);
    }, 50);

    return () => clearTimeout(t);
  }, [difficulty]);

  useEffect(() => {
    if (done) return;

    const id = setInterval(() => {
      setElapsed(
        Math.floor(
          (Date.now() - startTime) /
            1000
        )
      );
    }, 1000);

    return () => clearInterval(id);
  }, [startTime, done]);

  useEffect(() => {
    if (loading || done) return;

    const handler = (
      e: KeyboardEvent
    ) => {
      if (!sel) return;

      if (
        e.key >= '1' &&
        e.key <= '9'
      ) {
        place(parseInt(e.key));
      } else if (
        ['Backspace', 'Delete', '0'].includes(
          e.key
        )
      ) {
        place(0);
      }
    };

    window.addEventListener(
      'keydown',
      handler
    );

    return () =>
      window.removeEventListener(
        'keydown',
        handler
      );
  }, [sel, done, loading]);

  function place(n: number) {
    if (!sel || done) return;

    const [r, c] = sel;

    if (fixed[r]?.[c]) return;

    if (n === 0) {
      const next = userGrid.map(
        (row) => [...row]
      );

      next[r][c] = 0;

      setUserGrid(next);

      return;
    }

    if (n === solution[r][c]) {
      const next = userGrid.map(
        (row) => [...row]
      );

      next[r][c] = n;

      setUserGrid(next);

      const won = next.every(
        (row, ri) =>
          row.every(
            (v, ci) =>
              v === solution[ri][ci]
          )
      );

      if (won) {
        setDone(true);

        setTimeout(() => {
          onFinish({
            won: true,

            score: Math.max(
              500 -
                elapsed -
                mistakes * 50,
              100
            ),

            xp: 100,

            message: `SOLVED IN ${formatTime(
              elapsed
            )}`,
          });
        }, 500);
      }
    } else {
      const next = userGrid.map(
        (row) => [...row]
      );

      next[r][c] = n;

      setUserGrid(next);

      setWrongCell([r, c]);

      const m = mistakes + 1;

      setMistakes(m);

      setTimeout(() => {
        const cleared =
          userGrid.map((row) => [
            ...row,
          ]);

        cleared[r][c] = 0;

        setUserGrid(cleared);

        setWrongCell(null);
      }, 500);

      if (m >= 3) {
        setDone(true);

        setTimeout(() => {
          onFinish({
            won: false,
            score: 50,
            xp: 15,

            message:
              '3 STRIKES • GAME OVER',
          });
        }, 500);
      }
    }
  }

  if (loading) {
    return (
      <div className="flex h-[450px] flex-col items-center justify-center gap-5">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-300" />

        <div className="font-mono text-xs tracking-[0.3em] text-cyan-300">
          GENERATING{' '}
          {difficulty.toUpperCase()}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* HEADER */}
      <div className="mb-5 flex w-full max-w-xl items-center justify-between rounded-2xl border border-cyan-500/20 bg-[#020617]/80 px-6 py-3 font-mono text-sm shadow-[0_0_30px_rgba(0,255,255,0.12)] backdrop-blur-xl">
        <span className="tracking-[0.2em] text-cyan-300">
          ⏱{' '}
          <b className="text-white">
            {formatTime(elapsed)}
          </b>
        </span>

        <span className="tracking-[0.2em] text-pink-300">
          ✕{' '}
          <b className="text-white">
            {mistakes}
          </b>
          /3
        </span>

        <span className="tracking-[0.2em] text-white/70">
          {difficulty.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-6">
        {/* BOARD */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="grid rounded-3xl border border-cyan-500/10 bg-[#020617]/90 p-2 shadow-[0_0_60px_rgba(0,255,255,0.08)]"
          style={{
            gridTemplateColumns:
              'repeat(9, 46px)',
          }}
        >
          {userGrid.flatMap(
            (row, r) =>
              row.map((v, c) => {
                const isFixed =
                  fixed[r][c];

                const isSel =
                  sel?.[0] === r &&
                  sel?.[1] === c;

                const isPeer =
                  sel &&
                  (r === sel[0] ||
                    c === sel[1] ||
                    (Math.floor(r / 3) ===
                      Math.floor(
                        sel[0] / 3
                      ) &&
                      Math.floor(c / 3) ===
                        Math.floor(
                          sel[1] / 3
                        )));

                const isWrong =
                  wrongCell &&
                  wrongCell[0] === r &&
                  wrongCell[1] === c;

                let bg =
                  'rgba(255,255,255,0.03)';

                if (isFixed)
                  bg =
                    'rgba(255,255,255,0.08)';

                if (
                  isPeer &&
                  !isSel
                )
                  bg =
                    'rgba(0,255,255,0.05)';

                if (isSel)
                  bg =
                    'rgba(0,255,255,0.18)';

                if (isWrong)
                  bg =
                    'rgba(255,0,80,0.25)';

                return (
                  <motion.div
                    whileHover={{
                      scale: isFixed
                        ? 1
                        : 1.05,
                    }}
                    key={`${r}-${c}`}
                    onClick={() =>
                      !isFixed &&
                      setSel([r, c])
                    }
                    className="flex h-[46px] w-[46px] items-center justify-center font-black transition-all"
                    style={{
                      background: bg,

                      color: isWrong
                        ? '#ff4d6d'
                        : isFixed
                          ? '#ffffff'
                          : '#67e8f9',

                      cursor: isFixed
                        ? 'default'
                        : 'pointer',

                      borderRight:
                        c % 3 === 2 &&
                        c < 8
                          ? '2px solid rgba(0,255,255,0.4)'
                          : '1px solid rgba(255,255,255,0.04)',

                      borderBottom:
                        r % 3 === 2 &&
                        r < 8
                          ? '2px solid rgba(0,255,255,0.4)'
                          : '1px solid rgba(255,255,255,0.04)',

                      boxShadow: isSel
                        ? 'inset 0 0 0 2px #00ffff'
                        : undefined,

                      textShadow:
                        isFixed
                          ? '0 0 10px rgba(255,255,255,0.2)'
                          : '0 0 10px rgba(0,255,255,0.35)',
                    }}
                  >
                    {v || ''}
                  </motion.div>
                );
              })
          )}
        </motion.div>

        {/* NUMBER PAD */}
        <div className="grid grid-cols-3 gap-3 self-start">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
            (n) => (
              <motion.button
                whileHover={{
                  scale: 1.08,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                key={n}
                onClick={() =>
                  place(n)
                }
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-[#020617]/80 text-lg font-black text-cyan-300 shadow-[0_0_20px_rgba(0,255,255,0.08)] transition-all hover:bg-cyan-500/10"
              >
                {n}
              </motion.button>
            )
          )}

          <motion.button
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.96,
            }}
            onClick={() => place(0)}
            className="col-span-3 mt-1 flex h-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 font-mono text-sm tracking-[0.2em] text-red-300 transition-all hover:bg-red-500/20"
          >
            ERASE
          </motion.button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-5 font-mono text-[10px] tracking-[0.25em] text-white/30">
        CYBER SUDOKU MODE
      </div>
    </div>
  );
}