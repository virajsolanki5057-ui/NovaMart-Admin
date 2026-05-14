import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import productsReducer from "./productsSlice";
import ordersReducer from "./ordersSlice";
import wishlistsReducer from "./wishlistsSlice";
import alertReducer from "./alertSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    products: productsReducer,
    orders: ordersReducer,
    wishlists: wishlistsReducer,
    alerts: alertReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
