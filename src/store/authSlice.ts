import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../api/axiosInterceptor";
import {
  clearStoredAuth,
  loadStoredAuth,
  persistAuth,
  type StoredAuthSession,
} from "./authStorage";
 
interface AuthState {
  user: StoredAuthSession["user"] | null;
  token: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
 
interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}
 
interface LoginResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    role: string;
  };
}

const ALLOWED_LOGIN_ROLES = ["admin", "user"];

const isAllowedLoginRole = (role?: string) =>
  ALLOWED_LOGIN_ROLES.includes((role || "").toLowerCase());
 
const storedSession = loadStoredAuth();
const hasValidStoredSession = Boolean(
  storedSession?.token && storedSession?.user?.email
);
 
if (storedSession && !hasValidStoredSession) {
  clearStoredAuth();
}
 
const initialState: AuthState = {
  user: hasValidStoredSession ? storedSession!.user : null,
  token: hasValidStoredSession ? storedSession!.token : null,
  isAuthenticated: hasValidStoredSession,
  status: "idle",
  error: null,
};
 
// ✅ LOGIN THUNK
export const login = createAsyncThunk(
  "auth/login",
  async (payload: LoginRequest, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post<LoginResponse>("/auth/login", {
        email: payload.email,
        password: payload.password,
      });

      if (!isAllowedLoginRole(data.user?.role)) {
        return rejectWithValue("Only admin and user accounts can log in.");
      }
 
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.msg || err.message || "Login failed"
      );
    }
  }
);
 
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      clearStoredAuth();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        const normalizedUser = {
          id: action.payload.user._id,
          name: action.payload.user.email?.split("@")[0] ?? "Account User",
          email: action.payload.user.email,
          role: action.payload.user.role.toLowerCase() as "admin" | "user",
        };
 
        state.user = normalizedUser;
        state.token = action.payload.token;
        state.isAuthenticated = true;
 
        persistAuth({
          token: action.payload.token,
          user: normalizedUser,
          rememberMe: action.meta.arg.rememberMe,
        });
      })
      .addCase(login.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = Boolean(state.token && state.user);
      });
  },
});
 
export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
 
 
