'use client';

import { motion } from 'framer-motion';
import { GameMeta } from '@/lib/games';

export type GameMode = 'solo' | 'bot' | 'multi' | 'easy' | 'medium' | 'hard';

interface Props {
  game: GameMeta;
  onSelect: (mode: GameMode) => void;
}

const MODE_INFO: Record<GameMode, { icon: string; label: string; desc: string }> = {
  solo:   { icon: '◉', label: 'Solo',          desc: 'Practice at your own pace' },
  bot:    { icon: '⚙', label: 'vs Bot',        desc: 'Sharpen against AI' },
  multi:  { icon: '⚐', label: 'Local 2P',      desc: 'Same device, two players' },
  easy:   { icon: '○', label: 'Easy',          desc: '~45 givens, gentle warm-up' },
  medium: { icon: '◐', label: 'Medium',        desc: '~35 givens, balanced' },
  hard:   { icon: '●', label: 'Hard',          desc: '~28 givens, real challenge' },
};

export function ModeSelector({ game, onSelect }: Props) {
  return (
    <div>
      <div className="mb-8 text-center">
        <div className="text-6xl text-white" style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.4))' }}>
          {game.icon}
        </div>
        <h2 className="mt-2 font-display text-3xl font-black">{game.name}</h2>
        <p className="mt-1 text-sm text-white/60">{game.description} — pick a mode</p>
      </div>

      <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-3">
        {game.modes.map((mode) => {
          const info = MODE_INFO[mode];
          return (
            <motion.button
              key={mode}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(mode)}
              className="w-44 cursor-pointer rounded-xl border border-white/15 bg-white/[0.04] p-4 text-left transition-all hover:border-white/40 hover:bg-white/[0.1]"
            >
              <div className="text-3xl">{info.icon}</div>
              <div className="mt-2 font-bold">{info.label}</div>
              <div className="mt-1 text-[11px] text-white/60">{info.desc}</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
