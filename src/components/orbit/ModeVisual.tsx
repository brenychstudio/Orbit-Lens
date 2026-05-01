"use client";

import Image from "next/image";
import { motion } from "motion/react";

type ModeVisualProps = {
  modeId: string;
  accent: string;
};

const modeVisuals: Record<string, { src: string; alt: string }> = {
  vision: {
    src: "/interface/vision-mode-city-16x9.png",
    alt: "Orbit Lens vision mode city navigation interface",
  },
  translate: {
    src: "/interface/spatial-cards-overview-16x9.png",
    alt: "Orbit Lens spatial cards overview interface",
  },
  recall: {
    src: "/interface/recall-mode-memory-16x9.png",
    alt: "Orbit Lens recall mode memory interface",
  },
  create: {
    src: "/interface/create-mode-framing-16x9.png",
    alt: "Orbit Lens create mode framing interface",
  },
  focus: {
    src: "/interface/focus-mode-minimal-16x9.png",
    alt: "Orbit Lens focus mode minimal interface",
  },
  privacy: {
    src: "/interface/privacy-visible-capture-16x9.png",
    alt: "Orbit Lens privacy visible capture interface",
  },
};

export function ModeVisual({ modeId, accent }: ModeVisualProps) {
  const visual = modeVisuals[modeId] ?? modeVisuals.vision!;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.6rem]">
      <motion.div
        key={visual.src}
        initial={{ opacity: 0, scale: 1.045, filter: "blur(12px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          sizes="(max-width: 1024px) 90vw, 820px"
          className="scale-[1.015] object-cover opacity-[0.5]"
          priority={modeId === "vision"}
        />
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.42)_38%,rgba(0,0,0,0.2)_68%,rgba(0,0,0,0.44)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_64%_34%,transparent_0%,rgba(0,0,0,0.06)_34%,rgba(0,0,0,0.52)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_34%_16%,rgba(255,255,255,0.11),transparent_38%)]" />

      <div className="absolute inset-0 opacity-[0.014] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:64px_64px]" />

      <motion.div
        className="absolute right-10 top-10 h-px w-48"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
        animate={{ opacity: [0.08, 0.28, 0.08], x: [-10, 10, -10] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-x-10 bottom-10 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.18), ${accent}, rgba(255,255,255,0.18), transparent)`,
        }}
        animate={{ opacity: [0.08, 0.24, 0.08], scaleX: [0.94, 1, 0.94] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/54 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/32 to-transparent" />
    </div>
  );
}
