export type BackdropPreset = {
  id: string;
  label: string;
  baseA: string;
  baseB: string;
  baseC: string;
  glow: string;
  secondaryGlow: string;
  trace: string;
  hazeOpacity: number;
  glowOpacity: number;
  traceOpacity: number;
  pulseSpeed: number;
  driftSpeed: number;
  signalStrength: number;
  orbitScale: number;
};

export const backdropPresets: Record<string, BackdropPreset> = {
  vision: {
    id: "vision",
    label: "Vision Field",
    baseA: "#02070d",
    baseB: "#071522",
    baseC: "#0b2231",
    glow: "rgba(84, 214, 255, 0.42)",
    secondaryGlow: "rgba(190, 221, 255, 0.18)",
    trace: "rgba(152, 228, 255, 0.72)",
    hazeOpacity: 0.52,
    glowOpacity: 0.46,
    traceOpacity: 0.34,
    pulseSpeed: 7.6,
    driftSpeed: 18,
    signalStrength: 0.72,
    orbitScale: 1.04,
  },
  translate: {
    id: "translate",
    label: "Language Field",
    baseA: "#03070b",
    baseB: "#091722",
    baseC: "#162331",
    glow: "rgba(204, 245, 255, 0.36)",
    secondaryGlow: "rgba(245, 249, 255, 0.16)",
    trace: "rgba(218, 250, 255, 0.68)",
    hazeOpacity: 0.48,
    glowOpacity: 0.42,
    traceOpacity: 0.3,
    pulseSpeed: 8.2,
    driftSpeed: 20,
    signalStrength: 0.62,
    orbitScale: 0.98,
  },
  recall: {
    id: "recall",
    label: "Memory Field",
    baseA: "#03040a",
    baseB: "#0b0d1a",
    baseC: "#17142a",
    glow: "rgba(142, 166, 255, 0.36)",
    secondaryGlow: "rgba(210, 200, 255, 0.14)",
    trace: "rgba(178, 198, 255, 0.64)",
    hazeOpacity: 0.54,
    glowOpacity: 0.38,
    traceOpacity: 0.28,
    pulseSpeed: 9,
    driftSpeed: 22,
    signalStrength: 0.58,
    orbitScale: 1.08,
  },
  create: {
    id: "create",
    label: "Creation Field",
    baseA: "#030608",
    baseB: "#0b1518",
    baseC: "#10282d",
    glow: "rgba(106, 236, 226, 0.38)",
    secondaryGlow: "rgba(255, 255, 235, 0.13)",
    trace: "rgba(170, 255, 242, 0.66)",
    hazeOpacity: 0.5,
    glowOpacity: 0.44,
    traceOpacity: 0.34,
    pulseSpeed: 7.2,
    driftSpeed: 17,
    signalStrength: 0.76,
    orbitScale: 1.02,
  },
  focus: {
    id: "focus",
    label: "Reduced Field",
    baseA: "#010204",
    baseB: "#04070b",
    baseC: "#090d12",
    glow: "rgba(125, 170, 190, 0.18)",
    secondaryGlow: "rgba(255, 255, 255, 0.06)",
    trace: "rgba(170, 210, 225, 0.36)",
    hazeOpacity: 0.3,
    glowOpacity: 0.22,
    traceOpacity: 0.16,
    pulseSpeed: 10.4,
    driftSpeed: 26,
    signalStrength: 0.3,
    orbitScale: 0.94,
  },
  privacy: {
    id: "privacy",
    label: "Trust Field",
    baseA: "#020606",
    baseB: "#071312",
    baseC: "#0b211e",
    glow: "rgba(108, 230, 204, 0.3)",
    secondaryGlow: "rgba(180, 255, 226, 0.11)",
    trace: "rgba(144, 255, 220, 0.58)",
    hazeOpacity: 0.42,
    glowOpacity: 0.34,
    traceOpacity: 0.24,
    pulseSpeed: 8.8,
    driftSpeed: 21,
    signalStrength: 0.48,
    orbitScale: 0.98,
  },
};

export function getBackdropPreset(modeId: string): BackdropPreset {
  return backdropPresets[modeId] ?? backdropPresets.vision;
}
