import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { couponsApi } from "@/lib/api";
import { Plus, Copy, Trash2, Check, Power, Ticket, Calendar, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discount_type: "percent",
    discount_value: 10,
    max_uses: "",
    valid_until: "",
    active: true,
  });
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await couponsApi.list();
      setCoupons(data);
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        code: form.code.trim() || undefined,
        description: form.description,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        max_uses: form.max_uses === "" ? null : Number(form.max_uses),
        valid_until: form.valid_until ? new Date(form.valid_until).toISOString() : null,
        active: form.active,
      };
      const created = await couponsApi.create(payload);
      toast.success(`Coupon ${created.code} created`);
      setForm({ code: "", description: "", discount_type: "percent", discount_value: 10, max_uses: "", valid_until: "", active: true });
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to create coupon");
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (code, active) => {
    try {
      await couponsApi.update(code, { active: !active });
      load();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (code) => {
    if (!window.confirm(`Delete coupon ${code}?`)) return;
    try {
      await couponsApi.remove(code);
      toast.success("Coupon deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success("Coupon code copied");
    setTimeout(() => setCopied(""), 2000);
  };

  const formatDiscount = (c) =>
    c.discount_type === "percent" ? `${c.discount_value}% off` : `$${c.discount_value} off`;

  const formatDate = (d) => {
    if (!d) return "No expiry";
    const dt = new Date(d);
    return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  const isExpired = (d) => d && new Date(d) < new Date();

  return (
    <AdminLayout
      title="Coupons"
      subtitle="Launch limited-time discount codes for campaigns, partnerships, and customer wins."
      actions={
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 text-sm font-bold bg-primary text-primary-foreground rounded-full px-5 py-2.5 hover:bg-primary/90 transition-all hover:-translate-y-0.5"
          data-testid="new-coupon-btn"
        >
          <Plus className="w-4 h-4" />
          New Coupon
        </button>
      }
    >
      {showForm && (
        <form onSubmit={handleCreate} className="mb-8 rounded-2xl border border-border bg-card p-6" data-testid="coupon-create-form">
          <h3 className="font-display text-xl tracking-tight mb-4">Create new coupon</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Code (optional)" hint="Leave empty to auto-generate (SAVE…)">
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="LAUNCH50"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60 uppercase font-mono"
                data-testid="input-coupon-code"
              />
            </Field>
            <Field label="Description">
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Black Friday 2025 — 50% off Pro"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60"
                data-testid="input-coupon-description"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Type">
                <select
                  value={form.discount_type}
                  onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60"
                  data-testid="select-discount-type"
                >
                  <option value="percent">% Percent</option>
                  <option value="fixed">$ Fixed</option>
                </select>
              </Field>
              <Field label="Value">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.discount_value}
                  onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60"
                  data-testid="input-discount-value"
                  required
                />
              </Field>
            </div>
            <Field label="Max Uses" hint="Leave empty for unlimited">
              <input
                type="number"
                min="1"
                value={form.max_uses}
                onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                placeholder="100"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60"
                data-testid="input-max-uses"
              />
            </Field>
            <Field label="Valid Until" hint="Leave empty for no expiry">
              <input
                type="datetime-local"
                value={form.valid_until}
                onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60"
                data-testid="input-valid-until"
              />
            </Field>
            <Field label="Status" className="md:col-span-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">Active immediately</span>
              </label>
            </Field>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <button
              type="submit"
              disabled={creating}
              className="text-sm font-bold bg-primary text-primary-foreground rounded-full px-5 py-2.5 hover:bg-primary/90 disabled:opacity-50"
              data-testid="submit-create-coupon"
            >
              {creating ? "Creating…" : "Create coupon"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-muted-foreground hover:text-foreground px-3 py-2.5">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl border border-border bg-card animate-pulse" />)}
        </div>
      ) : coupons.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-display text-xl tracking-tight">No coupons yet</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-5">Spin up your first discount code to boost conversions.</p>
          <button onClick={() => setShowForm(true)} className="text-sm font-bold bg-primary text-primary-foreground rounded-full px-5 py-2.5 hover:bg-primary/90">
            Create coupon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="coupon-list">
          {coupons.map((c) => {
            const expired = isExpired(c.valid_until);
            const exhausted = c.max_uses != null && c.current_uses >= c.max_uses;
            const usagePct = c.max_uses ? Math.min(100, (c.current_uses / c.max_uses) * 100) : 0;
            return (
              <div
                key={c.id}
                className={`relative rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 ${!c.active || expired || exhausted ? "opacity-70" : ""}`}
                data-testid={`coupon-row-${c.code}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="font-display text-2xl tracking-tight text-primary">{c.code}</code>
                      <button
                        onClick={() => copyCode(c.code)}
                        className="p-1.5 rounded-md border border-border hover:border-primary/60 transition-colors"
                        data-testid={`copy-coupon-${c.code}`}
                        title="Copy code"
                      >
                        {copied === c.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-sm font-bold text-foreground">{formatDiscount(c)}</span>
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${expired ? "border-red-500/40 text-red-400 bg-red-500/10" : exhausted ? "border-amber-500/40 text-amber-400 bg-amber-500/10" : c.active ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" : "border-muted-foreground/30 text-muted-foreground"}`}>
                        {expired ? "Expired" : exhausted ? "Maxed" : c.active ? "Active" : "Paused"}
                      </span>
                    </div>
                    {c.description && <p className="text-sm text-muted-foreground mt-2">{c.description}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggle(c.code, c.active)}
                      className="p-2 rounded-lg border border-border hover:border-primary/60 hover:text-primary transition-colors"
                      title={c.active ? "Pause" : "Activate"}
                      data-testid={`toggle-coupon-${c.code}`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.code)}
                      className="p-2 rounded-lg border border-border hover:border-red-500/60 hover:text-red-400 transition-colors"
                      title="Delete"
                      data-testid={`delete-coupon-${c.code}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <UsersIcon className="w-3.5 h-3.5" />
                    <span>{c.current_uses}{c.max_uses ? ` / ${c.max_uses}` : ""} used</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(c.valid_until)}</span>
                  </div>
                </div>
                {c.max_uses && (
                  <div className="mt-3 h-1 rounded-full bg-background overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${usagePct}%` }} />
                  </div>
                )}
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
