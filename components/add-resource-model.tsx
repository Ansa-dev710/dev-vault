"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, X, Link as LinkIcon, Briefcase, Zap, AlignLeft } from "lucide-react";
import { CATEGORIES, Resource } from "@/lib/constant";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onAdd: (resource: Resource) => void;
}

export default function AddResourceModal({ onAdd }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    url: "", 
    category: "Tools",
    description: "" 
  });
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
      description: formData.description || `New ${formData.category} resource added on ${new Date().toLocaleDateString()}`
    };
    
    onAdd(newResource);
    setIsOpen(false);
    // Form reset
    setFormData({ name: "", url: "", category: "Tools", description: "" });
  };

  return (
    <>
      <motion.button 
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)} 
        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 shrink-0"
      >
        <Plus size={20} strokeWidth={3} /> 
        <span className="hidden sm:inline">Add Resource</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4"
          >
            <motion.div 
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white p-8 md:p-10 rounded-[3rem] w-full max-w-lg shadow-2xl relative border border-slate-100 overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />

              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-xl transition-all"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <Zap size={24} className="fill-current" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">New Asset</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">Add a high-quality resource to your personal vault.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 ml-1">Tool/Resource Name</label>
                    <input 
                      required 
                      value={formData.name} 
                      className="w-full bg-slate-50 border-2 border-transparent px-5 py-4 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300" 
                      placeholder="e.g. Framer Motion" 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>

                  {/* URL Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 ml-1">Access URL</label>
                    <div className="relative">
                       <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                         required 
                         type="url" 
                         value={formData.url} 
                         className="w-full bg-slate-50 border-2 border-transparent px-5 pl-12 py-4 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-600" 
                         placeholder="https://framer.com/motion" 
                         onChange={(e) => setFormData({...formData, url: e.target.value})} 
                       />
                    </div>
                  </div>

                  {/* Description Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 ml-1">Brief Description (Optional)</label>
                    <div className="relative">
                      <AlignLeft className="absolute left-4 top-4 text-slate-300" size={18} />
                      <textarea 
                        value={formData.description} 
                        rows={2}
                        className="w-full bg-slate-50 border-2 border-transparent px-5 pl-12 py-4 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-600 resize-none" 
                        placeholder="What makes this resource useful?" 
                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                      />
                    </div>
                  </div>

                  {/* Category & Submit */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 ml-1">Category</label>
                      <div className="relative">
                        <select 
                          value={formData.category} 
                          className="w-full bg-slate-50 border-2 border-transparent px-5 py-4 rounded-2xl outline-none appearance-none cursor-pointer font-bold text-slate-700 focus:border-blue-500 transition-all" 
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                          {CATEGORIES.filter(c => c !== "All").map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300" size={18} />
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-sm mt-4 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 hover:shadow-blue-200 uppercase tracking-widest"
                >
                  Confirm & Save
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}