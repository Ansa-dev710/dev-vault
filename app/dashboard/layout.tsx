"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, LayoutDashboard, Settings, Box } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-white">
    
      <aside className="w-72 border-r border-slate-200 hidden md:flex flex-col bg-white shrink-0">
        <div className="p-8 pb-10">
          <h2 className="text-2xl font-black text-blue-600 tracking-tighter">DevVault</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${pathname === '/dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-400 hover:text-slate-600'}`}>
            <Database size={20} /> Resources Vault
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-600 rounded-xl font-bold transition-all">
            <LayoutDashboard size={20} /> Overview
          </Link>
        </nav>
      </aside>

  
      <div className="flex-1 flex flex-col bg-[#f8fcfb] overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-10 justify-between shrink-0">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">
            Workspace / <span className="text-slate-900">Vault</span>
          </div>
          <div className="h-9 w-9 bg-slate-900 rounded-full flex items-center justify-center text-white text-[10px] font-bold"></div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}