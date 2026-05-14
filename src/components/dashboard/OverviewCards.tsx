import React, { useEffect, useState } from "react";
import { productsApi } from "../../api/productsApi";
import { userApi } from "../../api/userApi";
import { ordersApi } from "../../api/ordersApi";
import { contactApi } from "../../api/contactApi";
import { Box, Users, Mail, IndianRupee, TrendingUp, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export const OverviewCards: React.FC = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    contacts: 0,
    revenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, users, orders, contacts] = await Promise.all([
          productsApi.getProducts(),
          userApi.getUsers(),
          ordersApi.getOrders(),
          contactApi.getContacts(),
        ]);
        setStats({
          products: products.length,
          users: users.length,
          orders: orders.length,
          contacts: contacts.length,
          revenue: orders.length * 1250,
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Inventory",
      value: stats.products,
      growth: "+12.5%",
      icon: <Box size={20} />,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-500/10",
      accent: "border-orange-100 dark:border-orange-500/20",
    },
    {
      label: "Customer Base",
      value: stats.users,
      growth: "+5.2%",
      icon: <Users size={20} />,
      color: "text-slate-600 dark:text-slate-300",
      bg: "bg-slate-50 dark:bg-white/10",
      accent: "border-slate-100 dark:border-white/5",
    },
    {
      label: "Annual Revenue",
      value: `₹${stats.revenue.toLocaleString()}`,
      growth: "+18.4%",
      icon: <IndianRupee size={20} />,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-500/10",
      accent: "border-orange-100 dark:border-orange-500/20",
    },
    {
      label: "Client Inquiries",
      value: stats.contacts,
      growth: "+2.1%",
      icon: <Mail size={20} />,
      color: "text-slate-600 dark:text-slate-300",
      bg: "bg-slate-50 dark:bg-white/10",
      accent: "border-slate-100 dark:border-white/5",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="luxury-card group p-6 relative overflow-hidden"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity pointer-events-none">
            <div className="scale-[4]">
              {card.icon}
            </div>
          </div>

          <div className="flex items-start justify-between mb-6">
            <div className={`h-10 w-10 flex items-center justify-center rounded-xl ${card.bg} ${card.color} transition-transform duration-500 group-hover:scale-110`}>
              {card.icon}
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 bg-opacity-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg uppercase tracking-wider">
                <TrendingUp size={10} />
                {card.growth}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                {isLoading ? (
                  <div className="h-8 w-20 bg-slate-100 dark:bg-white/5 rounded-lg animate-pulse" />
                ) : (
                  card.value
                )}
              </h3>
              {!isLoading && <ArrowUpRight size={14} className="text-slate-300 group-hover:text-orange-500 transition-colors" />}
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {card.label}
            </span>
          </div>

          {/* Minimal Bottom Accent */}
          <div className="absolute bottom-0 left-0 h-1 w-0 bg-orange-500 group-hover:w-full transition-all duration-700 ease-in-out" />
        </motion.div>
      ))}
    </div>
  );
};
