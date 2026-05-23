'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GAMES, FUN_FACTS } from '@/lib/games';
import { useGameStats } from '@/lib/store';
import { Background } from '@/components/ui/Background';
import { Footer } from '@/components/ui/Footer';
import { PoweredByBar } from '@/components/ui/PoweredByBar';
import { GameCard } from '@/components/ui/GameCard';

export default function DashboardPage() {
  const router = useRouter();
  const xp = useGameStats((s) => s.xp);
  const wins = useGameStats((s) => s.totalWins);
  const streak = useGameStats((s) => s.streak);
  const reset = useGameStats((s) => s.reset);

  const [fact, setFact] = useState(FUN_FACTS[0]);
  useEffect(() => {
    setFact(FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]);
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden pt-14">
      <Background />
      <PoweredByBar />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-3"
        >
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-white/40">WELCOME BACK</div>
            <h1 className="mt-1 font-display text-3xl font-black sm:text-4xl">
              Hey, <span className="mono-text">Player One</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="stat-pill">★ {xp} XP</span>
            <span className="stat-pill">▲ {wins} WINS</span>
            <span className="stat-pill">≡ {streak} STREAK</span>
            <button
              onClick={() => {
                if (confirm('Reset all stats?')) reset();
              }}
              className="nav-btn"
              title="Reset stats"
            >
              ↻ Reset
            </button>
            <button onClick={() => router.push('/')} className="nav-btn">
              ↩ Home
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {GAMES.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.04 }}
            >
              <GameCard game={game} onClick={() => router.push(`/play/${game.id}`)} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-5"
          >
            <div className="mb-2 font-mono text-[10px] tracking-[0.3em] text-white/40">
              ◌ FUN FACT
            </div>
            <div className="text-sm leading-relaxed text-white/80">{fact}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
            className="glass p-5"
          >
            <div className="mb-2 font-mono text-[10px] tracking-[0.3em] text-white/40">
              ◇ ACHIEVEMENTS
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge unlocked={wins >= 1}>FIRST WIN</Badge>
              <Badge unlocked={streak >= 3}>STREAK x3</Badge>
              <Badge unlocked={wins >= 10}>10 WINS</Badge>
              <Badge unlocked={xp >= 500}>500 XP</Badge>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function Badge({ children, unlocked }: { children: React.ReactNode; unlocked: boolean }) {
  return (
    <span className="stat-pill font-mono text-[10px] tracking-widest" style={{ opacity: unlocked ? 1 : 0.35 }}>
      {unlocked ? '✓' : '○'} {children}
    </span>
  );
}
