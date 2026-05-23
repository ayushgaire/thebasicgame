'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { GameResult } from '@/components/ui/ResultScreen';
import { GameMode } from '@/components/ui/ModeSelector';

interface Props {
  mode: GameMode;
  onFinish: (r: GameResult) => void;
}

type Cell = 'X' | 'O' | null;

const WINS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6],
];

const checkWin = (
  b: Cell[],
  p: 'X' | 'O'
) =>
  WINS.some((w) =>
    w.every((i) => b[i] === p)
  );

function botPick(board: Cell[]): number {
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const t = [...board];
      t[i] = 'O';

      if (checkWin(t, 'O'))
        return i;
    }
  }

  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const t = [...board];
      t[i] = 'X';

      if (checkWin(t, 'X'))
        return i;
    }
  }

  if (!board[4]) return 4;

  const corners = [0,2,6,8].filter(
    (i) => !board[i]
  );

  if (corners.length) {
    return corners[
      Math.floor(
        Math.random() *
          corners.length
      )
    ];
  }

  const empty = board
    .map((v, i) =>
      v ? null : i
    )
    .filter(
      (x): x is number =>
        x !== null
    );

  return empty[
    Math.floor(
      Math.random() *
        empty.length
    )
  ];
}

export function TicTacToe({
  mode,
  onFinish,
}: Props) {
  const isBot = mode !== 'multi';

  const [board, setBoard] =
    useState<Cell[]>(
      Array(9).fill(null)
    );

  const [turn, setTurn] =
    useState<'X' | 'O'>('X');

  const [over, setOver] =
    useState(false);

  const [winningLine, setWinningLine] =
    useState<number[]>([]);

  useEffect(() => {
    if (over) return;

    if (isBot && turn === 'O') {
      const id = setTimeout(() => {
        play(botPick(board));
      }, 600);

      return () =>
        clearTimeout(id);
    }
  }, [
    turn,
    isBot,
    over,
    board,
  ]);

  function play(i: number) {
    if (over || board[i]) return;

    const next = [...board];
    next[i] = turn;

    setBoard(next);

    const line = WINS.find((w) =>
      w.every(
        (idx) =>
          next[idx] === turn
      )
    );

    if (line) {
      setWinningLine(line);

      setOver(true);

      const won = isBot
        ? turn === 'X'
        : true;

      setTimeout(() => {
        onFinish({
          won,

          score:
            turn === 'X'
              ? 100
              : 50,

          xp: won ? 50 : 15,

          message: isBot
            ? turn === 'X'
              ? 'YOU WON!'
              : 'BOT WON!'
            : `PLAYER ${turn} WINS!`,
        });
      }, 900);

      return;
    }

    if (next.every((v) => v)) {
      setOver(true);

      setTimeout(() => {
        onFinish({
          won: false,
          score: 25,
          xp: 20,
          message:
            'DRAW GAME',
        });
      }, 700);

      return;
    }

    setTurn(
      turn === 'X'
        ? 'O'
        : 'X'
    );
  }

  const status = over
    ? 'GAME OVER'
    : isBot
      ? turn === 'X'
        ? 'YOUR TURN'
        : 'BOT THINKING...'
      : `PLAYER ${turn} TURN`;

  return (
    <div className="flex flex-col items-center">
      {/* STATUS */}
      <div className="mb-6 rounded-2xl border border-cyan-500/20 bg-[#020617]/80 px-6 py-3 font-mono text-sm tracking-[0.3em] text-cyan-300 shadow-[0_0_30px_rgba(0,255,255,0.15)] backdrop-blur-xl">
        {status}
      </div>

      {/* BOARD */}
      <div
        className="grid gap-3 rounded-3xl border border-cyan-500/20 bg-[#020617]/90 p-5 shadow-[0_0_70px_rgba(0,255,255,0.12)]"
        style={{
          gridTemplateColumns:
            'repeat(3, 110px)',
        }}
      >
        {board.map((v, i) => {
          const isWinning =
            winningLine.includes(i);

          return (
            <motion.div
              key={i}
              whileHover={{
                scale:
                  !v && !over
                    ? 1.06
                    : 1,
              }}
              whileTap={{
                scale:
                  !v && !over
                    ? 0.96
                    : 1,
              }}
              onClick={() =>
                (!isBot ||
                  turn === 'X') &&
                play(i)
              }
              className="flex h-[110px] w-[110px] cursor-pointer items-center justify-center rounded-2xl border text-6xl font-black transition-all duration-300"
              style={{
                background:
                  isWinning
                    ? 'rgba(0,255,255,0.2)'
                    : 'rgba(255,255,255,0.03)',

                borderColor:
                  isWinning
                    ? 'rgba(0,255,255,0.8)'
                    : 'rgba(255,255,255,0.08)',

                color:
                  v === 'X'
                    ? '#67e8f9'
                    : v === 'O'
                      ? '#f472b6'
                      : '#ffffff',

                boxShadow:
                  isWinning
                    ? '0 0 25px rgba(0,255,255,0.4)'
                    : '0 0 20px rgba(0,0,0,0.2)',

                textShadow:
                  v === 'X'
                    ? '0 0 20px rgba(0,255,255,0.6)'
                    : v === 'O'
                      ? '0 0 20px rgba(244,114,182,0.5)'
                      : undefined,
              }}
            >
              <motion.span
                initial={{
                  scale: 0,
                  rotate: -90,
                }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  duration: 0.25,
                }}
              >
                {v}
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="mt-6 font-mono text-[10px] tracking-[0.35em] text-white/30">
        TIC TAC TOE • CYBER MODE
      </div>
    </div>
  );
}