import { useState } from "react";
import Button from "../../ui/button/Button";
import { Order } from "../../../api/ordersApi";

type Props = {
  order: Order;
  onClose: () => void;
  onSubmit: (id: string, status: "Pending" | "Confirmed" | "Dispatched" | "Delivered" | "Cancelled") => void;
  isLoading?: boolean;
};

export default function OrderForm({
  order,
  onClose,
  onSubmit,
  isLoading,
}: Props) {
  const [status, setStatus] = useState(order.status);

  return (
    <div className="w-full max-w-[500px] p-8 bg-white rounded-[24px]">
      {/* --- Header --- */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-[#111827]">Edit Order</h2>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        {/* Customer Name - Added Lock Icon */}
        <div className="space-y-2">
          <label className="block text-[15px] font-bold text-[#374151]">
            Customer Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={order.customerName}
              readOnly
              className="w-full h-[56px] rounded-[16px] border border-gray-200 bg-white px-5 pr-12 text-base text-[#111827] outline-none cursor-not-allowed"
            />
            <div className="absolute inset-y-0 right-5 flex items-center text-gray-400">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Amount - Added Lock Icon */}
        <div className="space-y-2">
          <label className="block text-[15px] font-bold text-[#374151]">
            Total Amount
          </label>
          <div className="relative">
            <input
              type="text"
              value={`₹${order.totalAmount}`}
              readOnly
              className="w-full h-[56px] rounded-[16px] border border-gray-200 bg-white px-5 pr-12 text-base text-[#6B7280] outline-none cursor-not-allowed"
            />
            <div className="absolute inset-y-0 right-5 flex items-center text-gray-400">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>
          <p className="text-[13px] text-gray-400 font-medium">
            Order amount cannot be changed after registration.
          </p>
        </div>

        {/* Update Status - Remains Editable */}
        <div className="space-y-2">
          <label className="block text-[15px] font-bold text-[#374151]">
            Update Status
          </label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full h-[56px] appearance-none rounded-[16px] border border-gray-200 bg-white px-5 text-base text-[#111827] outline-none focus:border-[#4F6AFE] transition-colors cursor-pointer"
            >
              <option value={order.status}>{order.status.toUpperCase()} (Current)</option>
              
              {order.status === "Pending" && (
                <option value="Confirmed">CONFIRMED</option>
              )}
              {order.status === "Confirmed" && (
                <option value="Dispatched">DISPATCHED</option>
              )}
              {order.status === "Dispatched" && (
                <option value="Delivered">DELIVERED</option>
              )}
              
              {order.status !== "Delivered" && order.status !== "Cancelled" && (
                <option value="Cancelled">CANCELLED</option>
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-gray-500">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            onClick={() => onSubmit(order._id, status)}
            isLoading={isLoading}
            className="w-full h-[56px] rounded-[12px] bg-[#4F6AFE] text-base font-bold text-white shadow-none hover:bg-[#3f56e0] transition-all"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
