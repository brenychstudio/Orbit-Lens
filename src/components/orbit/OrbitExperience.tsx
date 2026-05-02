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
    visual: "/interface/spatial-cards-overview-16x9.png",
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
    visual: "/interface/vision-mode-city-16x9.png",
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
      opacity: 0.98,
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
      opacity: 0.56,
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
      opacity: 0.62,
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
      opacity: 0.34,
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
      opacity: 0.38,
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
    opacity: 0.22,
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
      className="pointer-events-auto absolute right-[4.8%] top-[8.5%] z-[22] hidden h-[34.5rem] w-[43rem] lg:block xl:right-[5.6%] xl:top-[8%]"
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
            className="absolute left-[38%] top-[29%] h-[12.9rem] w-[18.2rem] overflow-hidden rounded-[1.55rem] border border-white/[0.12] bg-black/[0.10] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_26px_80px_rgba(0,0,0,0.34)] backdrop-blur-[16px]"
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
                className="object-cover opacity-[0.94] brightness-[1.12] contrast-[1.08] saturate-[1.02]"
              />
            </span>

            <span className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.34))]" />

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

const focusNoiseFragments = [
  {
    label: "Message",
    className: "left-[56%] top-[29%]",
    delay: 0.1,
    opacity: [0.16, 0.05, 0.1],
    y: [0, -6, 0],
  },
  {
    label: "Route",
    className: "right-[17%] top-[34%]",
    delay: 0.45,
    opacity: [0.14, 0.04, 0.09],
    y: [0, 5, 0],
  },
  {
    label: "Caption",
    className: "left-[64%] top-[43%]",
    delay: 0.85,
    opacity: [0.18, 0.06, 0.11],
    y: [0, -4, 0],
  },
  {
    label: "Translate",
    className: "right-[13%] top-[51%]",
    delay: 1.1,
    opacity: [0.13, 0.035, 0.08],
    y: [0, 6, 0],
  },
  {
    label: "Memory",
    className: "left-[59%] top-[61%]",
    delay: 1.35,
    opacity: [0.15, 0.045, 0.09],
    y: [0, -5, 0],
  },
  {
    label: "Notification",
    className: "right-[21%] top-[66%]",
    delay: 1.65,
    opacity: [0.12, 0.03, 0.07],
    y: [0, 4, 0],
  },
];

const focusQuietStatus = [
  {
    label: "Notifications",
    value: "Muted",
    className: "left-[58%] top-[58%]",
    delay: 1.1,
  },
  {
    label: "Context",
    value: "Preserved",
    className: "right-[16%] top-[59.5%]",
    delay: 1.35,
  },
  {
    label: "Attention",
    value: "Stable",
    className: "left-[63%] top-[69%]",
    delay: 1.6,
  },
];

