"use client";

import { Clone, PointMaterial, Points, useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

type VectorTuple = [number, number, number];

const DRACO_PATH = "/draco/";
const FLOWERS: VectorTuple[] = [[-0.82, -2.35, 0.45], [0.72, -2.35, 0.7], [-1.36, -2.34, -0.45], [1.26, -2.35, -0.32]];
const GRASSES: VectorTuple[] = [[-1.8, -2.48, 0.5], [-1.2, -2.48, -1], [1.25, -2.48, -1.1], [1.8, -2.48, 0.7], [-2.3, -2.48, -0.4], [2.35, -2.48, -0.2]];
const ROCKS: VectorTuple[] = [[-1.9, -2.42, -0.8], [1.7, -2.42, 0.72], [0.85, -2.43, -1.45]];

function phase(progress: number, start: number, span = 0.2) {
  return Math.min(1, Math.max(0, (progress - start) / span));
}

export function HeroTree() {
  const progress = useStore((state) => state.scrollProgress);
  const seed = phase(progress, 0);
  const trunk = phase(progress, 0.12, 0.3);
  const roots = phase(progress, 0.22, 0.42);
  const vines = phase(progress, 0.42, 0.38);
  const bloom = phase(progress, 0.57, 0.22);
  const ecosystem = phase(progress, 0.76, 0.24);

  return (
    <group>
      <Terrain reveal={ecosystem} />
      <Pollen reveal={bloom} />
      <BotanicalModels trunk={trunk} roots={roots} vines={vines} bloom={bloom} ecosystem={ecosystem} />
      <mesh position={[0, -2.35 + seed * 0.12, 0]} scale={0.08 + seed * 0.35}>
        <sphereGeometry args={[0.32, 16, 12]} />
        <meshStandardMaterial color="#56372a" roughness={0.88} />
      </mesh>
      <pointLight position={[1, 3, 2]} color="#d1fae5" intensity={0.4 + bloom * 2} distance={12} />
      <spotLight position={[-5, 6, 5]} angle={0.32} penumbra={0.8} intensity={0.3 + ecosystem} color="#fef3c7" />
    </group>
  );
}

function BotanicalModels({ trunk, roots, vines, bloom, ecosystem }: { trunk: number; roots: number; vines: number; bloom: number; ecosystem: number }) {
  const tree = useGLTF("/models/tree.glb", DRACO_PATH);
  const rootBed = useGLTF("/models/roots.glb", DRACO_PATH);
  const vine = useGLTF("/models/vines.glb", DRACO_PATH);
  const flower = useGLTF("/models/flowers.glb", DRACO_PATH);
  const grass = useGLTF("/models/grass.glb", DRACO_PATH);
  const rock = useGLTF("/models/rocks.glb", DRACO_PATH);
  const treeScale = Math.max(0.001, trunk * 3.65);

  return (
    <group>
      <group position={[0, -2.42, 0]} scale={treeScale}>
        <Clone object={tree.scene} castShadow receiveShadow />
      </group>
      <group position={[0, -2.48, 0]} rotation={[0, 0.45, 0]} scale={Math.max(0.001, roots * 2.15)}>
        <Clone object={rootBed.scene} castShadow receiveShadow />
      </group>
      <group position={[0, -2.25, 0]} rotation={[0, 1.15, 0]} scale={Math.max(0.001, vines * 0.95)}>
        <Clone object={vine.scene} castShadow />
      </group>
      {FLOWERS.map((position, index) => (
        <group key={position.join(",")} position={position} rotation={[0, index * 1.4, 0]} scale={Math.max(0.001, bloom * 0.52)}>
          <Clone object={flower.scene} castShadow />
        </group>
      ))}
      {GRASSES.map((position, index) => (
        <group key={position.join(",")} position={position} rotation={[0, index * 1.16, 0]} scale={Math.max(0.001, ecosystem * 0.65)}>
          <Clone object={grass.scene} receiveShadow />
        </group>
      ))}
      {ROCKS.map((position, index) => (
        <group key={position.join(",")} position={position} rotation={[0, index * 1.8, 0]} scale={Math.max(0.001, ecosystem * 0.42)}>
          <Clone object={rock.scene} receiveShadow />
        </group>
      ))}
    </group>
  );
}

function Pollen({ reveal }: { reveal: number }) {
  const texture = useTexture("/particles/pollen.svg");
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(330);
    for (let index = 0; index < 110; index += 1) {
      values[index * 3] = Math.sin(index * 91.31) * 5;
      values[index * 3 + 1] = Math.sin(index * 31.77) * 4;
      values[index * 3 + 2] = Math.cos(index * 47.19) * 4;
    }
    return values;
  }, []);
  useFrame(({ clock }) => {
    if (pointsRef.current) pointsRef.current.rotation.y = clock.elapsedTime * 0.04;
  });
  return (
    <Points ref={pointsRef} positions={positions} scale={reveal}>
      <PointMaterial map={texture} transparent color="#fde68a" size={0.075} depthWrite={false} opacity={0.72} alphaTest={0.02} />
    </Points>
  );
}

function Terrain({ reveal }: { reveal: number }) {
  const grass = useRef<THREE.InstancedMesh>(null);
  const [colorMap, normalMap, roughnessMap] = useTexture(["/textures/soil-color.webp", "/textures/soil-normal.webp", "/textures/soil-roughness.webp"]);
  useLayoutEffect(() => {
    for (const texture of [colorMap, normalMap, roughnessMap]) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(3, 3);
    }
    colorMap.colorSpace = THREE.SRGBColorSpace;
  }, [colorMap, normalMap, roughnessMap]);
  useLayoutEffect(() => {
    if (!grass.current) return;
    const transform = new THREE.Object3D();
    for (let index = 0; index < 24; index += 1) {
      const angle = index * 2.399;
      const radius = 1.4 + (index % 6) * 0.3;
      transform.position.set(Math.cos(angle) * radius, -2.55, Math.sin(angle) * radius);
      transform.scale.set(1, 0.2 + reveal * (0.5 + (index % 4) * 0.12), 1);
      transform.updateMatrix();
      grass.current.setMatrixAt(index, transform.matrix);
    }
    grass.current.instanceMatrix.needsUpdate = true;
  }, [reveal]);
  return (
    <group>
      <mesh position={[0, -2.65, 0]} receiveShadow>
        <cylinderGeometry args={[4.5, 4.8, 0.3, 32]} />
        <meshStandardMaterial map={colorMap} normalMap={normalMap} roughnessMap={roughnessMap} color="#3a4a38" roughness={1} />
      </mesh>
      <instancedMesh ref={grass} args={[undefined, undefined, 24]}>
        <coneGeometry args={[0.045, 0.75, 4]} />
        <meshStandardMaterial color="#276749" />
      </instancedMesh>
    </group>
  );
}

useGLTF.preload("/models/tree.glb", DRACO_PATH);
useGLTF.preload("/models/roots.glb", DRACO_PATH);
useGLTF.preload("/models/vines.glb", DRACO_PATH);
useGLTF.preload("/models/flowers.glb", DRACO_PATH);
useGLTF.preload("/models/grass.glb", DRACO_PATH);
useGLTF.preload("/models/rocks.glb", DRACO_PATH);
