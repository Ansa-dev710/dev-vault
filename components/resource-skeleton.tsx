"use client";
import { motion } from "framer-motion";

interface Props {
  viewMode?: "grid" | "list";
}

export default function ResourceSkeleton({ viewMode = "grid" }: Props) {
  return (
    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "max-w-4xl mx-auto space-y-4"}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative overflow-hidden ${
            viewMode === "grid" ? "rounded-[2.5rem] p-8 h-[350px]" : "rounded-2xl p-5 flex items-center justify-between h-24"
          }`}
        >
          {/* Shimmer Effect */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/30 dark:via-slate-800/40 to-transparent z-0"
          />

          {/* Content Logic based on View Mode */}
          <div className={`relative z-10 w-full flex ${viewMode === 'grid' ? 'flex-col justify-between h-full' : 'flex-row items-center justify-between'}`}>
            
            <div className={viewMode === 'grid' ? "space-y-6" : "flex-1 space-y-2"}>
              {/* Category Tag */}
              <div className="w-16 h-5 bg-slate-100 dark:bg-slate-800 rounded-full" />

              <div className="space-y-3">
                <div className={`${viewMode === 'grid' ? 'w-3/4 h-8' : 'w-1/2 h-6'} bg-slate-100 dark:bg-slate-800 rounded-xl`} />
                {viewMode === 'grid' && (
                  <>
                    <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                    <div className="w-5/6 h-4 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                  </>
                )}
              </div>
            </div>

            {/* Buttons / Actions */}
            <div className={`flex gap-3 ${viewMode === 'grid' ? 'mt-8' : 'ml-6'}`}>
              <div className={`${viewMode === 'grid' ? 'flex-1 h-14' : 'w-24 h-12'} bg-slate-100 dark:bg-slate-800 rounded-2xl`} />
              <div className={`${viewMode === 'grid' ? 'w-14 h-14' : 'w-12 h-12'} bg-slate-100 dark:bg-slate-800 rounded-2xl`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}