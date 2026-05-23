'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function GameCard({ game }: any) {
  return (
    <Link href={`/play/${game.id}`}>

      <motion.div
        whileHover={{
          y: -8,
          scale: 1.02,
        }}
        transition={{ duration: 0.25 }}
        className={`
          relative overflow-hidden rounded-3xl
          border border-white/10
          bg-white/[0.03]
          p-6 backdrop-blur-xl
          transition-all duration-300
          hover:border-white/20
          hover:shadow-2xl
          ${game.glow}
        `}
      >

        <div
          className={`
            absolute inset-0 opacity-10
            bg-gradient-to-br ${game.color}
          `}
        />

        <div className="relative z-10">

          <div
            className={`
              mb-6 flex h-32 items-center justify-center
              rounded-2xl
              bg-gradient-to-br ${game.color}
              text-6xl font-black text-white
              shadow-2xl
            `}
          >
            {game.icon}
          </div>

          <h2 className="text-3xl font-black text-white">
            {game.name}
          </h2>

          <p className="mt-2 text-white/60">
            {game.description}
          </p>

          <button
            className={`
              mt-6 rounded-full px-5 py-2
              text-sm font-bold text-white
              bg-gradient-to-r ${game.button}
              shadow-lg
            `}
          >
            ▶ PLAY NOW
          </button>

        </div>
      </motion.div>

    </Link>
  );
}