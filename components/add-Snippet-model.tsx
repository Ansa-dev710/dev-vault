"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Code2, Save, Terminal, Layers } from "lucide-react";
import { toast } from "sonner";

interface AddSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (snippet: any) => void;
}

const LANGUAGES = ["typescript", "javascript", "python", "html", "css", "sql", "rust"];
const CATEGORIES = ["Frontend", "Backend", "Fullstack", "UI/UX", "Database", "DevOps"];

const AddSnippetModal = ({ isOpen, onClose, onAdd }: AddSnippetModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    language: "typescript",
    category: "Frontend",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.code) {
      toast.error("Please fill in all fields");
      return;
    }

    const newSnippet = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    onAdd(newSnippet);
    setFormData({ title: "", code: "", language: "typescript", category: "Frontend" });
    onClose();
    toast.success("Snippet vault mein save ho gaya!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#0b1120] rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl text-white">
                  <Code2 size={20} />
                </div>
                <h2 className="text-xl font-black italic tracking-tighter dark:text-white text-slate-900">New <span className="text-blue-600">Snippet</span></h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Snippet Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Next.js Auth Middleware"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Language</label>
                  <div className="relative">
                    <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
                    <select 
                      value={formData.language}
                      onChange={(e) => setFormData({...formData, language: e.target.value})}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none appearance-none dark:text-white"
                    >
                      {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang.toUpperCase()}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Category</label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" size={16} />
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none appearance-none dark:text-white"
                    >
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Source Code</label>
                <textarea 
                  rows={6}
                  placeholder="Paste your code here..."
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-900 text-blue-400 font-mono text-sm border border-white/5 rounded-[2rem] outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                />
              </div>

              <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]">
                <Save size={18} /> Save to DevVault
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddSnippetModal;