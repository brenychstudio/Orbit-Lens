"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

type ModeInterfaceOverlayProps = {
  modeId: string;
  accent: string;
};

type InterfaceCopy = {
  primary: string;
  secondary: string;
  tertiary: string;
  status: string;
};

const interfaceCopy: Record<string, InterfaceCopy> = {
  vision: {
    primary: "Route signal / 12 m",
    secondary: "City layer detected",
    tertiary: "Context density: low",
    status: "Spatial clarity active",
  },
  translate: {
    primary: "Live caption stream",
    secondary: "Language layer active",
    tertiary: "Subtitle opacity: adaptive",
    status: "Translation layer active",
  },
  recall: {
    primary: "Memory note ready",
    secondary: "Place context saved",
    tertiary: "Manual capture only",
    status: "Private recall active",
  },
  create: {
    primary: "Framing assist",
    secondary: "Scene reference locked",
    tertiary: "Capture angle: stable",
    status: "Creator mode active",
  },
  focus: {
    primary: "Noise reduced",
    secondary: "Priority signal only",
    tertiary: "Notifications muted",
    status: "Focus field active",
  },
  privacy: {
    primary: "Visible capture state",
    secondary: "Consent layer active",
    tertiary: "User-controlled memory",
    status: "Privacy shield active",
  },
};

function PeripheralChip({
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
      className={`absolute rounded-full border border-white/10 bg-black/28 px-4 py-2 text-[0.55rem] uppercase tracking-[0.23em] text-white/42 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl ${className}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{
        opacity: [0.18, 0.46, 0.18],
        y: [3, -3, 3],
      }}
      transition={{
        duration: 7,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

function QuietReticle({ accent }: { accent: string }) {
  return (
    <motion.div
      className="absolute right-[14%] top-[48%] h-36 w-36 -translate-y-1/2 rounded-full border border-white/[0.09]"
      style={{ boxShadow: `0 0 60px ${accent}` }}
      animate={{
        scale: [0.96, 1.04, 0.96],
        opacity: [0.08, 0.24, 0.08],
      }}
      transition={{ duration: 7.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute inset-8 rounded-full border border-white/[0.08]" />
      <div
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: accent, boxShadow: `0 0 22px ${accent}` }}
      />
      <div className="absolute left-1/2 top-0 h-7 w-px -translate-x-1/2 bg-white/12" />
      <div className="absolute bottom-0 left-1/2 h-7 w-px -translate-x-1/2 bg-white/12" />
      <div className="absolute left-0 top-1/2 h-px w-7 -translate-y-1/2 bg-white/12" />
      <div className="absolute right-0 top-1/2 h-px w-7 -translate-y-1/2 bg-white/12" />
    </motion.div>
  );
}

function VisionLayer({ accent, copy }: { accent: string; copy: InterfaceCopy }) {
  return (
    <>
      <QuietReticle accent={accent} />
      <PeripheralChip className="right-[8%] top-[28%]" delay={0.2}>
        {copy.primary}
      </PeripheralChip>
      <PeripheralChip className="left-[8%] bottom-[32%]" delay={1.1}>
        {copy.secondary}
      </PeripheralChip>
      <PeripheralChip className="right-[22%] bottom-[18%]" delay={2}>
        {copy.tertiary}
      </PeripheralChip>
    </>
  );
}

function TranslateLayer({ accent, copy }: { accent: string; copy: InterfaceCopy }) {
  return (
    <>
      <PeripheralChip className="right-[7%] top-[27%]" delay={0.2}>
        {copy.secondary}
      </PeripheralChip>

      <motion.div
        className="absolute bottom-[27%] left-[8%] max-w-[25rem] rounded-[1.4rem] border border-white/10 bg-black/32 p-4 text-sm leading-6 text-white/60 shadow-[0_22px_80px_rgba(0,0,0,0.34)] backdrop-blur-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0.3, 0.58, 0.3], y: [4, -3, 4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="mb-2 text-[0.55rem] uppercase tracking-[0.24em] text-white/34">
          Live Translation
        </p>
        <p>The entrance is on your left. Your table is already prepared.</p>
      </motion.div>

      <motion.div
        className="absolute bottom-[23%] left-[11%] h-px w-[42%]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
        animate={{ opacity: [0.12, 0.46, 0.12], scaleX: [0.88, 1, 0.88] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

function RecallLayer({ accent, copy }: { accent: string; copy: InterfaceCopy }) {
  return (
    <>
      <motion.div
        className="absolute bottom-[28%] left-[9%] flex w-[54%] items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.18, 0.5, 0.18] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="flex flex-1 items-center gap-3">
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: accent, boxShadow: `0 0 18px ${accent}` }}
            />
            <div className="h-px flex-1 bg-white/12" />
          </div>
        ))}
      </motion.div>

      <PeripheralChip className="right-[8%] top-[28%]" delay={0.2}>
        {copy.primary}
      </PeripheralChip>
      <PeripheralChip className="left-[10%] bottom-[18%]" delay={1.2}>
        {copy.secondary}
      </PeripheralChip>
      <PeripheralChip className="right-[20%] bottom-[33%]" delay={2}>
        {copy.tertiary}
      </PeripheralChip>
    </>
  );
}

function CreateLayer({ accent, copy }: { accent: string; copy: InterfaceCopy }) {
  return (
    <>
      <motion.div
        className="absolute right-[10%] top-[30%] h-[38%] w-[48%] rounded-[1.8rem] border border-white/14"
        animate={{
          opacity: [0.14, 0.4, 0.14],
          scale: [0.988, 1, 0.988],
        }}
        transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="absolute -left-1 -top-1 h-7 w-7 border-l border-t border-white/36" />
        <span className="absolute -right-1 -top-1 h-7 w-7 border-r border-t border-white/36" />
        <span className="absolute -bottom-1 -left-1 h-7 w-7 border-b border-l border-white/36" />
        <span className="absolute -bottom-1 -right-1 h-7 w-7 border-b border-r border-white/36" />
      </motion.div>

      <motion.div
        className="absolute right-[13%] top-[70%] h-px w-[42%]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
        animate={{ opacity: [0.12, 0.46, 0.12] }}
        transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
      />

      <PeripheralChip className="left-[9%] bottom-[31%]" delay={0.2}>
        {copy.primary}
      </PeripheralChip>
      <PeripheralChip className="right-[8%] top-[24%]" delay={1.2}>
        {copy.secondary}
      </PeripheralChip>
    </>
  );
}

function FocusLayer({ accent, copy }: { accent: string; copy: InterfaceCopy }) {
  return (
    <>
      <QuietReticle accent={accent} />

      <motion.div
        className="absolute inset-x-[12%] top-[52%] h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.24), ${accent}, transparent)`,
        }}
        animate={{ opacity: [0.08, 0.32, 0.08], scaleX: [0.86, 1, 0.86] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <PeripheralChip className="right-[9%] top-[28%]" delay={0.2}>
        {copy.primary}
      </PeripheralChip>
      <PeripheralChip className="left-[10%] bottom-[25%]" delay={1.3}>
        {copy.secondary}
      </PeripheralChip>
    </>
  );
}

function PrivacyLayer({ accent, copy }: { accent: string; copy: InterfaceCopy }) {
  return (
    <>
      <motion.div
        className="absolute right-[11%] top-[27%] h-28 w-28 rounded-full border border-white/12"
        style={{ boxShadow: `0 0 60px ${accent}` }}
        animate={{ opacity: [0.12, 0.34, 0.12], scale: [0.96, 1.05, 0.96] }}
        transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-7 rounded-full border border-white/14" />
        <div
          className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: accent, boxShadow: `0 0 24px ${accent}` }}
        />
      </motion.div>

      <PeripheralChip className="left-[9%] bottom-[32%]" delay={0.3}>
        {copy.primary}
      </PeripheralChip>
      <PeripheralChip className="right-[8%] bottom-[22%]" delay={1.3}>
        {copy.secondary}
      </PeripheralChip>
      <PeripheralChip className="right-[22%] top-[24%]" delay={2.1}>
        {copy.tertiary}
      </PeripheralChip>
    </>
  );
}

