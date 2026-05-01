"use client";

import { motion, useReducedMotion } from "motion/react";
import { getBackdropPreset } from "@/data/orbit/backdropPresets";
import { deriveBackdropState } from "@/lib/orbit/interpolateBackdrop";

type ViewportTier = "mobile" | "tablet" | "desktop";

type AtmosphericBackdropProps = {
  modeId?: string;
  accent?: string;
  isInspectOpen?: boolean;
  viewportTier?: ViewportTier;
};

export function AtmosphericBackdrop({
  modeId = "vision",
  accent,
  isInspectOpen = false,
  viewportTier = "desktop",
}: AtmosphericBackdropProps) {
  const preset = getBackdropPreset(modeId);
  const reduceMotion = useReducedMotion();

  const isMobile = viewportTier === "mobile";
  const isTablet = viewportTier === "tablet";
  const shouldAnimate = !reduceMotion && !isMobile;

  const derived = deriveBackdropState({
    preset,
    isInspectOpen,
    isMobile,
    isTablet,
  });

  const primaryGlow = accent
    ? preset.glow.replace(/rgba\(([^)]+)\)/, preset.glow)
    : preset.glow;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#020305]">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `
            radial-gradient(circle at 50% 38%, ${preset.baseC} 0%, transparent 34%),
            radial-gradient(circle at 18% 18%, ${preset.baseB} 0%, transparent 38%),
            linear-gradient(135deg, ${preset.baseA} 0%, #020305 42%, ${preset.baseB} 100%)
          `,
          opacity: isInspectOpen ? 0.94 : 1,
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="absolute left-1/2 top-[43%] h-[64rem] w-[88rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${primaryGlow} 0%, ${preset.secondaryGlow} 24%, transparent 66%)`,
          opacity: derived.glowOpacity,
          transform: "translate3d(-50%, -50%, 0)",
        }}
        animate={
          shouldAnimate
            ? {
                scale: [
                  derived.orbitScale * 0.96,
                  derived.orbitScale * 1.04,
                  derived.orbitScale * 0.96,
                ],
                x: ["-50%", "-48.5%", "-50%"],
                y: ["-50%", "-51.5%", "-50%"],
              }
            : undefined
        }
        transition={{
          duration: preset.driftSpeed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -right-[18%] top-[7%] hidden h-[42rem] w-[42rem] rounded-full md:block"
        style={{
          background: `radial-gradient(circle, ${preset.secondaryGlow} 0%, transparent 64%)`,
          opacity: derived.hazeOpacity,
        }}
        animate={
          shouldAnimate
            ? {
                x: [0, -26, 0],
                y: [0, 18, 0],
                scale: [0.94, 1.08, 0.94],
              }
            : undefined
        }
        transition={{
          duration: preset.driftSpeed + 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-[-26%] left-[8%] hidden h-[36rem] w-[60rem] rounded-full md:block"
        style={{
          background: `radial-gradient(circle, ${preset.glow} 0%, transparent 62%)`,
          opacity: derived.hazeOpacity * 0.7,
        }}
        animate={
          shouldAnimate
            ? {
                x: [0, 18, 0],
                y: [0, -12, 0],
                scale: [1, 1.06, 1],
              }
            : undefined
        }
        transition={{
          duration: preset.driftSpeed + 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="absolute inset-0 hidden md:block">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[48rem] w-[84rem] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-white/[0.035]"
          style={{
            opacity: derived.traceOpacity,
            boxShadow: `0 0 80px ${preset.trace}`,
          }}
          animate={
            shouldAnimate
              ? {
                  rotate: [0, 2.4, 0],
                  scale: [derived.orbitScale, derived.orbitScale * 1.025, derived.orbitScale],
                }
              : undefined
          }
          transition={{
            duration: preset.pulseSpeed + 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute left-1/2 top-1/2 h-[32rem] w-[66rem] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-white/[0.028]"
          style={{
            opacity: derived.traceOpacity * 0.72,
            boxShadow: `0 0 52px ${preset.trace}`,
          }}
          animate={
            shouldAnimate
              ? {
                  rotate: [0, -2, 0],
                  scale: [derived.orbitScale * 0.96, derived.orbitScale, derived.orbitScale * 0.96],
                }
              : undefined
          }
          transition={{
            duration: preset.pulseSpeed + 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        className="absolute left-[14%] right-[14%] top-[54%] hidden h-px md:block"
        style={{
          background: `linear-gradient(90deg, transparent, ${preset.trace}, rgba(255,255,255,0.52), ${preset.trace}, transparent)`,
          opacity: derived.traceOpacity * 0.82,
        }}
        animate={
          shouldAnimate
            ? {
                scaleX: [0.74, 1, 0.74],
                opacity: [
                  derived.traceOpacity * 0.18,
                  derived.traceOpacity * 0.86,
                  derived.traceOpacity * 0.18,
                ],
              }
            : undefined
        }
        transition={{
          duration: preset.pulseSpeed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{
          background: isInspectOpen
            ? "radial-gradient(circle at 50% 45%, transparent 0%, transparent 36%, rgba(0,0,0,0.48) 76%, rgba(0,0,0,0.82) 100%)"
            : "radial-gradient(circle at 50% 45%, transparent 0%, transparent 42%, rgba(0,0,0,0.38) 78%, rgba(0,0,0,0.74) 100%)",
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="orbit-atmos-noise absolute inset-0 opacity-[0.055]" />

      <div
        className="absolute inset-0 md:hidden"
        style={{
          background: `
            radial-gradient(circle at 50% 38%, ${preset.glow} 0%, transparent 46%),
            linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.58) 100%)
          `,
          opacity: isInspectOpen ? 0.28 : 0.42,
        }}
      />
    </div>
  );
}
