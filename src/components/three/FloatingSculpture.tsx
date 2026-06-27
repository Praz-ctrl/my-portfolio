"use client";
import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function FloatingSculpture() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Dragging state tracking refs for inertial fling physics (global listeners)
  const isDragging = useRef(false);
  const previousPointer = useRef({ x: 0, y: 0 });
  const userRotation = useRef({ x: 0, y: 0 });
  const userVelocity = useRef({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Custom TorusKnot geometry
  const geometry = useMemo(() => {
    return new THREE.TorusKnotGeometry(1, 0.32, 250, 48, 3, 4);
  }, []);

  const colorGold = useMemo(() => new THREE.Color("#c9a96e"), []);
  const colorViolet = useMemo(() => new THREE.Color("#8b5cf6"), []);
  const colorSlate = useMemo(() => new THREE.Color("#121212"), []);

  // Global event listeners to allow dragging anywhere on screen without blocking button clicks
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't drag if clicking buttons, links, or inputs
      if (target.closest("a, button, input, textarea, [role='button']")) return;
      
      isDragging.current = true;
      previousPointer.current = { x: e.clientX, y: e.clientY };
      userVelocity.current = { x: 0, y: 0 };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousPointer.current.x;
      const deltaY = e.clientY - previousPointer.current.y;
      previousPointer.current = { x: e.clientX, y: e.clientY };

      userVelocity.current = {
        x: deltaY * 0.006,
        y: deltaX * 0.006,
      };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, [role='button']")) return;
      
      isDragging.current = true;
      const touch = e.touches[0];
      previousPointer.current = { x: touch.clientX, y: touch.clientY };
      userVelocity.current = { x: 0, y: 0 };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - previousPointer.current.x;
      const deltaY = touch.clientY - previousPointer.current.y;
      previousPointer.current = { x: touch.clientX, y: touch.clientY };

      userVelocity.current = {
        x: deltaY * 0.006,
        y: deltaX * 0.006,
      };
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    const t = state.clock.getElapsedTime();
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;

    // Detect if hover boundaries on R3F pointer coordinates (screen space)
    const distToCenter = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    setIsHovered(distToCenter < 0.6);

    if (isDragging.current) {
      meshRef.current.rotation.x += userVelocity.current.x;
      meshRef.current.rotation.y += userVelocity.current.y;
      
      userVelocity.current.x *= 0.92;
      userVelocity.current.y *= 0.92;
      
      userRotation.current.x = meshRef.current.rotation.x;
      userRotation.current.y = meshRef.current.rotation.y;
    } else {
      userRotation.current.x += userVelocity.current.x;
      userRotation.current.y += userVelocity.current.y;
      userVelocity.current.x *= 0.95;
      userVelocity.current.y *= 0.95;

      // Base auto-rotation/tilt coordinates (Centered behind page text)
      const autoRotX = (mouseY * 0.3) + (Math.sin(t * 0.1) * 0.15);
      const autoRotY = (mouseX * 0.3) + (t * 0.08);

      userRotation.current.x = THREE.MathUtils.lerp(userRotation.current.x, autoRotX, 0.02);
      userRotation.current.y = THREE.MathUtils.lerp(userRotation.current.y, autoRotY, 0.02);

      meshRef.current.rotation.x = userRotation.current.x;
      meshRef.current.rotation.y = userRotation.current.y;
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, Math.cos(t * 0.1) * 0.1, 0.05);
    }

    // Centered floating translation coordinates
    const targetPosY = Math.sin(t * 0.4) * 0.15 + (mouseY * 0.05);
    const targetPosX = Math.cos(t * 0.25) * 0.05 + (mouseX * 0.05);
    
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetPosY, 0.05);
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetPosX, 0.05);

    // Color shifting iridescent blend
    const colorMix = (Math.sin(t * 0.35) + 1) / 2;
    const tempColor = colorSlate.clone();
    
    if (colorMix < 0.5) {
      tempColor.lerp(colorGold, colorMix * 2 * 0.65);
    } else {
      tempColor.lerp(colorViolet, (colorMix - 0.5) * 2 * 0.65);
    }
    
    // Scale slightly when grabbed or hovered
    const targetScale = isDragging.current ? 1.25 : isHovered ? 1.15 : 1.05;
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.08)
    );

    // Dynamic material properties
    materialRef.current.color.lerp(tempColor, 0.05);
    materialRef.current.roughness = THREE.MathUtils.lerp(materialRef.current.roughness, isHovered ? 0.05 : 0.15, 0.05);
    materialRef.current.metalness = THREE.MathUtils.lerp(materialRef.current.metalness, isDragging.current ? 0.98 : 0.95, 0.05);
  });

  return (
    <mesh ref={meshRef} geometry={geometry} scale={1.05}>
      <meshStandardMaterial
        ref={materialRef}
        color="#121212"
        metalness={0.95}
        roughness={0.15}
        envMapIntensity={2.5}
      />
    </mesh>
  );
}
