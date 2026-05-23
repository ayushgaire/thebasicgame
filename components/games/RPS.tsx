'use client';

import { useState } from 'react';
import { GameResult } from '@/components/ui/ResultScreen';

const CHOICES = ['🪨', '📄', '✂'];
const NAMES = ['Rock', 'Paper', 'Scissors'];

interface Props { onFinish: (r: GameResult) => void; }

export function RPS({ onFinish }: Props) {
  const [you, setYou] = useState(0);
  const [bot, setBot] = useState(0);
  const [round, setRound] = useState(1);
  const [msg, setMsg] = useState('Make your move!');
  const [anim, setAnim] = useState('');

  function play(yi: number) {
    if (round > 5 || you === 3 || bot === 3) return;
    const bi = Math.floor(Math.random() * 3);
    setAnim(`${CHOICES[yi]}  vs  ${CHOICES[bi]}`);
    let nextYou = you, nextBot = bot, m: string;
    if (yi === bi) m = `Tie — both played ${NAMES[yi]}`;
    else if ((yi + 1) % 3 === bi) { nextBot++; m = 'Bot wins this round'; }
    else { nextYou++; m = 'You win this round!'; }
    setYou(nextYou); setBot(nextBot); setMsg(m);
    const nextRound = round + 1;
    setRound(nextRound);

    if (nextRound > 5 || nextYou === 3 || nextBot === 3) {
      setTimeout(() => onFinish({
        won: nextYou > nextBot,
        score: nextYou * 30,
        xp: nextYou > nextBot ? 50 : 15,
        message: nextYou > nextBot
          ? `You took the series ${nextYou}-${nextBot}!`
          : nextYou === nextBot
            ? `Series tied ${nextYou}-${nextBot}`
            : `Bot took it ${nextBot}-${nextYou}`,
      }), 900);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="font-mono text-xs tracking-widest text-white/50">
        BEST OF 5 · ROUND <b className="text-white">{Math.min(round, 5)}</b>/5
      </div>
      <div className="mt-3 flex gap-10 font-display text-2xl font-black">
        <div className="text-center">YOU<br /><span className="text-white">{you}</span></div>
        <div className="self-center text-lg text-white/30">vs</div>
        <div className="text-center">BOT<br /><span className="text-white/70">{bot}</span></div>
      </div>
      <div className="mt-4 min-h-[20px] text-sm text-white/70">{msg}</div>
      <div className="my-4 min-h-[60px] text-4xl font-mono tracking-widest">{anim}</div>
      <div className="flex gap-3">
        {CHOICES.map((c, i) => (
          <button
            key={c}
            onClick={() => play(i)}
            className="btn btn-ghost"
            style={{ fontSize: 32, padding: '16px 24px' }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
