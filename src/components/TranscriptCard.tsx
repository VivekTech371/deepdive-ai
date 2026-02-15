import { Link } from "react-router-dom";
import { Calendar, Mic, Bookmark, Tag } from "lucide-react";
import { motion } from "framer-motion";
import type { Transcript } from "@/data/mockData";

export const TranscriptCard = ({ transcript, index = 0 }: { transcript: Transcript; index?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        to={`/transcript/${transcript.id}`}
        className="group block p-5 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-2">
          <span>{transcript.source}</span>
          <span className="text-border">/</span>
          <span>{transcript.conference}</span>
          <span className="ml-auto flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(transcript.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>

        <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors mb-2 leading-tight">
          {transcript.title}
        </h3>

        <div className="flex items-center gap-3 mb-3">
          {transcript.speakers.map((speaker) => (
            <span key={speaker} className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mic className="w-3 h-3" />
              {speaker}
            </span>
          ))}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {transcript.summary}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap">
          {transcript.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-xs font-mono text-muted-foreground"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
          {transcript.tags.length > 4 && (
            <span className="text-xs text-muted-foreground font-mono">+{transcript.tags.length - 4}</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
};
