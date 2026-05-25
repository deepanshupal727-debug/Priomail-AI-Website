import { motion } from "framer-motion";
import { Link2, BrainCircuit, BellRing } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: Link2,
    title: "Connect your inbox",
    desc: "Secure OAuth with Gmail or Outlook. No passwords stored. Read-only by default.",
  },
  {
    n: "02",
    icon: BrainCircuit,
    title: "AI classifies in real time",
    desc: "Every incoming message is scored across 5 priority tiers in under 400ms.",
  },
  {
    n: "03",
    icon: BellRing,
    title: "Alarm. Only when it matters.",
    desc: "Push notifications repeat for CRITICAL mail. Everything else waits its turn.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-24 md:py-32 bg-card/30 border-y border-border" data-testid="how-it-works">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-12 gap-12 items-end mb-16"
        >
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-bold text-primary mb-4">
              How it works
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95]">
              Three steps.<br />
              Then your inbox runs itself<span className="text-primary">.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-muted-foreground text-base">
            Set up takes 90 seconds. From the moment you connect, PrioMail starts learning your patterns and triaging in the background.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 relative">
          {/* connecting line */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative bg-card border border-border rounded-2xl p-8 hover:border-white/20 transition-colors"
              data-testid={`step-${s.n}`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="font-display text-5xl text-muted-foreground/40 tracking-tighter">{s.n}</span>
              </div>
              <h3 className="font-display text-2xl tracking-tight mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
