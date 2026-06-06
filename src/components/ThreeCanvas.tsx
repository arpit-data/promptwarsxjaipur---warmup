import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Tomato, Egg, Carrot, Bread, CookingPot } from "./ThreeModels";
import { ThreePantryShelf } from "./ThreePantryShelf";
import { ThreeRAGNetwork } from "./ThreeRAGNetwork";
import { ThreeGroceryBasket } from "./ThreeGroceryBasket";
import { ThreeBudgetIndicator } from "./ThreeBudgetIndicator";
import { ThreeMorphScene } from "./ThreeMorphScene";

interface ThreeCanvasProps {
  activeSection: number;
  activePantryItems?: string[];
  activeRAGStep?: number;
  usedBudget?: number;
  totalBudget?: number;
  groceryDropsTrigger?: number;
  morphIngredient?: "egg" | "milk" | "rice" | "other";
  triggerMorph?: boolean;
  onMorphCompleted?: () => void;
}

export function ThreeCanvas({
  activeSection = 0,
  activePantryItems = [],
  activeRAGStep = 0,
  usedBudget = 32,
  totalBudget = 50,
  groceryDropsTrigger = 0,
  morphIngredient = "egg",
  triggerMorph = false,
  onMorphCompleted,
}: ThreeCanvasProps) {
  return (
    <div className="w-full h-full relative" id="canvas-container">
      <Canvas
        shadows
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Section 0: Hero Floating Ingredient Scene */}
          {activeSection === 0 && (
            <group>
              <ambientLight intensity={1.5} />
              <pointLight position={[5, 10, 5]} intensity={1.8} castShadow />
              <Tomato position={[-1.4, 0.8, 0]} scale={1.3} />
              <Egg position={[1.4, 1.0, -0.5]} scale={1.5} />
              <Carrot position={[-0.8, -1.0, 0.5]} scale={1.4} />
              <Bread position={[1.2, -0.8, 0.2]} scale={1.3} />
              <CookingPot position={[0, -0.1, -0.2]} scale={1.6} />
            </group>
          )}

          {/* Section 1: Pantry Shelf Assembling Scene */}
          {activeSection === 1 && (
            <group position={[0, -0.4, 0]} scale={0.9}>
              <ThreePantryShelf activePantryItems={activePantryItems} />
            </group>
          )}

          {/* Section 2: AI Processing & Neural Network Scene */}
          {activeSection === 2 && (
            <group scale={1.05}>
              <ThreeRAGNetwork activeStep={activeRAGStep} />
            </group>
          )}

          {/* Section 3: Meal Recommendations View (Pulsating Cooking Pot backdrop) */}
          {activeSection === 3 && (
            <group scale={1.2}>
              <ambientLight intensity={1.4} />
              <pointLight position={[5, 5, 5]} intensity={1.8} />
              <CookingPot position={[0, 0, 0]} scale={1.8} />
            </group>
          )}

          {/* Section 4: Grocery Wire Basket Drp Simulation */}
          {activeSection === 4 && (
            <group position={[0, -0.1, 0]}>
              <ThreeGroceryBasket itemsTrigger={groceryDropsTrigger} />
            </group>
          )}

          {/* Section 5: Budget Dashboard Ring Indicator */}
          {activeSection === 5 && (
            <group scale={1.1}>
              <ThreeBudgetIndicator usedBudget={usedBudget} totalBudget={totalBudget} />
            </group>
          )}

          {/* Section 6: Ingredient Transformation morphing lab */}
          {activeSection === 6 && (
            <group scale={1.0}>
              <ThreeMorphScene
                ingredient={morphIngredient}
                triggerMorph={triggerMorph}
                onMorphCompleted={onMorphCompleted}
              />
            </group>
          )}

          {/* Section 7: Conversational Avatar pulsing loop */}
          {activeSection === 7 && (
            <group>
              <ambientLight intensity={1.4} />
              <pointLight position={[0, 10, 0]} intensity={2} />
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.9, 32, 32]} />
                <meshStandardMaterial
                  color="#ea580c"
                  roughness={0.2}
                  metalness={0.8}
                  emissive="#ea580c"
                  emissiveIntensity={0.6}
                />
              </mesh>
              {/* Outer halo */}
              <mesh position={[0, 0, 0]}>
                <torusGeometry args={[1.2, 0.05, 16, 100]} />
                <meshBasicMaterial color="#eab308" transparent opacity={0.6} />
              </mesh>
            </group>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
