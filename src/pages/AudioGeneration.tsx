import { useState } from "react";
import { Play, Pause, Download, Volume2, SkipForward, SkipBack } from "lucide-react";
import { motion } from "framer-motion";
import { transcripts } from "@/data/mockData";
import { Link } from "react-router-dom";

const AudioGeneration = () => {
  const [selectedTranscript, setSelectedTranscript] = useState(transcripts[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleGenerate = (id: string) => {
    setGeneratingId(id);
    setTimeout(() => {
      setGeneratingId(null);
      setSelectedTranscript(transcripts.find((t) => t.id === id) || transcripts[0]);
    }, 2000);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-primary">Audio</span>
      </div>

      <h1 className="font-display text-3xl font-bold mb-2">AI Audio Generation</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Convert transcripts and summaries into narrated, synchronized, and downloadable audio experiences.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transcript list */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Select Transcript</h3>
          {transcripts.slice(0, 6).map((t) => (
            <motion.button
              key={t.id}
              onClick={() => setSelectedTranscript(t)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedTranscript.id === t.id
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-card hover:border-primary/20"
              }`}
            >
              <div className="font-medium text-sm truncate">{t.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t.speakers.join(", ")}</div>
            </motion.button>
          ))}
        </div>

        {/* Player & controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Audio player */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4">
              <h2 className="font-display font-bold text-lg">{selectedTranscript.title}</h2>
              <p className="text-sm text-muted-foreground">{selectedTranscript.speakers.join(", ")}</p>
            </div>

            {/* Waveform visualization */}
            <div className="relative h-16 mb-4 flex items-center gap-0.5 overflow-hidden rounded-lg bg-secondary p-2">
              {Array.from({ length: 80 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-full"
                  style={{
                    backgroundColor: i < (progress / 100) * 80 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.2)",
                    height: `${20 + Math.random() * 80}%`,
                  }}
                  animate={isPlaying ? { height: [`${20 + Math.random() * 80}%`, `${20 + Math.random() * 80}%`] } : {}}
                  transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs text-muted-foreground">12:45</span>
              <div className="flex-1 h-1.5 rounded-full bg-secondary cursor-pointer" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setProgress(((e.clientX - rect.left) / rect.width) * 100);
              }}>
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="font-mono text-xs text-muted-foreground">36:20</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center glow-bitcoin hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Generation options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-display font-semibold mb-2">Full Narration</h3>
              <p className="text-xs text-muted-foreground mb-3">AI-narrated version of the complete transcript with natural intonation.</p>
              <button
                onClick={() => handleGenerate(selectedTranscript.id)}
                disabled={generatingId === selectedTranscript.id}
                className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
              >
                {generatingId === selectedTranscript.id ? "Generating..." : "Generate Audio"}
              </button>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-display font-semibold mb-2">Summary Audio</h3>
              <p className="text-xs text-muted-foreground mb-3">Condensed audio summary of key points, perfect for quick consumption.</p>
              <button className="w-full py-2 rounded-lg border border-border text-sm font-medium hover:border-primary/30 transition-colors">
                Generate Summary
              </button>
            </div>
          </div>

          {/* Download section */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-medium">Download Audio</div>
                <div className="text-xs text-muted-foreground font-mono">MP3 • 192kbps • ~15MB</div>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioGeneration;
