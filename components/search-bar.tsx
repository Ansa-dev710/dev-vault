"use client";
import { Search, X, Command } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
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
    <div className="relative w-full md:w-72 lg:w-80 group">
      {/* Icon size and position adjusted for smaller height */}
      <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
        <Search size={16} strokeWidth={2.5} />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        // SIZE FIX: py-3.5 se kam kar ke py-2.5 kiya aur rounded-xl kiya
        className="block w-full pl-10 pr-12 py-2.5 bg-white border border-slate-200 rounded-xl text-sm leading-5 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm group-hover:border-slate-300 font-medium text-slate-700"
        placeholder="Search vault..."
      />

      <div className="absolute inset-y-0 right-3 flex items-center gap-2">
        <AnimatePresence mode="wait">
          {query ? (
            <motion.button
              key="clear-button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearSearch}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-all"
            >
              <X size={14} strokeWidth={3} />
            </motion.button>
          ) : (
            <motion.div
              key="shortcut-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-slate-400 text-[9px] font-bold uppercase tracking-tighter pointer-events-none group-focus-within:opacity-0 transition-opacity duration-200"
            >
              <Command size={9} /> <span>/</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}