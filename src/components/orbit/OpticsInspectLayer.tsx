"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
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
    "left-[4%] top-[18%] z-[20] w-[17.5rem] xl:left-[5%] xl:top-[17%] xl:w-[18.5rem]",
  front:
    "left-[45%] top-[17%] z-[18] w-[17rem] xl:left-[46%] xl:top-[16%] xl:w-[18rem]",
  side:
    "right-[1%] top-[28%] z-[24] w-[22rem] xl:right-[2%] xl:top-[27%] xl:w-[23rem]",
  material:
    "left-[20%] bottom-[1%] z-[26] w-[23rem] xl:left-[21%] xl:bottom-[0%] xl:w-[24rem]",
  privacy:
    "left-[55%] bottom-[4%] z-[22] w-[18rem] xl:left-[56%] xl:bottom-[4%] xl:w-[19rem]",
};

function InspectCard({
  asset,
  accent,
  isOpen,
  index,
  isSelected,
  hasSelection,
  dragEnabled,
  onSelect,
}: {
  asset: OpticsAsset;
  accent: string;
  isOpen: boolean;
  index: number;
  isSelected: boolean;
  hasSelection: boolean;
  dragEnabled: boolean;
  onSelect: () => void;
}) {
  const isSquare = asset.ratio === "square";
  const revealDelay = isOpen ? 0.28 + index * 0.07 : 0;
  const closeDelay = !isOpen ? Math.max(0, index * 0.024) : 0;

  return (
    <motion.button
      type="button"
      drag={dragEnabled}
      dragElastic={0.2}
      dragMomentum={false}
      dragConstraints={{ left: -520, right: 520, top: -260, bottom: 260 }}
      onClick={onSelect}
      className={`orbit-glass-card orbit-inspect-card absolute ${cardPositions[asset.id] ?? ""} group touch-none overflow-hidden rounded-[1.05rem] border p-1.5 text-left backdrop-blur-[18px] md:rounded-[1.25rem] md:p-2 lg:rounded-[1.35rem]`}
      initial={{
        opacity: 0,
        y: 10,
        scale: 0.975,
        filter: "blur(8px)",
      }}
      animate={{
        opacity: !isOpen
          ? 0
          : hasSelection
            ? isSelected
              ? 0.08
              : 0.28
            : 0.94,
        y: !isOpen ? 12 : hasSelection ? 0 : [0, -4, 0],
        scale: !isOpen ? 0.986 : hasSelection ? (isSelected ? 0.965 : 0.982) : 1,
        filter: hasSelection ? "blur(1.5px)" : "blur(0px)",
      }}
      exit={{
        opacity: 0,
        y: 6,
        scale: 0.98,
        filter: "blur(8px)",
      }}
      whileDrag={{
        scale: 1.035,
        zIndex: 120,
        transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
      }}
      transition={{
        opacity: {
          duration: isOpen ? 0.74 : 0.62,
          delay: isOpen ? revealDelay : closeDelay,
          ease: [0.22, 1, 0.36, 1],
        },
        filter: {
          duration: 0.36,
          ease: [0.22, 1, 0.36, 1],
        },
        scale: {
          duration: isOpen ? 0.74 : 0.62,
          delay: isOpen ? revealDelay : closeDelay,
          ease: [0.22, 1, 0.36, 1],
        },
        y:
          hasSelection || !isOpen
            ? {
                duration: isOpen ? 0.74 : 0.62,
                delay: isOpen ? revealDelay : closeDelay,
                ease: [0.22, 1, 0.36, 1],
              }
            : { duration: 8.2, repeat: Infinity, ease: "easeInOut" },
      }}
      style={{
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
        boxShadow: hasSelection
          ? `inset 0 1px 0 rgba(255,255,255,0.06), 0 16px 58px rgba(0,0,0,0.28), 0 0 18px ${accent}10`
          : `inset 0 1px 0 rgba(255,255,255,0.09), 0 24px 86px rgba(0,0,0,0.34), 0 0 28px ${accent}18`,
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
          className="orbit-inspect-card object-contain transition duration-700 group-hover:scale-[1.012]"
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

function TouchInspectStack({
  assets,
  activeIndex,
  setActiveIndex,
  accent,
  onSelect,
}: {
  assets: OpticsAsset[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  accent: string;
  onSelect: (id: string) => void;
}) {
  function goTo(index: number) {
    const nextIndex = Math.max(0, Math.min(assets.length - 1, index));
    setActiveIndex(nextIndex);
  }

  function handleDragEnd(
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    if (info.offset.x < -56) {
      goTo(activeIndex + 1);
      return;
    }

    if (info.offset.x > 56) {
      goTo(activeIndex - 1);
    }
  }

  return (
    <div className="absolute inset-x-4 top-[6.8rem] bottom-[5.8rem] z-40 lg:hidden">
      <motion.div
        className="relative h-full w-full touch-pan-y"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.14}
        onDragEnd={handleDragEnd}
      >
        {assets.map((asset, index) => {
          const offset = index - activeIndex;

          if (Math.abs(offset) > 1) return null;

          const isActive = offset === 0;

          return (
            <motion.button
              key={asset.id}
              type="button"
              onClick={() => {
                if (isActive) {
                  onSelect(asset.id);
                } else {
                  goTo(index);
                }
              }}
              className="absolute left-1/2 top-[48%] z-30 w-[min(78vw,21rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.45rem] border border-white/[0.13] bg-black/[0.58] p-2 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_26px_110px_rgba(0,0,0,0.48)] md:w-[min(76vw,46rem)] md:rounded-[1.9rem] md:p-3.5 lg:w-[min(62vw,34rem)] lg:rounded-[1.75rem] lg:p-3"
              style={{ transformOrigin: "center" }}
              initial={false}
              animate={{
                x: offset * 116 - 160,
                y: isActive ? -170 : offset > 0 ? -58 : -34,
                scale: isActive ? 1 : 0.82,
                opacity: isActive ? 1 : 0.42,
                filter: isActive ? "blur(0px)" : "blur(2px)",
                zIndex: isActive ? 30 : 16,
              }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className={`relative overflow-hidden rounded-[1rem] border border-white/[0.08] bg-black/32 ${
                  asset.ratio === "square" ? "aspect-square" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={asset.src}
                  alt={asset.label}
                  fill
                  sizes="72vw"
                  className="object-contain"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.08),transparent_36%),linear-gradient(180deg,transparent,rgba(0,0,0,0.22))]" />
                <div
                  className="absolute left-4 right-4 top-1/2 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.42), transparent)`,
                  }}
                />
              </div>

              <div className="px-2 pb-1.5 pt-2.5">
                <p className="text-[0.48rem] uppercase tracking-[0.24em] text-white/32">
                  Optics Layer
                </p>
                <p className="mt-1 text-[0.72rem] uppercase tracking-[0.2em] text-white/72">
                  {asset.label}
                </p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 backdrop-blur-[12px]">
        {assets.map((asset, index) => (
          <button
            key={asset.id}
            type="button"
            aria-label={`Show ${asset.label}`}
            onClick={() => goTo(index)}
            className="h-2.5 w-2.5 rounded-full border border-white/20 transition"
            style={{
              background:
                index === activeIndex ? accent : "rgba(255,255,255,0.16)",
              boxShadow: index === activeIndex ? `0 0 14px ${accent}` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MobileInspectStack({
  assets,
  activeIndex,
  setActiveIndex,
  accent,
  onSelect,
}: {
  assets: OpticsAsset[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  accent: string;
  onSelect: (id: string) => void;
}) {
  function goTo(index: number) {
    const nextIndex = Math.max(0, Math.min(assets.length - 1, index));
    setActiveIndex(nextIndex);
  }

  function handleDragEnd(
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    if (info.offset.x < -46) {
      goTo(activeIndex + 1);
      return;
    }

    if (info.offset.x > 46) {
      goTo(activeIndex - 1);
    }
  }

  const activeAsset = assets[activeIndex] ?? assets[0];
  const previousAsset = assets[activeIndex - 1] ?? null;
  const nextAsset = assets[activeIndex + 1] ?? null;

  if (!activeAsset) return null;

  return (
    <div className="absolute inset-x-4 top-[6.2rem] bottom-[5.2rem] z-40 md:hidden">
      <div className="absolute left-1 right-1 top-0 z-20">
        <p
          className="text-[0.56rem] uppercase tracking-[0.34em]"
          style={{ color: accent }}
        >
          Optics inspect mode
        </p>

        <p className="mt-2 max-w-[15rem] text-xl font-light leading-[0.92] tracking-[-0.07em] text-white">
          Product layers suspended in the field.
        </p>
      </div>

      <motion.div
        className="relative h-full w-full touch-pan-y"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        {previousAsset ? (
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="mobile-static-layer absolute left-[2%] top-[48%] z-10 w-[38%] -translate-y-1/2 overflow-hidden rounded-[1.1rem] border border-white/[0.07] bg-black/70 p-1.5 opacity-25"
          >
            <MobileCardImage asset={previousAsset} accent={accent} />
          </button>
        ) : null}

        {nextAsset ? (
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="mobile-static-layer absolute right-[2%] top-[48%] z-10 w-[38%] -translate-y-1/2 overflow-hidden rounded-[1.1rem] border border-white/[0.07] bg-black/70 p-1.5 opacity-25"
          >
            <MobileCardImage asset={nextAsset} accent={accent} />
          </button>
        ) : null}

        <motion.button
          key={activeAsset.id}
          type="button"
          onClick={() => onSelect(activeAsset.id)}
          className="mobile-static-layer absolute left-1/2 top-[51%] z-30 w-[min(76vw,20.5rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.35rem] border border-white/[0.13] bg-black/75 p-2 text-left shadow-[0_22px_90px_rgba(0,0,0,0.55)] md:w-[min(76vw,46rem)] md:rounded-[1.9rem] md:p-3.5 lg:w-[min(62vw,34rem)] lg:rounded-[1.75rem] lg:p-3"
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <MobileCardImage asset={activeAsset} accent={accent} />

          <div className="px-2 pb-2 pt-3">
            <p className="text-[0.5rem] uppercase tracking-[0.25em] text-white/34">
              Optics Layer
            </p>
            <p className="mt-1 text-[0.76rem] uppercase tracking-[0.21em] text-white/76">
              {activeAsset.label}
            </p>
          </div>
        </motion.button>
      </motion.div>

      <div className="absolute bottom-0 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/[0.08] bg-black/65 px-3 py-2">
        {assets.map((asset, index) => (
          <button
            key={asset.id}
            type="button"
            aria-label={`Show ${asset.label}`}
            onClick={() => goTo(index)}
            className="h-2.5 w-2.5 rounded-full border border-white/20 transition"
            style={{
              background:
                index === activeIndex ? accent : "rgba(255,255,255,0.16)",
              boxShadow: index === activeIndex ? `0 0 12px ${accent}` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MobileCardImage({
  asset,
  accent,
}: {
  asset: OpticsAsset;
  accent: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1rem] border border-white/[0.08] bg-black/45 ${
        asset.ratio === "square" ? "aspect-square" : "aspect-[4/3]"
      }`}
    >
      <Image
        src={asset.src}
        alt={asset.label}
        fill
        sizes="80vw"
        className="object-contain"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.24))]" />

      <div
        className="absolute left-4 right-4 top-1/2 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.38), transparent)`,
        }}
      />
    </div>
  );
}

function FocusVeil({
  accent,
  soft = false,
}: {
  accent: string;
  soft?: boolean;
}) {
  return (
    <motion.div
      className="orbit-inspect-focus-veil pointer-events-none absolute inset-0 z-30 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: soft ? 0.72 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="orbit-edge-light" />
      <div className="absolute inset-0 bg-black/26" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_47%,transparent_0%,transparent_36%,rgba(0,0,0,0.18)_68%,rgba(0,0,0,0.48)_100%)]" />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[32rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${accent} 0%, rgba(255,255,255,0.04) 18%, transparent 60%)`,
        }}
        animate={{
          opacity: [0.04, 0.1, 0.04],
          scale: [0.98, 1.03, 0.98],
        }}
        transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-[20%] right-[20%] top-1/2 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.32), ${accent}, transparent)`,
        }}
        animate={{ opacity: [0.06, 0.22, 0.06], scaleX: [0.92, 1, 0.92] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
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
        className={`orbit-detail-material absolute left-1/2 top-[50%] z-50 max-h-[78%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.2rem] border p-1.5 backdrop-blur-[26px] md:top-1/2 md:max-h-[82%] md:rounded-[1.65rem] md:p-2 ${
        isSquare ? "w-[min(84%,24rem)] md:w-[min(72%,42rem)] lg:w-[min(42%,30rem)]" : "w-[min(88%,29rem)] md:w-[min(82%,58rem)] lg:w-[min(52%,44rem)]"
      }`}
      initial={{ opacity: 0, scale: 0.965, y: 8, filter: "blur(6px)" }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.975, y: 6, filter: "blur(6px)" }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="orbit-edge-light" />

      <div
        className={`relative overflow-hidden rounded-[1.2rem] border border-white/[0.11] bg-black/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${
          isSquare ? "aspect-square" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={asset.src}
          alt={asset.label}
          fill
          sizes={isSquare ? "34vw" : "48vw"}
          className="orbit-inspect-card object-contain"
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
          className="group relative inline-flex shrink-0 items-center gap-2 px-1 py-2 text-[0.46rem] uppercase tracking-[0.28em] text-white/50 transition hover:text-white/86 md:text-[0.5rem] md:tracking-[0.32em]"
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
  const [touchCardIndex, setTouchCardIndex] = useState(0);
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

  useEffect(() => {
    if (!isOpen) {
      const resetTimer = window.setTimeout(() => {
        setSelectedId(null);
      }, 760);

      return () => window.clearTimeout(resetTimer);
    }
  }, [isOpen]);

  const dragEnabled = viewportTier === "desktop";
  const isMobileLayout = viewportTier === "mobile";
  const isTabletLayout = viewportTier === "tablet";
  const isTouchLayout = viewportTier !== "desktop";

  const handleClose = () => {
    onClose();
  };

  return (
    <motion.div
      data-open={isOpen ? "true" : "false"}
      aria-hidden={!isOpen}
      className="orbit-inspect-layer absolute inset-0 z-[60] origin-center overflow-hidden rounded-[1.55rem] bg-black/[0.3] md:rounded-[2.3rem] xl:rounded-[2.8rem]"
      initial={false}
      animate={{
        opacity: isOpen ? 1 : 0,
        y: isOpen ? 0 : 3,
      }}
      transition={{
        duration: isOpen ? 0.86 : 0.72,
        delay: isOpen ? 0.16 : 0,
        ease: isOpen ? [0.19, 1, 0.22, 1] : [0.22, 1, 0.36, 1],
      }}
      style={{
        pointerEvents: isOpen ? "auto" : "none",
        backfaceVisibility: "hidden",
        transformOrigin: "50% 50%",
        willChange: "opacity, transform",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.055),transparent_34%),linear-gradient(90deg,rgba(0,0,0,0.58),rgba(0,0,0,0.22),rgba(0,0,0,0.58))]" />

      <div
        className="absolute left-8 right-8 top-8 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.34), ${accent}, transparent)`,
          opacity: 0.34,
        }}
      />

      <div
        className="absolute bottom-8 left-8 right-8 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.22), ${accent}, transparent)`,
          opacity: 0.2,
        }}
      />

      <div className="absolute left-4 top-4 z-30 max-w-[12.5rem] md:left-7 md:top-7 md:max-w-[19rem] lg:left-8 lg:top-8 lg:max-w-[20rem]">
        <p
          className="text-[0.56rem] uppercase tracking-[0.34em]"
          style={{ color: accent }}
        >
          Optics inspect mode
        </p>

        <h2 className="mt-2 max-w-[12.5rem] text-lg font-light leading-[0.92] tracking-[-0.075em] text-white drop-shadow-[0_12px_42px_rgba(0,0,0,0.86)] md:max-w-[19rem] md:text-3xl lg:mt-3 lg:max-w-[20rem] lg:text-4xl">
          Product layers suspended in the field.
        </h2>

        <p className="mt-4 max-w-[18rem] text-xs leading-5 text-white/48 md:text-sm md:leading-6">
          Drag the optical cards. Select one to inspect. Return to field when the
          product layer closes.
        </p>
      </div>

      <button
        type="button"
        onPointerDown={(event) => {
          event.stopPropagation();
          handleClose();
        }}
        onClick={(event) => {
          event.stopPropagation();
          handleClose();
        }}
        className="absolute right-6 top-6 z-[80] inline-flex items-center gap-3 px-2 py-2 text-[0.72rem] uppercase tracking-[0.42em] text-white/58 transition hover:text-white md:right-8 md:top-8 lg:right-10"
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: accent, boxShadow: `0 0 14px ${accent}` }}
        />
        <span>Return</span>
      </button>

      {isMobileLayout ? (
        <div className="absolute inset-0 z-[13] bg-black/[0.78]" />
      ) : null}

      {isMobileLayout ? (
        <MobileInspectStack
          assets={opticsAssets}
          activeIndex={touchCardIndex}
          setActiveIndex={setTouchCardIndex}
          accent={accent}
          onSelect={setSelectedId}
        />
      ) : isTabletLayout ? (
        <TouchInspectStack
          assets={opticsAssets}
          activeIndex={touchCardIndex}
          setActiveIndex={setTouchCardIndex}
          accent={accent}
          onSelect={setSelectedId}
        />
      ) : (
        <div className="absolute inset-0 z-20 lg:left-[3.8rem] lg:right-[3.2rem] lg:top-[5.9rem] lg:bottom-[3.8rem]">
          {opticsAssets.map((asset, index) => {
            const isSelected = selectedId === asset.id;
            const hasSelection = selectedId !== null;

            return (
              <InspectCard
                key={asset.id}
                asset={asset}
                accent={accent}
                isOpen={isOpen}
                index={index}
                isSelected={isSelected}
                hasSelection={hasSelection}
                dragEnabled={dragEnabled}
                onSelect={() => setSelectedId(asset.id)}
              />
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {selectedAsset && isOpen ? (
          <>
            <FocusVeil accent={accent} soft={isTouchLayout} />
            <ExpandedAsset
              asset={selectedAsset}
              accent={accent}
              onClose={() => setSelectedId(null)}
            />
          </>
        ) : null}
      </AnimatePresence>

      {!selectedAsset && !isTouchLayout ? (
        <div className="absolute bottom-[4.2rem] left-1/2 z-30 -translate-x-1/2 text-[0.52rem] uppercase tracking-[0.32em] text-white/26">
          Drag / select / inspect
        </div>
      ) : null}
    </motion.div>
  );
}
