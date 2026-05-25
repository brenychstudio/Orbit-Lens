import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Orbit Lens — AI Spatial Glasses Concept",
    short_name: "Orbit Lens",
    description:
      "A fictional AI spatial glasses concept and premium interactive interface prototype by Brenych Studio.",
    start_url: "/",
    display: "standalone",
    background_color: "#030407",
    theme_color: "#030407",
    categories: ["technology", "design", "productivity"],
  };
}
