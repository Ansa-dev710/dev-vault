"use client";
import { motion } from "framer-motion";

export default function ResourceSkeleton() {
  return (
    // Grid matches the dashboard: 1 col on mobile, 2 on tablet, 3 on desktop
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 h-[350px] relative overflow-hidden"
        >
          {/* Shimmer Effect Animation */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/30 dark:via-slate-800/40 to-transparent z-0"
          />

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-6">
              {/* Category Tag Skeleton */}
              <div className="w-20 h-6 bg-slate-100 dark:bg-slate-800 rounded-full" />

              <div className="space-y-3">
                {/* Title Skeleton */}
                <div className="w-3/4 h-8 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                {/* Description Skeleton */}
                <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                <div className="w-5/6 h-4 bg-slate-100 dark:bg-slate-800 rounded-lg" />
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="mt-8 flex gap-3">
              <div className="flex-1 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}