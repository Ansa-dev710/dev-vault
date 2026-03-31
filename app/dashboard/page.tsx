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
import AIAssistant from "@/components/Ai-assistant";

import { 
  Trash2, Moon, Sun, Copy, Check, Search,
  LayoutDashboard, StickyNote, CheckSquare, Code2, Sparkles, 
  Calendar as CalendarIcon, Users, BarChart3, Briefcase, ExternalLink, Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";

type TabType = "resources" | "notes" | "tasks" | "snippets" | "schedule" | "collab" | "analytics" | "professional" | "ai";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("resources");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [resources, setResources] = useState<Resource[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem("vault-theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
    const rawData = localStorage.getItem("dev-vault-resources");
    setResources(rawData ? JSON.parse(rawData) : DEV_RESOURCES);
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("vault-theme", nextDark ? "dark" : "light");
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
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 overflow-x-hidden selection:bg-blue-500/30">
      <Toaster position="top-right" richColors />
      
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500 blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600 blur-[120px]" />
      </div>

      <CommandPalette 
        isOpen={isCommandOpen} setIsOpen={setIsCommandOpen} 
        setActiveTab={setActiveTab} activeTab={activeTab}
        toggleTheme={toggleTheme} addTask={(title) => toast.success(`Task: ${title}`)}
      />

      {/* --- SMART DOCK NAVIGATION --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full flex justify-center pointer-events-auto px-4">
        <nav className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-3xl border border-slate-200 dark:border-white/10 p-2 rounded-full shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] flex items-center gap-1 transition-all duration-500">
            <NavBtn active={activeTab === 'resources'} onClick={() => setActiveTab("resources")} icon={<LayoutDashboard size={20} />} label="Vault" />
            <NavBtn active={activeTab === 'professional'} onClick={() => setActiveTab("professional")} icon={<Briefcase size={20} />} label="CRM" />
            <NavBtn active={activeTab === 'snippets'} onClick={() => setActiveTab("snippets")} icon={<Code2 size={20} />} label="Code" />
            <NavBtn active={activeTab === 'ai'} onClick={() => setActiveTab("ai")} icon={<Bot size={20} />} label="AI" />
            <NavBtn active={activeTab === 'analytics'} onClick={() => setActiveTab("analytics")} icon={<BarChart3 size={20} />} label="Stats" />
            <NavBtn active={activeTab === 'notes'} onClick={() => setActiveTab("notes")} icon={<StickyNote size={20} />} label="Notes" />
            <NavBtn active={activeTab === 'tasks'} onClick={() => setActiveTab("tasks")} icon={<CheckSquare size={20} />} label="Tasks" />
            <NavBtn active={activeTab === 'schedule'} onClick={() => setActiveTab("schedule")} icon={<CalendarIcon size={20} />} label="Plan" />
            <NavBtn active={activeTab === 'collab'} onClick={() => setActiveTab("collab")} icon={<Users size={20} />} label="Team" />
        </nav>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-44">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.2em] text-[10px]">
              <Sparkles size={14} />
              <span>Workspace / {activeTab}</span>
            </div>
            <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic capitalize">
                {activeTab === 'resources' ? 'DevVault' : activeTab}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {activeTab === "resources" && (
              <div className="flex items-center gap-3">
                <SearchBar onSearch={setSearchTerm} />
                <AddResourceModal onAdd={(res) => {
                    const up = [res, ...resources];
                    setResources(up);
                    localStorage.setItem("dev-vault-resources", JSON.stringify(up));
                }} />
              </div>
            )}

            <button 
              onClick={() => setIsCommandOpen(true)}
              className="group flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 text-slate-500 hover:border-blue-500/50 transition-all shadow-sm backdrop-blur-md"
            >
              <Search size={18} className="group-hover:text-blue-500 transition-colors" />
              <span className="hidden sm:inline text-[11px] font-black uppercase tracking-widest">Search</span>
              <kbd className="hidden lg:inline-flex h-6 items-center gap-1 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-2 font-mono text-[10px] font-bold text-slate-400">⌘K</kbd>
            </button>

            <button onClick={toggleTheme} className="p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm backdrop-blur-md">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{ duration: 0.4 }} className="w-full">
            {activeTab === "resources" && (
              <div className="space-y-12">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4">
                  {CATEGORIES.map((cat) => (
                    <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)} 
                      className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat ? "bg-slate-900 dark:bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/20" : "bg-white/50 dark:bg-slate-900/50 text-slate-400 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {isLoading ? [1,2,3].map(i => <ResourceSkeleton key={i} />) : filteredResources.map((item) => (
                    <motion.div 
                      key={item.id} 
                      whileHover={{ y: -8 }}
                      className="group relative p-8 rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 backdrop-blur-xl hover:border-blue-500/40 transition-all duration-500 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-8">
                        <span className="px-4 py-1.5 bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">
                          {item.category}
                        </span>
                        <button onClick={() => {
                            const up = resources.filter(r => r.id !== item.id);
                            setResources(up);
                            localStorage.setItem("dev-vault-resources", JSON.stringify(up));
                            toast.error("Resource removed");
                        }} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter group-hover:text-blue-500 transition-colors">{item.name}</h3>
                      <p className="text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-8 font-medium leading-relaxed">{item.description}</p>
                      <div className="flex gap-3">
                        <a href={item.url} target="_blank" className="flex-[3] flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all">Visit Site <ExternalLink size={14} /></a>
                        <button onClick={() => { navigator.clipboard.writeText(item.url); setCopiedId(item.id); toast.success("Copied!"); setTimeout(()=>setCopiedId(null), 2000); }} className="flex-1 flex justify-center items-center p-4 bg-slate-100/50 dark:bg-white/5 text-slate-400 rounded-2xl hover:bg-blue-500/10 hover:text-blue-500 transition-all">
                          {copiedId === item.id ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "professional" && <OutreachTracker />}
            {activeTab === "snippets" && <SnippetsSection />}
            {activeTab === "ai" && <AIAssistant />}
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

// --- SMART BUTTON COMPONENT ---
function NavBtn({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick} 
      className={`relative flex items-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group rounded-full overflow-hidden ${
        active 
        ? "bg-blue-600 text-white px-5 py-3 shadow-[0_10px_30px_rgba(37,99,235,0.4)]" 
        : "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 p-3.5"
      }`}
    >
      <span className={`relative z-10 ${active ? "scale-110" : "group-hover:scale-110"} transition-transform duration-300`}>
        {icon}
      </span>

      <motion.span 
        initial={false}
        animate={{ 
          width: active ? "auto" : 0,
          opacity: active ? 1 : 0,
          marginLeft: active ? 10 : 0
        }}
        transition={{ duration: 0.4, ease: "circOut" }}
        className="overflow-hidden whitespace-nowrap text-[11px] font-black uppercase tracking-[0.15em] pointer-events-none"
      >
        {label}
      </motion.span>
      
      {/* Mini Tooltip for non-active buttons */}
      {!active && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl border border-white/10 translate-y-2 group-hover:translate-y-0">
          {label}
        </span>
      )}
    </button>
  );
}