"use client";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense } from "react";
import FloatingSculpture from "./FloatingSculpture";
import ParticleField from "./ParticleField";

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          color="#fafafa"
        />
        <pointLight position={[-3, 2, 4]} intensity={0.5} color="#c9a96e" />
        <pointLight position={[3, -2, -4]} intensity={0.3} color="#8b5cf6" />

        {/* Environment for reflections */}
        <Environment preset="city" />

        {/* 3D Elements */}
        <FloatingSculpture />
        <ParticleField count={600} />
      </Suspense>
    </Canvas>
  );
}
