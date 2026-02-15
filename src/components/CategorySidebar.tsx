import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const sidebarLinks = [
  { label: "Categories", path: "/categories" },
  { label: "Topics", path: "/topics" },
  { label: "Speakers", path: "/speakers" },
  { label: "Types", path: "/types" },
  { label: "Sources", path: "/sources" },
];

export const CategorySidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-full lg:w-56 shrink-0">
      <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full"
                />
              )}
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden lg:block mt-8 p-4 rounded-xl border border-primary/20 bg-primary/5">
        <h4 className="font-display font-semibold text-sm text-primary mb-1">Review Transcripts</h4>
        <p className="text-xs text-muted-foreground mb-2">Help improve transcripts and earn sats.</p>
        <a
          href="https://review.btctranscripts.com/"
          target="_blank"
          rel="noopener"
          className="inline-flex text-xs font-mono text-primary hover:underline"
        >
          Earn Sats →
        </a>
      </div>
    </aside>
  );
};
