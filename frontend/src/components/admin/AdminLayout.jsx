import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Ticket, ArrowLeft } from "lucide-react";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/referrals", label: "Referrals", icon: Users },
  { to: "/admin/coupons", label: "Coupons", icon: Ticket },
];

export default function AdminLayout({ children, title, subtitle, actions }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-64 border-r border-border bg-[#0c0814] z-40 hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 group"
            data-testid="admin-logo-link"
          >
            <img
              src="/priomail-icon-white-chip.svg"
              alt="PrioMail AI"
              className="w-9 h-9 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col items-start">
              <span className="font-display text-base tracking-tight leading-none">PrioMail AI</span>
              <span className="text-[10px] uppercase tracking-widest text-primary mt-0.5">Admin</span>
            </div>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`
                }
                data-testid={`admin-nav-${item.label.toLowerCase()}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
            data-testid="admin-back-home"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to site
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 bg-[#0c0814] border-b border-border px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <img src="/priomail-icon-white-chip.svg" alt="PrioMail" className="w-7 h-7" />
          <span className="font-display text-sm">PrioMail AI</span>
        </button>
        <span className="text-[10px] uppercase tracking-widest text-primary">Admin</span>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0814] border-t border-border flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </div>

      {/* Main */}
      <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl tracking-tight" data-testid="admin-page-title">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
