import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { hideAlert, showAlert, clearAlerts, AlertMessage, AlertType } from "../../../store/alertSlice";

/**
 * World-Class useAlert Hook
 */
export const useAlert = () => {
  const dispatch = useAppDispatch();
  return {
    success: (message: string, title: string = "Success") => dispatch(showAlert({ title, message, type: "success" })),
    error: (message: string, title: string = "Error") => dispatch(showAlert({ title, message, type: "error" })),
    warn: (message: string, title: string = "Warning") => dispatch(showAlert({ title, message, type: "warning" })),
    info: (message: string, title: string = "Information") => dispatch(showAlert({ title, message, type: "info" })),
    clear: () => dispatch(clearAlerts()),
  };
};

/**
 * Individual Premium Alert Component
 */
const AlertItem: React.FC<{ alert: AlertMessage }> = ({ alert }) => {
  const dispatch = useAppDispatch();
  const { id, type, title, message, autoClose = true, duration = 5000 } = alert;
  
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(duration);
  const timerRef = useRef<number | null>(null);

  const handleClose = useCallback(() => {
    dispatch(hideAlert(id));
  }, [dispatch, id]);

  const startTimer = useCallback(() => {
    if (!autoClose) return;
    startTimeRef.current = Date.now();
    timerRef.current = window.setTimeout(handleClose, remainingTimeRef.current);
  }, [autoClose, handleClose, remainingTimeRef]);

  const pauseTimer = () => {
    if (!autoClose || !timerRef.current) return;
    window.clearTimeout(timerRef.current);
    remainingTimeRef.current -= Date.now() - startTimeRef.current;
    setIsPaused(true);
  };

  const resumeTimer = () => {
    if (!autoClose) return;
    setIsPaused(false);
    startTimer();
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, [startTimer]);

  const variants = {
    success: {
      bg: "bg-white/90 dark:bg-emerald-950/60",
      border: "border-emerald-500/30",
      accent: "bg-emerald-500",
      text: "text-emerald-700 dark:text-emerald-400",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    error: {
      bg: "bg-white/90 dark:bg-rose-950/60",
      border: "border-rose-500/30",
      accent: "bg-rose-500",
      text: "text-rose-700 dark:text-rose-400",
      icon: <AlertCircle className="w-5 h-5" />,
    },
    warning: {
      bg: "bg-white/90 dark:bg-amber-950/60",
      border: "border-amber-500/30",
      accent: "bg-amber-500",
      text: "text-amber-700 dark:text-amber-400",
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    info: {
      bg: "bg-white/90 dark:bg-blue-950/60",
      border: "border-blue-500/30",
      accent: "bg-blue-500",
      text: "text-blue-700 dark:text-blue-400",
      icon: <Info className="w-5 h-5" />,
    },
  };

  const style = variants[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      className={`group relative flex w-[calc(100vw-48px)] sm:w-[380px] gap-4 p-4 border backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] ${style.bg} ${style.border} pointer-events-auto overflow-hidden`}
    >
      {/* Visual Accent Layer */}
      <div className={`absolute top-0 left-0 w-1.5 h-full ${style.accent}`} />
      
      <div className={`flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-gray-50 dark:bg-white/5 ${style.text}`}>
        {style.icon}
      </div>

      <div className="flex-1 min-w-0 pr-6">
        <h4 className="text-[15px] font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
          {title}
        </h4>
        <p className="mt-1 text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed break-words">
          {message}
        </p>
      </div>

      <button
        onClick={handleClose}
        className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Modern Progress Bar */}
      {autoClose && (
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black/5 dark:bg-white/5">
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: isPaused ? undefined : 0 }}
            transition={{ duration: remainingTimeRef.current / 1000, ease: "linear" }}
            className={`h-full w-full origin-left ${style.accent}`}
          />
        </div>
      )}
    </motion.div>
  );
};

/**
 * World-Class Alert Container
 */
export const AlertContainer: React.FC = () => {
  const alerts = useAppSelector((state) => state.alerts.alerts);
  const dispatch = useAppDispatch();
  
  // Show latest 5
  const visibleAlerts = alerts.slice(-5);

  return (
    <div 
      className="fixed top-6 right-6 z-[999999] flex flex-col items-end pointer-events-none w-auto max-w-full gap-3"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {alerts.length > 3 && (
          <motion.button
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => dispatch(clearAlerts())}
            className="pointer-events-auto mb-2 flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full shadow-lg hover:text-rose-500 hover:border-rose-500/50 transition-all active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All Notifications
          </motion.button>
        )}
        
        {visibleAlerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * Reusable Static Alert
 */
export const StaticAlert: React.FC<{
  type: AlertType;
  title: string;
  message: string;
  className?: string;
}> = ({ type, title, message, className = "" }) => {
  const styles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-500/5 dark:border-emerald-500/20 dark:text-emerald-400",
    error: "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-500/5 dark:border-rose-500/20 dark:text-rose-400",
    warning: "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-500/5 dark:border-amber-500/20 dark:text-amber-400",
    info: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-500/5 dark:border-blue-500/20 dark:text-blue-400",
  };

  return (
    <div className={`p-5 border rounded-2xl flex gap-4 ${styles[type]} ${className}`}>
      <div className="flex-shrink-0">
        {type === 'success' && <CheckCircle className="w-6 h-6" />}
        {type === 'error' && <AlertCircle className="w-6 h-6" />}
        {type === 'warning' && <AlertTriangle className="w-6 h-6" />}
        {type === 'info' && <Info className="w-6 h-6" />}
      </div>
      <div>
        <h5 className="font-bold text-[15px] mb-1">{title}</h5>
        <p className="text-sm opacity-80 leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

export default StaticAlert;
