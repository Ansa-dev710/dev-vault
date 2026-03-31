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
import CommandPalette from "@/components/command-platte";
import OutreachTracker from "@/components/Outreach Tracker"; 

import { 
  Trash2, Moon, Sun, Copy, Check, Search,
  LayoutDashboard, StickyNote, CheckSquare, Code2, Sparkles, 
  Calendar as CalendarIcon, Users, BarChart3, Briefcase
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { toast, Toaster } from "sonner";

// --- ANIMATION VARIANTS ---
const globalContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  exit: { opacity: 0 }
};

const genericCardVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"resources" | "notes" | "tasks" | "snippets" | "schedule" | "collab" | "analytics" | "professional">("resources");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [resources, setResources] = useState<Resource[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem("vault-theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    const rawData = localStorage.getItem("dev-vault-resources");
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        setResources(Array.isArray(parsed) && parsed.length > 0 ? parsed : DEV_RESOURCES);
      } catch (e) {
        setResources(DEV_RESOURCES);
      }
    } else {
      setResources(DEV_RESOURCES);
      localStorage.setItem("dev-vault-resources", JSON.stringify(DEV_RESOURCES));
    }

    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("vault-theme", nextDark ? "dark" : "light");
  };

  const handleAddResource = (newRes: Resource) => {
    const updated = [newRes, ...resources];
    setResources(updated);
    localStorage.setItem("dev-vault-resources", JSON.stringify(updated));
    toast.success("Added to Vault!");
  };

  const handleDelete = (id: number) => {
    const updated = resources.filter((item) => item.id !== id);
    setResources(updated);
    localStorage.setItem("dev-vault-resources", JSON.stringify(updated));
    toast.error("Resource removed");
  };

  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, resources]);

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#0B0F1A] transition-colors duration-500">
      <Toaster position="top-right" richColors />
      
      <CommandPalette 
        isOpen={isCommandOpen} setIsOpen={setIsCommandOpen} 
        setActiveTab={setActiveTab} activeTab={activeTab}
        toggleTheme={toggleTheme} addTask={(title) => toast.success(`Task: ${title}`)}
      />

      {/* --- FLOATING BOTTOM NAVIGATION (THE FIX) --- */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-2 rounded-full shadow-2xl flex items-center max-w-full overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex items-center gap-1 min-w-max px-2"> 
                <NavBtn active={activeTab === 'resources'} onClick={() => setActiveTab("resources")} icon={<LayoutDashboard size={16} />} label="Resources" />
                <NavBtn active={activeTab === 'professional'} onClick={() => setActiveTab("professional")} icon={<Briefcase size={16} />} label="Professional" />
                <NavBtn active={activeTab === 'snippets'} onClick={() => setActiveTab("snippets")} icon={<Code2 size={16} />} label="Snippets" />
                <NavBtn active={activeTab === 'analytics'} onClick={() => setActiveTab("analytics")} icon={<BarChart3 size={16} />} label="Analytics" />
                <NavBtn active={activeTab === 'notes'} onClick={() => setActiveTab("notes")} icon={<StickyNote size={16} />} label="Notes" />
                <NavBtn active={activeTab === 'tasks'} onClick={() => setActiveTab("tasks")} icon={<CheckSquare size={16} />} label="Tasks" />
                <NavBtn active={activeTab === 'schedule'} onClick={() => setActiveTab("schedule")} icon={<CalendarIcon size={16} />} label="Schedule" />
                <NavBtn active={activeTab === 'collab'} onClick={() => setActiveTab("collab")} icon={<Users size={16} />} label="Team" />
            </div>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-40">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200 dark:border-slate-800 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Workspace / {activeTab}</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter capitalize italic">
                {activeTab}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setIsCommandOpen(true)} className="hidden md:flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:border-blue-500 transition-all">
              <Search size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Quick Search</span>
              <kbd className="text-[10px] font-mono opacity-40 bg-slate-100 dark:bg-slate-800 px-1.5 rounded">⌘K</kbd>
            </button>

            {activeTab === "resources" && (
              <div className="flex items-center gap-3">
                <SearchBar onSearch={setSearchTerm} />
                <AddResourceModal onAdd={handleAddResource} />
              </div>
            )}

            <button onClick={toggleTheme} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:scale-105 transition-all text-slate-600 dark:text-slate-300">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial="hidden" animate="visible" exit="exit" variants={globalContainerVariants} className="w-full">
            {activeTab === "resources" && (
              <div className="space-y-10">
                {/* CATEGORIES TABS */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                  {CATEGORIES.map((cat) => (
                    <button 
                      key={cat} onClick={() => setActiveCategory(cat)} 
                      className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${
                        activeCategory === cat ? "bg-slate-900 dark:bg-blue-600 text-white shadow-lg" : "bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <ResourceSkeleton key={i} />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((item) => (
                      <motion.div key={item.id} variants={genericCardVariants} className="relative p-6 rounded-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group hover:shadow-xl transition-all">
                        <div className="flex justify-between items-center mb-6">
                          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[8px] font-black uppercase rounded-lg border border-blue-100 dark:border-blue-500/20">{item.category}</span>
                          <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={15} /></button>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.name}</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">{item.description}</p>
                        <div className="flex gap-2">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex-[2] px-4 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-[9px] font-bold text-center uppercase tracking-widest">Visit Site</a>
                          <button onClick={() => { navigator.clipboard.writeText(item.url); setCopiedId(item.id); toast.success("Link Copied!"); setTimeout(()=>setCopiedId(null), 2000); }} className="flex-1 flex justify-center items-center p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl transition-colors">
                            {copiedId === item.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "professional" && <OutreachTracker />}
            {activeTab === "snippets" && <SnippetsSection />}
            {activeTab === "schedule" && <ScheduleSection />}
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

// Fixed NavBtn to prevent shrinking
function NavBtn({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick} 
      className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase transition-all flex-shrink-0 whitespace-nowrap z-20 ${
        active ? "text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      }`}
    >
      {active && (
        <motion.div layoutId="nav-bg" className="absolute inset-0 bg-blue-600 shadow-lg shadow-blue-600/20" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} style={{ borderRadius: '9999px' }} />
      )}
      <span className="relative z-30">{icon}</span>
      <span className="relative z-30 block">{label}</span>
    </button>
  );
}