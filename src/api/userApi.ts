import { apiClient as api } from "./axiosInterceptor";

export interface User {
  _id?: string; 
  id?: string | number;
  name: string;
  email: string;
  status?: string;
  role: string;
  createdAt?: string;
}

type UserApiRecord = Record<string, any>;

const toText = (value: unknown, fallback = "") => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
};

const unwrapUser = (payload: unknown): UserApiRecord => {
  if (!payload || typeof payload !== "object") return {};
  const record = payload as UserApiRecord;

  return record.user || record.data?.user || record.data || record;
};

const normalizeUser = (payload: unknown): User => {
  const record = unwrapUser(payload);

  return {
    _id: toText(record._id) || undefined,
    id: record.id ?? record._id,
    name: toText(record.name, toText(record.username, "Unnamed User")),
    email: toText(record.email),
    status: toText(record.status, "active"),
    role: toText(record.role, "user"),
    createdAt: toText(record.createdAt),
  };
};

const extractUsers = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  const record = payload as UserApiRecord;
  return record?.users || record?.data?.users || record?.data || [];
};

const tryRequest = async <T>(requests: Array<() => Promise<T>>) => {
  let lastError: any;

  for (const request of requests) {
    try {
      return await request();
    } catch (error: any) {
      lastError = error;
      if (error?.status && error.status !== 404) {
        throw error;
      }
    }
  }

  throw lastError;
};

const getUsers = async (): Promise<User[]> => {
  const data = await tryRequest([
    () => api.get("/admin/users").then((res) => res.data),
    () => api.get("/admin/user/get").then((res) => res.data),
  ]);

  return extractUsers(data).map(normalizeUser);
};

const updateUser = async (id: string | number, data: Partial<User>) => {
  if (!id) throw new Error("Update failed: User ID is missing.");
  const payload = await tryRequest([
    () => api.put(`/admin/user/${id}`, data).then((res) => res.data),
    () => api.put(`/admin/user/put/${id}`, data).then((res) => res.data),
  ]);

  return normalizeUser(payload);
};

const deleteUser = async (id: string | number) => {
  if (!id) throw new Error("Delete failed: User ID is missing.");
  return tryRequest([
    () => api.delete(`/admin/user/${id}`).then((res) => res.data),
    () => api.delete(`/admin/user/delete/${id}`).then((res) => res.data),
  ]);
};

const getUserById = async (id: string | number) => {
  if (!id) throw new Error("ID is required");
  const data = await tryRequest([
    () => api.get(`/admin/user/${id}`).then((res) => res.data),
    () => api.get(`/admin/user/get/${id}`).then((res) => res.data),
  ]);

  return normalizeUser(data);
};

export const userApi = {
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
};
