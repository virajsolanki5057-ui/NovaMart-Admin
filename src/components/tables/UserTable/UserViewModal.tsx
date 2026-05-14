import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import { User } from "../../../api/userApi";

interface UserViewModalProps {
  isOpen: boolean;
  user?: User | null;
  isLoading?: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function UserViewModal({
  isOpen,
  user,
  onClose,
  onEdit,
}: UserViewModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className="max-w-[480px] w-[95%] p-0 overflow-hidden rounded-[32px] border-none shadow-2xl bg-white dark:bg-gray-900"
    >
      {/* Header Banner */}
      <div className="relative h-32 bg-orange-500 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <pattern id="dots-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots-pattern)"/>
          </svg>
        </div>

      </div>

      <div className="px-6 pb-8 -mt-16 relative">
        {!user ? (
          <div className="flex flex-col items-center py-10 space-y-4">
            <div className="h-32 w-32 rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            <div className="h-6 w-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="h-32 w-32 rounded-3xl border-[6px] border-white dark:border-gray-900 bg-white dark:bg-gray-800 shadow-xl overflow-hidden mb-4">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f97316&color=fff&size=128&bold=true`}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Profile Info */}
            <div className="text-center mb-8">
              <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                {user.name}
              </h4>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest border border-orange-100 dark:border-orange-500/20">
                {user.role} Member
              </span>
            </div>

            {/* Info Cards */}
            <div className="w-full space-y-3 mb-8">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] transition-all hover:border-orange-200 dark:hover:border-orange-500/30 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-gray-800 text-gray-400 group-hover:text-orange-500 shadow-sm transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] transition-all hover:border-orange-200 dark:hover:border-orange-500/30 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-gray-800 text-gray-400 group-hover:text-orange-500 shadow-sm transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System ID</span>
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{user.id || user._id}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex w-full gap-3">
              <Button 
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-2xl h-12 text-gray-600 dark:text-gray-400"
              >
                Close
              </Button>
              <Button 
                onClick={onEdit}
                className="flex-1 rounded-2xl h-12 bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
  