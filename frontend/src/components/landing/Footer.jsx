import { motion } from "framer-motion";
import { Zap, Twitter, Github, Linkedin, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    toast.success("You're on the list! We'll be in touch.");
    setEmail("");
  };

  return (
    <footer className="relative border-t border-border bg-background overflow-hidden" data-testid="footer">
      {/* Massive CTA */}
      <div className="relative py-24 md:py-36 overflow-hidden radial-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-5xl sm:text-7xl lg:text-[9rem] tracking-tighter leading-[0.85] text-center">
              Ready to take<br />
              <span className="text-primary text-glow-red">control?</span>
            </h2>
            <p className="mt-8 text-center text-muted-foreground max-w-xl mx-auto">
              Join 12,000+ professionals who never miss what matters — and never waste a second on what doesn't.
            </p>

            <form
              noValidate
              onSubmit={handleSubmit}
              className="mt-10 max-w-md mx-auto flex items-center gap-2 p-2 bg-card border border-border rounded-full focus-within:border-primary transition-colors"
              data-testid="footer-cta-form"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 bg-transparent outline-none px-4 py-2 text-sm placeholder:text-muted-foreground"
                data-testid="footer-email-input"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2.5 text-sm font-bold inline-flex items-center gap-2 transition-all hover:-translate-y-0.5"
                data-testid="footer-cta-submit"
              >
                Start free <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Footer links */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="flex items-center gap-2.5 mb-4 cursor-pointer group"
              data-testid="footer-logo"
            >
              <div className="w-9 h-9 rounded-xl bg-[#1a1424] border border-primary/30 flex items-center justify-center group-hover:border-primary/60 transition-colors" data-testid="footer-logo-mark">
                <Zap className="w-4 h-4 text-primary" strokeWidth={2.5} />
              </div>
              <span className="pm-wordmark text-xl tracking-tight">PrioMail AI</span>
            </a>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              AI-powered email priority intelligence. Built for inboxes that move fast.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href="#" aria-label="twitter" className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors" data-testid="social-twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="github" className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors" data-testid="social-github">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" aria-label="linkedin" className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors" data-testid="social-linkedin">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-4">Product</div>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#how" className="text-muted-foreground hover:text-foreground transition-colors">How it works</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">Live demo</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-4">Company</div>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-4">Legal</div>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Security</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">DPA</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-4">Support</div>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Status</a></li>
              <li><a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-xs text-muted-foreground">© 2026 PrioMail AI. All rights reserved.</p>
            <p className="text-xs text-muted-foreground font-mono-d" data-testid="footer-tagline">
              Made with <span className="text-red-500" aria-label="love">❤️</span> in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
