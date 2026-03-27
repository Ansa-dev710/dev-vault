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

// --- ANIMATION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

// --- NAV BUTTON COMPONENT ---
function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 rounded-full text-[10px] font-bold uppercase transition-all duration-300 whitespace-nowrap z-20 ${
        active ? "text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      }`}
    >
      {active && (
        <motion.div 
          layoutId="nav-bg"
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md"
          style={{ borderRadius: '9999px' }}
        />
      )}
      <span className="relative z-30">{icon}</span>
      <span className="relative z-30 hidden lg:inline-block">{label}</span>
    </button>
  );
}

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
    setTimeout(() => setIsLoading(false), 600);
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
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#0B0F1A] transition-colors duration-500">
      <Toaster position="top-right" richColors />
      
      {/* NAVIGATION BAR */}
      <div className="fixed bottom-6 left-0 right-0 z-[999] flex justify-center px-4">
        <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-1.5 rounded-full shadow-2xl flex items-center max-w-full overflow-hidden">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-1">
              <NavButton active={activeTab === 'resources'} onClick={() => setActiveTab("resources")} icon={<LayoutDashboard size={16} />} label="Resources" />
              <NavButton active={activeTab === 'snippets'} onClick={() => setActiveTab("snippets")} icon={<Code2 size={16} />} label="Snippets" />
              <NavButton active={activeTab === 'schedule'} onClick={() => setActiveTab("schedule")} icon={<CalendarIcon size={16} />} label="Schedule" />
              <NavButton active={activeTab === 'analytics'} onClick={() => setActiveTab("analytics")} icon={<BarChart3 size={16} />} label="Analytics" />
              <NavButton active={activeTab === 'notes'} onClick={() => setActiveTab("notes")} icon={<StickyNote size={16} />} label="Notes" />
              <NavButton active={activeTab === 'tasks'} onClick={() => setActiveTab("tasks")} icon={<CheckSquare size={16} />} label="Tasks" />
              <NavButton active={activeTab === 'collab'} onClick={() => setActiveTab("collab")} icon={<Users size={16} />} label="Team" />
          </div>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-40">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200 dark:border-slate-800 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest">Workspace / {activeTab}</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter capitalize italic">{activeTab}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {activeTab === "resources" && (
              <>
                <div className="w-full md:w-72">
                  <SearchBar onSearch={setSearchTerm} />
                </div>
                <AddResourceModal onAdd={handleAddResource} />
              </>
            )}
            <button onClick={toggleTheme} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {activeTab === "resources" && (
              <div className="space-y-10">
                {/* Categories */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                  {CATEGORIES.map((cat) => (
                    <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)} 
                      className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${
                        activeCategory === cat ? "bg-slate-900 dark:bg-blue-600 text-white" : "bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Resources Grid */}
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <ResourceSkeleton key={i} />)}
                  </div>
                ) : (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((item) => (
                      <motion.div key={item.id} variants={cardVariants} className="p-6 rounded-[2rem] bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 shadow-sm group">
                        <div className="flex justify-between items-center mb-6">
                          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[8px] font-bold uppercase rounded-lg">{item.category}</span>
                          <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">{item.description}</p>
                        <div className="flex gap-2">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex-1 px-4 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-[9px] font-bold text-center uppercase tracking-wider">Visit</a>
                          <button onClick={() => handleCopy(item.id, item.url)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl">{copiedId === item.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}</button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === "schedule" && <ScheduleSection />}
            {activeTab === "snippets" && <SnippetsSection />}
            {activeTab === "analytics" && <AnalyticsSection />}
            {activeTab === "notes" && <NotesSection />}
            {activeTab === "tasks" && <TasksSection />}
            {activeTab === "collab" && <CollaborationSection />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}