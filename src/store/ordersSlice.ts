import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ordersApi, type Order } from "../api/ordersApi";

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (_, { rejectWithValue }) => {
  try {
    return await ordersApi.getOrders();
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch orders");
  }
});

export const fetchOrderById = createAsyncThunk("orders/fetchOrderById", async (id: string, { rejectWithValue }) => {
  try {
    return await ordersApi.getOrderById(id);
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch order details");
  }
});

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, status }: { id: string; status: "pending" | "confirmed" | "dispatched" | "delivered" | "cancelled" }, { rejectWithValue }) => {
    try {
      return await ordersApi.updateOrderStatus(id, status);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update order status");
    }
  }
);

export const removeOrder = createAsyncThunk("orders/removeOrder", async (id: string, { rejectWithValue }) => {
  try {
    await ordersApi.deleteOrder(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete order");
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Orders
    builder.addCase(fetchOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Order By Id
    builder.addCase(fetchOrderById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrderById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload;
    });
    builder.addCase(fetchOrderById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Order Status
    builder.addCase(updateOrderStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.orders.findIndex((o) => o._id === action.payload._id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.currentOrder?._id === action.payload._id) {
        state.currentOrder = action.payload;
      }
    });
    builder.addCase(updateOrderStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Remove Order
    builder.addCase(removeOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = state.orders.filter((o) => o._id !== action.payload);
      if (state.currentOrder?._id === action.payload) {
        state.currentOrder = null;
      }
    });
    builder.addCase(removeOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearOrderError } = ordersSlice.actions;
export default ordersSlice.reducer;
