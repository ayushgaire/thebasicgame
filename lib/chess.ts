/**
 * Chess engine. Full piece movement + legality + minimax bot.
 * Not implemented: castling, en passant, draw rules. Pawn promotes to Queen.
 */

export type Color = 'w' | 'b';
export type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
export type Piece = `${Color}${PieceType}`;
export type Board = (Piece | null)[][];
export type Move = [number, number, number, number];

export const PIECE_GLYPHS: Record<PieceType, string> = {
  K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟',
};

const PIECE_VALUES: Record<PieceType, number> = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 100 };

export function startingBoard(): Board {
  const b: Board = Array.from({ length: 8 }, () => Array<Piece | null>(8).fill(null));
  const back: PieceType[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
  for (let c = 0; c < 8; c++) {
    b[0][c] = `b${back[c]}`;
    b[1][c] = 'bP';
    b[6][c] = 'wP';
    b[7][c] = `w${back[c]}`;
  }
  return b;
}

const inB = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
const colorOf = (p: Piece | null): Color | null => (p ? (p[0] as Color) : null);
const typeOf = (p: Piece | null): PieceType | null => (p ? (p[1] as PieceType) : null);

export function pseudoMoves(board: Board, color: Color): Move[] {
  const out: Move[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || colorOf(p) !== color) continue;
      const t = typeOf(p)!;

      if (t === 'P') {
        const dir = color === 'w' ? -1 : 1;
        const startRow = color === 'w' ? 6 : 1;
        if (inB(r + dir, c) && !board[r + dir][c]) {
          out.push([r, c, r + dir, c]);
          if (r === startRow && !board[r + 2 * dir][c]) out.push([r, c, r + 2 * dir, c]);
        }
        for (const dc of [-1, 1]) {
          const nr = r + dir, nc = c + dc;
          if (inB(nr, nc) && board[nr][nc] && colorOf(board[nr][nc]) !== color) {
            out.push([r, c, nr, nc]);
          }
        }
      } else if (t === 'N') {
        for (const [dr, dc] of [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]) {
          const nr = r + dr, nc = c + dc;
          if (inB(nr, nc) && (!board[nr][nc] || colorOf(board[nr][nc]) !== color)) out.push([r, c, nr, nc]);
        }
      } else if (t === 'K') {
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          const nr = r + dr, nc = c + dc;
          if (inB(nr, nc) && (!board[nr][nc] || colorOf(board[nr][nc]) !== color)) out.push([r, c, nr, nc]);
        }
      } else {
        const dirs =
          t === 'R' ? [[-1, 0], [1, 0], [0, -1], [0, 1]]
          : t === 'B' ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
          : [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        for (const [dr, dc] of dirs) {
          let nr = r + dr, nc = c + dc;
          while (inB(nr, nc)) {
            if (!board[nr][nc]) out.push([r, c, nr, nc]);
            else {
              if (colorOf(board[nr][nc]) !== color) out.push([r, c, nr, nc]);
              break;
            }
            nr += dr; nc += dc;
          }
        }
      }
    }
  }
  return out;
}

export function findKing(board: Board, color: Color): [number, number] | null {
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (board[r][c] === `${color}K`) return [r, c];
  return null;
}

export function inCheck(board: Board, color: Color): boolean {
  const k = findKing(board, color);
  if (!k) return false;
  return pseudoMoves(board, color === 'w' ? 'b' : 'w').some(([, , tr, tc]) => tr === k[0] && tc === k[1]);
}

export function applyMove(board: Board, m: Move): Board {
  const nb: Board = board.map((row) => [...row]);
  const piece = nb[m[0]][m[1]];
  nb[m[2]][m[3]] = piece;
  nb[m[0]][m[1]] = null;
  if (piece && typeOf(piece) === 'P' && (m[2] === 0 || m[2] === 7)) {
    nb[m[2]][m[3]] = `${colorOf(piece)!}Q`;
  }
  return nb;
}

export function legalMoves(board: Board, color: Color): Move[] {
  return pseudoMoves(board, color).filter((m) => !inCheck(applyMove(board, m), color));
}

export type GameStatus = 'ongoing' | 'checkmate' | 'stalemate';

export function gameStatus(board: Board, turn: Color): GameStatus {
  const moves = legalMoves(board, turn);
  if (moves.length > 0) return 'ongoing';
  return inCheck(board, turn) ? 'checkmate' : 'stalemate';
}

function evaluate(board: Board, perspective: Color): number {
  let s = 0;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const p = board[r][c];
    if (!p) continue;
    const v = PIECE_VALUES[typeOf(p)!];
    s += colorOf(p) === perspective ? v : -v;
  }
  return s;
}

export function botMove(board: Board, color: Color): Move | null {
  const moves = legalMoves(board, color);
  if (!moves.length) return null;

  let bestScore = -Infinity;
  let best: Move[] = [];

  for (const m of moves) {
    const nb = applyMove(board, m);
    const opp = legalMoves(nb, color === 'w' ? 'b' : 'w');
    let worst: number;

    if (!opp.length) worst = inCheck(nb, color === 'w' ? 'b' : 'w') ? 9999 : 0;
    else {
      worst = Infinity;
      for (const om of opp) {
        const nnb = applyMove(nb, om);
        const sc = evaluate(nnb, color);
        if (sc < worst) worst = sc;
      }
    }

    const total = worst + Math.random() * 0.2;
    if (total > bestScore) { bestScore = total; best = [m]; }
    else if (Math.abs(total - bestScore) < 0.01) best.push(m);
  }

  return best[Math.floor(Math.random() * best.length)];
}
