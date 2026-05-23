'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useGameStats } from '@/lib/store';

export interface GameResult {
  won: boolean;
  score: number;
  xp: number;
  message: string;
}

interface Props {
  result: GameResult;
  onPlayAgain: () => void;
  onChooseOther: () => void;
  onChangeMode: () => void;
}

export function ResultScreen({ result, onPlayAgain, onChooseOther, onChangeMode }: Props) {
  const streak = useGameStats((s) => s.streak);

  useEffect(() => {
    if (result.won) fireConfetti();
  }, [result.won]);

  return (
    <div className="relative overflow-hidden rounded-2xl glass py-12 text-center">
      <div id="confetti-host" className="pointer-events-none absolute inset-0" />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="mb-2 text-7xl text-white"
        style={{ filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.6))' }}
      >
        {result.won ? '✦' : '◇'}
      </motion.div>

      <h1 className="mono-text font-display text-4xl font-black">
        {result.won ? 'VICTORY' : 'GREAT MATCH'}
      </h1>

      <p className="mx-auto mt-3 max-w-md text-white/70">{result.message}</p>

      <div className="mx-auto mt-6 inline-flex gap-8 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-4">
        <Stat label="SCORE" value={result.score} />
        <Stat label="XP" value={`+${result.xp}`} />
        <Stat label="STREAK" value={streak} />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={onPlayAgain} className="btn btn-primary">↻ Play Again</button>
        <button onClick={onChangeMode} className="btn btn-ghost">⚙ Change Mode</button>
        <button onClick={onChooseOther} className="btn btn-ghost">◎ Choose Another</button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="font-mono text-[9px] tracking-widest text-white/40">{label}</div>
      <div className="mt-1 font-display text-2xl font-black text-white">{value}</div>
    </div>
  );
}

function fireConfetti() {
  const host = document.getElementById('confetti-host');
  if (!host) return;
  // Mono confetti — shades of white/gray
  const shades = ['#ffffff', '#cccccc', '#888888', '#666666', '#aaaaaa'];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement('div');
    c.style.cssText = `
      position: absolute;
      width: 8px; height: 8px;
      left: ${Math.random() * 100}%;
      top: 0;
      background: ${shades[Math.floor(Math.random() * shades.length)]};
      transform: rotate(${Math.random() * 360}deg);
      animation: confetti-fall 2s linear forwards;
      animation-delay: ${Math.random() * 0.5}s;
    `;
    host.appendChild(c);
    setTimeout(() => c.remove(), 2500);
  }
}
