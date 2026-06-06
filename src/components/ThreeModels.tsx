import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 1. Tomato Component
export function Tomato({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 1.5 + position[0]) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Tomato Core Body */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#ef4444" roughness={0.1} metalness={0.1} />
      </mesh>
      {/* Stem Leaf Green Top */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.02, 0.08, 0.12, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.5} />
      </mesh>
      {/* Splayed Leaves */}
      <group position={[0, 0.38, 0]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} rotation={[0.2, (i * Math.PI * 2) / 5, 0.4]}>
            <boxGeometry args={[0.04, 0.02, 0.25]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// 2. Egg Component
export function Egg({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 1.2 + position[2]) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={[scale * 0.35, scale * 0.48, scale * 0.35]} castShadow receiveShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#fef08a" roughness={0.3} metalness={0.0} />
    </mesh>
  );
}

// 3. Carrot Component
export function Carrot({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.getElapsedTime() * 0.4;
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 1.4 + position[0]) * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]} rotation={[0.2, 0, -0.6]}>
      {/* Carrot body (cone) */}
      <mesh castShadow receiveShadow>
        <coneGeometry args={[0.15, 0.8, 16]} />
        <meshStandardMaterial color="#f97316" roughness={0.4} />
      </mesh>
      {/* Leaf Top stems */}
      <group position={[0, 0.4, 0]}>
        <mesh rotation={[0.4, 0, -0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
        <mesh rotation={[0.3, 2, 0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>
      </group>
    </group>
  );
}

// 4. Bread Loaf Component
export function Bread({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      groupRef.current.position.y = position[1] + Math.cos(state.clock.getElapsedTime() * 1.0 + position[1]) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Bread Base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.35, 0.4]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>
      {/* Bread Domed Top */}
      <mesh position={[0, 0.175, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.5, 0.4, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#d97706" roughness={0.7} />
      </mesh>
    </group>
  );
}

// 5. Milk Carton
export function MilkCarton({ position = [0, 0, 0], scale = 1, isAlmond = false }: { position?: [number, number, number]; scale?: number; isAlmond?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 1.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Body carton */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.35, 0.6, 0.35]} />
        <meshStandardMaterial color={isAlmond ? "#854d0e" : "#e0f2fe"} roughness={0.3} />
      </mesh>
      {/* Roof cap */}
      <mesh position={[0, 0.35, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.25, 0.18, 4]} />
        <meshStandardMaterial color={isAlmond ? "#ca8a04" : "#38bdf8"} />
      </mesh>
    </group>
  );
}

// 6. Tofu Cube
export function Tofu({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.45;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.32;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 1.3) * 0.12;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={[scale, scale, scale]} castShadow>
      <boxGeometry args={[0.42, 0.42, 0.42]} />
      <meshStandardMaterial color="#f5f5f4" roughness={0.9} roughnessMap={null} />
    </mesh>
  );
}

// 7. Quinoa Bowl
export function QuinoaBowl({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      groupRef.current.position.y = position[1] + Math.cos(state.clock.getElapsedTime() * 1.2) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Bowl */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.3, 0.25, 16, 1, true]} />
        <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner base for quinoa */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.4, 0.28, 0.1, 16]} />
        <meshStandardMaterial color="#d4af37" roughness={0.9} />
      </mesh>
      {/* Visual grain particles */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <mesh key={i} position={[Math.sin(i * 1.2) * 0.25, 0.05 + Math.cos(i) * 0.03, Math.cos(i * 1.2) * 0.25]} scale={[0.06, 0.04, 0.06]}>
          <sphereGeometry />
          <meshStandardMaterial color="#fef08a" />
        </mesh>
      ))}
    </group>
  );
}

// 8. Cooking Pot Utility
export function CookingPot({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 1.0) * 0.07;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Pot Core */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.58, 0.5, 24]} />
        <meshStandardMaterial color="#dc2626" roughness={0.1} metalness={0.8} />
      </mesh>
      {/* Rim Ring Cover */}
      <mesh position={[0, 0.26, 0]}>
        <torusGeometry args={[0.61, 0.03, 8, 32]} />
        <meshStandardMaterial color="#eab308" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Handle Left */}
      <mesh position={[-0.67, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.12, 0.03, 8, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.5} />
      </mesh>
      {/* Handle Right */}
      <mesh position={[0.67, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.12, 0.03, 8, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.5} />
      </mesh>
    </group>
  );
}

// 10. Generic Custom Item
export function GenericItem({ position = [0, 0, 0], scale = 1, color = "#a8a29e" }: { position?: [number, number, number]; scale?: number; color?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 1.5 + position[0]) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Box base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.45, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Label area */}
      <mesh position={[0, 0, 0.16]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
    </group>
  );
}
export function WireBasket({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Rotating slightly as requested
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.3;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 1.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Metal Rim top */}
      <mesh position={[0, 0.18, 0]}>
        <torusGeometry args={[0.65, 0.024, 8, 32]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Wire structures */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * Math.PI) / 4;
        return (
          <group key={i} rotation={[0, angle, 0]}>
            {/* U-Shaped grid ribs */}
            <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 1.25, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
          </group>
        );
      })}
      {/* Bottom plate */}
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.42, 0.4, 0.02, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, 0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.55, 0.02, 8, 32, Math.PI]} />
        <meshStandardMaterial color="#f97316" metalness={0.5} roughness={0.2} />
      </mesh>
    </group>
  );
}
