"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { 
  Copy, Check, Code2, Plus, Trash2, Search, 
  Terminal, X, FileCode, Cpu, Layers, Braces 
} from "lucide-react";
import { toast } from "sonner";

// --- Language Icon Mapping ---
const getLanguageStyle = (lang: string) => {
  switch (lang.toLowerCase()) {
    case 'typescript':
    case 'ts':
    case 'tsx':
      return { icon: <Cpu size={20} />, color: "text-blue-500", bg: "bg-blue-500/10" };
    case 'javascript':
    case 'js':
    case 'jsx':
      return { icon: <Braces size={20} />, color: "text-yellow-500", bg: "bg-yellow-500/10" };
    case 'html':
      return { icon: <FileCode size={20} />, color: "text-orange-500", bg: "bg-orange-500/10" };
    case 'css':
      return { icon: <Layers size={20} />, color: "text-indigo-500", bg: "bg-indigo-500/10" };
    default:
      return { icon: <Terminal size={20} />, color: "text-slate-500", bg: "bg-slate-500/10" };
  }
};

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSnippet, setNewSnippet] = useState({ title: "", code: "", language: "typescript", description: "" });

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setSnippets(snippets.filter(s => s.id !== id));
    toast.error("Snippet removed");
  };

  const handleAddSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSnippet.title || !newSnippet.code) return toast.error("Please fill all fields");
    
    const snippet: Snippet = {
      ...newSnippet,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    setSnippets([snippet, ...snippets]);
    setIsModalOpen(false);
    setNewSnippet({ title: "", code: "", language: "typescript", description: "" });
    toast.success("Snippet saved!");
  };

  const filteredSnippets = useMemo(() => {
    return snippets.filter(s => 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.language.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, snippets]);

  return (
    <div className="space-y-8 pb-20">
      {/* --- TOP BAR --- */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input 
            type="text"
            placeholder="Search snippets (e.g. typescript, gradient)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm"
          />
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20 active:scale-95"
        >
          <Plus size={18} />
          <span>New Snippet</span>
        </button>
      </div>

      {/* --- SNIPPETS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredSnippets.map((snippet) => {
            const { icon, color, bg } = getLanguageStyle(snippet.language);
            return (
              <motion.div
                layout
                key={snippet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm hover:border-blue-500/30 transition-all"
              >
                <div className="p-7 pb-4 flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    {/* DYNAMIC ICON BOX */}
                    <div className={`p-3 ${bg} ${color} rounded-2xl shadow-inner transition-colors`}>
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight leading-none mb-1.5">
                        {snippet.title}
                      </h3>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[9px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">
                        {snippet.language}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleCopy(snippet.code, snippet.id)}
                      className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-500 rounded-xl transition-all active:scale-90"
                    >
                      {copiedId === snippet.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                    <button 
                      onClick={() => handleDelete(snippet.id)}
                      className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="px-7 pb-7 flex-1 flex flex-col">
                  <div className="rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800/50 bg-[#0d0d0d] shadow-2xl shadow-black/20">
                    <SyntaxHighlighter
                      language={snippet.language}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: '28px',
                        fontSize: '13px',
                        lineHeight: '1.7',
                        background: 'transparent'
                      }}
                    >
                      {snippet.code}
                    </SyntaxHighlighter>
                  </div>
                  {snippet.description && (
                    <p className="mt-5 text-[11px] text-slate-400 font-medium italic leading-relaxed px-2">
                      // {snippet.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* --- ADD MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter">Vault <span className="text-blue-600 not-italic">Snippet</span></h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all"><X size={20}/></button>
              </div>

              <form onSubmit={handleAddSnippet} className="grid grid-cols-2 gap-6">
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Title</label>
                  <input 
                    type="text" placeholder="e.g. Auth Middleware" required
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500/50 outline-none text-sm transition-all dark:text-white"
                    value={newSnippet.title} onChange={(e) => setNewSnippet({...newSnippet, title: e.target.value})}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Language</label>
                  <select 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500/50 outline-none text-sm appearance-none dark:text-white cursor-pointer"
                    value={newSnippet.language} onChange={(e) => setNewSnippet({...newSnippet, language: e.target.value})}
                  >
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Code Snippet</label>
                  <textarea 
                    rows={6} placeholder="Paste your code here..." required
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500/50 outline-none text-sm font-mono transition-all dark:text-white resize-none"
                    value={newSnippet.code} onChange={(e) => setNewSnippet({...newSnippet, code: e.target.value})}
                  />
                </div>
                <button 
                  type="submit"
                  className="col-span-2 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-blue-500/20 transition-all active:scale-95 mt-4"
                >
                  Confirm & Save
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}