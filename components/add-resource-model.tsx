"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, X, Link as LinkIcon, Briefcase, Zap } from "lucide-react";
import { CATEGORIES, Resource } from "@/lib/constant";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onAdd: (resource: Resource) => void;
}

export default function AddResourceModal({ onAdd }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", url: "", category: "Tools" });
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newResource: Resource = {
      ...formData,
      id: Date.now(),
      category: formData.category as any,
      description: `Resource added from vault on ${new Date().toLocaleDateString()}`
    };
    
    onAdd(newResource);
    setIsOpen(false);
    setFormData({ name: "", url: "", category: "Tools" });
  };

  return (
    <>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)} 
        className="flex items-center gap-2 bg-blue-600 text-white px-7 py-3.5 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
      >
        <Plus size={20} strokeWidth={3} /> 
        <span className="hidden md:inline">New Resource</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-100 p-4"
          >
            <motion.div 
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white p-10 rounded-[3rem] w-full max-w-lg shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] relative border border-slate-100"
            >
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-full transition-all"
              >
                <X size={20} />
              </button>

              <div className="mb-10">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
                  <Zap className="text-white fill-current" size={24} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Add Resource</h2>
                <p className="text-slate-500 font-medium text-sm">Keep your vault updated with the best tools.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tool Name</label>
                    <input 
                      required 
                      value={formData.name} 
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 ring-blue-500/5 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-700" 
                      placeholder="e.g. Framer Motion" 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Website URL</label>
                    <div className="relative">
                       <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                         required 
                         type="url" 
                         value={formData.url} 
                         className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl focus:ring-4 ring-blue-500/5 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-slate-600" 
                         placeholder="https://framer.com/motion" 
                         onChange={(e) => setFormData({...formData, url: e.target.value})} 
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Classification</label>
                    <div className="relative">
                      <select 
                        value={formData.category} 
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none appearance-none cursor-pointer font-bold text-slate-700 focus:ring-4 ring-blue-500/5 transition-all" 
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                        {CATEGORIES.filter(c => c !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Briefcase size={18} />
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full bg-slate-900 text-white py-4 rounded-[3x] font-black text-lg mt-4 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
                >
                  Save to Vault
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}