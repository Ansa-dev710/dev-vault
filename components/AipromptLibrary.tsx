"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, MessageSquare, Search, BrainCircuit, Trash2, Send } from "lucide-react";
import { toast } from "sonner";

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
}

const AiPromptLibrary = ({ onSendToAssistant }: { onSendToAssistant?: (text: string) => void }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("dev-vault-prompts");
    if (saved) setPrompts(JSON.parse(saved));
  }, []);

  const deletePrompt = (id: string) => {
    const updated = prompts.filter(p => p.id !== id);
    setPrompts(updated);
    localStorage.setItem("dev-vault-prompts", JSON.stringify(updated));
    toast.error("Prompt deleted from library");
  };

  const filtered = prompts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          placeholder="Search saved prompts..."
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((prompt) => (
            <motion.div 
              key={prompt.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group p-6 rounded-[2rem] bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 hover:border-blue-500/50 transition-all shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                  <BrainCircuit size={12} className="text-blue-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">{prompt.category}</span>
                </div>
                <button onClick={() => deletePrompt(prompt.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{prompt.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 italic leading-relaxed">"{prompt.content}"</p>

              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(prompt.content);
                    toast.success("Prompt copied!");
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/10 hover:text-blue-500 transition-all"
                >
                  <Copy size={14} /> Copy
                </button>
                <button 
                  onClick={() => onSendToAssistant?.(prompt.content)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 shadow-lg shadow-blue-500/20 transition-all"
                >
                  <Send size={14} /> Run AI
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AiPromptLibrary;