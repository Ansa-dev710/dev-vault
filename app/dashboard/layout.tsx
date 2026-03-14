"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, LayoutDashboard, Settings, User, Bell, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Resources Vault", href: "/dashboard", icon: Database },
    { name: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-900 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-slate-100 hidden md:flex flex-col bg-white shrink-0">
        <div className="p-7 pb-10">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 group-hover:rotate-12 transition-transform duration-300">
               <div className="w-3.5 h-3.5 bg-white rounded-sm rotate-45" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter">DevVault</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-4">Main Menu</p>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link 
                key={link.name}
                href={link.href} 
                className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                  ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-50/50' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} /> 
                  <span className="text-sm font-bold tracking-tight">{link.name}</span>
                </div>
                {isActive && <ChevronRight size={14} strokeWidth={3} className="text-blue-600" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100/50 rounded-2xl hover:bg-slate-100 cursor-pointer transition-all">
            <div className="h-9 w-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md">
              A
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-slate-800 truncate">ANSA Dev</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Pro Developer</span>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col bg-[#fcfdfd] overflow-hidden relative">
        
        <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center px-8 justify-between shrink-0 z-20">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer">Workspace</span>
            <span className="text-slate-200">/</span>
            <span className="text-blue-600">
              {pathname === '/dashboard' ? 'Resources Vault' : pathname.split('/').pop()?.replace(/-/g, ' ')}
            </span>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            <Link href="/dashboard/settings" className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg shadow-slate-200 hover:scale-110 transition-transform cursor-pointer">
              <User size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar scroll-smooth">
          {/* FIXED: Max width ko 300 se hata kar 1400 kiya gaya hai */}
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}