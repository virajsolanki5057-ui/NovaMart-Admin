import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered } = useSidebar();

  return (
    <div className="min-h-screen xl:flex bg-gray-50/50 dark:bg-luxury-black">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-500 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[280px]" : "lg:ml-[90px]"
        }`}
      >
        <AppHeader />
        <main className="p-6 mx-auto max-w-[1600px] md:p-10 lg:p-12 min-h-[calc(100vh-80px)]">
          <Outlet />
        </main>
        
        {/* Luxury Footer Accent */}
        <footer className="p-12 border-t border-gray-100 dark:border-white/5 text-center">
           <p className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.5em]">
             &copy; 2026 Nova Mart &bull; Excellence in Ecommerce
           </p>
        </footer>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
