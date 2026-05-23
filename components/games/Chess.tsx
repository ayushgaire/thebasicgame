'use client';

import { useEffect, useMemo, useState } from 'react';
import { GameResult } from '@/components/ui/ResultScreen';
import { GameMode } from '@/components/ui/ModeSelector';
import {
  Board, Color, Move, PIECE_GLYPHS, applyMove, botMove, findKing,
  gameStatus, inCheck, legalMoves, startingBoard,
} from '@/lib/chess';

interface Props { mode: GameMode; onFinish: (r: GameResult) => void; }

export function Chess({ mode, onFinish }: Props) {
  const isBot = mode === 'bot';
  const [board, setBoard] = useState<Board>(() => startingBoard());
  const [turn, setTurn] = useState<Color>('w');
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [history, setHistory] = useState<Board[]>([]);
  const [over, setOver] = useState(false);

  const legalForSelected = useMemo<Move[]>(() => {
    if (!selected) return [];
    return legalMoves(board, turn).filter((m) => m[0] === selected[0] && m[1] === selected[1]);
  }, [board, turn, selected]);

  const status = gameStatus(board, turn);
  const checked = inCheck(board, turn);
  const kingPos = checked ? findKing(board, turn) : null;

  useEffect(() => {
    if (over) return;
    if (status === 'checkmate') {
      setOver(true);
      const winner = turn === 'w' ? 'Black' : 'White';
      const youWon = isBot ? winner === 'White' : true;
      setTimeout(() => onFinish({
        won: youWon, score: youWon ? 200 : 100, xp: youWon ? 100 : 20,
        message: `Checkmate — ${winner} wins!`,
      }), 400);
    } else if (status === 'stalemate') {
      setOver(true);
      setTimeout(() => onFinish({ won: false, score: 50, xp: 25, message: 'Stalemate — perfectly balanced.' }), 400);
    }
  }, [status, turn, over, isBot, onFinish]);

  useEffect(() => {
    if (!isBot || turn !== 'b' || over) return;
    const id = setTimeout(() => {
      const m = botMove(board, 'b');
      if (m) doMove(m);
    }, 500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, isBot, over]);

  function doMove(m: Move) {
    setHistory((h) => [...h, board]);
    setBoard((b) => applyMove(b, m));
    setSelected(null);
    setTurn((t) => (t === 'w' ? 'b' : 'w'));
  }

  function handleSquare(r: number, c: number) {
    if (over || (isBot && turn === 'b')) return;
    if (selected) {
      const m = legalForSelected.find(([, , tr, tc]) => tr === r && tc === c);
      if (m) return doMove(m);
      const p = board[r][c];
      if (p && p[0] === turn) return setSelected([r, c]);
      return setSelected(null);
    }
    const p = board[r][c];
    if (p && p[0] === turn) setSelected([r, c]);
  }

  function undo() {
    if (!history.length || over) return;
    const steps = isBot && history.length >= 2 ? 2 : 1;
    setBoard(history[history.length - steps]);
    setHistory((h) => h.slice(0, -steps));
    setSelected(null);
    setTurn((t) => (steps === 1 ? (t === 'w' ? 'b' : 'w') : t));
  }

  function resign() {
    setOver(true);
    onFinish({ won: false, score: 0, xp: 10, message: isBot ? 'Resigned — bot takes it.' : 'Resigned.' });
  }

  const statusText = over ? 'Game over'
    : isBot && turn === 'b' ? 'Bot thinking…'
    : `${turn === 'w' ? 'White' : 'Black'} to move`;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 min-h-[24px] font-mono text-sm tracking-wider">
        {checked && !over && <span className="mr-2 font-bold text-white">⚠ CHECK</span>}
        {statusText}
      </div>

      <div
        className="grid overflow-hidden rounded-lg border-2 border-white/30 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
        style={{ gridTemplateColumns: 'repeat(8, 48px)', gridTemplateRows: 'repeat(8, 48px)' }}
      >
        {board.flatMap((row, r) =>
          row.map((piece, c) => {
            const isLight = (r + c) % 2 === 0;
            const isSel = selected?.[0] === r && selected?.[1] === c;
            const legalHere = legalForSelected.find(([, , tr, tc]) => tr === r && tc === c);
            const isKingChecked = kingPos && kingPos[0] === r && kingPos[1] === c;

            const bg = isKingChecked ? '#ffffff' : isLight ? '#e8e8e8' : '#3a3a3a';

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => handleSquare(r, c)}
                className="relative flex cursor-pointer items-center justify-center select-none transition-all"
                style={{
                  background: bg,
                  boxShadow: isSel ? 'inset 0 0 0 3px #ffffff, inset 0 0 0 4px #000' : undefined,
                }}
              >
                {piece && (
                  <span
                    className="text-[32px]"
                    style={{
                      color: piece[0] === 'w' ? '#ffffff' : '#000000',
                      textShadow: piece[0] === 'w'
                        ? '0 0 2px #000, 0 2px 4px rgba(0,0,0,0.6)'
                        : '0 0 2px #fff, 0 1px 2px rgba(255,255,255,0.3)',
                    }}
                  >
                    {PIECE_GLYPHS[piece[1] as keyof typeof PIECE_GLYPHS]}
                  </span>
                )}
                {legalHere && (
                  <span
                    className="absolute"
                    style={piece
                      ? { inset: 4, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.9)', mixBlendMode: 'difference' }
                      : { width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', mixBlendMode: 'difference' }
                    }
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={undo} className="nav-btn">↶ Undo</button>
        <button onClick={resign} className="nav-btn">⚐ Resign</button>
      </div>
    </div>
  );
}
