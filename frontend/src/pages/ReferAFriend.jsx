import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Gift, Sparkles, Copy, Check, Twitter, MessageCircle, Mail, ArrowLeft, MousePointerClick, UserPlus, ShoppingBag, CalendarCheck, Search } from "lucide-react";
import { toast } from "sonner";
import { referralsApi } from "@/lib/api";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function ReferAFriend() {
  const navigate = useNavigate();
  const [step, setStep] = useState("form"); // form | success
  const [form, setForm] = useState({ owner_name: "", owner_email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [referral, setReferral] = useState(null); // { code, stats }
  const [copied, setCopied] = useState(false);
  const [lookupCode, setLookupCode] = useState("");
  const [lookingUp, setLookingUp] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = referral ? `${origin}/r/${referral.code}` : "";
  const shareMessage = `Hey — I use PrioMail AI to keep my inbox sane. Sign up with my link and you'll get 10% off Pro: ${link}`;

  // If user already has a code stored locally, show it
  useEffect(() => {
    try {
      const saved = localStorage.getItem("priomail_my_referral");
      if (saved) {
        referralsApi
          .get(saved)
          .then((r) => {
            setReferral(r);
            setStep("success");
          })
          .catch(() => localStorage.removeItem("priomail_my_referral"));
      }
    } catch {}
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.owner_name.trim() || !form.owner_email.trim() || !form.owner_email.includes("@")) {
      toast.error("Enter a valid name and email");
      return;
    }
    setSubmitting(true);
    try {
      const created = await referralsApi.create({
        owner_name: form.owner_name.trim(),
        owner_email: form.owner_email.trim().toLowerCase(),
        reward_type: "month",
        reward_value: 1,
        notes: "Public Refer-a-Friend page",
      });
      const full = await referralsApi.get(created.code);
      setReferral(full);
      setStep("success");
      try { localStorage.setItem("priomail_my_referral", created.code); } catch {}
      toast.success("Your referral link is ready!");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not create your referral. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    const code = lookupCode.trim().toUpperCase();
    if (!code) return;
    setLookingUp(true);
    try {
      const r = await referralsApi.get(code);
      setReferral(r);
      setStep("success");
      try { localStorage.setItem("priomail_my_referral", code); } catch {}
      toast.success(`Welcome back, ${r.owner_name?.split(" ")[0] || "friend"}!`);
    } catch {
      toast.error("Referral code not found");
    } finally {
      setLookingUp(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Referral link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const startOver = () => {
    try { localStorage.removeItem("priomail_my_referral"); } catch {}
    setReferral(null);
    setStep("form");
    setForm({ owner_name: "", owner_email: "" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" data-testid="refer-page-root">
      <Header />

      <main className="pt-32 md:pt-40 pb-20">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-bold text-primary mb-4">
              <Gift className="w-3.5 h-3.5" /> Refer & Earn
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95]" data-testid="refer-heading">
              Send a friend.<br />
              <span className="text-primary text-glow-red">Get a free month.</span>
            </h1>
            <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
              Share your link. They get <span className="text-foreground font-bold">10% off Pro</span> for life-of-trial. You get <span className="text-foreground font-bold">1 month of Pro free</span> for every friend who upgrades.
            </p>
          </motion.div>

          {/* Reward cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <RewardCard
              icon={Gift}
              accent="primary"
              eyebrow="For you"
              title="1 month of Pro — free"
              subtitle="Credited automatically when a friend you referred subscribes to Pro. Stack referrals to extend your free months indefinitely."
            />
            <RewardCard
              icon={Sparkles}
              accent="emerald"
              eyebrow="For your friend"
              title="10% off Pro plan"
              subtitle="Auto-applied at checkout when they sign up through your referral link. No code required — works for both monthly and annual."
            />
          </div>

          {step === "form" ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-2xl border border-border bg-card p-6 md:p-10 max-w-2xl mx-auto"
              data-testid="refer-form-card"
            >
              <h2 className="font-display text-2xl tracking-tight mb-1">Create your referral link</h2>
              <p className="text-sm text-muted-foreground mb-6">Takes 10 seconds. We'll email you when a friend converts.</p>

              <form onSubmit={handleSubmit} className="space-y-4" data-testid="refer-form">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium block mb-1.5">Your name</label>
                  <input
                    value={form.owner_name}
                    onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    data-testid="refer-input-name"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium block mb-1.5">Your email</label>
                  <input
                    type="email"
                    value={form.owner_email}
                    onChange={(e) => setForm({ ...form, owner_email: e.target.value })}
                    placeholder="jane@company.com"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    data-testid="refer-input-email"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground/70 mt-1.5">We only use this to credit your reward and notify you of conversions.</p>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold bg-primary text-primary-foreground rounded-full px-5 py-3.5 hover:bg-primary/90 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                  data-testid="refer-submit"
                >
                  {submitting ? "Creating your link…" : "Generate my referral link"}
                  <Gift className="w-4 h-4" />
                </button>
              </form>

              {/* Lookup existing code */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">Already have a code?</p>
                <form onSubmit={handleLookup} className="flex gap-2" data-testid="refer-lookup-form">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      value={lookupCode}
                      onChange={(e) => setLookupCode(e.target.value.toUpperCase())}
                      placeholder="Enter your code (e.g. JANE2025)"
                      className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 uppercase font-mono"
                      data-testid="refer-lookup-input"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={lookingUp || !lookupCode.trim()}
                    className="text-sm font-bold bg-secondary border border-border text-foreground rounded-lg px-4 py-2.5 hover:bg-accent transition-all disabled:opacity-50"
                    data-testid="refer-lookup-submit"
                  >
                    {lookingUp ? "Looking…" : "Look up"}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <SuccessCard
              referral={referral}
              link={link}
              shareMessage={shareMessage}
              copied={copied}
              onCopy={copyLink}
              onStartOver={startOver}
            />
          )}

          {/* How it works */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-5 text-center">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StepCard num="1" title="Share your link" body="Copy your unique link and send it via WhatsApp, email, X, Slack — wherever your friends hang out." />
              <StepCard num="2" title="They get 10% off" body="When your friend lands on PrioMail through your link, their Pro plan is automatically discounted by 10%." />
              <StepCard num="3" title="You earn a free month" body="The moment they subscribe to Pro, 1 month of Pro is credited to your account. Stack referrals to go free forever." />
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="refer-back-home"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function RewardCard({ icon: Icon, accent, eyebrow, title, subtitle }) {
  const accentMap = {
    primary: "text-primary border-primary/30 bg-primary/5",
    emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
  };
  return (
    <div className="relative rounded-2xl border border-border bg-card p-6 overflow-hidden group hover:border-primary/40 transition-all" data-testid={`reward-card-${eyebrow.toLowerCase().replace(/\s/g, "-")}`}>
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${accentMap[accent]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">{eyebrow}</p>
          <h3 className="font-display text-xl tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{subtitle}</p>
        </div>
      </div>
      <div className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

function StepCard({ num, title, body }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5" data-testid={`step-${num}`}>
      <div className="font-display text-3xl tracking-tighter text-primary mb-2">{num}</div>
      <div className="font-bold text-foreground mb-1">{title}</div>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

function SuccessCard({ referral, link, shareMessage, copied, onCopy, onStartOver }) {
  const stats = referral?.stats || { clicks: 0, signups: 0, conversions: 0, reward_earned: 0 };
  const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
  const mailto = `mailto:?subject=${encodeURIComponent("Try PrioMail AI — 10% off via my link")}&body=${encodeURIComponent(shareMessage)}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
      data-testid="refer-success-card"
    >
      <div className="rounded-2xl border border-primary/30 bg-card p-6 md:p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-[10px] font-bold tracking-widest uppercase mb-4">
            <Check className="w-3 h-3" /> Your link is live
          </div>
          <h2 className="font-display text-3xl tracking-tight mb-1" data-testid="refer-success-name">
            Welcome, {referral?.owner_name?.split(" ")[0] || "friend"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Code <span className="font-mono text-primary font-bold">{referral?.code}</span> · Send the link below to any friend.
          </p>

          {/* Link */}
          <div className="flex items-center gap-2 mb-3" data-testid="refer-link-row">
            <code className="flex-1 text-sm bg-background border border-border rounded-lg px-4 py-3 truncate font-mono">{link}</code>
            <button
              onClick={onCopy}
              className="shrink-0 inline-flex items-center gap-2 text-sm font-bold bg-primary text-primary-foreground rounded-lg px-4 py-3 hover:bg-primary/90 transition-all"
              data-testid="refer-copy-link"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {/* Share */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <ShareButton href={twitter} icon={Twitter} label="X / Twitter" testid="share-twitter" />
            <ShareButton href={whatsapp} icon={MessageCircle} label="WhatsApp" testid="share-whatsapp" />
            <ShareButton href={mailto} icon={Mail} label="Email" testid="share-email" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 pt-6 border-t border-border" data-testid="refer-stats">
            <Stat icon={MousePointerClick} label="Clicks" value={stats.clicks} />
            <Stat icon={UserPlus} label="Sign-ups" value={stats.signups} />
            <Stat icon={ShoppingBag} label="Converted" value={stats.conversions} />
            <Stat icon={CalendarCheck} label="Free months" value={stats.reward_earned} />
          </div>

          <button
            onClick={onStartOver}
            className="mt-6 text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-testid="refer-start-over"
          >
            Use a different account →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ShareButton({ href, icon: Icon, label, testid }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 text-sm font-medium bg-secondary border border-border rounded-lg px-3 py-2.5 hover:border-primary/60 hover:text-primary transition-all"
      data-testid={testid}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="text-center">
      <Icon className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1.5" />
      <div className="font-display text-2xl leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
