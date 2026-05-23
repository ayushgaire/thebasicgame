'use client';

import { useEffect, useState } from 'react';
import { GameResult } from '@/components/ui/ResultScreen';
import { GameMode } from '@/components/ui/ModeSelector';

const W = 7;
const H = 6;
type Board = number[][];

function emptyBoard(): Board { return Array.from({ length: H }, () => Array(W).fill(0)); }

function checkWin(b: Board, p: number): boolean {
  for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
    if (b[r][c] !== p) continue;
    for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
      let ok = true;
      for (let k = 0; k < 4; k++) {
        const nr = r + dr * k, nc = c + dc * k;
        if (nr < 0 || nr >= H || nc < 0 || nc >= W || b[nr][nc] !== p) { ok = false; break; }
      }
      if (ok) return true;
    }
  }
  return false;
}

function drop(b: Board, col: number, p: number): Board | null {
  const next = b.map((r) => [...r]);
  for (let r = H - 1; r >= 0; r--) if (!next[r][col]) { next[r][col] = p; return next; }
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
  for (let c = 0; c < W; c++) if (!b[0][c]) valid.push(c);
  const weights = valid.map((c) => 4 - Math.abs(c - 3));
  const sum = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * sum;
  for (let i = 0; i < valid.length; i++) {
    r -= weights[i];
    if (r <= 0) return valid[i];
  }
  return valid[0];
}

interface Props { mode: GameMode; onFinish: (r: GameResult) => void; }

export function ConnectFour({ mode, onFinish }: Props) {
  const isBot = mode !== 'multi';
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (over) return;
    if (isBot && turn === 2) {
      const id = setTimeout(() => play(botMove(board)), 600);
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
      setTimeout(() => onFinish({
        won, score: turn === 1 ? 100 : 50, xp: won ? 60 : 15,
        message: isBot
          ? turn === 1 ? 'You connected four!' : 'Bot got the win.'
          : `Player ${turn} wins!`,
      }), 600);
      return;
    }
    if (next[0].every((v) => v)) {
      setOver(true);
      setTimeout(() => onFinish({ won: false, score: 40, xp: 20, message: 'Board full — solid draw.' }), 500);
      return;
    }
    setTurn(turn === 1 ? 2 : 1);
  }

  const status = over ? 'Game over'
    : isBot ? (turn === 1 ? 'Your turn (●)' : 'Bot thinking…')
    : `Player ${turn} (${turn === 1 ? '●' : '○'})`;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 font-mono text-sm tracking-wider">{status}</div>
      <div
        className="grid gap-1 rounded-lg bg-white/[0.06] p-2"
        style={{ gridTemplateColumns: `repeat(${W}, 44px)` }}
      >
        {board.flatMap((row, r) =>
          row.map((v, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => (!isBot || turn === 1) && play(c)}
              className="h-11 w-11 cursor-pointer rounded-full transition-all"
              style={{
                background: v === 1
                  ? 'radial-gradient(circle at 30% 30%, #fff, #aaa)'
                  : v === 2
                    ? 'radial-gradient(circle at 30% 30%, #555, #1a1a1a)'
                    : 'rgba(0,0,0,0.6)',
                border: v === 2 ? '1px solid rgba(255,255,255,0.2)' : undefined,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
