"use client";
import { useState, useEffect } from "react";
import { DEV_RESOURCES, CATEGORIES, Resource } from "@/lib/constant";
import SearchBar from "@/components/search-bar";
import AddResourceModal from "@/components/add-resource-model";
import ResourceSkeleton from "@/components/resource-skeleton"; 
import { 
  SearchX, Trash2, Moon, Sun, LayoutGrid, List, Copy, Check, BarChart2, ChevronDown 
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { toast } from "sonner";

// --- ANIMATION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  },
  hover: { 
    y: -8, 
    transition: { type: "spring", stiffness: 300 } 
  }
};

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [resources, setResources] = useState<Resource[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedResources = localStorage.getItem("dev-vault-resources");
    const savedTheme = localStorage.getItem("vault-theme");
    
    if (savedResources) setResources(JSON.parse(savedResources));
    else setResources(DEV_RESOURCES);

    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("vault-theme", nextDark ? "dark" : "light");
  };

  const handleCopy = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Link copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: number) => {
    const updated = resources.filter((item) => item.id !== id);
    setResources(updated);
    localStorage.setItem("dev-vault-resources", JSON.stringify(updated));
    toast.error("Deleted successfully");
  };

  // Stats logic
  const statsData = CATEGORIES.filter(c => c !== "All").map(cat => ({
    name: cat,
    count: resources.filter(r => r.category === cat).length
  }));

  const filteredResources = resources.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors pb-20">
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter shrink-0"
          >
            Resource Vault<span className="text-blue-600"></span>
          </motion.h1>

          <div className="flex items-center gap-3 w-full lg:max-w-xl">
            <div className="flex-1 min-w-0">
              <SearchBar onSearch={setSearchTerm} />
            </div>
            <div className="shrink-0">
              <AddResourceModal onAdd={(res) => setResources([res, ...resources])} />
            </div>
            <button 
              onClick={toggleTheme} 
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-blue-600 transition-all shrink-0"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* --- ANALYTICS TOGGLE & SECTION --- */}
        <div className="pt-2">
          <button 
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-4"
          >
            <BarChart2 size={14} /> {showStats ? "Hide Highlights" : "Show Highlights"}
            <motion.div animate={{ rotate: showStats ? 180 : 0 }}><ChevronDown size={14} /></motion.div>
          </button>

          <AnimatePresence>
            {showStats && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6">
                  {statsData.map((stat) => (
                    <motion.div 
                      key={stat.name}
                      whileHover={{ y: -5 }}
                      className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 shadow-sm"
                    >
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/5 rounded-full blur-2xl" />
                      <div className="relative z-10 flex justify-between items-start mb-4">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.name}</span>
                        <div className="bg-blue-50 dark:bg-blue-500/10 p-2 rounded-xl">
                          <BarChart2 size={12} className="text-blue-600" />
                        </div>
                      </div>
                      <div className="relative z-10 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.count}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">pcs</span>
                      </div>
                      <div className="relative z-10 mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${(stat.count / (resources.length || 1)) * 100}%` }} 
                          transition={{ duration: 1 }} 
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.2)]" 
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- FILTERS & VIEW MODE --- */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-50 dark:border-slate-900/50">
          <div className="flex items-center gap-2 p-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-xl overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                  activeCategory === cat ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-xl">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}><LayoutGrid size={16} /></button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}><List size={16} /></button>
          </div>
        </div>

        {/* --- CARDS GRID --- */}
        {isLoading ? <ResourceSkeleton /> : (
          <AnimatePresence mode="popLayout">
            {filteredResources.length > 0 ? (
              <motion.div 
                layout 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {filteredResources.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-400/10 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-400/20">
                          {item.category}
                        </span>
                        <button onClick={() => handleDelete(item.id)} className="text-slate-200 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{item.name}</h3>
                      <p className="text-slate-400 dark:text-slate-500 mt-2 text-sm line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                    
                    <div className="mt-8 flex gap-3">
                      <motion.a 
                        whileTap={{ scale: 0.95 }}
                        href={item.url} 
                        target="_blank" 
                        className="flex-1 text-center py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-[10px] font-black hover:opacity-90 transition-all uppercase tracking-widest"
                      >
                        Visit Site
                      </motion.a>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCopy(item.id, item.url)} 
                        className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl hover:text-blue-600 transition-colors"
                      >
                        {copiedId === item.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20 opacity-20">
                <SearchX size={48} className="mx-auto mb-4" />
                <p className="font-bold uppercase tracking-widest text-xs">Empty Vault</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}