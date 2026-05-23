'use client';

export function Background() {
  return (
    <>
      {/* Pure black base */}
      <div className="fixed inset-0 -z-10 bg-black" />
      {/* Subtle grid */}
      <div className="bg-grid-mono fixed inset-0 -z-10 pointer-events-none" />
      {/* Scanlines */}
      <div className="bg-scanlines fixed inset-0 -z-10 pointer-events-none opacity-30" />

      {/* White vignette orbs — desaturated, just glow */}
      <div
        className="fixed -left-24 top-0 -z-10 h-[400px] w-[400px] animate-float-slow rounded-full opacity-[0.04] blur-[100px] pointer-events-none"
        style={{ background: '#fff' }}
      />
      <div
        className="fixed -bottom-24 -right-24 -z-10 h-[450px] w-[450px] animate-float-slow rounded-full opacity-[0.05] blur-[100px] pointer-events-none"
        style={{ background: '#fff', animationDelay: '4s' }}
      />
      <div
        className="fixed left-1/2 top-1/3 -z-10 h-[300px] w-[300px] animate-float-slow rounded-full opacity-[0.03] blur-[80px] pointer-events-none"
        style={{ background: '#fff', animationDelay: '7s' }}
      />
    </>
  );
}
