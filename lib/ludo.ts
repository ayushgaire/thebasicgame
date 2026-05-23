/**
 * Simplified Ludo engine.
 *
 * Two players, each with 2 pawns. Linear track of 40 squares + 5 home squares.
 * - Each pawn starts in BASE (position = -1)
 * - Need to roll a 6 to enter (position 0 for P1, position 20 for P2)
 * - Move clockwise around the 40-square track
 * - Then enter your home stretch (last 5 squares before goal)
 * - First player to bring both pawns to the goal wins
 * - Landing on opponent's pawn sends it back to base
 * - Safe squares: starting squares and the home stretch
 *
 * This is a manageable, fun version of Ludo that fits one screen.
 */

export const TRACK_LENGTH = 40;
export const HOME_LENGTH = 5;
export const PAWNS_PER_PLAYER = 2;

export interface Pawn {
  position: number;     // -1 = base, 0..TRACK_LENGTH-1 = on track, TRACK_LENGTH..TRACK_LENGTH+HOME_LENGTH-1 = home stretch, TRACK_LENGTH+HOME_LENGTH = goal
  inGoal: boolean;
}

export interface LudoState {
  pawns: [Pawn[], Pawn[]]; // [player1pawns, player2pawns]
  currentPlayer: 0 | 1;
  dice: number;          // 0 = not rolled yet
  rolled: boolean;
  winner: 0 | 1 | null;
  message: string;
}

export const START_POSITIONS = [0, 20] as const;

export function createGame(): LudoState {
  return {
    pawns: [
      Array.from({ length: PAWNS_PER_PLAYER }, () => ({ position: -1, inGoal: false })),
      Array.from({ length: PAWNS_PER_PLAYER }, () => ({ position: -1, inGoal: false })),
    ],
    currentPlayer: 0,
    dice: 0,
    rolled: false,
    winner: null,
    message: "Player 1's turn — roll the dice!",
  };
}

export function rollDice(state: LudoState): LudoState {
  if (state.rolled || state.winner) return state;
  const value = Math.floor(Math.random() * 6) + 1;
  const playerPawns = state.pawns[state.currentPlayer];
  const canMove = playerPawns.some((p) => canMovePawn(p, value, state.currentPlayer, state));

  if (!canMove) {
    // Skip turn — no possible move
    return {
      ...state,
      dice: value,
      rolled: false,
      currentPlayer: state.currentPlayer === 0 ? 1 : 0,
      message: `Player ${state.currentPlayer + 1} rolled ${value} — no valid moves. Player ${state.currentPlayer === 0 ? 2 : 1}'s turn.`,
    };
  }

  return {
    ...state,
    dice: value,
    rolled: true,
    message: `Player ${state.currentPlayer + 1} rolled ${value}. Pick a pawn to move.`,
  };
}

export function canMovePawn(pawn: Pawn, dice: number, player: 0 | 1, state: LudoState): boolean {
  if (pawn.inGoal) return false;
  if (pawn.position === -1) return dice === 6;
  const target = computeTargetPosition(pawn, dice, player);
  if (target === null) return false;

  // Can't land on own pawn (except in goal which is endless)
  if (target < TRACK_LENGTH + HOME_LENGTH) {
    const own = state.pawns[player];
    if (own.some((p) => p !== pawn && !p.inGoal && p.position === target)) return false;
  }
  return true;
}

function computeTargetPosition(pawn: Pawn, dice: number, player: 0 | 1): number | null {
  if (pawn.position === -1) {
    return dice === 6 ? START_POSITIONS[player] : null;
  }

  const startPos = START_POSITIONS[player];

  // On track
  if (pawn.position < TRACK_LENGTH) {
    // Distance traveled so far (from this player's start)
    const traveled = (pawn.position - startPos + TRACK_LENGTH) % TRACK_LENGTH;
    const nextTraveled = traveled + dice;

    if (nextTraveled < TRACK_LENGTH) {
      return (pawn.position + dice) % TRACK_LENGTH;
    } else {
      // Enter home stretch
      const homeIdx = nextTraveled - TRACK_LENGTH;
      if (homeIdx > HOME_LENGTH) return null; // Overshoot, illegal
      return TRACK_LENGTH + homeIdx;
    }
  }

  // In home stretch
  const homeIdx = pawn.position - TRACK_LENGTH;
  const nextHome = homeIdx + dice;
  if (nextHome > HOME_LENGTH) return null; // Overshoot
  return TRACK_LENGTH + nextHome;
}

export function movePawn(state: LudoState, pawnIndex: number): LudoState {
  if (!state.rolled || state.winner) return state;

  const player = state.currentPlayer;
  const pawn = state.pawns[player][pawnIndex];
  if (!canMovePawn(pawn, state.dice, player, state)) return state;

  const target = computeTargetPosition(pawn, state.dice, player)!;
  const isHomeGoal = target === TRACK_LENGTH + HOME_LENGTH;

  // Clone state
  const newPawns: [Pawn[], Pawn[]] = [
    state.pawns[0].map((p) => ({ ...p })),
    state.pawns[1].map((p) => ({ ...p })),
  ];

  const movingPawn = newPawns[player][pawnIndex];
  movingPawn.position = isHomeGoal ? -2 : target;
  if (isHomeGoal) movingPawn.inGoal = true;

  let captureMsg = '';

  // Check captures (only on track, not in home stretch)
  if (!isHomeGoal && target < TRACK_LENGTH) {
    const opp = (player === 0 ? 1 : 0) as 0 | 1;
    const isSafeSquare =
      target === START_POSITIONS[0] ||
      target === START_POSITIONS[1] ||
      target === 8 || target === 13 || target === 21 || target === 26 || target === 34 || target === 39;
    if (!isSafeSquare) {
      newPawns[opp].forEach((p) => {
        if (!p.inGoal && p.position === target) {
          p.position = -1;
          captureMsg = ` Captured Player ${opp + 1}'s pawn!`;
        }
      });
    }
  }

  // Check win
  if (newPawns[player].every((p) => p.inGoal)) {
    return {
      ...state,
      pawns: newPawns,
      winner: player,
      rolled: false,
      message: `🏆 Player ${player + 1} wins!`,
    };
  }

  // Bonus turn on rolling a 6 or capturing or reaching home
  const bonusTurn = state.dice === 6 || captureMsg.length > 0 || isHomeGoal;
  const nextPlayer = bonusTurn ? player : ((player === 0 ? 1 : 0) as 0 | 1);

  return {
    ...state,
    pawns: newPawns,
    rolled: false,
    dice: bonusTurn ? state.dice : 0,
    currentPlayer: nextPlayer,
    message: bonusTurn
      ? `Player ${player + 1} gets another turn!${captureMsg}`
      : `Player ${nextPlayer + 1}'s turn.${captureMsg}`,
  };
}
