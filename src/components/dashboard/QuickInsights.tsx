import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Zap, Bell } from "lucide-react";

export const QuickInsights: React.FC = () => {
  const insights = [
    {
      id: 1,
      text: "Store performance is optimal today. No critical issues detected.",
      icon: <Zap size={18} className="text-orange-600" />,
      tag: "Status",
    },
    {
      id: 2,
      text: "Remember to restock top-selling luxury watches by end of week.",
      icon: <AlertCircle size={18} className="text-orange-600" />,
      tag: "Inventory",
    },
    {
      id: 3,
      text: "New customer feedback received. View details in the messages tab.",
      icon: <Bell size={18} className="text-orange-600" />,
      tag: "Update",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {insights.map((insight, idx) => (
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-start gap-4 bg-orange-50 border border-orange-100 p-5 rounded-[2rem] hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
        >
          <div className="mt-1 bg-white p-2.5 rounded-xl shadow-sm">
            {insight.icon}
          </div>
          <div>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1 block">
              {insight.tag}
            </span>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
              {insight.text}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
