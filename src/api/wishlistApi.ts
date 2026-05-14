import { axiosInstance } from "./axiosInterceptor";

export interface Product {
  _id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  brand: string;
  shortDescription: string;
  description: string;
  image?: string;
}

export interface WishlistItem {
  _id: string;
  userId: string;
  productId: Product | null;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistResponse {
  success: boolean;
  data: WishlistItem[];
}

export const wishlistApi = {
  getWishlists: async (): Promise<WishlistItem[]> => {
    try {
      const response = await axiosInstance.get<WishlistResponse>("/wishlist");
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch wishlist");
    }
  },

  deleteWishlist: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/wishlist/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete wishlist item");
    }
  },
};
