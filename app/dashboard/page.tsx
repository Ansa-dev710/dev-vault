"use client";
import { useState, useEffect, useMemo } from "react";
import { DEV_RESOURCES, CATEGORIES, Resource } from "@/lib/constant";
import SearchBar from "@/components/search-bar";
import AddResourceModal from "@/components/add-resource-model";
import ResourceSkeleton from "@/components/resource-skeleton"; 
import NotesSection from "@/components/notes-section"; 
import TasksSection from "@/components/tasks-section"; 
import SnippetsSection from "@/components/snippets-section"; 
import ScheduleSection from "@/components/sechdule-section";

import { 
  Trash2, Moon, Sun, Copy, Check, 
  LayoutDashboard, StickyNote, CheckSquare, Code2, Sparkles, Calendar as CalendarIcon
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { toast, Toaster } from "sonner";

// --- 1. ANIMATION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  exit: { scale: 0.95, opacity: 0 }
};

// --- 2. HELPER COMPONENTS ---
function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex items-center gap-3 px-6 py-3.5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500 overflow-hidden ${
        active 
        ? "text-white scale-105" 
        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      }`}
    >
      {active && (
        <motion.div 
          layoutId="nav-bg"
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/40"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{icon}</span>
      <span className="relative z-10 hidden md:inline">{label}</span>
    </button>
  );
}

// --- 3. MAIN DASHBOARD PAGE ---
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"resources" | "notes" | "tasks" | "snippets" | "schedule">("resources");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [resources, setResources] = useState<Resource[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Lifecycle & Theme Init
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
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Filter Logic
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, resources]);

  // Actions
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
    <div className="min-h-screen bg-white dark:bg-[#020617] transition-colors duration-700 pb-32 selection:bg-blue-500 selection:text-white">
      <Toaster position="top-right" richColors />
      
      {/* --- FLOATING NAVIGATION --- */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 p-2 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] flex gap-1 items-center">
        <NavButton active={activeTab === 'resources'} onClick={() => setActiveTab("resources")} icon={<LayoutDashboard size={18} />} label="Resources" />
        <NavButton active={activeTab === 'snippets'} onClick={() => setActiveTab("snippets")} icon={<Code2 size={18} />} label="Snippets" />
        <NavButton active={activeTab === 'schedule'} onClick={() => setActiveTab("schedule")} icon={<CalendarIcon size={18} />} label="Schedule" />
        <NavButton active={activeTab === 'notes'} onClick={() => setActiveTab("notes")} icon={<StickyNote size={18} />} label="Notes" />
        <NavButton active={activeTab === 'tasks'} onClick={() => setActiveTab("tasks")} icon={<CheckSquare size={18} />} label="Tasks" />
      </nav>

      <div className="max-w-7xl mx-auto px-10">
        
        {/* --- STYLED HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-20 pb-10 mb-12 border-b border-slate-100 dark:border-slate-900">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="text-blue-500 animate-pulse" size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Workspace / {activeTab}</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter capitalize italic">
              {activeTab}<span className="text-blue-600 not-italic">.</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md leading-relaxed">
              Curate and manage your <span className="text-slate-900 dark:text-slate-200 font-bold underline decoration-blue-500/30">digital ecosystem</span> with precision.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-full md:w-80 lg:w-[400px] group">
              <SearchBar onSearch={setSearchTerm} />
            </div>
            <div className="flex items-center gap-2">
              {activeTab === "resources" && (
                <AddResourceModal onAdd={handleAddResource} />
              )}
              <button 
                onClick={toggleTheme} 
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm active:scale-90"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT AREA --- */}
        <AnimatePresence mode="wait">
          
          {/* RESOURCES TAB */}
          {activeTab === "resources" && (
            <motion.div key="resources" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)} 
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeCategory === cat 
                      ? "bg-slate-900 dark:bg-blue-600 text-white shadow-lg scale-105" 
                      : "bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map(i => <ResourceSkeleton key={i} />)}
                </div>
              ) : (
                <motion.div layout variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredResources.map((item) => (
                    <motion.div 
                      key={item.id} 
                      layout 
                      variants={cardVariants} 
                      whileHover={{ y: -8 }}
                      className="group bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-8 rounded-[3rem] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all relative"
                    >
                      <div className="flex justify-between items-center mb-8">
                        <div className="px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase rounded-full border border-blue-100/50 dark:border-blue-500/20 tracking-tighter">
                          {item.category}
                        </div>
                        <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all translate-x-2 group-hover:translate-x-0">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-3">
                        {item.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-10">
                        {item.description}
                      </p>

                      <div className="flex gap-3 mt-auto">
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 px-6 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-[1.5rem] text-[10px] font-black text-center uppercase tracking-widest hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95"
                        >
                          Visit Platform
                        </a>
                        <button 
                          onClick={() => handleCopy(item.id, item.url)} 
                          className="p-4 bg-slate-50 dark:bg-slate-800/50 text-slate-400 rounded-[1.5rem] hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                        >
                          {copiedId === item.id ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* SCHEDULE TAB */}
          {activeTab === "schedule" && (
            <motion.div key="schedule" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ScheduleSection />
            </motion.div>
          )}

          {/* SNIPPETS TAB */}
          {activeTab === "snippets" && (
            <motion.div key="snippets" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SnippetsSection />
            </motion.div>
          )}

          {/* NOTES TAB */}
          {activeTab === "notes" && (
            <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <NotesSection />
            </motion.div>
          )}

          {/* TASKS TAB */}
          {activeTab === "tasks" && (
            <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
              <TasksSection />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}