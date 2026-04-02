"use client";
import React, { useState, useEffect, useMemo } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, GripVertical, Trash2, X, CheckCircle2, Circle, Clock } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  content: string;
  priority: "Low" | "Medium" | "High";
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const TasksSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [mounted, setMounted] = useState(false);
  
  const [columns, setColumns] = useState<{ [key: string]: Column }>({
    todo: { id: "todo", title: "To Do", tasks: [] },
    inProgress: { id: "inProgress", title: "In Progress", tasks: [] },
    done: { id: "done", title: "Completed", tasks: [] },
  });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("dev-vault-tasks");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure structure is correct
        if (parsed.todo && parsed.inProgress && parsed.done) {
          setColumns(parsed);
        }
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    }
  }, []);

  const saveToLocal = (newCols: any) => {
    setColumns(newCols);
    localStorage.setItem("dev-vault-tasks", JSON.stringify(newCols));
  };

  // --- SAFE STATS CALCULATION ---
  // useMemo use kar rahe hain taake calculation sirf tab ho jab columns change hon
  const stats = useMemo(() => {
    if (!mounted) return { total: 0, completed: 0, progress: 0 };
    
    const total = Object.values(columns).reduce((acc, col) => acc + (col?.tasks?.length || 0), 0);
    const completed = columns.done?.tasks?.length || 0;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, progress };
  }, [columns, mounted]);

  const addTask = () => {
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      content: newTaskText,
      priority: newTaskPriority,
    };
    const newCols = { ...columns };
    newCols.todo.tasks = [newTask, ...newCols.todo.tasks];
    saveToLocal(newCols);
    setNewTaskText("");
    setIsModalOpen(false);
    toast.success("Task added");
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    if (!sourceCol || !destCol) return;

    const sourceTasks = [...sourceCol.tasks];
    const destTasks = source.droppableId === destination.droppableId ? sourceTasks : [...destCol.tasks];
    const [removed] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, removed);
    
    saveToLocal({
      ...columns,
      [source.droppableId]: { ...sourceCol, tasks: sourceTasks },
      [destination.droppableId]: { ...destCol, tasks: destTasks },
    });
  };

  const deleteTask = (colId: string, taskId: string) => {
    const newCols = { ...columns };
    newCols[colId].tasks = newCols[colId].tasks.filter(t => t.id !== taskId);
    saveToLocal(newCols);
    toast.error("Task removed");
  };

  if (!mounted) return null;

  return (
    <div className="p-4 max-w-7xl mx-auto pb-32">
      {/* Stats Dashboard */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-slate-900/50 p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-sm">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Progress</p>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black italic text-blue-600">{stats.progress}%</span>
            <div className="flex-1 h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${stats.progress}%` }} className="h-full bg-blue-600" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center border-l border-slate-100 dark:border-white/5 pl-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pending Tasks</p>
          <span className="text-2xl font-bold dark:text-white">
            {(columns.todo?.tasks?.length || 0) + (columns.inProgress?.tasks?.length || 0)}
          </span>
        </div>
        <div className="flex flex-col justify-center border-l border-slate-100 dark:border-white/5 pl-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Done</p>
          <span className="text-2xl font-bold text-emerald-500">{stats.completed}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-10 px-2">
        <h2 className="text-4xl font-black italic tracking-tighter dark:text-white">Task <span className="text-blue-600">Board.</span></h2>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">
          <Plus size={16} /> New Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="space-y-6">
              <div className="px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{column.title}</span>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg text-slate-400">{column?.tasks?.length || 0}</span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-[500px] p-3 rounded-[2.5rem] transition-all duration-300 ${snapshot.isDraggingOver ? "bg-blue-500/5 ring-2 ring-blue-500/10" : "bg-slate-50/50 dark:bg-white/[0.02]"}`}
                  >
                    {column.tasks?.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={`group mb-4 p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 rounded-3xl transition-all ${dragSnapshot.isDragging ? "shadow-2xl ring-2 ring-blue-500/50 scale-[1.02]" : "shadow-sm"}`}
                          >
                            <div className="flex items-start gap-3">
                              <GripVertical size={16} className="mt-1 text-slate-300 group-hover:text-blue-500" />
                              <div className="flex-1 space-y-4">
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">{task.content}</p>
                                <div className="flex justify-between items-center">
                                  <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md border ${
                                    task.priority === 'High' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                                    task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                    'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                  }`}>
                                    {task.priority}
                                  </span>
                                  <button onClick={() => deleteTask(column.id, task.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-2xl font-black italic tracking-tighter mb-6 dark:text-white">Add Task.</h3>
              <textarea value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} className="w-full h-32 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 mb-4" placeholder="Task description..." />
              <div className="flex gap-2 mb-6">
                {(['Low', 'Medium', 'High'] as const).map((p) => (
                  <button key={p} onClick={() => setNewTaskPriority(p)} className={`flex-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${newTaskPriority === p ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-slate-400 border-slate-200 dark:border-white/10'}`}>
                    {p}
                  </button>
                ))}
              </div>
              <button onClick={addTask} className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">Create Task</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TasksSection;