'use client';

import { useEffect, useState } from 'react';
import { GameResult } from '@/components/ui/ResultScreen';
import { GameMode } from '@/components/ui/ModeSelector';

interface Props { mode: GameMode; onFinish: (r: GameResult) => void; }
type Cell = 'X' | 'O' | null;

const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const checkWin = (b: Cell[], p: 'X' | 'O') => WINS.some((w) => w.every((i) => b[i] === p));

function botPick(board: Cell[]): number {
  for (let i = 0; i < 9; i++) if (!board[i]) { const t = [...board]; t[i] = 'O'; if (checkWin(t, 'O')) return i; }
  for (let i = 0; i < 9; i++) if (!board[i]) { const t = [...board]; t[i] = 'X'; if (checkWin(t, 'X')) return i; }
  if (!board[4]) return 4;
  const corners = [0, 2, 6, 8].filter((i) => !board[i]);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  const empty = board.map((v, i) => (v ? null : i)).filter((x): x is number => x !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

export function TicTacToe({ mode, onFinish }: Props) {
  const isBot = mode !== 'multi';
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (over) return;
    if (isBot && turn === 'O') {
      const id = setTimeout(() => play(botPick(board)), 500);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, isBot, over]);

  function play(i: number) {
    if (over || board[i]) return;
    const next = [...board];
    next[i] = turn;
    setBoard(next);
    if (checkWin(next, turn)) {
      setOver(true);
      const won = isBot ? turn === 'X' : true;
      setTimeout(() => onFinish({
        won,
        score: turn === 'X' ? 100 : 50,
        xp: won ? 50 : 15,
        message: isBot
          ? turn === 'X' ? 'You outsmarted the bot!' : 'Bot got you. Run it back?'
          : `Player ${turn} wins!`,
      }), 500);
      return;
    }
    if (next.every((v) => v)) {
      setOver(true);
      setTimeout(() => onFinish({ won: false, score: 25, xp: 20, message: "It's a draw. Perfectly balanced." }), 500);
      return;
    }
    setTurn(turn === 'X' ? 'O' : 'X');
  }

  const status = over ? 'Game over'
    : isBot ? (turn === 'X' ? 'Your turn (X)' : 'Bot thinking…')
    : `Player ${turn}'s turn`;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-5 font-mono text-sm tracking-wider">{status}</div>
      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 90px)' }}>
        {board.map((v, i) => (
          <div
            key={i}
            onClick={() => (!isBot || turn === 'X') && play(i)}
            className="flex h-[90px] cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-5xl font-bold transition-all hover:scale-105 hover:bg-white/15"
            style={{ color: v === 'X' ? '#ffffff' : v === 'O' ? '#888888' : undefined }}
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  );
}
