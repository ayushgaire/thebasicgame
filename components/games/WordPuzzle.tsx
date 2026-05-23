'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GameResult } from '@/components/ui/ResultScreen';
import { WORDS, randomWord, scoreGuess, LetterState } from '@/lib/words';

interface Props { onFinish: (r: GameResult) => void; }

const MAX_ATTEMPTS = 6;
const WORD_LEN = 5;

const ROW1 = 'QWERTYUIOP'.split('');
const ROW2 = 'ASDFGHJKL'.split('');
const ROW3 = 'ZXCVBNM'.split('');

export function WordPuzzle({ onFinish }: Props) {
  const [target] = useState<string>(() => randomWord());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [scores, setScores] = useState<LetterState[][]>([]);
  const [over, setOver] = useState(false);
  const [shake, setShake] = useState(false);

  // Aggregate keyboard letter state — best known status per letter
  const keyStates: Record<string, LetterState | undefined> = {};
  guesses.forEach((g, gi) => {
    const s = scores[gi];
    g.split('').forEach((ch, i) => {
      const prev = keyStates[ch];
      const next = s[i];
      // Promote: absent < present < correct
      if (
        !prev ||
        (prev === 'absent' && next !== 'absent') ||
        (prev === 'present' && next === 'correct')
      ) {
        keyStates[ch] = next;
      }
    });
  });

  function submitGuess() {
    if (over) return;
    if (current.length !== WORD_LEN) {
      triggerShake();
      return;
    }
    const upper = current.toUpperCase();
    // Allow words not in list — too restrictive otherwise. (Optionally validate)
    const score = scoreGuess(upper, target);
    const newGuesses = [...guesses, upper];
    const newScores = [...scores, score];
    setGuesses(newGuesses);
    setScores(newScores);
    setCurrent('');

    if (upper === target) {
      setOver(true);
      setTimeout(() => {
        onFinish({
          won: true,
          score: Math.max(120 - newGuesses.length * 15, 30),
          xp: Math.max(80 - newGuesses.length * 10, 20),
          message: `Got it in ${newGuesses.length}/${MAX_ATTEMPTS}! The word was ${target}.`,
        });
      }, 800);
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setOver(true);
      setTimeout(() => {
        onFinish({
          won: false,
          score: 20,
          xp: 15,
          message: `Out of guesses! The word was ${target}.`,
        });
      }, 800);
    }
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 350);
  }

  function pressKey(k: string) {
    if (over) return;
    if (k === 'ENTER') return submitGuess();
    if (k === 'BACK') return setCurrent((c) => c.slice(0, -1));
    if (/^[A-Z]$/.test(k) && current.length < WORD_LEN) {
      setCurrent((c) => c + k);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (over) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        submitGuess();
        return;
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        setCurrent((c) => c.slice(0, -1));
        return;
      }
      const k = e.key.toUpperCase();
      if (/^[A-Z]$/.test(k) && current.length < WORD_LEN) {
        setCurrent((c) => c + k);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, over, guesses]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 font-mono text-xs tracking-widest text-white/50">
        GUESS THE 5-LETTER WORD · {guesses.length}/{MAX_ATTEMPTS}
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIdx) => {
          const guess = guesses[rowIdx];
          const score = scores[rowIdx];
          const isCurrentRow = rowIdx === guesses.length && !over;
          const letters = guess
            ? guess.split('')
            : isCurrentRow
              ? [...current.padEnd(WORD_LEN, ' ').split('')]
              : Array(WORD_LEN).fill(' ');

          return (
            <motion.div
              key={rowIdx}
              animate={isCurrentRow && shake ? { x: [-6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex gap-1.5"
            >
              {letters.map((ch, i) => {
                const state = score?.[i];
                let bg = 'transparent';
                let color = '#fff';
                let border = 'rgba(255,255,255,0.25)';

                if (state === 'correct') {
                  bg = '#ffffff';
                  color = '#000';
                  border = '#ffffff';
                } else if (state === 'present') {
                  bg = '#999';
                  color = '#000';
                  border = '#999';
                } else if (state === 'absent') {
                  bg = '#222';
                  color = '#666';
                  border = '#333';
                } else if (isCurrentRow && ch.trim()) {
                  border = 'rgba(255,255,255,0.6)';
                }

                return (
                  <motion.div
                    key={i}
                    initial={state ? { rotateX: 0 } : false}
                    animate={state ? { rotateX: [0, 90, 0] } : {}}
                    transition={{ delay: state ? i * 0.15 : 0, duration: 0.5 }}
                    className="flex h-12 w-12 items-center justify-center text-xl font-extrabold sm:h-14 sm:w-14 sm:text-2xl"
                    style={{
                      background: bg,
                      color,
                      border: `2px solid ${border}`,
                      borderRadius: 6,
                    }}
                  >
                    {ch.trim()}
                  </motion.div>
                );
              })}
            </motion.div>
          );
        })}
      </div>

      {/* Virtual keyboard */}
      <div className="mt-6 flex flex-col gap-1.5">
        {[ROW1, ROW2, [...['ENTER'], ...ROW3, 'BACK']].map((row, ri) => (
          <div key={ri} className="flex justify-center gap-1">
            {row.map((k) => {
              const st = keyStates[k];
              let bg = 'rgba(255,255,255,0.08)';
              let color = '#fff';
              if (st === 'correct') { bg = '#ffffff'; color = '#000'; }
              else if (st === 'present') { bg = '#999'; color = '#000'; }
              else if (st === 'absent') { bg = '#222'; color = '#555'; }
              const wide = k === 'ENTER' || k === 'BACK';

              return (
                <button
                  key={k}
                  onClick={() => pressKey(k)}
                  className="select-none rounded-md font-mono text-xs font-bold tracking-wider transition-transform active:scale-95"
                  style={{
                    background: bg,
                    color,
                    border: '1px solid rgba(255,255,255,0.12)',
                    width: wide ? 56 : 32,
                    height: 44,
                    padding: '0 4px',
                  }}
                >
                  {k === 'BACK' ? '⌫' : k}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-3 font-mono text-[10px] text-white/30">
        {WORDS.length} possible words · use your physical keyboard or tap above
      </div>
    </div>
  );
}
