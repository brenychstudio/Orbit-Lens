import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "180px",
          height: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          borderRadius: "34px",
          background:
            "radial-gradient(circle at 62% 34%, rgba(135,205,245,0.28), transparent 36%), linear-gradient(135deg, #030407, #081018 58%, #020304)",
          color: "#f4efe6",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "110px",
            height: "68px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.22)",
            boxShadow: "0 0 28px rgba(125,195,235,0.34)",
            transform: "rotate(-9deg)",
          }}
        />
        <div
          style={{
            fontSize: "28px",
            letterSpacing: "-1px",
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
