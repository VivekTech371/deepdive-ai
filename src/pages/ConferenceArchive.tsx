import { conferences, transcripts } from "@/data/mockData";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Calendar, FileText, ChevronRight, Users } from "lucide-react";

const ConferenceArchive = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-primary">Conference Archive</span>
      </div>

      <h1 className="font-display text-3xl font-bold mb-2">Conference Proceedings</h1>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Structured session-wise breakdown of Bitcoin conferences, including key highlights, important discussions, and organized summaries.
      </p>

      <div className="space-y-8">
        {conferences.map((conf, i) => (
          <motion.div
            key={conf.slug}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            {/* Conference header */}
            <div className="p-6 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold mb-1">{conf.name}</h2>
                  <p className="text-sm text-muted-foreground">{conf.description}</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground shrink-0">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {conf.year}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {conf.location}</span>
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {conf.sessions}</span>
                </div>
              </div>
            </div>

            {/* Sessions list */}
            <div className="divide-y divide-border">
              {transcripts
                .filter((t) => t.source === conf.name || t.conference.includes(conf.name.split(" ")[0]))
                .slice(0, 3)
                .map((t) => (
                  <Link
                    key={t.id}
                    to={`/transcript/${t.id}`}
                    className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm group-hover:text-primary transition-colors truncate">{t.title}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {t.speakers.join(", ")}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </Link>
                ))}
              {transcripts.filter((t) => t.source === conf.name || t.conference.includes(conf.name.split(" ")[0])).length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground font-mono">
                  Sessions coming soon...
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ConferenceArchive;
