"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
import { Points, PointMaterial, shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

// Custom Wind Shader for Leaves/Flowers
const WindMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("#2E7D32"),
    uWindSpeed: 0.8,
    uWindStrength: 0.15,
    uGrowth: 1.0,
    uNoiseScale: 2.0,
  },
  // vertex shader
  `
  varying vec2 vUv;
  varying float vDistortion;
  uniform float uTime;
  uniform float uWindSpeed;
  uniform float uWindStrength;
  uniform float uGrowth;
  uniform float uNoiseScale;
  
  void main() {
    vUv = uv;
    vec3 pos = position * uGrowth;
    
    // Wave-based wind with noise simulation
    float distortion = sin(uTime * uWindSpeed + pos.y * uNoiseScale) * 
                      cos(uTime * uWindSpeed * 0.7 + pos.x * uNoiseScale) * 
                      uWindStrength;
    
    vDistortion = distortion;
    
    // Apply sway based on height
    float heightFactor = max(0.0, pos.y + 0.5);
    pos.x += distortion * heightFactor;
    pos.z += distortion * 0.5 * heightFactor;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  // fragment shader
  `
  varying vec2 vUv;
  varying float vDistortion;
  uniform vec3 uColor;
  
  void main() {
    vec3 color = uColor;
    // Subtle color variation based on distortion
    color += vDistortion * 0.1;
    gl_FragColor = vec4(color, 1.0);
  }
  `
);

extend({ WindMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      windMaterial: any;
    }
  }
}

const Leaf = ({ position, rotation, scale = 1, color = "#2E7D32", growthProgress = 1 }: any) => {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uTime = state.clock.getElapsedTime();
      meshRef.current.material.uGrowth = growthProgress;
    }
  });

  return (
    <mesh position={position} rotation={rotation} scale={scale * growthProgress}>
      <coneGeometry args={[0.08, 0.25, 3]} />
      {/* @ts-ignore */}
      <windMaterial uColor={new THREE.Color(color)} transparent />
    </mesh>
  );
};

const Flower = ({ position, color = "#FFC107", growthProgress = 0 }: any) => {
  const scale = Math.max(0, (growthProgress - 0.75) * 4); // Bloom even later
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[0.06, 12, 12]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.8} 
        roughness={0.2}
      />
    </mesh>
  );
};

const Root = ({ growthProgress }: { growthProgress: number }) => {
  const count = 5;
  const roots = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const points = [
        new THREE.Vector3(0, -2, 0),
        new THREE.Vector3(Math.cos(angle) * 0.5, -2.2, Math.sin(angle) * 0.5),
        new THREE.Vector3(Math.cos(angle) * 1.2, -2.5, Math.sin(angle) * 1.2),
        new THREE.Vector3(Math.cos(angle) * 2.0, -2.8, Math.sin(angle) * 2.0),
      ];
      return new THREE.CatmullRomCurve3(points);
    });
  }, []);

  return (
    <group>
      {roots.map((curve, i) => {
        const points = curve.getPoints(20);
        return (
          <group key={i}>
            {points.map((p, j) => {
              const pProgress = j / points.length;
              if (pProgress > growthProgress) return null;
              return (
                <mesh key={j} position={[p.x, p.y, p.z]} scale={0.05 * (1 - pProgress)}>
                  <sphereGeometry args={[1, 8, 8]} />
                  <meshStandardMaterial color="#3E2723" roughness={1} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
};

const Vine = ({ growthProgress }: { growthProgress: number }) => {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -2, 0),
      new THREE.Vector3(0.2, -1.2, 0.1),
      new THREE.Vector3(-0.1, -0.5, 0.2),
      new THREE.Vector3(0.15, 0.2, -0.1),
      new THREE.Vector3(-0.1, 1.0, 0.1),
      new THREE.Vector3(0, 1.8, 0),
    ]);
  }, []);

  const points = useMemo(() => curve.getPoints(80), [curve]);
  
  return (
    <group>
      {points.map((p, i) => {
        const pProgress = i / points.length;
        if (pProgress > growthProgress) return null;
        return (
          <mesh key={i} position={[p.x, p.y, p.z]} scale={0.015}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#4CAF50" roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
};

const ParticleField = ({ growthProgress }: { growthProgress: number }) => {
  const count = 400;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
      pointsRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.3;
      // Opacity fade in based on growth
      if (pointsRef.current.material instanceof THREE.PointsMaterial) {
        pointsRef.current.material.opacity = Math.max(0, (growthProgress - 0.6) * 2.5);
      }
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#FFF9C4"
        size={0.025}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export const HeroTree = () => {
  const groupRef = useRef<THREE.Group>(null);
  const scrollProgress = useStore((state) => state.scrollProgress);

  // 5-Phase Growth System
  // Phase 1: Seedling (0 - 0.2)
  const seedlingGrowth = Math.min(1, scrollProgress * 5);
  
  // Phase 2: Trunk Expansion (0.2 - 0.4)
  const trunkGrowth = Math.max(0, Math.min(1, (scrollProgress - 0.2) * 5));
  
  // Phase 3: Branch Spawning (0.4 - 0.6)
  const branchGrowth = Math.max(0, Math.min(1, (scrollProgress - 0.4) * 5));
  
  // Phase 4: Flower Blooming (0.6 - 0.8)
  const bloomGrowth = Math.max(0, Math.min(1, (scrollProgress - 0.6) * 5));
  
  // Phase 5: Full Ecosystem (0.8 - 1.0)
  const ecosystemGrowth = Math.max(0, Math.min(1, (scrollProgress - 0.8) * 5));

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(time * 0.15) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <ParticleField growthProgress={scrollProgress} />
      
      {/* Root System (Phase 5 focus) */}
      {ecosystemGrowth > 0 && <Root growthProgress={ecosystemGrowth} />}

      {/* Trunk (Phase 1 & 2) */}
      <mesh 
        position={[0, -2 + (seedlingGrowth * 0.5) + (trunkGrowth * 1.5), 0]} 
        scale={[
          1 + trunkGrowth * 0.5, 
          seedlingGrowth * 1 + trunkGrowth * 3, 
          1 + trunkGrowth * 0.5
        ]}
      >
        <cylinderGeometry args={[0.15, 0.25, 1, 12]} />
        <meshStandardMaterial color="#4E342E" roughness={0.9} />
      </mesh>

      {/* Primary Branches (Phase 3) */}
      {branchGrowth > 0 && (
        <group position={[0, -0.5 + trunkGrowth * 1.5, 0]}>
          <Branch level={1} growth={branchGrowth} rotation={[0, 0, Math.PI / 4]} bloomProgress={bloomGrowth} />
          <Branch level={1} growth={branchGrowth} rotation={[0, (Math.PI * 2) / 3, Math.PI / 4]} bloomProgress={bloomGrowth} />
          <Branch level={1} growth={branchGrowth} rotation={[0, (Math.PI * 4) / 3, Math.PI / 4]} bloomProgress={bloomGrowth} />
        </group>
      )}

      {/* Vines (Phase 4 & 5) */}
      <Vine growthProgress={Math.max(0, (scrollProgress - 0.5) * 2)} />

      {/* Dynamic Lighting based on growth */}
      <pointLight 
        position={[2, 2, 2]} 
        intensity={0.5 + bloomGrowth * 1.5} 
        color={bloomGrowth > 0.5 ? "#E1F5FE" : "#FFF9C4"} 
      />
      <spotLight 
        position={[-5, 5, 5]} 
        intensity={0.5 + ecosystemGrowth * 1} 
        angle={0.3} 
        penumbra={1} 
        castShadow 
      />
    </group>
  );
};

const Branch = ({ level, growth, rotation, bloomProgress }: any) => {
  const branchLength = 1.6 / level;
  const subBranchGrowth = Math.max(0, (growth - 0.4) * 1.6);
  const foliageGrowth = Math.max(0, (growth - 0.2) * 1.25);

  return (
    <group rotation={rotation}>
      <mesh position={[0, (branchLength * growth) / 2, 0]} scale={[1, growth, 1]}>
        <cylinderGeometry args={[0.04 / level, 0.08 / level, branchLength, 8]} />
        <meshStandardMaterial color="#4E342E" />
      </mesh>
      
      {growth > 0.3 && (
        <group position={[0, branchLength * growth, 0]}>
          {/* Foliage */}
          <Leaf position={[0.12, 0, 0]} rotation={[0, 0, 0.6]} growthProgress={foliageGrowth} />
          <Leaf position={[-0.12, 0.1, 0.05]} rotation={[0, 1.2, -0.6]} growthProgress={foliageGrowth} color="#2E7D32" />
          <Leaf position={[0, 0.15, -0.1]} rotation={[0.5, 0, 0]} growthProgress={foliageGrowth} color="#1B5E20" />
          
          {/* Flowers */}
          {bloomProgress > 0 && (
            <Flower position={[0, 0.1, 0]} growthProgress={bloomProgress} />
          )}
          
          {level < 3 && (
            <>
              <Branch level={level + 1} growth={subBranchGrowth} rotation={[0, 0.5, 0.7]} bloomProgress={bloomProgress} />
              <Branch level={level + 1} growth={subBranchGrowth} rotation={[0, -0.5, -0.7]} bloomProgress={bloomProgress} />
            </>
          )}
        </group>
      )}
    </group>
  );
};
