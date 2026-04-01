"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, LayoutGrid, CheckCircle2, 
  Clock, Trash2, Calendar 
} from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "Todo" | "In-Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
}

const TaskPulse = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const defaultTasks: Task[] = [
    {
      id: "t1",
      title: "Integrate Framer Motion",
      description: "Add smooth layout transitions to the dashboard sections.",
      status: "In-Progress",
      priority: "High",
      dueDate: "02 Apr 2026"
    }
  ];

  useEffect(() => {
    const savedTasks = localStorage.getItem("dev-vault-tasks");
    setTasks(savedTasks ? JSON.parse(savedTasks) : defaultTasks);
  }, []);

  const moveTask = (id: string, newStatus: Task["status"]) => {
    const updated = tasks.map(t => t.id === id ? { ...t, status: newStatus } : t);
    setTasks(updated);
    localStorage.setItem("dev-vault-tasks", JSON.stringify(updated));
    toast.success(`Moved to ${newStatus}`);
  };

  const Column = ({ title, status, icon: Icon, color }: any) => {
    const columnTasks = tasks.filter(t => t.status === status);
    return (
      <div className="flex-1 min-w-[300px] space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${color} bg-opacity-10 ${color.replace('bg-', 'text-')}`}>
              <Icon size={18} />
            </div>
            <h3 className="font-black italic tracking-tighter text-slate-900 dark:text-white uppercase text-sm">
              {title} <span className="ml-2 opacity-30">{columnTasks.length}</span>
            </h3>
          </div>
          <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Plus size={18} /></button>
        </div>

        <div className="space-y-4 min-h-[500px]">
          <AnimatePresence mode="popLayout">
            {columnTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-white dark:bg-[#0b1120]/80 border border-slate-200 dark:border-white/5 p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{task.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 line-clamp-2">{task.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={12} />
                    <span className="text-[10px] font-bold">{task.dueDate}</span>
                  </div>
                  <div className="flex gap-1">
                    {status !== "Done" && (
                      <button 
                        onClick={() => moveTask(task.id, status === "Todo" ? "In-Progress" : "Done")}
                        className="p-1.5 rounded-lg bg-blue-600 text-white shadow-lg"
                      >
                        <CheckCircle2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full relative">

      <div className="flex flex-col lg:flex-row gap-8 overflow-x-auto pb-10 no-scrollbar">
        <Column title="Backlog" status="Todo" icon={LayoutGrid} color="bg-slate-500" />
        <Column title="In Motion" status="In-Progress" icon={Clock} color="bg-amber-500" />
        <Column title="Completed" status="Done" icon={CheckCircle2} color="bg-emerald-500" />
      </div>
    </div>
  );
};

export default TaskPulse;