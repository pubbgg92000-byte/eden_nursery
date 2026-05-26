"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
import gsap from "gsap";

export const CameraRig = () => {
  const { camera } = useThree();
  const scrollProgress = useStore((state) => state.scrollProgress);
  const lastProgress = useRef(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Smooth camera movement based on scroll - 5 Phase Cinematic Path
    if (scrollProgress < 0.2) {
      // Phase 1: Seedling (0.0 - 0.2) - Low angle, looking up
      const t = scrollProgress / 0.2;
      const targetPos = new THREE.Vector3(
        Math.sin(time * 0.1) * 2,
        -1 + t * 0.5,
        4 - t * 1
      );
      camera.position.lerp(targetPos, 0.05);
      camera.lookAt(0, -1, 0);
    } 
    else if (scrollProgress < 0.4) {
      // Phase 2: Trunk Expansion (0.2 - 0.4) - Rising with the trunk
      const t = (scrollProgress - 0.2) / 0.2;
      const targetPos = new THREE.Vector3(
        2 + Math.cos(time * 0.2) * 0.5,
        0.5,
        5
      );
      camera.position.lerp(targetPos, 0.05);
      camera.lookAt(0, 0, 0);
    }
    else if (scrollProgress < 0.6) {
      // Phase 3: Branching (0.4 - 0.6) - Orbiting wide
      const t = (scrollProgress - 0.4) / 0.2;
      const radius = 6;
      const angle = time * 0.1 + t * Math.PI * 0.2;
      const targetPos = new THREE.Vector3(
        Math.sin(angle) * radius,
        1,
        Math.cos(angle) * radius
      );
      camera.position.lerp(targetPos, 0.05);
      camera.lookAt(0, 0.5, 0);
    }
    else if (scrollProgress < 0.8) {
      // Phase 4: Bloom (0.6 - 0.8) - Macro detail on flowers
      const t = (scrollProgress - 0.6) / 0.2;
      const targetPos = new THREE.Vector3(1.5, 1.2, 2.5);
      camera.position.lerp(targetPos, 0.05);
      camera.lookAt(0, 1.2, 0);
    }
    else {
      // Phase 5: Ecosystem (0.8 - 1.0) - Hero wide reveal
      const t = (scrollProgress - 0.8) / 0.2;
      const targetPos = new THREE.Vector3(
        Math.sin(time * 0.05) * 2,
        2,
        8 + t * 2
      );
      camera.position.lerp(targetPos, 0.05);
      camera.lookAt(0, 0.5, 0);
    }

    // Parallax effect based on mouse (subtle)
    // We can add mouse position to the store if needed, but for now just idle
    camera.position.x += Math.sin(time * 0.5) * 0.01;
    camera.position.y += Math.cos(time * 0.5) * 0.01;
    
    lastProgress.current = scrollProgress;
  });

  return null;
};
