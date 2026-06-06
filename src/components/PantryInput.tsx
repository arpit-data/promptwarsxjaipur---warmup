import { useState } from "react";
import { Plus, Trash, Sparkles, User, DollarSign, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

interface PantryInputProps {
  ingredients: string[];
  onAddIngredient: (name: string) => void;
  onRemoveIngredient: (name: string) => void;
  onToggleDefaultIngredient: (name: string) => void;
  budget: number;
  familySize: number;
  diet: string;
  setBudget: (val: number) => void;
  setFamilySize: (val: number) => void;
  setDiet: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const DEFAULT_INGREDIENTS = ["Tomato", "Egg", "Carrot", "Bread", "Milk"];

export function PantryInput({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onToggleDefaultIngredient,
  budget,
  familySize,
  diet,
  setBudget,
  setFamilySize,
  setDiet,
  onGenerate,
  isLoading,
}: PantryInputProps) {
  const [customInput, setCustomInput] = useState("");

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onAddIngredient(customInput.trim());
      setCustomInput("");
    }
  };

  const dietsList = ["Any", "Vegetarian", "Vegan", "Low Carb", "Gluten Free"];

  return (
    <div className="glass-panel rounded-[2rem] p-6 md:p-8 shadow-xl max-w-2xl mx-auto space-y-8" id="pantry-dashboard-input">
      {/* 1. Interactive 3D Pantry Shelf Synchronizer Checklist */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-[#2D2D2D] flex items-center gap-2">
          <span className="bg-gradient-to-tr from-[#FF7043] to-[#FFCA28] text-white px-2.5 py-1 rounded-xl text-xs font-bold shadow-md">01</span>
          Synchronized Shelf Checklist
        </h3>
        <p className="text-xs text-neutral-500">
          Toggle ingredients to witness them fly onto the 3D kitchen shelf in real-time.
        </p>

        {/* Defaults checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
          {DEFAULT_INGREDIENTS.map((name) => {
            const isPresent = ingredients.some(
              (i) => i.toLowerCase() === name.toLowerCase()
            );
            return (
              <motion.button
                key={name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggleDefaultIngredient(name)}
                className={`py-2 px-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  isPresent
                    ? "bg-[#66BB6A] text-white border-[#66BB6A] shadow-md shadow-green-500/10"
                    : "bg-white/60 text-neutral-700 border-neutral-200/80 hover:border-[#FF7043]/60 hover:bg-white"
                }`}
              >
                <span>{name}</span>
                {isPresent && <CheckCircle className="w-3.5 h-3.5 ml-1 flex-shrink-0 text-white" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 2. Custom Ingredient Entry */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">
          Add Custom Items
        </label>
        <form onSubmit={handleSubmitCustom} className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. Cheese, Spinach, Chicken breast..."
            className="flex-1 bg-white/70 border border-neutral-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF7043] placeholder-neutral-400 text-[#2D2D2D]"
          />
          <button
            type="submit"
            disabled={isLoading || !customInput.trim()}
            className="bg-[#FF7043] hover:bg-[#FF7043]/90 text-white rounded-2xl px-4 flex items-center gap-1.5 text-sm font-bold cursor-pointer disabled:opacity-50 shadow-md shadow-orange-500/10"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        {/* List of custom additions */}
        {ingredients.filter(
          (item) => !DEFAULT_INGREDIENTS.some((d) => d.toLowerCase() === item.toLowerCase())
        ).length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1.5" id="custom-item-bag">
            {ingredients
              .filter(
                (item) => !DEFAULT_INGREDIENTS.some((d) => d.toLowerCase() === item.toLowerCase())
              )
              .map((item) => (
                <div
                  key={item}
                  className="bg-white/50 text-neutral-700 text-xs px-2.5 py-1.5 rounded-xl border border-neutral-200/80 flex items-center gap-1.5"
                >
                  <span className="font-semibold">{item}</span>
                  <button
                    onClick={() => onRemoveIngredient(item)}
                    type="button"
                    className="text-neutral-400 hover:text-[#FF7043] ml-0.5 cursor-pointer"
                  >
                    <Trash className="w-3 h-3" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* 3. Parameter controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-neutral-200/600">
        {/* Family count */}
        <div className="space-y-2.5" id="input-family-size">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#FF7043]" /> Family Dinner size
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fontFamilySizeChange(-1)}
              type="button"
              disabled={familySize <= 1}
              className="w-10 h-10 border border-neutral-200 bg-white/60 hover:bg-white rounded-xl flex items-center justify-center font-bold text-neutral-700 disabled:opacity-40 cursor-pointer"
            >
              -
            </button>
            <span className="font-mono font-bold text-lg text-neutral-850 w-8 text-center">
              {familySize}
            </span>
            <button
              onClick={() => fontFamilySizeChange(1)}
              type="button"
              disabled={familySize >= 10}
              className="w-10 h-10 border border-neutral-200 bg-white/60 hover:bg-white rounded-xl flex items-center justify-center font-bold text-neutral-700 disabled:opacity-40 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Budget targets */}
        <div className="space-y-2.5" id="input-budget-target">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-[#66BB6A]" /> Daily Budget
          </label>
          <div className="space-y-1">
            <input
              type="range"
              min={100}
              max={2000}
              step={50}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-[#FF7043] cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono font-bold text-[#2D2D2D]">
              <span>₹100</span>
              <span className="text-[#FF7043] bg-[#FF7043]/10 border border-[#FF7043]/20 px-2 py-0.5 rounded-lg">
                ₹{budget} INR
              </span>
              <span>₹2000</span>
            </div>
          </div>
        </div>

        {/* Diet preferences */}
        <div className="space-y-2.5" id="input-diet">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">
            Diet preferences
          </label>
          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="w-full bg-white/60 border border-neutral-200 text-sm rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#FF7043] text-neutral-700 font-bold cursor-pointer"
          >
            {dietsList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Action generation triggers */}
      <div className="pt-4 border-t border-neutral-200/60">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGenerate}
          disabled={isLoading || ingredients.length === 0}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF7043] to-[#FFCA28] text-white font-extrabold tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-orange-500/15 cursor-pointer disabled:opacity-50"
          id="generate-meal-btn"
        >
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
          {isLoading ? "Synthesizing AI Gastronomy Plan..." : "Initiate 3D RAG AI Synthesis"}
        </motion.button>
      </div>
    </div>
  );

  function fontFamilySizeChange(amt: number) {
    setFamilySize(Math.min(Math.max(familySize + amt, 1), 10));
  }
}
