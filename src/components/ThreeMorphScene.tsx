import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Egg, Tofu, MilkCarton, QuinoaBowl, Carrot } from "./ThreeModels";

interface ThreeMorphSceneProps {
  ingredient: "egg" | "milk" | "rice" | "other";
  triggerMorph: boolean;
  onMorphCompleted?: () => void;
}

export function ThreeMorphScene({ ingredient, triggerMorph, onMorphCompleted }: ThreeMorphSceneProps) {
  const [transitionProgress, setTransitionProgress] = useState(0); // 0 to 1
  const particlesRef = useRef<THREE.Points>(null);
  const burstCount = 120;
  const particleSpeeds = useRef<THREE.Vector3[]>([]);
  const isMorphing = useRef(false);

  // Initialize randomized velocities for the particle sparks
  useEffect(() => {
    const velocities: THREE.Vector3[] = [];
    for (let i = 0; i < burstCount; i++) {
      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4
        )
      );
    }
    particleSpeeds.current = velocities;
  }, []);

  // Monitor morph triggers
  useEffect(() => {
    if (triggerMorph) {
      isMorphing.current = true;
      setTransitionProgress(0);
      
      // Reset particle burst positions
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < burstCount; i++) {
          positions[i * 3] = 0;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = 0;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  }, [triggerMorph]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // If morphing, advance progress and animate explosion particles
    if (isMorphing.current) {
      setTransitionProgress((prev) => {
        const next = prev + delta * 1.5; // Morph lasts ~0.7s
        if (next >= 1) {
          isMorphing.current = false;
          if (onMorphCompleted) onMorphCompleted();
          return 1;
        }
        return next;
      });

      // Spread the spark explosion particles outwards
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < burstCount; i++) {
          const vel = particleSpeeds.current[i];
          positions[i * 3] += vel.x * delta * 2;
          positions[i * 3 + 1] += vel.y * delta * 2;
          positions[i * 3 + 2] += vel.z * delta * 2;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    } else {
      // Idle light floating loop for the active item
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < burstCount; i++) {
          // Slow floating dust
          positions[i * 3] = Math.sin(time * 0.5 + i) * 1.2;
          positions[i * 3 + 1] = Math.cos(time * 0.4 + i) * 1.2;
          positions[i * 3 + 2] = Math.sin(time * 0.3 + i) * 1.2;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  // Calculate scales based on morph linear progress
  const firstScale = isMorphing.current ? 1 - transitionProgress : triggerMorph ? 0 : 1;
  const secondScale = isMorphing.current ? transitionProgress : triggerMorph ? 1 : 0;

  // Render original vs alternative models depending on chosen ingredient
  return (
    <group>
      <ambientLight intensity={1.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />

      {/* Morph Part 1: Source Material (Egg, Milk, Rice represented) */}
      <group>
        {ingredient === "egg" && firstScale > 0.01 && (
          <Egg position={[0, 0, 0]} scale={firstScale * 2.2} />
        )}
        {ingredient === "milk" && firstScale > 0.01 && (
          <MilkCarton position={[0, 0, 0]} scale={firstScale * 2.0} isAlmond={false} />
        )}
        {ingredient === "rice" && firstScale > 0.01 && (
          <Carrot position={[0, -0.2, 0]} scale={firstScale * 2.5} /> // Using beautiful carrot as rich substitution source 
        )}
      </group>

      {/* Morph Part 2: Target Substitute (Tofu, Almond Milk, Quinoa) */}
      <group>
        {ingredient === "egg" && secondScale > 0.01 && (
          <Tofu position={[0, 0, 0]} scale={secondScale * 2.2} />
        )}
        {ingredient === "milk" && secondScale > 0.01 && (
          <MilkCarton position={[0, 0, 0]} scale={secondScale * 2.0} isAlmond={true} />
        )}
        {ingredient === "rice" && secondScale > 0.01 && (
          <QuinoaBowl position={[0, -0.1, 0]} scale={secondScale * 2.2} />
        )}
      </group>

      {/* Visual Morph Exploding Sparkles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(burstCount * 3), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={isMorphing.current ? "#eab308" : "#22c55e"}
          size={0.16}
          transparent
          opacity={isMorphing.current ? 1.0 - transitionProgress * 0.8 : 0.4}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
