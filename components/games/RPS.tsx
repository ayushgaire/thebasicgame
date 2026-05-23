'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GameResult } from '@/components/ui/ResultScreen';

const CHOICES = ['🪨', '📄', '✂'];
const NAMES = ['ROCK', 'PAPER', 'SCISSORS'];

interface Props {
  onFinish: (r: GameResult) => void;
}

export function RPS({ onFinish }: Props) {
  const [you, setYou] = useState(0);
  const [bot, setBot] = useState(0);
  const [round, setRound] = useState(1);

  const [msg, setMsg] = useState(
    'CHOOSE YOUR MOVE'
  );

  const [anim, setAnim] = useState('');

  function play(yi: number) {
    if (
      round > 5 ||
      you === 3 ||
      bot === 3
    )
      return;

    const bi = Math.floor(
      Math.random() * 3
    );

    setAnim(
      `${CHOICES[yi]}  VS  ${CHOICES[bi]}`
    );

    let nextYou = you;
    let nextBot = bot;
    let m: string;

    if (yi === bi) {
      m = `DRAW — BOTH PLAYED ${NAMES[yi]}`;
    } else if ((yi + 1) % 3 === bi) {
      nextBot++;
      m = 'BOT WINS THE ROUND';
    } else {
      nextYou++;
      m = 'YOU WIN THE ROUND';
    }

    setYou(nextYou);
    setBot(nextBot);
    setMsg(m);

    const nextRound = round + 1;

    setRound(nextRound);

    if (
      nextRound > 5 ||
      nextYou === 3 ||
      nextBot === 3
    ) {
      setTimeout(() => {
        onFinish({
          won: nextYou > nextBot,
          score: nextYou * 40,
          xp:
            nextYou > nextBot
              ? 60
              : 20,

          message:
            nextYou > nextBot
              ? `YOU WON ${nextYou}-${nextBot}`
              : nextYou === nextBot
                ? `DRAW ${nextYou}-${nextBot}`
                : `BOT WON ${nextBot}-${nextYou}`,
        });
      }, 1000);
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* HEADER */}
      <div className="rounded-2xl border border-cyan-500/20 bg-[#020617]/80 px-6 py-3 font-mono text-xs tracking-[0.25em] text-cyan-300 shadow-[0_0_30px_rgba(0,255,255,0.15)] backdrop-blur-xl">
        BEST OF 5 · ROUND{' '}
        <b className="text-white">
          {Math.min(round, 5)}
        </b>
        /5
      </div>

      {/* SCOREBOARD */}
      <div className="mt-6 flex items-center gap-10 rounded-3xl border border-white/10 bg-[#020617]/70 px-10 py-5 shadow-[0_0_40px_rgba(0,255,255,0.08)] backdrop-blur-xl">
        <div className="text-center">
          <div className="font-mono text-xs tracking-[0.25em] text-cyan-300">
            YOU
          </div>

          <div className="mt-2 text-5xl font-black text-white">
            {you}
          </div>
        </div>

        <div className="font-mono text-lg tracking-[0.3em] text-white/30">
          VS
        </div>

        <div className="text-center">
          <div className="font-mono text-xs tracking-[0.25em] text-pink-300">
            BOT
          </div>

          <div className="mt-2 text-5xl font-black text-white">
            {bot}
          </div>
        </div>
      </div>

      {/* STATUS */}
      <motion.div
        key={msg}
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="mt-5 min-h-[24px] font-mono text-sm tracking-[0.2em] text-white/70"
      >
        {msg}
      </motion.div>

      {/* BATTLE */}
      <motion.div
        key={anim}
        initial={{
          scale: 0.6,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          duration: 0.35,
        }}
        className="my-6 flex min-h-[120px] items-center justify-center rounded-3xl border border-cyan-500/10 bg-[#020617]/60 px-10 py-6 text-6xl shadow-[0_0_50px_rgba(0,255,255,0.08)]"
      >
        {anim || '⚔️'}
      </motion.div>

      {/* BUTTONS */}
      <div className="flex flex-wrap justify-center gap-4">
        {CHOICES.map((c, i) => (
          <motion.button
            key={c}
            whileHover={{
              scale: 1.08,
              y: -4,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => play(i)}
            className="group relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#020617]/80 px-8 py-6 shadow-[0_0_30px_rgba(0,255,255,0.08)] transition-all duration-300"
          >
            {/* GLOW */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="text-5xl">
                {c}
              </div>

              <div className="mt-2 font-mono text-[10px] tracking-[0.25em] text-white/50">
                {NAMES[i]}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* FOOTER */}
      <div className="mt-6 font-mono text-[10px] tracking-[0.25em] text-white/30">
        CYBER ARENA MODE
      </div>
    </div>
  );
}