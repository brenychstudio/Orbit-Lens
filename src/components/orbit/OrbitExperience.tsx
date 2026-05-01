"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    headline: "Capture references without breaking presence.",
    subline:
      "Frame, scout and collect visual notes while the eye stays inside the scene.",
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

function OpticalObjectTheater({
  accent,
  isInspectOpen,
  viewportTier,
}: {
  accent: string;
  isInspectOpen: boolean;
  viewportTier: ViewportTier;
}) {
  const isMobile = viewportTier === "mobile";
  const isTablet = viewportTier === "tablet";
  const intensity = isInspectOpen ? 0.34 : isTablet ? 0.72 : 1;

  return (
    <div
      className="orbit-object-theater pointer-events-none absolute inset-0 z-[8] overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        className="orbit-theater-lightwell absolute left-[58%] top-[43%] hidden h-[30rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
        style={{
          background: `radial-gradient(circle, ${accent} 0%, rgba(255,255,255,0.08) 22%, transparent 68%)`,
          opacity: 0.28 * intensity,
        }}
        animate={{
          scale: [0.96, 1.04, 0.96],
          x: ["-50%", "-49%", "-50%"],
          y: ["-50%", "-51%", "-50%"],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="orbit-theater-plane absolute left-[60%] top-[38%] hidden h-[12rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rotate-[-4deg] rounded-full md:block"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.08), transparent)`,
          opacity: 0.18 * intensity,
        }}
        animate={{
          rotate: [-4, -2.6, -4],
          scaleX: [0.94, 1.04, 0.94],
        }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="orbit-theater-shadowbed absolute left-[60%] top-[67%] hidden h-[4rem] w-[42rem] -translate-x-1/2 rounded-full md:block"
        style={{
          background: `radial-gradient(ellipse, rgba(0,0,0,0.72) 0%, ${accent} 20%, rgba(0,0,0,0.2) 48%, transparent 76%)`,
          opacity: 0.24 * intensity,
        }}
        animate={{
          scaleX: [0.92, 1.06, 0.92],
          opacity: [0.16 * intensity, 0.3 * intensity, 0.16 * intensity],
        }}
        transition={{ duration: 10.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="orbit-theater-trace absolute left-[20%] right-[10%] top-[51%] h-px md:left-[28%]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.52), ${accent}, transparent)`,
          opacity: isMobile ? 0.18 : 0.34 * intensity,
        }}
        animate={{
          scaleX: [0.82, 1, 0.82],
          opacity: isMobile
            ? [0.1, 0.18, 0.1]
            : [0.14 * intensity, 0.38 * intensity, 0.14 * intensity],
        }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute inset-0 md:hidden"
        style={{
          background: `radial-gradient(circle at 58% 44%, ${accent} 0%, transparent 42%)`,
          opacity: isInspectOpen ? 0.08 : 0.14,
        }}
      />
    </div>
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
                isVisible={!isInspectOpen && viewportTier === "desktop"}
              />

              <OpticalObjectTheater
                accent={activeMode.accent}
                isInspectOpen={isInspectOpen}
                viewportTier={viewportTier}
              />

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
                    <GlassPane className="max-w-[calc(100vw-3.5rem)] px-4 py-4 sm:max-w-[36rem] sm:px-6 sm:py-6 md:px-7 md:py-7">
                      <p
                        className="mb-5 text-[0.62rem] uppercase tracking-[0.34em]"
                        style={{ color: activeMode.accent }}
                      >
                        {copy.field}
                      </p>

                      <h1 className="max-w-[34rem] text-[2.15rem] font-light leading-[0.9] tracking-[-0.085em] text-white drop-shadow-[0_14px_42px_rgba(0,0,0,0.9)] sm:text-5xl md:text-7xl lg:text-[5.7rem]">
                        {copy.headline}
                      </h1>

                      <p className="mt-4 max-w-[29rem] text-xs leading-5 text-white/66 drop-shadow-[0_8px_26px_rgba(0,0,0,0.9)] sm:text-base sm:leading-6 md:mt-5 md:text-lg md:leading-7">
                        {copy.subline}
                      </p>
                    </GlassPane>
                  </motion.div>
                </AnimatePresence>
              </div>

              <GlassPane className="absolute right-5 top-7 z-20 hidden max-w-[17rem] px-4 py-4 text-right md:block lg:right-10 lg:top-12">
                <p className="mb-2 text-[0.58rem] uppercase tracking-[0.3em] text-white/30">
                  Orbit Lens
                </p>
                <p className="text-xs leading-5 text-white/46">
                  AI spatial glasses for controlled context, memory and field-of-view intelligence.
                </p>
              </GlassPane>

              <FloatingGlassChip className="left-[7%] top-[52%] hidden md:block" delay={0.2}>
                {copy.leftCard}
              </FloatingGlassChip>
              <FloatingGlassChip className="right-[7%] top-[37%] hidden md:block" delay={1.2}>
                {copy.rightCard}
              </FloatingGlassChip>
              <FloatingGlassChip className="right-[18%] bottom-[29%] hidden md:block" delay={2.1}>
                {copy.bottomCard}
              </FloatingGlassChip>

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

              <div className="orbit-glass-panel absolute bottom-[-2.35rem] left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 overflow-hidden rounded-full border px-4 py-3 text-[0.54rem] uppercase tracking-[0.24em] text-white/26 backdrop-blur-[20px]">
                <span>Drag</span>
                <span className="h-px w-10 bg-white/14" />
                <span>Wheel</span>
                <span className="h-px w-10 bg-white/14" />
                <span>Arrows</span>
              </div>
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

