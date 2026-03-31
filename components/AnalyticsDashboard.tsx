"use client";
import { 
  Card, Text, Metric, Flex, Grid, 
  BarChart, Title, Subtitle, DonutChart 
} from "@tremor/react";
import { motion } from "framer-motion";
import { Activity, Zap, Target, TrendingUp } from "lucide-react";

export default function AnalyticsDashboard() {
  const stats = [
    { title: "Total Snippets", metric: "128", delta: "+12%", status: "increase", icon: <Zap size={16} /> },
    { title: "Team Activity", metric: "432", delta: "+5.2%", status: "moderateIncrease", icon: <Activity size={16} /> },
    { title: "Project Progress", metric: "84%", delta: "+10%", status: "increase", icon: <Target size={16} /> },
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
    <div className="p-4 space-y-12 min-h-screen transition-colors duration-700">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.2em] text-[10px]">
          <TrendingUp size={14} />
          <span>Insights / Productivity</span>
        </div>
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic italic">
          Analytics <span className="text-blue-600">Overview.</span>
        </h1>
      </div>

      {/* --- STATS GRID --- */}
      <Grid numItemsSm={2} numItemsLg={3} className="gap-8">
        {stats.map((item) => (
          <motion.div 
            key={item.title}
            whileHover={{ y: -5 }}
            className="relative group p-8 bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] backdrop-blur-xl shadow-sm hover:border-blue-500/40 transition-all duration-500"
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

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BAR CHART */}
        <Card className="lg:col-span-2 bg-white/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-white/5 ring-0 shadow-sm rounded-[2.5rem] p-10 backdrop-blur-xl">
          <div className="mb-10">
            <Title className="text-slate-900 dark:text-white text-2xl font-black italic tracking-tighter">Activity Flow.</Title>
            <Subtitle className="text-slate-400 dark:text-slate-500 text-[11px] mt-1 font-bold uppercase tracking-widest">Weekly contribution spikes</Subtitle>
          </div>
          <BarChart
            className="h-80 mt-4"
            data={chartdata}
            index="name"
            categories={["Activity"]}
            colors={["blue"]}
            showGridLines={false}
            showYAxis={false}
            showAnimation={true}
            valueFormatter={(number: number) => `${number} commits`}
          />
        </Card>

        {/* DONUT CHART */}
        <Card className="bg-white/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-white/5 ring-0 shadow-sm rounded-[2.5rem] p-10 backdrop-blur-xl">
          <Title className="text-slate-900 dark:text-white text-2xl font-black italic tracking-tighter mb-2">Tech Split.</Title>
          <DonutChart
            className="h-64 mt-12"
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
          
          <div className="mt-12 space-y-5">
            <TechProgress label="TypeScript" percent={45} color="bg-blue-600" />
            <TechProgress label="React" percent={35} color="bg-blue-400" />
          </div>
        </Card>

      </div>
    </div>
  );
}

// Custom Progress Component for Tech Split
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