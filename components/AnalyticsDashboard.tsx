"use client";

import { 
  Card, Text, Metric, Flex, BadgeDelta, Grid, 
  BarChart, Title, Subtitle, DonutChart 
} from "@tremor/react";

export default function AnalyticsDashboard() {
  const stats = [
    { title: "Total Snippets", metric: "128", delta: "+12%", status: "increase" },
    { title: "Team Activity", metric: "432", delta: "+5.2%", status: "moderateIncrease" },
    { title: "Progress", metric: "84%", delta: "+10%", status: "increase" },
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
    <div className="p-6 space-y-10 bg-white min-h-screen font-sans">
      
      {/* 1. Header Section */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Overview</h1>
        <p className="text-slate-500 text-sm font-medium">Monitoring your vault's performance and activity.</p>
      </div>

      {/* 2. Sleek KPI Cards */}
      <Grid numItemsSm={2} numItemsLg={3} className="gap-8">
        {stats.map((item) => (
          <div key={item.title} className="relative group p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">{item.title}</Text>
            <Flex justifyContent="start" alignItems="baseline" className="space-x-3 mt-3">
              <Metric className="text-slate-900 text-3xl font-bold tracking-tighter">{item.metric}</Metric>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{item.delta}</span>
            </Flex>
          </div>
        ))}
      </Grid>

      {/* 3. Main Chart - Ultra Clean */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <Card className="lg:col-span-2 bg-white border-slate-100 ring-0 shadow-sm rounded-[2rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Title className="text-slate-900 text-lg font-bold">Activity Flow</Title>
              <Subtitle className="text-slate-400 text-xs mt-1 font-medium">Weekly code contribution spikes</Subtitle>
            </div>
          </div>
          <div className="[&_rect]:fill-blue-600 [&_rect]:rx-md"> 
            <BarChart
              className="h-72 mt-4"
              data={chartdata}
              index="name"
              categories={["Activity"]}
              colors={["blue"]}
              showGridLines={false}
              showYAxis={false}
              showAnimation={true}
            />
          </div>
        </Card>

        {/* 4. Distribution - Minimal Pie */}
        <Card className="bg-white border-slate-100 ring-0 shadow-sm rounded-[2rem] p-8">
          <Title className="text-slate-900 text-lg font-bold mb-2">Tech Split</Title>
          <DonutChart
            className="h-64 mt-10"
            data={[
              { name: "TS", value: 45 },
              { name: "React", value: 35 },
              { name: "Other", value: 20 },
            ]}
            category="value"
            index="name"
            colors={["blue-600", "blue-400", "blue-200"]}
            variant="donut"
            showAnimation={true}
          />
          <div className="mt-8 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>TypeScript</span>
              <span className="text-slate-900">45%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[45%]" />
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}