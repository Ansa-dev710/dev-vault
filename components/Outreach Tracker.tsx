"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Link as LinkIcon, ExternalLink, Briefcase, Linkedin, Github } from 'lucide-react';


export type OutreachType = 'Job Application' | 'LinkedIn' | 'Open Source' | 'Networking';

export interface OutreachEntry {
  id: string;
  date: string;
  target: string;
  role: string;
  type: OutreachType;
  status: 'Pending' | 'Replied' | 'Interview' | 'Accepted' | 'Closed';
  link?: string;
}

const OutreachTracker = () => {
  const [entries, setEntries] = useState<OutreachEntry[]>([
    { id: '1', date: '2026-03-31', target: 'Google', role: 'Frontend Dev', type: 'Job Application', status: 'Pending', link: 'https://careers.google.com' },
    { id: '2', date: '2026-03-28', target: 'Tech Corp', role: 'Senior React Dev', type: 'LinkedIn', status: 'Interview', link: '#' },
  ]);

  const [showForm, setShowForm] = useState(false);

  // Status Colors Logic
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Interview': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-zinc-200">Activity Log</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-black px-4 py-2 rounded-md text-sm font-medium transition-all"
        >
          <Plus size={16} /> New Entry
        </button>
      </div>

      {/* Quick Add Form (Minimalist) */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/40 grid grid-cols-1 md:grid-cols-4 gap-4">
              <input type="text" placeholder="Company/Project" className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600" />
              <input type="text" placeholder="Role/Action" className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600" />
              <select className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-400 focus:outline-none focus:border-zinc-600">
                <option>Job Application</option>
                <option>LinkedIn</option>
                <option>Open Source</option>
              </select>
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white rounded py-2 text-sm transition-colors">Save Entry</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Section */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 backdrop-blur-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/30 text-zinc-500">
              <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Type</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Target</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Role / Action</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Date</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Status</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px] text-right">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {entries.map((entry) => (
              <motion.tr 
                key={entry.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-zinc-900/40 transition-colors group"
              >
                <td className="px-6 py-4">
                  {entry.type === 'LinkedIn' ? <Linkedin size={16} className="text-zinc-500" /> : 
                   entry.type === 'Open Source' ? <Github size={16} className="text-zinc-500" /> : 
                   <Briefcase size={16} className="text-zinc-500" />}
                </td>
                <td className="px-6 py-4 font-semibold text-zinc-200">{entry.target}</td>
                <td className="px-6 py-4 text-zinc-400">{entry.role}</td>
                <td className="px-6 py-4 text-zinc-500 tabular-nums">{entry.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] border font-medium ${getStatusStyle(entry.status)}`}>
                    {entry.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <a href={entry.link} target="_blank" className="text-zinc-500 hover:text-zinc-100 transition-colors inline-block">
                    <ExternalLink size={14} />
                  </a>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OutreachTracker;