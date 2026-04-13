import { useEffect, useState, useCallback } from "react";
import { api, YouTubeVideo } from "../api";
import { Loader2, Search, ChevronLeft, ChevronRight, Eye, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function YouTubeVideosPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<YouTubeVideo | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    api.getVideos(page, 20, statusFilter || undefined, search || undefined)
      .then((res) => {
        setVideos(res.videos || []);
        setTotalPages(res.pages || 1);
      })
      .catch(() => toast.error("Failed to load videos"))
      .finally(() => setLoading(false));
  }, [page, statusFilter, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const formatDuration = (secs?: number) => {
    if (!secs) return "—";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-4">YouTube Videos</h1>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <input placeholder="Search by title..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-8 pr-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="classified">Classified</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="transcribed">Transcribed</option>
        </select>
      </div>

      <div className="border border-border rounded-lg bg-card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Duration</th>
              <th className="px-4 py-3 font-medium hidden lg:table-cell">Views</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Technical</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium hidden lg:table-cell">Confidence</th>
              <th className="px-4 py-3 font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...
              </td></tr>
            ) : videos.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No videos found.</td></tr>
            ) : (
              videos.map((v) => (
                <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-[250px] truncate">{v.title || "Untitled"}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground font-mono text-xs">{formatDuration(v.duration)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{v.view_count?.toLocaleString() ?? "—"}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${v.is_technical ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                      {v.is_technical ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                      v.status === "approved" ? "bg-green-500/10 text-green-600" :
                      v.status === "rejected" ? "bg-red-500/10 text-red-600" :
                      v.status === "classified" ? "bg-blue-500/10 text-blue-600" :
                      "bg-yellow-500/10 text-yellow-600"
                    }`}>{v.status || "new"}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground font-mono text-xs">
                    {v.classification_confidence != null ? `${(v.classification_confidence * 100).toFixed(0)}%` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewing(v)} className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <a href={`https://youtube.com/watch?v=${v.video_id}`} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="p-1.5 rounded hover:bg-secondary disabled:opacity-30 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-1.5 rounded hover:bg-secondary disabled:opacity-30 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Video Details</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3 text-sm">
              {viewing.thumbnail_url && (
                <img src={viewing.thumbnail_url} alt={viewing.title || ""} className="w-full rounded-md" />
              )}
              <DetailRow label="Title" value={viewing.title} />
              <DetailRow label="Video ID" value={viewing.video_id} />
              <DetailRow label="Status" value={viewing.status} />
              <DetailRow label="Duration" value={formatDuration(viewing.duration)} />
              <DetailRow label="Views" value={viewing.view_count?.toLocaleString()} />
              <DetailRow label="Published" value={viewing.published_at ? new Date(viewing.published_at).toLocaleDateString() : undefined} />
              <DetailRow label="Technical" value={viewing.is_technical ? "Yes" : "No"} />
              <DetailRow label="Classification" value={viewing.classification_reason} />
              <DetailRow label="Confidence" value={viewing.classification_confidence != null ? `${(viewing.classification_confidence * 100).toFixed(0)}%` : undefined} />
              <DetailRow label="Tags" value={viewing.tags?.join(", ")} />
              {viewing.description && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Description</span>
                  <p className="mt-1 text-xs text-muted-foreground whitespace-pre-wrap max-h-40 overflow-y-auto border border-border rounded p-2">{viewing.description}</p>
                </div>
              )}
              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex gap-3">
      <span className="text-xs font-medium text-muted-foreground w-24 flex-shrink-0">{label}</span>
      <span className="text-foreground">{value || "—"}</span>
    </div>
  );
}
