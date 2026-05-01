"use client";

import { motion, useReducedMotion } from "motion/react";

type AtmosphericBackdropProps = {
  accent: string;
};

const dustPoints = [
  { left: "14%", top: "22%", delay: 0.1, size: "3px" },
  { left: "23%", top: "72%", delay: 1.6, size: "2px" },
  { left: "34%", top: "18%", delay: 2.4, size: "2px" },
  { left: "51%", top: "78%", delay: 0.8, size: "3px" },
  { left: "66%", top: "24%", delay: 1.2, size: "2px" },
  { left: "76%", top: "68%", delay: 2.8, size: "3px" },
  { left: "87%", top: "38%", delay: 1.9, size: "2px" },
];

export function AtmosphericBackdrop({ accent }: AtmosphericBackdropProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-[#030407]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(255,255,255,0.115),transparent_32%),radial-gradient(circle_at_50%_86%,rgba(255,255,255,0.045),transparent_34%),linear-gradient(180deg,#05070b_0%,#030407_42%,#010204_100%)]" />

      <motion.div
        className="absolute left-1/2 top-[48%] h-[82rem] w-[82rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${accent} 0%, rgba(255,255,255,0.12) 18%, rgba(3,4,7,0) 58%)`,
        }}
        animate={
          reduceMotion
            ? { opacity: 0.16 }
            : {
                scale: [0.96, 1.05, 0.96],
                opacity: [0.16, 0.24, 0.16],
              }
        }
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[58rem] w-[86rem] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/[0.055]"
        animate={
          reduceMotion
            ? { opacity: 0.24 }
            : {
                rotate: [0, 1.8, 0],
                scale: [1, 1.018, 1],
                opacity: [0.16, 0.28, 0.16],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[38rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/[0.045]"
        animate={
          reduceMotion
            ? { opacity: 0.2 }
            : {
                rotate: [0, -2.2, 0],
                scale: [1.02, 1, 1.02],
                opacity: [0.12, 0.24, 0.12],
              }
        }
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute left-[-12%] top-[18%] h-[26rem] w-[76rem] rotate-[-16deg] rounded-full blur-3xl"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.12), transparent)`,
        }}
        animate={
          reduceMotion
            ? { opacity: 0.08 }
            : {
                x: ["-4%", "6%", "-4%"],
                opacity: [0.045, 0.105, 0.045],
              }
        }
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="absolute inset-0 opacity-[0.018] [background-image:linear-gradient(rgba(255,255,255,0.85)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.85)_1px,transparent_1px)] [background-size:96px_96px]" />

      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white/[0.055] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-80 bg-gradient-to-r from-black/64 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-80 bg-gradient-to-l from-black/64 to-transparent" />

      {dustPoints.map((point) => (
        <motion.span
          key={`${point.left}-${point.top}`}
          className="absolute rounded-full bg-white"
          style={{
            left: point.left,
            top: point.top,
            width: point.size,
            height: point.size,
            boxShadow: `0 0 18px ${accent}`,
          }}
          animate={
            reduceMotion
              ? { opacity: 0.18 }
              : {
                  opacity: [0.05, 0.34, 0.05],
                  y: [-5, 5, -5],
                }
          }
          transition={{
            duration: 5.8,
            delay: point.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,transparent_46%,rgba(0,0,0,0.72)_100%)]" />
    </div>
  );
}
