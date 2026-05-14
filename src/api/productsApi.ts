import { apiClient } from "./axiosInterceptor";

// ---------------- TYPES ----------------

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  shortDescription?: string;
  description: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductPayload {
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  shortDescription?: string;
  description: string;
  image: string;
  imageFile?: File | null;
}

type ProductApiRecord = Record<string, unknown>;

// ---------------- HELPERS ----------------

const toNumber = (value: unknown) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const toText = (value: unknown, fallback = "") => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
};

const extractRecord = (payload: unknown): ProductApiRecord => {
  if (!payload || typeof payload !== "object") return {};
  const record = payload as ProductApiRecord;

  return (
    record.product ||
    (record.data as ProductApiRecord)?.product ||
    record.data ||
    record
  ) as ProductApiRecord;
};

const normalizeProduct = (payload: unknown): Product => {
  const record = extractRecord(payload);

  const id = toText(record._id);

  return {
    id: id || crypto.randomUUID(),

    name: toText(record.name),
    category: toText(record.category),
    brand: toText(record.brand),

    price: toNumber(record.price),
    stock: toNumber(record.stock),

    shortDescription: toText(record.shortDescription),
    description: toText(record.description),

    image: (() => {
      const img = toText(record.image);
      if (img.startsWith("/uploads/")) {
        return apiClient.defaults.baseURL?.replace("/api", "") + img;
      }
      return img || "/images/product/product-01.jpg";
    })(),

    createdAt: toText(record.createdAt),
    updatedAt: toText(record.updatedAt),
  };
};

const serializeProductPayload = (payload: ProductPayload) => {
  if (payload.imageFile) {
    const formData = new FormData();

    formData.append("name", payload.name.trim());
    formData.append("category", payload.category.trim());
    formData.append("brand", payload.brand.trim());
    formData.append("price", String(payload.price));
    formData.append("stock", String(payload.stock));
    formData.append("shortDescription", payload.shortDescription || "");
    formData.append("description", payload.description.trim());
    formData.append("image", payload.imageFile);

    return formData;
  }

  return {
    name: payload.name.trim(),
    category: payload.category.trim(),
    brand: payload.brand.trim(),
    price: payload.price,
    stock: payload.stock,
    shortDescription: payload.shortDescription,
    description: payload.description.trim(),
    image: payload.image,
  };
};

// ---------------- API ----------------

export const productsApi = {
  // ✅ GET ALL PRODUCTS
  getProducts: async (): Promise<Product[]> => {
    const { data } = await apiClient.get("/products");

    const list =
      Array.isArray(data) ? data : data?.products || data?.data || [];

    return list.map((item: any) => normalizeProduct(item));
  },

  // ✅ GET PRODUCT BY ID (FIXED)
  getProductById: async (id: string): Promise<Product> => {
    if (!id || id.includes("undefined")) {
      throw new Error("Valid product ID is required");
    }

    const { data } = await apiClient.get(`/product/${id}`);
    return normalizeProduct(data);
  },

  // ✅ CREATE PRODUCT (UNCHANGED)
  createProduct: async (payload: ProductPayload): Promise<Product> => {
    const body = serializeProductPayload(payload);

    const headers = payload.imageFile
      ? { "Content-Type": "multipart/form-data" }
      : {};

    const { data } = await apiClient.post("/product", body, {
      headers,
    });

    return normalizeProduct(data);
  },

  // ✅ UPDATE PRODUCT (FIXED)
  updateProduct: async (
    id: string,
    payload: ProductPayload
  ): Promise<Product> => {
    if (!id || id.includes("undefined")) {
      throw new Error("Valid product ID is required");
    }

    const body = serializeProductPayload(payload);

    const headers = payload.imageFile
      ? { "Content-Type": "multipart/form-data" }
      : {};

    const { data } = await apiClient.put(
      `/product/${id}`,
      body,
      { headers }
    );

    return normalizeProduct(data);
  },

  // ✅ DELETE PRODUCT (FIXED)
  deleteProduct: async (id: string): Promise<void> => {
    if (!id || id.includes("undefined")) {
      throw new Error("Valid product ID is required");
    }

    await apiClient.delete(`/product/${id}`);
  },
};