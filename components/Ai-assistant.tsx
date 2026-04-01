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

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: "I've analyzed your request. Based on your current tech stack (Next.js & Tailwind), I recommend using a Memoized component for this logic." 
      }]);
    }, 1000);
  };

  const saveToLibrary = (content: string) => {
    const title = window.prompt("Enter a title for this prompt:", "New AI Prompt");
    if (!title) return;

    const newPrompt = {
      id: Date.now().toString(),
      title: title,
      content: content,
      category: "AI Generated",
    };

    const existingPrompts = JSON.parse(localStorage.getItem("dev-vault-prompts") || "[]");
    localStorage.setItem("dev-vault-prompts", JSON.stringify([newPrompt, ...existingPrompts]));
    
    toast.success("Saved to AI Prompt Library!", {
      icon: <Sparkles className="text-amber-500" size={16} />
    });
  };

  return (
    <div className="max-w-5xl mx-auto h-[78vh] flex flex-col">
    
      <div className="flex justify-end mb-6">
        <button 
          onClick={() => setMessages([messages[0]])} 
          className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-400 hover:text-blue-500 transition-all shadow-sm"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`relative group max-w-[85%] p-6 rounded-[2.5rem] ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-lg' 
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-tl-none shadow-sm'
              }`}>
                {/* Save & Copy Buttons (On Hover) */}
                {msg.role === 'ai' && i !== 0 && (
                  <div className="absolute -right-12 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => saveToLibrary(msg.content)} className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-400 hover:text-amber-500 shadow-sm">
                      <BookmarkPlus size={14} />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-2 opacity-50">
                  {msg.role === 'ai' ? <Cpu size={14} /> : <Terminal size={14} />}
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    {msg.role === 'ai' ? 'Assistant' : 'You'}
                  </span>
                </div>
                <p className="text-[13px] font-medium leading-relaxed dark:text-slate-200">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="mt-8 relative">
        <div className="relative group">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about your code..."
            className="w-full pl-8 pr-16 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white"
          />
          <button 
            onClick={handleSend}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-blue-600 text-white rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;