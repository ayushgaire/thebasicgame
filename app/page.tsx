'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Background } from '@/components/ui/Background';
import { Footer } from '@/components/ui/Footer';
import { PoweredByBar } from '@/components/ui/PoweredByBar';

const CodyzaIntro = dynamic(
  () => import('@/components/ui/CodyzaIntro').then((m) => m.CodyzaIntro),
  { ssr: false }
);

export default function LandingPage() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(false);
  const [introChecked, setIntroChecked] = useState(false);

  useEffect(() => {
    // Show intro once per session
    const seen = sessionStorage.getItem('tbg-intro-seen');
    if (!seen) {
      setShowIntro(true);
      sessionStorage.setItem('tbg-intro-seen', '1');
    }
    setIntroChecked(true);
  }, []);

  if (!introChecked) return null;

  return (
    <>
      {showIntro && <CodyzaIntro onFinish={() => setShowIntro(false)} />}

      <main className="relative min-h-screen overflow-x-hidden pt-12">
        <Background />
        <PoweredByBar />

        <div className="relative z-10 flex min-h-[calc(100vh-60px)] flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: showIntro ? 0 : 0.1 }}
            className="flex flex-col items-center"
          >
            <span className="mb-5 font-mono text-[10px] tracking-[0.5em] text-white/40 sm:text-[11px]">
              ▣ &nbsp; MONOCHROME GAMING HUB &nbsp; ▣
            </span>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display font-black leading-[0.95] tracking-tight text-white"
              style={{
                fontSize: 'clamp(48px, 9vw, 120px)',
                textShadow: '0 0 60px rgba(255,255,255,0.15), 0 4px 8px rgba(0,0,0,0.5)',
              }}
            >
              THEBASICGAME<br />.COM
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
            >
              A futuristic mini gaming console in your browser. Ten games. Zero setup. Pure flow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-3 font-mono text-[11px] tracking-[0.25em] text-white/40"
            >
              FOUNDER ·{' '}
              <a
                href="https://ayushgaire.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white/70 transition-colors hover:text-white"
              >
                AYUSH GAIRE
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-10"
            >
              <button
                onClick={() => router.push('/dashboard')}
                className="btn btn-primary text-base"
                style={{ padding: '16px 36px' }}
              >
                ▶ &nbsp; PLAY AS GUEST
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-10 grid w-full max-w-md grid-cols-3 gap-3"
            >
              <StatCard num="10" label="GAMES" />
              <StatCard num="∞" label="PLAYTIME" />
              <StatCard num="0" label="DOWNLOADS" />
            </motion.div>
          </motion.div>
        </div>

        <Footer />
      </main>
    </>
  );
}

function StatCard({ num, label }: { num: string; label: string }) {
  return (
    <div className="glass px-4 py-4 text-center">
      <div className="font-display text-2xl font-black text-white">{num}</div>
      <div className="mt-1 font-mono text-[9px] tracking-widest text-white/40">{label}</div>
    </div>
  );
}
