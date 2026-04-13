const API_BASE = "http://localhost:5000/api/v1";

function getHeaders(): HeadersInit {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...options?.headers },
  });
  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export interface Transcript {
  _id: string;
  title: string;
  speakers?: string[];
  event_date?: string;
  location?: string;
  conference?: string;
  tags?: string[];
  categories?: string[];
  status: "pending" | "processing" | "done";
  corrected_text?: string;
  summary?: string;
  media_url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse {
  transcripts: Transcript[];
  total: number;
  page: number;
  pages: number;
}

export interface HealthResponse {
  status: string;
  uptime: number;
  database: { status: string; latency?: number };
  memory: { rss: number; heapUsed: number; heapTotal: number };
}

export const api = {
  login: (password: string) =>
    request<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),

  getTranscripts: (page = 1, limit = 20, status?: string, search?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    return request<PaginatedResponse>(`/transcripts?${params}`);
  },

  getTranscript: (id: string) => request<Transcript>(`/transcripts/${id}`),

  updateTranscript: (id: string, data: Partial<Transcript>) =>
    request<Transcript>(`/transcripts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteTranscript: (id: string) =>
    request<void>(`/transcripts/${id}`, { method: "DELETE" }),

  getHealth: () => request<HealthResponse>("/health/detailed"),
};
