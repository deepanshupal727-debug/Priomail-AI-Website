import { motion } from "framer-motion";
import { Sparkles, Users, BriefcaseBusiness, HeartHandshake, Crown, Headphones, ShieldCheck, ArrowRight } from "lucide-react";

const PERSONAS = [
  {
    role: "HR & People Ops",
    icon: Users,
    headline: "Never miss a candidate or crisis.",
    desc: "Offer accepts, exit emails, escalations from leadership — all surfaced the moment they land. Newsletters and job-board noise stay out of your way.",
    matters: ["Candidate offers", "Employee escalations", "Compliance notices"],
  },
  {
    role: "Sales & Revenue",
    icon: BriefcaseBusiness,
    headline: "Hot leads before they go cold.",
    desc: "Buyer signals, contract redlines, and procurement replies get critical-tier alerts. PrioMail auto-drafts the follow-up so you reply in seconds.",
    matters: ["Buyer intent replies", "Contract redlines", "Procurement asks"],
  },
  {
    role: "Customer Success",
    icon: Headphones,
    headline: "Catch churn signals on day one.",
    desc: "Frustrated customer? Renewal at risk? PrioMail detects sentiment shifts and pings you with an alarm — before the CSAT drops.",
    matters: ["Churn signals", "Renewal threads", "Escalations"],
  },
  {
    role: "Founders & Execs",
    icon: Crown,
    headline: "One pane. Zero misses.",
    desc: "Board, investors, top customers — all triaged at the top. Everything else gets cleaned, summarized, or auto-replied while you focus.",
    matters: ["Board & investor mail", "Top-customer threads", "Co-founder pings"],
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 md:py-32 bg-card/30 border-y border-border" data-testid="early-access">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-12 gap-8 mb-16"
        >
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-bold text-primary mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Early access — be the first
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95]">
              Built for inboxes<br />
              where every email<br />
              <span className="text-primary">truly matters</span>.
            </h2>
          </div>
          <div className="lg:col-span-5 self-end space-y-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              We're onboarding a limited cohort of professionals whose work hinges on the right email reaching them at the right moment. Pick your role — we built PrioMail with you in mind.
            </p>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5"
              data-testid="early-access-cta"
            >
              Reserve my seat <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PERSONAS.map((p, i) => (
            <motion.div
              key={p.role}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-card border border-border rounded-2xl p-7 hover:border-primary/40 transition-colors flex flex-col"
              data-testid={`persona-${p.role.toLowerCase().replace(/\s|&/g, "-")}`}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-5">
                <p.icon className="w-5 h-5" />
              </div>

              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">{p.role}</div>
              <h3 className="font-display text-xl tracking-tight leading-tight mb-3">{p.headline}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{p.desc}</p>

              <div className="pt-4 border-t border-border space-y-2">
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold mb-2">What we surface</div>
                {p.matters.map((m) => (
                  <div key={m} className="flex items-center gap-2 text-xs text-foreground/80">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    {m}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Limited early-access cohort · No credit card required
          </div>
        </motion.div>
      </div>
    </section>
  );
}
