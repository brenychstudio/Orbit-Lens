"use client";

import { motion } from "motion/react";

type OrbitVisualMaturityLayerProps = {
  accent: string;
  isVisionField: boolean;
  isInspectOpen: boolean;
};

export function OrbitVisualMaturityLayer({
  accent,
  isVisionField,
  isInspectOpen,
}: OrbitVisualMaturityLayerProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden rounded-[2rem] md:rounded-[3rem]">
      <motion.div
        className="absolute -left-[18%] -top-[24%] h-[42rem] w-[42rem] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${accent}18, rgba(120,180,210,0.05) 36%, transparent 68%)`,
        }}
        animate={{
          opacity: isInspectOpen
            ? 0.12
            : isVisionField
              ? [0.14, 0.28, 0.14]
              : [0.08, 0.18, 0.08],
          scale: isVisionField ? [0.96, 1.05, 0.96] : [0.98, 1.02, 0.98],
          x: isVisionField ? [-10, 16, -10] : [-6, 8, -6],
          y: isVisionField ? [4, -10, 4] : [2, -5, 2],
        }}
        transition={{
          duration: isVisionField ? 16 : 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute right-[-16%] top-[12%] h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(220,235,255,0.065), rgba(120,170,210,0.026) 38%, transparent 70%)",
        }}
        animate={{
          opacity: isInspectOpen ? 0.08 : [0.06, 0.16, 0.06],
          scale: [0.98, 1.08, 0.98],
          x: [10, -18, 10],
          y: [-8, 10, -8],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.42]"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, transparent 0%, transparent 38%, rgba(0,0,0,0.22) 70%, rgba(0,0,0,0.52) 100%)",
        }}
      />

      <motion.div
        className="absolute left-[9%] right-[9%] top-[18%] h-px"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.045), ${accent}28, rgba(255,255,255,0.035), transparent)`,
        }}
        animate={{
          opacity: isInspectOpen ? 0.04 : [0.035, 0.12, 0.035],
          scaleX: [0.92, 1, 0.92],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-[17%] left-[18%] h-px w-[52%]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}34, rgba(255,255,255,0.06), transparent)`,
          boxShadow: `0 0 24px ${accent}18`,
        }}
        animate={{
          opacity: isInspectOpen
            ? 0.04
            : isVisionField
              ? [0.05, 0.18, 0.05]
              : [0.025, 0.08, 0.025],
          scaleX: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 10.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="orbit-visual-maturity-grain absolute inset-0" />
    </div>
  );
}

export function VisionDeHudScrim({ accent }: { accent: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[7] hidden overflow-hidden rounded-[2rem] md:rounded-[3rem] lg:block">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.04) 32%, transparent 56%, rgba(0,0,0,0.12) 100%)",
        }}
      />

      <div
        className="absolute inset-y-0 right-0 w-[38%]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,0,0,0.12) 44%, rgba(0,0,0,0.28))",
        }}
      />

      <motion.div
        className="absolute left-[48%] top-[48%] h-[24rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${accent}10, rgba(255,255,255,0.035) 22%, transparent 66%)`,
        }}
        animate={{
          opacity: [0.14, 0.28, 0.14],
          scale: [0.94, 1.04, 0.94],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute left-[44%] top-[55%] h-px w-[38%]"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.08), ${accent}34, transparent)`,
        }}
        animate={{
          opacity: [0.08, 0.22, 0.08],
          scaleX: [0.86, 1, 0.86],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
