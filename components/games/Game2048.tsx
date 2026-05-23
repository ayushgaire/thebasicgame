'use client';

import { useEffect, useState } from 'react';
import { GameResult } from '@/components/ui/ResultScreen';

const N = 4;

interface Props {
  onFinish: (r: GameResult) => void;
}

type Board = number[][];

/* CYBER COLORS */
function tileStyle(v: number): { bg: string; color: string; glow: string } {
  if (!v) {
    return {
      bg: '#0a0f1f',
      color: '#666',
      glow: 'none',
    };
  }

  const styles: Record<number, { bg: string; color: string; glow: string }> = {
    2: {
      bg: 'linear-gradient(135deg,#0ea5e9,#06b6d4)',
      color: '#fff',
      glow: '0 0 18px rgba(14,165,233,0.8)',
    },
    4: {
      bg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
      color: '#fff',
      glow: '0 0 18px rgba(139,92,246,0.8)',
    },
    8: {
      bg: 'linear-gradient(135deg,#ec4899,#db2777)',
      color: '#fff',
      glow: '0 0 20px rgba(236,72,153,0.8)',
    },
    16: {
      bg: 'linear-gradient(135deg,#f43f5e,#e11d48)',
      color: '#fff',
      glow: '0 0 22px rgba(244,63,94,0.8)',
    },
    32: {
      bg: 'linear-gradient(135deg,#f97316,#ea580c)',
      color: '#fff',
      glow: '0 0 22px rgba(249,115,22,0.8)',
    },
    64: {
      bg: 'linear-gradient(135deg,#eab308,#ca8a04)',
      color: '#000',
      glow: '0 0 24px rgba(234,179,8,0.9)',
    },
    128: {
      bg: 'linear-gradient(135deg,#22c55e,#16a34a)',
      color: '#fff',
      glow: '0 0 24px rgba(34,197,94,0.9)',
    },
    256: {
      bg: 'linear-gradient(135deg,#06b6d4,#0891b2)',
      color: '#fff',
      glow: '0 0 26px rgba(6,182,212,0.9)',
    },
    512: {
      bg: 'linear-gradient(135deg,#3b82f6,#2563eb)',
      color: '#fff',
      glow: '0 0 28px rgba(59,130,246,0.9)',
    },
    1024: {
      bg: 'linear-gradient(135deg,#a855f7,#9333ea)',
      color: '#fff',
      glow: '0 0 30px rgba(168,85,247,1)',
    },
    2048: {
      bg: 'linear-gradient(135deg,#ffffff,#d1d5db)',
      color: '#000',
      glow: '0 0 34px rgba(255,255,255,1)',
    },
  };

  return (
    styles[v] || {
      bg: 'linear-gradient(135deg,#ffffff,#999)',
      color: '#000',
      glow: '0 0 36px rgba(255,255,255,1)',
    }
  );
}

function emptyBoard(): Board {
  return Array.from({ length: N }, () => Array(N).fill(0));
}

function spawn(b: Board): Board {
  const empty: [number, number][] = [];

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (!b[i][j]) empty.push([i, j]);
    }
  }

  if (!empty.length) return b;

  const next = b.map((r) => [...r]);

  const [r, c] = empty[Math.floor(Math.random() * empty.length)];

  next[r][c] = Math.random() < 0.9 ? 2 : 4;

  return next;
}

function slide(row: number[]): { row: number[]; gained: number } {
  const a = row.filter((v) => v);

  let gained = 0;

  for (let i = 0; i < a.length - 1; i++) {
    if (a[i] === a[i + 1]) {
      a[i] *= 2;
      gained += a[i];
      a[i + 1] = 0;
    }
  }

  const out = a.filter((v) => v);

  while (out.length < N) out.push(0);

  return { row: out, gained };
}

