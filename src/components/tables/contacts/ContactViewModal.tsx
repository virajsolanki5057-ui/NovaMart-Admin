import { Modal } from "../../ui/modal";
import type { Contact } from "../../../api/contactApi";

interface ContactViewModalProps {
  isOpen: boolean;
  contact: Contact | null;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ContactViewModal({
  isOpen,
  contact,
  onClose,
}: ContactViewModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[600px] w-[95%] md:w-full max-h-[90vh] overflow-y-auto p-4 md:p-6"
    >
      {contact ? (
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Contact Message
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Received on {formatDate(contact.createdAt)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900/50">
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Sender Details
            </h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Name:</span>
                <span className="font-medium text-gray-900 dark:text-white">{contact.name}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  <a href={`mailto:${contact.email}`} className="text-brand-600 hover:text-brand-700 dark:text-brand-400">
                    {contact.email}
                  </a>
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900/50">
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Message
            </h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {contact.message}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">Message not found.</div>
      )}
    </Modal>
  );
}
