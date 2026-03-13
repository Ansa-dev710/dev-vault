"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, LayoutDashboard, Settings, User } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Navigation Links array (Professional way to handle links)
  const navLinks = [
    { name: "Resources Vault", href: "/dashboard", icon: Database },
    { name: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-200 hidden md:flex flex-col bg-white shrink-0">
        <div className="p-8 pb-10">
          <h2 className="text-2xl font-black text-blue-600 tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
               <div className="w-3 h-3 bg-white rounded-sm rotate-45" />
            </div>
            DevVault
          </h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link 
                key={link.name}
                href={link.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                  isActive 
                  ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/50' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} /> 
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Quick Access (Bottom of Sidebar) */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
            <div className="h-9 w-9 bg-gradient-linear from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
              N
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-700 leading-none">Developer</span>
              <span className="text-[10px] text-slate-400 font-medium">Pro Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col bg-[#fcfdfd] overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center px-10 justify-between shrink-0 z-10">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
            <span>Workspace</span>
            <span className="text-slate-200">/</span>
            <span className="text-blue-600">{pathname.split('/').pop() || 'Dashboard'}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Settings size={20} />
            </button>
            <div className="h-9 w-9 bg-slate-900 rounded-full flex items-center justify-center text-white text-[10px] font-bold ring-4 ring-slate-50">
              <User size={18} />
            </div>
          </div>
        </header>
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-6xl mx-auto w-full animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}