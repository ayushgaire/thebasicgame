import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'THEBASICGAME.COM',
  description:
    'Cyber gaming universe powered by Codyza',
  keywords: [
    'games',
    'cyber games',
    'tic tac toe',
    'snake',
    'chess',
    '2048',
    'word puzzle',
    'codyza',
    'thebasicgame',
  ],
  authors: [
    {
      name: 'Ayush Gaire',
      url: 'https://ayushgaire.com',
    },
  ],
  creator: 'Ayush Gaire',
  publisher: 'Codyza',
  applicationName: 'THEBASICGAME',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-screen overflow-x-hidden bg-[#020617] text-white antialiased">
        {/* CYBER BACKGROUND */}
        <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
          {/* Main gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.12),transparent_35%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.12),transparent_35%),linear-gradient(to_bottom,#020617,#000000)]" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
              `,
              backgroundSize:
                '40px 40px',
            }}
          />

          {/* Glow orb 1 */}
          <div className="absolute left-[-120px] top-[-120px] h-[350px] w-[350px] rounded-full bg-cyan-500/20 blur-3xl" />

          {/* Glow orb 2 */}
          <div className="absolute bottom-[-140px] right-[-120px] h-[380px] w-[380px] rounded-full bg-fuchsia-500/20 blur-3xl" />

          {/* Glow orb 3 */}
          <div className="absolute left-1/2 top-1/3 h-[250px] w-[250px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        {/* TOP BAR */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            {/* LEFT */}
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-[0.25em] text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
                THEBASICGAME
              </h1>

              <span className="mt-1 text-[10px] tracking-[0.35em] text-white/40">
                POWERED BY CODYZA
              </span>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4 text-[11px] font-mono tracking-[0.2em] text-white/50">
              <a
                href="https://codyza.com"
                target="_blank"
                className="transition hover:text-cyan-300"
              >
                CODYZA.COM
              </a>

              <a
                href="https://ayushgaire.com"
                target="_blank"
                className="transition hover:text-fuchsia-300"
              >
                AYUSHGAIRE.COM
              </a>
            </div>
          </div>
        </header>

        {/* PAGE */}
        <main className="relative z-10">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="relative z-10 mt-16 border-t border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="mx-auto flex flex-col items-center justify-center gap-2 px-6 py-6 text-center">
            <div className="text-xs font-mono tracking-[0.35em] text-cyan-300">
              POWERED BY CODYZA
            </div>

            <div className="text-[10px] tracking-[0.3em] text-white/40">
              © AYUSH GAIRE 2026
            </div>

            <div className="flex gap-4 text-[10px] tracking-[0.25em] text-white/30">
              <a
                href="https://codyza.com"
                target="_blank"
                className="transition hover:text-white"
              >
                CODYZA.COM
              </a>

              <span>•</span>

              <a
                href="https://ayushgaire.com"
                target="_blank"
                className="transition hover:text-white"
              >
                AYUSHGAIRE.COM
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}