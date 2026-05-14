import React from "react";
import PageMeta from "../../components/common/PageMeta";
import { OverviewCards } from "../../components/dashboard/OverviewCards";
import { SalesReport, StoreOverview } from "../../components/dashboard/MiddleWidgets";
import { AnalyticsCharts } from "../../components/dashboard/AnalyticsCharts";
import { WeeklyStats, SalesHistory } from "../../components/dashboard/BottomWidgets";
import { QuickInsights } from "../../components/dashboard/QuickInsights";
import { motion } from "framer-motion";
import { Calendar, ChevronRight } from "lucide-react";

export default function Home() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <>
      <PageMeta
        title="Admin Dashboard | Nova Mart"
        description="Premium Professional Ecommerce Admin Dashboard"
      />

      <div className="space-y-10 pb-20">
        {/* Header: Clean Welcome Section */}
        <header className="relative group">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 mb-3"
              >
                <span className="h-1 w-6 bg-orange-500 rounded-full" />
                <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest">Dashboard Overview</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight"
              >
                Welcome back, <span className="text-orange-500">Admin</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 dark:text-slate-400 mt-3 max-w-lg font-medium text-sm"
              >
                Your store is performing well. Here is a summary of today's activity and key metrics.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 bg-white dark:bg-slate-800 px-6 py-3.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Today</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{currentDate}</p>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Quick Insights Section */}
        <QuickInsights />

        {/* Top: Overview Metrics */}
        <section>
           <OverviewCards />
        </section>

        {/* Main: Core Sales Data */}
        <section className="grid grid-cols-12 gap-8">
          <div className="col-span-12 xl:col-span-8">
            <SalesReport />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <StoreOverview />
          </div>
        </section>

        {/* Analytics Section Header */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Module Analytics</h4>
              <p className="text-xs font-medium text-slate-400 mt-1">Detailed growth trends across all system modules</p>
            </div>
            <button className="flex items-center gap-2 text-[11px] font-bold text-orange-500 uppercase tracking-widest group">
              Detailed Reports <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <AnalyticsCharts />
        </section>

        {/* Insights: Operations & History */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <WeeklyStats />
          <SalesHistory />
        </section>
      </div>
    </>
  );
}