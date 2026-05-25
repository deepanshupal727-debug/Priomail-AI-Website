import { motion } from "framer-motion";
import {
  Bell, ShieldAlert, Sparkles, Brush, BarChart3, MailCheck,
  Layers, Zap, PenLine, Database, Wand2, ListChecks,
} from "lucide-react";

const PILLARS = [
  { id: "triage", label: "Priority triage", icon: Zap, color: "#A78BFA" },
  { id: "cleanup", label: "Inbox cleanup", icon: Brush, color: "#10B981" },
  { id: "ai", label: "AI replies", icon: PenLine, color: "#F59E0B" },
];

const FEATURES = [
  {
    title: "Alarm-style notifications",
    desc: "Critical mail rings your phone like a fire alarm — repeating every 60s until you respond. No more buried CEO emails, no more 2am misses.",
    icon: Bell,
    span: "md:col-span-2 md:row-span-2",
    pillar: "triage",
    accent: "#A78BFA",
    big: true,
  },
  {
    title: "5-tier AI classification",
    desc: "Every mail labeled Critical · Urgent · Normal · Spam · Phishing — the moment it arrives.",
    icon: ListChecks,
    span: "md:col-span-1",
    pillar: "triage",
    accent: "#A78BFA",
  },
  {
    title: "Phishing radar",
    desc: "Detects spoofed senders, lookalike domains, and malicious links before you click.",
    icon: ShieldAlert,
    span: "md:col-span-1",
    pillar: "triage",
    accent: "#A78BFA",
  },
  {
    title: "One-click bulk cleanup",
    desc: "Archive 11,000 newsletters in a single tap. Smart rules learn your behavior so the inbox stays clean forever.",
    icon: Brush,
    span: "md:col-span-2",
    pillar: "cleanup",
    accent: "#10B981",
    stat: { value: "12.4 GB", label: "avg storage reclaimed in month one" },
  },
  {
    title: "Storage saver",
    desc: "Stop paying Google for clutter. PrioMail surfaces heavy attachments and old threads safe to remove.",
    icon: Database,
    span: "md:col-span-1",
    pillar: "cleanup",
    accent: "#10B981",
  },
  {
    title: "AI auto-drafts",
    desc: "Stale email? PrioMail writes a reply in your voice, learned from your past sent mail. Approve in one tap — never auto-sent.",
    icon: Wand2,
    span: "md:col-span-2",
    pillar: "ai",
    accent: "#F59E0B",
    big: true,
  },
  {
    title: "Monthly health report",
    desc: "Response time, hours saved, top contacts, and where your attention leaks.",
    icon: BarChart3,
    span: "md:col-span-1",
    pillar: "ai",
    accent: "#F59E0B",
  },
  {
    title: "Gmail + Outlook",
    desc: "One dashboard. Both providers. Zero compromise on security.",
    icon: MailCheck,
    span: "md:col-span-1",
    pillar: "triage",
    accent: "#A78BFA",
  },
];

function getPillarLabel(id) {
  return PILLARS.find((p) => p.id === id)?.label || "";
}

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32" data-testid="features">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-10"
        >
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-bold text-primary mb-4">
            <Zap className="w-3.5 h-3.5" /> Capabilities
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95]">
            Three pillars.<br />
            One command center<span className="text-primary">.</span>
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl">
            PrioMail AI does three things obsessively well — triage the noise, clean the clutter, and write the replies. Every feature below sits under one of these pillars.
          </p>
        </motion.div>

        {/* Pillar tabs (visual only) */}
        <div className="flex flex-wrap gap-2.5 mb-10" data-testid="pillar-legend">
          {PILLARS.map((p) => (
            <div
              key={p.id}
              className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-3.5 py-2 text-xs font-semibold"
              style={{ borderColor: `${p.color}30` }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: p.color, boxShadow: `0 0 8px ${p.color}` }}
              />
              <p.icon className="w-3.5 h-3.5" style={{ color: p.color }} />
              <span>{p.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[minmax(220px,auto)]">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className={`relative bg-card border border-border rounded-2xl p-7 md:p-8 overflow-hidden group hover:border-white/20 transition-colors flex flex-col ${f.span}`}
              data-testid={`feature-${f.title.toLowerCase().replace(/\s|\+/g, "-")}`}
            >
              {/* Glow on hover */}
              <div
                className="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 pointer-events-none"
                style={{ background: f.accent }}
              />

              <div className="flex items-start justify-between mb-5">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${f.accent}1A`, border: `1px solid ${f.accent}40`, color: f.accent }}
                >
                  <f.icon className="w-5 h-5" />
                </div>
                <span
                  className="text-[9px] font-black tracking-[0.18em] uppercase px-2 py-1 rounded-full"
                  style={{
                    background: `${f.accent}14`,
                    color: f.accent,
                    border: `1px solid ${f.accent}33`,
                  }}
                >
                  {getPillarLabel(f.pillar)}
                </span>
              </div>

              <h3 className={`font-display tracking-tight leading-tight mb-3 ${f.big ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}>
                {f.title}
              </h3>
              <p className={`text-muted-foreground leading-relaxed ${f.big ? "text-base max-w-md" : "text-sm"}`}>{f.desc}</p>

              {/* Special anchor visuals */}
              {f.title === "Alarm-style notifications" && (
                <div className="mt-8 flex items-center gap-3 bg-[#0f0c18] border border-white/10 rounded-xl p-4 max-w-sm">
                  <div className="w-2 h-2 rounded-full bg-primary pulse-glow" />
                  <div>
                    <div className="text-[10px] font-mono-d text-primary tracking-widest">CRITICAL ALARM</div>
                    <div className="text-xs text-muted-foreground">Retry 03/05 · ringing in 47s</div>
                  </div>
                </div>
              )}

              {f.stat && (
                <div className="mt-6 flex items-end gap-3 bg-[#0f0c18] border border-white/10 rounded-xl p-4 max-w-sm">
                  <div className="font-display text-3xl md:text-4xl tracking-tighter" style={{ color: f.accent }}>
                    {f.stat.value}
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-tight pb-1">{f.stat.label}</div>
                </div>
              )}

              {f.title === "AI auto-drafts" && (
                <div className="mt-6 bg-[#0f0c18] border border-white/10 rounded-xl p-4 max-w-md">
                  <div className="text-[10px] font-mono-d text-muted-foreground tracking-widest mb-2">DRAFT · in your voice</div>
                  <p className="text-xs text-foreground/85 leading-relaxed italic">
                    "Hey Aarav — circling back on the Q4 numbers. Sending the updated deck tonight by 9pm. Worth a 15-min sync tomorrow?"
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full px-2.5 py-1">Approve</span>
                    <span className="text-[10px] font-bold bg-secondary border border-border rounded-full px-2.5 py-1 text-muted-foreground">Edit</span>
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
