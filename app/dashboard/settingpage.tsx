"use client";
import { Database, Zap, Clock, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Total Resources", value: "48", icon: Database, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "New This Week", value: "12", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Recently Accessed", value: "5", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
];

export default function OverviewPage() {
  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back, Sohaib!</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Here's what's happening with your vault today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <button className="text-slate-300 hover:text-slate-600 transition-colors">
                <ArrowUpRight size={20} />
              </button>
            </div>
            <div className="mt-6">
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity Placeholder */}
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
           <Database className="text-slate-300" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No Recent Activity</h3>
        <p className="text-slate-500 text-sm max-w-xs mt-2">Start adding resources to your vault to see analytics and activity logs here.</p>
      </div>
    </div>
  );
}