'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameStats {
  xp: number;
  totalWins: number;
  streak: number;
  lastPlayed: string | null;
  winsByGame: Record<string, number>;
}

interface Actions {
  recordWin: (gameId: string, xpGain?: number) => void;
  recordLoss: (gameId: string, xpGain?: number) => void;
  reset: () => void;
}

const DEFAULT: GameStats = {
  xp: 0,
  totalWins: 0,
  streak: 0,
  lastPlayed: null,
  winsByGame: {},
};

export const useGameStats = create<GameStats & Actions>()(
  persist(
    (set) => ({
      ...DEFAULT,
      recordWin: (gameId, xpGain = 50) =>
        set((s) => ({
          xp: s.xp + xpGain,
          totalWins: s.totalWins + 1,
          streak: s.streak + 1,
          lastPlayed: gameId,
          winsByGame: { ...s.winsByGame, [gameId]: (s.winsByGame[gameId] ?? 0) + 1 },
        })),
      recordLoss: (gameId, xpGain = 10) =>
        set((s) => ({ xp: s.xp + xpGain, streak: 0, lastPlayed: gameId })),
      reset: () => set(DEFAULT),
    }),
    { name: 'tbg-stats' }
  )
);
