import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage } from "../types";

export function AIChatAssistant({ onAddIngredients }: { onAddIngredients?: (items: string[]) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Hello! I'm your 3D Pantry Planner assistant. Ask me about quick recipes, substitution advice, or cost-saving kitchen hacks!",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.concat(userMsg),
          currentMessage: textToSend,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reply from server.");
      }

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "model",
        text: data.text || "I processed your request, let's keep cooking!",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, modelMsg]);

      // If the model suggested adding ingredients, pass them up
      if (data.addIngredients && Array.isArray(data.addIngredients) && data.addIngredients.length > 0 && onAddIngredients) {
        onAddIngredients(data.addIngredients);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "model",
          text: "Oops, local microwave signal lost! Make sure your server is online and try again.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="chef-chat-widget">
      {/* 1. Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#FF7043] text-white rounded-full p-4.5 shadow-2xl relative cursor-pointer"
        id="toggle-assistant-btn"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        )}
      </motion.button>

      {/* 2. Conversational Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-20 right-0 w-86 md:w-96 h-[500px] bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/70 shadow-2xl flex flex-col justify-between overflow-hidden"
            id="assistant-chat-panel"
          >
            {/* Header with Pulse Waveform */}
            <div className="bg-gradient-to-r from-[#FF7043] to-[#FFCA28] p-5 text-white flex items-center justify-between shadow-sm" id="chat-header">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '6s' }} />
                <div>
                  <h4 className="font-extrabold text-sm tracking-wide">CookMate Avatar</h4>
                  <p className="text-[10px] text-orange-100 uppercase tracking-widest font-bold">Active Culinary Assistant</p>
                </div>
              </div>
              
              {/* Animated Micro Voice Waveform Pulse */}
              <div className="flex items-center gap-0.5 h-4" id="voice-pulse-waveform">
                <span className={`w-0.75 rounded-full bg-white opacity-85 ${isLoading ? 'animate-bounce h-3' : 'h-1.5'}`} style={{ animationDelay: '0s' }}></span>
                <span className={`w-0.75 rounded-full bg-white opacity-85 ${isLoading ? 'animate-bounce h-4' : 'h-2'}`} style={{ animationDelay: '0.15s' }}></span>
                <span className={`w-0.75 rounded-full bg-white opacity-85 ${isLoading ? 'animate-bounce h-2.5' : 'h-1'}`} style={{ animationDelay: '0.3s' }}></span>
                <span className={`w-0.75 rounded-full bg-white opacity-85 ${isLoading ? 'animate-bounce h-3.5' : 'h-2'}`} style={{ animationDelay: '0.45s' }}></span>
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#fdfbf7]/40" id="message-container">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      msg.role === "user"
                        ? "bg-[#FF7043] text-white rounded-tr-none font-bold"
                        : "bg-white/80 border border-white text-neutral-800 rounded-tl-none leading-relaxed"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className={`text-[9px] mt-1 block text-right font-mono font-bold ${msg.role === "user" ? "text-orange-200" : "text-neutral-400"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/80 border border-white text-neutral-500 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2 shadow-sm">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF7043]"></span>
                    </span>
                    CookMate is analyzing recipes...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions Shelf */}
            {messages.length === 1 && (
              <div className="p-3 bg-white/40 backdrop-blur-xs border-t border-white/60 flex flex-wrap gap-1.5 justify-center" id="chat-suggestions">
                <button
                  onClick={() => handleSuggestClick("Suggest a low-carb breakfast using eggs.")}
                  className="text-[10px] bg-white/50 hover:bg-[#FF7043]/10 text-neutral-600 hover:text-[#FF7043] px-3 py-1.5 rounded-xl border border-neutral-200/50 hover:border-[#FF7043]/20 font-bold cursor-pointer transition-all"
                >
                  🥚 Easy Egg Breakfast
                </button>
                <button
                  onClick={() => handleSuggestClick("How do I substitute milk in soup?")}
                  className="text-[10px] bg-white/50 hover:bg-[#FF7043]/10 text-neutral-600 hover:text-[#FF7043] px-3 py-1.5 rounded-xl border border-neutral-200/50 hover:border-[#FF7043]/20 font-bold cursor-pointer transition-all"
                >
                  🥛 Dairy Substitutes
                </button>
                <button
                  onClick={() => handleSuggestClick("Simple budget meal planning tips.")}
                  className="text-[10px] bg-white/50 hover:bg-[#FF7043]/10 text-neutral-600 hover:text-[#FF7043] px-3 py-1.5 rounded-xl border border-neutral-200/50 hover:border-[#FF7043]/20 font-bold cursor-pointer transition-all"
                >
                  💰 Cost Saving Tips
                </button>
              </div>
            )}

            {/* Form Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3 bg-white/60 border-t border-white/60 flex gap-2 items-center"
              id="assistant-chat-form"
            >
              <input
                type="text"
                disabled={isLoading}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask CookMate anything..."
                className="flex-1 border border-neutral-200 bg-white/70 focus:bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF7043] disabled:opacity-50 font-medium"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-[#FF7043] hover:bg-[#FF7043]/90 text-white rounded-xl p-2.5 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
