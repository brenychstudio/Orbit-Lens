export type OrbitMode = {
  id: string;
  eyebrow: string;
  title: string;
  tagline: string;
  description: string;
  signal: string;
  accent: string;
};

export const orbitModes: OrbitMode[] = [
  {
    id: "vision",
    eyebrow: "01 / Vision",
    title: "Spatial clarity without the noise.",
    tagline: "See less. Understand more.",
    description:
      "Orbit Lens places only the most useful context in your field of view: a route, a name, a signal, a quiet prompt. No crowded HUD. No visual overload.",
    signal: "Context cards / city layer / soft navigation",
    accent: "rgba(126, 197, 255, 0.72)",
  },
  {
    id: "translate",
    eyebrow: "02 / Translate",
    title: "Language becomes a transparent layer.",
    tagline: "Live captions for the real world.",
    description:
      "Conversations, signs, menus and exhibitions become readable through calm floating subtitles that appear only when they are needed.",
    signal: "Live captions / travel / meetings",
    accent: "rgba(174, 146, 255, 0.72)",
  },
  {
    id: "recall",
    eyebrow: "03 / Recall",
    title: "Memory, controlled by the user.",
    tagline: "Save what matters. Forget the rest.",
    description:
      "Orbit Lens is not designed for silent recording. It is designed for intentional memory: user-triggered notes, moments and places.",
    signal: "Private memory / notes / places",
    accent: "rgba(235, 216, 166, 0.72)",
  },
  {
    id: "create",
    eyebrow: "04 / Create",
    title: "A camera assistant for how creators actually move.",
    tagline: "Capture without breaking presence.",
    description:
      "Frame ideas, collect references, record short moments and scout locations while keeping both hands free and attention in the scene.",
    signal: "Framing / capture / creative notes",
    accent: "rgba(146, 232, 221, 0.72)",
  },
  {
    id: "focus",
    eyebrow: "05 / Focus",
    title: "The interface disappears when you need silence.",
    tagline: "A calmer operating system for attention.",
    description:
      "Focus mode removes everything non-essential. No dashboards. No constant alerts. Only the one signal that deserves attention.",
    signal: "Minimal mode / no-notification layer",
    accent: "rgba(220, 235, 255, 0.72)",
  },
  {
    id: "privacy",
    eyebrow: "06 / Privacy",
    title: "Designed to be visibly responsible.",
    tagline: "Trust is part of the interface.",
    description:
      "Capture states are visible, memory is user-controlled, and the product language avoids surveillance aesthetics from the first interaction.",
    signal: "Visible capture / consent / control",
    accent: "rgba(255, 255, 255, 0.72)",
  },
  {
    id: "access",
    eyebrow: "07 / Access",
    title: "A quieter interface for spatial intelligence.",
    tagline: "Product concept / private preview.",
    description:
      "Orbit Lens is a fictional AI spatial glasses launch prototype by Brenych Studio, built around calm context, visible trust and premium field-of-view interaction.",
    signal: "About / contact / prototype access",
    accent: "rgba(210, 232, 255, 0.72)",
  },
];
