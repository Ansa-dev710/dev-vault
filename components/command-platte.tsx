"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Moon, Sun, Plus, Terminal, Layout, Command } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setActiveTab: (tab: "resources" | "notes" | "tasks" | "snippets" | "schedule" | "collab" | "analytics") => void;
  activeTab: string; 
  toggleTheme: () => void;
  addTask: (title: string) => void;
}

export default function CommandPalette({ 
  isOpen, 
  setIsOpen, 
  setActiveTab, 
  activeTab, 
  toggleTheme, 
  addTask 
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setIsOpen]);

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const input = query.trim().toLowerCase();

      
      if (input === "> dark" || input === "> light" || input === "> theme") {
        toggleTheme();
        closePalette();
      }

      
      if (input.startsWith("> task:")) {
        const taskTitle = query.split("> task:")[1]?.trim();
        if (taskTitle) {
          addTask(taskTitle);
          closePalette();
        }
      }

    
      const tabs = ["resources", "notes", "tasks", "snippets", "schedule", "collab", "analytics"];
      const targetTab = tabs.find(t => input === `> ${t}`);
      if (targetTab) {
        setActiveTab(targetTab as any);
        closePalette();
      }
    }
  };

  const closePalette = () => {
    setQuery("");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-1000 flex items-start justify-center pt-[15vh] px-4">
    
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={closePalette}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

    
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring" as const, duration: 0.4 }}
            className="relative w-full max-w-150 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
          >
        
            <div className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-slate-800">
              {query.startsWith(">") ? (
                <Terminal size={20} className="text-blue-500 mr-3 animate-pulse" />
              ) : (
                <Command size={20} className="text-slate-400 mr-3" />
              )}
              <input 
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleCommand}
                placeholder="Type '>' for commands (e.g. > task: Meeting, > dark)"
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
              />
              <div className="flex items-center gap-1 ml-2">
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-md border border-slate-200 dark:border-slate-700">ESC</span>
              </div>
            </div>

            {/* Content / Suggestions */}
            <div className="p-3">
              <div className="mb-4">
                <p className="text-[10px] text-slate-400 px-3 py-1 font-bold uppercase tracking-widest mb-2 flex justify-between">
                  <span>Quick Actions</span>
                  <span className="text-blue-500 italic lowercase">Current: {activeTab}</span>
                </p>
                
                <div className="space-y-1">
                  <button 
                    onClick={() => setQuery("> task: ")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[12px] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all group"
                  >
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                      <Plus size={14} />
                    </div>
                    <span>Create new task... <span className="text-slate-400 opacity-60 italic">(Type {`'> task: [name]'`})</span></span>
                  </button>

                  <button 
                    onClick={() => setQuery("> theme")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[12px] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all group"
                  >
                    <div className="p-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-lg group-hover:scale-110 transition-transform">
                      <Sun size={14} className="dark:hidden" />
                      <Moon size={14} className="hidden dark:block" />
                    </div>
                    <span>Toggle Interface Theme <span className="text-slate-400 opacity-60 italic">(Type {`'> theme'`})</span></span>
                  </button>

                  <button 
                    onClick={() => setQuery("> resources")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[12px] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all group"
                  >
                    <div className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                      <Layout size={14} />
                    </div>
                    <span>Go to Resources <span className="text-slate-400 opacity-60 italic">(Type {`'> resources'`})</span></span>
                  </button>
                </div>
              </div>
              
              {/* Keyboard Footer */}
              <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center px-3">
                 <div className="flex gap-4">
                    <span className="text-[9px] text-slate-400 flex items-center gap-1 italic"><Search size={10} /> Searching active...</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-400">ENTER</span>
                    <span className="text-[9px] text-slate-400">TO SELECT</span>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}