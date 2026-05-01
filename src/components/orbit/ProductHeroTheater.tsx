"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

type ViewportTier = "mobile" | "tablet" | "desktop";

type ProductHeroTheaterProps = {
  modeId: string;
  accent: string;
  viewportTier?: ViewportTier;
  isInspectOpen?: boolean;
  className?: string;
};

const heroMood: Record<
  string,
  {
    label: string;
    glow: string;
    secondary: string;
    trace: string;
    objectShift: string;
    objectScale: number;
    echoOpacity: number;
  }
> = {
  vision: {
    label: "Vision optics",
    glow: "rgba(104, 202, 255, 0.34)",
    secondary: "rgba(180, 226, 255, 0.12)",
    trace: "rgba(144, 226, 255, 0.62)",
    objectShift: "translate3d(4%, -1%, 0)",
    objectScale: 1.08,
    echoOpacity: 0.18,
  },
  translate: {
    label: "Language optics",
    glow: "rgba(174, 146, 255, 0.28)",
    secondary: "rgba(225, 214, 255, 0.12)",
    trace: "rgba(195, 178, 255, 0.58)",
    objectShift: "translate3d(5%, -2%, 0)",
    objectScale: 1.06,
    echoOpacity: 0.16,
  },
  recall: {
    label: "Memory optics",
    glow: "rgba(235, 216, 166, 0.22)",
    secondary: "rgba(255, 234, 190, 0.1)",
    trace: "rgba(240, 218, 170, 0.48)",
    objectShift: "translate3d(3%, 0%, 0)",
    objectScale: 1.04,
    echoOpacity: 0.14,
  },
  create: {
    label: "Creator optics",
    glow: "rgba(112, 238, 229, 0.28)",
    secondary: "rgba(185, 255, 245, 0.11)",
    trace: "rgba(158, 255, 244, 0.56)",
    objectShift: "translate3d(5%, -1%, 0)",
    objectScale: 1.09,
    echoOpacity: 0.18,
  },
  focus: {
    label: "Reduced optics",
    glow: "rgba(145, 180, 195, 0.16)",
    secondary: "rgba(230, 245, 255, 0.06)",
    trace: "rgba(190, 220, 232, 0.32)",
    objectShift: "translate3d(4%, 0%, 0)",
    objectScale: 1.02,
    echoOpacity: 0.1,
  },
  privacy: {
    label: "Trust optics",
    glow: "rgba(110, 230, 204, 0.22)",
    secondary: "rgba(180, 255, 226, 0.08)",
    trace: "rgba(150, 255, 220, 0.42)",
    objectShift: "translate3d(4%, -1%, 0)",
    objectScale: 1.04,
    echoOpacity: 0.12,
  },
};

function getMood(modeId: string) {
  return heroMood[modeId] ?? heroMood.vision;
}

