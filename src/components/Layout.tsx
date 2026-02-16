import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Search, Menu, X, Zap, Globe } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Explore", path: "/categories" },
  { label: "Conferences", path: "/conferences" },
  { label: "About", path: "/about" },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top ticker tape */}
      <div className="h-7 bg-secondary border-b border-border overflow-hidden relative">
        <div className="flex animate-ticker whitespace-nowrap items-center h-full">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-4 font-mono text-[10px] text-muted-foreground tracking-wider uppercase">
              <span className="flex items-center gap-1"><Zap className="w-2.5 h-2.5 text-bitcoin" /> 1,251 Transcripts</span>
              <span>•</span>
              <span>6 Conference Archives</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Globe className="w-2.5 h-2.5 text-signal" /> 4 Languages</span>
              <span>•</span>
              <span>10+ Speakers</span>
              <span>•</span>
              <span>AI-Powered Search</span>
              <span className="mx-8">│</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-bitcoin">
              <span className="text-primary-foreground font-mono font-bold text-sm">₿</span>
            </div>
            <span className="font-display font-semibold text-lg tracking-tight">
              Transcripts
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname.startsWith(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-secondary text-muted-foreground text-sm hover:border-primary/30 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono text-xs">Search...</span>
              <kbd className="hidden sm:inline-flex h-5 px-1.5 rounded bg-muted text-[10px] font-mono items-center border border-border">⌘K</kbd>
            </button>

            <ThemeToggle />

            {/* Language selector */}
            <button className="h-9 px-2.5 rounded-lg border border-border bg-secondary text-xs font-mono text-muted-foreground hover:border-primary/30 transition-colors">
              EN
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg border border-border bg-secondary flex items-center justify-center"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <nav className="p-4 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname.startsWith(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="w-full max-w-xl mx-4 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transcripts, speakers, topics..."
                  className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="h-6 px-2 rounded bg-muted text-[10px] font-mono flex items-center border border-border text-muted-foreground">ESC</kbd>
              </div>
              <div className="p-4 text-center text-sm text-muted-foreground font-mono">
                <div className="flex items-center justify-center gap-2 py-8">
                  <Zap className="w-4 h-4 text-bitcoin animate-signal-pulse" />
                  <span>Type to decode the archive...</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-mono font-bold text-xs">₿</span>
                </div>
                <span className="font-display font-semibold">Transcripts</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Community-maintained archive unlocking knowledge from technical Bitcoin transcripts. Making Bitcoin accessible to learners, builders, and educators.
              </p>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Navigate</h4>
              <div className="flex flex-col gap-2">
                <Link to="/categories" className="text-sm text-foreground hover:text-primary transition-colors">Categories</Link>
                <Link to="/conferences" className="text-sm text-foreground hover:text-primary transition-colors">Conferences</Link>
                <Link to="/about" className="text-sm text-foreground hover:text-primary transition-colors">About</Link>
              </div>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Ecosystem</h4>
              <div className="flex flex-col gap-2">
                <a href="https://bitcoindevs.xyz/" target="_blank" rel="noopener" className="text-sm text-foreground hover:text-primary transition-colors">Bitcoin Devs</a>
                <a href="https://chat.bitcoinsearch.xyz/" target="_blank" rel="noopener" className="text-sm text-foreground hover:text-primary transition-colors">ChatBTC</a>
                <a href="https://bitcoinsearch.xyz/" target="_blank" rel="noopener" className="text-sm text-foreground hover:text-primary transition-colors">Bitcoin Search</a>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>Built with 🧡 by the Bitcoin Dev Community</span>
            <span>₿ {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
