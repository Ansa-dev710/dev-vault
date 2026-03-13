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

  // 1. Initial Load Logic
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("dev-vault-resources");
    
    if (saved) {
      const localData: Resource[] = JSON.parse(saved);
      
      /* IMPORTANT: Agar constant.ts mein naya card aaya hai jo local storage mein nahi hai,
         toh ye logic usay dhoond kar add kar degi (Force Sync).
      */
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
      // First time user ke liye direct constants load karein
      setResources(DEV_RESOURCES);
    }
  }, []);

  // 2. Continuous Sync to LocalStorage
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
    <div className="space-y-10 min-h-screen pb-20">
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-slate-900 tracking-tight"
          >
            Resources Vault
          </motion.h1>
          <p className="text-slate-600 font-semibold mt-1">
            Your personal collection of tools and docs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar onSearch={setSearchTerm} />
          <AddResourceModal onAdd={handleAdd} />
        </div>
      </div>

      {/* --- FILTERS --- */}
      <div className="flex items-center gap-2 p-2 bg-slate-100 border border-slate-200 w-fit rounded-2xl overflow-x-auto no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all duration-300 whitespace-nowrap ${
              activeCategory === cat 
              ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200 scale-105" 
              : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredResources.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-8 flex flex-col justify-between h-64 rounded-[2.5rem] border border-slate-200 shadow-md hover:shadow-2xl hover:border-blue-200 group transition-all duration-500 relative"
              >
                {/* Delete Button */}
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-6 right-6 p-2.5 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-300 z-10"
                >
                  <Trash2 size={16} strokeWidth={2.5} />
                </button>

                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 bg-blue-100/80 px-3 py-1.5 rounded-lg">
                      {item.category}
                    </span>
                    <Folder size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mt-6 group-hover:text-blue-700 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>
                
                <div className="flex flex-col gap-1 mt-4">
                  <p className="text-[10px] text-slate-400 font-mono truncate mb-2">{item.url}</p>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-blue-600 shadow-xl shadow-slate-200 hover:shadow-blue-200 transition-all active:scale-95"
                  >
                    Open Link <ExternalLink size={14} strokeWidth={3} />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="py-32 flex flex-col items-center justify-center bg-white rounded-[4rem] border-4 border-dashed border-slate-50"
          >
            <div className="p-6 bg-slate-50 rounded-full mb-6">
              <SearchX size={48} className="text-slate-300" />
            </div>
            <p className="text-slate-800 font-black text-2xl tracking-tight">No resources found</p>
            <p className="text-slate-500 font-medium mt-1">Try a different keyword or category.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}