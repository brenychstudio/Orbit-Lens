import type { BackdropPreset } from "@/data/orbit/backdropPresets";

export type DerivedBackdropState = {
  hazeOpacity: number;
  glowOpacity: number;
  traceOpacity: number;
  signalStrength: number;
  orbitScale: number;
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function deriveBackdropState({
  preset,
  isInspectOpen,
  isMobile,
  isTablet,
}: {
  preset: BackdropPreset;
  isInspectOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
}): DerivedBackdropState {
  const inspectFactor = isInspectOpen ? 0.68 : 1;
  const mobileFactor = isMobile ? 0.42 : isTablet ? 0.74 : 1;

  return {
    hazeOpacity: clamp01(preset.hazeOpacity * inspectFactor * mobileFactor),
    glowOpacity: clamp01(preset.glowOpacity * inspectFactor * mobileFactor),
    traceOpacity: clamp01(preset.traceOpacity * inspectFactor * mobileFactor),
    signalStrength: clamp01(preset.signalStrength * inspectFactor * mobileFactor),
    orbitScale: isMobile ? 0.86 : isTablet ? preset.orbitScale * 0.94 : preset.orbitScale,
  };
}
