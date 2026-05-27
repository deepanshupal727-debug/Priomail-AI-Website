import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { referralsApi } from "@/lib/api";
import { Plus, Copy, Trash2, Check, X, Power, ExternalLink, MousePointerClick, UserPlus, ShoppingBag, DollarSign } from "lucide-react";
import { toast } from "sonner";

const REWARD_TYPES = [
  { value: "percent", label: "% Commission" },
  { value: "fixed", label: "$ Fixed / Conv." },
  { value: "month", label: "Free Months" },
  { value: "credit", label: "Account Credit" },
];

export default function AdminReferrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    owner_name: "",
    owner_email: "",
    code: "",
    reward_type: "percent",
    reward_value: 20,
    notes: "",
  });
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState("");

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const load = async () => {
    setLoading(true);
    try {
      const data = await referralsApi.list();
      setReferrals(data);
    } catch (e) {
      toast.error("Failed to load referrals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.owner_name || !form.owner_email) {
      toast.error("Name and email are required");
      return;
    }
    setCreating(true);
    try {
      const created = await referralsApi.create({
        ...form,
        reward_value: Number(form.reward_value),
        code: form.code.trim() || undefined,
      });
      toast.success(`Referral code ${created.code} created`);
      setForm({ owner_name: "", owner_email: "", code: "", reward_type: "percent", reward_value: 20, notes: "" });
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to create referral");
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (code, active) => {
    try {
      await referralsApi.update(code, { active: !active });
      toast.success(`Referral ${active ? "paused" : "activated"}`);
      load();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (code) => {
    if (!window.confirm(`Delete referral code ${code}? This will also remove all its events.`)) return;
    try {
      await referralsApi.remove(code);
      toast.success("Referral deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const copyLink = (code) => {
    const link = `${origin}/r/${code}`;
    navigator.clipboard.writeText(link);
    setCopied(code);
    toast.success("Referral link copied");
    setTimeout(() => setCopied(""), 2000);
  };

  const formatReward = (r) => {
    if (r.reward_type === "percent") return `${r.reward_value}% per sale`;
    if (r.reward_type === "fixed") return `$${r.reward_value} per conversion`;
    if (r.reward_type === "month") return `${r.reward_value} free month(s)`;
    return `${r.reward_value} credits`;
  };

  return (
    <AdminLayout
      title="Referrals"
      subtitle="Create unique referral codes, share trackable links, and reward your top advocates."
      actions={
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 text-sm font-bold bg-primary text-primary-foreground rounded-full px-5 py-2.5 hover:bg-primary/90 transition-all hover:-translate-y-0.5"
          data-testid="new-referral-btn"
        >
          <Plus className="w-4 h-4" />
          New Referral
        </button>
      }
    >
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-8 rounded-2xl border border-border bg-card p-6"
          data-testid="referral-create-form"
        >
          <h3 className="font-display text-xl tracking-tight mb-4">Create new referral</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Owner Name *">
              <input
                value={form.owner_name}
                onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
                placeholder="Jane Doe"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                data-testid="input-owner-name"
                required
              />
            </Field>
            <Field label="Owner Email *">
              <input
                type="email"
                value={form.owner_email}
                onChange={(e) => setForm({ ...form, owner_email: e.target.value })}
                placeholder="jane@company.com"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60"
                data-testid="input-owner-email"
                required
              />
            </Field>
            <Field label="Custom Code (optional)" hint="Leave empty to auto-generate">
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="JANE2025"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 uppercase"
                data-testid="input-custom-code"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Reward Type">
                <select
                  value={form.reward_type}
                  onChange={(e) => setForm({ ...form, reward_type: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60"
                  data-testid="select-reward-type"
                >
                  {REWARD_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Reward Value">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.reward_value}
                  onChange={(e) => setForm({ ...form, reward_value: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60"
                  data-testid="input-reward-value"
                />
              </Field>
            </div>
            <Field label="Notes" className="md:col-span-2">
              <input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Friends & family · Influencer campaign · Q4 push…"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60"
                data-testid="input-notes"
              />
            </Field>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <button
              type="submit"
              disabled={creating}
              className="text-sm font-bold bg-primary text-primary-foreground rounded-full px-5 py-2.5 hover:bg-primary/90 disabled:opacity-50"
              data-testid="submit-create-referral"
            >
              {creating ? "Creating…" : "Create referral"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-muted-foreground hover:text-foreground px-3 py-2.5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      ) : referrals.length === 0 ? (
        <EmptyState
          title="No referrals yet"
          subtitle="Create your first referral code to start tracking advocates."
          onAction={() => setShowForm(true)}
          actionLabel="Create referral"
        />
      ) : (
        <div className="space-y-3" data-testid="referral-list">
          {referrals.map((r) => {
            const link = `${origin}/r/${r.code}`;
            return (
              <div
                key={r.id}
                className={`rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 ${!r.active ? "opacity-60" : ""}`}
                data-testid={`referral-row-${r.code}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-display text-2xl tracking-tight">{r.code}</span>
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${r.active ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" : "border-muted-foreground/30 text-muted-foreground"}`}>
                        {r.active ? "Active" : "Paused"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {r.owner_name} · <span className="text-foreground/70">{r.owner_email}</span>
                    </p>
                    <p className="text-xs text-primary mt-1">Reward: {formatReward(r)}</p>
                    {r.notes && <p className="text-xs text-muted-foreground/80 mt-1 italic">{r.notes}</p>}
                    <div className="flex items-center gap-2 mt-3 max-w-md">
                      <code className="flex-1 text-xs bg-background border border-border rounded-lg px-3 py-2 truncate">{link}</code>
                      <button
                        onClick={() => copyLink(r.code)}
                        className="shrink-0 p-2 rounded-lg border border-border hover:border-primary/60 hover:text-primary transition-colors"
                        data-testid={`copy-link-${r.code}`}
                        title="Copy link"
                      >
                        {copied === r.code ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 p-2 rounded-lg border border-border hover:border-primary/60 hover:text-primary transition-colors"
                        title="Open"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 lg:gap-4 lg:min-w-[420px]">
                    <Metric icon={MousePointerClick} label="Clicks" value={r.stats.clicks} />
                    <Metric icon={UserPlus} label="Signups" value={r.stats.signups} />
                    <Metric icon={ShoppingBag} label="Conv." value={r.stats.conversions} />
                    <Metric icon={DollarSign} label="Earned" value={r.reward_type === "percent" || r.reward_type === "fixed" ? `$${r.stats.reward_earned.toFixed(0)}` : r.stats.reward_earned} />
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggle(r.code, r.active)}
                      className="p-2 rounded-lg border border-border hover:border-primary/60 hover:text-primary transition-colors"
                      title={r.active ? "Pause" : "Activate"}
                      data-testid={`toggle-${r.code}`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.code)}
                      className="p-2 rounded-lg border border-border hover:border-red-500/60 hover:text-red-400 transition-colors"
                      title="Delete"
                      data-testid={`delete-${r.code}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}

function Field({ label, hint, children, className = "" }) {
  return (
    <div className={className}>
      <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium block mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground/70 mt-1">{hint}</p>}
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3 text-center">
      <Icon className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1" />
      <div className="font-display text-lg leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function EmptyState({ title, subtitle, onAction, actionLabel }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
        <Plus className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-display text-xl tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-5">{subtitle}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="text-sm font-bold bg-primary text-primary-foreground rounded-full px-5 py-2.5 hover:bg-primary/90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
