import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mic, Calendar, Zap, ChevronRight } from "lucide-react";
import { transcripts } from "@/data/mockData";

const FeaturedHero = () => {
  const hero = transcripts[0];
  return (
    <Link to={`/transcript/${hero.id}`} className="group block relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-2xl border border-border bg-card overflow-hidden"
      >
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-wider">
              {hero.type}
            </span>
            <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-[10px] font-mono uppercase tracking-wider">
              Featured
            </span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
            {hero.title}
          </h3>

          <p className="text-muted-foreground leading-relaxed mb-5 max-w-2xl">
            {hero.summary}
          </p>

          <div className="flex items-center gap-4 mb-5 flex-wrap">
            {hero.speakers.map((speaker) => (
              <span key={speaker} className="flex items-center gap-1.5 text-sm text-foreground">
                <Mic className="w-3.5 h-3.5 text-primary" />
                {speaker}
              </span>
            ))}
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Calendar className="w-3 h-3" />
              {new Date(hero.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {hero.tags.slice(0, 5).map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-lg bg-secondary text-xs font-mono text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2 text-primary font-mono text-sm group-hover:gap-3 transition-all">
            <Zap className="w-4 h-4" />
            Read transcript
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const CompactCard = ({ transcript, index }: { transcript: typeof transcripts[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.06 }}
  >
    <Link
      to={`/transcript/${transcript.id}`}
      className="group flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-card/80 transition-all"
    >
      {/* Index number */}
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
        <span className="font-mono text-xs text-muted-foreground font-bold">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
          <span className="text-primary">{transcript.source}</span>
          <span className="text-border">•</span>
          <span>{transcript.type}</span>
        </div>
        <h4 className="font-display font-semibold text-sm leading-snug group-hover:text-primary transition-colors mb-1 truncate">
          {transcript.title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {transcript.speakers.slice(0, 2).map((s) => (
            <span key={s} className="flex items-center gap-1">
              <Mic className="w-2.5 h-2.5" />
              {s}
            </span>
          ))}
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-2 transition-colors" />
    </Link>
  </motion.div>
);

export const FeaturedTranscripts = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-8 bg-primary" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Signal Feed</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">Featured Transcripts</h2>
        </div>
        <Link to="/categories" className="text-sm font-mono text-primary hover:underline flex items-center gap-1">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Hero card takes 3 cols */}
        <div className="lg:col-span-3">
          <FeaturedHero />
        </div>

        {/* Compact list takes 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {transcripts.slice(1, 6).map((t, i) => (
            <CompactCard key={t.id} transcript={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