function FocusQuietingSystem({ accent }: { accent: string }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[22] hidden lg:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      {/* Ambient information noise */}
      {focusNoiseFragments.map((item) => (
        <motion.p
          key={item.label}
          className={`orbit-focus-noise-text absolute ${item.className} text-[0.62rem] uppercase tracking-[0.34em] text-white/20`}
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{
            opacity: item.opacity,
            y: item.y,
            filter: ["blur(7px)", "blur(2.5px)", "blur(6px)"],
          }}
          transition={{
            duration: 7.5,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "opacity, transform, filter" }}
        >
          {item.label}
        </motion.p>
      ))}

      {/* Soft optical quiet lens */}
      <motion.div
        className="orbit-focus-aperture absolute right-[12%] top-[37%] h-[21rem] w-[28rem] rounded-full"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${accent}22 0%, rgba(255,255,255,0.055) 28%, rgba(0,0,0,0.12) 56%, transparent 72%)`,
          boxShadow: `inset 0 0 70px rgba(255,255,255,0.035), 0 0 90px ${accent}20`,
        }}
        initial={{ opacity: 0, scale: 0.92, filter: "blur(18px)" }}
        animate={{
          opacity: [0.18, 0.34, 0.2],
          scale: [0.96, 1.035, 0.96],
          filter: ["blur(18px)", "blur(10px)", "blur(18px)"],
        }}
        transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Quieting beam */}
      <motion.div
        className="absolute left-[48%] top-[49%] h-px w-[39%]"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.16), ${accent}, rgba(255,255,255,0.12), transparent)`,
        }}
        initial={{ opacity: 0, scaleX: 0.72, filter: "blur(8px)" }}
        animate={{
          opacity: [0.12, 0.36, 0.14],
          scaleX: [0.82, 1, 0.86],
          filter: ["blur(5px)", "blur(1px)", "blur(5px)"],
        }}
        transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
      />

      {/* Priority signal */}
      <motion.div
        className="orbit-focus-priority absolute right-[13.2%] top-[35.5%] w-[19.5rem] px-5 py-4"
        initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(14px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.05, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <motion.span
              className="h-2 w-2 rounded-full"
              style={{
                background: accent,
                boxShadow: `0 0 18px ${accent}`,
              }}
              animate={{
                opacity: [0.52, 1, 0.62],
                scale: [0.9, 1.16, 0.9],
              }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <p className="text-[0.58rem] uppercase tracking-[0.3em] text-white/42">
              Focus Layer
            </p>
          </div>

          <p className="text-[0.52rem] uppercase tracking-[0.26em] text-white/28">
            User Calm
          </p>
        </div>

        <motion.p
          className="mt-4 text-[0.84rem] uppercase tracking-[0.22em] text-white/72"
          animate={{
            opacity: [0.72, 0.96, 0.78],
            y: [0, -1, 0],
          }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
        >
          Priority signal only
        </motion.p>

        <p className="mt-2 max-w-[16rem] text-xs leading-5 text-white/42">
          Secondary prompts are reduced until attention stabilizes.
        </p>
      </motion.div>

      {/* Scattered quiet statuses */}
      {focusQuietStatus.map((item, index) => (
        <motion.div
          key={item.label}
          className={`absolute z-[23] ${item.className}`}
          initial={{ opacity: 0, y: 12, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.95,
            delay: item.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            animate={{
              opacity: [0.45, 0.78, 0.52],
              y: [0, -2, 0],
            }}
            transition={{
              duration: 6.2 + index * 0.45,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ willChange: "opacity, transform" }}
          >
            <p className="text-[0.5rem] uppercase tracking-[0.28em] text-white/24">
              {item.label}
            </p>
            <p
              className="mt-1 text-[0.7rem] uppercase tracking-[0.22em]"
              style={{
                color: index === 0 ? accent : "rgba(255,255,255,0.58)",
                textShadow:
                  index === 0
                    ? `0 0 14px ${accent}`
                    : "0 0 12px rgba(255,255,255,0.16)",
              }}
            >
              {item.value}
            </p>
          </motion.div>
        </motion.div>
      ))}

      {/* Lower quiet-state strip */}
      <motion.div
        className="absolute bottom-[24%] right-[11.8%] flex items-center gap-3 rounded-full border border-white/[0.07] bg-black/[0.12] px-4 py-2 backdrop-blur-[14px]"
        initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
        animate={{ opacity: 0.74, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, delay: 1.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: accent,
            boxShadow: `0 0 14px ${accent}`,
          }}
        />
        <span className="text-[0.54rem] uppercase tracking-[0.26em] text-white/38">
          Noise reduced / attention stable
        </span>
      </motion.div>
    </motion.div>
  );
}

const privacyTrustNodes = [
  {
    label: "Capture",
    value: "Visible",
    className: "left-[53.5%] top-[34%]",
    tone: "rgba(210, 232, 255, 0.84)",
    side: "public" as const,
    repelX: -9,
    repelY: 5,
    delay: 0.2,
  },
  {
    label: "Context",
    value: "Local",
    className: "left-[58.5%] top-[54%]",
    tone: "rgba(226, 220, 190, 0.78)",
    side: "public" as const,
    repelX: -11,
    repelY: 7,
    delay: 0.45,
  },
  {
    label: "Memory",
    value: "Manual",
    className: "left-[51.5%] top-[66%]",
    tone: "rgba(255, 255, 255, 0.66)",
    side: "public" as const,
    repelX: -8,
    repelY: -5,
    delay: 0.68,
  },
  {
    label: "Consent",
    value: "Required",
    className: "right-[15.5%] top-[34%]",
    tone: "rgba(220, 236, 255, 0.78)",
    side: "private" as const,
    repelX: 10,
    repelY: 4,
    delay: 0.95,
  },
  {
    label: "Passive Recording",
    value: "Off",
    className: "right-[12.8%] top-[58%]",
    tone: "rgba(255, 255, 255, 0.62)",
    side: "private" as const,
    repelX: 12,
    repelY: -5,
    delay: 1.15,
  },
  {
    label: "Private Field",
    value: "Held",
    className: "right-[21%] top-[70%]",
    tone: "rgba(226, 220, 190, 0.72)",
    side: "private" as const,
    repelX: 8,
    repelY: 6,
    delay: 1.35,
  },
];

function TrustBoundarySystem({ accent }: { accent: string }) {
  const boundaryRef = useRef<HTMLDivElement | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0, active: false });
  const pendingPointerRef = useRef(pointer);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const schedulePointerUpdate = (next: { x: number; y: number; active: boolean }) => {
      pendingPointerRef.current = next;

      if (rafRef.current !== null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        setPointer(pendingPointerRef.current);
        rafRef.current = null;
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      const element = boundaryRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!isInside) {
        schedulePointerUpdate({ x: 0, y: 0, active: false });
        return;
      }

      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      schedulePointerUpdate({
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
        active: true,
      });
    };

    const handlePointerLeave = () => {
      schedulePointerUpdate({ x: 0, y: 0, active: false });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const privatePressure = pointer.active ? Math.max(0, pointer.x) : 0;
  const boundaryShift = pointer.active ? pointer.x * 10 : 0;
  const boundaryPulse = pointer.active ? 1 : 0;

  return (
    <motion.div
      ref={boundaryRef}
      className="pointer-events-none absolute inset-0 z-[22] hidden lg:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      {/* Public / private field labels */}
      <motion.p
        className="absolute left-[50.2%] top-[25.5%] text-[0.54rem] uppercase tracking-[0.34em] text-white/26"
        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
        animate={{ opacity: 0.44, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        Public context
      </motion.p>

      <motion.p
        className="absolute right-[13.5%] top-[25.5%] text-right text-[0.54rem] uppercase tracking-[0.34em] text-white/26"
        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
        animate={{ opacity: 0.44, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        Private field
      </motion.p>

      {/* Private protected zone */}
      <motion.div
        className="orbit-trust-private-zone absolute right-[7.8%] top-[22%] h-[56%] w-[30%] rounded-[3.2rem]"
        style={{
          background: `radial-gradient(ellipse at 52% 48%, rgba(255,255,255,0.05), ${accent}12 26%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.04) 100%)`,
          boxShadow: `inset 0 0 80px rgba(255,255,255,0.035), 0 0 95px ${accent}16`,
        }}
        initial={{ opacity: 0, scale: 0.96, filter: "blur(18px)" }}
        animate={{
          opacity: pointer.active ? [0.24, 0.42, 0.28] : [0.16, 0.28, 0.18],
          scale: pointer.active ? [0.98, 1.025, 0.98] : [0.97, 1.01, 0.97],
          x: privatePressure * 8,
          filter: pointer.active
            ? ["blur(13px)", "blur(7px)", "blur(13px)"]
            : ["blur(16px)", "blur(10px)", "blur(16px)"],
        }}
        transition={{
          opacity: { duration: 6.8, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 7.6, repeat: Infinity, ease: "easeInOut" },
          filter: { duration: 7.6, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        }}
      />

      {/* Trust boundary line */}
      <motion.div
        className="absolute right-[38.4%] top-[24%] h-[50%] w-px overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.08)",
        }}
        initial={{ opacity: 0, scaleY: 0.72, filter: "blur(8px)" }}
        animate={{
          opacity: pointer.active ? 0.68 : 0.38,
          scaleY: pointer.active ? 1.06 : 1,
          x: boundaryShift,
          filter: pointer.active ? "blur(0.5px)" : "blur(1.5px)",
        }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          className="absolute inset-x-0 top-0 h-[38%]"
          style={{
            background: `linear-gradient(180deg, transparent, ${accent}, rgba(255,255,255,0.5), transparent)`,
          }}
          animate={{ y: ["-100%", "285%"], opacity: [0, 0.72 + boundaryPulse * 0.2, 0] }}
          transition={{
            duration: pointer.active ? 2.9 : 5.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Boundary halo */}
      <motion.div
        className="absolute right-[34.8%] top-[36%] h-[11rem] w-[11rem] rounded-full border border-white/[0.05]"
        style={{
          boxShadow: `0 0 70px ${accent}18, inset 0 0 55px rgba(255,255,255,0.035)`,
        }}
        initial={{ opacity: 0, scale: 0.86 }}
        animate={{
          opacity: pointer.active ? [0.18, 0.36, 0.2] : [0.1, 0.22, 0.12],
          scale: pointer.active ? [0.94, 1.08, 0.94] : [0.9, 1.02, 0.9],
          x: boundaryShift * 0.8,
          y: pointer.active ? pointer.y * 8 : 0,
        }}
        transition={{
          opacity: { duration: 6.4, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 6.4, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        }}
      />

      {/* Visible trust state main signal */}
      <motion.div
        className="orbit-trust-signal absolute right-[14.6%] top-[41.5%] w-[22rem] px-5 py-4"
        initial={{ opacity: 0, y: 16, scale: 0.985, filter: "blur(14px)" }}
        animate={{
          opacity: 1,
          y: pointer.active ? pointer.y * 3 : 0,
          x: pointer.active ? pointer.x * 4 : 0,
          scale: pointer.active ? 1.012 : 1,
          filter: "blur(0px)",
        }}
        transition={{ duration: 0.75, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <motion.span
              className="h-2 w-2 rounded-full"
              style={{
                background: accent,
                boxShadow: `0 0 18px ${accent}`,
              }}
              animate={{
                opacity: [0.48, 1, 0.58],
                scale: [0.88, 1.18, 0.88],
              }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <p className="text-[0.58rem] uppercase tracking-[0.3em] text-white/42">
              Visible trust state
            </p>
          </div>

          <p className="text-[0.52rem] uppercase tracking-[0.26em] text-white/28">
            User controlled
          </p>
        </div>

        <p className="mt-4 max-w-[18.5rem] text-sm leading-6 text-white/58">
          Capture, memory and context access remain visible to the user.
        </p>
      </motion.div>

      {/* Trust nodes */}
      {privacyTrustNodes.map((item, index) => {
        const repelX =
          pointer.active
            ? pointer.x * item.repelX + (item.side === "private" ? privatePressure * 8 : -privatePressure * 6)
            : 0;
        const repelY = pointer.active ? pointer.y * item.repelY : 0;

        return (
          <motion.div
            key={item.label}
            className={`orbit-trust-node absolute z-[23] ${item.className} ${
              item.side === "private" ? "text-right" : "text-left"
            }`}
            initial={{ opacity: 0, y: 12, filter: "blur(12px)" }}
            animate={{
              opacity: pointer.active ? 0.9 : 0.68,
              x: repelX,
              y: repelY,
              filter: pointer.active ? "blur(0px)" : "blur(0.6px)",
            }}
            transition={{
              duration: 0.72,
              delay: item.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.p
              className="text-[0.5rem] uppercase tracking-[0.28em] text-white/24"
              animate={{ opacity: [0.22, 0.4, 0.26] }}
              transition={{
                duration: 5.4 + index * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {item.label}
            </motion.p>

            <motion.p
              className="mt-1 text-[0.74rem] uppercase tracking-[0.2em]"
              style={{
                color: item.tone,
                textShadow: `0 0 16px ${item.tone}`,
              }}
              animate={{
                opacity: [0.58, 0.92, 0.68],
                y: [0, -1.2, 0],
              }}
              transition={{
                duration: 6 + index * 0.35,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {item.value}
            </motion.p>
          </motion.div>
        );
      })}

      {/* Cursor-responsive protected field trace */}
      <motion.div
        className="absolute right-[33.8%] top-[48%] h-px w-[26%]"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.12), ${accent}, transparent)`,
        }}
        initial={{ opacity: 0, scaleX: 0.75, filter: "blur(8px)" }}
        animate={{
          opacity: pointer.active ? [0.2, 0.46, 0.22] : [0.1, 0.25, 0.12],
          scaleX: pointer.active ? [0.86, 1.04, 0.88] : [0.78, 0.94, 0.8],
          x: boundaryShift * 0.9,
          filter: pointer.active ? ["blur(2px)", "blur(0.5px)", "blur(2px)"] : ["blur(5px)", "blur(2px)", "blur(5px)"],
        }}
        transition={{
          opacity: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
          scaleX: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
          filter: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        }}
      />

      {/* Lower trust strip */}
      <motion.div
        className="absolute bottom-[23.5%] right-[12.5%] flex items-center gap-3 rounded-full border border-white/[0.07] bg-black/[0.12] px-4 py-2 backdrop-blur-[14px]"
        initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
        animate={{
          opacity: pointer.active ? 0.84 : 0.58,
          y: pointer.active ? -2 : 0,
          filter: "blur(0px)",
        }}
        transition={{ duration: 0.72, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: accent,
            boxShadow: `0 0 14px ${accent}`,
          }}
        />
        <span className="text-[0.54rem] uppercase tracking-[0.26em] text-white/38">
          Consent visible / passive recording off
        </span>
      </motion.div>
    </motion.div>
  );
}

const languageLayerFragments = [
  {
    label: "Detected",
    className: "left-[53%] top-[31%]",
    delay: 0.2,
    opacity: [0.16, 0.34, 0.18],
    y: [0, -5, 0],
  },
  {
    label: "Source",
    className: "right-[16%] top-[35%]",
    delay: 0.48,
    opacity: [0.12, 0.28, 0.16],
    y: [0, 4, 0],
  },
  {
    label: "Context",
    className: "left-[58%] top-[61%]",
    delay: 0.82,
    opacity: [0.13, 0.3, 0.16],
    y: [0, -4, 0],
  },
  {
    label: "Adaptive",
    className: "right-[12.5%] top-[63%]",
    delay: 1.05,
    opacity: [0.11, 0.26, 0.14],
    y: [0, 5, 0],
  },
  {
    label: "Voice",
    className: "left-[66%] top-[75%]",
    delay: 1.32,
    opacity: [0.1, 0.22, 0.13],
    y: [0, -3, 0],
  },
];

function ResolvedLanguageLine({
  text,
  ghost,
  progress,
  className = "",
}: {
  text: string;
  ghost: string;
  progress: number;
  className?: string;
}) {
  const safeProgress = Math.max(0, Math.min(1, progress));
  const revealRight = `${Math.max(0, 100 - safeProgress * 100)}%`;

  return (
    <span className={`orbit-language-line ${className}`}>
      <motion.span
        className="orbit-language-ghost"
        animate={{
          opacity: safeProgress >= 0.96 ? 0 : 0.38 - safeProgress * 0.22,
          filter: safeProgress >= 0.96 ? "blur(4px)" : "blur(1.6px)",
          y: [0, -0.8, 0],
        }}
        transition={{
          opacity: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          filter: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 4.6, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {ghost}
      </motion.span>

      <motion.span
        className="orbit-language-final"
        initial={false}
        animate={{
          clipPath: `inset(0 ${revealRight} 0 0)`,
          opacity: safeProgress <= 0.04 ? 0 : 1,
          filter: safeProgress <= 0.12 ? "blur(3px)" : "blur(0px)",
        }}
        transition={{
          clipPath: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
          filter: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        {text}
      </motion.span>

      <motion.span
        className="orbit-language-mask-edge"
        style={{
          left: `${Math.min(96, Math.max(4, safeProgress * 100))}%`,
        }}
        animate={{
          opacity: safeProgress > 0.04 && safeProgress < 0.98 ? [0.18, 0.62, 0.2] : 0,
        }}
        transition={{
          duration: 1.4,
          repeat: safeProgress > 0.04 && safeProgress < 0.98 ? Infinity : 0,
          ease: "easeInOut",
        }}
      />
    </span>
  );
}

function TransparentLanguageLayer({ accent }: { accent: string }) {
  const sourceText = "Buenas tardes, la entrada está a la izquierda.";
  const translatedText = "Good evening, the entrance is on the left.";

  const [resolveProgress, setResolveProgress] = useState(0);

  useEffect(() => {
    let interval: number | undefined;

    const startDelay = window.setTimeout(() => {
        interval = window.setInterval(() => {
          setResolveProgress((current) => {
            if (current >= 1) {
              if (interval) window.clearInterval(interval);
              return 1;
            }

          return Math.min(1, current + 0.018);
          });
        }, 72);
    }, 520);

    return () => {
      window.clearTimeout(startDelay);
      if (interval) window.clearInterval(interval);
    };
  }, []);

  const sourceProgress = Math.min(1, resolveProgress * 1.28);
  const translatedProgress = Math.max(0, Math.min(1, (resolveProgress - 0.2) / 0.8));

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[22] hidden lg:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      {/* Floating language fragments */}
      {languageLayerFragments.map((item) => (
        <motion.p
          key={item.label}
          className={`orbit-language-fragment absolute ${item.className} text-[0.58rem] uppercase tracking-[0.34em] text-white/22`}
          initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
          animate={{
            opacity: item.opacity,
            y: item.y,
            filter: ["blur(5px)", "blur(1.4px)", "blur(5px)"],
          }}
          transition={{
            duration: 7.4,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "opacity, transform, filter" }}
        >
          {item.label}
        </motion.p>
      ))}

      {/* Transparent caption plane */}
      <motion.div
        className="absolute right-[8.8%] top-[24%] w-[33rem]"
        initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(18px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -12, scale: 0.99, filter: "blur(14px)" }}
        transition={{ duration: 0.86, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={{
            y: [0, -5, 0],
            x: [0, 1.8, 0],
            rotateZ: [0, -0.08, 0],
          }}
          transition={{
            duration: 10.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "transform" }}
        >
          <GlassPane className="orbit-language-plane px-6 py-5">
            <div className="mb-5 flex items-center justify-between gap-5">
              <div className="flex items-center gap-2">
                <motion.span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: accent,
                    boxShadow: `0 0 18px ${accent}`,
                  }}
                  animate={{
                    opacity: [0.46, 1, 0.56],
                    scale: [0.9, 1.16, 0.9],
                  }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <p className="text-[0.58rem] uppercase tracking-[0.3em] text-white/42">
                  Language Layer
                </p>
              </div>

              <p className="text-[0.52rem] uppercase tracking-[0.26em] text-white/28">
                Live / Adaptive
              </p>
            </div>

            <div className="border-t border-white/[0.075] pt-5">
              <p className="text-[0.52rem] uppercase tracking-[0.3em] text-white/25">
                Source audio
              </p>

              <p className="mt-2 min-h-[1.8rem] text-sm leading-6 text-white/46">
                <ResolvedLanguageLine
                  text={sourceText}
                  ghost="bue... tar... des..."
                  progress={sourceProgress}
                />
              </p>
            </div>

            <div className="mt-5 border-t border-white/[0.075] pt-5">
              <div className="mb-2 flex items-center justify-between gap-4">
                <p
                  className="text-[0.52rem] uppercase tracking-[0.3em]"
                  style={{ color: "rgba(210, 232, 255, 0.54)" }}
                >
                  Translated layer
                </p>

                <motion.p
                  className="text-[0.5rem] uppercase tracking-[0.24em] text-white/24"
                  animate={{
                    opacity: translatedProgress >= 1 ? [0.32, 0.58, 0.38] : [0.16, 0.32, 0.18],
                  }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  Resolve {Math.round(translatedProgress * 100)}%
                </motion.p>
              </div>

              <p className="min-h-[2.2rem] text-[1.02rem] leading-8 text-white/74">
                <ResolvedLanguageLine
                  text={translatedText}
                  ghost="goo... eve... ing..."
                  progress={translatedProgress}
                />
              </p>
            </div>
          </GlassPane>
        </motion.div>
      </motion.div>

      {/* Soft language plane shadow / atmosphere */}
      <motion.div
        className="orbit-language-aura absolute right-[11%] top-[37%] h-[18rem] w-[31rem] rounded-full"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${accent}18 0%, rgba(255,255,255,0.045) 28%, rgba(0,0,0,0.1) 58%, transparent 76%)`,
          boxShadow: `0 0 86px ${accent}16`,
        }}
        initial={{ opacity: 0, scale: 0.94, filter: "blur(18px)" }}
        animate={{
          opacity: [0.16, 0.3, 0.18],
          scale: [0.96, 1.035, 0.96],
          filter: ["blur(18px)", "blur(10px)", "blur(18px)"],
        }}
        transition={{ duration: 9.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Adaptive opacity signal */}
      <motion.div
        className="orbit-language-signal absolute bottom-[24%] right-[10.5%] w-[25rem] px-4 py-3"
        initial={{ opacity: 0, y: 12, filter: "blur(12px)" }}
        animate={{ opacity: 0.82, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.82, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-2 flex items-center justify-between gap-4">
          <p className="text-[0.54rem] uppercase tracking-[0.28em] text-white/34">
            Subtitle opacity
          </p>
          <p className="text-[0.52rem] uppercase tracking-[0.24em] text-white/24">
            Adaptive
          </p>
        </div>

        <div className="relative h-px overflow-hidden bg-white/[0.08]">
          <motion.span
            className="absolute inset-y-0 left-0 w-[36%]"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.42), transparent)`,
            }}
            animate={{
              x: ["-42%", "240%"],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 4.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
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
  const totalModes = orbitModes.length;
  const activeLabel = String(activeIndex + 1).padStart(2, "0");
  const totalLabel = String(totalModes).padStart(2, "0");
  const activePosition =
    totalModes > 1 ? 8 + activeIndex * (84 / (totalModes - 1)) : 50;

  return (
    <div className="absolute inset-x-4 bottom-4 z-30 overflow-hidden rounded-full border border-white/[0.075] bg-[#05080a]/[0.72] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.055),inset_0_-1px_0_rgba(255,255,255,0.025),0_26px_110px_rgba(0,0,0,0.46)] sm:inset-x-6 md:px-5">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.008) 38%, rgba(0,0,0,0.2))",
        }}
      />
      <div className="pointer-events-none absolute inset-[1px] rounded-full border border-white/[0.035]" />
      <div className="pointer-events-none absolute inset-x-10 top-px h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      <div className="pointer-events-none absolute inset-x-14 bottom-px h-px bg-gradient-to-r from-transparent via-white/[0.055] to-transparent" />

      <div className="relative grid items-center gap-3 md:grid-cols-[0.9fr_1.45fr_auto]">
        <div className="flex items-center gap-3">
          <span className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025]">
            <motion.span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: accent,
                boxShadow: `0 0 14px ${accent}`,
              }}
              animate={{
                opacity: [0.36, 0.86, 0.36],
                scale: [0.92, 1.08, 0.92],
              }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{
                border: `1px solid ${accent}`,
              }}
              animate={{
                opacity: [0.04, 0.16, 0.04],
                scale: [0.82, 1.18, 0.82],
              }}
              transition={{
                duration: 5.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[0.5rem] uppercase tracking-[0.3em] text-white/26">
                Active Field
              </p>
              <span className="hidden h-px w-5 bg-white/[0.08] sm:block" />
              <p className="hidden text-[0.5rem] uppercase tracking-[0.24em] text-white/22 sm:block">
                {activeLabel} / {totalLabel}
              </p>
            </div>

            <p className="mt-1 truncate text-[0.66rem] uppercase tracking-[0.22em] text-white/62">
              {copy.signal}
            </p>
          </div>
        </div>

        <div className="relative hidden h-10 overflow-hidden rounded-full border border-white/[0.065] bg-black/[0.28] md:block">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.035), transparent 42%, rgba(0,0,0,0.18))",
            }}
          />
          <div className="pointer-events-none absolute inset-x-5 top-1/2 h-px -translate-y-1/2 bg-white/[0.075]" />
          <div className="pointer-events-none absolute inset-x-5 top-[calc(50%+6px)] h-px bg-white/[0.025]" />

          <motion.div
            className="pointer-events-none absolute top-1/2 h-[2px] -translate-y-1/2 rounded-full"
            style={{
              left: "8%",
              width: `${Math.max(activePosition - 8, 1)}%`,
              background: `linear-gradient(90deg, rgba(255,255,255,0.03), ${accent}, rgba(255,255,255,0.34))`,
              transformOrigin: "left center",
              boxShadow: `0 0 12px ${accent}33`,
            }}
            animate={{
              opacity: [0.24, 0.48, 0.24],
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="pointer-events-none absolute top-1/2 h-[3px] w-24 -translate-y-1/2 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.72), ${accent}, transparent)`,
              boxShadow: `0 0 22px ${accent}`,
              filter: "saturate(1.08)",
            }}
            animate={{
              left: ["6%", "78%", "6%"],
              opacity: [0.14, 0.42, 0.14],
              scaleX: [0.94, 1.06, 0.94],
            }}
            transition={{
              duration: 8.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {orbitModes.map((mode, index) => {
            const isActive = index === activeIndex;
            const left =
              totalModes > 1 ? 8 + index * (84 / (totalModes - 1)) : 50;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`Open ${mode.id} mode`}
                aria-current={isActive ? "true" : undefined}
                className="group absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full p-0 leading-none transition"
                style={{
                  left: `${left}%`,
                }}
              >
                <span className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="absolute h-[13px] w-[13px] rounded-full border transition duration-500"
                    style={{
                      borderColor: isActive
                        ? "rgba(255,255,255,0.32)"
                        : "rgba(255,255,255,0.1)",
                      background: isActive
                        ? "rgba(255,255,255,0.055)"
                        : "rgba(255,255,255,0.018)",
                      boxShadow: isActive ? `0 0 18px ${accent}` : "none",
                    }}
                  />

                  <motion.span
                    className="absolute h-1.5 w-1.5 rounded-full"
                    style={{
                      background: isActive ? accent : "rgba(255,255,255,0.22)",
                      boxShadow: isActive ? `0 0 10px ${accent}` : "none",
                    }}
                    animate={
                      isActive
                        ? {
                            opacity: [0.58, 1, 0.58],
                            scale: [0.9, 1.16, 0.9],
                          }
                        : { opacity: 0.44, scale: 1 }
                    }
                    transition={
                      isActive
                        ? {
                            duration: 4.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                        : { duration: 0.3 }
                    }
                  />
                </span>

                <span className="pointer-events-none absolute -bottom-5 whitespace-nowrap text-[0.45rem] uppercase tracking-[0.2em] text-white/0 transition duration-300 group-hover:text-white/34">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 md:justify-end">
          <p className="hidden max-w-[15rem] text-[0.68rem] leading-5 text-white/38 lg:block">
            {copy.bottomCard}
          </p>

          <button
            type="button"
            onClick={onInspect}
            aria-label="Inspect Orbit Lens optics"
            className="group relative inline-flex shrink-0 items-center gap-3 overflow-hidden rounded-full border border-white/[0.075] bg-white/[0.025] px-4 py-2.5 text-[0.52rem] uppercase tracking-[0.29em] text-white/48 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-500 hover:border-white/[0.16] hover:bg-white/[0.045] hover:text-white/76 md:px-5"
          >
            <span
              className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
              style={{
                background: `linear-gradient(90deg, transparent, ${accent}18, rgba(255,255,255,0.035), transparent)`,
              }}
            />
            <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white/[0.08]">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: accent,
                  boxShadow: `0 0 12px ${accent}`,
                }}
              />
            </span>
            <span className="relative z-10">Inspect Optics</span>
            <motion.span
              className="absolute bottom-0 left-5 h-px w-[calc(100%-2.5rem)] origin-left"
              style={{
                background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.2), transparent)`,
              }}
              animate={{
                opacity: [0.08, 0.24, 0.08],
                scaleX: [0.84, 1, 0.84],
              }}
              transition={{
                duration: 5.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

const accessTypeLines = [
  "Prototype access is open for review.",
  "Spatial modes and optics inspection are active.",
  "Brenych Studio / premium interface system.",
] as const;

const accessStatusRows = [
  {
    label: "Prototype access",
    value: "Ready",
    detail: "Concept surface",
  },
  {
    label: "Studio contact",
    value: "Available",
    detail: "Portfolio / GitHub / mail",
  },
  {
    label: "System state",
    value: "Web first",
    detail: "Spatial mode later",
  },
] as const;

const accessLinks = [
  {
    label: "Portfolio",
    href: "https://brenychstudio.com",
    mark: "↗",
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/brenychstudio",
    mark: "↗",
    external: true,
  },
  {
    label: "Contact",
    href: "mailto:hello@brenychstudio.com",
    mark: "→",
    external: false,
  },
] as const;

function AccessTypeLine({
  children,
  delay,
  accent,
}: {
  children: string;
  delay: number;
  accent: string;
}) {
  const chars = Array.from(children);

  return (
    <span className="relative block min-h-5 whitespace-nowrap text-[0.68rem] leading-5 text-white/66">
      {chars.map((char, index) => (
        <motion.span
          key={`${children}-${index}`}
          className="inline-block"
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.18,
            delay: delay + index * 0.038,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}

      <motion.span
        className="ml-1 inline-block h-3.5 w-px translate-y-[2px]"
        style={{
          background: accent,
          boxShadow: `0 0 10px ${accent}`,
        }}
        animate={{
          opacity: [0.15, 0.7, 0.15],
        }}
        transition={{
          duration: 0.9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + chars.length * 0.038,
        }}
      />
    </span>
  );
}

function AccessStatusRow({
  label,
  value,
  detail,
  accent,
  index,
}: {
  label: string;
  value: string;
  detail: string;
  accent: string;
  index: number;
}) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border border-white/[0.075] bg-white/[0.025] px-3.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.68,
        delay: 0.72 + index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}12, rgba(255,255,255,0.03), transparent)`,
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.55rem] uppercase tracking-[0.25em] text-white/28">
            {label}
          </p>
          <p className="mt-0.5 text-[0.64rem] leading-4 text-white/44">{detail}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2 pt-[1px]">
          <motion.span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: accent,
              boxShadow: `0 0 12px ${accent}`,
            }}
            animate={{
              opacity: [0.35, 0.9, 0.35],
              scale: [0.9, 1.16, 0.9],
            }}
            transition={{
              duration: 4.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.25,
            }}
          />
          <span className="text-[0.58rem] uppercase tracking-[0.2em] text-white/62">
            {value}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function AccessConsole({ accent }: { accent: string }) {
  return (
    <motion.div
      className="absolute right-10 top-12 z-20 hidden w-[24.5rem] lg:block xl:right-14 xl:top-14"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={{
          y: [0, -5, 0],
          x: [0, 1.5, 0],
          rotateZ: [0, -0.1, 0],
        }}
        transition={{
          duration: 10.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform", transformOrigin: "50% 55%" }}
      >
        <GlassPane className="relative px-5 py-5">
          <div
            className="pointer-events-none absolute inset-0 opacity-75"
            style={{
              background:
                "radial-gradient(circle at 80% 18%, rgba(190,220,245,0.075), transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.028), transparent 42%, rgba(0,0,0,0.18))",
            }}
          />

          <div className="pointer-events-none absolute inset-x-8 top-px h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
          <div className="pointer-events-none absolute inset-x-10 bottom-px h-px bg-gradient-to-r from-transparent via-white/[0.055] to-transparent" />

          <div className="relative">
            <div className="mb-4 flex items-start justify-between gap-5">
              <div>
                <p
                  className="text-[0.6rem] uppercase tracking-[0.34em]"
                  style={{ color: accent }}
                >
                  Product / Studio Access
                </p>
                <p className="mt-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/28">
                  Controlled preview terminal
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/[0.075] bg-white/[0.025] px-3 py-2">
                <span className="relative flex h-4 w-4 items-center justify-center rounded-full border border-white/[0.08]">
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: accent,
                      boxShadow: `0 0 14px ${accent}`,
                    }}
                    animate={{
                      opacity: [0.34, 0.95, 0.34],
                      scale: [0.88, 1.16, 0.88],
                    }}
                    transition={{
                      duration: 4.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.span
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: `1px solid ${accent}`,
                    }}
                    animate={{
                      opacity: [0.03, 0.18, 0.03],
                      scale: [0.78, 1.24, 0.78],
                    }}
                    transition={{
                      duration: 5.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </span>

                <span className="text-[0.52rem] uppercase tracking-[0.22em] text-white/48">
                  Live
                </span>
              </div>
            </div>

            <div className="space-y-1.5 rounded-3xl border border-white/[0.07] bg-black/[0.18] px-3.5 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
              {accessTypeLines.map((line, index) => (
                <AccessTypeLine
                  key={line}
                  accent={accent}
                  delay={0.32 + index * 0.62}
                >
                  {line}
                </AccessTypeLine>
              ))}
            </div>

            <div className="mt-3 grid gap-2">
              {accessStatusRows.map((row, index) => (
                <AccessStatusRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                  detail={row.detail}
                  accent={accent}
                  index={index}
                />
              ))}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {accessLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full border border-white/[0.085] bg-white/[0.026] px-3 py-2.5 text-center text-[0.48rem] uppercase tracking-[0.18em] text-white/48 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] transition duration-500 hover:border-white/[0.18] hover:bg-white/[0.045] hover:text-white/78"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.58,
                    delay: 1.05 + index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <span
                    className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${accent}16, rgba(255,255,255,0.035), transparent)`,
                    }}
                  />
                  <span className="relative z-10">{link.label}</span>
                  <span className="relative z-10 text-[0.56rem] text-white/24 transition group-hover:text-white/58">
                    {link.mark}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </GlassPane>
      </motion.div>
    </motion.div>
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
  const isTranslateField = activeMode.id === "translate";
  const isCreateField = activeMode.id === "create";
  const isFocusField = activeMode.id === "focus";
  const isPrivacyField = activeMode.id === "privacy";
  const isInspectStabilizing = isInspectOpen && viewportTier === "desktop";

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
    viewportTier === "mobile" ? 1 : viewportTier === "tablet" ? 1.075 : 1.235;

  const inspectYOffset =
    viewportTier === "mobile" ? 0 : viewportTier === "tablet" ? -0.75 : -2.4;
  const inspectMotionDuration = isInspectOpen ? 1.04 : 0.92;

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
            className="orbit-shell-material orbit-shell-frame orbit-shell-motion-root relative isolate w-full origin-center select-none overflow-hidden rounded-[2rem] border p-3 sm:p-4 md:rounded-[3.2rem] md:p-5 xl:rounded-[3.8rem] xl:p-6"
            data-inspect-open={isInspectOpen ? "true" : "false"}
            animate={{
              scale: isInspectOpen ? inspectScale : 1,
              y: isInspectOpen ? inspectYOffset : 0,
            }}
            transition={{
              scale: {
                duration: inspectMotionDuration,
                ease: isInspectOpen ? [0.19, 1, 0.22, 1] : [0.22, 1, 0.36, 1],
              },
              y: {
                duration: inspectMotionDuration,
                ease: isInspectOpen ? [0.19, 1, 0.22, 1] : [0.22, 1, 0.36, 1],
              },
            }}
            style={{
              backfaceVisibility: "hidden",
              willChange: "transform",
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

            <div className="orbit-status-strip orbit-status-strip-etched orbit-glass-panel mb-3 flex items-center justify-between rounded-full border px-3 py-2.5 text-[0.56rem] uppercase tracking-[0.22em] text-white/44 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-[18px] sm:px-4 md:mb-4 md:py-3 md:text-[0.66rem] md:tracking-[0.26em]">
              <span>
                {isInspectOpen ? "Optics Inspection Field" : "Orbit Field Interface"}
              </span>
              <span>{currentProgress}</span>
            </div>

            <div
              className="orbit-inner-field-material orbit-optical-viewport relative min-h-[calc(100svh-9.25rem)] overflow-hidden rounded-[1.35rem] border sm:min-h-[38rem] md:min-h-[43rem] md:rounded-[2.3rem] lg:min-h-[680px] xl:rounded-[2.8rem]"
              data-inspect-open={isInspectOpen ? "true" : "false"}
            >
              <motion.div
                className="pointer-events-none absolute inset-0 z-[48] bg-black"
                animate={{ opacity: isInspectOpen ? 0.76 : 0 }}
                transition={{
                  duration: isInspectOpen ? 0.76 : 0.72,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />

              <AnimatePresence initial={false} custom={transitionDirection}>
                <motion.div
                  key={`scene-${activeMode.id}`}
                  className="absolute inset-0"
                  custom={transitionDirection}
                  initial={{
                    opacity: 0,
                    x: transitionDirection * 32,
                    scale: 1.025,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    x: transitionDirection * -32,
                    scale: 1.005,
                  }}
                  transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    transformPerspective: 1400,
                    backfaceVisibility: "hidden",
                    willChange: "opacity, transform",
                  }}
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

              {viewportTier === "desktop" && !isInspectStabilizing ? (
                <AnimatePresence initial={false}>
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
                    !isInspectStabilizing &&
                    !isRecallField &&
                    !isTranslateField &&
                    !isCreateField &&
                    !isFocusField &&
                    !isPrivacyField &&
                    viewportTier === "desktop"
                  }
                />

              <AnimatePresence mode="wait">
                {isTranslateField && viewportTier === "desktop" ? (
                  <TransparentLanguageLayer
                    key="transparent-language-layer"
                    accent={activeMode.accent}
                  />
                ) : null}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {isRecallField ? (
                  <RecallConsoleV2 key="recall-console-v2" accent={activeMode.accent} />
                ) : null}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {isCreateField && viewportTier === "desktop" ? (
                  <ReferenceOrbitDeck
                    key="reference-orbit-deck"
                    accent={activeMode.accent}
                  />
                ) : null}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {isFocusField && viewportTier === "desktop" ? (
                  <FocusQuietingSystem
                    key="focus-quieting-system"
                    accent={activeMode.accent}
                  />
                ) : null}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {isPrivacyField && viewportTier === "desktop" ? (
                  <TrustBoundarySystem key="trust-boundary-system" accent={activeMode.accent} />
                ) : null}
              </AnimatePresence>

              <AnimatePresence mode="wait" custom={transitionDirection}>
                <motion.div
                  key={`product-${activeMode.id}`}
                  className="pointer-events-none absolute left-[62%] top-[56%] z-10 h-[15rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 sm:left-[59%] sm:top-[50%] sm:h-[24rem] sm:w-[46rem] md:left-[61%] md:top-[48%] md:h-[29rem] md:w-[56rem] lg:left-[62%] lg:h-[37rem] lg:w-[72rem] [mask-image:radial-gradient(ellipse_at_center,black_48%,transparent_80%)]"
                  initial={{
                    opacity: 0,
                    x: transitionDirection * 34,
                    scale: 0.985,
                  }}
                  animate={{
                    opacity: isInspectOpen ? 0.14 : 1,
                    x: 0,
                    scale: isInspectOpen ? 0.992 : [0.992, 1, 0.992],
                    y: isInspectOpen ? 0 : [5, -5, 5],
                  }}
                  exit={{
                    opacity: 0,
                    x: transitionDirection * -34,
                    scale: 1.005,
                  }}
                  transition={{
                    opacity: {
                      duration: isInspectOpen ? 0.76 : 0.78,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    x: { duration: isInspectOpen ? 0.72 : 0.96, ease: [0.22, 1, 0.36, 1] },
                    scale: isInspectOpen
                      ? { duration: 0.76, ease: [0.19, 1, 0.22, 1] }
                      : { duration: 9.5, repeat: Infinity, ease: "easeInOut" },
                    y: isInspectOpen
                      ? { duration: 0.76, ease: [0.19, 1, 0.22, 1] }
                      : { duration: 9.5, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  <motion.div
                    className="absolute left-1/2 top-[62%] z-0 h-[4.5rem] w-[78%] -translate-x-1/2 rounded-full blur-2xl"
                    style={{
                      background: `radial-gradient(ellipse, ${activeMode.accent} 0%, rgba(255,255,255,0.08) 22%, rgba(0,0,0,0.18) 52%, transparent 74%)`,
                    }}
                    animate={{
                      opacity: isInspectOpen ? 0.06 : [0.1, 0.2, 0.1],
                      scaleX: isInspectOpen ? 1 : [0.92, 1.06, 0.92],
                    }}
                    transition={
                      isInspectOpen
                        ? { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
                        : { duration: 8.8, repeat: Infinity, ease: "easeInOut" }
                    }
                  />

                  <motion.div
                    className="absolute left-[10%] right-[6%] top-[50%] z-[2] h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${activeMode.accent}, rgba(255,255,255,0.5), ${activeMode.accent}, transparent)`,
                    }}
                    animate={{
                      opacity: isInspectOpen ? 0.08 : [0.12, 0.32, 0.12],
                      scaleX: isInspectOpen ? 1 : [0.88, 1, 0.88],
                    }}
                    transition={
                      isInspectOpen
                        ? { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
                        : { duration: 6.8, repeat: Infinity, ease: "easeInOut" }
                    }
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
                  opacity: isInspectOpen ? 0.06 : [0.14, 0.46, 0.14],
                  scaleX: isInspectOpen ? 1 : [0.94, 1, 0.94],
                }}
                transition={
                  isInspectOpen
                    ? { duration: 0.18, ease: [0.16, 1, 0.3, 1] }
                    : { duration: 5.8, repeat: Infinity, ease: "easeInOut" }
                }
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

              {isAccessField ? <AccessConsole accent={activeMode.accent} /> : null}

              {!isAccessField &&
              !isRecallField &&
              !isTranslateField &&
              !isCreateField &&
              !isFocusField &&
              !isPrivacyField ? (
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

              {!isRecallField &&
              !isTranslateField &&
              !isCreateField &&
              !isFocusField &&
              !isPrivacyField ? (
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
                onInspect={() => {
                  if (!isInspectOpen) setIsInspectOpen(true);
                }}
              />

              <OpticsInspectLayer
                key="optics-inspect-layer"
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
