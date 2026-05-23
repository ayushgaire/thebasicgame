'use client';

import { useEffect, useState } from 'react';
import { GameResult } from '@/components/ui/ResultScreen';
import { generate, formatTime, Grid } from '@/lib/sudoku';

interface Props {
  difficulty: 'easy' | 'medium' | 'hard';
  onFinish: (r: GameResult) => void;
}

const GIVENS = { easy: 45, medium: 35, hard: 28 } as const;

export function Sudoku({ difficulty, onFinish }: Props) {
  const [loading, setLoading] = useState(true);
  const [solution, setSolution] = useState<Grid>([]);
  const [userGrid, setUserGrid] = useState<Grid>([]);
  const [fixed, setFixed] = useState<boolean[][]>([]);
  const [sel, setSel] = useState<[number, number] | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [wrongCell, setWrongCell] = useState<[number, number] | null>(null);
  const [startTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const { puzzle, solution } = generate(GIVENS[difficulty]);
      setSolution(solution);
      setUserGrid(puzzle.map((r) => [...r]));
      setFixed(puzzle.map((r) => r.map((v) => v !== 0)));
      setLoading(false);
    }, 30);
    return () => clearTimeout(t);
  }, [difficulty]);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(id);
  }, [startTime, done]);

  useEffect(() => {
    if (loading || done) return;
    const handler = (e: KeyboardEvent) => {
      if (!sel) return;
      if (e.key >= '1' && e.key <= '9') place(parseInt(e.key));
      else if (['Backspace', 'Delete', '0'].includes(e.key)) place(0);
      else if (e.key === 'ArrowUp' && sel[0] > 0) setSel([sel[0] - 1, sel[1]]);
      else if (e.key === 'ArrowDown' && sel[0] < 8) setSel([sel[0] + 1, sel[1]]);
      else if (e.key === 'ArrowLeft' && sel[1] > 0) setSel([sel[0], sel[1] - 1]);
      else if (e.key === 'ArrowRight' && sel[1] < 8) setSel([sel[0], sel[1] + 1]);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, userGrid, fixed, loading, done, mistakes]);

  function place(n: number) {
    if (!sel || done) return;
    const [r, c] = sel;
    if (fixed[r]?.[c]) return;

    if (n === 0) {
      const next = userGrid.map((row) => [...row]);
      next[r][c] = 0;
      setUserGrid(next);
      return;
    }

    if (n === solution[r][c]) {
      const next = userGrid.map((row) => [...row]);
      next[r][c] = n;
      setUserGrid(next);
      const won = next.every((row, ri) => row.every((v, ci) => v === solution[ri][ci]));
      if (won) {
        setDone(true);
        setTimeout(() => onFinish({
          won: true,
          score: Math.max(500 - elapsed - mistakes * 50, 100),
          xp: 100,
          message: `Solved in ${formatTime(elapsed)} with ${mistakes} mistake${mistakes !== 1 ? 's' : ''}!`,
        }), 400);
      }
    } else {
      const next = userGrid.map((row) => [...row]);
      next[r][c] = n;
      setUserGrid(next);
      setWrongCell([r, c]);
      const m = mistakes + 1;
      setMistakes(m);
      setTimeout(() => {
        const cleared = userGrid.map((row) => [...row]);
        cleared[r][c] = 0;
        setUserGrid(cleared);
        setWrongCell(null);
      }, 600);
      if (m >= 3) {
        setDone(true);
        setTimeout(() => onFinish({
          won: false, score: 50, xp: 15, message: 'Three strikes — Sudoku wins this round.',
        }), 400);
      }
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <div className="font-mono text-xs tracking-widest text-white/60">GENERATING {difficulty.toUpperCase()} PUZZLE</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 flex w-full max-w-md items-center justify-between font-mono text-sm">
        <span>◷ <b>{formatTime(elapsed)}</b></span>
        <span>✕ Mistakes: <b>{mistakes}</b>/3</span>
        <span className="text-white/80">{difficulty.toUpperCase()}</span>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-5">
        <div
          className="grid rounded-lg bg-black p-1 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          style={{ gridTemplateColumns: 'repeat(9, 40px)' }}
        >
          {userGrid.flatMap((row, r) =>
            row.map((v, c) => {
              const isFixed = fixed[r][c];
              const isSel = sel?.[0] === r && sel?.[1] === c;
              const isPeer = sel && (r === sel[0] || c === sel[1] ||
                (Math.floor(r / 3) === Math.floor(sel[0] / 3) &&
                 Math.floor(c / 3) === Math.floor(sel[1] / 3)));
              const isWrong = wrongCell && wrongCell[0] === r && wrongCell[1] === c;

              let bg = 'rgba(255,255,255,0.02)';
              if (isFixed) bg = 'rgba(255,255,255,0.08)';
              if (isPeer && !isSel) bg = 'rgba(255,255,255,0.04)';
              if (isSel) bg = 'rgba(255,255,255,0.2)';
              if (isWrong) bg = 'rgba(255,255,255,0.3)';

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => !isFixed && setSel([r, c])}
                  className="flex h-10 w-10 items-center justify-center font-bold transition-colors"
                  style={{
                    background: bg,
                    color: isWrong ? '#ff6b6b' : isFixed ? '#ffffff' : '#bbbbbb',
                    cursor: isFixed ? 'default' : 'pointer',
                    borderRight: c % 3 === 2 && c < 8 ? '2px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.05)',
                    borderBottom: r % 3 === 2 && r < 8 ? '2px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.05)',
                    boxShadow: isSel ? 'inset 0 0 0 2px #ffffff' : undefined,
                  }}
                >
                  {v || ''}
                </div>
              );
            })
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 self-start">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => place(n)}
              className="h-10 w-10 rounded-lg border border-white/20 bg-white/[0.05] text-lg font-bold transition-all hover:scale-110 hover:bg-white/20"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => place(0)}
            className="col-span-3 h-10 rounded-lg border border-white/20 bg-white/[0.05] text-base font-bold transition-all hover:bg-white/20"
          >
            ✕ Erase
          </button>
        </div>
      </div>
    </div>
  );
}
