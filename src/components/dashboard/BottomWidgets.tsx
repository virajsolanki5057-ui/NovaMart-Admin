import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export const WeeklyStats: React.FC = () => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    colors: ["#f97316", "#f1f5f9"],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "25%",
      },
    },
    dataLabels: { enabled: false },
    tooltip: { enabled: false },
  };

  return (
    <div className="rounded-[32px] bg-transparent p-8 transition-all flex flex-col h-full hover:bg-gray-100/30 dark:hover:bg-white/[0.01]">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wider">Weekly Stats</h4>
        <button className="text-gray-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
      </div>
      
      <div className="h-40 mb-8">
        <Chart options={chartOptions} series={[{ name: "Stats", data: [44, 55, 41, 67, 22, 43, 21] }]} type="bar" height="100%" />
      </div>

      <div className="space-y-4 mt-auto">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-white/[0.02] hover:bg-gray-100/50 dark:hover:bg-white/[0.04] transition-all">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Sales</span>
              <span className="text-[11px] font-bold text-gray-500">2,456 Sales</span>
            </div>
          </div>
          <span className="text-sm font-black text-gray-900 dark:text-white">₹5,458</span>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-white/[0.02] hover:bg-gray-100/50 dark:hover:bg-white/[0.04] transition-all">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-green-50 text-green-500 dark:bg-green-500/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Revenue</span>
              <span className="text-[11px] font-bold text-gray-500">Expected earnings</span>
            </div>
          </div>
          <span className="text-sm font-black text-green-600">₹8,568</span>
        </div>
      </div>
    </div>
  );
};

export const BestSelling: React.FC = () => {
  const products = [
    { name: "Edifier headphone", code: "#WLH-001", reviews: "895 Reviews", rating: 5, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" },
    { name: "Apple watch ultra", code: "#PCK-202", reviews: "732 Reviews", rating: 5, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" },
    { name: "Google pixel buds", code: "#SHS-303", reviews: "621 Reviews", rating: 5, img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop" },
    { name: "iPhone 15 pro max", code: "#UHD-404", reviews: "543 Reviews", rating: 5, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop" },
  ];

  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-white/[0.05] h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wider">Best Selling</h4>
        <button className="text-gray-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
      </div>

      <div className="space-y-5">
        {products.map((product, idx) => (
          <div key={idx} className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 overflow-hidden group-hover:scale-105 transition-transform">
                <img src={product.img} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col">
                <h5 className="text-sm font-black text-gray-900 dark:text-white mb-0.5 leading-none">{product.name}</h5>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Code: {product.code}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex gap-0.5 text-orange-500 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                ))}
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.reviews}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SalesHistory: React.FC = () => {
  const transactions = [
    { name: "Timothy Boyd", date: "24 Dec, 2023", amount: "₹250.00", color: "text-blue-500" },
    { name: "Adrian Monino", date: "23 Dec, 2023", amount: "₹220.00", color: "text-pink-500" },
    { name: "Socrates Itumay", date: "22 Dec, 2023", amount: "₹180.00", color: "text-green-500" },
    { name: "Althea Cabardo", date: "21 Dec, 2023", amount: "₹150.00", color: "text-orange-500" },
  ];

  const chartOptions: ApexOptions = {
    chart: {
      type: "line",
      sparkline: { enabled: true },
    },
    colors: ["#3b82f6"],
    stroke: { curve: "smooth", width: 2 },
    tooltip: { enabled: false },
  };

  return (
    <div className="rounded-[32px] bg-transparent p-8 transition-all flex flex-col h-full hover:bg-gray-100/30 dark:hover:bg-white/[0.01]">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wider">Sales History</h4>
        <button className="text-gray-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
      </div>

      <div className="h-20 mb-8">
        <Chart options={chartOptions} series={[{ data: [20, 35, 15, 45, 25, 55] }]} type="line" height="100%" />
      </div>

      <div className="space-y-5 mt-auto">
        {transactions.map((t, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 ${t.color.replace('text', 'bg').replace('-500', '-50')} bg-opacity-10`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={t.color}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              </div>
              <div className="flex flex-col">
                <h5 className="text-sm font-black text-gray-900 dark:text-white leading-none mb-1">{t.name}</h5>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.date}</span>
              </div>
            </div>
            <span className={`text-sm font-black ${t.color}`}>{t.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
