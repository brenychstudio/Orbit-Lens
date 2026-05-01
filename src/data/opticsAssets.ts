export type OpticsAsset = {
  id: string;
  label: string;
  caption: string;
  src: string;
  ratio: "square" | "landscape";
};

export const opticsAssets: OpticsAsset[] = [
  {
    id: "floating",
    label: "Floating Frame",
    caption: "Primary product presence / atmospheric frame render.",
    src: "/glasses/orbit-lens-floating-1x1.png",
    ratio: "square",
  },
  {
    id: "front",
    label: "Front Optics",
    caption: "Symmetric front view / lens geometry and bridge structure.",
    src: "/glasses/orbit-lens-front-4x3.png",
    ratio: "landscape",
  },
  {
    id: "side",
    label: "Side Profile",
    caption: "Low-profile body / spatial camera and side arm language.",
    src: "/glasses/orbit-lens-side-4x3.png",
    ratio: "landscape",
  },
  {
    id: "material",
    label: "Material Closeup",
    caption: "Graphite shell, smoked lens surface and optical edge detail.",
    src: "/glasses/orbit-lens-material-closeup-4x3.png",
    ratio: "landscape",
  },
  {
    id: "privacy",
    label: "Visible Signal",
    caption:
      "Subtle privacy/capture indicator as part of the product language.",
    src: "/glasses/orbit-lens-privacy-indicator-closeup-4x3.png",
    ratio: "landscape",
  },
];
