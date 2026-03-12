"use client";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
  return (
    <div className="relative w-full max-w-sm group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
        <Search size={18} strokeWidth={2.5} />
      </div>
      <input
        type="text"
        onChange={(e) => onSearch(e.target.value)}
        className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl leading-5 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
        placeholder="Search vault..."
      />
    </div>
  );
}