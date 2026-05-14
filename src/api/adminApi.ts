import { apiClient as api } from "./axiosInterceptor";
import type { User } from "./userApi";

export interface Admin extends User {
  role: string;
}

type AdminApiRecord = Record<string, any>;

const toText = (value: unknown, fallback = "") => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
};

const unwrapAdmin = (payload: unknown): AdminApiRecord => {
  if (!payload || typeof payload !== "object") return {};
  const record = payload as AdminApiRecord;

  return record.admin || record.data?.admin || record.user || record.data?.user || record.data || record;
};

const normalizeAdmin = (payload: unknown): Admin => {
  const record = unwrapAdmin(payload);

  return {
    _id: toText(record._id) || undefined,
    id: record.id ?? record._id,
    name: toText(record.name, toText(record.username, "Unnamed Admin")),
    email: toText(record.email),
    status: toText(record.status, "active"),
    role: toText(record.role, "admin"),
  };
};

const extractAdmins = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  const record = payload as AdminApiRecord;
  return record?.admins || record?.data?.admins || record?.users || record?.data?.users || record?.data || [];
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

export const getAdmins = async (): Promise<Admin[]> => {
  const data = await tryRequest([
    () => api.get("/admin/admins").then((res) => res.data),
    () => api.get("/admin/user/admins").then((res) => res.data),
  ]);

  return extractAdmins(data).map(normalizeAdmin);
};

export const getAdminById = async (id: string | number): Promise<Admin> => {
  if (!id) throw new Error("ID is required");

  const data = await tryRequest([
    () => api.get(`/admin/admin/${id}`).then((res) => res.data),
    () => api.get(`/admin/user/admin/${id}`).then((res) => res.data),
  ]);

  return normalizeAdmin(data);
};

export const updateAdmin = async (
  id: string | number,
  data: Partial<Admin>
): Promise<Admin> => {
  if (!id) throw new Error("Update failed: Admin ID is missing.");

  const payload = await tryRequest([
    () => api.put(`/admin/admin/${id}`, data).then((res) => res.data),
    () => api.put(`/admin/user/admin/${id}`, data).then((res) => res.data),
  ]);

  return normalizeAdmin(payload);
};

export const deleteAdmin = async (id: string | number) => {
  if (!id) throw new Error("Delete failed: Admin ID is missing.");

  return tryRequest([
    () => api.delete(`/admin/admin/${id}`).then((res) => res.data),
    () => api.delete(`/admin/user/admin/${id}`).then((res) => res.data),
  ]);
};
