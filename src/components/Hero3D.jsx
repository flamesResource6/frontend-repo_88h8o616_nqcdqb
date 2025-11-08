import React from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero3D() {
  return (
    <section className="relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden bg-[#111111]">
      <Spline
        scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
      {/* Soft radial overlay for readability (does not block Spline interaction) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 flex items-end p-6 sm:p-8">
        <div>
          <h1 className="text-white font-semibold text-2xl sm:text-3xl tracking-tight">
            SmartBalance
          </h1>
          <p className="text-white/70 text-sm sm:text-base mt-1">
            Minimal, fast, and focused budgeting.
          </p>
        </div>
      </div>
    </section>
  );
}
