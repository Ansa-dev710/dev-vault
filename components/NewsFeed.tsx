"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, TrendingUp, Github, ExternalLink, Zap, Globe } from "lucide-react";

const NewsFeed = () => {
  const [news] = useState([
    { id: 1, title: "Next.js 15: The New Era of React Server Components", tag: "NextJS", time: "2h ago", type: "tech" },
    { id: 2, title: "Framer Motion 12: Independent Motion is here", tag: "UI/UX", time: "5h ago", type: "design" },
    { id: 3, title: "shadcn/ui just dropped New Charts components", tag: "Library", time: "1d ago", type: "update" },
    { id: 4, title: "TypeScript 5.6: Better performance for large projects", tag: "TS", time: "2d ago", type: "tech" },
  ]);

  return (
    <div className="group relative overflow-hidden p-9 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 shadow-sm transition-all duration-500 hover:border-blue-500/20">
      
      {/* Decorative Glow - Subtle background element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/20">
            <Zap size={16} className="fill-blue-500/20" />
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Live Intel</h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase text-emerald-500 tracking-tighter">Syncing Realtime</span>
            </div>
          </div>
        </div>
        <button className="p-2 rounded-xl border border-slate-200 dark:border-white/5 text-slate-400 hover:text-blue-500 transition-colors">
          <Globe size={16} />
        </button>
      </div>

      {/* News List */}
      <div className="space-y-4 relative z-10">
        {news.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group/item flex gap-4 p-4 rounded-2xl border border-transparent hover:border-slate-200/50 dark:hover:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-all duration-300"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-md border tracking-widest ${
                  item.type === 'tech' ? 'bg-blue-500/5 border-blue-500/20 text-blue-500' :
                  item.type === 'design' ? 'bg-purple-500/5 border-purple-500/20 text-purple-500' :
                  'bg-slate-500/5 border-slate-500/20 text-slate-500'
                }`}>
                  {item.tag}
                </span>
                <span className="text-[9px] font-bold text-slate-400/60 uppercase">{item.time}</span>
              </div>
              <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 leading-tight tracking-tight group-hover/item:text-blue-500 transition-colors">
                {item.title}
              </h3>
            </div>
            <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
              <ExternalLink size={14} className="text-slate-400" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer / Trending Repo */}
      <div className="mt-10 pt-8 border-t border-slate-200/50 dark:border-white/5">
        <div className="flex items-center gap-3 mb-4">
           <Github size={14} className="text-slate-400" />
           <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Trending Repository</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 dark:bg-black text-white border border-white/5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-black tracking-tight italic">facebook/react</p>
            <span className="text-[9px] font-bold opacity-50">★ 224k</span>
          </div>
          <p className="text-[10px] opacity-60 line-clamp-1 font-medium italic">A JavaScript library for building user interfaces.</p>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;