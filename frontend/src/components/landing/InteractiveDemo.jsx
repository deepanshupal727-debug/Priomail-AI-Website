import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Mail, Skull, Trash2, Bell, Sparkles } from "lucide-react";

const BUCKETS = [
  { id: "critical", label: "CRITICAL", color: "#FF3B30", icon: AlertTriangle },
  { id: "urgent", label: "URGENT", color: "#F59E0B", icon: Bell },
  { id: "normal", label: "NORMAL", color: "#3B82F6", icon: Mail },
  { id: "spam", label: "SPAM", color: "#525252", icon: Trash2 },
  { id: "phishing", label: "PHISHING", color: "#991B1B", icon: Skull },
];

const SAMPLE_EMAILS = [
  { sender: "CFO @ Stripe", subject: "Wire approval — $1.2M due 5pm", bucket: "critical" },
  { sender: "OpenAI", subject: "API key rotated successfully", bucket: "normal" },
  { sender: "support@paypa1.co", subject: "Suspended! Click immediately", bucket: "phishing" },
  { sender: "Linear", subject: "Sprint review reminder, Tue 10am", bucket: "urgent" },
  { sender: "newsletter@hacker", subject: "🔥 50% off crypto course!!", bucket: "spam" },
  { sender: "Cofounder", subject: "Investor wants updated deck tonight", bucket: "critical" },
  { sender: "GitHub", subject: "Your weekly digest is ready", bucket: "normal" },
  { sender: "AWS Billing", subject: "Invoice due in 3 days", bucket: "urgent" },
];

export default function InteractiveDemo() {
  const [index, setIndex] = useState(0);
  const [sorted, setSorted] = useState({});

  useEffect(() => {
    if (index >= SAMPLE_EMAILS.length) {
      const t = setTimeout(() => {
        setSorted({});
        setIndex(0);
      }, 3000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      const email = SAMPLE_EMAILS[index];
      setSorted((prev) => ({
        ...prev,
        [email.bucket]: [...(prev[email.bucket] || []), email],
      }));
      setIndex((i) => i + 1);
    }, 1100);
    return () => clearTimeout(t);
  }, [index]);

  const current = SAMPLE_EMAILS[index];

  return (
    <section id="demo" className="relative py-24 md:py-32" data-testid="interactive-demo">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-bold text-primary mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Live demo
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95]">
            Watch our AI sort<br />real emails<span className="text-primary">.</span> Live.
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl">
            Every message flows through our priority pipeline in under 400ms. No more inbox dread — just five clean buckets.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-4">
          {/* Incoming stream */}
          <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-5 lg:h-[400px] flex flex-col" data-testid="demo-incoming">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">Incoming</div>
                <div className="font-display text-xl">Inbox stream</div>
              </div>
              <div className="text-[10px] font-mono-d text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {current ? (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -40, scale: 0.9, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.4 }}
                    className="w-full bg-[#0f0c18] border border-white/10 rounded-xl p-4"
                  >
                    <div className="text-[10px] text-muted-foreground font-mono-d truncate mb-1">{current.sender}</div>
                    <div className="text-sm font-bold truncate">{current.subject}</div>
                    <div className="mt-3 flex items-center gap-2 text-[10px] text-primary font-bold">
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      AI analyzing...
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-xs text-muted-foreground text-center">
                    <Sparkles className="w-6 h-6 mx-auto mb-2 text-primary" />
                    Resetting demo...
                  </div>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-4 text-[10px] font-mono-d text-muted-foreground">
              Processed: {Object.values(sorted).flat().length} / {SAMPLE_EMAILS.length}
            </div>
          </div>

          {/* Buckets */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {BUCKETS.map((b) => (
              <div
                key={b.id}
                className="bg-card border border-border rounded-xl p-3 lg:h-[400px] flex flex-col"
                data-testid={`demo-bucket-${b.id}`}
              >
                <div
                  className="flex items-center gap-1 text-[9px] font-black tracking-[0.12em] px-2 py-1 rounded-full mb-3 self-start"
                  style={{
                    background: `${b.color}1A`,
                    color: b.color,
                    border: `1px solid ${b.color}40`,
                  }}
                >
                  <b.icon className="w-2.5 h-2.5" />
                  {b.label}
                </div>
                <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
                  <AnimatePresence>
                    {(sorted[b.id] || []).map((email, i) => (
                      <motion.div
                        key={`${b.id}-${i}`}
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="bg-[#0f0c18] border border-white/5 rounded-md p-2"
                      >
                        <div className="text-[9px] text-muted-foreground truncate font-mono-d">{email.sender}</div>
                        <div className="text-[10px] font-semibold truncate leading-tight">{email.subject}</div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="text-[9px] font-mono-d text-muted-foreground mt-2">
                  {(sorted[b.id] || []).length} mails
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
