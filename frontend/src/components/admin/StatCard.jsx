export default function StatCard({ label, value, sublabel, icon: Icon, accent = "primary" }) {
  const accentColor =
    accent === "primary"
      ? "text-primary border-primary/30 bg-primary/5"
      : accent === "success"
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/5"
      : accent === "warning"
      ? "text-amber-400 border-amber-500/30 bg-amber-500/5"
      : "text-violet-400 border-violet-500/30 bg-violet-500/5";

  return (
    <div
      className="relative rounded-2xl border border-border bg-card p-5 overflow-hidden group hover:border-primary/40 transition-all"
      data-testid={`stat-card-${label.toLowerCase().replace(/\s/g, "-")}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">{label}</p>
          <p className="font-display text-3xl mt-2 tracking-tight">{value}</p>
          {sublabel && <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${accentColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
