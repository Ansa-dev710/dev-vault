"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Database, LayoutDashboard, Settings, User, Bell, 
  ChevronRight, LogOut, CheckCheck, Sparkles 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navLinks = [
    { name: "Resources Vault", href: "/dashboard", icon: Database },
    { name: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  if (!isMounted) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans relative">
      
      {/* --- UPDATED DARK SIDEBAR --- */}
      <aside className="w-64 border-r border-slate-800 hidden md:flex flex-col bg-slate-900 dark:bg-slate-950 shrink-0 z-40">
        <div className="p-7 pb-10">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-300">
                <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-xl font-black text-white tracking-tighter">DevVault</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 px-4">Main Menu</p>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name}
                href={link.href} 
                className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} /> 
                  <span className="text-sm font-bold tracking-tight">{link.name}</span>
                </div>
                {isActive && <ChevronRight size={14} strokeWidth={3} />}
              </Link>
            );
          })}
        </nav>

        {/* --- BOTTOM USER SECTION (Dark Themed) --- */}
        <div className="p-4 mt-auto border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <div className="h-9 w-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs">A</div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-white truncate">ANSA Dev</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Pro Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* PREMIUM MESH GRADIENT BACKGROUND */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#fcfdfd] dark:bg-slate-950">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-[120px]" />
        </div>

        {/* --- DARK NAVBAR (Stays as it was) --- */}
        <header className="h-20 bg-slate-900 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 flex items-center px-8 justify-between shrink-0 z-50 relative">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>Workspace</span>
              <span className="text-slate-700">/</span>
              <span className="text-blue-400">Pages</span>
            </div>
            <h2 className="text-sm font-black text-white tracking-tight">
                {pathname === '/dashboard' ? 'Resources Vault' : pathname.split('/').pop()?.replace('-', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                className={`p-2.5 rounded-xl transition-all border ${
                  showNotifications 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                <Bell size={20} strokeWidth={2.2} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-400 rounded-full border-2 border-slate-900"></span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-80 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl p-5 z-50 shadow-black/50"
                  >
                    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Notifications</h3>
                      <button 
                        onClick={() => {setUnreadCount(0); toast.success("All notifications cleared")}}
                        className="text-[10px] text-blue-400 font-bold hover:text-blue-300"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-4 p-3 bg-slate-800/40 hover:bg-slate-800 rounded-2xl border border-slate-800 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform"><CheckCheck size={18}/></div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-200">Vault Updated</p>
                          <p className="text-[10px] text-slate-500">2 new resources added to your list.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 border border-blue-400/20"
              >
                <User size={20} strokeWidth={2.5} />
              </motion.button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-60 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl p-2 z-50 shadow-black/50"
                  >
                    <div className="p-4 border-b border-slate-800 mb-2">
                      <p className="text-xs font-black text-white">ANSA Dev</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Pro Account</p>
                    </div>
                    <Link href="/dashboard/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 p-3 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                      <Settings size={14} /> Account Settings
                    </Link>
                    <button 
                      onClick={() => toast.error("Logout successful")}
                      className="w-full flex items-center gap-3 p-3 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
        
        {/* --- SCROLLABLE CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative z-10 custom-scrollbar scroll-smooth">
          <motion.div 
            key={pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-[1400px] mx-auto w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}