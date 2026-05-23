'use client';

import { useEffect, useMemo, useState } from 'react';
import { GameResult } from '@/components/ui/ResultScreen';
import { GameMode } from '@/components/ui/ModeSelector';
import {
  Board,
  Color,
  Move,
  PIECE_GLYPHS,
  applyMove,
  botMove,
  findKing,
  gameStatus,
  inCheck,
  legalMoves,
  startingBoard,
} from '@/lib/chess';

interface Props {
  mode: GameMode;
  onFinish: (r: GameResult) => void;
}

export function Chess({ mode, onFinish }: Props) {
  const isBot = mode === 'bot';

  const [board, setBoard] = useState<Board>(() => startingBoard());
  const [turn, setTurn] = useState<Color>('w');
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [history, setHistory] = useState<Board[]>([]);
  const [over, setOver] = useState(false);

  const legalForSelected = useMemo<Move[]>(() => {
    if (!selected) return [];

    return legalMoves(board, turn).filter(
      (m) => m[0] === selected[0] && m[1] === selected[1]
    );
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

      setTimeout(() => {
        onFinish({
          won: youWon,
          score: youWon ? 200 : 100,
          xp: youWon ? 100 : 20,
          message: `Checkmate — ${winner} wins!`,
        });
      }, 400);
    } else if (status === 'stalemate') {
      setOver(true);

      setTimeout(() => {
        onFinish({
          won: false,
          score: 50,
          xp: 25,
          message: 'Stalemate — perfectly balanced.',
        });
      }, 400);
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
      const m = legalForSelected.find(
        ([, , tr, tc]) => tr === r && tc === c
      );

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

    setTurn((t) =>
      steps === 1 ? (t === 'w' ? 'b' : 'w') : t
    );
  }

  function resign() {
    setOver(true);

    onFinish({
      won: false,
      score: 0,
      xp: 10,
      message: isBot
        ? 'Resigned — bot takes it.'
        : 'Resigned.',
    });
  }

  const statusText = over
    ? 'Game Over'
    : isBot && turn === 'b'
      ? 'BOT THINKING...'
      : `${turn === 'w' ? 'WHITE' : 'BLACK'} TO MOVE`;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 font-mono text-sm tracking-[0.25em] text-white/80">
        {checked && !over && (
          <span className="mr-3 text-pink-500">
            ⚠ CHECK
          </span>
        )}

        {statusText}
      </div>

      <div
        className="grid overflow-hidden rounded-2xl border border-cyan-500/30 bg-black shadow-[0_0_50px_rgba(0,255,255,0.15)]"
        style={{
          gridTemplateColumns: 'repeat(8, 56px)',
          gridTemplateRows: 'repeat(8, 56px)',
        }}
      >
        {board.flatMap((row, r) =>
          row.map((piece, c) => {
            const isLight = (r + c) % 2 === 0;

            const isSel =
              selected?.[0] === r &&
              selected?.[1] === c;

            const legalHere = legalForSelected.find(
              ([, , tr, tc]) => tr === r && tc === c
            );

            const isKingChecked =
              kingPos &&
              kingPos[0] === r &&
              kingPos[1] === c;

            const bg = isKingChecked
              ? '#ff0055'
              : isLight
                ? '#0f172a'
                : '#111827';

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => handleSquare(r, c)}
                className="relative flex cursor-pointer items-center justify-center transition-all duration-200 hover:brightness-125"
                style={{
                  background: bg,

                  boxShadow: isSel
                    ? 'inset 0 0 0 3px #00ffff, 0 0 20px rgba(0,255,255,0.5)'
                    : undefined,
                }}
              >
                {piece && (
                  <span
                    className="select-none text-[36px]"
                    style={{
                      color:
                        piece[0] === 'w'
                          ? '#00ffff'
                          : '#ff00ff',

                      textShadow:
                        piece[0] === 'w'
                          ? '0 0 15px #00ffff'
                          : '0 0 15px #ff00ff',
                    }}
                  >
                    {
                      PIECE_GLYPHS[
                        piece[1] as keyof typeof PIECE_GLYPHS
                      ]
                    }
                  </span>
                )}

                {legalHere && (
                  <span
                    className="absolute"
                    style={
                      piece
                        ? {
                            inset: 4,
                            borderRadius: '50%',
                            border:
                              '3px solid rgba(0,255,255,0.9)',
                          }
                        : {
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            background:
                              'rgba(0,255,255,0.8)',
                            boxShadow:
                              '0 0 10px rgba(0,255,255,0.9)',
                          }
                    }
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={undo}
          className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm text-cyan-300 transition-all hover:scale-105 hover:bg-cyan-500/20"
        >
          ↶ Undo
        </button>

        <button
          onClick={resign}
          className="rounded-xl border border-pink-500/30 bg-pink-500/10 px-5 py-2 text-sm text-pink-300 transition-all hover:scale-105 hover:bg-pink-500/20"
        >
          ⚐ Resign
        </button>
      </div>
    </div>
  );
}