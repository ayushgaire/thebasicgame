'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GameResult } from '@/components/ui/ResultScreen';
import {
  WORDS,
  randomWord,
  scoreGuess,
  LetterState,
} from '@/lib/words';

interface Props {
  onFinish: (r: GameResult) => void;
}

const MAX_ATTEMPTS = 6;
const WORD_LEN = 5;

const ROW1 = 'QWERTYUIOP'.split('');
const ROW2 = 'ASDFGHJKL'.split('');
const ROW3 = 'ZXCVBNM'.split('');

export function WordPuzzle({
  onFinish,
}: Props) {
  const [target] = useState<string>(
    () => randomWord()
  );

  const [guesses, setGuesses] =
    useState<string[]>([]);

  const [current, setCurrent] =
    useState('');

  const [scores, setScores] =
    useState<LetterState[][]>(
      []
    );

  const [over, setOver] =
    useState(false);

  const [shake, setShake] =
    useState(false);

  // Keyboard states
  const keyStates: Record<
    string,
    LetterState | undefined
  > = {};

  guesses.forEach((g, gi) => {
    const s = scores[gi];

    g.split('').forEach(
      (ch, i) => {
        const prev =
          keyStates[ch];

        const next = s[i];

        if (
          !prev ||
          (prev ===
            'absent' &&
            next !==
              'absent') ||
          (prev ===
            'present' &&
            next ===
              'correct')
        ) {
          keyStates[ch] =
            next;
        }
      }
    );
  });

  function submitGuess() {
    if (over) return;

    if (
      current.length !==
      WORD_LEN
    ) {
      triggerShake();
      return;
    }

    const upper =
      current.toUpperCase();

    const score =
      scoreGuess(
        upper,
        target
      );

    const newGuesses = [
      ...guesses,
      upper,
    ];

    const newScores = [
      ...scores,
      score,
    ];

    setGuesses(newGuesses);
    setScores(newScores);
    setCurrent('');

    if (upper === target) {
      setOver(true);

      setTimeout(() => {
        onFinish({
          won: true,

          score: Math.max(
            120 -
              newGuesses.length *
                15,
            30
          ),

          xp: Math.max(
            80 -
              newGuesses.length *
                10,
            20
          ),

          message: `YOU GUESSED "${target}"`,
        });
      }, 1000);
    } else if (
      newGuesses.length >=
      MAX_ATTEMPTS
    ) {
      setOver(true);

      setTimeout(() => {
        onFinish({
          won: false,
          score: 20,
          xp: 15,
          message: `WORD WAS "${target}"`,
        });
      }, 1000);
    }
  }

  function triggerShake() {
    setShake(true);

    setTimeout(
      () => setShake(false),
      350
    );
  }

  function pressKey(k: string) {
    if (over) return;

    if (k === 'ENTER')
      return submitGuess();

    if (k === 'BACK')
      return setCurrent((c) =>
        c.slice(0, -1)
      );

    if (
      /^[A-Z]$/.test(k) &&
      current.length <
        WORD_LEN
    ) {
      setCurrent(
        (c) => c + k
      );
    }
  }

  useEffect(() => {
    function onKey(
      e: KeyboardEvent
    ) {
      if (over) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        submitGuess();
        return;
      }

      if (
        e.key === 'Backspace'
      ) {
        e.preventDefault();

        setCurrent((c) =>
          c.slice(0, -1)
        );

        return;
      }

      const k =
        e.key.toUpperCase();

      if (
        /^[A-Z]$/.test(k) &&
        current.length <
          WORD_LEN
      ) {
        setCurrent(
          (c) => c + k
        );
      }
    }

    window.addEventListener(
      'keydown',
      onKey
    );

    return () =>
      window.removeEventListener(
        'keydown',
        onKey
      );
  }, [
    current,
    over,
    guesses,
  ]);

  return (
    <div className="flex flex-col items-center">
      {/* HEADER */}
      <div className="mb-5 rounded-2xl border border-cyan-500/20 bg-[#020617]/80 px-6 py-3 font-mono text-xs tracking-[0.35em] text-cyan-300 shadow-[0_0_30px_rgba(0,255,255,0.15)] backdrop-blur-xl">
        WORD PUZZLE •{' '}
        {guesses.length}/
        {MAX_ATTEMPTS}
      </div>

      {/* GRID */}
      <div className="flex flex-col gap-2">
        {Array.from({
          length:
            MAX_ATTEMPTS,
        }).map((_, rowIdx) => {
          const guess =
            guesses[rowIdx];

          const score =
            scores[rowIdx];

          const isCurrentRow =
            rowIdx ===
              guesses.length &&
            !over;

          const letters = guess
            ? guess.split('')
            : isCurrentRow
              ? [
                  ...current
                    .padEnd(
                      WORD_LEN,
                      ' '
                    )
                    .split(''),
                ]
              : Array(
                  WORD_LEN
                ).fill(' ');

          return (
            <motion.div
              key={rowIdx}
              animate={
                isCurrentRow &&
                shake
                  ? {
                      x: [
                        -8,
                        8,
                        -6,
                        6,
                        0,
                      ],
                    }
                  : { x: 0 }
              }
              transition={{
                duration: 0.3,
              }}
              className="flex gap-2"
            >
              {letters.map(
                (ch, i) => {
                  const state =
                    score?.[i];

                  let bg =
                    'rgba(255,255,255,0.03)';

                  let color =
                    '#fff';

                  let border =
                    'rgba(255,255,255,0.08)';

                  let glow =
                    '0 0 15px rgba(0,0,0,0.2)';

                  if (
                    state ===
                    'correct'
                  ) {
                    bg =
                      'rgba(34,197,94,0.2)';
                    color =
                      '#4ade80';
                    border =
                      'rgba(34,197,94,0.8)';
                    glow =
                      '0 0 25px rgba(34,197,94,0.45)';
                  } else if (
                    state ===
                    'present'
                  ) {
                    bg =
                      'rgba(250,204,21,0.18)';
                    color =
                      '#fde047';
                    border =
                      'rgba(250,204,21,0.7)';
                    glow =
                      '0 0 25px rgba(250,204,21,0.3)';
                  } else if (
                    state ===
                    'absent'
                  ) {
                    bg =
                      'rgba(255,255,255,0.04)';
                    color =
                      '#666';
                    border =
                      'rgba(255,255,255,0.06)';
                  } else if (
                    isCurrentRow &&
                    ch.trim()
                  ) {
                    border =
                      'rgba(0,255,255,0.6)';
                    glow =
                      '0 0 20px rgba(0,255,255,0.25)';
                  }

                  return (
                    <motion.div
                      key={i}
                      initial={{
                        scale: 0.9,
                        opacity: 0,
                      }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl font-black uppercase backdrop-blur-xl"
                      style={{
                        background:
                          bg,
                        color,
                        border:
                          `2px solid ${border}`,
                        boxShadow:
                          glow,
                        textShadow:
                          state ===
                            'correct'
                            ? '0 0 18px rgba(34,197,94,0.7)'
                            : state ===
                                'present'
                              ? '0 0 18px rgba(250,204,21,0.6)'
                              : undefined,
                      }}
                    >
                      {ch.trim()}
                    </motion.div>
                  );
                }
              )}
            </motion.div>
          );
        })}
      </div>

      {/* KEYBOARD */}
      <div className="mt-8 flex flex-col gap-2">
        {[
          ROW1,
          ROW2,
          [
            ...['ENTER'],
            ...ROW3,
            'BACK',
          ],
        ].map((row, ri) => (
          <div
            key={ri}
            className="flex justify-center gap-1.5"
          >
            {row.map((k) => {
              const st =
                keyStates[k];

              let bg =
                'rgba(255,255,255,0.05)';

              let color =
                '#fff';

              let border =
                'rgba(255,255,255,0.08)';

              if (
                st ===
                'correct'
              ) {
                bg =
                  'rgba(34,197,94,0.25)';
                color =
                  '#4ade80';
                border =
                  'rgba(34,197,94,0.8)';
              } else if (
                st ===
                'present'
              ) {
                bg =
                  'rgba(250,204,21,0.2)';
                color =
                  '#fde047';
                border =
                  'rgba(250,204,21,0.7)';
              } else if (
                st ===
                'absent'
              ) {
                bg =
                  'rgba(255,255,255,0.03)';
                color =
                  '#555';
                border =
                  'rgba(255,255,255,0.04)';
              }

              const wide =
                k === 'ENTER' ||
                k === 'BACK';

              return (
                <motion.button
                  key={k}
                  whileTap={{
                    scale: 0.92,
                  }}
                  whileHover={{
                    scale: 1.05,
                  }}
                  onClick={() =>
                    pressKey(k)
                  }
                  className="rounded-xl border font-mono text-xs font-bold tracking-widest backdrop-blur-xl transition-all"
                  style={{
                    background:
                      bg,
                    color,
                    border:
                      `1px solid ${border}`,
                    width: wide
                      ? 68
                      : 42,
                    height: 50,
                  }}
                >
                  {k === 'BACK'
                    ? '⌫'
                    : k}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="mt-5 font-mono text-[10px] tracking-[0.35em] text-white/25">
        CYBER WORD ENGINE •{' '}
        {WORDS.length} WORDS
      </div>
    </div>
  );
}