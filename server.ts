import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK securely
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Log server initialization context
console.log("3D Pantry Planner Server Initializing...");
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI interactions will fail securely.");
}

// Model Definitions
const TEXT_MODEL = "gemini-3.5-flash";

// 1. API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV });
});

// Helper for schema structures
const mealSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Name of the dish" },
    description: { type: Type.STRING, description: "Elegant description of the dish" },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          quantity: { type: Type.STRING },
          inPantry: { type: Type.BOOLEAN, description: "Whether this ingredient is in the user's input list" }
        },
        required: ["name", "quantity", "inPantry"]
      }
    },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.INTEGER },
        protein: { type: Type.STRING, description: "e.g., '25g'" },
        carbs: { type: Type.STRING, description: "e.g., '45g'" },
        fat: { type: Type.STRING, description: "e.g., '12g'" }
      },
      required: ["calories", "protein", "carbs", "fat"]
    },
    prepTime: { type: Type.INTEGER, description: "Preparation time in minutes" },
    costEstimate: { type: Type.NUMBER, description: "Estimated cost in INR for this meal" }
  },
  required: ["name", "description", "ingredients", "steps", "nutrition", "prepTime", "costEstimate"]
};

const planSchema = {
  type: Type.OBJECT,
  properties: {
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema,
    totalCost: { type: Type.NUMBER, description: "Total estimated standard cost of the plan in INR" },
    savings: { type: Type.NUMBER, description: "Estimated savings by utilizing ingredients already in pantry in INR" },
    confidenceScore: { type: Type.INTEGER, description: "Gemini AI model confidence score out of 100" },
    explanation: { type: Type.STRING, description: "Warm human-like explanation of why this plan satisfies context" }
  },
  required: ["breakfast", "lunch", "dinner", "totalCost", "savings", "confidenceScore", "explanation"]
};

// 2. API: Generate Meal Plan
app.post("/api/generate-meal-plan", async (req, res) => {
  try {
    const { ingredients, budget, familySize, diet } = req.body;

    const pantryListString = ingredients && ingredients.length > 0 ? ingredients.join(", ") : "no specific ingredients";

    const prompt = `Generate a comprehensive daily meal plan (Breakfast, Lunch, and Dinner) tailored for a family size of ${familySize || 2} persons, with a total daily budget of ₹${budget || 500} INR, adhering to a ${diet || "Any"} diet preference, and prioritizing utilizing these available pantry ingredients: ${pantryListString}. Make sure to compute real, realistic nutritional profiles and cost parameters. Utilize pantry items proactively to maximize the savings value.`;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        systemInstruction: "You are CookMate RAG Engine, a highly professional culinary visualizer. Generate an accurate, nutritionally realistic daily meal plan based on requirements, using the provided schema.",
        responseMimeType: "application/json",
        responseSchema: planSchema,
        temperature: 0.2,
      },
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error generating meal plan:", error);
    res.status(500).json({ error: error.message || "Failed to generate meal plan with Gemini AI." });
  }
});

// 3. API: Substitute Ingredient Morph Lab
app.post("/api/substitute", async (req, res) => {
  try {
    const { original } = req.body;
    if (!original) {
      return res.status(400).json({ error: "Original ingredient name is required for substitution synthesis." });
    }

    const subSchema = {
      type: Type.OBJECT,
      properties: {
        original: { type: Type.STRING },
        alternative: { type: Type.STRING },
        ratio: { type: Type.STRING, description: "e.g., '1:1', '1/2 cup for 1 cup'" },
        reason: { type: Type.STRING, description: "Why this alternative is excellent from a culinary perspective" },
        nutritionImpact: { type: Type.STRING, description: "What changes nutritionally (e.g., lower calories, higher plant protein)" }
      },
      required: ["original", "alternative", "ratio", "reason", "nutritionImpact"]
    };

    const prompt = `Suggest a premium healthy, affordable, or eco-friendly substitute for the ingredient: "${original}". State substitution ratios, culinary justification, and nutritional impacts.`;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        systemInstruction: "You are CookMate Ingredient Lab, providing smart culinary substitutions in strict JSON format.",
        responseMimeType: "application/json",
        responseSchema: subSchema,
        temperature: 0.3,
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error in ingredient substitution API:", error);
    res.status(500).json({ error: error.message || "Failed to find substitution." });
  }
});

// 4. API: AI Chat Assistant Companion
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, currentMessage } = req.body;
    if (!currentMessage) {
      return res.status(400).json({ error: "Current message is required for conversational inference." });
    }

    // Format chat history for context
    const chatHistory = (messages || []).map((m: any) => {
      const roleName = m.role === "user" ? "user" : "model";
      return `${roleName.toUpperCase()}: ${m.text}`;
    }).join("\n");

    const fullPrompt = `${chatHistory}\nUSER: ${currentMessage}\nMODEL:`;

    const chatResponseSchema = {
      type: Type.OBJECT,
      properties: {
        text: { type: Type.STRING, description: "Your conversational response in complete sentences." },
        addIngredients: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of ingredients the user wants to add to their pantry/shelf based on the current message"
        }
      },
      required: ["text", "addIngredients"]
    };

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: fullPrompt,
      config: {
        systemInstruction: "You are the 3D Pantry Planner, an interactive 3D immersive portal's culinary assistant avatar. Respond in warm, concise, conversational, friendly paragraphs, utilizing clean markdown formatting structure. If the user asks to add something (like an ingredient) to their pantry or shelf, add it to the addIngredients array.",
        responseMimeType: "application/json",
        responseSchema: chatResponseSchema,
        temperature: 0.7,
      },
    });
    
    // Fallback if response is somehow not json parseable
    let parsedText = { text: "I'm processing your culinary query!", addIngredients: [] };
    try {
      parsedText = JSON.parse(response.text || "{}");
    } catch(e) {
      console.warn("Failed to parse chat json", response.text);
    }

    res.json(parsedText);
  } catch (error: any) {
    console.error("Error in chat assistant API:", error);
    res.status(500).json({ error: error.message || "Failed to generate chat response." });
  }
});

// Vite Integration Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static build assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`3D Pantry Planner running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
