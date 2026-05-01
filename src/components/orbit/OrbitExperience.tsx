"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AtmosphericBackdrop } from "@/components/orbit/AtmosphericBackdrop";
import { ModeInteractiveOverlay } from "@/components/orbit/ModeInteractiveOverlay";
import { OpticsInspectLayer } from "@/components/orbit/OpticsInspectLayer";
import { ShellChrome } from "@/components/orbit/ShellChrome";
import { orbitModes } from "@/data/orbitModes";

type FieldCopy = {
  field: string;
  headline: string;
  subline: string;
  signal: string;
  leftCard: string;
  rightCard: string;
  bottomCard: string;
  visual: string;
};

type ViewportTier = "mobile" | "tablet" | "desktop";

function getViewportTier(width: number): ViewportTier {
  if (width < 768) return "mobile";
  if (width < 1180) return "tablet";
  return "desktop";
}

const fieldCopy: Record<string, FieldCopy> = {
  vision: {
    field: "Field 01 / Vision",
    headline: "Spatial clarity without the noise.",
    subline:
      "A calmer city layer that appears briefly, guides softly and disappears back into the world.",
    signal: "Spatial clarity / city layer",
    leftCard: "City layer detected",
    rightCard: "Route signal / 12 m",
    bottomCard: "Context density: low",
    visual: "/interface/vision-mode-city-16x9.png",
  },
  translate: {
    field: "Field 02 / Translate",
    headline: "Language becomes a transparent layer.",
    subline:
      "Live captions stay face-forward, atmospheric and quiet — without turning conversation into a screen.",
    signal: "Live language layer",
    leftCard: "Live caption stream",
    rightCard: "Language layer active",
    bottomCard: "Subtitle opacity: adaptive",
    visual: "/interface/spatial-cards-overview-16x9.png",
  },
  recall: {
    field: "Field 03 / Recall",
    headline: "Memory begins only when you ask.",
    subline:
      "Orbit Lens treats recall as an intentional action, not a silent recording habit.",
    signal: "Intentional memory",
    leftCard: "Memory note ready",
    rightCard: "Place context saved",
    bottomCard: "Manual capture only",
    visual: "/interface/recall-mode-memory-16x9.png",
  },
  create: {
    field: "Field 04 / Create",
    headline: "Capture references. Keep presence.",
    subline: "Frame and collect visual notes without leaving the scene.",
    signal: "Creator capture field",
    leftCard: "Framing assist",
    rightCard: "Scene reference locked",
    bottomCard: "Capture angle: stable",
    visual: "/interface/create-mode-framing-16x9.png",
  },
  focus: {
    field: "Field 05 / Focus",
    headline: "Less interface. More attention.",
    subline:
      "Focus mode removes noise instead of adding another notification surface.",
    signal: "Attention quiet mode",
    leftCard: "Noise reduced",
    rightCard: "Priority signal only",
    bottomCard: "Notifications muted",
    visual: "/interface/focus-mode-minimal-16x9.png",
  },
  privacy: {
    field: "Field 06 / Privacy",
    headline: "Trust is part of the interface.",
    subline:
      "Visible capture states and user-controlled memory are designed into the first interaction.",
    signal: "Visible trust state",
    leftCard: "Visible capture state",
    rightCard: "Consent layer active",
    bottomCard: "User-controlled memory",
    visual: "/interface/privacy-visible-capture-16x9.png",
  },
  access: {
    field: "Field 07 / Access",
    headline: "A quieter spatial interface.",
    subline:
      "A fictional AI spatial glasses launch prototype by Brenych Studio, designed around calm context, visible trust and premium field-of-view interaction.",
    signal: "About / contact / prototype access",
    leftCard: "Brenych Studio",
    rightCard: "Private preview",
    bottomCard: "Contact / portfolio / GitHub",
    visual: "/interface/orbit-mode-selector-16x9.png",
  },
};

function GlassPane({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`orbit-glass-panel overflow-hidden rounded-[2rem] border backdrop-blur-[24px] ${className}`}>
      {children}
    </div>
  );
}

