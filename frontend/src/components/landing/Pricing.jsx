import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    tagline: "Try the magic.",
    monthly: 0,
    annual: 0,
    cta: "Start free",
    features: [
      "1 connected inbox",
      "AI classification (100 emails/day)",
      "Basic phishing detection",
      "Email digest (weekly)",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For founders & operators.",
    monthly: 249,
    annual: 2490, // 2 months free
    cta: "Go Pro",
    highlight: true,
    badge: "Most popular",
    features: [
      "3 connected inboxes",
      "Unlimited AI classification",
      "Alarm-style critical alerts",
      "AI auto-draft replies",
      "Phishing radar (advanced)",
      "Monthly health report",
    ],
  },
  {
    id: "team",
    name: "Team",
    tagline: "Scale across your org.",
    monthly: 499,
    annual: 4990,
    cta: "Start team trial",
    features: [
      "10 connected inboxes",
      "Team-wide priority rules",
      "Shared analytics dashboard",
      "Admin & audit logs",
      "Priority support",
      "Slack integration",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Custom-built for scale.",
    monthly: null,
    annual: null,
    cta: "Contact sales",
    features: [
      "Unlimited inboxes",
      "SSO / SAML",
      "Dedicated AI tuning",
      "On-prem deployment option",
      "99.99% SLA",
      "Personal success manager",
    ],
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="relative py-24 md:py-32" data-testid="pricing">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-bold text-primary mb-4 justify-center">
            <Sparkles className="w-3.5 h-3.5" /> Pricing
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95]">
            Pay for clarity<span className="text-primary">.</span><br />
            Not for noise.
          </h2>
          <p className="mt-5 text-muted-foreground">
            14-day free trial on every paid plan. Annual = 2 months free.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center gap-1 p-1 bg-card border border-border rounded-full" data-testid="pricing-toggle">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 text-xs font-bold rounded-full transition-all ${!annual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              data-testid="toggle-monthly"
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-2 ${annual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              data-testid="toggle-annual"
            >
              Annual
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${annual ? "bg-white/20" : "bg-emerald-500/20 text-emerald-400"}`}>
                2 MONTHS FREE
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((plan, i) => {
            const price = plan.monthly === null ? null : annual ? plan.annual : plan.monthly;
            const period = plan.monthly === null ? "" : annual ? "/yr" : "/mo";

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`relative rounded-2xl p-7 flex flex-col ${
                  plan.highlight
                    ? "tracing-beam bg-card glow-red"
                    : "bg-card border border-border hover:border-white/20"
                } transition-colors`}
                data-testid={`pricing-${plan.id}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[9px] font-black tracking-[0.2em] px-3 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <div className="font-display text-2xl tracking-tight mb-1">{plan.name}</div>
                  <div className="text-xs text-muted-foreground">{plan.tagline}</div>
                </div>

                <div className="mb-6 min-h-[70px]">
                  {price === null ? (
                    <div className="font-display text-4xl tracking-tighter">Let's talk</div>
                  ) : price === 0 ? (
                    <div className="font-display text-5xl tracking-tighter">₹0</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-5xl tracking-tighter">₹{price.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">{period}</span>
                    </div>
                  )}
                  {annual && plan.monthly > 0 && (
                    <div className="text-[10px] font-mono-d text-emerald-400 mt-1">
                      ≈ ₹{Math.round(plan.annual / 12).toLocaleString()}/mo billed yearly
                    </div>
                  )}
                </div>

                <a
                  href="https://priomailai.in/register"
                  className={`flex items-center justify-center gap-2 w-full rounded-full px-5 py-3 font-bold text-sm transition-all hover:-translate-y-0.5 ${
                    plan.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary border border-border text-foreground hover:bg-accent"
                  }`}
                  data-testid={`pricing-${plan.id}-cta`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </a>

                <div className="mt-7 pt-7 border-t border-border space-y-3">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? "text-primary" : "text-foreground"}`} />
                      <span className="text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
