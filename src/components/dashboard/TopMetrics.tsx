import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export const PerformanceGoal: React.FC = () => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "radialBar",
      sparkline: { enabled: true },
    },
    colors: ["#f97316"],
    plotOptions: {
      radialBar: {
        hollow: { size: "65%" },
        track: { background: "#f1f5f9" },
        dataLabels: {
          show: true,
          name: { show: false },
          value: {
            offsetY: 5,
            fontSize: "20px",
            fontWeight: "900",
            color: "#1e293b",
          },
        },
      },
    },
    stroke: { lineCap: "round" },
  };

  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-white/[0.05] h-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-1">Performance Goal</h4>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Monthly performance reports</p>
          
          <div className="mt-auto">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Total Sales</span>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
              $5.65K
            </h3>
            <button className="px-5 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95">
              View Reports
            </button>
          </div>
        </div>
        
        <div className="w-32 h-32">
          <Chart options={chartOptions} series={[60]} type="radialBar" height="160" />
        </div>
      </div>
    </div>
  );
};

export const StoreGrowth: React.FC = () => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "line",
      sparkline: { enabled: true },
      toolbar: { show: false },
    },
    colors: ["#f97316"],
    stroke: { curve: "smooth", width: 3 },
    tooltip: { enabled: false },
    markers: { size: 0 },
  };

  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-white/[0.05] h-full">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider">Store Growth</h4>
        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-lg">
          (+) 3.6%
        </span>
      </div>
      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">12.65%</h3>
      <div className="h-24">
        <Chart options={chartOptions} series={[{ data: [30, 40, 35, 50, 49, 60, 70, 91] }]} type="line" height="100%" />
      </div>
    </div>
  );
};

export const MonthlyEarning: React.FC = () => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      sparkline: { enabled: true },
      toolbar: { show: false },
    },
    colors: ["#f97316"],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "40%",
      },
    },
    tooltip: { enabled: false },
  };

  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-white/[0.05] h-full">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider">Monthly Earning</h4>
        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-lg">
          (-) 2.4%
        </span>
      </div>
      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">32.46K</h3>
      <div className="h-24">
        <Chart options={chartOptions} series={[{ data: [44, 55, 41, 67, 22, 43, 21, 33, 45, 13, 67] }]} type="bar" height="100%" />
      </div>
    </div>
  );
};
