import { useCallback } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { motion } from "framer-motion";

import { 
  LayoutGrid, 
  Users, 
  ShieldCheck, 
  Box, 
  ShoppingBag, 
  Mail 
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    icon: <LayoutGrid size={20} />,
    path: "/",
  },
  {
    name: "Users",
    icon: <Users size={20} />,
    path: "/User",
  },
  {
    name: "Admins",
    icon: <ShieldCheck size={20} />,
    path: "/admins",
  },
  {
    name: "Products",
    icon: <Box size={20} />,
    path: "/products",
  },
  {
    name: "Orders",
    icon: <ShoppingBag size={20} />,
    path: "/orders",
  },
  {
    name: "Contacts",
    icon: <Mail size={20} />,
    path: "/contacts",
  }
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-1.5 px-3">
      {items.map((nav) => {
        const showFull = isExpanded || isHovered || isMobileOpen;
        const active = isActive(nav.path);

        return (
          <li key={nav.path}>
            <Link
              to={nav.path}
              className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group relative
                ${active 
                  ? "bg-orange-50 text-orange-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"} 
                ${!showFull ? "justify-center" : "justify-start"}`}
            >
              <span className={`transition-all duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
                {nav.icon}
              </span>
              
              {showFull && (
                <span className={`ml-3.5 text-sm tracking-tight ${active ? "font-bold" : "font-medium"}`}>
                  {nav.name}
                </span>
              )}

              {active && showFull && (
                <motion.div 
                  layoutId="active-nav-indicator"
                  className="absolute right-4 w-1.5 h-1.5 rounded-full bg-orange-500"
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white transition-all duration-500 ease-in-out dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800
        ${isExpanded || isMobileOpen || isHovered ? "w-[280px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-20 flex items-center px-7">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 relative overflow-hidden group">
            <span className="text-white font-bold text-xl relative z-10 transition-transform group-hover:scale-110">N</span>
          </div>
          {(isExpanded || isHovered || isMobileOpen) && (
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none tracking-tight text-slate-900 dark:text-white">
                Nova <span className="text-orange-500">Mart</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">Admin Panel</span>
            </div>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar py-6">
        <nav>
          <div className="px-8 mb-4">
            <p className={`text-[10px] font-bold uppercase tracking-widest text-slate-400 ${!(isExpanded || isHovered || isMobileOpen) ? "text-center" : ""}`}>
              {isExpanded || isHovered || isMobileOpen ? "Menu" : "•••"}
            </p>
          </div>
          {renderMenuItems(navItems)}
        </nav>
      </div>

      {(isExpanded || isHovered || isMobileOpen) && (
        <div className="p-6">
           <div className="bg-orange-50 dark:bg-slate-800 rounded-2xl p-4 border border-orange-100 dark:border-slate-700">
              <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-1">Status</p>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">System is running smooth.</p>
           </div>
        </div>
      )}
    </aside>
  );
};

export default AppSidebar;
