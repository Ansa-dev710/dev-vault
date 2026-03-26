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
import CollaborationSection from "@/components/collabration-section";
import AnalyticsSection from "@/components/AnalyticsDashboard"; 

import { 
  Trash2, Moon, Sun, Copy, Check, 
  LayoutDashboard, StickyNote, CheckSquare, Code2, Sparkles, 
  Calendar as CalendarIcon, Users, BarChart3 
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
      // flex-shrink-0 is the most important class here to prevent the button from collapsing
      className={`relative flex items-center gap-3 px-6 py-3.5 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 flex-shrink-0 whitespace-nowrap ${
        active 
        ? "text-white scale-105" 
        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      }`}
    >
      {active && (
        <motion.div 
          layoutId="nav-bg"
          className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-500/30"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          style={{ borderRadius: '2.5rem' }}
        />
      )}
      <span className="relative z-10">{icon}</span>
      <span className="relative z-10 hidden lg:inline">{label}</span>
    </button>
  );
}

// --- 3. MAIN DASHBOARD PAGE ---
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"resources" | "notes" | "tasks" | "snippets" | "schedule" | "collab" | "analytics">("resources");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [resources, setResources] = useState<Resource[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

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
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, resources]);

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
    <div className="relative min-h-screen bg-background transition-colors duration-500 pb-44">
      <Toaster position="top-right" richColors />
      
      {/* --- RE-ENGINEERED NAVIGATION BAR --- */}
      <div className="fixed bottom-8 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto bg-white/95 dark:bg-slate-950/95 backdrop-blur-3xl 
          border border-slate-200 dark:border-slate-800 
          p-2 rounded-[3.5rem] shadow-2xl
          max-w-[98vw] md:max-w-fit overflow-hidden">
          
          {/* Internal wrapper that allows scrolling if buttons overflow */}
          <div className="flex items-center overflow-x-auto no-scrollbar scroll-smooth px-2">
            {/* min-w-max is critical: it forces the inner div to be as wide as all buttons combined */}
            <div className="flex items-center gap-1 min-w-max py-1">
              <NavButton active={activeTab === 'resources'} onClick={() => setActiveTab("resources")} icon={<LayoutDashboard size={18} />} label="Resources" />
              <NavButton active={activeTab === 'snippets'} onClick={() => setActiveTab("snippets")} icon={<Code2 size={18} />} label="Snippets" />
              <NavButton active={activeTab === 'schedule'} onClick={() => setActiveTab("schedule")} icon={<CalendarIcon size={18} />} label="Schedule" />
              <NavButton active={activeTab === 'analytics'} onClick={() => setActiveTab("analytics")} icon={<BarChart3 size={18} />} label="Analytics" />
              <NavButton active={activeTab === 'notes'} onClick={() => setActiveTab("notes")} icon={<StickyNote size={18} />} label="Notes" />
              <NavButton active={activeTab === 'tasks'} onClick={() => setActiveTab("tasks")} icon={<CheckSquare size={18} />} label="Tasks" />
              <NavButton active={activeTab === 'collab'} onClick={() => setActiveTab("collab")} icon={<Users size={18} />} label="Team" />
            </div>
          </div>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-24 pb-12 mb-12 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Sparkles size={18} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em]">Workspace / {activeTab}</span>
            </div>
            <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter capitalize italic">
              {activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {activeTab !== "collab" && activeTab !== "analytics" && (
              <div className="w-full md:w-80 lg:w-[450px]">
                <SearchBar onSearch={setSearchTerm} />
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {activeTab === "resources" && (
                <AddResourceModal onAdd={handleAddResource} />
              )}
              <button 
                onClick={toggleTheme} 
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 transition-all shadow-sm active:scale-90"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "resources" && (
            <motion.div key="resources" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
               <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4">
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)} 
                    className={`px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      activeCategory === cat 
                      ? "bg-slate-900 dark:bg-blue-600 text-white shadow-xl scale-105" 
                      : "bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {[1, 2, 3].map(i => <ResourceSkeleton key={i} />)}
                </div>
              ) : (
                <motion.div layout variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredResources.map((item) => (
                    <motion.div key={item.id} layout variants={cardVariants} className="dev-card group relative flex flex-col h-full bg-white dark:bg-slate-900/40">
                      <div className="flex justify-between items-center mb-10">
                        <div className="px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase rounded-full border border-blue-100 dark:border-blue-500/20 tracking-tighter">{item.category}</div>
                        <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-4">{item.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-12">{item.description}</p>
                      <div className="flex gap-4 mt-auto">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-[1.75rem] text-[10px] font-black text-center uppercase tracking-widest hover:shadow-xl transition-all active:scale-95">Visit Platform</a>
                        <button onClick={() => handleCopy(item.id, item.url)} className="p-4 bg-slate-50 dark:bg-slate-800/50 text-slate-400 rounded-[1.75rem] hover:text-blue-600 transition-all border border-transparent hover:border-slate-100">{copiedId === item.id ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}</button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === "schedule" && <motion.div key="schedule" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><ScheduleSection /></motion.div>}
          {activeTab === "snippets" && <motion.div key="snippets" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><SnippetsSection /></motion.div>}
          {activeTab === "analytics" && <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><AnalyticsSection /></motion.div>}
          {activeTab === "notes" && <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><NotesSection /></motion.div>}
          {activeTab === "tasks" && <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto"><TasksSection /></motion.div>}
          {activeTab === "collab" && <motion.div key="collab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><CollaborationSection /></motion.div>}
        </AnimatePresence>
      </div>
    </div>
  );
}