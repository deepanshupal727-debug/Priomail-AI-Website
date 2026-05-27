import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, Tag, Loader2, X } from "lucide-react";
import { couponsApi } from "@/lib/api";
import { toast } from "sonner";

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
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null); // { code, discount_type, discount_value, description }
  const [validating, setValidating] = useState(false);

  const applyCoupon = async (e) => {
    e?.preventDefault?.();
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      toast.error("Enter a coupon code");
      return;
    }
    setValidating(true);
    try {
      const res = await couponsApi.validate(code);
      if (res.valid) {
        setCoupon(res);
        toast.success(`Coupon applied: ${res.code}`);
      } else {
        setCoupon(null);
        toast.error(res.reason || "Invalid coupon");
      }
    } catch {
      toast.error("Could not validate coupon. Try again.");
    } finally {
      setValidating(false);
    }
  };

  const clearCoupon = () => {
    setCoupon(null);
    setCouponInput("");
  };

  const applyDiscount = (price) => {
    if (price == null || price === 0 || !coupon) return price;
    if (coupon.discount_type === "percent") {
      return Math.max(0, Math.round(price - (price * coupon.discount_value) / 100));
    }
    return Math.max(0, Math.round(price - coupon.discount_value));
  };

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

          {/* Coupon code */}
          <div className="mt-6 flex justify-center" data-testid="coupon-block">
            {coupon ? (
              <div
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs font-bold"
                data-testid="coupon-applied"
              >
                <Tag className="w-3.5 h-3.5" />
                <span className="font-mono tracking-wider">{coupon.code}</span>
                <span className="text-emerald-200/80 font-medium">
                  {coupon.discount_type === "percent" ? `${coupon.discount_value}% off` : `₹${coupon.discount_value} off`}
                </span>
                <button
                  type="button"
                  onClick={clearCoupon}
                  className="ml-1 p-1 rounded-full hover:bg-emerald-500/20 transition-colors"
                  data-testid="coupon-clear"
                  aria-label="Remove coupon"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <form
                onSubmit={applyCoupon}
                className="flex items-center gap-2 bg-card border border-border rounded-full p-1 pl-4"
                data-testid="coupon-form"
              >
                <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Have a coupon? Enter code"
                  className="bg-transparent text-xs font-mono tracking-wider focus:outline-none placeholder:text-muted-foreground/70 w-44 sm:w-56 uppercase"
                  data-testid="coupon-input"
                  maxLength={32}
                />
                <button
                  type="submit"
                  disabled={validating || !couponInput.trim()}
                  className="text-[11px] font-bold bg-primary text-primary-foreground rounded-full px-4 py-2 hover:bg-primary/90 transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
                  data-testid="coupon-apply"
                >
                  {validating ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                  Apply
                </button>
              </form>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((plan, i) => {
            const basePrice = plan.monthly === null ? null : annual ? plan.annual : plan.monthly;
            const price = basePrice;
            const discounted = applyDiscount(price);
            const hasDiscount = coupon && price != null && price > 0 && discounted < price;
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
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-display text-5xl tracking-tighter" data-testid={`pricing-${plan.id}-price`}>
                          ₹{(hasDiscount ? discounted : price).toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">{period}</span>
                        {hasDiscount && (
                          <span className="text-sm text-muted-foreground/70 line-through" data-testid={`pricing-${plan.id}-original`}>
                            ₹{price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {hasDiscount && (
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-emerald-400" data-testid={`pricing-${plan.id}-discount-badge`}>
                          <Tag className="w-3 h-3" />
                          {coupon.code} applied
                        </div>
                      )}
                    </div>
                  )}
                  {annual && plan.monthly > 0 && !hasDiscount && (
                    <div className="text-[10px] font-mono-d text-emerald-400 mt-1">
                      ≈ ₹{Math.round(plan.annual / 12).toLocaleString()}/mo billed yearly
                    </div>
                  )}
                </div>

              <a
                href={coupon ? `https://priomailai.in/register?coupon=${encodeURIComponent(coupon.code)}` : "https://priomailai.in/register"}
                className={`flex items-center justify-center gap-2 w-full rounded-full px-5 py-3 font-bold text-sm transition-all hover:-translate-y-0.5 ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_8px_24px_-8px_rgba(167,139,250,0.7)]"
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
