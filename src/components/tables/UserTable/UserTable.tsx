import { useEffect, useMemo, useState } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { User } from "../../../api/userApi";
import UserFormModal from "./UserFormModal"; 
import UserViewModal from "./UserViewModal";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchUsers, editUser, removeUser } from "../../../store/userSlice";
import { showAlert } from "../../../store/alertSlice";
import Pagination from "../../ui/pagination/Pagination";
import SearchBar from "../../ui/search-bar/SearchBar";

export default function UserTable() {
  const dispatch = useAppDispatch();
  const { users, loading: isLoading, error: reduxError } = useAppSelector((state) => state.users);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    if (reduxError) {
      dispatch(showAlert({
        title: "User Action Failed",
        message: reduxError,
        type: "error"
      }));
    }
  }, [reduxError, dispatch]);

  // Modal States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false); // 2. New View State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    void dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return users;
    return users.filter((u) =>
      [u.name, u.email, u.role].join(" ").toLowerCase().includes(query)
    );
  }, [users, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // View Logic
  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setIsViewOpen(true);
  };

  // Edit Logic
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (values: Partial<User>) => {
    const userId = selectedUser?._id || selectedUser?.id;
    if (!userId) return;

    try {
      setIsSubmitting(true);
      await dispatch(editUser({ id: userId, data: values })).unwrap();
      dispatch(showAlert({
        title: "User Updated",
        message: "User profile has been successfully updated.",
        type: "success"
      }));
      setIsEditOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      dispatch(showAlert({
        title: "Update Failed",
        message: err?.message || "Failed to update user.",
        type: "error"
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Logic
  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    const userId = selectedUser?._id || selectedUser?.id;
    if (!userId) return;

    try {
      setIsSubmitting(true);
      await dispatch(removeUser(userId)).unwrap();
      dispatch(showAlert({
        title: "User Removed",
        message: `User "${selectedUser?.name}" has been deleted.`,
        type: "success"
      }));
      setIsDeleteOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      dispatch(showAlert({
        title: "Delete Failed",
        message: err?.message || "Failed to delete user.",
        type: "error"
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage system users and access levels.</p>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm("")}
          placeholder="Search users..."
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Name</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Email</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Role</TableCell>
                <TableCell isHeader className="px-5 py-3 text-end text-theme-xs font-medium text-gray-500 dark:text-gray-400">Actions</TableCell>
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
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user._id || user.id}>
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.name}</TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{user.email}</TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{user.role}</span>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => openViewModal(user)} 
                          className="text-gray-500 hover:text-brand-500 transition-colors p-1"
                          title="View Details"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>

                        <button 
                          onClick={() => openEditModal(user)} 
                          className="text-gray-500 hover:text-orange-500 transition-colors p-1"
                          title="Edit User"
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M11.25 3.75L16.25 8.75M3.3 16.7H7.9L16.6 7.9C16.8 7.7 16.9 7.4 16.9 7.1C16.9 6.8 16.8 6.5 16.6 6.3L13.7 3.4C13.5 3.2 13.2 3.1 12.9 3.1C12.6 3.1 12.3 3.2 12.1 3.4L3.3 12.2V16.7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>

                        <button 
                          onClick={() => openDeleteModal(user)} 
                          className="text-gray-500 hover:text-error-500 transition-colors p-1"
                          title="Delete User"
                        >
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

      <UserViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        user={selectedUser}
        onEdit={() => {
          setIsViewOpen(false);
          setIsEditOpen(true);
        }}
      />

      <UserFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={selectedUser}
        isSubmitting={isSubmitting}
      />

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} className="max-w-[400px] p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error-50 text-error-600 dark:bg-error-500/10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" /></svg>
          </div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">Delete User</h4>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">"{selectedUser?.name}"</span>?
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