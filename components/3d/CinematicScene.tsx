"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { WebGLFallback } from "./WebGLFallback";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <WebGLFallback />,
});

export function CinematicScene() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  if (reducedMotion) return <WebGLFallback />;
  return <Scene />;
}
