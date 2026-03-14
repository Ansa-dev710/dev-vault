"use client";
import { useState, useEffect } from "react";
import { DEV_RESOURCES, CATEGORIES, Resource } from "@/lib/constant";
import SearchBar from "@/components/search-bar";
import AddResourceModal from "@/components/add-resource-model";
import { ExternalLink, Folder, SearchX, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [resources, setResources] = useState<Resource[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("dev-vault-resources");
    if (saved) {
      const localData: Resource[] = JSON.parse(saved);
      const newItemsFromConstant = DEV_RESOURCES.filter(
        (def) => !localData.some((loc) => loc.id === def.id)
      );
      if (newItemsFromConstant.length > 0) {
        const updatedList = [...localData, ...newItemsFromConstant];
        setResources(updatedList);
        localStorage.setItem("dev-vault-resources", JSON.stringify(updatedList));
      } else {
        setResources(localData);
      }
    } else {
      setResources(DEV_RESOURCES);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("dev-vault-resources", JSON.stringify(resources));
    }
  }, [resources, isMounted]);

  const handleAdd = (newResource: Resource) => {
    setResources((prev) => [newResource, ...prev]);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      setResources((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const filteredResources = resources.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isMounted) return null;

  return (
    <div className="space-y-8 min-h-screen pb-20 max-w-[1400px] mx-auto px-6">
      
      {/* --- HEADER: Refined alignment and spacing --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-12">
        <div className="flex-shrink-0">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-slate-900 tracking-tight"
          >
            Resources Vault
          </motion.h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Your personal collection of tools and docs.
          </p>
        </div>

        {/* Controls: Compact sizes for Search and Button */}
        <div className="flex items-center gap-3 w-full md:w-auto mb-1">
          <div className="flex-1 md:w-72 lg:w-80">
             <SearchBar onSearch={setSearchTerm} />
          </div>
          <AddResourceModal onAdd={handleAdd} />
        </div>
      </div>

      {/* --- FILTERS: Smaller and more elegant --- */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/80 border border-slate-200/60 w-fit rounded-2xl overflow-x-auto no-scrollbar shadow-inner">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-300 whitespace-nowrap ${
              activeCategory === cat 
              ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200" 
              : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- RESOURCES GRID --- */}
      <AnimatePresence mode="popLayout">
        {filteredResources.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredResources.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-7 flex flex-col justify-between min-h-[300px] rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 group transition-all duration-500 relative overflow-hidden"
              >
                {/* Delete Button */}
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-5 right-5 p-2 bg-red-50 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-300 z-10"
                >
                  <Trash2 size={14} strokeWidth={2.5} />
                </button>

                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50/50 px-2.5 py-1 rounded-lg border border-blue-100/50">
                      {item.category}
                    </span>
                    <Folder size={18} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-800 mt-6 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>
                
                <div className="mt-8 space-y-3">
                  <p className="text-[10px] text-slate-400 font-mono truncate px-1 opacity-60">{item.url}</p>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl text-[11px] font-bold hover:bg-blue-600 shadow-md transition-all active:scale-[0.97]"
                  >
                    Open Link <ExternalLink size={14} strokeWidth={2.5} />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="py-24 flex flex-col items-center justify-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200"
          >
            <SearchX size={40} className="text-slate-300 mb-4" />
            <p className="text-slate-700 font-bold text-xl tracking-tight">No resources found</p>
            <p className="text-slate-400 text-sm mt-1">Try a different keyword or category.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}