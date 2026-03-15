"use client";
import { useState } from "react";
import { Database, Zap, Clock, ArrowUpRight, Settings, Save, Shield, Globe, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const stats = [
  { label: "Total Resources", value: "48", icon: Database, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "New This Week", value: "12", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Recently Accessed", value: "5", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
];

export default function OverviewPage() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="space-y-10 max-w-6xl mx-auto p-6">
      {/* Header with Toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {showSettings ? "Vault Settings" : "Welcome back, ANSA!"}
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            {showSettings ? "Manage your resource vault configuration." : "Here's what's happening with your vault today."}
          </p>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`p-3 rounded-2xl transition-all flex items-center gap-2 font-bold text-sm ${
            showSettings ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Settings size={20} className={showSettings ? "animate-spin-slow" : ""} />
          {showSettings ? "Back to Dashboard" : "Settings"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!showSettings ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-10"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
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
              <p className="text-slate-500 text-sm max-w-xs mt-2">Start adding resources to your vault to see analytics.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm"
          >
            <div className="space-y-8">
              {/* General Settings */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Database size={18} /> General Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Vault Name</label>
                    <input 
                      type="text" 
                      placeholder="ANSA's Personal Vault"
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Default Category</label>
                    <select className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium">
                      <option>Development</option>
                      <option>Design</option>
                      <option>Marketing</option>
                    </select>
                  </div>
                </div>
              </section>

              <hr className="border-slate-50" />

              {/* Privacy Settings */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Shield size={18} /> Privacy & Visibility
                </h3>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Globe className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">Public Access</p>
                      <p className="text-xs text-slate-500">Allow others to view your resource vault via link.</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </section>

              {/* Danger Zone */}
              <section className="pt-4">
                <div className="p-6 border border-red-100 bg-red-50 rounded-[2rem] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-red-900">Delete Vault</h4>
                    <p className="text-sm text-red-600 opacity-80">Once deleted, all resources are gone forever.</p>
                  </div>
                  <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors flex items-center gap-2">
                    <Trash2 size={18} /> Delete
                  </button>
                </div>
              </section>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100">
                  <Save size={20} /> Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}