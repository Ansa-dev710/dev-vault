"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip"; 
import { Activity, Flame, Trophy, Calendar } from "lucide-react";

const ActivityHeatmap = () => {
  
  const generateData = () => {
    const data = [];
    const today = new Date();
    for (let i = 0; i < 91; i++) { 
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 5), // 0 to 4 activities
      });
    }
    return data.reverse();
  };

  const activityData = useMemo(() => generateData(), []);

  const getColor = (count: number) => {
    if (count === 0) return "bg-slate-100 dark:bg-white/5";
    if (count === 1) return "bg-blue-200 dark:bg-blue-900/30";
    if (count === 2) return "bg-blue-400 dark:bg-blue-700/50";
    if (count === 3) return "bg-blue-600 dark:bg-blue-500/80";
    return "bg-blue-800 dark:bg-blue-400";
  };

  return (
    <div className="w-full space-y-10">
      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Flame className="text-orange-500" />} label="Current Streak" value="12 Days" />
        <StatCard icon={<Activity className="text-blue-500" />} label="Total Activities" value="148" />
        <StatCard icon={<Trophy className="text-amber-500" />} label="Best Day" value="8 Tasks" />
      </div>

      {/* --- HEATMAP GRID --- */}
      <div className="p-8 rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 backdrop-blur-xl shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-blue-500" />
            <h3 className="font-black italic tracking-tighter text-slate-900 dark:text-white uppercase text-sm">
              Activity Pulse <span className="ml-2 opacity-30 font-normal not-italic">Last 90 Days</span>
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Less <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-white/5"></div>
            <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
            <div className="w-3 h-3 rounded-sm bg-blue-800 dark:bg-blue-400"></div> More
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {activityData.map((day, i) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.005 }}
              className={`w-4 h-4 rounded-[4px] ${getColor(day.count)} cursor-pointer transition-all hover:ring-2 hover:ring-blue-500/50`}
              data-tooltip-id="heatmap-tooltip"
              data-tooltip-content={`${day.date}: ${day.count} activities`}
            />
          ))}
        </div>
        <Tooltip id="heatmap-tooltip" />
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: any) => (
  <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 flex items-center gap-5 shadow-sm">
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5">{icon}</div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</p>
    </div>
  </div>
);

export default ActivityHeatmap;