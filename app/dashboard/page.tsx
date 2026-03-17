"use client";
import { useState, useEffect, useMemo } from "react";
import { DEV_RESOURCES, CATEGORIES, Resource } from "@/lib/constant";
import SearchBar from "@/components/search-bar";
import AddResourceModal from "@/components/add-resource-model";
import ResourceSkeleton from "@/components/resource-skeleton"; 
import NotesSection from "@/components/notes-section"; 
import TasksSection from "@/components/tasks-section";
import { 
  SearchX, Trash2, Moon, Sun, LayoutGrid, List, Copy, Check, 
  BarChart2, ChevronDown, LayoutDashboard, StickyNote, Box, CheckSquare 
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { toast, Toaster } from "sonner";

// --- Framer Motion Animation Settings ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 }
};

export default function DashboardPage() {
  // --- STATES ---
  const [activeTab, setActiveTab] = useState<"resources" | "notes" | "tasks">("resources");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [resources, setResources] = useState<Resource[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showStats, setShowStats] = useState(false);

  // --- INITIAL LOAD & THEME (Hydration Fix) ---
  useEffect(() => {
    setIsMounted(true);
    const savedResources = localStorage.getItem("dev-vault-resources");
    const savedTheme = localStorage.getItem("vault-theme");
    
    if (savedResources) {
      setResources(JSON.parse(savedResources));
    } else {
      setResources(DEV_RESOURCES);
      localStorage.setItem("dev-vault-resources", JSON.stringify(DEV_RESOURCES));
    }

    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
    setTimeout(() => setIsLoading(false), 1200);
  }, []);

  // --- LOGIC: Filter Resources ---
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, resources]);

  // --- LOGIC: Stats Calculation ---
  const statsData = useMemo(() => {
    return CATEGORIES.filter(c => c !== "All").map(cat => ({
      name: cat,
      count: resources.filter(r => r.category === cat).length
    }));
  }, [resources]);

  // --- HANDLERS ---
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
    toast.error("Resource removed");
  };

  const handleAddResource = (newRes: Resource) => {
    const updated = [newRes, ...resources];
    setResources(updated);
    localStorage.setItem("dev-vault-resources", JSON.stringify(updated));
    toast.success("Added to Vault!");
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 pb-32">
      <Toaster position="top-right" richColors />
      
      {/* --- FLOATING NAVIGATION --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 p-2 rounded-[2.5rem] shadow-2xl flex gap-1">
        <NavButton active={activeTab === 'resources'} onClick={() => setActiveTab("resources")} icon={<LayoutDashboard size={18} />} label="Resources" />
        <NavButton active={activeTab === 'notes'} onClick={() => setActiveTab("notes")} icon={<StickyNote size={18} />} label="Notes" />
        <NavButton active={activeTab === 'tasks'} onClick={() => setActiveTab("tasks")} icon={<CheckSquare size={18} />} label="Tasks" />
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-10">
          <div className="flex items-center gap-3">
             <motion.div whileHover={{ scale: 1.05 }} className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                <Box size={28} />
             </motion.div>
             <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">DevVault</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeTab} section</p>
             </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:max-w-xl">
            {activeTab === "resources" && (
              <>
                <SearchBar onSearch={setSearchTerm} />
                <AddResourceModal onAdd={handleAddResource} />
              </>
            )}
            <button 
              onClick={toggleTheme} 
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-blue-600 transition-all"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <AnimatePresence mode="wait">
          
          {/* 1. RESOURCES SECTION */}
          {activeTab === "resources" && (
            <motion.div key="resources" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              {/* Stats Highlights */}
              <div className="pt-2">
                <button onClick={() => setShowStats(!showStats)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 mb-4 transition-colors">
                  <BarChart2 size={14} /> {showStats ? "Hide Stats" : "Show Highlights"}
                  <motion.div animate={{ rotate: showStats ? 180 : 0 }}><ChevronDown size={14} /></motion.div>
                </button>
                <AnimatePresence>
                  {showStats && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {statsData.map((stat) => (
                          <div key={stat.name} className="bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 transition-all">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.name}</p>
                            <h4 className="text-2xl font-black dark:text-white">{stat.count}</h4>
                            <div className="mt-3 h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${(stat.count / (resources.length || 1)) * 100}%` }} className="h-full bg-blue-600" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Filters & View Mode */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-50 dark:border-slate-900/50">
                <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl overflow-x-auto no-scrollbar">
                  {CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase transition-all whitespace-nowrap ${activeCategory === cat ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>{cat}</button>
                  ))}
                </div>
                <div className="flex bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl">
                  <button onClick={() => setViewMode("grid")} className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}><LayoutGrid size={18} /></button>
                  <button onClick={() => setViewMode("list")} className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}><List size={18} /></button>
                </div>
              </div>

              {/* Resource Grid / List */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => <ResourceSkeleton key={i} />)}
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredResources.length > 0 ? (
                    <motion.div layout variants={containerVariants} initial="hidden" animate="visible" className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "max-w-4xl mx-auto space-y-4"}>
                      {filteredResources.map((item) => (
                        <motion.div key={item.id} layout variants={cardVariants} exit="exit" className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/5 transition-all overflow-hidden ${viewMode === 'grid' ? 'rounded-[2.5rem] p-8' : 'rounded-2xl p-5 flex items-center justify-between'}`}>
                          <div className={viewMode === 'grid' ? "w-full" : "flex-1"}>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-400/10 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-400/20">{item.category}</span>
                              {viewMode === 'grid' && <button onClick={() => handleDelete(item.id)} className="text-slate-200 hover:text-red-500 transition-colors p-2"><Trash2 size={16} /></button>}
                            </div>
                            <h3 className={`${viewMode === 'grid' ? 'text-xl' : 'text-lg'} font-bold text-slate-800 dark:text-white tracking-tight`}>{item.name}</h3>
                            <p className="text-slate-400 dark:text-slate-500 mt-2 text-sm line-clamp-2 leading-relaxed">{item.description}</p>
                          </div>
                          <div className={`${viewMode === 'grid' ? 'mt-8 flex gap-3' : 'flex gap-2 ml-6 shrink-0'}`}>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-[10px] font-black text-center uppercase tracking-widest hover:opacity-90 transition-all">Visit Site</a>
                            <button onClick={() => handleCopy(item.id, item.url)} className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl hover:text-blue-600 transition-colors">
                              {copiedId === item.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                            {viewMode === 'list' && <button onClick={() => handleDelete(item.id)} className="p-4 text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 opacity-20"><SearchX size={40} className="mx-auto mb-4" /><h3 className="text-xl font-bold">Nothing found</h3></motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          )}

          {/* 2. NOTES SECTION */}
          {activeTab === "notes" && (
            <motion.div key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <NotesSection />
            </motion.div>
          )}

          {/* 3. TASKS SECTION */}
          {activeTab === "tasks" && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <TasksSection />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// Helper: Navigation Button Component
function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all duration-300 ${
        active 
        ? "bg-blue-600 text-white shadow-xl shadow-blue-500/40 scale-105" 
        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
      }`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}