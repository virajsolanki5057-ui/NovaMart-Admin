import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import * as adminApi from "../../../api/adminApi";
import { Admin } from "../../../api/adminApi";
import UserFormModal from "../UserTable/UserFormModal";
import Pagination from "../../ui/pagination/Pagination";
import SearchBar from "../../ui/search-bar/SearchBar";

export default function AdminTable() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  
  // Modals State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false); // New View State
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const loadAdmins = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminApi.getAdmins();
      setAdmins(data);
    } catch (err: any) {
      setError(err.message || "Failed to load admins.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAdmins();
  }, []);

  const filteredAdmins = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return admins;
    return admins.filter((admin) =>
      [admin.name, admin.email, admin.role].join(" ").toLowerCase().includes(query)
    );
  }, [admins, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAdmins.length / pageSize);
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handler for Viewing
  const openViewModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsViewOpen(true);
  };

  const openEditModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (values: Partial<Admin>) => {
    const adminId = selectedAdmin?._id || selectedAdmin?.id;
    if (!adminId) return;

    try {
      setIsSubmitting(true);
      setError(null);
      const updatedAdmin = await adminApi.updateAdmin(adminId, values);

      setAdmins((current) =>
        current.map((admin) =>
          (admin._id || admin.id) === adminId ? updatedAdmin : admin
        )
      );

      setIsEditOpen(false);
      setSelectedAdmin(null);
    } catch (err: any) {
      setError(err.message || "Failed to update admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    const adminId = selectedAdmin?._id || selectedAdmin?.id;
    if (!adminId) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await adminApi.deleteAdmin(adminId);
      setAdmins((current) =>
        current.filter((admin) => (admin._id || admin.id) !== adminId)
      );
      setIsDeleteOpen(false);
      setSelectedAdmin(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Admin Management
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage administrator accounts and access levels.
          </p>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm("")}
          placeholder="Search admins..."
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Name</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Email</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Role</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <TableCell key={i} className="px-5 py-4">
                        <div className="h-8 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No admins found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAdmins.map((admin) => (
                  <TableRow key={admin._id || admin.id}>
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">{admin.name}</TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{admin.email}</TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{admin.role}</span>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex gap-3">
                        <button onClick={() => openViewModal(admin)} className="text-gray-500 transition hover:text-brand-500" aria-label="View admin">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        
                        <button onClick={() => openEditModal(admin)} className="text-gray-500 transition hover:text-brand-500" aria-label="Edit admin">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M11.25 3.75L16.25 8.75M3.3 16.7H7.9L16.6 7.9C16.8 7.7 16.9 7.4 16.9 7.1C16.9 6.8 16.8 6.5 16.6 6.3L13.7 3.4C13.5 3.2 13.2 3.1 12.9 3.1C12.6 3.1 12.3 3.2 12.1 3.4L3.3 12.2V16.7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>

                        <button onClick={() => openDeleteModal(admin)} className="text-gray-500 transition hover:text-error-500" aria-label="Delete admin">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4.1 5.8H15.9M8.3 8.3V12.5M11.6 8.3V12.5M5 5.8L5.8 14.5C5.9 15.3 6.6 16 7.4 16H12.5C13.3 16 14 15.3 14.1 14.5L14.9 5.8M7.5 5.8V4.1C7.5 3.7 7.8 3.3 8.3 3.3H11.6C12.1 3.3 12.4 3.7 12.4 4.1V5.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="border-t border-gray-100 dark:border-white/[0.05]"
        />
      </div>

      {/* VIEW MODAL */}
      <Modal 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
        className="max-w-[480px] w-[95%] p-0 overflow-hidden rounded-[32px] border-none shadow-2xl bg-white dark:bg-gray-900"
      >
        {/* Header Banner */}
        <div className="relative h-32 bg-orange-500 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
              <pattern id="dots-admin-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#dots-admin-pattern)"/>
            </svg>
          </div>
          
        </div>

        <div className="px-6 pb-8 -mt-16 relative">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="h-32 w-32 rounded-3xl border-[6px] border-white dark:border-gray-900 bg-white dark:bg-gray-800 shadow-xl overflow-hidden mb-4">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAdmin?.name || "Admin")}&background=f97316&color=fff&size=128&bold=true`}
                alt={selectedAdmin?.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Profile Info */}
            <div className="text-center mb-8">
              <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                {selectedAdmin?.name}
              </h4>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest border border-orange-100 dark:border-orange-500/20">
                System {selectedAdmin?.role}
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
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{selectedAdmin?.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] transition-all hover:border-orange-200 dark:hover:border-orange-500/30 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-gray-800 text-gray-400 group-hover:text-orange-500 shadow-sm transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin ID</span>
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{selectedAdmin?._id || selectedAdmin?.id}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex w-full gap-3">
              <Button 
                variant="outline"
                onClick={() => setIsViewOpen(false)}
                className="flex-1 rounded-2xl h-12 text-gray-600 dark:text-gray-400"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setIsViewOpen(false);
                  setIsEditOpen(true);
                }}
                className="flex-1 rounded-2xl h-12 bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20"
              >
                Edit Admin
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <UserFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={selectedAdmin}
        isSubmitting={isSubmitting}
        title="Edit Admin"
      />

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} className="max-w-[400px] p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error-50 text-error-600 dark:bg-error-500/10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" /></svg>
          </div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">Delete Admin</h4>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">"{selectedAdmin?.name}"</span>?
          </p>
          <div className="mt-8 flex w-full gap-3">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleConfirmDelete} isLoading={isSubmitting} className="flex-1 bg-error-600 hover:bg-error-700">Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}