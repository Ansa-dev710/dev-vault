"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Plus, 
  CalendarDays,
  MapPin,
  Video,
  MoreVertical
} from "lucide-react";

interface ScheduleEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  type: "meeting" | "task" | "deadline";
  color: string;
}

export default function ScheduleSection() {
  const [events] = useState<ScheduleEvent[]>([
    {
      id: "event-101",
      title: "Project Discovery Call",
      start: "09:30 AM",
      end: "10:30 AM",
      location: "Google Meet",
      type: "meeting",
      color: "bg-blue-500"
    },
    {
      id: "event-202",
      title: "Dashboard UI Refinement",
      start: "01:00 PM",
      end: "03:00 PM",
      type: "task",
      color: "bg-indigo-500"
    },
    {
      id: "event-303",
      title: "GitHub Repo Deployment",
      start: "05:00 PM",
      end: "06:00 PM",
      type: "deadline",
      color: "bg-rose-500"
    }
  ]);

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
    
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[3rem] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              {dateString}
            </h3>
            <CalendarDays size={18} className="text-slate-400" />
          </div>

      
          <div className="grid grid-cols-7 gap-1 text-center mb-4">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
              <span 
                key={`weekday-header-${idx}-${day}`} 
                className="text-[10px] font-bold text-slate-300 dark:text-slate-600 pb-2"
              >
                {day}
              </span>
            ))}
            
          
            {Array.from({ length: 31 }).map((_, i) => {
              const dayNum = i + 1;
              const isToday = dayNum === today.getDate();
              return (
                <button 
                  key={`calendar-day-button-${i}`} 
                  className={`aspect-square text-[11px] font-bold rounded-2xl flex items-center justify-center transition-all ${
                    isToday 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110" 
                    : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>


        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[3rem] text-white shadow-2xl shadow-blue-500/20 group overflow-hidden relative">
          <div className="relative z-10">
            <h4 className="text-xl font-bold mb-2">New Event</h4>
            <p className="text-blue-100 text-xs mb-6 leading-relaxed">Schedule a new meeting or set a deadline.</p>
            <button className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all">
              <Plus size={16} /> Add Now
            </button>
          </div>
          <SparkleIcon className="absolute -bottom-4 -right-4 text-white/10 w-32 h-32 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
        </div>
      </div>

  
      <div className="lg:col-span-8 space-y-8">
        <div className="flex items-end justify-between px-2">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">Timeline<span className="text-blue-600 not-italic">.</span></h2>
            <p className="text-sm text-slate-500 font-medium">You have {events.length} sessions today.</p>
          </div>
        </div>

        <div className="space-y-4 relative before:absolute before:left-[35px] before:top-0 before:bottom-0 before:w-px before:bg-slate-100 dark:before:bg-slate-800">
          <AnimatePresence mode="popLayout">
            {events.map((event, index) => (
              <motion.div
                key={`timeline-event-${event.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex items-start gap-8 relative"
              >
                <div className={`mt-6 w-4 h-4 rounded-full border-4 border-white dark:border-[#020617] z-10 shadow-sm ${event.color}`} />
                
                <div className="flex-1 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 p-6 rounded-[2.5rem] hover:shadow-2xl hover:shadow-blue-500/5 transition-all flex items-center justify-between group-hover:border-blue-500/30">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={12} /> {event.start} — {event.end}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h4>
                  </div>
                  <button className="p-4 text-slate-300 hover:text-slate-600 dark:hover:text-slate-100 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
  );
}