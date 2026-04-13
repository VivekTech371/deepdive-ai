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
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Transcript ──

export interface Transcript {
  id: string;
  title: string;
  speakers?: string[];
  event_date?: string;
  loc?: string;
  conference?: string;
  tags?: string[];
  categories?: string[];
  topics?: string[];
  status: "pending" | "processing" | "done";
  raw_text?: string;
  corrected_text?: string;
  summary?: string;
  media_url?: string;
  channel_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse {
  transcripts: Transcript[];
  total: number;
  page: number;
  pages: number;
}

// ── YouTube Channel ──

export interface YouTubeChannel {
  id: string;
  channel_id: string;
  channel_name: string;
  channel_url?: string;
  description?: string;
  category?: string;
  priority?: number;
  is_active?: boolean;
  last_scanned_at?: string;
  created_at?: string;
  updated_at?: string;
}

// ── YouTube Video ──

export interface YouTubeVideo {
  id: string;
  video_id: string;
  channel_id?: string;
  title?: string;
  description?: string;
  published_at?: string;
  duration?: number;
  tags?: string[];
  thumbnail_url?: string;
  view_count?: number;
  is_technical?: boolean;
  classification_reason?: string;
  classification_confidence?: number;
  status?: string;
  transcript_id?: string;
  discovered_at?: string;
  classified_at?: string;
  created_at?: string;
  updated_at?: string;
}

// ── Ingestion Run ──

export interface IngestionRun {
  id: string;
  run_type: string;
  channel_id?: string;
  videos_discovered?: number;
  videos_classified?: number;
  videos_approved?: number;
  videos_rejected?: number;
  errors?: unknown;
  started_at?: string;
  completed_at?: string;
  created_at?: string;
}

// ── Health ──

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

  // Transcripts
  getTranscripts: (page = 1, limit = 20, status?: string, search?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    return request<PaginatedResponse>(`/transcripts?${params}`);
  },
  getTranscript: (id: string) => request<Transcript>(`/transcripts/${id}`),
  updateTranscript: (id: string, data: Partial<Transcript>) =>
    request<Transcript>(`/transcripts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTranscript: (id: string) =>
    request<void>(`/transcripts/${id}`, { method: "DELETE" }),

  // YouTube Channels
  getChannels: () => request<YouTubeChannel[]>("/youtube-channels"),
  getChannel: (id: string) => request<YouTubeChannel>(`/youtube-channels/${id}`),
  updateChannel: (id: string, data: Partial<YouTubeChannel>) =>
    request<YouTubeChannel>(`/youtube-channels/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  createChannel: (data: Partial<YouTubeChannel>) =>
    request<YouTubeChannel>("/youtube-channels", { method: "POST", body: JSON.stringify(data) }),
  deleteChannel: (id: string) =>
    request<void>(`/youtube-channels/${id}`, { method: "DELETE" }),

  // YouTube Videos
  getVideos: (page = 1, limit = 20, status?: string, search?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    return request<{ videos: YouTubeVideo[]; total: number; page: number; pages: number }>(`/youtube-videos?${params}`);
  },
  getVideo: (id: string) => request<YouTubeVideo>(`/youtube-videos/${id}`),
  updateVideo: (id: string, data: Partial<YouTubeVideo>) =>
    request<YouTubeVideo>(`/youtube-videos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteVideo: (id: string) =>
    request<void>(`/youtube-videos/${id}`, { method: "DELETE" }),

  // Ingestion Runs
  getIngestionRuns: () => request<IngestionRun[]>("/ingestion-runs"),

  // Health
  getHealth: () => request<HealthResponse>("/health/detailed"),
};
