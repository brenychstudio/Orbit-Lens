"use client";

import { motion } from "motion/react";

type OrbitSignalDockProps = {
  modeId: string;
  accent: string;
};

const dockCopy: Record<
  string,
  {
    signal: string;
    context: string;
    trust: string;
    coordinate: string;
  }
> = {
  vision: {
    signal: "Spatial clarity / city layer",
    context: "Only the next useful signal enters the field of view.",
    trust: "No dashboard. No visual noise.",
    coordinate: "Field 01 / Vision",
  },
  translate: {
    signal: "Live language layer",
    context: "Captions appear as atmosphere, not as a screen.",
    trust: "Face-forward conversation remains intact.",
    coordinate: "Field 02 / Translate",
  },
  recall: {
    signal: "Intentional memory",
    context: "Save a place, a phrase or a moment only when asked.",
    trust: "No silent recording concept.",
    coordinate: "Field 03 / Recall",
  },
  create: {
    signal: "Creator capture field",
    context: "Frame, scout and collect references without leaving the scene.",
    trust: "The interface assists the eye.",
    coordinate: "Field 04 / Create",
  },
  focus: {
    signal: "Attention quiet mode",
    context: "The system removes everything except the signal that matters.",
    trust: "Less interface. More presence.",
    coordinate: "Field 05 / Focus",
  },
  privacy: {
    signal: "Visible trust state",
    context: "Capture and memory are always readable, visible and controlled.",
    trust: "Privacy is part of the interface.",
    coordinate: "Field 06 / Privacy",
  },
};

export function OrbitSignalDock({ modeId, accent }: OrbitSignalDockProps) {
  const copy = dockCopy[modeId] ?? dockCopy.vision!;

  return (
    <motion.div
      key={modeId}
      initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
      className="mt-3 overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-3 shadow-[0_20px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl md:mt-4 md:rounded-[1.5rem] md:px-5 md:py-4"
    >
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center lg:grid-cols-[0.95fr_1.7fr_0.9fr_auto] lg:gap-4">
        <div>
          <p className="text-[0.54rem] uppercase tracking-[0.28em] text-white/28">
            Active Field
          </p>

          <div className="mt-2 flex items-start gap-3">
            <motion.span
              className="mt-1 h-2.5 w-2.5 rounded-full"
              style={{ background: accent, boxShadow: `0 0 22px ${accent}` }}
              animate={{
                opacity: [0.32, 1, 0.32],
                scale: [0.9, 1.14, 0.9],
              }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            />

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/64">
                {copy.signal}
              </p>
              <p className="mt-1 text-[0.62rem] uppercase tracking-[0.22em] text-white/30">
                {copy.coordinate}
              </p>
            </div>
          </div>
        </div>

        <div className="relative hidden sm:block">
          <div className="mb-2 flex items-center justify-between text-[0.54rem] uppercase tracking-[0.26em] text-white/26">
            <span>Orbit Signal Rail</span>
            <span>Live field</span>
          </div>

          <div className="relative h-10 overflow-hidden rounded-full border border-white/8 bg-white/[0.03] px-5">
            <div className="absolute inset-x-5 top-1/2 h-px -translate-y-1/2 bg-white/10" />

            <motion.div
              className="absolute left-5 right-5 top-1/2 h-px -translate-y-1/2"
              style={{
                background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.7), ${accent}, transparent)`,
              }}
              animate={{
                opacity: [0.18, 0.42, 0.18],
                scaleX: [0.96, 1, 0.96],
              }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute top-1/2 h-[0.28rem] w-28 -translate-y-1/2 rounded-full blur-[1px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.88), ${accent}, transparent)`,
                boxShadow: `0 0 24px ${accent}`,
              }}
              animate={{ left: ["4%", "72%", "4%"] }}
              transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.span
              className="absolute left-[18%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white/30"
              animate={{ opacity: [0.18, 0.55, 0.18] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: accent, boxShadow: `0 0 20px ${accent}` }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.18, 0.9] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute right-[18%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white/30"
              animate={{ opacity: [0.55, 0.18, 0.55] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        <div className="hidden md:block">
          <p className="text-[0.54rem] uppercase tracking-[0.28em] text-white/28">
            Context
          </p>
          <p className="mt-2 text-sm leading-5 text-white/56">
            {copy.context}
          </p>
          <p className="mt-2 text-[0.68rem] uppercase tracking-[0.2em] text-white/30">
            {copy.trust}
          </p>
        </div>

        <div className="flex items-center justify-start md:justify-end">
          <button
            type="button"
            className="group relative w-full overflow-hidden rounded-full border border-white/14 bg-white/[0.055] px-4 py-2.5 text-[0.55rem] uppercase tracking-[0.22em] text-white/60 transition hover:bg-white/[0.1] hover:text-white md:w-auto md:px-5 md:py-3 md:text-[0.58rem] md:tracking-[0.26em]"
          >
            <span className="relative z-10">Private Preview</span>
            <motion.span
              className="absolute inset-y-0 left-[-30%] w-[40%] bg-white/10 blur-xl"
              animate={{ left: ["-30%", "120%"] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
