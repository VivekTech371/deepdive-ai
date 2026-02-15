import { useParams, Link } from "react-router-dom";
import { transcripts } from "@/data/mockData";
import { Calendar, Mic, Tag, Clock, Bookmark, Share2, Globe, Download } from "lucide-react";
import { motion } from "framer-motion";

const TranscriptDetail = () => {
  const { id } = useParams();
  const transcript = transcripts.find((t) => t.id === id);

  if (!transcript) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-bold mb-2">Transcript not found</h1>
        <Link to="/categories" className="text-primary font-mono text-sm hover:underline">← Back to categories</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono mb-6 flex-wrap">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link to="/categories" className="hover:text-foreground">{transcript.source}</Link>
        <span>/</span>
        <span className="text-primary truncate">{transcript.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <article className="flex-1 min-w-0">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-3">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">{transcript.type}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(transcript.date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight mb-4">{transcript.title}</h1>

              <div className="flex items-center gap-4 mb-4 flex-wrap">
                {transcript.speakers.map((speaker) => (
                  <span key={speaker} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mic className="w-4 h-4 text-primary" />
                    {speaker}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-4">
                {transcript.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary text-xs font-mono text-muted-foreground">
                    <Tag className="w-3 h-3" /> {tag}
                  </span>
                ))}
              </div>

              {/* Action bar */}
              <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  <Bookmark className="w-3.5 h-3.5" /> Save
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  <Globe className="w-3.5 h-3.5" /> Translate
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 mb-8">
              <h3 className="font-mono text-xs uppercase tracking-widest text-primary mb-2">Summary</h3>
              <p className="text-sm leading-relaxed text-foreground">{transcript.summary}</p>
            </div>

            {/* Body */}
            <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-display prose-code:font-mono prose-code:text-xs">
              {transcript.body.split("\n").map((line, i) => {
                if (line.startsWith("## ")) return <h2 key={i} className="font-display text-xl font-bold mt-8 mb-3">{line.replace("## ", "")}</h2>;
                if (line.startsWith("### ")) return <h3 key={i} className="font-display text-lg font-semibold mt-6 mb-2">{line.replace("### ", "")}</h3>;
                if (line.startsWith("#### ")) return <h4 key={i} className="font-display text-base font-semibold mt-4 mb-2">{line.replace("#### ", "")}</h4>;
                if (line.startsWith("**[")) return <p key={i} className="font-mono text-xs text-primary mb-1">{line.replace(/\*\*/g, "")}</p>;
                if (line.startsWith("- ")) return <li key={i} className="text-sm text-muted-foreground ml-4 mb-1">{line.replace("- ", "")}</li>;
                if (line.trim() === "") return <br key={i} />;
                return <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-2">{line}</p>;
              })}
            </div>
          </motion.div>
        </article>

        {/* Right sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-20 space-y-6">
            {/* Chapters */}
            {transcript.chapters && (
              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Chapters</h3>
                <div className="space-y-2">
                  {transcript.chapters.map((ch, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                      <span className="font-mono text-xs text-signal shrink-0 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {ch.time}
                      </span>
                      <span className="text-muted-foreground">{ch.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Speakers</h3>
              <div className="space-y-2">
                {transcript.speakers.map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mic className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Source info */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Source</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div><span className="text-foreground font-medium">{transcript.source}</span></div>
                <div>{transcript.conference}</div>
                <div className="font-mono text-xs">{transcript.language.toUpperCase()}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TranscriptDetail;
