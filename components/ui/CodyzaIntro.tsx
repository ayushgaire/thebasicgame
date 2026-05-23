'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function CodyzaIntro({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 900);
    const t2 = setTimeout(() => setPhase('out'), 2900);
    const t3 = setTimeout(() => onFinish(), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {phase !== 'out' && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
        >
          <div className="bg-grid-mono absolute inset-0 pointer-events-none" />
          <div className="bg-scanlines absolute inset-0 pointer-events-none opacity-40" />

          <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 6], fov: 55 }} dpr={[1, 2]}>
              <ambientLight intensity={0.4} />
              <pointLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
              <pointLight position={[-5, -3, 2]} intensity={0.5} color="#ffffff" />
              <RotatingRing radius={3.2} thickness={0.012} speed={0.3} opacity={0.25} />
              <RotatingRing radius={2.5} thickness={0.01} speed={-0.4} opacity={0.4} />
              <RotatingRing radius={1.8} thickness={0.008} speed={0.6} opacity={0.6} />
              <FloatingShape position={[-3, 1.5, -1]} type="icosa" scale={0.4} />
              <FloatingShape position={[3, -1.5, -1]} type="octa" scale={0.4} />
              <FloatingShape position={[-2.5, -2, 0.5]} type="box" scale={0.25} />
              <FloatingShape position={[2.8, 2, 0]} type="box" scale={0.3} />
            </Canvas>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{
                scale: phase === 'in' ? 1 : phase === 'hold' ? 1.05 : 1.3,
                opacity: 1,
              }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <h1
                className="font-display font-black text-white"
                style={{
                  fontSize: 'clamp(56px, 11vw, 140px)',
                  textShadow:
                    '0 0 60px rgba(255,255,255,0.8), 0 0 120px rgba(255,255,255,0.4), 0 4px 8px rgba(0,0,0,0.5)',
                  letterSpacing: '0.05em',
                }}
              >
                CODYZA
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: phase === 'in' ? 0 : 0.9, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 text-[10px] font-mono tracking-[0.5em] text-white/60"
            >
              ⬢ &nbsp; PRESENTS &nbsp; ⬢
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'in' ? 0 : 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mt-3 font-display text-base tracking-[0.25em] text-white/90 sm:text-lg"
            >
              thebasicgame.com
            </motion.div>
          </div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '180px' }}
            transition={{ duration: 2.6, ease: 'linear' }}
            className="absolute bottom-16 h-px bg-white/70"
          />
          <div className="absolute bottom-12 font-mono text-[9px] tracking-[0.4em] text-white/30">
            LOADING SYSTEM
          </div>

          <button
            onClick={onFinish}
            className="absolute bottom-6 right-6 font-mono text-[11px] tracking-widest text-white/40 transition-colors hover:text-white"
          >
            SKIP →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RotatingRing({
  radius, thickness, speed, opacity,
}: {
  radius: number; thickness: number; speed: number; opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * speed;
    ref.current.rotation.y = t * speed * 0.7;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, thickness, 16, 100]} />
      <meshBasicMaterial color="#ffffff" opacity={opacity} transparent />
    </mesh>
  );
}

function FloatingShape({
  position, type, scale,
}: {
  position: [number, number, number];
  type: 'icosa' | 'octa' | 'box';
  scale: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.4;
    ref.current.rotation.y = t * 0.6;
  });
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={ref} position={position} scale={scale}>
        {type === 'icosa' && <icosahedronGeometry args={[1, 0]} />}
        {type === 'octa' && <octahedronGeometry args={[1, 0]} />}
        {type === 'box' && <boxGeometry args={[1, 1, 1]} />}
        <meshStandardMaterial color="#ffffff" wireframe opacity={0.5} transparent />
      </mesh>
    </Float>
  );
}
