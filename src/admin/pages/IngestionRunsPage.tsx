import { useEffect, useState } from "react";
import { api, IngestionRun } from "../api";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function IngestionRunsPage() {
  const [runs, setRuns] = useState<IngestionRun[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    api.getIngestionRuns()
      .then(setRuns)
      .catch(() => toast.error("Failed to load ingestion runs"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const formatDate = (d?: string) => d ? new Date(d).toLocaleString() : "—";
  const duration = (run: IngestionRun) => {
    if (!run.started_at || !run.completed_at) return "—";
    const ms = new Date(run.completed_at).getTime() - new Date(run.started_at).getTime();
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Ingestion Runs</h1>
        <Button size="sm" variant="outline" onClick={fetchData} className="gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </div>

      <div className="border border-border rounded-lg bg-card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Run Type</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Started</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Duration</th>
              <th className="px-4 py-3 font-medium">Discovered</th>
              <th className="px-4 py-3 font-medium">Classified</th>
              <th className="px-4 py-3 font-medium hidden lg:table-cell">Approved</th>
              <th className="px-4 py-3 font-medium hidden lg:table-cell">Rejected</th>
              <th className="px-4 py-3 font-medium">Errors</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...
              </td></tr>
            ) : runs.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No ingestion runs found.</td></tr>
            ) : (
              runs.map((run) => {
                const errorCount = Array.isArray(run.errors) ? run.errors.length : run.errors ? 1 : 0;
                return (
                  <tr key={run.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium font-mono text-xs">{run.run_type}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">{formatDate(run.started_at)}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground font-mono text-xs">{duration(run)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{run.videos_discovered ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{run.videos_classified ?? "—"}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-green-600">{run.videos_approved ?? "—"}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-red-600">{run.videos_rejected ?? "—"}</td>
                    <td className="px-4 py-3">
                      {errorCount > 0 ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 font-mono">{errorCount}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">0</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
