"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, StickyNote, Palette } from "lucide-react";

interface Note {
  id: number;
  content: string;
  color: string;
  date: string;
}

const NOTE_COLORS = [
  "bg-yellow-50 border-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-900/30",
  "bg-blue-50 border-blue-100 text-blue-800 dark:bg-blue-900/20 dark:border-blue-900/30",
  "bg-purple-50 border-purple-100 text-purple-800 dark:bg-purple-900/20 dark:border-purple-900/30",
  "bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-900/30",
];

export default function NotesSection() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("dev-vault-notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const addNote = () => {
    if (!inputValue.trim()) return;
    const newNote: Note = {
      id: Date.now(),
      content: inputValue,
      color: selectedColor,
      date: new Date().toLocaleDateString(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem("dev-vault-notes", JSON.stringify(updated));
    setInputValue("");
  };

  const deleteNote = (id: number) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem("dev-vault-notes", JSON.stringify(updated));
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Write a quick thought or code snippet..."
          className="w-full bg-transparent outline-none resize-none text-slate-700 dark:text-slate-300 font-medium min-h-[100px]"
        />
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
          <div className="flex gap-2">
            {NOTE_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${color.split(' ')[0]} ${
                  selectedColor === color ? "border-slate-400 scale-125" : "border-transparent"
                }`}
              />
            ))}
          </div>
          <button
            onClick={addNote}
            className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all"
          >
            <Plus size={16} /> Save Note
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${note.color} p-8 rounded-[2.5rem] border flex flex-col justify-between min-h-[200px] group`}
            >
              <p className="font-bold leading-relaxed whitespace-pre-wrap">{note.content}</p>
              <div className="mt-6 flex justify-between items-center opacity-60">
                <span className="text-[10px] font-black uppercase tracking-tighter">{note.date}</span>
                <button 
                  onClick={() => deleteNote(note.id)}
                  className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {notes.length === 0 && (
        <div className="text-center py-20 opacity-20">
          <StickyNote size={48} className="mx-auto mb-4" />
          <p className="font-bold uppercase tracking-widest text-xs">No notes yet</p>
        </div>
      )}
    </div>
  );
}