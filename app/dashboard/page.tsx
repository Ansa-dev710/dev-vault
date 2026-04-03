"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Trash2, Moon, Sun, Copy, Check, Search, ChevronLeft,
  LayoutDashboard, StickyNote, CheckSquare, Code2, Sparkles, 
  Calendar as CalendarIcon, Users, BarChart3, Briefcase, ExternalLink, Bot, Activity
} from "lucide-react";
import { toast, Toaster } from "sonner";

// Components Imports
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
import TaskPulse from "@/components/Task-Pulse";
import QuickDock from "@/components/Quickdock"; 
import NewsFeed from "@/components/NewsFeed";

type TabType = "resources" | "notes" | "tasks" | "snippets" | "schedule" | "collab" | "analytics" | "professional" | "ai" | "pulse";

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
    <div className="relative min-h-screen bg-[#fdfdfd] dark:bg-[#020617] transition-colors duration-700 overflow-x-hidden selection:bg-blue-500/30">
      <Toaster position="top-right" richColors />
      
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-[size:30px_30px] opacity-50" />
         <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
         <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <CommandPalette 
        isOpen={isCommandOpen} setIsOpen={setIsCommandOpen} 
        setActiveTab={setActiveTab} activeTab={activeTab}
        toggleTheme={toggleTheme} addTask={(title) => toast.success(`Task: ${title}`)}
      />

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full flex justify-center pointer-events-auto px-4">
        <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border border-slate-200 dark:border-white/10 p-1.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full md:max-w-none">
            <NavBtn active={activeTab === 'resources'} onClick={() => setActiveTab("resources")} icon={<LayoutDashboard size={19} />} label="Vault" />
            <NavBtn active={activeTab === 'pulse'} onClick={() => setActiveTab("pulse")} icon={<Activity size={19} />} label="Pulse" />
            <NavBtn active={activeTab === 'professional'} onClick={() => setActiveTab("professional")} icon={<Briefcase size={19} />} label="CRM" />
            <NavBtn active={activeTab === 'snippets'} onClick={() => setActiveTab("snippets")} icon={<Code2 size={19} />} label="Code" />
            <NavBtn active={activeTab === 'ai'} onClick={() => setActiveTab("ai")} icon={<Bot size={19} />} label="AI" />
            <NavBtn active={activeTab === 'analytics'} onClick={() => setActiveTab("analytics")} icon={<BarChart3 size={19} />} label="Stats" />
            <NavBtn active={activeTab === 'notes'} onClick={() => setActiveTab("notes")} icon={<StickyNote size={19} />} label="Notes" />
            <NavBtn active={activeTab === 'tasks'} onClick={() => setActiveTab("tasks")} icon={<CheckSquare size={19} />} label="Tasks" />
            <NavBtn active={activeTab === 'schedule'} onClick={() => setActiveTab("schedule")} icon={<CalendarIcon size={19} />} label="Plan" />
            <NavBtn active={activeTab === 'collab'} onClick={() => setActiveTab("collab")} icon={<Users size={19} />} label="Team" />
        </nav>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-44">
        
        {/* REFINED HEADER: FIXED OVERLAP & TYPOGRAPHY */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-5">
            <Link href="/" className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors duration-300">
              <div className="p-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm group-hover:border-blue-500/30">
                <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Exit to Portal</span>
            </Link>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.3em] text-[10px]">
                <Sparkles size={13} />
                <span>Workspace / <span className="text-slate-400 dark:text-slate-500 font-medium tracking-normal lowercase">{activeTab}</span></span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-950 dark:text-white tracking-tighter italic capitalize leading-[0.9]">
                  {activeTab === 'resources' ? 'DevVault' : activeTab}
                  <span className="text-blue-600 transition-all duration-500">.</span>
              </h1>
            </div>
          </div>
          
          {/* SEARCH & ACTIONS: NO OVERLAP FLEXBOX */}
          <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
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
              className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-500 hover:border-blue-500/40 transition-all shadow-sm backdrop-blur-md whitespace-nowrap"
            >
              <Search size={17} />
              <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest">Global Search</span>
              <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-1.5 font-mono text-[9px] font-medium text-slate-400">⌘K</kbd>
            </button>

            <button onClick={toggleTheme} className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-all shadow-sm backdrop-blur-md">
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
          </div>
        </header>

        {/* PINNED STACK */}
        <div className="mb-14">
           <h4 className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-400 dark:text-slate-600 mb-6 flex items-center gap-4">
             Pinned Resources
             <div className="h-[1px] flex-1 bg-slate-200/60 dark:bg-white/5" />
           </h4>
           <QuickDock />
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{opacity:0, y:10}} 
            animate={{opacity:1, y:0}} 
            exit={{opacity:0, y:-10}} 
            transition={{ duration: 0.4, ease: "easeOut" }} 
            className="w-full"
          >
            {activeTab === "pulse" && <TaskPulse />}
            {activeTab === "professional" && <OutreachTracker />}
            {activeTab === "snippets" && <SnippetsSection />}
            {activeTab === "ai" && <AIAssistant />}
            {activeTab === "schedule" && <ScheduleSection />}
            {activeTab === "analytics" && <AnalyticsSection />}
            {activeTab === "notes" && <NotesSection />}
            {activeTab === "tasks" && <TasksSection />}
            {activeTab === "collab" && <CollaborationSection />}
            
            {activeTab === "resources" && (
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="flex-[2.5] space-y-10 w-full">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                    {CATEGORIES.map((cat) => (
                      <button 
                        key={cat} 
                        onClick={() => setActiveCategory(cat)} 
                        className={`px-7 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border ${activeCategory === cat ? "bg-slate-950 dark:bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/15" : "bg-white dark:bg-slate-900/50 text-slate-400 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isLoading ? [1,2,3,4].map(i => <ResourceSkeleton key={i} />) : filteredResources.map((item) => (
                      <motion.div 
                        key={item.id} 
                        whileHover={{ y: -5 }}
                        className="group relative p-8 rounded-[2.5rem] bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/5 hover:border-blue-500/30 transition-all duration-300 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-8">
                          <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[8px] font-bold uppercase tracking-widest rounded-full border border-slate-200 dark:border-white/5">
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
                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-blue-600 transition-colors">{item.name}</h3>
                        <p className="text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-8 font-medium leading-relaxed">{item.description}</p>
                        <div className="flex gap-3">
                          <a href={item.url} target="_blank" className="flex-[3.5] flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-950 dark:bg-white dark:text-slate-950 text-white rounded-2xl text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-all">Visit Platform <ExternalLink size={14} /></a>
                          <button onClick={() => { navigator.clipboard.writeText(item.url); setCopiedId(item.id); toast.success("Copied!"); setTimeout(()=>setCopiedId(null), 2000); }} className="flex-1 flex justify-center items-center p-3.5 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-2xl hover:text-blue-600 transition-all">
                            {copiedId === item.id ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <aside className="flex-1 w-full lg:sticky lg:top-10 space-y-8">
                  <NewsFeed />
                  <div className="p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/20 shadow-sm">
                    <h4 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-6">Environment</h4>
                    <div className="space-y-5">
                      <StatusRow label="Cloud Sync" status="Active" color="text-emerald-500" />
                      <StatusRow label="Local Vault" status="Stable" color="text-blue-500" />
                      <StatusRow label="AI Engine" status="Online" color="text-purple-500" />
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function StatusRow({ label, status, color }: { label: string, status: string, color: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-1 h-1 rounded-full bg-current ${color} animate-pulse`} />
        <span className={`text-[9px] font-extrabold uppercase tracking-tighter ${color}`}>{status}</span>
      </div>
    </div>
  );
}

function NavBtn({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick} 
      className={`relative flex items-center transition-all duration-300 ease-out group rounded-full shrink-0 ${
        active 
        ? "bg-blue-600 text-white px-5 py-2.5 shadow-lg shadow-blue-500/20" 
        : "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 p-3"
      }`}
    >
      <span className={`${active ? "scale-100" : "group-hover:scale-110"} transition-transform duration-300`}>
        {icon}
      </span>
      <motion.span 
        initial={false}
        animate={{ width: active ? "auto" : 0, opacity: active ? 1 : 0, marginLeft: active ? 10 : 0 }}
        className="overflow-hidden whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.1em]"
      >
        {label}
      </motion.span>
    </button>
  );
}