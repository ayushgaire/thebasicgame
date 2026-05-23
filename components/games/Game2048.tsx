'use client';

import { useEffect, useState } from 'react';
import { GameResult } from '@/components/ui/ResultScreen';

const N = 4;

interface Props { onFinish: (r: GameResult) => void; }
type Board = number[][];

// Grayscale shades, lightening as value increases
function shadeFor(v: number): { bg: string; color: string } {
  if (!v) return { bg: 'rgba(255,255,255,0.03)', color: '#888' };
  const log = Math.log2(v);
  const lightness = Math.min(20 + log * 6, 95); // 26 → 95
  return {
    bg: `hsl(0, 0%, ${lightness}%)`,
    color: lightness > 60 ? '#000' : '#fff',
  };
}

function emptyBoard(): Board { return Array.from({ length: N }, () => Array(N).fill(0)); }

function spawn(b: Board): Board {
  const empty: [number, number][] = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (!b[i][j]) empty.push([i, j]);
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
    if (a[i] === a[i + 1]) { a[i] *= 2; gained += a[i]; a[i + 1] = 0; }
  }
  const out = a.filter((v) => v);
  while (out.length < N) out.push(0);
  return { row: out, gained };
}

function move(b: Board, dir: 'l' | 'r' | 'u' | 'd'): { board: Board; gained: number; changed: boolean } {
  let gained = 0;
  let next: Board;
  if (dir === 'l') next = b.map((r) => { const s = slide(r); gained += s.gained; return s.row; });
  else if (dir === 'r') next = b.map((r) => { const s = slide([...r].reverse()); gained += s.gained; return s.row.reverse(); });
  else if (dir === 'u') {
    next = emptyBoard();
    for (let j = 0; j < N; j++) {
      const col = b.map((r) => r[j]);
      const s = slide(col);
      gained += s.gained;
      for (let i = 0; i < N; i++) next[i][j] = s.row[i];
    }
  } else {
    next = emptyBoard();
    for (let j = 0; j < N; j++) {
      const col = b.map((r) => r[j]).reverse();
      const s = slide(col);
      gained += s.gained;
      const rv = s.row.reverse();
      for (let i = 0; i < N; i++) next[i][j] = rv[i];
    }
  }
  return { board: next, gained, changed: JSON.stringify(next) !== JSON.stringify(b) };
}

function isOver(b: Board): boolean {
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    if (!b[i][j]) return false;
    if (i + 1 < N && b[i][j] === b[i + 1][j]) return false;
    if (j + 1 < N && b[i][j] === b[i][j + 1]) return false;
  }
  return true;
}

export function Game2048({ onFinish }: Props) {
  const [board, setBoard] = useState<Board>(() => spawn(spawn(emptyBoard())));
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (over) return;
      const map: Record<string, 'l' | 'r' | 'u' | 'd'> = {
        ArrowLeft: 'l', ArrowRight: 'r', ArrowUp: 'u', ArrowDown: 'd',
      };
      if (!map[e.key]) return;
      e.preventDefault();
      const { board: nb, gained, changed } = move(board, map[e.key]);
      if (changed) {
        const spawned = spawn(nb);
        setBoard(spawned);
        setScore((s) => s + gained);
        if (isOver(spawned)) {
          setOver(true);
          const max = Math.max(...spawned.flat());
          setTimeout(() => onFinish({
            won: score + gained >= 200, score: score + gained, xp: 30,
            message: `You reached ${max}! Score: ${score + gained}`,
          }), 300);
        }
      }
    }
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [board, score, over, onFinish]);

  function endNow() {
    setOver(true);
    onFinish({ won: score >= 200, score, xp: 25, message: `Final score: ${score}` });
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 flex w-full max-w-md items-center justify-between font-mono text-sm">
        <span>Score: <b>{score}</b></span>
        <span className="text-xs text-white/40">Arrow keys</span>
        <button onClick={endNow} className="nav-btn">End</button>
      </div>
      <div
        className="grid gap-2 rounded-xl bg-white/[0.04] p-2"
        style={{ gridTemplateColumns: `repeat(${N}, 70px)` }}
      >
        {board.flat().map((v, i) => {
          const { bg, color } = shadeFor(v);
          return (
            <div
              key={i}
              className="flex h-[70px] w-[70px] items-center justify-center rounded-lg font-extrabold transition-all"
              style={{
                background: bg,
                color,
                fontSize: v >= 1024 ? 20 : v >= 128 ? 24 : 28,
              }}
            >
              {v || ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}
