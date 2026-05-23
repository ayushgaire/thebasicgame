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
      {showIntro && (
        <CodyzaIntro onFinish={() => setShowIntro(false)} />
      )}

      <main className="relative min-h-screen overflow-x-hidden pt-12">

        <Background />
        <PoweredByBar />

        <div className="relative z-10 flex min-h-[calc(100vh-60px)] flex-col items-center justify-center px-6 text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto w-full max-w-7xl px-4"
          >

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold tracking-[0.25em] text-white/70 backdrop-blur-xl">
              🎮 POWERED BY CODYZA
            </div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9 }}
              className="gradient-text break-words font-black leading-[0.9]"
              style={{
                fontSize: 'clamp(42px, 9vw, 130px)',
                textShadow:
                  '0 0 40px rgba(124,58,237,0.35), 0 0 80px rgba(37,99,235,0.25)',
              }}
            >
              THEBASICGAME
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-2 text-2xl font-black text-white sm:text-5xl"
            >
              .COM
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl"
            >
              A futuristic gaming universe with colorful neon visuals,
              smooth gameplay, modern UI, and classic games reimagined.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-5"
            >

              <button
                onClick={() => router.push('/dashboard')}
                className="btn btn-primary text-base"
              >
                ▶ PLAY AS GUEST
              </button>

              <a
                href="https://codyza.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                ⚡ CODYZA.COM
              </a>

            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95 }}
              className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3"
            >

              <StatCard
                title="10+"
                label="CLASSIC GAMES"
                glow="from-purple-500 to-cyan-500"
              />

              <StatCard
                title="∞"
                label="UNLIMITED FUN"
                glow="from-pink-500 to-orange-500"
              />

              <StatCard
                title="24/7"
                label="PLAY ANYTIME"
                glow="from-green-500 to-cyan-500"
              />

            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-12 text-sm tracking-[0.3em] text-white/40"
            >
              FOUNDED BY AYUSH GAIRE
            </motion.div>

          </motion.div>
        </div>

        <Footer />
      </main>
    </>
  );
}

function StatCard({
  title,
  label,
  glow,
}: {
  title: string;
  label: string;
  glow: string;
}) {
  return (
    <div className="glass relative overflow-hidden rounded-3xl p-8">

      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-10 ${glow}`}
      />

      <div className="relative z-10">

        <div className="text-5xl font-black text-white">
          {title}
        </div>

        <div className="mt-2 text-sm tracking-[0.25em] text-white/60">
          {label}
        </div>

      </div>
    </div>
  );
}