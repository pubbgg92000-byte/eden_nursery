"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

const target = new THREE.Vector3();

export function CameraRig() {
  const progress = useStore((state) => state.scrollProgress);
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const angle = progress * Math.PI * 0.8 + Math.sin(time * 0.14) * 0.08;
    const radius = 4.5 + progress * 3;
    target.set(Math.sin(angle) * radius, -0.6 + progress * 3.4, Math.cos(angle) * radius);
    state.camera.position.lerp(target, 0.045);
    state.camera.lookAt(0, progress * 1.2 - 0.3, 0);
  });
  return null;
}
