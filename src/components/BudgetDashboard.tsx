import { DollarSign, Percent, TrendingDown, HelpCircle, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

interface BudgetDashboardProps {
  usedBudget: number;
  totalBudget: number;
  savings: number;
  onUpdateLimit: (val: number) => void;
}

export function BudgetDashboard({
  usedBudget = 24.5,
  totalBudget = 50,
  savings = 12.8,
  onUpdateLimit,
}: BudgetDashboardProps) {
  const percentageUsed = Math.min((usedBudget / (totalBudget || 1)) * 100, 150);
  const remaining = Math.max(totalBudget - usedBudget, 0);
  const isOver = usedBudget > totalBudget;

  return (
    <div className="glass-panel rounded-[2rem] p-6 md:p-8 shadow-xl max-w-2xl mx-auto space-y-6" id="budget-dashboard-component">
      <div className="border-b border-neutral-1050 pb-4">
        <h3 className="text-lg font-bold text-[#2D2D2D] flex items-center gap-2">
          3D Treasury Gauge Control
        </h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Provides detailed fiscal tracking of standard recipe costs versus established thresholds.
        </p>
      </div>

      {/* Grid of counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="budget-indicators-grid">
        {/* Spent */}
        <div className="bg-white/60 p-4 rounded-2xl border border-neutral-200/50 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF7043]/10 text-[#FF7043] rounded-xl flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Est. Cost</span>
            <span className="font-mono text-base font-black text-neutral-700">₹{usedBudget.toFixed(2)}</span>
          </div>
        </div>

        {/* Saved */}
        <div className="bg-white/60 p-4 rounded-2xl border border-neutral-200/50 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 bg-[#66BB6A]/10 text-[#66BB6A] rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Pantry Savings</span>
            <span className="font-mono text-base font-black text-[#66BB6A]">+₹{savings.toFixed(2)}</span>
          </div>
        </div>

        {/* Percent utilization */}
        <div className={`p-4 rounded-2xl border shadow-xs flex items-center gap-3 ${
          isOver ? "bg-red-50 border-red-200 text-red-700" : "bg-white/60 border-neutral-200/50"
        }`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isOver ? "bg-red-100 text-red-600" : "bg-[#FFCA28]/10 text-[#FFCA28]"
          }`}>
            {isOver ? <ShieldAlert className="w-5 h-5" /> : <Percent className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Cap Rate</span>
            <span className="font-mono text-base font-black">
              {percentageUsed.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Adjust limits slider quickly */}
      <div className="space-y-2.5 pt-2">
        <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">
          Override Target Threshold Limit
        </label>
        <div className="flex gap-4 items-center">
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={totalBudget}
            onChange={(e) => onUpdateLimit(Number(e.target.value))}
            className="flex-1 accent-[#FF7043] cursor-pointer"
          />
          <span className="bg-white/70 px-3 py-1.5 text-sm rounded-xl font-mono text-neutral-700 font-bold border border-neutral-200/40">
            ₹{totalBudget}
          </span>
        </div>
      </div>

      {/* RAG Advice info block */}
      <div className="bg-white/40 p-4.5 rounded-2xl border border-white/60 text-xs text-neutral-600 space-y-2.5">
        <span className="font-bold text-[#2D2D2D] uppercase block tracking-widest flex items-center gap-1">
          <HelpCircle className="w-4 h-4 text-[#FF7043]" /> Fiscal Smart Saving Tips
        </span>
        <ul className="list-disc list-inside space-y-1.5 pl-1 leading-normal">
          <li>Leverage remaining whole grains ({savings > 5 ? "Almond / Quinoa" : "Bread / Rice"}) on cooking steps to prevent ingredient waste.</li>
          <li>Opting for regional carrot alternatives can boost savings by an additional 12%.</li>
          <li>Reusing cooking water from pasta speeds up boiling times, conserving electric energy resources.</li>
        </ul>
      </div>
    </div>
  );
}
