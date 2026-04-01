"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, TrendingUp, Github, Zap } from "lucide-react";

const NewsFeed = () => {
  const [news, setNews] = useState([
    { id: 1, title: "Next.js 15: What's new in the latest release", tag: "NEXTJS" },
    { id: 2, title: "Framer Motion is now independent from Motion", tag: "UI/UX" },
    { id: 3, title: "Top 10 GitHub Repositories this week", tag: "TRENDING" },
  ]);

  return (
    <div className="mt-12 p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-500/20 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-10 opacity-10">
        <Newspaper size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <Zap size={18} className="text-yellow-400 fill-yellow-400" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Live Dev Feed</h2>
        </div>

        <div className="space-y-6">
          {news.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[8px] font-black px-2 py-0.5 rounded bg-white/20 text-white">
                  {item.tag}
                </span>
              </div>
              <p className="text-sm font-bold tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                {item.title}
              </p>
            </motion.div>
          ))}
        </div>

        <button className="mt-8 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all opacity-70 hover:opacity-100">
          View All Updates <TrendingUp size={12} />
        </button>
      </div>
    </div>
  );
};

export default NewsFeed;