"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, ExternalLink, Globe, Trash2 } from "lucide-react";
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

  useEffect(() => {
    const saved = localStorage.getItem("dev-vault-links");
    if (saved) setLinks(JSON.parse(saved));
    else {
      // Default links
      const defaults = [
        { id: '1', name: 'GitHub', url: 'https://github.com' },
        { id: '2', name: 'Vercel', url: 'https://vercel.com' },
        { id: '3', name: 'Figma', url: 'https://figma.com' }
      ];
      setLinks(defaults);
    }
  }, []);

  const addLink = () => {
    if (!newUrl) return;
    const cleanUrl = newUrl.startsWith("http") ? newUrl : `https://${newUrl}`;
    const newItem = { id: Date.now().toString(), name: newName || "Site", url: cleanUrl };
    const updated = [...links, newItem];
    setLinks(updated);
    localStorage.setItem("dev-vault-links", JSON.stringify(updated));
    setNewUrl(""); setNewName(""); setShowAdd(false);
    toast.success("Link added to Dock");
  };

  const removeLink = (id: string) => {
    const updated = links.filter(l => l.id !== id);
    setLinks(updated);
    localStorage.setItem("dev-vault-links", JSON.stringify(updated));
  };

  return (
    <div className="mb-12 flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
      {/* ADD BUTTON */}
      <button 
        onClick={() => setShowAdd(!showAdd)}
        className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-blue-500/20"
      >
        <Plus size={24} />
      </button>

      {/* DOCK ITEMS */}
      <div className="flex items-center gap-4 px-2">
        {links.map((link) => (
          <motion.div
            key={link.id}
            whileHover={{ y: -8 }}
            className="group relative flex flex-col items-center gap-2"
          >
            <a 
              href={link.url} 
              target="_blank"
              className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center overflow-hidden hover:border-blue-500/50 transition-all shadow-sm shadow-black/5"
            >
              <img 
                src={`https://www.google.com/s2/favicons?sz=64&domain=${link.url}`} 
                alt={link.name}
                className="w-8 h-8 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </a>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {link.name}
            </span>
            <button 
              onClick={() => removeLink(link.id)}
              className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform"
            >
              <Trash2 size={10} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* ADD LINK MODAL (Simple inline version) */}
      {showAdd && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl"
        >
          <input 
            placeholder="Name" 
            className="bg-transparent text-[10px] uppercase font-bold p-2 outline-none w-20 border-r border-slate-100 dark:border-white/5"
            value={newName} onChange={e => setNewName(e.target.value)}
          />
          <input 
            placeholder="URL (e.g. github.com)" 
            className="bg-transparent text-[10px] p-2 outline-none w-40"
            value={newUrl} onChange={e => setNewUrl(e.target.value)}
          />
          <button onClick={addLink} className="p-2 bg-blue-600 text-white rounded-xl text-[10px] font-bold px-4 hover:bg-blue-700 transition-colors">
            ADD
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default QuickDock;