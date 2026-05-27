import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/admin/StatCard";
import { adminApi } from "@/lib/api";
import { Users, MousePointerClick, UserPlus, ShoppingBag, Ticket, CheckCircle, DollarSign, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    adminApi
      .stats()
      .then((d) => mounted && setStats(d))
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AdminLayout
      title="Overview"
      subtitle="Real-time growth metrics from your referral program and coupon campaigns."
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Referrals</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total Codes" value={stats?.referrals?.total ?? 0} sublabel={`${stats?.referrals?.active ?? 0} active`} icon={Users} accent="primary" />
            <StatCard label="Clicks" value={stats?.referrals?.clicks ?? 0} icon={MousePointerClick} accent="violet" />
            <StatCard label="Sign-ups" value={stats?.referrals?.signups ?? 0} icon={UserPlus} accent="primary" />
            <StatCard label="Conversions" value={stats?.referrals?.conversions ?? 0} sublabel={`$${(stats?.referrals?.revenue ?? 0).toFixed(2)} revenue`} icon={ShoppingBag} accent="success" />
          </div>

          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Coupons</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total Coupons" value={stats?.coupons?.total ?? 0} sublabel={`${stats?.coupons?.active ?? 0} active`} icon={Ticket} accent="primary" />
            <StatCard label="Redemptions" value={stats?.coupons?.redemptions ?? 0} icon={CheckCircle} accent="success" />
            <StatCard label="Total Revenue" value={`$${(stats?.referrals?.revenue ?? 0).toFixed(2)}`} sublabel="From referrals" icon={DollarSign} accent="warning" />
            <StatCard label="Conversion Rate" value={`${stats?.referrals?.clicks ? Math.round((stats.referrals.conversions / stats.referrals.clicks) * 100) : 0}%`} sublabel="Click → Convert" icon={Sparkles} accent="violet" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/admin/referrals")}
              className="group relative rounded-2xl border border-border bg-card hover:border-primary/40 p-6 text-left transition-all overflow-hidden"
              data-testid="quick-link-referrals"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Users className="w-7 h-7 text-primary mb-4" />
              <h3 className="font-display text-xl tracking-tight mb-1">Manage Referrals</h3>
              <p className="text-sm text-muted-foreground">Create new referral codes, track clicks &amp; conversions, set custom rewards.</p>
            </button>
            <button
              onClick={() => navigate("/admin/coupons")}
              className="group relative rounded-2xl border border-border bg-card hover:border-primary/40 p-6 text-left transition-all overflow-hidden"
              data-testid="quick-link-coupons"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Ticket className="w-7 h-7 text-primary mb-4" />
              <h3 className="font-display text-xl tracking-tight mb-1">Manage Coupons</h3>
              <p className="text-sm text-muted-foreground">Launch discount codes, set usage limits &amp; expiry dates, monitor redemptions.</p>
            </button>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
