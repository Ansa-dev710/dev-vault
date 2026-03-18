"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { 
  Copy, Check, Code2, Plus, 
  Trash2, Search, Terminal 
} from "lucide-react";
import { toast } from "sonner";

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  description: string;
}

export default function SnippetsSection() {
  const [snippets, setSnippets] = useState<Snippet[]>([
    {
      id: "1",
      title: "Tailwind Gradient Text",
      language: "html",
      description: "Quick way to add gradient to text in Tailwind CSS.",
      code: `<h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 font-bold">\n  Gradient Text\n</h1>`,
    },
    {
      id: "2",
      title: "Next.js API Route",
      language: "typescript",
      description: "Standard structure for a Next.js App Router API route.",
      code: `export async function GET() {\n  return Response.json({ message: "Hello World" });\n}`,
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSnippets = snippets.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* --- SNIPPETS TOP BAR --- */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search snippets by name or language..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>
        
        <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-95">
          <Plus size={16} />
          <span>New Snippet</span>
        </button>
      </div>

      {/* --- SNIPPETS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredSnippets.map((snippet) => (
            <motion.div
              key={snippet.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all"
            >
              {/* Header */}
              <div className="p-6 pb-4 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-blue-500">
                    <Terminal size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white leading-none mb-1">
                      {snippet.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                      {snippet.language}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleCopy(snippet.code, snippet.id)}
                    className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    {copiedId === snippet.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Code Area */}
              <div className="px-6 pb-6 flex-1">
                <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/50 bg-[#1e1e1e]">
                   <SyntaxHighlighter
                    language={snippet.language}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '20px',
                      fontSize: '12px',
                      lineHeight: '1.6',
                      background: 'transparent'
                    }}
                  >
                    {snippet.code}
                  </SyntaxHighlighter>
                </div>
                <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  // {snippet.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredSnippets.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
          <Code2 className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No snippets found</h3>
          <p className="text-sm text-slate-400">Try searching with a different keyword.</p>
        </div>
      )}
    </div>
  );
}