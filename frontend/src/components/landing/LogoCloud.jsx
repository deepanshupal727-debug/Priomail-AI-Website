const LOGOS = [
  "GMAIL", "OUTLOOK", "STRIPE", "SUPABASE", "ONESIGNAL", "VERCEL", "RAILWAY", "GITHUB",
];

export default function LogoCloud() {
  return (
    <section className="py-12 border-y border-border bg-card/30" data-testid="logo-cloud">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <p className="text-xs tracking-[0.25em] uppercase font-bold text-muted-foreground text-center mb-8">
          Trusted by inboxes at fast-moving teams · Built on
        </p>
        <div className="overflow-hidden">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...LOGOS, ...LOGOS, ...LOGOS].map((l, i) => (
              <span
                key={i}
                className="font-display text-2xl md:text-3xl tracking-tighter text-muted-foreground/40 hover:text-foreground transition-colors"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
