"use client";
import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Search, Code2, Plus, Terminal, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  category: string;
}

const SnippetsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  // Sample Data (Agar local storage khali ho)
  const defaultSnippets: Snippet[] = [
    {
      id: "1",
      title: "Next.js API Route Handler",
      language: "typescript",
      category: "Backend",
      code: `export async function GET(request: Request) {\n  return new Response(JSON.stringify({ message: "Hello World" }), {\n    status: 200,\n    headers: { 'Content-Type': 'application/json' },\n  });\n}`
    },
    {
      id: "2",
      title: "Tailwind Center Div",
      language: "html",
      category: "CSS",
      code: `<div className="flex items-center justify-center min-h-screen">\n  \n</div>`
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem("dev-vault-snippets");
    setSnippets(saved ? JSON.parse(saved) : defaultSnippets);
  }, []);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSnippets = snippets.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 pb-32">
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
        <AnimatePresence mode="popLayout">
          {filteredSnippets.map((snippet) => (
            <motion.div
              key={snippet.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-500"
            >
              {/* Card Top Bar */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                    <Terminal size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 tracking-tight">{snippet.title}</h3>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{snippet.language}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                   <button 
                    onClick={() => handleCopy(snippet.code, snippet.id)}
                    className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-blue-500 transition-all"
                  >
                    {copiedId === snippet.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Code Block */}
              <div className="relative text-sm">
                <SyntaxHighlighter
                  language={snippet.language}
                  style={atomDark}
                  customStyle={{
                    margin: 0,
                    padding: '2rem',
                    background: 'transparent',
                    fontSize: '13px',
                    lineHeight: '1.6',
                  }}
                >
                  {snippet.code}
                </SyntaxHighlighter>
                
                {/* Floating Category Tag */}
                <div className="absolute bottom-6 right-8">
                  <span className="px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400">
                    {snippet.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {filteredSnippets.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex p-6 bg-slate-100 dark:bg-white/5 rounded-full mb-4 text-slate-300">
            <Code2 size={40} />
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No snippets found matching your search</p>
        </div>
      )}
    </div>
  );
};

export default SnippetsSection;