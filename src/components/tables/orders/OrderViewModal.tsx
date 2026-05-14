import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import type { Order } from "../../../api/ordersApi";

interface OrderViewModalProps {
  isOpen: boolean;
  order: Order | null;
  isLoading: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, status: "pending" | "confirmed" | "dispatched" | "delivered" | "cancelled") => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "delivered":
      return <span className="inline-flex items-center rounded-full bg-success-50 px-2.5 py-1 text-xs font-medium text-success-700 dark:bg-success-500/10 dark:text-success-400">Delivered</span>;
    case "confirmed":
      return <span className="inline-flex items-center rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">Confirmed</span>;
    case "dispatched":
      return <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">Dispatched</span>;
    case "cancelled":
      return <span className="inline-flex items-center rounded-full bg-error-50 px-2.5 py-1 text-xs font-medium text-error-700 dark:bg-error-500/10 dark:text-error-400">Cancelled</span>;
    default:
      return <span className="inline-flex items-center rounded-full bg-warning-50 px-2.5 py-1 text-xs font-medium text-warning-700 dark:bg-warning-500/10 dark:text-warning-400">Pending</span>;

  }
};

export default function OrderViewModal({
  isOpen,
  order,
  isLoading,
  onClose,
  onStatusUpdate,
}: OrderViewModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[800px] w-[95%] md:w-full max-h-[90vh] overflow-y-auto p-4 md:p-6"
    >
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-8 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800 w-1/3" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
        </div>
      ) : order ? (
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Order #{order.orderId}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div>
              <StatusBadge status={order.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900/50">
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                Customer Information
              </h3>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Name:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{order.customerName}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{order.phoneNumber}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Address:</span>
                  <span className="font-medium text-gray-900 dark:text-white text-right max-w-[200px]">{order.address}</span>
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900/50">
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                Order Management
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Update Status
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) => onStatusUpdate(order._id, e.target.value as any)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>

                  </select>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Order Items
            </h3>
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Quantity</th>
                    <th className="px-4 py-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {order.items.map((item, index) => (
                    <tr key={index} className="bg-white dark:bg-gray-900">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        x{item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                      Total Amount
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-brand-600 dark:text-brand-400">
                      {formatCurrency(order.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">Order not found.</div>
      )}
    </Modal>
  );
}
