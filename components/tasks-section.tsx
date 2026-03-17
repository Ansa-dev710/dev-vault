"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckCircle2, Circle, AlertCircle, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
}

export default function TasksSection() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("Medium");

  useEffect(() => {
    const saved = localStorage.getItem("dev-vault-tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  const saveToLocal = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem("dev-vault-tasks", JSON.stringify(newTasks));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      text: input,
      completed: false,
      priority,
    };

    saveToLocal([newTask, ...tasks]);
    setInput("");
    toast.success("Task added to your list");
  };

  const toggleTask = (id: number) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveToLocal(updated);
  };

  const deleteTask = (id: number) => {
    saveToLocal(tasks.filter(t => t.id !== id));
    toast.error("Task deleted");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Input Area */}
      <form onSubmit={addTask} className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What's the next big goal?"
          className="flex-1 bg-transparent px-4 py-2 outline-none text-slate-700 dark:text-slate-300 font-bold"
        />
        
        <div className="flex items-center gap-2 border-l border-slate-100 dark:border-slate-800 pl-4">
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl text-xs font-black uppercase outline-none cursor-pointer dark:text-slate-300"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          
          <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all">
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>
      </form>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`group flex items-center justify-between p-5 rounded-2xl border transition-all ${
                task.completed 
                ? "bg-slate-50/50 dark:bg-slate-900/30 border-transparent opacity-60" 
                : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <button onClick={() => toggleTask(task.id)} className="text-blue-600">
                  {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} className="text-slate-300" />}
                </button>
                
                <div className="flex flex-col">
                  <span className={`font-bold transition-all ${task.completed ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-200"}`}>
                    {task.text}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                     <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                       task.priority === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-500/10' : 
                       task.priority === 'Medium' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/10' : 
                       'bg-blue-100 text-blue-600 dark:bg-blue-500/10'
                     }`}>
                       {task.priority} Priority
                     </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-slate-100 dark:border-slate-900 rounded-[3rem]">
            <AlertCircle size={40} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Your task list is empty</p>
          </div>
        )}
      </div>
    </div>
  );
}