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

interface Props { onFinish: (r: GameResult) => void; }

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

// Player colors — strictly mono
const PLAYER_STYLE = [
  { fill: '#ffffff', stroke: '#000', label: 'P1', name: 'WHITE' },
  { fill: '#1a1a1a', stroke: '#fff', label: 'P2', name: 'BLACK' },
];

export function Ludo({ onFinish }: Props) {
  const [state, setState] = useState<LudoState>(createGame);
  const [rolling, setRolling] = useState(false);
  const [diceDisplay, setDiceDisplay] = useState(1);

  useEffect(() => {
    if (state.winner !== null) {
      setTimeout(() => onFinish({
        won: state.winner === 0, // Player 1 wins counts as "won"
        score: state.winner === 0 ? 200 : 80,
        xp: state.winner === 0 ? 80 : 25,
        message: state.winner === 0
          ? 'Player 1 brought both pawns home first!'
          : 'Player 2 took the race. Rematch?',
      }), 600);
    }
  }, [state.winner, onFinish]);

  function handleRoll() {
    if (rolling || state.rolled || state.winner !== null) return;
    setRolling(true);

    // Animated dice tumble
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
    const pawn = state.pawns[state.currentPlayer][pawnIdx];
    if (!canMovePawn(pawn, state.dice, state.currentPlayer, state)) return;
    setState(movePawn(state, pawnIdx));
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center text-sm">
        <div className="font-mono tracking-wider">{state.message}</div>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-6">
        {/* Board */}
        <LudoBoard state={state} />

        {/* Side panel */}
        <div className="flex w-56 flex-col gap-4">
          {/* Player rosters */}
          {[0, 1].map((player) => {
            const isActive = state.currentPlayer === player && !state.winner;
            const ps = PLAYER_STYLE[player];
            return (
              <div
                key={player}
                className={`rounded-xl border p-3 transition-all ${
                  isActive ? 'border-white bg-white/10' : 'border-white/15 bg-white/[0.03]'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-xs tracking-widest">{ps.name}</span>
                  {isActive && <span className="font-mono text-[10px] text-white">▶ TURN</span>}
                </div>
                <div className="flex gap-2">
                  {state.pawns[player].map((p, pi) => {
                    const canMove =
                      state.rolled &&
                      state.currentPlayer === player &&
                      canMovePawn(p, state.dice, player as 0 | 1, state);
                    return (
                      <button
                        key={pi}
                        onClick={() => isActive && handleMove(pi)}
                        disabled={!canMove}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-all ${
                          canMove
                            ? 'animate-pulse cursor-pointer ring-2 ring-white'
                            : 'cursor-default'
                        }`}
                        style={{
                          background: p.inGoal ? '#444' : ps.fill,
                          color: ps.fill === '#ffffff' ? '#000' : '#fff',
                          borderColor: ps.stroke,
                          opacity: p.inGoal ? 0.5 : 1,
                        }}
                        title={
                          p.inGoal
                            ? 'Goal reached!'
                            : p.position === -1
                              ? 'In base'
                              : `Position ${p.position}`
                        }
                      >
                        {p.inGoal ? '✓' : p.position === -1 ? 'B' : p.position}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Dice */}
          <div className="glass flex flex-col items-center p-4">
            <div className="mb-2 font-mono text-[10px] tracking-widest text-white/40">DICE</div>
            <motion.div
              key={diceDisplay + (rolling ? 'r' : 's')}
              initial={{ scale: 0.5, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.3 }}
              className="text-7xl leading-none"
            >
              {DICE_FACES[diceDisplay - 1]}
            </motion.div>
            <button
              onClick={handleRoll}
              disabled={state.rolled || rolling || state.winner !== null}
              className="btn btn-primary mt-3 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
            >
              {rolling ? 'Rolling…' : state.rolled ? 'Pick a pawn ↑' : '⚀ Roll'}
            </button>
          </div>

          <div className="font-mono text-[10px] leading-relaxed text-white/40">
            <div>• Roll 6 to leave base</div>
            <div>• Land on opponent to capture</div>
            <div>• Reach all pawns to goal</div>
            <div>• 6, capture, or goal = extra turn</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Render the Ludo board as a circular track with pawns positioned on it.
 */
function LudoBoard({ state }: { state: LudoState }) {
  const size = 340;
  const center = size / 2;
  const trackRadius = 140;
  const trackInner = 110;

  // Generate track square positions in a circle
  const trackSquares = Array.from({ length: TRACK_LENGTH }, (_, i) => {
    const angle = (i / TRACK_LENGTH) * 2 * Math.PI - Math.PI / 2;
    return {
      x: center + Math.cos(angle) * trackRadius,
      y: center + Math.sin(angle) * trackRadius,
      angle,
    };
  });

  // Home stretches (radial lines toward center)
  function homeSquarePos(player: 0 | 1, homeIdx: number) {
    const startAngle = (START_POSITIONS[player] / TRACK_LENGTH) * 2 * Math.PI - Math.PI / 2;
    const r = trackRadius - 20 - homeIdx * 18;
    return {
      x: center + Math.cos(startAngle) * r,
      y: center + Math.sin(startAngle) * r,
    };
  }

  function pawnPosition(pawn: { position: number; inGoal: boolean }, player: 0 | 1, pawnIdx: number) {
    if (pawn.inGoal) {
      // Stack in center
      return { x: center + (pawnIdx === 0 ? -10 : 10), y: center + (player === 0 ? -10 : 10) };
    }
    if (pawn.position === -1) {
      // In base — show off-board
      const baseAngle = ((START_POSITIONS[player] + 5) / TRACK_LENGTH) * 2 * Math.PI - Math.PI / 2;
      const r = trackRadius + 30;
      return {
        x: center + Math.cos(baseAngle) * r + (pawnIdx === 0 ? -8 : 8),
        y: center + Math.sin(baseAngle) * r,
      };
    }
    if (pawn.position < TRACK_LENGTH) {
      const sq = trackSquares[pawn.position];
      return { x: sq.x + (pawnIdx === 0 ? -5 : 5), y: sq.y };
    }
    // Home stretch
    const homeIdx = pawn.position - TRACK_LENGTH;
    return homeSquarePos(player, homeIdx);
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rounded-2xl border border-white/15 bg-white/[0.02]"
    >
      {/* Track squares */}
      {trackSquares.map((sq, i) => {
        const isStart0 = i === START_POSITIONS[0];
        const isStart1 = i === START_POSITIONS[1];
        return (
          <rect
            key={i}
            x={sq.x - 9}
            y={sq.y - 9}
            width={18}
            height={18}
            rx={3}
            fill={isStart0 ? '#ffffff' : isStart1 ? '#444' : 'rgba(255,255,255,0.05)'}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={0.5}
          />
        );
      })}

      {/* Home stretches */}
      {[0, 1].map((p) =>
        Array.from({ length: HOME_LENGTH }).map((_, h) => {
          const pos = homeSquarePos(p as 0 | 1, h);
          return (
            <rect
              key={`h${p}-${h}`}
              x={pos.x - 8}
              y={pos.y - 8}
              width={16}
              height={16}
              rx={2}
              fill={p === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(80,80,80,0.5)'}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={0.5}
            />
          );
        })
      )}

      {/* Center goal */}
      <circle
        cx={center}
        cy={center}
        r={28}
        fill="rgba(255,255,255,0.1)"
        stroke="white"
        strokeWidth={2}
        strokeDasharray="3 3"
      />
      <text
        x={center}
        y={center + 4}
        textAnchor="middle"
        fontSize="11"
        fontFamily="monospace"
        fill="white"
        letterSpacing="2"
      >
        GOAL
      </text>

      {/* Pawns */}
      {[0, 1].map((p) =>
        state.pawns[p].map((pawn, pi) => {
          const pos = pawnPosition(pawn, p as 0 | 1, pi);
          const style = PLAYER_STYLE[p];
          return (
            <g key={`pawn-${p}-${pi}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={7}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth={1.5}
              />
              <text
                x={pos.x}
                y={pos.y + 3}
                textAnchor="middle"
                fontSize="8"
                fontWeight="bold"
                fill={style.fill === '#ffffff' ? '#000' : '#fff'}
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
