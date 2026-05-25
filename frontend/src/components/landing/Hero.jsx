import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Play, Shield, AlertTriangle, Mail, Skull, CheckCircle2 } from "lucide-react";

const EMAIL_CARDS = [
  {
    priority: "CRITICAL",
    color: "#FF3B30",
    sender: "CEO @ Acme Corp",
    subject: "Board decision needed before 5pm",
    snippet: "We need your sign-off on the Q4 acquisition deal — final call is at 16:30.",
    icon: AlertTriangle,
    rotate: -8,
    y: 0,
    z: 80,
    delay: 0.2,
  },
  {
    priority: "URGENT",
    color: "#F59E0B",
    sender: "Stripe Billing",
    subject: "Action required: card expiring tomorrow",
    snippet: "Update payment to avoid service interruption on December 13.",
    icon: AlertTriangle,
    rotate: -4,
    y: 60,
    z: 40,
    delay: 0.35,
  },
  {
    priority: "NORMAL",
    color: "#3B82F6",
    sender: "Linear",
    subject: "Your weekly project digest",
    snippet: "12 issues closed · 4 in review · sprint velocity up 18%.",
    icon: Mail,
    rotate: 2,
    y: 120,
    z: 0,
    delay: 0.5,
  },
  {
    priority: "PHISHING",
    color: "#991B1B",
    sender: "support@arnaz0n-secur1ty.co",
    subject: "Your account will be suspended!!",
    snippet: "Click here to verify your identity immediately or lose access...",
    icon: Skull,
    rotate: 6,
    y: 180,
    z: -40,
    delay: 0.65,
  },
];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden radial-bg grain" data-testid="hero">
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* LEFT — copy */}
        <div className="lg:col-span-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-card border border-border rounded-full pl-2 pr-4 py-1.5 mb-8"
            data-testid="hero-badge"
          >
            <span className="bg-primary text-primary-foreground text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full">NEW</span>
            <span className="text-xs text-muted-foreground font-medium">Powered by Claude Haiku 4.5 · 99.2% accuracy</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl lg:text-7xl tracking-tighter leading-[0.9]"
            data-testid="hero-headline"
          >
            Your inbox,<br />
            <span className="text-primary text-glow-red">triaged</span> by AI.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 text-base lg:text-lg text-muted-foreground max-w-xl leading-relaxed"
            data-testid="hero-subhead"
          >
            PrioMail AI reads every Gmail & Outlook message, ranks them <span className="text-foreground font-semibold">Critical · Urgent · Normal · Spam · Phishing</span>, and alarms you the moment something can't wait. Never miss what matters. Never drown in what doesn't.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#pricing"
              className="group inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-7 py-4 font-bold transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-8px_rgba(255,59,48,0.7)]"
              data-testid="hero-cta-primary"
            >
              Start free — 14 days
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#demo"
              className="inline-flex items-center justify-center gap-2 bg-secondary border border-border hover:bg-accent rounded-full px-7 py-4 font-semibold text-foreground transition-colors"
              data-testid="hero-cta-secondary"
            >
              <Play className="w-4 h-4 fill-current" /> See it sort live
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 flex items-center gap-6 text-xs text-muted-foreground"
          >
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> SOC 2 Type II</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> No credit card</div>
            <div className="hidden sm:flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> Gmail & Outlook</div>
          </motion.div>
        </div>

        {/* RIGHT — 3D email stack */}
        <div className="lg:col-span-6 relative h-[520px] perspective-1200" data-testid="hero-3d-stack">
          <div className="absolute inset-0 flex items-center justify-center">
            {EMAIL_CARDS.map((card, i) => (
              <motion.div
                key={card.priority}
                initial={{ opacity: 0, y: 80, rotateX: 30, rotateY: -30, rotateZ: card.rotate }}
                animate={{ opacity: 1, y: card.y, rotateX: 12, rotateY: -16, rotateZ: card.rotate }}
                transition={{ duration: 0.9, delay: card.delay, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ rotateY: -8, rotateX: 6, scale: 1.04, transition: { duration: 0.3 } }}
                style={{
                  transformStyle: "preserve-3d",
                  translateZ: card.z,
                  zIndex: 100 - i,
                }}
                className="absolute w-[88%] max-w-md backdrop-blur-xl bg-black/70 border border-white/10 rounded-2xl p-5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.15em] px-2.5 py-1 rounded-full"
                      style={{
                        background: `${card.color}1A`,
                        color: card.color,
                        border: `1px solid ${card.color}40`,
                      }}
                    >
                      <card.icon className="w-3 h-3" />
                      {card.priority}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono-d">14:0{i + 2}</span>
                </div>
                <div className="text-xs text-muted-foreground mb-1 font-mono-d truncate">{card.sender}</div>
                <div className="text-sm font-bold text-foreground mb-1 truncate">{card.subject}</div>
                <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{card.snippet}</div>
                {card.priority === "CRITICAL" && (
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-primary font-bold tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-glow" />
                    ALARM ACTIVE · 3 RETRIES
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Floating accent labels */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute top-4 right-0 hidden md:flex items-center gap-2 backdrop-blur-md bg-black/60 border border-border rounded-full px-3 py-1.5 text-[10px] font-mono-d text-muted-foreground"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            CLAUDE · classifying 247 emails/sec
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
