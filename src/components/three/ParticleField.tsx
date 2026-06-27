"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
}

export default function ParticleField({ count = 1200 }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Distribute particles in a 3D grid with random noise for organic feel
  const { positions, initialPositions, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const initialPositions = new Float32Array(count * 3);
    const offsets = new Float32Array(count); // Individual phase offsets for waves

    const gridRows = Math.floor(Math.sqrt(count));
    const spacing = 0.4;
    const startX = -(gridRows * spacing) / 2;
    const startZ = -(gridRows * spacing) / 2;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Arrange in grid coords
      const row = Math.floor(i / gridRows);
      const col = i % gridRows;
      
      const x = startX + col * spacing + (Math.random() - 0.5) * 0.15;
      const z = startZ + row * spacing + (Math.random() - 0.5) * 0.15;
      const y = (Math.random() - 0.5) * 1.5; // ambient thickness

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      initialPositions[i3] = x;
      initialPositions[i3 + 1] = y;
      initialPositions[i3 + 2] = z;

      offsets[i] = Math.random() * Math.PI * 2;
    }

    return { positions, initialPositions, offsets };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posArray = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const t = state.clock.getElapsedTime();
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const initX = initialPositions[i3];
      const initZ = initialPositions[i3 + 2];
      
      // Calculate distance from center to make concentric waves
      const dist = Math.sqrt(initX * initX + initZ * initZ);
      
      // Classic three.js waving landscape algorithm
      // Wave is determined by distance, elapsed time, and phase offsets
      const wave1 = Math.sin(dist * 1.2 - t * 1.8 + offsets[i]) * 0.35;
      const wave2 = Math.cos(initX * 0.8 + t * 1.1) * 0.15;
      
      // Mouse interaction: pull particles up/down or sway them based on cursor closeness
      const distToMouse = Math.sqrt(
        Math.pow(initX - mouseX * 5, 2) + Math.pow(initZ - mouseY * 5, 2)
      );
      const mouseInfluence = Math.max(0, 3.5 - distToMouse) * 0.12;

      // Update Y positions dynamically
      posArray[i3 + 1] = initialPositions[i3 + 1] + wave1 + wave2 + (mouseInfluence * Math.sin(t * 3));
      
      // Subtle sway on X and Z coordinates based on mouse
      posArray[i3] = initX + Math.sin(t * 0.5 + offsets[i]) * 0.05 + (mouseX * mouseInfluence * 0.2);
      posArray[i3 + 2] = initZ + Math.cos(t * 0.5 + offsets[i]) * 0.05 + (mouseY * mouseInfluence * 0.2);
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Slow rotational drift of the entire particle field
    pointsRef.current.rotation.y = t * 0.04;
    pointsRef.current.rotation.x = Math.sin(t * 0.03) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.024}
        color="#c9a96e"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
