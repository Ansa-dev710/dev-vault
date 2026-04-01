"use client";
import React, { useState, useEffect } from "react";
import { 
  Card, Text, Metric, Flex, Grid, 
  BarChart, Title, Subtitle, DonutChart 
} from "@tremor/react";
import { motion } from "framer-motion";
import { Activity, Zap, Target, TrendingUp, Calendar, Flame } from "lucide-react";

export default function AnalyticsSection() {
  const [counts, setCounts] = useState({ snippets: 0, resources: 0, tasks: 0 });

  useEffect(() => {
    // Real data counts from localStorage
    const snip = JSON.parse(localStorage.getItem("dev-vault-snippets") || "[]").length;
    const res = JSON.parse(localStorage.getItem("dev-vault-resources") || "[]").length;
    const task = JSON.parse(localStorage.getItem("dev-vault-tasks") || "[]").length;
    setCounts({ snippets: snip, resources: res, tasks: task });
  }, []);

  const stats = [
    { title: "Total Snippets", metric: counts.snippets, delta: "+12%", icon: <Zap size={16} /> },
    { title: "Vault Resources", metric: counts.resources, delta: "+5.2%", icon: <Activity size={16} /> },
    { title: "Pulse Tasks", metric: counts.tasks, delta: "+10%", icon: <Target size={16} /> },
  ];

  const chartdata = [
    { name: "Mon", "Activity": 45 },
    { name: "Tue", "Activity": 52 },
    { name: "Wed", "Activity": 48 },
    { name: "Thu", "Activity": 61 },
    { name: "Fri", "Activity": 55 },
    { name: "Sat", "Activity": 67 },
    { name: "Sun", "Activity": 40 },
  ];

  return (
    <div className="space-y-12 pb-10">
      
      {/* --- STATS GRID --- */}
      <Grid numItemsSm={2} numItemsLg={3} className="gap-8">
        {stats.map((item) => (
          <motion.div 
            key={item.title}
            whileHover={{ y: -5 }}
            className="relative p-8 bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] backdrop-blur-xl shadow-sm hover:border-blue-500/40 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-6">
              <Text className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{item.title}</Text>
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                {item.icon}
              </div>
            </div>
            <Flex justifyContent="start" alignItems="baseline" className="space-x-3">
              <Metric className="text-slate-900 dark:text-white text-4xl font-black tracking-tighter italic">{item.metric}</Metric>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                {item.delta}
              </span>
            </Flex>
          </motion.div>
        ))}
      </Grid>

      {/* --- ACTIVITY HEATMAP SECTION --- */}
      <div className="p-10 rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-3 mb-8">
            <Flame size={20} className="text-orange-500 animate-pulse" />
            <Title className="text-slate-900 dark:text-white text-2xl font-black italic tracking-tighter">Activity Heatmap.</Title>
        </div>
        <div className="flex flex-wrap gap-2">
            {[...Array(84)].map((_, i) => (
                <div 
                    key={i} 
                    className={`w-4 h-4 rounded-sm transition-all hover:scale-125 cursor-pointer ${
                        i % 7 === 0 ? 'bg-blue-600' : 
                        i % 5 === 0 ? 'bg-blue-400' : 
                        i % 3 === 0 ? 'bg-blue-200 dark:bg-blue-900/40' : 
                        'bg-slate-100 dark:bg-white/5'
                    }`}
                />
            ))}
        </div>
        <Subtitle className="text-slate-400 text-[10px] mt-6 font-bold uppercase tracking-[0.2em]">Consistency tracking for the last 12 weeks</Subtitle>
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BAR CHART */}
        <Card className="lg:col-span-2 bg-white/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-white/5 ring-0 shadow-sm rounded-[2.5rem] p-10 backdrop-blur-xl">
          <div className="mb-10">
            <Title className="text-slate-900 dark:text-white text-2xl font-black italic tracking-tighter">Activity Flow.</Title>
            <Subtitle className="text-slate-400 dark:text-slate-500 text-[11px] mt-1 font-bold uppercase tracking-widest">Weekly contribution spikes</Subtitle>
          </div>
          <BarChart
            className="h-72 mt-4"
            data={chartdata}
            index="name"
            categories={["Activity"]}
            colors={["blue"]}
            showGridLines={false}
            showYAxis={false}
            showAnimation={true}
            valueFormatter={(number: number) => `${number} actions`}
          />
        </Card>

        {/* DONUT CHART */}
        <Card className="bg-white/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-white/5 ring-0 shadow-sm rounded-[2.5rem] p-10 backdrop-blur-xl">
          <Title className="text-slate-900 dark:text-white text-2xl font-black italic tracking-tighter mb-2">Tech Split.</Title>
          <DonutChart
            className="h-56 mt-8"
            data={[
              { name: "TypeScript", value: 45 },
              { name: "React", value: 35 },
              { name: "Node.js", value: 20 },
            ]}
            category="value"
            index="name"
            colors={["blue-600", "blue-400", "indigo-900"]}
            variant="donut"
            showAnimation={true}
          />
          
          <div className="mt-10 space-y-5">
            <TechProgress label="TypeScript" percent={45} color="bg-blue-600" />
            <TechProgress label="React" percent={35} color="bg-blue-400" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function TechProgress({ label, percent, color }: { label: string, percent: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
        <span>{label}</span>
        <span className="text-slate-900 dark:text-white">{percent}%</span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`${color} h-full rounded-full`} 
        />
      </div>
    </div>
  );
}