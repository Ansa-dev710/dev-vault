"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, X, Link as LinkIcon, Briefcase, Zap, AlignLeft, CheckCircle2 } from "lucide-react";
import { CATEGORIES, Resource } from "@/lib/constant";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onAdd: (resource: Resource) => void;
}

export default function AddResourceModal({ onAdd }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    url: "", 
    category: "Tools",
    description: "" 
  });
  
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus logic when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Artificial delay for premium feel & to show saving state
    await new Promise(resolve => setTimeout(resolve, 800));

    const newResource: Resource = {
      ...formData,
      id: Date.now(),
      category: formData.category as any,
      description: formData.description || `High-quality ${formData.category} asset.`
    };
    
    onAdd(newResource);
    setIsSaving(false);
    setIsOpen(false);
    setFormData({ name: "", url: "", category: "Tools", description: "" });
  };

  return (
    <>
      <motion.button 
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)} 
        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 dark:shadow-blue-900/20 shrink-0"
      >
        <Plus size={18} strokeWidth={3} /> 
        <span className="hidden sm:inline uppercase tracking-wider">Add Resource</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
          >
            <motion.div 
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              {/* Background Accent Gradient */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-500" />

              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-xl transition-all"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <Zap size={24} className="fill-current" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">New Asset</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Scale your productivity by adding a new tool.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Resource Name</label>
                    <input 
                      ref={nameInputRef}
                      required 
                      disabled={isSaving}
                      value={formData.name} 
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent px-5 py-4 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-700" 
                      placeholder="e.g. Framer Motion" 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>

                  {/* URL Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Access URL</label>
                    <div className="relative">
                       <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700" size={18} />
                       <input 
                         required 
                         disabled={isSaving}
                         type="url" 
                         value={formData.url} 
                         className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent px-5 pl-12 py-4 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-medium text-slate-600 dark:text-slate-300" 
                         placeholder="https://framer.com/motion" 
                         onChange={(e) => setFormData({...formData, url: e.target.value})} 
                       />
                    </div>
                  </div>

                  {/* Description Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Description (Optional)</label>
                    <div className="relative">
                      <AlignLeft className="absolute left-4 top-4 text-slate-300 dark:text-slate-700" size={18} />
                      <textarea 
                        disabled={isSaving}
                        value={formData.description} 
                        rows={2}
                        className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent px-5 pl-12 py-4 rounded-2xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-medium text-slate-600 dark:text-slate-300 resize-none" 
                        placeholder="Why is this useful?" 
                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                      />
                    </div>
                  </div>

                  {/* Category Dropdown */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Category</label>
                    <div className="relative">
                      <select 
                        disabled={isSaving}
                        value={formData.category} 
                        className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent px-5 py-4 rounded-2xl outline-none appearance-none cursor-pointer font-bold text-slate-700 dark:text-slate-200 focus:border-blue-500 transition-all" 
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                        {CATEGORIES.filter(c => c !== "All").map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 dark:text-slate-700" size={18} />
                    </div>
                  </div>
                </div>

                <motion.button 
                  whileHover={!isSaving ? { scale: 1.01 } : {}}
                  whileTap={!isSaving ? { scale: 0.98 } : {}}
                  type="submit" 
                  disabled={isSaving}
                  className={`w-full py-5 rounded-[1.5rem] font-black text-sm mt-4 transition-all shadow-xl uppercase tracking-widest flex items-center justify-center gap-2 ${
                    isSaving 
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed" 
                    : "bg-slate-900 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 shadow-slate-200 dark:shadow-none"
                  }`}
                >
                  {isSaving ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full"
                      />
                      Saving Asset...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Confirm & Save
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}