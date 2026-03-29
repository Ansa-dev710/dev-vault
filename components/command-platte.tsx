"use client";
import React, { useState, useEffect } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, FileText, Code2, CheckSquare, 
  Calendar, BarChart3, Users, Zap 
} from "lucide-react";
import { useRouter } from "next/navigation";

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export default function CommandPalette({ isOpen, setIsOpen, activeTab, setActiveTab }: CommandPaletteProps) {
  
  // Shortcut listener (CMD+K or CTRL+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setIsOpen]);

  const runCommand = (command: () => void) => {
    command();
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] p-4 bg-slate-950/20 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-[600px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden"
          >
            <Command className="flex flex-col h-full focus:outline-none">
              <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
                <Search className="mr-3 text-slate-400" size={18} />
                <Command.Input 
                  placeholder="Type a command or search..." 
                  className="w-full py-4 text-sm bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <kbd className="hidden md:block px-2 py-1 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded">ESC</kbd>
              </div>

              <Command.List className="max-h-[350px] overflow-y-auto p-2 no-scrollbar">
                <Command.Empty className="py-10 text-center text-xs text-slate-400 font-medium">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Navigation" className="px-2 mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Item icon={<Zap size={16} />} label="Resources" onSelect={() => runCommand(() => setActiveTab("resources"))} />
                  <Item icon={<Code2 size={16} />} label="Snippets" onSelect={() => runCommand(() => setActiveTab("snippets"))} />
                  <Item icon={<CheckSquare size={16} />} label="Tasks" onSelect={() => runCommand(() => setActiveTab("tasks"))} />
                  <Item icon={<StickyNoteIcon size={16} />} label="Notes" onSelect={() => runCommand(() => setActiveTab("notes"))} />
                </Command.Group>

                <Command.Group heading="General" className="px-2 mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Item icon={<BarChart3 size={16} />} label="Analytics" onSelect={() => runCommand(() => setActiveTab("analytics"))} />
                  <Item icon={<Users size={16} />} label="Team Collaboration" onSelect={() => runCommand(() => setActiveTab("collab"))} />
                  <Item icon={<Calendar size={16} />} label="Schedule" onSelect={() => runCommand(() => setActiveTab("schedule"))} />
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
          
          {/* Backdrop Click Close */}
          <div className="fixed inset-0 -z-10" onClick={() => setIsOpen(false)} />
        </div>
      )}
    </AnimatePresence>
  );
}

function Item({ icon, label, onSelect }: { icon: any, label: string, onSelect: () => void }) {
  return (
    <Command.Item 
      onSelect={onSelect}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 aria-selected:bg-blue-600 aria-selected:text-white transition-all group"
    >
      <span className="text-slate-400 group-aria-selected:text-white transition-colors">{icon}</span>
      {label}
    </Command.Item>
  );
}

function StickyNoteIcon({ size }: { size: number }) {
    return <FileText size={size} />;
}