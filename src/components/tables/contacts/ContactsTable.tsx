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
import {
  contactApi,
  type Contact,
} from "../../../api/contactApi";
import ContactViewModal from "./ContactViewModal";
import Pagination from "../../ui/pagination/Pagination";
import SearchBar from "../../ui/search-bar/SearchBar";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ContactsTable() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [error, setError] = useState<string | null>(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await contactApi.getContacts();
      setContacts(data);
    } catch (loadError: any) {
      setError(loadError.message || "Failed to load contacts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    if (!normalizedQuery) return contacts;

    return contacts.filter((contact) =>
      [contact.name, contact.email, contact.message]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [contacts, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginationStart = (safeCurrentPage - 1) * pageSize;
  const paginatedContacts = filteredContacts.slice(
    paginationStart,
    paginationStart + pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const openViewModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewOpen(true);
  };

  const openDeleteModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedContact) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await contactApi.deleteContact(selectedContact._id);
      setContacts((current) => current.filter((c) => c._id !== selectedContact._id));
      setIsDeleteOpen(false);
      setSelectedContact(null);
    } catch (deleteError: any) {
      setError(deleteError.message || "Failed to delete contact.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Contact Messages
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage messages from your website visitors.
          </p>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onClear={() => setSearchTerm("")}
          placeholder="Search messages..."
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Name</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Email</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Message</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Date Received</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TableCell key={i} className="px-5 py-4">
                        <div className="h-8 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No contact messages found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedContacts.map((contact) => (
                  <TableRow key={contact._id}>
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {contact.name}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {contact.email}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-[400px] truncate">
                      {contact.message}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(contact.createdAt)}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openViewModal(contact)} className="text-gray-500 hover:text-brand-500 transition" title="View Message">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2.5 10C3.75 6.5 6.6 4.16 10 4.16C13.4 4.16 16.25 6.5 17.5 10C16.25 13.5 13.4 15.84 10 15.84C6.6 15.84 3.75 13.5 2.5 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <button onClick={() => openDeleteModal(contact)} className="text-gray-500 hover:text-error-500 transition" title="Delete Message">
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

      <ContactViewModal
        isOpen={isViewOpen}
        contact={selectedContact}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedContact(null);
        }}
      />

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} className="max-w-[400px] p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error-50 text-error-600 dark:bg-error-500/10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">Delete Message</h4>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete the message from <span className="font-semibold text-gray-900 dark:text-white">{selectedContact?.name}</span>? 
            This action cannot be undone.
          </p>
          <div className="mt-8 flex w-full gap-3">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="flex-1" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmDelete} 
              isLoading={isSubmitting} 
              className="flex-1 bg-error-600 hover:bg-error-700 dark:bg-error-600"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
