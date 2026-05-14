import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertMessage {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

interface AlertState {
  alerts: AlertMessage[];
}

const initialState: AlertState = {
  alerts: [],
};

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<Omit<AlertMessage, 'id'>>) => {
      const id = Math.random().toString(36).substring(2, 9);
      state.alerts.push({ ...action.payload, id });
    },
    hideAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter((alert) => alert.id !== action.payload);
    },
    clearAlerts: (state) => {
      state.alerts = [];
    },
  },
});

export const { showAlert, hideAlert, clearAlerts } = alertSlice.actions;
export default alertSlice.reducer;
