"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { isWebGLAvailable } from "@/utils/webgl";
import { WebGLFallback } from "./WebGLFallback";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";
import { CameraRig } from "./CameraRig";

interface SceneProps {
  children?: React.ReactNode;
}

export const Scene = ({ children }: SceneProps) => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSupport = () => {
      setIsSupported(isWebGLAvailable());
    };
    checkSupport();
  }, []);

  // While checking, render a plain background to avoid flash
  if (isSupported === null) {
    return <div className="fixed top-0 left-0 w-full h-full -z-10 bg-stone-950" />;
  }

  if (!isSupported) {
    return <WebGLFallback />;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
      <WebGLErrorBoundary>
        <Canvas
          shadows
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <CameraRig />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            {children}
            <Preload all />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
};
