'use client';

import { useEffect, useRef, useState } from 'react';
import { GameResult } from '@/components/ui/ResultScreen';

const W = 16;
const H = 14;
const TICK_MS = 150;

interface Props { onFinish: (r: GameResult) => void; }
type Vec = { x: number; y: number };

export function Snake({ onFinish }: Props) {
  const [snake, setSnake] = useState<Vec[]>([
    { x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 },
  ]);
  const [food, setFood] = useState<Vec>({ x: 12, y: 7 });
  const [score, setScore] = useState(0);
  const dirRef = useRef<Vec>({ x: 1, y: 0 });
  const deadRef = useRef(false);

  function placeFood(sn: Vec[]): Vec {
    while (true) {
      const f = { x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H) };
      if (!sn.some((s) => s.x === f.x && s.y === f.y)) return f;
    }
  }

  useEffect(() => {
    function key(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      const d = dirRef.current;
      if ((k === 'arrowup' || k === 'w') && d.y !== 1) dirRef.current = { x: 0, y: -1 };
      else if ((k === 'arrowdown' || k === 's') && d.y !== -1) dirRef.current = { x: 0, y: 1 };
      else if ((k === 'arrowleft' || k === 'a') && d.x !== 1) dirRef.current = { x: -1, y: 0 };
      else if ((k === 'arrowright' || k === 'd') && d.x !== -1) dirRef.current = { x: 1, y: 0 };
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
    }
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (deadRef.current) return;
      setSnake((sn) => {
        const head = { x: sn[0].x + dirRef.current.x, y: sn[0].y + dirRef.current.y };
        if (
          head.x < 0 || head.x >= W ||
          head.y < 0 || head.y >= H ||
          sn.some((s) => s.x === head.x && s.y === head.y)
        ) {
          deadRef.current = true;
          const final = score;
          setTimeout(() => onFinish({
            won: final >= 50, score: final, xp: Math.floor(final / 2),
            message: `You scored ${final}!`,
          }), 300);
          return sn;
        }
        const ns = [head, ...sn];
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 10);
          setFood(placeFood(ns));
        } else ns.pop();
        return ns;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [food, score, onFinish]);

  function endGame() {
    deadRef.current = true;
    onFinish({ won: score >= 50, score, xp: Math.floor(score / 2), message: `Final score: ${score}` });
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 flex w-full max-w-sm items-center justify-between font-mono text-sm">
        <span>Score: <b>{score}</b></span>
        <span className="text-xs text-white/40">Arrow keys / WASD</span>
        <button onClick={endGame} className="nav-btn">End</button>
      </div>
      <div
        className="grid gap-px rounded-lg bg-white/5 p-1"
        style={{
          gridTemplateColumns: `repeat(${W}, 22px)`,
          gridTemplateRows: `repeat(${H}, 22px)`,
        }}
      >
        {Array.from({ length: W * H }).map((_, i) => {
          const x = i % W;
          const y = Math.floor(i / W);
          const headIdx = snake[0]?.x === x && snake[0]?.y === y;
          const body = !headIdx && snake.some((s) => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;
          let style: React.CSSProperties = { background: 'rgba(255,255,255,0.03)' };
          if (headIdx) style = { background: '#fff', borderRadius: 5, boxShadow: '0 0 10px rgba(255,255,255,0.7)' };
          else if (body) style = { background: '#ddd', borderRadius: 3 };
          else if (isFood) style = { background: '#fff', borderRadius: '50%', animation: 'pulse 1s infinite' };
          return <div key={i} style={style} />;
        })}
      </div>
    </div>
  );
}
