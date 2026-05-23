/**
 * Sudoku generator. Returns a puzzle with a guaranteed unique solution.
 */

export type Grid = number[][];

function deepCopy(g: Grid): Grid { return g.map((r) => [...r]); }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function isValid(g: Grid, r: number, c: number, n: number): boolean {
  for (let i = 0; i < 9; i++) if (g[r][i] === n || g[i][c] === n) return false;
  const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    if (g[br + i][bc + j] === n) return false;
  }
  return true;
}

function solve(g: Grid, randomize = false): boolean {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    if (g[r][c] === 0) {
      const nums = randomize ? shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]) : [1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (const n of nums) {
        if (isValid(g, r, c, n)) {
          g[r][c] = n;
          if (solve(g, randomize)) return true;
          g[r][c] = 0;
        }
      }
      return false;
    }
  }
  return true;
}

function countSolutions(g: Grid, limit: number): number {
  let count = 0;
  const rec = (): void => {
    if (count >= limit) return;
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (g[r][c] === 0) {
        for (let n = 1; n <= 9; n++) {
          if (isValid(g, r, c, n)) {
            g[r][c] = n;
            rec();
            g[r][c] = 0;
            if (count >= limit) return;
          }
        }
        return;
      }
    }
    count++;
  };
  rec();
  return count;
}

export interface SudokuPuzzle { puzzle: Grid; solution: Grid; }

export function generate(givens: number): SudokuPuzzle {
  const solution: Grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  solve(solution, true);
  const puzzle = deepCopy(solution);

  const cells = shuffle([...Array(81)].map((_, i) => i));
  let remaining = 81;

  for (const i of cells) {
    if (remaining <= givens) break;
    const r = Math.floor(i / 9), c = i % 9;
    const backup = puzzle[r][c];
    puzzle[r][c] = 0;
    const test = deepCopy(puzzle);
    if (countSolutions(test, 2) !== 1) puzzle[r][c] = backup;
    else remaining--;
  }

  return { puzzle, solution };
}

export function formatTime(s: number): string {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
