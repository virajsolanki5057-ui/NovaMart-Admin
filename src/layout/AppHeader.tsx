import { useState } from "react";
import { Link } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import UserDropdown from "../components/header/UserDropdown";
import { Menu, X, MoreVertical } from "lucide-react";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  return (
    <header className="sticky top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 z-[9999]">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-4 lg:px-8 h-16">
        
        {/* Left: Toggle & Branding (Mobile) */}
        <div className="flex items-center gap-4">
          <button
            className="flex items-center justify-center w-10 h-10 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Nova <span className="text-orange-500">Mart</span>
            </span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-12">
          <div className="relative w-full group">
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full bg-slate-50 dark:bg-white/5 border border-transparent focus:border-orange-500/20 focus:bg-white rounded-xl px-6 py-2 text-sm outline-none transition-all dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 group-hover:bg-slate-100 dark:group-hover:bg-slate-800"
            />
          </div>
        </div>

        {/* Right Area: User & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-slate-500 rounded-xl lg:hidden hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            <MoreVertical size={20} />
          </button>

          <div className={`${isApplicationMenuOpen ? "flex" : "hidden"} items-center justify-end gap-6 lg:flex`}>
            {/* Quick Actions */}
            <div className="hidden sm:flex items-center gap-6 pr-6 border-r border-slate-100 dark:border-slate-800">
               <button className="text-[11px] font-bold text-slate-400 hover:text-orange-500 uppercase tracking-widest transition-colors">Quick View</button>
               <button className="text-[11px] font-bold text-slate-400 hover:text-orange-500 uppercase tracking-widest transition-colors">Reports</button>
            </div>
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
