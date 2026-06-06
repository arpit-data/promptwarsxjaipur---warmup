import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WireBasket } from "./ThreeModels";

interface FallingItem {
  id: number;
  color: string;
  xOffset: number;
  zOffset: number;
  yPos: number;
  speed: number;
}

export function ThreeGroceryBasket({ itemsTrigger = 0 }) {
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const itemsCounter = useRef(0);

  // Trigger drops on item updates
  useEffect(() => {
    if (itemsTrigger > 0) {
      const colors = ["#f97316", "#22c55e", "#fef08a", "#60a5fa", "#ec4899"];
      const newItems: FallingItem[] = Array.from({ length: 3 }).map(() => {
        itemsCounter.current += 1;
        return {
          id: itemsCounter.current,
          color: colors[Math.floor(Math.random() * colors.length)],
          xOffset: (Math.random() - 0.5) * 0.7,
          zOffset: (Math.random() - 0.5) * 0.7,
          yPos: 3.5 + Math.random() * 0.5, // Start high
          speed: 4.5 + Math.random() * 2,
        };
      });

      setFallingItems((prev) => [...prev, ...newItems].slice(-15)); // Keep max 15 to perform fast
    }
  }, [itemsTrigger]);

  useFrame((state, delta) => {
    setFallingItems((prev) =>
      prev.map((item) => {
        // Fall down until hitting base of basket (y = -0.15)
        const nextY = item.yPos - delta * item.speed;
        const basketBottomY = -0.12;
        if (nextY <= basketBottomY) {
          return {
            ...item,
            yPos: basketBottomY, // splash rest point
            speed: 0, // stop falling
          };
        }
        return {
          ...item,
          yPos: nextY,
        };
      })
    );
  });

  return (
    <group>
      <ambientLight intensity={1.3} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} />

      {/* Central 3D Basket model (will slow spin automatically) */}
      <WireBasket position={[0, -0.6, 0]} scale={2.4} />

      {/* Falling volumetric ingredients falling into basket */}
      {fallingItems.map((item) => (
        <mesh
          key={item.id}
          position={[item.xOffset, item.yPos - 0.6, item.zOffset]}
        >
          {item.id % 2 === 0 ? (
            <sphereGeometry args={[0.07, 16, 16]} />
          ) : (
            <boxGeometry args={[0.1, 0.1, 0.1]} />
          )}
          <meshStandardMaterial
            color={item.color}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}
