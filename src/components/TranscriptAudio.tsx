import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Download } from "lucide-react";
import { motion } from "framer-motion";
import type { Transcript } from "@/data/mockData";

export const TranscriptAudio = ({ transcript }: { transcript: Transcript }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const totalDuration = "52:30";

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { setIsPlaying(false); return 100; }
          const next = p + 0.05;
          const totalSecs = 52 * 60 + 30;
          const currentSecs = Math.floor((next / 100) * totalSecs);
          const mins = Math.floor(currentSecs / 60);
          const secs = currentSecs % 60;
          setCurrentTime(`${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`);
          return next;
        });
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  // Generate waveform bars
  const bars = Array.from({ length: 60 }, (_, i) => ({
    height: 20 + Math.sin(i * 0.5) * 15 + Math.random() * 20,
  }));

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">AI-Generated Audio</span>
        </div>

        <h4 className="font-display font-semibold mb-1">{transcript.title}</h4>
        <p className="text-sm text-muted-foreground mb-6">Narrated summary by {transcript.speakers.join(" & ")}</p>

        {/* Waveform */}
        <div className="relative h-16 mb-4 flex items-end gap-[2px] rounded-lg overflow-hidden">
          {bars.map((bar, i) => {
            const isActive = (i / bars.length) * 100 <= progress;
            return (
              <motion.div
                key={i}
                className={`flex-1 rounded-sm transition-colors duration-200 ${isActive ? "bg-primary" : "bg-secondary"}`}
                style={{ height: `${bar.height}%` }}
                animate={isPlaying && isActive ? { scaleY: [1, 1.2, 1], opacity: [0.8, 1, 0.8] } : {}}
                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.02 }}
              />
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="relative h-1 bg-secondary rounded-full mb-4 cursor-pointer" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = ((e.clientX - rect.left) / rect.width) * 100;
          setProgress(pct);
        }}>
          <div className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-lg" style={{ left: `${progress}%` }} />
        </div>

        {/* Time */}
        <div className="flex justify-between text-xs font-mono text-muted-foreground mb-6">
          <span>{currentTime}</span>
          <span>{totalDuration}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => setProgress((p) => Math.max(0, p - 5))} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
            <SkipBack className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center glow-bitcoin hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <button onClick={() => setProgress((p) => Math.min(100, p + 5))} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
            <SkipForward className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* Chapters */}
      {transcript.chapters && (
        <div className="border-t border-border p-4">
          <h5 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Chapters</h5>
          <div className="space-y-2">
            {transcript.chapters.map((ch, i) => (
              <button
                key={i}
                onClick={() => {
                  const totalSecs = 52 * 60 + 30;
                  const [m, s] = ch.time.split(":").map(Number);
                  const chSecs = m * 60 + s;
                  setProgress((chSecs / totalSecs) * 100);
                }}
                className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <span className="font-mono text-xs text-primary shrink-0">{ch.time}</span>
                <span className="text-sm text-muted-foreground">{ch.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
