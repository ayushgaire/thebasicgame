export interface GameMeta {
  id: string;
  name: string;
  icon: string;
  description: string;
  modes: Array<'solo' | 'bot' | 'multi' | 'easy' | 'medium' | 'hard'>;
}

export const GAMES: GameMeta[] = [
  { id: 'chess',     name: 'Chess',              icon: '♛', description: 'The classic mind battle',     modes: ['solo', 'bot', 'multi'] },
  { id: 'sudoku',    name: 'Sudoku',             icon: '▦', description: 'Pure number logic',            modes: ['easy', 'medium', 'hard'] },
  { id: 'tictactoe', name: 'Tic Tac Toe',        icon: '◯', description: '3-in-a-row classic',           modes: ['bot', 'multi'] },
  { id: 'memory',    name: 'Memory Match',       icon: '◈', description: 'Flip & remember',              modes: ['solo'] },
  { id: 'snake',     name: 'Snake',              icon: '∿', description: 'Eat & grow',                   modes: ['solo'] },
  { id: 'rps',       name: 'Rock Paper Scissors',icon: '✊', description: 'Best of five',                 modes: ['bot'] },
  { id: '2048',      name: '2048',               icon: '◆', description: 'Slide & merge',                modes: ['solo'] },
  { id: 'connect4',  name: 'Connect Four',       icon: '●', description: 'Drop & align',                 modes: ['bot', 'multi'] },
  { id: 'ludo',      name: 'Ludo',               icon: '⚀', description: 'Roll the dice, race home',     modes: ['multi'] },
  { id: 'word',      name: 'Word Puzzle',        icon: '▭', description: 'Guess the five-letter word',   modes: ['solo'] },
];

export const getGame = (id: string) => GAMES.find((g) => g.id === id);

export const FUN_FACTS = [
  'The longest chess game theoretically possible is 5,949 moves.',
  'Sudoku puzzles must have only one possible solution to be valid.',
  'Tic Tac Toe with perfect play always ends in a draw.',
  'Connect Four was solved in 1988 — first player always wins with perfect play.',
  '2048 was created in a single weekend by Gabriele Cirulli when he was 19.',
  'Snake first shipped on the Nokia 6110 in 1997 and reached 300 million phones.',
  'There are 10^120 possible chess games — more than atoms in the observable universe.',
  'Ludo is a westernized version of Pachisi, an Indian game from the 6th century CE.',
];
