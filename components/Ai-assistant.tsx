"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Terminal, Cpu, RotateCcw, Code } from "lucide-react";

const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello Ansa! I'm your DevVault AI. How can I help you build today?" }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    // Idher hum baad mein API connect kar sakte hain
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: "I've analyzed your request. Based on your current tech stack (Next.js & Tailwind), I recommend using a Memoized component for this logic." 
      }]);
    }, 1000);
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
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Intelligent Code Companion</p>
        </div>
        <button onClick={() => setMessages([messages[0]])} className="p-3 text-slate-400 hover:text-blue-500 transition-colors">
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-6 rounded-[2rem] ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/20' 
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 dark:text-slate-200 rounded-tl-none'
              }`}>
                <div className="flex items-center gap-2 mb-2 opacity-50">
                  {msg.role === 'ai' ? <Cpu size={14} /> : <Terminal size={14} />}
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {msg.role === 'ai' ? 'Assistant' : 'You'}
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="mt-8 relative">
        <div className="absolute -top-12 left-0 flex gap-2">
          {["Debug Code", "Refactor", "Explain"].map((label) => (
            <button 
              key={label}
              className="px-4 py-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-tighter text-slate-500 hover:border-blue-500/50 hover:text-blue-500 transition-all"
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
            placeholder="Ask anything about your code..."
            className="w-full pl-6 pr-16 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white"
          />
          <button 
            onClick={handleSend}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-2xl hover:scale-105 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;