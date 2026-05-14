import { axiosInstance } from "./axiosInterceptor";

export interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactsResponse {
  success: boolean;
  count: number;
  data: Contact[];
}

export const contactApi = {
  getContacts: async (): Promise<Contact[]> => {
    try {
      const response = await axiosInstance.get<ContactsResponse>("/contacts");
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || "Failed to fetch contacts");
    }
  },

  deleteContact: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/contacts/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || "Failed to delete contact");
    }
  },
};
