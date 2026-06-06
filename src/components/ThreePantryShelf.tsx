import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Tomato, Egg, Carrot, Bread, MilkCarton, GenericItem } from "./ThreeModels";

interface PantryShelfProps {
  activePantryItems: string[];
}

export function ThreePantryShelf({ activePantryItems = [] }: PantryShelfProps) {
  const shelfRef = useRef<THREE.Group>(null);

  // Slow ambient rotation of physical shelves
  useFrame((state) => {
    if (shelfRef.current) {
      shelfRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.15;
    }
  });

  // Track coordinates for each item on shelves
  // Slot 1: Tomato, Slot 2: Egg, Slot 3: Carrot, Slot 4: Bread, Slot 5: Milk
  const itemSlots = [
    { name: "Tomato", component: <Tomato position={[-1.0, 0.45, 0.1]} scale={1.2} />, checkName: "tomato" },
    { name: "Egg", component: <Egg position={[-0.4, 0.45, 0.15]} scale={1.3} />, checkName: "egg" },
    { name: "Carrot", component: <Carrot position={[0.2, 0.38, 0.1]} scale={1.3} />, checkName: "carrot" },
    { name: "Bread", component: <Bread position={[0.8, 0.48, 0.1]} scale={1.3} />, checkName: "bread" },
    { name: "Milk", component: <MilkCarton position={[1.2, 0.52, 0.1]} scale={1.3} isAlmond={false} />, checkName: "milk" }
  ];

  const DEFAULT_NAMES = ["tomato", "egg", "carrot", "bread", "milk"];
  const customItems = activePantryItems.filter(
    (item) => !DEFAULT_NAMES.some((d) => item.toLowerCase().includes(d))
  );

  return (
    <group ref={shelfRef}>
      <ambientLight intensity={1.3} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />

      {/* 3D Shelving boards */}
      <group position={[0, 0, 0]}>
        {/* Top Board */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.12, 1.0]} />
          <meshStandardMaterial color="#854d0e" roughness={0.7} />
        </mesh>
        
        {/* Bottom Board */}
        <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.12, 1.0]} />
          <meshStandardMaterial color="#854d0e" roughness={0.7} />
        </mesh>
        
        {/* Support pillar left */}
        <mesh position={[-1.5, -0.25, -0.2]}>
          <cylinderGeometry args={[0.05, 0.05, 1.6, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>

        {/* Support pillar right */}
        <mesh position={[1.5, -0.25, -0.2]}>
          <cylinderGeometry args={[0.05, 0.05, 1.6, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
      </group>

      {/* Pantry shelf items. If not toggled, fly offscreen or fade. */}
      {itemSlots.map((slot, idx) => {
        const isPresent = activePantryItems.some((item) =>
          item.toLowerCase().includes(slot.checkName)
        );

        return (
          <group key={idx}>
            <InterpolatingSlot isPresent={isPresent} index={idx}>
              {slot.component}
            </InterpolatingSlot>
          </group>
        );
      })}

      {/* Custom items on the bottom board */}
      {customItems.map((item, idx) => {
        // Calculate position on the bottom shelf
        const x = -1.2 + (idx % 5) * 0.6;
        // Basic deterministic color based on string length
        const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];
        const color = colors[item.length % colors.length];

        return (
          <group key={`custom-${item}-${idx}`}>
            <InterpolatingSlot isPresent={true} index={5 + idx}>
              <GenericItem position={[x, -0.25, 0.1]} scale={0.7} color={color} />
            </InterpolatingSlot>
          </group>
        );
      })}
    </group>
  );
}

// Subordinate wrapper that interpolates positions smoothly in React Three Fiber
function InterpolatingSlot({ isPresent, index, children }: { isPresent: boolean; index: number; children: React.ReactNode }) {
  const containerRef = useRef<THREE.Group>(null);
  
  // Track target vs current positions
  const targetY = 0;
  const targetX = 0;
  const offscreenX = (index - 2) * 2; // Split left and right for flying in effect
  const offscreenY = -4; // Flies from offscreen bottom

  const currentX = useRef(isPresent ? targetX : offscreenX);
  const currentY = useRef(isPresent ? targetY : offscreenY);
  const currentScale = useRef(isPresent ? 1 : 0);

  useFrame((state, delta) => {
    if (containerRef.current) {
      // Linear interpolation (Lerp) towards active states
      const speed = 7.5; // fly in speed
      
      const destX = isPresent ? targetX : offscreenX;
      const destY = isPresent ? targetY : offscreenY;
      const destScale = isPresent ? 1 : 0;

      currentX.current += (destX - currentX.current) * speed * delta;
      currentY.current += (destY - currentY.current) * speed * delta;
      currentScale.current += (destScale - currentScale.current) * speed * delta;

      containerRef.current.position.x = currentX.current;
      containerRef.current.position.y = currentY.current;
      containerRef.current.scale.setScalar(currentScale.current);
    }
  });

  return <group ref={containerRef}>{children}</group>;
}
