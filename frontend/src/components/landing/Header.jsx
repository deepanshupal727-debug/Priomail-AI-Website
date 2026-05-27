import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl bg-black/70 border-b border-border" : "bg-transparent"
      }`}
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="flex items-center gap-2.5 group cursor-pointer"
          data-testid="header-logo"
          aria-label="PrioMail AI - scroll to top"
        >
          <div className="relative w-10 h-10 rounded-xl bg-[#1a1424] border border-primary/30 flex items-center justify-center group-hover:border-primary/60 transition-colors overflow-hidden">
            <img
              src="/priomail-icon-white.svg"
              alt=""
              aria-hidden="true"
              className="w-7 h-7 transition-transform duration-500 group-hover:scale-110"
              data-testid="header-logo-mark"
            />
            <span className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0_20px_-6px_rgba(167,139,250,0.5)]" />
          </div>
          <span className="font-display text-xl tracking-tight">PrioMail AI</span>
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              data-testid={`nav-${l.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://priomailai.in"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
            data-testid="header-signin"
          >
            Sign in
          </a>
          <a
            href="#pricing"
            className="text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2.5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(167,139,250,0.8)]"
            data-testid="header-cta"
          >
            Start free
          </a>
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="menu"
          data-testid="header-mobile-toggle"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden backdrop-blur-xl bg-black/90 border-t border-border"
        >
          <div className="px-6 py-6 flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground"
                data-testid={`mobile-nav-${l.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              className="mt-2 text-center text-sm font-bold bg-primary text-primary-foreground rounded-full px-5 py-3"
              data-testid="mobile-cta"
            >
              Start free
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
