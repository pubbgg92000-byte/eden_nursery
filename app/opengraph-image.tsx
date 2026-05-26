import { ImageResponse } from "next/og";

export const alt = "EDEN Nursery - cinematic botanical sanctuary";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ background: "#061d17", color: "white", display: "flex", flexDirection: "column", height: "100%", width: "100%", padding: 72, justifyContent: "flex-end" }}>
      <div style={{ color: "#34d399", fontSize: 20, letterSpacing: 10, textTransform: "uppercase" }}>Cinematic Botanical Sanctuary</div>
      <div style={{ display: "flex", fontSize: 126, fontWeight: 800, letterSpacing: -7, marginTop: 20 }}>EDEN.</div>
      <div style={{ color: "#a7f3d0", fontSize: 28, marginTop: 18 }}>Rare plants curated through an immersive living forest.</div>
    </div>,
    size,
  );
}
