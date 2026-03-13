"use client";
import { Search, X, Command } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (Press '/' to focus search)
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

  // Handle Input Change
  const handleChange = (val: string) => {
    setQuery(val);
    onSearch(val);
  };

  // Clear Search
  const clearSearch = () => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-sm group">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
        <Search size={18} strokeWidth={2.5} />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        className="block w-full pl-11 pr-12 py-3 bg-white border border-slate-200 rounded-2xl leading-5 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 sm:text-sm transition-all shadow-sm group-hover:border-slate-300 font-medium"
        placeholder="Search vault..."
      />

      {/* Right Action Icons */}
      <div className="absolute inset-y-0 right-3 flex items-center gap-2">
        {query ? (
          <button 
            onClick={clearSearch}
            className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={16} strokeWidth={3} />
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-1 px-1.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 text-[10px] font-bold uppercase tracking-tighter pointer-events-none group-focus-within:opacity-0 transition-opacity">
            <Command size={10} /> /
          </div>
        )}
      </div>
    </div>
  );
}