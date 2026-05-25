import { motion } from "framer-motion";
import { Bell, ShieldAlert, Sparkles, Brush, BarChart3, MailCheck, Layers, Zap } from "lucide-react";

const FEATURES = [
  {
    title: "Alarm-style notifications",
    desc: "Critical mail rings your phone like a fire alarm — repeating every 60s until you respond. No more buried CEO emails.",
    icon: Bell,
    span: "md:col-span-2 md:row-span-2",
    accent: "#FF3B30",
    big: true,
  },
  {
    title: "Phishing radar",
    desc: "Detects spoofed senders, lookalike domains, and malicious links before you click.",
    icon: ShieldAlert,
    span: "md:col-span-1",
    accent: "#F59E0B",
  },
  {
    title: "AI auto-drafts",
    desc: "Stale email? PrioMail writes a reply in your voice. Approve in one tap.",
    icon: Sparkles,
    span: "md:col-span-1",
    accent: "#3B82F6",
  },
  {
    title: "Inbox cleanup",
    desc: "Bulk-archive newsletters and old threads with smart rules learned from your behavior.",
    icon: Brush,
    span: "md:col-span-2",
    accent: "#10B981",
  },
  {
    title: "Monthly health report",
    desc: "Response time, hours saved, top contacts, and where your attention leaks.",
    icon: BarChart3,
    span: "md:col-span-1",
    accent: "#8B5CF6",
  },
  {
    title: "Gmail + Outlook",
    desc: "One dashboard. Both providers. Zero compromise on security.",
    icon: MailCheck,
    span: "md:col-span-1",
    accent: "#FF3B30",
  },
  {
    title: "Command center",
    desc: "A single view across every account. Triage in seconds.",
    icon: Layers,
    span: "md:col-span-1",
    accent: "#F59E0B",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32" data-testid="features">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-bold text-primary mb-4">
            <Zap className="w-3.5 h-3.5" /> Capabilities
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95]">
            Built like a<br />command center<span className="text-primary">.</span>
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl">
            Seven AI-powered tools. One inbox. Zero noise. Every feature is engineered for executives, founders, and operators who can't afford to miss the signal.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[minmax(220px,auto)]">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className={`relative bg-card border border-border rounded-2xl p-7 md:p-9 overflow-hidden group hover:border-white/20 transition-colors ${f.span}`}
              data-testid={`feature-${f.title.toLowerCase().replace(/\s/g, "-")}`}
            >
              {/* Glow on hover */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-30 blur-3xl transition-opacity duration-500"
                style={{ background: f.accent }}
              />

              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${f.accent}1A`, border: `1px solid ${f.accent}40`, color: f.accent }}
              >
                <f.icon className="w-5 h-5" />
              </div>

              <h3 className={`font-display tracking-tight leading-tight mb-3 ${f.big ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}>
                {f.title}
              </h3>
              <p className={`text-muted-foreground leading-relaxed ${f.big ? "text-base max-w-md" : "text-sm"}`}>{f.desc}</p>

              {f.big && (
                <div className="mt-8 flex items-center gap-3 backdrop-blur-md bg-black/40 border border-white/10 rounded-xl p-4 max-w-sm">
                  <div className="w-2 h-2 rounded-full bg-primary pulse-glow" />
                  <div>
                    <div className="text-[10px] font-mono-d text-primary tracking-widest">CRITICAL ALARM</div>
                    <div className="text-xs text-muted-foreground">Retry 03/05 · ringing in 47s</div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
