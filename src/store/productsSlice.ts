import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productsApi, type Product, type ProductPayload } from "../api/productsApi";

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    return await productsApi.getProducts();
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch products");
  }
});

export const fetchProductById = createAsyncThunk("products/fetchProductById", async (id: string, { rejectWithValue }) => {
  try {
    return await productsApi.getProductById(id);
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch product");
  }
});

export const addProduct = createAsyncThunk("products/addProduct", async (payload: ProductPayload, { rejectWithValue }) => {
  try {
    return await productsApi.createProduct(payload);
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to add product");
  }
});

export const editProduct = createAsyncThunk("products/editProduct", async ({ id, payload }: { id: string; payload: ProductPayload }, { rejectWithValue }) => {
  try {
    return await productsApi.updateProduct(id, payload);
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update product");
  }
});

export const removeProduct = createAsyncThunk("products/removeProduct", async (id: string, { rejectWithValue }) => {
  try {
    await productsApi.deleteProduct(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete product");
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Product By Id
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentProduct = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add Product
    builder.addCase(addProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products.push(action.payload);
    });
    builder.addCase(addProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Edit Product
    builder.addCase(editProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(editProduct.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      if (state.currentProduct?.id === action.payload.id) {
        state.currentProduct = action.payload;
      }
    });
    builder.addCase(editProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Remove Product
    builder.addCase(removeProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products = state.products.filter((p) => p.id !== action.payload);
      if (state.currentProduct?.id === action.payload) {
        state.currentProduct = null;
      }
    });
    builder.addCase(removeProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearProductError } = productsSlice.actions;
export default productsSlice.reducer;
