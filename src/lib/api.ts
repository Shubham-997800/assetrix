import type { ApiResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_PREFIX = "/api/v1";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("assetrix-token", token);
    } else {
      localStorage.removeItem("assetrix-token");
    }
  }
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem("assetrix-token");
  }
  return accessToken;
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
}

async function refreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}${API_PREFIX}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.success && data.data?.accessToken) {
      setAccessToken(data.data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export class ApiError extends Error {
  status: number;
  errors?: string[];

  constructor(message: string, status: number, errors?: string[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, body, headers: customHeaders, ...rest } = options;

  let url = `${API_BASE}${API_PREFIX}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  };

  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    credentials: "include",
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (res.status === 401 && token) {
    const refreshed = await refreshToken();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${getAccessToken()}`;
      const retryRes = await fetch(url, {
        credentials: "include",
        headers,
        body: body ? JSON.stringify(body) : undefined,
        ...rest,
      });
      if (!retryRes.ok) {
        const errData = await retryRes.json().catch(() => null);
        throw new ApiError(
          errData?.message || `Request failed (${retryRes.status})`,
          retryRes.status,
          errData?.errors
        );
      }
      return retryRes.json();
    } else {
      setAccessToken(null);
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
      throw new ApiError("Session expired", 401);
    }
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    throw new ApiError(
      errData?.message || `Request failed (${res.status})`,
      res.status,
      errData?.errors
    );
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string, opts?: RequestOptions) =>
    request<T>(endpoint, { method: "GET", ...opts }),

  post: <T>(endpoint: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(endpoint, { method: "POST", body, ...opts }),

  put: <T>(endpoint: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(endpoint, { method: "PUT", body, ...opts }),

  patch: <T>(endpoint: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(endpoint, { method: "PATCH", body, ...opts }),

  delete: <T>(endpoint: string, opts?: RequestOptions) =>
    request<T>(endpoint, { method: "DELETE", ...opts }),
};

export const authApi = {
  login: (data: { email: string; password: string; rememberMe?: boolean }) =>
    api.post<{ user: { id: string; email: string; firstName: string; lastName: string; role: string; status: string; avatar: string | null; lastLoginAt: string | null }; accessToken: string }>("/auth/login", data),

  register: (data: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone?: string;
    termsAccepted: boolean;
  }) =>
    api.post<{ user: { id: string; email: string; firstName: string; lastName: string; role: string; status: string }; accessToken: string }>("/auth/register", data),

  logout: () => api.post("/auth/logout"),

  me: () => api.get<{ id: string; email: string; firstName: string; lastName: string; phone: string | null; avatar: string | null; role: string; status: string; employeeId: string | null; designation: string | null; departmentId: string | null; emailVerified: boolean; lastLoginAt: string | null; createdAt: string; department: { id: string; name: string; code: string } | null }>("/auth/me"),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    api.post("/auth/reset-password", { token, password }),

  verifyEmail: (token: string) =>
    api.post("/auth/verify-email", { token }),

  resendVerification: (email: string) =>
    api.post("/auth/resend-verification", { email }),

  getSessions: () => api.get("/auth/sessions"),
  deleteSession: (id: string) => api.delete(`/auth/sessions/${id}`),
  getLoginHistory: (page?: number) =>
    api.get("/auth/login-history", { params: { page } }),
};

export const dashboardApi = {
  getStats: () => api.get("/analytics/dashboard"),
  getAnalytics: () => api.get("/analytics/overview"),
};

export const assetApi = {
  list: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/assets", { params }),
  get: (id: string) => api.get(`/assets/${id}`),
  create: (data: Record<string, unknown>) => api.post("/assets", data),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/assets/${id}`, data),
  delete: (id: string) => api.delete(`/assets/${id}`),
};

export const departmentApi = {
  list: () => api.get("/departments"),
  get: (id: string) => api.get(`/departments/${id}`),
  create: (data: Record<string, unknown>) => api.post("/departments", data),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/departments/${id}`, data),
  delete: (id: string) => api.delete(`/departments/${id}`),
};

export const categoryApi = {
  list: () => api.get("/asset-categories"),
  create: (data: Record<string, unknown>) => api.post("/asset-categories", data),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/asset-categories/${id}`, data),
  delete: (id: string) => api.delete(`/asset-categories/${id}`),
};

export const allocationApi = {
  list: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/allocations", { params }),
  get: (id: string) => api.get(`/allocations/${id}`),
  create: (data: Record<string, unknown>) => api.post("/allocations", data),
  return: (id: string, data?: Record<string, unknown>) =>
    api.post(`/allocations/${id}/return`, data),
  transfer: (id: string, data: Record<string, unknown>) =>
    api.post(`/allocations/${id}/transfer`, data),
};

export const bookingApi = {
  list: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/bookings", { params }),
  get: (id: string) => api.get(`/bookings/${id}`),
  create: (data: Record<string, unknown>) => api.post("/bookings", data),
  approve: (id: string) => api.post(`/bookings/${id}/approve`),
  reject: (id: string, reason?: string) =>
    api.post(`/bookings/${id}/reject`, { reason }),
  cancel: (id: string) => api.post(`/bookings/${id}/cancel`),
};

export const maintenanceApi = {
  list: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/maintenance", { params }),
  get: (id: string) => api.get(`/maintenance/${id}`),
  create: (data: Record<string, unknown>) => api.post("/maintenance", data),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/maintenance/${id}`, data),
  assign: (id: string, technicianId: string) =>
    api.post(`/maintenance/${id}/assign`, { technicianId }),
  updateStatus: (id: string, status: string) =>
    api.post(`/maintenance/${id}/status`, { status }),
};

export const auditApi = {
  listCycles: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/audit-cycles", { params }),
  getCycle: (id: string) => api.get(`/audit-cycles/${id}`),
  createCycle: (data: Record<string, unknown>) => api.post("/audit-cycles", data),
  getVerifications: (cycleId: string) =>
    api.get(`/audit-cycles/${cycleId}/verifications`),
  verifyAsset: (cycleId: string, assetId: string, data: Record<string, unknown>) =>
    api.post(`/audit-cycles/${cycleId}/verify`, { assetId, ...data }),
};

export const reportApi = {
  list: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/reports", { params }),
  generate: (data: Record<string, unknown>) => api.post("/reports/generate", data),
  download: (id: string) => api.get(`/reports/${id}/download`),
};

export const notificationApi = {
  list: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/notifications", { params }),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.post("/notifications/read-all"),
};

export const userApi = {
  list: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/users", { params }),
  get: (id: string) => api.get(`/users/${id}`),
  updateProfile: (data: Record<string, unknown>) =>
    api.patch("/users/profile", data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post("/users/change-password", data),
};

export const adminApi = {
  listUsers: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/admin/users", { params }),
  updateUserRole: (id: string, role: string) =>
    api.patch(`/admin/users/${id}/role`, { role }),
  updateUserStatus: (id: string, status: string) =>
    api.patch(`/admin/users/${id}/status`, { status }),
};
