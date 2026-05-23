export interface GameMeta {
  id: string;
  name: string;
  icon: string;
  description: string;

  color: string;
  button: string;
  glow: string;

  modes: Array<'solo' | 'bot' | 'multi' | 'easy' | 'medium' | 'hard'>;
}

export const GAMES: GameMeta[] = [
  {
    id: 'chess',
    name: 'Chess',
    icon: '♛',
    description: 'The classic mind battle',
    color: 'from-purple-500 to-blue-500',
    button: 'from-violet-500 to-blue-500',
    glow: 'shadow-purple-500/40',
    modes: ['solo', 'bot', 'multi'],
  },

  {
    id: 'sudoku',
    name: 'Sudoku',
    icon: '▦',
    description: 'Pure number logic',
    color: 'from-cyan-500 to-blue-500',
    button: 'from-cyan-500 to-blue-500',
    glow: 'shadow-cyan-500/40',
    modes: ['easy', 'medium', 'hard'],
  },

  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    icon: '◯',
    description: '3-in-a-row classic',
    color: 'from-pink-500 to-purple-500',
    button: 'from-pink-500 to-purple-500',
    glow: 'shadow-pink-500/40',
    modes: ['bot', 'multi'],
  },

  {
    id: 'memory',
    name: 'Memory Match',
    icon: '◈',
    description: 'Flip & remember',
    color: 'from-orange-500 to-pink-500',
    button: 'from-orange-500 to-red-500',
    glow: 'shadow-orange-500/40',
    modes: ['solo'],
  },

  {
    id: 'snake',
    name: 'Snake',
    icon: '∿',
    description: 'Eat & grow',
    color: 'from-green-500 to-emerald-500',
    button: 'from-green-500 to-lime-500',
    glow: 'shadow-green-500/40',
    modes: ['solo'],
  },

  {
    id: 'rps',
    name: 'Rock Paper Scissors',
    icon: '✊',
    description: 'Best of five',
    color: 'from-yellow-500 to-orange-500',
    button: 'from-yellow-500 to-orange-500',
    glow: 'shadow-yellow-500/40',
    modes: ['bot'],
  },

  {
    id: '2048',
    name: '2048',
    icon: '◆',
    description: 'Slide & merge',
    color: 'from-fuchsia-500 to-pink-500',
    button: 'from-fuchsia-500 to-pink-500',
    glow: 'shadow-fuchsia-500/40',
    modes: ['solo'],
  },

  {
    id: 'connect4',
    name: 'Connect Four',
    icon: '●',
    description: 'Drop & align',
    color: 'from-blue-500 to-cyan-500',
    button: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/40',
    modes: ['bot', 'multi'],
  },

  {
    id: 'ludo',
    name: 'Ludo',
    icon: '⚀',
    description: 'Roll the dice, race home',
    color: 'from-green-500 to-lime-500',
    button: 'from-green-500 to-lime-500',
    glow: 'shadow-green-500/40',
    modes: ['multi'],
  },

  {
    id: 'word',
    name: 'Word Puzzle',
    icon: '▭',
    description: 'Guess the five-letter word',
    color: 'from-violet-500 to-purple-500',
    button: 'from-violet-500 to-purple-500',
    glow: 'shadow-violet-500/40',
    modes: ['solo'],
  },
];

export const getGame = (id: string) =>
  GAMES.find((g) => g.id === id);

export const FUN_FACTS = [
  'The longest chess game theoretically possible is 5,949 moves.',
  'Sudoku puzzles must have only one possible solution.',
  'Tic Tac Toe with perfect play always ends in a draw.',
  'Connect Four was solved in 1988.',
  '2048 was created in one weekend.',
  'Snake first shipped on Nokia phones in 1997.',
];