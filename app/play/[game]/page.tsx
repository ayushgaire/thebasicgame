'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getGame } from '@/lib/games';
import { useGameStats } from '@/lib/store';
import { Background } from '@/components/ui/Background';
import { Footer } from '@/components/ui/Footer';
import { PoweredByBar } from '@/components/ui/PoweredByBar';
import { ResultScreen, GameResult } from '@/components/ui/ResultScreen';
import { ModeSelector, GameMode } from '@/components/ui/ModeSelector';

import { Chess } from '@/components/games/Chess';
import { Sudoku } from '@/components/games/Sudoku';
import { TicTacToe } from '@/components/games/TicTacToe';
import { Memory } from '@/components/games/Memory';
import { Snake } from '@/components/games/Snake';
import { RPS } from '@/components/games/RPS';
import { Game2048 } from '@/components/games/Game2048';
import { ConnectFour } from '@/components/games/ConnectFour';
import { Ludo } from '@/components/games/Ludo';
import { WordPuzzle } from '@/components/games/WordPuzzle';

export default function PlayPage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.game as string;
  const game = getGame(gameId);

  const [mode, setMode] = useState<GameMode | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [restartCounter, setRestartCounter] = useState(0);
  const recordWin = useGameStats((s) => s.recordWin);
  const recordLoss = useGameStats((s) => s.recordLoss);

  if (!game) {
    return (
      <main className="relative flex min-h-screen items-center justify-center pt-14">
        <Background />
        <PoweredByBar />
        <div className="relative z-10 text-center">
          <h1 className="font-display text-2xl font-bold">Game not found</h1>
          <button onClick={() => router.push('/dashboard')} className="btn btn-primary mt-4">
            Back to dashboard
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  const handleFinish = (r: GameResult) => {
    if (r.won) recordWin(gameId, r.xp);
    else recordLoss(gameId, Math.floor(r.xp / 2));
    setResult(r);
  };

  const handleRestart = () => {
    setResult(null);
    setRestartCounter((c) => c + 1);
  };

  const handleChangeMode = () => {
    setResult(null);
    setMode(null);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden pt-14">
      <Background />
      <PoweredByBar />

      <div className="relative z-10 mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => (mode ? handleChangeMode() : router.push('/dashboard'))}
            className="nav-btn"
          >
            ← {mode || result ? 'Modes' : 'Dashboard'}
          </button>
          <div className="text-lg font-bold">
            <span className="mr-2">{game.icon}</span>
            {game.name}
          </div>
          <div className="flex gap-2">
            {mode && !result && <span className="stat-pill font-mono text-[10px] tracking-widest">{labelForMode(mode)}</span>}
            {mode && !result && (
              <button onClick={handleRestart} className="nav-btn">
                ↻ Restart
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!mode && !result && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ModeSelector game={game} onSelect={setMode} />
            </motion.div>
          )}

          {mode && !result && (
            <motion.div
              key={`game-${mode}-${gameId}-${restartCounter}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass p-6 sm:p-8"
            >
              <GameComponent gameId={gameId} mode={mode} onFinish={handleFinish} />
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultScreen
                result={result}
                onPlayAgain={handleRestart}
                onChooseOther={() => router.push('/dashboard')}
                onChangeMode={handleChangeMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}

function labelForMode(m: GameMode): string {
  if (m === 'bot') return '⚙ BOT';
  if (m === 'multi') return '⚐ 2 PLAYER';
  if (m === 'solo') return '◉ SOLO';
  return m.toUpperCase();
}

function GameComponent({
  gameId,
  mode,
  onFinish,
}: {
  gameId: string;
  mode: GameMode;
  onFinish: (r: GameResult) => void;
}) {
  switch (gameId) {
    case 'chess':     return <Chess mode={mode} onFinish={onFinish} />;
    case 'sudoku':    return <Sudoku difficulty={mode as 'easy' | 'medium' | 'hard'} onFinish={onFinish} />;
    case 'tictactoe': return <TicTacToe mode={mode} onFinish={onFinish} />;
    case 'memory':    return <Memory onFinish={onFinish} />;
    case 'snake':     return <Snake onFinish={onFinish} />;
    case 'rps':       return <RPS onFinish={onFinish} />;
    case '2048':      return <Game2048 onFinish={onFinish} />;
    case 'connect4':  return <ConnectFour mode={mode} onFinish={onFinish} />;
    case 'ludo':      return <Ludo onFinish={onFinish} />;
    case 'word':      return <WordPuzzle onFinish={onFinish} />;
    default:          return <div>Unknown game</div>;
  }
}
