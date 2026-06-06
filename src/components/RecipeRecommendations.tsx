import { useState } from "react";
import { motion } from "motion/react";
import { Clock, PieChart, Sparkles, ArrowRight } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { MealPlan, Meal } from "../types";

interface RecipeRecommendationsProps {
  mealPlan: MealPlan | null;
  onSelectMealForGrocery: (meal: Meal) => void;
  onExploreDetailedRecipe?: (meal: Meal) => void;
  onAdvanceToGrocery: () => void;
}

export function RecipeRecommendations({
  mealPlan,
  onSelectMealForGrocery,
  onAdvanceToGrocery,
}: RecipeRecommendationsProps) {
  const [activeTab, setActiveTab] = useState<"breakfast" | "lunch" | "dinner">("breakfast");

  if (!mealPlan) {
    return (
      <div className="glass-panel rounded-3xl p-8 shadow-xl max-w-xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 bg-[#FF7043]/10 rounded-2xl flex items-center justify-center mx-auto border border-[#FF7043]/20">
          <Sparkles className="w-8 h-8 text-[#FF7043] animate-pulse" />
        </div>
        <h4 className="text-xl font-bold text-neutral-800">No active meal plan synthesized yet</h4>
        <p className="text-sm text-neutral-500">
          Scroll up to Section 2, load your cupboard ingredients, and ignite the Gemini RAG synthesis framework!
        </p>
      </div>
    );
  }

  const activeMeal: Meal = mealPlan[activeTab];

  const parseNutrient = (val: string): number => {
    if (!val) return 0;
    const num = parseFloat(val.replace(/[^\d.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const chartData = [
    {
      subject: `Protein (${activeMeal.nutrition.protein})`,
      value: parseNutrient(activeMeal.nutrition.protein),
    },
    {
      subject: `Carbs (${activeMeal.nutrition.carbs})`,
      value: parseNutrient(activeMeal.nutrition.carbs),
    },
    {
      subject: `Fat (${activeMeal.nutrition.fat})`,
      value: parseNutrient(activeMeal.nutrition.fat),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8" id="recipe-recommendations-dashboard">
      {/* 1. Header Banner & Confidence Scores */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-md p-5 rounded-[2rem] border border-white/60 shadow-sm leading-tight">
        <div>
          <h3 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
            Chef Gemini's Gastronomy Design
          </h3>
          <p className="text-xs text-neutral-500 mt-1">{mealPlan.explanation}</p>
        </div>
        
        {/* Confidence Percentage Gauge */}
        <div className="flex items-center gap-3 bg-[#FF7043]/10 border border-[#FF7043]/20 px-4 py-2.5 rounded-2xl flex-shrink-0" id="confidence-percentage">
          <div className="text-right">
            <span className="text-[10px] font-bold text-[#FF7043] uppercase tracking-widest block">AI Confidence Score</span>
            <span className="font-mono text-lg font-black text-[#FF7043]">{mealPlan.confidenceScore || 96}%</span>
          </div>
          <div className="w-10 h-10 rounded-full border-4 border-orange-100 border-t-[#FF7043] flex items-center justify-center animate-spin" style={{ animationDuration: '3s' }} />
        </div>
      </div>

      {/* 2. Selection Tabs */}
      <div className="flex justify-center gap-2.5" id="meal-type-selector-tabs">
        {(["breakfast", "lunch", "dinner"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2.5 px-6 rounded-2xl font-bold text-sm tracking-widest transition-all uppercase cursor-pointer ${
              activeTab === tab
                ? "bg-gradient-to-r from-[#FF7043] to-[#FFCA28] text-white shadow-md shadow-[#FF7043]/20 scale-105"
                : "bg-white/60 hover:bg-white text-neutral-600 border border-neutral-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Floating 3D Recipe Card Overlay Mockup */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* 3D rotated recipe summary card */}
        <motion.div
          whileHover={{ rotateY: 3, rotateX: -3, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          style={{ perspective: 1000 }}
          className="md:col-span-7 bg-white/65 backdrop-blur-md rounded-[2rem] border border-white/80 shadow-xl p-6 md:p-8 space-y-6 relative overflow-hidden"
          id="visual-3d-recipe-card"
        >
          {/* Subtle glowing halo backdrop */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FFCA28]/10 rounded-full blur-3xl opacity-70" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#FF7043] uppercase tracking-wider bg-[#FF7043]/10 px-3 py-1 rounded-full border border-[#FF7043]/20" id="recipe-card-badge">
              {activeTab} Selection
            </span>
            <div className="flex justify-end gap-2 text-neutral-500 text-xs font-mono font-bold" id="recipe-card-limits">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" /> {activeMeal.prepTime} Mins
              </span>
              <span className="flex items-center gap-0.5 ml-1 text-[#66BB6A]">
                <span className="font-sans">₹</span> {activeMeal.costEstimate.toFixed(2)} INR
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-2xl font-black text-neutral-800 tracking-tight leading-tight">
              {activeMeal.name}
            </h4>
            <p className="text-sm text-neutral-500 leading-relaxed">
              {activeMeal.description}
            </p>
          </div>

          {/* Quick Nutrition Panel */}
          <div className="grid grid-cols-4 gap-2 py-3 bg-white/40 rounded-2xl border border-white/60 text-center" id="recipe-nutrition-dashboard">
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase font-bold">Calories</span>
              <span className="text-sm font-mono font-bold text-neutral-700">{activeMeal.nutrition.calories}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase font-bold">Protein</span>
              <span className="text-sm font-mono font-bold text-neutral-700">{activeMeal.nutrition.protein}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase font-bold">Carbs</span>
              <span className="text-sm font-mono font-bold text-neutral-700">{activeMeal.nutrition.carbs}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase font-bold">Fat</span>
              <span className="text-sm font-mono font-bold text-neutral-700">{activeMeal.nutrition.fat}</span>
            </div>
          </div>

          {/* Recharts Radar Chart for Macronutrients */}
          <div className="bg-white/35 rounded-2xl border border-white/50 p-4 space-y-2 shadow-xs" id="macronutrient-radar-card">
            <span className="text-[10px] font-black text-[#FF7043] tracking-widest uppercase block text-center">
              Macronutrient Target Distribution
            </span>
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                  <PolarGrid stroke="#e5e5e5" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#404040", fontSize: 10, fontWeight: "bold" }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 'auto']}
                    tick={{ fill: "#737373", fontSize: 8 }}
                  />
                  <Radar
                    name="Macronutrients"
                    dataKey="value"
                    stroke="#FF7043"
                    fill="#FF7043"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "12px",
                      border: "1px solid #e5e5e5",
                      fontSize: "11px",
                      fontFamily: "monospace"
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cooking directions */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-[#FF7043]" /> High-Level Blueprint
            </h5>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-neutral-600 pl-1 leading-normal">
              {activeMeal.steps.slice(0, 4).map((step, idx) => (
                <li key={idx} className="whitespace-pre-line">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </motion.div>

        {/* Side Ingredient matches context sheet */}
        <div className="md:col-span-5 bg-white/40 backdrop-blur-md rounded-[2rem] p-6 border border-white/60 space-y-5" id="recipe-ingredients-checklist">
          <div>
            <h5 className="text-sm font-bold text-neutral-800 uppercase tracking-widest">
              Required Elements
            </h5>
            <p className="text-xs text-neutral-400 mt-0.5">
              Identified and cross-referenced from pantry assets.
            </p>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1" id="meal-recipe-ingredients-list">
            {activeMeal.ingredients.map((ing, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-2 px-3 bg-white/60 rounded-xl border border-neutral-100 shadow-xs"
              >
                <span className="text-neutral-700 font-semibold">{ing.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 font-mono text-[10px]">{ing.quantity}</span>
                  {ing.inPantry ? (
                    <span className="bg-[#66BB6A]/10 text-[#66BB6A] font-bold px-1.5 py-0.5 rounded text-[9px] border border-[#66BB6A]/20 uppercase">
                      Have
                    </span>
                  ) : (
                    <span className="bg-[#FF7043]/10 text-[#FF7043] font-bold px-1.5 py-0.5 rounded text-[9px] border border-[#FF7043]/20 uppercase">
                      Shop
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action to proceed with grocery drop */}
          <div className="pt-2">
            <button
              onClick={() => onSelectMealForGrocery(activeMeal)}
              className="w-full py-3 rounded-2xl border border-dashed border-neutral-200 hover:border-[#FF7043] bg-white/60 hover:bg-[#FF7043]/5 text-xs font-bold text-center text-neutral-600 hover:text-[#FF7043] transition-colors cursor-pointer"
            >
              📥 Push Ingredients to 3D Grocery Basket
            </button>
          </div>

          <button
            onClick={onAdvanceToGrocery}
            className="w-full py-3.5 px-4 bg-[#FF7043] hover:bg-[#FF7043]/90 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all font-black tracking-widest"
          >
            Analyze Grocery Basket <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Interactive Daily Cooking Timeline: Cooking schedule for the day */}
      <div className="bg-white/50 backdrop-blur-md p-6 rounded-[2rem] border border-white/60 shadow-sm space-y-5" id="daily-cooking-timeline">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
              <span className="p-1.5 bg-[#FF7043]/10 text-[#FF7043] rounded-xl"><Clock className="w-4 h-4" /></span>
              Daily Cooking Timeline & Schedule
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              Sequence mapped automatically for standard preparation step duration.
            </p>
          </div>
          <div className="bg-gradient-to-r from-[#FFCA28]/10 to-[#FF7043]/10 border border-[#FF7043]/20 px-3.5 py-1.5 rounded-xl text-center self-start">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block leading-none">Total Active Duty</span>
            <span className="font-mono text-xs font-black text-[#FF7043] mt-0.5 block">
              {mealPlan.breakfast.prepTime + mealPlan.lunch.prepTime + mealPlan.dinner.prepTime} Mins
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { tag: "breakfast", time: "08:30 AM", meal: mealPlan.breakfast, icon: "🍳", timeColor: "text-amber-500 bg-amber-500/10 border-amber-500/15" },
            { tag: "lunch", time: "01:00 PM", meal: mealPlan.lunch, icon: "🥗", timeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/15" },
            { tag: "dinner", time: "07:30 PM", meal: mealPlan.dinner, icon: "🍲", timeColor: "text-indigo-500 bg-indigo-500/10 border-indigo-500/15" }
          ].map(({ tag, time, meal, icon, timeColor }) => (
            <div key={tag} className="bg-white/60 border border-neutral-100 p-4.5 rounded-[1.5rem] shadow-xs space-y-3 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase font-mono">{time}</span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${timeColor}`}>
                    {tag}
                  </span>
                </div>
                <div>
                  <h5 className="text-sm font-black text-neutral-800 flex items-center gap-1.5 mt-1">
                    <span className="text-base">{icon}</span> {meal.name}
                  </h5>
                  <p className="text-[10px] text-neutral-400 tracking-wider uppercase font-bold mt-1">🕒 Prep duration: {meal.prepTime} mins</p>
                </div>
                <div className="border-t border-neutral-100/60 pt-2.5 text-xs text-neutral-500 leading-normal">
                  <strong className="text-[9px] uppercase font-bold text-neutral-400 block mb-1 tracking-widest">Core Directive:</strong>
                  <p className="line-clamp-3">{meal.steps[0] || "Assemble all components carefully."}</p>
                </div>
              </div>
              <div className="pt-2">
                <span className="text-[10px] font-bold text-neutral-400 block bg-neutral-100/50 py-1.5 px-2.5 rounded-lg text-center select-none">
                  ⚡ Ready to Cook
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
