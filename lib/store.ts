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

const DEFAULT_STATE: GameStats = {
  xp: 0,
  totalWins: 0,
  streak: 0,
  lastPlayed: null,
  winsByGame: {},
};

export const useGameStats = create<GameStats & Actions>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      recordWin: (gameId, xpGain = 50) =>
        set((state) => ({
          xp: state.xp + xpGain,
          totalWins: state.totalWins + 1,
          streak: state.streak + 1,
          lastPlayed: gameId,

          winsByGame: {
            ...state.winsByGame,
            [gameId]: (state.winsByGame[gameId] ?? 0) + 1,
          },
        })),

      recordLoss: (gameId, xpGain = 10) =>
        set((state) => ({
          xp: state.xp + xpGain,
          streak: 0,
          lastPlayed: gameId,
        })),

      reset: () => set(DEFAULT_STATE),
    }),

    {
      name: 'tbg-stats',
    }
  )
);