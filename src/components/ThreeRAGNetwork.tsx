import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NodeData {
  id: number;
  label: string;
  position: [number, number, number];
  color: string;
}

const NODES: NodeData[] = [
  { id: 1, label: "User Input", position: [-3, 1.5, 0], color: "#ea580c" }, // Warm Orange
  { id: 2, label: "Vector Search", position: [-1.2, 0.5, 1], color: "#eab308" }, // Golden
  { id: 3, label: "Knowledge Source", position: [0.6, -0.5, 0], color: "#16a34a" }, // Fresh Green
  { id: 4, label: "Gemini 3.5 AI", position: [2.5, 1.0, -1], color: "#3b82f6" }, // Tech Blue
];

export function ThreeRAGNetwork({ activeStep = 0 }) {
  const particlesRef = useRef<THREE.Points>(null);
  const nodeRefs = useRef<{ [key: number]: THREE.Mesh | null }>({});

  // Generate particles along connection paths
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Pulse nodes
    NODES.forEach((node) => {
      const mesh = nodeRefs.current[node.id];
      if (mesh) {
        const pulse = 1 + Math.sin(time * 3 + node.id) * 0.08;
        mesh.scale.set(pulse, pulse, pulse);
        
        // Highlight active step
        if (activeStep + 1 === node.id) {
          const glow = 1.2 + Math.sin(time * 6) * 0.15;
          mesh.scale.set(glow, glow, glow);
        }
      }
    });

    // Move RAG particle streams
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        // Path calculations from node to node based on particle index
        const step = i % 3; // 0: N1->N2, 1: N2->N3, 2: N3->N4
        const speed = 0.5 + (i * 0.1) % 0.3;
        const progress = ((time * speed) + (i / count)) % 1;

        let startPos = NODES[step].position;
        let endPos = NODES[step + 1].position;

        // Linear interpolation
        positions[i * 3] = startPos[0] + (endPos[0] - startPos[0]) * progress + Math.sin(time * 2 + i) * 0.05;
        positions[i * 3 + 1] = startPos[1] + (endPos[1] - startPos[1]) * progress + Math.cos(time * 2 + i) * 0.05;
        positions[i * 3 + 2] = startPos[2] + (endPos[2] - startPos[2]) * progress;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Flat array of vectors for line visuals
  const points: THREE.Vector3[] = [];
  NODES.forEach((node, i) => {
    if (i < NODES.length - 1) {
      points.push(new THREE.Vector3(...node.position));
      points.push(new THREE.Vector3(...NODES[i + 1].position));
    }
  });

  return (
    <group>
      {/* Ambient glowing atmosphere */}
      <ambientLight intensity={1.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />

      {/* Connection Rails */}
      {NODES.map((node, index) => {
        if (index === NODES.length - 1) return null;
        const nextNode = NODES[index + 1];
        return (
          <group key={`link-${index}`}>
            <mesh>
              <lineLoop>
                <bufferGeometry attach="geometry" onUpdate={(geom) => geom.setFromPoints([
                  new THREE.Vector3(...node.position),
                  new THREE.Vector3(...nextNode.position)
                ])} />
                <lineBasicMaterial attach="material" color="#cbd5e1" linewidth={2} transparent opacity={0.3} />
              </lineLoop>
            </mesh>
          </group>
        );
      })}

      {/* Nodes */}
      {NODES.map((node) => {
        const isActive = activeStep + 1 === node.id || (activeStep === 4 && node.id === 4);
        return (
          <group key={node.id} position={node.position}>
            {/* Outline highlight ring */}
            {isActive && (
              <mesh>
                <ringGeometry args={[0.3, 0.38, 16]} />
                <meshBasicMaterial color={node.color} side={THREE.DoubleSide} transparent opacity={0.5} />
              </mesh>
            )}
            
            {/* Outer Sphere Core */}
            <mesh
              ref={(ref) => { nodeRefs.current[node.id] = ref; }}
              castShadow
            >
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={isActive ? 1.5 : 0.4}
                roughness={0.1}
              />
            </mesh>

            {/* Minor glow rings */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.28, 0.015, 8, 24]} />
              <meshBasicMaterial color={node.color} transparent opacity={0.25} />
            </mesh>
          </group>
        );
      })}

      {/* Streaming Particles along the conveyor paths */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(90 * 3), 3]} // 90 particles
          />
        </bufferGeometry>
        <pointsMaterial
          color="#38bdf8"
          size={0.15}
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
