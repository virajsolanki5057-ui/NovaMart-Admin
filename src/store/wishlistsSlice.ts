import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistApi, type WishlistItem } from "../api/wishlistApi";

interface WishlistsState {
  wishlists: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistsState = {
  wishlists: [],
  loading: false,
  error: null,
};

export const fetchWishlists = createAsyncThunk("wishlists/fetchWishlists", async (_, { rejectWithValue }) => {
  try {
    return await wishlistApi.getWishlists();
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch wishlists");
  }
});

export const removeWishlist = createAsyncThunk("wishlists/removeWishlist", async (id: string, { rejectWithValue }) => {
  try {
    await wishlistApi.deleteWishlist(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete wishlist item");
  }
});

const wishlistsSlice = createSlice({
  name: "wishlists",
  initialState,
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Wishlists
    builder.addCase(fetchWishlists.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWishlists.fulfilled, (state, action) => {
      state.loading = false;
      state.wishlists = action.payload;
    });
    builder.addCase(fetchWishlists.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Remove Wishlist
    builder.addCase(removeWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeWishlist.fulfilled, (state, action) => {
      state.loading = false;
      state.wishlists = state.wishlists.filter((w) => w._id !== action.payload);
    });
    builder.addCase(removeWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearWishlistError } = wishlistsSlice.actions;
export default wishlistsSlice.reducer;