function move(
  b: Board,
  dir: 'l' | 'r' | 'u' | 'd'
): { board: Board; gained: number; changed: boolean } {
  let gained = 0;

  let next: Board;

  if (dir === 'l') {
    next = b.map((r) => {
      const s = slide(r);
      gained += s.gained;
      return s.row;
    });
  } else if (dir === 'r') {
    next = b.map((r) => {
      const s = slide([...r].reverse());
      gained += s.gained;
      return s.row.reverse();
    });
  } else if (dir === 'u') {
    next = emptyBoard();

    for (let j = 0; j < N; j++) {
      const col = b.map((r) => r[j]);

      const s = slide(col);

      gained += s.gained;

      for (let i = 0; i < N; i++) {
        next[i][j] = s.row[i];
      }
    }
  } else {
    next = emptyBoard();

    for (let j = 0; j < N; j++) {
      const col = b.map((r) => r[j]).reverse();

      const s = slide(col);

      gained += s.gained;

      const rv = s.row.reverse();

      for (let i = 0; i < N; i++) {
        next[i][j] = rv[i];
      }
    }
  }

  return {
    board: next,
    gained,
    changed: JSON.stringify(next) !== JSON.stringify(b),
  };
}

function isOver(b: Board): boolean {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (!b[i][j]) return false;

      if (i + 1 < N && b[i][j] === b[i + 1][j]) return false;

      if (j + 1 < N && b[i][j] === b[i][j + 1]) return false;
    }
  }

  return true;
}

export function Game2048({ onFinish }: Props) {
  const [board, setBoard] = useState<Board>(() =>
    spawn(spawn(emptyBoard()))
  );

  const [score, setScore] = useState(0);

  const [over, setOver] = useState(false);

  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (over) return;

      const map: Record<string, 'l' | 'r' | 'u' | 'd'> = {
        ArrowLeft: 'l',
        ArrowRight: 'r',
        ArrowUp: 'u',
        ArrowDown: 'd',
      };

      if (!map[e.key]) return;

      e.preventDefault();

      const { board: nb, gained, changed } = move(
        board,
        map[e.key]
      );

      if (changed) {
        const spawned = spawn(nb);

        setBoard(spawned);

        setScore((s) => s + gained);

        if (isOver(spawned)) {
          setOver(true);

          const max = Math.max(...spawned.flat());

          setTimeout(() => {
            onFinish({
              won: score + gained >= 200,
              score: score + gained,
              xp: 30,
              message: `You reached ${max}! Score: ${score + gained}`,
            });
          }, 300);
        }
      }
    }

    window.addEventListener('keydown', key);

    return () => window.removeEventListener('keydown', key);
  }, [board, score, over, onFinish]);

  function endNow() {
    setOver(true);

    onFinish({
      won: score >= 200,
      score,
      xp: 25,
      message: `Final score: ${score}`,
    });
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex w-full max-w-md items-center justify-between font-mono text-sm tracking-[0.2em]">
        <span className="text-cyan-300">
          SCORE <b className="text-white">{score}</b>
        </span>

        <span className="text-xs text-white/40">
          ARROW KEYS
        </span>

        <button onClick={endNow} className="nav-btn">
          END
        </button>
      </div>

      <div
        className="grid gap-3 rounded-3xl border border-cyan-500/20 bg-[#030712] p-4 shadow-[0_0_60px_rgba(0,255,255,0.15)]"
        style={{
          gridTemplateColumns: `repeat(${N}, 82px)`,
        }}
      >
        {board.flat().map((v, i) => {
          const { bg, color, glow } = tileStyle(v);

          return (
            <div
              key={i}
              className="flex h-[82px] w-[82px] items-center justify-center rounded-2xl font-black transition-all duration-200"
              style={{
                background: bg,
                color,
                boxShadow: glow,
                fontSize:
                  v >= 1024
                    ? 20
                    : v >= 128
                      ? 24
                      : 30,

                border:
                  v === 0
                    ? '1px solid rgba(255,255,255,0.05)'
                    : '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {v || ''}
            </div>
          );
        })}
      </div>

      <div className="mt-5 font-mono text-xs tracking-[0.2em] text-white/40">
        MERGE • GLOW • REACH 2048
      </div>
    </div>
  );
}