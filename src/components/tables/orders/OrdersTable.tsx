"use client";

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
import { type Order } from "../../../api/ordersApi";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchOrders,
  fetchOrderById,
  updateOrderStatus,
  removeOrder,
} from "../../../store/ordersSlice";
import Pagination from "../../ui/pagination/Pagination";
import OrderViewModal from "./OrderViewModal";
import OrderForm from "./OrderForm";
import SearchBar from "../../ui/search-bar/SearchBar";
import { useAlert } from "../../ui/alert/Alert";

const STATUS_SEQUENCE = ["pending", "confirmed", "dispatched", "delivered"];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function OrdersTable() {
  const dispatch = useAppDispatch();
  const {
    orders,
    loading: isLoading,
    error: reduxError,
  } = useAppSelector((state) => state.orders);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const alert = useAlert();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (reduxError) {
      alert.error(reduxError);
    }
  }, [reduxError, alert]);

  useEffect(() => {
    void dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    const refreshOrders = () => {
      void dispatch(fetchOrders());
    };

    const handleFocus = () => {
      refreshOrders();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshOrders();
      }
    };

    const intervalId = window.setInterval(refreshOrders, 10000);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    if (!normalizedQuery) return orders;

    return orders.filter((order) =>
      [order.orderId, order.customerName, order.phoneNumber]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [orders, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginationStart = (safeCurrentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(
    paginationStart,
    paginationStart + pageSize,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const openViewModal = async (orderId: string) => {
    try {
      setIsViewOpen(true);
      setIsViewLoading(true);
      const order = await dispatch(fetchOrderById(orderId)).unwrap();
      setSelectedOrder(order);
    } catch (viewError: any) {
      alert.error(viewError.message || "Failed to load order.");
      setIsViewOpen(false);
    } finally {
      setIsViewLoading(false);
    }
  };

  const openDeleteModal = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteOpen(true);
  };

  const closeViewModal = () => {
    setIsViewOpen(false);
    setIsViewLoading(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdate = async (id: string, status: any) => {
    const orderToUpdate = orders.find((o) => o._id === id);
    if (!orderToUpdate) return;

    const newStatus = status.toLowerCase();
    const currentStatus = orderToUpdate.status.toLowerCase();

    if (currentStatus === "delivered" || currentStatus === "cancelled") {
      alert.warn(`Cannot change status from ${currentStatus}.`, "Invalid Action");
      return;
    }

    if (newStatus !== "cancelled") {
      const currentIndex = STATUS_SEQUENCE.indexOf(currentStatus);
      const nextIndex = STATUS_SEQUENCE.indexOf(newStatus);

      if (nextIndex === -1 && newStatus !== "cancelled") {
        alert.error("Invalid status selected.");
        return;
      }

      if (nextIndex < currentIndex && nextIndex !== -1) {
        alert.warn("Cannot move back to a previous status.", "Invalid Sequence");
        return;
      }

      if (nextIndex === currentIndex) {
        setIsFormOpen(false);
        return;
      }

      if (nextIndex > currentIndex + 1) {
        alert.warn(
          `Please update to ${STATUS_SEQUENCE[currentIndex + 1]} first.`,
          "Status Step Skipped"
        );
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const updatedOrder = await dispatch(
        updateOrderStatus({ id, status: newStatus })
      ).unwrap();

      alert.success(`Order marked as ${newStatus} successfully.`);

      if (selectedOrder?._id === updatedOrder._id) {
        setSelectedOrder(updatedOrder);
      }
      void dispatch(fetchOrders());
      setIsFormOpen(false);
    } catch (statusError: any) {
      alert.error(statusError.message || "Failed to update order status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedOrder) return;

    try {
      setIsSubmitting(true);
      await dispatch(removeOrder(selectedOrder._id)).unwrap();
      alert.success("Order deleted successfully.");
      setIsDeleteOpen(false);
      setSelectedOrder(null);
    } catch (deleteError: any) {
      alert.error(deleteError.message || "Failed to delete order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatus = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "pending":
        return <span className="inline-flex rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">Pending</span>;
      case "confirmed":
        return <span className="inline-flex rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">Confirmed</span>;
      case "dispatched":
        return <span className="inline-flex rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">Dispatched</span>;
      case "delivered":
        return <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">Delivered</span>;
      case "cancelled":
        return <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-500/10 dark:text-red-400">Cancelled</span>;
      default:
        return <span className="inline-flex rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">All</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Orders</h3>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Manage and track all customer purchases.</p>
        </div>
        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onClear={() => setSearchTerm("")} placeholder="Search orders..." />
      </div>

      <div className="luxury-card overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-[1100px]">
            <TableHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <TableRow>
                <TableCell isHeader className="px-6 py-4 text-start text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Order ID</TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Customer</TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Date</TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Items</TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Amount</TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <TableCell key={i} className="px-6 py-4"><div className="h-6 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredOrders.length === 0 ? (
                <TableRow><TableCell className="px-6 py-12 text-center text-sm font-medium text-slate-400">No orders found.</TableCell></TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <TableCell className="px-6 py-5">
                      <div className="whitespace-nowrap">
                         <span className="font-mono text-[11px] tracking-wider text-slate-900 dark:text-white">
                          {String(order.orderId || order._id).slice(0, 8).toUpperCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-sm font-semibold text-slate-700 dark:text-slate-300">{order.customerName}</TableCell>
                    <TableCell className="px-6 py-5 text-sm font-medium text-slate-500 dark:text-slate-400">{formatDate(order.createdAt)}</TableCell>
                    <TableCell className="px-6 py-5 text-sm font-medium text-slate-500 dark:text-slate-400">
                      <div className="whitespace-nowrap text-xs">
                        {(() => {
                          const count = order.items.reduce((acc, item) => acc + item.quantity, 0);
                          return `${count} ${count === 1 ? 'item' : 'items'}`;
                        })()}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(order.totalAmount || 0)}</TableCell>
                    <TableCell className="px-6 py-5 text-sm">{renderStatus(order.status)}</TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => void openViewModal(order._id)} className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-all"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg></button>
                        <button onClick={() => { setSelectedOrder(order); setIsFormOpen(true); }} className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-all"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg></button>
                        <button onClick={() => openDeleteModal(order)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" /></svg></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20" />
      </div>

      <OrderViewModal isOpen={isViewOpen} order={selectedOrder} isLoading={isViewLoading} onClose={closeViewModal} onStatusUpdate={handleStatusUpdate} />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} className="max-w-[500px] !p-0 overflow-hidden rounded-[24px] border-none shadow-2xl">
        {selectedOrder && (
          <OrderForm order={selectedOrder} onClose={() => setIsFormOpen(false)} onSubmit={handleStatusUpdate} isLoading={isSubmitting} />
        )}
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} className="max-w-[400px] p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" /></svg>
          </div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">Delete Order</h4>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete order <span className="font-semibold text-gray-900 dark:text-white">#{String(selectedOrder?.orderId || selectedOrder?._id).slice(0, 8).toUpperCase()}</span>?</p>
          <div className="mt-8 flex w-full gap-3">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="flex-1" disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleConfirmDelete} isLoading={isSubmitting} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
