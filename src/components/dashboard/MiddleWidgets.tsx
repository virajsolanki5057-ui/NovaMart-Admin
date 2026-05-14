import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { IndianRupee, ShoppingBag, Wallet, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export const SalesReport: React.FC = () => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      sparkline: { enabled: false },
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#D4AF37", "#0A0A0A"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.02,
        stops: [0, 90, 100],
      },
    },
    stroke: { curve: "smooth", width: 2.5 },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#94a3b8", fontSize: "10px", fontWeight: "700" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#94a3b8", fontSize: "10px", fontWeight: "700" },
      },
    },
    grid: {
      borderColor: "rgba(212, 175, 55, 0.05)",
      strokeDashArray: 4,
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val) => `₹${val.toLocaleString()}`
      }
    },
  };

  const series = [
    {
      name: "Luxury Sales",
      data: [31, 40, 28, 51, 42, 109, 100, 120, 80, 90, 70, 110],
    },
    {
      name: "Volume",
      data: [11, 32, 45, 32, 34, 52, 41, 60, 50, 45, 60, 55],
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="luxury-card p-8 h-full"
    >
      <div className="flex items-center justify-between mb-10">
        <div>
          <h4 className="text-xl font-black text-luxury-black dark:text-white uppercase tracking-tight">Sales Analytics</h4>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Global Revenue Performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 mr-4">
             <div className="w-2 h-2 rounded-full bg-luxury-gold" />
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue</span>
          </div>
          <select className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-[0.2em] outline-none cursor-pointer hover:border-luxury-gold transition-all">
            <option>Monthly</option>
            <option>Quarterly</option>
            <option>Yearly</option>
          </select>
        </div>
      </div>
      <div className="h-[320px]">
        <Chart options={chartOptions} series={series} type="area" height="100%" />
      </div>
    </motion.div>
  );
};

export const StoreOverview: React.FC = () => {
  const items = [
    {
      label: "Boutique Sales",
      value: "₹89,585",
      icon: <ShoppingBag size={20} />,
      color: "text-luxury-gold",
      bg: "bg-luxury-gold/10",
    },
    {
      label: "Net Orders",
      value: "42,455",
      icon: <IndianRupee size={20} />,
      color: "text-luxury-black dark:text-white",
      bg: "bg-luxury-black/10 dark:bg-white/10",
    },
    {
      label: "Total Earnings",
      value: "₹38,625",
      icon: <Wallet size={20} />,
      color: "text-luxury-gold",
      bg: "bg-luxury-gold/10",
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="luxury-card p-8 h-full"
    >
      <div className="flex items-center justify-between mb-10">
        <h4 className="text-xl font-black text-luxury-black dark:text-white uppercase tracking-tight">Store Metrics</h4>
        <button className="text-gray-300 hover:text-luxury-gold transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <div className="space-y-6">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50/50 dark:bg-white/[0.02] border border-transparent hover:border-luxury-gold/20 hover:bg-white dark:hover:bg-gray-900 transition-all group">
            <div className={`h-12 w-12 flex items-center justify-center rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <div className="flex flex-col items-end text-right">
              <h3 className="text-2xl font-black text-luxury-black dark:text-white leading-none mb-2 tracking-tight">{item.value}</h3>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 p-6 rounded-3xl bg-luxury-black text-white text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-60">Global Reach</p>
         <p className="text-xl font-medium">94% Target Reached</p>
         <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "94%" }}
              transition={{ duration: 1.5 }}
              className="h-full bg-luxury-gold" 
            />
         </div>
      </div>
    </motion.div>
  );
};
