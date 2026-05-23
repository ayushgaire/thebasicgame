'use client';

export function Footer() {
  return (
    <footer className="relative z-10 mt-12 border-t border-white/10 bg-black/40 px-6 py-6 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <div className="font-mono text-[11px] tracking-widest text-white/50">
          © AYUSH GAIRE 2026 · ALL RIGHTS RESERVED
        </div>

        <div className="flex items-center gap-5 text-[11px] font-mono tracking-widest">
          <a
            href="https://ayushgaire.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 transition-colors hover:text-white"
          >
            ↗ AYUSHGAIRE.COM
          </a>
          <span className="text-white/20">·</span>
          <a
            href="https://codyza.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 transition-colors hover:text-white"
          >
            ↗ CODYZA.COM
          </a>
        </div>
      </div>
    </footer>
  );
}
