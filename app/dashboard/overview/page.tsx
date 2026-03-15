"use client";
import { useState } from "react";
import { 
  Database, Zap, Clock, ArrowUpRight, 
  Settings, Save, Shield, Globe, Trash2, X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const stats = [
  { label: "Total Resources", value: "48", icon: Database, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "New This Week", value: "12", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Recently Accessed", value: "5", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
];

export default function OverviewPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-4">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {isSettingsOpen ? "Vault Settings" : "Welcome back, ANSA!"}
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            {isSettingsOpen 
              ? "Configure your workspace preferences and security." 
              : "Here's what's happening with your vault today."}
          </p>
        </div>
        
        {/* Settings Toggle Button */}
        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`p-3 rounded-2xl transition-all flex items-center gap-2 font-bold text-sm shadow-sm ${
            isSettingsOpen 
            ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
            : "bg-slate-900 text-white hover:bg-black"
          }`}
        >
          {isSettingsOpen ? <X size={20} /> : <Settings size={20} />}
          {isSettingsOpen ? "Close" : "Settings"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isSettingsOpen ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <button className="text-slate-300 hover:text-slate-600 transition-colors">
                      <ArrowUpRight size={22} />
                    </button>
                  </div>
                  <div className="mt-8">
                    <p className="text-4xl font-black text-slate-900">{stat.value}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Activity Area */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[4rem] p-24 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
                <Database className="text-slate-200" size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">No Recent Activity</h3>
              <p className="text-slate-500 text-sm max-w-xs mt-2 leading-relaxed font-medium">
                Start adding resources to your vault to see detailed analytics and history.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="settings"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-xl shadow-slate-200/50"
          >
            <div className="max-w-3xl space-y-12">
              {/* Profile/Vault Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Database size={20} /></div>
                  <h3 className="text-xl font-bold text-slate-800">Resource Vault Configuration</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Vault Display Name</label>
                    <input 
                      type="text" 
                      defaultValue="ANSA Personal Vault"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-bold transition-all text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Default Storage Type</label>
                    <select className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-bold transition-all text-slate-700 appearance-none">
                      <option>Cloud Database</option>
                      <option>Local Storage</option>
                      <option>Hybrid (Recommended)</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Security/Visibility Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Shield size={20} /></div>
                  <h3 className="text-xl font-bold text-slate-800">Privacy Control</h3>
                </div>
                
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Globe className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Public Visibility</p>
                      <p className="text-sm text-slate-500 font-medium">Allow people with the link to view your resources.</p>
                    </div>
                  </div>
                  <div className="w-14 h-8 bg-slate-200 rounded-full p-1 cursor-pointer">
                    <div className="w-6 h-6 bg-white rounded-full shadow-md" />
                  </div>
                </div>
              </section>

              {/* Danger Zone */}
              <section className="pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between p-6 bg-red-50/50 rounded-3xl border border-red-100">
                  <div>
                    <h4 className="font-bold text-red-900">Delete Resource Vault</h4>
                    <p className="text-sm text-red-700/60 font-medium leading-relaxed">This action will permanently remove all 48 resources.</p>
                  </div>
                  <button className="px-6 py-3 bg-white text-red-600 border border-red-200 rounded-2xl font-black text-sm hover:bg-red-600 hover:text-white transition-all flex items-center gap-2">
                    <Trash2 size={18} /> Wipe Data
                  </button>
                </div>
              </section>

              {/* Action Buttons */}
              <div className="flex justify-end pt-4 gap-4">
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-8 py-4 text-slate-400 font-bold hover:text-slate-600"
                >
                  Cancel
                </button>
                <button className="px-10 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200 active:scale-95">
                  <Save size={20} /> Save Settings
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}