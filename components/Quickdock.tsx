"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Globe, X, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface LinkItem {
  id: string;
  url: string;
  name: string;
}

const QuickDock = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newName, setNewName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Initial Load & Defaults
  useEffect(() => {
    const saved = localStorage.getItem("dev-vault-links");
    if (saved) {
      setLinks(JSON.parse(saved));
    } else {
      const defaults = [
        { id: '1', name: 'GitHub', url: 'https://github.com' },
        { id: '2', name: 'Vercel', url: 'https://vercel.com' },
        { id: '3', name: 'Figma', url: 'https://figma.com' }
      ];
      setLinks(defaults);
      localStorage.setItem("dev-vault-links", JSON.stringify(defaults));
    }
  }, []);

  // 2. Focus input when modal opens
  useEffect(() => {
    if (showAdd) inputRef.current?.focus();
  }, [showAdd]);

  const addLink = () => {
    if (!newUrl.trim()) {
      toast.error("URL is required");
      return;
    }

    // URL Sanitization
    let cleanUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const newItem: LinkItem = {
      id: Date.now().toString(),
      name: newName.trim() || "Site",
      url: cleanUrl
    };

    const updated = [...links, newItem];
    setLinks(updated);
    localStorage.setItem("dev-vault-links", JSON.stringify(updated));
    
    // Reset
    setNewUrl("");
    setNewName("");
    setShowAdd(false);
    toast.success(`${newItem.name} added to Dock`);
  };

  const removeLink = (id: string) => {
    const updated = links.filter(l => l.id !== id);
    setLinks(updated);
    localStorage.setItem("dev-vault-links", JSON.stringify(updated));
    toast.error("Link removed");
  };

  return (
    <div className="mb-12 flex items-center gap-4 overflow-x-auto no-scrollbar py-4 px-2">
      
      {/* ADD BUTTON */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAdd(!showAdd)}
        className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
          showAdd 
          ? "bg-rose-500 text-white shadow-rose-500/20 rotate-45" 
          : "bg-blue-600 text-white shadow-blue-500/20"
        }`}
      >
        <Plus size={24} />
      </motion.button>

      {/* LINKS LIST */}
      <div className="flex items-center gap-5">
        <AnimatePresence mode="popLayout">
          {links.map((link) => (
            <motion.div
              key={link.id}
              layout
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              whileHover={{ y: -10 }}
              className="group relative flex flex-col items-center gap-2"
            >
              <a 
                href={link.url} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-[1.4rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center overflow-hidden hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all shadow-sm"
              >
                <img 
                  src={`https://www.google.com/s2/favicons?sz=128&domain=${link.url}`} 
                  alt={link.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://www.google.com/s2/favicons?sz=128&domain=google.com";
                  }}
                  className="w-8 h-8 object-contain opacity-90 group-hover:opacity-100 transition-transform group-hover:scale-110"
                />
              </a>
              
              {/* Tooltip-style Label */}
              <span className="absolute -bottom-6 text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
                {link.name}
              </span>

              {/* Delete Trigger */}
              <button 
                onClick={(e) => { e.preventDefault(); removeLink(link.id); }}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg shadow-rose-500/20 z-10"
              >
                <X size={10} strokeWidth={3} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ADD MODAL / INPUT BOX */}
      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2.5 pl-5 rounded-[1.8rem] border border-slate-200 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl"
          >
            <div className="flex flex-col border-r border-slate-100 dark:border-white/5 pr-4">
              <span className="text-[7px] font-black uppercase text-slate-400 mb-1">Label</span>
              <input 
                ref={inputRef}
                placeholder="GitHub..." 
                className="bg-transparent text-[10px] font-black uppercase outline-none w-20 text-blue-600 placeholder:text-slate-300"
                value={newName} 
                onChange={e => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addLink()}
              />
            </div>
            <div className="flex flex-col pl-2">
              <span className="text-[7px] font-black uppercase text-slate-400 mb-1">Target URL</span>
              <input 
                placeholder="github.com" 
                className="bg-transparent text-[10px] font-bold outline-none w-44 text-slate-600 dark:text-slate-200 placeholder:text-slate-300"
                value={newUrl} 
                onChange={e => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addLink()}
              />
            </div>
            <button 
              onClick={addLink} 
              className="ml-2 p-3 bg-slate-900 dark:bg-blue-600 text-white rounded-[1.2rem] text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/10"
            >
              SAVE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickDock;