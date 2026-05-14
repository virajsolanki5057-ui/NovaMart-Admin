import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userApi, type User } from "../api/userApi";

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    return await userApi.getUsers();
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch users");
  }
});

export const fetchUserById = createAsyncThunk("users/fetchUserById", async (id: string | number, { rejectWithValue }) => {
  try {
    return await userApi.getUserById(id);
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch user");
  }
});

export const editUser = createAsyncThunk("users/editUser", async ({ id, data }: { id: string | number; data: Partial<User> }, { rejectWithValue }) => {
  try {
    return await userApi.updateUser(id, data);
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update user");
  }
});

export const removeUser = createAsyncThunk("users/removeUser", async (id: string | number, { rejectWithValue }) => {
  try {
    await userApi.deleteUser(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete user");
  }
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch User By Id
    builder.addCase(fetchUserById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    });
    builder.addCase(fetchUserById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Edit User
    builder.addCase(editUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(editUser.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.users.findIndex((u) => u.id === action.payload.id || u._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      if (state.currentUser?.id === action.payload.id || state.currentUser?._id === action.payload._id) {
        state.currentUser = action.payload;
      }
    });
    builder.addCase(editUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Remove User
    builder.addCase(removeUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users = state.users.filter((u) => u.id !== action.payload && u._id !== action.payload);
      if (state.currentUser?.id === action.payload || state.currentUser?._id === action.payload) {
        state.currentUser = null;
      }
    });
    builder.addCase(removeUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
