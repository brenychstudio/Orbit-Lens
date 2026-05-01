"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type ModeInteractiveOverlayProps = {
  modeId: string;
  accent: string;
  isVisible?: boolean;
};

const memoryRows = [
  { label: "Place context", value: "recognized" },
  { label: "Voice fragment", value: "indexed" },
  { label: "Memory state", value: "manual only" },
  { label: "Recording", value: "inactive" },
];

function TypewriterLine({
  text,
  accent,
}: {
  text: string;
  accent: string;
}) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    const chars = Array.from(text);
    let index = 0;
    let interval: number | undefined;

    const resetDelay = window.setTimeout(() => {
      setVisibleText("");
    }, 0);

    const delay = window.setTimeout(() => {
      interval = window.setInterval(() => {
        index += 1;
        setVisibleText(chars.slice(0, index).join(""));

        if (index >= chars.length && interval) {
          window.clearInterval(interval);
        }
      }, 34);
    }, 360);

    return () => {
      window.clearTimeout(resetDelay);
      window.clearTimeout(delay);
      if (interval) window.clearInterval(interval);
    };
  }, [text]);

  return (
    <p
      className="min-h-[4.1rem] text-[0.92rem] font-light leading-6 text-white/76"
      style={{
        textShadow: `0 0 18px ${accent}32, 0 10px 34px rgba(0,0,0,0.92)`,
      }}
    >
      {visibleText}
      <motion.span
        className="ml-1 inline-block h-4 w-px align-[-0.12em]"
        style={{
          background: accent,
          boxShadow: `0 0 12px ${accent}`,
        }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.82, repeat: Infinity, ease: "easeInOut" }}
      />
    </p>
  );
}

function RecallMemoryOverlay({ accent }: { accent: string }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[24] hidden overflow-hidden md:block"
      initial={{ opacity: 0, filter: "blur(14px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(14px)" }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* right-side living memory console */}
      <motion.div
        className="absolute right-[7%] top-[21%] z-[26] h-[24.5rem] w-[29.5rem] overflow-hidden rounded-[1.7rem] border border-white/[0.16] bg-black/[0.34] shadow-[inset_0_1px_0_rgba(255,255,255,0.13),0_34px_140px_rgba(0,0,0,0.46)] backdrop-blur-[24px]"
        initial={{ opacity: 0, x: 46, scale: 0.94, filter: "blur(18px)" }}
        animate={{
          opacity: 1,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
          y: [0, -6, 0],
        }}
        transition={{
          opacity: { duration: 0.68, ease: [0.22, 1, 0.36, 1] },
          x: { duration: 0.68, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: 0.68, ease: [0.22, 1, 0.36, 1] },
          filter: { duration: 0.68, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 8.2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(255,255,255,0.11),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.006))]" />

        <motion.div
          className="absolute left-0 right-0 top-[38%] h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.55), transparent)`,
          }}
          animate={{ opacity: [0.14, 0.52, 0.14], scaleX: [0.92, 1, 0.92] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.span
                className="h-2 w-2 rounded-full"
                style={{
                  background: accent,
                  boxShadow: `0 0 20px ${accent}`,
                }}
                animate={{
                  opacity: [0.32, 1, 0.32],
                  scale: [0.88, 1.22, 0.88],
                }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <p
                className="text-[0.56rem] uppercase tracking-[0.34em]"
                style={{
                  color: accent,
                  textShadow: `0 0 12px ${accent}55`,
                }}
              >
                Recall layer
              </p>
            </div>

            <p className="text-[0.5rem] uppercase tracking-[0.28em] text-white/38">
              User initiated
            </p>
          </div>

          <div className="mt-7">
            <TypewriterLine
              text="Memory opens only after a direct request. The field keeps context visible, controlled and temporary."
              accent={accent}
            />
          </div>

          <div className="mt-6 space-y-3">
            {memoryRows.map((row, index) => (
              <motion.div
                key={row.label}
                className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-white/[0.09] pt-3"
                initial={{ opacity: 0, x: 18, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.48,
                  delay: 0.85 + index * 0.24,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div>
                  <p className="text-[0.5rem] uppercase tracking-[0.24em] text-white/38">
                    {row.label}
                  </p>
                  <p className="mt-1 text-[0.68rem] uppercase tracking-[0.2em] text-white/72">
                    {row.value}
                  </p>
                </div>

                <div className="relative h-px w-28 bg-white/[0.12]">
                  <motion.div
                    className="absolute inset-y-0 left-0"
                    style={{
                      background: `linear-gradient(90deg, ${accent}, rgba(255,255,255,0.72), transparent)`,
                    }}
                    animate={{
                      width: ["18%", "96%", "32%"],
                      opacity: [0.22, 0.72, 0.22],
                    }}
                    transition={{
                      duration: 4.4,
                      delay: index * 0.28,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* live recall node */}
      <motion.div
        className="absolute right-[18%] bottom-[21%] z-[25] h-[9.5rem] w-[9.5rem] rounded-full border border-white/[0.1] bg-black/[0.2] backdrop-blur-[12px]"
        style={{ boxShadow: `0 0 82px ${accent}20` }}
        initial={{ opacity: 0, scale: 0.9, filter: "blur(14px)" }}
        animate={{
          opacity: [0.26, 0.6, 0.26],
          scale: [0.94, 1.08, 0.94],
          filter: "blur(0px)",
        }}
        transition={{
          opacity: { duration: 6.8, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 6.8, repeat: Infinity, ease: "easeInOut" },
          filter: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        <div className="absolute inset-7 rounded-full border border-white/[0.09]" />
        <div className="absolute inset-[3.3rem] rounded-full border border-white/[0.14]" />
        <motion.span
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: accent,
            boxShadow: `0 0 28px ${accent}`,
          }}
          animate={{
            opacity: [0.35, 1, 0.35],
            scale: [0.9, 1.28, 0.9],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* compact memory rail */}
      <motion.div
        className="absolute bottom-[17%] right-[34%] z-[25] h-[4.2rem] w-[18rem] rounded-full border border-white/[0.11] bg-black/[0.2] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-[16px]"
        initial={{ opacity: 0, y: 16, filter: "blur(12px)" }}
        animate={{
          opacity: [0.36, 0.72, 0.36],
          y: [0, 5, 0],
          filter: "blur(0px)",
        }}
        transition={{
          opacity: { duration: 6.2, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 6.2, repeat: Infinity, ease: "easeInOut" },
          filter: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        <div className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-white/[0.12]" />

        <motion.div
          className="absolute top-1/2 h-[0.24rem] w-20 -translate-y-1/2 rounded-full blur-[1px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.84), transparent)`,
            boxShadow: `0 0 24px ${accent}`,
          }}
          animate={{ left: ["10%", "62%", "10%"] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="absolute left-7 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white/28" />
        <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/36" />
        <div className="absolute right-7 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white/28" />
      </motion.div>

      {/* horizontal optical signal */}
      <motion.div
        className="absolute left-[42%] right-[7%] top-[50%] z-[24] h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.58), ${accent}, transparent)`,
        }}
        animate={{
          opacity: [0.12, 0.46, 0.12],
          scaleX: [0.92, 1, 0.92],
        }}
        transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

export function ModeInteractiveOverlay({
  modeId,
  accent,
  isVisible = true,
}: ModeInteractiveOverlayProps) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && modeId === "recall" ? (
        <RecallMemoryOverlay
          key="recall-memory-overlay-hard-reset"
          accent={accent}
        />
      ) : null}
    </AnimatePresence>
  );
}
