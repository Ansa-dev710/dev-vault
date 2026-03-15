"use client";
import { Search, X, Command } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut "/" to focus, but also "Escape" to blur
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    onSearch(val);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full group">
      {/* Glow Effect on Focus */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-0 group-focus-within:opacity-10 transition duration-500 blur-sm"></div>
      
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-all duration-300">
          <Search 
            size={18} 
            strokeWidth={3} 
            className={query ? "scale-110 text-blue-500" : "scale-100"} 
          />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          className="block w-full pl-12 pr-14 py-3.5 bg-white border border-slate-200/80 rounded-2xl text-sm font-bold tracking-tight text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-0 focus:border-blue-500/50 shadow-sm transition-all duration-300 group-hover:border-slate-300"
          placeholder="Search your vault..."
        />

        {/* Right Side Controls (Shortcut or Clear) */}
        <div className="absolute inset-y-0 right-4 flex items-center">
          <AnimatePresence mode="wait">
            {query ? (
              <motion.button
                key="clear-button"
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                onClick={clearSearch}
                className="p-1.5 bg-slate-100 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all group/clear"
              >
                <X size={14} strokeWidth={3} />
              </motion.button>
            ) : (
              <motion.div
                key="shortcut-indicator"
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 text-[10px] font-black uppercase tracking-widest pointer-events-none group-focus-within:opacity-0 transition-all duration-300 shadow-inner"
              >
                <Command size={10} strokeWidth={3} />
                <span>/</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Visual Feedback Line */}
      <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-blue-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
    </div>
  );
}