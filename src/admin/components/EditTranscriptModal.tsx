import { useEffect, useState } from "react";
import { api, Transcript } from "../api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  id: string;
  onClose: () => void;
  onSaved: () => void;
}

export function EditTranscriptModal({ id, onClose, onSaved }: Props) {
  const [data, setData] = useState<Partial<Transcript> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getTranscript(id)
      .then((t) => setData(t))
      .catch(() => { toast.error("Failed to load transcript"); onClose(); })
      .finally(() => setLoading(false));
  }, [id, onClose]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await api.updateTranscript(id, data);
      toast.success("Transcript updated");
      onSaved();
    } catch {
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const update = (field: string, value: unknown) =>
    setData((prev) => (prev ? { ...prev, [field]: value } : prev));

  const inputClass = "w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Transcript</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : data ? (
          <div className="space-y-4">
            <Field label="Title">
              <input value={data.title || ""} onChange={(e) => update("title", e.target.value)} className={inputClass} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Conference">
                <input value={data.conference || ""} onChange={(e) => update("conference", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Status">
                <select value={data.status || "pending"} onChange={(e) => update("status", e.target.value)} className={inputClass}>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="done">Done</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Event Date">
                <input type="date" value={data.event_date?.split("T")[0] || ""} onChange={(e) => update("event_date", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Location">
                <input value={data.loc || ""} onChange={(e) => update("loc", e.target.value)} className={inputClass} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Channel Name">
                <input value={data.channel_name || ""} onChange={(e) => update("channel_name", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Media URL">
                <input value={data.media_url || ""} onChange={(e) => update("media_url", e.target.value)} className={inputClass} />
              </Field>
            </div>

            <Field label="Speakers (comma-separated)">
              <input value={data.speakers?.join(", ") || ""} onChange={(e) => update("speakers", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className={inputClass} />
            </Field>

            <Field label="Tags (comma-separated)">
              <input value={data.tags?.join(", ") || ""} onChange={(e) => update("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className={inputClass} />
            </Field>

            <Field label="Categories (comma-separated)">
              <input value={data.categories?.join(", ") || ""} onChange={(e) => update("categories", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className={inputClass} />
            </Field>

            <Field label="Topics (comma-separated)">
              <input value={data.topics?.join(", ") || ""} onChange={(e) => update("topics", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className={inputClass} />
            </Field>

            <Field label="Summary">
              <textarea value={data.summary || ""} onChange={(e) => update("summary", e.target.value)} rows={4} className={inputClass + " resize-y"} />
            </Field>

            <Field label="Raw Text">
              <textarea value={data.raw_text || ""} onChange={(e) => update("raw_text", e.target.value)} rows={6} className={inputClass + " resize-y"} />
            </Field>

            <Field label="Corrected Text">
              <textarea value={data.corrected_text || ""} onChange={(e) => update("corrected_text", e.target.value)} rows={6} className={inputClass + " resize-y"} />
            </Field>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={onClose}
                className="px-4 py-2 rounded-md border border-input text-sm hover:bg-secondary transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      {children}
    </div>
  );
}
