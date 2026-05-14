import React, { useEffect, useState } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import { User } from "../../../api/userApi";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialData: User | null;
  isSubmitting: boolean;
  title?: string;
}

export default function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
  title = "Edit User",
}: UserFormModalProps) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    role: "user",
  });

  useEffect(() => {
    if (initialData) {
      setValues({
        name: initialData.name || "",
        email: initialData.email || "",
        role: initialData.role || "user",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[480px] p-0">
      <div className="border-b border-gray-100 px-6 py-4 dark:border-white/[0.05]">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Full Name - Editable */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            required
            className="h-11 w-full rounded-xl border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-white"
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
        </div>

        {/* Email Address - Blocked/ReadOnly */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              readOnly
              className="h-11 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500 outline-none dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
              value={values.email}
            />
            {/* Optional: Lock Icon to show it's blocked */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>
          <p className="mt-1 text-[11px] text-gray-400">Email cannot be changed after registration.</p>
        </div>
        <div className="mt-8 flex gap-3">
          <Button isLoading={isSubmitting} className="flex-1" type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
