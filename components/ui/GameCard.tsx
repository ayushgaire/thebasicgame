'use client';

import { motion } from 'framer-motion';
import { GameMeta } from '@/lib/games';

export function GameCard({ game, onClick }: { game: GameMeta; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/40 hover:bg-white/[0.06]"
    >
      <div className="mb-3 flex h-[88px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
        <span
          className="text-5xl"
          style={{
            filter: 'drop-shadow(0 0 16px rgba(255,255,255,0.4))',
            color: 'white',
          }}
        >
          {game.icon}
        </span>
      </div>

      <div className="text-sm font-bold">{game.name}</div>
      <div className="mt-0.5 text-[11px] text-white/50">{game.description}</div>

      <div className="mt-2">
        <span className="stat-pill font-mono text-[9px] tracking-widest">● PLAYABLE</span>
      </div>
    </motion.div>
  );
}
