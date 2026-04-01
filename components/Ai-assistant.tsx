"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Send, Terminal, Cpu, RotateCcw, 
  BookmarkPlus, Copy, Check 
} from "lucide-react";
import { toast } from "sonner";

const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello Ansa! I'm your DevVault AI. How can I help you build today?" }
  ]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // AI Response Simulation
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: "I've analyzed your request. Based on your current tech stack (Next.js & Tailwind), I recommend using a Memoized component for this logic to optimize performance." 
      }]);
    }, 1000);
  };

  // --- SAVE TO PROMPT LIBRARY LOGIC ---
  const saveToLibrary = (content: string) => {
    const title = window.prompt("Enter a title for this prompt:", "New AI Prompt");
    
    if (!title) return;

    const newPrompt = {
      id: Date.now().toString(),
      title: title,
      content: content,
      category: "AI Generated",
      targetAI: "General"
    };

    // Get existing prompts from localStorage
    const existingPrompts = JSON.parse(localStorage.getItem("dev-vault-prompts") || "[]");
    const updatedPrompts = [newPrompt, ...existingPrompts];
    
    localStorage.setItem("dev-vault-prompts", JSON.stringify(updatedPrompts));
    
    toast.success("Saved to AI Prompt Library!", {
      description: "You can find this in your Brainwave Vault.",
      icon: <Sparkles className="text-amber-500" size={16} />
    });
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.info("Copied to clipboard");
  };

  return (
    <div className="max-w-5xl mx-auto p-4 h-[85vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h2 className="text-4xl font-black italic tracking-tighter dark:text-white flex items-center gap-3">
            Dev <span className="text-blue-600">AI.</span>
            <Sparkles className="text-blue-600 animate-pulse" size={24} />
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest pl-1">Intelligent Code Companion</p>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])} 
          className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-400 hover:text-blue-500 transition-all shadow-sm"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`relative group max-w-[85%] p-6 rounded-[2.5rem] ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-500/20' 
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 dark:text-slate-200 rounded-tl-none shadow-sm'
              }`}>
                {/* Action Buttons for AI Response */}
                {msg.role === 'ai' && i !== 0 && (
                  <div className="absolute -right-12 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => saveToLibrary(msg.content)}
                      className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-400 hover:text-amber-500 transition-all shadow-sm"
                      title="Save to Library"
                    >
                      <BookmarkPlus size={16} />
                    </button>
                    <button 
                      onClick={() => copyToClipboard(msg.content, i)}
                      className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-400 hover:text-blue-500 transition-all shadow-sm"
                    >
                      {copiedIndex === i ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3 opacity-50">
                  {msg.role === 'ai' ? <Cpu size={14} /> : <Terminal size={14} />}
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                    {msg.role === 'ai' ? 'Assistant' : 'You'}
                  </span>
                </div>
                <p className="text-[13px] font-medium leading-relaxed">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="mt-8 relative">
        <div className="absolute -top-14 left-0 flex gap-2 overflow-x-auto no-scrollbar pb-2 w-full">
          {["Debug Code", "Refactor UI", "Explain Logic", "Generate Types"].map((label) => (
            <button 
              key={label}
              onClick={() => setInput(label + ": ")}
              className="px-5 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-blue-500/50 hover:text-blue-500 hover:bg-blue-500/5 transition-all whitespace-nowrap shadow-sm"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative group">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message or use a quick command..."
            className="w-full pl-8 pr-16 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-blue-600 text-white rounded-[1.5rem] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg shadow-blue-500/30"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;