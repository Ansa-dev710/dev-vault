"use client";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { CATEGORIES } from "@/lib/constant";

export default function AddResourceModal({ onAdd }: { onAdd: (resource: any) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", url: "", category: "Tools" });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...formData, id: Date.now() });
    setIsOpen(false);
    setFormData({ name: "", url: "", category: "Tools" });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
        <Plus size={20} strokeWidth={3} /> <span className="hidden md:inline">New Resource</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative border border-white">
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Add Entry</h2>
            <p className="text-slate-500 mb-8 font-medium text-sm">Save a new tool to your vault.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Name</label>
                <input required value={formData.name} className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-2xl focus:ring-4 ring-blue-500/10 focus:bg-white outline-none transition-all" placeholder="e.g. Lucide Icons" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">URL</label>
                <input required type="url" value={formData.url} className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-2xl focus:ring-4 ring-blue-500/10 focus:bg-white outline-none transition-all" placeholder="https://..." onChange={(e) => setFormData({...formData, url: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                <select value={formData.category} className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-2xl outline-none appearance-none cursor-pointer" onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  {CATEGORIES.filter(c => c !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg mt-4 hover:bg-blue-600 transition-all active:scale-[0.98] shadow-xl shadow-slate-200">
                Save to Vault
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}