'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GameResult } from '@/components/ui/ResultScreen';

import {
  createGame,
  rollDice,
  movePawn,
  canMovePawn,
  LudoState,
  TRACK_LENGTH,
  HOME_LENGTH,
  START_POSITIONS,
} from '@/lib/ludo';

interface Props {
  onFinish: (r: GameResult) => void;
}

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

/* CYBER PLAYER STYLES */
const PLAYER_STYLE = [
  {
    fill: '#00ffff',
    stroke: '#ffffff',
    glow: '0 0 18px rgba(0,255,255,0.9)',
    name: 'CYAN',
  },
  {
    fill: '#ff00ff',
    stroke: '#ffffff',
    glow: '0 0 18px rgba(255,0,255,0.9)',
    name: 'MAGENTA',
  },
];

export function Ludo({ onFinish }: Props) {
  const [state, setState] = useState<LudoState>(createGame);

  const [rolling, setRolling] = useState(false);

  const [diceDisplay, setDiceDisplay] = useState(1);

  useEffect(() => {
    if (state.winner !== null) {
      setTimeout(() => {
        onFinish({
          won: state.winner === 0,
          score: state.winner === 0 ? 200 : 80,
          xp: state.winner === 0 ? 80 : 25,
          message:
            state.winner === 0
              ? 'CYAN PLAYER WON!'
              : 'MAGENTA PLAYER WON!',
        });
      }, 600);
    }
  }, [state.winner, onFinish]);

  function handleRoll() {
    if (rolling || state.rolled || state.winner !== null) return;

    setRolling(true);

    let count = 0;

    const interval = setInterval(() => {
      setDiceDisplay(Math.floor(Math.random() * 6) + 1);

      count++;

      if (count > 10) {
        clearInterval(interval);

        const next = rollDice(state);

        setState(next);

        setDiceDisplay(next.dice);

        setRolling(false);
      }
    }, 60);
  }

  function handleMove(pawnIdx: number) {
    if (!state.rolled || state.winner !== null) return;

    const pawn =
      state.pawns[state.currentPlayer][pawnIdx];

    if (
      !canMovePawn(
        pawn,
        state.dice,
        state.currentPlayer,
        state
      )
    )
      return;

    setState(movePawn(state, pawnIdx));
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-5 text-center">
        <div className="font-mono text-sm tracking-[0.2em] text-white/70">
          {state.message}
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-8">
        {/* BOARD */}
        <LudoBoard state={state} />

        {/* SIDE PANEL */}
        <div className="flex w-64 flex-col gap-4">
          {[0, 1].map((player) => {
            const isActive =
              state.currentPlayer === player &&
              !state.winner;

            const ps = PLAYER_STYLE[player];

            return (
              <div
                key={player}
                className={`rounded-2xl border p-4 transition-all ${
                  isActive
                    ? 'border-cyan-400/60 bg-cyan-400/10'
                    : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className="font-mono text-xs tracking-[0.25em]"
                    style={{
                      color: ps.fill,
                    }}
                  >
                    {ps.name}
                  </span>

                  {isActive && (
                    <span className="text-xs text-white">
                      ▶ TURN
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {state.pawns[player].map((p, pi) => {
                    const canMove =
                      state.rolled &&
                      state.currentPlayer === player &&
                      canMovePawn(
                        p,
                        state.dice,
                        player as 0 | 1,
                        state
                      );

                    return (
                      <button
                        key={pi}
                        onClick={() =>
                          isActive && handleMove(pi)
                        }
                        disabled={!canMove}
                        className={`flex h-11 w-11 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                          canMove
                            ? 'animate-pulse scale-105'
                            : ''
                        }`}
                        style={{
                          background: p.inGoal
                            ? '#111827'
                            : ps.fill,

                          color: '#fff',

                          borderColor: '#fff',

                          boxShadow: canMove
                            ? ps.glow
                            : 'none',

                          opacity: p.inGoal ? 0.5 : 1,
                        }}
                      >
                        {p.inGoal
                          ? '✓'
                          : p.position === -1
                            ? 'B'
                            : p.position}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* DICE */}
          <div className="rounded-2xl border border-cyan-500/20 bg-[#030712] p-5 shadow-[0_0_40px_rgba(0,255,255,0.15)]">
            <div className="mb-2 text-center font-mono text-[10px] tracking-[0.3em] text-white/40">
              DICE
            </div>

            <motion.div
              key={diceDisplay + (rolling ? 'r' : 's')}
              initial={{
                scale: 0.5,
                rotate: -180,
              }}
              animate={{
                scale: 1,
                rotate: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              className="text-center text-8xl leading-none text-cyan-300"
              style={{
                textShadow:
                  '0 0 20px rgba(0,255,255,0.9)',
              }}
            >
              {DICE_FACES[diceDisplay - 1]}
            </motion.div>

            <button
              onClick={handleRoll}
              disabled={
                state.rolled ||
                rolling ||
                state.winner !== null
              }
              className="mt-4 w-full rounded-xl bg-cyan-400 py-3 font-bold text-black transition-all hover:scale-105 disabled:opacity-40"
            >
              {rolling
                ? 'ROLLING...'
                : state.rolled
                  ? 'SELECT PAWN'
                  : 'ROLL'}
            </button>
          </div>

          <div className="font-mono text-[10px] leading-relaxed text-white/40">
            <div>• ROLL 6 TO LEAVE BASE</div>
            <div>• CAPTURE ENEMY PAWNS</div>
            <div>• REACH CENTER TO WIN</div>
            <div>• 6 = EXTRA TURN</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* BOARD */
function LudoBoard({
  state,
}: {
  state: LudoState;
}) {
  const size = 360;

  const center = size / 2;

  const trackRadius = 145;

  const trackSquares = Array.from(
    { length: TRACK_LENGTH },
    (_, i) => {
      const angle =
        (i / TRACK_LENGTH) * 2 * Math.PI -
        Math.PI / 2;

      return {
        x:
          center +
          Math.cos(angle) * trackRadius,

        y:
          center +
          Math.sin(angle) * trackRadius,
      };
    }
  );

  function homeSquarePos(
    player: 0 | 1,
    homeIdx: number
  ) {
    const startAngle =
      (START_POSITIONS[player] /
        TRACK_LENGTH) *
        2 *
        Math.PI -
      Math.PI / 2;

    const r = trackRadius - 20 - homeIdx * 18;

    return {
      x: center + Math.cos(startAngle) * r,
      y: center + Math.sin(startAngle) * r,
    };
  }

  function pawnPosition(
    pawn: { position: number; inGoal: boolean },
    player: 0 | 1,
    pawnIdx: number
  ) {
    if (pawn.inGoal) {
      return {
        x:
          center +
          (pawnIdx === 0 ? -12 : 12),

        y:
          center +
          (player === 0 ? -12 : 12),
      };
    }

    if (pawn.position === -1) {
      const baseAngle =
        ((START_POSITIONS[player] + 5) /
          TRACK_LENGTH) *
          2 *
          Math.PI -
        Math.PI / 2;

      const r = trackRadius + 35;

      return {
        x:
          center +
          Math.cos(baseAngle) * r +
          (pawnIdx === 0 ? -8 : 8),

        y:
          center +
          Math.sin(baseAngle) * r,
      };
    }

    if (pawn.position < TRACK_LENGTH) {
      const sq = trackSquares[pawn.position];

      return {
        x: sq.x + (pawnIdx === 0 ? -5 : 5),
        y: sq.y,
      };
    }

    const homeIdx =
      pawn.position - TRACK_LENGTH;

    return homeSquarePos(player, homeIdx);
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rounded-3xl border border-cyan-500/20 bg-[#020617] shadow-[0_0_50px_rgba(0,255,255,0.12)]"
    >
      {/* TRACK */}
      {trackSquares.map((sq, i) => {
        const isStart0 =
          i === START_POSITIONS[0];

        const isStart1 =
          i === START_POSITIONS[1];

        return (
          <rect
            key={i}
            x={sq.x - 10}
            y={sq.y - 10}
            width={20}
            height={20}
            rx={4}
            fill={
              isStart0
                ? '#00ffff'
                : isStart1
                  ? '#ff00ff'
                  : '#0f172a'
            }
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={1}
          />
        );
      })}

      {/* HOME */}
      {[0, 1].map((p) =>
        Array.from({
          length: HOME_LENGTH,
        }).map((_, h) => {
          const pos = homeSquarePos(
            p as 0 | 1,
            h
          );

          return (
            <rect
              key={`${p}-${h}`}
              x={pos.x - 8}
              y={pos.y - 8}
              width={16}
              height={16}
              rx={3}
              fill={
                p === 0
                  ? 'rgba(0,255,255,0.4)'
                  : 'rgba(255,0,255,0.4)'
              }
              stroke="white"
              strokeWidth={0.7}
            />
          );
        })
      )}

      {/* CENTER */}
      <circle
        cx={center}
        cy={center}
        r={32}
        fill="rgba(255,255,255,0.08)"
        stroke="#00ffff"
        strokeWidth={2}
        strokeDasharray="4 4"
      />

      <text
        x={center}
        y={center + 4}
        textAnchor="middle"
        fontSize="12"
        fontFamily="monospace"
        fill="#ffffff"
        letterSpacing="3"
      >
        GOAL
      </text>

      {/* PAWNS */}
      {[0, 1].map((p) =>
        state.pawns[p].map((pawn, pi) => {
          const pos = pawnPosition(
            pawn,
            p as 0 | 1,
            pi
          );

          const style = PLAYER_STYLE[p];

          return (
            <g key={`${p}-${pi}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={8}
                fill={style.fill}
                stroke="#fff"
                strokeWidth={1.5}
                style={{
                  filter: `drop-shadow(${style.glow})`,
                }}
              />

              <text
                x={pos.x}
                y={pos.y + 3}
                textAnchor="middle"
                fontSize="8"
                fontWeight="bold"
                fill="#fff"
              >
                {pi + 1}
              </text>
            </g>
          );
        })
      )}
    </svg>
  );
}