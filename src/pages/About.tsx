import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Users, Globe, Headphones, MessageSquare } from "lucide-react";

const features = [
  { icon: FileText, title: "AI Transcription", desc: "Generate corrected, timestamped transcripts with speaker detection, chapters, tags, and summaries." },
  { icon: MessageSquare, title: "RAG-Based Chat", desc: "Ask questions about sessions or conferences. The system retrieves relevant transcript sections and generates grounded answers." },
  { icon: Globe, title: "Multilingual Support", desc: "Translate transcripts and summaries into multiple languages with inclusive UI options and beginner/technical modes." },
  { icon: Headphones, title: "Audio Generation", desc: "Convert transcripts into narrated, synchronized, and downloadable audio experiences." },
  { icon: Users, title: "Conference Indexing", desc: "Automatically discover, scrape, and structure Bitcoin conferences, videos, podcasts, and speakers." },
];

const About = () => {
  return (
    <div>
      {/* Hero section */}
      <section className="relative py-20 border-b border-border bg-secondary/30 overflow-hidden">
        <div className="absolute inset-0 scanline pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl sm:text-5xl font-bold mb-4"
          >
            What Is Bitcoin Transcripts?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Bitcoin Transcripts unlocks the wisdom, knowledge, and history from Bitcoin tech podcasts, presentations, and other audio-visual media. We make technical Bitcoin knowledge accessible to learners, builders, and educators.
          </motion.p>
        </div>
      </section>

      {/* How we got here */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-primary" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Origin Story</span>
            </div>
            <h2 className="font-display text-3xl font-bold mb-4">How We Got Here</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              In the past, Bryan Bishop (@kanzure) and others would manually transcribe talks live. Bryan alone produced over 900 of these transcripts, making them publicly available.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Building on his foundations, we now use AI to create transcripts. We then pass along the transcript to reviewers for edits, ensuring quality and accuracy.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This makes Bitcoin tech knowledge and history more accessible as text. The content feeds tools like ChatBTC and Bitcoin Search, expanding the reach of technical knowledge.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <span className="font-mono text-sm text-primary font-bold">01</span>
                </div>
                <div>
                  <h3 className="font-display font-semibold mb-1">Source Discovery</h3>
                  <p className="text-sm text-muted-foreground">AI identifies and indexes Bitcoin conferences, podcasts, and talks from across the ecosystem.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <span className="font-mono text-sm text-primary font-bold">02</span>
                </div>
                <div>
                  <h3 className="font-display font-semibold mb-1">AI Transcription</h3>
                  <p className="text-sm text-muted-foreground">Speech-to-text models generate initial transcripts with timestamps and speaker detection.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <span className="font-mono text-sm text-primary font-bold">03</span>
                </div>
                <div>
                  <h3 className="font-display font-semibold mb-1">Community Review</h3>
                  <p className="text-sm text-muted-foreground">Reviewers verify, correct, and enhance transcripts. Contributors can earn sats for their work.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <span className="font-mono text-sm text-primary font-bold">04</span>
                </div>
                <div>
                  <h3 className="font-display font-semibold mb-1">Knowledge Distribution</h3>
                  <p className="text-sm text-muted-foreground">Published transcripts feed into search engines, AI chatbots, and educational platforms.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-secondary/20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-display text-2xl font-bold mb-2 text-center">Platform Capabilities</h2>
          <p className="text-muted-foreground text-center mb-10">AI-powered tools for Bitcoin knowledge preservation</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl border border-border bg-card"
              >
                <feat.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-display font-semibold mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contribute CTA */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="font-display text-2xl font-bold mb-3">Contribute to the Project</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Help us expand and improve Bitcoin Transcripts by contributing your skills and knowledge. Join the community effort.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://review.btctranscripts.com/"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm glow-bitcoin"
          >
            Review Transcripts, Earn Sats <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-sm font-semibold hover:border-primary/30"
          >
            Explore Archive
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