export function ModeInterfaceOverlay({ modeId, accent }: ModeInterfaceOverlayProps) {
  const copy = interfaceCopy[modeId] ?? interfaceCopy.vision;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 hidden overflow-hidden rounded-[1.6rem] md:block">
      <div className="absolute inset-0 opacity-[0.014] [background-image:linear-gradient(rgba(255,255,255,0.75)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.75)_1px,transparent_1px)] [background-size:88px_88px]" />

      <motion.div
        className="absolute right-8 top-8 rounded-full border border-white/10 bg-black/24 px-4 py-2 text-[0.54rem] uppercase tracking-[0.24em] text-white/34 backdrop-blur-xl"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {copy.status}
      </motion.div>

      {modeId === "translate" ? (
        <TranslateLayer accent={accent} copy={copy} />
      ) : modeId === "recall" ? (
        <RecallLayer accent={accent} copy={copy} />
      ) : modeId === "create" ? (
        <CreateLayer accent={accent} copy={copy} />
      ) : modeId === "focus" ? (
        <FocusLayer accent={accent} copy={copy} />
      ) : modeId === "privacy" ? (
        <PrivacyLayer accent={accent} copy={copy} />
      ) : (
        <VisionLayer accent={accent} copy={copy} />
      )}

      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-35"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
    </div>
  );
}
