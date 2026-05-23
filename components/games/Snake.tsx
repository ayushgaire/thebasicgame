'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GameResult } from '@/components/ui/ResultScreen';

const W = 16;
const H = 14;
const TICK_MS = 120;

interface Props {
  onFinish: (r: GameResult) => void;
}

type Vec = {
  x: number;
  y: number;
};

export function Snake({ onFinish }: Props) {
  const [snake, setSnake] = useState<Vec[]>([
    { x: 8, y: 7 },
    { x: 7, y: 7 },
    { x: 6, y: 7 },
  ]);

  const [food, setFood] = useState<Vec>({
    x: 12,
    y: 7,
  });

  const [score, setScore] = useState(0);

  const dirRef = useRef<Vec>({
    x: 1,
    y: 0,
  });

  const deadRef = useRef(false);

  function placeFood(sn: Vec[]): Vec {
    while (true) {
      const f = {
        x: Math.floor(Math.random() * W),
        y: Math.floor(Math.random() * H),
      };

      if (
        !sn.some(
          (s) =>
            s.x === f.x &&
            s.y === f.y
        )
      ) {
        return f;
      }
    }
  }

  useEffect(() => {
    function key(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      const d = dirRef.current;

      if (
        (k === 'arrowup' || k === 'w') &&
        d.y !== 1
      ) {
        dirRef.current = {
          x: 0,
          y: -1,
        };
      } else if (
        (k === 'arrowdown' || k === 's') &&
        d.y !== -1
      ) {
        dirRef.current = {
          x: 0,
          y: 1,
        };
      } else if (
        (k === 'arrowleft' || k === 'a') &&
        d.x !== 1
      ) {
        dirRef.current = {
          x: -1,
          y: 0,
        };
      } else if (
        (k === 'arrowright' || k === 'd') &&
        d.x !== -1
      ) {
        dirRef.current = {
          x: 1,
          y: 0,
        };
      }

      if (
        [
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
        ].includes(e.key)
      ) {
        e.preventDefault();
      }
    }

    window.addEventListener(
      'keydown',
      key
    );

    return () =>
      window.removeEventListener(
        'keydown',
        key
      );
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (deadRef.current) return;

      setSnake((sn) => {
        const head = {
          x:
            sn[0].x +
            dirRef.current.x,

          y:
            sn[0].y +
            dirRef.current.y,
        };

        if (
          head.x < 0 ||
          head.x >= W ||
          head.y < 0 ||
          head.y >= H ||
          sn.some(
            (s) =>
              s.x === head.x &&
              s.y === head.y
          )
        ) {
          deadRef.current = true;

          const final = score;

          setTimeout(() => {
            onFinish({
              won: final >= 60,
              score: final,
              xp: Math.floor(final / 2),

              message: `GAME OVER • SCORE ${final}`,
            });
          }, 500);

          return sn;
        }

        const ns = [head, ...sn];

        if (
          head.x === food.x &&
          head.y === food.y
        ) {
          setScore((s) => s + 10);

          setFood(placeFood(ns));
        } else {
          ns.pop();
        }

        return ns;
      });
    }, TICK_MS);

    return () => clearInterval(id);
  }, [food, score, onFinish]);

  function endGame() {
    deadRef.current = true;

    onFinish({
      won: score >= 60,
      score,
      xp: Math.floor(score / 2),

      message: `FINAL SCORE ${score}`,
    });
  }

  return (
    <div className="flex flex-col items-center">
      {/* TOP BAR */}
      <div className="mb-4 flex w-full max-w-xl items-center justify-between rounded-2xl border border-cyan-500/20 bg-[#020617]/80 px-5 py-3 font-mono text-sm shadow-[0_0_30px_rgba(0,255,255,0.12)] backdrop-blur-xl">
        <span className="tracking-[0.2em] text-cyan-300">
          SCORE:{' '}
          <b className="text-white">
            {score}
          </b>
        </span>

        <span className="text-[10px] tracking-[0.2em] text-white/40">
          WASD / ARROWS
        </span>

        <button
          onClick={endGame}
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-[10px] tracking-[0.2em] text-red-300 transition-all hover:bg-red-500/20"
        >
          END
        </button>
      </div>

      {/* GAME BOARD */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="grid rounded-3xl border border-cyan-500/10 bg-[#020617]/90 p-3 shadow-[0_0_60px_rgba(0,255,255,0.08)]"
        style={{
          gridTemplateColumns: `repeat(${W}, 24px)`,
          gridTemplateRows: `repeat(${H}, 24px)`,
          gap: '2px',
        }}
      >
        {Array.from({
          length: W * H,
        }).map((_, i) => {
          const x = i % W;
          const y = Math.floor(i / W);

          const head =
            snake[0]?.x === x &&
            snake[0]?.y === y;

          const body =
            !head &&
            snake.some(
              (s) =>
                s.x === x &&
                s.y === y
            );

          const isFood =
            food.x === x &&
            food.y === y;

          let style: React.CSSProperties =
            {
              background:
                'rgba(255,255,255,0.03)',
              borderRadius: 4,
            };

          if (head) {
            style = {
              background:
                'linear-gradient(135deg,#00ffff,#ffffff)',

              borderRadius: 6,

              boxShadow:
                '0 0 16px rgba(0,255,255,0.8)',
            };
          } else if (body) {
            style = {
              background:
                'linear-gradient(135deg,#06b6d4,#0ea5e9)',

              borderRadius: 5,

              boxShadow:
                '0 0 8px rgba(0,255,255,0.35)',
            };
          } else if (isFood) {
            style = {
              background:
                'linear-gradient(135deg,#ff00ff,#ff66ff)',

              borderRadius: '999px',

              boxShadow:
                '0 0 18px rgba(255,0,255,0.8)',

              animation:
                'pulse 1s infinite',
            };
          }

          return (
            <motion.div
              key={i}
              animate={
                head
                  ? {
                      scale: [1, 1.1, 1],
                    }
                  : {}
              }
              transition={{
                duration: 0.4,
                repeat: Infinity,
              }}
              style={style}
            />
          );
        })}
      </motion.div>

      {/* FOOTER */}
      <div className="mt-5 font-mono text-[10px] tracking-[0.25em] text-white/30">
        CYBER SNAKE MODE
      </div>
    </div>
  );
}