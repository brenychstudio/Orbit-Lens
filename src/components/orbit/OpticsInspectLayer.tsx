"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { opticsAssets, type OpticsAsset } from "@/data/opticsAssets";

type OpticsInspectLayerProps = {
  isOpen: boolean;
  accent: string;
  onClose: () => void;
};

type ViewportTier = "mobile" | "tablet" | "desktop";

function getViewportTier(width: number): ViewportTier {
  if (width < 768) return "mobile";
  if (width < 1180) return "tablet";
  return "desktop";
}

const cardPositions: Record<string, string> = {
  floating:
    "left-[7%] top-[48%] z-[18] w-[40%] md:left-[8%] md:top-auto md:bottom-[22%] md:w-[15rem] lg:left-[6%] lg:bottom-[22%] lg:w-[15.5rem] xl:w-[16.5rem]",
  front:
    "right-[7%] top-[50%] z-[17] w-[40%] md:left-[42%] md:right-auto md:top-auto md:bottom-[20%] md:w-[15.5rem] lg:right-[23%] lg:left-auto lg:bottom-[23%] lg:w-[16rem] xl:w-[17rem]",
  side:
    "left-[19%] top-[24%] z-[24] w-[62%] md:left-auto md:right-[8%] md:top-[22%] md:w-[20rem] lg:left-[39%] lg:right-auto lg:top-[13%] lg:w-[20.5rem] xl:w-[22.5rem]",
  material:
    "right-[6%] top-[36%] z-[15] w-[36%] opacity-75 md:right-[8%] md:top-[47%] md:w-[17rem] md:opacity-100 lg:right-[6%] lg:top-[15%] lg:w-[18rem] xl:w-[19.5rem]",
  privacy:
    "left-[24%] bottom-[12%] z-[22] w-[52%] md:left-auto md:right-[24%] md:bottom-[9%] md:w-[18rem] lg:left-[38%] lg:right-auto lg:bottom-[10%] lg:w-[19rem] xl:w-[20.5rem]",
};

function InspectCard({
  asset,
  accent,
  isSelected,
  hasSelection,
  dragEnabled,
  onSelect,
}: {
  asset: OpticsAsset;
  accent: string;
  isSelected: boolean;
  hasSelection: boolean;
  dragEnabled: boolean;
  onSelect: () => void;
}) {
  const isSquare = asset.ratio === "square";

  return (
    <motion.button
      type="button"
      drag={dragEnabled}
      dragElastic={0.08}
      dragConstraints={{ left: -280, right: 280, top: -180, bottom: 180 }}
      onClick={onSelect}
      className={`absolute ${cardPositions[asset.id] ?? ""} group touch-none overflow-hidden rounded-[1.05rem] border border-white/[0.11] bg-white/[0.034] p-1.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_76px_rgba(0,0,0,0.32)] backdrop-blur-[20px] md:rounded-[1.25rem] md:border-white/[0.12] md:bg-white/[0.038] md:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_22px_90px_rgba(0,0,0,0.34)] lg:rounded-[1.35rem] md:p-2`}
      initial={{
        opacity: 0,
        y: 18,
        scale: 0.94,
        filter: "blur(18px)",
      }}
      animate={{
        opacity: hasSelection ? (isSelected ? 0.08 : 0.34) : 0.92,
        y: hasSelection ? 0 : [0, -8, 0],
        scale: hasSelection ? (isSelected ? 0.95 : 0.97) : 1,
        filter: hasSelection ? "blur(3.5px)" : "blur(0px)",
      }}
      exit={{
        opacity: 0,
        y: 12,
        scale: 0.94,
        filter: "blur(18px)",
      }}
      transition={{
        opacity: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        filter: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 7.4, repeat: Infinity, ease: "easeInOut" },
      }}
      style={{
        boxShadow: hasSelection
          ? `inset 0 1px 0 rgba(255,255,255,0.07), 0 18px 70px rgba(0,0,0,0.3), 0 0 24px ${accent}12`
          : `inset 0 1px 0 rgba(255,255,255,0.1), 0 26px 110px rgba(0,0,0,0.36), 0 0 44px ${accent}22`,
      }}
    >
      <div
        className={`relative overflow-hidden rounded-[1.05rem] border border-white/[0.08] bg-black/28 ${
          isSquare ? "aspect-square" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={asset.src}
          alt={asset.label}
          fill
          sizes="(max-width: 768px) 70vw, 320px"
          className="object-contain transition duration-700 group-hover:scale-[1.018]"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.14),transparent_42%),linear-gradient(180deg,transparent,rgba(0,0,0,0.54))]" />

        <motion.div
          className="absolute left-4 right-4 top-1/2 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.7), transparent)`,
          }}
          animate={{ opacity: [0.14, 0.52, 0.14], scaleX: [0.9, 1, 0.9] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="px-2 pb-1.5 pt-2.5">
        <p className="text-[0.48rem] uppercase tracking-[0.24em] text-white/30">
          Optics Layer
        </p>
        <p className="mt-0.5 text-[0.62rem] uppercase tracking-[0.19em] text-white/68">
          {asset.label}
        </p>
      </div>
    </motion.button>
  );
}

