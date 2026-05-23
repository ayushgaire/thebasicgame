'use client';

import { motion } from 'framer-motion';

/**
 * Pinned to top of every page. Shows "Powered by Codyza.com" with live link.
 */
export function PoweredByBar() {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-lg"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-white/60 sm:text-[11px]">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          POWERED BY{' '}
          <a
            href="https://codyza.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-white transition-colors hover:underline"
          >
            CODYZA.COM
          </a>
        </div>
        <div className="hidden font-mono text-[10px] tracking-[0.25em] text-white/40 sm:block">
          v0.3 · SYSTEM ONLINE
        </div>
      </div>
    </motion.div>
  );
}
