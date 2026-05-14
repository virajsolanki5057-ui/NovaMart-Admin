import {axiosInstance} from "./axiosInterceptor";

export interface OrderItem {
  _id?: string;
  product: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Dispatched" | "Delivered" | "Cancelled";
  statusKey?: "pending" | "confirmed" | "dispatched" | "delivered" | "cancelled";
  phoneNumber: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  statusUpdatedAt?: string;
}

export interface OrdersResponse {
  success: boolean;
  count: number;
  data: Order[];
}

export interface OrderResponse {
  success: boolean;
  data: Order;
}

export const ordersApi = {
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await axiosInstance.get<OrdersResponse>("/orders", {
        params: { _ts: Date.now() },
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || "Failed to fetch orders");
    }
  },

  getOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await axiosInstance.get<OrderResponse>(`/orders/${id}`, {
        params: { _ts: Date.now() },
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || "Failed to fetch order details");
    }
  },

  updateOrderStatus: async (id: string, status: "pending" | "confirmed" | "dispatched" | "delivered" | "cancelled"): Promise<Order> => {
    try {
      const response = await axiosInstance.put<OrderResponse>(`/orders/${id}/status`, { status });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || "Failed to update order status");
    }
  },

  deleteOrder: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/orders/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || "Failed to delete order");
    }
  },
};
