import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Orbit Lens — AI Spatial Glasses Concept";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 68% 38%, rgba(132,190,225,0.22), transparent 30%), radial-gradient(circle at 22% 18%, rgba(255,255,255,0.08), transparent 28%), linear-gradient(135deg, #030407 0%, #071018 52%, #020304 100%)",
          color: "#f4efe6",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "42px",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "48px",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.01))",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.1), 0 40px 120px rgba(0,0,0,0.45)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: "100px",
            top: "156px",
            width: "390px",
            height: "240px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.22)",
            boxShadow:
              "0 0 80px rgba(120,190,230,0.28), inset 0 0 40px rgba(255,255,255,0.06)",
            transform: "rotate(-8deg)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: "210px",
            top: "230px",
            width: "230px",
            height: "28px",
            borderRadius: "999px",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.42), rgba(130,205,245,0.42), transparent)",
            filter: "blur(0.4px)",
            transform: "rotate(-8deg)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: "92px",
            top: "86px",
            display: "flex",
            flexDirection: "column",
            gap: "26px",
            maxWidth: "690px",
          }}
        >
          <div
            style={{
              fontSize: "22px",
              letterSpacing: "9px",
              textTransform: "uppercase",
              color: "rgba(180,220,245,0.78)",
            }}
          >
            Orbit Lens
          </div>

          <div
            style={{
              fontSize: "78px",
              lineHeight: "0.92",
              letterSpacing: "-5px",
              fontWeight: 300,
              color: "rgba(244,239,230,0.96)",
            }}
          >
            AI Spatial Glasses Concept
          </div>

          <div
            style={{
              fontSize: "28px",
              lineHeight: "1.35",
              maxWidth: "640px",
              color: "rgba(244,239,230,0.62)",
            }}
          >
            A premium product interface prototype where the website behaves like
            the spatial interface of the device.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: "92px",
            bottom: "72px",
            display: "flex",
            gap: "14px",
            alignItems: "center",
            color: "rgba(244,239,230,0.46)",
            fontSize: "20px",
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          <span>Fictional product concept</span>
          <span style={{ color: "rgba(244,239,230,0.22)" }}>•</span>
          <span>Web / Motion / WebXR</span>
          <span style={{ color: "rgba(244,239,230,0.22)" }}>•</span>
          <span>Brenych Studio</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
