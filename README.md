# thebasicgame.com

A futuristic multi-game gaming hub. Pure black & white monochrome theme with a cinematic 3D Codyza intro.

**Powered by [Codyza.com](https://codyza.com)** · **Founder: [Ayush Gaire](https://ayushgaire.com)**

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No backend, no API keys, no setup. Stats save to your browser's localStorage.

## What's inside

- **3D Codyza intro** — animated logo splash on entry (skippable, shown once per session)
- **Pure black & white** monochrome theme — no color noise
- **"Powered by Codyza.com"** badge pinned to the top of every page
- **Footer** `© Ayush Gaire 2026` with links to **ayushgaire.com** and **codyza.com**
- **Guest mode only** — no sign-in, no friction

## All 10 games working

| Game | Status |
|---|---|
| Chess | Full rules + minimax bot, undo, resign |
| Sudoku | Easy / Medium / Hard, unique-solution generator |
| Tic Tac Toe | Perfect-play bot, local 2P |
| Memory Match | 8 pairs, move counter |
| Snake | Arrow keys / WASD |
| Rock Paper Scissors | Best of 5 |
| 2048 | Standard rules |
| Connect Four | Threat-detecting bot, local 2P |
| **Ludo** | 2-player local race with dice, captures, safe-zone home stretch |
| **Word Puzzle** | Wordle-style 5-letter guesser with color feedback |

## Project structure

```
thebasicgame/
├── app/                      # Next.js 14 App Router
│   ├── dashboard/page.tsx
│   ├── play/[game]/page.tsx
│   ├── layout.tsx
│   ├── page.tsx              # Landing with 3D Codyza intro
│   └── globals.css
├── components/
│   ├── games/                # All 10 games
│   └── ui/                   # CodyzaIntro, Hero3D, Header, Footer, ...
├── lib/                      # chess, sudoku, words, store, games registry
└── hooks/
```

## Deploy

Push to GitHub → import to [Vercel](https://vercel.com/new). Done. Nothing else to configure.

## License

MIT
