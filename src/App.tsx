import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, Layers, Compass, HelpCircle, Utensils } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ThreeCanvas } from "./components/ThreeCanvas";
import { PantryInput } from "./components/PantryInput";
import { RecipeRecommendations } from "./components/RecipeRecommendations";
import { GroceryPlanner } from "./components/GroceryPlanner";
import { BudgetDashboard } from "./components/BudgetDashboard";
import { SubstitutionLab } from "./components/SubstitutionLab";
import { AIChatAssistant } from "./components/AIChatAssistant";
import { Meal, MealPlan } from "./types";

const SECTIONS = [
  { id: 0, title: "Hero", description: "Immersive Intro" },
  { id: 1, title: "Pantry Input", description: "Cupboard Synced" },
  { id: 2, title: "RAG Pipeline", description: "Neural Processing" },
  { id: 3, title: "Meals", description: "AI Recs" },
  { id: 4, title: "Groceries", description: "Dynamic Drops" },
  { id: 5, title: "Budget Gauge", description: "Treasury Ring" },
  { id: 6, title: "Substitution Lab", description: "Molecular Morph" },
  { id: 7, title: "Global Companion", description: "Interact Avatar" },
];

export default function App() {
  // Navigation & Spatial Core state
  const [activeSection, setActiveSection] = useState(0);

  // User preferences
  const [ingredients, setIngredients] = useState<string[]>(["Tomato", "Egg", "Carrot"]);
  const [budget, setBudget] = useState(800);
  const [familySize, setFamilySize] = useState(2);
  const [diet, setDiet] = useState("Any");

  // AI results
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorPrompt, setErrorPrompt] = useState<string | null>(null);

  // Advanced Interactive Trigger states
  const [activeRAGStep, setActiveRAGStep] = useState(0);
  const [groceryDropsCount, setGroceryDropsCount] = useState(0);
  const [morphIngredient, setMorphIngredient] = useState<"egg" | "milk" | "rice" | "other">("egg");
  const [triggerMorph, setTriggerMorph] = useState(false);

  // Synced default pantry logic
  const handleToggleDefaultIngredient = (name: string) => {
    if (ingredients.some((i) => i.toLowerCase() === name.toLowerCase())) {
      setIngredients(ingredients.filter((i) => i.toLowerCase() !== name.toLowerCase()));
    } else {
      setIngredients([...ingredients, name]);
    }
  };

  const handleAddIngredient = (name: string) => {
    if (!ingredients.some((i) => i.toLowerCase() === name.toLowerCase())) {
      setIngredients([...ingredients, name]);
    }
  };

  const handleRemoveIngredient = (name: string) => {
    setIngredients(ingredients.filter((i) => i !== name));
  };

  // Generate meal plan with visually animated RAG constellation
  const handleGenerateMealPlan = async () => {
    setIsLoading(true);
    setErrorPrompt(null);
    
    // Jump straight to Section 3: RAG Processing visualizer
    setActiveSection(2);
    setActiveRAGStep(0);

    // Timeline simulation of RAG stage events
    const stepsTimeline = [
      { step: 1, delay: 1100 }, // User Query Indexing
      { step: 2, delay: 2200 }, // Vector Search retrieval
      { step: 3, delay: 3500 }, // Gemini Reasoning Synthesizing
    ];

    stepsTimeline.forEach(({ step, delay }) => {
      setTimeout(() => {
        setActiveRAGStep(step);
      }, delay);
    });

    try {
      const response = await fetch("/api/generate-meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, budget, familySize, diet }),
      });

      if (!response.ok) {
        throw new Error("Failed to consult Gemini model service.");
      }

      const data = await response.json();
      
      // Delay response load slightly to let RAG nodes finish glowing!
      setTimeout(() => {
        setMealPlan(data);
        setIsLoading(false);
        setActiveSection(3); // Auto forward to Meal Recommendations
      }, 4200);

    } catch (err: any) {
      setTimeout(() => {
        setErrorPrompt(err.message || "Loss of signal. Please check your system endpoints.");
        setIsLoading(false);
        setActiveSection(1); // Return to input
      }, 4200);
    }
  };

  // Substitution laboratory triggers
  const handleMorphSelect = (ingredientType: "egg" | "milk" | "rice" | "other") => {
    setMorphIngredient(ingredientType);
    setTriggerMorph(true);
  };

  const handleMorphFinished = () => {
    setTriggerMorph(false);
  };

  // Synchronize dynamic drops on grocery check
  const handleGroceryCheckAction = () => {
    setGroceryDropsCount((prev) => prev + 1);
  };

  // Automatically load a gorgeous default meal plan if empty for demonstration
  useEffect(() => {
    if (!mealPlan && !isLoading) {
      setMealPlan({
        breakfast: {
          name: "Savory Tomato and Egg Scramble",
          description: "Fluffy eggs scrambled with juicy diced tomatoes and a pinch of seasoning, served over warm sliced bread toast.",
          ingredients: [
            { name: "Egg", quantity: "4 large", inPantry: true },
            { name: "Tomato", quantity: "2 medium", inPantry: true },
            { name: "Bread slices", quantity: "4 slices", inPantry: false }
          ],
          steps: [
            "Whisk eggs in a small bowl with a pinch of salt.",
            "Sauté diced tomatoes in a pan with olive oil until tender.",
            "Pour whisked eggs into pan, fold gently until scrambled.",
            "Toast bread slices, plate warm scramble on top."
          ],
          nutrition: { calories: 340, protein: "18g", carbs: "22g", fat: "14g" },
          prepTime: 12,
          costEstimate: 4.5
        },
        lunch: {
          name: "Crisp Glazed Carrots with Tofu",
          description: "Fresh carrots sliced and oven-roasted with honey, paired alongside cubed pan-seared tofu and quinoa greens.",
          ingredients: [
            { name: "Carrot", quantity: "3 channels", inPantry: true },
            { name: "Tofu block", quantity: "12 oz", inPantry: false },
            { name: "Almond milk", quantity: "1/4 cup", inPantry: false }
          ],
          steps: [
            "Slice carrots and toss in olive oil and sweet syrup.",
            "Cut tofu into perfect cubes, dry seared until crisp.",
            "Roast glazed carrots at 400F for 18 minutes.",
            "Serve warm on deep bowls accented with sesame toppings."
          ],
          nutrition: { calories: 420, protein: "22g", carbs: "35g", fat: "12g" },
          prepTime: 20,
          costEstimate: 6.8
        },
        dinner: {
          name: "Sleek Gourmet Cream soup",
          description: "A silky, low-calorie warm broccoli soup infused with almond milk reductions, plated elegantly with toasted crumbs.",
          ingredients: [
            { name: "Broccoli florets", quantity: "2 cups", inPantry: false },
            { name: "Milk alternative", quantity: "2 cups", inPantry: true },
            { name: "Croutons", quantity: "1/2 cup", inPantry: false }
          ],
          steps: [
            "Boil broccoli florets until extremely tender.",
            "Blend florets with warmed milk base until smooth.",
            "Return blended soup to pan, simmer with savory spices.",
            "Garnish with croutons and a drizzle of olive oil."
          ],
          nutrition: { calories: 310, protein: "12g", carbs: "28g", fat: "8g" },
          prepTime: 15,
          costEstimate: 5.2
        },
        totalCost: 16.5,
        savings: 12.8,
        confidenceScore: 98,
        explanation: "This plan maximizes your active Tomato, Egg, and Carrot supplies, helping you enjoy wholesome meals while scaling back purchases."
      });
    }
  }, []);

  return (    <div className="min-h-screen bg-transparent flex flex-col justify-between select-none relative overflow-x-hidden font-sans" id="cookmate-app-root">
      
      {/* 1. Spatial Global Navigation Header */}
      <header className="border-b border-white/60 bg-white/40 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between" id="global-header">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#FF7043] to-[#FFCA28] rounded-[1.2rem] flex items-center justify-center text-white font-black shadow-lg shadow-orange-500/10">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-[#2D2D2D] tracking-tight leading-none text-base md:text-lg">
              3D Pantry Planner
            </h1>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest block mt-0.5">3D Spatial Experience</span>
          </div>
        </div>

        {/* Anchor controls */}
        <div className="hidden lg:flex items-center gap-1.5" id="header-nav-anchors">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSection === sec.id
                  ? "bg-[#FF7043]/10 text-[#FF7043]"
                  : "text-neutral-500 hover:text-[#2D2D2D]"
              }`}
            >
              {sec.title}
            </button>
          ))}
        </div>

        <div className="text-[10px] font-mono font-bold text-neutral-500 border border-white/60 bg-white/30 backdrop-blur-md px-2.5 py-1 rounded-lg" id="header-time">
          UTC: 2026-06-06
        </div>
      </header>

      {/* 2. Panoramic Spatial Layout Structure */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-73px)]" id="main-parallax-container">
        {/* Left Side: Interactive dashboards with frosted look */}
        <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-center space-y-8 overflow-y-auto lg:h-[calc(100vh-73px)] border-r border-white/40 relative bg-white/10 backdrop-blur-md" id="spatial-scroller-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 25 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* Introduction Banner to Current Phase */}
              <div>
                <span className="text-[10px] font-bold text-[#FF7043] uppercase tracking-widest decoration-dotted underline">
                  Interactive Journey Phase 0{activeSection + 1}
                </span>
                <h2 className="text-3xl font-black text-neutral-800 tracking-tight leading-tight mt-1.5">
                  {SECTIONS[activeSection].title}
                </h2>
                <p className="text-xs text-neutral-400 font-semibold mt-1">
                  {SECTIONS[activeSection].description}
                </p>
              </div>

              {/* SECTION CONTROLS ROUTER */}
              <div id="active-screen-panel-wrapper">
                {activeSection === 0 && (
                  <div className="space-y-6 bg-white/40 backdrop-blur-md p-7 rounded-[2.2rem] border border-white/60 shadow-md" id="hero-screen-details">
                    <h3 className="text-xl font-bold text-neutral-800">
                      Welcome to the Kitchen of Tomorrow
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                      Transform 3D Pantry Planner into a fully simulated, interactive spatial environment. Witness ingredients assembling, trace neural AI decisions, design budgets in real-time, and substitute molecules.
                    </p>
                    <div className="bg-[#FF7043]/10 pb-5 pt-4.5 px-4 rounded-[1.5rem] border border-[#FF7043]/15 text-xs text-neutral-600 leading-normal animate-pulse" style={{ animationDuration: '4s' }} id="hero-perks_bullet">
                      <strong className="text-neutral-800 block mb-1">Wow Factors Available:</strong>
                      <ul className="list-disc list-inside space-y-1 pl-1">
                        <li>Real-time procedurally simulated 3D model structures.</li>
                        <li>Live Gemini RAG retrieval animation tracks.</li>
                        <li>Substance Substitution morph labs with particle burst dynamics.</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => setActiveSection(1)}
                      className="w-full py-4 bg-[#FF7043] hover:bg-[#FF7043]/90 text-white rounded-2xl text-sm font-extrabold tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 cursor-pointer uppercase transition-all"
                    >
                      Begin Culinary Assembly <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {activeSection === 1 && (
                  <PantryInput
                    ingredients={ingredients}
                    onAddIngredient={handleAddIngredient}
                    onRemoveIngredient={handleRemoveIngredient}
                    onToggleDefaultIngredient={handleToggleDefaultIngredient}
                    budget={budget}
                    familySize={familySize}
                    diet={diet}
                    setBudget={setBudget}
                    setFamilySize={setFamilySize}
                    setDiet={setDiet}
                    onGenerate={handleGenerateMealPlan}
                    isLoading={isLoading}
                  />
                )}

                {activeSection === 2 && (
                  <div className="glass-panel rounded-[2rem] p-6 md:p-8 shadow-xl text-center space-y-6" id="rag-constellation-panel">
                    <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto border border-blue-500/20 animate-pulse">
                      <Layers className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-lg text-[#2D2D2D]">Retriever-Generator Pipeline</h4>
                      <p className="text-xs text-neutral-400">Tracing contextual search flows to safely build plans.</p>
                    </div>

                    {/* Progress tracking bars */}
                    <div className="space-y-3 pt-2 text-left" id="constellation-nodes-list">
                      {[
                        { id: 1, label: "Indexing User Query context parameters" },
                        { id: 2, label: "Consulting recipe collections with Vector Embeddings" },
                        { id: 3, label: "Filtering nutritional bounds & dietary constraints" },
                        { id: 4, label: "Gemini 3.5 AI model synthesizing meals" }
                      ].map((item) => {
                        const isDone = activeRAGStep >= item.id;
                        const isCurrent = activeRAGStep + 1 === item.id;
                        return (
                          <div
                            key={item.id}
                            className={`flex items-center gap-3 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                              isDone ? "bg-[#66BB6A]/10 border-[#66BB6A]/20 text-[#66BB6A]" :
                              isCurrent ? "bg-[#FF7043]/10 border-[#FF7043]/20 text-[#FF7043] animate-pulse" :
                              "bg-white/40 border-neutral-200/60 text-neutral-400"
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                              isDone ? "bg-[#66BB6A] text-white" :
                              isCurrent ? "bg-[#FF7043] text-white" :
                              "bg-neutral-200 text-neutral-500"
                            }`}>
                              {item.id}
                            </span>
                            <span>{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeSection === 3 && (
                  <RecipeRecommendations
                    mealPlan={mealPlan}
                    onSelectMealForGrocery={handleSelectMealForGrocery}
                    onAdvanceToGrocery={() => setActiveSection(4)}
                  />
                )}

                {activeSection === 4 && (
                  <GroceryPlanner
                    mealPlan={mealPlan}
                    onItemChecked={handleGroceryCheckAction}
                  />
                )}

                {activeSection === 5 && (
                  <BudgetDashboard
                    usedBudget={mealPlan ? mealPlan.totalCost : 22.5}
                    totalBudget={budget}
                    savings={mealPlan ? mealPlan.savings : 10.5}
                    onUpdateLimit={setBudget}
                  />
                )}

                {activeSection === 6 && (
                  <SubstitutionLab
                    onMorphTriggered={handleMorphSelect}
                    isMorphing={triggerMorph}
                    activeMorphItem={morphIngredient}
                  />
                )}
                {activeSection === 7 && (
                  <div className="glass-panel rounded-[2rem] p-8 shadow-xl text-center space-y-6" id="avatar-section-info">
                    <div className="w-16 h-16 bg-[#FF7043]/10 text-[#FF7043] rounded-full flex items-center justify-center mx-auto border border-[#FF7043]/20 animate-bounce">
                      <Compass className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-lg text-[#2D2D2D]">Conversational AI Portal</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Say Hello to your floating avatar. They live on the bottom-right corner of your screen at all times to address custom requirements, adjust recipe quantities, or substitute ingredients instantly!
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setActiveSection(1)}
                      className="text-xs bg-[#FF7043] hover:bg-[#FF7043]/90 text-white font-extrabold py-3 px-8 rounded-2xl transition-all cursor-pointer tracking-widest uppercase"
                    >
                      Return to Shelf input
                    </button>
                  </div>
                )}
              </div>

              {/* Direction controls / step button pairs */}
              <div className="flex justify-between items-center pt-4 border-t border-neutral-200/50" id="pagination-nav-footer">
                <button
                  disabled={activeSection === 0}
                  onClick={() => setActiveSection(activeSection - 1)}
                  className="flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-neutral-800 disabled:opacity-40 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                {/* Dots indicator track */}
                <div className="flex gap-1.5">
                  {SECTIONS.map((sec) => (
                    <span
                      key={sec.id}
                      onClick={() => setActiveSection(sec.id)}
                      className={`h-2 rounded-full cursor-pointer transition-all ${
                        activeSection === sec.id ? "w-6 bg-[#FF7043]" : "w-2 bg-neutral-200 hover:bg-neutral-400"
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={activeSection === SECTIONS.length - 1}
                  onClick={() => setActiveSection(activeSection + 1)}
                  className="flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-neutral-800 disabled:opacity-40 cursor-pointer"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: The immersive 3D Canvas React Three Fiber viewport */}
        <div className="lg:col-span-7 h-[45vh] lg:h-auto min-h-[350px] relative bg-stone-900 border-t border-stone-800 lg:border-t-0" id="three-spatial-panel">
          
          <div className="absolute inset-0 w-full h-full">
            <ThreeCanvas
              activeSection={activeSection}
              activePantryItems={ingredients}
              activeRAGStep={activeRAGStep}
              usedBudget={mealPlan ? mealPlan.totalCost : 22.5}
              totalBudget={budget}
              groceryDropsTrigger={groceryDropsCount}
              morphIngredient={morphIngredient}
              triggerMorph={triggerMorph}
              onMorphCompleted={handleMorphFinished}
            />
          </div>

          {/* Floaters indicating spatial mouse / scroll dynamics inside 3D canvas */}
          <div className="absolute top-4 left-4 glass-panel-dark text-white rounded-xl px-3 py-1.5 text-[10px] uppercase font-mono font-bold tracking-wide flex items-center gap-1.5" id="spatial-render-status">
            <span className="w-2 h-2 rounded-full bg-[#66BB6A] animate-pulse"></span>
            GL Engine Active
          </div>

          <div className="absolute bottom-4 left-4 font-mono text-[9px] text-neutral-400">
            Rotations: Mouse Interaction enabled
          </div>

          {/* Quick instructions indicator overlay */}
          <div className="absolute top-4 right-4 glass-panel text-stone-700 rounded-xl px-3 py-2 text-xs font-semibold max-w-[240px] text-right leading-tight hidden sm:block">
            {activeSection === 0 && "👋 Float or rotate vegetables, egg structure, and carrots."}
            {activeSection === 1 && "🧺 Item list updates reflect on the shelves in real-time."}
            {activeSection === 2 && "🛰️ Active particles stream query data to vector RAG nodes."}
            {activeSection === 3 && "🍳 Glowing pot shows successful recipe synthesis."}
            {activeSection === 4 && "👇 Tapping checklists drops fruits & vegetables with gravity."}
            {activeSection === 5 && "💰 Visualizing budget limits with a modular 3D liquid energy ring."}
            {activeSection === 6 && "🧪 Tap Morph to ignite molecular particle explosions."}
            {activeSection === 7 && "📣 Pulse represents voice assistant waveform updates."}
          </div>
        </div>
      </main>

      {/* 3. Floating AI conversational Sidebar assistant widget */}
      <AIChatAssistant 
        onAddIngredients={(items) => {
          setIngredients((prev) => {
            const newItems = items.filter(item => !prev.includes(item));
            return [...prev, ...newItems];
          });
        }} 
      />
      
      {/* Footer credits line */}
      <footer className="bg-neutral-900 text-neutral-500 py-3.5 px-6 text-center text-[10px] font-medium border-t border-neutral-800" id="footer-spatial-credits">
        3D Pantry Planner Spatial Companion · Developed with Google Gemini models inside AI Studio Workspace
      </footer>
    </div>
  );

  // Handle ingredient collection updates for grocery checks
  function handleSelectMealForGrocery(meal: Meal) {
    // Increment checklist drops manually to trigger splash falling items
    setGroceryDropsCount((prev) => prev + 1);
  };
}