function FocusVeil({ accent }: { accent: string }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(3px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_47%,transparent_0%,transparent_34%,rgba(0,0,0,0.22)_66%,rgba(0,0,0,0.58)_100%)]" />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[32rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${accent} 0%, rgba(255,255,255,0.055) 18%, transparent 60%)`,
        }}
        animate={{
          opacity: [0.06, 0.14, 0.06],
          scale: [0.96, 1.04, 0.96],
        }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-[20%] right-[20%] top-1/2 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.42), ${accent}, transparent)`,
        }}
        animate={{ opacity: [0.08, 0.3, 0.08], scaleX: [0.9, 1, 0.9] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

function OpticalTypewriterCaption({
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

    const startDelay = window.setTimeout(() => {
      interval = window.setInterval(() => {
        index += 1;
        setVisibleText(chars.slice(0, index).join(""));

        if (index >= chars.length) {
          window.clearInterval(interval);
        }
      }, 46);
    }, 260);

    return () => {
      window.clearTimeout(resetDelay);
      window.clearTimeout(startDelay);
      if (interval !== undefined) {
        window.clearInterval(interval);
      }
    };
  }, [text]);

  return (
    <div className="pointer-events-none absolute bottom-4 left-4 max-w-[calc(100%-2rem)] md:bottom-8 md:left-8 md:max-w-[30rem]">
      <div className="mb-2 flex items-center gap-2">
        <motion.span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: accent,
            boxShadow: `0 0 16px ${accent}`,
          }}
          animate={{ opacity: [0.35, 1, 0.35], scale: [0.9, 1.18, 0.9] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        <p
          className="text-[0.5rem] uppercase tracking-[0.32em] text-white/38"
          style={{
            textShadow: `0 0 12px ${accent}44, 0 8px 24px rgba(0,0,0,0.9)`,
          }}
        >
          Optical note
        </p>
      </div>

      <p
        className="min-h-[2.6rem] max-w-[26rem] text-[0.72rem] font-light leading-5 text-white/72 sm:text-sm sm:leading-6 md:min-h-[3rem] md:max-w-[28rem] md:text-base md:leading-7"
        style={{
          textShadow: `0 0 16px ${accent}38, 0 8px 28px rgba(0,0,0,0.94)`,
        }}
      >
        {visibleText}
        <motion.span
          className="ml-1 inline-block h-4 w-px align-[-0.16em] md:h-5"
          style={{
            background: accent,
            boxShadow: `0 0 12px ${accent}`,
          }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        />
      </p>
    </div>
  );
}

function ExpandedAsset({
  asset,
  accent,
  onClose,
}: {
  asset: OpticsAsset;
  accent: string;
  onClose: () => void;
}) {
  const isSquare = asset.ratio === "square";

  return (
    <motion.div
      className={`absolute left-1/2 top-[48%] z-50 max-h-[78%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.2rem] border border-white/[0.13] bg-white/[0.047] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_34px_140px_rgba(0,0,0,0.5)] backdrop-blur-[24px] md:top-1/2 md:max-h-[82%] md:rounded-[1.65rem] md:p-2 ${
        isSquare ? "w-[min(84%,24rem)] md:w-[min(42%,30rem)]" : "w-[min(88%,29rem)] md:w-[min(52%,44rem)]"
      }`}
      initial={{ opacity: 0, scale: 0.9, y: 14, filter: "blur(18px)" }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.92, y: 10, filter: "blur(18px)" }}
      transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`relative overflow-hidden rounded-[1.2rem] border border-white/[0.085] bg-black/34 ${
          isSquare ? "aspect-square" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={asset.src}
          alt={asset.label}
          fill
          sizes={isSquare ? "34vw" : "48vw"}
          className="object-contain"
          priority
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(255,255,255,0.08),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.28))]" />

        <motion.div
          className="absolute left-6 right-6 top-1/2 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.78), ${accent}, transparent)`,
          }}
          animate={{
            opacity: [0.16, 0.62, 0.16],
            scaleX: [0.92, 1, 0.92],
          }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        />

        <OpticalTypewriterCaption text={asset.caption} accent={accent} />
      </div>

      <div className="flex items-center justify-between gap-4 px-2 pb-2 pt-3">
        <div className="min-w-0">
          <p className="text-[0.48rem] uppercase tracking-[0.26em] text-white/30">
            Product Inspection
          </p>
          <h3 className="mt-1 truncate text-lg font-light tracking-[-0.045em] text-white md:text-xl">
            {asset.label}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close product inspection detail"
          className="group relative inline-flex shrink-0 items-center gap-2 px-1 py-2 text-[0.46rem] uppercase tracking-[0.26em] text-white/42 transition hover:text-white/72 md:text-[0.5rem] md:tracking-[0.3em]"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: accent, boxShadow: `0 0 14px ${accent}` }}
          />
          <span>Close</span>
          <span
            className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
            style={{
              background: `linear-gradient(90deg, ${accent}, rgba(255,255,255,0.34), transparent)`,
            }}
          />
        </button>
      </div>
    </motion.div>
  );
}

