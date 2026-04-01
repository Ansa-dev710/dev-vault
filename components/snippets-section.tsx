"use client";
import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Search, Code2, Plus, Terminal, X, Calendar, Edit3 } from "lucide-react";
import { toast } from "sonner";

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  category: string;
  createdAt?: string; // Metadata ke liye
}

// --- Skeleton Component ---
const SnippetSkeleton = () => (
  <div className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 animate-pulse">
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);

  const defaultSnippets: Snippet[] = [
    {
      id: "1",
      title: "Next.js API Route Handler",
      language: "typescript",
      category: "Backend",
      createdAt: "2024-03-20",
      code: `export async function GET(request: Request) {\n  return new Response(JSON.stringify({ message: "Hello World" }), {\n    status: 200,\n    headers: { 'Content-Type': 'application/json' },\n  });\n}`
    },
    {
      id: "2",
      title: "Tailwind Center Div",
      language: "html",
      category: "CSS",
      createdAt: "2024-03-21",
      code: `<div className="flex items-center justify-center min-h-screen">\n  \n</div>`
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem("dev-vault-snippets");
    setTimeout(() => { // Realistic loading feel
      setSnippets(saved ? JSON.parse(saved) : defaultSnippets);
      setLoading(false);
    }, 1200);
  }, []);

  const handleCopy = (e: React.MouseEvent, code: string, id: string) => {
    e.stopPropagation(); // Card click event ko rokne ke liye
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Code copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSnippets = snippets.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 pb-32 relative">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h2 className="text-4xl font-black italic tracking-tighter dark:text-white">
            Code <span className="text-blue-600">Vault.</span>
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Reusable Logic & Components</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search snippets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 w-full md:w-80 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm dark:text-white"
            />
          </div>
          <button className="p-3.5 bg-blue-600 text-white rounded-2xl hover:scale-105 transition-all shadow-lg shadow-blue-500/20">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Snippets Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <SnippetSkeleton key={i} />)
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredSnippets.map((snippet) => (
              <motion.div
                key={snippet.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setSelectedSnippet(snippet)}
                className="group cursor-pointer relative bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500"
              >
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 group-hover:scale-110 transition-transform">
                      <Terminal size={16} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 tracking-tight">{snippet.title}</h3>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{snippet.language}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => handleCopy(e, snippet.code, snippet.id)}
                    className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-blue-500 transition-all"
                  >
                    {copiedId === snippet.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>

                <div className="relative text-sm h-48 overflow-hidden group-hover:h-52 transition-all duration-500">
                  <SyntaxHighlighter
                    language={snippet.language}
                    style={atomDark}
                    customStyle={{ margin: 0, padding: '2rem', background: 'transparent', fontSize: '13px' }}
                  >
                    {snippet.code}
                  </SyntaxHighlighter>
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0b1120] via-transparent to-transparent opacity-60" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* --- SLIDE-OVER DRAWER --- */}
      <AnimatePresence>
        {selectedSnippet && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedSnippet(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-[#0b1120] z-[70] shadow-[-20px_0_50px_rgba(0,0,0,0.2)] border-l border-slate-200 dark:border-white/10 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedSnippet(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                    <X size={20} className="dark:text-white" />
                  </button>
                  <h2 className="text-xl font-bold dark:text-white">Snippet Details</h2>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
                    <Edit3 size={16} /> Edit
                  </button>
                </div>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="space-y-4">
                  <h1 className="text-3xl font-black tracking-tighter dark:text-white">{selectedSnippet.title}</h1>
                  <div className="flex flex-wrap gap-3">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-slate-500 uppercase">
                      <Terminal size={12} /> {selectedSnippet.language}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 rounded-full text-[10px] font-bold text-blue-600 uppercase">
                      {selectedSnippet.category}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-slate-500 uppercase">
                      <Calendar size={12} /> {selectedSnippet.createdAt || "No Date"}
                    </span>
                  </div>
                </div>

                <div className="relative group rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-[#1a1b26]">
                   <div className="absolute top-4 right-4 z-10">
                     <button 
                      onClick={(e) => handleCopy(e, selectedSnippet.code, selectedSnippet.id)}
                      className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-all"
                     >
                        {copiedId === selectedSnippet.id ? <Check size={16} /> : <Copy size={16} />}
                     </button>
                   </div>
                   <SyntaxHighlighter
                    language={selectedSnippet.language}
                    style={atomDark}
                    customStyle={{ margin: 0, padding: '2.5rem', background: 'transparent', fontSize: '14px', lineHeight: '1.7' }}
                  >
                    {selectedSnippet.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SnippetsSection;