"use client";

import Image from "next/image";
import { motion } from "motion/react";

type ProductOpticsProps = {
  accent: string;
};

export function ProductOptics({ accent }: ProductOpticsProps) {
  return (
    <div className="relative mx-auto aspect-[2.35/1] w-full max-w-md overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/30 shadow-[inset_0_0_80px_rgba(255,255,255,0.035)] md:rounded-[2rem]">
      <Image
        src="/glasses/orbit-lens-side-4x3.png"
        alt="Orbit Lens smart glasses side product render"
        fill
        sizes="(max-width: 768px) 90vw, 420px"
        className="object-cover opacity-88"
        priority
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_46%_42%,transparent_0%,rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.56)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.08),transparent_28%,rgba(255,255,255,0.05)_62%,transparent)]" />

      <motion.div
        className="absolute left-[11%] right-[11%] top-1/2 h-px -translate-y-1/2"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.75), ${accent}, transparent)`,
        }}
        animate={{ opacity: [0.28, 0.8, 0.28], scaleX: [0.9, 1, 0.9] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute right-[17%] top-[36%] h-2 w-2 rounded-full"
        style={{ background: accent, boxShadow: `0 0 24px ${accent}` }}
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-[0.58rem] uppercase tracking-[0.24em] text-white/46">
        <span>Quiet optics</span>
        <span>Spatial AI</span>
      </div>

      <div className="absolute inset-x-6 top-5 flex items-center justify-between text-[0.55rem] uppercase tracking-[0.24em] text-white/34">
        <span>Orbit Lens</span>
        <span>Prototype visual</span>
      </div>
    </div>
  );
}