export function OpticsInspectLayer({
  isOpen,
  accent,
  onClose,
}: OpticsInspectLayerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewportTier, setViewportTier] = useState<ViewportTier>("desktop");
  const selectedAsset =
    opticsAssets.find((asset) => asset.id === selectedId) ?? null;

  useEffect(() => {
    function syncViewportTier() {
      setViewportTier(getViewportTier(window.innerWidth));
    }

    syncViewportTier();
    window.addEventListener("resize", syncViewportTier);

    return () => window.removeEventListener("resize", syncViewportTier);
  }, []);

  const dragEnabled = viewportTier === "desktop";

  const handleClose = () => {
    setSelectedId(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="absolute inset-0 z-50 origin-center overflow-hidden rounded-[1.55rem] bg-black/[0.24] backdrop-blur-[4px] md:rounded-[2.3rem] xl:rounded-[2.8rem]"
          initial={{
            opacity: 0,
            scale: 0.72,
            y: 22,
            filter: "blur(24px)",
            clipPath: "inset(18% 22% 18% 22% round 2.4rem)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            clipPath: "inset(0% 0% 0% 0% round 2.4rem)",
          }}
          exit={{
            opacity: 0,
            scale: 0.78,
            y: 18,
            filter: "blur(22px)",
            clipPath: "inset(16% 20% 16% 20% round 2.4rem)",
          }}
          transition={{
            duration: 0.92,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.08),transparent_34%),linear-gradient(90deg,rgba(0,0,0,0.54),rgba(0,0,0,0.18),rgba(0,0,0,0.54))]" />

          <motion.div
            className="absolute left-8 right-8 top-8 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.58), ${accent}, transparent)`,
            }}
            initial={{ scaleX: 0.22, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0.2, 0.54, 0.2] }}
            exit={{ scaleX: 0.22, opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            className="absolute bottom-8 left-8 right-8 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.36), ${accent}, rgba(255,255,255,0.36), transparent)`,
            }}
            initial={{ scaleX: 0.22, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0.16, 0.42, 0.16] }}
            exit={{ scaleX: 0.22, opacity: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            className="absolute bottom-8 top-8 left-8 w-px"
            style={{
              background: `linear-gradient(180deg, transparent, ${accent}, transparent)`,
            }}
            initial={{ scaleY: 0.18, opacity: 0 }}
            animate={{ scaleY: 1, opacity: [0.1, 0.32, 0.1] }}
            exit={{ scaleY: 0.18, opacity: 0 }}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            className="absolute bottom-8 top-8 right-8 w-px"
            style={{
              background: `linear-gradient(180deg, transparent, rgba(255,255,255,0.32), ${accent}, transparent)`,
            }}
            initial={{ scaleY: 0.18, opacity: 0 }}
            animate={{ scaleY: 1, opacity: [0.08, 0.26, 0.08] }}
            exit={{ scaleY: 0.18, opacity: 0 }}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            className="absolute left-1/2 top-[48%] h-[48rem] w-[80rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${accent} 0%, rgba(255,255,255,0.08) 18%, transparent 62%)`,
            }}
            animate={{ opacity: [0.1, 0.22, 0.1], scale: [0.96, 1.04, 0.96] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <AnimatePresence>
            {!selectedAsset ? (
              <motion.div
                className="absolute left-4 top-4 z-30 max-w-[12.5rem] md:left-7 md:top-7 md:max-w-[19rem] lg:left-8 lg:top-8 lg:max-w-[25rem]"
                initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(12px)" }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <p
                  className="text-[0.6rem] uppercase tracking-[0.34em]"
                  style={{ color: accent }}
                >
                  Optics Inspect Mode
                </p>
                <h2 className="mt-2 max-w-[12.5rem] text-lg font-light leading-[0.92] tracking-[-0.075em] text-white drop-shadow-[0_12px_42px_rgba(0,0,0,0.86)] md:max-w-[19rem] md:text-3xl lg:mt-3 lg:max-w-[24rem] lg:text-5xl">
                  Product layers suspended in the field.
                </h2>
                <p className="mt-3 hidden max-w-[17rem] text-xs leading-5 text-white/46 lg:block lg:mt-4 lg:max-w-sm lg:text-sm lg:leading-6">
                  Drag the optical cards. Select one to inspect. Return to field when the product layer closes.
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Return to Orbit Field"
            className="group absolute right-4 top-4 z-50 inline-flex items-center gap-2 px-1 py-2 text-[0.46rem] uppercase tracking-[0.26em] text-white/42 transition hover:text-white/72 md:right-8 md:top-8 md:text-[0.5rem] md:tracking-[0.3em]"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: accent, boxShadow: `0 0 14px ${accent}` }}
            />
            Return
            <span
              className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
              style={{
                background: `linear-gradient(90deg, ${accent}, rgba(255,255,255,0.36), transparent)`,
              }}
            />
          </button>

          <div className="absolute inset-0 z-20">
            {opticsAssets.map((asset) => (
              <InspectCard
                key={asset.id}
                asset={asset}
                accent={accent}
                isSelected={selectedId === asset.id}
                hasSelection={selectedId !== null}
                dragEnabled={dragEnabled}
                onSelect={() => setSelectedId(asset.id)}
              />
            ))}
          </div>

          <AnimatePresence>
            {selectedAsset ? <FocusVeil key="focus-veil" accent={accent} /> : null}
          </AnimatePresence>

          <AnimatePresence>
            {selectedAsset ? (
              <ExpandedAsset
                key={selectedAsset.id}
                asset={selectedAsset}
                accent={accent}
                onClose={() => setSelectedId(null)}
              />
            ) : null}
          </AnimatePresence>

          {!selectedAsset ? (
            <div className="absolute bottom-5 left-1/2 z-30 hidden -translate-x-1/2 text-[0.46rem] uppercase tracking-[0.3em] text-white/20 lg:block">
              Drag / Select / Inspect
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
