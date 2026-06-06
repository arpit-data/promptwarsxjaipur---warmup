import { useState } from "react";
import { Sparkles, FlaskConical, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Substitution } from "../types";

interface SubstitutionLabProps {
  onMorphTriggered: (ingredient: "egg" | "milk" | "rice" | "other") => void;
  isMorphing: boolean;
  activeMorphItem: "egg" | "milk" | "rice" | "other";
}

const SUBSTITUTION_DATA: { [key: string]: Substitution } = {
  egg: {
    original: "Whole Egg",
    alternative: "Firm Tofu",
    ratio: "1:1 by volume scrambled",
    reason: "Offers a high-protein, zero-cholesterol structural binding alternative perfect for baking or pan-sears.",
    nutritionImpact: "Zero cholesterol, lower saturated fats, rich plant-based isoflavones.",
  },
  milk: {
    original: "Cow Milk",
    alternative: "Almond Milk",
    ratio: "1:1 fluid match",
    reason: "A lightweight, creamy solution that matches liquidity profiles perfectly while adding a subtle nutty essence.",
    nutritionImpact: "65% fewer calories, lactose-free, cholesterol-free.",
  },
  rice: {
    original: "Red Carrot",
    alternative: "Quinoa Bowl",
    ratio: "1 cup cooked for 1 cup carrot shreds",
    reason: "Provides a complete protein profile containing all nine essential amino acids with an elegant golden nut texturing.",
    nutritionImpact: "Higher amino profile, higher fibers, complex slow-release carbohydrates.",
  },
};

export function SubstitutionLab({ onMorphTriggered, isMorphing, activeMorphItem }: SubstitutionLabProps) {
  const [selectedSub, setSelectedSub] = useState<"egg" | "milk" | "rice">("egg");

  const activeSub = SUBSTITUTION_DATA[selectedSub];

  return (
    <div className="glass-panel rounded-[2rem] p-6 md:p-8 shadow-xl max-w-2xl mx-auto space-y-6" id="substitution-lab-dashboard">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-[#2D2D2D] flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-[#FF7043] animate-bounce" /> Molecular Substitution Lab
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Select an ingredient and engage the particle morph processor to synthesize substitutes.
          </p>
        </div>
      </div>

      {/* Selectors shelf */}
      <div className="grid grid-cols-3 gap-2.5" id="substitution-item-selectors">
        {(["egg", "milk", "rice"] as const).map((key) => (
          <button
            key={key}
            onClick={() => {
              if (!isMorphing) setSelectedSub(key);
            }}
            disabled={isMorphing}
            className={`py-3 px-2 rounded-2xl text-xs font-black capitalize transition-all cursor-pointer border ${
              selectedSub === key
                ? "bg-gradient-to-r from-[#FF7043] to-[#FFCA28] text-white border-none shadow-md shadow-orange-500/10"
                : "bg-white/60 hover:bg-white text-neutral-700 border-neutral-200"
            } disabled:opacity-50`}
          >
            {key === "rice" ? "Carrot → Quinoa" : key === "egg" ? "Egg → Tofu" : "Milk → Almond"}
          </button>
        ))}
      </div>

      {/* Morph detail panels */}
      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-5 border border-white/60 space-y-4" id="substitution-details-panel">
        <div className="flex items-center gap-2 text-[#2D2D2D]">
          <span className="font-bold text-xs bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">Original</span>
          <span className="text-sm font-semibold">{activeSub.original}</span>
          <ArrowRight className="w-4 h-4 text-[#FF7043]" />
          <span className="font-bold text-xs bg-[#66BB6A]/10 text-[#66BB6A] px-2 py-0.5 rounded border border-[#66BB6A]/20">Alternative</span>
          <span className="text-sm font-semibold text-[#66BB6A]">{activeSub.alternative}</span>
        </div>

        <div className="text-xs space-y-2.5">
          <div className="flex gap-2">
            <span className="font-bold text-neutral-400 uppercase tracking-widest block w-20 flex-shrink-0">Substitution Ratio:</span>
            <span className="text-neutral-700 font-mono font-bold">{activeSub.ratio}</span>
          </div>

          <div className="flex gap-2">
            <span className="font-bold text-neutral-400 uppercase tracking-widest block w-20 flex-shrink-0">Culinary Reason:</span>
            <span className="text-neutral-600 leading-relaxed">{activeSub.reason}</span>
          </div>

          <div className="flex gap-2 pt-1 border-t border-neutral-100">
            <span className="font-bold text-neutral-400 uppercase tracking-widest block w-20 flex-shrink-0">Dietary Gain:</span>
            <span className="text-[#66BB6A] font-bold">{activeSub.nutritionImpact}</span>
          </div>
        </div>
      </div>

      {/* Morph trigger button */}
      <motion.button
        whileHover={{ scale: isMorphing ? 1 : 1.02 }}
        whileTap={{ scale: isMorphing ? 1 : 0.98 }}
        onClick={() => onMorphTriggered(selectedSub)}
        disabled={isMorphing}
        className="w-full py-4 bg-gradient-to-r from-[#FF7043] to-[#FFCA28] text-white font-extrabold tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/15 cursor-pointer disabled:opacity-40"
      >
        <Sparkles className={`w-5 h-5 text-white ${isMorphing ? "animate-spin" : ""}`} />
        {isMorphing ? "Morphing Particles Intersecting..." : "Initiate Molecular Morph"}
      </motion.button>

      {/* Completion message */}
      {!isMorphing && activeMorphItem === selectedSub && (
        <div className="flex items-center gap-2 justify-center text-xs text-[#66BB6A] font-bold bg-[#66BB6A]/10 border border-[#66BB6A]/20 py-2.5 rounded-xl animate-fade-in" id="morph-completion-node">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          Synthesis finished! 3D model successfully altered.
        </div>
      )}
    </div>
  );
}
