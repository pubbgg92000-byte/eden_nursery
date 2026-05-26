"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Preload } from "@react-three/drei";
import { CameraRig } from "./CameraRig";
import { HeroTree } from "./HeroTree";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";
import { WebGLFallback } from "./WebGLFallback";
import { isWebGLAvailable } from "@/utils/webgl";

export default function Scene() {
  const [supported] = useState(() => isWebGLAvailable());
  if (!supported) return <WebGLFallback />;
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <WebGLErrorBoundary>
        <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, -1, 5], fov: 46 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
          <fog attach="fog" args={["#071c16", 4, 18]} />
          <Suspense fallback={null}>
            <ambientLight intensity={0.28} color="#d1fae5" />
            <directionalLight position={[6, 8, 4]} intensity={0.8} castShadow shadow-mapSize={[512, 512]} />
                <Environment files="/hdr/forest.hdr" environmentIntensity={0.34} />
            <CameraRig />
            <HeroTree />
            <Preload all />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
