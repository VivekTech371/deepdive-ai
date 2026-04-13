import { useEffect, useState, useCallback } from "react";
import { api, YouTubeChannel } from "../api";
import { Loader2, Pencil, Trash2, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function YouTubeChannelsPage() {
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingChannel, setEditingChannel] = useState<Partial<YouTubeChannel> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    api.getChannels()
      .then(setChannels)
      .catch(() => toast.error("Failed to load channels"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openNew = () => {
    setEditingChannel({ channel_id: "", channel_name: "", is_active: true, priority: 0 });
    setIsNew(true);
  };

  const openEdit = (ch: YouTubeChannel) => {
    setEditingChannel({ ...ch });
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editingChannel) return;
    setSaving(true);
    try {
      if (isNew) {
        await api.createChannel(editingChannel);
        toast.success("Channel created");
      } else {
        await api.updateChannel(editingChannel.id!, editingChannel);
        toast.success("Channel updated");
      }
      setEditingChannel(null);
      fetchData();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await api.deleteChannel(deletingId);
      toast.success("Channel deleted");
      setDeletingId(null);
      fetchData();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const updateField = (field: string, value: unknown) =>
    setEditingChannel((prev) => (prev ? { ...prev, [field]: value } : prev));

  const inputClass = "w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">YouTube Channels</h1>
        <Button size="sm" onClick={openNew} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Channel
        </Button>
      </div>

      <div className="border border-border rounded-lg bg-card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Channel Name</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Category</th>
              <th className="px-4 py-3 font-medium hidden lg:table-cell">Priority</th>
              <th className="px-4 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Last Scanned</th>
              <th className="px-4 py-3 font-medium w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...
              </td></tr>
            ) : channels.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No channels found.</td></tr>
            ) : (
              channels.map((ch) => (
                <tr key={ch.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-1.5">
                      {ch.channel_name}
                      {ch.channel_url && (
                        <a href={ch.channel_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{ch.category || "—"}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{ch.priority ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${ch.is_active ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                      {ch.is_active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                    {ch.last_scanned_at ? new Date(ch.last_scanned_at).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(ch)} className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeletingId(ch.id)} className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      <Dialog open={!!editingChannel} onOpenChange={() => setEditingChannel(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isNew ? "Add Channel" : "Edit Channel"}</DialogTitle>
          </DialogHeader>
          {editingChannel && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Channel Name</label>
                <input value={editingChannel.channel_name || ""} onChange={(e) => updateField("channel_name", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Channel ID</label>
                <input value={editingChannel.channel_id || ""} onChange={(e) => updateField("channel_id", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Channel URL</label>
                <input value={editingChannel.channel_url || ""} onChange={(e) => updateField("channel_url", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
                <textarea value={editingChannel.description || ""} onChange={(e) => updateField("description", e.target.value)} rows={3} className={inputClass + " resize-y"} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
                  <input value={editingChannel.category || ""} onChange={(e) => updateField("category", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Priority</label>
                  <input type="number" value={editingChannel.priority ?? 0} onChange={(e) => updateField("priority", parseInt(e.target.value) || 0)} className={inputClass} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_active" checked={editingChannel.is_active ?? true} onChange={(e) => updateField("is_active", e.target.checked)}
                  className="rounded border-input" />
                <label htmlFor="is_active" className="text-sm text-muted-foreground">Active</label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditingChannel(null)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete channel?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
