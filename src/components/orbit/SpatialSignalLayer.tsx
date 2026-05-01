"use client";

import { motion } from "motion/react";

type SpatialSignalLayerProps = {
  accent: string;
  modeId: string;
};

const signalCopy: Record<string, { left: string; right: string; bottom: string }> = {
  vision: {
    left: "City layer detected",
    right: "Route signal / 12 m",
    bottom: "Context depth: calm",
  },
  translate: {
    left: "Live caption stream",
    right: "Language layer active",
    bottom: "Subtitle opacity: adaptive",
  },
  recall: {
    left: "Memory capture: manual",
    right: "Private note ready",
    bottom: "No silent recording",
  },
  create: {
    left: "Framing assist",
    right: "Scene reference saved",
    bottom: "Hands-free capture",
  },
  focus: {
    left: "Noise reduced",
    right: "Only priority signal",
    bottom: "Attention layer: minimal",
  },
  privacy: {
    left: "Visible capture state",
    right: "Consent layer active",
    bottom: "User-controlled memory",
  },
};

export function SpatialSignalLayer({ accent, modeId }: SpatialSignalLayerProps) {
  const copy = signalCopy[modeId] ?? signalCopy.vision;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.6rem]">
      <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:42px_42px]" />

      <motion.div
        className="absolute left-8 top-8 h-24 w-24 rounded-full border border-white/10"
        style={{ boxShadow: `0 0 60px ${accent}` }}
        animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.12, 0.34, 0.12] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute right-10 top-12 h-px w-52"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        animate={{ x: [-18, 18, -18], opacity: [0.24, 0.72, 0.24] }}
        transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-7 top-[46%] rounded-full border border-white/10 bg-black/34 px-4 py-2 text-[0.58rem] uppercase tracking-[0.22em] text-white/44 backdrop-blur-xl"
        animate={{ x: [-4, 5, -4], opacity: [0.36, 0.72, 0.36] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {copy.left}
      </motion.div>

      <motion.div
        className="absolute right-7 top-[38%] rounded-full border border-white/10 bg-black/34 px-4 py-2 text-[0.58rem] uppercase tracking-[0.22em] text-white/44 backdrop-blur-xl"
        animate={{ x: [5, -4, 5], opacity: [0.3, 0.66, 0.3] }}
        transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
      >
        {copy.right}
      </motion.div>

      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/34 px-4 py-2 text-[0.58rem] uppercase tracking-[0.22em] text-white/38 backdrop-blur-xl"
        animate={{ y: [3, -3, 3], opacity: [0.26, 0.58, 0.26] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
      >
        {copy.bottom}
      </motion.div>

      <div
        className="absolute bottom-0 left-0 top-0 w-px opacity-60"
        style={{ background: `linear-gradient(180deg, transparent, ${accent}, transparent)` }}
      />
    </div>
  );
}
