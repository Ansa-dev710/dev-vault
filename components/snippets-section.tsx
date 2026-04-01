"use client";
import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Copy, Check, Search, Code2, Plus, Terminal, 
  X, Calendar, Edit3, Trash2, Share2 
} from "lucide-react";
import { toast } from "sonner";
import AddSnippetModal from "./add-Snippet-model";

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  category: string;
  createdAt?: string;
}

const SnippetSkeleton = () => (
  <div className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 animate-pulse shadow-sm">
    <div className="flex justify-between mb-6">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-slate-200 dark:bg-white/5 rounded-xl"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 dark:bg-white/5 rounded"></div>
          <div className="h-3 w-16 bg-slate-200 dark:bg-white/5 rounded"></div>
        </div>
      </div>
      <div className="w-10 h-10 bg-slate-200 dark:bg-white/5 rounded-xl"></div>
    </div>
    <div className="h-32 bg-slate-200 dark:bg-white/5 rounded-2xl w-full"></div>
  </div>
);

const SnippetsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ["All", "Frontend", "Backend", "Fullstack", "UI/UX", "Database"];

  const defaultSnippets: Snippet[] = [
    {
      id: "1",
      title: "Next.js API Route Handler",
      language: "typescript",
      category: "Backend",
      createdAt: "20 Mar 2024",
      code: `export async function GET(request: Request) {\n  return new Response(JSON.stringify({ message: "Hello World" }), {\n    status: 200,\n    headers: { 'Content-Type': 'application/json' },\n  });\n}`
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem("dev-vault-snippets");
    const timer = setTimeout(() => {
      setSnippets(saved ? JSON.parse(saved) : defaultSnippets);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddSnippet = (newSnippet: Snippet) => {
    const updated = [newSnippet, ...snippets];
    setSnippets(updated);
    localStorage.setItem("dev-vault-snippets", JSON.stringify(updated));
  };

  const handleDeleteSnippet = (id: string) => {
    const updated = snippets.filter(s => s.id !== id);
    setSnippets(updated);
    localStorage.setItem("dev-vault-snippets", JSON.stringify(updated));
    setSelectedSnippet(null);
    toast.error("Snippet deleted from vault");
  };

  const handleCopy = (e: React.MouseEvent | null, code: string, id: string) => {
    if (e) e.stopPropagation(); 
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSnippets = snippets.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full relative">
      {/* --- CLEANED HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600/60 mb-2">
             <span className="w-4 h-[1px] bg-blue-600/30"></span>
             Workspace / Snippets
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter dark:text-white text-slate-900 leading-none">
            Code <span className="text-blue-600">Vault.</span>
          </h2>
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest pl-1">
            Reusable Logic Hub
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search snippets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 w-full md:w-80 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm dark:text-white backdrop-blur-md"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-4 bg-blue-600 text-white rounded-2xl hover:scale-105 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus size={22} />
          </button>
        </div>
      </div>

      {/* --- CATEGORY FILTERS --- */}
      <div className="flex flex-wrap gap-3 mb-12 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              activeCategory === cat
                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/40"
                : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 text-slate-400 hover:border-blue-500/50"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* --- SNIPPETS GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <SnippetSkeleton key={i} />)
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredSnippets.map((snippet) => (
              <motion.div
                key={snippet.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setSelectedSnippet(snippet)}
                className="group cursor-pointer relative bg-white dark:bg-[#0b1120]/80 border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500"
              >
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500 group-hover:rotate-12 transition-transform">
                      <Terminal size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 tracking-tight">{snippet.title}</h3>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{snippet.language}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => handleCopy(e, snippet.code, snippet.id)}
                    className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-blue-500 transition-all"
                  >
                    {copiedId === snippet.id ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                  </button>
                </div>

                <div className="relative text-sm h-44 overflow-hidden group-hover:h-48 transition-all duration-500">
                  <SyntaxHighlighter
                    language={snippet.language}
                    style={atomDark}
                    customStyle={{ margin: 0, padding: '2rem', background: 'transparent', fontSize: '13px', lineHeight: '1.6' }}
                  >
                    {snippet.code}
                  </SyntaxHighlighter>
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0b1120] via-transparent to-transparent opacity-80" />
                </div>
                
                <div className="px-8 py-4 flex justify-between items-center bg-slate-50/30 dark:bg-white/5">
                   <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[9px] font-black rounded-lg uppercase tracking-widest">{snippet.category}</span>
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">View Full Code →</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* --- DRAWER --- */}
      <AnimatePresence>
        {selectedSnippet && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedSnippet(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[150]"
            />
            
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-[#020617] z-[160] shadow-[-20px_0_100px_rgba(0,0,0,0.5)] border-l border-slate-200 dark:border-white/10 flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedSnippet(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500">
                    <X size={24} />
                  </button>
                  <h2 className="text-xl font-bold dark:text-white tracking-tight italic text-slate-900">Snippet <span className="text-blue-500 font-normal not-italic">Inspector</span></h2>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDeleteSnippet(selectedSnippet.id)}
                    className="p-3 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/25">
                    <Edit3 size={16} /> Edit
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                <div className="space-y-6">
                  <h1 className="text-4xl font-black tracking-tighter dark:text-white text-slate-900 leading-tight">{selectedSnippet.title}</h1>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 dark:border-white/5">
                      <Terminal size={14} className="text-blue-500" /> {selectedSnippet.language}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-500 border border-blue-500/10">
                      <Code2 size={14} /> {selectedSnippet.category}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Calendar size={14} /> {selectedSnippet.createdAt}
                    </div>
                  </div>
                </div>

                <div className="relative group rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/10 bg-[#0d1117] shadow-2xl">
                   <div className="absolute top-6 right-6 z-10 flex gap-2">
                     <button className="p-3 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-xl text-white transition-all"><Share2 size={18} /></button>
                     <button 
                        onClick={() => handleCopy(null, selectedSnippet.code, selectedSnippet.id)}
                        className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg"
                     >
                        {copiedId === selectedSnippet.id ? <Check size={18} /> : <Copy size={18} />}
                     </button>
                   </div>
                   <SyntaxHighlighter
                    language={selectedSnippet.language}
                    style={atomDark}
                    customStyle={{ margin: 0, padding: '3rem', background: 'transparent', fontSize: '15px', lineHeight: '1.8' }}
                  >
                    {selectedSnippet.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AddSnippetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddSnippet} 
      />
    </div>
  );
};

export default SnippetsSection;