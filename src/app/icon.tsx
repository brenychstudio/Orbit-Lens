import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "512px",
          height: "512px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          borderRadius: "96px",
          background:
            "radial-gradient(circle at 62% 34%, rgba(135,205,245,0.28), transparent 34%), linear-gradient(135deg, #030407, #081018 58%, #020304)",
          color: "#f4efe6",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "310px",
            height: "188px",
            borderRadius: "999px",
            border: "2px solid rgba(255,255,255,0.2)",
            boxShadow:
              "0 0 54px rgba(125,195,235,0.34), inset 0 0 36px rgba(255,255,255,0.05)",
            transform: "rotate(-9deg)",
          }}
        />
        <div
          style={{
            fontSize: "72px",
            letterSpacing: "-3px",
            fontWeight: 300,
          }}
        >
          OL
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
