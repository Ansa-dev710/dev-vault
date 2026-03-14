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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

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
      description: `New ${formData.category} resource added on ${new Date().toLocaleDateString()}`
    };
    
    onAdd(newResource);
    setIsOpen(false);
    setFormData({ name: "", url: "", category: "Tools" });
  };

  return (
    <>
      {/* --- TRIGGER BUTTON: Compact size to match Search Bar --- */}
      <motion.button 
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)} 
        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 shrink-0"
      >
        <Plus size={18} strokeWidth={2.5} /> 
        <span className="hidden sm:inline">New Resource</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          >
            <motion.div 
              ref={modalRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-7 md:p-9 rounded-[2rem] w-full max-w-md shadow-2xl relative border border-slate-100"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 p-1.5 rounded-lg transition-all"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-50">
                  <Zap className="text-white fill-current" size={20} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add Resource</h2>
                <p className="text-slate-500 font-medium text-xs mt-0.5">Keep your vault updated with the best tools.</p>
              </div>
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  {/* Tool Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tool Name</label>
                    <input 
                      required 
                      value={formData.name} 
                      className="w-full bg-slate-50/50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-4 ring-blue-500/5 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-700 text-sm placeholder:font-medium" 
                      placeholder="e.g. Tailwind CSS" 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>

                  {/* URL */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Website URL</label>
                    <div className="relative">
                       <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                       <input 
                         required 
                         type="url" 
                         value={formData.url} 
                         className="w-full bg-slate-50/50 border border-slate-200 px-4 pl-11 py-3 rounded-xl focus:ring-4 ring-blue-500/5 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-slate-600 text-sm" 
                         placeholder="https://example.com" 
                         onChange={(e) => setFormData({...formData, url: e.target.value})} 
                       />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Classification</label>
                    <div className="relative">
                      <select 
                        value={formData.category} 
                        className="w-full bg-slate-50/50 border border-slate-200 px-4 py-3 rounded-xl outline-none appearance-none cursor-pointer font-bold text-slate-700 text-sm focus:ring-4 ring-blue-500/5 transition-all" 
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                        {CATEGORIES.filter(c => c !== "All").map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300" size={16} />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm mt-2 hover:bg-blue-600 transition-all shadow-lg shadow-slate-100 hover:shadow-blue-100"
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