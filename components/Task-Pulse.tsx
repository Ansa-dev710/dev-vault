"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, LayoutGrid, CheckCircle2, 
  Clock, Calendar, X 
} from "lucide-react";
import { toast } from "sonner";

// ERROR FIX: Interface ko component ke andar define karein ya export/import sahi karein
interface Task {
  id: string;
  title: string;
  description: string;
  status: "Todo" | "In-Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
}

const TaskPulse = () => {
  // ERROR FIX: Task type ko use karna yahan zaroori hai
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTasks = localStorage.getItem("dev-vault-tasks");
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        setTasks(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setTasks([]);
      }
    }
  }, []);

  const moveTask = (id: string, newStatus: Task["status"]) => {
    const updated = tasks.map(t => t.id === id ? { ...t, status: newStatus } : t);
    setTasks(updated);
    localStorage.setItem("dev-vault-tasks", JSON.stringify(updated));
    toast.success(`Moved to ${newStatus}`);
  };

  const Column = ({ title, status, icon: Icon, color }: any) => {
    const columnTasks = Array.isArray(tasks) ? tasks.filter(t => t.status === status) : [];

    return (
      // TAILWIND OPTIMIZATION: min-w-[300px] -> min-w-80 (or as suggested)
      <div className="flex-1 min-w-80 space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-opacity-10 ${color.replace('bg-', 'bg-opacity-10 ')}`}>
               <Icon size={18} className={color.replace('bg-', 'text-')} />
            </div>
            <h3 className="font-black italic tracking-tighter text-slate-900 dark:text-white uppercase text-sm">
              {title} <span className="ml-2 opacity-30">{columnTasks.length}</span>
            </h3>
          </div>
        </div>

        {/* TAILWIND OPTIMIZATION: min-h-[500px] -> min-h-128 */}
        <div className="space-y-4 min-h-128">
          <AnimatePresence mode="popLayout">
            {columnTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                // TAILWIND OPTIMIZATION: rounded-[2rem] -> rounded-4xl
                className="group bg-white dark:bg-[#0b1120]/80 border border-slate-200 dark:border-white/5 p-6 rounded-4xl shadow-sm hover:shadow-md transition-all"
              >
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{task.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{task.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={12} />
                    <span className="text-[10px] font-bold">{task.dueDate}</span>
                  </div>
                  
                  {status !== "Done" && (
                    <button 
                      onClick={() => moveTask(task.id, status === "Todo" ? "In-Progress" : "Done")}
                      className="p-2 rounded-xl bg-blue-600 text-white shadow-lg hover:scale-110 transition-transform"
                    >
                      <CheckCircle2 size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  if (!isMounted) return null;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-8 overflow-x-auto pb-10 no-scrollbar">
        <Column title="Backlog" status="Todo" icon={LayoutGrid} color="bg-slate-500" />
        <Column title="In Motion" status="In-Progress" icon={Clock} color="bg-amber-500" />
        <Column title="Completed" status="Done" icon={CheckCircle2} color="bg-emerald-500" />
      </div>
    </div>
  );
};

export default TaskPulse;