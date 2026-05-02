import { OrbitSpatialHost } from "@/components/orbit-xr/OrbitSpatialHost";

export const metadata = {
  title: "Orbit Lens — Spatial Mode",
  description:
    "A WebXR-ready spatial interface twin for the Orbit Lens AI glasses concept.",
};

export default function SpatialPage() {
  return <OrbitSpatialHost />;
}
