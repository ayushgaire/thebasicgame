'use client';

import { useEffect, useState } from 'react';
import { GameResult } from '@/components/ui/ResultScreen';
import { GameMode } from '@/components/ui/ModeSelector';

const W = 7;
const H = 6;

type Board = number[][];

function emptyBoard(): Board {
  return Array.from({ length: H }, () => Array(W).fill(0));
}

function checkWin(b: Board, p: number): boolean {
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      if (b[r][c] !== p) continue;

      for (const [dr, dc] of [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
      ]) {
        let ok = true;

        for (let k = 0; k < 4; k++) {
          const nr = r + dr * k;
          const nc = c + dc * k;

          if (
            nr < 0 ||
            nr >= H ||
            nc < 0 ||
            nc >= W ||
            b[nr][nc] !== p
          ) {
            ok = false;
            break;
          }
        }

        if (ok) return true;
      }
    }
  }

  return false;
}

function drop(b: Board, col: number, p: number): Board | null {
  const next = b.map((r) => [...r]);

  for (let r = H - 1; r >= 0; r--) {
    if (!next[r][col]) {
      next[r][col] = p;
      return next;
    }
  }

  return null;
}

function botMove(b: Board): number {
  for (let c = 0; c < W; c++) {
    const test = drop(b, c, 2);

    if (test && checkWin(test, 2)) return c;
  }

  for (let c = 0; c < W; c++) {
    const test = drop(b, c, 1);

    if (test && checkWin(test, 1)) return c;
  }

  const valid: number[] = [];

  for (let c = 0; c < W; c++) {
    if (!b[0][c]) valid.push(c);
  }

  return valid[Math.floor(Math.random() * valid.length)];
}

interface Props {
  mode: GameMode;
  onFinish: (r: GameResult) => void;
}

export function ConnectFour({ mode, onFinish }: Props) {
  const isBot = mode !== 'multi';

  const [board, setBoard] = useState<Board>(emptyBoard);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (over) return;

    if (isBot && turn === 2) {
      const id = setTimeout(() => {
        play(botMove(board));
      }, 600);

      return () => clearTimeout(id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, isBot, over]);

  function play(col: number) {
    if (over) return;

    const next = drop(board, col, turn);

    if (!next) return;

    setBoard(next);

    if (checkWin(next, turn)) {
      setOver(true);

      const won = isBot ? turn === 1 : true;

      setTimeout(() => {
        onFinish({
          won,
          score: turn === 1 ? 100 : 50,
          xp: won ? 60 : 15,
          message: isBot
            ? turn === 1
              ? 'You connected four!'
              : 'Bot got the win.'
            : `Player ${turn} wins!`,
        });
      }, 600);

      return;
    }

    if (next[0].every((v) => v)) {
      setOver(true);

      setTimeout(() => {
        onFinish({
          won: false,
          score: 40,
          xp: 20,
          message: 'Board full — draw match.',
        });
      }, 500);

      return;
    }

    setTurn(turn === 1 ? 2 : 1);
  }

  const status = over
    ? 'GAME OVER'
    : isBot
      ? turn === 1
        ? 'YOUR TURN'
        : 'BOT THINKING...'
      : `PLAYER ${turn} TURN`;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-5 font-mono text-sm tracking-[0.25em] text-white/70">
        {status}
      </div>

      <div
        className="grid gap-2 rounded-3xl border border-cyan-500/20 bg-[#050816] p-4 shadow-[0_0_60px_rgba(0,255,255,0.15)]"
        style={{
          gridTemplateColumns: `repeat(${W}, 58px)`,
        }}
      >
        {board.flatMap((row, r) =>
          row.map((v, c) => {
            const clickable =
              !over && (!isBot || turn === 1);

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => clickable && play(c)}
                className="relative flex h-[58px] w-[58px] cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
                style={{
                  background:
                    'linear-gradient(145deg, #0f172a, #020617)',

                  border:
                    '1px solid rgba(0,255,255,0.12)',

                  boxShadow:
                    'inset 0 0 12px rgba(255,255,255,0.05)',
                }}
              >
                <div
                  className="h-[42px] w-[42px] rounded-full transition-all duration-300"
                  style={{
                    background:
                      v === 1
                        ? 'radial-gradient(circle at 30% 30%, #00ffff, #0ea5e9)'
                        : v === 2
                          ? 'radial-gradient(circle at 30% 30%, #ff00ff, #9333ea)'
                          : '#020617',

                    boxShadow:
                      v === 1
                        ? '0 0 20px rgba(0,255,255,0.9)'
                        : v === 2
                          ? '0 0 20px rgba(255,0,255,0.9)'
                          : 'inset 0 0 10px rgba(255,255,255,0.05)',
                  }}
                />
              </div>
            );
          })
        )}
      </div>

      <div className="mt-5 flex gap-6 font-mono text-xs tracking-[0.2em]">
        <div className="flex items-center gap-2 text-cyan-300">
          <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_10px_cyan]" />
          PLAYER 1
        </div>

        <div className="flex items-center gap-2 text-pink-300">
          <div className="h-3 w-3 rounded-full bg-pink-500 shadow-[0_0_10px_magenta]" />
          PLAYER 2
        </div>
      </div>
    </div>
  );
}