export function ProductHeroTheater({
  modeId,
  accent,
  viewportTier = "desktop",
  isInspectOpen = false,
  className = "",
}: ProductHeroTheaterProps) {
  const reduceMotion = useReducedMotion();
  const mood = getMood(modeId);
  const isMobile = viewportTier === "mobile";
  const isTablet = viewportTier === "tablet";
  const shouldAnimate = !reduceMotion && !isMobile && !isInspectOpen;

  return (
    <div
      className={`orbit-hero-stage pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <motion.div
        className="orbit-hero-glow absolute left-[43%] top-[43%] h-[38rem] w-[54rem] -translate-x-1/2 -translate-y-1/2 rounded-full md:left-[58%] md:top-[44%]"
        style={{
          background: `radial-gradient(circle, ${mood.glow} 0%, ${mood.secondary} 32%, transparent 68%)`,
          opacity: isInspectOpen ? 0.18 : isMobile ? 0.16 : isTablet ? 0.32 : 0.42,
        }}
        animate={
          shouldAnimate
            ? {
                scale: [0.96, 1.04, 0.96],
                x: ["-50%", "-49%", "-50%"],
                y: ["-50%", "-51%", "-50%"],
              }
            : undefined
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="orbit-hero-plane absolute left-[46%] top-[34%] hidden h-[16rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] rounded-full md:block"
        style={{
          background: `linear-gradient(90deg, transparent, ${mood.secondary}, rgba(255,255,255,0.06), transparent)`,
          opacity: isInspectOpen ? 0.08 : isTablet ? 0.18 : 0.24,
        }}
        animate={
          shouldAnimate
            ? {
                rotate: [-5, -3.4, -5],
                scaleX: [0.95, 1.04, 0.95],
              }
            : undefined
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="orbit-hero-object absolute left-[44%] top-[50%] z-[8] w-[95%] max-w-[58rem] -translate-x-1/2 -translate-y-1/2 md:left-[60%] md:top-[50%] md:w-[72%] lg:left-[61%] lg:w-[68%]"
        style={{
          transformOrigin: "center",
        }}
        initial={false}
        animate={{
          opacity: isInspectOpen ? 0.34 : 1,
          scale: isMobile ? 0.92 : isTablet ? 1.04 : mood.objectScale,
          filter: isMobile
            ? "none"
            : isInspectOpen
              ? "saturate(0.72) brightness(0.72)"
              : "saturate(1.03) brightness(1)",
        }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="relative aspect-[16/9] w-full"
          animate={
            shouldAnimate
              ? {
                  x: [0, 8, 0],
                  y: [0, -4, 0],
                  rotate: [0, -0.35, 0],
                }
              : undefined
          }
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/glasses/orbit-lens-hero-16x9.png"
            alt=""
            fill
            priority
            sizes="(max-width: 767px) 96vw, (max-width: 1179px) 72vw, 68vw"
            className="object-contain"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="orbit-hero-echo absolute left-[63%] top-[43%] z-[6] hidden w-[48%] max-w-[42rem] -translate-x-1/2 -translate-y-1/2 opacity-20 md:block"
        style={{
          opacity: isInspectOpen ? 0.04 : mood.echoOpacity,
        }}
        animate={
          shouldAnimate
            ? {
                x: [0, -10, 0],
                y: [0, 6, 0],
                scale: [0.94, 1.02, 0.94],
              }
            : undefined
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[999px] opacity-80 blur-[1.2px]">
          <Image
            src="/glasses/orbit-lens-hero-16x9.png"
            alt=""
            fill
            sizes="42vw"
            className="object-contain"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
      </motion.div>

      <motion.div
        className="orbit-hero-shadowbed absolute left-[54%] top-[67%] z-[5] h-[4.5rem] w-[42rem] -translate-x-1/2 rounded-full md:left-[61%] md:top-[68%]"
        style={{
          background: `radial-gradient(ellipse, rgba(0,0,0,0.72) 0%, ${mood.glow} 18%, rgba(0,0,0,0.2) 46%, transparent 72%)`,
          opacity: isInspectOpen ? 0.18 : isMobile ? 0.18 : 0.34,
        }}
        animate={
          shouldAnimate
            ? {
                scaleX: [0.94, 1.06, 0.94],
                opacity: [0.26, 0.38, 0.26],
              }
            : undefined
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="orbit-hero-trace absolute left-[18%] right-[10%] top-[52%] z-[10] h-px md:left-[28%]"
        style={{
          background: `linear-gradient(90deg, transparent, ${mood.trace}, rgba(255,255,255,0.52), ${accent}, transparent)`,
          opacity: isInspectOpen ? 0.1 : isMobile ? 0.2 : 0.42,
        }}
        animate={
          shouldAnimate
            ? {
                scaleX: [0.82, 1, 0.82],
                opacity: [0.16, 0.46, 0.16],
              }
            : undefined
        }
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute left-[70%] top-[39%] z-[11] hidden md:block">
        <motion.span
          className="block h-2 w-2 rounded-full"
          style={{
            background: accent,
            boxShadow: `0 0 22px ${accent}`,
            opacity: isInspectOpen ? 0.12 : 0.7,
          }}
          animate={shouldAnimate ? { scale: [0.8, 1.2, 0.8] } : undefined}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div
        className="absolute bottom-[10%] right-[12%] z-[11] hidden rounded-full border border-white/[0.08] bg-black/[0.18] px-3 py-1.5 text-[0.48rem] uppercase tracking-[0.24em] text-white/24 md:block"
        style={{
          color: isInspectOpen ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.28)",
        }}
      >
        {mood.label}
      </div>
    </div>
  );
}
