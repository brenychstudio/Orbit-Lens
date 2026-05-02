"use client";

import { motion } from "motion/react";

type ShellChromeProps = {
  accent: string;
};

export function ShellChrome({ accent }: ShellChromeProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-[2.8rem] md:rounded-[3.8rem]">
      {/* Quiet machined edge */}
      <div className="absolute inset-0 rounded-[2.8rem] ring-1 ring-white/[0.032] md:rounded-[3.8rem]" />
      <div className="absolute inset-[1px] rounded-[2.75rem] ring-1 ring-white/[0.014] md:rounded-[3.72rem]" />

      {/* Very restrained top / bottom edge */}
      <div className="absolute inset-x-16 top-px h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
      <div className="absolute inset-x-24 bottom-px h-px bg-gradient-to-r from-transparent via-white/07 to-transparent" />

      {/* Graphite thickness, almost invisible */}
      <div className="absolute inset-x-12 top-[2px] h-[2.8rem] rounded-t-[3rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.018),transparent)] opacity-45 md:rounded-t-[3.8rem]" />
      <div className="absolute inset-x-10 bottom-0 h-[3.8rem] rounded-b-[3rem] bg-[linear-gradient(0deg,rgba(0,0,0,0.24),transparent)] opacity-70 md:rounded-b-[3.8rem]" />

      {/* Slow optical glint, low presence */}
      <motion.div
        className="absolute left-[10%] top-px h-px w-[28%]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.24), transparent)`,
        }}
        animate={{
          x: ["-8%", "14%", "-8%"],
          opacity: [0.04, 0.14, 0.04],
        }}
        transition={{ duration: 11.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute right-[12%] bottom-px h-px w-[24%]"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.16), ${accent}, transparent)`,
        }}
        animate={{
          x: ["8%", "-8%", "8%"],
          opacity: [0.025, 0.09, 0.025],
        }}
        transition={{ duration: 12.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Inner reflection: nearly invisible, only depth */}
      <motion.div
        className="absolute left-[20%] top-[2.4rem] h-px w-[38%]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
        }}
        animate={{
          opacity: [0.035, 0.12, 0.035],
          scaleX: [0.9, 1.02, 0.9],
        }}
        transition={{ duration: 13.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-[2.1rem] right-[18%] h-px w-[32%]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(180,220,245,0.09), rgba(255,255,255,0.11), transparent)",
        }}
        animate={{
          opacity: [0.025, 0.085, 0.025],
          scaleX: [0.92, 1.02, 0.92],
        }}
        transition={{ duration: 14.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