function FloatingGlassChip({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full border border-white/[0.12] bg-white/[0.045] px-4 py-2 text-[0.56rem] uppercase tracking-[0.24em] text-white/48 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-[18px] ${className}`}
      initial={{ opacity: 0, y: 8, scale: 0.98, filter: "blur(10px)" }}
      animate={{
        opacity: [0.22, 0.58, 0.22],
        y: [5, -5, 5],
        scale: [0.98, 1, 0.98],
        filter: ["blur(2px)", "blur(0px)", "blur(2px)"],
      }}
      transition={{
        duration: 7.2,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

function OpticalSweep({ accent }: { accent: string }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-y-0 z-40 w-[34%] -skew-x-12 blur-2xl"
      style={{
        background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.18), transparent)`,
      }}
      initial={{ left: "-44%", opacity: 0 }}
      animate={{ left: ["-44%", "112%"], opacity: [0, 0.2, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

const field04ReferenceItems = [
  {
    title: "Mountain Light",
    meta: "Landscape / saved",
    src: "/interface/create-mode-framing-16x9.png",
  },
  {
    title: "City Route",
    meta: "Context / pinned",
    src: "/interface/vision-mode-city-16x9.png",
  },
  {
    title: "Caption Field",
    meta: "Language / reference",
    src: "/interface/spatial-cards-overview-16x9.png",
  },
  {
    title: "Memory Trace",
    meta: "Recall / manual",
    src: "/interface/recall-mode-memory-16x9.png",
  },
  {
    title: "Quiet Signal",
    meta: "Focus / low noise",
    src: "/interface/focus-mode-minimal-16x9.png",
  },
  {
    title: "Visible Trust",
    meta: "Privacy / indicator",
    src: "/interface/privacy-visible-capture-16x9.png",
  },
];

type ReferenceOrbitSlot = {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  blur: string;
  rotateY: number;
  rotateZ: number;
  zIndex: number;
};

function getReferenceOrbitSlot(
  offset: number,
  isHovering: boolean,
): ReferenceOrbitSlot {
  const hoverBoost = isHovering ? 1 : 0;

  if (offset === 0) {
    return {
      x: -42,
      y: -30,
      scale: isHovering ? 1.04 : 1,
      opacity: 0.94,
      blur: "blur(0px)",
      rotateY: isHovering ? -4 : -2,
      rotateZ: -0.8,
      zIndex: 8,
    };
  }

  if (offset === 1) {
    return {
      x: 205 + hoverBoost * 10,
      y: -82,
      scale: 0.7,
      opacity: 0.44,
      blur: "blur(1.4px)",
      rotateY: -14,
      rotateZ: 2.4,
      zIndex: 5,
    };
  }

  if (offset === -1) {
    return {
      x: -230 - hoverBoost * 8,
      y: 84,
      scale: 0.76,
      opacity: 0.52,
      blur: "blur(0.8px)",
      rotateY: 12,
      rotateZ: -2.2,
      zIndex: 6,
    };
  }

  if (offset === 2) {
    return {
      x: 255 + hoverBoost * 14,
      y: 124,
      scale: 0.52,
      opacity: 0.25,
      blur: "blur(2.4px)",
      rotateY: -20,
      rotateZ: 4,
      zIndex: 3,
    };
  }

  if (offset === -2) {
    return {
      x: -120 - hoverBoost * 12,
      y: -140,
      scale: 0.54,
      opacity: 0.28,
      blur: "blur(2.1px)",
      rotateY: 18,
      rotateZ: -3.4,
      zIndex: 3,
    };
  }

  return {
    x: 42,
    y: 178,
    scale: 0.42,
    opacity: 0.14,
    blur: "blur(3.2px)",
    rotateY: 0,
    rotateZ: 1.5,
    zIndex: 1,
  };
}

function ReferenceOrbitDeck({ accent }: { accent: string }) {
  const [activeReferenceIndex, setActiveReferenceIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const referenceWheelLockRef = useRef(0);

  const goToReference = useCallback((delta: number) => {
    setActiveReferenceIndex((current) => {
      const total = field04ReferenceItems.length;
      return ((current + delta) % total + total) % total;
    });
  }, []);

  return (
    <motion.div
      className="pointer-events-auto absolute right-[4.8%] top-[14%] z-[22] hidden h-[34.5rem] w-[43rem] lg:block xl:right-[5.8%] xl:top-[13%]"
      initial={{ opacity: 0, y: 20, filter: "blur(18px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -14, filter: "blur(14px)" }}
      transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
      onPointerDown={(event) => event.stopPropagation()}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onWheel={(event) => {
        event.stopPropagation();

        const now = Date.now();

        if (now - referenceWheelLockRef.current < 420) return;
        if (Math.abs(event.deltaY) < 18) return;

        referenceWheelLockRef.current = now;
        goToReference(event.deltaY > 0 ? 1 : -1);
      }}
    >
      <motion.div
        className="pointer-events-none absolute left-[18%] top-[43%] h-[18rem] w-[31rem] -translate-y-1/2 rounded-full border border-white/[0.045]"
        style={{
          boxShadow: `0 0 80px rgba(255,255,255,0.035), inset 0 0 60px ${accent}`,
        }}
        animate={{
          opacity: isHovering ? [0.12, 0.24, 0.12] : [0.06, 0.14, 0.06],
          scaleX: isHovering ? [0.98, 1.04, 0.98] : [0.96, 1.02, 0.96],
          scaleY: [0.9, 1, 0.9],
        }}
        transition={{ duration: 8.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="pointer-events-none absolute left-[12%] top-[44%] h-px w-[76%]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.28), transparent)`,
        }}
        animate={{
          opacity: isHovering ? [0.16, 0.42, 0.16] : [0.08, 0.24, 0.08],
          scaleX: [0.9, 1, 0.9],
        }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {field04ReferenceItems.map((item, index) => {
        const rawOffset = index - activeReferenceIndex;
        const half = field04ReferenceItems.length / 2;
        const offset =
          rawOffset > half
            ? rawOffset - field04ReferenceItems.length
            : rawOffset < -half
              ? rawOffset + field04ReferenceItems.length
              : rawOffset;

        const slot = getReferenceOrbitSlot(offset, isHovering);
        const isActive = offset === 0;

        return (
          <motion.button
            key={item.title}
            type="button"
            aria-label={`Select reference ${item.title}`}
            className="absolute left-[40%] top-[38%] h-[12.9rem] w-[18.2rem] overflow-hidden rounded-[1.55rem] border border-white/[0.1] bg-black/[0.18] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-[18px]"
            style={{
              zIndex: slot.zIndex,
              transformOrigin: "50% 50%",
              transformStyle: "preserve-3d",
            }}
            initial={false}
            animate={{
              x: slot.x,
              y: slot.y,
              scale: slot.scale,
              opacity: slot.opacity,
              rotateY: slot.rotateY,
              rotateZ: slot.rotateZ,
              filter: slot.blur,
            }}
            transition={{
              type: "spring",
              stiffness: 86,
              damping: 20,
              mass: 0.9,
            }}
            onClick={() => setActiveReferenceIndex(index)}
          >
            <span className="absolute inset-0 z-0">
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="360px"
                className="object-cover opacity-[0.78]"
              />
            </span>

            <span className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.58))]" />

            <motion.span
              className="absolute left-4 top-4 z-[2] h-2 w-2 rounded-full"
              style={{
                background: isActive ? accent : "rgba(255,255,255,0.3)",
                boxShadow: isActive ? `0 0 18px ${accent}` : "none",
              }}
              animate={{
                opacity: isActive ? [0.58, 1, 0.58] : 0.36,
                scale: isActive ? [0.92, 1.18, 0.92] : 1,
              }}
              transition={{
                duration: 2.8,
                repeat: isActive ? Infinity : 0,
                ease: "easeInOut",
              }}
            />

            <span className="absolute inset-x-4 bottom-4 z-[2]">
              <span className="block text-[0.54rem] uppercase tracking-[0.28em] text-white/34">
                {item.meta}
              </span>
              <span className="mt-1.5 block text-[0.72rem] uppercase tracking-[0.22em] text-white/72">
                {item.title}
              </span>
            </span>

            {isActive ? (
              <motion.span
                className="absolute inset-x-4 bottom-[3.25rem] z-[2] h-px"
                style={{
                  background: `linear-gradient(90deg, ${accent}, rgba(255,255,255,0.3), transparent)`,
                }}
                animate={{
                  opacity: [0.22, 0.62, 0.22],
                  scaleX: [0.82, 1, 0.82],
                }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : null}
          </motion.button>
        );
      })}

      <motion.div
        className="pointer-events-none absolute bottom-[6.8rem] left-[39%] z-[24] -translate-x-1/2 rounded-full border border-white/[0.08] bg-black/[0.18] px-4 py-2 text-[0.55rem] uppercase tracking-[0.26em] text-white/38 backdrop-blur-[18px]"
        animate={{
          opacity: isHovering ? 0.72 : 0.34,
          y: isHovering ? -3 : 0,
        }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        Wheel / hover / reference orbit
      </motion.div>

      <div className="pointer-events-none absolute bottom-[3.3rem] left-[39%] z-[24] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/[0.08] bg-black/[0.16] px-3 py-2 backdrop-blur-[18px]">
        {field04ReferenceItems.map((item, index) => (
          <span
            key={item.title}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: index === activeReferenceIndex ? "1.9rem" : "0.45rem",
              background:
                index === activeReferenceIndex ? accent : "rgba(255,255,255,0.2)",
              boxShadow:
                index === activeReferenceIndex ? `0 0 14px ${accent}` : "none",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function RecallConsoleV2({ accent }: { accent: string }) {
  const message =
    "Memory opens only after a direct request. The field keeps context visible, controlled and temporary.";

  const [visibleChars, setVisibleChars] = useState(0);
  const typedText = message.slice(0, visibleChars);
  const isTypedComplete = visibleChars >= message.length;

  useEffect(() => {
    let interval: number | undefined;

    const startDelay = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setVisibleChars((current) => {
          if (current >= message.length) {
            if (interval) window.clearInterval(interval);
            return current;
          }

          return current + 1;
        });
      }, 38);
    }, 520);

    return () => {
      window.clearTimeout(startDelay);
      if (interval) window.clearInterval(interval);
    };
  }, [message]);

  const statusRows = [
    {
      label: "Place Context",
      value: "Recognized",
      tone: "rgba(237, 218, 168, 0.86)",
      labelClass: "left-[50.2%] top-[55.8%]",
      valueClass: "left-[50.2%] top-[58.5%]",
      align: "left" as const,
    },
    {
      label: "Voice Fragment",
      value: "Indexed",
      tone: "rgba(154, 193, 255, 0.88)",
      labelClass: "right-[10.8%] top-[55.9%]",
      valueClass: "right-[10.8%] top-[58.6%]",
      align: "right" as const,
    },
    {
      label: "Memory State",
      value: "Manual Only",
      tone: "rgba(222, 195, 145, 0.86)",
      labelClass: "left-[53.8%] top-[65.1%]",
      valueClass: "left-[53.8%] top-[67.8%]",
      align: "left" as const,
    },
    {
      label: "Recording",
      value: "Inactive",
      tone: "rgba(255, 255, 255, 0.72)",
      labelClass: "left-[67.6%] top-[61.2%]",
      valueClass: "left-[67.6%] top-[63.9%]",
      align: "left" as const,
    },
  ];

  const waveform = [16, 26, 18, 34, 22, 31, 18, 28, 24, 38, 20, 30, 16, 26, 22, 34];

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20 hidden lg:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute right-[6.5%] top-[18.2%] w-[29rem]"
        initial={{ opacity: 0, y: 18, filter: "blur(18px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(12px)" }}
        transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={{
            y: [0, -4, 0],
            x: [0, 1.5, 0],
          }}
          transition={{
            duration: 9.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "transform" }}
        >
          <GlassPane className="px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_90px_rgba(0,0,0,0.42)]">
            <div className="flex items-center justify-between gap-5">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: "rgba(237, 218, 168, 0.78)",
                    boxShadow: "0 0 18px rgba(237, 218, 168, 0.22)",
                  }}
                />
                <p
                  className="text-[0.58rem] uppercase tracking-[0.3em]"
                  style={{ color: "rgba(237, 218, 168, 0.72)" }}
                >
                  Recall Layer
                </p>
              </div>

              <p className="text-[0.55rem] uppercase tracking-[0.26em] text-white/34">
                User Initiated
              </p>
            </div>

            <div className="mt-4 border-t border-white/[0.08] pt-4">
              <p className="max-w-[24.5rem] text-[1.02rem] leading-8 text-white/68">
                {typedText}
                <motion.span
                  className="ml-1 inline-block h-5 w-px align-[-0.18rem]"
                  style={{ background: accent }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                />
              </p>
            </div>
          </GlassPane>
        </motion.div>
      </motion.div>

      {/* Scattered text overlays */}
      {statusRows.map((row, index) => (
        <Fragment key={row.label}>
          <motion.div
            className={`absolute z-[22] ${row.labelClass} ${
              row.align === "right" ? "text-right" : "text-left"
            }`}
            initial={{
              opacity: 0,
              y: 12,
              scale: 0.985,
              filter: "blur(12px)",
            }}
            animate={{
              opacity: isTypedComplete ? 0.92 : 0,
              y: isTypedComplete ? 0 : 12,
              scale: isTypedComplete ? 1 : 0.985,
              filter: isTypedComplete ? "blur(0px)" : "blur(12px)",
            }}
            transition={{
              duration: 0.92,
              delay: isTypedComplete ? 0.24 + index * 0.16 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.p
              className="text-[0.54rem] uppercase tracking-[0.28em] text-white/26"
              animate={{
                opacity: [0.18, 0.34, 0.22],
                y: [0, -0.5, 0],
              }}
              transition={{
                duration: 5.2 + index * 0.45,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ willChange: "opacity, transform" }}
            >
              {row.label}
            </motion.p>
          </motion.div>

          <motion.div
            className={`absolute z-[22] ${row.valueClass} ${
              row.align === "right" ? "text-right" : "text-left"
            }`}
            initial={{
              opacity: 0,
              y: 14,
              scale: 0.982,
              filter: "blur(14px)",
            }}
            animate={{
              opacity: isTypedComplete ? 1 : 0,
              y: isTypedComplete ? 0 : 14,
              scale: isTypedComplete ? 1 : 0.982,
              filter: isTypedComplete ? "blur(0px)" : "blur(14px)",
            }}
            transition={{
              duration: 1.08,
              delay: isTypedComplete ? 0.38 + index * 0.16 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.p
              className="text-[0.84rem] uppercase tracking-[0.18em]"
              style={{
                color: row.tone,
                textShadow: `0 0 14px ${row.tone}`,
                willChange: "transform, opacity",
              }}
              animate={{
                opacity: [0.58, 0.92, 0.72],
                y: [0, -1.2, 0],
              }}
              transition={{
                duration: 6 + index * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {row.value}
            </motion.p>
          </motion.div>
        </Fragment>
      ))}

      {/* Separate voice fragment pod */}
      <motion.div
        className="absolute left-[51.2%] top-[77.2%] w-[14.2rem] -translate-y-1/2"
        initial={{ opacity: 0, y: 12, filter: "blur(12px)" }}
        animate={{
          opacity: isTypedComplete ? 1 : 0,
          y: isTypedComplete ? 0 : 12,
          filter: isTypedComplete ? "blur(0px)" : "blur(12px)",
        }}
        transition={{
          duration: 0.7,
          delay: isTypedComplete ? 0.72 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <motion.div
          animate={{
            y: [0, -3, 0],
            x: [0, 1, 0],
          }}
          transition={{
            duration: 7.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "transform" }}
        >
          <GlassPane className="px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_50px_rgba(0,0,0,0.34)]">
            <div className="mb-2 flex items-center justify-between gap-4">
              <p className="text-[0.54rem] uppercase tracking-[0.28em] text-white/30">
                Voice Fragment 01
              </p>
              <p className="text-[0.5rem] uppercase tracking-[0.24em] text-white/24">
                Local / Not Continuous
              </p>
            </div>

            <div className="flex h-9 items-center gap-[0.28rem] overflow-hidden">
              {waveform.map((height, index) => (
                <motion.span
                  key={`${height}-${index}`}
                  className="w-px rounded-full"
                  style={{
                    height,
                    background:
                      index % 4 === 0
                        ? "rgba(237, 218, 168, 0.64)"
                        : "rgba(255,255,255,0.34)",
                    boxShadow:
                      index % 4 === 0
                        ? "0 0 12px rgba(237, 218, 168, 0.24)"
                        : "none",
                  }}
                  animate={{
                    scaleY: [0.52, 1, 0.62],
                    opacity: [0.28, 0.78, 0.34],
                  }}
                  transition={{
                    duration: 1.6 + index * 0.03,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.045,
                  }}
                />
              ))}

              <motion.span
                className="ml-2 h-px flex-1"
                style={{
                  background: `linear-gradient(90deg, ${accent}, rgba(255,255,255,0.16), transparent)`,
                }}
                animate={{
                  opacity: [0.16, 0.48, 0.16],
                  scaleX: [0.92, 1, 0.92],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </GlassPane>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function OrbitFieldRail({
  accent,
  copy,
  activeIndex,
  onSelect,
  onInspect,
}: {
  accent: string;
  copy: FieldCopy;
  activeIndex: number;
  onSelect: (index: number) => void;
  onInspect: () => void;
}) {
  return (
    <div className="absolute inset-x-4 bottom-4 z-30 overflow-hidden rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_100px_rgba(0,0,0,0.38)] backdrop-blur-[24px] sm:inset-x-6 md:px-5">
      <div className="grid items-center gap-3 md:grid-cols-[0.85fr_1.35fr_auto]">
        <div className="flex items-center gap-3">
          <motion.span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: accent, boxShadow: `0 0 26px ${accent}` }}
            animate={{ opacity: [0.34, 1, 0.34], scale: [0.9, 1.18, 0.9] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div>
            <p className="text-[0.52rem] uppercase tracking-[0.28em] text-white/28">
              Active Field
            </p>
            <p className="mt-1 text-[0.68rem] uppercase tracking-[0.22em] text-white/66">
              {copy.signal}
            </p>
          </div>
        </div>

        <div className="relative hidden h-9 overflow-hidden rounded-full border border-white/[0.09] bg-black/20 md:block">
          <div className="absolute inset-x-5 top-1/2 h-px -translate-y-1/2 bg-white/10" />

          <motion.div
            className="absolute top-1/2 h-[0.3rem] w-32 -translate-y-1/2 rounded-full blur-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.9), ${accent}, transparent)`,
              boxShadow: `0 0 28px ${accent}`,
            }}
            animate={{ left: ["3%", "76%", "3%"] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {orbitModes.map((mode, index) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => onSelect(index)}
              className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-white/20 transition"
              style={{
                left: `${12 + index * 15}%`,
                background:
                  index === activeIndex ? accent : "rgba(255,255,255,0.18)",
                boxShadow:
                  index === activeIndex ? `0 0 22px ${accent}` : "none",
              }}
              aria-label={`Open ${mode.id} mode`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 md:justify-end">
          <p className="hidden max-w-[16rem] text-xs leading-5 text-white/42 lg:block">
            {copy.bottomCard}
          </p>

          <button
            type="button"
            onClick={onInspect}
            aria-label="Inspect Orbit Lens optics"
            className="group relative inline-flex shrink-0 items-center gap-2 px-1 py-2 text-[0.52rem] uppercase tracking-[0.29em] text-white/46 transition hover:text-white/76"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: accent,
                boxShadow: `0 0 14px ${accent}`,
              }}
            />
            <span className="relative z-10">Inspect Optics</span>
            <span
              className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
              style={{
                background: `linear-gradient(90deg, ${accent}, rgba(255,255,255,0.38), transparent)`,
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export function OrbitExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState(1);
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [viewportTier, setViewportTier] = useState<ViewportTier>("desktop");
  const wheelLockRef = useRef(0);

  const activeMode = orbitModes[activeIndex] ?? orbitModes[0]!;
  const copy = fieldCopy[activeMode.id] ?? fieldCopy.vision!;
  const isAccessField = activeMode.id === "access";
  const isRecallField = activeMode.id === "recall";
  const isCreateField = activeMode.id === "create";

  useEffect(() => {
    const syncViewportTier = () => {
      setViewportTier(getViewportTier(window.innerWidth));
    };

    const initialSync = window.setTimeout(syncViewportTier, 0);
    window.addEventListener("resize", syncViewportTier);

    return () => {
      window.clearTimeout(initialSync);
      window.removeEventListener("resize", syncViewportTier);
    };
  }, []);

  const inspectScale =
    viewportTier === "mobile" ? 1 : viewportTier === "tablet" ? 1.08 : 1.24;

  const inspectYOffset =
    viewportTier === "mobile" ? 0 : viewportTier === "tablet" ? -2 : -4;

  const currentProgress = useMemo(
    () =>
      `${String(activeIndex + 1).padStart(2, "0")} / ${String(orbitModes.length).padStart(2, "0")}`,
    [activeIndex],
  );

  const goToIndex = useCallback(
    (nextIndex: number) => {
      const safeIndex =
        ((nextIndex % orbitModes.length) + orbitModes.length) %
        orbitModes.length;

      if (safeIndex === activeIndex) return;

      setTransitionDirection(nextIndex > activeIndex ? 1 : -1);
      setActiveIndex(safeIndex);
    },
    [activeIndex],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isInspectOpen) {
        setIsInspectOpen(false);
        return;
      }

      if (isInspectOpen) return;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        goToIndex(activeIndex + 1);
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        goToIndex(activeIndex - 1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, goToIndex, isInspectOpen]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030407] text-[#f4efe6]">
      <AtmosphericBackdrop
        modeId={activeMode.id}
        accent={activeMode.accent}
        isInspectOpen={isInspectOpen}
        viewportTier={viewportTier}
      />

      <section className="mobile-stability-mode relative z-10 flex min-h-screen items-start justify-center px-2.5 py-3 sm:px-4 md:items-center md:px-8 md:py-6">
        <div className="mx-auto w-full max-w-[1488px]">
          <motion.div
            className="orbit-shell-material relative isolate w-full origin-center select-none overflow-hidden rounded-[2rem] border p-3 backdrop-blur-[30px] sm:p-4 md:rounded-[3.2rem] md:p-5 xl:rounded-[3.8rem] xl:p-6"
            animate={{
              scale: isInspectOpen ? inspectScale : 1,
              y: isInspectOpen ? inspectYOffset : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 88,
              damping: 18,
              mass: 0.85,
            }}
            drag={isInspectOpen ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) goToIndex(activeIndex + 1);
              if (info.offset.x > 80) goToIndex(activeIndex - 1);
            }}
            onWheel={(event) => {
              if (isInspectOpen) return;

              const now = Date.now();

              if (now - wheelLockRef.current < 760) return;
              if (Math.abs(event.deltaY) < 36) return;

              wheelLockRef.current = now;
              goToIndex(activeIndex + (event.deltaY > 0 ? 1 : -1));
            }}
          >
            <div className="orbit-edge-light z-[2]" />

            <ShellChrome accent={activeMode.accent} />

            <div className="orbit-glass-panel mb-3 flex items-center justify-between rounded-full border px-3 py-2.5 text-[0.56rem] uppercase tracking-[0.22em] text-white/44 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-[18px] sm:px-4 md:mb-4 md:py-3 md:text-[0.66rem] md:tracking-[0.26em]">
              <span>
                {isInspectOpen ? "Optics Inspection Field" : "Orbit Field Interface"}
              </span>
              <span>{currentProgress}</span>
            </div>

            <div className="orbit-inner-field-material relative min-h-[calc(100svh-9.25rem)] overflow-hidden rounded-[1.35rem] border backdrop-blur-[20px] sm:min-h-[38rem] md:min-h-[43rem] md:rounded-[2.3rem] lg:min-h-[680px] xl:rounded-[2.8rem]">
              <motion.div
                className="pointer-events-none absolute inset-0 z-[25] bg-black"
                animate={{ opacity: isInspectOpen ? 0.44 : 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />

              <AnimatePresence mode="wait" custom={transitionDirection}>
                <motion.div
                  key={`scene-${activeMode.id}`}
                  className="absolute inset-0"
                  custom={transitionDirection}
                  initial={{
                    opacity: 0,
                    x: transitionDirection * 46,
                    scale: 1.045,
                    rotateY: transitionDirection * -4,
                    filter: "blur(22px)",
                    clipPath: "inset(0% 0% 0% 18%)",
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    rotateY: 0,
                    filter: "blur(0px)",
                    clipPath: "inset(0% 0% 0% 0%)",
                  }}
                  exit={{
                    opacity: 0,
                    x: transitionDirection * -42,
                    scale: 0.985,
                    rotateY: transitionDirection * 4,
                    filter: "blur(20px)",
                    clipPath: "inset(0% 18% 0% 0%)",
                  }}
                  transition={{ duration: 0.92, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformPerspective: 1400 }}
                >
                  <Image
                    src={copy.visual}
                    alt={`${activeMode.id} spatial interface atmosphere`}
                    fill
                    priority={activeMode.id === "vision"}
                    sizes="100vw"
                    className="scale-[1.06] object-cover opacity-[0.42]"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_56%_42%,rgba(255,255,255,0.11),transparent_30%),linear-gradient(90deg,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.38)_34%,rgba(0,0,0,0.18)_58%,rgba(0,0,0,0.58)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,transparent_48%,rgba(0,0,0,0.7)_100%)]" />
              <div className="absolute inset-0 opacity-[0.012] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:92px_92px]" />

              {viewportTier === "desktop" ? (
                <AnimatePresence mode="wait">
                  <OpticalSweep
                    key={`sweep-${activeMode.id}`}
                    accent={activeMode.accent}
                  />
                </AnimatePresence>
              ) : null}

              <ModeInteractiveOverlay
                modeId={activeMode.id}
                accent={activeMode.accent}
                isVisible={
                  !isRecallField &&
                  !isCreateField &&
                  !isInspectOpen &&
                  viewportTier === "desktop"
                }
              />

              <AnimatePresence mode="wait">
                {isRecallField && !isInspectOpen ? (
                  <RecallConsoleV2 key="recall-console-v2" accent={activeMode.accent} />
                ) : null}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {isCreateField && !isInspectOpen && viewportTier === "desktop" ? (
                  <ReferenceOrbitDeck
                    key="reference-orbit-deck"
                    accent={activeMode.accent}
                  />
                ) : null}
              </AnimatePresence>

              <AnimatePresence mode="wait" custom={transitionDirection}>
                <motion.div
                  key={`product-${activeMode.id}`}
                  className="pointer-events-none absolute left-[62%] top-[56%] z-10 h-[15rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 sm:left-[59%] sm:top-[50%] sm:h-[24rem] sm:w-[46rem] md:left-[61%] md:top-[48%] md:h-[29rem] md:w-[56rem] lg:left-[62%] lg:h-[37rem] lg:w-[72rem] [mask-image:radial-gradient(ellipse_at_center,black_48%,transparent_80%)]"
                  initial={{
                    opacity: 0,
                    x: transitionDirection * 48,
                    scale: 0.975,
                    filter: "blur(16px)",
                  }}
                  animate={{
                    opacity: isInspectOpen ? 0.48 : 1,
                    x: 0,
                    scale: [0.992, 1, 0.992],
                    filter: isInspectOpen ? "blur(1px) brightness(0.72)" : "blur(0px) brightness(1)",
                    y: [5, -5, 5],
                  }}
                  exit={{
                    opacity: 0,
                    x: transitionDirection * -48,
                    scale: 1.012,
                    filter: "blur(14px)",
                  }}
                  transition={{
                    opacity: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
                    x: { duration: 0.82, ease: [0.22, 1, 0.36, 1] },
                    filter: { duration: 0.82, ease: [0.22, 1, 0.36, 1] },
                    scale: { duration: 9.5, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 9.5, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  <motion.div
                    className="absolute left-1/2 top-[62%] z-0 h-[4.5rem] w-[78%] -translate-x-1/2 rounded-full blur-2xl"
                    style={{
                      background: `radial-gradient(ellipse, ${activeMode.accent} 0%, rgba(255,255,255,0.08) 22%, rgba(0,0,0,0.18) 52%, transparent 74%)`,
                    }}
                    animate={{
                      opacity: isInspectOpen ? [0.04, 0.08, 0.04] : [0.1, 0.2, 0.1],
                      scaleX: [0.92, 1.06, 0.92],
                    }}
                    transition={{ duration: 8.8, repeat: Infinity, ease: "easeInOut" }}
                  />

                  <motion.div
                    className="absolute left-[10%] right-[6%] top-[50%] z-[2] h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${activeMode.accent}, rgba(255,255,255,0.5), ${activeMode.accent}, transparent)`,
                    }}
                    animate={{
                      opacity: isInspectOpen ? [0.04, 0.1, 0.04] : [0.12, 0.32, 0.12],
                      scaleX: [0.88, 1, 0.88],
                    }}
                    transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
                  />

                  <Image
                    src="/glasses/orbit-lens-hero-16x9.png"
                    alt="Orbit Lens AI spatial glasses"
                    fill
                    priority
                    sizes="100vw"
                    className="relative z-[1] object-contain opacity-[0.94] mix-blend-lighten drop-shadow-[0_42px_150px_rgba(0,0,0,0.82)]"
                  />
                </motion.div>
              </AnimatePresence>

              <motion.div
                className="absolute left-1/2 top-[50%] z-[9] h-px w-[76%] -translate-x-1/2"
                style={{
                  background: `linear-gradient(90deg, transparent, ${activeMode.accent}, rgba(255,255,255,0.78), ${activeMode.accent}, transparent)`,
                }}
                animate={{
                  opacity: [0.14, 0.46, 0.14],
                  scaleX: [0.94, 1, 0.94],
                }}
                transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="absolute left-4 top-4 z-20 max-w-[13rem] sm:left-8 sm:top-8 sm:max-w-[32rem] md:left-10 md:top-10 lg:left-12 lg:top-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`copy-${activeMode.id}`}
                    initial={{
                      opacity: 0,
                      y: 20,
                      x: transitionDirection * 18,
                      filter: "blur(16px)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      x: 0,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      y: -12,
                      x: transitionDirection * -18,
                      filter: "blur(14px)",
                    }}
                    transition={{ duration: 0.74, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <GlassPane
                      className={`max-w-[calc(100vw-3.5rem)] px-4 py-4 sm:px-6 sm:py-6 md:px-7 md:py-7 ${
                        isAccessField ? "sm:max-w-[31rem]" : "sm:max-w-[36rem]"
                      }`}
                    >
                      <p
                        className="mb-5 text-[0.62rem] uppercase tracking-[0.34em]"
                        style={{ color: activeMode.accent }}
                      >
                        {copy.field}
                      </p>

                      <h1
                        className={`max-w-[34rem] font-light leading-[0.9] tracking-[-0.085em] text-white drop-shadow-[0_14px_42px_rgba(0,0,0,0.9)] ${
                          isAccessField
                            ? "text-[2rem] sm:text-5xl md:text-6xl lg:text-[4.8rem]"
                            : "text-[2.15rem] sm:text-5xl md:text-7xl lg:text-[5.7rem]"
                        }`}
                      >
                        {copy.headline}
                      </h1>

                      <p className="mt-4 max-w-[29rem] text-xs leading-5 text-white/66 drop-shadow-[0_8px_26px_rgba(0,0,0,0.9)] sm:text-base sm:leading-6 md:mt-5 md:text-lg md:leading-7">
                        {copy.subline}
                      </p>
                    </GlassPane>
                  </motion.div>
                </AnimatePresence>
              </div>

              {isAccessField ? (
                <motion.div
                  className="absolute right-10 top-14 z-20 hidden w-[25.5rem] lg:block xl:right-14 xl:top-16"
                  initial={{ opacity: 0, y: 18, filter: "blur(14px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(12px)" }}
                  transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    animate={{
                      y: [0, -6, 0],
                      x: [0, 2, 0],
                      rotateZ: [0, -0.14, 0],
                    }}
                    transition={{
                      duration: 9.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{ willChange: "transform", transformOrigin: "50% 55%" }}
                  >
                    <GlassPane className="px-6 py-6">
                      <p
                        className="mb-5 text-[0.62rem] uppercase tracking-[0.34em]"
                        style={{ color: activeMode.accent }}
                      >
                        Product / Studio Access
                      </p>

                      <div className="space-y-5">
                        <div>
                          <p className="text-[0.68rem] uppercase tracking-[0.26em] text-white/32">
                            Product
                          </p>
                          <p className="mt-2 text-sm leading-6 text-white/64">
                            Orbit Lens is a fictional AI spatial glasses concept
                            exploring calm field-of-view intelligence, visible
                            capture states and premium spatial interaction.
                          </p>
                        </div>

                        <div>
                          <p className="text-[0.68rem] uppercase tracking-[0.26em] text-white/32">
                            Studio
                          </p>
                          <p className="mt-2 text-sm leading-6 text-white/64">
                            Built by Brenych Studio as an interactive product
                            launch prototype and spatial interface case.
                          </p>
                        </div>

                        <div className="grid gap-2 pt-1">
                          <a
                            href="https://brenychstudio.com"
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center justify-between rounded-full border border-white/[0.1] bg-white/[0.035] px-4 py-3 text-[0.62rem] uppercase tracking-[0.24em] text-white/48 transition hover:border-white/[0.2] hover:text-white/74"
                          >
                            Portfolio
                            <span className="text-white/24 transition group-hover:text-white/54">
                              ↗
                            </span>
                          </a>

                          <a
                            href="https://github.com/brenychstudio"
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center justify-between rounded-full border border-white/[0.1] bg-white/[0.035] px-4 py-3 text-[0.62rem] uppercase tracking-[0.24em] text-white/48 transition hover:border-white/[0.2] hover:text-white/74"
                          >
                            GitHub
                            <span className="text-white/24 transition group-hover:text-white/54">
                              ↗
                            </span>
                          </a>

                          <a
                            href="mailto:hello@brenychstudio.com"
                            className="group flex items-center justify-between rounded-full border border-white/[0.1] bg-white/[0.035] px-4 py-3 text-[0.62rem] uppercase tracking-[0.24em] text-white/48 transition hover:border-white/[0.2] hover:text-white/74"
                          >
                            Contact
                            <span className="text-white/24 transition group-hover:text-white/54">
                              →
                            </span>
                          </a>
                        </div>
                      </div>
                    </GlassPane>
                  </motion.div>
                </motion.div>
              ) : null}

              {!isAccessField && !isRecallField && !isCreateField ? (
                <>
                  <FloatingGlassChip className="left-[7%] top-[52%] hidden md:block" delay={0.2}>
                    {copy.leftCard}
                  </FloatingGlassChip>
                  <FloatingGlassChip className="right-[7%] top-[37%] hidden md:block" delay={1.2}>
                    {copy.rightCard}
                  </FloatingGlassChip>
                  <FloatingGlassChip className="right-[18%] bottom-[29%] hidden md:block" delay={2.1}>
                    {copy.bottomCard}
                  </FloatingGlassChip>
                </>
              ) : null}

              {!isRecallField && !isCreateField ? (
                <motion.div
                  className="absolute right-[12%] top-[48%] hidden h-40 w-40 -translate-y-1/2 rounded-full border border-white/[0.08] bg-white/[0.015] backdrop-blur-[8px] md:block"
                  style={{ boxShadow: `0 0 70px ${activeMode.accent}` }}
                  animate={{
                    opacity: [0.08, 0.24, 0.08],
                    scale: [0.94, 1.06, 0.94],
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-8 rounded-full border border-white/[0.07]" />
                  <span
                    className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background: activeMode.accent,
                      boxShadow: `0 0 24px ${activeMode.accent}`,
                    }}
                  />
                </motion.div>
              ) : null}

              <OrbitFieldRail
                accent={activeMode.accent}
                copy={copy}
                activeIndex={activeIndex}
                onSelect={goToIndex}
                onInspect={() => setIsInspectOpen(true)}
              />

              <OpticsInspectLayer
                key={isInspectOpen ? "inspect-open" : "inspect-closed"}
                isOpen={isInspectOpen}
                accent={activeMode.accent}
                onClose={() => setIsInspectOpen(false)}
              />

            </div>

            <div className="mt-3 flex justify-center md:mt-4">
              <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 md:hidden">
                {orbitModes.map((mode, index) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => goToIndex(index)}
                    className="h-2.5 rounded-full border border-white/18 transition-all hover:bg-white/40"
                    style={{
                      width: index === activeIndex ? "2.5rem" : "0.7rem",
                      background:
                        index === activeIndex
                          ? activeMode.accent
                          : "rgba(255,255,255,0.16)",
                    }}
                    aria-label={`Open ${mode.id} mode`}
                  />
                ))}
              </div>

              <p className="hidden text-[0.54rem] uppercase tracking-[0.3em] text-white/20 md:block">
                Swipe / wheel / keyboard to shift field
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

