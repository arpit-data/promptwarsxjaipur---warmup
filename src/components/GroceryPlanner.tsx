import { useState, useEffect } from "react";
import { CheckSquare, Square, ShoppingBag, ShoppingCart, Info, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { MealPlan } from "../types";

interface GroceryPlannerProps {
  mealPlan: MealPlan | null;
  onItemChecked: () => void;
}

interface GroceryCheckItem {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
  costEstimate: number;
}

export function GroceryPlanner({ mealPlan, onItemChecked }: GroceryPlannerProps) {
  const [groceryItems, setGroceryItems] = useState<GroceryCheckItem[]>([]);

  // Calculate missing ingredients dynamically from active meal plans
  useEffect(() => {
    if (mealPlan) {
      const missingIngredients: { [key: string]: { qty: string; cost: number } } = {};
      
      const exploreMeal = (meal: any) => {
        if (!meal || !meal.ingredients) return;
        meal.ingredients.forEach((ing: any) => {
          if (!ing.inPantry) {
            missingIngredients[ing.name] = {
              qty: ing.quantity,
              // Estimate average costs for various ingredients dynamically
              cost: ing.name.toLowerCase().includes("milk") ? 2.5 :
                    ing.name.toLowerCase().includes("egg") ? 0.4 :
                    ing.name.toLowerCase().includes("tomato") ? 1.2 :
                    ing.name.toLowerCase().includes("carrot") ? 0.8 :
                    ing.name.toLowerCase().includes("quinoa") ? 3.0 : 1.5
            };
          }
        });
      };

      exploreMeal(mealPlan.breakfast);
      exploreMeal(mealPlan.lunch);
      exploreMeal(mealPlan.dinner);

      const mapped: GroceryCheckItem[] = Object.entries(missingIngredients).map(([name, detail], idx) => ({
        id: `shop-${idx}`,
        name,
        quantity: detail.qty,
        checked: false,
        costEstimate: detail.cost,
      }));

      setGroceryItems(mapped);
    } else {
      // Fallback demo items
      setGroceryItems([
        { id: "dem-0", name: "Fresh Tomatoes", quantity: "4 medium", checked: false, costEstimate: 1.8 },
        { id: "dem-1", name: "Heavy Cream", quantity: "1 cup", checked: false, costEstimate: 2.2 },
        { id: "dem-2", name: "Rigatoni Pasta", quantity: "16 oz", checked: false, costEstimate: 1.5 },
        { id: "dem-3", name: "Almond milk carton", quantity: "1 Liter", checked: false, costEstimate: 2.5 },
      ]);
    }
  }, [mealPlan]);

  const handleToggleCheck = (id: string) => {
    const targetItem = groceryItems.find((item) => item.id === id);
    if (!targetItem) return;

    const nextChecked = !targetItem.checked;

    setGroceryItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, checked: nextChecked };
        }
        return item;
      })
    );

    if (nextChecked) {
      // Signal a drop to the 3D basket!
      onItemChecked();
    }
  };

  const totalCost = groceryItems.reduce((acc, item) => acc + (item.checked ? 0 : item.costEstimate), 0);
  const itemsCheckedCount = groceryItems.filter((i) => i.checked).length;

  return (
    <div className="glass-panel rounded-[2rem] p-6 md:p-8 shadow-xl max-w-2xl mx-auto space-y-6" id="grocery-planner-dashboard">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-[#2D2D2D] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#FF7043]" /> Dynamic Basket Dropper
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Check off acquisitions first to simulate gravity falls into the 3D wire basket.
          </p>
        </div>
        
        <div className="bg-[#FF7043]/10 text-[#FF7043] px-3 py-1.5 rounded-2xl border border-[#FF7043]/20 font-mono text-xs font-black">
          {itemsCheckedCount} / {groceryItems.length} Dropped
        </div>
      </div>

      {groceryItems.length === 0 ? (
        <div className="text-center py-8 text-neutral-400 space-y-3">
          <ShoppingCart className="w-10 h-10 mx-auto text-neutral-300" />
          <p className="text-xs font-semibold">Your pantry matches recipe requests perfectly!</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1" id="grocery-checklist-conveyor">
          {groceryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleCheck(item.id)}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                item.checked
                  ? "bg-[#66BB6A]/10 border-[#66BB6A]/20 text-neutral-400 line-through"
                  : "bg-white/60 hover:bg-white border-neutral-100 text-neutral-700 shadow-xs"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.checked ? (
                  <CheckSquare className="w-5 h-5 text-[#66BB6A]" />
                ) : (
                  <Square className="w-5 h-5 text-neutral-300 hover:text-[#FF7043]" />
                )}
                <div>
                  <span className="text-sm font-bold block leading-tight">{item.name}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">{item.quantity}</span>
                </div>
              </div>
              
              <div className="font-mono text-xs font-bold text-neutral-500">
                +₹{item.costEstimate.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* cost analysis footer summary */}
      <div className="bg-white/40 rounded-2xl p-4 border border-white/60 grid grid-cols-2 gap-4 items-center" id="grocery-total-summary">
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-widest">Remaining Shopping Cost</span>
          <span className="font-mono text-lg font-black text-[#2D2D2D] flex items-center">
            ₹{totalCost.toFixed(2)} <span className="text-xs text-neutral-400 ml-1 font-sans">INR</span>
          </span>
        </div>
        
        <div className="flex gap-2 bg-white/60 p-2.5 text-neutral-500 rounded-xl border border-neutral-100 items-start">
          <Info className="w-4 h-4 text-[#FF7043] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-tight">
            Saving opportunities computed via pantry reuse have reduced your overall shopping load significantly.
          </p>
        </div>
      </div>
    </div>
  );
}
