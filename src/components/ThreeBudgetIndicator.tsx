import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ThreeBudgetIndicatorProps {
  usedBudget: number;
  totalBudget: number;
}

export function ThreeBudgetIndicator({ usedBudget = 25, totalBudget = 50 }: ThreeBudgetIndicatorProps) {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  // Compute percentages
  const ratio = Math.min(Math.max(usedBudget / (totalBudget || 1), 0), 1.5);
  const isOver = usedBudget > totalBudget;

  // Determine indicator colors depending on bounds
  const indicatorColor = isOver
    ? "#ef4444" // Dangerous red
    : ratio > 0.8
    ? "#f97316" // Warning Orange
    : "#22c55e"; // Healthy Fresh Green

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate background ring slowly
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = time * 0.15;
      outerRingRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
    }

    // Pulse the filling ring
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -time * 0.3;
      const pulse = 1 + Math.sin(time * 2.5) * 0.05;
      innerRingRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />

      {/* 1. Background Total Budget Track */}
      <mesh ref={outerRingRef} position={[0, 0, 0]}>
        <torusGeometry args={[1.1, 0.08, 16, 100]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.4}
          metalness={0.5}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* 2. Glowing Interactive Used-Budget Ring Indicator */}
      <mesh ref={innerRingRef} position={[0, 0, 0]}>
        {/* Scale the theta length (arc) of the torus geometry to match budget usage percentage! */}
        <torusGeometry args={[1.1, 0.12, 16, 100, Math.min(ratio, 1) * Math.PI * 2]} />
        <meshStandardMaterial
          color={indicatorColor}
          roughness={0.15}
          metalness={0.8}
          emissive={indicatorColor}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* 3. Concentric internal status core */}
      <mesh position={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.85, 0.85, 0.05, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} transparent opacity={0.8} />
      </mesh>

      {/* 4. Little floating budget particles / bubbles */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <BudgetBubble key={i} index={i} color={indicatorColor} />
      ))}
    </group>
  );
}

// Float minor decorative particles inside the ring core
function BudgetBubble({ index, color }: { index: number; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = (index * 0.25) - 0.6;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Float upward repeatedly
      const yValue = initialY + ((time * 0.2 + index * 0.1) % 1.2);
      meshRef.current.position.y = yValue;
      meshRef.current.position.x = Math.sin(time * 1.5 + index) * 0.4;
      meshRef.current.scale.setScalar(0.04 + Math.sin(time + index) * 0.02);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, initialY, 0.1]}>
      <sphereGeometry />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
}
